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

-- Drop existing policies if they exist to avoid duplicate errors
drop policy if exists "Allow public read access to modules" on public.modules;
drop policy if exists "Allow public read access to steps" on public.steps;

create policy "Allow public read access to modules" on public.modules
  for select using (true);

create policy "Allow public read access to steps" on public.steps
  for select using (true);

-- 3. Seed script for the "studi-kasus-akbar" module
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
  'Sebagai Manajer HR & Payroll, Anda menerima draf laporan yang berantakan. Anda harus menyelesaikan laporan ini dengan menggunakan kombinasi berbagai rumus:

1. **Nama Bersih (Kolom D)**: Gabungkan `PROPER` dan `TRIM` untuk membersihkan spasi berlebih dan merapikan huruf kapital.
   *Syntax*: `=PROPER(TRIM(B2))`
2. **Kode Dept (Kolom E)**: Ambil kode departemen (3 karakter tengah) dari ID Karyawan.
   *Syntax*: `=MID(A2,5,3)`
3. **Gaji Pokok (Kolom F)**: Gunakan fungsi **`VLOOKUP`** untuk mencari Gaji Pokok berdasarkan Golongan karyawan dari **Tabel Ref Golongan (A7:B8)**.
   *Syntax*: `=VLOOKUP(C2,$A$7:$B$8,2,0)` atau `=VLOOKUP(C2,A7:B8,2,0)`
4. **Tunjangan Jabatan (Kolom G)**: Gunakan fungsi **`HLOOKUP`** untuk mencari Tunjangan berdasarkan Kode Dept dari **Tabel Ref Departemen (A10:D11)**.
   *Syntax*: `=HLOOKUP(E2,$A$10:$D$11,2,0)` atau `=HLOOKUP(E2,A10:D11,2,0)`
5. **Total Gaji (Kolom H)**: Jumlahkan Gaji Pokok and Tunjangan Status.
   *Syntax*: `=SUM(F2,G2)` atau `=F2+G2`
6. **Status Gaji (Kolom I)**: Evaluasi status tingkat gaji dengan **Nested IF** berdasarkan Total Gaji (Kolom H). Jika Total Gaji >= 7500 maka "Tinggi", jika >= 5500 maka "Sedang", dan jika kurang dari 5500 maka "Rendah".
   *Syntax*: `=IF(H2>=7500,"Tinggi",IF(H2>=5500,"Sedang","Rendah"))` atau `=IF(H2>=7500;"Tinggi";IF(H2>=5500;"Sedang";"Rendah"))`
7. **Total Pengeluaran Gaji (H12)**: Hitung total pengeluaran seluruh gaji karyawan menggunakan `SUM`.
   *Syntax*: `=SUM(H2:H4)`
8. **Jumlah Karyawan Golongan I (H13)**: Hitung jumlah karyawan dengan Golongan "I" menggunakan `COUNTIF`.
   *Syntax*: `=COUNTIF(C2:C4,"I")`',
  'Lengkapi tabel Laporan Gaji di sebelah kanan. Selesaikan 20 sel bertanda tanya (`?`) menggunakan rumus yang telah dipelajari. Gunakan Tabel Referensi di bagian bawah sebagai acuan lookup Anda!',
  array['', 'ID Karyawan', 'Nama Kotor', 'Golongan', 'Nama Bersih', 'Dept Code', 'Gaji Pokok', 'Tunjangan', 'Total Gaji', 'Status Gaji'],
  '[{"rowNum":1,"cells":[{"value":"ID Karyawan","header":true,"borderTop":true,"borderLeft":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Nama Kotor","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Golongan","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Nama Bersih","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Dept Code","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Gaji Pokok","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Tunjangan","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Total Gaji","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Status Gaji","header":true,"borderTop":true,"borderRight":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"}]},{"rowNum":2,"cells":[{"value":"EMP-ADM-01","borderLeft":true},{"value":"  rudi WIDODO "},{"value":"I"},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true,"borderRight":true}]},{"rowNum":3,"cells":[{"value":"EMP-DEV-02","borderLeft":true},{"value":" dewi LESTARI  "},{"value":"II"},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true,"borderRight":true}]},{"rowNum":4,"cells":[{"value":"EMP-FIN-03","borderLeft":true,"borderBottom":true},{"value":" andi WIRAWAN ","borderBottom":true},{"value":"I","borderBottom":true},{"value":"?","highlight":true,"borderBottom":true},{"value":"?","highlight":true,"borderBottom":true},{"value":"?","highlight":true,"borderBottom":true},{"value":"?","highlight":true,"borderBottom":true},{"value":"?","highlight":true,"borderBottom":true},{"value":"?","highlight":true,"borderRight":true,"borderBottom":true}]},{"rowNum":5,"cells":[{"value":"=== REFERENSI GOLONGAN (VLOOKUP) ===","className":"font-bold text-slate-700 dark:text-slate-200 text-xs overflow-visible whitespace-nowrap z-10 px-4","borderTop":true,"borderLeft":true,"borderBottom":true,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderRight":true,"borderBottom":true,"borderLeft":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"}]},{"rowNum":6,"cells":[{"value":"Golongan","header":true,"borderTop":true,"borderLeft":true,"borderBottom":true,"bgColor":"bg-sky-50 dark:bg-sky-950/40"},{"value":"Gaji Pokok","header":true,"borderTop":true,"borderRight":true,"borderBottom":true,"bgColor":"bg-sky-50 dark:bg-sky-950/40"},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""}]},{"rowNum":7,"cells":[{"value":"I","borderLeft":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":5000,"borderRight":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""}]},{"rowNum":8,"cells":[{"value":"II","borderLeft":true,"borderBottom":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":7000,"borderRight":true,"borderBottom":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""}]},{"rowNum":9,"cells":[{"value":"=== REFERENSI TUNJANGAN DEPT (HLOOKUP) ===","className":"font-bold text-slate-700 dark:text-slate-200 text-xs overflow-visible whitespace-nowrap z-10 px-4","borderTop":true,"borderLeft":true,"borderBottom":true,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderRight":true,"borderBottom":true,"borderLeft":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"}]},{"rowNum":10,"cells":[{"value":"Dept Code","header":true,"borderTop":true,"borderLeft":true,"borderBottom":true,"bgColor":"bg-sky-50 dark:bg-sky-950/40"},{"value":"ADM","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-sky-50 dark:bg-sky-950/40"},{"value":"DEV","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-sky-50 dark:bg-sky-950/40"},{"value":"FIN","header":true,"borderTop":true,"borderRight":true,"borderBottom":true,"bgColor":"bg-sky-50 dark:bg-sky-950/40"},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""}]},{"rowNum":11,"cells":[{"value":"Tunjangan","borderLeft":true,"borderBottom":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":600,"borderBottom":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":1000,"borderBottom":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":800,"borderRight":true,"borderBottom":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""}]},{"rowNum":12,"cells":[{"value":"Total Pengeluaran Gaji","borderLeft":true,"borderTop":true,"borderBottom":true,"className":"font-semibold text-xs","bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"?","highlight":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderRight":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"}]},{"rowNum":13,"cells":[{"value":"Jumlah Karyawan Golongan I","borderLeft":true,"borderBottom":true,"className":"font-semibold text-xs","bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"?","highlight":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderRight":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row": 0, "col": 0}'::jsonb,
  '',
  '[{"label":"Nama Bersih Rudi","resultCell":{"row":1,"col":3},"validFormulas":["=PROPER(TRIM(B2))"],"expectedResult":"Rudi Widodo","hint":"Bersihkan spasi & kapitalisasi B2: =PROPER(TRIM(B2))"},{"label":"Kode Dept Rudi","resultCell":{"row":1,"col":4},"validFormulas":["=MID(A2,5,3)"],"expectedResult":"ADM","hint":"Ambil 3 karakter mulai posisi ke-5 dari A2: =MID(A2,5,3)"},{"label":"Gaji Pokok Rudi (VLOOKUP)","resultCell":{"row":1,"col":5},"validFormulas":["=VLOOKUP(C2,$A$7:$B$8,2,0)","=VLOOKUP(C2,$A$7:$B$8,2,FALSE)","=VLOOKUP(C2,A7:B8,2,0)","=VLOOKUP(C2,A7:B8,2,FALSE)"],"expectedResult":"5,000","hint":"Cari Golongan (C2) pada Tabel Ref Golongan (A7:B8): =VLOOKUP(C2,$A$7:$B$8,2,0)"},{"label":"Tunjangan Rudi (HLOOKUP)","resultCell":{"row":1,"col":6},"validFormulas":["=HLOOKUP(E2,$A$10:$D$11,2,0)","=HLOOKUP(E2,$A$10:$D$11,2,FALSE)","=HLOOKUP(E2,A10:D11,2,0)","=HLOOKUP(E2,A10:D11,2,FALSE)"],"expectedResult":"600","hint":"Cari Kode Dept (E2) pada Tabel Ref Tunjangan (A10:D11): =HLOOKUP(E2,$A$10:$D$11,2,0)"},{"label":"Total Gaji Rudi","resultCell":{"row":1,"col":7},"validFormulas":["=SUM(F2,G2)","=F2+G2","=SUM(F2;G2)"],"expectedResult":"5,600","hint":"Jumlahkan Gaji Pokok (F2) + Tunjangan (G2): =SUM(F2,G2)"},{"label":"Status Gaji Rudi","resultCell":{"row":1,"col":8},"validFormulas":["=IF(H2>=7500,\"Tinggi\",IF(H2>=5500,\"Sedang\",\"Rendah\"))","=IF(H2>=7500, \"Tinggi\", IF(H2>=5500, \"Sedang\", \"Rendah\"))","=IF(H2>=7500;\"Tinggi\";IF(H2>=5500;\"Sedang\";\"Rendah\"))","=IF(H2>=7500; \"Tinggi\"; IF(H2>=5500; \"Sedang\"; \"Rendah\"))"],"expectedResult":"Sedang","hint":"Evaluasi status gaji Rudi (H2) dengan Nested IF (>=7500 \"Tinggi\", >=5500 \"Sedang\", <5500 \"Rendah\"): =IF(H2>=7500,\"Tinggi\",IF(H2>=5500,\"Sedang\",\"Rendah\"))"},{"label":"Nama Bersih Dewi","resultCell":{"row":2,"col":3},"validFormulas":["=PROPER(TRIM(B3))"],"expectedResult":"Dewi Lestari","hint":"Bersihkan spasi & kapitalisasi B3: =PROPER(TRIM(B3))"},{"label":"Kode Dept Dewi","resultCell":{"row":2,"col":4},"validFormulas":["=MID(A3,5,3)"],"expectedResult":"DEV","hint":"Ambil 3 karakter mulai posisi ke-5 dari A3: =MID(A3,5,3)"},{"label":"Gaji Pokok Dewi (VLOOKUP)","resultCell":{"row":2,"col":5},"validFormulas":["=VLOOKUP(C3,$A$7:$B$8,2,0)","=VLOOKUP(C3,$A$7:$B$8,2,FALSE)","=VLOOKUP(C3,A7:B8,2,0)","=VLOOKUP(C3,A7:B8,2,FALSE)"],"expectedResult":"7,000","hint":"Cari Golongan (C3) pada Tabel Ref Golongan (A7:B8): =VLOOKUP(C3,$A$7:$B$8,2,0)"},{"label":"Tunjangan Dewi (HLOOKUP)","resultCell":{"row":2,"col":6},"validFormulas":["=HLOOKUP(E3,$A$10:$D$11,2,0)","=HLOOKUP(E3,$A$10:$D$11,2,FALSE)","=HLOOKUP(E3,A10:D11,2,0)","=HLOOKUP(E3,A10:D11,2,FALSE)"],"expectedResult":"1,000","hint":"Cari Kode Dept (E3) pada Tabel Ref Tunjangan (A10:D11): =HLOOKUP(E3,$A$10:$D$11,2,0)"},{"label":"Total Gaji Dewi","resultCell":{"row":2,"col":7},"validFormulas":["=SUM(F3,G3)","=F3+G3","=SUM(F3;G3)"],"expectedResult":"8,000","hint":"Jumlahkan Gaji Pokok (F3) + Tunjangan (G3): =SUM(F3,G3)"},{"label":"Status Gaji Dewi","resultCell":{"row":2,"col":8},"validFormulas":["=IF(H3>=7500,\"Tinggi\",IF(H3>=5500,\"Sedang\",\"Rendah\"))","=IF(H3>=7500, \"Tinggi\", IF(H3>=5500, \"Sedang\", \"Rendah\"))","=IF(H3>=7500;\"Tinggi\";IF(H3>=5500;\"Sedang\";\"Rendah\"))","=IF(H3>=7500; \"Tinggi\"; IF(H3>=5500; \"Sedang\"; \"Rendah\"))"],"expectedResult":"Tinggi","hint":"Evaluasi status gaji Dewi (H3) dengan Nested IF (>=7500 \"Tinggi\", >=5500 \"Sedang\", <5500 \"Rendah\"): =IF(H3>=7500,\"Tinggi\",IF(H3>=5500,\"Sedang\",\"Rendah\"))"},{"label":"Nama Bersih Andi","resultCell":{"row":3,"col":3},"validFormulas":["=PROPER(TRIM(B4))"],"expectedResult":"Andi Wirawan","hint":"Bersihkan spasi & kapitalisasi B4: =PROPER(TRIM(B4))"},{"label":"Kode Dept Andi","resultCell":{"row":3,"col":4},"validFormulas":["=MID(A4,5,3)"],"expectedResult":"FIN","hint":"Ambil 3 karakter mulai posisi ke-5 dari A4: =MID(A4,5,3)"},{"label":"Gaji Pokok Andi (VLOOKUP)","resultCell":{"row":3,"col":5},"validFormulas":["=VLOOKUP(C4,$A$7:$B$8,2,0)","=VLOOKUP(C4,$A$7:$B$8,2,FALSE)","=VLOOKUP(C4,A7:B8,2,0)","=VLOOKUP(C4,A7:B8,2,FALSE)"],"expectedResult":"5,000","hint":"Cari Golongan (C4) pada Tabel Ref Golongan (A7:B8): =VLOOKUP(C4,$A$7:$B$8,2,0)"},{"label":"Tunjangan Andi (HLOOKUP)","resultCell":{"row":3,"col":6},"validFormulas":["=HLOOKUP(E4,$A$10:$D$11,2,0)","=HLOOKUP(E4,$A$10:$D$11,2,FALSE)","=HLOOKUP(E4,A10:D11,2,0)","=HLOOKUP(E4,A10:D11,2,FALSE)"],"expectedResult":"800","hint":"Cari Kode Dept (E4) pada Tabel Ref Tunjangan (A10:D11): =HLOOKUP(E4,$A$10:$D$11,2,0)"},{"label":"Total Gaji Andi","resultCell":{"row":3,"col":7},"validFormulas":["=SUM(F4,G4)","=F4+G4","=SUM(F4;G4)"],"expectedResult":"5,800","hint":"Jumlahkan Gaji Pokok (F4) + Tunjangan (G4): =SUM(F4,G4)"},{"label":"Status Gaji Andi","resultCell":{"row":3,"col":8},"validFormulas":["=IF(H4>=7500,\"Tinggi\",IF(H4>=5500,\"Sedang\",\"Rendah\"))","=IF(H4>=7500, \"Tinggi\", IF(H4>=5500, \"Sedang\", \"Rendah\"))","=IF(H4>=7500;\"Tinggi\";IF(H4>=5500;\"Sedang\";\"Rendah\"))","=IF(H4>=7500; \"Tinggi\"; IF(H4>=5500; \"Sedang\"; \"Rendah\"))"],"expectedResult":"Sedang","hint":"Evaluasi status gaji Andi (H4) dengan Nested IF (>=7500 \"Tinggi\", >=5500 \"Sedang\", <5500 \"Rendah\"): =IF(H4>=7500,\"Tinggi\",IF(H4>=5500,\"Sedang\",\"Rendah\"))"},{"label":"Total Pengeluaran Gaji (SUM)","resultCell":{"row":11,"col":7},"validFormulas":["=SUM(H2:H4)"],"expectedResult":"19,400","hint":"Jumlahkan total pengeluaran gaji: =SUM(H2:H4)"},{"label":"Jumlah Karyawan Golongan I (COUNTIF)","resultCell":{"row":12,"col":7},"validFormulas":["=COUNTIF(C2:C4,\"I\")","=COUNTIF(C2:C4;\"I\")"],"expectedResult":"2","hint":"Hitung Golongan (C2:C4) yang bernilai \"I\": =COUNTIF(C2:C4,\"I\")"}]'::jsonb,
  1
) on conflict (id) do update
set title = excluded.title, dummy_data = excluded.dummy_data, tasks = excluded.tasks;
