-- 1. Create a table to store curriculum modules
create table if not exists public.modules (
  id text primary key,
  title text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- 2. Create a table to store steps for each module
create table if not exists public.steps (
  id text primary key,
  module_id text not null references public.modules(id) on delete cascade,
  title text not null,
  short_description text,
  concept_explanation text,
  instructions text,
  headers text[] not null default '{}',
  dummy_data jsonb not null default '[]',
  valid_formulas text[] default '{}',
  expected_result text default '',
  result_cell jsonb default null, -- format: {"row": 0, "col": 0}
  hint text default '',
  tasks jsonb default '[]', -- list of tasks for multi-task steps
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Enable RLS for read-only public access to curriculum
alter table public.modules enable row level security;
alter table public.steps enable row level security;

create policy "Allow public read access to modules" on public.modules
  for select using (true);

create policy "Allow public read access to steps" on public.steps
  for select using (true);

-- 3. Example seed script for the "studi-kasus-akbar" module
insert into public.modules (id, title, description, sort_order)
values (
  'studi-kasus-akbar',
  'STUDI KASUS AKBAR: INTEGRASI RUMUS',
  'Ujian integrasi akhir: gabungkan rumus pembersihan teks, logika, pencarian VLOOKUP/HLOOKUP, dan kalkulasi bersyarat dalam satu laporan penggajian terpadu.',
  10
) on conflict (id) do update 
set title = excluded.title, description = excluded.description;

insert into public.steps (
  id,
  module_id,
  title,
  short_description,
  concept_explanation,
  instructions,
  headers,
  dummy_data,
  valid_formulas,
  expected_result,
  result_cell,
  hint,
  tasks,
  sort_order
) values (
  'final-mega-case',
  'studi-kasus-akbar',
  'Laporan Gaji & Evaluasi Terintegrasi',
  'Selesaikan lembar kerja penggajian karyawan bulanan yang memerlukan pembersihan teks, VLOOKUP, HLOOKUP, SUM, Nested IF, dan COUNTIF.',
  'Sebagai Manajer HR & Payroll, Anda menerima draf laporan yang berantakan...',
  'Lengkapi tabel Laporan Gaji di sebelah kanan. Selesaikan 20 sel bertanda tanya...',
  array['', 'ID Karyawan', 'Nama Kotor', 'Golongan', 'Nama Bersih', 'Dept Code', 'Gaji Pokok', 'Tunjangan', 'Total Gaji', 'Status Gaji'],
  '[
    {"rowNum": 1, "cells": [{"value": "ID Karyawan", "header": true, "borderTop": true, "borderLeft": true, "borderBottom": true, "bgColor": "bg-blue-50"}, ...]},
    {"rowNum": 2, "cells": [{"value": "EMP-ADM-01", "borderLeft": true}, {"value": "  rudi WIDODO "}, ...]}
  ]'::jsonb,
  '[]'::text[],
  '',
  '{"row": 0, "col": 0}'::jsonb,
  '',
  '[
    {"label": "Nama Bersih Rudi", "resultCell": {"row": 1, "col": 3}, "validFormulas": ["=PROPER(TRIM(B2))"], "expectedResult": "Rudi Widodo", "hint": "..."}
  ]'::jsonb,
  1
) on conflict (id) do update
set title = excluded.title, dummy_data = excluded.dummy_data, tasks = excluded.tasks;
