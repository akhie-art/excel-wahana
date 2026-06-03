-- 1. Pastikan ekstensi pgcrypto sudah aktif untuk mengenkripsi password
create extension if not exists pgcrypto;

-- 2. Definisikan UUID khusus untuk akun Instruktur agar dapat dilacak dengan mudah
do $$
declare
  instructor_id uuid := 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
  instructor_email text := 'instruktur@excel.com';
  instructor_password text := 'instruktur123';
begin
  -- 3. Memasukkan user ke dalam tabel internal auth.users milik Supabase
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    instructor_id,
    'authenticated',
    'authenticated',
    instructor_email,
    crypt(instructor_password, gen_salt('bf')), -- Enkripsi password menggunakan bcrypt (Blowfish)
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"name": "Pak Guru Instruktur"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) on conflict (id) do nothing;

  -- 4. Hubungkan user baru tersebut dengan profil progres dan ubah perannya menjadi 'instruktur'
  insert into public.user_progress (
    user_id,
    current_module_id,
    current_step_id,
    completed_steps,
    streak_count,
    role
  ) values (
    instructor_id,
    'basics',
    'sum-basics',
    '{}',
    0,
    'instruktur'
  )
  on conflict (user_id) do update 
  set role = 'instruktur';

  raise notice 'Akun Instruktur berhasil dibuat: % dengan password: %', instructor_email, instructor_password;
end $$;
