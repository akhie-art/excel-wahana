export interface ExcelCell {
  value: string | number;
  highlight?: boolean;
  header?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  borderRight?: boolean;
  borderDouble?: boolean;
  bgColor?: string;
  className?: string;
  rowSpan?: number;
  colSpan?: number;
  mergedHidden?: boolean;
}

export interface ExcelRow {
  rowNum: number;
  cells: ExcelCell[];
}

export interface CellTask {
  label: string;
  resultCell: { row: number; col: number };
  validFormulas: string[];
  expectedResult: string;
  hint: string;
}

export interface ModuleStep {
  id: string;
  title: string;
  shortDescription: string;
  conceptExplanation: string;
  instructions: string;
  headers: string[];
  dummyData: ExcelRow[];
  validFormulas: string[];
  expectedResult: string;
  resultCell: { row: number; col: number };
  hint: string;
  /** Jika diisi, steps dengan group yang sama akan digabung menjadi 1 item di curriculum list */
  group?: string;
  /** Label yang ditampilkan di curriculum list untuk keseluruhan group */
  groupLabel?: string;
  tasks?: CellTask[];
  isCustom?: boolean;
}

export interface ExcelModule {
  id: string;
  title: string;
  description: string;
  steps: ModuleStep[];
}

export const EXCEL_MODULES: ExcelModule[] = [
  {
    id: "hitung-data",
    title: "RUMUS UNTUK MENGHITUNG DATA",
    description: "Kumpulan fungsi dasar matematika untuk menjumlahkan, merata-rata, mencari ekstrem, dan menghitung data.",
    steps: [
      {
        id: "sum",
        title: "Sum (menjumlahkan data)",
        shortDescription: "Fungsi untuk menjumlahkan sekumpulan angka di dalam sel.",
        conceptExplanation: "Fungsi `SUM` digunakan untuk menjumlahkan nilai sel secara cepat. Cara penulisannya: `=SUM(SelAwal:SelAkhir)`. Tanda titik dua (`:`) melambangkan rentang.\n\nKita akan belajar di tabel **Laporan Kas Toko ATK** yang sama dan terus berkembang di setiap langkah pelajaran. Mulai dari yang sederhana — menghitung total belanja — sampai ke laporan analitik yang komprehensif.",
        instructions: "Lihat tabel Laporan Kas Toko ATK di sebelah kanan. Kolom **D (Total Belanja)** tiap barang sudah terisi. Tugas kamu: hitung **Total Seluruhnya** di sel **D5** menggunakan `=SUM(D2:D4)`. Klik dua kali sel **D5** lalu ketik rumusnya, tekan **Enter** untuk memeriksa.",
        headers: ["", "Nama Barang", "Jumlah Unit", "Harga Satuan", "Total Belanja"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Barang", header: true }, { value: "Jumlah Unit", header: true }, { value: "Harga Satuan", header: true }, { value: "Total Belanja", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop" }, { value: 2 }, { value: 8000 }, { value: 16000, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Mouse" }, { value: 10 }, { value: 150 }, { value: 1500, highlight: true }] },
          { rowNum: 4, cells: [{ value: "Keyboard" }, { value: 5 }, { value: 300 }, { value: 1500, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Total Seluruhnya" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          {
            label: "Total Seluruhnya (SUM)",
            resultCell: { row: 4, col: 3 },
            validFormulas: ["=SUM(D2:D4)", "=D2+D3+D4"],
            expectedResult: "19,000",
            hint: "Jumlahkan kolom Total Belanja: =SUM(D2:D4)"
          }
        ]
      },
      {
        id: "average",
        title: "Average (menghitung rata-rata)",
        shortDescription: "Mencari nilai rata-rata dari sekelompok angka.",
        conceptExplanation: "Fungsi `AVERAGE` menjumlahkan seluruh nilai pada rentang sel lalu membaginya dengan jumlah total data secara otomatis.\nSyntax: `=AVERAGE(SelAwal:SelAkhir)`\n\nLaporan Toko ATK kita bertambah satu baris baru: **Rata-rata Belanja**. Perhatikan bahwa rumus SUM dari langkah sebelumnya juga harus diisi ulang — ini melatih ingatan motorikmu!",
        instructions: "Tabel Toko ATK sekarang memiliki 2 baris kosong (**?**). Isi **D5** terlebih dahulu dengan `=SUM(D2:D4)`, lalu isi **D6** dengan rata-rata belanja menggunakan `=AVERAGE(D2:D4)`. Klik dua kali tiap sel untuk mulai mengetik.",
        headers: ["", "Nama Barang", "Jumlah Unit", "Harga Satuan", "Total Belanja"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Barang", header: true }, { value: "Jumlah Unit", header: true }, { value: "Harga Satuan", header: true }, { value: "Total Belanja", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop" }, { value: 2 }, { value: 8000 }, { value: 16000, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Mouse" }, { value: 10 }, { value: 150 }, { value: 1500, highlight: true }] },
          { rowNum: 4, cells: [{ value: "Keyboard" }, { value: 5 }, { value: 300 }, { value: 1500, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Total Seluruhnya" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Rata-rata Belanja" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          {
            label: "Total Seluruhnya (SUM)",
            resultCell: { row: 4, col: 3 },
            validFormulas: ["=SUM(D2:D4)", "=D2+D3+D4"],
            expectedResult: "19,000",
            hint: "Ingat langkah sebelumnya: =SUM(D2:D4)"
          },
          {
            label: "Rata-rata Belanja (AVERAGE)",
            resultCell: { row: 5, col: 3 },
            validFormulas: ["=AVERAGE(D2:D4)"],
            expectedResult: "6,333.33",
            hint: "Rata-rata total belanja: =AVERAGE(D2:D4)"
          }
        ]
      },
      {
        id: "max",
        title: "Max (mencari nilai tertinggi)",
        shortDescription: "Mengekstrak nilai angka paling besar dari suatu daftar.",
        conceptExplanation: "Fungsi `MAX` mengembalikan angka tertinggi di dalam suatu rentang data.\nSyntax: `=MAX(SelAwal:SelAkhir)`\n\nLaporan Toko ATK kita bertambah lagi dengan baris **Belanja Tertinggi**. Jangan lupa isi ulang D5 dan D6 dari ingatan — ini adalah bagian dari latihan pengulangan aktif!",
        instructions: "Tabel sekarang punya 3 baris kosong (**?**). Isi ulang **D5** (SUM) dan **D6** (AVERAGE), lalu isi **D7** dengan nilai belanja tertinggi menggunakan `=MAX(D2:D4)`. Klik dua kali tiap sel untuk mulai.",
        headers: ["", "Nama Barang", "Jumlah Unit", "Harga Satuan", "Total Belanja"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Barang", header: true }, { value: "Jumlah Unit", header: true }, { value: "Harga Satuan", header: true }, { value: "Total Belanja", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop" }, { value: 2 }, { value: 8000 }, { value: 16000, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Mouse" }, { value: 10 }, { value: 150 }, { value: 1500, highlight: true }] },
          { rowNum: 4, cells: [{ value: "Keyboard" }, { value: 5 }, { value: 300 }, { value: 1500, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Total Seluruhnya" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Rata-rata Belanja" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 7, cells: [{ value: "Belanja Tertinggi" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          { label: "Total Seluruhnya (SUM)", resultCell: { row: 4, col: 3 }, validFormulas: ["=SUM(D2:D4)", "=D2+D3+D4"], expectedResult: "19,000", hint: "=SUM(D2:D4)" },
          { label: "Rata-rata Belanja (AVERAGE)", resultCell: { row: 5, col: 3 }, validFormulas: ["=AVERAGE(D2:D4)"], expectedResult: "6,333.33", hint: "=AVERAGE(D2:D4)" },
          { label: "Belanja Tertinggi (MAX)", resultCell: { row: 6, col: 3 }, validFormulas: ["=MAX(D2:D4)"], expectedResult: "16,000", hint: "Cari nilai terbesar: =MAX(D2:D4)" }
        ]
      },
      {
        id: "min",
        title: "Min (mencari nilai terendah)",
        shortDescription: "Mengekstrak nilai angka paling kecil dari suatu daftar.",
        conceptExplanation: "Fungsi `MIN` mengembalikan angka terkecil di dalam suatu rentang data.\nSyntax: `=MIN(SelAwal:SelAkhir)`\n\nLaporan Toko ATK bertambah baris **Belanja Terendah**. Di setiap langkah, kamu mengisi ulang seluruh rumus sebelumnya — inilah cara tercepat melatih refleks formula Excel!",
        instructions: "Isi ulang **D5** (SUM), **D6** (AVERAGE), **D7** (MAX), lalu isi **D8** dengan nilai belanja terendah menggunakan `=MIN(D2:D4)`.",
        headers: ["", "Nama Barang", "Jumlah Unit", "Harga Satuan", "Total Belanja"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Barang", header: true }, { value: "Jumlah Unit", header: true }, { value: "Harga Satuan", header: true }, { value: "Total Belanja", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop" }, { value: 2 }, { value: 8000 }, { value: 16000, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Mouse" }, { value: 10 }, { value: 150 }, { value: 1500, highlight: true }] },
          { rowNum: 4, cells: [{ value: "Keyboard" }, { value: 5 }, { value: 300 }, { value: 1500, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Total Seluruhnya" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Rata-rata Belanja" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 7, cells: [{ value: "Belanja Tertinggi" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 8, cells: [{ value: "Belanja Terendah" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          { label: "Total Seluruhnya (SUM)", resultCell: { row: 4, col: 3 }, validFormulas: ["=SUM(D2:D4)", "=D2+D3+D4"], expectedResult: "19,000", hint: "=SUM(D2:D4)" },
          { label: "Rata-rata Belanja (AVERAGE)", resultCell: { row: 5, col: 3 }, validFormulas: ["=AVERAGE(D2:D4)"], expectedResult: "6,333.33", hint: "=AVERAGE(D2:D4)" },
          { label: "Belanja Tertinggi (MAX)", resultCell: { row: 6, col: 3 }, validFormulas: ["=MAX(D2:D4)"], expectedResult: "16,000", hint: "=MAX(D2:D4)" },
          { label: "Belanja Terendah (MIN)", resultCell: { row: 7, col: 3 }, validFormulas: ["=MIN(D2:D4)"], expectedResult: "1,500", hint: "Cari nilai terkecil: =MIN(D2:D4)" }
        ]
      },
      {
        id: "count",
        title: "Count (menghitung banyak data angka)",
        shortDescription: "Menghitung sel yang hanya berisi data angka saja.",
        conceptExplanation: "Fungsi `COUNT` menghitung berapa banyak sel di suatu rentang yang terisi oleh angka. Sel berisi huruf atau sel kosong akan dilewati.\nSyntax: `=COUNT(SelAwal:SelAkhir)`\n\nLaporan Toko ATK kita sekarang memerlukan baris **Banyak Transaksi Angka**. Isi ulang seluruh rumus sebelumnya juga!",
        instructions: "Isi ulang D5–D8 dari langkah sebelumnya, lalu isi **D9** dengan jumlah sel angka di rentang Total Belanja menggunakan `=COUNT(D2:D4)`.",
        headers: ["", "Nama Barang", "Jumlah Unit", "Harga Satuan", "Total Belanja"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Barang", header: true }, { value: "Jumlah Unit", header: true }, { value: "Harga Satuan", header: true }, { value: "Total Belanja", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop" }, { value: 2 }, { value: 8000 }, { value: 16000, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Mouse" }, { value: 10 }, { value: 150 }, { value: 1500, highlight: true }] },
          { rowNum: 4, cells: [{ value: "Keyboard" }, { value: 5 }, { value: 300 }, { value: 1500, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Total Seluruhnya" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Rata-rata Belanja" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 7, cells: [{ value: "Belanja Tertinggi" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 8, cells: [{ value: "Belanja Terendah" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 9, cells: [{ value: "Banyak Transaksi Angka" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          { label: "Total Seluruhnya (SUM)", resultCell: { row: 4, col: 3 }, validFormulas: ["=SUM(D2:D4)", "=D2+D3+D4"], expectedResult: "19,000", hint: "=SUM(D2:D4)" },
          { label: "Rata-rata Belanja (AVERAGE)", resultCell: { row: 5, col: 3 }, validFormulas: ["=AVERAGE(D2:D4)"], expectedResult: "6,333.33", hint: "=AVERAGE(D2:D4)" },
          { label: "Belanja Tertinggi (MAX)", resultCell: { row: 6, col: 3 }, validFormulas: ["=MAX(D2:D4)"], expectedResult: "16,000", hint: "=MAX(D2:D4)" },
          { label: "Belanja Terendah (MIN)", resultCell: { row: 7, col: 3 }, validFormulas: ["=MIN(D2:D4)"], expectedResult: "1,500", hint: "=MIN(D2:D4)" },
          { label: "Banyak Transaksi Angka (COUNT)", resultCell: { row: 8, col: 3 }, validFormulas: ["=COUNT(D2:D4)"], expectedResult: "3", hint: "Hitung sel angka di D2:D4: =COUNT(D2:D4)" }
        ]
      },
      {
        id: "counta",
        title: "Counta (menghitung semua data tidak kosong)",
        shortDescription: "Menghitung semua sel yang tidak kosong (baik berisi teks maupun angka).",
        conceptExplanation: "Berbeda dengan COUNT, fungsi `COUNTA` (Count All) akan menghitung setiap sel yang berisi karakter apa pun, termasuk teks, simbol, atau angka. Sel kosong tidak dihitung.\nSyntax: `=COUNTA(SelAwal:SelAkhir)`\n\nLaporan Toko ATK bertambah baris **Total Jenis Barang**. Isi ulang seluruh rumus D5–D9 juga!",
        instructions: "Isi ulang D5–D9 dari langkah sebelumnya, lalu isi **D10** dengan total jenis barang di kolom Nama Barang menggunakan `=COUNTA(A2:A4)`.",
        headers: ["", "Nama Barang", "Jumlah Unit", "Harga Satuan", "Total Belanja"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Barang", header: true }, { value: "Jumlah Unit", header: true }, { value: "Harga Satuan", header: true }, { value: "Total Belanja", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop" }, { value: 2 }, { value: 8000 }, { value: 16000, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Mouse" }, { value: 10 }, { value: 150 }, { value: 1500, highlight: true }] },
          { rowNum: 4, cells: [{ value: "Keyboard" }, { value: 5 }, { value: 300 }, { value: 1500, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Total Seluruhnya" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Rata-rata Belanja" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 7, cells: [{ value: "Belanja Tertinggi" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 8, cells: [{ value: "Belanja Terendah" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 9, cells: [{ value: "Banyak Transaksi Angka" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 10, cells: [{ value: "Total Jenis Barang" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          { label: "Total Seluruhnya (SUM)", resultCell: { row: 4, col: 3 }, validFormulas: ["=SUM(D2:D4)", "=D2+D3+D4"], expectedResult: "19,000", hint: "=SUM(D2:D4)" },
          { label: "Rata-rata Belanja (AVERAGE)", resultCell: { row: 5, col: 3 }, validFormulas: ["=AVERAGE(D2:D4)"], expectedResult: "6,333.33", hint: "=AVERAGE(D2:D4)" },
          { label: "Belanja Tertinggi (MAX)", resultCell: { row: 6, col: 3 }, validFormulas: ["=MAX(D2:D4)"], expectedResult: "16,000", hint: "=MAX(D2:D4)" },
          { label: "Belanja Terendah (MIN)", resultCell: { row: 7, col: 3 }, validFormulas: ["=MIN(D2:D4)"], expectedResult: "1,500", hint: "=MIN(D2:D4)" },
          { label: "Banyak Transaksi Angka (COUNT)", resultCell: { row: 8, col: 3 }, validFormulas: ["=COUNT(D2:D4)"], expectedResult: "3", hint: "=COUNT(D2:D4)" },
          { label: "Total Jenis Barang (COUNTA)", resultCell: { row: 9, col: 3 }, validFormulas: ["=COUNTA(A2:A4)"], expectedResult: "3", hint: "Hitung nama barang di kolom A: =COUNTA(A2:A4)" }
        ]
      },
      {
        id: "large",
        title: "Large (mencari nilai tertinggi kesekian)",
        shortDescription: "Mengambil nilai terbesar ke-N (misal terbesar ke-2) dalam data.",
        conceptExplanation: "Fungsi `LARGE` membolehkan kamu mencari nilai peringkat atas ke-k dari daftar angka.\nSyntax: `=LARGE(range, k)`\n\nLaporan Toko ATK bertambah baris **Belanja Ke-2 Terbesar**.",
        instructions: "Isi ulang D5–D10 dari langkah sebelumnya, lalu isi **D11** dengan nilai belanja terbesar ke-2 menggunakan `=LARGE(D2:D4, 2)`.",
        headers: ["", "Nama Barang", "Jumlah Unit", "Harga Satuan", "Total Belanja"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Barang", header: true }, { value: "Jumlah Unit", header: true }, { value: "Harga Satuan", header: true }, { value: "Total Belanja", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop" }, { value: 2 }, { value: 8000 }, { value: 16000, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Mouse" }, { value: 10 }, { value: 150 }, { value: 1500, highlight: true }] },
          { rowNum: 4, cells: [{ value: "Keyboard" }, { value: 5 }, { value: 300 }, { value: 1500, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Total Seluruhnya" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Rata-rata Belanja" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 7, cells: [{ value: "Belanja Tertinggi" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 8, cells: [{ value: "Belanja Terendah" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 9, cells: [{ value: "Banyak Transaksi Angka" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 10, cells: [{ value: "Total Jenis Barang" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 11, cells: [{ value: "Belanja Ke-2 Terbesar" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          { label: "Total Seluruhnya (SUM)", resultCell: { row: 4, col: 3 }, validFormulas: ["=SUM(D2:D4)", "=D2+D3+D4"], expectedResult: "19,000", hint: "=SUM(D2:D4)" },
          { label: "Rata-rata Belanja (AVERAGE)", resultCell: { row: 5, col: 3 }, validFormulas: ["=AVERAGE(D2:D4)"], expectedResult: "6,333.33", hint: "=AVERAGE(D2:D4)" },
          { label: "Belanja Tertinggi (MAX)", resultCell: { row: 6, col: 3 }, validFormulas: ["=MAX(D2:D4)"], expectedResult: "16,000", hint: "=MAX(D2:D4)" },
          { label: "Belanja Terendah (MIN)", resultCell: { row: 7, col: 3 }, validFormulas: ["=MIN(D2:D4)"], expectedResult: "1,500", hint: "=MIN(D2:D4)" },
          { label: "Banyak Transaksi Angka (COUNT)", resultCell: { row: 8, col: 3 }, validFormulas: ["=COUNT(D2:D4)"], expectedResult: "3", hint: "=COUNT(D2:D4)" },
          { label: "Total Jenis Barang (COUNTA)", resultCell: { row: 9, col: 3 }, validFormulas: ["=COUNTA(A2:A4)"], expectedResult: "3", hint: "=COUNTA(A2:A4)" },
          { label: "Belanja Ke-2 Terbesar (LARGE)", resultCell: { row: 10, col: 3 }, validFormulas: ["=LARGE(D2:D4,2)", "=LARGE(D2:D4, 2)"], expectedResult: "1,500", hint: "Terbesar ke-2 dari D2:D4: =LARGE(D2:D4, 2)" }
        ]
      },
      {
        id: "small",
        title: "Small (mencari nilai terendah kesekian)",
        shortDescription: "Mengambil nilai terkecil ke-N (misal terkecil ke-2) dalam data.",
        conceptExplanation: "Kebalikan dari LARGE, fungsi `SMALL` mencari nilai terkecil ke-k dari daftar angka.\nSyntax: `=SMALL(range, k)`\n\nLaporan Toko ATK bertambah baris **Belanja Ke-2 Terkecil**.",
        instructions: "Isi ulang D5–D11 dari langkah sebelumnya, lalu isi **D12** dengan nilai belanja terkecil ke-2 menggunakan `=SMALL(D2:D4, 2)`.",
        headers: ["", "Nama Barang", "Jumlah Unit", "Harga Satuan", "Total Belanja"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Barang", header: true }, { value: "Jumlah Unit", header: true }, { value: "Harga Satuan", header: true }, { value: "Total Belanja", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop" }, { value: 2 }, { value: 8000 }, { value: 16000, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Mouse" }, { value: 10 }, { value: 150 }, { value: 1500, highlight: true }] },
          { rowNum: 4, cells: [{ value: "Keyboard" }, { value: 5 }, { value: 300 }, { value: 1500, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Total Seluruhnya" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Rata-rata Belanja" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 7, cells: [{ value: "Belanja Tertinggi" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 8, cells: [{ value: "Belanja Terendah" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 9, cells: [{ value: "Banyak Transaksi Angka" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 10, cells: [{ value: "Total Jenis Barang" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 11, cells: [{ value: "Belanja Ke-2 Terbesar" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 12, cells: [{ value: "Belanja Ke-2 Terkecil" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          { label: "Total Seluruhnya (SUM)", resultCell: { row: 4, col: 3 }, validFormulas: ["=SUM(D2:D4)", "=D2+D3+D4"], expectedResult: "19,000", hint: "=SUM(D2:D4)" },
          { label: "Rata-rata Belanja (AVERAGE)", resultCell: { row: 5, col: 3 }, validFormulas: ["=AVERAGE(D2:D4)"], expectedResult: "6,333.33", hint: "=AVERAGE(D2:D4)" },
          { label: "Belanja Tertinggi (MAX)", resultCell: { row: 6, col: 3 }, validFormulas: ["=MAX(D2:D4)"], expectedResult: "16,000", hint: "=MAX(D2:D4)" },
          { label: "Belanja Terendah (MIN)", resultCell: { row: 7, col: 3 }, validFormulas: ["=MIN(D2:D4)"], expectedResult: "1,500", hint: "=MIN(D2:D4)" },
          { label: "Banyak Transaksi Angka (COUNT)", resultCell: { row: 8, col: 3 }, validFormulas: ["=COUNT(D2:D4)"], expectedResult: "3", hint: "=COUNT(D2:D4)" },
          { label: "Total Jenis Barang (COUNTA)", resultCell: { row: 9, col: 3 }, validFormulas: ["=COUNTA(A2:A4)"], expectedResult: "3", hint: "=COUNTA(A2:A4)" },
          { label: "Belanja Ke-2 Terbesar (LARGE)", resultCell: { row: 10, col: 3 }, validFormulas: ["=LARGE(D2:D4,2)", "=LARGE(D2:D4, 2)"], expectedResult: "1,500", hint: "=LARGE(D2:D4, 2)" },
          { label: "Belanja Ke-2 Terkecil (SMALL)", resultCell: { row: 11, col: 3 }, validFormulas: ["=SMALL(D2:D4,2)", "=SMALL(D2:D4, 2)"], expectedResult: "1,500", hint: "Terkecil ke-2 dari D2:D4: =SMALL(D2:D4, 2)" }
        ]
      },
      {
        id: "sumproduct",
        title: "Sumproduct (menjumlahkan hasil perkalian)",
        shortDescription: "Mengalikan sel-sel yang sejajar dan menjumlahkan seluruh hasil perkalian tersebut.",
        conceptExplanation: "Fungsi `SUMPRODUCT` mengalikan baris demi baris antara rentang kolom pertama dan rentang kolom kedua, lalu menjumlahkan seluruh hasilnya.\nSyntax: `=SUMPRODUCT(range1, range2)`\n\nLaporan Toko ATK bertambah baris **Total via SUMPRODUCT** — membuktikan bahwa SUM dari kolom D sama dengan SUMPRODUCT dari kolom B dan C.",
        instructions: "Isi ulang D5–D12 dari langkah sebelumnya, lalu isi **D13** dengan `=SUMPRODUCT(B2:B4, C2:C4)`.",
        headers: ["", "Nama Barang", "Jumlah Unit", "Harga Satuan", "Total Belanja"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Barang", header: true }, { value: "Jumlah Unit", header: true }, { value: "Harga Satuan", header: true }, { value: "Total Belanja", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop" }, { value: 2 }, { value: 8000 }, { value: 16000, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Mouse" }, { value: 10 }, { value: 150 }, { value: 1500, highlight: true }] },
          { rowNum: 4, cells: [{ value: "Keyboard" }, { value: 5 }, { value: 300 }, { value: 1500, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Total Seluruhnya" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Rata-rata Belanja" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 7, cells: [{ value: "Belanja Tertinggi" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 8, cells: [{ value: "Belanja Terendah" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 9, cells: [{ value: "Banyak Transaksi Angka" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 10, cells: [{ value: "Total Jenis Barang" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 11, cells: [{ value: "Belanja Ke-2 Terbesar" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 12, cells: [{ value: "Belanja Ke-2 Terkecil" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 13, cells: [{ value: "Total via Sumproduct" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          { label: "Total Seluruhnya (SUM)", resultCell: { row: 4, col: 3 }, validFormulas: ["=SUM(D2:D4)", "=D2+D3+D4"], expectedResult: "19,000", hint: "=SUM(D2:D4)" },
          { label: "Rata-rata Belanja (AVERAGE)", resultCell: { row: 5, col: 3 }, validFormulas: ["=AVERAGE(D2:D4)"], expectedResult: "6,333.33", hint: "=AVERAGE(D2:D4)" },
          { label: "Belanja Tertinggi (MAX)", resultCell: { row: 6, col: 3 }, validFormulas: ["=MAX(D2:D4)"], expectedResult: "16,000", hint: "=MAX(D2:D4)" },
          { label: "Belanja Terendah (MIN)", resultCell: { row: 7, col: 3 }, validFormulas: ["=MIN(D2:D4)"], expectedResult: "1,500", hint: "=MIN(D2:D4)" },
          { label: "Banyak Transaksi Angka (COUNT)", resultCell: { row: 8, col: 3 }, validFormulas: ["=COUNT(D2:D4)"], expectedResult: "3", hint: "=COUNT(D2:D4)" },
          { label: "Total Jenis Barang (COUNTA)", resultCell: { row: 9, col: 3 }, validFormulas: ["=COUNTA(A2:A4)"], expectedResult: "3", hint: "=COUNTA(A2:A4)" },
          { label: "Belanja Ke-2 Terbesar (LARGE)", resultCell: { row: 10, col: 3 }, validFormulas: ["=LARGE(D2:D4,2)", "=LARGE(D2:D4, 2)"], expectedResult: "1,500", hint: "=LARGE(D2:D4, 2)" },
          { label: "Belanja Ke-2 Terkecil (SMALL)", resultCell: { row: 11, col: 3 }, validFormulas: ["=SMALL(D2:D4,2)", "=SMALL(D2:D4, 2)"], expectedResult: "1,500", hint: "=SMALL(D2:D4, 2)" },
          { label: "Total via Sumproduct (SUMPRODUCT)", resultCell: { row: 12, col: 3 }, validFormulas: ["=SUMPRODUCT(B2:B4,C2:C4)", "=SUMPRODUCT(B2:B4, C2:C4)", "=SUMPRODUCT(B2:B4;C2:C4)"], expectedResult: "19,000", hint: "Kalikan unit × harga: =SUMPRODUCT(B2:B4, C2:C4)" }
        ]
      },
      {
        id: "aggregate",
        title: "Aggregate (kalkulasi dengan pengabaian error/filter)",
        shortDescription: "Melakukan kalkulasi seperti SUM/AVERAGE dengan opsi mengabaikan sel yang error.",
        conceptExplanation: "Fungsi `AGGREGATE` adalah fungsi multifungsi yang bisa melakukan tugas SUM, AVERAGE, dll., dengan kelebihan bisa melewati baris yang tersembunyi atau sel yang berisi error.\n\nArgumennya: 1. **Fungsi** (9=SUM), 2. **Opsi** (6=abaikan error), 3. **Rentang**.\nSyntax: `=AGGREGATE(fungsi, opsi, range)`\n\nIni adalah baris terakhir laporan Toko ATK. Setelah ini kamu akan menghadapi Studi Kasus Final!",
        instructions: "Isi ulang D5–D13, lalu isi **D14** dengan `=AGGREGATE(9, 6, D2:D4)` — fungsi 9=SUM, opsi 6=abaikan error.",
        headers: ["", "Nama Barang", "Jumlah Unit", "Harga Satuan", "Total Belanja"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Barang", header: true }, { value: "Jumlah Unit", header: true }, { value: "Harga Satuan", header: true }, { value: "Total Belanja", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop" }, { value: 2 }, { value: 8000 }, { value: 16000, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Mouse" }, { value: 10 }, { value: 150 }, { value: 1500, highlight: true }] },
          { rowNum: 4, cells: [{ value: "Keyboard" }, { value: 5 }, { value: 300 }, { value: 1500, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Total Seluruhnya" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Rata-rata Belanja" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 7, cells: [{ value: "Belanja Tertinggi" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 8, cells: [{ value: "Belanja Terendah" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 9, cells: [{ value: "Banyak Transaksi Angka" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 10, cells: [{ value: "Total Jenis Barang" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 11, cells: [{ value: "Belanja Ke-2 Terbesar" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 12, cells: [{ value: "Belanja Ke-2 Terkecil" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 13, cells: [{ value: "Total via Sumproduct" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 14, cells: [{ value: "Total via Aggregate" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          { label: "Total Seluruhnya (SUM)", resultCell: { row: 4, col: 3 }, validFormulas: ["=SUM(D2:D4)", "=D2+D3+D4"], expectedResult: "19,000", hint: "=SUM(D2:D4)" },
          { label: "Rata-rata Belanja (AVERAGE)", resultCell: { row: 5, col: 3 }, validFormulas: ["=AVERAGE(D2:D4)"], expectedResult: "6,333.33", hint: "=AVERAGE(D2:D4)" },
          { label: "Belanja Tertinggi (MAX)", resultCell: { row: 6, col: 3 }, validFormulas: ["=MAX(D2:D4)"], expectedResult: "16,000", hint: "=MAX(D2:D4)" },
          { label: "Belanja Terendah (MIN)", resultCell: { row: 7, col: 3 }, validFormulas: ["=MIN(D2:D4)"], expectedResult: "1,500", hint: "=MIN(D2:D4)" },
          { label: "Banyak Transaksi Angka (COUNT)", resultCell: { row: 8, col: 3 }, validFormulas: ["=COUNT(D2:D4)"], expectedResult: "3", hint: "=COUNT(D2:D4)" },
          { label: "Total Jenis Barang (COUNTA)", resultCell: { row: 9, col: 3 }, validFormulas: ["=COUNTA(A2:A4)"], expectedResult: "3", hint: "=COUNTA(A2:A4)" },
          { label: "Belanja Ke-2 Terbesar (LARGE)", resultCell: { row: 10, col: 3 }, validFormulas: ["=LARGE(D2:D4,2)", "=LARGE(D2:D4, 2)"], expectedResult: "1,500", hint: "=LARGE(D2:D4, 2)" },
          { label: "Belanja Ke-2 Terkecil (SMALL)", resultCell: { row: 11, col: 3 }, validFormulas: ["=SMALL(D2:D4,2)", "=SMALL(D2:D4, 2)"], expectedResult: "1,500", hint: "=SMALL(D2:D4, 2)" },
          { label: "Total via Sumproduct (SUMPRODUCT)", resultCell: { row: 12, col: 3 }, validFormulas: ["=SUMPRODUCT(B2:B4,C2:C4)", "=SUMPRODUCT(B2:B4, C2:C4)", "=SUMPRODUCT(B2:B4;C2:C4)"], expectedResult: "19,000", hint: "=SUMPRODUCT(B2:B4, C2:C4)" },
          { label: "Total via Aggregate (AGGREGATE)", resultCell: { row: 13, col: 3 }, validFormulas: ["=AGGREGATE(9,6,D2:D4)", "=AGGREGATE(9, 6, D2:D4)", "=AGGREGATE(9;6;D2:D4)"], expectedResult: "19,000", hint: "SUM + abaikan error: =AGGREGATE(9, 6, D2:D4)" }
        ]
      },
      {
        id: "studi-kasus-hitung",
        title: "Studi Kasus Final: Laporan Kas Toko ATK Mandiri",
        shortDescription: "Ujian mandiri: lengkapi seluruh laporan Toko ATK dari nol tanpa panduan — buktikan penguasaan 10 rumus sekaligus!",
        conceptExplanation: "Selamat! Kamu telah mempelajari dan berlatih 10 rumus menghitung data secara bertahap di tabel Toko ATK yang sama.\n\nSekarang tiba saatnya **ujian mandiri sesungguhnya**. Tabel di sebelah kanan adalah laporan Toko ATK yang SAMA persis — namun seluruh 10 sel formula dikosongkan sekaligus.\n\nTanpa petunjuk tambahan, isi semua sel dari ingatanmu. Ini adalah bukti nyata bahwa kamu sudah benar-benar menguasai ke-10 rumus tersebut!",
        instructions: "Lengkapi **semua 10 sel** bertanda tanya (D5–D14) sekaligus. Klik sel mana saja untuk mulai. Tidak ada urutan wajib — kerjakan sesuai yang kamu ingat lebih dulu!",
        headers: ["", "Nama Barang", "Jumlah Unit", "Harga Satuan", "Total Belanja"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Barang", header: true }, { value: "Jumlah Unit", header: true }, { value: "Harga Satuan", header: true }, { value: "Total Belanja", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop" }, { value: 2 }, { value: 8000 }, { value: 16000, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Mouse" }, { value: 10 }, { value: 150 }, { value: 1500, highlight: true }] },
          { rowNum: 4, cells: [{ value: "Keyboard" }, { value: 5 }, { value: 300 }, { value: 1500, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Total Seluruhnya" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Rata-rata Belanja" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 7, cells: [{ value: "Belanja Tertinggi" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 8, cells: [{ value: "Belanja Terendah" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 9, cells: [{ value: "Banyak Transaksi Angka" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 10, cells: [{ value: "Total Jenis Barang" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 11, cells: [{ value: "Belanja Ke-2 Terbesar" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 12, cells: [{ value: "Belanja Ke-2 Terkecil" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 13, cells: [{ value: "Total via Sumproduct" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 14, cells: [{ value: "Total via Aggregate" }, { value: "" }, { value: "" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          { label: "Total Seluruhnya (SUM)", resultCell: { row: 4, col: 3 }, validFormulas: ["=SUM(D2:D4)", "=D2+D3+D4"], expectedResult: "19,000", hint: "Jumlahkan D2:D4" },
          { label: "Rata-rata Belanja (AVERAGE)", resultCell: { row: 5, col: 3 }, validFormulas: ["=AVERAGE(D2:D4)"], expectedResult: "6,333.33", hint: "Rata-rata D2:D4" },
          { label: "Belanja Tertinggi (MAX)", resultCell: { row: 6, col: 3 }, validFormulas: ["=MAX(D2:D4)"], expectedResult: "16,000", hint: "Nilai terbesar D2:D4" },
          { label: "Belanja Terendah (MIN)", resultCell: { row: 7, col: 3 }, validFormulas: ["=MIN(D2:D4)"], expectedResult: "1,500", hint: "Nilai terkecil D2:D4" },
          { label: "Banyak Transaksi Angka (COUNT)", resultCell: { row: 8, col: 3 }, validFormulas: ["=COUNT(D2:D4)"], expectedResult: "3", hint: "Hitung sel angka D2:D4" },
          { label: "Total Jenis Barang (COUNTA)", resultCell: { row: 9, col: 3 }, validFormulas: ["=COUNTA(A2:A4)"], expectedResult: "3", hint: "Hitung sel tidak kosong A2:A4" },
          { label: "Belanja Ke-2 Terbesar (LARGE)", resultCell: { row: 10, col: 3 }, validFormulas: ["=LARGE(D2:D4,2)", "=LARGE(D2:D4, 2)"], expectedResult: "1,500", hint: "Terbesar ke-2 dari D2:D4" },
          { label: "Belanja Ke-2 Terkecil (SMALL)", resultCell: { row: 11, col: 3 }, validFormulas: ["=SMALL(D2:D4,2)", "=SMALL(D2:D4, 2)"], expectedResult: "1,500", hint: "Terkecil ke-2 dari D2:D4" },
          { label: "Total via Sumproduct (SUMPRODUCT)", resultCell: { row: 12, col: 3 }, validFormulas: ["=SUMPRODUCT(B2:B4,C2:C4)", "=SUMPRODUCT(B2:B4, C2:C4)", "=SUMPRODUCT(B2:B4;C2:C4)"], expectedResult: "19,000", hint: "Unit × Harga: =SUMPRODUCT(B2:B4, C2:C4)" },
          { label: "Total via Aggregate (AGGREGATE)", resultCell: { row: 13, col: 3 }, validFormulas: ["=AGGREGATE(9,6,D2:D4)", "=AGGREGATE(9, 6, D2:D4)", "=AGGREGATE(9;6;D2:D4)"], expectedResult: "19,000", hint: "SUM + abaikan error: =AGGREGATE(9, 6, D2:D4)" }
        ]
      }
    ]
  },
  {
    id: "bulat-data",
    title: "RUMUS UNTUK MEMBULATKAN DATA",
    description: "Fungsi untuk membulatkan angka pecahan desimal atau membuat kelipatan numerik teratur.",
    steps: [
      {
        id: "round",
        title: "Round (membulatkan desimal sesuai logika matematika)",
        shortDescription: "Membulatkan angka desimal ke digit terdekat sesuai aturan matematika standar.",
        conceptExplanation: "Fungsi `ROUND` membulatkan angka ke jumlah digit desimal yang kamu tentukan. Angka 5 ke atas dibulatkan naik, 4 ke bawah dibulatkan turun.\nSyntax: `=ROUND(angka, jumlah_digit)`",
        instructions: "Bulatkan angka rata-rata di sel **A2** menjadi **1 angka di belakang koma** (desimal). Ketik rumusnya di sel **B2**.",
        headers: ["", "Angka Asli", "Hasil Round"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Angka Asli", header: true }, { value: "Hasil Round", header: true }] },
          { rowNum: 2, cells: [{ value: 78.685, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=ROUND(A2,1)", "=ROUND(A2, 1)", "=ROUND(A2;1)"],
        expectedResult: "78.7",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =ROUND(A2, 1)"
      },
      {
        id: "rounddown",
        title: "Rounddown (membulatkan desimal ke bawah)",
        shortDescription: "Memaksa pembulatan angka desimal ke arah bawah mendekati nol.",
        conceptExplanation: "Fungsi `ROUNDDOWN` selalu membulatkan angka pecahan ke bawah (mendekati nol) terlepas dari berapa pun nilai desimal di belakangnya.\nSyntax: `=ROUNDDOWN(angka, jumlah_digit)`",
        instructions: "Bulatkan angka desimal di sel **A2** ke bawah menjadi **0 digit desimal** (angka bulat). Tulis rumusnya di sel **B2**.",
        headers: ["", "Angka Asli", "Hasil Bulat Bawah"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Angka Asli", header: true }, { value: "Hasil Bulat Bawah", header: true }] },
          { rowNum: 2, cells: [{ value: 12.99, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=ROUNDDOWN(A2,0)", "=ROUNDDOWN(A2, 0)", "=ROUNDDOWN(A2;0)"],
        expectedResult: "12",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =ROUNDDOWN(A2, 0)"
      },
      {
        id: "roundup",
        title: "Roundup (membulatkan desimal ke atas)",
        shortDescription: "Memaksa pembulatan angka desimal ke arah atas menjauhi nol.",
        conceptExplanation: "Fungsi `ROUNDUP` selalu membulatkan angka pecahan ke atas (menjauhi nol) meskipun nilai desimalnya sangat kecil.\nSyntax: `=ROUNDUP(angka, jumlah_digit)`",
        instructions: "Bulatkan angka desimal di sel **A2** ke atas menjadi **0 digit desimal** (angka bulat). Tulis rumusnya di sel **B2**.",
        headers: ["", "Angka Asli", "Hasil Bulat Atas"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Angka Asli", header: true }, { value: "Hasil Bulat Atas", header: true }] },
          { rowNum: 2, cells: [{ value: 12.01, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=ROUNDUP(A2,0)", "=ROUNDUP(A2, 0)", "=ROUNDUP(A2;0)"],
        expectedResult: "13",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =ROUNDUP(A2, 0)"
      },
      {
        id: "int",
        title: "Int (mengambil nilai bulat)",
        shortDescription: "Memotong nilai desimal dan menyisakan angka bulat utuhnya saja.",
        conceptExplanation: "Fungsi `INT` (Integer) membulatkan angka ke bawah ke bilangan bulat terdekat. Sangat praktis jika kamu hanya butuh angka utuh di depan koma desimal tanpa memikirkan pembulatan matematis.\nSyntax: `=INT(angka)`",
        instructions: "Ambil bilangan bulat utuh dari sel **A2** di dalam sel **B2**.",
        headers: ["", "Angka Asli", "Nilai Bulat"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Angka Asli", header: true }, { value: "Nilai Bulat", header: true }] },
          { rowNum: 2, cells: [{ value: 45.75, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=INT(A2)", "=int(a2)"],
        expectedResult: "45",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =INT(A2)"
      },
      {
        id: "ceiling",
        title: "Ceiling (membulatkan angka ke atas dengan kelipatan)",
        shortDescription: "Membulatkan angka ke atas ke kelipatan terdekat yang ditentukan.",
        conceptExplanation: "Fungsi `CEILING` membulatkan angka ke atas ke kelipatan bilangan terdekat yang ditentukan. Sangat berguna untuk menghitung kemasan produk atau harga kelipatan.\nSyntax: `=CEILING(angka, kelipatan)`",
        instructions: "Bulatkan harga barang di sel **A2** ke atas ke **kelipatan 500 terdekat** di sel **B2**.",
        headers: ["", "Harga Asli", "Hasil Kelipatan Atas"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Harga Asli", header: true }, { value: "Hasil Kelipatan Atas", header: true }] },
          { rowNum: 2, cells: [{ value: 4250, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=CEILING(A2,500)", "=CEILING(A2, 500)", "=CEILING(A2;500)"],
        expectedResult: "4,500",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =CEILING(A2, 500)"
      },
      {
        id: "floor",
        title: "Floor (membulatkan angka ke bawah dengan kelipatan)",
        shortDescription: "Membulatkan angka ke bawah ke kelipatan terdekat yang ditentukan.",
        conceptExplanation: "Fungsi `FLOOR` membulatkan angka ke bawah ke kelipatan bilangan terdekat yang ditentukan.\nSyntax: `=FLOOR(angka, kelipatan)`",
        instructions: "Bulatkan harga di sel **A2** ke bawah ke **kelipatan 500 terdekat** di sel **B2**.",
        headers: ["", "Harga Asli", "Hasil Kelipatan Bawah"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Harga Asli", header: true }, { value: "Hasil Kelipatan Bawah", header: true }] },
          { rowNum: 2, cells: [{ value: 4250, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=FLOOR(A2,500)", "=FLOOR(A2, 500)", "=FLOOR(A2;500)"],
        expectedResult: "4,000",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =FLOOR(A2, 500)"
      },
      {
        id: "mround",
        title: "Mround (membulatkan angka dengan kelipatan)",
        shortDescription: "Membulatkan angka ke kelipatan terdekat (bisa naik/turun sesuai matematika).",
        conceptExplanation: "Fungsi `MROUND` membulatkan angka ke kelipatan terdekat. Jika sisa pembagian lebih dari atau sama dengan setengah kelipatan, angka dibulatkan ke atas. Jika kurang, dibulatkan ke bawah.\nSyntax: `=MROUND(angka, kelipatan)`",
        instructions: "Bulatkan nilai di sel **A2** ke **kelipatan 5 terdekat** di sel **B2**.",
        headers: ["", "Nilai Asli", "Hasil Mround"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nilai Asli", header: true }, { value: "Hasil Mround", header: true }] },
          { rowNum: 2, cells: [{ value: 17.2, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=MROUND(A2,5)", "=MROUND(A2, 5)", "=MROUND(A2;5)"],
        expectedResult: "15",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =MROUND(A2, 5)"
      },
      {
        id: "studi-kasus-bulat",
        title: "Studi Kasus: Laporan Pajak & Pembulatan Kas Toko ATK",
        shortDescription: "Hitung total omset harian Toko ATK dan bulatkan biaya operasional serta pajak kasir.",
        conceptExplanation: "Di bab ini, kamu telah mempelajari berbagai rumus pembulatan angka desimal atau kelipatan. Sekarang, lengkapi laporan keuangan harian Toko ATK Jaya Mandiri di sebelah kanan dengan menghitung rata-rata, total omset harian, estimasi pajak kotor, dan melakukan pembulatan pembagian uang kembalian kasir.",
        instructions: "Hitung rata-rata omset harian (AVERAGE) di sel B5, jumlah total omset (SUM) di B6. Lalu hitung nilai pajak omset di B8 (2.5% dari B6), dan lakukan berbagai tipe pembulatan kasir di sel B9 sampai B15 sesuai instruksi masing-masing. Klik sel mana saja untuk mulai mengisinya.",
        headers: ["", "Keterangan Keuangan", "Nilai Kas / Omset"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Keterangan Keuangan", header: true }, { value: "Nilai Kas / Omset", header: true }] },
          { rowNum: 2, cells: [{ value: "Omset Cabang A" }, { value: 854320 }] },
          { rowNum: 3, cells: [{ value: "Omset Cabang B" }, { value: 912750 }] },
          { rowNum: 4, cells: [{ value: "Omset Cabang C" }, { value: 780560 }] },
          { rowNum: 5, cells: [{ value: "Rata-rata Omset" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Total Omset Harian" }, { value: "?", highlight: true }] },
          { rowNum: 7, cells: [{ value: "Biaya Ongkir Kurir Toko" }, { value: 525.685 }] },
          { rowNum: 8, cells: [{ value: "Pajak Kotor Omset (2.5%)" }, { value: "?", highlight: true }] },
          { rowNum: 9, cells: [{ value: "Pajak Bulat Matematika" }, { value: "?", highlight: true }] },
          { rowNum: 10, cells: [{ value: "Pajak Bulat Bawah" }, { value: "?", highlight: true }] },
          { rowNum: 11, cells: [{ value: "Pajak Bulat Atas" }, { value: "?", highlight: true }] },
          { rowNum: 12, cells: [{ value: "Pajak Bulat Ribuan Terdekat" }, { value: "?", highlight: true }] },
          { rowNum: 13, cells: [{ value: "Biaya Ongkir Bulat Atas" }, { value: "?", highlight: true }] },
          { rowNum: 14, cells: [{ value: "Biaya Ongkir Bulat Bawah" }, { value: "?", highlight: true }] },
          { rowNum: 15, cells: [{ value: "Omset Cabang A Bulat Potong" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          {
            label: "Rata-rata Omset",
            resultCell: { row: 4, col: 1 },
            validFormulas: ["=AVERAGE(B2:B4)"],
            expectedResult: "849210",
            hint: "Gunakan =AVERAGE(B2:B4) untuk mencari nilai rata-rata."
          },
          {
            label: "Total Omset Harian",
            resultCell: { row: 5, col: 1 },
            validFormulas: ["=SUM(B2:B4)"],
            expectedResult: "2547630",
            hint: "Gunakan =SUM(B2:B4) untuk menjumlahkan."
          },
          {
            label: "Pajak Kotor Omset (2.5%)",
            resultCell: { row: 7, col: 1 },
            validFormulas: ["=B6*2.5%", "=B6*0.025"],
            expectedResult: "63690.75",
            hint: "Ketik: =B6*2.5% atau =B6*0.025"
          },
          {
            label: "Pajak Bulat Matematika",
            resultCell: { row: 8, col: 1 },
            validFormulas: ["=ROUND(B8,0)", "=ROUND(B8, 0)"],
            expectedResult: "63691",
            hint: "Gunakan =ROUND(B8, 0) untuk membulatkan desimal."
          },
          {
            label: "Pajak Bulat Bawah",
            resultCell: { row: 9, col: 1 },
            validFormulas: ["=ROUNDDOWN(B8,0)", "=ROUNDDOWN(B8, 0)"],
            expectedResult: "63690",
            hint: "Gunakan =ROUNDDOWN(B8, 0) untuk membulatkan ke bawah."
          },
          {
            label: "Pajak Bulat Atas",
            resultCell: { row: 10, col: 1 },
            validFormulas: ["=ROUNDUP(B8,0)", "=ROUNDUP(B8, 0)"],
            expectedResult: "63691",
            hint: "Gunakan =ROUNDUP(B8, 0) untuk membulatkan ke atas."
          },
          {
            label: "Pajak Bulat Ribuan Terdekat",
            resultCell: { row: 11, col: 1 },
            validFormulas: ["=MROUND(B8,1000)", "=MROUND(B8, 1000)"],
            expectedResult: "64000",
            hint: "Gunakan =MROUND(B8, 1000) untuk kelipatan 1000 terdekat."
          },
          {
            label: "Biaya Ongkir Bulat Atas",
            resultCell: { row: 12, col: 1 },
            validFormulas: ["=CEILING(B7,1)", "=CEILING(B7, 1)"],
            expectedResult: "526",
            hint: "Gunakan =CEILING(B7, 1) untuk kelipatan atas."
          },
          {
            label: "Biaya Ongkir Bulat Bawah",
            resultCell: { row: 13, col: 1 },
            validFormulas: ["=FLOOR(B7,1)", "=FLOOR(B7, 1)"],
            expectedResult: "525",
            hint: "Gunakan =FLOOR(B7, 1) untuk kelipatan bawah."
          },
          {
            label: "Omset Cabang A Bulat Potong",
            resultCell: { row: 14, col: 1 },
            validFormulas: ["=INT(B2)"],
            expectedResult: "854320",
            hint: "Gunakan =INT(B2) untuk memotong bagian desimal."
          }
        ]
      }
    ]
  },
  {
    id: "rapih-data",
    title: "RUMUS UNTUK MERAPIKAN DATA",
    description: "Fungsi untuk membersihkan spasi ganda, menggabungkan kalimat, serta menyeragamkan huruf kapital.",
    steps: [
      {
        id: "concatenate",
        title: "Concatenate (menggabungkan data)",
        shortDescription: "Menggabungkan dua atau lebih string teks menjadi satu sel.",
        conceptExplanation: "Fungsi `CONCATENATE` menggabungkan teks dari beberapa sel referensi menjadi satu kesatuan. Kamu bisa menambahkan pembatas teks manual seperti spasi dengan memasukkan karakter di antara sel.\nSyntax: `=CONCATENATE(teks1, teks2, ...)`",
        instructions: "Gabungkan nama depan di sel **A2** dan nama belakang di sel **B2** dengan spasi di antaranya di sel **C2**.",
        headers: ["", "Nama Depan", "Nama Belakang", "Nama Lengkap"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Depan", header: true }, { value: "Nama Belakang", header: true }, { value: "Nama Lengkap", header: true }] },
          { rowNum: 2, cells: [{ value: "Budi", highlight: true }, { value: "Utomo", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=CONCATENATE(A2,\" \",B2)", "=CONCATENATE(A2, \" \", B2)", "=CONCATENATE(A2;\" \";B2)"],
        expectedResult: "Budi Utomo",
        resultCell: { row: 1, col: 2 },
        hint: "Ketik: =CONCATENATE(A2, \" \", B2)"
      },
      {
        id: "ampersand",
        title: "& (menggabungkan data)",
        shortDescription: "Menggabungkan sel teks secara langsung menggunakan simbol ampersand (&).",
        conceptExplanation: "Selain fungsi CONCATENATE, kamu bisa memakai simbol dan (`&`) untuk menggabungkan sel secara manual. Ini adalah jalan pintas yang sangat sering dipakai. Contoh: `=A1&\" \"&B1`.",
        instructions: "Gabungkan sel **A2** dan **B2** dengan pembatas spasi menggunakan operator **&** di sel **C2**.",
        headers: ["", "Nama Depan", "Nama Belakang", "Nama Lengkap"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Depan", header: true }, { value: "Nama Belakang", header: true }, { value: "Nama Lengkap", header: true }] },
          { rowNum: 2, cells: [{ value: "Aulia", highlight: true }, { value: "Putri", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=A2&\" \"&B2", "=A2 & \" \" & B2"],
        expectedResult: "Aulia Putri",
        resultCell: { row: 1, col: 2 },
        hint: "Ketik: =A2&\" \"&B2"
      },
      {
        id: "trim",
        title: "Trim (menghilangkan spasi berlebih)",
        shortDescription: "Membersihkan teks dari spasi kosong ganda atau spasi di ujung kata.",
        conceptExplanation: "Fungsi `TRIM` membersihkan spasi berlebih dari sebuah kalimat, hanya menyisakan spasi tunggal di antara kata-kata, dan menghapus seluruh spasi kosong di paling awal atau paling akhir teks.\nSyntax: `=TRIM(teks)`",
        instructions: "Bersihkan spasi berlebih pada sel nama **A2** di dalam sel **B2**.",
        headers: ["", "Nama Rusak", "Nama Bersih"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Rusak", header: true }, { value: "Nama Bersih", header: true }] },
          { rowNum: 2, cells: [{ value: "   Dewi   Sari  ", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=TRIM(A2)", "=trim(a2)"],
        expectedResult: "Dewi Sari",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =TRIM(A2)"
      },
      {
        id: "clean",
        title: "Clean (menghilangkan enter berlebih)",
        shortDescription: "Menghapus karakter non-cetak seperti enter/baris baru di dalam teks.",
        conceptExplanation: "Fungsi `CLEAN` menghapus karakter non-cetak dari teks, seperti karakter baris baru/enter (line break) yang sering muncul akibat copy-paste data mentah dari internet.\nSyntax: `=CLEAN(teks)`",
        instructions: "Bersihkan teks alamat di sel **A2** dari karakter enter di sel **B2**.",
        headers: ["", "Alamat Rusak", "Alamat Bersih"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Alamat Rusak", header: true }, { value: "Alamat Bersih", header: true }] },
          { rowNum: 2, cells: [{ value: "Jl. Mawar\nNo. 10", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=CLEAN(A2)", "=clean(a2)"],
        expectedResult: "Jl. MawarNo. 10",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =CLEAN(A2)"
      },
      {
        id: "upper",
        title: "Upper (mengubah kata menjadi huruf besar semua)",
        shortDescription: "Mengubah semua karakter huruf kecil menjadi huruf besar (kapital) semua.",
        conceptExplanation: "Fungsi `UPPER` memaksa semua huruf dalam kalimat menjadi huruf besar.\nSyntax: `=UPPER(teks)`",
        instructions: "Ubah kode barang huruf kecil di sel **A2** menjadi huruf kapital semua di sel **B2**.",
        headers: ["", "Kode", "Kapital"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Kode", header: true }, { value: "Kapital", header: true }] },
          { rowNum: 2, cells: [{ value: "jkt-02", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=UPPER(A2)", "=upper(a2)"],
        expectedResult: "JKT-02",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =UPPER(A2)"
      },
      {
        id: "lower",
        title: "Lower (mengubah kata menjadi huruf kecil semua)",
        shortDescription: "Mengubah semua karakter huruf besar menjadi huruf kecil semua.",
        conceptExplanation: "Fungsi `LOWER` mengubah semua huruf kapital dalam teks menjadi huruf kecil semuanya.\nSyntax: `=LOWER(teks)`",
        instructions: "Ubah teks email di sel **A2** menjadi huruf kecil semua di sel **B2**.",
        headers: ["", "Email Asli", "Email Kecil"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Email Asli", header: true }, { value: "Email Kecil", header: true }] },
          { rowNum: 2, cells: [{ value: "BUDI@EXAMPLE.COM", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=LOWER(A2)", "=lower(a2)"],
        expectedResult: "budi@example.com",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =LOWER(A2)"
      },
      {
        id: "proper",
        title: "Proper (mengubah huruf pertama setiap kata menjadi huruf besar)",
        shortDescription: "Mengubah huruf pertama setiap kata menjadi huruf besar (seperti nama orang).",
        conceptExplanation: "Fungsi `PROPER` mengubah huruf pertama setiap kata menjadi huruf besar (kapital) dan huruf-huruf setelahnya menjadi huruf kecil. Sangat rapi untuk penulisan nama orang atau kota.\nSyntax: `=PROPER(teks)`",
        instructions: "Rapikan penulisan nama yang berantakan di sel **A2** menjadi format nama yang rapi di sel **B2**.",
        headers: ["", "Nama Berantakan", "Nama Rapi"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Berantakan", header: true }, { value: "Nama Rapi", header: true }] },
          { rowNum: 2, cells: [{ value: "jOkO wIdOdO", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=PROPER(A2)", "=proper(a2)"],
        expectedResult: "Joko Widodo",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =PROPER(A2)"
      },
      {
        id: "studi-kasus-rapih",
        title: "Studi Kasus: Pembersihan Database Pelanggan Toko ATK",
        shortDescription: "Bersihkan dan rapikan data pelanggan baru Toko ATK yang diinput secara tidak terstruktur.",
        conceptExplanation: "Di bab ini, kamu telah mempelajari cara membersihkan spasi ganda, memformat kapitalisasi teks, dan menggabungkan beberapa teks. Sekarang saatnya mempraktikkannya untuk merapikan database pendaftaran pelanggan baru di Toko ATK Jaya Mandiri.",
        instructions: "Bersihkan spasi depan mentah (TRIM) dari nama depan pelanggan di B5. Gunakan PROPER di B6 dan B7 untuk memformat nama depan dan belakang resmi pelanggan. Gabungkan nama resmi tersebut menggunakan CONCATENATE di B8 dan operator & di B9. Ubah email kotor menjadi huruf kecil (LOWER) di B10, nama kode kartu pelanggan menjadi huruf besar (UPPER) di B11, dan hitung kolom teks dengan COUNTA di B12. Klik sel mana saja untuk mulai mengisinya.",
        headers: ["", "Keterangan Pelanggan", "Teks Hasil Pembersihan"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Keterangan Pelanggan", header: true }, { value: "Teks Hasil Pembersihan", header: true }] },
          { rowNum: 2, cells: [{ value: "Nama Depan Mentah" }, { value: "  rIaN  " }] },
          { rowNum: 3, cells: [{ value: "Nama Belakang Mentah" }, { value: "hIdAyAt" }] },
          { rowNum: 4, cells: [{ value: "Email Kotor" }, { value: "RIAN.H@yahoo.com" }] },
          { rowNum: 5, cells: [{ value: "Nama Depan Bersih Spasi" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Nama Resmi Format Proper" }, { value: "?", highlight: true }] },
          { rowNum: 7, cells: [{ value: "Nama Belakang Resmi Proper" }, { value: "?", highlight: true }] },
          { rowNum: 8, cells: [{ value: "Nama Lengkap (CONCAT)" }, { value: "?", highlight: true }] },
          { rowNum: 9, cells: [{ value: "Nama Lengkap (Ampersand)" }, { value: "?", highlight: true }] },
          { rowNum: 10, cells: [{ value: "Email Rapi (Lower)" }, { value: "?", highlight: true }] },
          { rowNum: 11, cells: [{ value: "Nama Kode Kartu (Upper)" }, { value: "?", highlight: true }] },
          { rowNum: 12, cells: [{ value: "Total Kolom Data Teks" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          {
            label: "Nama Depan Bersih Spasi",
            resultCell: { row: 4, col: 1 },
            validFormulas: ["=TRIM(B2)"],
            expectedResult: "rIaN",
            hint: "Gunakan =TRIM(B2) untuk membuang spasi liar."
          },
          {
            label: "Nama Resmi Format Proper",
            resultCell: { row: 5, col: 1 },
            validFormulas: ["=PROPER(B5)"],
            expectedResult: "Rian",
            hint: "Gunakan =PROPER(B5) untuk format kapital pertama."
          },
          {
            label: "Nama Belakang Resmi Proper",
            resultCell: { row: 6, col: 1 },
            validFormulas: ["=PROPER(B3)"],
            expectedResult: "Hidayat",
            hint: "Gunakan =PROPER(B3) untuk format nama belakang."
          },
          {
            label: "Nama Lengkap (CONCAT)",
            resultCell: { row: 7, col: 1 },
            validFormulas: ["=CONCATENATE(B6,\" \",B7)", "=CONCATENATE(B6, \" \", B7)"],
            expectedResult: "Rian Hidayat",
            hint: "Gunakan =CONCATENATE(B6, \" \", B7) untuk menggabung teks."
          },
          {
            label: "Nama Lengkap (Ampersand)",
            resultCell: { row: 8, col: 1 },
            validFormulas: ["=B6&\" \"&B7", "=B6 & \" \" & B7"],
            expectedResult: "Rian Hidayat",
            hint: "Ketik: =B6 & \" \" & B7"
          },
          {
            label: "Email Rapi (Lower)",
            resultCell: { row: 9, col: 1 },
            validFormulas: ["=LOWER(B4)"],
            expectedResult: "rian.h@yahoo.com",
            hint: "Gunakan =LOWER(B4) untuk mengecilkan huruf."
          },
          {
            label: "Nama Kode Kartu (Upper)",
            resultCell: { row: 10, col: 1 },
            validFormulas: ["=UPPER(B7)"],
            expectedResult: "HIDAYAT",
            hint: "Gunakan =UPPER(B7) untuk membesarkan huruf."
          },
          {
            label: "Total Kolom Data Teks",
            resultCell: { row: 11, col: 1 },
            validFormulas: ["=COUNTA(B2:B3)"],
            expectedResult: "2",
            hint: "Gunakan =COUNTA(B2:B3) untuk menghitung sel berisi teks."
          }
        ]
      }
    ]
  },
  {
    id: "ekstrak-data",
    title: "RUMUS UNTUK MENGEKSTRAK DATA",
    description: "Fungsi memotong huruf di sebelah kiri, tengah, kanan sel, serta menghitung panjang karakter.",
    steps: [
      {
        id: "left",
        title: "Left (mengekstrak beberapa karakter paling kiri)",
        shortDescription: "Mengambil beberapa karakter paling depan/kiri dari suatu sel.",
        conceptExplanation: "Fungsi `LEFT` mengambil sejumlah karakter tertentu dari sebelah kiri teks.\nSyntax: `=LEFT(teks, jumlah_karakter)`",
        instructions: "Ambil **3 karakter pertama** dari ID Transaksi di sel **A2** di dalam sel **B2**.",
        headers: ["", "ID Transaksi", "Kode Wilayah"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "ID Transaksi", header: true }, { value: "Kode Wilayah", header: true }] },
          { rowNum: 2, cells: [{ value: "BDG10255", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=LEFT(A2,3)", "=LEFT(A2, 3)", "=LEFT(A2;3)"],
        expectedResult: "BDG",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =LEFT(A2, 3)"
      },
      {
        id: "mid",
        title: "Mid (mengekstrak beberapa karakter di tengah)",
        shortDescription: "Mengambil karakter dari tengah sel berdasarkan urutan mulai dan panjang kata.",
        conceptExplanation: "Fungsi `MID` memotong teks dari posisi tengah. Membutuhkan tiga argumen:\n1. **Teks**: Sel target.\n2. **Mulai**: Karakter keberapa pemotongan dimulai.\n3. **Jumlah**: Berapa banyak huruf yang ingin diambil.\nSyntax: `=MID(teks, mulai_karakter, jumlah_karakter)`",
        instructions: "Ambil kode tahun dari ID Transaksi di sel **A2** (yaitu **4 karakter** dimulai dari **karakter ke-4**). Masukkan di sel **B2**.",
        headers: ["", "ID Transaksi", "Tahun"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "ID Transaksi", header: true }, { value: "Tahun", header: true }] },
          { rowNum: 2, cells: [{ value: "BDG2026XYZ", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=MID(A2,4,4)", "=MID(A2, 4, 4)", "=MID(A2;4;4)"],
        expectedResult: "2026",
        resultCell: { row: 1, col: 1 },
        hint: "Pemotongan dimulai dari karakter ke-4 sepanjang 4 karakter: =MID(A2, 4, 4)"
      },
      {
        id: "right",
        title: "Right (mengekstrak beberapa karakter paling kanan)",
        shortDescription: "Mengambil beberapa karakter paling akhir/kanan dari suatu sel.",
        conceptExplanation: "Fungsi `RIGHT` mengambil sejumlah karakter tertentu dari sebelah kanan teks.\nSyntax: `=RIGHT(teks, jumlah_karakter)`",
        instructions: "Ambil **3 karakter terakhir** dari Kode Barang di sel **A2** di dalam sel **B2**.",
        headers: ["", "Kode Barang", "Nomor Seri"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Kode Barang", header: true }, { value: "Nomor Seri", header: true }] },
          { rowNum: 2, cells: [{ value: "LAPTOP-089", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=RIGHT(A2,3)", "=RIGHT(A2, 3)", "=RIGHT(A2;3)"],
        expectedResult: "089",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =RIGHT(A2, 3)"
      },
      {
        id: "len",
        title: "Len (menghitung banyak karakter/digit)",
        shortDescription: "Menghitung total digit huruf atau spasi dalam satu sel.",
        conceptExplanation: "Fungsi `LEN` (Length) menghitung jumlah total karakter di dalam suatu sel, termasuk huruf, angka, simbol, dan spasi kosong.\nSyntax: `=LEN(teks)`",
        instructions: "Hitung berapa banyak karakter/digit pada kode produk di sel **A2** di dalam sel **B2**.",
        headers: ["", "Kode Produk", "Panjang Karakter"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Kode Produk", header: true }, { value: "Panjang Karakter", header: true }] },
          { rowNum: 2, cells: [{ value: "SMR-808-ID", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=LEN(A2)", "=len(a2)"],
        expectedResult: "10",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =LEN(A2)"
      },
      {
        id: "studi-kasus-ekstrak",
        title: "Studi Kasus: Parsing SKU Barang",
        shortDescription: "Pecahkan kode SKU barang untuk dianalisis oleh departemen inventaris gudang.",
        conceptExplanation: "Di bab ini, kamu telah mempelajari cara mengambil potongan teks dari kiri, tengah, kanan, dan menghitung panjang karakter. Sekarang, mari lakukan pemecahan (parsing) pada kode SKU barang yang tersimpan di database gudang di sebelah kanan.",
        instructions: "Ambil 3 karakter pertama (LEFT) dari SKU B2 di sel C2. Ambil nilai harga di tengah menggunakan MID dari B3 di sel C3. Ambil kode cabang di kanan menggunakan RIGHT dari B4 di sel C4. Hitung panjang karakter SKU asli dengan LEN dari B5 di sel C5. Gunakan PROPER untuk merapikan nama cabang di C4 menjadi nama resmi di sel C6. Klik sel mana saja untuk mulai mengisinya.",
        headers: ["", "Keterangan", "SKU Sumber", "Hasil Ekstraksi"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Keterangan", header: true }, { value: "SKU Sumber", header: true }, { value: "Hasil Ekstraksi", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop Kantor" }, { value: "LAP-8000-JKT", highlight: true }, { value: "?", highlight: true }] },
          { rowNum: 3, cells: [{ value: "Harga Satuan" }, { value: "LAP-8000-JKT" }, { value: "?", highlight: true }] },
          { rowNum: 4, cells: [{ value: "Lokasi Cabang" }, { value: "LAP-8000-JKT" }, { value: "?", highlight: true }] },
          { rowNum: 5, cells: [{ value: "Panjang Karakter SKU" }, { value: "LAP-8000-JKT" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Nama Cabang Resmi" }, { value: "" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          {
            label: "Laptop Kantor (LEFT)",
            resultCell: { row: 1, col: 2 },
            validFormulas: ["=LEFT(B2,3)", "=LEFT(B2, 3)"],
            expectedResult: "LAP",
            hint: "Gunakan =LEFT(B2, 3) untuk mengambil 3 karakter pertama."
          },
          {
            label: "Harga Satuan (MID)",
            resultCell: { row: 2, col: 2 },
            validFormulas: ["=MID(B3,5,4)", "=MID(B3, 5, 4)"],
            expectedResult: "8000",
            hint: "Gunakan =MID(B3, 5, 4) untuk mengambil angka harga."
          },
          {
            label: "Lokasi Cabang (RIGHT)",
            resultCell: { row: 3, col: 2 },
            validFormulas: ["=RIGHT(B4,3)", "=RIGHT(B4, 3)"],
            expectedResult: "JKT",
            hint: "Gunakan =RIGHT(B4, 3) untuk mengambil 3 karakter kanan."
          },
          {
            label: "Panjang Karakter SKU",
            resultCell: { row: 4, col: 2 },
            validFormulas: ["=LEN(B5)"],
            expectedResult: "12",
            hint: "Gunakan =LEN(B5) untuk menghitung panjang karakter."
          },
          {
            label: "Nama Cabang Resmi",
            resultCell: { row: 5, col: 2 },
            validFormulas: ["=PROPER(C4)"],
            expectedResult: "Jkt",
            hint: "Gunakan =PROPER(C4) untuk memformat nama cabang."
          }
        ]
      }
    ]
  },
  {
    id: "cari-data",
    title: "RUMUS UNTUK MENCARI DATA",
    description: "Fungsi pencarian vertikal (VLOOKUP), horizontal (HLOOKUP), indeks baris-kolom (INDEX & MATCH).",
    steps: [
      {
        id: "vlookup",
        title: "Vlookup (mencari data di tabel vertikal)",
        shortDescription: "Mencari nilai kunci secara vertikal ke bawah pada kolom pertama tabel referensi.",
        conceptExplanation: "Fungsi `VLOOKUP` mencari nilai di kolom paling kiri dari tabel data, lalu mengembalikan nilai di baris yang sama dari kolom yang ditentukan.\nSyntax: `=VLOOKUP(nilai_kunci, rentang_tabel, nomor_kolom, FALSE)`",
        instructions: "Temukan harga produk **Tablet** di sel **F2** dengan mencari kunci pencarian di sel **E2** pada rentang tabel referensi **A2:C5**. Ambil nilai dari kolom **3** (Harga) dan gunakan `FALSE`.",
        headers: ["", "A", "B", "C", "D", "E", "F"],
        dummyData: [
          {
            rowNum: 1,
            cells: [
              { value: "Produk", header: true, borderTop: true, borderBottom: true, borderLeft: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" },
              { value: "Kategori", header: true, borderTop: true, borderBottom: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" },
              { value: "Harga", header: true, borderTop: true, borderBottom: true, borderRight: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" },
              { value: "" },
              { value: "Cari Produk", header: true, borderTop: true, borderBottom: true, borderLeft: true, bgColor: "bg-amber-50 dark:bg-amber-950/30" },
              { value: "Hasil Harga", header: true, borderTop: true, borderBottom: true, borderRight: true, bgColor: "bg-amber-50 dark:bg-amber-950/30" }
            ]
          },
          {
            rowNum: 2,
            cells: [
              { value: "Laptop", borderLeft: true, bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: "Tech", bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: 999, borderRight: true, bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: "" },
              { value: "Tablet", borderLeft: true, borderBottom: true, bgColor: "bg-amber-50/10 dark:bg-amber-950/10" },
              { value: "?", highlight: true, borderRight: true, borderBottom: true, bgColor: "bg-amber-50/10 dark:bg-amber-950/10" }
            ]
          },
          {
            rowNum: 3,
            cells: [
              { value: "Ponsel", borderLeft: true, bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: "Tech", bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: 699, borderRight: true, bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: "" },
              { value: "" },
              { value: "" }
            ]
          },
          {
            rowNum: 4,
            cells: [
              { value: "Tablet", borderLeft: true, bgColor: "bg-emerald-500/10 dark:bg-emerald-500/15" },
              { value: "Tech", bgColor: "bg-emerald-500/10 dark:bg-emerald-500/15" },
              { value: 399, highlight: true, borderRight: true, bgColor: "bg-emerald-500/10 dark:bg-emerald-500/15" },
              { value: "" },
              { value: "" },
              { value: "" }
            ]
          },
          {
            rowNum: 5,
            cells: [
              { value: "Aksesoris", borderLeft: true, borderBottom: true, bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: "Office", borderBottom: true, bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: 45, borderRight: true, borderBottom: true, bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: "" },
              { value: "" },
              { value: "" }
            ]
          }
        ],
        validFormulas: ["=VLOOKUP(E2,A2:C5,3,FALSE)", "=VLOOKUP(E2, A2:C5, 3, FALSE)", "=VLOOKUP(E2;A2:C5;3;FALSE)"],
        expectedResult: "$399.00",
        resultCell: { row: 1, col: 5 },
        hint: "Ketik: =VLOOKUP(E2, A2:C5, 3, FALSE)"
      },
      {
        id: "hlookup",
        title: "Hlookup (mencari data di tabel horizontal)",
        shortDescription: "Mencari nilai secara horizontal di sepanjang baris teratas referensi.",
        conceptExplanation: "Fungsi `HLOOKUP` mencari nilai kunci secara horizontal di baris teratas, lalu mengambil data di kolom yang sama pada baris keberapa yang diinstruksikan.\nSyntax: `=HLOOKUP(nilai_kunci, rentang_tabel, nomor_baris, FALSE)`",
        instructions: "Cari nominal **Bonus** karyawan di sel **B4**. Cari sel kunci **C1** di dalam tabel referensi **A1:D3** dan ambil nilai pada baris ke-**3**. Gunakan `FALSE`.",
        headers: ["", "A", "B", "C", "D"],
        dummyData: [
          {
            rowNum: 1,
            cells: [
              { value: "Kategori", header: true, borderTop: true, borderBottom: true, borderLeft: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" },
              { value: "Gaji Pokok", header: true, borderTop: true, borderBottom: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" },
              { value: "Bonus", header: true, highlight: true, borderTop: true, borderBottom: true, bgColor: "bg-emerald-500/10 dark:bg-emerald-500/15" },
              { value: "Tunjangan", header: true, borderTop: true, borderBottom: true, borderRight: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" }
            ]
          },
          {
            rowNum: 2,
            cells: [
              { value: "Kode", borderLeft: true, bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: "BASE", bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: "BONUS_Q", bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: "ALLOW", borderRight: true, bgColor: "bg-blue-50/10 dark:bg-blue-950/10" }
            ]
          },
          {
            rowNum: 3,
            cells: [
              { value: "Nilai", borderLeft: true, borderBottom: true, bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: 5000, borderBottom: true, bgColor: "bg-blue-50/10 dark:bg-blue-950/10" },
              { value: 1200, highlight: true, borderBottom: true, bgColor: "bg-emerald-500/10 dark:bg-emerald-500/15" },
              { value: 800, borderRight: true, borderBottom: true, bgColor: "bg-blue-50/10 dark:bg-blue-950/10" }
            ]
          },
          {
            rowNum: 4,
            cells: [
              { value: "Cari: Bonus", borderLeft: true, borderTop: true, borderBottom: true, bgColor: "bg-amber-50/10 dark:bg-amber-950/10" },
              { value: "?", highlight: true, borderRight: true, borderTop: true, borderBottom: true, bgColor: "bg-amber-50/10 dark:bg-amber-950/10" },
              { value: "Hasil Pencarian" },
              { value: "" }
            ]
          }
        ],
        validFormulas: ["=HLOOKUP(C1,A1:D3,3,FALSE)", "=HLOOKUP(C1, A1:D3, 3, FALSE)", "=HLOOKUP(C1;A1:D3;3;FALSE)"],
        expectedResult: "1,200",
        resultCell: { row: 3, col: 1 },
        hint: "Ketik: =HLOOKUP(C1, A1:D3, 3, FALSE)"
      },
      {
        id: "index",
        title: "Index (mencari data di baris dan kolom tertentu)",
        shortDescription: "Mengambil nilai di dalam baris dan kolom tertentu pada suatu rentang.",
        conceptExplanation: "Fungsi `INDEX` mengambil isi sel berdasarkan koordinat baris dan kolom yang diberikan di dalam suatu tabel referensi.\nSyntax: `=INDEX(array, nomor_baris, nomor_kolom)`",
        instructions: "Ambil nilai harga di baris **3** dan kolom **3** dari rentang tabel **A2:C5** di dalam sel **E2**.",
        headers: ["", "A", "B", "C", "D", "E"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Produk", header: true }, { value: "Kategori", header: true }, { value: "Harga", header: true }, { value: "" }, { value: "Hasil Index", header: true }] },
          { rowNum: 2, cells: [{ value: "Lampu" }, { value: "Alat" }, { value: 120 }, { value: "" }, { value: "?", highlight: true }] },
          { rowNum: 3, cells: [{ value: "Kursi" }, { value: "Furnitur" }, { value: 450 }] },
          { rowNum: 4, cells: [{ value: "Meja" }, { value: "Furnitur" }, { value: 800, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Lemari" }, { value: "Furnitur" }, { value: 1500 }] }
        ],
        validFormulas: ["=INDEX(A2:C5,3,3)", "=INDEX(A2:C5, 3, 3)", "=INDEX(A2:C5;3;3)"],
        expectedResult: "800",
        resultCell: { row: 1, col: 4 },
        hint: "Ketik: =INDEX(A2:C5, 3, 3)"
      },
      {
        id: "match",
        title: "Match (mencari posisi sebuah data pada baris/kolom tertentu)",
        shortDescription: "Mengembalikan nomor indeks urutan baris data yang dicari.",
        conceptExplanation: "Fungsi `MATCH` mencari posisi urutan baris/kolom dari suatu nilai di dalam satu kolom atau baris tertentu. Sangat berguna untuk mengetahui urutan posisi keberapa data tersebut berada.\nSyntax: `=MATCH(lookup_value, lookup_array, [match_type])` (Gunakan `0` untuk kecocokan persis).",
        instructions: "Cari posisi baris produk **\"Meja\"** di dalam rentang kolom produk **A2:A5**. Tulis rumusnya di sel **D2**.",
        headers: ["", "Produk", "Harga", "Keterangan", "Posisi Meja"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Produk", header: true }, { value: "Harga", header: true }, { value: "Keterangan", header: true }, { value: "Posisi Meja", header: true }] },
          { rowNum: 2, cells: [{ value: "Kursi" }, { value: 200 }, { value: "Tersedia" }, { value: "?", highlight: true }] },
          { rowNum: 3, cells: [{ value: "Lemari" }, { value: 500 }, { value: "Tersedia" }, { value: "" }] },
          { rowNum: 4, cells: [{ value: "Meja", highlight: true }, { value: 350 }, { value: "Habis" }, { value: "" }] },
          { rowNum: 5, cells: [{ value: "Rak" }, { value: 120 }, { value: "Tersedia" }, { value: "" }] }
        ],
        validFormulas: ["=MATCH(\"Meja\",A2:A5,0)", "=MATCH(\"Meja\", A2:A5, 0)", "=MATCH(A4,A2:A5,0)"],
        expectedResult: "3",
        resultCell: { row: 1, col: 3 },
        hint: "Ketik: =MATCH(\"Meja\", A2:A5, 0)"
      },
      {
        id: "indexmatch",
        title: "Indexmatch (gabungan rumus Index dan Match)",
        shortDescription: "Penggabungan INDEX dan MATCH untuk mencari data fleksibel dari kolom mana saja.",
        conceptExplanation: "INDEX MATCH adalah pengganti VLOOKUP yang jauh lebih dinamis karena bisa mencari data ke arah kiri (VLOOKUP hanya bisa mencari data ke kanan). MATCH digunakan untuk mencari nomor baris secara dinamis, dan INDEX menarik datanya.\nSyntax: `=INDEX(kolom_yang_ingin_diambil, MATCH(kunci, kolom_pencarian, 0))`",
        instructions: "Cari harga untuk nama produk di sel **D2** (\"Meja\") menggunakan formula gabungan INDEX dan MATCH. Ambil dari rentang harga **B2:B5** dan cari di kolom produk **A2:A5**.",
        headers: ["", "Produk", "Harga", "Cari: Meja", "Hasil"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Produk", header: true }, { value: "Harga", header: true }, { value: "Cari: Meja", header: true }, { value: "Hasil", header: true }] },
          { rowNum: 2, cells: [{ value: "Kursi" }, { value: 200 }, { value: "Meja" }, { value: "?", highlight: true }] },
          { rowNum: 3, cells: [{ value: "Lemari" }, { value: 500 }] },
          { rowNum: 4, cells: [{ value: "Meja", highlight: true }, { value: 350, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Rak" }, { value: 120 }] }
        ],
        validFormulas: [
          "=INDEX(B2:B5,MATCH(D2,A2:A5,0))",
          "=INDEX(B2:B5, MATCH(D2, A2:A5, 0))",
          "=INDEX(B2:B5;MATCH(D2;A2:A5;0))"
        ],
        expectedResult: "350",
        resultCell: { row: 1, col: 3 },
        hint: "Ketik: =INDEX(B2:B5, MATCH(D2, A2:A5, 0))"
      },
      {
        id: "studi-kasus-cari",
        title: "Studi Kasus: Sistem Invoice & Inventaris",
        shortDescription: "Gunakan data lookup (VLOOKUP, INDEX, MATCH) untuk menarik informasi barang dan menghitung total harga.",
        conceptExplanation: "Di bab ini, kamu telah mempelajari cara mencari data secara dinamis. Sekarang, mari lengkapi sistem invoice pemesanan barang dengan menarik deskripsi produk, harga satuan, mencocokkan indeks baris, dan menghitung total tagihan.",
        instructions: "Tarik nama barang berdasarkan Kode Barang A2 di sel C2 menggunakan VLOOKUP dari tabel referensi A9:C12. Tarik harga satuan di D2 menggunakan VLOOKUP. Hitung total biaya kotor di E2 dengan mengalikan Jumlah B2 dan harga satuan D2. Cari nomor baris 'Laptop' di C3 menggunakan MATCH. Gunakan INDEX MATCH untuk mencari harga 'Proyektor' di C4. Terakhir, hitung total bersih dengan membulatkan E2 ke ribuan terdekat menggunakan MROUND di sel C5. Klik sel mana saja untuk mulai mengisinya.",
        headers: ["", "Kode / Cari", "Jumlah / Parameter", "Nama / Baris", "Harga / Hasil", "Total"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Kode / Cari", header: true }, { value: "Jumlah / Parameter", header: true }, { value: "Nama / Baris", header: true }, { value: "Harga / Hasil", header: true }, { value: "Total", header: true }] },
          { rowNum: 2, cells: [{ value: "PRD03" }, { value: 5 }, { value: "?", highlight: true }, { value: "?", highlight: true }, { value: "?", highlight: true }] },
          { rowNum: 3, cells: [{ value: "Laptop" }, { value: "Match" }, { value: "?", highlight: true }, { value: "" }, { value: "" }] },
          { rowNum: 4, cells: [{ value: "Proyektor" }, { value: "IndexMatch" }, { value: "?", highlight: true }, { value: "" }, { value: "" }] },
          { rowNum: 5, cells: [{ value: "Bulat Ribuan" }, { value: "MROUND" }, { value: "?", highlight: true }, { value: "" }, { value: "" }] },
          { rowNum: 6, cells: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }] },
          { rowNum: 7, cells: [{ value: "Tabel Referensi Gudang:", header: true }, { value: "" }, { value: "" }, { value: "" }, { value: "" }] },
          { rowNum: 8, cells: [{ value: "Kode", header: true }, { value: "Barang", header: true }, { value: "Harga", header: true }, { value: "" }, { value: "" }] },
          { rowNum: 9, cells: [{ value: "PRD01" }, { value: "Mouse" }, { value: 150 }, { value: "" }, { value: "" }] },
          { rowNum: 10, cells: [{ value: "PRD02" }, { value: "Keyboard" }, { value: 300 }, { value: "" }, { value: "" }] },
          { rowNum: 11, cells: [{ value: "PRD03" }, { value: "Laptop" }, { value: 8070 }, { value: "" }, { value: "" }] },
          { rowNum: 12, cells: [{ value: "PRD04" }, { value: "Proyektor" }, { value: 4500 }, { value: "" }, { value: "" }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          {
            label: "Nama Barang (VLOOKUP)",
            resultCell: { row: 1, col: 2 },
            validFormulas: ["=VLOOKUP(A2,A9:C12,2,FALSE)", "=VLOOKUP(A2, A9:C12, 2, FALSE)", "=VLOOKUP(A2;A9:C12;2;0)"],
            expectedResult: "Laptop",
            hint: "Gunakan =VLOOKUP(A2, A9:C12, 2, FALSE) untuk mencari nama barang."
          },
          {
            label: "Harga Satuan (VLOOKUP)",
            resultCell: { row: 1, col: 3 },
            validFormulas: ["=VLOOKUP(A2,A9:C12,3,FALSE)", "=VLOOKUP(A2, A9:C12, 3, FALSE)", "=VLOOKUP(A2;A9:C12;3;0)"],
            expectedResult: "8070",
            hint: "Gunakan =VLOOKUP(A2, A9:C12, 3, FALSE) untuk mencari harga."
          },
          {
            label: "Total Biaya Kotor",
            resultCell: { row: 1, col: 4 },
            validFormulas: ["=B2*D2", "=B2 * D2"],
            expectedResult: "40350",
            hint: "Ketik: =B2 * D2"
          },
          {
            label: "Cari Baris Laptop (MATCH)",
            resultCell: { row: 2, col: 2 },
            validFormulas: ["=MATCH(A3,B9:B12,0)", "=MATCH(A3, B9:B12, 0)"],
            expectedResult: "3",
            hint: "Gunakan =MATCH(A3, B9:B12, 0) untuk mencari baris."
          },
          {
            label: "Harga Proyektor (INDEX MATCH)",
            resultCell: { row: 3, col: 2 },
            validFormulas: ["=INDEX(C9:C12,MATCH(A4,B9:B12,0))", "=INDEX(C9:C12, MATCH(A4, B9:B12, 0))"],
            expectedResult: "4500",
            hint: "Gunakan =INDEX(C9:C12, MATCH(A4, B9:B12, 0))"
          },
          {
            label: "Total Bersih MROUND",
            resultCell: { row: 4, col: 2 },
            validFormulas: ["=MROUND(E2,1000)", "=MROUND(E2, 1000)"],
            expectedResult: "40000",
            hint: "Gunakan =MROUND(E2, 1000) untuk membulatkan ke ribuan terdekat."
          }
        ]
      }
    ]
  },
  {
    id: "kriteria-data",
    title: "RUMUS UNTUK MENGHITUNG DATA DENGAN KRITERIA",
    description: "Fungsi kalkulasi bersyarat tunggal atau banyak: SUMIF/SUMIFS, COUNTIF/COUNTIFS, dll.",
    steps: [
      {
        id: "sumif",
        title: "Sumif (menjumlahkan data dengan satu kriteria)",
        shortDescription: "Menjumlahkan nilai angka hanya jika sel pasangannya memenuhi satu kriteria.",
        conceptExplanation: "Fungsi `SUMIF` menjumlahkan data angka yang cocok dengan kriteria tertentu.\nSyntax: `=SUMIF(range_kriteria, kriteria, range_angka_jumlah)`",
        instructions: "Jumlahkan total biaya di sel **B6** untuk baris barang yang masuk kategori **\"Kantor\"** (kriteria di kolom **A2:A5**, harga di **B2:B5**).",
        headers: ["", "Kategori", "Harga"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Kategori", header: true }, { value: "Harga", header: true }] },
          { rowNum: 2, cells: [{ value: "Kantor", highlight: true }, { value: 100, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Pribadi" }, { value: 50 }] },
          { rowNum: 4, cells: [{ value: "Kantor", highlight: true }, { value: 250, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Pribadi" }, { value: 80 }] },
          { rowNum: 6, cells: [{ value: "Total Kantor" }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=SUMIF(A2:A5,\"Kantor\",B2:B5)", "=SUMIF(A2:A5, \"Kantor\", B2:B5)", "=SUMIF(A2:A5;\"Kantor\";B2:B5)"],
        expectedResult: "350",
        resultCell: { row: 5, col: 1 },
        hint: "Ketik: =SUMIF(A2:A5, \"Kantor\", B2:B5)"
      },
      {
        id: "sumifs",
        title: "Sumifs (menjumlahkan data dengan beberapa kriteria)",
        shortDescription: "Menjumlahkan nilai sel yang memenuhi beberapa syarat sekaligus.",
        conceptExplanation: "Berbeda dengan SUMIF, pada `SUMIFS` (jamak) letak kolom angka yang ingin dijumlahkan berada di paling depan.\nSyntax: `=SUMIFS(sum_range, range_kriteria1, kriteria1, range_kriteria2, kriteria2, ...)`",
        instructions: "Jumlahkan penjualan di sel **C6** (kolom **C2:C5**) khusus untuk produk **\"Laptop\"** (kolom **A2:A5**) yang berada di wilayah **\"Barat\"** (kolom **B2:B5**).",
        headers: ["", "Produk", "Wilayah", "Penjualan"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Produk", header: true }, { value: "Wilayah", header: true }, { value: "Penjualan", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop", highlight: true }, { value: "Timur" }, { value: 8000 }] },
          { rowNum: 3, cells: [{ value: "Mouse" }, { value: "Barat" }, { value: 300 }] },
          { rowNum: 4, cells: [{ value: "Laptop", highlight: true }, { value: "Barat", highlight: true }, { value: 9500, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Laptop", highlight: true }, { value: "Barat", highlight: true }, { value: 4000, highlight: true }] },
          { rowNum: 6, cells: [{ value: "Laptop Barat" }, { value: "Total", header: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: [
          '=SUMIFS(C2:C5,A2:A5,"Laptop",B2:B5,"Barat")',
          '=SUMIFS(C2:C5, A2:A5, "Laptop", B2:B5, "Barat")',
          '=SUMIFS(C2:C5;A2:A5;"Laptop";B2:B5;"Barat")'
        ],
        expectedResult: "13,500",
        resultCell: { row: 5, col: 2 },
        hint: "Ketik: =SUMIFS(C2:C5, A2:A5, \"Laptop\", B2:B5, \"Barat\")"
      },
      {
        id: "averageif",
        title: "Averageif (menghitung rata-rata dengan satu kriteria)",
        shortDescription: "Mencari rata-rata nilai angka yang memenuhi satu kriteria.",
        conceptExplanation: "Fungsi `AVERAGEIF` mencari nilai rata-rata bersyarat.\nSyntax: `=AVERAGEIF(range_kriteria, kriteria, range_angka_rata_rata)`",
        instructions: "Hitung rata-rata harga di sel **B6** khusus untuk item dengan kategori **\"Food\"** (kriteria di kolom **A2:A5**, harga di **B2:B5**).",
        headers: ["", "Kategori", "Harga"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Kategori", header: true }, { value: "Harga", header: true }] },
          { rowNum: 2, cells: [{ value: "Food", highlight: true }, { value: 30, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Tech" }, { value: 500 }] },
          { rowNum: 4, cells: [{ value: "Food", highlight: true }, { value: 50, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Tech" }, { value: 150 }] },
          { rowNum: 6, cells: [{ value: "Rata Food" }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=AVERAGEIF(A2:A5,\"Food\",B2:B5)", "=AVERAGEIF(A2:A5, \"Food\", B2:B5)", "=AVERAGEIF(A2:A5;\"Food\";B2:B5)"],
        expectedResult: "40",
        resultCell: { row: 5, col: 1 },
        hint: "Ketik: =AVERAGEIF(A2:A5, \"Food\", B2:B5)"
      },
      {
        id: "averageifs",
        title: "Averageifs (menghitung rata-rata dengan beberapa kriteria)",
        shortDescription: "Mencari rata-rata angka yang memenuhi beberapa kriteria sekaligus.",
        conceptExplanation: "Sama seperti SUMIFS, kolom angka yang dirata-rata berada di parameter pertama.\nSyntax: `=AVERAGEIFS(average_range, criteria_range1, criteria1, criteria_range2, criteria2, ...)`",
        instructions: "Rata-ratakan nilai ujian di sel **C6** khusus untuk siswa gender **\"P\"** (Perempuan) (kolom **A2:A5**) yang memiliki nilai kelas di atas **70** (kolom **B2:B5**). Rata-ratakan kolom nilai **C2:C5**.",
        headers: ["", "Gender", "Kelas", "Nilai Ujian"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Gender", header: true }, { value: "Kelas", header: true }, { value: "Nilai Ujian", header: true }] },
          { rowNum: 2, cells: [{ value: "P", highlight: true }, { value: 80, highlight: true }, { value: 90, highlight: true }] },
          { rowNum: 3, cells: [{ value: "L" }, { value: 85 }, { value: 75 }] },
          { rowNum: 4, cells: [{ value: "P", highlight: true }, { value: 60 }, { value: 65 }] },
          { rowNum: 5, cells: [{ value: "P", highlight: true }, { value: 90, highlight: true }, { value: 80, highlight: true }] },
          { rowNum: 6, cells: [{ value: "Rata-rata P > 70" }, { value: "Hitung", header: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: [
          '=AVERAGEIFS(C2:C5,A2:A5,"P",B2:B5,">70")',
          '=AVERAGEIFS(C2:C5, A2:A5, "P", B2:B5, ">70")',
          '=AVERAGEIFS(C2:C5;A2:A5;"P";B2:B5;">70")'
        ],
        expectedResult: "85",
        resultCell: { row: 5, col: 2 },
        hint: "Ketik: =AVERAGEIFS(C2:C5, A2:A5, \"P\", B2:B5, \">70\")"
      },
      {
        id: "countif",
        title: "Countif (menghitung banyak data dengan satu kriteria)",
        shortDescription: "Menghitung jumlah sel yang memenuhi satu kriteria saja.",
        conceptExplanation: "Fungsi `COUNTIF` menghitung kemunculan data berdasarkan satu kriteria.\nSyntax: `=COUNTIF(range, kriteria)`",
        instructions: "Hitung berapa banyak transaksi berstatus **\"Sukses\"** di sel **C6** berdasarkan data kolom status **C2:C5**.",
        headers: ["", "ID", "Pelanggan", "Status"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "ID", header: true }, { value: "Pelanggan", header: true }, { value: "Status", header: true }] },
          { rowNum: 2, cells: [{ value: "TX1" }, { value: "Aditya" }, { value: "Sukses", highlight: true }] },
          { rowNum: 3, cells: [{ value: "TX2" }, { value: "Bambang" }, { value: "Tertunda", highlight: true }] },
          { rowNum: 4, cells: [{ value: "TX3" }, { value: "Citra" }, { value: "Sukses", highlight: true }] },
          { rowNum: 5, cells: [{ value: "TX4" }, { value: "Dewi" }, { value: "Sukses", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Total Sukses" }, { value: "Jumlah" }, { value: "?", highlight: true }] }
        ],
        validFormulas: ['=COUNTIF(C2:C5,"Sukses")', '=COUNTIF(C2:C5, "Sukses")', '=countif(c2:c5,"Sukses")'],
        expectedResult: "3",
        resultCell: { row: 5, col: 2 },
        hint: "Ketik: =COUNTIF(C2:C5, \"Sukses\")"
      },
      {
        id: "countifs",
        title: "Countifs (menghitung banyak data dengan beberapa kriteria)",
        shortDescription: "Menghitung jumlah baris data yang memenuhi beberapa kriteria sekaligus.",
        conceptExplanation: "Fungsi `COUNTIFS` menghitung jumlah sel yang memenuhi semua kriteria yang dipasangkan.\nSyntax: `=COUNTIFS(range1, kriteria1, range2, kriteria2, ...)`",
        instructions: "Hitung di sel **C6** berapa banyak barang dengan jenis **\"Buku\"** (kolom **A2:A5**) yang memiliki stok **di atas 10** (kolom **B2:B5**).",
        headers: ["", "Barang", "Stok", "Hasil Countifs"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Barang", header: true }, { value: "Stok", header: true }, { value: "Hasil Countifs", header: true }] },
          { rowNum: 2, cells: [{ value: "Buku", highlight: true }, { value: 15, highlight: true }, { value: "?", highlight: true }] },
          { rowNum: 3, cells: [{ value: "Pena" }, { value: 8 }] },
          { rowNum: 4, cells: [{ value: "Buku", highlight: true }, { value: 5, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Buku", highlight: true }, { value: 20, highlight: true }] },
          { rowNum: 6, cells: [{ value: "Total Stok Buku > 10" }, { value: "Hitung" }] }
        ],
        validFormulas: [
          '=COUNTIFS(A2:A5,"Buku",B2:B5,">10")',
          '=COUNTIFS(A2:A5, "Buku", B2:B5, ">10")',
          '=COUNTIFS(A2:A5;"Buku";B2:B5;">10")'
        ],
        expectedResult: "2",
        resultCell: { row: 1, col: 2 },
        hint: "Ketik: =COUNTIFS(A2:A5, \"Buku\", B2:B5, \">10\")"
      },
      {
        id: "maxifs",
        title: "Maxifs (mencari nilai tertinggi dengan satu/beberapa kriteria)",
        shortDescription: "Mencari nilai tertinggi yang memenuhi satu atau beberapa kriteria.",
        conceptExplanation: "Fungsi `MAXIFS` menyaring data berdasarkan syarat lalu mengembalikan angka paling besar dari kelompok tersebut.\nSyntax: `=MAXIFS(max_range, criteria_range1, criteria1, ...)`",
        instructions: "Temukan suhu tertinggi di sel **B6** khusus untuk hari berstatus **\"Cerah\"** (kriteria status di **C2:C5**, suhu di **B2:B5**).",
        headers: ["", "Hari", "Suhu", "Status"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Hari", header: true }, { value: "Suhu", header: true }, { value: "Status", header: true }] },
          { rowNum: 2, cells: [{ value: "Senin" }, { value: 72 }, { value: "Hujan" }] },
          { rowNum: 3, cells: [{ value: "Selasa" }, { value: 85, highlight: true }, { value: "Cerah", highlight: true }] },
          { rowNum: 4, cells: [{ value: "Rabu" }, { value: 80, highlight: true }, { value: "Cerah", highlight: true }] },
          { rowNum: 5, cells: [{ value: "Kamis" }, { value: 74 }, { value: "Berawan" }] },
          { rowNum: 6, cells: [{ value: "Suhu Max Cerah" }, { value: "?", highlight: true }, { value: "Analisis" }] }
        ],
        validFormulas: [
          '=MAXIFS(B2:B5,C2:C5,"Cerah")',
          '=MAXIFS(B2:B5, C2:C5, "Cerah")',
          '=MAXIFS(B2:B5;C2:C5;"Cerah")'
        ],
        expectedResult: "85",
        resultCell: { row: 5, col: 1 },
        hint: "Ketik: =MAXIFS(B2:B5, C2:C5, \"Cerah\")"
      },
      {
        id: "minifs",
        title: "Minifs (mencari nilai terendah dengan satu/beberapa kriteria)",
        shortDescription: "Mencari nilai terendah yang memenuhi satu atau beberapa kriteria.",
        conceptExplanation: "Fungsi `MINIFS` menyaring data berdasarkan kriteria lalu mengembalikan angka terkecil dari kelompok tersebut.\nSyntax: `=MINIFS(min_range, criteria_range1, criteria1, ...)`",
        instructions: "Temukan harga termurah di sel **B6** khusus untuk barang kategori **\"Tech\"** (kategori di **A2:A5**, harga di **B2:B5**).",
        headers: ["", "Kategori", "Harga", "Keterangan"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Kategori", header: true }, { value: "Harga", header: true }, { value: "Keterangan", header: true }] },
          { rowNum: 2, cells: [{ value: "Tech", highlight: true }, { value: 999, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Office" }, { value: 45 }] },
          { rowNum: 4, cells: [{ value: "Tech", highlight: true }, { value: 150, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Office" }, { value: 80 }] },
          { rowNum: 6, cells: [{ value: "Tech Termurah" }, { value: "?", highlight: true }, { value: "Analisis" }] }
        ],
        validFormulas: [
          '=MINIFS(B2:B5,A2:A5,"Tech")',
          '=MINIFS(B2:B5, A2:A5, "Tech")',
          '=MINIFS(B2:B5;A2:A5;"Tech")'
        ],
        expectedResult: "150",
        resultCell: { row: 5, col: 1 },
        hint: "Ketik: =MINIFS(B2:B5, A2:A5, \"Tech\")"
      },
      {
        id: "studi-kasus-kriteria",
        title: "Studi Kasus: Analisis Penjualan Cabang",
        shortDescription: "Gunakan rumus kondisional bersyarat (SUMIF, COUNTIF, AVERAGEIF, dll.) untuk menganalisis performa sales.",
        conceptExplanation: "Di bab ini, kamu telah mempelajari rumus-rumus dengan kriteria. Sekarang, mari bantu manajer menganalisis data penjualan agen berdasarkan wilayah dan performa. Kamu akan menjumlahkan penjualan untuk wilayah tertentu, menghitung transaksi, mencari rata-rata bersyarat, serta mencari nilai tertinggi/terendah bersyarat.",
        instructions: "Analisis tabel transaksi agen di sebelah kanan. Hitung total penjualan wilayah 'Barat' menggunakan SUMIF di F2. Hitung banyak transaksi di atas 5000 menggunakan COUNTIF di F3. Cari rata-rata penjualan wilayah 'Timur' menggunakan AVERAGEIF di F4. Cari total penjualan agen 'Rian' untuk produk 'Laptop' menggunakan SUMIFS di F5. Cari transaksi 'Buku' di wilayah 'Timur' menggunakan COUNTIFS di F6. Cari penjualan tertinggi di wilayah 'Barat' menggunakan MAXIFS di F7. Cari penjualan terendah di wilayah 'Barat' menggunakan MINIFS di F8. Klik sel mana saja untuk mulai mengisinya.",
        headers: ["", "Nama Agen", "Wilayah", "Produk", "Penjualan", "Keterangan Soal", "Hasil Analisis"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Agen", header: true }, { value: "Wilayah", header: true }, { value: "Produk", header: true }, { value: "Penjualan", header: true }, { value: "Keterangan Soal", header: true }, { value: "Hasil Analisis", header: true }] },
          { rowNum: 2, cells: [{ value: "Rian" }, { value: "Barat" }, { value: "Laptop" }, { value: 8000 }, { value: "Total Penjualan Barat (SUMIF)" }, { value: "?", highlight: true }] },
          { rowNum: 3, cells: [{ value: "Siti" }, { value: "Timur" }, { value: "Buku" }, { value: 1500 }, { value: "Transaksi Penjualan > 5000 (COUNTIF)" }, { value: "?", highlight: true }] },
          { rowNum: 4, cells: [{ value: "Rian" }, { value: "Timur" }, { value: "Laptop" }, { value: 6000 }, { value: "Rata-rata Penjualan Timur (AVERAGEIF)" }, { value: "?", highlight: true }] },
          { rowNum: 5, cells: [{ value: "Budi" }, { value: "Barat" }, { value: "Buku" }, { value: 1200 }, { value: "Total Laptop Rian (SUMIFS)" }, { value: "?", highlight: true }] },
          { rowNum: 6, cells: [{ value: "Siti" }, { value: "Barat" }, { value: "Laptop" }, { value: 9000 }, { value: "Buku Timur (COUNTIFS)" }, { value: "?", highlight: true }] },
          { rowNum: 7, cells: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "Penjualan Tertinggi Barat (MAXIFS)" }, { value: "?", highlight: true }] },
          { rowNum: 8, cells: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "Penjualan Terendah Barat (MINIFS)" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          {
            label: "Total Penjualan Barat (SUMIF)",
            resultCell: { row: 1, col: 5 },
            validFormulas: ["=SUMIF(B2:B6,\"Barat\",D2:D6)", "=SUMIF(B2:B6, \"Barat\", D2:D6)", "=SUMIF(B2:B6;\"Barat\";D2:D6)"],
            expectedResult: "18200",
            hint: "Gunakan =SUMIF(B2:B6, \"Barat\", D2:D6) untuk menjumlahkan dengan wilayah Barat."
          },
          {
            label: "Transaksi Penjualan > 5000 (COUNTIF)",
            resultCell: { row: 2, col: 5 },
            validFormulas: ["=COUNTIF(D2:D6,\">5000\")", "=COUNTIF(D2:D6, \">5000\")", "=COUNTIF(D2:D6;\">5000\")"],
            expectedResult: "3",
            hint: "Gunakan =COUNTIF(D2:D6, \">5000\") untuk menghitung transaksi di atas 5000."
          },
          {
            label: "Rata-rata Penjualan Timur (AVERAGEIF)",
            resultCell: { row: 3, col: 5 },
            validFormulas: ["=AVERAGEIF(B2:B6,\"Timur\",D2:D6)", "=AVERAGEIF(B2:B6, \"Timur\", D2:D6)", "=AVERAGEIF(B2:B6;\"Timur\";D2:D6)"],
            expectedResult: "3750",
            hint: "Gunakan =AVERAGEIF(B2:B6, \"Timur\", D2:D6) untuk merata-rata wilayah Timur."
          },
          {
            label: "Total Laptop Rian (SUMIFS)",
            resultCell: { row: 4, col: 5 },
            validFormulas: ["=SUMIFS(D2:D6,A2:A6,\"Rian\",C2:C6,\"Laptop\")", "=SUMIFS(D2:D6, A2:A6, \"Rian\", C2:C6, \"Laptop\")"],
            expectedResult: "14000",
            hint: "Gunakan =SUMIFS(D2:D6, A2:A6, \"Rian\", C2:C6, \"Laptop\") untuk menjumlahkan berdasarkan banyak syarat."
          },
          {
            label: "Buku Timur (COUNTIFS)",
            resultCell: { row: 5, col: 5 },
            validFormulas: ["=COUNTIFS(C2:C6,\"Buku\",B2:B6,\"Timur\")", "=COUNTIFS(C2:C6, \"Buku\", B2:B6, \"Timur\")"],
            expectedResult: "1",
            hint: "Gunakan =COUNTIFS(C2:C6, \"Buku\", B2:B6, \"Timur\") untuk menghitung baris dengan syarat Buku dan Timur."
          },
          {
            label: "Penjualan Tertinggi Barat (MAXIFS)",
            resultCell: { row: 6, col: 5 },
            validFormulas: ["=MAXIFS(D2:D6,B2:B6,\"Barat\")", "=MAXIFS(D2:D6, B2:B6, \"Barat\")"],
            expectedResult: "9000",
            hint: "Gunakan =MAXIFS(D2:D6, B2:B6, \"Barat\") untuk mencari penjualan tertinggi di Barat."
          },
          {
            label: "Penjualan Terendah Barat (MINIFS)",
            resultCell: { row: 7, col: 5 },
            validFormulas: ["=MINIFS(D2:D6,B2:B6,\"Barat\")", "=MINIFS(D2:D6, B2:B6, \"Barat\")"],
            expectedResult: "1200",
            hint: "Gunakan =MINIFS(D2:D6, B2:B6, \"Barat\") untuk mencari penjualan terendah di Barat."
          }
        ]
      }
    ]
  },
  {
    id: "waktu-data",
    title: "RUMUS UNTUK MENGOLAH DATA BERBENTUK WAKTU",
    description: "Kumpulan fungsi lengkap untuk mengelola tanggal, hari, bulan, jam, menit, serta selisih hari kerja.",
    steps: [
      {
        id: "now",
        title: "Now (menginput tanggal dan waktu sekarang)",
        shortDescription: "Memasukkan informasi tanggal dan jam aktif saat ini.",
        conceptExplanation: "Fungsi `NOW` mengembalikan tanggal dan waktu saat ini secara dinamis. Fungsi ini tidak membutuhkan argumen apa pun.\nSyntax: `=NOW()`",
        instructions: "Masukkan informasi tanggal dan waktu saat ini di sel **A2** menggunakan fungsi `NOW`.",
        headers: ["", "Waktu Sekarang"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Waktu Sekarang", header: true }] },
          { rowNum: 2, cells: [{ value: "?", highlight: true }] }
        ],
        validFormulas: ["=NOW()", "=now()"],
        expectedResult: "02/06/2026 15:51",
        resultCell: { row: 1, col: 0 },
        hint: "Ketik: =NOW()"
      },
      {
        id: "today",
        title: "Today (menginput tanggal hari ini)",
        shortDescription: "Memasukkan informasi tanggal hari ini saja (tanpa jam).",
        conceptExplanation: "Fungsi `TODAY` mengembalikan tanggal hari ini secara dinamis.\nSyntax: `=TODAY()`",
        instructions: "Masukkan tanggal hari ini di sel **A2** menggunakan fungsi `TODAY`.",
        headers: ["", "Tanggal Hari Ini"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Tanggal Hari Ini", header: true }] },
          { rowNum: 2, cells: [{ value: "?", highlight: true }] }
        ],
        validFormulas: ["=TODAY()", "=today()"],
        expectedResult: "02/06/2026",
        resultCell: { row: 1, col: 0 },
        hint: "Ketik: =TODAY()"
      },
      {
        id: "day",
        title: "Day (mengekstrak hari dari tanggal lengkap)",
        shortDescription: "Mengambil informasi tanggal (hari) dari format tanggal lengkap.",
        conceptExplanation: "Fungsi `DAY` mengembalikan bilangan bulat antara 1 hingga 31 yang mewakili hari/tanggal dari suatu sel berisi tanggal lengkap.\nSyntax: `=DAY(sel_tanggal)`",
        instructions: "Ambil nilai hari/tanggal dari tanggal lengkap di sel **A2** di dalam sel **B2**.",
        headers: ["", "Tanggal Lengkap", "Hari (Tanggal)"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Tanggal Lengkap", header: true }, { value: "Hari (Tanggal)", header: true }] },
          { rowNum: 2, cells: [{ value: "2026-06-15", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=DAY(A2)", "=day(a2)"],
        expectedResult: "15",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =DAY(A2)"
      },
      {
        id: "month",
        title: "Month (mengekstrak bulan dari tanggal lengkap)",
        shortDescription: "Mengambil informasi angka bulan (1-12) dari tanggal lengkap.",
        conceptExplanation: "Fungsi `MONTH` mengembalikan angka 1 sampai 12 yang melambangkan bulan dari data tanggal.\nSyntax: `=MONTH(sel_tanggal)`",
        instructions: "Ambil angka bulan dari sel **A2** di dalam sel **B2**.",
        headers: ["", "Tanggal Lengkap", "Bulan"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Tanggal Lengkap", header: true }, { value: "Bulan", header: true }] },
          { rowNum: 2, cells: [{ value: "2026-06-15", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=MONTH(A2)", "=month(a2)"],
        expectedResult: "6",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =MONTH(A2)"
      },
      {
        id: "year",
        title: "Year (mengekstrak tahun dari tanggal lengkap)",
        shortDescription: "Mengambil informasi angka tahun 4 digit dari tanggal lengkap.",
        conceptExplanation: "Fungsi `YEAR` mengembalikan angka tahun (4 digit) dari data tanggal.\nSyntax: `=YEAR(sel_tanggal)`",
        instructions: "Ambil angka tahun dari sel **A2** di dalam sel **B2**.",
        headers: ["", "Tanggal Lengkap", "Tahun"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Tanggal Lengkap", header: true }, { value: "Tahun", header: true }] },
          { rowNum: 2, cells: [{ value: "2026-06-15", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=YEAR(A2)", "=year(a2)"],
        expectedResult: "2026",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =YEAR(A2)"
      },
      {
        id: "date",
        title: "Date (menggabungkan tanggal, bulan, tahun menjadi tanggal lengkap)",
        shortDescription: "Menggabungkan tiga sel angka (Tahun, Bulan, Hari) menjadi satu format tanggal utuh.",
        conceptExplanation: "Fungsi `DATE` merangkai tiga bilangan bulat menjadi format tanggal Excel terstruktur.\nSyntax: `=DATE(tahun, bulan, hari)`",
        instructions: "Gabungkan nilai tahun di sel **A2**, bulan di sel **B2**, dan hari di sel **C2** menjadi tanggal lengkap di sel **D2**.",
        headers: ["", "Tahun", "Bulan", "Hari", "Tanggal Utuh"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Tahun", header: true }, { value: "Bulan", header: true }, { value: "Hari", header: true }, { value: "Tanggal Utuh", header: true }] },
          { rowNum: 2, cells: [{ value: 2026, highlight: true }, { value: 6, highlight: true }, { value: 2, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=DATE(A2,B2,C2)", "=DATE(A2, B2, C2)", "=DATE(A2;B2;C2)"],
        expectedResult: "02/06/2026",
        resultCell: { row: 1, col: 3 },
        hint: "Ketik: =DATE(A2, B2, C2)"
      },
      {
        id: "hour",
        title: "Hour (mengekstrak jam dari waktu lengkap)",
        shortDescription: "Mengambil jam (0-23) dari format waktu lengkap.",
        conceptExplanation: "Fungsi `HOUR` mengembalikan nilai jam berupa angka dari format waktu.\nSyntax: `=HOUR(sel_waktu)`",
        instructions: "Ambil angka jam saja dari kolom waktu di sel **A2** di dalam sel **B2**.",
        headers: ["", "Waktu Lengkap", "Jam"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Waktu Lengkap", header: true }, { value: "Jam", header: true }] },
          { rowNum: 2, cells: [{ value: "14:35:10", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=HOUR(A2)", "=hour(a2)"],
        expectedResult: "14",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =HOUR(A2)"
      },
      {
        id: "minute",
        title: "Minute (mengekstrak menit dari waktu lengkap)",
        shortDescription: "Mengambil menit (0-59) dari format waktu lengkap.",
        conceptExplanation: "Fungsi `MINUTE` mengambil informasi menit dari data waktu.\nSyntax: `=MINUTE(sel_waktu)`",
        instructions: "Ambil angka menit saja dari sel **A2** di dalam sel **B2**.",
        headers: ["", "Waktu Lengkap", "Menit"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Waktu Lengkap", header: true }, { value: "Menit", header: true }] },
          { rowNum: 2, cells: [{ value: "14:35:10", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=MINUTE(A2)", "=minute(a2)"],
        expectedResult: "35",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =MINUTE(A2)"
      },
      {
        id: "second",
        title: "Second (mengekstrak detik dari waktu lengkap)",
        shortDescription: "Mengambil detik (0-59) dari format waktu lengkap.",
        conceptExplanation: "Fungsi `SECOND` mengambil informasi detik dari data waktu.\nSyntax: `=SECOND(sel_waktu)`",
        instructions: "Ambil angka detik saja dari sel **A2** di dalam sel **B2**.",
        headers: ["", "Waktu Lengkap", "Detik"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Waktu Lengkap", header: true }, { value: "Detik", header: true }] },
          { rowNum: 2, cells: [{ value: "14:35:10", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=SECOND(A2)", "=second(a2)"],
        expectedResult: "10",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =SECOND(A2)"
      },
      {
        id: "time",
        title: "Time (menggabungkan jam, menit, detik menjadi waktu lengkap)",
        shortDescription: "Menggabungkan tiga sel angka (Jam, Menit, Detik) menjadi format waktu utuh.",
        conceptExplanation: "Fungsi `TIME` merangkai tiga bilangan bulat menjadi format waktu terstruktur.\nSyntax: `=TIME(jam, menit, detik)`",
        instructions: "Gabungkan nilai jam di sel **A2**, menit di sel **B2**, dan detik di sel **C2** menjadi waktu lengkap di sel **D2**.",
        headers: ["", "Jam", "Menit", "Detik", "Waktu Utuh"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Jam", header: true }, { value: "Menit", header: true }, { value: "Detik", header: true }, { value: "Waktu Utuh", header: true }] },
          { rowNum: 2, cells: [{ value: 12, highlight: true }, { value: 30, highlight: true }, { value: 0, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=TIME(A2,B2,C2)", "=TIME(A2, B2, C2)", "=TIME(A2;B2;C2)"],
        expectedResult: "12:30 PM",
        resultCell: { row: 1, col: 3 },
        hint: "Ketik: =TIME(A2, B2, C2)"
      },
      {
        id: "edate",
        title: "Edate (mencari tanggal dalam beberapa bulan ke depan / belakang)",
        shortDescription: "Mencari tanggal baru beberapa bulan sebelum atau setelah tanggal awal.",
        conceptExplanation: "Fungsi `EDATE` digunakan untuk menghitung tanggal jatuh tempo. Menghasilkan tanggal baru yang berjarak N bulan dari tanggal awal (gunakan angka negatif untuk bulan di masa lalu).\nSyntax: `=EDATE(tanggal_awal, jumlah_bulan)`",
        instructions: "Cari tanggal baru **3 bulan setelah** tanggal kontrak di sel **A2** di dalam sel **B2**.",
        headers: ["", "Kontrak Awal", "Hasil EDATE"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Kontrak Awal", header: true }, { value: "Hasil EDATE", header: true }] },
          { rowNum: 2, cells: [{ value: "2026-06-02", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=EDATE(A2,3)", "=EDATE(A2, 3)", "=EDATE(A2;3)"],
        expectedResult: "02/09/2026",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =EDATE(A2, 3)"
      },
      {
        id: "eomonth",
        title: "Eomonth (mencari tanggal akhir bulan dalam beberapa bulan ke depan / belakang)",
        shortDescription: "Mencari tanggal hari terakhir dari suatu bulan di masa depan/lalu.",
        conceptExplanation: "Fungsi `EOMONTH` (End Of Month) mencari hari terakhir dari bulan yang terpilih berjarak N bulan ke depan/belakang (gunakan `0` untuk akhir bulan saat ini).\nSyntax: `=EOMONTH(tanggal_awal, jumlah_bulan)`",
        instructions: "Cari tanggal **hari terakhir pada bulan berjalan** dari tanggal di sel **A2** (jumlah bulan = `0`) di dalam sel **B2**.",
        headers: ["", "Tanggal Mulai", "Akhir Bulan"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Tanggal Mulai", header: true }, { value: "Akhir Bulan", header: true }] },
          { rowNum: 2, cells: [{ value: "2026-06-02", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=EOMONTH(A2,0)", "=EOMONTH(A2, 0)", "=EOMONTH(A2;0)"],
        expectedResult: "30/06/2026",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =EOMONTH(A2, 0)"
      },
      {
        id: "yearfrac",
        title: "Yearfrac (menghitung selisih tanggal dalam satuan tahun)",
        shortDescription: "Menghitung selisih dua tanggal dalam representasi desimal pecahan tahun.",
        conceptExplanation: "Fungsi `YEARFRAC` mengembalikan pecahan tahun yang mewakili jumlah hari penuh di antara tanggal awal dan tanggal akhir.\nSyntax: `=YEARFRAC(tanggal_awal, tanggal_akhir)`",
        instructions: "Hitung proporsi pecahan tahun antara tanggal mulai di sel **A2** dan tanggal selesai di sel **B2** pada sel **C2**.",
        headers: ["", "Mulai", "Selesai", "Pecahan Tahun"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Mulai", header: true }, { value: "Selesai", header: true }, { value: "Pecahan Tahun", header: true }] },
          { rowNum: 2, cells: [{ value: "2025-06-02", highlight: true }, { value: "2026-06-02", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=YEARFRAC(A2,B2)", "=YEARFRAC(A2, B2)", "=YEARFRAC(A2;B2)"],
        expectedResult: "1",
        resultCell: { row: 1, col: 2 },
        hint: "Ketik: =YEARFRAC(A2, B2)"
      },
      {
        id: "datedif",
        title: "Datedif (menghitung selisih tanggal dalam satuan tahun, bulan, hari)",
        shortDescription: "Menghitung selisih waktu antara dua tanggal dalam satuan Hari, Bulan, atau Tahun.",
        conceptExplanation: "Fungsi `DATEDIF` menghitung selisih tanggal. Fungsi ini tidak terdaftar di auto-complete Excel biasa tetapi sangat populer. Parameter ke-3 adalah format keluaran:\n- `\"Y\"`: Selisih tahun bulat.\n- `\"M\"`: Selisih bulan bulat.\n- `\"D\"`: Selisih hari.\nSyntax: `=DATEDIF(tanggal_awal, tanggal_akhir, \"format\")`",
        instructions: "Hitung selisih umur dalam satuan **tahun** (`\"Y\"`) di sel **C2** berdasarkan tanggal lahir di sel **A2** dan tanggal akhir di sel **B2**.",
        headers: ["", "Lahir", "Hari Ini", "Umur (Tahun)"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Lahir", header: true }, { value: "Hari Ini", header: true }, { value: "Umur (Tahun)", header: true }] },
          { rowNum: 2, cells: [{ value: "2000-06-02", highlight: true }, { value: "2026-06-02", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=DATEDIF(A2,B2,\"Y\")", "=DATEDIF(A2, B2, \"Y\")", "=DATEDIF(A2;B2;\"Y\")"],
        expectedResult: "26",
        resultCell: { row: 1, col: 2 },
        hint: "Gunakan format \"Y\" untuk selisih tahun: =DATEDIF(A2, B2, \"Y\")"
      },
      {
        id: "workday",
        title: "Workday (mencari tanggal di masa depan)",
        shortDescription: "Mencari tanggal di masa depan setelah melewati N hari kerja (sabtu-minggu dilewati).",
        conceptExplanation: "Fungsi `WORKDAY` menghasilkan tanggal baru setelah melewati N hari kerja, otomatis melewati akhir pekan (Sabtu & Minggu) serta daftar hari libur yang opsional.\nSyntax: `=WORKDAY(tanggal_awal, jumlah_hari_kerja)`",
        instructions: "Cari tanggal selesai proyek di sel **B2** jika dimulai tanggal **A2** dan membutuhkan waktu pengerjaan **5 hari kerja**.",
        headers: ["", "Tanggal Mulai", "Selesai Proyek"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Tanggal Mulai", header: true }, { value: "Selesai Proyek", header: true }] },
          { rowNum: 2, cells: [{ value: "2026-06-01", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=WORKDAY(A2,5)", "=WORKDAY(A2, 5)", "=WORKDAY(A2;5)"],
        expectedResult: "08/06/2026",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =WORKDAY(A2, 5). Tanggal mulai senin 1 juni + 5 hari kerja (selasa, rabu, kamis, jumat, senin) = senin 8 juni."
      },
      {
        id: "networkdays",
        title: "Networkdays (menghitung jumlah hari kerja)",
        shortDescription: "Menghitung berapa banyak hari kerja di antara dua tanggal (tidak menghitung sabtu-minggu).",
        conceptExplanation: "Fungsi `NETWORKDAYS` menghitung jumlah hari kerja penuh di antara dua tanggal, tidak termasuk akhir pekan (Sabtu dan Minggu).\nSyntax: `=NETWORKDAYS(tanggal_awal, tanggal_akhir)`",
        instructions: "Hitung total hari kerja yang dilalui di sel **C2** dari tanggal mulai **A2** hingga selesai **B2**.",
        headers: ["", "Mulai", "Selesai", "Hari Kerja"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Mulai", header: true }, { value: "Selesai", header: true }, { value: "Hari Kerja", header: true }] },
          { rowNum: 2, cells: [{ value: "2026-06-01", highlight: true }, { value: "2026-06-10", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=NETWORKDAYS(A2,B2)", "=NETWORKDAYS(A2, B2)", "=NETWORKDAYS(A2;B2)"],
        expectedResult: "8",
        resultCell: { row: 1, col: 2 },
        hint: "Ketik: =NETWORKDAYS(A2, B2)"
      },
      {
        id: "networkdays_intl",
        title: "Networkdays.Intl (menghitung jumlah hari kerja dengan pilihan weekend lebih beragam)",
        shortDescription: "Menghitung hari kerja dengan konfigurasi akhir pekan kustom (misal libur hanya hari minggu saja).",
        conceptExplanation: "Fungsi `NETWORKDAYS.INTL` membolehkan kamu menghitung jumlah hari kerja dengan mendefinisikan hari apa saja yang dianggap sebagai akhir pekan/libur mingguan menggunakan kode angka:\n- `1`: Sabtu & Minggu libur (default)\n- `11`: Hanya hari Minggu yang libur.\nSyntax: `=NETWORKDAYS.INTL(tanggal_awal, tanggal_akhir, kode_weekend)`",
        instructions: "Hitung jumlah hari kerja di sel **C2** untuk rentang tanggal **A2** ke **B2** menggunakan kode `11` (hanya hari Minggu libur, Sabtu tetap masuk kerja).",
        headers: ["", "Mulai", "Selesai", "Hari Kerja (6 Hari/Minggu)"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Mulai", header: true }, { value: "Selesai", header: true }, { value: "Hari Kerja (6 Hari/Minggu)", header: true }] },
          { rowNum: 2, cells: [{ value: "2026-06-01", highlight: true }, { value: "2026-06-10", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: [
          "=NETWORKDAYS.INTL(A2,B2,11)",
          "=NETWORKDAYS.INTL(A2, B2, 11)",
          "=NETWORKDAYS.INTL(A2;B2;11)"
        ],
        expectedResult: "9",
        resultCell: { row: 1, col: 2 },
        hint: "Ketik: =NETWORKDAYS.INTL(A2, B2, 11)"
      },
      {
        id: "studi-kasus-waktu",
        title: "Studi Kasus: Laporan Pelacakan Proyek & Waktu Kerja",
        shortDescription: "Tantangan mandiri: hitung durasi proyek, hari kerja, dan estimasi selesai menggunakan rumus waktu.",
        conceptExplanation: "Sebagai Manajer Proyek, Anda perlu menyusun rencana kerja tim. Mari buat laporan pelacakan proyek terintegrasi menggunakan rumus waktu:\n\n1. **Durasi Hari Kalender (C2)**: Hitung total hari kalender di antara Tanggal Mulai (A2) dan Tanggal Selesai (B2).\n   *Syntax*: `=DAYS(B2, A2)`\n2. **Total Hari Kerja (D2)**: Hitung total hari kerja (Senin-Jumat) di antara Tanggal Mulai (A2) dan Tanggal Selesai (B2).\n   *Syntax*: `=NETWORKDAYS(A2, B2)`\n3. **Estimasi Selesai (F2)**: Proyek Baru dimulai tanggal **2026-06-01** (E2) dan membutuhkan waktu pengerjaan **10 hari kerja** (Senin-Jumat). Hitung tanggal estimasi selesai proyek baru.\n   *Syntax*: `=WORKDAY(E2, 10)`",
        instructions: "Isi sel bertanda tanya (C2, D2, F2) dengan rumus waktu yang sesuai berdasarkan penjelasan di atas.",
        headers: ["", "Mulai", "Selesai", "Hari Kalender", "Hari Kerja", "Mulai Baru", "Selesai Estimasi"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Mulai", header: true }, { value: "Selesai", header: true }, { value: "Hari Kalender", header: true }, { value: "Hari Kerja", header: true }, { value: "Mulai Baru", header: true }, { value: "Selesai Estimasi", header: true }] },
          { rowNum: 2, cells: [{ value: "2026-06-01" }, { value: "2026-06-15" }, { value: "?", highlight: true }, { value: "?", highlight: true }, { value: "2026-06-01" }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          {
            label: "Hari Kalender (DAYS)",
            resultCell: { row: 1, col: 2 },
            validFormulas: ["=DAYS(B2,A2)", "=DAYS(B2, A2)", "=DAYS(B2;A2)"],
            expectedResult: "14",
            hint: "Hitung beda hari: =DAYS(B2, A2)"
          },
          {
            label: "Hari Kerja (NETWORKDAYS)",
            resultCell: { row: 1, col: 3 },
            validFormulas: ["=NETWORKDAYS(A2,B2)", "=NETWORKDAYS(A2, B2)", "=NETWORKDAYS(A2;B2)"],
            expectedResult: "11",
            hint: "Hitung hari kerja penuh: =NETWORKDAYS(A2, B2)"
          },
          {
            label: "Selesai Estimasi (WORKDAY)",
            resultCell: { row: 1, col: 5 },
            validFormulas: ["=WORKDAY(E2,10)", "=WORKDAY(E2, 10)", "=WORKDAY(E2;10)"],
            expectedResult: "15/06/2026",
            hint: "Tambahkan 10 hari kerja ke tanggal mulai E2: =WORKDAY(E2, 10)"
          }
        ]
      }
    ]
  },
  {
    id: "uji-pernyataan",
    title: "RUMUS UNTUK MENGUJI PERNYATAAN",
    description: "Fungsi keputusan logika untuk menguji kondisi benar/salah: IF, AND, OR, dan IFERROR.",
    steps: [
      {
        id: "and",
        title: "And (menguji kebenaran semua pernyataan)",
        shortDescription: "Menghasilkan TRUE hanya jika SELURUH pernyataan bernilai benar.",
        conceptExplanation: "Fungsi `AND` menguji beberapa kondisi logika. Menghasilkan nilai `TRUE` jika semua kondisi terpenuhi, dan `FALSE` jika ada satu saja kondisi yang salah.\nSyntax: `=AND(kondisi1, kondisi2, ...)`",
        instructions: "Uji apakah nilai ujian 1 di sel **A2** dan nilai ujian 2 di sel **B2** keduanya **di atas atau sama dengan 75**. Tulis di sel **C2**.",
        headers: ["", "Nilai 1", "Nilai 2", "Dua-duanya Lulus?"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nilai 1", header: true }, { value: "Nilai 2", header: true }, { value: "Dua-duanya Lulus?", header: true }] },
          { rowNum: 2, cells: [{ value: 80, highlight: true }, { value: 78, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=AND(A2>=75,B2>=75)", "=AND(A2>=75, B2>=75)", "=AND(A2>=75;B2>=75)"],
        expectedResult: "TRUE",
        resultCell: { row: 1, col: 2 },
        hint: "Ketik: =AND(A2>=75, B2>=75)"
      },
      {
        id: "or",
        title: "Or (menguji kebenaran salah satu pernyataan)",
        shortDescription: "Menghasilkan TRUE jika MINIMAL SALAH SATU pernyataan bernilai benar.",
        conceptExplanation: "Fungsi `OR` menguji beberapa kondisi logika. Menghasilkan `TRUE` jika minimal ada satu kondisi saja yang terpenuhi, dan hanya menghasilkan `FALSE` jika seluruh kondisi salah.\nSyntax: `=OR(kondisi1, kondisi2, ...)`",
        instructions: "Uji di sel **C2** apakah salah satu dari nilai ujian di **A2** atau **B2** ada yang **di atas atau sama dengan 75**.",
        headers: ["", "Nilai 1", "Nilai 2", "Salah Satu Lulus?"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nilai 1", header: true }, { value: "Nilai 2", header: true }, { value: "Salah Satu Lulus?", header: true }] },
          { rowNum: 2, cells: [{ value: 60, highlight: true }, { value: 82, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=OR(A2>=75,B2>=75)", "=OR(A2>=75, B2>=75)", "=OR(A2>=75;B2>=75)"],
        expectedResult: "TRUE",
        resultCell: { row: 1, col: 2 },
        hint: "Ketik: =OR(A2>=75, B2>=75)"
      },
      {
        id: "not",
        title: "Not (menghasilkan hasil berkebalikan dari rumus asli)",
        shortDescription: "Membalikkan nilai TRUE menjadi FALSE, dan sebaliknya.",
        conceptExplanation: "Fungsi `NOT` menghasilkan nilai logika yang berkebalikan dari hasil pengujian asli.\nSyntax: `=NOT(pernyataan_logika)`",
        instructions: "Balikkan kondisi lulus ujian di sel **A2** di dalam sel **B2** (menghasilkan FALSE karena A2 adalah TRUE).",
        headers: ["", "Apakah Lulus", "Hasil NOT"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Apakah Lulus", header: true }, { value: "Hasil NOT", header: true }] },
          { rowNum: 2, cells: [{ value: "TRUE", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=NOT(A2)", "=not(a2)"],
        expectedResult: "FALSE",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =NOT(A2)"
      },
      {
        id: "if",
        title: "If (menguji pernyataan jika-maka)",
        shortDescription: "Menjalankan keputusan logika bercabang tunggal.",
        conceptExplanation: "Fungsi `IF` menguji pernyataan dan mengeluarkan nilai jika syarat terpenuhi, dan nilai lainnya jika syarat tidak terpenuhi.\nSyntax: `=IF(syarat, nilai_jika_benar, nilai_jika_salah)`",
        instructions: "Di sel **C2**, periksa jika nilai ujian di sel **B2** lebih besar atau sama dengan **60** maka tampilkan **\"Pass\"**, jika kurang tampilkan **\"Fail\"**.",
        headers: ["", "Nama", "Nilai", "Status"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama", header: true }, { value: "Nilai", header: true }, { value: "Status", header: true }] },
          { rowNum: 2, cells: [{ value: "Sophia" }, { value: 72, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ['=IF(B2>=60,"Pass","Fail")', '=IF(B2>=60, "Pass", "Fail")', '=IF(B2>=60; "Pass"; "Fail")'],
        expectedResult: "Pass",
        resultCell: { row: 1, col: 2 },
        hint: "Ketik: =IF(B2>=60, \"Pass\", \"Fail\")"
      },
      {
        id: "nested-if",
        title: "Nested IF (IF Bercabang)",
        shortDescription: "Menguji beberapa kondisi dengan menumpuk fungsi IF di dalam fungsi IF lainnya.",
        conceptExplanation: "Nested IF atau IF bercabang adalah teknik menempatkan fungsi IF baru di dalam bagian nilai alternatif (false) dari fungsi IF sebelumnya. Teknik ini sangat penting untuk menguji beberapa kondisi sekaligus di versi Excel lama yang belum mendukung fungsi IFS.\n\n*Aturan Penting*:\n- Setiap fungsi IF yang dibuka membutuhkan tanda kurung penutup di akhir rumus.\n- Kondisi diuji dari kiri ke kanan. Begitu satu kondisi benar, Excel akan berhenti menguji kondisi berikutnya.\nSyntax: `=IF(kondisi1, hasil1, IF(kondisi2, hasil2, hasil_alternatif_semua_salah))`",
        instructions: "Tentukan Grade kelulusan siswa di sel **C2** berdasarkan Nilai Ujian di sel **B2**:\n- Jika Nilai `>= 85`, tampilkan **\"A\"**\n- Jika Nilai `>= 70`, tampilkan **\"B\"**\n- Jika kurang dari 70, tampilkan **\"C\"**\nKetik rumusnya di sel **C2**.",
        headers: ["", "Nama", "Nilai Ujian", "Grade"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama", header: true }, { value: "Nilai Ujian", header: true }, { value: "Grade", header: true }] },
          { rowNum: 2, cells: [{ value: "Sophia" }, { value: 78, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: [
          '=IF(B2>=85,"A",IF(B2>=70,"B","C"))',
          '=IF(B2>=85, "A", IF(B2>=70, "B", "C"))',
          '=IF(B2>=85; "A"; IF(B2>=70; "B"; "C"))',
          '=IF(B2>=85,"A",IF(B2>=70,"B",IF(B2<70,"C")))'
        ],
        expectedResult: "B",
        resultCell: { row: 1, col: 2 },
        hint: "Ketik: =IF(B2>=85, \"A\", IF(B2>=70, \"B\", \"C\"))"
      },
      {
        id: "ifs",
        title: "Ifs (menguji beberapa pernyataan jika-maka)",
        shortDescription: "Melakukan pengujian banyak kondisi tanpa perlu menulis IF bercabang-cabang.",
        conceptExplanation: "Fungsi `IFS` membolehkan kamu menulis hingga 127 kondisi logika berurutan secara rapi tanpa perlu menumpuk banyak tanda kurung IF.\nSyntax: `=IFS(syarat1, nilai1, syarat2, nilai2, syarat3, nilai3, ...)`",
        instructions: "Tentukan grade ujian di sel **B2** berdasarkan nilai di sel **A2**:\n- Jika `>= 90` maka **\"A\"**\n- Jika `>= 80` maka **\"B\"**\n- Jika `< 80` maka **\"C\"**",
        headers: ["", "Nilai", "Grade"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nilai", header: true }, { value: "Grade", header: true }] },
          { rowNum: 2, cells: [{ value: 85, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: [
          '=IFS(A2>=90,"A",A2>=80,"B",A2<80,"C")',
          '=IFS(A2>=90, "A", A2>=80, "B", A2<80, "C")',
          '=IFS(A2>=90; "A"; A2>=80; "B"; A2<80; "C")'
        ],
        expectedResult: "B",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =IFS(A2>=90, \"A\", A2>=80, \"B\", A2<80, \"C\")"
      },
      {
        id: "iferror",
        title: "Iferror (menyamarkan error)",
        shortDescription: "Mengganti tampilan sel yang error dengan tulisan/angka alternatif pilihan kita.",
        conceptExplanation: "Fungsi `IFERROR` mendeteksi jika suatu rumus menghasilkan error (seperti `#DIV/0!`, `#N/A`, dll.) dan menggantinya dengan tulisan atau angka pilihan kita agar tabel terlihat rapi.\nSyntax: `=IFERROR(rumus_asli, nilai_cadangan_jika_error)`",
        instructions: "Lakukan pembagian harga barang di sel **A2** dengan jumlah unit terjual di sel **B2** pada sel **C2**. Jika terjadi error pembagian (karena unit = 0), tampilkan angka **0**.",
        headers: ["", "Harga", "Unit Terjual", "Harga per Unit"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Harga", header: true }, { value: "Unit Terjual", header: true }, { value: "Harga per Unit", header: true }] },
          { rowNum: 2, cells: [{ value: 500, highlight: true }, { value: 0, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=IFERROR(A2/B2,0)", "=IFERROR(A2/B2, 0)", "=IFERROR(A2/B2;0)"],
        expectedResult: "0",
        resultCell: { row: 1, col: 2 },
        hint: "Ketik: =IFERROR(A2/B2, 0)"
      },
      {
        id: "exact",
        title: "Exact (menguji jika dua data sama persis)",
        shortDescription: "Menguji apakah dua teks sama persis secara sensitif terhadap huruf besar/kecil (case-sensitive).",
        conceptExplanation: "Fungsi `EXACT` membandingkan dua teks secara mendalam. Menghasilkan `TRUE` hanya jika kedua teks benar-benar identik, termasuk kesamaan huruf kapital dan kecil.\nSyntax: `=EXACT(teks1, teks2)`",
        instructions: "Uji apakah kata sandi di sel **A2** dan sel **B2** sama persis di dalam sel **C2**.",
        headers: ["", "Sandi 1", "Sandi 2", "Sama Persis?"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Sandi 1", header: true }, { value: "Sandi 2", header: true }, { value: "Sama Persis?", header: true }] },
          { rowNum: 2, cells: [{ value: "Admin123", highlight: true }, { value: "admin123", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=EXACT(A2,B2)", "=EXACT(A2, B2)", "=EXACT(A2;B2)"],
        expectedResult: "FALSE",
        resultCell: { row: 1, col: 2 },
        hint: "Ketik: =EXACT(A2, B2). Hasilnya FALSE karena huruf 'A' pada sandi 1 berbeda kapital dengan sandi 2."
      },
      {
        id: "studi-kasus-pernyataan",
        title: "Studi Kasus: Evaluasi Kelulusan Seleksi Karyawan",
        shortDescription: "Tantangan mandiri: uji kondisi kelulusan peserta menggunakan fungsi logika AND, OR, dan IFERROR.",
        conceptExplanation: "Sebagai bagian dari tim HRD, Anda perlu menguji kelayakan calon karyawan secara otomatis berdasarkan kriteria berikut:\n\n1. **Status Kelulusan (D2)**: Calon lulus jika Nilai Tes Teknis (B2) >= 70 DAN Nilai Wawancara (C2) >= 75.\n   *Syntax*: `=IF(AND(B2>=70,C2>=75),\"Lulus\",\"Gagal\")`\n2. **Rekomendasi Penempatan (E2)**: Calon mendapat rekomendasi jika Nilai Tes Teknis (B2) >= 90 ATAU Nilai Wawancara (C2) >= 90.\n   *Syntax*: `=IF(OR(B2>=90,C2>=90),\"Rekomendasi\",\"Biasa\")`\n3. **Cek Sandi (F2)**: Pastikan kode verifikasi Sandi 1 (A2) dan Sandi 2 (B2) dari sistem sama persis.\n   *Syntax*: `=EXACT(A2,B2)`",
        instructions: "Isi sel bertanda tanya (D2, E2, F2) dengan rumus logika yang sesuai berdasarkan kriteria di atas.",
        headers: ["", "Sandi 1 / Teknis", "Sandi 2 / Wawancara", "Lulus?", "Rekomendasi?", "Sandi Cocok?"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Sandi 1 / Teknis", header: true }, { value: "Sandi 2 / Wawancara", header: true }, { value: "Lulus?", header: true }, { value: "Rekomendasi?", header: true }, { value: "Sandi Cocok?", header: true }] },
          { rowNum: 2, cells: [{ value: 85 }, { value: 70 }, { value: "?", highlight: true }, { value: "?", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          {
            label: "Lulus? (AND)",
            resultCell: { row: 1, col: 2 },
            validFormulas: [
              "=IF(AND(B2>=70,C2>=75),\"Lulus\",\"Gagal\")",
              "=IF(AND(B2>=70, C2>=75), \"Lulus\", \"Gagal\")",
              "=IF(AND(B2>=70;C2>=75);\"Lulus\";\"Gagal\")",
              "=IF(AND(B2>=70; C2>=75); \"Lulus\"; \"Gagal\")"
            ],
            expectedResult: "Gagal",
            hint: "Syarat: B2 >= 70 DAN C2 >= 75. Gunakan =IF(AND(B2>=70,C2>=75),\"Lulus\",\"Gagal\")"
          },
          {
            label: "Rekomendasi? (OR)",
            resultCell: { row: 1, col: 3 },
            validFormulas: [
              "=IF(OR(B2>=90,C2>=90),\"Rekomendasi\",\"Biasa\")",
              "=IF(OR(B2>=90, C2>=90), \"Rekomendasi\", \"Biasa\")",
              "=IF(OR(B2>=90;C2>=90);\"Rekomendasi\";\"Biasa\")",
              "=IF(OR(B2>=90; C2>=90); \"Rekomendasi\"; \"Biasa\")"
            ],
            expectedResult: "Biasa",
            hint: "Syarat: B2 >= 90 ATAU C2 >= 90: =IF(OR(B2>=90,C2>=90),\"Rekomendasi\",\"Biasa\")"
          },
          {
            label: "Sandi Cocok? (EXACT)",
            resultCell: { row: 1, col: 4 },
            validFormulas: ["=EXACT(A2,B2)", "=EXACT(A2, B2)", "=EXACT(A2;B2)"],
            expectedResult: "FALSE",
            hint: "Periksa apakah teks Sandi 1 (A2) dan Sandi 2 (B2) sama persis: =EXACT(A2, B2)"
          }
        ]
      }
    ]
  },
  {
    id: "statistik-data",
    title: "RUMUS UNTUK MENGOLAH DATA STATISTIK",
    description: "Fungsi matematika dan statistik harian seperti pemeringkatan, modus, absolut, hingga angka Romawi.",
    steps: [
      {
        id: "rank",
        title: "Rank (mencari peringkat)",
        shortDescription: "Mencari peringkat urutan suatu nilai di dalam sekelompok angka.",
        conceptExplanation: "Fungsi `RANK` mengembalikan posisi peringkat suatu angka dibanding angka-angka lain di rentang data yang sama.\nSyntax: `=RANK(angka_yang_dinilai, rentang_pembanding)`",
        instructions: "Cari peringkat nilai siswa di sel **B2** dibanding teman-temannya di rentang **B2:B5**. Tulis rumusnya di sel **C2**.",
        headers: ["", "Nama", "Nilai", "Peringkat"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama", header: true }, { value: "Nilai", header: true }, { value: "Peringkat", header: true }] },
          { rowNum: 2, cells: [{ value: "Rian" }, { value: 85, highlight: true }, { value: "?", highlight: true }] },
          { rowNum: 3, cells: [{ value: "Budi" }, { value: 95, highlight: true }] },
          { rowNum: 4, cells: [{ value: "Siti" }, { value: 78, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Aulia" }, { value: 90, highlight: true }] }
        ],
        validFormulas: ["=RANK(B2,B2:B5)", "=RANK(B2, B2:B5)", "=RANK(B2;B2:B5)"],
        expectedResult: "3",
        resultCell: { row: 1, col: 2 },
        hint: "Ketik: =RANK(B2, B2:B5)"
      },
      {
        id: "abs",
        title: "Abs (menghasilkan nilai absolut)",
        shortDescription: "Mengubah angka negatif menjadi angka positif mutlak.",
        conceptExplanation: "Fungsi `ABS` (Absolute) menghilangkan tanda minus (-) pada angka, mengembalikannya menjadi nilai positif mutlak.\nSyntax: `=ABS(angka)`",
        instructions: "Ubah selisih pengeluaran negatif di sel **A2** menjadi nilai absolut di sel **B2**.",
        headers: ["", "Selisih Asli", "Hasil Absolut"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Selisih Asli", header: true }, { value: "Hasil Absolut", header: true }] },
          { rowNum: 2, cells: [{ value: -250, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=ABS(A2)", "=abs(a2)"],
        expectedResult: "250",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =ABS(A2)"
      },
      {
        id: "rand",
        title: "Rand (menghasilkan nilai random antara 0-1)",
        shortDescription: "Menghasilkan angka acak desimal di antara 0 hingga 1.",
        conceptExplanation: "Fungsi `RAND` digunakan untuk membuat bilangan acak pecahan di bawah 1. Rumus ini tidak membutuhkan argumen apa pun.\nSyntax: `=RAND()`",
        instructions: "Masukkan angka acak desimal di sel **A2** menggunakan fungsi `RAND`.",
        headers: ["", "Nilai Acak"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nilai Acak", header: true }] },
          { rowNum: 2, cells: [{ value: "?", highlight: true }] }
        ],
        validFormulas: ["=RAND()", "=rand()"],
        expectedResult: "0.4578",
        resultCell: { row: 1, col: 0 },
        hint: "Ketik: =RAND()"
      },
      {
        id: "randbetween",
        title: "Randbetween (menghasilkan nilai random antara batas bawah dan atas)",
        shortDescription: "Menghasilkan angka acak bulat di antara batas bawah dan atas pilihan kita.",
        conceptExplanation: "Fungsi `RANDBETWEEN` menghasilkan angka bulat acak di antara rentang angka yang kamu tentukan.\nSyntax: `=RANDBETWEEN(batas_bawah, batas_atas)`",
        instructions: "Buat angka acak bulat di sel **A2** di antara **1** sampai **100**.",
        headers: ["", "Nomor Undian"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nomor Undian", header: true }] },
          { rowNum: 2, cells: [{ value: "?", highlight: true }] }
        ],
        validFormulas: ["=RANDBETWEEN(1,100)", "=RANDBETWEEN(1, 100)", "=RANDBETWEEN(1;100)"],
        expectedResult: "73",
        resultCell: { row: 1, col: 0 },
        hint: "Ketik: =RANDBETWEEN(1, 100)"
      },
      {
        id: "mode",
        title: "Mode (mencari nilai modus yang paling sering keluar)",
        shortDescription: "Mencari angka yang paling sering muncul (frekuensi tertinggi) dalam data.",
        conceptExplanation: "Fungsi `MODE` mencari nilai angka yang memiliki frekuensi kemunculan paling tinggi atau paling sering keluar dalam kumpulan data.\nSyntax: `=MODE(SelAwal:SelAkhir)`",
        instructions: "Cari nilai angka ujian yang paling sering didapatkan siswa (rentang **B2:B6**). Tulis di sel **B7**.",
        headers: ["", "Nama", "Nilai"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama", header: true }, { value: "Nilai", header: true }] },
          { rowNum: 2, cells: [{ value: "Rian" }, { value: 80, highlight: true }] },
          { rowNum: 3, cells: [{ value: "Budi" }, { value: 85, highlight: true }] },
          { rowNum: 4, cells: [{ value: "Siti" }, { value: 80, highlight: true }] },
          { rowNum: 5, cells: [{ value: "Dewi" }, { value: 90, highlight: true }] },
          { rowNum: 6, cells: [{ value: "Eko" }, { value: 80, highlight: true }] },
          { rowNum: 7, cells: [{ value: "Nilai Modus" }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=MODE(B2:B6)", "=mode(b2:b6)"],
        expectedResult: "80",
        resultCell: { row: 6, col: 1 },
        hint: "Ketik: =MODE(B2:B6)"
      },
      {
        id: "roman",
        title: "Roman (mengubah angka biasa menjadi angka romawi)",
        shortDescription: "Mengonversi angka numerik biasa menjadi huruf format Romawi.",
        conceptExplanation: "Fungsi `ROMAN` mengubah angka biasa (Arab) menjadi karakter tulisan Romawi.\nSyntax: `=ROMAN(angka)`",
        instructions: "Ubah angka tahun ajaran di sel **A2** menjadi angka Romawi di sel **B2**.",
        headers: ["", "Angka Biasa", "Angka Romawi"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Angka Biasa", header: true }, { value: "Angka Romawi", header: true }] },
          { rowNum: 2, cells: [{ value: 14, highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=ROMAN(A2)", "=roman(a2)"],
        expectedResult: "XIV",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =ROMAN(A2)"
      },
      {
        id: "arabic",
        title: "Arabic (mengubah angka romawi menjadi angka biasa)",
        shortDescription: "Mengonversi huruf Romawi menjadi angka numerik biasa.",
        conceptExplanation: "Fungsi `ARABIC` mengubah karakter angka Romawi menjadi bilangan numerik biasa. Kebalikan dari fungsi ROMAN.\nSyntax: `=ARABIC(teks_romawi)`",
        instructions: "Ubah teks angka Romawi di sel **A2** menjadi angka biasa di sel **B2**.",
        headers: ["", "Teks Romawi", "Hasil Angka"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Teks Romawi", header: true }, { value: "Hasil Angka", header: true }] },
          { rowNum: 2, cells: [{ value: "XVIII", highlight: true }, { value: "?", highlight: true }] }
        ],
        validFormulas: ["=ARABIC(A2)", "=arabic(a2)"],
        expectedResult: "18",
        resultCell: { row: 1, col: 1 },
        hint: "Ketik: =ARABIC(A2)"
      },
      {
        id: "studi-kasus-statistik",
        title: "Studi Kasus: Analisis Statistik Nilai Ujian Sekolah",
        shortDescription: "Tantangan mandiri: hitung rata-rata, median, peringkat, dan nilai tengah kelas menggunakan rumus statistik.",
        conceptExplanation: "Sebagai guru kelas, Anda ingin menganalisis rekapitulasi nilai ujian matematika siswa menggunakan rumus statistik dasar:\n\n1. **Peringkat Siswa pertama (C2)**: Cari peringkat nilai siswa pertama (B2) dibanding seluruh siswa di kelas (B2:B5).\n   *Syntax*: `=RANK(B2,$B$2:$B$5)` atau `=RANK(B2,B2:B5)`\n2. **Nilai Tengah / Median (B6)**: Cari nilai tengah (median) dari seluruh nilai siswa (B2:B5).\n   *Syntax*: `=MEDIAN(B2:B5)`\n3. **Ubah ke Romawi (D2)**: Konversi nilai peringkat siswa pertama (C2) menjadi angka Romawi.\n   *Syntax*: `=ROMAN(C2)`",
        instructions: "Isi sel bertanda tanya (C2, B6, D2) dengan rumus statistik yang sesuai berdasarkan kriteria di atas.",
        headers: ["", "Nama Siswa / Statistik", "Nilai / Hasil", "Peringkat", "Peringkat Romawi"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Nama Siswa / Statistik", header: true }, { value: "Nilai / Hasil", header: true }, { value: "Peringkat", header: true }, { value: "Peringkat Romawi", header: true }] },
          { rowNum: 2, cells: [{ value: "Andi" }, { value: 90 }, { value: "?", highlight: true }, { value: "?", highlight: true }] },
          { rowNum: 3, cells: [{ value: "Budi" }, { value: 75 }, { value: "" }, { value: "" }] },
          { rowNum: 4, cells: [{ value: "Cici" }, { value: 85 }, { value: "" }, { value: "" }] },
          { rowNum: 5, cells: [{ value: "Dedi" }, { value: 80 }, { value: "" }, { value: "" }] },
          { rowNum: 6, cells: [{ value: "Median Nilai Kelas" }, { value: "?", highlight: true }, { value: "" }, { value: "" }] }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          {
            label: "Peringkat Andi (RANK)",
            resultCell: { row: 1, col: 2 },
            validFormulas: [
              "=RANK(B2,$B$2:$B$5)",
              "=RANK(B2,B2:B5)",
              "=RANK(B2;$B$2:$B$5)",
              "=RANK(B2;B2:B5)"
            ],
            expectedResult: "1",
            hint: "Bandingkan B2 dengan rentang B2:B5: =RANK(B2,$B$2:$B$5)"
          },
          {
            label: "Median Kelas (MEDIAN)",
            resultCell: { row: 5, col: 1 },
            validFormulas: ["=MEDIAN(B2:B5)", "=MEDIAN(B2;B5)"],
            expectedResult: "82.5",
            hint: "Cari nilai tengah dari B2:B5: =MEDIAN(B2:B5)"
          },
          {
            label: "Peringkat Romawi Andi (ROMAN)",
            resultCell: { row: 1, col: 3 },
            validFormulas: ["=ROMAN(C2)", "=roman(c2)"],
            expectedResult: "I",
            hint: "Ubah nilai peringkat C2 ke format Romawi: =ROMAN(C2)"
          }
        ]
      }
    ]
  },
  {
    id: "bonus-rumus",
    title: "BONUS RUMUS",
    description: "Mempelajari XLOOKUP, fungsi pencarian data modern yang jauh lebih fleksibel dari VLOOKUP.",
    steps: [
      {
        id: "xlookup",
        title: "Xlookup (mencari data - jauh lebih baik dibanding VLOOKUP)",
        shortDescription: "Fungsi pencarian modern yang menggabungkan kelebihan VLOOKUP, HLOOKUP, dan INDEX MATCH.",
        conceptExplanation: "Fungsi `XLOOKUP` dirilis di Excel versi baru untuk menggantikan VLOOKUP. Kelebihannya:\n- Bisa mencari data ke kiri.\n- Tidak membutuhkan urutan nomor indeks kolom.\n- Aman dari kesalahan penyisipan kolom baru di masa depan.\n- Otomatis melakukan pencarian persis (tanpa perlu mengetik FALSE).\n\nRumus ini membutuhkan tiga parameter wajib:\n1. **Kunci Pencarian**: Apa yang dicari (sel `E2`).\n2. **Kolom Pencarian**: Di kolom mana kuncinya berada (`A2:A5`).\n3. **Kolom Hasil**: Kolom mana yang ingin ditarik nilainya (`C2:C5`).\nSyntax: `=XLOOKUP(lookup_value, lookup_array, return_array)`",
        instructions: "Cari harga produk **Tablet** di sel **F2** menggunakan fungsi `XLOOKUP`. Cari kunci produk di sel **E2** pada kolom pencarian produk **A2:A5**, lalu tarik harganya dari kolom hasil harga **C2:C5**.",
        headers: ["", "A", "B", "C", "D", "E", "F"],
        dummyData: [
          { rowNum: 1, cells: [{ value: "Produk", header: true }, { value: "Kategori", header: true }, { value: "Harga", header: true }, { value: "" }, { value: "Cari Produk", header: true }, { value: "Hasil Harga", header: true }] },
          { rowNum: 2, cells: [{ value: "Laptop" }, { value: "Tech" }, { value: 999 }, { value: "" }, { value: "Tablet" }, { value: "?", highlight: true }] },
          { rowNum: 3, cells: [{ value: "Ponsel" }, { value: "Tech" }, { value: 699 }, { value: "" }, { value: "" }, { value: "" }] },
          { rowNum: 4, cells: [{ value: "Tablet", highlight: true }, { value: "Tech" }, { value: 399, highlight: true }, { value: "" }, { value: "" }, { value: "" }] },
          { rowNum: 5, cells: [{ value: "Aksesoris" }, { value: "Office" }, { value: 45 }, { value: "" }, { value: "" }, { value: "" }] }
        ],
        validFormulas: ["=XLOOKUP(E2,A2:A5,C2:C5)", "=XLOOKUP(E2, A2:A5, C2:C5)", "=XLOOKUP(E2;A2:A5;C2:C5)"],
        expectedResult: "$399.00",
        resultCell: { row: 1, col: 5 },
        hint: "Ketik: =XLOOKUP(E2, A2:A5, C2:C5)"
      }
    ]
  },
  {
    id: "studi-kasus-akbar",
    title: "STUDI KASUS AKBAR: INTEGRASI RUMUS",
    description: "Ujian integrasi akhir: gabungkan rumus pembersihan teks, logika, pencarian VLOOKUP/HLOOKUP, dan kalkulasi bersyarat dalam satu laporan penggajian terpadu.",
    steps: [
      {
        id: "final-mega-case",
        title: "Laporan Gaji & Evaluasi Terintegrasi",
        shortDescription: "Selesaikan lembar kerja penggajian karyawan bulanan yang memerlukan pembersihan teks, VLOOKUP, HLOOKUP, SUM, Nested IF, dan COUNTIF.",
        conceptExplanation: "Sebagai Manajer HR & Payroll, Anda menerima draf laporan yang berantakan. Anda harus menyelesaikan laporan ini dengan menggunakan kombinasi berbagai rumus:\n\n1. **Nama Bersih (Kolom D)**: Gabungkan `PROPER` dan `TRIM` untuk membersihkan spasi berlebih dan merapikan huruf kapital.\n   *Syntax*: `=PROPER(TRIM(B2))`\n2. **Kode Dept (Kolom E)**: Ambil kode departemen (3 karakter tengah) dari ID Karyawan.\n   *Syntax*: `=MID(A2,5,3)`\n3. **Gaji Pokok (Kolom F)**: Gunakan fungsi **`VLOOKUP`** untuk mencari Gaji Pokok berdasarkan Golongan karyawan dari **Tabel Ref Golongan (A7:B8)**.\n   *Syntax*: `=VLOOKUP(C2,$A$7:$B$8,2,0)` atau `=VLOOKUP(C2,A7:B8,2,0)`\n4. **Tunjangan Jabatan (Kolom G)**: Gunakan fungsi **`HLOOKUP`** untuk mencari Tunjangan berdasarkan Kode Dept dari **Tabel Ref Departemen (A10:D11)**.\n   *Syntax*: `=HLOOKUP(E2,$A$10:$D$11,2,0)` atau `=HLOOKUP(E2,A10:D11,2,0)`\n5. **Total Gaji (Kolom H)**: Jumlahkan Gaji Pokok and Tunjangan Status.\n   *Syntax*: `=SUM(F2,G2)` atau `=F2+G2`\n6. **Status Gaji (Kolom I)**: Evaluasi status tingkat gaji dengan **Nested IF** berdasarkan Total Gaji (Kolom H). Jika Total Gaji >= 7500 maka \"Tinggi\", jika >= 5500 maka \"Sedang\", dan jika kurang dari 5500 maka \"Rendah\".\n   *Syntax*: `=IF(H2>=7500,\"Tinggi\",IF(H2>=5500,\"Sedang\",\"Rendah\"))` atau `=IF(H2>=7500;\"Tinggi\";IF(H2>=5500;\"Sedang\";\"Rendah\"))`\n7. **Total Pengeluaran Gaji (H12)**: Hitung total pengeluaran seluruh gaji karyawan menggunakan `SUM`.\n   *Syntax*: `=SUM(H2:H4)`\n8. **Jumlah Karyawan Golongan I (H13)**: Hitung jumlah karyawan dengan Golongan \"I\" menggunakan `COUNTIF`.\n   *Syntax*: `=COUNTIF(C2:C4,\"I\")`",
        instructions: "Lengkapi tabel Laporan Gaji di sebelah kanan. Selesaikan 20 sel bertanda tanya (`?`) menggunakan rumus yang telah dipelajari. Gunakan Tabel Referensi di bagian bawah sebagai acuan lookup Anda!",
        headers: ["", "ID Karyawan", "Nama Kotor", "Golongan", "Nama Bersih", "Dept Code", "Gaji Pokok", "Tunjangan", "Total Gaji", "Status Gaji"],
        dummyData: [
          {
            rowNum: 1,
            cells: [
              { value: "ID Karyawan", header: true, borderTop: true, borderLeft: true, borderBottom: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" },
              { value: "Nama Kotor", header: true, borderTop: true, borderBottom: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" },
              { value: "Golongan", header: true, borderTop: true, borderBottom: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" },
              { value: "Nama Bersih", header: true, borderTop: true, borderBottom: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" },
              { value: "Dept Code", header: true, borderTop: true, borderBottom: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" },
              { value: "Gaji Pokok", header: true, borderTop: true, borderBottom: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" },
              { value: "Tunjangan", header: true, borderTop: true, borderBottom: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" },
              { value: "Total Gaji", header: true, borderTop: true, borderBottom: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" },
              { value: "Status Gaji", header: true, borderTop: true, borderRight: true, borderBottom: true, bgColor: "bg-blue-50 dark:bg-blue-950/40" }
            ]
          },
          {
            rowNum: 2,
            cells: [
              { value: "EMP-ADM-01", borderLeft: true },
              { value: "  rudi WIDODO " },
              { value: "I" },
              { value: "?", highlight: true },
              { value: "?", highlight: true },
              { value: "?", highlight: true },
              { value: "?", highlight: true },
              { value: "?", highlight: true },
              { value: "?", highlight: true, borderRight: true }
            ]
          },
          {
            rowNum: 3,
            cells: [
              { value: "EMP-DEV-02", borderLeft: true },
              { value: " dewi LESTARI  " },
              { value: "II" },
              { value: "?", highlight: true },
              { value: "?", highlight: true },
              { value: "?", highlight: true },
              { value: "?", highlight: true },
              { value: "?", highlight: true },
              { value: "?", highlight: true, borderRight: true }
            ]
          },
          {
            rowNum: 4,
            cells: [
              { value: "EMP-FIN-03", borderLeft: true, borderBottom: true },
              { value: " andi WIRAWAN ", borderBottom: true },
              { value: "I", borderBottom: true },
              { value: "?", highlight: true, borderBottom: true },
              { value: "?", highlight: true, borderBottom: true },
              { value: "?", highlight: true, borderBottom: true },
              { value: "?", highlight: true, borderBottom: true },
              { value: "?", highlight: true, borderBottom: true },
              { value: "?", highlight: true, borderRight: true, borderBottom: true }
            ]
          },
          {
            rowNum: 5,
            cells: [
              { value: "REFERENSI GOLONGAN (VLOOKUP)", className: "font-bold text-slate-700 dark:text-slate-200 text-xs overflow-visible whitespace-nowrap z-10 px-4", borderTop: true, borderLeft: true, borderBottom: true, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderRight: true, borderBottom: true, borderLeft: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" }
            ]
          },
          {
            rowNum: 6,
            cells: [
              { value: "Golongan", header: true, borderTop: true, borderLeft: true, borderBottom: true, bgColor: "bg-sky-50 dark:bg-sky-950/40" },
              { value: "Gaji Pokok", header: true, borderTop: true, borderRight: true, borderBottom: true, bgColor: "bg-sky-50 dark:bg-sky-950/40" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" }
            ]
          },
          {
            rowNum: 7,
            cells: [
              { value: "I", borderLeft: true, bgColor: "bg-sky-50/10 dark:bg-sky-950/10" },
              { value: 5000, borderRight: true, bgColor: "bg-sky-50/10 dark:bg-sky-950/10" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" }
            ]
          },
          {
            rowNum: 8,
            cells: [
              { value: "II", borderLeft: true, borderBottom: true, bgColor: "bg-sky-50/10 dark:bg-sky-950/10" },
              { value: 7000, borderRight: true, borderBottom: true, bgColor: "bg-sky-50/10 dark:bg-sky-950/10" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" }
            ]
          },
          {
            rowNum: 9,
            cells: [
              { value: "REFERENSI TUNJANGAN DEPT (HLOOKUP)", className: "font-bold text-slate-700 dark:text-slate-200 text-xs overflow-visible whitespace-nowrap z-10 px-4", borderTop: true, borderLeft: true, borderBottom: true, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderBottom: true, borderLeft: false, borderRight: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" },
              { value: "", borderTop: true, borderRight: true, borderBottom: true, borderLeft: false, bgColor: "bg-slate-100 dark:bg-slate-800/80" }
            ]
          },
          {
            rowNum: 10,
            cells: [
              { value: "Dept Code", header: true, borderTop: true, borderLeft: true, borderBottom: true, bgColor: "bg-sky-50 dark:bg-sky-950/40" },
              { value: "ADM", header: true, borderTop: true, borderBottom: true, bgColor: "bg-sky-50 dark:bg-sky-950/40" },
              { value: "DEV", header: true, borderTop: true, borderBottom: true, bgColor: "bg-sky-50 dark:bg-sky-950/40" },
              { value: "FIN", header: true, borderTop: true, borderRight: true, borderBottom: true, bgColor: "bg-sky-50 dark:bg-sky-950/40" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" }
            ]
          },
          {
            rowNum: 11,
            cells: [
              { value: "Tunjangan", borderLeft: true, borderBottom: true, bgColor: "bg-sky-50/10 dark:bg-sky-950/10" },
              { value: 600, borderBottom: true, bgColor: "bg-sky-50/10 dark:bg-sky-950/10" },
              { value: 1000, borderBottom: true, bgColor: "bg-sky-50/10 dark:bg-sky-950/10" },
              { value: 800, borderRight: true, borderBottom: true, bgColor: "bg-sky-50/10 dark:bg-sky-950/10" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" }
            ]
          },
          {
            rowNum: 12,
            cells: [
              { value: "Total Pengeluaran Gaji", borderLeft: true, borderTop: true, borderBottom: true, className: "font-semibold text-xs", bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderTop: true, borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderTop: true, borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderTop: true, borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderTop: true, borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderTop: true, borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderTop: true, borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "?", highlight: true, borderTop: true, borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderRight: true, borderTop: true, borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" }
            ]
          },
          {
            rowNum: 13,
            cells: [
              { value: "Jumlah Karyawan Golongan I", borderLeft: true, borderBottom: true, className: "font-semibold text-xs", bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "?", highlight: true, borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" },
              { value: "", borderRight: true, borderBottom: true, bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10" }
            ]
          }
        ],
        validFormulas: [],
        expectedResult: "",
        resultCell: { row: 0, col: 0 },
        hint: "",
        tasks: [
          // Row 2 (Rudi Widodo)
          { label: "Nama Bersih Rudi", resultCell: { row: 1, col: 3 }, validFormulas: ["=PROPER(TRIM(B2))"], expectedResult: "Rudi Widodo", hint: "Bersihkan spasi & kapitalisasi B2: =PROPER(TRIM(B2))" },
          { label: "Kode Dept Rudi", resultCell: { row: 1, col: 4 }, validFormulas: ["=MID(A2,5,3)"], expectedResult: "ADM", hint: "Ambil 3 karakter mulai posisi ke-5 dari A2: =MID(A2,5,3)" },
          { label: "Gaji Pokok Rudi (VLOOKUP)", resultCell: { row: 1, col: 5 }, validFormulas: ["=VLOOKUP(C2,$A$7:$B$8,2,0)", "=VLOOKUP(C2,$A$7:$B$8,2,FALSE)", "=VLOOKUP(C2,A7:B8,2,0)", "=VLOOKUP(C2,A7:B8,2,FALSE)"], expectedResult: "5,000", hint: "Cari Golongan (C2) pada Tabel Ref Golongan (A7:B8): =VLOOKUP(C2,$A$7:$B$8,2,0)" },
          { label: "Tunjangan Rudi (HLOOKUP)", resultCell: { row: 1, col: 6 }, validFormulas: ["=HLOOKUP(E2,$A$10:$D$11,2,0)", "=HLOOKUP(E2,$A$10:$D$11,2,FALSE)", "=HLOOKUP(E2,A10:D11,2,0)", "=HLOOKUP(E2,A10:D11,2,FALSE)"], expectedResult: "600", hint: "Cari Kode Dept (E2) pada Tabel Ref Tunjangan (A10:D11): =HLOOKUP(E2,$A$10:$D$11,2,0)" },
          { label: "Total Gaji Rudi", resultCell: { row: 1, col: 7 }, validFormulas: ["=SUM(F2,G2)", "=F2+G2", "=SUM(F2;G2)"], expectedResult: "5,600", hint: "Jumlahkan Gaji Pokok (F2) + Tunjangan (G2): =SUM(F2,G2)" },
          { label: "Status Gaji Rudi", resultCell: { row: 1, col: 8 }, validFormulas: ["=IF(H2>=7500,\"Tinggi\",IF(H2>=5500,\"Sedang\",\"Rendah\"))", "=IF(H2>=7500, \"Tinggi\", IF(H2>=5500, \"Sedang\", \"Rendah\"))", "=IF(H2>=7500;\"Tinggi\";IF(H2>=5500;\"Sedang\";\"Rendah\"))", "=IF(H2>=7500; \"Tinggi\"; IF(H2>=5500; \"Sedang\"; \"Rendah\"))"], expectedResult: "Sedang", hint: "Evaluasi status gaji Rudi (H2) dengan Nested IF (>=7500 \"Tinggi\", >=5500 \"Sedang\", <5500 \"Rendah\"): =IF(H2>=7500,\"Tinggi\",IF(H2>=5500,\"Sedang\",\"Rendah\"))" },
          
          // Row 3 (Dewi Lestari)
          { label: "Nama Bersih Dewi", resultCell: { row: 2, col: 3 }, validFormulas: ["=PROPER(TRIM(B3))"], expectedResult: "Dewi Lestari", hint: "Bersihkan spasi & kapitalisasi B3: =PROPER(TRIM(B3))" },
          { label: "Kode Dept Dewi", resultCell: { row: 2, col: 4 }, validFormulas: ["=MID(A3,5,3)"], expectedResult: "DEV", hint: "Ambil 3 karakter mulai posisi ke-5 dari A3: =MID(A3,5,3)" },
          { label: "Gaji Pokok Dewi (VLOOKUP)", resultCell: { row: 2, col: 5 }, validFormulas: ["=VLOOKUP(C3,$A$7:$B$8,2,0)", "=VLOOKUP(C3,$A$7:$B$8,2,FALSE)", "=VLOOKUP(C3,A7:B8,2,0)", "=VLOOKUP(C3,A7:B8,2,FALSE)"], expectedResult: "7,000", hint: "Cari Golongan (C3) pada Tabel Ref Golongan (A7:B8): =VLOOKUP(C3,$A$7:$B$8,2,0)" },
          { label: "Tunjangan Dewi (HLOOKUP)", resultCell: { row: 2, col: 6 }, validFormulas: ["=HLOOKUP(E3,$A$10:$D$11,2,0)", "=HLOOKUP(E3,$A$10:$D$11,2,FALSE)", "=HLOOKUP(E3,A10:D11,2,0)", "=HLOOKUP(E3,A10:D11,2,FALSE)"], expectedResult: "1,000", hint: "Cari Kode Dept (E3) pada Tabel Ref Tunjangan (A10:D11): =HLOOKUP(E3,$A$10:$D$11,2,0)" },
          { label: "Total Gaji Dewi", resultCell: { row: 2, col: 7 }, validFormulas: ["=SUM(F3,G3)", "=F3+G3", "=SUM(F3;G3)"], expectedResult: "8,000", hint: "Jumlahkan Gaji Pokok (F3) + Tunjangan (G3): =SUM(F3,G3)" },
          { label: "Status Gaji Dewi", resultCell: { row: 2, col: 8 }, validFormulas: ["=IF(H3>=7500,\"Tinggi\",IF(H3>=5500,\"Sedang\",\"Rendah\"))", "=IF(H3>=7500, \"Tinggi\", IF(H3>=5500, \"Sedang\", \"Rendah\"))", "=IF(H3>=7500;\"Tinggi\";IF(H3>=5500;\"Sedang\";\"Rendah\"))", "=IF(H3>=7500; \"Tinggi\"; IF(H3>=5500; \"Sedang\"; \"Rendah\"))"], expectedResult: "Tinggi", hint: "Evaluasi status gaji Dewi (H3) dengan Nested IF (>=7500 \"Tinggi\", >=5500 \"Sedang\", <5500 \"Rendah\"): =IF(H3>=7500,\"Tinggi\",IF(H3>=5500,\"Sedang\",\"Rendah\"))" },

          // Row 4 (Andi Wirawan)
          { label: "Nama Bersih Andi", resultCell: { row: 3, col: 3 }, validFormulas: ["=PROPER(TRIM(B4))"], expectedResult: "Andi Wirawan", hint: "Bersihkan spasi & kapitalisasi B4: =PROPER(TRIM(B4))" },
          { label: "Kode Dept Andi", resultCell: { row: 3, col: 4 }, validFormulas: ["=MID(A4,5,3)"], expectedResult: "FIN", hint: "Ambil 3 karakter mulai posisi ke-5 dari A4: =MID(A4,5,3)" },
          { label: "Gaji Pokok Andi (VLOOKUP)", resultCell: { row: 3, col: 5 }, validFormulas: ["=VLOOKUP(C4,$A$7:$B$8,2,0)", "=VLOOKUP(C4,$A$7:$B$8,2,FALSE)", "=VLOOKUP(C4,A7:B8,2,0)", "=VLOOKUP(C4,A7:B8,2,FALSE)"], expectedResult: "5,000", hint: "Cari Golongan (C4) pada Tabel Ref Golongan (A7:B8): =VLOOKUP(C4,$A$7:$B$8,2,0)" },
          { label: "Tunjangan Andi (HLOOKUP)", resultCell: { row: 3, col: 6 }, validFormulas: ["=HLOOKUP(E4,$A$10:$D$11,2,0)", "=HLOOKUP(E4,$A$10:$D$11,2,FALSE)", "=HLOOKUP(E4,A10:D11,2,0)", "=HLOOKUP(E4,A10:D11,2,FALSE)"], expectedResult: "800", hint: "Cari Kode Dept (E4) pada Tabel Ref Tunjangan (A10:D11): =HLOOKUP(E4,$A$10:$D$11,2,0)" },
          { label: "Total Gaji Andi", resultCell: { row: 3, col: 7 }, validFormulas: ["=SUM(F4,G4)", "=F4+G4", "=SUM(F4;G4)"], expectedResult: "5,800", hint: "Jumlahkan Gaji Pokok (F4) + Tunjangan (G4): =SUM(F4,G4)" },
          { label: "Status Gaji Andi", resultCell: { row: 3, col: 8 }, validFormulas: ["=IF(H4>=7500,\"Tinggi\",IF(H4>=5500,\"Sedang\",\"Rendah\"))", "=IF(H4>=7500, \"Tinggi\", IF(H4>=5500, \"Sedang\", \"Rendah\"))", "=IF(H4>=7500;\"Tinggi\";IF(H4>=5500;\"Sedang\";\"Rendah\"))", "=IF(H4>=7500; \"Tinggi\"; IF(H4>=5500; \"Sedang\"; \"Rendah\"))"], expectedResult: "Sedang", hint: "Evaluasi status gaji Andi (H4) dengan Nested IF (>=7500 \"Tinggi\", >=5500 \"Sedang\", <5500 \"Rendah\"): =IF(H4>=7500,\"Tinggi\",IF(H4>=5500,\"Sedang\",\"Rendah\"))" },

          // Summary Rows
          { label: "Total Pengeluaran Gaji (SUM)", resultCell: { row: 11, col: 7 }, validFormulas: ["=SUM(H2:H4)"], expectedResult: "19,400", hint: "Jumlahkan total pengeluaran gaji: =SUM(H2:H4)" },
          { label: "Jumlah Karyawan Golongan I (COUNTIF)", resultCell: { row: 12, col: 7 }, validFormulas: ["=COUNTIF(C2:C4,\"I\")", "=COUNTIF(C2:C4;\"I\")"], expectedResult: "2", hint: "Hitung Golongan (C2:C4) yang bernilai \"I\": =COUNTIF(C2:C4,\"I\")" }
        ]
      }
    ]
  }
];

export function normalizeFormula(formula: string): string {
  return formula
    .toUpperCase()
    .replace(/\s+/g, "") // remove all whitespace
    .replace(/;/g, ",") // convert European semicolons to commas
    .replace(/["']/g, '"') // normalize single quotes to double quotes
    .trim();
}

export function checkFormula(
  userInput: string,
  validFormulas: string[],
  expectedResult?: string,
  dummyData?: ExcelRow[],
  headers?: string[],
  taskAnswers?: string[],
  tasks?: CellTask[]
): boolean {
  // 1. Static match check
  const normalizedInput = normalizeFormula(userInput);
  const isStaticMatch = validFormulas.some(valid => normalizeFormula(valid) === normalizedInput);
  if (isStaticMatch) return true;

  // 2. Dynamic evaluation check
  if (expectedResult && dummyData && headers) {
    return checkFormulaDynamic(userInput, expectedResult, dummyData, headers, taskAnswers, tasks);
  }

  return false;
}

export function getCellValue(
  rowIdx: number,
  colIdx: number,
  dummyData: ExcelRow[],
  taskAnswers: string[] = [],
  tasks: CellTask[] = [],
  evalStack: string[] = []
): any {
  const cellId = `${rowIdx},${colIdx}`;
  if (evalStack.includes(cellId)) {
    return 0; // Prevent circular reference
  }

  if (tasks && tasks.length > 0) {
    const taskIdx = tasks.findIndex(t => t.resultCell.row === rowIdx && t.resultCell.col === colIdx);
    if (taskIdx !== -1) {
      const ans = taskAnswers[taskIdx] || "";
      if (ans) {
        const task = tasks[taskIdx];
        if (ans.startsWith("=")) {
          const nextStack = [...evalStack, cellId];
          const evaluated = evaluateExcelFormula(ans, dummyData, [], taskAnswers, tasks, nextStack);
          return parseNumericValue(evaluated);
        }
        return parseNumericValue(ans);
      }
      return 0;
    }
  }

  const cell = dummyData[rowIdx]?.cells[colIdx];
  if (!cell) return 0;
  return parseNumericValue(cell.value);
}

export function parseNumericValue(val: any): any {
  if (val === undefined || val === null || val === "?") return 0;
  if (typeof val === "number") return val;
  const str = String(val).trim();
  let cleaned = str.replace(/[Rp\s$]/gi, "");
  if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) {
    cleaned = cleaned.replace(/\./g, "");
  } else if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(cleaned)) {
    cleaned = cleaned.replace(/,/g, "");
  } else if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(cleaned)) {
    cleaned = cleaned.replace(/\./g, "").replace(/,/g, ".");
  }
  const num = parseFloat(cleaned);
  return isNaN(num) ? str : num;
}

export function evaluateExcelFormula(
  formula: string,
  dummyData: ExcelRow[],
  headers: string[],
  taskAnswers: string[] = [],
  tasks: CellTask[] = [],
  evalStack: string[] = []
): any {
  let expr = formula.trim();
  if (!expr.startsWith("=")) return parseNumericValue(expr);
  expr = expr.substring(1).trim();

  const resolveCell = (cellRef: string): any => {
    const match = cellRef.toUpperCase().match(/^([A-I])([1-9][0-9]*)$/);
    if (!match) return parseNumericValue(cellRef);
    const colLetter = match[1];
    const rowNum = parseInt(match[2]);
    const colIdx = colLetter.charCodeAt(0) - 65;
    const rowIdx = rowNum - 1;
    return getCellValue(rowIdx, colIdx, dummyData, taskAnswers, tasks, evalStack);
  };

  const resolveRange = (rangeStr: string): any[] => {
    const parts = rangeStr.split(":");
    if (parts.length !== 2) {
      return [resolveCell(rangeStr)];
    }
    const startMatch = parts[0].toUpperCase().match(/^([A-I])([1-9][0-9]*)$/);
    const endMatch = parts[1].toUpperCase().match(/^([A-I])([1-9][0-9]*)$/);
    if (!startMatch || !endMatch) {
      return [resolveCell(parts[0]), resolveCell(parts[1])];
    }
    
    const startCol = startMatch[1].charCodeAt(0) - 65;
    const startRow = parseInt(startMatch[2]) - 1;
    const endCol = endMatch[1].charCodeAt(0) - 65;
    const endRow = parseInt(endMatch[2]) - 1;
    
    const values: any[] = [];
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);
    
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        values.push(getCellValue(r, c, dummyData, taskAnswers, tasks, evalStack));
      }
    }
    return values;
  };

  const evalExpr = (expression: string): any => {
    expression = expression.trim();
    if (!expression) return "";

    if ((expression.startsWith('"') && expression.endsWith('"')) || 
        (expression.startsWith("'") && expression.endsWith("'"))) {
      return expression.substring(1, expression.length - 1);
    }

    if (/^-?\d+(\.\d+)?$/.test(expression)) {
      return parseFloat(expression);
    }

    if (expression.toUpperCase() === "TRUE") return true;
    if (expression.toUpperCase() === "FALSE") return false;

    const funcMatch = expression.match(/^([A-Z_]+)\s*\((.*)\)$/i);
    if (funcMatch) {
      const funcName = funcMatch[1].toUpperCase();
      const funcArgsRaw = funcMatch[2];

      const args: any[] = [];
      let currentArg = "";
      let parenCount = 0;
      let insideQuote = false;
      let quoteChar = "";

      for (let i = 0; i < funcArgsRaw.length; i++) {
        const char = funcArgsRaw[i];
        if ((char === '"' || char === "'") && (i === 0 || funcArgsRaw[i - 1] !== "\\")) {
          if (!insideQuote) {
            insideQuote = true;
            quoteChar = char;
          } else if (char === quoteChar) {
            insideQuote = false;
          }
        }

        if (!insideQuote) {
          if (char === "(") parenCount++;
          else if (char === ")") parenCount--;
        }

        if ((char === "," || char === ";") && parenCount === 0 && !insideQuote) {
          args.push(currentArg.trim());
          currentArg = "";
        } else {
          currentArg += char;
        }
      }
      if (currentArg.trim() !== "") {
        args.push(currentArg.trim());
      }

      const evaluatedArgs = args.map(arg => {
        if (arg.includes(":") && !arg.includes("(") && !arg.includes('"') && !arg.includes("'")) {
          return resolveRange(arg);
        }
        return evalExpr(arg);
      });

      switch (funcName) {
        case "SUM": {
          const flatValues = evaluatedArgs.flat(Infinity).map(v => typeof v === "number" ? v : parseFloat(v) || 0);
          return flatValues.reduce((sum, val) => sum + val, 0);
        }
        case "AVERAGE": {
          const flatValues = evaluatedArgs.flat(Infinity).map(v => typeof v === "number" ? v : parseFloat(v) || 0);
          return flatValues.length > 0 ? flatValues.reduce((sum, val) => sum + val, 0) / flatValues.length : 0;
        }
        case "MAX": {
          const flatValues = evaluatedArgs.flat(Infinity).map(v => typeof v === "number" ? v : parseFloat(v) || 0);
          return flatValues.length > 0 ? Math.max(...flatValues) : 0;
        }
        case "MIN": {
          const flatValues = evaluatedArgs.flat(Infinity).map(v => typeof v === "number" ? v : parseFloat(v) || 0);
          return flatValues.length > 0 ? Math.min(...flatValues) : 0;
        }
        case "COUNT": {
          const flatValues = evaluatedArgs.flat(Infinity).filter(v => typeof v === "number");
          return flatValues.length;
        }
        case "TRIM": {
          const val = String(evaluatedArgs[0] || "");
          return val.replace(/\s+/g, " ").trim();
        }
        case "PROPER": {
          const val = String(evaluatedArgs[0] || "").toLowerCase();
          return val.replace(/\b\w/g, c => c.toUpperCase());
        }
        case "LEFT": {
          const text = String(evaluatedArgs[0] || "");
          const num = evaluatedArgs[1] !== undefined ? parseInt(evaluatedArgs[1]) : 1;
          return text.substring(0, num);
        }
        case "RIGHT": {
          const text = String(evaluatedArgs[0] || "");
          const num = evaluatedArgs[1] !== undefined ? parseInt(evaluatedArgs[1]) : 1;
          return text.substring(text.length - num);
        }
        case "MID": {
          const text = String(evaluatedArgs[0] || "");
          const start = evaluatedArgs[1] !== undefined ? parseInt(evaluatedArgs[1]) - 1 : 0;
          const num = evaluatedArgs[2] !== undefined ? parseInt(evaluatedArgs[2]) : 0;
          return text.substring(start, start + num);
        }
        case "LEN": {
          return String(evaluatedArgs[0] || "").length;
        }
        case "CONCATENATE":
        case "CONCAT": {
          return evaluatedArgs.flat(Infinity).join("");
        }
        case "IF": {
          const condition = evaluatedArgs[0];
          const valTrue = evaluatedArgs[1] !== undefined ? evaluatedArgs[1] : true;
          const valFalse = evaluatedArgs[2] !== undefined ? evaluatedArgs[2] : false;
          return condition ? valTrue : valFalse;
        }
        case "AND": {
          return evaluatedArgs.every(Boolean);
        }
        case "OR": {
          return evaluatedArgs.some(Boolean);
        }
        case "VLOOKUP": {
          const lookupValue = evaluatedArgs[0];
          const tableArray = evaluatedArgs[1];
          const colIndex = parseInt(evaluatedArgs[2]) - 1;
          
          if (!Array.isArray(tableArray) || tableArray.length === 0) return "#N/A";
          
          const tableRangeArg = args[1].toUpperCase();
          const rangeParts = tableRangeArg.split(":");
          if (rangeParts.length !== 2) return "#N/A";
          const startCol = rangeParts[0].charCodeAt(0) - 65;
          const endCol = rangeParts[1].charCodeAt(0) - 65;
          const numCols = Math.abs(endCol - startCol) + 1;
          
          const rows: any[][] = [];
          for (let i = 0; i < tableArray.length; i += numCols) {
            rows.push(tableArray.slice(i, i + numCols));
          }

          const matchRow = rows.find(r => String(r[0]).toUpperCase() === String(lookupValue).toUpperCase());
          if (matchRow) {
            return matchRow[colIndex] !== undefined ? matchRow[colIndex] : "#N/A";
          }
          return "#N/A";
        }
        case "HLOOKUP": {
          const lookupValue = evaluatedArgs[0];
          const tableArray = evaluatedArgs[1];
          const rowIndex = parseInt(evaluatedArgs[2]) - 1;
          
          const tableRangeArg = args[1].toUpperCase();
          const rangeParts = tableRangeArg.split(":");
          if (rangeParts.length !== 2) return "#N/A";
          const startCol = rangeParts[0].charCodeAt(0) - 65;
          const endCol = rangeParts[1].charCodeAt(0) - 65;
          const numCols = Math.abs(endCol - startCol) + 1;
          
          const rows: any[][] = [];
          for (let i = 0; i < tableArray.length; i += numCols) {
            rows.push(tableArray.slice(i, i + numCols));
          }

          if (rows.length === 0) return "#N/A";
          const firstRow = rows[0];
          let matchedColIdx = -1;
          for (let c = 0; c < firstRow.length; c++) {
            if (String(firstRow[c]).toUpperCase() === String(lookupValue).toUpperCase()) {
              matchedColIdx = c;
              break;
            }
          }
          if (matchedColIdx !== -1) {
            return rows[rowIndex] && rows[rowIndex][matchedColIdx] !== undefined ? rows[rowIndex][matchedColIdx] : "#N/A";
          }
          return "#N/A";
        }
        default:
          return `#NAME?`;
      }
    }

    const ops = [">=", "<=", "<>", "=", ">", "<", "+", "-", "*", "/", "&"];
    for (let op of ops) {
      if (expression.includes(op)) {
        const parts = expression.split(op);
        if (parts.length === 2) {
          const left = evalExpr(parts[0]);
          const right = evalExpr(parts[1]);
          switch (op) {
            case ">=": return parseNumericValue(left) >= parseNumericValue(right);
            case "<=": return parseNumericValue(left) <= parseNumericValue(right);
            case "<>": return String(left).toUpperCase() !== String(right).toUpperCase();
            case "=": return String(left).toUpperCase() === String(right).toUpperCase();
            case ">": return parseNumericValue(left) > parseNumericValue(right);
            case "<": return parseNumericValue(left) < parseNumericValue(right);
            case "+": return parseNumericValue(left) + parseNumericValue(right);
            case "-": return parseNumericValue(left) - parseNumericValue(right);
            case "*": return parseNumericValue(left) * parseNumericValue(right);
            case "/": return parseNumericValue(left) / (parseNumericValue(right) || 1);
            case "&": return String(left) + String(right);
          }
        }
      }
    }

    return resolveCell(expression);
  };

  try {
    return evalExpr(expr);
  } catch (err) {
    return "#VALUE!";
  }
}

export function checkFormulaDynamic(
  userInput: string,
  expectedResult: string,
  dummyData: ExcelRow[],
  headers: string[],
  taskAnswers: string[] = [],
  tasks: CellTask[] = []
): boolean {
  if (!userInput.startsWith("=")) return false;

  const result = evaluateExcelFormula(userInput, dummyData, headers, taskAnswers, tasks);
  if (result === "#VALUE!" || result === "#NAME?" || result === "#N/A") {
    return false;
  }

  const normResult = normalizeResultValue(result);
  const normExpected = normalizeResultValue(expectedResult);
  
  return normResult === normExpected;
}

export function normalizeResultValue(val: any): string {
  if (val === undefined || val === null) return "";
  if (typeof val === "boolean") return String(val).toUpperCase();
  
  let str = String(val).trim().toUpperCase();
  let cleaned = str.replace(/[Rp\s$]/gi, "");
  
  if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) {
    cleaned = cleaned.replace(/\./g, "");
  } else if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(cleaned)) {
    cleaned = cleaned.replace(/,/g, "");
  } else if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(cleaned)) {
    cleaned = cleaned.replace(/\./g, "").replace(/,/g, ".");
  }
  
  const num = parseFloat(cleaned);
  if (!isNaN(num)) {
    return num.toFixed(2);
  }
  
  return cleaned;
}

export function isTaskLocked(
  task: CellTask,
  taskAnswers: string[],
  tasks: CellTask[],
  dummyData?: ExcelRow[],
  headers?: string[]
): boolean {
  const checkTaskCompleted = (labelSubstring: string): boolean => {
    return tasks.every((t, idx) => {
      if (t.label.includes(labelSubstring)) {
        const answer = taskAnswers[idx] || "";
        return checkFormula(
          answer,
          t.validFormulas,
          t.expectedResult,
          dummyData,
          headers,
          taskAnswers,
          tasks
        );
      }
      return true;
    });
  };

  // Tunjangan depends on Dept Code
  if (task.label.includes("Tunjangan")) {
    return !checkTaskCompleted("Kode Dept");
  }

  // Total Gaji depends on Gaji Pokok and Tunjangan
  if (task.label.includes("Total Gaji")) {
    return !checkTaskCompleted("Gaji Pokok") || !checkTaskCompleted("Tunjangan");
  }

  // Status Gaji depends on Total Gaji
  if (task.label.includes("Status Gaji")) {
    return !checkTaskCompleted("Total Gaji");
  }

  // Total Pengeluaran Gaji depends on Total Gaji
  if (task.label.includes("Total Pengeluaran Gaji")) {
    return !checkTaskCompleted("Total Gaji");
  }

  return false;
}

export function generateSmartHint(userInput: string, validFormulas: string[]): string | null {
  const trimmed = userInput.trim();
  if (!trimmed) return "Kolom input masih kosong. Masukkan rumus Anda.";
  
  // 1. Missing "="
  if (!trimmed.startsWith("=")) {
    return "Setiap rumus Excel harus selalu diawali dengan tanda sama dengan (=). Contoh: =SUM(A1:A5)";
  }

  // 2. Parentheses mismatch
  const openCount = (trimmed.match(/\(/g) || []).length;
  const closeCount = (trimmed.match(/\)/g) || []).length;
  if (openCount !== closeCount) {
    return `Tanda kurung tidak seimbang. Anda memiliki ${openCount} kurung buka '(' dan ${closeCount} kurung tutup ')'. Pastikan semua kurung telah ditutup.`;
  }

  // 3. Extract uppercase formula name
  const matchFuncName = trimmed.match(/^=([A-Z_]+)\(/i);
  const typedFuncName = matchFuncName ? matchFuncName[1].toUpperCase() : null;

  // Check if they spelled the function name wrong
  const knownFunctions = ["SUM", "AVERAGE", "MAX", "MIN", "COUNT", "COUNTA", "PROPER", "TRIM", "MID", "VLOOKUP", "HLOOKUP", "IF", "COUNTIF", "LEFT", "RIGHT", "LEN"];
  if (typedFuncName && !knownFunctions.includes(typedFuncName)) {
    // Look for close matches
    const closeMatch = knownFunctions.find(func => {
      return func.startsWith(typedFuncName.slice(0, 3)) || typedFuncName.includes(func) || func.includes(typedFuncName);
    });
    if (closeMatch) {
      return `Nama rumus '${typedFuncName}' tidak dikenal. Apakah maksud Anda '${closeMatch}'? Periksa kembali ejaan rumusnya.`;
    }
  }

  // 4. Check for missing "$" in lookup tables (very common in VLOOKUP/HLOOKUP)
  const hasVLookup = trimmed.toUpperCase().includes("VLOOKUP");
  const hasHLookup = trimmed.toUpperCase().includes("HLOOKUP");
  if ((hasVLookup || hasHLookup) && !trimmed.includes("$")) {
    const tableExample = hasVLookup ? "$A$7:$B$8" : "$A$10:$D$11";
    return `Periksa penguncian sel referensi. Saat menggunakan ${hasVLookup ? "VLOOKUP" : "HLOOKUP"}, tabel referensi harus dikunci dengan tanda dolar agar absolut (contoh: ${tableExample}).`;
  }

  // 5. Check text quotes in IF/COUNTIF formulas
  const hasIf = trimmed.toUpperCase().includes("IF");
  const hasCountIf = trimmed.toUpperCase().includes("COUNTIF");
  
  // Look for single quotes or letters without quotes where strings are expected
  if ((hasIf || hasCountIf) && (trimmed.includes("'") || (trimmed.match(/[A-Z]/i) && !trimmed.includes('"') && !trimmed.includes("(") && !trimmed.includes(")")))) {
    return 'Untuk memasukkan teks sebagai hasil atau kriteria (misal: "Tinggi", "Sedang", "Rendah", "I"), Anda harus mengapitnya dengan tanda kutip ganda ("..."), bukan kutip tunggal (\'...\') atau tanpa kutip.';
  }

  // 6. Check MID arguments count
  if (typedFuncName === "MID") {
    const commaCount = (trimmed.match(/,/g) || []).length + (trimmed.match(/;/g) || []).length;
    if (commaCount < 2) {
      return "Rumus MID memerlukan 3 argumen: teks, posisi_awal, dan jumlah_karakter (dipisahkan oleh koma atau titik koma). Contoh: =MID(A2, 5, 3)";
    }
  }

  // 7. Check lookup arguments count
  if (typedFuncName === "VLOOKUP" || typedFuncName === "HLOOKUP") {
    const commaCount = (trimmed.match(/,/g) || []).length + (trimmed.match(/;/g) || []).length;
    if (commaCount < 3) {
      return `Rumus ${typedFuncName} memerlukan 4 argumen: nilai_kunci, tabel_referensi, nomor_indeks, dan [pencarian_persis]. Contoh: =${typedFuncName}(C2, $A$7:$B$8, 2, 0)`;
    }
  }

  return null; // fallback to default hint
}
