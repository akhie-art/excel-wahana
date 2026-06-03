import { CellTask, ExcelCell } from "@/lib/modules";

export const getColLetter = (colIdx: number): string => {
  let temp = colIdx;
  let letter = "";
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
};

export const splitCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let insideQuote = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      insideQuote = !insideQuote;
    } else if (char === ',' && !insideQuote) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

export const splitFormulasText = (text: string): string[] => {
  const result: string[] = [];
  let current = "";
  let insideQuote = false;
  let quoteChar = "";
  let parenCount = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if ((char === '"' || char === "'") && (i === 0 || text[i - 1] !== "\\")) {
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
    if (char === ',' && !insideQuote && parenCount === 0) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

export const convertExcelDataToCSV = (dummyData: any[]): string => {
  if (!dummyData || dummyData.length === 0) return "";
  
  return dummyData.map((row) => {
    return row.cells.map((cell: any) => {
      const val = cell.value;
      if (typeof val === "string") {
        if (val.includes(",") || val.includes('"') || val.includes("\n")) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      }
      return val !== undefined ? String(val) : "";
    }).join(", ");
  }).join("\n");
};

export const parseCellRef = (ref: string) => {
  const match = ref.match(/^([A-Z]+)([0-9]+)$/);
  if (!match) return null;
  const colStr = match[1];
  const rowStr = match[2];
  
  let colIdx = 0;
  for (let i = 0; i < colStr.length; i++) {
    colIdx = colIdx * 26 + (colStr.charCodeAt(i) - 64);
  }
  colIdx = colIdx - 1;
  const rowIdx = parseInt(rowStr) - 1;
  return { row: rowIdx, col: colIdx };
};

export const getQuestionCells = (text: string) => {
  const cells: { row: number; col: number; label: string }[] = [];
  const lines = text.trim().split("\n");
  lines.forEach((line, rowIdx) => {
    const columns = splitCSVLine(line);
    columns.forEach((colVal, colIdx) => {
      if (colVal === "?") {
        const colLetter = getColLetter(colIdx);
        const rowNum = rowIdx + 1;
        cells.push({
          row: rowIdx,
          col: colIdx,
          label: `Sel ${colLetter}${rowNum}`
        });
      }
    });
  });
  return cells;
};

export const CSV_TEMPLATES = [
  {
    name: "Penjumlahan (SUM)",
    title: "Total Penjualan ATK",
    slug: "sum-atk",
    desc: "Hitung total pemasukan penjualan alat tulis kantor bulan ini.",
    csv: "Barang, Kuantitas, Harga Satuan, Total\nBuku Tulis, 50, 5000, 250000\nPensil 2B, 100, 2000, 200000\nPenghapus, 30, 1500, 45000\nTotal Keseluruhan, -, -, ?",
    formulas: "=SUM(D2:D4)",
    result: "495000",
    hint: "Gunakan rumus =SUM(D2:D4) pada sel D5 untuk menjumlahkan semua subtotal.",
    concept: "Fungsi SUM digunakan untuk menjumlahkan sekumpulan angka di dalam range tertentu. Format umumnya adalah =SUM(sel_awal:sel_akhir).",
    instructions: "Pada sel D5 yang ditandai dengan tanda tanya (?), ketikkan rumus =SUM(D2:D4) untuk menjumlahkan semua total harga barang."
  },
  {
    name: "Rata-rata (AVERAGE)",
    title: "Rata-rata Nilai Kelas",
    slug: "average-nilai",
    desc: "Hitung nilai rata-rata ujian matematika untuk tiga siswa.",
    csv: "Nama Siswa, Nilai Matematika\nAdit, 85\nBambang, 90\nCitra, 80\nRata-rata Kelas, ?",
    formulas: "=AVERAGE(B2:B4)",
    result: "85",
    hint: "Gunakan rumus =AVERAGE(B2:B4) pada sel B5 untuk mendapatkan nilai rata-rata.",
    concept: "Fungsi AVERAGE digunakan untuk menghitung nilai rata-rata dari sekelompok nilai. Format umumnya adalah =AVERAGE(sel_awal:sel_akhir).",
    instructions: "Pada sel B5 yang ditandai dengan tanda tanya (?), ketikkan rumus =AVERAGE(B2:B4) untuk mencari nilai rata-rata siswa."
  },
  {
    name: "Logika (IF)",
    title: "Kelulusan Siswa",
    slug: "if-kelulusan",
    desc: "Tentukan status kelulusan siswa berdasarkan nilai batas minimum 75.",
    csv: "Nama, Nilai, Status Kelulusan\nDewi, 78, ?\nEko, 72, Remedial\nFahri, 85, Lulus",
    formulas: '=IF(B2>=75,"Lulus","Remedial"), =IF(B2>=75;"Lulus";"Remedial")',
    result: "Lulus",
    hint: 'Gunakan fungsi logika IF untuk menguji sel B2: =IF(B2>=75,"Lulus","Remedial")',
    concept: 'Fungsi IF mengevaluasi tes logika dan mengembalikan satu nilai jika TRUE, dan nilai lain jika FALSE. Contoh: =IF(tes_logika, nilai_jika_true, nilai_jika_false).',
    instructions: 'Pada sel C2 yang ditandai dengan tanda tanya (?), ketikkan rumus =IF(B2>=75,"Lulus","Remedial") untuk menentukan status kelulusan Dewi.'
  }
];
