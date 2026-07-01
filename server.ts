import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });
dotenv.config({ override: true });

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { readConfig, writeConfig, parseFormEntryIds, findEntryKey } from './src/lib/formHelper';
import { GoogleGenAI } from '@google/genai';
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

// Google Service Account (tidak dipakai untuk storage lagi, hanya untuk integrasi lain jika perlu)
const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
  : null;

const DRIVE_ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const INVENTORY_SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';

async function startServer() {
  const app = express();
  const DEFAULT_PORT = Number(process.env.PORT ?? 3000);
  const PORTS_TO_TRY = [DEFAULT_PORT, 3001, 3002, 3003];

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

  app.post('/api/upload', async (req, res) => {
    try {
      if (!supabase) {
        return res.status(500).json({ error: 'Supabase belum dikonfigurasi.' });
      }

      const { fileName, mimeType, base64Data, category, subcategory, title, size } = req.body;

      if (!fileName || !mimeType || !base64Data) {
        return res.status(400).json({ error: 'File name, mimeType, dan base64Data wajib diisi.' });
      }

      const buffer = Buffer.from(base64Data, 'base64');
      const filePath = `${category || 'other'}/${Date.now()}_${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (uploadError) {
        console.error('Supabase upload error:', {
          message: uploadError.message,
          status: uploadError.statusCode,
          stack: uploadError.stack,
        });
        return res.status(500).json({ error: 'Gagal mengunggah file ke Supabase Storage.' });
      }

      const { data: publicData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      const driveUrl = publicData.publicUrl;

      if (supabase && process.env.SUPABASE_URL) {
        const { error: dbError } = await (supabase as any)
          .from('drive_files')
          .insert({
            drive_file_id: filePath,
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

      res.json({
        id: filePath,
        name: fileName,
        driveUrl,
        size: `${Math.round(buffer.length / 1024)} KB`,
        mimeType,
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      res.status(500).json({ error: err.message || 'Gagal mengunggak file.' });
    }
  });

  app.delete('/api/files/:fileId', async (req, res) => {
    try {
      if (!supabase) {
        return res.status(500).json({ error: 'Supabase belum dikonfigurasi.' });
      }

      const { fileId } = req.params;

      const { error: storageError } = await supabase.storage
        .from('uploads')
        .remove([fileId]);

      if (storageError) {
        console.error('Supabase storage delete error:', storageError);
      }

      const { error: dbError } = await (supabase as any)
        .from('drive_files')
        .update({ category: 'deleted' })
        .eq('drive_file_id', fileId);

      if (dbError) {
        console.error('Supabase update error:', dbError);
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

  const tryListen = async (port: number) => {
    await new Promise<void>((resolve, reject) => {
      const server = app.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
        resolve();
      });
      server.on('error', reject);
    });
  };

  for (const port of PORTS_TO_TRY) {
    try {
      await tryListen(port);
      break;
    } catch (err: any) {
      if (err?.code === 'EADDRINUSE') {
        console.warn(`Port ${port} already in use, trying next port...`);
        continue;
      }
      throw err;
    }
  }
}

startServer();
