# 🦎 Lizard — Supabase & AI Setup

Follow these steps to enable the **Patch Uploader** and **AI Metadata Extraction**.

---

## 1. Supabase Cloud Configuration

Log in to your [Supabase Dashboard](https://supabase.com/dashboard), select your project, and open the **SQL Editor**.

### Run this SQL:
```sql
-- ==========================================
-- 1. STORAGE: Create the 'patches' bucket
-- ==========================================
insert into storage.buckets (id, name, public)
values ('patches', 'patches', true)
on conflict do nothing;

-- Set up Storage Policies
create policy "Public Access" on storage.objects for select using ( bucket_id = 'patches' );
create policy "Public Upload" on storage.objects for insert with check ( bucket_id = 'patches' );

-- ==========================================
-- 2. DATABASE: Create the 'patches' table
-- ==========================================
create table if not exists public.patches (
  id uuid default gen_random_uuid() primary key,
  image_path text not null,
  image_url text not null,
  description text not null default '',
  metadata jsonb,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.patches enable row level security;

-- Set up Database Policies
create policy "Public read" on public.patches for select using (true);
create policy "Anon insert" on public.patches for insert with check (true);
create policy "Anon update" on public.patches for update using (true);
```

---

## 2. Environment Variables (.env)

Ensure your `.env` file in the project root looks like this:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key

# Found in Settings -> API -> service_role (secret)
SUPABASE_SERVICE_ROLE_KEY=your_secret_service_role_key
```

---

## 3. How to Test

1.  **Start the app**: `npm run dev`
2.  **Open the uploader**: [http://localhost:3000/mini-patch/upload/](http://localhost:3000/mini-patch/upload/)
3.  **Upload an image** and add a description (e.g., in Russian).
4.  **Verify**: Check your Supabase **Storage** (patches bucket) and **Table Editor** (patches table) to see the stored image and AI-extracted metadata.

---

## ⚠️ Known Issues / Troubleshooting
- **404 on Upload**: Make sure the URL in your browser matches the base path. 
- **Upload Failed**: Check the server terminal logs for "Supabase server-side environment variables are missing!"
