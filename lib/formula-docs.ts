export interface FormulaDoc {
  name: string;
  syntax: string;
  desc: string;
  params: { name: string; desc: string }[];
}

export const FORMULA_DOCS: FormulaDoc[] = [
  // === CATEGORY 1: MATHEMATICS & STATISTICS BASIC ===
  {
    name: "SUM",
    syntax: "SUM(number1, [number2], ...)",
    desc: "Menjumlahkan semua angka dalam rentang sel.",
    params: [
      { name: "number1", desc: "Sel atau rentang pertama yang ingin dijumlahkan (misal: F2 atau F2:G2)." },
      { name: "[number2]", desc: "Sel atau rentang tambahan untuk dijumlahkan (opsional)." }
    ]
  },
  {
    name: "AVERAGE",
    syntax: "AVERAGE(number1, [number2], ...)",
    desc: "Menghitung rata-rata dari sekelompok data angka.",
    params: [
      { name: "number1", desc: "Sel atau rentang pertama yang ingin dihitung rata-ratanya (misal: F2:G2)." },
      { name: "[number2]", desc: "Sel atau rentang tambahan untuk dirata-ratakan (opsional)." }
    ]
  },
  {
    name: "MAX",
    syntax: "MAX(number1, [number2], ...)",
    desc: "Mencari nilai tertinggi dari sekelompok data angka.",
    params: [
      { name: "number1", desc: "Sel atau rentang data angka yang ingin dicari nilai tertingginya." },
      { name: "[number2]", desc: "Sel atau rentang data tambahan (opsional)." }
    ]
  },
  {
    name: "MIN",
    syntax: "MIN(number1, [number2], ...)",
    desc: "Mencari nilai terendah dari sekelompok data angka.",
    params: [
      { name: "number1", desc: "Sel atau rentang data angka yang ingin dicari nilai terendahnya." },
      { name: "[number2]", desc: "Sel atau rentang data tambahan (opsional)." }
    ]
  },
  {
    name: "COUNT",
    syntax: "COUNT(value1, [value2], ...)",
    desc: "Menghitung jumlah sel yang berisi data bertipe angka.",
    params: [
      { name: "value1", desc: "Sel atau rentang data yang ingin dihitung sel berisi angkanya." },
      { name: "[value2]", desc: "Sel atau rentang tambahan (opsional)." }
    ]
  },
  {
    name: "COUNTA",
    syntax: "COUNTA(value1, [value2], ...)",
    desc: "Menghitung jumlah sel yang tidak kosong (berisi teks, angka, dll).",
    params: [
      { name: "value1", desc: "Sel atau rentang data yang ingin dihitung sel terisinya." },
      { name: "[value2]", desc: "Sel atau rentang tambahan (opsional)." }
    ]
  },
  {
    name: "LARGE",
    syntax: "LARGE(array, k)",
    desc: "Mencari nilai terbesar ke-k dari sekumpulan data.",
    params: [
      { name: "array", desc: "Rentang sel data angka yang ingin dievaluasi (misal: H2:H4)." },
      { name: "k", desc: "Posisi peringkat terbesar ke-k yang ingin dicari (misal: 1 untuk terbesar, 2 untuk kedua terbesar)." }
    ]
  },
  {
    name: "SMALL",
    syntax: "SMALL(array, k)",
    desc: "Mencari nilai terkecil ke-k dari sekumpulan data.",
    params: [
      { name: "array", desc: "Rentang sel data angka yang ingin dievaluasi (misal: H2:H4)." },
      { name: "k", desc: "Posisi peringkat terkecil ke-k yang ingin dicari (misal: 1 untuk terkecil, 2 untuk kedua terkecil)." }
    ]
  },
  {
    name: "SUMPRODUCT",
    syntax: "SUMPRODUCT(array1, [array2], ...)",
    desc: "Mengalikan elemen-elemen array yang bersesuaian lalu menjumlahkan hasil perkalian tersebut.",
    params: [
      { name: "array1", desc: "Rentang sel pertama yang ingin dikalikan elemennya (misal: B2:B4)." },
      { name: "[array2]", desc: "Rentang sel kedua yang ingin dikalikan dengan rentang pertama (misal: C2:C4)." }
    ]
  },
  {
    name: "AGGREGATE",
    syntax: "AGGREGATE(function_num, options, ref1, [ref2], ...)",
    desc: "Melakukan fungsi kalkulasi statistik/matematika dengan kemampuan mengabaikan error atau baris tersembunyi.",
    params: [
      { name: "function_num", desc: "Angka kode fungsi (misal: 9 untuk SUM, 1 untuk AVERAGE)." },
      { name: "options", desc: "Angka kode opsi pengabaian (misal: 6 untuk mengabaikan error, 5 untuk mengabaikan baris tersembunyi)." },
      { name: "ref1", desc: "Rentang sel pertama yang akan dikalkulasi." },
      { name: "[ref2]", desc: "Rentang sel tambahan (opsional)." }
    ]
  },
  {
    name: "ABS",
    syntax: "ABS(number)",
    desc: "Menghasilkan nilai absolut (positif) dari suatu angka.",
    params: [
      { name: "number", desc: "Angka atau sel referensi berisi angka yang ingin dipositifkan (misal: -500 atau A2)." }
    ]
  },
  {
    name: "MODE",
    syntax: "MODE(number1, [number2], ...)",
    desc: "Mencari nilai yang paling sering muncul dari sekelompok data.",
    params: [
      { name: "number1", desc: "Sel atau rentang data angka untuk dicari nilai modusnya." },
      { name: "[number2]", desc: "Rentang data tambahan (opsional)." }
    ]
  },
  {
    name: "RANK",
    syntax: "RANK(number, ref, [order])",
    desc: "Mengembalikan peringkat/ranking suatu angka dalam sekelompok daftar angka.",
    params: [
      { name: "number", desc: "Angka yang ingin dicari peringkatnya (misal: H2)." },
      { name: "ref", desc: "Rentang sel berisi seluruh daftar angka sebagai acuan peringkat (misal: $H$2:$H$4)." },
      { name: "[order]", desc: "Gunakan 0 atau kosong untuk peringkat menurun (terbesar ranking 1), atau 1 untuk peringkat menaik." }
    ]
  },
  {
    name: "RAND",
    syntax: "RAND()",
    desc: "Menghasilkan angka acak desimal yang lebih besar dari atau sama dengan 0 dan kurang dari 1.",
    params: []
  },
  {
    name: "RANDBETWEEN",
    syntax: "RANDBETWEEN(bottom, top)",
    desc: "Menghasilkan angka bulat acak di antara dua batas angka yang ditentukan.",
    params: [
      { name: "bottom", desc: "Batas bilangan bulat terkecil (terbawah) yang diizinkan." },
      { name: "top", desc: "Batas bilangan bulat terbesar (teratas) yang diizinkan." }
    ]
  },
  {
    name: "ROMAN",
    syntax: "ROMAN(number, [form])",
    desc: "Mengubah angka arab menjadi representasi teks angka romawi.",
    params: [
      { name: "number", desc: "Angka arab positif yang ingin dikonversi ke romawi." },
      { name: "[form]", desc: "Format tipe romawi (opsional, default 0 untuk klasik)." }
    ]
  },
  {
    name: "ARABIC",
    syntax: "ARABIC(text)",
    desc: "Mengubah teks angka romawi menjadi representasi angka arab biasa.",
    params: [
      { name: "text", desc: "Teks atau sel referensi berisi angka romawi yang ingin dikonversi (misal: \"XV\")." }
    ]
  },

  // === CATEGORY 2: ROUNDING ===
  {
    name: "ROUND",
    syntax: "ROUND(number, num_digits)",
    desc: "Membulatkan angka ke jumlah digit desimal tertentu sesuai logika matematika.",
    params: [
      { name: "number", desc: "Angka desimal atau sel referensi yang ingin dibulatkan (misal: A2)." },
      { name: "num_digits", desc: "Jumlah posisi desimal yang diinginkan (gunakan 0 untuk membulatkan ke bilangan bulat terdekat)." }
    ]
  },
  {
    name: "ROUNDDOWN",
    syntax: "ROUNDDOWN(number, num_digits)",
    desc: "Membulatkan angka ke bawah mendekati nol berdasarkan jumlah desimal tertentu.",
    params: [
      { name: "number", desc: "Angka desimal atau sel referensi yang ingin dibulatkan ke bawah." },
      { name: "num_digits", desc: "Jumlah posisi desimal hasil pembulatan (gunakan 0 untuk bilangan bulat)." }
    ]
  },
  {
    name: "ROUNDUP",
    syntax: "ROUNDUP(number, num_digits)",
    desc: "Membulatkan angka ke atas menjauhi nol berdasarkan jumlah desimal tertentu.",
    params: [
      { name: "number", desc: "Angka desimal atau sel referensi yang ingin dibulatkan ke atas." },
      { name: "num_digits", desc: "Jumlah posisi desimal hasil pembulatan (gunakan 0 untuk bilangan bulat)." }
    ]
  },
  {
    name: "INT",
    syntax: "INT(number)",
    desc: "Membulatkan angka desimal ke bawah ke bilangan bulat terdekat.",
    params: [
      { name: "number", desc: "Angka desimal atau sel referensi yang ingin dibulatkan ke bawah ke bilangan bulat (misal: 5.8 menjadi 5)." }
    ]
  },
  {
    name: "CEILING",
    syntax: "CEILING(number, significance)",
    desc: "Membulatkan angka ke atas ke kelipatan terdekat dari nilai signifikansi yang ditentukan.",
    params: [
      { name: "number", desc: "Angka desimal yang ingin dibulatkan ke atas." },
      { name: "significance", desc: "Kelipatan acuan pembulatan (misal: 100 atau 500)." }
    ]
  },
  {
    name: "FLOOR",
    syntax: "FLOOR(number, significance)",
    desc: "Membulatkan angka ke bawah ke kelipatan terdekat dari nilai signifikansi yang ditentukan.",
    params: [
      { name: "number", desc: "Angka desimal yang ingin dibulatkan ke bawah." },
      { name: "significance", desc: "Kelipatan acuan pembulatan (misal: 100 atau 500)." }
    ]
  },
  {
    name: "MROUND",
    syntax: "MROUND(number, multiple)",
    desc: "Membulatkan angka ke kelipatan terdekat (bisa ke atas atau ke bawah tergantung mana yang lebih dekat).",
    params: [
      { name: "number", desc: "Angka desimal yang ingin dibulatkan." },
      { name: "multiple", desc: "Kelipatan target pembulatan (misal: 50 untuk pembulatan kelipatan 50)." }
    ]
  },

  // === CATEGORY 3: TEXT CLEANUP ===
  {
    name: "CONCATENATE",
    syntax: "CONCATENATE(text1, [text2], ...)",
    desc: "Menggabungkan dua atau lebih string teks menjadi satu string teks tunggal.",
    params: [
      { name: "text1", desc: "Teks pertama atau sel pertama yang ingin digabungkan (misal: B2)." },
      { name: "[text2]", desc: "Teks atau sel tambahan untuk digabungkan (opsional)." }
    ]
  },
  {
    name: "TRIM",
    syntax: "TRIM(text)",
    desc: "Menghilangkan spasi ganda dan spasi di awal/akhir teks secara otomatis.",
    params: [
      { name: "text", desc: "Teks atau sel referensi yang ingin dibersihkan spasinya (misal: B2)." }
    ]
  },
  {
    name: "CLEAN",
    syntax: "CLEAN(text)",
    desc: "Menghapus semua karakter yang tidak dapat dicetak (seperti karakter baris baru / non-printable) dari teks.",
    params: [
      { name: "text", desc: "Teks atau sel referensi yang ingin dihapus karakter kontrolnya." }
    ]
  },
  {
    name: "UPPER",
    syntax: "UPPER(text)",
    desc: "Mengubah seluruh huruf dalam teks menjadi huruf besar (kapital).",
    params: [
      { name: "text", desc: "Teks atau sel referensi yang ingin diubah menjadi huruf besar semua (misal: B2)." }
    ]
  },
  {
    name: "LOWER",
    syntax: "LOWER(text)",
    desc: "Mengubah seluruh huruf dalam teks menjadi huruf kecil semua.",
    params: [
      { name: "text", desc: "Teks atau sel referensi yang ingin diubah menjadi huruf kecil semua (misal: B2)." }
    ]
  },
  {
    name: "PROPER",
    syntax: "PROPER(text)",
    desc: "Mengubah huruf pertama setiap kata menjadi huruf besar (kapital) dan huruf berikutnya kecil.",
    params: [
      { name: "text", desc: "Teks atau sel referensi yang ingin dirapikan huruf kapitalnya (misal: B2)." }
    ]
  },
  {
    name: "EXACT",
    syntax: "EXACT(text1, text2)",
    desc: "Membandingkan dua teks secara peka huruf kapital (case-sensitive) dan mengembalikan TRUE jika sama persis.",
    params: [
      { name: "text1", desc: "Teks pertama yang akan dibandingkan." },
      { name: "text2", desc: "Teks kedua yang akan dibandingkan." }
    ]
  },

  // === CATEGORY 4: TEXT EXTRACTION ===
  {
    name: "LEFT",
    syntax: "LEFT(text, [num_chars])",
    desc: "Mengambil beberapa karakter paling kiri dari teks berdasarkan jumlah yang diminta.",
    params: [
      { name: "text", desc: "Teks atau sel berisi teks yang ingin diambil sebagian karakternya." },
      { name: "[num_chars]", desc: "Jumlah karakter yang ingin diambil dari sebelah kiri (opsional, default 1)." }
    ]
  },
  {
    name: "MID",
    syntax: "MID(text, start_num, num_chars)",
    desc: "Mengambil karakter dari bagian tengah teks berdasarkan posisi awal dan jumlah karakter yang diminta.",
    params: [
      { name: "text", desc: "Teks atau sel berisi teks asli (misal: A2)." },
      { name: "start_num", desc: "Posisi karakter pertama yang ingin diambil (dimulai dari 1)." },
      { name: "num_chars", desc: "Jumlah karakter yang ingin diekstraksi." }
    ]
  },
  {
    name: "RIGHT",
    syntax: "RIGHT(text, [num_chars])",
    desc: "Mengambil beberapa karakter paling kanan dari teks berdasarkan jumlah yang diminta.",
    params: [
      { name: "text", desc: "Teks atau sel berisi teks yang ingin diambil sebagian karakternya." },
      { name: "[num_chars]", desc: "Jumlah karakter yang ingin diambil dari sebelah kanan (opsional, default 1)." }
    ]
  },
  {
    name: "LEN",
    syntax: "LEN(text)",
    desc: "Menghitung jumlah karakter atau panjang digit teks dalam suatu sel.",
    params: [
      { name: "text", desc: "Teks atau sel referensi yang ingin dihitung jumlah karakternya (misal: A2)." }
    ]
  },

  // === CATEGORY 5: SEARCH & LOOKUP ===
  {
    name: "VLOOKUP",
    syntax: "VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])",
    desc: "Mencari kata kunci pada kolom pertama tabel referensi vertikal dan mengambil nilai di kolom indeks yang sebaris.",
    params: [
      { name: "lookup_value", desc: "Nilai kunci yang dicari (misal Golongan: C2)." },
      { name: "table_array", desc: "Tabel referensi data, pastikan dikunci absolut dengan tanda $ (misal: $A$7:$B$8)." },
      { name: "col_index_num", desc: "Nomor urut kolom tabel referensi yang ingin diambil nilainya (dimulai dari 1)." },
      { name: "[range_lookup]", desc: "Gunakan 0 atau FALSE untuk pencarian persis (exact match)." }
    ]
  },
  {
    name: "HLOOKUP",
    syntax: "HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])",
    desc: "Mencari kata kunci pada baris pertama tabel referensi horizontal dan mengambil nilai di baris indeks yang sekolom.",
    params: [
      { name: "lookup_value", desc: "Nilai kunci yang dicari (misal Kode Dept: E2)." },
      { name: "table_array", desc: "Tabel referensi data, pastikan dikunci absolut dengan tanda $ (misal: $A$10:$D$11)." },
      { name: "row_index_num", desc: "Nomor urut baris tabel referensi yang ingin diambil nilainya (dimulai dari 1)." },
      { name: "[range_lookup]", desc: "Gunakan 0 atau FALSE untuk pencarian persis (exact match)." }
    ]
  },
  {
    name: "XLOOKUP",
    syntax: "XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])",
    desc: "Mencari nilai dalam rentang dan mengembalikan nilai dari rentang lain secara fleksibel (pencarian modern).",
    params: [
      { name: "lookup_value", desc: "Nilai kunci pencarian yang ingin dicari." },
      { name: "lookup_array", desc: "Rentang satu baris atau satu kolom yang berisi kunci pencarian (misal: $A$7:$A$8)." },
      { name: "return_array", desc: "Rentang satu baris atau satu kolom yang berisi hasil kembalian (misal: $B$7:$B$8)." },
      { name: "[if_not_found]", desc: "Nilai yang dikembalikan jika kunci pencarian tidak ditemukan (opsional)." },
      { name: "[match_mode]", desc: "Gunakan 0 untuk pencarian persis (opsional, default)." },
      { name: "[search_mode]", desc: "Mode arah pencarian (opsional, default 1 untuk dari atas ke bawah)." }
    ]
  },
  {
    name: "INDEX",
    syntax: "INDEX(array, row_num, [col_num])",
    desc: "Mengembalikan nilai di dalam rentang tabel berdasarkan nomor baris dan nomor kolom tertentu.",
    params: [
      { name: "array", desc: "Rentang tabel atau baris/kolom data target pencarian (misal: $A$2:$C$10)." },
      { name: "row_num", desc: "Nomor indeks baris dalam rentang yang ingin diambil datanya." },
      { name: "[col_num]", desc: "Nomor indeks kolom dalam rentang yang ingin diambil datanya (opsional)." }
    ]
  },
  {
    name: "MATCH",
    syntax: "MATCH(lookup_value, lookup_array, [match_type])",
    desc: "Mencari posisi indeks relatif suatu nilai di dalam rentang baris atau kolom.",
    params: [
      { name: "lookup_value", desc: "Nilai kunci pencarian yang ingin dicari posisi indeksnya." },
      { name: "lookup_array", desc: "Rentang satu kolom atau satu baris data pencarian (misal: $A$2:$A$10)." },
      { name: "[match_type]", desc: "Gunakan 0 untuk kecocokan persis (exact match)." }
    ]
  },

  // === CATEGORY 6: LOGIC ===
  {
    name: "IF",
    syntax: "IF(logical_test, value_if_true, [value_if_false])",
    desc: "Mengevaluasi kondisi logika dan menghasilkan satu nilai jika BENAR, atau nilai lain jika SALAH.",
    params: [
      { name: "logical_test", desc: "Kondisi perbandingan logika yang diuji (misal: H2>=7500)." },
      { name: "value_if_true", desc: "Nilai hasil jika kondisi bernilai BENAR (misal: \"Tinggi\")." },
      { name: "[value_if_false]", desc: "Nilai hasil jika kondisi bernilai SALAH (bisa berupa IF bertingkat / Nested IF)." }
    ]
  },
  {
    name: "IFERROR",
    syntax: "IFERROR(value, value_if_error)",
    desc: "Mengembalikan nilai alternatif yang ditentukan jika rumus menghasilkan pesan kesalahan (error).",
    params: [
      { name: "value", desc: "Rumus atau sel yang ingin diperiksa apakah menghasilkan error (misal: VLOOKUP(...))." },
      { name: "value_if_error", desc: "Nilai yang dikembalikan jika terjadi error (misal: \"Data Tidak Ditemukan\")." }
    ]
  },
  {
    name: "IFS",
    syntax: "IFS(logical_test1, value_if_true1, [logical_test2, value_if_true2], ...)",
    desc: "Mengevaluasi beberapa kondisi logis secara berurutan dan mengembalikan nilai dari kondisi benar pertama.",
    params: [
      { name: "logical_test1", desc: "Kondisi logika pertama yang diuji." },
      { name: "value_if_true1", desc: "Nilai hasil pertama jika kondisi pertama bernilai BENAR." },
      { name: "[logical_test2]", desc: "Kondisi logika kedua untuk diuji (opsional)." }
    ]
  },
  {
    name: "AND",
    syntax: "AND(logical1, [logical2], ...)",
    desc: "Mengembalikan nilai TRUE jika seluruh argumen logika bernilai BENAR.",
    params: [
      { name: "logical1", desc: "Kondisi logika pertama yang harus terpenuhi." },
      { name: "[logical2]", desc: "Kondisi logika tambahan yang juga harus terpenuhi (opsional)." }
    ]
  },
  {
    name: "OR",
    syntax: "OR(logical1, [logical2], ...)",
    desc: "Mengembalikan nilai TRUE jika salah satu dari beberapa argumen logika bernilai BENAR.",
    params: [
      { name: "logical1", desc: "Kondisi logika pertama yang diuji." },
      { name: "[logical2]", desc: "Kondisi logika tambahan yang diuji (opsional)." }
    ]
  },
  {
    name: "NOT",
    syntax: "NOT(logical)",
    desc: "Membalikkan nilai logika dari argumennya (TRUE menjadi FALSE, atau FALSE menjadi TRUE).",
    params: [
      { name: "logical", desc: "Nilai atau kondisi logika yang ingin dibalikkan nilainya." }
    ]
  },

  // === CATEGORY 7: CONDITIONAL MATHS/STATS ===
  {
    name: "SUMIF",
    syntax: "SUMIF(range, criteria, [sum_range])",
    desc: "Menjumlahkan nilai sel di dalam rentang yang memenuhi satu kriteria tertentu.",
    params: [
      { name: "range", desc: "Rentang sel berisi kriteria yang akan dievaluasi (misal: C2:C4)." },
      { name: "criteria", desc: "Kriteria syarat dalam bentuk teks, angka, atau ekspresi (misal: \"I\" atau \">1000\")." },
      { name: "[sum_range]", desc: "Rentang sel berisi nilai angka aktual yang ingin dijumlahkan jika berbeda dengan rentang kriteria (misal: H2:H4)." }
    ]
  },
  {
    name: "AVERAGEIF",
    syntax: "AVERAGEIF(range, criteria, [average_range])",
    desc: "Menghitung rata-rata sel di dalam rentang yang memenuhi satu kriteria tertentu.",
    params: [
      { name: "range", desc: "Rentang sel berisi kriteria yang akan dievaluasi (misal: C2:C4)." },
      { name: "criteria", desc: "Kriteria syarat (misal: \"I\")." },
      { name: "[average_range]", desc: "Rentang sel berisi angka aktual yang ingin dirata-ratakan (misal: H2:H4)." }
    ]
  },
  {
    name: "COUNTIF",
    syntax: "COUNTIF(range, criteria)",
    desc: "Menghitung jumlah sel dalam suatu rentang yang memenuhi satu kriteria tertentu.",
    params: [
      { name: "range", desc: "Rentang sel yang ingin dihitung jumlahnya (misal: C2:C4)." },
      { name: "criteria", desc: "Kriteria syarat kondisi (misal: \"I\" untuk menghitung golongan I)." }
    ]
  },
  {
    name: "SUMIFS",
    syntax: "SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
    desc: "Menjumlahkan nilai sel di dalam rentang yang memenuhi banyak kriteria yang ditentukan.",
    params: [
      { name: "sum_range", desc: "Rentang sel berisi angka aktual yang ingin dijumlahkan (misal: H2:H4)." },
      { name: "criteria_range1", desc: "Rentang sel pertama untuk evaluasi kriteria pertama." },
      { name: "criteria1", desc: "Kriteria pertama yang harus dipenuhi." }
    ]
  },
  {
    name: "AVERAGEIFS",
    syntax: "AVERAGEIFS(average_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
    desc: "Menghitung rata-rata sel di dalam rentang yang memenuhi banyak kriteria yang ditentukan.",
    params: [
      { name: "average_range", desc: "Rentang sel berisi angka aktual yang ingin dirata-ratakan (misal: H2:H4)." },
      { name: "criteria_range1", desc: "Rentang sel pertama untuk evaluasi kriteria pertama." },
      { name: "criteria1", desc: "Kriteria pertama yang harus dipenuhi." }
    ]
  },
  {
    name: "COUNTIFS",
    syntax: "COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
    desc: "Menghitung jumlah sel dalam rentang yang memenuhi banyak kriteria bersilang.",
    params: [
      { name: "criteria_range1", desc: "Rentang sel pertama untuk evaluasi kriteria pertama." },
      { name: "criteria1", desc: "Kriteria pertama yang harus dipenuhi." }
    ]
  },
  {
    name: "MAXIFS",
    syntax: "MAXIFS(max_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
    desc: "Mencari nilai tertinggi di dalam rentang yang memenuhi satu atau lebih kriteria.",
    params: [
      { name: "max_range", desc: "Rentang sel berisi angka aktual untuk dicari nilai tertinggi (misal: H2:H4)." },
      { name: "criteria_range1", desc: "Rentang sel pertama untuk evaluasi kriteria pertama." },
      { name: "criteria1", desc: "Kriteria pertama yang harus dipenuhi." }
    ]
  },
  {
    name: "MINIFS",
    syntax: "MINIFS(min_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
    desc: "Mencari nilai terendah di dalam rentang yang memenuhi satu atau lebih kriteria.",
    params: [
      { name: "min_range", desc: "Rentang sel berisi angka aktual untuk dicari nilai terendah (misal: H2:H4)." },
      { name: "criteria_range1", desc: "Rentang sel pertama untuk evaluasi kriteria pertama." },
      { name: "criteria1", desc: "Kriteria pertama." }
    ]
  },

  // === CATEGORY 8: DATE & TIME ===
  {
    name: "TODAY",
    syntax: "TODAY()",
    desc: "Mengembalikan tanggal hari ini secara dinamis berdasarkan sistem komputer.",
    params: []
  },
  {
    name: "NOW",
    syntax: "NOW()",
    desc: "Mengembalikan tanggal dan waktu saat ini secara dinamis.",
    params: []
  },
  {
    name: "DATE",
    syntax: "DATE(year, month, day)",
    desc: "Menghasilkan nilai tanggal utuh berdasarkan tahun, bulan, dan hari yang ditentukan.",
    params: [
      { name: "year", desc: "Nilai tahun berupa angka 4 digit (misal: 2026)." },
      { name: "month", desc: "Nilai bulan berupa angka 1 sampai 12." },
      { name: "day", desc: "Nilai tanggal hari berupa angka 1 sampai 31." }
    ]
  },
  {
    name: "YEAR",
    syntax: "YEAR(serial_number)",
    desc: "Mengambil nilai tahun (angka 4 digit) dari data format tanggal.",
    params: [
      { name: "serial_number", desc: "Tanggal atau sel referensi berisi data tanggal (misal: TODAY() atau A2)." }
    ]
  },
  {
    name: "MONTH",
    syntax: "MONTH(serial_number)",
    desc: "Mengambil nilai angka bulan (1 hingga 12) dari data format tanggal.",
    params: [
      { name: "serial_number", desc: "Tanggal atau sel referensi berisi data tanggal." }
    ]
  },
  {
    name: "DAY",
    syntax: "DAY(serial_number)",
    desc: "Mengambil nilai angka hari (1 hingga 31) dari data format tanggal.",
    params: [
      { name: "serial_number", desc: "Tanggal atau sel referensi berisi data tanggal." }
    ]
  },
  {
    name: "HOUR",
    syntax: "HOUR(serial_number)",
    desc: "Mengambil nilai jam (angka 0 hingga 23) dari format waktu/tanggal.",
    params: [
      { name: "serial_number", desc: "Waktu/tanggal atau sel referensi berisi data waktu (misal: NOW() atau A2)." }
    ]
  },
  {
    name: "MINUTE",
    syntax: "MINUTE(serial_number)",
    desc: "Mengambil nilai menit (angka 0 hingga 59) dari format waktu/tanggal.",
    params: [
      { name: "serial_number", desc: "Waktu/tanggal atau sel referensi berisi data waktu." }
    ]
  },
  {
    name: "SECOND",
    syntax: "SECOND(serial_number)",
    desc: "Mengambil nilai detik (angka 0 hingga 59) dari format waktu/tanggal.",
    params: [
      { name: "serial_number", desc: "Waktu/tanggal atau sel referensi berisi data waktu." }
    ]
  },
  {
    name: "TIME",
    syntax: "TIME(hour, minute, second)",
    desc: "Menghasilkan nilai waktu utuh berdasarkan jam, menit, dan detik yang ditentukan.",
    params: [
      { name: "hour", desc: "Nilai jam berupa angka 0 sampai 23." },
      { name: "minute", desc: "Nilai menit berupa angka 0 sampai 59." },
      { name: "second", desc: "Nilai detik berupa angka 0 sampai 59." }
    ]
  },
  {
    name: "EDATE",
    syntax: "EDATE(start_date, months)",
    desc: "Menghasilkan tanggal baru yang berjarak sekian bulan sebelum atau sesudah tanggal awal.",
    params: [
      { name: "start_date", desc: "Tanggal awal acuan." },
      { name: "months", desc: "Jumlah bulan berjarak (gunakan nilai positif untuk tanggal masa depan, negatif untuk masa lalu)." }
    ]
  },
  {
    name: "EOMONTH",
    syntax: "EOMONTH(start_date, months)",
    desc: "Menghasilkan tanggal hari terakhir dari bulan yang berjarak sekian bulan sebelum atau sesudah tanggal awal.",
    params: [
      { name: "start_date", desc: "Tanggal awal acuan." },
      { name: "months", desc: "Jumlah bulan berjarak." }
    ]
  },
  {
    name: "DATEDIF",
    syntax: "DATEDIF(start_date, end_date, unit)",
    desc: "Menghitung selisih waktu antara dua tanggal dalam satuan tahun, bulan, atau hari.",
    params: [
      { name: "start_date", desc: "Tanggal mulai awal." },
      { name: "end_date", desc: "Tanggal berakhir." },
      { name: "unit", desc: "Kode satuan selisih: \"Y\" untuk tahun penuh, \"M\" untuk bulan penuh, \"D\" untuk jumlah hari." }
    ]
  },
  {
    name: "NETWORKDAYS",
    syntax: "NETWORKDAYS(start_date, end_date, [holidays])",
    desc: "Menghitung jumlah hari kerja bersih (senin sampai jumat) di antara dua tanggal.",
    params: [
      { name: "start_date", desc: "Tanggal mulai awal." },
      { name: "end_date", desc: "Tanggal berakhir." },
      { name: "[holidays]", desc: "Rentang tanggal libur tambahan selain hari sabtu & minggu (opsional)." }
    ]
  },
  {
    name: "WORKDAY",
    syntax: "WORKDAY(start_date, days, [holidays])",
    desc: "Menghasilkan tanggal setelah sekian hari kerja, otomatis melompati hari sabtu-minggu dan hari libur.",
    params: [
      { name: "start_date", desc: "Tanggal mulai awal." },
      { name: "days", desc: "Jumlah hari kerja yang ingin ditambahkan." },
      { name: "[holidays]", desc: "Rentang tanggal libur tambahan (opsional)." }
    ]
  },
  {
    name: "YEARFRAC",
    syntax: "YEARFRAC(start_date, end_date, [basis])",
    desc: "Menghitung fraksi pecahan tahun yang mewakili selisih hari di antara dua tanggal.",
    params: [
      { name: "start_date", desc: "Tanggal mulai awal." },
      { name: "end_date", desc: "Tanggal berakhir." },
      { name: "[basis]", desc: "Sistem basis perhitungan hari (opsional, default 0 untuk US 30/360)." }
    ]
  }
];
