import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { readConfig, writeConfig, parseFormEntryIds, findEntryKey } from './src/lib/formHelper';
import { GoogleGenAI } from '@google/genai';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Gemini SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Supabase client (for integration config + CMS)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Google Service Account
const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
  : null;

let driveClient: ReturnType<typeof google.drive> | null = null;
let sheetsClient: ReturnType<typeof google.sheets> | null = null;

if (serviceAccountKey) {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccountKey,
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/forms.body',
      'https://www.googleapis.com/auth/forms.responses.readonly',
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/documents.readonly'
    ]
  });

  driveClient = google.drive({ version: 'v3', auth });
  sheetsClient = google.sheets({ version: 'v4', auth });
}

const DRIVE_ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const INVENTORY_SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/google-integration', async (req, res) => {
    try {
      const config = await readConfig();
      res.json(config);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/google-integration', async (req, res) => {
    try {
      const success = await writeConfig(req.body);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: 'Gagal menyimpan konfigurasi.' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Upload file to Google Drive
  app.post('/api/upload', async (req, res) => {
    try {
      if (!driveClient) {
        return res.status(500).json({ error: 'Google Drive service account belum dikonfigurasi.' });
      }

      const { fileName, mimeType, base64Data, category, subcategory, title, size } = req.body;

      if (!fileName || !mimeType || !base64Data) {
        return res.status(400).json({ error: 'File name, mimeType, dan base64Data wajib diisi.' });
      }

      const buffer = Buffer.from(base64Data, 'base64');

      // Determine folder path
      let parentId = DRIVE_ROOT_FOLDER_ID;
      const folderMap: Record<string, string> = {
        'foto': 'galeri-foto',
        'video': 'galeri-video',
        'pdf': 'dokumen-pdf',
      };

      // Try to find existing subfolder by name, or use root
      if (category && DRIVE_ROOT_FOLDER_ID) {
        const folderName = folderMap[category];
        if (folderName) {
          const query = `name='${folderName}' and '${DRIVE_ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'`;
          const listRes = await driveClient.files.list({ q: query, fields: 'files(id, name)' });
          const folder = listRes.data.files?.[0];
          if (folder) {
            parentId = folder.id;
          }
        }
      }

      const fileMetadata: any = {
        name: fileName,
        parents: parentId ? [parentId] : undefined,
      };

      const media = {
        mimeType,
        body: Buffer.from(buffer),
      };

      const uploadRes = await driveClient.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, name, webViewLink, webContentLink, size, mimeType',
      });

      const uploadedFile = uploadRes.data;

      // Make file accessible via link (if needed, set to anyone with link can read)
      await driveClient.permissions.create({
        fileId: uploadedFile.id!,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      const driveUrl = uploadedFile.webViewLink || uploadedFile.webContentLink || '';

      // Save metadata to Supabase
      if (supabase && process.env.SUPABASE_URL) {
        const { error: dbError } = await (supabase as any)
          .from('drive_files')
          .insert({
            drive_file_id: uploadedFile.id,
            drive_url: driveUrl,
            title: title || fileName,
            category: category || 'other',
            subcategory: subcategory || null,
            file_size: size || `${Math.round(buffer.length / 1024)} KB`,
            mime_type: mimeType,
            uploaded_by: 'admin',
          });

        if (dbError) {
          console.error('Supabase insert error:', dbError);
        }
      }

      // Append row to Google Sheets inventory
      if (sheetsClient && INVENTORY_SPREADSHEET_ID) {
        try {
          await sheetsClient.spreadsheets.values.append({
            spreadsheetId: INVENTORY_SPREADSHEET_ID,
            range: 'Inventory!A:H',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[
                new Date().toISOString(),
                uploadedFile.id,
                driveUrl,
                title || fileName,
                category || 'other',
                subcategory || '',
                size || `${Math.round(buffer.length / 1024)} KB`,
                'admin'
              ]]
            }
          });
        } catch (sheetError) {
          console.error('Sheets append error:', sheetError);
        }
      }

      res.json({
        id: uploadedFile.id,
        name: uploadedFile.name,
        driveUrl,
        size: uploadedFile.size,
        mimeType: uploadedFile.mimeType,
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      res.status(500).json({ error: err.message || 'Gagal mengunggah file.' });
    }
  });

  // Delete file from Google Drive
  app.delete('/api/files/:driveFileId', async (req, res) => {
    try {
      if (!driveClient) {
        return res.status(500).json({ error: 'Google Drive service account belum dikonfigurasi.' });
      }

      const { driveFileId } = req.params;

      await driveClient.files.delete({
        fileId: driveFileId,
      });

      // Soft delete from Supabase
      if (supabase && process.env.SUPABASE_URL) {
        const { error: dbError } = await (supabase as any)
          .from('drive_files')
          .update({ category: 'deleted' })
          .eq('drive_file_id', driveFileId);

        if (dbError) {
          console.error('Supabase update error:', dbError);
        }
      }

      res.json({ success: true });
    } catch (err: any) {
      console.error('Delete error:', err);
      res.status(500).json({ error: err.message || 'Gagal menghapus file.' });
    }
  });

  // Gemini Chat
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { prompt, model = 'gemini-3.5-flash' } = req.body;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: "Anda adalah asisten AI SIBERSAGA (SD Negeri 3 Purwosari). Tugas Anda adalah membantu admin menganalisis konten, merencanakan editan, dan menjawab pertanyaan terkait website.",
        }
      });

      res.json({ response: response.text });
    } catch (error: any) {
      console.error('Error generating chat content:', error);
      res.status(500).json({ error: error.message || 'Terjadi kesalahan saat memproses permintaan AI.' });
    }
  });

  // Gemini Image Generation
  app.post('/api/gemini/generate-image', async (req, res) => {
    try {
      const { prompt, aspectRatio = '1:1', model = 'gemini-3.1-flash-image' } = req.body;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio,
            imageSize: "1K"
          }
        }
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          imageUrl = `data:image/png;base64,${base64EncodeString}`;
          break;
        }
      }

      if (imageUrl) {
        res.json({ imageUrl });
      } else {
        res.status(500).json({ error: 'Gagal membuat gambar. Coba prompt lain.' });
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      res.status(500).json({ error: error.message || 'Terjadi kesalahan saat membuat gambar.' });
    }
  });

  // Submit contact message / public complaint to Google Forms & Sheets
  app.post('/api/submit-complaint', async (req, res) => {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Nama dan pesan wajib diisi.' });
    }

    try {
      const config = await readConfig();

      if (config.isActive && (config.formId || config.formPublicUrl)) {
        console.log(`[Google Integration] Processing submission for form: ${config.formId || config.formPublicUrl}`);

        const targetUrl = config.formPublicUrl || `https://docs.google.com/forms/d/e/${config.formId}/viewform`;

        const entryMap = await parseFormEntryIds(targetUrl);

        const nameKey = findEntryKey(entryMap, ['nama', 'lengkap', 'name', 'fullname']) || 'entry.1000001';
        const phoneKey = findEntryKey(entryMap, ['telp', 'telepon', 'wa', 'hp', 'phone', 'contact']) || 'entry.1000002';
        const emailKey = findEntryKey(entryMap, ['email', 'surel', 'mail']) || 'entry.1000003';
        const subjectKey = findEntryKey(entryMap, ['subjek', 'subject', 'perihal', 'jenis', 'layanan']) || 'entry.1000004';
        const messageKey = findEntryKey(entryMap, ['isi', 'pesan', 'keluhan', 'pengaduan', 'message', 'text']) || 'entry.1000005';

        const formData = new URLSearchParams();
        formData.append(nameKey, name);
        formData.append(phoneKey, phone || '');
        formData.append(emailKey, email || '');
        formData.append(subjectKey, subject || 'Pertanyaan Umum');
        formData.append(messageKey, message);

        const responseUrl = targetUrl.replace(/\/viewform$/, '/formResponse');
        console.log(`[Google Integration] Posting response data to public form action: ${responseUrl}`);

        const submitRes = await fetch(responseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          body: formData.toString()
        });

        console.log(`[Google Integration] Public form response status: ${submitRes.status}`);
        return res.json({ success: true, integrated: true });
      } else {
        console.log('[Google Integration] Integration is inactive or not configured.');
        return res.json({ success: true, integrated: false });
      }
    } catch (err: any) {
      console.error('[Google Integration] Error routing submission:', err);
      return res.json({ success: true, integrated: false, error: err.message });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
