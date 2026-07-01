import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
  : null;

const DRIVE_ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const USE_SHARED_DRIVE = process.env.USE_SHARED_DRIVE === 'true';

if (!serviceAccountKey) {
  console.error('GOOGLE_SERVICE_ACCOUNT_JSON belum diisi di .env.local');
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: ['https://www.googleapis.com/auth/drive']
});

const drive = google.drive({ version: 'v3', auth });

const FOLDERS_TO_CREATE = [
  'galeri-foto',
  'galeri-video',
  'dokumen-pdf',
  'berita-gambar',
  'fasilitas-gambar',
  'prestasi-gambar',
  'inovasi-gambar',
];

const COMMON_PARAMS = {
  supportsAllDrives: true,
  // ignoreDefaultVisibility diabaikan agar folder bisa diakses via link
};

async function setupDriveFolders() {
  console.log('Setting up Google Drive folders...\n');

  let parentId = DRIVE_ROOT_FOLDER_ID;

  // Jika tidak pakai Shared Drive atau ID kosong, buat root folder di My Drive
  if (!USE_SHARED_DRIVE || !parentId) {
    console.log('Mode: My Drive (Service Account) — tidak perlu Shared Drive.\n');
    const rootRes = await drive.files.create({
      ...COMMON_PARAMS,
      requestBody: {
        name: 'SDN 3 Purwosari',
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id, name, webViewLink',
    });
    const rootFolder = rootRes.data;
    parentId = rootFolder.id!;
    console.log(`Root folder created: ${rootFolder.name}`);
    console.log(`  ID: ${parentId}`);
    console.log(`  URL: ${rootFolder.webViewLink}\n`);
    console.log(`==> Copy ID berikut ke .env.local:\nGOOGLE_DRIVE_FOLDER_ID=${parentId}\n`);
  } else {
    console.log(`Menggunakan Shared Drive / folder yang sudah ada: ${parentId}\n`);
  }

  // Buat subfolder
  for (const folderName of FOLDERS_TO_CREATE) {
    // Cek apakah sudah ada (tambahkan includeItemsFromAllDrives untuk Shared Drive)
    const listRes = await drive.files.list({
      ...COMMON_PARAMS,
      includeItemsFromAllDrives: true,
      q: `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    });

    if (listRes.data.files && listRes.data.files.length > 0) {
      console.log(`  [SUDAH ADA] ${folderName}`);
      continue;
    }

    const createRes = await drive.files.create({
      ...COMMON_PARAMS,
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
      },
      fields: 'id, name, webViewLink',
    });

    const folder = createRes.data;
    console.log(`  [DIBUAT] ${folder.name}  (ID: ${folder.id})`);
  }

  console.log('\nSelesai! Folder structure sudah siap.');
  console.log('\nLangkah selanjutnya:');
  console.log('1. Paste GOOGLE_DRIVE_FOLDER_ID ke .env.local (jika baru dibuat)');
  console.log('2. Buat Spreadsheet Inventory (sheet bernama "Inventory" dengan header)');
  console.log('3. Ambil Spreadsheet ID, paste ke .env.local sebagai GOOGLE_SHEETS_SPREADSHEET_ID');
  console.log('4. Restart dev server: npm run dev');
  console.log('5. Login admin → coba upload di Galeri / Dokumen');
}

setupDriveFolders().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
