import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { google } from 'googleapis';

const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
  : null;

if (!serviceAccountKey) {
  console.error('GOOGLE_SERVICE_ACCOUNT_JSON tidak ditemukan di .env.local');
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

async function setupInventorySheet() {
  console.log('Membuat Spreadsheet Inventory...\n');

  const createRes = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: 'Inventory Media SDN 3 Purwosari',
      },
      sheets: [
        {
          properties: {
            title: 'Inventory',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    },
    fields: 'spreadsheetId',
  });

  const spreadsheetId = createRes.data.spreadsheetId!;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  console.log(`Spreadsheet dibuat:`);
  console.log(`  ID: ${spreadsheetId}`);
  console.log(`  URL: ${spreadsheetUrl}\n`);

  const header = [
    ['Timestamp Upload', 'File ID', 'Drive URL', 'Judul/Keterangan', 'Kategori', 'Sub-kategori', 'Ukuran File', 'Uploaded By']
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Inventory!A1:H1',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: header,
    },
  });

  console.log('Header berhasil ditulis.\n');
  console.log('=============================================');
  console.log('==> Copy ID berikut ke .env.local:          ');
  console.log('=============================================');
  console.log(`GOOGLE_SHEETS_SPREADSHEET_ID=${spreadsheetId}`);
  console.log('=============================================\n');
}

setupInventorySheet().catch((err) => {
  console.error('Error:', err.message);
  if ((err as any).response?.data) {
    console.error('Detail:', JSON.stringify((err as any).response.data, null, 2));
  }
  process.exit(1);
});
