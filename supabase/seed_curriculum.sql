-- Drop existing policies if they exist to avoid duplicate errors
drop policy if exists "Allow public read access to modules" on public.modules;
drop policy if exists "Allow public read access to steps" on public.steps;

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


-- 3. Seed modules
insert into public.modules (id, title, description, sort_order)
values (
  'hitung-data',
  'RUMUS UNTUK MENGHITUNG DATA',
  'Kumpulan fungsi dasar matematika untuk menjumlahkan, merata-rata, mencari ekstrem, dan menghitung data.',
  0
) on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.modules (id, title, description, sort_order)
values (
  'bulat-data',
  'RUMUS UNTUK MEMBULATKAN DATA',
  'Fungsi untuk membulatkan angka pecahan desimal atau membuat kelipatan numerik teratur.',
  10
) on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.modules (id, title, description, sort_order)
values (
  'rapih-data',
  'RUMUS UNTUK MERAPIKAN DATA',
  'Fungsi untuk membersihkan spasi ganda, menggabungkan kalimat, serta menyeragamkan huruf kapital.',
  20
) on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.modules (id, title, description, sort_order)
values (
  'ekstrak-data',
  'RUMUS UNTUK MENGEKSTRAK DATA',
  'Fungsi memotong huruf di sebelah kiri, tengah, kanan sel, serta menghitung panjang karakter.',
  30
) on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.modules (id, title, description, sort_order)
values (
  'cari-data',
  'RUMUS UNTUK MENCARI DATA',
  'Fungsi pencarian vertikal (VLOOKUP), horizontal (HLOOKUP), indeks baris-kolom (INDEX & MATCH).',
  40
) on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.modules (id, title, description, sort_order)
values (
  'kriteria-data',
  'RUMUS UNTUK MENGHITUNG DATA DENGAN KRITERIA',
  'Fungsi kalkulasi bersyarat tunggal atau banyak: SUMIF/SUMIFS, COUNTIF/COUNTIFS, dll.',
  50
) on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.modules (id, title, description, sort_order)
values (
  'waktu-data',
  'RUMUS UNTUK MENGOLAH DATA BERBENTUK WAKTU',
  'Kumpulan fungsi lengkap untuk mengelola tanggal, hari, bulan, jam, menit, serta selisih hari kerja.',
  60
) on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.modules (id, title, description, sort_order)
values (
  'uji-pernyataan',
  'RUMUS UNTUK MENGUJI PERNYATAAN',
  'Fungsi keputusan logika untuk menguji kondisi benar/salah: IF, AND, OR, dan IFERROR.',
  70
) on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.modules (id, title, description, sort_order)
values (
  'statistik-data',
  'RUMUS UNTUK MENGOLAH DATA STATISTIK',
  'Fungsi matematika dan statistik harian seperti pemeringkatan, modus, absolut, hingga angka Romawi.',
  80
) on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.modules (id, title, description, sort_order)
values (
  'bonus-rumus',
  'BONUS RUMUS',
  'Mempelajari XLOOKUP, fungsi pencarian data modern yang jauh lebih fleksibel dari VLOOKUP.',
  90
) on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.modules (id, title, description, sort_order)
values (
  'studi-kasus-akbar',
  'STUDI KASUS AKBAR: INTEGRASI RUMUS',
  'Ujian integrasi akhir: gabungkan rumus pembersihan teks, logika, pencarian VLOOKUP/HLOOKUP, dan kalkulasi bersyarat dalam satu laporan penggajian terpadu.',
  100
) on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;


-- 4. Seed steps
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
  'sum',
  'hitung-data',
  'Sum (menjumlahkan data)',
  'Fungsi untuk menjumlahkan sekumpulan angka di dalam sel.',
  'Fungsi `SUM` digunakan untuk menjumlahkan nilai sel secara cepat. Cara penulisannya: `=SUM(SelAwal:SelAkhir)`. Tanda titik dua (`:`) melambangkan rentang.

Kita akan belajar di tabel **Laporan Kas Toko ATK** yang sama dan terus berkembang di setiap langkah pelajaran. Mulai dari yang sederhana — menghitung total belanja — sampai ke laporan analitik yang komprehensif.',
  'Lihat tabel Laporan Kas Toko ATK di sebelah kanan. Kolom **D (Total Belanja)** tiap barang sudah terisi. Tugas kamu: hitung **Total Seluruhnya** di sel **D5** menggunakan `=SUM(D2:D4)`. Klik dua kali sel **D5** lalu ketik rumusnya, tekan **Enter** untuk memeriksa.',
  array['', 'Nama Barang', 'Jumlah Unit', 'Harga Satuan', 'Total Belanja']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Barang","header":true},{"value":"Jumlah Unit","header":true},{"value":"Harga Satuan","header":true},{"value":"Total Belanja","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop"},{"value":2},{"value":8000},{"value":16000,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Mouse"},{"value":10},{"value":150},{"value":1500,"highlight":true}]},{"rowNum":4,"cells":[{"value":"Keyboard"},{"value":5},{"value":300},{"value":1500,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Total Seluruhnya"},{"value":""},{"value":""},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Total Seluruhnya (SUM)","resultCell":{"row":4,"col":3},"validFormulas":["=SUM(D2:D4)","=D2+D3+D4"],"expectedResult":"19,000","hint":"Jumlahkan kolom Total Belanja: =SUM(D2:D4)"}]'::jsonb,
  0
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'average',
  'hitung-data',
  'Average (menghitung rata-rata)',
  'Mencari nilai rata-rata dari sekelompok angka.',
  'Fungsi `AVERAGE` menjumlahkan seluruh nilai pada rentang sel lalu membaginya dengan jumlah total data secara otomatis.
Syntax: `=AVERAGE(SelAwal:SelAkhir)`

Laporan Toko ATK kita bertambah satu baris baru: **Rata-rata Belanja**. Perhatikan bahwa rumus SUM dari langkah sebelumnya juga harus diisi ulang — ini melatih ingatan motorikmu!',
  'Tabel Toko ATK sekarang memiliki 2 baris kosong (**?**). Isi **D5** terlebih dahulu dengan `=SUM(D2:D4)`, lalu isi **D6** dengan rata-rata belanja menggunakan `=AVERAGE(D2:D4)`. Klik dua kali tiap sel untuk mulai mengetik.',
  array['', 'Nama Barang', 'Jumlah Unit', 'Harga Satuan', 'Total Belanja']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Barang","header":true},{"value":"Jumlah Unit","header":true},{"value":"Harga Satuan","header":true},{"value":"Total Belanja","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop"},{"value":2},{"value":8000},{"value":16000,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Mouse"},{"value":10},{"value":150},{"value":1500,"highlight":true}]},{"rowNum":4,"cells":[{"value":"Keyboard"},{"value":5},{"value":300},{"value":1500,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Total Seluruhnya"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Rata-rata Belanja"},{"value":""},{"value":""},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Total Seluruhnya (SUM)","resultCell":{"row":4,"col":3},"validFormulas":["=SUM(D2:D4)","=D2+D3+D4"],"expectedResult":"19,000","hint":"Ingat langkah sebelumnya: =SUM(D2:D4)"},{"label":"Rata-rata Belanja (AVERAGE)","resultCell":{"row":5,"col":3},"validFormulas":["=AVERAGE(D2:D4)"],"expectedResult":"6,333.33","hint":"Rata-rata total belanja: =AVERAGE(D2:D4)"}]'::jsonb,
  10
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'max',
  'hitung-data',
  'Max (mencari nilai tertinggi)',
  'Mengekstrak nilai angka paling besar dari suatu daftar.',
  'Fungsi `MAX` mengembalikan angka tertinggi di dalam suatu rentang data.
Syntax: `=MAX(SelAwal:SelAkhir)`

Laporan Toko ATK kita bertambah lagi dengan baris **Belanja Tertinggi**. Jangan lupa isi ulang D5 dan D6 dari ingatan — ini adalah bagian dari latihan pengulangan aktif!',
  'Tabel sekarang punya 3 baris kosong (**?**). Isi ulang **D5** (SUM) dan **D6** (AVERAGE), lalu isi **D7** dengan nilai belanja tertinggi menggunakan `=MAX(D2:D4)`. Klik dua kali tiap sel untuk mulai.',
  array['', 'Nama Barang', 'Jumlah Unit', 'Harga Satuan', 'Total Belanja']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Barang","header":true},{"value":"Jumlah Unit","header":true},{"value":"Harga Satuan","header":true},{"value":"Total Belanja","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop"},{"value":2},{"value":8000},{"value":16000,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Mouse"},{"value":10},{"value":150},{"value":1500,"highlight":true}]},{"rowNum":4,"cells":[{"value":"Keyboard"},{"value":5},{"value":300},{"value":1500,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Total Seluruhnya"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Rata-rata Belanja"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":7,"cells":[{"value":"Belanja Tertinggi"},{"value":""},{"value":""},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Total Seluruhnya (SUM)","resultCell":{"row":4,"col":3},"validFormulas":["=SUM(D2:D4)","=D2+D3+D4"],"expectedResult":"19,000","hint":"=SUM(D2:D4)"},{"label":"Rata-rata Belanja (AVERAGE)","resultCell":{"row":5,"col":3},"validFormulas":["=AVERAGE(D2:D4)"],"expectedResult":"6,333.33","hint":"=AVERAGE(D2:D4)"},{"label":"Belanja Tertinggi (MAX)","resultCell":{"row":6,"col":3},"validFormulas":["=MAX(D2:D4)"],"expectedResult":"16,000","hint":"Cari nilai terbesar: =MAX(D2:D4)"}]'::jsonb,
  20
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'min',
  'hitung-data',
  'Min (mencari nilai terendah)',
  'Mengekstrak nilai angka paling kecil dari suatu daftar.',
  'Fungsi `MIN` mengembalikan angka terkecil di dalam suatu rentang data.
Syntax: `=MIN(SelAwal:SelAkhir)`

Laporan Toko ATK bertambah baris **Belanja Terendah**. Di setiap langkah, kamu mengisi ulang seluruh rumus sebelumnya — inilah cara tercepat melatih refleks formula Excel!',
  'Isi ulang **D5** (SUM), **D6** (AVERAGE), **D7** (MAX), lalu isi **D8** dengan nilai belanja terendah menggunakan `=MIN(D2:D4)`.',
  array['', 'Nama Barang', 'Jumlah Unit', 'Harga Satuan', 'Total Belanja']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Barang","header":true},{"value":"Jumlah Unit","header":true},{"value":"Harga Satuan","header":true},{"value":"Total Belanja","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop"},{"value":2},{"value":8000},{"value":16000,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Mouse"},{"value":10},{"value":150},{"value":1500,"highlight":true}]},{"rowNum":4,"cells":[{"value":"Keyboard"},{"value":5},{"value":300},{"value":1500,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Total Seluruhnya"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Rata-rata Belanja"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":7,"cells":[{"value":"Belanja Tertinggi"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":8,"cells":[{"value":"Belanja Terendah"},{"value":""},{"value":""},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Total Seluruhnya (SUM)","resultCell":{"row":4,"col":3},"validFormulas":["=SUM(D2:D4)","=D2+D3+D4"],"expectedResult":"19,000","hint":"=SUM(D2:D4)"},{"label":"Rata-rata Belanja (AVERAGE)","resultCell":{"row":5,"col":3},"validFormulas":["=AVERAGE(D2:D4)"],"expectedResult":"6,333.33","hint":"=AVERAGE(D2:D4)"},{"label":"Belanja Tertinggi (MAX)","resultCell":{"row":6,"col":3},"validFormulas":["=MAX(D2:D4)"],"expectedResult":"16,000","hint":"=MAX(D2:D4)"},{"label":"Belanja Terendah (MIN)","resultCell":{"row":7,"col":3},"validFormulas":["=MIN(D2:D4)"],"expectedResult":"1,500","hint":"Cari nilai terkecil: =MIN(D2:D4)"}]'::jsonb,
  30
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'count',
  'hitung-data',
  'Count (menghitung banyak data angka)',
  'Menghitung sel yang hanya berisi data angka saja.',
  'Fungsi `COUNT` menghitung berapa banyak sel di suatu rentang yang terisi oleh angka. Sel berisi huruf atau sel kosong akan dilewati.
Syntax: `=COUNT(SelAwal:SelAkhir)`

Laporan Toko ATK kita sekarang memerlukan baris **Banyak Transaksi Angka**. Isi ulang seluruh rumus sebelumnya juga!',
  'Isi ulang D5–D8 dari langkah sebelumnya, lalu isi **D9** dengan jumlah sel angka di rentang Total Belanja menggunakan `=COUNT(D2:D4)`.',
  array['', 'Nama Barang', 'Jumlah Unit', 'Harga Satuan', 'Total Belanja']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Barang","header":true},{"value":"Jumlah Unit","header":true},{"value":"Harga Satuan","header":true},{"value":"Total Belanja","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop"},{"value":2},{"value":8000},{"value":16000,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Mouse"},{"value":10},{"value":150},{"value":1500,"highlight":true}]},{"rowNum":4,"cells":[{"value":"Keyboard"},{"value":5},{"value":300},{"value":1500,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Total Seluruhnya"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Rata-rata Belanja"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":7,"cells":[{"value":"Belanja Tertinggi"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":8,"cells":[{"value":"Belanja Terendah"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":9,"cells":[{"value":"Banyak Transaksi Angka"},{"value":""},{"value":""},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Total Seluruhnya (SUM)","resultCell":{"row":4,"col":3},"validFormulas":["=SUM(D2:D4)","=D2+D3+D4"],"expectedResult":"19,000","hint":"=SUM(D2:D4)"},{"label":"Rata-rata Belanja (AVERAGE)","resultCell":{"row":5,"col":3},"validFormulas":["=AVERAGE(D2:D4)"],"expectedResult":"6,333.33","hint":"=AVERAGE(D2:D4)"},{"label":"Belanja Tertinggi (MAX)","resultCell":{"row":6,"col":3},"validFormulas":["=MAX(D2:D4)"],"expectedResult":"16,000","hint":"=MAX(D2:D4)"},{"label":"Belanja Terendah (MIN)","resultCell":{"row":7,"col":3},"validFormulas":["=MIN(D2:D4)"],"expectedResult":"1,500","hint":"=MIN(D2:D4)"},{"label":"Banyak Transaksi Angka (COUNT)","resultCell":{"row":8,"col":3},"validFormulas":["=COUNT(D2:D4)"],"expectedResult":"3","hint":"Hitung sel angka di D2:D4: =COUNT(D2:D4)"}]'::jsonb,
  40
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'counta',
  'hitung-data',
  'Counta (menghitung semua data tidak kosong)',
  'Menghitung semua sel yang tidak kosong (baik berisi teks maupun angka).',
  'Berbeda dengan COUNT, fungsi `COUNTA` (Count All) akan menghitung setiap sel yang berisi karakter apa pun, termasuk teks, simbol, atau angka. Sel kosong tidak dihitung.
Syntax: `=COUNTA(SelAwal:SelAkhir)`

Laporan Toko ATK bertambah baris **Total Jenis Barang**. Isi ulang seluruh rumus D5–D9 juga!',
  'Isi ulang D5–D9 dari langkah sebelumnya, lalu isi **D10** dengan total jenis barang di kolom Nama Barang menggunakan `=COUNTA(A2:A4)`.',
  array['', 'Nama Barang', 'Jumlah Unit', 'Harga Satuan', 'Total Belanja']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Barang","header":true},{"value":"Jumlah Unit","header":true},{"value":"Harga Satuan","header":true},{"value":"Total Belanja","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop"},{"value":2},{"value":8000},{"value":16000,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Mouse"},{"value":10},{"value":150},{"value":1500,"highlight":true}]},{"rowNum":4,"cells":[{"value":"Keyboard"},{"value":5},{"value":300},{"value":1500,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Total Seluruhnya"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Rata-rata Belanja"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":7,"cells":[{"value":"Belanja Tertinggi"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":8,"cells":[{"value":"Belanja Terendah"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":9,"cells":[{"value":"Banyak Transaksi Angka"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":10,"cells":[{"value":"Total Jenis Barang"},{"value":""},{"value":""},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Total Seluruhnya (SUM)","resultCell":{"row":4,"col":3},"validFormulas":["=SUM(D2:D4)","=D2+D3+D4"],"expectedResult":"19,000","hint":"=SUM(D2:D4)"},{"label":"Rata-rata Belanja (AVERAGE)","resultCell":{"row":5,"col":3},"validFormulas":["=AVERAGE(D2:D4)"],"expectedResult":"6,333.33","hint":"=AVERAGE(D2:D4)"},{"label":"Belanja Tertinggi (MAX)","resultCell":{"row":6,"col":3},"validFormulas":["=MAX(D2:D4)"],"expectedResult":"16,000","hint":"=MAX(D2:D4)"},{"label":"Belanja Terendah (MIN)","resultCell":{"row":7,"col":3},"validFormulas":["=MIN(D2:D4)"],"expectedResult":"1,500","hint":"=MIN(D2:D4)"},{"label":"Banyak Transaksi Angka (COUNT)","resultCell":{"row":8,"col":3},"validFormulas":["=COUNT(D2:D4)"],"expectedResult":"3","hint":"=COUNT(D2:D4)"},{"label":"Total Jenis Barang (COUNTA)","resultCell":{"row":9,"col":3},"validFormulas":["=COUNTA(A2:A4)"],"expectedResult":"3","hint":"Hitung nama barang di kolom A: =COUNTA(A2:A4)"}]'::jsonb,
  50
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'large',
  'hitung-data',
  'Large (mencari nilai tertinggi kesekian)',
  'Mengambil nilai terbesar ke-N (misal terbesar ke-2) dalam data.',
  'Fungsi `LARGE` membolehkan kamu mencari nilai peringkat atas ke-k dari daftar angka.
Syntax: `=LARGE(range, k)`

Laporan Toko ATK bertambah baris **Belanja Ke-2 Terbesar**.',
  'Isi ulang D5–D10 dari langkah sebelumnya, lalu isi **D11** dengan nilai belanja terbesar ke-2 menggunakan `=LARGE(D2:D4, 2)`.',
  array['', 'Nama Barang', 'Jumlah Unit', 'Harga Satuan', 'Total Belanja']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Barang","header":true},{"value":"Jumlah Unit","header":true},{"value":"Harga Satuan","header":true},{"value":"Total Belanja","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop"},{"value":2},{"value":8000},{"value":16000,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Mouse"},{"value":10},{"value":150},{"value":1500,"highlight":true}]},{"rowNum":4,"cells":[{"value":"Keyboard"},{"value":5},{"value":300},{"value":1500,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Total Seluruhnya"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Rata-rata Belanja"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":7,"cells":[{"value":"Belanja Tertinggi"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":8,"cells":[{"value":"Belanja Terendah"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":9,"cells":[{"value":"Banyak Transaksi Angka"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":10,"cells":[{"value":"Total Jenis Barang"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":11,"cells":[{"value":"Belanja Ke-2 Terbesar"},{"value":""},{"value":""},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Total Seluruhnya (SUM)","resultCell":{"row":4,"col":3},"validFormulas":["=SUM(D2:D4)","=D2+D3+D4"],"expectedResult":"19,000","hint":"=SUM(D2:D4)"},{"label":"Rata-rata Belanja (AVERAGE)","resultCell":{"row":5,"col":3},"validFormulas":["=AVERAGE(D2:D4)"],"expectedResult":"6,333.33","hint":"=AVERAGE(D2:D4)"},{"label":"Belanja Tertinggi (MAX)","resultCell":{"row":6,"col":3},"validFormulas":["=MAX(D2:D4)"],"expectedResult":"16,000","hint":"=MAX(D2:D4)"},{"label":"Belanja Terendah (MIN)","resultCell":{"row":7,"col":3},"validFormulas":["=MIN(D2:D4)"],"expectedResult":"1,500","hint":"=MIN(D2:D4)"},{"label":"Banyak Transaksi Angka (COUNT)","resultCell":{"row":8,"col":3},"validFormulas":["=COUNT(D2:D4)"],"expectedResult":"3","hint":"=COUNT(D2:D4)"},{"label":"Total Jenis Barang (COUNTA)","resultCell":{"row":9,"col":3},"validFormulas":["=COUNTA(A2:A4)"],"expectedResult":"3","hint":"=COUNTA(A2:A4)"},{"label":"Belanja Ke-2 Terbesar (LARGE)","resultCell":{"row":10,"col":3},"validFormulas":["=LARGE(D2:D4,2)","=LARGE(D2:D4, 2)"],"expectedResult":"1,500","hint":"Terbesar ke-2 dari D2:D4: =LARGE(D2:D4, 2)"}]'::jsonb,
  60
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'small',
  'hitung-data',
  'Small (mencari nilai terendah kesekian)',
  'Mengambil nilai terkecil ke-N (misal terkecil ke-2) dalam data.',
  'Kebalikan dari LARGE, fungsi `SMALL` mencari nilai terkecil ke-k dari daftar angka.
Syntax: `=SMALL(range, k)`

Laporan Toko ATK bertambah baris **Belanja Ke-2 Terkecil**.',
  'Isi ulang D5–D11 dari langkah sebelumnya, lalu isi **D12** dengan nilai belanja terkecil ke-2 menggunakan `=SMALL(D2:D4, 2)`.',
  array['', 'Nama Barang', 'Jumlah Unit', 'Harga Satuan', 'Total Belanja']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Barang","header":true},{"value":"Jumlah Unit","header":true},{"value":"Harga Satuan","header":true},{"value":"Total Belanja","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop"},{"value":2},{"value":8000},{"value":16000,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Mouse"},{"value":10},{"value":150},{"value":1500,"highlight":true}]},{"rowNum":4,"cells":[{"value":"Keyboard"},{"value":5},{"value":300},{"value":1500,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Total Seluruhnya"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Rata-rata Belanja"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":7,"cells":[{"value":"Belanja Tertinggi"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":8,"cells":[{"value":"Belanja Terendah"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":9,"cells":[{"value":"Banyak Transaksi Angka"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":10,"cells":[{"value":"Total Jenis Barang"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":11,"cells":[{"value":"Belanja Ke-2 Terbesar"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":12,"cells":[{"value":"Belanja Ke-2 Terkecil"},{"value":""},{"value":""},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Total Seluruhnya (SUM)","resultCell":{"row":4,"col":3},"validFormulas":["=SUM(D2:D4)","=D2+D3+D4"],"expectedResult":"19,000","hint":"=SUM(D2:D4)"},{"label":"Rata-rata Belanja (AVERAGE)","resultCell":{"row":5,"col":3},"validFormulas":["=AVERAGE(D2:D4)"],"expectedResult":"6,333.33","hint":"=AVERAGE(D2:D4)"},{"label":"Belanja Tertinggi (MAX)","resultCell":{"row":6,"col":3},"validFormulas":["=MAX(D2:D4)"],"expectedResult":"16,000","hint":"=MAX(D2:D4)"},{"label":"Belanja Terendah (MIN)","resultCell":{"row":7,"col":3},"validFormulas":["=MIN(D2:D4)"],"expectedResult":"1,500","hint":"=MIN(D2:D4)"},{"label":"Banyak Transaksi Angka (COUNT)","resultCell":{"row":8,"col":3},"validFormulas":["=COUNT(D2:D4)"],"expectedResult":"3","hint":"=COUNT(D2:D4)"},{"label":"Total Jenis Barang (COUNTA)","resultCell":{"row":9,"col":3},"validFormulas":["=COUNTA(A2:A4)"],"expectedResult":"3","hint":"=COUNTA(A2:A4)"},{"label":"Belanja Ke-2 Terbesar (LARGE)","resultCell":{"row":10,"col":3},"validFormulas":["=LARGE(D2:D4,2)","=LARGE(D2:D4, 2)"],"expectedResult":"1,500","hint":"=LARGE(D2:D4, 2)"},{"label":"Belanja Ke-2 Terkecil (SMALL)","resultCell":{"row":11,"col":3},"validFormulas":["=SMALL(D2:D4,2)","=SMALL(D2:D4, 2)"],"expectedResult":"1,500","hint":"Terkecil ke-2 dari D2:D4: =SMALL(D2:D4, 2)"}]'::jsonb,
  70
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'sumproduct',
  'hitung-data',
  'Sumproduct (menjumlahkan hasil perkalian)',
  'Mengalikan sel-sel yang sejajar dan menjumlahkan seluruh hasil perkalian tersebut.',
  'Fungsi `SUMPRODUCT` mengalikan baris demi baris antara rentang kolom pertama dan rentang kolom kedua, lalu menjumlahkan seluruh hasilnya.
Syntax: `=SUMPRODUCT(range1, range2)`

Laporan Toko ATK bertambah baris **Total via SUMPRODUCT** — membuktikan bahwa SUM dari kolom D sama dengan SUMPRODUCT dari kolom B dan C.',
  'Isi ulang D5–D12 dari langkah sebelumnya, lalu isi **D13** dengan `=SUMPRODUCT(B2:B4, C2:C4)`.',
  array['', 'Nama Barang', 'Jumlah Unit', 'Harga Satuan', 'Total Belanja']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Barang","header":true},{"value":"Jumlah Unit","header":true},{"value":"Harga Satuan","header":true},{"value":"Total Belanja","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop"},{"value":2},{"value":8000},{"value":16000,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Mouse"},{"value":10},{"value":150},{"value":1500,"highlight":true}]},{"rowNum":4,"cells":[{"value":"Keyboard"},{"value":5},{"value":300},{"value":1500,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Total Seluruhnya"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Rata-rata Belanja"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":7,"cells":[{"value":"Belanja Tertinggi"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":8,"cells":[{"value":"Belanja Terendah"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":9,"cells":[{"value":"Banyak Transaksi Angka"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":10,"cells":[{"value":"Total Jenis Barang"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":11,"cells":[{"value":"Belanja Ke-2 Terbesar"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":12,"cells":[{"value":"Belanja Ke-2 Terkecil"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":13,"cells":[{"value":"Total via Sumproduct"},{"value":""},{"value":""},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Total Seluruhnya (SUM)","resultCell":{"row":4,"col":3},"validFormulas":["=SUM(D2:D4)","=D2+D3+D4"],"expectedResult":"19,000","hint":"=SUM(D2:D4)"},{"label":"Rata-rata Belanja (AVERAGE)","resultCell":{"row":5,"col":3},"validFormulas":["=AVERAGE(D2:D4)"],"expectedResult":"6,333.33","hint":"=AVERAGE(D2:D4)"},{"label":"Belanja Tertinggi (MAX)","resultCell":{"row":6,"col":3},"validFormulas":["=MAX(D2:D4)"],"expectedResult":"16,000","hint":"=MAX(D2:D4)"},{"label":"Belanja Terendah (MIN)","resultCell":{"row":7,"col":3},"validFormulas":["=MIN(D2:D4)"],"expectedResult":"1,500","hint":"=MIN(D2:D4)"},{"label":"Banyak Transaksi Angka (COUNT)","resultCell":{"row":8,"col":3},"validFormulas":["=COUNT(D2:D4)"],"expectedResult":"3","hint":"=COUNT(D2:D4)"},{"label":"Total Jenis Barang (COUNTA)","resultCell":{"row":9,"col":3},"validFormulas":["=COUNTA(A2:A4)"],"expectedResult":"3","hint":"=COUNTA(A2:A4)"},{"label":"Belanja Ke-2 Terbesar (LARGE)","resultCell":{"row":10,"col":3},"validFormulas":["=LARGE(D2:D4,2)","=LARGE(D2:D4, 2)"],"expectedResult":"1,500","hint":"=LARGE(D2:D4, 2)"},{"label":"Belanja Ke-2 Terkecil (SMALL)","resultCell":{"row":11,"col":3},"validFormulas":["=SMALL(D2:D4,2)","=SMALL(D2:D4, 2)"],"expectedResult":"1,500","hint":"=SMALL(D2:D4, 2)"},{"label":"Total via Sumproduct (SUMPRODUCT)","resultCell":{"row":12,"col":3},"validFormulas":["=SUMPRODUCT(B2:B4,C2:C4)","=SUMPRODUCT(B2:B4, C2:C4)","=SUMPRODUCT(B2:B4;C2:C4)"],"expectedResult":"19,000","hint":"Kalikan unit × harga: =SUMPRODUCT(B2:B4, C2:C4)"}]'::jsonb,
  80
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'aggregate',
  'hitung-data',
  'Aggregate (kalkulasi dengan pengabaian error/filter)',
  'Melakukan kalkulasi seperti SUM/AVERAGE dengan opsi mengabaikan sel yang error.',
  'Fungsi `AGGREGATE` adalah fungsi multifungsi yang bisa melakukan tugas SUM, AVERAGE, dll., dengan kelebihan bisa melewati baris yang tersembunyi atau sel yang berisi error.

Argumennya: 1. **Fungsi** (9=SUM), 2. **Opsi** (6=abaikan error), 3. **Rentang**.
Syntax: `=AGGREGATE(fungsi, opsi, range)`

Ini adalah baris terakhir laporan Toko ATK. Setelah ini kamu akan menghadapi Studi Kasus Final!',
  'Isi ulang D5–D13, lalu isi **D14** dengan `=AGGREGATE(9, 6, D2:D4)` — fungsi 9=SUM, opsi 6=abaikan error.',
  array['', 'Nama Barang', 'Jumlah Unit', 'Harga Satuan', 'Total Belanja']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Barang","header":true},{"value":"Jumlah Unit","header":true},{"value":"Harga Satuan","header":true},{"value":"Total Belanja","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop"},{"value":2},{"value":8000},{"value":16000,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Mouse"},{"value":10},{"value":150},{"value":1500,"highlight":true}]},{"rowNum":4,"cells":[{"value":"Keyboard"},{"value":5},{"value":300},{"value":1500,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Total Seluruhnya"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Rata-rata Belanja"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":7,"cells":[{"value":"Belanja Tertinggi"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":8,"cells":[{"value":"Belanja Terendah"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":9,"cells":[{"value":"Banyak Transaksi Angka"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":10,"cells":[{"value":"Total Jenis Barang"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":11,"cells":[{"value":"Belanja Ke-2 Terbesar"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":12,"cells":[{"value":"Belanja Ke-2 Terkecil"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":13,"cells":[{"value":"Total via Sumproduct"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":14,"cells":[{"value":"Total via Aggregate"},{"value":""},{"value":""},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Total Seluruhnya (SUM)","resultCell":{"row":4,"col":3},"validFormulas":["=SUM(D2:D4)","=D2+D3+D4"],"expectedResult":"19,000","hint":"=SUM(D2:D4)"},{"label":"Rata-rata Belanja (AVERAGE)","resultCell":{"row":5,"col":3},"validFormulas":["=AVERAGE(D2:D4)"],"expectedResult":"6,333.33","hint":"=AVERAGE(D2:D4)"},{"label":"Belanja Tertinggi (MAX)","resultCell":{"row":6,"col":3},"validFormulas":["=MAX(D2:D4)"],"expectedResult":"16,000","hint":"=MAX(D2:D4)"},{"label":"Belanja Terendah (MIN)","resultCell":{"row":7,"col":3},"validFormulas":["=MIN(D2:D4)"],"expectedResult":"1,500","hint":"=MIN(D2:D4)"},{"label":"Banyak Transaksi Angka (COUNT)","resultCell":{"row":8,"col":3},"validFormulas":["=COUNT(D2:D4)"],"expectedResult":"3","hint":"=COUNT(D2:D4)"},{"label":"Total Jenis Barang (COUNTA)","resultCell":{"row":9,"col":3},"validFormulas":["=COUNTA(A2:A4)"],"expectedResult":"3","hint":"=COUNTA(A2:A4)"},{"label":"Belanja Ke-2 Terbesar (LARGE)","resultCell":{"row":10,"col":3},"validFormulas":["=LARGE(D2:D4,2)","=LARGE(D2:D4, 2)"],"expectedResult":"1,500","hint":"=LARGE(D2:D4, 2)"},{"label":"Belanja Ke-2 Terkecil (SMALL)","resultCell":{"row":11,"col":3},"validFormulas":["=SMALL(D2:D4,2)","=SMALL(D2:D4, 2)"],"expectedResult":"1,500","hint":"=SMALL(D2:D4, 2)"},{"label":"Total via Sumproduct (SUMPRODUCT)","resultCell":{"row":12,"col":3},"validFormulas":["=SUMPRODUCT(B2:B4,C2:C4)","=SUMPRODUCT(B2:B4, C2:C4)","=SUMPRODUCT(B2:B4;C2:C4)"],"expectedResult":"19,000","hint":"=SUMPRODUCT(B2:B4, C2:C4)"},{"label":"Total via Aggregate (AGGREGATE)","resultCell":{"row":13,"col":3},"validFormulas":["=AGGREGATE(9,6,D2:D4)","=AGGREGATE(9, 6, D2:D4)","=AGGREGATE(9;6;D2:D4)"],"expectedResult":"19,000","hint":"SUM + abaikan error: =AGGREGATE(9, 6, D2:D4)"}]'::jsonb,
  90
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'studi-kasus-hitung',
  'hitung-data',
  'Studi Kasus Final: Laporan Kas Toko ATK Mandiri',
  'Ujian mandiri: lengkapi seluruh laporan Toko ATK dari nol tanpa panduan — buktikan penguasaan 10 rumus sekaligus!',
  'Selamat! Kamu telah mempelajari dan berlatih 10 rumus menghitung data secara bertahap di tabel Toko ATK yang sama.

Sekarang tiba saatnya **ujian mandiri sesungguhnya**. Tabel di sebelah kanan adalah laporan Toko ATK yang SAMA persis — namun seluruh 10 sel formula dikosongkan sekaligus.

Tanpa petunjuk tambahan, isi semua sel dari ingatanmu. Ini adalah bukti nyata bahwa kamu sudah benar-benar menguasai ke-10 rumus tersebut!',
  'Lengkapi **semua 10 sel** bertanda tanya (D5–D14) sekaligus. Klik sel mana saja untuk mulai. Tidak ada urutan wajib — kerjakan sesuai yang kamu ingat lebih dulu!',
  array['', 'Nama Barang', 'Jumlah Unit', 'Harga Satuan', 'Total Belanja']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Barang","header":true},{"value":"Jumlah Unit","header":true},{"value":"Harga Satuan","header":true},{"value":"Total Belanja","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop"},{"value":2},{"value":8000},{"value":16000,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Mouse"},{"value":10},{"value":150},{"value":1500,"highlight":true}]},{"rowNum":4,"cells":[{"value":"Keyboard"},{"value":5},{"value":300},{"value":1500,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Total Seluruhnya"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Rata-rata Belanja"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":7,"cells":[{"value":"Belanja Tertinggi"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":8,"cells":[{"value":"Belanja Terendah"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":9,"cells":[{"value":"Banyak Transaksi Angka"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":10,"cells":[{"value":"Total Jenis Barang"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":11,"cells":[{"value":"Belanja Ke-2 Terbesar"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":12,"cells":[{"value":"Belanja Ke-2 Terkecil"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":13,"cells":[{"value":"Total via Sumproduct"},{"value":""},{"value":""},{"value":"?","highlight":true}]},{"rowNum":14,"cells":[{"value":"Total via Aggregate"},{"value":""},{"value":""},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Total Seluruhnya (SUM)","resultCell":{"row":4,"col":3},"validFormulas":["=SUM(D2:D4)","=D2+D3+D4"],"expectedResult":"19,000","hint":"Jumlahkan D2:D4"},{"label":"Rata-rata Belanja (AVERAGE)","resultCell":{"row":5,"col":3},"validFormulas":["=AVERAGE(D2:D4)"],"expectedResult":"6,333.33","hint":"Rata-rata D2:D4"},{"label":"Belanja Tertinggi (MAX)","resultCell":{"row":6,"col":3},"validFormulas":["=MAX(D2:D4)"],"expectedResult":"16,000","hint":"Nilai terbesar D2:D4"},{"label":"Belanja Terendah (MIN)","resultCell":{"row":7,"col":3},"validFormulas":["=MIN(D2:D4)"],"expectedResult":"1,500","hint":"Nilai terkecil D2:D4"},{"label":"Banyak Transaksi Angka (COUNT)","resultCell":{"row":8,"col":3},"validFormulas":["=COUNT(D2:D4)"],"expectedResult":"3","hint":"Hitung sel angka D2:D4"},{"label":"Total Jenis Barang (COUNTA)","resultCell":{"row":9,"col":3},"validFormulas":["=COUNTA(A2:A4)"],"expectedResult":"3","hint":"Hitung sel tidak kosong A2:A4"},{"label":"Belanja Ke-2 Terbesar (LARGE)","resultCell":{"row":10,"col":3},"validFormulas":["=LARGE(D2:D4,2)","=LARGE(D2:D4, 2)"],"expectedResult":"1,500","hint":"Terbesar ke-2 dari D2:D4"},{"label":"Belanja Ke-2 Terkecil (SMALL)","resultCell":{"row":11,"col":3},"validFormulas":["=SMALL(D2:D4,2)","=SMALL(D2:D4, 2)"],"expectedResult":"1,500","hint":"Terkecil ke-2 dari D2:D4"},{"label":"Total via Sumproduct (SUMPRODUCT)","resultCell":{"row":12,"col":3},"validFormulas":["=SUMPRODUCT(B2:B4,C2:C4)","=SUMPRODUCT(B2:B4, C2:C4)","=SUMPRODUCT(B2:B4;C2:C4)"],"expectedResult":"19,000","hint":"Unit × Harga: =SUMPRODUCT(B2:B4, C2:C4)"},{"label":"Total via Aggregate (AGGREGATE)","resultCell":{"row":13,"col":3},"validFormulas":["=AGGREGATE(9,6,D2:D4)","=AGGREGATE(9, 6, D2:D4)","=AGGREGATE(9;6;D2:D4)"],"expectedResult":"19,000","hint":"SUM + abaikan error: =AGGREGATE(9, 6, D2:D4)"}]'::jsonb,
  100
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'round',
  'bulat-data',
  'Round (membulatkan desimal sesuai logika matematika)',
  'Membulatkan angka desimal ke digit terdekat sesuai aturan matematika standar.',
  'Fungsi `ROUND` membulatkan angka ke jumlah digit desimal yang kamu tentukan. Angka 5 ke atas dibulatkan naik, 4 ke bawah dibulatkan turun.
Syntax: `=ROUND(angka, jumlah_digit)`',
  'Bulatkan angka rata-rata di sel **A2** menjadi **1 angka di belakang koma** (desimal). Ketik rumusnya di sel **B2**.',
  array['', 'Angka Asli', 'Hasil Round']::text[],
  '[{"rowNum":1,"cells":[{"value":"Angka Asli","header":true},{"value":"Hasil Round","header":true}]},{"rowNum":2,"cells":[{"value":78.685,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=ROUND(A2,1)', '=ROUND(A2, 1)', '=ROUND(A2;1)']::text[],
  '78.7',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =ROUND(A2, 1)',
  NULL,
  0
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'rounddown',
  'bulat-data',
  'Rounddown (membulatkan desimal ke bawah)',
  'Memaksa pembulatan angka desimal ke arah bawah mendekati nol.',
  'Fungsi `ROUNDDOWN` selalu membulatkan angka pecahan ke bawah (mendekati nol) terlepas dari berapa pun nilai desimal di belakangnya.
Syntax: `=ROUNDDOWN(angka, jumlah_digit)`',
  'Bulatkan angka desimal di sel **A2** ke bawah menjadi **0 digit desimal** (angka bulat). Tulis rumusnya di sel **B2**.',
  array['', 'Angka Asli', 'Hasil Bulat Bawah']::text[],
  '[{"rowNum":1,"cells":[{"value":"Angka Asli","header":true},{"value":"Hasil Bulat Bawah","header":true}]},{"rowNum":2,"cells":[{"value":12.99,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=ROUNDDOWN(A2,0)', '=ROUNDDOWN(A2, 0)', '=ROUNDDOWN(A2;0)']::text[],
  '12',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =ROUNDDOWN(A2, 0)',
  NULL,
  10
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'roundup',
  'bulat-data',
  'Roundup (membulatkan desimal ke atas)',
  'Memaksa pembulatan angka desimal ke arah atas menjauhi nol.',
  'Fungsi `ROUNDUP` selalu membulatkan angka pecahan ke atas (menjauhi nol) meskipun nilai desimalnya sangat kecil.
Syntax: `=ROUNDUP(angka, jumlah_digit)`',
  'Bulatkan angka desimal di sel **A2** ke atas menjadi **0 digit desimal** (angka bulat). Tulis rumusnya di sel **B2**.',
  array['', 'Angka Asli', 'Hasil Bulat Atas']::text[],
  '[{"rowNum":1,"cells":[{"value":"Angka Asli","header":true},{"value":"Hasil Bulat Atas","header":true}]},{"rowNum":2,"cells":[{"value":12.01,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=ROUNDUP(A2,0)', '=ROUNDUP(A2, 0)', '=ROUNDUP(A2;0)']::text[],
  '13',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =ROUNDUP(A2, 0)',
  NULL,
  20
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'int',
  'bulat-data',
  'Int (mengambil nilai bulat)',
  'Memotong nilai desimal dan menyisakan angka bulat utuhnya saja.',
  'Fungsi `INT` (Integer) membulatkan angka ke bawah ke bilangan bulat terdekat. Sangat praktis jika kamu hanya butuh angka utuh di depan koma desimal tanpa memikirkan pembulatan matematis.
Syntax: `=INT(angka)`',
  'Ambil bilangan bulat utuh dari sel **A2** di dalam sel **B2**.',
  array['', 'Angka Asli', 'Nilai Bulat']::text[],
  '[{"rowNum":1,"cells":[{"value":"Angka Asli","header":true},{"value":"Nilai Bulat","header":true}]},{"rowNum":2,"cells":[{"value":45.75,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=INT(A2)', '=int(a2)']::text[],
  '45',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =INT(A2)',
  NULL,
  30
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'ceiling',
  'bulat-data',
  'Ceiling (membulatkan angka ke atas dengan kelipatan)',
  'Membulatkan angka ke atas ke kelipatan terdekat yang ditentukan.',
  'Fungsi `CEILING` membulatkan angka ke atas ke kelipatan bilangan terdekat yang ditentukan. Sangat berguna untuk menghitung kemasan produk atau harga kelipatan.
Syntax: `=CEILING(angka, kelipatan)`',
  'Bulatkan harga barang di sel **A2** ke atas ke **kelipatan 500 terdekat** di sel **B2**.',
  array['', 'Harga Asli', 'Hasil Kelipatan Atas']::text[],
  '[{"rowNum":1,"cells":[{"value":"Harga Asli","header":true},{"value":"Hasil Kelipatan Atas","header":true}]},{"rowNum":2,"cells":[{"value":4250,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=CEILING(A2,500)', '=CEILING(A2, 500)', '=CEILING(A2;500)']::text[],
  '4,500',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =CEILING(A2, 500)',
  NULL,
  40
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'floor',
  'bulat-data',
  'Floor (membulatkan angka ke bawah dengan kelipatan)',
  'Membulatkan angka ke bawah ke kelipatan terdekat yang ditentukan.',
  'Fungsi `FLOOR` membulatkan angka ke bawah ke kelipatan bilangan terdekat yang ditentukan.
Syntax: `=FLOOR(angka, kelipatan)`',
  'Bulatkan harga di sel **A2** ke bawah ke **kelipatan 500 terdekat** di sel **B2**.',
  array['', 'Harga Asli', 'Hasil Kelipatan Bawah']::text[],
  '[{"rowNum":1,"cells":[{"value":"Harga Asli","header":true},{"value":"Hasil Kelipatan Bawah","header":true}]},{"rowNum":2,"cells":[{"value":4250,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=FLOOR(A2,500)', '=FLOOR(A2, 500)', '=FLOOR(A2;500)']::text[],
  '4,000',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =FLOOR(A2, 500)',
  NULL,
  50
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'mround',
  'bulat-data',
  'Mround (membulatkan angka dengan kelipatan)',
  'Membulatkan angka ke kelipatan terdekat (bisa naik/turun sesuai matematika).',
  'Fungsi `MROUND` membulatkan angka ke kelipatan terdekat. Jika sisa pembagian lebih dari atau sama dengan setengah kelipatan, angka dibulatkan ke atas. Jika kurang, dibulatkan ke bawah.
Syntax: `=MROUND(angka, kelipatan)`',
  'Bulatkan nilai di sel **A2** ke **kelipatan 5 terdekat** di sel **B2**.',
  array['', 'Nilai Asli', 'Hasil Mround']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nilai Asli","header":true},{"value":"Hasil Mround","header":true}]},{"rowNum":2,"cells":[{"value":17.2,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=MROUND(A2,5)', '=MROUND(A2, 5)', '=MROUND(A2;5)']::text[],
  '15',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =MROUND(A2, 5)',
  NULL,
  60
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'studi-kasus-bulat',
  'bulat-data',
  'Studi Kasus: Laporan Pajak & Pembulatan Kas Toko ATK',
  'Hitung total omset harian Toko ATK dan bulatkan biaya operasional serta pajak kasir.',
  'Di bab ini, kamu telah mempelajari berbagai rumus pembulatan angka desimal atau kelipatan. Sekarang, lengkapi laporan keuangan harian Toko ATK Jaya Mandiri di sebelah kanan dengan menghitung rata-rata, total omset harian, estimasi pajak kotor, dan melakukan pembulatan pembagian uang kembalian kasir.',
  'Hitung rata-rata omset harian (AVERAGE) di sel B5, jumlah total omset (SUM) di B6. Lalu hitung nilai pajak omset di B8 (2.5% dari B6), dan lakukan berbagai tipe pembulatan kasir di sel B9 sampai B15 sesuai instruksi masing-masing. Klik sel mana saja untuk mulai mengisinya.',
  array['', 'Keterangan Keuangan', 'Nilai Kas / Omset']::text[],
  '[{"rowNum":1,"cells":[{"value":"Keterangan Keuangan","header":true},{"value":"Nilai Kas / Omset","header":true}]},{"rowNum":2,"cells":[{"value":"Omset Cabang A"},{"value":854320}]},{"rowNum":3,"cells":[{"value":"Omset Cabang B"},{"value":912750}]},{"rowNum":4,"cells":[{"value":"Omset Cabang C"},{"value":780560}]},{"rowNum":5,"cells":[{"value":"Rata-rata Omset"},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Total Omset Harian"},{"value":"?","highlight":true}]},{"rowNum":7,"cells":[{"value":"Biaya Ongkir Kurir Toko"},{"value":525.685}]},{"rowNum":8,"cells":[{"value":"Pajak Kotor Omset (2.5%)"},{"value":"?","highlight":true}]},{"rowNum":9,"cells":[{"value":"Pajak Bulat Matematika"},{"value":"?","highlight":true}]},{"rowNum":10,"cells":[{"value":"Pajak Bulat Bawah"},{"value":"?","highlight":true}]},{"rowNum":11,"cells":[{"value":"Pajak Bulat Atas"},{"value":"?","highlight":true}]},{"rowNum":12,"cells":[{"value":"Pajak Bulat Ribuan Terdekat"},{"value":"?","highlight":true}]},{"rowNum":13,"cells":[{"value":"Biaya Ongkir Bulat Atas"},{"value":"?","highlight":true}]},{"rowNum":14,"cells":[{"value":"Biaya Ongkir Bulat Bawah"},{"value":"?","highlight":true}]},{"rowNum":15,"cells":[{"value":"Omset Cabang A Bulat Potong"},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Rata-rata Omset","resultCell":{"row":4,"col":1},"validFormulas":["=AVERAGE(B2:B4)"],"expectedResult":"849210","hint":"Gunakan =AVERAGE(B2:B4) untuk mencari nilai rata-rata."},{"label":"Total Omset Harian","resultCell":{"row":5,"col":1},"validFormulas":["=SUM(B2:B4)"],"expectedResult":"2547630","hint":"Gunakan =SUM(B2:B4) untuk menjumlahkan."},{"label":"Pajak Kotor Omset (2.5%)","resultCell":{"row":7,"col":1},"validFormulas":["=B6*2.5%","=B6*0.025"],"expectedResult":"63690.75","hint":"Ketik: =B6*2.5% atau =B6*0.025"},{"label":"Pajak Bulat Matematika","resultCell":{"row":8,"col":1},"validFormulas":["=ROUND(B8,0)","=ROUND(B8, 0)"],"expectedResult":"63691","hint":"Gunakan =ROUND(B8, 0) untuk membulatkan desimal."},{"label":"Pajak Bulat Bawah","resultCell":{"row":9,"col":1},"validFormulas":["=ROUNDDOWN(B8,0)","=ROUNDDOWN(B8, 0)"],"expectedResult":"63690","hint":"Gunakan =ROUNDDOWN(B8, 0) untuk membulatkan ke bawah."},{"label":"Pajak Bulat Atas","resultCell":{"row":10,"col":1},"validFormulas":["=ROUNDUP(B8,0)","=ROUNDUP(B8, 0)"],"expectedResult":"63691","hint":"Gunakan =ROUNDUP(B8, 0) untuk membulatkan ke atas."},{"label":"Pajak Bulat Ribuan Terdekat","resultCell":{"row":11,"col":1},"validFormulas":["=MROUND(B8,1000)","=MROUND(B8, 1000)"],"expectedResult":"64000","hint":"Gunakan =MROUND(B8, 1000) untuk kelipatan 1000 terdekat."},{"label":"Biaya Ongkir Bulat Atas","resultCell":{"row":12,"col":1},"validFormulas":["=CEILING(B7,1)","=CEILING(B7, 1)"],"expectedResult":"526","hint":"Gunakan =CEILING(B7, 1) untuk kelipatan atas."},{"label":"Biaya Ongkir Bulat Bawah","resultCell":{"row":13,"col":1},"validFormulas":["=FLOOR(B7,1)","=FLOOR(B7, 1)"],"expectedResult":"525","hint":"Gunakan =FLOOR(B7, 1) untuk kelipatan bawah."},{"label":"Omset Cabang A Bulat Potong","resultCell":{"row":14,"col":1},"validFormulas":["=INT(B2)"],"expectedResult":"854320","hint":"Gunakan =INT(B2) untuk memotong bagian desimal."}]'::jsonb,
  70
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'concatenate',
  'rapih-data',
  'Concatenate (menggabungkan data)',
  'Menggabungkan dua atau lebih string teks menjadi satu sel.',
  'Fungsi `CONCATENATE` menggabungkan teks dari beberapa sel referensi menjadi satu kesatuan. Kamu bisa menambahkan pembatas teks manual seperti spasi dengan memasukkan karakter di antara sel.
Syntax: `=CONCATENATE(teks1, teks2, ...)`',
  'Gabungkan nama depan di sel **A2** dan nama belakang di sel **B2** dengan spasi di antaranya di sel **C2**.',
  array['', 'Nama Depan', 'Nama Belakang', 'Nama Lengkap']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Depan","header":true},{"value":"Nama Belakang","header":true},{"value":"Nama Lengkap","header":true}]},{"rowNum":2,"cells":[{"value":"Budi","highlight":true},{"value":"Utomo","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=CONCATENATE(A2," ",B2)', '=CONCATENATE(A2, " ", B2)', '=CONCATENATE(A2;" ";B2)']::text[],
  'Budi Utomo',
  '{"row":1,"col":2}'::jsonb,
  'Ketik: =CONCATENATE(A2, " ", B2)',
  NULL,
  0
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'ampersand',
  'rapih-data',
  '& (menggabungkan data)',
  'Menggabungkan sel teks secara langsung menggunakan simbol ampersand (&).',
  'Selain fungsi CONCATENATE, kamu bisa memakai simbol dan (`&`) untuk menggabungkan sel secara manual. Ini adalah jalan pintas yang sangat sering dipakai. Contoh: `=A1&" "&B1`.',
  'Gabungkan sel **A2** dan **B2** dengan pembatas spasi menggunakan operator **&** di sel **C2**.',
  array['', 'Nama Depan', 'Nama Belakang', 'Nama Lengkap']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Depan","header":true},{"value":"Nama Belakang","header":true},{"value":"Nama Lengkap","header":true}]},{"rowNum":2,"cells":[{"value":"Aulia","highlight":true},{"value":"Putri","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=A2&" "&B2', '=A2 & " " & B2']::text[],
  'Aulia Putri',
  '{"row":1,"col":2}'::jsonb,
  'Ketik: =A2&" "&B2',
  NULL,
  10
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'trim',
  'rapih-data',
  'Trim (menghilangkan spasi berlebih)',
  'Membersihkan teks dari spasi kosong ganda atau spasi di ujung kata.',
  'Fungsi `TRIM` membersihkan spasi berlebih dari sebuah kalimat, hanya menyisakan spasi tunggal di antara kata-kata, dan menghapus seluruh spasi kosong di paling awal atau paling akhir teks.
Syntax: `=TRIM(teks)`',
  'Bersihkan spasi berlebih pada sel nama **A2** di dalam sel **B2**.',
  array['', 'Nama Rusak', 'Nama Bersih']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Rusak","header":true},{"value":"Nama Bersih","header":true}]},{"rowNum":2,"cells":[{"value":"   Dewi   Sari  ","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=TRIM(A2)', '=trim(a2)']::text[],
  'Dewi Sari',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =TRIM(A2)',
  NULL,
  20
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'clean',
  'rapih-data',
  'Clean (menghilangkan enter berlebih)',
  'Menghapus karakter non-cetak seperti enter/baris baru di dalam teks.',
  'Fungsi `CLEAN` menghapus karakter non-cetak dari teks, seperti karakter baris baru/enter (line break) yang sering muncul akibat copy-paste data mentah dari internet.
Syntax: `=CLEAN(teks)`',
  'Bersihkan teks alamat di sel **A2** dari karakter enter di sel **B2**.',
  array['', 'Alamat Rusak', 'Alamat Bersih']::text[],
  '[{"rowNum":1,"cells":[{"value":"Alamat Rusak","header":true},{"value":"Alamat Bersih","header":true}]},{"rowNum":2,"cells":[{"value":"Jl. Mawar\nNo. 10","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=CLEAN(A2)', '=clean(a2)']::text[],
  'Jl. MawarNo. 10',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =CLEAN(A2)',
  NULL,
  30
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'upper',
  'rapih-data',
  'Upper (mengubah kata menjadi huruf besar semua)',
  'Mengubah semua karakter huruf kecil menjadi huruf besar (kapital) semua.',
  'Fungsi `UPPER` memaksa semua huruf dalam kalimat menjadi huruf besar.
Syntax: `=UPPER(teks)`',
  'Ubah kode barang huruf kecil di sel **A2** menjadi huruf kapital semua di sel **B2**.',
  array['', 'Kode', 'Kapital']::text[],
  '[{"rowNum":1,"cells":[{"value":"Kode","header":true},{"value":"Kapital","header":true}]},{"rowNum":2,"cells":[{"value":"jkt-02","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=UPPER(A2)', '=upper(a2)']::text[],
  'JKT-02',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =UPPER(A2)',
  NULL,
  40
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'lower',
  'rapih-data',
  'Lower (mengubah kata menjadi huruf kecil semua)',
  'Mengubah semua karakter huruf besar menjadi huruf kecil semua.',
  'Fungsi `LOWER` mengubah semua huruf kapital dalam teks menjadi huruf kecil semuanya.
Syntax: `=LOWER(teks)`',
  'Ubah teks email di sel **A2** menjadi huruf kecil semua di sel **B2**.',
  array['', 'Email Asli', 'Email Kecil']::text[],
  '[{"rowNum":1,"cells":[{"value":"Email Asli","header":true},{"value":"Email Kecil","header":true}]},{"rowNum":2,"cells":[{"value":"BUDI@EXAMPLE.COM","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=LOWER(A2)', '=lower(a2)']::text[],
  'budi@example.com',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =LOWER(A2)',
  NULL,
  50
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'proper',
  'rapih-data',
  'Proper (mengubah huruf pertama setiap kata menjadi huruf besar)',
  'Mengubah huruf pertama setiap kata menjadi huruf besar (seperti nama orang).',
  'Fungsi `PROPER` mengubah huruf pertama setiap kata menjadi huruf besar (kapital) dan huruf-huruf setelahnya menjadi huruf kecil. Sangat rapi untuk penulisan nama orang atau kota.
Syntax: `=PROPER(teks)`',
  'Rapikan penulisan nama yang berantakan di sel **A2** menjadi format nama yang rapi di sel **B2**.',
  array['', 'Nama Berantakan', 'Nama Rapi']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Berantakan","header":true},{"value":"Nama Rapi","header":true}]},{"rowNum":2,"cells":[{"value":"jOkO wIdOdO","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=PROPER(A2)', '=proper(a2)']::text[],
  'Joko Widodo',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =PROPER(A2)',
  NULL,
  60
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'studi-kasus-rapih',
  'rapih-data',
  'Studi Kasus: Pembersihan Database Pelanggan Toko ATK',
  'Bersihkan dan rapikan data pelanggan baru Toko ATK yang diinput secara tidak terstruktur.',
  'Di bab ini, kamu telah mempelajari cara membersihkan spasi ganda, memformat kapitalisasi teks, dan menggabungkan beberapa teks. Sekarang saatnya mempraktikkannya untuk merapikan database pendaftaran pelanggan baru di Toko ATK Jaya Mandiri.',
  'Bersihkan spasi depan mentah (TRIM) dari nama depan pelanggan di B5. Gunakan PROPER di B6 dan B7 untuk memformat nama depan dan belakang resmi pelanggan. Gabungkan nama resmi tersebut menggunakan CONCATENATE di B8 dan operator & di B9. Ubah email kotor menjadi huruf kecil (LOWER) di B10, nama kode kartu pelanggan menjadi huruf besar (UPPER) di B11, dan hitung kolom teks dengan COUNTA di B12. Klik sel mana saja untuk mulai mengisinya.',
  array['', 'Keterangan Pelanggan', 'Teks Hasil Pembersihan']::text[],
  '[{"rowNum":1,"cells":[{"value":"Keterangan Pelanggan","header":true},{"value":"Teks Hasil Pembersihan","header":true}]},{"rowNum":2,"cells":[{"value":"Nama Depan Mentah"},{"value":"  rIaN  "}]},{"rowNum":3,"cells":[{"value":"Nama Belakang Mentah"},{"value":"hIdAyAt"}]},{"rowNum":4,"cells":[{"value":"Email Kotor"},{"value":"RIAN.H@yahoo.com"}]},{"rowNum":5,"cells":[{"value":"Nama Depan Bersih Spasi"},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Nama Resmi Format Proper"},{"value":"?","highlight":true}]},{"rowNum":7,"cells":[{"value":"Nama Belakang Resmi Proper"},{"value":"?","highlight":true}]},{"rowNum":8,"cells":[{"value":"Nama Lengkap (CONCAT)"},{"value":"?","highlight":true}]},{"rowNum":9,"cells":[{"value":"Nama Lengkap (Ampersand)"},{"value":"?","highlight":true}]},{"rowNum":10,"cells":[{"value":"Email Rapi (Lower)"},{"value":"?","highlight":true}]},{"rowNum":11,"cells":[{"value":"Nama Kode Kartu (Upper)"},{"value":"?","highlight":true}]},{"rowNum":12,"cells":[{"value":"Total Kolom Data Teks"},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Nama Depan Bersih Spasi","resultCell":{"row":4,"col":1},"validFormulas":["=TRIM(B2)"],"expectedResult":"rIaN","hint":"Gunakan =TRIM(B2) untuk membuang spasi liar."},{"label":"Nama Resmi Format Proper","resultCell":{"row":5,"col":1},"validFormulas":["=PROPER(B5)"],"expectedResult":"Rian","hint":"Gunakan =PROPER(B5) untuk format kapital pertama."},{"label":"Nama Belakang Resmi Proper","resultCell":{"row":6,"col":1},"validFormulas":["=PROPER(B3)"],"expectedResult":"Hidayat","hint":"Gunakan =PROPER(B3) untuk format nama belakang."},{"label":"Nama Lengkap (CONCAT)","resultCell":{"row":7,"col":1},"validFormulas":["=CONCATENATE(B6,\" \",B7)","=CONCATENATE(B6, \" \", B7)"],"expectedResult":"Rian Hidayat","hint":"Gunakan =CONCATENATE(B6, \" \", B7) untuk menggabung teks."},{"label":"Nama Lengkap (Ampersand)","resultCell":{"row":8,"col":1},"validFormulas":["=B6&\" \"&B7","=B6 & \" \" & B7"],"expectedResult":"Rian Hidayat","hint":"Ketik: =B6 & \" \" & B7"},{"label":"Email Rapi (Lower)","resultCell":{"row":9,"col":1},"validFormulas":["=LOWER(B4)"],"expectedResult":"rian.h@yahoo.com","hint":"Gunakan =LOWER(B4) untuk mengecilkan huruf."},{"label":"Nama Kode Kartu (Upper)","resultCell":{"row":10,"col":1},"validFormulas":["=UPPER(B7)"],"expectedResult":"HIDAYAT","hint":"Gunakan =UPPER(B7) untuk membesarkan huruf."},{"label":"Total Kolom Data Teks","resultCell":{"row":11,"col":1},"validFormulas":["=COUNTA(B2:B3)"],"expectedResult":"2","hint":"Gunakan =COUNTA(B2:B3) untuk menghitung sel berisi teks."}]'::jsonb,
  70
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'left',
  'ekstrak-data',
  'Left (mengekstrak beberapa karakter paling kiri)',
  'Mengambil beberapa karakter paling depan/kiri dari suatu sel.',
  'Fungsi `LEFT` mengambil sejumlah karakter tertentu dari sebelah kiri teks.
Syntax: `=LEFT(teks, jumlah_karakter)`',
  'Ambil **3 karakter pertama** dari ID Transaksi di sel **A2** di dalam sel **B2**.',
  array['', 'ID Transaksi', 'Kode Wilayah']::text[],
  '[{"rowNum":1,"cells":[{"value":"ID Transaksi","header":true},{"value":"Kode Wilayah","header":true}]},{"rowNum":2,"cells":[{"value":"BDG10255","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=LEFT(A2,3)', '=LEFT(A2, 3)', '=LEFT(A2;3)']::text[],
  'BDG',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =LEFT(A2, 3)',
  NULL,
  0
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'mid',
  'ekstrak-data',
  'Mid (mengekstrak beberapa karakter di tengah)',
  'Mengambil karakter dari tengah sel berdasarkan urutan mulai dan panjang kata.',
  'Fungsi `MID` memotong teks dari posisi tengah. Membutuhkan tiga argumen:
1. **Teks**: Sel target.
2. **Mulai**: Karakter keberapa pemotongan dimulai.
3. **Jumlah**: Berapa banyak huruf yang ingin diambil.
Syntax: `=MID(teks, mulai_karakter, jumlah_karakter)`',
  'Ambil kode tahun dari ID Transaksi di sel **A2** (yaitu **4 karakter** dimulai dari **karakter ke-4**). Masukkan di sel **B2**.',
  array['', 'ID Transaksi', 'Tahun']::text[],
  '[{"rowNum":1,"cells":[{"value":"ID Transaksi","header":true},{"value":"Tahun","header":true}]},{"rowNum":2,"cells":[{"value":"BDG2026XYZ","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=MID(A2,4,4)', '=MID(A2, 4, 4)', '=MID(A2;4;4)']::text[],
  '2026',
  '{"row":1,"col":1}'::jsonb,
  'Pemotongan dimulai dari karakter ke-4 sepanjang 4 karakter: =MID(A2, 4, 4)',
  NULL,
  10
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'right',
  'ekstrak-data',
  'Right (mengekstrak beberapa karakter paling kanan)',
  'Mengambil beberapa karakter paling akhir/kanan dari suatu sel.',
  'Fungsi `RIGHT` mengambil sejumlah karakter tertentu dari sebelah kanan teks.
Syntax: `=RIGHT(teks, jumlah_karakter)`',
  'Ambil **3 karakter terakhir** dari Kode Barang di sel **A2** di dalam sel **B2**.',
  array['', 'Kode Barang', 'Nomor Seri']::text[],
  '[{"rowNum":1,"cells":[{"value":"Kode Barang","header":true},{"value":"Nomor Seri","header":true}]},{"rowNum":2,"cells":[{"value":"LAPTOP-089","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=RIGHT(A2,3)', '=RIGHT(A2, 3)', '=RIGHT(A2;3)']::text[],
  '089',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =RIGHT(A2, 3)',
  NULL,
  20
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'len',
  'ekstrak-data',
  'Len (menghitung banyak karakter/digit)',
  'Menghitung total digit huruf atau spasi dalam satu sel.',
  'Fungsi `LEN` (Length) menghitung jumlah total karakter di dalam suatu sel, termasuk huruf, angka, simbol, dan spasi kosong.
Syntax: `=LEN(teks)`',
  'Hitung berapa banyak karakter/digit pada kode produk di sel **A2** di dalam sel **B2**.',
  array['', 'Kode Produk', 'Panjang Karakter']::text[],
  '[{"rowNum":1,"cells":[{"value":"Kode Produk","header":true},{"value":"Panjang Karakter","header":true}]},{"rowNum":2,"cells":[{"value":"SMR-808-ID","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=LEN(A2)', '=len(a2)']::text[],
  '10',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =LEN(A2)',
  NULL,
  30
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'studi-kasus-ekstrak',
  'ekstrak-data',
  'Studi Kasus: Parsing SKU Barang',
  'Pecahkan kode SKU barang untuk dianalisis oleh departemen inventaris gudang.',
  'Di bab ini, kamu telah mempelajari cara mengambil potongan teks dari kiri, tengah, kanan, dan menghitung panjang karakter. Sekarang, mari lakukan pemecahan (parsing) pada kode SKU barang yang tersimpan di database gudang di sebelah kanan.',
  'Ambil 3 karakter pertama (LEFT) dari SKU B2 di sel C2. Ambil nilai harga di tengah menggunakan MID dari B3 di sel C3. Ambil kode cabang di kanan menggunakan RIGHT dari B4 di sel C4. Hitung panjang karakter SKU asli dengan LEN dari B5 di sel C5. Gunakan PROPER untuk merapikan nama cabang di C4 menjadi nama resmi di sel C6. Klik sel mana saja untuk mulai mengisinya.',
  array['', 'Keterangan', 'SKU Sumber', 'Hasil Ekstraksi']::text[],
  '[{"rowNum":1,"cells":[{"value":"Keterangan","header":true},{"value":"SKU Sumber","header":true},{"value":"Hasil Ekstraksi","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop Kantor"},{"value":"LAP-8000-JKT","highlight":true},{"value":"?","highlight":true}]},{"rowNum":3,"cells":[{"value":"Harga Satuan"},{"value":"LAP-8000-JKT"},{"value":"?","highlight":true}]},{"rowNum":4,"cells":[{"value":"Lokasi Cabang"},{"value":"LAP-8000-JKT"},{"value":"?","highlight":true}]},{"rowNum":5,"cells":[{"value":"Panjang Karakter SKU"},{"value":"LAP-8000-JKT"},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Nama Cabang Resmi"},{"value":""},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Laptop Kantor (LEFT)","resultCell":{"row":1,"col":2},"validFormulas":["=LEFT(B2,3)","=LEFT(B2, 3)"],"expectedResult":"LAP","hint":"Gunakan =LEFT(B2, 3) untuk mengambil 3 karakter pertama."},{"label":"Harga Satuan (MID)","resultCell":{"row":2,"col":2},"validFormulas":["=MID(B3,5,4)","=MID(B3, 5, 4)"],"expectedResult":"8000","hint":"Gunakan =MID(B3, 5, 4) untuk mengambil angka harga."},{"label":"Lokasi Cabang (RIGHT)","resultCell":{"row":3,"col":2},"validFormulas":["=RIGHT(B4,3)","=RIGHT(B4, 3)"],"expectedResult":"JKT","hint":"Gunakan =RIGHT(B4, 3) untuk mengambil 3 karakter kanan."},{"label":"Panjang Karakter SKU","resultCell":{"row":4,"col":2},"validFormulas":["=LEN(B5)"],"expectedResult":"12","hint":"Gunakan =LEN(B5) untuk menghitung panjang karakter."},{"label":"Nama Cabang Resmi","resultCell":{"row":5,"col":2},"validFormulas":["=PROPER(C4)"],"expectedResult":"Jkt","hint":"Gunakan =PROPER(C4) untuk memformat nama cabang."}]'::jsonb,
  40
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'vlookup',
  'cari-data',
  'Vlookup (mencari data di tabel vertikal)',
  'Mencari nilai kunci secara vertikal ke bawah pada kolom pertama tabel referensi.',
  'Fungsi `VLOOKUP` mencari nilai di kolom paling kiri dari tabel data, lalu mengembalikan nilai di baris yang sama dari kolom yang ditentukan.
Syntax: `=VLOOKUP(nilai_kunci, rentang_tabel, nomor_kolom, FALSE)`',
  'Temukan harga produk **Tablet** di sel **F2** dengan mencari kunci pencarian di sel **E2** pada rentang tabel referensi **A2:C5**. Ambil nilai dari kolom **3** (Harga) dan gunakan `FALSE`.',
  array['', 'A', 'B', 'C', 'D', 'E', 'F']::text[],
  '[{"rowNum":1,"cells":[{"value":"Produk","header":true,"borderTop":true,"borderBottom":true,"borderLeft":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Kategori","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Harga","header":true,"borderTop":true,"borderBottom":true,"borderRight":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":""},{"value":"Cari Produk","header":true,"borderTop":true,"borderBottom":true,"borderLeft":true,"bgColor":"bg-amber-50 dark:bg-amber-950/30"},{"value":"Hasil Harga","header":true,"borderTop":true,"borderBottom":true,"borderRight":true,"bgColor":"bg-amber-50 dark:bg-amber-950/30"}]},{"rowNum":2,"cells":[{"value":"Laptop","borderLeft":true,"bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":"Tech","bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":999,"borderRight":true,"bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":""},{"value":"Tablet","borderLeft":true,"borderBottom":true,"bgColor":"bg-amber-50/10 dark:bg-amber-950/10"},{"value":"?","highlight":true,"borderRight":true,"borderBottom":true,"bgColor":"bg-amber-50/10 dark:bg-amber-950/10"}]},{"rowNum":3,"cells":[{"value":"Ponsel","borderLeft":true,"bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":"Tech","bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":699,"borderRight":true,"bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":""},{"value":""},{"value":""}]},{"rowNum":4,"cells":[{"value":"Tablet","borderLeft":true,"bgColor":"bg-emerald-500/10 dark:bg-emerald-500/15"},{"value":"Tech","bgColor":"bg-emerald-500/10 dark:bg-emerald-500/15"},{"value":399,"highlight":true,"borderRight":true,"bgColor":"bg-emerald-500/10 dark:bg-emerald-500/15"},{"value":""},{"value":""},{"value":""}]},{"rowNum":5,"cells":[{"value":"Aksesoris","borderLeft":true,"borderBottom":true,"bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":"Office","borderBottom":true,"bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":45,"borderRight":true,"borderBottom":true,"bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":""},{"value":""},{"value":""}]}]'::jsonb,
  array['=VLOOKUP(E2,A2:C5,3,FALSE)', '=VLOOKUP(E2, A2:C5, 3, FALSE)', '=VLOOKUP(E2;A2:C5;3;FALSE)']::text[],
  '$399.00',
  '{"row":1,"col":5}'::jsonb,
  'Ketik: =VLOOKUP(E2, A2:C5, 3, FALSE)',
  NULL,
  0
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'hlookup',
  'cari-data',
  'Hlookup (mencari data di tabel horizontal)',
  'Mencari nilai secara horizontal di sepanjang baris teratas referensi.',
  'Fungsi `HLOOKUP` mencari nilai kunci secara horizontal di baris teratas, lalu mengambil data di kolom yang sama pada baris keberapa yang diinstruksikan.
Syntax: `=HLOOKUP(nilai_kunci, rentang_tabel, nomor_baris, FALSE)`',
  'Cari nominal **Bonus** karyawan di sel **B4**. Cari sel kunci **C1** di dalam tabel referensi **A1:D3** dan ambil nilai pada baris ke-**3**. Gunakan `FALSE`.',
  array['', 'A', 'B', 'C', 'D']::text[],
  '[{"rowNum":1,"cells":[{"value":"Kategori","header":true,"borderTop":true,"borderBottom":true,"borderLeft":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Gaji Pokok","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Bonus","header":true,"highlight":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-emerald-500/10 dark:bg-emerald-500/15"},{"value":"Tunjangan","header":true,"borderTop":true,"borderBottom":true,"borderRight":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"}]},{"rowNum":2,"cells":[{"value":"Kode","borderLeft":true,"bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":"BASE","bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":"BONUS_Q","bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":"ALLOW","borderRight":true,"bgColor":"bg-blue-50/10 dark:bg-blue-950/10"}]},{"rowNum":3,"cells":[{"value":"Nilai","borderLeft":true,"borderBottom":true,"bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":5000,"borderBottom":true,"bgColor":"bg-blue-50/10 dark:bg-blue-950/10"},{"value":1200,"highlight":true,"borderBottom":true,"bgColor":"bg-emerald-500/10 dark:bg-emerald-500/15"},{"value":800,"borderRight":true,"borderBottom":true,"bgColor":"bg-blue-50/10 dark:bg-blue-950/10"}]},{"rowNum":4,"cells":[{"value":"Cari: Bonus","borderLeft":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-amber-50/10 dark:bg-amber-950/10"},{"value":"?","highlight":true,"borderRight":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-amber-50/10 dark:bg-amber-950/10"},{"value":"Hasil Pencarian"},{"value":""}]}]'::jsonb,
  array['=HLOOKUP(C1,A1:D3,3,FALSE)', '=HLOOKUP(C1, A1:D3, 3, FALSE)', '=HLOOKUP(C1;A1:D3;3;FALSE)']::text[],
  '1,200',
  '{"row":3,"col":1}'::jsonb,
  'Ketik: =HLOOKUP(C1, A1:D3, 3, FALSE)',
  NULL,
  10
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'index',
  'cari-data',
  'Index (mencari data di baris dan kolom tertentu)',
  'Mengambil nilai di dalam baris dan kolom tertentu pada suatu rentang.',
  'Fungsi `INDEX` mengambil isi sel berdasarkan koordinat baris dan kolom yang diberikan di dalam suatu tabel referensi.
Syntax: `=INDEX(array, nomor_baris, nomor_kolom)`',
  'Ambil nilai harga di baris **3** dan kolom **3** dari rentang tabel **A2:C5** di dalam sel **E2**.',
  array['', 'A', 'B', 'C', 'D', 'E']::text[],
  '[{"rowNum":1,"cells":[{"value":"Produk","header":true},{"value":"Kategori","header":true},{"value":"Harga","header":true},{"value":""},{"value":"Hasil Index","header":true}]},{"rowNum":2,"cells":[{"value":"Lampu"},{"value":"Alat"},{"value":120},{"value":""},{"value":"?","highlight":true}]},{"rowNum":3,"cells":[{"value":"Kursi"},{"value":"Furnitur"},{"value":450}]},{"rowNum":4,"cells":[{"value":"Meja"},{"value":"Furnitur"},{"value":800,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Lemari"},{"value":"Furnitur"},{"value":1500}]}]'::jsonb,
  array['=INDEX(A2:C5,3,3)', '=INDEX(A2:C5, 3, 3)', '=INDEX(A2:C5;3;3)']::text[],
  '800',
  '{"row":1,"col":4}'::jsonb,
  'Ketik: =INDEX(A2:C5, 3, 3)',
  NULL,
  20
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'match',
  'cari-data',
  'Match (mencari posisi sebuah data pada baris/kolom tertentu)',
  'Mengembalikan nomor indeks urutan baris data yang dicari.',
  'Fungsi `MATCH` mencari posisi urutan baris/kolom dari suatu nilai di dalam satu kolom atau baris tertentu. Sangat berguna untuk mengetahui urutan posisi keberapa data tersebut berada.
Syntax: `=MATCH(lookup_value, lookup_array, [match_type])` (Gunakan `0` untuk kecocokan persis).',
  'Cari posisi baris produk **"Meja"** di dalam rentang kolom produk **A2:A5**. Tulis rumusnya di sel **D2**.',
  array['', 'Produk', 'Harga', 'Keterangan', 'Posisi Meja']::text[],
  '[{"rowNum":1,"cells":[{"value":"Produk","header":true},{"value":"Harga","header":true},{"value":"Keterangan","header":true},{"value":"Posisi Meja","header":true}]},{"rowNum":2,"cells":[{"value":"Kursi"},{"value":200},{"value":"Tersedia"},{"value":"?","highlight":true}]},{"rowNum":3,"cells":[{"value":"Lemari"},{"value":500},{"value":"Tersedia"},{"value":""}]},{"rowNum":4,"cells":[{"value":"Meja","highlight":true},{"value":350},{"value":"Habis"},{"value":""}]},{"rowNum":5,"cells":[{"value":"Rak"},{"value":120},{"value":"Tersedia"},{"value":""}]}]'::jsonb,
  array['=MATCH("Meja",A2:A5,0)', '=MATCH("Meja", A2:A5, 0)', '=MATCH(A4,A2:A5,0)']::text[],
  '3',
  '{"row":1,"col":3}'::jsonb,
  'Ketik: =MATCH("Meja", A2:A5, 0)',
  NULL,
  30
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'indexmatch',
  'cari-data',
  'Indexmatch (gabungan rumus Index dan Match)',
  'Penggabungan INDEX dan MATCH untuk mencari data fleksibel dari kolom mana saja.',
  'INDEX MATCH adalah pengganti VLOOKUP yang jauh lebih dinamis karena bisa mencari data ke arah kiri (VLOOKUP hanya bisa mencari data ke kanan). MATCH digunakan untuk mencari nomor baris secara dinamis, dan INDEX menarik datanya.
Syntax: `=INDEX(kolom_yang_ingin_diambil, MATCH(kunci, kolom_pencarian, 0))`',
  'Cari harga untuk nama produk di sel **D2** ("Meja") menggunakan formula gabungan INDEX dan MATCH. Ambil dari rentang harga **B2:B5** dan cari di kolom produk **A2:A5**.',
  array['', 'Produk', 'Harga', 'Cari: Meja', 'Hasil']::text[],
  '[{"rowNum":1,"cells":[{"value":"Produk","header":true},{"value":"Harga","header":true},{"value":"Cari: Meja","header":true},{"value":"Hasil","header":true}]},{"rowNum":2,"cells":[{"value":"Kursi"},{"value":200},{"value":"Meja"},{"value":"?","highlight":true}]},{"rowNum":3,"cells":[{"value":"Lemari"},{"value":500}]},{"rowNum":4,"cells":[{"value":"Meja","highlight":true},{"value":350,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Rak"},{"value":120}]}]'::jsonb,
  array['=INDEX(B2:B5,MATCH(D2,A2:A5,0))', '=INDEX(B2:B5, MATCH(D2, A2:A5, 0))', '=INDEX(B2:B5;MATCH(D2;A2:A5;0))']::text[],
  '350',
  '{"row":1,"col":3}'::jsonb,
  'Ketik: =INDEX(B2:B5, MATCH(D2, A2:A5, 0))',
  NULL,
  40
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'studi-kasus-cari',
  'cari-data',
  'Studi Kasus: Sistem Invoice & Inventaris',
  'Gunakan data lookup (VLOOKUP, INDEX, MATCH) untuk menarik informasi barang dan menghitung total harga.',
  'Di bab ini, kamu telah mempelajari cara mencari data secara dinamis. Sekarang, mari lengkapi sistem invoice pemesanan barang dengan menarik deskripsi produk, harga satuan, mencocokkan indeks baris, dan menghitung total tagihan.',
  'Tarik nama barang berdasarkan Kode Barang A2 di sel C2 menggunakan VLOOKUP dari tabel referensi A9:C12. Tarik harga satuan di D2 menggunakan VLOOKUP. Hitung total biaya kotor di E2 dengan mengalikan Jumlah B2 dan harga satuan D2. Cari nomor baris ''Laptop'' di C3 menggunakan MATCH. Gunakan INDEX MATCH untuk mencari harga ''Proyektor'' di C4. Terakhir, hitung total bersih dengan membulatkan E2 ke ribuan terdekat menggunakan MROUND di sel C5. Klik sel mana saja untuk mulai mengisinya.',
  array['', 'Kode / Cari', 'Jumlah / Parameter', 'Nama / Baris', 'Harga / Hasil', 'Total']::text[],
  '[{"rowNum":1,"cells":[{"value":"Kode / Cari","header":true},{"value":"Jumlah / Parameter","header":true},{"value":"Nama / Baris","header":true},{"value":"Harga / Hasil","header":true},{"value":"Total","header":true}]},{"rowNum":2,"cells":[{"value":"PRD03"},{"value":5},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true}]},{"rowNum":3,"cells":[{"value":"Laptop"},{"value":"Match"},{"value":"?","highlight":true},{"value":""},{"value":""}]},{"rowNum":4,"cells":[{"value":"Proyektor"},{"value":"IndexMatch"},{"value":"?","highlight":true},{"value":""},{"value":""}]},{"rowNum":5,"cells":[{"value":"Bulat Ribuan"},{"value":"MROUND"},{"value":"?","highlight":true},{"value":""},{"value":""}]},{"rowNum":6,"cells":[{"value":""},{"value":""},{"value":""},{"value":""},{"value":""}]},{"rowNum":7,"cells":[{"value":"Tabel Referensi Gudang:","header":true},{"value":""},{"value":""},{"value":""},{"value":""}]},{"rowNum":8,"cells":[{"value":"Kode","header":true},{"value":"Barang","header":true},{"value":"Harga","header":true},{"value":""},{"value":""}]},{"rowNum":9,"cells":[{"value":"PRD01"},{"value":"Mouse"},{"value":150},{"value":""},{"value":""}]},{"rowNum":10,"cells":[{"value":"PRD02"},{"value":"Keyboard"},{"value":300},{"value":""},{"value":""}]},{"rowNum":11,"cells":[{"value":"PRD03"},{"value":"Laptop"},{"value":8070},{"value":""},{"value":""}]},{"rowNum":12,"cells":[{"value":"PRD04"},{"value":"Proyektor"},{"value":4500},{"value":""},{"value":""}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Nama Barang (VLOOKUP)","resultCell":{"row":1,"col":2},"validFormulas":["=VLOOKUP(A2,A9:C12,2,FALSE)","=VLOOKUP(A2, A9:C12, 2, FALSE)","=VLOOKUP(A2;A9:C12;2;0)"],"expectedResult":"Laptop","hint":"Gunakan =VLOOKUP(A2, A9:C12, 2, FALSE) untuk mencari nama barang."},{"label":"Harga Satuan (VLOOKUP)","resultCell":{"row":1,"col":3},"validFormulas":["=VLOOKUP(A2,A9:C12,3,FALSE)","=VLOOKUP(A2, A9:C12, 3, FALSE)","=VLOOKUP(A2;A9:C12;3;0)"],"expectedResult":"8070","hint":"Gunakan =VLOOKUP(A2, A9:C12, 3, FALSE) untuk mencari harga."},{"label":"Total Biaya Kotor","resultCell":{"row":1,"col":4},"validFormulas":["=B2*D2","=B2 * D2"],"expectedResult":"40350","hint":"Ketik: =B2 * D2"},{"label":"Cari Baris Laptop (MATCH)","resultCell":{"row":2,"col":2},"validFormulas":["=MATCH(A3,B9:B12,0)","=MATCH(A3, B9:B12, 0)"],"expectedResult":"3","hint":"Gunakan =MATCH(A3, B9:B12, 0) untuk mencari baris."},{"label":"Harga Proyektor (INDEX MATCH)","resultCell":{"row":3,"col":2},"validFormulas":["=INDEX(C9:C12,MATCH(A4,B9:B12,0))","=INDEX(C9:C12, MATCH(A4, B9:B12, 0))"],"expectedResult":"4500","hint":"Gunakan =INDEX(C9:C12, MATCH(A4, B9:B12, 0))"},{"label":"Total Bersih MROUND","resultCell":{"row":4,"col":2},"validFormulas":["=MROUND(E2,1000)","=MROUND(E2, 1000)"],"expectedResult":"40000","hint":"Gunakan =MROUND(E2, 1000) untuk membulatkan ke ribuan terdekat."}]'::jsonb,
  50
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'sumif',
  'kriteria-data',
  'Sumif (menjumlahkan data dengan satu kriteria)',
  'Menjumlahkan nilai angka hanya jika sel pasangannya memenuhi satu kriteria.',
  'Fungsi `SUMIF` menjumlahkan data angka yang cocok dengan kriteria tertentu.
Syntax: `=SUMIF(range_kriteria, kriteria, range_angka_jumlah)`',
  'Jumlahkan total biaya di sel **B6** untuk baris barang yang masuk kategori **"Kantor"** (kriteria di kolom **A2:A5**, harga di **B2:B5**).',
  array['', 'Kategori', 'Harga']::text[],
  '[{"rowNum":1,"cells":[{"value":"Kategori","header":true},{"value":"Harga","header":true}]},{"rowNum":2,"cells":[{"value":"Kantor","highlight":true},{"value":100,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Pribadi"},{"value":50}]},{"rowNum":4,"cells":[{"value":"Kantor","highlight":true},{"value":250,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Pribadi"},{"value":80}]},{"rowNum":6,"cells":[{"value":"Total Kantor"},{"value":"?","highlight":true}]}]'::jsonb,
  array['=SUMIF(A2:A5,"Kantor",B2:B5)', '=SUMIF(A2:A5, "Kantor", B2:B5)', '=SUMIF(A2:A5;"Kantor";B2:B5)']::text[],
  '350',
  '{"row":5,"col":1}'::jsonb,
  'Ketik: =SUMIF(A2:A5, "Kantor", B2:B5)',
  NULL,
  0
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'sumifs',
  'kriteria-data',
  'Sumifs (menjumlahkan data dengan beberapa kriteria)',
  'Menjumlahkan nilai sel yang memenuhi beberapa syarat sekaligus.',
  'Berbeda dengan SUMIF, pada `SUMIFS` (jamak) letak kolom angka yang ingin dijumlahkan berada di paling depan.
Syntax: `=SUMIFS(sum_range, range_kriteria1, kriteria1, range_kriteria2, kriteria2, ...)`',
  'Jumlahkan penjualan di sel **C6** (kolom **C2:C5**) khusus untuk produk **"Laptop"** (kolom **A2:A5**) yang berada di wilayah **"Barat"** (kolom **B2:B5**).',
  array['', 'Produk', 'Wilayah', 'Penjualan']::text[],
  '[{"rowNum":1,"cells":[{"value":"Produk","header":true},{"value":"Wilayah","header":true},{"value":"Penjualan","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop","highlight":true},{"value":"Timur"},{"value":8000}]},{"rowNum":3,"cells":[{"value":"Mouse"},{"value":"Barat"},{"value":300}]},{"rowNum":4,"cells":[{"value":"Laptop","highlight":true},{"value":"Barat","highlight":true},{"value":9500,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Laptop","highlight":true},{"value":"Barat","highlight":true},{"value":4000,"highlight":true}]},{"rowNum":6,"cells":[{"value":"Laptop Barat"},{"value":"Total","header":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=SUMIFS(C2:C5,A2:A5,"Laptop",B2:B5,"Barat")', '=SUMIFS(C2:C5, A2:A5, "Laptop", B2:B5, "Barat")', '=SUMIFS(C2:C5;A2:A5;"Laptop";B2:B5;"Barat")']::text[],
  '13,500',
  '{"row":5,"col":2}'::jsonb,
  'Ketik: =SUMIFS(C2:C5, A2:A5, "Laptop", B2:B5, "Barat")',
  NULL,
  10
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'averageif',
  'kriteria-data',
  'Averageif (menghitung rata-rata dengan satu kriteria)',
  'Mencari rata-rata nilai angka yang memenuhi satu kriteria.',
  'Fungsi `AVERAGEIF` mencari nilai rata-rata bersyarat.
Syntax: `=AVERAGEIF(range_kriteria, kriteria, range_angka_rata_rata)`',
  'Hitung rata-rata harga di sel **B6** khusus untuk item dengan kategori **"Food"** (kriteria di kolom **A2:A5**, harga di **B2:B5**).',
  array['', 'Kategori', 'Harga']::text[],
  '[{"rowNum":1,"cells":[{"value":"Kategori","header":true},{"value":"Harga","header":true}]},{"rowNum":2,"cells":[{"value":"Food","highlight":true},{"value":30,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Tech"},{"value":500}]},{"rowNum":4,"cells":[{"value":"Food","highlight":true},{"value":50,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Tech"},{"value":150}]},{"rowNum":6,"cells":[{"value":"Rata Food"},{"value":"?","highlight":true}]}]'::jsonb,
  array['=AVERAGEIF(A2:A5,"Food",B2:B5)', '=AVERAGEIF(A2:A5, "Food", B2:B5)', '=AVERAGEIF(A2:A5;"Food";B2:B5)']::text[],
  '40',
  '{"row":5,"col":1}'::jsonb,
  'Ketik: =AVERAGEIF(A2:A5, "Food", B2:B5)',
  NULL,
  20
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'averageifs',
  'kriteria-data',
  'Averageifs (menghitung rata-rata dengan beberapa kriteria)',
  'Mencari rata-rata angka yang memenuhi beberapa kriteria sekaligus.',
  'Sama seperti SUMIFS, kolom angka yang dirata-rata berada di parameter pertama.
Syntax: `=AVERAGEIFS(average_range, criteria_range1, criteria1, criteria_range2, criteria2, ...)`',
  'Rata-ratakan nilai ujian di sel **C6** khusus untuk siswa gender **"P"** (Perempuan) (kolom **A2:A5**) yang memiliki nilai kelas di atas **70** (kolom **B2:B5**). Rata-ratakan kolom nilai **C2:C5**.',
  array['', 'Gender', 'Kelas', 'Nilai Ujian']::text[],
  '[{"rowNum":1,"cells":[{"value":"Gender","header":true},{"value":"Kelas","header":true},{"value":"Nilai Ujian","header":true}]},{"rowNum":2,"cells":[{"value":"P","highlight":true},{"value":80,"highlight":true},{"value":90,"highlight":true}]},{"rowNum":3,"cells":[{"value":"L"},{"value":85},{"value":75}]},{"rowNum":4,"cells":[{"value":"P","highlight":true},{"value":60},{"value":65}]},{"rowNum":5,"cells":[{"value":"P","highlight":true},{"value":90,"highlight":true},{"value":80,"highlight":true}]},{"rowNum":6,"cells":[{"value":"Rata-rata P > 70"},{"value":"Hitung","header":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=AVERAGEIFS(C2:C5,A2:A5,"P",B2:B5,">70")', '=AVERAGEIFS(C2:C5, A2:A5, "P", B2:B5, ">70")', '=AVERAGEIFS(C2:C5;A2:A5;"P";B2:B5;">70")']::text[],
  '85',
  '{"row":5,"col":2}'::jsonb,
  'Ketik: =AVERAGEIFS(C2:C5, A2:A5, "P", B2:B5, ">70")',
  NULL,
  30
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'countif',
  'kriteria-data',
  'Countif (menghitung banyak data dengan satu kriteria)',
  'Menghitung jumlah sel yang memenuhi satu kriteria saja.',
  'Fungsi `COUNTIF` menghitung kemunculan data berdasarkan satu kriteria.
Syntax: `=COUNTIF(range, kriteria)`',
  'Hitung berapa banyak transaksi berstatus **"Sukses"** di sel **C6** berdasarkan data kolom status **C2:C5**.',
  array['', 'ID', 'Pelanggan', 'Status']::text[],
  '[{"rowNum":1,"cells":[{"value":"ID","header":true},{"value":"Pelanggan","header":true},{"value":"Status","header":true}]},{"rowNum":2,"cells":[{"value":"TX1"},{"value":"Aditya"},{"value":"Sukses","highlight":true}]},{"rowNum":3,"cells":[{"value":"TX2"},{"value":"Bambang"},{"value":"Tertunda","highlight":true}]},{"rowNum":4,"cells":[{"value":"TX3"},{"value":"Citra"},{"value":"Sukses","highlight":true}]},{"rowNum":5,"cells":[{"value":"TX4"},{"value":"Dewi"},{"value":"Sukses","highlight":true}]},{"rowNum":6,"cells":[{"value":"Total Sukses"},{"value":"Jumlah"},{"value":"?","highlight":true}]}]'::jsonb,
  array['=COUNTIF(C2:C5,"Sukses")', '=COUNTIF(C2:C5, "Sukses")', '=countif(c2:c5,"Sukses")']::text[],
  '3',
  '{"row":5,"col":2}'::jsonb,
  'Ketik: =COUNTIF(C2:C5, "Sukses")',
  NULL,
  40
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'countifs',
  'kriteria-data',
  'Countifs (menghitung banyak data dengan beberapa kriteria)',
  'Menghitung jumlah baris data yang memenuhi beberapa kriteria sekaligus.',
  'Fungsi `COUNTIFS` menghitung jumlah sel yang memenuhi semua kriteria yang dipasangkan.
Syntax: `=COUNTIFS(range1, kriteria1, range2, kriteria2, ...)`',
  'Hitung di sel **C6** berapa banyak barang dengan jenis **"Buku"** (kolom **A2:A5**) yang memiliki stok **di atas 10** (kolom **B2:B5**).',
  array['', 'Barang', 'Stok', 'Hasil Countifs']::text[],
  '[{"rowNum":1,"cells":[{"value":"Barang","header":true},{"value":"Stok","header":true},{"value":"Hasil Countifs","header":true}]},{"rowNum":2,"cells":[{"value":"Buku","highlight":true},{"value":15,"highlight":true},{"value":"?","highlight":true}]},{"rowNum":3,"cells":[{"value":"Pena"},{"value":8}]},{"rowNum":4,"cells":[{"value":"Buku","highlight":true},{"value":5,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Buku","highlight":true},{"value":20,"highlight":true}]},{"rowNum":6,"cells":[{"value":"Total Stok Buku > 10"},{"value":"Hitung"}]}]'::jsonb,
  array['=COUNTIFS(A2:A5,"Buku",B2:B5,">10")', '=COUNTIFS(A2:A5, "Buku", B2:B5, ">10")', '=COUNTIFS(A2:A5;"Buku";B2:B5;">10")']::text[],
  '2',
  '{"row":1,"col":2}'::jsonb,
  'Ketik: =COUNTIFS(A2:A5, "Buku", B2:B5, ">10")',
  NULL,
  50
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'maxifs',
  'kriteria-data',
  'Maxifs (mencari nilai tertinggi dengan satu/beberapa kriteria)',
  'Mencari nilai tertinggi yang memenuhi satu atau beberapa kriteria.',
  'Fungsi `MAXIFS` menyaring data berdasarkan syarat lalu mengembalikan angka paling besar dari kelompok tersebut.
Syntax: `=MAXIFS(max_range, criteria_range1, criteria1, ...)`',
  'Temukan suhu tertinggi di sel **B6** khusus untuk hari berstatus **"Cerah"** (kriteria status di **C2:C5**, suhu di **B2:B5**).',
  array['', 'Hari', 'Suhu', 'Status']::text[],
  '[{"rowNum":1,"cells":[{"value":"Hari","header":true},{"value":"Suhu","header":true},{"value":"Status","header":true}]},{"rowNum":2,"cells":[{"value":"Senin"},{"value":72},{"value":"Hujan"}]},{"rowNum":3,"cells":[{"value":"Selasa"},{"value":85,"highlight":true},{"value":"Cerah","highlight":true}]},{"rowNum":4,"cells":[{"value":"Rabu"},{"value":80,"highlight":true},{"value":"Cerah","highlight":true}]},{"rowNum":5,"cells":[{"value":"Kamis"},{"value":74},{"value":"Berawan"}]},{"rowNum":6,"cells":[{"value":"Suhu Max Cerah"},{"value":"?","highlight":true},{"value":"Analisis"}]}]'::jsonb,
  array['=MAXIFS(B2:B5,C2:C5,"Cerah")', '=MAXIFS(B2:B5, C2:C5, "Cerah")', '=MAXIFS(B2:B5;C2:C5;"Cerah")']::text[],
  '85',
  '{"row":5,"col":1}'::jsonb,
  'Ketik: =MAXIFS(B2:B5, C2:C5, "Cerah")',
  NULL,
  60
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'minifs',
  'kriteria-data',
  'Minifs (mencari nilai terendah dengan satu/beberapa kriteria)',
  'Mencari nilai terendah yang memenuhi satu atau beberapa kriteria.',
  'Fungsi `MINIFS` menyaring data berdasarkan kriteria lalu mengembalikan angka terkecil dari kelompok tersebut.
Syntax: `=MINIFS(min_range, criteria_range1, criteria1, ...)`',
  'Temukan harga termurah di sel **B6** khusus untuk barang kategori **"Tech"** (kategori di **A2:A5**, harga di **B2:B5**).',
  array['', 'Kategori', 'Harga', 'Keterangan']::text[],
  '[{"rowNum":1,"cells":[{"value":"Kategori","header":true},{"value":"Harga","header":true},{"value":"Keterangan","header":true}]},{"rowNum":2,"cells":[{"value":"Tech","highlight":true},{"value":999,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Office"},{"value":45}]},{"rowNum":4,"cells":[{"value":"Tech","highlight":true},{"value":150,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Office"},{"value":80}]},{"rowNum":6,"cells":[{"value":"Tech Termurah"},{"value":"?","highlight":true},{"value":"Analisis"}]}]'::jsonb,
  array['=MINIFS(B2:B5,A2:A5,"Tech")', '=MINIFS(B2:B5, A2:A5, "Tech")', '=MINIFS(B2:B5;A2:A5;"Tech")']::text[],
  '150',
  '{"row":5,"col":1}'::jsonb,
  'Ketik: =MINIFS(B2:B5, A2:A5, "Tech")',
  NULL,
  70
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'studi-kasus-kriteria',
  'kriteria-data',
  'Studi Kasus: Analisis Penjualan Cabang',
  'Gunakan rumus kondisional bersyarat (SUMIF, COUNTIF, AVERAGEIF, dll.) untuk menganalisis performa sales.',
  'Di bab ini, kamu telah mempelajari rumus-rumus dengan kriteria. Sekarang, mari bantu manajer menganalisis data penjualan agen berdasarkan wilayah dan performa. Kamu akan menjumlahkan penjualan untuk wilayah tertentu, menghitung transaksi, mencari rata-rata bersyarat, serta mencari nilai tertinggi/terendah bersyarat.',
  'Analisis tabel transaksi agen di sebelah kanan. Hitung total penjualan wilayah ''Barat'' menggunakan SUMIF di F2. Hitung banyak transaksi di atas 5000 menggunakan COUNTIF di F3. Cari rata-rata penjualan wilayah ''Timur'' menggunakan AVERAGEIF di F4. Cari total penjualan agen ''Rian'' untuk produk ''Laptop'' menggunakan SUMIFS di F5. Cari transaksi ''Buku'' di wilayah ''Timur'' menggunakan COUNTIFS di F6. Cari penjualan tertinggi di wilayah ''Barat'' menggunakan MAXIFS di F7. Cari penjualan terendah di wilayah ''Barat'' menggunakan MINIFS di F8. Klik sel mana saja untuk mulai mengisinya.',
  array['', 'Nama Agen', 'Wilayah', 'Produk', 'Penjualan', 'Keterangan Soal', 'Hasil Analisis']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Agen","header":true},{"value":"Wilayah","header":true},{"value":"Produk","header":true},{"value":"Penjualan","header":true},{"value":"Keterangan Soal","header":true},{"value":"Hasil Analisis","header":true}]},{"rowNum":2,"cells":[{"value":"Rian"},{"value":"Barat"},{"value":"Laptop"},{"value":8000},{"value":"Total Penjualan Barat (SUMIF)"},{"value":"?","highlight":true}]},{"rowNum":3,"cells":[{"value":"Siti"},{"value":"Timur"},{"value":"Buku"},{"value":1500},{"value":"Transaksi Penjualan > 5000 (COUNTIF)"},{"value":"?","highlight":true}]},{"rowNum":4,"cells":[{"value":"Rian"},{"value":"Timur"},{"value":"Laptop"},{"value":6000},{"value":"Rata-rata Penjualan Timur (AVERAGEIF)"},{"value":"?","highlight":true}]},{"rowNum":5,"cells":[{"value":"Budi"},{"value":"Barat"},{"value":"Buku"},{"value":1200},{"value":"Total Laptop Rian (SUMIFS)"},{"value":"?","highlight":true}]},{"rowNum":6,"cells":[{"value":"Siti"},{"value":"Barat"},{"value":"Laptop"},{"value":9000},{"value":"Buku Timur (COUNTIFS)"},{"value":"?","highlight":true}]},{"rowNum":7,"cells":[{"value":""},{"value":""},{"value":""},{"value":""},{"value":"Penjualan Tertinggi Barat (MAXIFS)"},{"value":"?","highlight":true}]},{"rowNum":8,"cells":[{"value":""},{"value":""},{"value":""},{"value":""},{"value":"Penjualan Terendah Barat (MINIFS)"},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Total Penjualan Barat (SUMIF)","resultCell":{"row":1,"col":5},"validFormulas":["=SUMIF(B2:B6,\"Barat\",D2:D6)","=SUMIF(B2:B6, \"Barat\", D2:D6)","=SUMIF(B2:B6;\"Barat\";D2:D6)"],"expectedResult":"18200","hint":"Gunakan =SUMIF(B2:B6, \"Barat\", D2:D6) untuk menjumlahkan dengan wilayah Barat."},{"label":"Transaksi Penjualan > 5000 (COUNTIF)","resultCell":{"row":2,"col":5},"validFormulas":["=COUNTIF(D2:D6,\">5000\")","=COUNTIF(D2:D6, \">5000\")","=COUNTIF(D2:D6;\">5000\")"],"expectedResult":"3","hint":"Gunakan =COUNTIF(D2:D6, \">5000\") untuk menghitung transaksi di atas 5000."},{"label":"Rata-rata Penjualan Timur (AVERAGEIF)","resultCell":{"row":3,"col":5},"validFormulas":["=AVERAGEIF(B2:B6,\"Timur\",D2:D6)","=AVERAGEIF(B2:B6, \"Timur\", D2:D6)","=AVERAGEIF(B2:B6;\"Timur\";D2:D6)"],"expectedResult":"3750","hint":"Gunakan =AVERAGEIF(B2:B6, \"Timur\", D2:D6) untuk merata-rata wilayah Timur."},{"label":"Total Laptop Rian (SUMIFS)","resultCell":{"row":4,"col":5},"validFormulas":["=SUMIFS(D2:D6,A2:A6,\"Rian\",C2:C6,\"Laptop\")","=SUMIFS(D2:D6, A2:A6, \"Rian\", C2:C6, \"Laptop\")"],"expectedResult":"14000","hint":"Gunakan =SUMIFS(D2:D6, A2:A6, \"Rian\", C2:C6, \"Laptop\") untuk menjumlahkan berdasarkan banyak syarat."},{"label":"Buku Timur (COUNTIFS)","resultCell":{"row":5,"col":5},"validFormulas":["=COUNTIFS(C2:C6,\"Buku\",B2:B6,\"Timur\")","=COUNTIFS(C2:C6, \"Buku\", B2:B6, \"Timur\")"],"expectedResult":"1","hint":"Gunakan =COUNTIFS(C2:C6, \"Buku\", B2:B6, \"Timur\") untuk menghitung baris dengan syarat Buku dan Timur."},{"label":"Penjualan Tertinggi Barat (MAXIFS)","resultCell":{"row":6,"col":5},"validFormulas":["=MAXIFS(D2:D6,B2:B6,\"Barat\")","=MAXIFS(D2:D6, B2:B6, \"Barat\")"],"expectedResult":"9000","hint":"Gunakan =MAXIFS(D2:D6, B2:B6, \"Barat\") untuk mencari penjualan tertinggi di Barat."},{"label":"Penjualan Terendah Barat (MINIFS)","resultCell":{"row":7,"col":5},"validFormulas":["=MINIFS(D2:D6,B2:B6,\"Barat\")","=MINIFS(D2:D6, B2:B6, \"Barat\")"],"expectedResult":"1200","hint":"Gunakan =MINIFS(D2:D6, B2:B6, \"Barat\") untuk mencari penjualan terendah di Barat."}]'::jsonb,
  80
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'now',
  'waktu-data',
  'Now (menginput tanggal dan waktu sekarang)',
  'Memasukkan informasi tanggal dan jam aktif saat ini.',
  'Fungsi `NOW` mengembalikan tanggal dan waktu saat ini secara dinamis. Fungsi ini tidak membutuhkan argumen apa pun.
Syntax: `=NOW()`',
  'Masukkan informasi tanggal dan waktu saat ini di sel **A2** menggunakan fungsi `NOW`.',
  array['', 'Waktu Sekarang']::text[],
  '[{"rowNum":1,"cells":[{"value":"Waktu Sekarang","header":true}]},{"rowNum":2,"cells":[{"value":"?","highlight":true}]}]'::jsonb,
  array['=NOW()', '=now()']::text[],
  '02/06/2026 15:51',
  '{"row":1,"col":0}'::jsonb,
  'Ketik: =NOW()',
  NULL,
  0
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'today',
  'waktu-data',
  'Today (menginput tanggal hari ini)',
  'Memasukkan informasi tanggal hari ini saja (tanpa jam).',
  'Fungsi `TODAY` mengembalikan tanggal hari ini secara dinamis.
Syntax: `=TODAY()`',
  'Masukkan tanggal hari ini di sel **A2** menggunakan fungsi `TODAY`.',
  array['', 'Tanggal Hari Ini']::text[],
  '[{"rowNum":1,"cells":[{"value":"Tanggal Hari Ini","header":true}]},{"rowNum":2,"cells":[{"value":"?","highlight":true}]}]'::jsonb,
  array['=TODAY()', '=today()']::text[],
  '02/06/2026',
  '{"row":1,"col":0}'::jsonb,
  'Ketik: =TODAY()',
  NULL,
  10
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'day',
  'waktu-data',
  'Day (mengekstrak hari dari tanggal lengkap)',
  'Mengambil informasi tanggal (hari) dari format tanggal lengkap.',
  'Fungsi `DAY` mengembalikan bilangan bulat antara 1 hingga 31 yang mewakili hari/tanggal dari suatu sel berisi tanggal lengkap.
Syntax: `=DAY(sel_tanggal)`',
  'Ambil nilai hari/tanggal dari tanggal lengkap di sel **A2** di dalam sel **B2**.',
  array['', 'Tanggal Lengkap', 'Hari (Tanggal)']::text[],
  '[{"rowNum":1,"cells":[{"value":"Tanggal Lengkap","header":true},{"value":"Hari (Tanggal)","header":true}]},{"rowNum":2,"cells":[{"value":"2026-06-15","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=DAY(A2)', '=day(a2)']::text[],
  '15',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =DAY(A2)',
  NULL,
  20
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'month',
  'waktu-data',
  'Month (mengekstrak bulan dari tanggal lengkap)',
  'Mengambil informasi angka bulan (1-12) dari tanggal lengkap.',
  'Fungsi `MONTH` mengembalikan angka 1 sampai 12 yang melambangkan bulan dari data tanggal.
Syntax: `=MONTH(sel_tanggal)`',
  'Ambil angka bulan dari sel **A2** di dalam sel **B2**.',
  array['', 'Tanggal Lengkap', 'Bulan']::text[],
  '[{"rowNum":1,"cells":[{"value":"Tanggal Lengkap","header":true},{"value":"Bulan","header":true}]},{"rowNum":2,"cells":[{"value":"2026-06-15","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=MONTH(A2)', '=month(a2)']::text[],
  '6',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =MONTH(A2)',
  NULL,
  30
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'year',
  'waktu-data',
  'Year (mengekstrak tahun dari tanggal lengkap)',
  'Mengambil informasi angka tahun 4 digit dari tanggal lengkap.',
  'Fungsi `YEAR` mengembalikan angka tahun (4 digit) dari data tanggal.
Syntax: `=YEAR(sel_tanggal)`',
  'Ambil angka tahun dari sel **A2** di dalam sel **B2**.',
  array['', 'Tanggal Lengkap', 'Tahun']::text[],
  '[{"rowNum":1,"cells":[{"value":"Tanggal Lengkap","header":true},{"value":"Tahun","header":true}]},{"rowNum":2,"cells":[{"value":"2026-06-15","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=YEAR(A2)', '=year(a2)']::text[],
  '2026',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =YEAR(A2)',
  NULL,
  40
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'date',
  'waktu-data',
  'Date (menggabungkan tanggal, bulan, tahun menjadi tanggal lengkap)',
  'Menggabungkan tiga sel angka (Tahun, Bulan, Hari) menjadi satu format tanggal utuh.',
  'Fungsi `DATE` merangkai tiga bilangan bulat menjadi format tanggal Excel terstruktur.
Syntax: `=DATE(tahun, bulan, hari)`',
  'Gabungkan nilai tahun di sel **A2**, bulan di sel **B2**, dan hari di sel **C2** menjadi tanggal lengkap di sel **D2**.',
  array['', 'Tahun', 'Bulan', 'Hari', 'Tanggal Utuh']::text[],
  '[{"rowNum":1,"cells":[{"value":"Tahun","header":true},{"value":"Bulan","header":true},{"value":"Hari","header":true},{"value":"Tanggal Utuh","header":true}]},{"rowNum":2,"cells":[{"value":2026,"highlight":true},{"value":6,"highlight":true},{"value":2,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=DATE(A2,B2,C2)', '=DATE(A2, B2, C2)', '=DATE(A2;B2;C2)']::text[],
  '02/06/2026',
  '{"row":1,"col":3}'::jsonb,
  'Ketik: =DATE(A2, B2, C2)',
  NULL,
  50
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'hour',
  'waktu-data',
  'Hour (mengekstrak jam dari waktu lengkap)',
  'Mengambil jam (0-23) dari format waktu lengkap.',
  'Fungsi `HOUR` mengembalikan nilai jam berupa angka dari format waktu.
Syntax: `=HOUR(sel_waktu)`',
  'Ambil angka jam saja dari kolom waktu di sel **A2** di dalam sel **B2**.',
  array['', 'Waktu Lengkap', 'Jam']::text[],
  '[{"rowNum":1,"cells":[{"value":"Waktu Lengkap","header":true},{"value":"Jam","header":true}]},{"rowNum":2,"cells":[{"value":"14:35:10","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=HOUR(A2)', '=hour(a2)']::text[],
  '14',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =HOUR(A2)',
  NULL,
  60
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'minute',
  'waktu-data',
  'Minute (mengekstrak menit dari waktu lengkap)',
  'Mengambil menit (0-59) dari format waktu lengkap.',
  'Fungsi `MINUTE` mengambil informasi menit dari data waktu.
Syntax: `=MINUTE(sel_waktu)`',
  'Ambil angka menit saja dari sel **A2** di dalam sel **B2**.',
  array['', 'Waktu Lengkap', 'Menit']::text[],
  '[{"rowNum":1,"cells":[{"value":"Waktu Lengkap","header":true},{"value":"Menit","header":true}]},{"rowNum":2,"cells":[{"value":"14:35:10","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=MINUTE(A2)', '=minute(a2)']::text[],
  '35',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =MINUTE(A2)',
  NULL,
  70
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'second',
  'waktu-data',
  'Second (mengekstrak detik dari waktu lengkap)',
  'Mengambil detik (0-59) dari format waktu lengkap.',
  'Fungsi `SECOND` mengambil informasi detik dari data waktu.
Syntax: `=SECOND(sel_waktu)`',
  'Ambil angka detik saja dari sel **A2** di dalam sel **B2**.',
  array['', 'Waktu Lengkap', 'Detik']::text[],
  '[{"rowNum":1,"cells":[{"value":"Waktu Lengkap","header":true},{"value":"Detik","header":true}]},{"rowNum":2,"cells":[{"value":"14:35:10","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=SECOND(A2)', '=second(a2)']::text[],
  '10',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =SECOND(A2)',
  NULL,
  80
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'time',
  'waktu-data',
  'Time (menggabungkan jam, menit, detik menjadi waktu lengkap)',
  'Menggabungkan tiga sel angka (Jam, Menit, Detik) menjadi format waktu utuh.',
  'Fungsi `TIME` merangkai tiga bilangan bulat menjadi format waktu terstruktur.
Syntax: `=TIME(jam, menit, detik)`',
  'Gabungkan nilai jam di sel **A2**, menit di sel **B2**, dan detik di sel **C2** menjadi waktu lengkap di sel **D2**.',
  array['', 'Jam', 'Menit', 'Detik', 'Waktu Utuh']::text[],
  '[{"rowNum":1,"cells":[{"value":"Jam","header":true},{"value":"Menit","header":true},{"value":"Detik","header":true},{"value":"Waktu Utuh","header":true}]},{"rowNum":2,"cells":[{"value":12,"highlight":true},{"value":30,"highlight":true},{"value":0,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=TIME(A2,B2,C2)', '=TIME(A2, B2, C2)', '=TIME(A2;B2;C2)']::text[],
  '12:30 PM',
  '{"row":1,"col":3}'::jsonb,
  'Ketik: =TIME(A2, B2, C2)',
  NULL,
  90
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'edate',
  'waktu-data',
  'Edate (mencari tanggal dalam beberapa bulan ke depan / belakang)',
  'Mencari tanggal baru beberapa bulan sebelum atau setelah tanggal awal.',
  'Fungsi `EDATE` digunakan untuk menghitung tanggal jatuh tempo. Menghasilkan tanggal baru yang berjarak N bulan dari tanggal awal (gunakan angka negatif untuk bulan di masa lalu).
Syntax: `=EDATE(tanggal_awal, jumlah_bulan)`',
  'Cari tanggal baru **3 bulan setelah** tanggal kontrak di sel **A2** di dalam sel **B2**.',
  array['', 'Kontrak Awal', 'Hasil EDATE']::text[],
  '[{"rowNum":1,"cells":[{"value":"Kontrak Awal","header":true},{"value":"Hasil EDATE","header":true}]},{"rowNum":2,"cells":[{"value":"2026-06-02","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=EDATE(A2,3)', '=EDATE(A2, 3)', '=EDATE(A2;3)']::text[],
  '02/09/2026',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =EDATE(A2, 3)',
  NULL,
  100
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'eomonth',
  'waktu-data',
  'Eomonth (mencari tanggal akhir bulan dalam beberapa bulan ke depan / belakang)',
  'Mencari tanggal hari terakhir dari suatu bulan di masa depan/lalu.',
  'Fungsi `EOMONTH` (End Of Month) mencari hari terakhir dari bulan yang terpilih berjarak N bulan ke depan/belakang (gunakan `0` untuk akhir bulan saat ini).
Syntax: `=EOMONTH(tanggal_awal, jumlah_bulan)`',
  'Cari tanggal **hari terakhir pada bulan berjalan** dari tanggal di sel **A2** (jumlah bulan = `0`) di dalam sel **B2**.',
  array['', 'Tanggal Mulai', 'Akhir Bulan']::text[],
  '[{"rowNum":1,"cells":[{"value":"Tanggal Mulai","header":true},{"value":"Akhir Bulan","header":true}]},{"rowNum":2,"cells":[{"value":"2026-06-02","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=EOMONTH(A2,0)', '=EOMONTH(A2, 0)', '=EOMONTH(A2;0)']::text[],
  '30/06/2026',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =EOMONTH(A2, 0)',
  NULL,
  110
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'yearfrac',
  'waktu-data',
  'Yearfrac (menghitung selisih tanggal dalam satuan tahun)',
  'Menghitung selisih dua tanggal dalam representasi desimal pecahan tahun.',
  'Fungsi `YEARFRAC` mengembalikan pecahan tahun yang mewakili jumlah hari penuh di antara tanggal awal dan tanggal akhir.
Syntax: `=YEARFRAC(tanggal_awal, tanggal_akhir)`',
  'Hitung proporsi pecahan tahun antara tanggal mulai di sel **A2** dan tanggal selesai di sel **B2** pada sel **C2**.',
  array['', 'Mulai', 'Selesai', 'Pecahan Tahun']::text[],
  '[{"rowNum":1,"cells":[{"value":"Mulai","header":true},{"value":"Selesai","header":true},{"value":"Pecahan Tahun","header":true}]},{"rowNum":2,"cells":[{"value":"2025-06-02","highlight":true},{"value":"2026-06-02","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=YEARFRAC(A2,B2)', '=YEARFRAC(A2, B2)', '=YEARFRAC(A2;B2)']::text[],
  '1',
  '{"row":1,"col":2}'::jsonb,
  'Ketik: =YEARFRAC(A2, B2)',
  NULL,
  120
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'datedif',
  'waktu-data',
  'Datedif (menghitung selisih tanggal dalam satuan tahun, bulan, hari)',
  'Menghitung selisih waktu antara dua tanggal dalam satuan Hari, Bulan, atau Tahun.',
  'Fungsi `DATEDIF` menghitung selisih tanggal. Fungsi ini tidak terdaftar di auto-complete Excel biasa tetapi sangat populer. Parameter ke-3 adalah format keluaran:
- `"Y"`: Selisih tahun bulat.
- `"M"`: Selisih bulan bulat.
- `"D"`: Selisih hari.
Syntax: `=DATEDIF(tanggal_awal, tanggal_akhir, "format")`',
  'Hitung selisih umur dalam satuan **tahun** (`"Y"`) di sel **C2** berdasarkan tanggal lahir di sel **A2** dan tanggal akhir di sel **B2**.',
  array['', 'Lahir', 'Hari Ini', 'Umur (Tahun)']::text[],
  '[{"rowNum":1,"cells":[{"value":"Lahir","header":true},{"value":"Hari Ini","header":true},{"value":"Umur (Tahun)","header":true}]},{"rowNum":2,"cells":[{"value":"2000-06-02","highlight":true},{"value":"2026-06-02","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=DATEDIF(A2,B2,"Y")', '=DATEDIF(A2, B2, "Y")', '=DATEDIF(A2;B2;"Y")']::text[],
  '26',
  '{"row":1,"col":2}'::jsonb,
  'Gunakan format "Y" untuk selisih tahun: =DATEDIF(A2, B2, "Y")',
  NULL,
  130
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'workday',
  'waktu-data',
  'Workday (mencari tanggal di masa depan)',
  'Mencari tanggal di masa depan setelah melewati N hari kerja (sabtu-minggu dilewati).',
  'Fungsi `WORKDAY` menghasilkan tanggal baru setelah melewati N hari kerja, otomatis melewati akhir pekan (Sabtu & Minggu) serta daftar hari libur yang opsional.
Syntax: `=WORKDAY(tanggal_awal, jumlah_hari_kerja)`',
  'Cari tanggal selesai proyek di sel **B2** jika dimulai tanggal **A2** dan membutuhkan waktu pengerjaan **5 hari kerja**.',
  array['', 'Tanggal Mulai', 'Selesai Proyek']::text[],
  '[{"rowNum":1,"cells":[{"value":"Tanggal Mulai","header":true},{"value":"Selesai Proyek","header":true}]},{"rowNum":2,"cells":[{"value":"2026-06-01","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=WORKDAY(A2,5)', '=WORKDAY(A2, 5)', '=WORKDAY(A2;5)']::text[],
  '08/06/2026',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =WORKDAY(A2, 5). Tanggal mulai senin 1 juni + 5 hari kerja (selasa, rabu, kamis, jumat, senin) = senin 8 juni.',
  NULL,
  140
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'networkdays',
  'waktu-data',
  'Networkdays (menghitung jumlah hari kerja)',
  'Menghitung berapa banyak hari kerja di antara dua tanggal (tidak menghitung sabtu-minggu).',
  'Fungsi `NETWORKDAYS` menghitung jumlah hari kerja penuh di antara dua tanggal, tidak termasuk akhir pekan (Sabtu dan Minggu).
Syntax: `=NETWORKDAYS(tanggal_awal, tanggal_akhir)`',
  'Hitung total hari kerja yang dilalui di sel **C2** dari tanggal mulai **A2** hingga selesai **B2**.',
  array['', 'Mulai', 'Selesai', 'Hari Kerja']::text[],
  '[{"rowNum":1,"cells":[{"value":"Mulai","header":true},{"value":"Selesai","header":true},{"value":"Hari Kerja","header":true}]},{"rowNum":2,"cells":[{"value":"2026-06-01","highlight":true},{"value":"2026-06-10","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=NETWORKDAYS(A2,B2)', '=NETWORKDAYS(A2, B2)', '=NETWORKDAYS(A2;B2)']::text[],
  '8',
  '{"row":1,"col":2}'::jsonb,
  'Ketik: =NETWORKDAYS(A2, B2)',
  NULL,
  150
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'networkdays_intl',
  'waktu-data',
  'Networkdays.Intl (menghitung jumlah hari kerja dengan pilihan weekend lebih beragam)',
  'Menghitung hari kerja dengan konfigurasi akhir pekan kustom (misal libur hanya hari minggu saja).',
  'Fungsi `NETWORKDAYS.INTL` membolehkan kamu menghitung jumlah hari kerja dengan mendefinisikan hari apa saja yang dianggap sebagai akhir pekan/libur mingguan menggunakan kode angka:
- `1`: Sabtu & Minggu libur (default)
- `11`: Hanya hari Minggu yang libur.
Syntax: `=NETWORKDAYS.INTL(tanggal_awal, tanggal_akhir, kode_weekend)`',
  'Hitung jumlah hari kerja di sel **C2** untuk rentang tanggal **A2** ke **B2** menggunakan kode `11` (hanya hari Minggu libur, Sabtu tetap masuk kerja).',
  array['', 'Mulai', 'Selesai', 'Hari Kerja (6 Hari/Minggu)']::text[],
  '[{"rowNum":1,"cells":[{"value":"Mulai","header":true},{"value":"Selesai","header":true},{"value":"Hari Kerja (6 Hari/Minggu)","header":true}]},{"rowNum":2,"cells":[{"value":"2026-06-01","highlight":true},{"value":"2026-06-10","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=NETWORKDAYS.INTL(A2,B2,11)', '=NETWORKDAYS.INTL(A2, B2, 11)', '=NETWORKDAYS.INTL(A2;B2;11)']::text[],
  '9',
  '{"row":1,"col":2}'::jsonb,
  'Ketik: =NETWORKDAYS.INTL(A2, B2, 11)',
  NULL,
  160
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'studi-kasus-waktu',
  'waktu-data',
  'Studi Kasus: Laporan Pelacakan Proyek & Waktu Kerja',
  'Tantangan mandiri: hitung durasi proyek, hari kerja, dan estimasi selesai menggunakan rumus waktu.',
  'Sebagai Manajer Proyek, Anda perlu menyusun rencana kerja tim. Mari buat laporan pelacakan proyek terintegrasi menggunakan rumus waktu:

1. **Durasi Hari Kalender (C2)**: Hitung total hari kalender di antara Tanggal Mulai (A2) dan Tanggal Selesai (B2).
   *Syntax*: `=DAYS(B2, A2)`
2. **Total Hari Kerja (D2)**: Hitung total hari kerja (Senin-Jumat) di antara Tanggal Mulai (A2) dan Tanggal Selesai (B2).
   *Syntax*: `=NETWORKDAYS(A2, B2)`
3. **Estimasi Selesai (F2)**: Proyek Baru dimulai tanggal **2026-06-01** (E2) dan membutuhkan waktu pengerjaan **10 hari kerja** (Senin-Jumat). Hitung tanggal estimasi selesai proyek baru.
   *Syntax*: `=WORKDAY(E2, 10)`',
  'Isi sel bertanda tanya (C2, D2, F2) dengan rumus waktu yang sesuai berdasarkan penjelasan di atas.',
  array['', 'Mulai', 'Selesai', 'Hari Kalender', 'Hari Kerja', 'Mulai Baru', 'Selesai Estimasi']::text[],
  '[{"rowNum":1,"cells":[{"value":"Mulai","header":true},{"value":"Selesai","header":true},{"value":"Hari Kalender","header":true},{"value":"Hari Kerja","header":true},{"value":"Mulai Baru","header":true},{"value":"Selesai Estimasi","header":true}]},{"rowNum":2,"cells":[{"value":"2026-06-01"},{"value":"2026-06-15"},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"2026-06-01"},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Hari Kalender (DAYS)","resultCell":{"row":1,"col":2},"validFormulas":["=DAYS(B2,A2)","=DAYS(B2, A2)","=DAYS(B2;A2)"],"expectedResult":"14","hint":"Hitung beda hari: =DAYS(B2, A2)"},{"label":"Hari Kerja (NETWORKDAYS)","resultCell":{"row":1,"col":3},"validFormulas":["=NETWORKDAYS(A2,B2)","=NETWORKDAYS(A2, B2)","=NETWORKDAYS(A2;B2)"],"expectedResult":"11","hint":"Hitung hari kerja penuh: =NETWORKDAYS(A2, B2)"},{"label":"Selesai Estimasi (WORKDAY)","resultCell":{"row":1,"col":5},"validFormulas":["=WORKDAY(E2,10)","=WORKDAY(E2, 10)","=WORKDAY(E2;10)"],"expectedResult":"15/06/2026","hint":"Tambahkan 10 hari kerja ke tanggal mulai E2: =WORKDAY(E2, 10)"}]'::jsonb,
  170
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'and',
  'uji-pernyataan',
  'And (menguji kebenaran semua pernyataan)',
  'Menghasilkan TRUE hanya jika SELURUH pernyataan bernilai benar.',
  'Fungsi `AND` menguji beberapa kondisi logika. Menghasilkan nilai `TRUE` jika semua kondisi terpenuhi, dan `FALSE` jika ada satu saja kondisi yang salah.
Syntax: `=AND(kondisi1, kondisi2, ...)`',
  'Uji apakah nilai ujian 1 di sel **A2** dan nilai ujian 2 di sel **B2** keduanya **di atas atau sama dengan 75**. Tulis di sel **C2**.',
  array['', 'Nilai 1', 'Nilai 2', 'Dua-duanya Lulus?']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nilai 1","header":true},{"value":"Nilai 2","header":true},{"value":"Dua-duanya Lulus?","header":true}]},{"rowNum":2,"cells":[{"value":80,"highlight":true},{"value":78,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=AND(A2>=75,B2>=75)', '=AND(A2>=75, B2>=75)', '=AND(A2>=75;B2>=75)']::text[],
  'TRUE',
  '{"row":1,"col":2}'::jsonb,
  'Ketik: =AND(A2>=75, B2>=75)',
  NULL,
  0
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'or',
  'uji-pernyataan',
  'Or (menguji kebenaran salah satu pernyataan)',
  'Menghasilkan TRUE jika MINIMAL SALAH SATU pernyataan bernilai benar.',
  'Fungsi `OR` menguji beberapa kondisi logika. Menghasilkan `TRUE` jika minimal ada satu kondisi saja yang terpenuhi, dan hanya menghasilkan `FALSE` jika seluruh kondisi salah.
Syntax: `=OR(kondisi1, kondisi2, ...)`',
  'Uji di sel **C2** apakah salah satu dari nilai ujian di **A2** atau **B2** ada yang **di atas atau sama dengan 75**.',
  array['', 'Nilai 1', 'Nilai 2', 'Salah Satu Lulus?']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nilai 1","header":true},{"value":"Nilai 2","header":true},{"value":"Salah Satu Lulus?","header":true}]},{"rowNum":2,"cells":[{"value":60,"highlight":true},{"value":82,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=OR(A2>=75,B2>=75)', '=OR(A2>=75, B2>=75)', '=OR(A2>=75;B2>=75)']::text[],
  'TRUE',
  '{"row":1,"col":2}'::jsonb,
  'Ketik: =OR(A2>=75, B2>=75)',
  NULL,
  10
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'not',
  'uji-pernyataan',
  'Not (menghasilkan hasil berkebalikan dari rumus asli)',
  'Membalikkan nilai TRUE menjadi FALSE, dan sebaliknya.',
  'Fungsi `NOT` menghasilkan nilai logika yang berkebalikan dari hasil pengujian asli.
Syntax: `=NOT(pernyataan_logika)`',
  'Balikkan kondisi lulus ujian di sel **A2** di dalam sel **B2** (menghasilkan FALSE karena A2 adalah TRUE).',
  array['', 'Apakah Lulus', 'Hasil NOT']::text[],
  '[{"rowNum":1,"cells":[{"value":"Apakah Lulus","header":true},{"value":"Hasil NOT","header":true}]},{"rowNum":2,"cells":[{"value":"TRUE","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=NOT(A2)', '=not(a2)']::text[],
  'FALSE',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =NOT(A2)',
  NULL,
  20
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'if',
  'uji-pernyataan',
  'If (menguji pernyataan jika-maka)',
  'Menjalankan keputusan logika bercabang tunggal.',
  'Fungsi `IF` menguji pernyataan dan mengeluarkan nilai jika syarat terpenuhi, dan nilai lainnya jika syarat tidak terpenuhi.
Syntax: `=IF(syarat, nilai_jika_benar, nilai_jika_salah)`',
  'Di sel **C2**, periksa jika nilai ujian di sel **B2** lebih besar atau sama dengan **60** maka tampilkan **"Pass"**, jika kurang tampilkan **"Fail"**.',
  array['', 'Nama', 'Nilai', 'Status']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama","header":true},{"value":"Nilai","header":true},{"value":"Status","header":true}]},{"rowNum":2,"cells":[{"value":"Sophia"},{"value":72,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=IF(B2>=60,"Pass","Fail")', '=IF(B2>=60, "Pass", "Fail")', '=IF(B2>=60; "Pass"; "Fail")']::text[],
  'Pass',
  '{"row":1,"col":2}'::jsonb,
  'Ketik: =IF(B2>=60, "Pass", "Fail")',
  NULL,
  30
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'nested-if',
  'uji-pernyataan',
  'Nested IF (IF Bercabang)',
  'Menguji beberapa kondisi dengan menumpuk fungsi IF di dalam fungsi IF lainnya.',
  'Nested IF atau IF bercabang adalah teknik menempatkan fungsi IF baru di dalam bagian nilai alternatif (false) dari fungsi IF sebelumnya. Teknik ini sangat penting untuk menguji beberapa kondisi sekaligus di versi Excel lama yang belum mendukung fungsi IFS.

*Aturan Penting*:
- Setiap fungsi IF yang dibuka membutuhkan tanda kurung penutup di akhir rumus.
- Kondisi diuji dari kiri ke kanan. Begitu satu kondisi benar, Excel akan berhenti menguji kondisi berikutnya.
Syntax: `=IF(kondisi1, hasil1, IF(kondisi2, hasil2, hasil_alternatif_semua_salah))`',
  'Tentukan Grade kelulusan siswa di sel **C2** berdasarkan Nilai Ujian di sel **B2**:
- Jika Nilai `>= 85`, tampilkan **"A"**
- Jika Nilai `>= 70`, tampilkan **"B"**
- Jika kurang dari 70, tampilkan **"C"**
Ketik rumusnya di sel **C2**.',
  array['', 'Nama', 'Nilai Ujian', 'Grade']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama","header":true},{"value":"Nilai Ujian","header":true},{"value":"Grade","header":true}]},{"rowNum":2,"cells":[{"value":"Sophia"},{"value":78,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=IF(B2>=85,"A",IF(B2>=70,"B","C"))', '=IF(B2>=85, "A", IF(B2>=70, "B", "C"))', '=IF(B2>=85; "A"; IF(B2>=70; "B"; "C"))', '=IF(B2>=85,"A",IF(B2>=70,"B",IF(B2<70,"C")))']::text[],
  'B',
  '{"row":1,"col":2}'::jsonb,
  'Ketik: =IF(B2>=85, "A", IF(B2>=70, "B", "C"))',
  NULL,
  40
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'ifs',
  'uji-pernyataan',
  'Ifs (menguji beberapa pernyataan jika-maka)',
  'Melakukan pengujian banyak kondisi tanpa perlu menulis IF bercabang-cabang.',
  'Fungsi `IFS` membolehkan kamu menulis hingga 127 kondisi logika berurutan secara rapi tanpa perlu menumpuk banyak tanda kurung IF.
Syntax: `=IFS(syarat1, nilai1, syarat2, nilai2, syarat3, nilai3, ...)`',
  'Tentukan grade ujian di sel **B2** berdasarkan nilai di sel **A2**:
- Jika `>= 90` maka **"A"**
- Jika `>= 80` maka **"B"**
- Jika `< 80` maka **"C"**',
  array['', 'Nilai', 'Grade']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nilai","header":true},{"value":"Grade","header":true}]},{"rowNum":2,"cells":[{"value":85,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=IFS(A2>=90,"A",A2>=80,"B",A2<80,"C")', '=IFS(A2>=90, "A", A2>=80, "B", A2<80, "C")', '=IFS(A2>=90; "A"; A2>=80; "B"; A2<80; "C")']::text[],
  'B',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =IFS(A2>=90, "A", A2>=80, "B", A2<80, "C")',
  NULL,
  50
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'iferror',
  'uji-pernyataan',
  'Iferror (menyamarkan error)',
  'Mengganti tampilan sel yang error dengan tulisan/angka alternatif pilihan kita.',
  'Fungsi `IFERROR` mendeteksi jika suatu rumus menghasilkan error (seperti `#DIV/0!`, `#N/A`, dll.) dan menggantinya dengan tulisan atau angka pilihan kita agar tabel terlihat rapi.
Syntax: `=IFERROR(rumus_asli, nilai_cadangan_jika_error)`',
  'Lakukan pembagian harga barang di sel **A2** dengan jumlah unit terjual di sel **B2** pada sel **C2**. Jika terjadi error pembagian (karena unit = 0), tampilkan angka **0**.',
  array['', 'Harga', 'Unit Terjual', 'Harga per Unit']::text[],
  '[{"rowNum":1,"cells":[{"value":"Harga","header":true},{"value":"Unit Terjual","header":true},{"value":"Harga per Unit","header":true}]},{"rowNum":2,"cells":[{"value":500,"highlight":true},{"value":0,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=IFERROR(A2/B2,0)', '=IFERROR(A2/B2, 0)', '=IFERROR(A2/B2;0)']::text[],
  '0',
  '{"row":1,"col":2}'::jsonb,
  'Ketik: =IFERROR(A2/B2, 0)',
  NULL,
  60
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'exact',
  'uji-pernyataan',
  'Exact (menguji jika dua data sama persis)',
  'Menguji apakah dua teks sama persis secara sensitif terhadap huruf besar/kecil (case-sensitive).',
  'Fungsi `EXACT` membandingkan dua teks secara mendalam. Menghasilkan `TRUE` hanya jika kedua teks benar-benar identik, termasuk kesamaan huruf kapital dan kecil.
Syntax: `=EXACT(teks1, teks2)`',
  'Uji apakah kata sandi di sel **A2** dan sel **B2** sama persis di dalam sel **C2**.',
  array['', 'Sandi 1', 'Sandi 2', 'Sama Persis?']::text[],
  '[{"rowNum":1,"cells":[{"value":"Sandi 1","header":true},{"value":"Sandi 2","header":true},{"value":"Sama Persis?","header":true}]},{"rowNum":2,"cells":[{"value":"Admin123","highlight":true},{"value":"admin123","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=EXACT(A2,B2)', '=EXACT(A2, B2)', '=EXACT(A2;B2)']::text[],
  'FALSE',
  '{"row":1,"col":2}'::jsonb,
  'Ketik: =EXACT(A2, B2). Hasilnya FALSE karena huruf ''A'' pada sandi 1 berbeda kapital dengan sandi 2.',
  NULL,
  70
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'studi-kasus-pernyataan',
  'uji-pernyataan',
  'Studi Kasus: Evaluasi Kelulusan Seleksi Karyawan',
  'Tantangan mandiri: uji kondisi kelulusan peserta menggunakan fungsi logika AND, OR, dan IFERROR.',
  'Sebagai bagian dari tim HRD, Anda perlu menguji kelayakan calon karyawan secara otomatis berdasarkan kriteria berikut:

1. **Status Kelulusan (D2)**: Calon lulus jika Nilai Tes Teknis (B2) >= 70 DAN Nilai Wawancara (C2) >= 75.
   *Syntax*: `=IF(AND(B2>=70,C2>=75),"Lulus","Gagal")`
2. **Rekomendasi Penempatan (E2)**: Calon mendapat rekomendasi jika Nilai Tes Teknis (B2) >= 90 ATAU Nilai Wawancara (C2) >= 90.
   *Syntax*: `=IF(OR(B2>=90,C2>=90),"Rekomendasi","Biasa")`
3. **Cek Sandi (F2)**: Pastikan kode verifikasi Sandi 1 (A2) dan Sandi 2 (B2) dari sistem sama persis.
   *Syntax*: `=EXACT(A2,B2)`',
  'Isi sel bertanda tanya (D2, E2, F2) dengan rumus logika yang sesuai berdasarkan kriteria di atas.',
  array['', 'Sandi 1 / Teknis', 'Sandi 2 / Wawancara', 'Lulus?', 'Rekomendasi?', 'Sandi Cocok?']::text[],
  '[{"rowNum":1,"cells":[{"value":"Sandi 1 / Teknis","header":true},{"value":"Sandi 2 / Wawancara","header":true},{"value":"Lulus?","header":true},{"value":"Rekomendasi?","header":true},{"value":"Sandi Cocok?","header":true}]},{"rowNum":2,"cells":[{"value":85},{"value":70},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Lulus? (AND)","resultCell":{"row":1,"col":2},"validFormulas":["=IF(AND(B2>=70,C2>=75),\"Lulus\",\"Gagal\")","=IF(AND(B2>=70, C2>=75), \"Lulus\", \"Gagal\")","=IF(AND(B2>=70;C2>=75);\"Lulus\";\"Gagal\")","=IF(AND(B2>=70; C2>=75); \"Lulus\"; \"Gagal\")"],"expectedResult":"Gagal","hint":"Syarat: B2 >= 70 DAN C2 >= 75. Gunakan =IF(AND(B2>=70,C2>=75),\"Lulus\",\"Gagal\")"},{"label":"Rekomendasi? (OR)","resultCell":{"row":1,"col":3},"validFormulas":["=IF(OR(B2>=90,C2>=90),\"Rekomendasi\",\"Biasa\")","=IF(OR(B2>=90, C2>=90), \"Rekomendasi\", \"Biasa\")","=IF(OR(B2>=90;C2>=90);\"Rekomendasi\";\"Biasa\")","=IF(OR(B2>=90; C2>=90); \"Rekomendasi\"; \"Biasa\")"],"expectedResult":"Biasa","hint":"Syarat: B2 >= 90 ATAU C2 >= 90: =IF(OR(B2>=90,C2>=90),\"Rekomendasi\",\"Biasa\")"},{"label":"Sandi Cocok? (EXACT)","resultCell":{"row":1,"col":4},"validFormulas":["=EXACT(A2,B2)","=EXACT(A2, B2)","=EXACT(A2;B2)"],"expectedResult":"FALSE","hint":"Periksa apakah teks Sandi 1 (A2) dan Sandi 2 (B2) sama persis: =EXACT(A2, B2)"}]'::jsonb,
  80
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'rank',
  'statistik-data',
  'Rank (mencari peringkat)',
  'Mencari peringkat urutan suatu nilai di dalam sekelompok angka.',
  'Fungsi `RANK` mengembalikan posisi peringkat suatu angka dibanding angka-angka lain di rentang data yang sama.
Syntax: `=RANK(angka_yang_dinilai, rentang_pembanding)`',
  'Cari peringkat nilai siswa di sel **B2** dibanding teman-temannya di rentang **B2:B5**. Tulis rumusnya di sel **C2**.',
  array['', 'Nama', 'Nilai', 'Peringkat']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama","header":true},{"value":"Nilai","header":true},{"value":"Peringkat","header":true}]},{"rowNum":2,"cells":[{"value":"Rian"},{"value":85,"highlight":true},{"value":"?","highlight":true}]},{"rowNum":3,"cells":[{"value":"Budi"},{"value":95,"highlight":true}]},{"rowNum":4,"cells":[{"value":"Siti"},{"value":78,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Aulia"},{"value":90,"highlight":true}]}]'::jsonb,
  array['=RANK(B2,B2:B5)', '=RANK(B2, B2:B5)', '=RANK(B2;B2:B5)']::text[],
  '3',
  '{"row":1,"col":2}'::jsonb,
  'Ketik: =RANK(B2, B2:B5)',
  NULL,
  0
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'abs',
  'statistik-data',
  'Abs (menghasilkan nilai absolut)',
  'Mengubah angka negatif menjadi angka positif mutlak.',
  'Fungsi `ABS` (Absolute) menghilangkan tanda minus (-) pada angka, mengembalikannya menjadi nilai positif mutlak.
Syntax: `=ABS(angka)`',
  'Ubah selisih pengeluaran negatif di sel **A2** menjadi nilai absolut di sel **B2**.',
  array['', 'Selisih Asli', 'Hasil Absolut']::text[],
  '[{"rowNum":1,"cells":[{"value":"Selisih Asli","header":true},{"value":"Hasil Absolut","header":true}]},{"rowNum":2,"cells":[{"value":-250,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=ABS(A2)', '=abs(a2)']::text[],
  '250',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =ABS(A2)',
  NULL,
  10
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'rand',
  'statistik-data',
  'Rand (menghasilkan nilai random antara 0-1)',
  'Menghasilkan angka acak desimal di antara 0 hingga 1.',
  'Fungsi `RAND` digunakan untuk membuat bilangan acak pecahan di bawah 1. Rumus ini tidak membutuhkan argumen apa pun.
Syntax: `=RAND()`',
  'Masukkan angka acak desimal di sel **A2** menggunakan fungsi `RAND`.',
  array['', 'Nilai Acak']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nilai Acak","header":true}]},{"rowNum":2,"cells":[{"value":"?","highlight":true}]}]'::jsonb,
  array['=RAND()', '=rand()']::text[],
  '0.4578',
  '{"row":1,"col":0}'::jsonb,
  'Ketik: =RAND()',
  NULL,
  20
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'randbetween',
  'statistik-data',
  'Randbetween (menghasilkan nilai random antara batas bawah dan atas)',
  'Menghasilkan angka acak bulat di antara batas bawah dan atas pilihan kita.',
  'Fungsi `RANDBETWEEN` menghasilkan angka bulat acak di antara rentang angka yang kamu tentukan.
Syntax: `=RANDBETWEEN(batas_bawah, batas_atas)`',
  'Buat angka acak bulat di sel **A2** di antara **1** sampai **100**.',
  array['', 'Nomor Undian']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nomor Undian","header":true}]},{"rowNum":2,"cells":[{"value":"?","highlight":true}]}]'::jsonb,
  array['=RANDBETWEEN(1,100)', '=RANDBETWEEN(1, 100)', '=RANDBETWEEN(1;100)']::text[],
  '73',
  '{"row":1,"col":0}'::jsonb,
  'Ketik: =RANDBETWEEN(1, 100)',
  NULL,
  30
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'mode',
  'statistik-data',
  'Mode (mencari nilai modus yang paling sering keluar)',
  'Mencari angka yang paling sering muncul (frekuensi tertinggi) dalam data.',
  'Fungsi `MODE` mencari nilai angka yang memiliki frekuensi kemunculan paling tinggi atau paling sering keluar dalam kumpulan data.
Syntax: `=MODE(SelAwal:SelAkhir)`',
  'Cari nilai angka ujian yang paling sering didapatkan siswa (rentang **B2:B6**). Tulis di sel **B7**.',
  array['', 'Nama', 'Nilai']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama","header":true},{"value":"Nilai","header":true}]},{"rowNum":2,"cells":[{"value":"Rian"},{"value":80,"highlight":true}]},{"rowNum":3,"cells":[{"value":"Budi"},{"value":85,"highlight":true}]},{"rowNum":4,"cells":[{"value":"Siti"},{"value":80,"highlight":true}]},{"rowNum":5,"cells":[{"value":"Dewi"},{"value":90,"highlight":true}]},{"rowNum":6,"cells":[{"value":"Eko"},{"value":80,"highlight":true}]},{"rowNum":7,"cells":[{"value":"Nilai Modus"},{"value":"?","highlight":true}]}]'::jsonb,
  array['=MODE(B2:B6)', '=mode(b2:b6)']::text[],
  '80',
  '{"row":6,"col":1}'::jsonb,
  'Ketik: =MODE(B2:B6)',
  NULL,
  40
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'roman',
  'statistik-data',
  'Roman (mengubah angka biasa menjadi angka romawi)',
  'Mengonversi angka numerik biasa menjadi huruf format Romawi.',
  'Fungsi `ROMAN` mengubah angka biasa (Arab) menjadi karakter tulisan Romawi.
Syntax: `=ROMAN(angka)`',
  'Ubah angka tahun ajaran di sel **A2** menjadi angka Romawi di sel **B2**.',
  array['', 'Angka Biasa', 'Angka Romawi']::text[],
  '[{"rowNum":1,"cells":[{"value":"Angka Biasa","header":true},{"value":"Angka Romawi","header":true}]},{"rowNum":2,"cells":[{"value":14,"highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=ROMAN(A2)', '=roman(a2)']::text[],
  'XIV',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =ROMAN(A2)',
  NULL,
  50
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'arabic',
  'statistik-data',
  'Arabic (mengubah angka romawi menjadi angka biasa)',
  'Mengonversi huruf Romawi menjadi angka numerik biasa.',
  'Fungsi `ARABIC` mengubah karakter angka Romawi menjadi bilangan numerik biasa. Kebalikan dari fungsi ROMAN.
Syntax: `=ARABIC(teks_romawi)`',
  'Ubah teks angka Romawi di sel **A2** menjadi angka biasa di sel **B2**.',
  array['', 'Teks Romawi', 'Hasil Angka']::text[],
  '[{"rowNum":1,"cells":[{"value":"Teks Romawi","header":true},{"value":"Hasil Angka","header":true}]},{"rowNum":2,"cells":[{"value":"XVIII","highlight":true},{"value":"?","highlight":true}]}]'::jsonb,
  array['=ARABIC(A2)', '=arabic(a2)']::text[],
  '18',
  '{"row":1,"col":1}'::jsonb,
  'Ketik: =ARABIC(A2)',
  NULL,
  60
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'studi-kasus-statistik',
  'statistik-data',
  'Studi Kasus: Analisis Statistik Nilai Ujian Sekolah',
  'Tantangan mandiri: hitung rata-rata, median, peringkat, dan nilai tengah kelas menggunakan rumus statistik.',
  'Sebagai guru kelas, Anda ingin menganalisis rekapitulasi nilai ujian matematika siswa menggunakan rumus statistik dasar:

1. **Peringkat Siswa pertama (C2)**: Cari peringkat nilai siswa pertama (B2) dibanding seluruh siswa di kelas (B2:B5).
   *Syntax*: `=RANK(B2,$B$2:$B$5)` atau `=RANK(B2,B2:B5)`
2. **Nilai Tengah / Median (B6)**: Cari nilai tengah (median) dari seluruh nilai siswa (B2:B5).
   *Syntax*: `=MEDIAN(B2:B5)`
3. **Ubah ke Romawi (D2)**: Konversi nilai peringkat siswa pertama (C2) menjadi angka Romawi.
   *Syntax*: `=ROMAN(C2)`',
  'Isi sel bertanda tanya (C2, B6, D2) dengan rumus statistik yang sesuai berdasarkan kriteria di atas.',
  array['', 'Nama Siswa / Statistik', 'Nilai / Hasil', 'Peringkat', 'Peringkat Romawi']::text[],
  '[{"rowNum":1,"cells":[{"value":"Nama Siswa / Statistik","header":true},{"value":"Nilai / Hasil","header":true},{"value":"Peringkat","header":true},{"value":"Peringkat Romawi","header":true}]},{"rowNum":2,"cells":[{"value":"Andi"},{"value":90},{"value":"?","highlight":true},{"value":"?","highlight":true}]},{"rowNum":3,"cells":[{"value":"Budi"},{"value":75},{"value":""},{"value":""}]},{"rowNum":4,"cells":[{"value":"Cici"},{"value":85},{"value":""},{"value":""}]},{"rowNum":5,"cells":[{"value":"Dedi"},{"value":80},{"value":""},{"value":""}]},{"rowNum":6,"cells":[{"value":"Median Nilai Kelas"},{"value":"?","highlight":true},{"value":""},{"value":""}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Peringkat Andi (RANK)","resultCell":{"row":1,"col":2},"validFormulas":["=RANK(B2,$B$2:$B$5)","=RANK(B2,B2:B5)","=RANK(B2;$B$2:$B$5)","=RANK(B2;B2:B5)"],"expectedResult":"1","hint":"Bandingkan B2 dengan rentang B2:B5: =RANK(B2,$B$2:$B$5)"},{"label":"Median Kelas (MEDIAN)","resultCell":{"row":5,"col":1},"validFormulas":["=MEDIAN(B2:B5)","=MEDIAN(B2;B5)"],"expectedResult":"82.5","hint":"Cari nilai tengah dari B2:B5: =MEDIAN(B2:B5)"},{"label":"Peringkat Romawi Andi (ROMAN)","resultCell":{"row":1,"col":3},"validFormulas":["=ROMAN(C2)","=roman(c2)"],"expectedResult":"I","hint":"Ubah nilai peringkat C2 ke format Romawi: =ROMAN(C2)"}]'::jsonb,
  70
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  'xlookup',
  'bonus-rumus',
  'Xlookup (mencari data - jauh lebih baik dibanding VLOOKUP)',
  'Fungsi pencarian modern yang menggabungkan kelebihan VLOOKUP, HLOOKUP, dan INDEX MATCH.',
  'Fungsi `XLOOKUP` dirilis di Excel versi baru untuk menggantikan VLOOKUP. Kelebihannya:
- Bisa mencari data ke kiri.
- Tidak membutuhkan urutan nomor indeks kolom.
- Aman dari kesalahan penyisipan kolom baru di masa depan.
- Otomatis melakukan pencarian persis (tanpa perlu mengetik FALSE).

Rumus ini membutuhkan tiga parameter wajib:
1. **Kunci Pencarian**: Apa yang dicari (sel `E2`).
2. **Kolom Pencarian**: Di kolom mana kuncinya berada (`A2:A5`).
3. **Kolom Hasil**: Kolom mana yang ingin ditarik nilainya (`C2:C5`).
Syntax: `=XLOOKUP(lookup_value, lookup_array, return_array)`',
  'Cari harga produk **Tablet** di sel **F2** menggunakan fungsi `XLOOKUP`. Cari kunci produk di sel **E2** pada kolom pencarian produk **A2:A5**, lalu tarik harganya dari kolom hasil harga **C2:C5**.',
  array['', 'A', 'B', 'C', 'D', 'E', 'F']::text[],
  '[{"rowNum":1,"cells":[{"value":"Produk","header":true},{"value":"Kategori","header":true},{"value":"Harga","header":true},{"value":""},{"value":"Cari Produk","header":true},{"value":"Hasil Harga","header":true}]},{"rowNum":2,"cells":[{"value":"Laptop"},{"value":"Tech"},{"value":999},{"value":""},{"value":"Tablet"},{"value":"?","highlight":true}]},{"rowNum":3,"cells":[{"value":"Ponsel"},{"value":"Tech"},{"value":699},{"value":""},{"value":""},{"value":""}]},{"rowNum":4,"cells":[{"value":"Tablet","highlight":true},{"value":"Tech"},{"value":399,"highlight":true},{"value":""},{"value":""},{"value":""}]},{"rowNum":5,"cells":[{"value":"Aksesoris"},{"value":"Office"},{"value":45},{"value":""},{"value":""},{"value":""}]}]'::jsonb,
  array['=XLOOKUP(E2,A2:A5,C2:C5)', '=XLOOKUP(E2, A2:A5, C2:C5)', '=XLOOKUP(E2;A2:A5;C2:C5)']::text[],
  '$399.00',
  '{"row":1,"col":5}'::jsonb,
  'Ketik: =XLOOKUP(E2, A2:A5, C2:C5)',
  NULL,
  0
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

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
  array['', 'ID Karyawan', 'Nama Kotor', 'Golongan', 'Nama Bersih', 'Dept Code', 'Gaji Pokok', 'Tunjangan', 'Total Gaji', 'Status Gaji']::text[],
  '[{"rowNum":1,"cells":[{"value":"ID Karyawan","header":true,"borderTop":true,"borderLeft":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Nama Kotor","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Golongan","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Nama Bersih","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Dept Code","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Gaji Pokok","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Tunjangan","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Total Gaji","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"},{"value":"Status Gaji","header":true,"borderTop":true,"borderRight":true,"borderBottom":true,"bgColor":"bg-blue-50 dark:bg-blue-950/40"}]},{"rowNum":2,"cells":[{"value":"EMP-ADM-01","borderLeft":true},{"value":"  rudi WIDODO "},{"value":"I"},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true,"borderRight":true}]},{"rowNum":3,"cells":[{"value":"EMP-DEV-02","borderLeft":true},{"value":" dewi LESTARI  "},{"value":"II"},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true},{"value":"?","highlight":true,"borderRight":true}]},{"rowNum":4,"cells":[{"value":"EMP-FIN-03","borderLeft":true,"borderBottom":true},{"value":" andi WIRAWAN ","borderBottom":true},{"value":"I","borderBottom":true},{"value":"?","highlight":true,"borderBottom":true},{"value":"?","highlight":true,"borderBottom":true},{"value":"?","highlight":true,"borderBottom":true},{"value":"?","highlight":true,"borderBottom":true},{"value":"?","highlight":true,"borderBottom":true},{"value":"?","highlight":true,"borderRight":true,"borderBottom":true}]},{"rowNum":5,"cells":[{"value":"REFERENSI GOLONGAN (VLOOKUP)","className":"font-bold text-slate-700 dark:text-slate-200 text-xs overflow-visible whitespace-nowrap z-10 px-4","borderTop":true,"borderLeft":true,"borderBottom":true,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderRight":true,"borderBottom":true,"borderLeft":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"}]},{"rowNum":6,"cells":[{"value":"Golongan","header":true,"borderTop":true,"borderLeft":true,"borderBottom":true,"bgColor":"bg-sky-50 dark:bg-sky-950/40"},{"value":"Gaji Pokok","header":true,"borderTop":true,"borderRight":true,"borderBottom":true,"bgColor":"bg-sky-50 dark:bg-sky-950/40"},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""}]},{"rowNum":7,"cells":[{"value":"I","borderLeft":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":5000,"borderRight":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""}]},{"rowNum":8,"cells":[{"value":"II","borderLeft":true,"borderBottom":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":7000,"borderRight":true,"borderBottom":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""}]},{"rowNum":9,"cells":[{"value":"REFERENSI TUNJANGAN DEPT (HLOOKUP)","className":"font-bold text-slate-700 dark:text-slate-200 text-xs overflow-visible whitespace-nowrap z-10 px-4","borderTop":true,"borderLeft":true,"borderBottom":true,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderBottom":true,"borderLeft":false,"borderRight":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"},{"value":"","borderTop":true,"borderRight":true,"borderBottom":true,"borderLeft":false,"bgColor":"bg-slate-100 dark:bg-slate-800/80"}]},{"rowNum":10,"cells":[{"value":"Dept Code","header":true,"borderTop":true,"borderLeft":true,"borderBottom":true,"bgColor":"bg-sky-50 dark:bg-sky-950/40"},{"value":"ADM","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-sky-50 dark:bg-sky-950/40"},{"value":"DEV","header":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-sky-50 dark:bg-sky-950/40"},{"value":"FIN","header":true,"borderTop":true,"borderRight":true,"borderBottom":true,"bgColor":"bg-sky-50 dark:bg-sky-950/40"},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""}]},{"rowNum":11,"cells":[{"value":"Tunjangan","borderLeft":true,"borderBottom":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":600,"borderBottom":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":1000,"borderBottom":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":800,"borderRight":true,"borderBottom":true,"bgColor":"bg-sky-50/10 dark:bg-sky-950/10"},{"value":""},{"value":""},{"value":""},{"value":""},{"value":""}]},{"rowNum":12,"cells":[{"value":"Total Pengeluaran Gaji","borderLeft":true,"borderTop":true,"borderBottom":true,"className":"font-semibold text-xs","bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"?","highlight":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderRight":true,"borderTop":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"}]},{"rowNum":13,"cells":[{"value":"Jumlah Karyawan Golongan I","borderLeft":true,"borderBottom":true,"className":"font-semibold text-xs","bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"?","highlight":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"},{"value":"","borderRight":true,"borderBottom":true,"bgColor":"bg-indigo-500/5 dark:bg-indigo-500/10"}]}]'::jsonb,
  array[]::text[],
  '',
  '{"row":0,"col":0}'::jsonb,
  '',
  '[{"label":"Nama Bersih Rudi","resultCell":{"row":1,"col":3},"validFormulas":["=PROPER(TRIM(B2))"],"expectedResult":"Rudi Widodo","hint":"Bersihkan spasi & kapitalisasi B2: =PROPER(TRIM(B2))"},{"label":"Kode Dept Rudi","resultCell":{"row":1,"col":4},"validFormulas":["=MID(A2,5,3)"],"expectedResult":"ADM","hint":"Ambil 3 karakter mulai posisi ke-5 dari A2: =MID(A2,5,3)"},{"label":"Gaji Pokok Rudi (VLOOKUP)","resultCell":{"row":1,"col":5},"validFormulas":["=VLOOKUP(C2,$A$7:$B$8,2,0)","=VLOOKUP(C2,$A$7:$B$8,2,FALSE)","=VLOOKUP(C2,A7:B8,2,0)","=VLOOKUP(C2,A7:B8,2,FALSE)"],"expectedResult":"5,000","hint":"Cari Golongan (C2) pada Tabel Ref Golongan (A7:B8): =VLOOKUP(C2,$A$7:$B$8,2,0)"},{"label":"Tunjangan Rudi (HLOOKUP)","resultCell":{"row":1,"col":6},"validFormulas":["=HLOOKUP(E2,$A$10:$D$11,2,0)","=HLOOKUP(E2,$A$10:$D$11,2,FALSE)","=HLOOKUP(E2,A10:D11,2,0)","=HLOOKUP(E2,A10:D11,2,FALSE)"],"expectedResult":"600","hint":"Cari Kode Dept (E2) pada Tabel Ref Tunjangan (A10:D11): =HLOOKUP(E2,$A$10:$D$11,2,0)"},{"label":"Total Gaji Rudi","resultCell":{"row":1,"col":7},"validFormulas":["=SUM(F2,G2)","=F2+G2","=SUM(F2;G2)"],"expectedResult":"5,600","hint":"Jumlahkan Gaji Pokok (F2) + Tunjangan (G2): =SUM(F2,G2)"},{"label":"Status Gaji Rudi","resultCell":{"row":1,"col":8},"validFormulas":["=IF(H2>=7500,\"Tinggi\",IF(H2>=5500,\"Sedang\",\"Rendah\"))","=IF(H2>=7500, \"Tinggi\", IF(H2>=5500, \"Sedang\", \"Rendah\"))","=IF(H2>=7500;\"Tinggi\";IF(H2>=5500;\"Sedang\";\"Rendah\"))","=IF(H2>=7500; \"Tinggi\"; IF(H2>=5500; \"Sedang\"; \"Rendah\"))"],"expectedResult":"Sedang","hint":"Evaluasi status gaji Rudi (H2) dengan Nested IF (>=7500 \"Tinggi\", >=5500 \"Sedang\", <5500 \"Rendah\"): =IF(H2>=7500,\"Tinggi\",IF(H2>=5500,\"Sedang\",\"Rendah\"))"},{"label":"Nama Bersih Dewi","resultCell":{"row":2,"col":3},"validFormulas":["=PROPER(TRIM(B3))"],"expectedResult":"Dewi Lestari","hint":"Bersihkan spasi & kapitalisasi B3: =PROPER(TRIM(B3))"},{"label":"Kode Dept Dewi","resultCell":{"row":2,"col":4},"validFormulas":["=MID(A3,5,3)"],"expectedResult":"DEV","hint":"Ambil 3 karakter mulai posisi ke-5 dari A3: =MID(A3,5,3)"},{"label":"Gaji Pokok Dewi (VLOOKUP)","resultCell":{"row":2,"col":5},"validFormulas":["=VLOOKUP(C3,$A$7:$B$8,2,0)","=VLOOKUP(C3,$A$7:$B$8,2,FALSE)","=VLOOKUP(C3,A7:B8,2,0)","=VLOOKUP(C3,A7:B8,2,FALSE)"],"expectedResult":"7,000","hint":"Cari Golongan (C3) pada Tabel Ref Golongan (A7:B8): =VLOOKUP(C3,$A$7:$B$8,2,0)"},{"label":"Tunjangan Dewi (HLOOKUP)","resultCell":{"row":2,"col":6},"validFormulas":["=HLOOKUP(E3,$A$10:$D$11,2,0)","=HLOOKUP(E3,$A$10:$D$11,2,FALSE)","=HLOOKUP(E3,A10:D11,2,0)","=HLOOKUP(E3,A10:D11,2,FALSE)"],"expectedResult":"1,000","hint":"Cari Kode Dept (E3) pada Tabel Ref Tunjangan (A10:D11): =HLOOKUP(E3,$A$10:$D$11,2,0)"},{"label":"Total Gaji Dewi","resultCell":{"row":2,"col":7},"validFormulas":["=SUM(F3,G3)","=F3+G3","=SUM(F3;G3)"],"expectedResult":"8,000","hint":"Jumlahkan Gaji Pokok (F3) + Tunjangan (G3): =SUM(F3,G3)"},{"label":"Status Gaji Dewi","resultCell":{"row":2,"col":8},"validFormulas":["=IF(H3>=7500,\"Tinggi\",IF(H3>=5500,\"Sedang\",\"Rendah\"))","=IF(H3>=7500, \"Tinggi\", IF(H3>=5500, \"Sedang\", \"Rendah\"))","=IF(H3>=7500;\"Tinggi\";IF(H3>=5500;\"Sedang\";\"Rendah\"))","=IF(H3>=7500; \"Tinggi\"; IF(H3>=5500; \"Sedang\"; \"Rendah\"))"],"expectedResult":"Tinggi","hint":"Evaluasi status gaji Dewi (H3) dengan Nested IF (>=7500 \"Tinggi\", >=5500 \"Sedang\", <5500 \"Rendah\"): =IF(H3>=7500,\"Tinggi\",IF(H3>=5500,\"Sedang\",\"Rendah\"))"},{"label":"Nama Bersih Andi","resultCell":{"row":3,"col":3},"validFormulas":["=PROPER(TRIM(B4))"],"expectedResult":"Andi Wirawan","hint":"Bersihkan spasi & kapitalisasi B4: =PROPER(TRIM(B4))"},{"label":"Kode Dept Andi","resultCell":{"row":3,"col":4},"validFormulas":["=MID(A4,5,3)"],"expectedResult":"FIN","hint":"Ambil 3 karakter mulai posisi ke-5 dari A4: =MID(A4,5,3)"},{"label":"Gaji Pokok Andi (VLOOKUP)","resultCell":{"row":3,"col":5},"validFormulas":["=VLOOKUP(C4,$A$7:$B$8,2,0)","=VLOOKUP(C4,$A$7:$B$8,2,FALSE)","=VLOOKUP(C4,A7:B8,2,0)","=VLOOKUP(C4,A7:B8,2,FALSE)"],"expectedResult":"5,000","hint":"Cari Golongan (C4) pada Tabel Ref Golongan (A7:B8): =VLOOKUP(C4,$A$7:$B$8,2,0)"},{"label":"Tunjangan Andi (HLOOKUP)","resultCell":{"row":3,"col":6},"validFormulas":["=HLOOKUP(E4,$A$10:$D$11,2,0)","=HLOOKUP(E4,$A$10:$D$11,2,FALSE)","=HLOOKUP(E4,A10:D11,2,0)","=HLOOKUP(E4,A10:D11,2,FALSE)"],"expectedResult":"800","hint":"Cari Kode Dept (E4) pada Tabel Ref Tunjangan (A10:D11): =HLOOKUP(E4,$A$10:$D$11,2,0)"},{"label":"Total Gaji Andi","resultCell":{"row":3,"col":7},"validFormulas":["=SUM(F4,G4)","=F4+G4","=SUM(F4;G4)"],"expectedResult":"5,800","hint":"Jumlahkan Gaji Pokok (F4) + Tunjangan (G4): =SUM(F4,G4)"},{"label":"Status Gaji Andi","resultCell":{"row":3,"col":8},"validFormulas":["=IF(H4>=7500,\"Tinggi\",IF(H4>=5500,\"Sedang\",\"Rendah\"))","=IF(H4>=7500, \"Tinggi\", IF(H4>=5500, \"Sedang\", \"Rendah\"))","=IF(H4>=7500;\"Tinggi\";IF(H4>=5500;\"Sedang\";\"Rendah\"))","=IF(H4>=7500; \"Tinggi\"; IF(H4>=5500; \"Sedang\"; \"Rendah\"))"],"expectedResult":"Sedang","hint":"Evaluasi status gaji Andi (H4) dengan Nested IF (>=7500 \"Tinggi\", >=5500 \"Sedang\", <5500 \"Rendah\"): =IF(H4>=7500,\"Tinggi\",IF(H4>=5500,\"Sedang\",\"Rendah\"))"},{"label":"Total Pengeluaran Gaji (SUM)","resultCell":{"row":11,"col":7},"validFormulas":["=SUM(H2:H4)"],"expectedResult":"19,400","hint":"Jumlahkan total pengeluaran gaji: =SUM(H2:H4)"},{"label":"Jumlah Karyawan Golongan I (COUNTIF)","resultCell":{"row":12,"col":7},"validFormulas":["=COUNTIF(C2:C4,\"I\")","=COUNTIF(C2:C4;\"I\")"],"expectedResult":"2","hint":"Hitung Golongan (C2:C4) yang bernilai \"I\": =COUNTIF(C2:C4,\"I\")"}]'::jsonb,
  0
) on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  short_description = excluded.short_description,
  concept_explanation = excluded.concept_explanation,
  instructions = excluded.instructions,
  headers = excluded.headers,
  dummy_data = excluded.dummy_data,
  valid_formulas = excluded.valid_formulas,
  expected_result = excluded.expected_result,
  result_cell = excluded.result_cell,
  hint = excluded.hint,
  tasks = excluded.tasks,
  sort_order = excluded.sort_order;

