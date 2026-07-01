import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { google } from 'googleapis';

const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
  : null;

const DRIVE_ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

if (!serviceAccountKey || !DRIVE_ROOT_FOLDER_ID) {
  console.error('GOOGLE_SERVICE_ACCOUNT_JSON atau GOOGLE_DRIVE_FOLDER_ID tidak ditemukan.');
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: ['https://www.googleapis.com/auth/drive']
});

const drive = google.drive({ version: 'v3', auth });

async function renameFolder() {
  console.log('Renaming folder ID ' + DRIVE_ROOT_FOLDER_ID + ' to "WebSibersaga"...');

  const res = await drive.files.update({
    fileId: DRIVE_ROOT_FOLDER_ID,
    requestBody: { name: 'WebSibersaga' },
    fields: 'id, name, webViewLink',
  });

  const folder = res.data;
  console.log('Selesai!');
  console.log('  Nama: ' + folder.name);
  console.log('  ID: ' + folder.id);
  console.log('  URL: ' + folder.webViewLink);
}

renameFolder().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
