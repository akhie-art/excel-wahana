"use client";

import { useState } from "react";
import { useAppStore, StudentData } from "@/lib/store";
import { ModuleStep, checkFormula } from "@/lib/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PlusCircle, CheckCircle, List, ArrowRight, ArrowLeft, Save, Database, Sparkles, FileSpreadsheet, Trash2, Eye, CheckCircle2, Circle, Flame, Clock, BookOpen, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useShallow } from "zustand/react/shallow";

interface OnlineStudentsListProps {
  onSpectate: (id: string) => void;
}

function OnlineStudentsList({ onSpectate }: OnlineStudentsListProps) {
  const { peerStates, modules } = useAppStore(
    useShallow((state) => ({
      peerStates: state.peerStates,
      modules: state.modules,
    }))
  );

  const onlineStudents = Object.entries(peerStates)
    .filter(([_, peer]) => peer && peer.role === "peserta")
    .map(([clientId, peer]) => ({ clientId, ...peer }));

  if (onlineStudents.length === 0) return null;

  return (
    <div className="space-y-2.5 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 shadow-xs">
      <h2 className="text-xs font-bold text-rose-500 flex items-center gap-1.5 uppercase tracking-wider select-none animate-pulse">
        <span className="h-2 w-2 rounded-full bg-rose-500 inline-block"></span>
        Siswa Aktif Online Saat Ini ({onlineStudents.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {onlineStudents.map((peer) => {
          const peerStep = modules.flatMap((m) => m.steps).find((s) => s.id === peer.stepId);
          return (
            <Card key={peer.clientId} className="border-rose-500/25 bg-card shadow-sm hover:border-rose-500/50 transition-colors">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>{peer.name}</span>
                  <span className="text-[9px] font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full font-bold">LIVE</span>
                </CardTitle>
                <CardDescription className="text-[11px] font-sans">
                  {peerStep ? `Sedang di bab: ${peerStep.title}` : `Menjelajahi teori pengantar`}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3 px-4 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-muted-foreground">
                  <span>Target Sel:</span>
                  <span className="font-bold text-foreground">
                    {peer.activeCell ? `${String.fromCharCode(65 + peer.activeCell.col)}${peer.activeCell.row + 1}` : "-"}
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-muted-foreground text-[10px]">Formula diketik:</span>
                  <code className="block bg-muted/60 border border-border/80 px-2 py-1.5 rounded text-[10px] font-bold truncate max-w-full text-rose-600 dark:text-rose-400">
                    {peer.formulaInput || "(belum ada input)"}
                  </code>
                </div>
              </CardContent>
              <CardFooter className="pb-3 pt-0 px-4">
                <Button
                  size="sm"
                  onClick={() => onSpectate(peer.clientId)}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[10px] py-1.5 shadow-sm rounded-lg cursor-pointer flex items-center justify-center gap-1"
                >
                  <span className="h-2 w-2 rounded-full bg-red-600 inline-block animate-pulse mr-1.5"></span>
                  Pantau Layar Live
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

interface LiveSpectateViewProps {
  studentId: string;
  onBack: () => void;
}

function LiveSpectateView({ studentId, onBack }: LiveSpectateViewProps) {
  const { peerStates, modules } = useAppStore(
    useShallow((state) => ({
      peerStates: state.peerStates,
      modules: state.modules,
    }))
  );

  const spectatedStudent = peerStates[studentId];
  const spectatedStep = spectatedStudent
    ? modules.flatMap((m) => m.steps).find((s) => s.id === spectatedStudent.stepId)
    : null;

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4 select-none">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 px-2.5 text-xs font-semibold hover:bg-muted/60 flex items-center gap-1.5 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali</span>
          </Button>
          <div className="h-4 w-[1px] bg-border" />
          <div className="space-y-0.5">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block animate-pulse"></span>
              Pantau Live: {spectatedStudent ? spectatedStudent.name : "Siswa"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {spectatedStep ? `Latihan: ${spectatedStep.title}` : "Memuat halaman..."}
            </p>
          </div>
        </div>
      </div>

      {!spectatedStudent ? (
        <div className="text-center p-8 bg-card border border-border rounded-xl space-y-3">
          <div className="h-10 w-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Users className="h-5 w-5 animate-pulse" />
          </div>
          <p className="text-xs text-muted-foreground font-semibold">
            Siswa telah meninggalkan ruangan atau offline.
          </p>
        </div>
      ) : !spectatedStep ? (
        <div className="text-center p-8 bg-card border border-border rounded-xl">
          <p className="text-xs text-muted-foreground font-semibold">
            Siswa berada di luar modul latihan (membaca pengantar).
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Brief info */}
          <div className="bg-card border border-border/80 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Instruksi Tugas Siswa</h3>
            <div
              className="text-xs text-foreground/80 leading-relaxed font-sans"
              dangerouslySetInnerHTML={{
                __html: spectatedStep.instructions
                  .replace(/\*\*(.*?)\*\*/g, "<strong class='text-rose-600 dark:text-rose-400 font-semibold'>$1</strong>")
                  .replace(/`(.*?)`/g, "<code class='bg-muted px-1.5 py-0.5 rounded font-mono text-[10px] border border-border/60'>$1</code>")
              }}
            />
          </div>

          {/* Spreadsheet View Mockup */}
          <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm flex flex-col font-mono text-[10px] sm:text-xs">
            {/* Fake Formula Bar */}
            <div className="h-9 border-b border-border bg-muted/10 px-3 flex items-center space-x-2 text-muted-foreground select-none shrink-0">
              <span className="font-bold text-rose-500 text-xs">fx</span>
              <div className="h-4 w-[1px] bg-border" />
              <span className="text-xs text-foreground truncate select-none">
                {spectatedStudent.formulaInput || ""}
              </span>
            </div>

            {/* Grid table */}
            <div className="overflow-x-auto p-4 bg-background/30">
              <table className="w-full border-collapse border border-border table-fixed">
                {spectatedStep.headers && spectatedStep.headers.length > 0 && (
                  <colgroup>
                    {spectatedStep.headers.map((_, idx: number) => (
                      <col key={idx} style={{ width: idx === 0 ? "45px" : "120px" }} />
                    ))}
                  </colgroup>
                )}
                <thead>
                  <tr className="bg-muted/40">
                    {spectatedStep.headers.map((h: string, i: number) => (
                      <th key={i} className="p-2 border border-border text-center text-[10px] font-bold text-muted-foreground bg-muted/20 select-none">
                        {i === 0 ? "" : String.fromCharCode(65 + i - 1)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {spectatedStep.dummyData.map((row: any, rIdx: number) => (
                    <tr key={rIdx} className="border-b border-border">
                      <td className="p-2 border border-border text-center bg-muted/20 text-muted-foreground font-semibold select-none">
                        {row.rowNum}
                      </td>
                      {row.cells.map((cell: any, cIdx: number) => {
                        const isStudentActiveCell = spectatedStudent.activeCell && 
                          spectatedStudent.activeCell.row === rIdx && 
                          spectatedStudent.activeCell.col === cIdx;

                        // Check if it's a target result cell
                        const isMultiTaskCell = spectatedStep.tasks && spectatedStep.tasks.length > 0;
                        let taskIndex = -1;
                        if (isMultiTaskCell && spectatedStep.tasks) {
                          taskIndex = spectatedStep.tasks.findIndex(
                            (t: any) => t.resultCell && t.resultCell.row === rIdx && t.resultCell.col === cIdx
                          );
                        }
                        const isResultCell = isMultiTaskCell 
                          ? (taskIndex !== -1)
                          : (spectatedStep.resultCell && rIdx === spectatedStep.resultCell.row && cIdx === spectatedStep.resultCell.col);

                        const isStepCompleted = spectatedStudent.isSuccess || 
                          (spectatedStudent.completedSteps && spectatedStudent.completedSteps.includes(spectatedStep.id));

                        const studentAnswer = isMultiTaskCell
                          ? spectatedStudent.taskAnswers?.[taskIndex]
                          : spectatedStudent.formulaInput;

                        const isTaskCorrect = isStepCompleted || (
                          isResultCell &&
                          studentAnswer &&
                          (isMultiTaskCell
                            ? checkFormula(studentAnswer, spectatedStep.tasks![taskIndex].validFormulas)
                            : checkFormula(studentAnswer, spectatedStep.validFormulas))
                        );

                        const peerColorMap: Record<string, string> = {
                          emerald: "border-emerald-500 bg-emerald-500",
                          indigo: "border-indigo-500 bg-indigo-500",
                          rose: "border-rose-500 bg-rose-500",
                          amber: "border-amber-500 bg-amber-500",
                          violet: "border-violet-500 bg-violet-500",
                          sky: "border-sky-500 bg-sky-500",
                        };
                        const c = peerColorMap[spectatedStudent.color] || peerColorMap.emerald;

                        const expectedValue = isResultCell
                          ? (isMultiTaskCell ? spectatedStep.tasks![taskIndex].expectedResult : spectatedStep.expectedResult)
                          : cell.value;

                        return (
                          <td
                            key={cIdx}
                            className={cn(
                              "p-2 border border-border truncate text-center relative select-none transition-all duration-150 overflow-visible",
                              isStudentActiveCell
                                ? `ring-2 ring-inset ${c.split(" ")[0]} bg-rose-500/5 font-bold z-10`
                                : isResultCell && isTaskCorrect
                                  ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold"
                                  : isResultCell
                                    ? "bg-amber-500/5 dark:bg-amber-500/10 border border-dashed border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold"
                                    : cell.header
                                      ? "bg-muted/10 font-semibold"
                                      : typeof cell.value === "number"
                                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                                        : "text-foreground/80",
                              cell.bgColor
                            )}
                          >
                            {isResultCell ? (
                              isTaskCorrect ? (
                                <span className="flex items-center space-x-1.5 justify-center">
                                  <span>{expectedValue}</span>
                                </span>
                              ) : isStudentActiveCell ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                  <span className="text-rose-600 dark:text-rose-400">{spectatedStudent.formulaInput || "?"}</span>
                                  <div className={`absolute -top-5 left-0 text-[7px] text-white px-1 py-0.5 rounded shadow-sm whitespace-nowrap leading-none font-bold font-sans ${c.split(" ")[1]}`}>
                                    {spectatedStudent.name} sedang mengetik
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground/60 italic font-mono text-[10px]">
                                  {studentAnswer || "?"}
                                </span>
                              )
                            ) : (
                              cell.value === "?" ? "?" : (typeof cell.value === "number" ? cell.value.toLocaleString() : cell.value)
                            )}
                          </td>
                        );
                      })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  export function InstructorPanel() {
    const { modules, addCustomStep, deleteCustomStep, students, setRole, peerStates } = useAppStore(
      useShallow((state) => ({
        modules: state.modules,
        addCustomStep: state.addCustomStep,
        deleteCustomStep: state.deleteCustomStep,
        students: state.students,
        setRole: state.setRole,
        peerStates: state.peerStates,
      }))
    );
    const totalStepsCount = modules.reduce((acc, m) => acc + m.steps.length, 0);
    const [activeTab, setActiveTab] = useState<"students" | "create" | "list">("students");
    const [spectatedStudentId, setSpectatedStudentId] = useState<string | null>(null);
    const [viewingStudent, setViewingStudent] = useState<StudentData | null>(null);

    const onlineStudentsCount = Object.values(peerStates).filter(
      (peer) => peer && peer.role === "peserta"
    ).length;

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
      </div>

      {/* Main Panel Content (Scrollable) */}
      <div className="flex-1 h-full overflow-y-auto pr-2 pb-6">
        
        {spectatedStudentId ? (
          /* Live Monitoring Screen delegated to separate optimized component */
          <LiveSpectateView 
            studentId={spectatedStudentId} 
            onBack={() => setSpectatedStudentId(null)} 
          />
        ) : (
          <>
            {/* Tab 1: Students Analytics List */}
            {activeTab === "students" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Progres Belajar Peserta</h1>
                  <p className="text-xs text-muted-foreground">Monitor nilai, tantangan terselesaikan, dan streak keaktifan belajar peserta didik.</p>
                </div>

                {/* Live Online Users Section delegated to separate optimized component */}
                <OnlineStudentsList onSpectate={(id) => setSpectatedStudentId(id)} />

                {/* RLS Policy / Sync Warning Alert */}
                {onlineStudentsCount > 0 && students.length === 0 && (
                  <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 text-xs space-y-1.5 animate-in fade-in duration-200">
                    <p className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
                      Akses Database Terhambat (RLS Policy)
                    </p>
                    <p className="leading-relaxed font-sans">
                      Peserta terdeteksi aktif online, tetapi data tidak tampil pada tabel di bawah. Ini terjadi karena <strong>Row Level Security (RLS) Policy</strong> pada database Supabase Anda membatasi akses baca bagi akun Instruktur.
                    </p>
                    <p className="font-semibold font-sans">
                      Silakan salin dan jalankan script SQL migrasi yang kami sediakan di Supabase SQL Editor Anda untuk membukanya secara instan.
                    </p>
                  </div>
                )}

                {/* Static Students Database Table */}
                <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-4 py-3 bg-muted/10 border-b border-border/60">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Database Seluruh Peserta</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-sans">
                      <thead>
                        <tr className="bg-muted/30 border-b border-border/60 text-muted-foreground font-semibold">
                          <th className="p-4 w-1/4 min-w-[200px]">Peserta</th>
                          <th className="p-4 w-2/4 min-w-[380px] text-left">Tantangan Selesai</th>
                          <th className="p-4 w-1/12 min-w-[90px] text-center">Streak Belajar</th>
                          <th className="p-4 w-1/12 min-w-[100px]">Keaktifan Terakhir</th>
                          <th className="p-4 w-[80px] text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 font-medium">
                        {students.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground text-xs font-sans">
                              Tidak ada data peserta yang terdaftar di database saat ini.
                            </td>
                          </tr>
                        ) : (
                          students.map((student) => (
                            <tr key={student.id} className="hover:bg-muted/15 transition-colors">
                              {/* Participant Profile Column */}
                              <td className="p-4 align-top">
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-bold text-foreground text-sm leading-tight">{student.name}</span>
                                  <span className="font-mono text-[10px] text-muted-foreground/80 break-all">{student.email}</span>
                                </div>
                              </td>

                              {/* Progress Breakdown Column */}
                              <td className="p-4 py-3 align-top">
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground select-none">
                                    <span>Rincian Materi:</span>
                                    <span className="text-emerald-500 font-mono">{student.completedCount} / {totalStepsCount} ({Math.round((student.completedCount / totalStepsCount) * 100)}%)</span>
                                  </div>
                                  <div className="flex flex-col gap-2.5 max-h-[160px] overflow-y-auto pr-1.5 scrollbar-thin">
                                    {modules.map((module) => {
                                      const moduleSteps = module.steps;
                                      const completedModuleSteps = moduleSteps.filter(s => student.completedSteps?.includes(s.id));
                                      return (
                                        <div key={module.id} className="space-y-1">
                                          <div className="text-[9px] font-extrabold text-muted-foreground/80 uppercase tracking-wider flex items-center justify-between select-none">
                                            <span>{module.title}</span>
                                            <span className="text-emerald-500 font-mono">{completedModuleSteps.length}/{moduleSteps.length}</span>
                                          </div>
                                          <div className="flex flex-wrap gap-1">
                                            {moduleSteps.map(step => {
                                              const isCompleted = student.completedSteps?.includes(step.id);
                                              // Extract only formula name (e.g. "Randbetween" instead of "Randbetween (menghasilkan...)")
                                              const shortTitle = step.title.includes("(") 
                                                ? step.title.split("(")[0].trim() 
                                                : step.title.length > 22 
                                                  ? step.title.substring(0, 20) + "..." 
                                                  : step.title;

                                              return (
                                                <span
                                                  key={step.id}
                                                  title={`${module.title} - ${step.title}: ${isCompleted ? 'Selesai' : 'Belum Selesai'}`}
                                                  className={cn(
                                                    "text-[9px] px-1.5 py-0.5 rounded transition-all font-medium border select-none",
                                                    isCompleted
                                                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold"
                                                      : "bg-muted/20 text-muted-foreground/50 border-border/40"
                                                  )}
                                                >
                                                  {shortTitle}
                                                </span>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </td>

                              <td className="p-4 text-center align-top font-bold text-amber-500">
                                <Flame className="h-4 w-4 text-amber-500 fill-amber-500 inline-block mr-1" />
                                {student.streak} Hari
                              </td>

                              {/* Last Active Column */}
                              <td className="p-4 align-top text-muted-foreground text-xs">{student.lastActive}</td>

                              {/* Action Column */}
                              <td className="p-4 align-top text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Lihat Detail Progres"
                                  onClick={() => setViewingStudent(student)}
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md cursor-pointer flex items-center justify-center mx-auto"
                                >
                                  <Eye className="h-4.5 w-4.5" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Student Progress Detail Modal */}
            <Dialog open={!!viewingStudent} onOpenChange={(open) => !open && setViewingStudent(null)}>
              <DialogContent className="max-w-4xl lg:max-w-5xl max-h-[85vh] overflow-y-auto border border-border/80 bg-background/95 backdrop-blur-md">
                {viewingStudent && (
                  <>
                    <DialogHeader className="pb-3 border-b border-border/60">
                      <DialogTitle className="text-xl font-bold flex items-center justify-between">
                        <span>Detail Progres Peserta</span>
                        <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
                          {viewingStudent.completedCount} / {totalStepsCount} Soal Selesai
                        </span>
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground mt-1">
                        Informasi lengkap keaktifan dan tantangan yang telah dikerjakan oleh peserta.
                      </DialogDescription>
                    </DialogHeader>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 select-none">
                      <div className="bg-muted/30 border border-border/40 p-3 rounded-lg flex items-center gap-3">
                        <Users className="h-5 w-5 text-emerald-500" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Nama Peserta</span>
                          <span className="text-xs font-bold text-foreground truncate">{viewingStudent.name}</span>
                        </div>
                      </div>
                      <div className="bg-muted/30 border border-border/40 p-3 rounded-lg flex items-center gap-3">
                        <Flame className="h-5 w-5 text-amber-500 fill-amber-500" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Streak Belajar</span>
                          <span className="text-xs font-bold text-foreground">{viewingStudent.streak} Hari Aktif</span>
                        </div>
                      </div>
                      <div className="bg-muted/30 border border-border/40 p-3 rounded-lg flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Keaktifan Terakhir</span>
                          <span className="text-xs font-bold text-foreground">{viewingStudent.lastActive}</span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Curriculum Progress List */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                        <BookOpen className="h-4 w-4 text-emerald-500" />
                        Peta Progres Materi Kurikulum
                      </h4>
                      <div className="space-y-4">
                        {modules.map((module) => {
                          const moduleSteps = module.steps;
                          const completedModuleSteps = moduleSteps.filter((s) => viewingStudent.completedSteps?.includes(s.id));
                          const percent = Math.round((completedModuleSteps.length / moduleSteps.length) * 100);
                          
                          return (
                            <div key={module.id} className="border border-border/60 rounded-xl p-3.5 bg-muted/10 space-y-2.5">
                              {/* Module Header */}
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <h5 className="text-xs font-bold text-foreground">{module.title}</h5>
                                  <p className="text-[10px] text-muted-foreground">{module.description}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-mono font-bold text-emerald-500">
                                    {completedModuleSteps.length} / {moduleSteps.length}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground block font-mono">
                                    ({percent}%)
                                  </span>
                                </div>
                              </div>

                              {/* Progress bar inside module */}
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>

                              {/* List of Steps in the Module */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1.5">
                                {moduleSteps.map((step) => {
                                  const isCompleted = viewingStudent.completedSteps?.includes(step.id);
                                  return (
                                    <div
                                      key={step.id}
                                      className={cn(
                                        "flex items-start gap-2 p-2 rounded-lg border transition-all text-xs",
                                        isCompleted
                                          ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                          : "bg-background border-border/50 text-muted-foreground/60"
                                      )}
                                    >
                                      {isCompleted ? (
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                                      ) : (
                                        <Circle className="h-4 w-4 shrink-0 text-muted-foreground/45 mt-0.5" />
                                      )}
                                      <div className="flex flex-col min-w-0">
                                        <span className="font-bold truncate">{step.title}</span>
                                        <span className="text-[10px] text-muted-foreground truncate">
                                          {step.shortDescription}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

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
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-500 mr-1 shrink-0" />
                          Kesalahan format: {err.message}
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
          </>
        )}

      </div>
    </div>
  );
}
