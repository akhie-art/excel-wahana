"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import * as XLSX from "xlsx";
import { 
  Sparkles, 
  Upload, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  FileSpreadsheet,
  Settings,
  FileCode,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AISuggestion {
  columnLetter: string;
  columnHeader: string;
  formula: string; // Template formula with {row} placeholder, e.g. =C{row}+E{row}
  explanation: string;
  selected?: boolean;
}

export default function AISolverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sheetName, setSheetName] = useState<string>("");
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawData, setRawData] = useState<(string | number)[][]>([]);
  const [customInstruction, setCustomInstruction] = useState<string>("");

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse Excel file on upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    setLoadingStep("Membaca berkas Excel...");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array", cellFormula: true });
        
        const firstSheetName = wb.SheetNames[0];
        setSheetName(firstSheetName);
        setWorkbook(wb);

        const worksheet = wb.Sheets[firstSheetName];
        // Parse raw matrix representing spreadsheet rows
        const matrix = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, { header: 1, defval: "" });
        
        if (matrix.length === 0) {
          throw new Error("Berkas Excel kosong atau tidak memiliki data.");
        }

        const excelHeaders = (matrix[0] as string[]).map(h => String(h || "").trim());
        setHeaders(excelHeaders);
        setRawData(matrix.slice(1) as (string | number)[][]); // Remove header row
        setSuggestions([]);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal mengurai file Excel.";
        setErrorMsg(message);
        setFile(null);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  // Call Gemini Flash API to analyze columns and suggest Excel formulas
  const handleAnalyzeWithAI = async () => {
    if (!headers || headers.length === 0) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoadingStep("Mengirim data kolom ke Gemini AI...");

    // Take the first 3 data rows as samples to give AI context
    const sampleRows = rawData.slice(0, 3).map((row) => {
      const mappedRow: Record<string, string | number> = {};
      headers.forEach((h, idx) => {
        mappedRow[`${String.fromCharCode(65 + idx)}: ${h}`] = row[idx] !== undefined ? row[idx] : "";
      });
      return mappedRow;
    });

    const apiKey = "AIzaSyD23q9GVgK8fRjzUulM70F6DB5gEMcznJs";
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    const prompt = `
Anda adalah asisten AI khusus ahli Excel tingkat lanjut. Tugas Anda adalah menganalisis struktur tabel Excel berikut dan menghasilkan rumus Excel yang benar untuk kolom-kolom yang memerlukan perhitungan/kalkulasi.

Daftar kolom yang ada beserta indeks huruf kolomnya:
${headers.map((h, i) => `${String.fromCharCode(65 + i)}: ${h}`).join("\n")}

Sampel data baris (dalam bentuk JSON):
${JSON.stringify(sampleRows, null, 2)}

${customInstruction ? `Instruksi Khusus dari Pengguna:\n"${customInstruction}"\n` : ""}

ATURAN STRUKTUR FORMULA:
1. Setiap rumus yang Anda hasilkan HARUS menggunakan placeholder '{row}' untuk merepresentasikan nomor baris aktif. Contoh: =C{row}+E{row} atau =VLOOKUP(B{row}, Referensi!$A$2:$B$10, 2, FALSE).
2. Jangan ubah angka indeks kolom (seperti angka 2 di VLOOKUP di atas), biarkan angka tersebut tetap berupa angka statis. Hanya ganti penunjuk nomor baris sel dinamis dengan {row}.
3. Gunakan separator koma (,) untuk memisahkan argumen rumus (format standar internasional).
4. Pastikan rumus diawali dengan tanda sama dengan (=).
5. Analisis kolom yang memiliki nama seperti 'Total', 'PPN', 'Gaji Bersih', 'Diskon', 'Rata-rata', 'Nilai Akhir', 'Grade' dsb, atau kolom yang kosong pada sampel data, dan buatkan rumusnya.

Kembalikan respon wajib dalam format JSON yang valid berikut tanpa pembungkus markdown (langsung berikan objek JSON):
{
  "suggestions": [
    {
      "columnLetter": "Huruf kolom target, misal: F",
      "columnHeader": "Nama header kolom target, misal: Total Gaji",
      "formula": "Rumus Excel dengan placeholder {row}, misal: =C{row}+E{row}",
      "explanation": "Penjelasan logika rumus dalam Bahasa Indonesia."
    }
  ]
}
`;

    try {
      setLoadingStep("Menunggu kalkulasi rumus dari Gemini AI...");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Koneksi API Gemini gagal dengan status ${response.status}`);
      }

      const resData = await response.json();
      const aiResponseText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiResponseText) {
        throw new Error("AI tidak mengembalikan respon formula.");
      }

      const parsedJSON = JSON.parse(aiResponseText);
      interface JSONSuggestion {
        columnLetter: string;
        columnHeader: string;
        formula: string;
        explanation: string;
      }
      const suggestionsList: AISuggestion[] = (parsedJSON.suggestions || []).map((s: JSONSuggestion) => ({
        columnLetter: s.columnLetter,
        columnHeader: s.columnHeader,
        formula: s.formula,
        explanation: s.explanation,
        selected: true
      }));

      if (suggestionsList.length === 0) {
        setErrorMsg("AI tidak menemukan kolom kalkulatif yang kosong. Silakan tambahkan instruksi khusus!");
      } else {
        setSuggestions(suggestionsList);
        setSuccessMsg(`AI berhasil merumuskan ${suggestionsList.length} rekomendasi rumus!`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal terhubung dengan asisten AI Gemini.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle suggestion checked status
  const toggleSuggestion = (idx: number) => {
    const updated = [...suggestions];
    updated[idx].selected = !updated[idx].selected;
    setSuggestions(updated);
  };

  // Generate updated worksheet and download the file
  const handleApplyAndDownload = () => {
    if (!workbook || !file) return;

    try {
      setIsLoading(true);
      setLoadingStep("Menyusun berkas Excel baru...");

      const activeSuggestions = suggestions.filter(s => s.selected);
      
      // We will re-read and modify the sheet object
      const ws = workbook.Sheets[sheetName];

      // Update cells row-by-row
      // In Excel, row 1 is headers. Data rows start at index 2 (1-based index)
      rawData.forEach((_, rIdx) => {
        const excelRowNum = rIdx + 2;

        activeSuggestions.forEach((s) => {
          const colLetter = s.columnLetter.toUpperCase();
          const cellRef = `${colLetter}${excelRowNum}`;
          
          // Replace placeholder {row} with current row number
          const finalFormula = s.formula.replace(/\{row\}/g, String(excelRowNum));
          // Strip leading '=' for SheetJS formula field
          const cleanFormula = finalFormula.startsWith("=") ? finalFormula.substring(1) : finalFormula;

          ws[cellRef] = {
            t: "n", // cell type 'number' (formula result placeholder)
            f: cleanFormula
          };
        });
      });

      // Write workbook to file
      XLSX.writeFile(workbook, `solved_${file.name}`);
      setSuccessMsg("Pemberian rumus selesai! Berkas berhasil diunduh.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyisipkan rumus ke dalam Excel.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setWorkbook(null);
    setSheetName("");
    setHeaders([]);
    setRawData([]);
    setSuggestions([]);
    setErrorMsg(null);
    setSuccessMsg(null);
    setCustomInstruction("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Derive preview spreadsheet rows (show first 8 rows)
  const previewRows = useMemo(() => {
    const limit = 8;
    return rawData.slice(0, limit).map((row, rIdx) => {
      const excelRowNum = rIdx + 2;
      return headers.map((h, cIdx) => {
        const colLetter = String.fromCharCode(65 + cIdx);
        // Find if this cell gets a formula from active suggestions
        const matchingSuggestion = suggestions.find(
          (s) => s.selected && s.columnLetter.toUpperCase() === colLetter
        );

        if (matchingSuggestion) {
          // Display formula dynamically in the table preview
          return matchingSuggestion.formula.replace(/\{row\}/g, String(excelRowNum));
        }
        return row[cIdx] !== undefined ? String(row[cIdx]) : "";
      });
    });
  }, [rawData, headers, suggestions]);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-teal-500/5 blur-[130px] pointer-events-none z-0" />

      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1 select-none">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" /> AI Solver Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Asisten AI Pengerja Excel ⚡
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
              Unggah lembar kerja Excel Anda yang kosong atau butuh rumus, tulis instruksi tambahan, lalu biarkan model kecerdasan buatan menyisipkan rumus kalkulasi otomatis ke setiap baris secara presisi.
            </p>
          </div>

          <Link href="/belajar">
            <Button variant="outline" className="h-9 gap-1.5 text-xs font-semibold border-border/80 hover:bg-accent/40 rounded-xl cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali Belajar
            </Button>
          </Link>
        </div>

        {/* Global Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-xs z-50 flex flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
              <div className="absolute font-mono text-[9px] text-emerald-500 font-bold">AI</div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-foreground">Asisten AI Sedang Bekerja</p>
              <p className="text-xs text-muted-foreground font-mono">{loadingStep}</p>
            </div>
          </div>
        )}

        {/* Notification Alert Message Banner */}
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-2xl flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Terjadi Kesalahan:</span>
              <p className="opacity-90">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-2xl flex items-start gap-2.5 shadow-sm">
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Berhasil:</span>
              <p className="opacity-90">{successMsg}</p>
            </div>
          </div>
        )}

        {/* MAIN PANEL */}
        {!file ? (
          /* STEP 1: Upload Zone Card */
          <div className="max-w-xl mx-auto">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border/75 hover:border-emerald-500/60 bg-card/25 hover:bg-emerald-500/[0.01] rounded-3xl p-10 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center space-y-4 shadow-lg shadow-emerald-500/[0.02]"
            >
              <input 
                type="file"
                ref={fileInputRef}
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="h-16 w-16 bg-muted/40 rounded-2xl flex items-center justify-center border border-border/60 group-hover:scale-105 transition-transform duration-200">
                <Upload className="h-8 w-8 text-muted-foreground/60 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="font-extrabold text-foreground text-sm">Pilih berkas Excel (.xlsx, .xls)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Unggah berkas spreadsheet laporan gaji, absensi, data penjualan, atau tugas matematika yang ingin diberikan rumus.
                </p>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/50">Maksimal file 5 MB</span>
            </div>
          </div>
        ) : (
          /* STEP 2: Main AI Workbench Split Layout */
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* LEFT CONFIGURATION & RECOMMENDATIONS (5 Cols) */}
            <div className="xl:col-span-5 space-y-6">
              
              {/* File Info Card */}
              <div className="bg-card border border-border/60 rounded-2xl p-4 flex items-center justify-between select-none">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono leading-none pt-0.5">{sheetName} · {(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetForm}
                  className="h-8 text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                >
                  Ganti File
                </Button>
              </div>

              {/* Advanced Custom Instruction Box */}
              <div className="bg-card border border-border/60 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 select-none">
                  <Settings className="w-4 h-4 text-emerald-500" /> Aturan Tambahan (Opsional)
                </h3>
                <div className="space-y-1.5">
                  <textarea
                    placeholder="Contoh: 'Terapkan diskon 10% untuk kolom Harga jika jumlah barang di kolom C lebih dari 50, dan hitung PPN sebesar 11% di kolom Total Pajak'"
                    value={customInstruction}
                    onChange={(e) => setCustomInstruction(e.target.value)}
                    rows={3}
                    className="w-full p-3 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-sans"
                  />
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Panduan instruksi tambahan memperinci rumus tertentu yang ingin dicari (menggunakan referensi nama kolom).
                  </p>
                </div>

                <Button
                  onClick={handleAnalyzeWithAI}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 rounded-xl cursor-pointer shadow-md hover:-translate-y-px active:translate-y-0 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>{suggestions.length > 0 ? "Kalkulasi Ulang AI" : "Analisis Data dengan AI"}</span>
                </Button>
              </div>

              {/* AI Formula Recommendations List */}
              {suggestions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center select-none">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">👇 Rekomendasi Rumus AI</h3>
                    <span className="text-[10px] font-mono text-muted-foreground">{suggestions.filter(s=>s.selected).length}/{suggestions.length} Aktif</span>
                  </div>
                  
                  <div className="space-y-2.5">
                    {suggestions.map((s, idx) => (
                      <div 
                        key={s.columnLetter}
                        onClick={() => toggleSuggestion(idx)}
                        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-3 select-none ${
                          s.selected 
                            ? "border-emerald-500/40 bg-emerald-500/[0.02] shadow-xs" 
                            : "border-border bg-card/40 opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* Checkbox status indicator */}
                        <div className={`h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          s.selected 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : "border-border/80 bg-background"
                        }`}>
                          {s.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                              Kolom {s.columnLetter}
                            </span>
                            <span className="text-xs font-extrabold text-foreground truncate max-w-[200px]">
                              {s.columnHeader}
                            </span>
                          </div>
                          
                          <code className="block bg-muted px-2.5 py-1.5 rounded-lg font-mono text-xs text-foreground font-semibold border border-border/80 break-all select-all">
                            {s.formula}
                          </code>

                          <p className="text-[11px] text-muted-foreground leading-normal">
                            {s.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Apply & Download Excel File */}
                  <Button
                    onClick={handleApplyAndDownload}
                    disabled={suggestions.filter(s=>s.selected).length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs h-10 rounded-xl cursor-pointer shadow-md hover:-translate-y-px active:translate-y-0 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Terapkan & Unduh Berkas Excel</span>
                  </Button>
                </div>
              )}

            </div>

            {/* RIGHT PANEL: Live Spreadsheet Preview (7 Cols) */}
            <div className="xl:col-span-7 space-y-4">
              <div className="flex justify-between items-center select-none">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-emerald-500" /> Pratinjau Lembar Kerja (Maks 8 Baris)
                </h3>
                <span className="text-[10px] font-mono text-muted-foreground">Tampilan rumus disematkan secara dinamis</span>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-border/75 bg-card/45 backdrop-blur-xs shadow-md">
                <table className="w-full text-left border-collapse font-mono text-xs select-none">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/60">
                      <th className="p-3 text-center border-r border-border/40 text-[10px] text-muted-foreground w-12 bg-muted/20">#</th>
                      {headers.map((h, idx) => (
                        <th 
                          key={idx} 
                          className="p-3 border-r border-border/40 last:border-r-0 text-center"
                          style={{ minWidth: "110px" }}
                        >
                          <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <div className="text-[11px] font-semibold text-foreground truncate max-w-[150px]" title={h}>
                            {h}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/25">
                    {previewRows.map((row, rIdx) => {
                      const excelRowNum = rIdx + 2;
                      return (
                        <tr key={rIdx} className="hover:bg-muted/10 transition-colors">
                          <td className="p-3 text-center border-r border-border/40 font-bold bg-muted/20 text-muted-foreground/80">
                            {excelRowNum}
                          </td>
                          {row.map((cellVal, cIdx) => {
                            const isFormula = cellVal.startsWith("=");
                            return (
                              <td 
                                key={cIdx} 
                                className={`p-3 border-r border-border/45 last:border-r-0 truncate max-w-[150px] ${
                                  isFormula 
                                    ? "text-emerald-500 dark:text-emerald-400 font-bold italic bg-emerald-500/[0.04]" 
                                    : "text-foreground/80"
                                }`}
                                title={cellVal}
                              >
                                {cellVal}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Empty visual representation */}
              {rawData.length > 8 && (
                <div className="p-4 text-center border border-dashed border-border/60 rounded-2xl text-[10px] text-muted-foreground select-none">
                  ... Dan {rawData.length - 8} baris data lainnya tersembunyi dari pratinjau.
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
