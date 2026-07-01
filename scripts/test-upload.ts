import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ENV ERROR: SUPABASE_URL atau SUPABASE_ANON_KEY tidak ditemukan di .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpload() {
  console.log('Mencoba upload file dummy langsung ke bucket "uploads"...');
  
  const dummyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGBS3RM3QAAAABJRU5ErkJggg==';
  const buffer = Buffer.from(dummyBase64, 'base64');
  const filePath = `test/direct-upload-${Date.now()}.png`;

  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(filePath, buffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    console.error('\nUpload GAGAL:', uploadError.message);
    process.exit(1);
  }

  console.log('\nUpload dummy BERHASIL.');
  
  const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(filePath);
  console.log('Public URL:', publicData.publicUrl);
  
  console.log('\nSetup berhasil! Anda sudah bisa mengunggah file.');
}

testUpload();
