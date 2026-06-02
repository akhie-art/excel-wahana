"use client";

import { useState } from "react";
import { useAppStore, StudentData } from "@/lib/store";
import { ModuleStep } from "@/lib/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PlusCircle, CheckCircle, List, ArrowRight, Save, Database, Sparkles, FileSpreadsheet, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function InstructorPanel() {
  const { modules, addCustomStep, deleteCustomStep, students, setRole } = useAppStore();
  const totalStepsCount = modules.reduce((acc, m) => acc + m.steps.length, 0);
  const [activeTab, setActiveTab] = useState<"students" | "create" | "list">("students");

  // Form states for creating custom challenge
  const [selectedModuleId, setSelectedModuleId] = useState("basics");
  const [stepId, setStepId] = useState("");
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [concept, setConcept] = useState("");
  const [instructions, setInstructions] = useState("");
  const [expectedResult, setExpectedResult] = useState("");
  const [validFormulasText, setValidFormulasText] = useState("");
  const [hint, setHint] = useState("");
  const [csvData, setCsvData] = useState("Item, Kategori, Harga\nBuku, Kantor, 12\nPena, Kantor, 8\nTotal, Hitung, ?");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // CSV parsing logic to auto-generate the spreadsheet grid
  const parseCSVToExcelData = (text: string) => {
    try {
      const lines = text.trim().split("\n");
      if (lines.length < 2) throw new Error("CSV minimal harus memiliki 2 baris (header dan data)");

      const colCount = lines[0].split(",").length;
      const headers = ["", ...Array.from({ length: colCount }, (_, i) => String.fromCharCode(65 + i))];

      let resultCell = { row: 0, col: 0 };
      let questionMarkFound = false;

      const dummyData = lines.map((line, rowIdx) => {
        const columns = line.split(",").map((col) => col.trim());
        
        const cells = columns.map((colVal, colIdx) => {
          const isHeader = rowIdx === 0;
          const isQuestion = colVal === "?";
          
          if (isQuestion) {
            resultCell = { row: rowIdx, col: colIdx };
            questionMarkFound = true;
          }

          // If numeric, parse to float, else keep string
          const numericVal = Number(colVal);
          const value = isNaN(numericVal) || colVal === "" ? colVal : numericVal;

          return {
            value,
            header: isHeader,
            highlight: isQuestion || (!isHeader && typeof value === "number"),
          };
        });

        return {
          rowNum: rowIdx + 1,
          cells,
        };
      });

      if (!questionMarkFound) {
        throw new Error("CSV harus menyertakan satu sel tanda tanya '?' sebagai penanda target formula.");
      }

      return { headers, dummyData, resultCell };
    } catch (err: any) {
      throw new Error(err.message || "Gagal mengurai CSV data");
    }
  };

  const handleCreateStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!stepId || !title || !shortDesc || !concept || !instructions || !expectedResult || !validFormulasText || !hint) {
      setStatusMessage({ type: "error", text: "Mohon isi semua bidang formulir dengan lengkap." });
      return;
    }

    try {
      // 1. Parse CSV
      const { headers, dummyData, resultCell } = parseCSVToExcelData(csvData);

      // 2. Parse valid formulas list (comma-separated)
      const validFormulas = validFormulasText
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.startsWith("="));

      if (validFormulas.length === 0) {
        throw new Error("Sediakan minimal satu rumus valid dan harus diawali dengan tanda '='");
      }

      // 3. Construct new Step object
      const newStep: ModuleStep = {
        id: stepId.trim().toLowerCase(),
        title: title.trim(),
        shortDescription: shortDesc.trim(),
        conceptExplanation: concept.trim(),
        instructions: instructions.trim(),
        headers,
        dummyData,
        validFormulas,
        expectedResult: expectedResult.trim(),
        resultCell,
        hint: hint.trim(),
      };

      // 4. Add to store
      addCustomStep(selectedModuleId, newStep);
      
      setStatusMessage({ 
        type: "success", 
        text: `Tantangan "${title}" berhasil ditambahkan ke kurikulum! Beralihlah ke mode Peserta untuk mengujinya.` 
      });

      // Reset form fields
      setStepId("");
      setTitle("");
      setShortDesc("");
      setConcept("");
      setInstructions("");
      setExpectedResult("");
      setValidFormulasText("");
      setHint("");
      setCsvData("Item, Kategori, Harga\nBuku, Kantor, 12\nPena, Kantor, 8\nTotal, Hitung, ?");
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Gagal membuat tantangan baru." });
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 h-[calc(100vh-100px)] overflow-hidden">
      
      {/* Sidebar Controls Panel */}
      <div className="w-full md:w-64 shrink-0 flex flex-col space-y-2 bg-card border border-border/80 rounded-xl p-4 shadow-sm select-none">
        <div className="px-2 py-1 pb-3 border-b border-border/60">
          <h2 className="text-sm font-bold tracking-tight text-foreground">Dasbor Instruktur</h2>
          <p className="text-[10px] text-muted-foreground font-mono">PANEL KONTROL UTAMA</p>
        </div>

        <button
          onClick={() => setActiveTab("students")}
          className={cn(
            "w-full text-left flex items-center space-x-2.5 p-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer",
            activeTab === "students"
              ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <Users className="h-4 w-4" />
          <span>Daftar Peserta</span>
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={cn(
            "w-full text-left flex items-center space-x-2.5 p-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer",
            activeTab === "create"
              ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Buat Tantangan Baru</span>
        </button>

        <button
          onClick={() => setActiveTab("list")}
          className={cn(
            "w-full text-left flex items-center space-x-2.5 p-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer",
            activeTab === "list"
              ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <List className="h-4 w-4" />
          <span>Daftar Tantangan</span>
        </button>

        <div className="pt-8 mt-auto border-t border-border/60">
          <Button
            size="sm"
            onClick={() => setRole("peserta")}
            className="w-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-semibold text-xs py-2 shadow-sm rounded-lg"
          >
            Uji Coba Sebagai Peserta
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Panel Content (Scrollable) */}
      <div className="flex-1 h-full overflow-y-auto pr-2 pb-6">
        
        {/* Tab 1: Students Analytics List */}
        {activeTab === "students" && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Progres Belajar Peserta</h1>
              <p className="text-xs text-muted-foreground">Monitor nilai, tantangan terselesaikan, dan streak keaktifan belajar peserta didik.</p>
            </div>

            <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm font-sans">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/60 text-muted-foreground font-semibold">
                      <th className="p-4">Nama Peserta</th>
                      <th className="p-4">Alamat Email</th>
                      <th className="p-4 text-left">Tantangan Selesai</th>
                      <th className="p-4 text-center">Streak Belajar</th>
                      <th className="p-4">Keaktifan Terakhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-muted/15 transition-colors">
                        <td className="p-4 text-foreground font-bold">{student.name}</td>
                        <td className="p-4 text-muted-foreground font-mono text-xs">{student.email}</td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1 min-w-[120px]">
                            <div className="flex items-center justify-between text-[10px] font-semibold">
                              <span className="text-emerald-500">{student.completedCount} / {totalStepsCount}</span>
                              <span className="text-muted-foreground">{Math.round((student.completedCount / totalStepsCount) * 100)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, Math.round((student.completedCount / totalStepsCount) * 100))}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center font-bold text-amber-500">🔥 {student.streak} Hari</td>
                        <td className="p-4 text-muted-foreground text-xs">{student.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Create Custom Step */}
        {activeTab === "create" && (
          <div className="space-y-5 animate-in fade-in-50 duration-200">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Buat Tantangan Excel Baru</h1>
              <p className="text-xs text-muted-foreground">Tambahkan soal latihan rumus interaktif baru yang langsung masuk ke dalam kurikulum belajar.</p>
            </div>

            <form onSubmit={handleCreateStep} className="space-y-4">
              {statusMessage && (
                <div
                  className={cn(
                    "p-4 rounded-xl text-xs font-semibold leading-relaxed border",
                    statusMessage.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                  )}
                >
                  {statusMessage.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Module Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pilih Modul Induk</label>
                  <select
                    value={selectedModuleId}
                    onChange={(e) => setSelectedModuleId(e.target.value)}
                    className="w-full rounded-lg border border-border/80 bg-background/50 h-10 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>

                {/* Step Slug ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">ID Tantangan (Slug)</label>
                  <Input
                    type="text"
                    placeholder="misal: sum-karyawan"
                    value={stepId}
                    onChange={(e) => setStepId(e.target.value)}
                    className="h-10 text-xs bg-background/50 border-border/80 focus-visible:ring-emerald-500/50"
                    required
                  />
                </div>

                {/* Challenge Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Judul Tantangan</label>
                  <Input
                    type="text"
                    placeholder="misal: Menghitung Biaya Karyawan"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-10 text-xs bg-background/50 border-border/80 focus-visible:ring-emerald-500/50"
                    required
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Deskripsi Singkat</label>
                  <Input
                    type="text"
                    placeholder="misal: Jumlahkan biaya tim kantor bulan ini"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="h-10 text-xs bg-background/50 border-border/80 focus-visible:ring-emerald-500/50"
                    required
                  />
                </div>
              </div>

              {/* Concept Explanation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Penjelasan Konsep</label>
                <textarea
                  placeholder="Tuliskan penjelasan teori cara menggunakan rumus di sini..."
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="w-full min-h-[80px] rounded-lg border border-border/80 bg-background/50 p-3 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  required
                />
              </div>

              {/* Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Instruksi Tugas</label>
                <textarea
                  placeholder="Ketik instruksi langkah pengerjaan untuk peserta di sini, misal: Pada sel B4, ketik =SUM(B2:B3)..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full min-h-[60px] rounded-lg border border-border/80 bg-background/50 p-3 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Expected Result */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nilai Hasil Perhitungan</label>
                  <Input
                    type="text"
                    placeholder="misal: $20.00 atau 21,600"
                    value={expectedResult}
                    onChange={(e) => setExpectedResult(e.target.value)}
                    className="h-10 text-xs bg-background/50 border-border/80 focus-visible:ring-emerald-500/50"
                    required
                  />
                </div>

                {/* Valid Formulas List */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Rumus Valid (pisahkan koma)</label>
                  <Input
                    type="text"
                    placeholder="misal: =SUM(B2:B3), =B2+B3"
                    value={validFormulasText}
                    onChange={(e) => setValidFormulasText(e.target.value)}
                    className="h-10 text-xs bg-background/50 border-border/80 focus-visible:ring-emerald-500/50"
                    required
                  />
                </div>

                {/* Hint */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Petunjuk (Hint) Bantuan</label>
                  <Input
                    type="text"
                    placeholder="misal: Gunakan fungsi =SUM(B2:B3)"
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    className="h-10 text-xs bg-background/50 border-border/80 focus-visible:ring-emerald-500/50"
                    required
                  />
                </div>
              </div>

              {/* CSV Spreadsheet Simulator Data */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between select-none">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                    <FileSpreadsheet className="h-4 w-4 mr-1 text-emerald-500" />
                    Data Spreadsheet (Format CSV)
                  </label>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Gunakan tanda tanya `?` di sel yang ingin dijadikan tempat formula.
                  </span>
                </div>
                <textarea
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  className="w-full min-h-[100px] rounded-lg border border-border/80 bg-background/50 p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              {/* Live Preview of the parsed CSV */}
              {csvData.trim() && (
                <div className="space-y-2 p-3.5 rounded-xl border border-border bg-muted/20 shadow-inner">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Pratinjau Spreadsheet (Live Preview)
                  </h4>
                  {(() => {
                    try {
                      const { headers, dummyData, resultCell } = parseCSVToExcelData(csvData);
                      return (
                        <div className="overflow-x-auto max-w-full rounded-lg border border-border bg-card shadow-sm">
                          <table className="w-full text-left border-collapse font-mono text-[10px] table-fixed">
                            <thead>
                              <tr className="bg-muted/40 border-b border-border">
                                {headers.map((h, i) => (
                                  <th key={i} className="p-2 text-center border-r border-border text-muted-foreground font-bold bg-muted/20 select-none w-20">
                                    {i === 0 ? "" : String.fromCharCode(65 + i - 1)}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {dummyData.map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-border hover:bg-muted/5 transition-colors">
                                  <td className="p-2 text-center bg-muted/20 border-r border-border text-muted-foreground font-semibold select-none w-10">
                                    {row.rowNum}
                                  </td>
                                  {row.cells.map((cell, cIdx) => {
                                    const isResult = rIdx === resultCell.row && cIdx === resultCell.col;
                                    return (
                                      <td
                                        key={cIdx}
                                        className={cn(
                                          "p-2 border-r border-border truncate text-center",
                                          isResult
                                            ? "bg-amber-500/10 text-amber-500 font-bold border border-dashed border-amber-500/30"
                                            : typeof cell.value === "number"
                                              ? "text-emerald-500 font-semibold"
                                              : "text-foreground/80"
                                        )}
                                      >
                                        {cell.value}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    } catch (err: any) {
                      return (
                        <div className="text-[10px] text-rose-500 font-mono italic p-2 bg-rose-500/5 rounded border border-rose-500/20 select-none">
                          ⚠️ Kesalahan format: {err.message}
                        </div>
                      );
                    }
                  })()}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-semibold transition-all duration-150 py-2.5 rounded-lg flex items-center justify-center space-x-1.5"
              >
                <Save className="h-4 w-4" />
                <span>Simpan dan Publikasikan Tantangan</span>
              </Button>
            </form>
          </div>
        )}

        {/* Tab 3: List challenges */}
        {activeTab === "list" && (
          <div className="space-y-5 animate-in fade-in-50 duration-200">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Daftar Modul & Tantangan Saat Ini</h1>
              <p className="text-xs text-muted-foreground">Lihat daftar lengkap tantangan aktif dan kunci jawaban rumus dari modul kurikulum yang ada.</p>
            </div>

            <div className="space-y-4">
              {modules.map((module) => (
                <Card key={module.id} className="border border-border/80 bg-card/40 overflow-hidden">
                  <CardHeader className="bg-muted/20 border-b border-border/50 py-3 px-4">
                    <CardTitle className="text-sm font-bold flex items-center justify-between">
                      <span>{module.title}</span>
                      <span className="text-xs font-mono text-muted-foreground">{module.steps.length} Soal</span>
                    </CardTitle>
                    <CardDescription className="text-xs">{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y divide-border/60">
                      {module.steps.map((step, idx) => (
                        <li key={step.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs md:text-sm">
                          <div className="space-y-1">
                            <p className="font-bold flex items-center space-x-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                              <span>{step.title}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{step.shortDescription}</p>
                          </div>
                          <div className="flex items-center space-x-3 shrink-0 justify-between md:justify-end w-full md:w-auto">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-mono px-2 py-0.5 bg-muted rounded border border-border/80 text-muted-foreground">
                                Kunci: {step.validFormulas[0]}
                              </span>
                              {step.expectedResult && (
                                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 font-bold">
                                  Hasil: {step.expectedResult}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm(`Apakah Anda yakin ingin menghapus tantangan "${step.title}" dari kurikulum?`)) {
                                  deleteCustomStep(module.id, step.id);
                                }
                              }}
                              className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-md shrink-0"
                              title="Hapus Tantangan"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
