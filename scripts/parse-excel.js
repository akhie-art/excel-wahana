const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const xlsxPath = path.join(__dirname, '..', 'Fungsi_Excel_Lengkap.xlsx');
const sqlOutputPath = path.join(__dirname, '..', 'supabase', 'seed_formulas.sql');
const jsonOutputPath = path.join(__dirname, '..', 'lib', 'formulas-data.json');

console.log('Reading Excel file from:', xlsxPath);

try {
  const workbook = xlsx.readFile(xlsxPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(worksheet);
  
  console.log(`Successfully parsed ${rows.length} rows.`);

  // 1. Generate fallback JSON file
  const jsonData = rows.map(r => ({
    no: parseInt(r['No']) || null,
    nama_rumus: r['Nama Rumus'] || '',
    versi: r['Versi'] || '-',
    syntax: r['Syntax'] || '',
    penjelasan: r['Penjelasan'] || ''
  }));
  
  fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonData, null, 2));
  console.log('Generated fallback JSON file:', jsonOutputPath);

  // 2. Generate SQL Seed file
  let sqlContent = `-- SQL script to create excel_formulas table and seed data
DROP TABLE IF EXISTS public.excel_formulas CASCADE;

CREATE TABLE public.excel_formulas (
  id SERIAL PRIMARY KEY,
  no INTEGER,
  nama_rumus TEXT NOT NULL,
  versi TEXT,
  syntax TEXT,
  penjelasan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.excel_formulas ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Anyone can view formulas" ON public.excel_formulas
  FOR SELECT USING (true);

-- Insert rows
`;

  // Helper to escape single quotes for SQL
  const escapeSql = (str) => {
    if (str === undefined || str === null) return 'NULL';
    const escaped = String(str).replace(/'/g, "''");
    return `'${escaped}'`;
  };

  // We can insert in chunks of e.g. 100 rows for efficiency
  const chunkSize = 100;
  for (let i = 0; i < jsonData.length; i += chunkSize) {
    const chunk = jsonData.slice(i, i + chunkSize);
    sqlContent += `INSERT INTO public.excel_formulas (no, nama_rumus, versi, syntax, penjelasan) VALUES\n`;
    const values = chunk.map(r => {
      const noVal = r.no === null ? 'NULL' : r.no;
      return `  (${noVal}, ${escapeSql(r.nama_rumus)}, ${escapeSql(r.versi)}, ${escapeSql(r.syntax)}, ${escapeSql(r.penjelasan)})`;
    });
    sqlContent += values.join(',\n') + ';\n\n';
  }

  fs.writeFileSync(sqlOutputPath, sqlContent);
  console.log('Generated SQL Seed file:', sqlOutputPath);
  console.log('Process complete!');
} catch (err) {
  console.error('Error during parsing:', err);
}
