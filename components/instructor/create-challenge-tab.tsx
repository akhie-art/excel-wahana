"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";
import { ModuleStep, checkFormula, CellTask, evaluateExcelFormula, ExcelCell } from "@/lib/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "./rich-text-editor";
import { X, ArrowRight, ArrowLeft, Save, FileSpreadsheet, Upload, Trash2, Sparkles, Play, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getColLetter,
  splitCSVLine,
  splitFormulasText,
  convertExcelDataToCSV,
  parseCellRef,
  getQuestionCells,
  CSV_TEMPLATES
} from "./utils";

interface CreateChallengeTabProps {
  editingStepInfo: { step: ModuleStep; moduleId: string } | null;
  onCancelEdit: () => void;
  onSubmitSuccess: () => void;
}

export function CreateChallengeTab({ editingStepInfo, onCancelEdit, onSubmitSuccess }: CreateChallengeTabProps) {
  const { modules, addCustomStep, updateCustomStep } = useAppStore(
    useShallow((state) => ({
      modules: state.modules,
      addCustomStep: state.addCustomStep,
      updateCustomStep: state.updateCustomStep,
    }))
  );

  const [selectedModuleId, setSelectedModuleId] = useState("basics");
  const [stepId, setStepId] = useState("");
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [concept, setConcept] = useState("");
  const [instructions, setInstructions] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [expectedResult, setExpectedResult] = useState("");
  const [validFormulasText, setValidFormulasText] = useState("");
  const [hint, setHint] = useState("");
  const [csvData, setCsvData] = useState("Item, Kategori, Harga\nBuku, Kantor, 12\nPena, Kantor, 8\nTotal, Hitung, ?");
  const [customTasks, setCustomTasks] = useState<Array<{
    label: string;
    resultCell: { row: number; col: number };
    validFormulasText: string;
    expectedResult: string;
    hint: string;
  }>>([]);
  const [testTargetTaskIndex, setTestTargetTaskIndex] = useState(0);
  const [excelMerges, setExcelMerges] = useState<any[]>([]);

  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testFormulaInput, setTestFormulaInput] = useState("");
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [formSubTab, setFormSubTab] = useState<"basic" | "content" | "data">("basic");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);

  // Initialize form state if editing
  useEffect(() => {
    if (editingStepInfo) {
      const { step, moduleId } = editingStepInfo;
      setSelectedModuleId(moduleId);
      setStepId(step.id);
      setTitle(step.title);
      setShortDesc(step.shortDescription);
      setConcept(step.conceptExplanation);
      setInstructions(step.instructions);
      setEditorKey(prev => prev + 1);
      
      const csvText = convertExcelDataToCSV(step.dummyData);
      setCsvData(csvText);

      // Reconstruct merges from dummyData
      const merges: any[] = [];
      step.dummyData.forEach((row, r) => {
        row.cells.forEach((cell, c) => {
          if ((cell.rowSpan && cell.rowSpan > 1) || (cell.colSpan && cell.colSpan > 1)) {
            merges.push({
              s: { r, c },
              e: { r: r + (cell.rowSpan || 1) - 1, c: c + (cell.colSpan || 1) - 1 }
            });
          }
        });
      });
      setExcelMerges(merges);

      // Map tasks back
      if (step.tasks && step.tasks.length > 0) {
        setCustomTasks(step.tasks.map(t => ({
          label: t.label,
          resultCell: t.resultCell,
          validFormulasText: t.validFormulas.join(", "),
          expectedResult: t.expectedResult,
          hint: t.hint,
        })));
      } else {
        setCustomTasks([]);
        setValidFormulasText(step.validFormulas.join(", "));
        setExpectedResult(step.expectedResult);
        setHint(step.hint);
      }

      setTestFormulaInput("");
      setTestResult(null);
      setIsSlugManuallyEdited(true);
      setUploadedFileName(null);
      setUploadedFileSize(null);
    } else {
      // Set to defaults
      setSelectedModuleId("basics");
      setStepId("");
      setTitle("");
      setShortDesc("");
      setConcept("");
      setInstructions("");
      setEditorKey(prev => prev + 1);
      setExpectedResult("");
      setValidFormulasText("");
      setHint("");
      setCsvData("Item, Kategori, Harga\nBuku, Kantor, 12\nPena, Kantor, 8\nTotal, Hitung, ?");
      setCustomTasks([]);
      setExcelMerges([]);
      setIsSlugManuallyEdited(false);
      setUploadedFileName(null);
      setUploadedFileSize(null);
    }
  }, [editingStepInfo]);

  useEffect(() => {
    const qCells = getQuestionCells(csvData);
    setCustomTasks((prev) => {
      return qCells.map((q) => {
        const existing = prev.find(
          (t) => t.resultCell.row === q.row && t.resultCell.col === q.col
        );
        if (existing) return existing;
        
        const colLetter = getColLetter(q.col);
        const rowNum = q.row + 1;
        return {
          label: `Tugas Sel ${colLetter}${rowNum}`,
          resultCell: { row: q.row, col: q.col },
          validFormulasText: "",
          expectedResult: "",
          hint: `Masukkan formula pada sel ${colLetter}${rowNum}`,
        };
      });
    });
  }, [csvData]);

  const handleRemoveFile = () => {
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setCsvData("Item, Kategori, Harga\nBuku, Kantor, 12\nPena, Kantor, 8\nTotal, Hitung, ?");
  };

  const updateCustomTask = (index: number, fields: Partial<typeof customTasks[0]>) => {
    setCustomTasks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...fields };
      return next;
    });
  };

  const handleAutoFillTasks = () => {
    if (customTasks.length <= 1) return;

    try {
      const { headers, dummyData } = parseCSVToExcelData(csvData);

      setCustomTasks((prev) => {
        const next = prev.map(t => ({ ...t }));
        const colIndices = Array.from(new Set(next.map((t) => t.resultCell.col)));

        colIndices.forEach((colIdx) => {
          const colTasks = next.filter((t) => t.resultCell.col === colIdx);
          if (colTasks.length <= 1) return;

          // Find the first task in this column that has a formula filled
          const sourceTask = colTasks.find(t => t.validFormulasText.trim().startsWith("="));
          if (!sourceTask) return;

          const sourceIndex = next.findIndex(
            (t) => t.resultCell.row === sourceTask.resultCell.row && t.resultCell.col === sourceTask.resultCell.col
          );

          if (sourceIndex === -1) return;

          next.forEach((task, idx) => {
            if (task.resultCell.col === colIdx && idx !== sourceIndex) {
              const diff = task.resultCell.row - sourceTask.resultCell.row;

              const formula = sourceTask.validFormulasText.replace(
                /(\$?)([A-Z]+)(\$?)([0-9]+)/gi,
                (match, colAbs, colLetter, rowAbs, rowNumStr) => {
                  if (rowAbs === "$") return match;
                  const rowNum = parseInt(rowNumStr);
                  return `${colAbs}${colLetter}${rowAbs}${rowNum + diff}`;
                }
              );

              const colLetter = getColLetter(task.resultCell.col);
              const rowNum = task.resultCell.row + 1;

              next[idx].label = sourceTask.label.replace(/[A-Z]+[0-9]+/gi, `${colLetter}${rowNum}`);
              next[idx].validFormulasText = formula;
              next[idx].hint = sourceTask.hint.replace(/[A-Z]+[0-9]+/gi, `${colLetter}${rowNum}`);
            }
          });
        });

        const tempTasks: CellTask[] = next.map(t => ({
          label: t.label,
          resultCell: t.resultCell,
          validFormulas: [t.validFormulasText],
          expectedResult: t.expectedResult,
          hint: t.hint
        }));
        const tempAnswers = next.map(t => t.validFormulasText);

        next.forEach((task, idx) => {
          if (!task.validFormulasText.trim().startsWith("=")) return;
          try {
            const result = evaluateExcelFormula(task.validFormulasText, dummyData, headers, tempAnswers, tempTasks);
            if (result !== "#VALUE!" && result !== "#NAME?" && result !== "#N/A" && result !== undefined) {
              if (typeof result === "boolean") {
                next[idx].expectedResult = String(result).toUpperCase();
              } else if (typeof result === "number") {
                next[idx].expectedResult = String(result);
              } else {
                next[idx].expectedResult = String(result);
              }
            }
          } catch (err) {
            // Keep existing expected result
          }
        });

        return next;
      });

      setStatusMessage({
        type: "success",
        text: "Berhasil mengisi otomatis (Auto-Fill) semua sel target berdasarkan baris pertama! Semua rumus telah disesuaikan dan hasil target dihitung secara otomatis.",
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: `Gagal melakukan Auto-Fill: ${err.message}`,
      });
    }
  };

  // Real-time validations
  const isSlugDuplicate = editingStepInfo
    ? modules.some((m) => m.steps.some((s) => s.id === stepId.trim().toLowerCase() && s.id !== editingStepInfo.step.id))
    : modules.some((m) => m.steps.some((s) => s.id === stepId.trim().toLowerCase()));
  const isSlugInvalid = stepId.trim() !== "" && !/^[a-z0-9-]+$/.test(stepId.trim());

  let isCsvInvalid = false;
  if (csvData.trim()) {
    try {
      const lines = csvData.trim().split("\n");
      if (lines.length >= 2) {
        let questionMarkFound = false;
        lines.forEach(line => {
          if (splitCSVLine(line).includes("?")) {
            questionMarkFound = true;
          }
        });
        if (!questionMarkFound) isCsvInvalid = true;
      } else {
        isCsvInvalid = true;
      }
    } catch {
      isCsvInvalid = true;
    }
  }

  const isFormulaListInvalid = validFormulasText.trim() !== "" && splitFormulasText(validFormulasText)
    .map((f) => f.trim())
    .some((f) => f !== "" && !f.startsWith("="));

  const isAnyTaskFormulaInvalid = customTasks.length > 1
    ? customTasks.some(t => {
        if (!t.validFormulasText.trim()) return true;
        return splitFormulasText(t.validFormulasText)
          .map((f) => f.trim())
          .some((f) => f !== "" && !f.startsWith("="));
      })
    : isFormulaListInvalid;

  const isMultiTaskIncomplete = customTasks.length > 1 && customTasks.some(
    (t) => !t.label.trim() || !t.expectedResult.trim() || !t.validFormulasText.trim()
  );

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTestFormula = () => {
    setTestResult(null);
    if (!testFormulaInput.trim()) {
      setTestResult({ success: false, message: "Ketik rumus terlebih dahulu untuk menguji." });
      return;
    }
    if (!testFormulaInput.trim().startsWith("=")) {
      setTestResult({ success: false, message: "Rumus harus diawali dengan tanda sama dengan (=)." });
      return;
    }

    try {
      const { headers: computedHeaders, dummyData: computedDummyData } = parseCSVToExcelData(csvData);

      let testExpected = expectedResult.trim();
      let testValids = splitFormulasText(validFormulasText)
        .map((f) => f.trim())
        .filter((f) => f.startsWith("="));

      let testLabel = "target";

      if (customTasks.length > 1) {
        const activeTask = customTasks[testTargetTaskIndex];
        if (activeTask) {
          testExpected = activeTask.expectedResult.trim();
          testValids = splitFormulasText(activeTask.validFormulasText)
            .map((f) => f.trim())
            .filter((f) => f.startsWith("="));
          const colLetter = getColLetter(activeTask.resultCell.col);
          const rowNum = activeTask.resultCell.row + 1;
          testLabel = `sel ${colLetter}${rowNum}`;
        }
      }

      const isValid = checkFormula(
        testFormulaInput,
        testValids.length > 0 ? testValids : [testFormulaInput],
        testExpected,
        computedDummyData,
        computedHeaders,
        [],
        []
      );

      if (isValid) {
        setTestResult({
          success: true,
          message: `Rumus "${testFormulaInput}" VALID! Rumus menghasilkan nilai yang cocok dengan target "${testExpected}" untuk ${testLabel}.`
        });
      } else {
        setTestResult({
          success: false,
          message: `Rumus "${testFormulaInput}" TIDAK VALID. Rumus tidak menghasilkan nilai "${testExpected}" yang diharapkan untuk ${testLabel}.`
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Kesalahan saat menguji: ${err.message}`
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = evt.target?.result;
        if (!data) return;

        let csvContent = "";
        const extractedTasks: Array<{
          label: string;
          resultCell: { row: number; col: number };
          validFormulasText: string;
          expectedResult: string;
          hint: string;
        }> = [];

        if (file.name.endsWith(".csv")) {
          const text = new TextDecoder().decode(new Uint8Array(data as ArrayBuffer));
          csvContent = text;
          setExcelMerges([]);
        } else {
          const XLSX = await import("xlsx");
          const workbook = XLSX.read(data, { type: "array", cellFormula: true });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const merges = worksheet["!merges"] || [];
          setExcelMerges(merges);

          for (const cellRef in worksheet) {
            if (cellRef.startsWith("!")) continue;
            const cell = worksheet[cellRef];
            if (cell && cell.f) {
              const coord = parseCellRef(cellRef);
              if (coord) {
                const cellVal = cell.v !== undefined ? String(cell.v) : (cell.w !== undefined ? String(cell.w) : "");
                const cellForm = "=" + cell.f;
                const colLetter = cellRef.match(/^[A-Z]+/)?.[0] || "";
                const rowNum = cellRef.match(/[0-9]+$/)?.[0] || "";

                extractedTasks.push({
                  label: `Tugas Sel ${colLetter}${rowNum}`,
                  resultCell: coord,
                  validFormulasText: cellForm,
                  expectedResult: cellVal,
                  hint: `Gunakan rumus untuk mengisi sel ${colLetter}${rowNum}`,
                });

                worksheet[cellRef] = {
                  t: "s",
                  v: "?"
                };
              }
            }
          }
          csvContent = XLSX.utils.sheet_to_csv(worksheet);
        }

        if (!csvContent.trim()) {
          throw new Error("File kosong atau tidak dapat diurai.");
        }

        if (extractedTasks.length > 0) {
          setCustomTasks(extractedTasks);
          
          if (extractedTasks.length === 1) {
            setValidFormulasText(extractedTasks[0].validFormulasText);
            setExpectedResult(extractedTasks[0].expectedResult);
            setHint(extractedTasks[0].hint);
            setStatusMessage({
              type: "success",
              text: `Berhasil mengurai file Excel "${file.name}". Kunci Rumus ("${extractedTasks[0].validFormulasText}") and Nilai Hasil Target ("${extractedTasks[0].expectedResult}") otomatis terisi!`
            });
          } else {
            setStatusMessage({
              type: "success",
              text: `Berhasil mengurai file Excel "${file.name}" dengan ${extractedTasks.length} rumus aktif. Konfigurasi rumus dan hasil untuk masing-masing sel telah dimuat secara otomatis di tab 3. Jika ada sel target "?" tambahan yang kosong/tanpa rumus, silakan isi manual.`
            });
          }
        } else {
          setStatusMessage({
            type: "success",
            text: file.name.endsWith(".csv")
              ? `File CSV "${file.name}" berhasil diunggah. Silakan tandai sel target dengan "?" dan isi Kunci Rumus serta Nilai Hasil secara manual.`
              : `File Excel "${file.name}" berhasil diunggah tetapi tidak ditemukan rumus aktif (seperti =SUM atau =AVERAGE). Pastikan sel Excel Anda menggunakan formula asli, atau isi Kunci Rumus dan Nilai Hasil secara manual.`
          });
        }

        setCsvData(csvContent.trim());
        setUploadedFileName(file.name);
        const sizeKb = (file.size / 1024).toFixed(1);
        setUploadedFileSize(`${sizeKb} KB`);
      } catch (err: any) {
        setStatusMessage({
          type: "error",
          text: `Gagal membaca file: ${err.message || "Pastikan file berformat CSV atau Excel yang valid."}`
        });
      }
    };
    reader.onerror = () => {
      setStatusMessage({
        type: "error",
        text: "Kesalahan saat membaca file."
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const parseCSVToExcelData = (text: string) => {
    try {
      const lines = text.trim().split("\n");
      if (lines.length < 2) throw new Error("CSV minimal harus memiliki 2 baris (header dan data)");

      const colCount = splitCSVLine(lines[0]).length;
      const headers = ["", ...Array.from({ length: colCount }, (_, i) => getColLetter(i))];

      let firstResultCell: { row: number; col: number } | null = null;
      let questionMarkFound = false;

      const dummyData = lines.map((line, rowIdx) => {
        const columns = splitCSVLine(line);
        
        const cells = columns.map((colVal, colIdx) => {
          const isHeader = rowIdx === 0;
          const isQuestion = colVal === "?";
          
          if (isQuestion) {
            if (!firstResultCell) {
              firstResultCell = { row: rowIdx, col: colIdx };
            }
            questionMarkFound = true;
          }

          const numericVal = Number(colVal);
          const value = isNaN(numericVal) || colVal === "" ? colVal : numericVal;

          return {
            value,
            header: isHeader,
            highlight: isQuestion || (!isHeader && typeof value === "number"),
          } as ExcelCell;
        });

        return {
          rowNum: rowIdx + 1,
          cells,
        };
      });

      if (!questionMarkFound) {
        throw new Error("CSV harus menyertakan minimal satu sel tanda tanya '?' sebagai penanda target formula.");
      }

      if (excelMerges && excelMerges.length > 0) {
        excelMerges.forEach((range: any) => {
          const startRow = range.s.r;
          const startCol = range.s.c;
          const endRow = range.e.r;
          const endCol = range.e.c;

          if (startRow < dummyData.length && startCol < colCount) {
            const rowSpan = endRow - startRow + 1;
            const colSpan = endCol - startCol + 1;

            const targetRow = dummyData[startRow];
            if (targetRow && targetRow.cells[startCol]) {
              targetRow.cells[startCol].rowSpan = rowSpan;
              targetRow.cells[startCol].colSpan = colSpan;
            }

            for (let r = startRow; r <= endRow; r++) {
              for (let c = startCol; c <= endCol; c++) {
                if (r === startRow && c === startCol) continue;
                if (dummyData[r] && dummyData[r].cells[c]) {
                  dummyData[r].cells[c].mergedHidden = true;
                }
              }
            }
          }
        });
      }

      return { headers, dummyData, resultCell: firstResultCell || { row: 0, col: 0 } };
    } catch (err: any) {
      throw new Error(err.message || "Gagal mengurai CSV data");
    }
  };

  const handleCreateStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const isFormIncomplete = customTasks.length > 1
      ? (!stepId || !title || !shortDesc || !concept || !instructions)
      : (!stepId || !title || !shortDesc || !concept || !instructions || !expectedResult || !validFormulasText || !hint);

    if (isFormIncomplete) {
      setStatusMessage({ type: "error", text: "Mohon isi semua bidang formulir dengan lengkap." });
      return;
    }

    try {
      const { headers, dummyData, resultCell } = parseCSVToExcelData(csvData);

      let finalTasks: CellTask[] | undefined = undefined;
      let finalValidFormulas: string[] = [];
      let finalExpectedResult = "";
      let finalResultCell = resultCell;
      let finalHint = "";

      if (customTasks.length > 1) {
        for (let i = 0; i < customTasks.length; i++) {
          const t = customTasks[i];
          if (!t.label.trim() || !t.expectedResult.trim() || !t.validFormulasText.trim()) {
            throw new Error(`Mohon lengkapi semua bidang untuk Tugas Sel ${getColLetter(t.resultCell.col)}${t.resultCell.row + 1}`);
          }
          const taskFormulas = splitFormulasText(t.validFormulasText).map(f => f.trim()).filter(f => f.startsWith("="));
          if (taskFormulas.length === 0) {
            throw new Error(`Rumus untuk Tugas Sel ${getColLetter(t.resultCell.col)}${t.resultCell.row + 1} tidak valid.`);
          }
        }
        
        finalTasks = customTasks.map(t => ({
          label: t.label.trim(),
          resultCell: t.resultCell,
          validFormulas: splitFormulasText(t.validFormulasText).map(f => f.trim()).filter(f => f.startsWith("=")),
          expectedResult: t.expectedResult.trim(),
          hint: t.hint.trim(),
        }));

        finalValidFormulas = finalTasks[0].validFormulas;
        finalExpectedResult = finalTasks[0].expectedResult;
        finalResultCell = finalTasks[0].resultCell;
        finalHint = finalTasks[0].hint;
      } else {
        const validFormulas = splitFormulasText(validFormulasText)
          .map((f) => f.trim())
          .filter((f) => f.startsWith("="));

        if (validFormulas.length === 0) {
          throw new Error("Sediakan minimal satu rumus valid dan harus diawali dengan tanda '='");
        }

        finalValidFormulas = validFormulas;
        finalExpectedResult = expectedResult.trim();
        finalResultCell = resultCell;
        finalHint = hint.trim();
      }

      const newStep: ModuleStep = {
        id: stepId.trim().toLowerCase(),
        title: title.trim(),
        shortDescription: shortDesc.trim(),
        conceptExplanation: concept.trim(),
        instructions: instructions.trim(),
        headers,
        dummyData,
        validFormulas: finalValidFormulas,
        expectedResult: finalExpectedResult,
        resultCell: finalResultCell,
        hint: finalHint,
        tasks: finalTasks,
        isCustom: true
      };

      if (editingStepInfo !== null) {
        await updateCustomStep(selectedModuleId, newStep);
        onSubmitSuccess();
      } else {
        await addCustomStep(selectedModuleId, newStep);
        onSubmitSuccess();
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Gagal membuat tantangan baru." });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-border/60 gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
            {editingStepInfo !== null ? "Edit Tantangan Excel" : "Buat Tantangan Excel Baru"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {editingStepInfo !== null ? "Perbarui detail latihan rumus interaktif Anda di bawah." : "Tambahkan latihan rumus interaktif yang aman dan teruji ke dalam kurikulum."}
          </p>
        </div>
        {editingStepInfo !== null && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancelEdit}
            className="h-8 px-3 text-[10px] text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg flex items-center gap-1.5 shrink-0 font-bold border border-rose-500/20"
          >
            <X className="h-3.5 w-3.5" />
            Batal Edit
          </Button>
        )}
        
        {/* Wizard Navigation */}
        <div className="flex bg-muted/60 p-1 rounded-xl border border-border/50 text-[10px] md:text-xs font-bold shrink-0 self-start md:self-auto select-none">
          <button
            type="button"
            onClick={() => setFormSubTab("basic")}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
              formSubTab === "basic"
                ? "bg-card text-emerald-500 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            1. Info Umum
          </button>
          <button
            type="button"
            onClick={() => setFormSubTab("content")}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
              formSubTab === "content"
                ? "bg-card text-emerald-500 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            2. Narasi & Tugas
          </button>
          <button
            type="button"
            onClick={() => setFormSubTab("data")}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
              formSubTab === "data"
                ? "bg-card text-emerald-500 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            3. Kisi & Rumus
          </button>
        </div>
      </div>

      <form onSubmit={(e) => {
        handleCreateStep(e);
        setFormSubTab("basic");
      }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column - Form Wizard (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          {statusMessage && (
            <div
              className={cn(
                "p-4 rounded-xl text-xs font-semibold leading-relaxed border animate-in slide-in-from-top-2 duration-200",
                statusMessage.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-500"
              )}
            >
              {statusMessage.text}
            </div>
          )}

          {/* Sub Tab: Basic Info */}
          {formSubTab === "basic" && (
            <Card className="border border-border/80 bg-card/60 backdrop-blur-md shadow-xs animate-in fade-in duration-200">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-bold text-foreground">Informasi Dasar Tantangan</CardTitle>
                <CardDescription className="text-xs">Tentukan modul tujuan, judul latihan, dan ID slug unik.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {/* Module Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Modul Induk</label>
                  <select
                    value={selectedModuleId}
                    onChange={(e) => setSelectedModuleId(e.target.value)}
                    className="w-full rounded-lg border border-border/80 bg-background/50 h-10 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>

                {/* Challenge Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Judul Tantangan</label>
                  <Input
                    type="text"
                    placeholder="misal: Menghitung Biaya Operasional"
                    value={title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTitle(val);
                      if (!isSlugManuallyEdited) {
                        setStepId(slugify(val));
                      }
                    }}
                    className="h-10 text-xs bg-background/50 border-border/80 focus-visible:ring-emerald-500/50 font-medium"
                    required
                  />
                </div>

                {/* Step Slug ID */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      ID Tantangan (Slug) {editingStepInfo !== null && <span className="text-[9px] text-amber-500 lowercase font-normal">(tidak dapat diubah)</span>}
                    </label>
                    {isSlugDuplicate && (
                      <span className="text-[10px] text-rose-500 font-bold bg-rose-500/5 border border-rose-500/10 px-2 py-0.5 rounded animate-bounce">ID Sudah Digunakan</span>
                    )}
                    {isSlugInvalid && (
                      <span className="text-[10px] text-rose-500 font-bold bg-rose-500/5 border border-rose-500/10 px-2 py-0.5 rounded">ID Tidak Valid</span>
                    )}
                  </div>
                  <Input
                    type="text"
                    placeholder="misal: sum-operasional"
                    value={stepId}
                    onChange={(e) => {
                      setStepId(e.target.value);
                      setIsSlugManuallyEdited(true);
                    }}
                    disabled={editingStepInfo !== null}
                    className={cn(
                      "h-10 text-xs bg-background/50 font-mono focus-visible:ring-emerald-500/50",
                      (isSlugDuplicate || isSlugInvalid) ? "border-rose-500/60 focus-visible:ring-rose-500/50" : "border-border/80",
                      editingStepInfo !== null && "opacity-60 cursor-not-allowed bg-muted/30"
                    )}
                    required
                  />
                  <p className="text-[10px] text-muted-foreground">ID unik digunakan sebagai pengenal sistem. Hanya huruf kecil, angka, dan tanda hubung.</p>
                </div>

                {/* Short Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Deskripsi Singkat</label>
                  <textarea
                    placeholder="misal: Jumlahkan biaya tim operasional kantor bulan ini"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="w-full min-h-[60px] rounded-lg border border-border/80 bg-background/50 p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="py-3 bg-muted/20 border-t border-border/50 flex justify-end">
                <Button
                  type="button"
                  onClick={() => setFormSubTab("content")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  Lanjut ke Narasi
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Sub Tab: Learning Content */}
          {formSubTab === "content" && (
            <Card className="border border-border/80 bg-card/60 backdrop-blur-md shadow-xs animate-in fade-in duration-200">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-bold text-foreground">Narasi & Petunjuk Tugas</CardTitle>
                <CardDescription className="text-xs">Tuliskan penjelasan teori dan instruksi latihan secara bertahap.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {/* Concept Explanation */}
                <RichTextEditor
                  label="Penjelasan Konsep (Teori)"
                  value={concept}
                  onChange={setConcept}
                  editorKey={editorKey}
                  editingStepId={editingStepInfo ? editingStepInfo.step.id : null}
                  formSubTab={formSubTab}
                  minHeightClass="min-h-[120px]"
                />

                {/* Instructions */}
                <RichTextEditor
                  label="Instruksi Tugas (Praktik)"
                  value={instructions}
                  onChange={setInstructions}
                  editorKey={editorKey}
                  editingStepId={editingStepInfo ? editingStepInfo.step.id : null}
                  formSubTab={formSubTab}
                  minHeightClass="min-h-[100px]"
                />

                {/* Hint */}
                {customTasks.length <= 1 ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Petunjuk (Hint) Bantuan</label>
                    <Input
                      type="text"
                      placeholder="misal: Anda dapat mengetikkan formula =SUM(B2:B3)"
                      value={hint}
                      onChange={(e) => setHint(e.target.value)}
                      className="h-10 text-xs bg-background/50 border-border/80 focus-visible:ring-emerald-500/50"
                      required
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-muted/40 border border-border/60 rounded-lg text-xs text-muted-foreground select-none font-sans">
                    Tantangan menggunakan banyak sel target. Konfigurasi petunjuk (hint) dilakukan untuk masing-masing sel di tab <strong>3. Kisi & Rumus</strong>.
                  </div>
                )}
              </CardContent>
              <CardFooter className="py-3 bg-muted/20 border-t border-border/50 flex justify-between">
                <Button
                  type="button"
                  onClick={() => setFormSubTab("basic")}
                  variant="ghost"
                  className="text-xs font-bold border border-border/60 hover:bg-muted cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Kembali
                </Button>
                <Button
                  type="button"
                  onClick={() => setFormSubTab("data")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  Lanjut to Kisi data
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Sub Tab: Spreadsheet Data & Validation */}
          {formSubTab === "data" && (
            <Card className="border border-border/80 bg-card/60 backdrop-blur-md shadow-xs animate-in fade-in duration-200">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-bold text-foreground">Desain Data & Kunci Jawaban</CardTitle>
                <CardDescription className="text-xs">Unggah data tabel, dan tentukan rumus valid beserta hasil target.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                
                {/* CSV File Upload & Editor Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between select-none">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                      <FileSpreadsheet className="h-4 w-4 mr-1 text-emerald-500" />
                      Data Spreadsheet (Format CSV / Excel)
                    </label>
                    {isCsvInvalid && (
                      <span className="text-[10px] text-rose-500 font-bold bg-rose-500/5 border border-rose-500/10 px-2 py-0.5 rounded animate-pulse">Karakter ? Diperlukan</span>
                    )}
                  </div>

                  {/* Upload Area */}
                  {uploadedFileName ? (
                    <div className="flex items-center justify-between p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl animate-in fade-in duration-200">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                          <FileSpreadsheet className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                            {uploadedFileName}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {uploadedFileSize}
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative group border border-dashed border-border/80 hover:border-emerald-500/50 bg-background/30 rounded-xl p-3 text-center transition-all duration-200 cursor-pointer">
                      <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Upload className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[10px] font-bold text-foreground">
                          Unggah File CSV / Excel (.csv, .xlsx, .xls)
                        </span>
                        <span className="text-[8px] text-muted-foreground">
                          Atau seret file Anda ke sini
                        </span>
                      </div>
                    </div>
                  )}

                  <textarea
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    className={cn(
                      "w-full min-h-[90px] rounded-lg border bg-background/50 p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono",
                      isCsvInvalid ? "border-rose-500/60 focus:ring-rose-500/50" : "border-border/80"
                    )}
                    placeholder="Masukkan format data CSV..."
                    required
                  />

                  {/* Templates Selector */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5 bg-muted/20 border border-border/40 p-2 rounded-lg">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mr-1">Gunakan Templat:</span>
                    {CSV_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.name}
                        type="button"
                        onClick={() => {
                          setStepId(tmpl.slug);
                          setTitle(tmpl.title);
                          setShortDesc(tmpl.desc);
                          setCsvData(tmpl.csv);
                          setValidFormulasText(tmpl.formulas);
                          setExpectedResult(tmpl.result);
                          setHint(tmpl.hint);
                          setConcept(tmpl.concept);
                          setInstructions(tmpl.instructions);
                          setEditorKey(prev => prev + 1);
                          setTestFormulaInput("");
                          setTestResult(null);
                          setIsSlugManuallyEdited(false);
                          setUploadedFileName(null);
                          setUploadedFileSize(null);
                          setExcelMerges([]);
                        }}
                        className="text-[9px] px-2 py-0.5 rounded bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border/60 transition-colors font-medium cursor-pointer"
                      >
                        {tmpl.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Result & Formulas grid */}
                {customTasks.length > 1 ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 select-none flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
                          <Sparkles className="h-4 w-4" />
                          Konfigurasi Banyak Sel Target ({customTasks.length})
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-sans">
                          Tantangan ini memiliki lebih dari satu sel target. Konfigurasikan label, kunci rumus, hasil, dan petunjuk untuk setiap sel.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={handleAutoFillTasks}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                      >
                        <Sparkles className="h-3 w-3" />
                        Isi Otomatis (Auto-Fill)
                      </Button>
                    </div>
                    
                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1.5 scrollbar-thin">
                      {customTasks.map((task, index) => {
                        const colLetter = getColLetter(task.resultCell.col);
                        const rowNum = task.resultCell.row + 1;
                        const cellRef = `${colLetter}${rowNum}`;

                        const isTaskIncomplete = !task.label.trim() || !task.expectedResult.trim() || !task.validFormulasText.trim();
                        const isTaskFormulaInvalid = task.validFormulasText.trim() !== "" && splitFormulasText(task.validFormulasText)
                          .map((f) => f.trim())
                          .some((f) => f !== "" && !f.startsWith("="));

                        return (
                          <Card 
                            key={index} 
                            className={cn(
                              "border shadow-xs p-3 space-y-3 transition-colors",
                              (isTaskIncomplete || isTaskFormulaInvalid)
                                ? "border-rose-500/30 bg-rose-500/[0.02]"
                                : "border-border/80 bg-background/40"
                            )}
                          >
                            <div className="flex justify-between items-center select-none">
                              <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5 font-mono">
                                <span className="h-2 w-2 rounded-full bg-amber-500 inline-block animate-pulse"></span>
                                Target Sel: {cellRef}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {/* Label Tugas */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nama/Label Tugas</label>
                                <Input
                                  type="text"
                                  placeholder="misal: Total Belanja (SUM)"
                                  value={task.label}
                                  onChange={(e) => updateCustomTask(index, { label: e.target.value })}
                                  className={cn(
                                    "h-8 text-xs bg-background/50 focus-visible:ring-emerald-500/50",
                                    !task.label.trim() ? "border-rose-500 focus-visible:ring-rose-500" : "border-border/80"
                                  )}
                                  required
                                />
                                {!task.label.trim() && (
                                  <p className="text-[9px] text-rose-500 font-semibold mt-0.5 select-none animate-in fade-in duration-150">
                                    Nama tugas tidak boleh kosong
                                  </p>
                                )}
                              </div>

                              {/* Expected Result */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nilai Hasil Target</label>
                                <Input
                                  type="text"
                                  placeholder="misal: 19000"
                                  value={task.expectedResult}
                                  onChange={(e) => updateCustomTask(index, { expectedResult: e.target.value })}
                                  className={cn(
                                    "h-8 text-xs bg-background/50 font-mono focus-visible:ring-emerald-500/50",
                                    !task.expectedResult.trim() ? "border-rose-500 focus-visible:ring-rose-500" : "border-border/80"
                                  )}
                                  required
                                />
                                {!task.expectedResult.trim() && (
                                  <p className="text-[9px] text-rose-500 font-semibold mt-0.5 select-none animate-in fade-in duration-150">
                                    Hasil target tidak boleh kosong
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {/* Valid Formulas */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Kunci Rumus Valid</label>
                                <Input
                                  type="text"
                                  placeholder="misal: =SUM(D2:D4)"
                                  value={task.validFormulasText}
                                  onChange={(e) => updateCustomTask(index, { validFormulasText: e.target.value })}
                                  className={cn(
                                    "h-8 text-xs bg-background/50 font-mono focus-visible:ring-emerald-500/50",
                                    (!task.validFormulasText.trim() || isTaskFormulaInvalid) ? "border-rose-500 focus-visible:ring-rose-500" : "border-border/80"
                                  )}
                                  required
                                />
                                {!task.validFormulasText.trim() ? (
                                  <p className="text-[9px] text-rose-500 font-semibold mt-0.5 select-none animate-in fade-in duration-150">
                                    Kunci rumus tidak boleh kosong
                                  </p>
                                ) : isTaskFormulaInvalid ? (
                                  <p className="text-[9px] text-rose-500 font-semibold mt-0.5 select-none animate-in fade-in duration-150">
                                    Rumus harus diawali dengan "="
                                  </p>
                                ) : null}
                              </div>

                              {/* Hint */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Petunjuk (Hint) Bantuan</label>
                                <Input
                                  type="text"
                                  placeholder="misal: Gunakan fungsi SUM"
                                  value={task.hint}
                                  onChange={(e) => updateCustomTask(index, { hint: e.target.value })}
                                  className={cn(
                                    "h-8 text-xs bg-background/50 focus-visible:ring-emerald-500/50",
                                    !task.hint.trim() ? "border-rose-500 focus-visible:ring-rose-500" : "border-border/80"
                                  )}
                                  required
                                />
                                {!task.hint.trim() && (
                                  <p className="text-[9px] text-rose-500 font-semibold mt-0.5 select-none animate-in fade-in duration-150">
                                    Petunjuk bantuan tidak boleh kosong
                                  </p>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Expected Result */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nilai Hasil Target</label>
                      <Input
                        type="text"
                        placeholder="misal: 250000 atau $12.50"
                        value={expectedResult}
                        onChange={(e) => setExpectedResult(e.target.value)}
                        className={cn(
                          "h-10 text-xs bg-background/50 font-mono focus-visible:ring-emerald-500/50",
                          !expectedResult.trim() ? "border-rose-500 focus-visible:ring-rose-500" : "border-border/80"
                        )}
                        required
                      />
                      {!expectedResult.trim() && (
                        <p className="text-[9px] text-rose-500 font-semibold mt-0.5 select-none font-sans">
                          Hasil target tidak boleh kosong
                        </p>
                      )}
                    </div>

                    {/* Valid Formulas List */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Kunci Rumus Valid</label>
                        {isFormulaListInvalid && (
                          <span className="text-[10px] text-rose-500 font-bold bg-rose-500/5 border border-rose-500/10 px-2 py-0.5 rounded animate-pulse">Gunakan '='</span>
                        )}
                      </div>
                      <Input
                        type="text"
                        placeholder="misal: =SUM(D2:D4), =D2+D3+D4"
                        value={validFormulasText}
                        onChange={(e) => setValidFormulasText(e.target.value)}
                        className={cn(
                          "h-10 text-xs bg-background/50 font-mono focus-visible:ring-emerald-500/50",
                          (!validFormulasText.trim() || isFormulaListInvalid) ? "border-rose-500 focus-visible:ring-rose-500" : "border-border/80"
                        )}
                        required
                      />
                      {!validFormulasText.trim() ? (
                        <p className="text-[9px] text-rose-500 font-semibold mt-0.5 select-none font-sans">
                          Kunci rumus tidak boleh kosong
                        </p>
                      ) : isFormulaListInvalid ? (
                        <p className="text-[9px] text-rose-500 font-semibold mt-0.5 select-none font-sans">
                          Rumus harus diawali dengan "="
                        </p>
                      ) : null}
                      <p className="text-[9px] text-muted-foreground mt-1">Pisahkan beberapa rumus menggunakan tanda koma.</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="py-3 bg-muted/20 border-t border-border/50 flex justify-between items-center gap-4">
                <Button
                  type="button"
                  onClick={() => setFormSubTab("content")}
                  variant="ghost"
                  className="text-xs font-bold border border-border/60 hover:bg-muted cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Kembali
                </Button>
                
                <div className="flex flex-col items-end gap-1 min-w-0">
                  {/* Validation warning text */}
                  {(isSlugDuplicate || isSlugInvalid || isCsvInvalid || (customTasks.length > 1 ? (isAnyTaskFormulaInvalid || isMultiTaskIncomplete) : isFormulaListInvalid)) && (
                    <div className="text-[10px] text-rose-500 font-semibold text-right leading-tight max-w-[200px] sm:max-w-xs md:max-w-md">
                      {isSlugDuplicate ? "• ID Tantangan sudah digunakan" :
                       isSlugInvalid ? "• ID Tantangan tidak valid (a-z, 0-9, -)" :
                       isCsvInvalid ? "• Data CSV harus memiliki minimal satu sel target '?'" :
                       customTasks.length > 1 ? "• Ada kesalahan pengisian pada target sel (periksa tanda merah di atas)" :
                       isFormulaListInvalid ? "• Kunci rumus harus diawali dengan '='" : ""}
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={isSlugDuplicate || isSlugInvalid || isCsvInvalid || (customTasks.length > 1 ? (isAnyTaskFormulaInvalid || isMultiTaskIncomplete) : isFormulaListInvalid)}
                    className={cn(
                      "text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all shadow-xs",
                      (isSlugDuplicate || isSlugInvalid || isCsvInvalid || (customTasks.length > 1 ? (isAnyTaskFormulaInvalid || isMultiTaskIncomplete) : isFormulaListInvalid))
                        ? "bg-muted text-muted-foreground border border-border cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-500"
                    )}
                  >
                    <Save className="h-3.5 w-3.5" />
                    {editingStepInfo !== null ? "Perbarui Tantangan" : "Simpan Tantangan"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Right Column - Sandbox Live Preview & Test Panel (Col 5) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-4">
          <Card className="border border-border/80 bg-card/40 shadow-xs">
            <CardHeader className="py-4 border-b border-border/50">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 select-none">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Pratinjau Sandbox Spreadsheet
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Live Grid Preview */}
              {csvData.trim() ? (
                (() => {
                  try {
                    const { headers, dummyData, resultCell } = parseCSVToExcelData(csvData);
                    const resultCellLabel = getColLetter(resultCell.col) + (resultCell.row + 1);
                    
                    const targetCellLabels = customTasks.map(t => {
                      const colLetter = getColLetter(t.resultCell.col);
                      const rowNum = t.resultCell.row + 1;
                      return `${colLetter}${rowNum}`;
                    }).join(", ");

                    return (
                      <div className="space-y-2 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground bg-muted/40 p-2 rounded border border-border/50 select-none">
                          <span className="flex items-center gap-1">
                            <FileSpreadsheet className="h-3 w-3 text-emerald-500" />
                            Kisi Tabel Aktif
                          </span>
                          <span className="bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20 px-2 py-0.5 rounded font-mono">
                            Sel Target: {customTasks.length > 1 ? `Ganda (${targetCellLabels})` : resultCellLabel}
                          </span>
                        </div>

                        <div className="overflow-x-auto max-w-full rounded-lg border border-border bg-card shadow-xs">
                          <table className="w-full text-left border-collapse font-mono text-[10px] table-fixed">
                            <thead>
                              <tr className="bg-muted/40 border-b border-border">
                                {headers.map((h, i) => (
                                  <th key={i} className="p-2 text-center border-r border-border text-muted-foreground font-bold bg-muted/20 select-none w-20">
                                    {i === 0 ? "" : getColLetter(i - 1)}
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
                                    if (cell.mergedHidden) return null;
                                    const isResult = cell.value === "?";
                                    return (
                                      <td
                                        key={cIdx}
                                        rowSpan={cell.rowSpan}
                                        colSpan={cell.colSpan}
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
                      </div>
                    );
                  } catch (err: any) {
                    return (
                      <div className="text-[10px] text-rose-500 font-mono italic p-3 bg-rose-500/5 rounded-lg border border-rose-500/20 select-none flex items-start gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>Format Data CSV Error: {err.message}</span>
                      </div>
                    );
                  }
                })()
              ) : (
                <div className="text-[10px] text-muted-foreground italic text-center p-8 border border-dashed border-border/80 rounded-lg">
                  Belum ada data spreadsheet. Tulis data CSV atau pilih salah satu templat soal di kiri.
                </div>
              )}

              {/* Formula Testing sandbox */}
              <div className="space-y-2.5 p-3.5 rounded-xl border border-border/80 bg-muted/10 shadow-inner">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                  <Play className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
                  Kotak Uji Coba Rumus
                </label>
                <p className="text-[10px] text-muted-foreground font-sans">Uji rumus Anda sebelum menyimpan untuk memastikan penilaian sistem berjalan normal.</p>
                
                {customTasks.length > 1 && (
                  <div className="space-y-1 select-none">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pilih Sel Target Untuk Diuji</label>
                    <select
                      value={testTargetTaskIndex}
                      onChange={(e) => setTestTargetTaskIndex(parseInt(e.target.value))}
                      className="w-full rounded-lg border border-border/80 bg-background/50 h-8 px-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      {customTasks.map((t, idx) => {
                        const colLetter = getColLetter(t.resultCell.col);
                        const rowNum = t.resultCell.row + 1;
                        return (
                          <option key={idx} value={idx}>
                            {t.label} (Sel {colLetter}${rowNum})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="misal: =SUM(D2:D4)"
                    value={testFormulaInput}
                    onChange={(e) => setTestFormulaInput(e.target.value)}
                    className="h-10 text-xs bg-background/50 border-border/80 focus-visible:ring-blue-500/50"
                  />
                  <Button
                    type="button"
                    onClick={handleTestFormula}
                    className="h-10 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-4 flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Uji Rumus
                  </Button>
                </div>

                {testResult && (
                  <div className={cn(
                    "p-3 rounded-lg text-xs border font-medium leading-relaxed animate-in fade-in duration-150",
                    testResult.success
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                  )}>
                    {testResult.message}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </form>
    </div>
  );
}
