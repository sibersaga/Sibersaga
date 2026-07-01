-- Supabase Storage Bucket Setup
-- Jalankan SQL ini di Supabase SQL Editor, lalu setup Bucket & Policies via Dashboard

-- 1. Buat bucket 'uploads' via Supabase Dashboard:
--    Storage → New bucket → Name: 'uploads' → Public: ON → Confirm

-- 2. Setup RLS Policies untuk bucket 'uploads'
-- (Lakukan via Dashboard: Storage → uploads → Policies → New Policy)

-- Policy untuk SELECT (public read):
-- - Operation: SELECT
-- - Target roles: public
-- - Policy definition: true

-- Policy untuk INSERT (authenticated write):
-- - Operation: INSERT
// - Target roles: authenticated
// - Policy definition: true
