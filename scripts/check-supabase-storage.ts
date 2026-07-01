import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });
dotenv.config({ override: true });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ENV ERROR: SUPABASE_URL atau SUPABASE_ANON_KEY tidak ditemukan di .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStorage() {
  console.log('Checking Supabase Storage bucket "uploads"...\n');

  // Cek daftar bucket
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error('Gagal menampilkan daftar bucket:', listError.message);
    process.exit(1);
  }

  const uploadsBucket = buckets?.find((b) => b.name === 'uploads');

  if (!uploadsBucket) {
    console.log('Bucket "uploads" BELUM DIBUAT.');
    console.log('Buat di Supabase Dashboard: Storage → New bucket → Name: uploads → Public: ON');
    process.exit(1);
  }

  console.log('Bucket "uploads" ditemukan:', {
    id: uploadsBucket.id,
    name: uploadsBucket.name,
    public: uploadsBucket.public,
  });

  // Coba upload file dummy (base64 PNG kecil)
  const dummyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGBS3RM3QAAAABJRU5ErkJggg==';
  const buffer = Buffer.from(dummyBase64, 'base64');
  const filePath = `test/check-${Date.now()}.png`;

  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(filePath, buffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    console.error('\nUpload GAGAL:', uploadError.message);
    console.log('Kemungkinan penyebab: RLS policy INSERT belum diaktifkan.');
    console.log('Periksa: Storage → uploads → Policies → harus ada policy INSERT untuk role authenticated.');
    process.exit(1);
  }

  console.log('\nUpload dummy BERHASIL.');

  // Dapatkan public URL
  const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(filePath);
  console.log('Public URL:', publicData.publicUrl);

  // Hapus file dummy
  const { error: removeError } = await supabase.storage.from('uploads').remove([filePath]);
  if (removeError) {
    console.warn('Gagal menghapus file dummy:', removeError.message);
  } else {
    console.log('File dummy berhasil dihapus.');
  }

  console.log('\n=== Storage setup BERHASIL. Upload fitur siap dipakai. ===');
}

checkStorage().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
