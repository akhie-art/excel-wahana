import { readFileSync, writeFileSync } from 'fs';

const filePath = '/Users/macbook/Sites/excel/lib/modules.ts';
const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find the exact boundary of hitung-data steps[]
let inHitungData = false;
let stepsStart = -1; // first line INSIDE steps: [  (0-indexed)
let stepsEnd = -1;   // the ] closing line (0-indexed)

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id: "hitung-data"')) inHitungData = true;
  if (inHitungData && lines[i].trim() === 'steps: [') {
    stepsStart = i + 1; // first content line
    let depth = 1;
    for (let j = stepsStart; j < lines.length; j++) {
      for (const ch of lines[j]) {
        if (ch === '[') depth++;
        if (ch === ']') { depth--; if (depth === 0) { stepsEnd = j; break; } }
      }
      if (stepsEnd !== -1) break;
    }
    break;
  }
}

if (stepsStart === -1 || stepsEnd === -1) {
  console.error('Could not find hitung-data steps boundaries');
  process.exit(1);
}

console.log(`Replacing lines ${stepsStart+1} to ${stepsEnd} (1-indexed) with new cumulative curriculum`);

const newSteps = `      {
        id: "sum",
        title: "Sum (menjumlahkan data)",
        shortDescription: "Fungsi untuk menjumlahkan sekumpulan angka di dalam sel.",
        conceptExplanation: "Fungsi \`SUM\` digunakan untuk menjumlahkan nilai sel secara cepat. Cara penulisannya: \`=SUM(SelAwal:SelAkhir)\`. Tanda titik dua (\`:\`) melambangkan rentang.\\n\\nKita akan belajar di tabel **Laporan Kas Toko ATK** yang sama dan terus berkembang di setiap langkah pelajaran. Mulai dari yang sederhana — menghitung total belanja — sampai ke laporan analitik yang komprehensif.",
        instructions: "Lihat tabel Laporan Kas Toko ATK di sebelah kanan. Kolom **D (Total Belanja)** tiap barang sudah terisi. Tugas kamu: hitung **Total Seluruhnya** di sel **D5** menggunakan \`=SUM(D2:D4)\`. Klik dua kali sel **D5** lalu ketik rumusnya, tekan **Enter** untuk memeriksa.",
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
        conceptExplanation: "Fungsi \`AVERAGE\` menjumlahkan seluruh nilai pada rentang sel lalu membaginya dengan jumlah total data secara otomatis.\\nSyntax: \`=AVERAGE(SelAwal:SelAkhir)\`\\n\\nLaporan Toko ATK kita bertambah satu baris baru: **Rata-rata Belanja**. Perhatikan bahwa rumus SUM dari langkah sebelumnya juga harus diisi ulang — ini melatih ingatan motorikmu!",
        instructions: "Tabel Toko ATK sekarang memiliki 2 baris kosong (**?**). Isi **D5** terlebih dahulu dengan \`=SUM(D2:D4)\`, lalu isi **D6** dengan rata-rata belanja menggunakan \`=AVERAGE(D2:D4)\`. Klik dua kali tiap sel untuk mulai mengetik.",
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
        conceptExplanation: "Fungsi \`MAX\` mengembalikan angka tertinggi di dalam suatu rentang data.\\nSyntax: \`=MAX(SelAwal:SelAkhir)\`\\n\\nLaporan Toko ATK kita bertambah lagi dengan baris **Belanja Tertinggi**. Jangan lupa isi ulang D5 dan D6 dari ingatan — ini adalah bagian dari latihan pengulangan aktif!",
        instructions: "Tabel sekarang punya 3 baris kosong (**?**). Isi ulang **D5** (SUM) dan **D6** (AVERAGE), lalu isi **D7** dengan nilai belanja tertinggi menggunakan \`=MAX(D2:D4)\`. Klik dua kali tiap sel untuk mulai.",
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
        conceptExplanation: "Fungsi \`MIN\` mengembalikan angka terkecil di dalam suatu rentang data.\\nSyntax: \`=MIN(SelAwal:SelAkhir)\`\\n\\nLaporan Toko ATK bertambah baris **Belanja Terendah**. Di setiap langkah, kamu mengisi ulang seluruh rumus sebelumnya — inilah cara tercepat melatih refleks formula Excel!",
        instructions: "Isi ulang **D5** (SUM), **D6** (AVERAGE), **D7** (MAX), lalu isi **D8** dengan nilai belanja terendah menggunakan \`=MIN(D2:D4)\`.",
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
        conceptExplanation: "Fungsi \`COUNT\` menghitung berapa banyak sel di suatu rentang yang terisi oleh angka. Sel berisi huruf atau sel kosong akan dilewati.\\nSyntax: \`=COUNT(SelAwal:SelAkhir)\`\\n\\nLaporan Toko ATK kita sekarang memerlukan baris **Banyak Transaksi Angka**. Isi ulang seluruh rumus sebelumnya juga!",
        instructions: "Isi ulang D5–D8 dari langkah sebelumnya, lalu isi **D9** dengan jumlah sel angka di rentang Total Belanja menggunakan \`=COUNT(D2:D4)\`.",
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
        conceptExplanation: "Berbeda dengan COUNT, fungsi \`COUNTA\` (Count All) akan menghitung setiap sel yang berisi karakter apa pun, termasuk teks, simbol, atau angka. Sel kosong tidak dihitung.\\nSyntax: \`=COUNTA(SelAwal:SelAkhir)\`\\n\\nLaporan Toko ATK bertambah baris **Total Jenis Barang**. Isi ulang seluruh rumus D5–D9 juga!",
        instructions: "Isi ulang D5–D9 dari langkah sebelumnya, lalu isi **D10** dengan total jenis barang di kolom Nama Barang menggunakan \`=COUNTA(A2:A4)\`.",
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
        conceptExplanation: "Fungsi \`LARGE\` membolehkan kamu mencari nilai peringkat atas ke-k dari daftar angka.\\nSyntax: \`=LARGE(range, k)\`\\n\\nLaporan Toko ATK bertambah baris **Belanja Ke-2 Terbesar**.",
        instructions: "Isi ulang D5–D10 dari langkah sebelumnya, lalu isi **D11** dengan nilai belanja terbesar ke-2 menggunakan \`=LARGE(D2:D4, 2)\`.",
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
        conceptExplanation: "Kebalikan dari LARGE, fungsi \`SMALL\` mencari nilai terkecil ke-k dari daftar angka.\\nSyntax: \`=SMALL(range, k)\`\\n\\nLaporan Toko ATK bertambah baris **Belanja Ke-2 Terkecil**.",
        instructions: "Isi ulang D5–D11 dari langkah sebelumnya, lalu isi **D12** dengan nilai belanja terkecil ke-2 menggunakan \`=SMALL(D2:D4, 2)\`.",
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
        conceptExplanation: "Fungsi \`SUMPRODUCT\` mengalikan baris demi baris antara rentang kolom pertama dan rentang kolom kedua, lalu menjumlahkan seluruh hasilnya.\\nSyntax: \`=SUMPRODUCT(range1, range2)\`\\n\\nLaporan Toko ATK bertambah baris **Total via SUMPRODUCT** — membuktikan bahwa SUM dari kolom D sama dengan SUMPRODUCT dari kolom B dan C.",
        instructions: "Isi ulang D5–D12 dari langkah sebelumnya, lalu isi **D13** dengan \`=SUMPRODUCT(B2:B4, C2:C4)\`.",
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
        conceptExplanation: "Fungsi \`AGGREGATE\` adalah fungsi multifungsi yang bisa melakukan tugas SUM, AVERAGE, dll., dengan kelebihan bisa melewati baris yang tersembunyi atau sel yang berisi error.\\n\\nArgumennya: 1. **Fungsi** (9=SUM), 2. **Opsi** (6=abaikan error), 3. **Rentang**.\\nSyntax: \`=AGGREGATE(fungsi, opsi, range)\`\\n\\nIni adalah baris terakhir laporan Toko ATK. Setelah ini kamu akan menghadapi Studi Kasus Final!",
        instructions: "Isi ulang D5–D13, lalu isi **D14** dengan \`=AGGREGATE(9, 6, D2:D4)\` — fungsi 9=SUM, opsi 6=abaikan error.",
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
        title: "🏆 Studi Kasus Final: Laporan Kas Toko ATK Mandiri",
        shortDescription: "Ujian mandiri: lengkapi seluruh laporan Toko ATK dari nol tanpa panduan — buktikan penguasaan 10 rumus sekaligus!",
        conceptExplanation: "Selamat! Kamu telah mempelajari dan berlatih 10 rumus menghitung data secara bertahap di tabel Toko ATK yang sama.\\n\\nSekarang tiba saatnya **ujian mandiri sesungguhnya**. Tabel di sebelah kanan adalah laporan Toko ATK yang SAMA persis — namun seluruh 10 sel formula dikosongkan sekaligus.\\n\\nTanpa petunjuk tambahan, isi semua sel dari ingatanmu. Ini adalah bukti nyata bahwa kamu sudah benar-benar menguasai ke-10 rumus tersebut!",
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
      }`;

// Replace lines stepsStart..stepsEnd-1 (exclusive of the closing ]) with the new content
const before = lines.slice(0, stepsStart);
const after = lines.slice(stepsEnd); // includes the ] line

const newContent = [...before, newSteps, ...after].join('\n');
writeFileSync(filePath, newContent, 'utf8');
console.log('Done! File patched successfully.');
console.log('New line count:', newContent.split('\n').length);
