-- Supabase SQL Migration for WebSibersaga
-- Run this in your Supabase project SQL Editor

-- CMS Content (replaces localStorage)
create table if not exists public.cms_content (
  id text primary key,
  content_type text not null unique,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table public.cms_content enable row level security;

create policy "Allow public read access" on public.cms_content
  for select using (true);

create policy "Allow public insert access" on public.cms_content
  for insert with check (true);

create policy "Allow public update access" on public.cms_content
  for update using (true);

create policy "Allow public delete access" on public.cms_content
  for delete using (true);

-- Drive files metadata
create table if not exists public.drive_files (
  id serial primary key,
  drive_file_id text unique not null,
  drive_url text not null,
  title text,
  category text,
  subcategory text,
  file_size text,
  mime_type text,
  uploaded_by text,
  created_at timestamptz default now()
);

alter table public.drive_files enable row level security;

create policy "Allow public read access" on public.drive_files
  for select using (true);

create policy "Allow public insert access" on public.drive_files
  for insert with check (true);

create policy "Allow public update access" on public.drive_files
  for update using (true);

-- Integration config
create table if not exists public.integration_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table public.integration_config enable row level security;

create policy "Allow public read access" on public.integration_config
  for select using (true);

create policy "Allow public insert access" on public.integration_config
  for insert with check (true);

create policy "Allow public update access" on public.integration_config
  for update using (true);

-- Form submissions
create table if not exists public.form_submissions (
  id serial primary key,
  name text,
  phone text,
  email text,
  subject text,
  message text,
  integrated boolean default false,
  created_at timestamptz default now()
);

alter table public.form_submissions enable row level security;

create policy "Allow public read access" on public.form_submissions
  for select using (true);

create policy "Allow public insert access" on public.form_submissions
  for insert with check (true);
