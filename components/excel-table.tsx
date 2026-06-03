"use client";

import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { FormulaBar } from "./formula-bar";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { checkFormula, isTaskLocked } from "@/lib/modules";
import { FORMULA_DOCS, type FormulaDoc } from "@/lib/formula-docs";

import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, BookOpen, ChevronLeft, ChevronRight, Eye, EyeOff, Sparkles, Target, Lock, Key } from "lucide-react";

interface CellCoordinate {
  row: number;
  col: number;
}

interface ExcelTableProps {
  isFullScreen?: boolean;
  isSidebarOpen?: boolean;
  onToggleFullScreen?: () => void;
  onToggleSidebar?: () => void;
}

export function ExcelTable({
  isFullScreen = false,
  isSidebarOpen = false,
  onToggleFullScreen,
  onToggleSidebar
}: ExcelTableProps) {
  const {
    getCurrentStep,
    isSuccess,
    formulaInput,
    setFormulaInput,
    validateFormula,
    isValidated,
    shakeTrigger,
    selectedTaskIndex,
    taskAnswers,
    setSelectedTaskIndex,
    peerStates,
    role
  } = useAppStore();

  const step = getCurrentStep();
  const controls = useAnimation();

  const [showFormulaKey, setShowFormulaKey] = useState(false);
  const [colWidths, setColWidths] = useState<number[]>([]);
  const [resizingColIdx, setResizingColIdx] = useState<number | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  // Initialize column widths when header structure changes
  useEffect(() => {
    if (step.headers && step.headers.length > 0) {
      // Index column (column 0) is 45px. Others default to 120px
      const widths: number[] = step.headers.map((_, idx) => (idx === 0 ? 45 : 120));
      // Give more room to columns B (Nama Kotor) and D (Nama Bersih) by default
      if (widths.length > 2) widths[2] = 160; // Column B (1-indexed Col 2)
      if (widths.length > 4) widths[4] = 160; // Column D (1-indexed Col 4)
      setColWidths(widths);
    }
  }, [step.headers]);

  // Handle global mousemove/mouseup events for resizing
  useEffect(() => {
    if (resizingColIdx === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX.current;
      const newWidth = Math.max(50, startWidth.current + deltaX);
      setColWidths((prev) => {
        const next = [...prev];
        next[resizingColIdx] = newWidth;
        return next;
      });
    };

    const handleMouseUp = () => {
      setResizingColIdx(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingColIdx]);

  const handleResizeStart = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    e.preventDefault();
    setResizingColIdx(idx);
    startX.current = e.clientX;
    startWidth.current = colWidths[idx] || 120;
  };

  // Reset formula key visibility when selected task or step changes
  useEffect(() => {
    setShowFormulaKey(false);
  }, [selectedTaskIndex, step.id]);

  // Helper to get active task details
  const getActiveTaskDetails = () => {
    if (!step || step.headers.length === 0) return null;

    if (step.tasks && step.tasks.length > 0) {
      const task = step.tasks[selectedTaskIndex];
      if (!task) return null;
      const colLetter = String.fromCharCode(65 + task.resultCell.col);
      const rowNumber = step.dummyData[task.resultCell.row]?.rowNum || (task.resultCell.row + 1);
      const cellAddress = `${colLetter}${rowNumber}`;
      return {
        cellAddress,
        label: task.label,
        hint: task.hint,
        validFormulas: task.validFormulas,
      };
    } else {
      // For single task step
      const colLetter = String.fromCharCode(65 + step.resultCell.col);
      const rowNumber = step.dummyData[step.resultCell.row]?.rowNum || (step.resultCell.row + 1);
      const cellAddress = `${colLetter}${rowNumber}`;
      return {
        cellAddress,
        label: step.title,
        hint: step.hint,
        validFormulas: step.validFormulas,
      };
    }
  };

  const activeTask = getActiveTaskDetails();

  const getFormulaGuide = (input: string): 
    | { type: "suggestions"; list: FormulaDoc[] } 
    | { type: "guide"; doc: FormulaDoc; currentParamIdx: number } 
    | null => {
    if (!input.startsWith("=")) return null;
    
    const uppercase = input.toUpperCase().trim();
    
    // Check if user is typing parameters (has open parenthesis '(')
    const openParenIndex = uppercase.indexOf("(");
    
    if (openParenIndex === -1) {
      // User is typing function name, e.g. "=VL" or "=SU"
      const typedQuery = uppercase.slice(1); // remove "="
      if (!typedQuery) return { type: "suggestions", list: FORMULA_DOCS };
      
      const filtered = FORMULA_DOCS.filter(doc => doc.name.startsWith(typedQuery));
      return filtered.length > 0 ? { type: "suggestions", list: filtered } : null;
    } else {
      // User is typing parameters, e.g. "=VLOOKUP("
      const funcName = uppercase.slice(1, openParenIndex).trim();
      const doc = FORMULA_DOCS.find(d => d.name === funcName);
      if (!doc) return null;
      
      // Calculate which parameter they are on based on commas after '('
      const paramText = input.slice(openParenIndex + 1);
      const commaCount = (paramText.match(/,/g) || []).length;
      const currentParamIdx = Math.min(commaCount, doc.params.length - 1);
      
      return {
        type: "guide",
        doc,
        currentParamIdx
      };
    }
  };

  const handlePrevTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (step.tasks && step.tasks.length > 0) {
      const prevIdx = (selectedTaskIndex - 1 + step.tasks.length) % step.tasks.length;
      setSelectedTaskIndex(prevIdx);
    }
  };

  const handleNextTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (step.tasks && step.tasks.length > 0) {
      const nextIdx = (selectedTaskIndex + 1) % step.tasks.length;
      setSelectedTaskIndex(nextIdx);
    }
  };

  const handleAutoFill = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTask && activeTask.validFormulas && activeTask.validFormulas.length > 0) {
      setFormulaInput(activeTask.validFormulas[0]);
      setIsEditingInline(true);
    }
  };

  // Selection states (for blocking cells)
  const [selectionStart, setSelectionStart] = useState<CellCoordinate | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<CellCoordinate | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // Selected/blocked column and row indices
  const [blockedColIndex, setBlockedColIndex] = useState<number | null>(null);
  const [blockedRowIndex, setBlockedRowIndex] = useState<number | null>(null);

  // Formula reference tracking for pointer-replace behavior
  const [lastInsertedReference, setLastInsertedReference] = useState<string | null>(null);
  const lastSelectionFormulaRef = useRef<string>("");

  // Inline editing state & refs
  const [isEditingInline, setIsEditingInline] = useState(false);
  const cellInputRef = useRef<HTMLInputElement>(null);

  // Reset editing mode on step or task change
  useEffect(() => {
    setIsEditingInline(false);
  }, [step.id, selectedTaskIndex]);

  // Focus inline cell input when editing mode is activated
  useEffect(() => {
    if (isEditingInline && cellInputRef.current) {
      cellInputRef.current.focus();
      const length = cellInputRef.current.value.length;
      cellInputRef.current.setSelectionRange(length, length);
    }
  }, [isEditingInline]);

  const handleInlineInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateFormula().then((success) => {
        if (success) {
          setIsEditingInline(false);
        }
      });
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsEditingInline(false);
    }
  };

  const handleInlineInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    setTimeout(() => {
      const activeEl = document.activeElement;
      const tableEl = document.getElementById("excel-table-container");
      if (!tableEl?.contains(activeEl) && !tableEl?.contains(relatedTarget)) {
        setIsEditingInline(false);
      }
    }, 150);
  };

  const handleCellDoubleClick = (rowIdx: number, cellIdx: number, isResultCell: boolean, taskIndex?: number) => {
    if (taskIndex !== undefined && taskIndex !== -1 && step.tasks) {
      const clickedTask = step.tasks[taskIndex];
      if (!isSuccess) {
        const isLocked = isTaskLocked(clickedTask, taskAnswers, step.tasks, step.dummyData, step.headers);
        if (isLocked) return;
      }
      setSelectedTaskIndex(taskIndex);
      setIsEditingInline(true);
      return;
    }

    if (isResultCell) {
      setIsEditingInline(true);
    }
  };

  // Helper to update formula input and reference tracking
  const updateFormulaFromSelection = (newFormula: string, newRef: string | null) => {
    lastSelectionFormulaRef.current = newFormula;
    setLastInsertedReference(newRef);
    setFormulaInput(newFormula);
  };

  // Monitor manual formula input modifications to reset lastInsertedReference
  useEffect(() => {
    if (formulaInput !== lastSelectionFormulaRef.current) {
      setLastInsertedReference(null);
    }
  }, [formulaInput]);

  // Trigger shake animation inside the cell on failure
  useEffect(() => {
    if (isValidated && !isSuccess) {
      controls.start({
        x: [0, -6, 6, -6, 6, -3, 3, 0],
        transition: { duration: 0.4, ease: "easeInOut" }
      });
    }
  }, [shakeTrigger, controls, isValidated, isSuccess]);

  // Calculate the range string, e.g. "B2:B5"
  const getSelectedRangeString = (start: CellCoordinate, end: CellCoordinate) => {
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);

    const startColLetter = String.fromCharCode(65 + minCol);
    const startRowNum = step.dummyData[minRow].rowNum;
    
    const endColLetter = String.fromCharCode(65 + maxCol);
    const endRowNum = step.dummyData[maxRow].rowNum;

    if (minRow === maxRow && minCol === maxCol) {
      return `${startColLetter}${startRowNum}`;
    }
    return `${startColLetter}${startRowNum}:${endColLetter}${endRowNum}`;
  };

  // Autocomplete formulas when drag-select completes
  const handleSelectionComplete = (start: CellCoordinate, end: CellCoordinate) => {
    if (isSuccess) return;

    // Only autocomplete if we are actively editing a formula inline (isEditingInline is true and starts with "=")
    const isEditing = isEditingInline && formulaInput.startsWith("=");
    if (!isEditing) return;

    const rangeStr = getSelectedRangeString(start, end);
    if (!rangeStr) return;

    let current = formulaInput.trim();

    // If we have a last inserted reference and the formula ends with it,
    // replace it with the new reference
    if (lastInsertedReference && current.endsWith(lastInsertedReference)) {
      const baseFormula = current.slice(0, -lastInsertedReference.length);
      const newFormula = `${baseFormula}${rangeStr}`;
      updateFormulaFromSelection(newFormula, rangeStr);
    } else if (!current) {
      updateFormulaFromSelection(`=${rangeStr}`, rangeStr);
    } else if (
      current.endsWith("(") ||
      current.endsWith(",") ||
      current.endsWith("+") ||
      current.endsWith("-") ||
      current.endsWith("*") ||
      current.endsWith("/") ||
      current.endsWith("=")
    ) {
      updateFormulaFromSelection(`${current}${rangeStr}`, rangeStr);
    } else if (current.toUpperCase() === "=SUM") {
      updateFormulaFromSelection(`=SUM(${rangeStr})`, rangeStr);
    } else if (current.toUpperCase() === "=AVERAGE") {
      updateFormulaFromSelection(`=AVERAGE(${rangeStr})`, rangeStr);
    } else if (current.toUpperCase() === "=MAX") {
      updateFormulaFromSelection(`=MAX(${rangeStr})`, rangeStr);
    } else if (current.toUpperCase() === "=MIN") {
      updateFormulaFromSelection(`=MIN(${rangeStr})`, rangeStr);
    } else {
      // Append with operator if it doesn't end with one
      const operator = current.endsWith(")") ? "+" : "";
      updateFormulaFromSelection(`${current}${operator}${rangeStr}`, rangeStr);
    }

    // Refocus the inline input to keep editing seamless
    setTimeout(() => {
      const inlineInput = document.getElementById("inline-cell-input") as HTMLInputElement;
      if (inlineInput) {
        inlineInput.focus();
        const length = inlineInput.value.length;
        inlineInput.setSelectionRange(length, length);
      }
    }, 10);
  };

  // Handle global mouse up to stop drag selection
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
        if (selectionStart && selectionEnd) {
          handleSelectionComplete(selectionStart, selectionEnd);
        }
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isSelecting, selectionStart, selectionEnd, formulaInput, isSuccess, lastInsertedReference]);

  // Click row/column header selectors
  const handleColHeaderClick = (idx: number) => {
    if (idx === 0) {
      setBlockedColIndex(null);
      setBlockedRowIndex(null);
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }
    const dataColIdx = idx - 1;
    setBlockedColIndex((prev) => (prev === dataColIdx ? null : dataColIdx));
    setBlockedRowIndex(null);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const handleRowHeaderClick = (rowIdx: number) => {
    setBlockedRowIndex((prev) => (prev === rowIdx ? null : rowIdx));
    setBlockedColIndex(null);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  // Handle cell click: select task cell or clear selection
  const handleCellClick = (row: number, col: number, isResultCell: boolean, taskIndex?: number) => {
    // Focus the table container to capture keyboard events (like Enter key validation)
    document.getElementById("excel-table-container")?.focus();

    // Task cell click: activate that task
    if (taskIndex !== undefined && taskIndex !== -1 && step.tasks) {
      const clickedTask = step.tasks[taskIndex];
      if (!isSuccess) {
        const isLocked = isTaskLocked(clickedTask, taskAnswers, step.tasks, step.dummyData, step.headers);
        if (isLocked) return;
      }
      setSelectedTaskIndex(taskIndex);
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    // Result cell click (single-cell task): just clear selection
    if (isResultCell) {
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }
  };

  // Keep a separate mousedown handler for drag selection initiation
  // Keep a separate mousedown handler for drag selection initiation
  const handleCellMouseDown = (row: number, col: number, isResultCell: boolean, taskIndex?: number) => {
    if (isSuccess) return;

    // Focus the table container to capture keyboard events
    document.getElementById("excel-table-container")?.focus();

    // Prevent selecting the active editing cell as a reference (circular reference)
    const isCurrentActiveResultCell = isResultCell && (taskIndex === undefined || taskIndex === selectedTaskIndex);
    if (isCurrentActiveResultCell) return;

    // Only allow selecting other cells if we are actively editing inline and typing a formula (starts with "=")
    const isUserEditingFormula = isEditingInline && formulaInput.startsWith("=");
    if (!isUserEditingFormula) {
      // If we are not editing a formula, clicking another cell should exit inline editing
      setIsEditingInline(false);
      return;
    }

    setIsSelecting(true);
    setSelectionStart({ row, col });
    setSelectionEnd({ row, col });
    setBlockedColIndex(null);
    setBlockedRowIndex(null);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      setSelectionEnd({ row, col });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Only validate here if we are not editing inline,
      // as the inline input handles its own Enter key validation.
      if (!isEditingInline) {
        validateFormula();
      }
    }
  };

  return (
    <div
      id="excel-table-container"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full h-full flex flex-col bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm dark:shadow-black/30 focus:outline-none min-h-0 min-w-0"
    >
      
      {/* 1. Minimal top bar: only action buttons, no decorative text */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/20 border-b border-border/60 select-none shrink-0 gap-2">
        {/* Active Peers Display */}
        <div className="flex items-center space-x-1">
          {Object.keys(peerStates).length > 0 ? (
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1.5 overflow-hidden">
                {Object.values(peerStates).filter(Boolean).map((peer, idx) => {
                  const peerColorMap: Record<string, string> = {
                    emerald: "bg-emerald-500",
                    indigo: "bg-indigo-500",
                    rose: "bg-rose-500",
                    amber: "bg-amber-500",
                    violet: "bg-violet-500",
                    sky: "bg-sky-500",
                  };
                  const colorClass = peerColorMap[peer.color] || "bg-emerald-500";
                  return (
                    <div
                      key={peer.userId + idx}
                      className={cn(
                        "inline-block h-5 w-5 rounded-full ring-2 ring-card text-[9px] font-bold text-white flex items-center justify-center uppercase select-none",
                        colorClass
                      )}
                      title={`${peer.name} (${peer.role})`}
                    >
                      {peer.name.charAt(0)}
                    </div>
                  );
                })}
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground font-sans">
                {Object.keys(peerStates).length} pengguna lain online
              </span>
            </div>
          ) : (
            <span className="text-[10px] font-medium text-muted-foreground/60 font-sans flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse"></span>
              Menunggu teman belajar...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Sidebar Button (Only visible in full screen mode) */}
          {isFullScreen && onToggleSidebar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="h-7 px-2.5 text-[10px] font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md select-none"
              title={isSidebarOpen ? "Sembunyikan Petunjuk" : "Tampilkan Petunjuk"}
            >
              <BookOpen className={cn("h-3.5 w-3.5", isSidebarOpen ? "text-emerald-500" : "")} />
              <span>{isSidebarOpen ? "Tutup Petunjuk" : "Buka Petunjuk"}</span>
            </Button>
          )}

          {/* Toggle Full Screen Button */}
          {onToggleFullScreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullScreen}
              className="h-7 px-2.5 text-[10px] font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md select-none"
              title={isFullScreen ? "Tampilan Normal" : "Lebar Penuh"}
            >
              {isFullScreen ? (
                <><Minimize2 className="h-3.5 w-3.5" /><span>Kecilkan</span></>
              ) : (
                <><Maximize2 className="h-3.5 w-3.5" /><span>Lebar Penuh</span></>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* 2. Active Task Helper & Feedback */}
      {step.headers.length > 0 && activeTask && (
        <div className="px-4 py-3 bg-card border-b border-border/80 shrink-0 space-y-2.5">
          {/* Active Task Guide Card */}
          {!isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/15 text-xs shadow-sm"
            >
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 font-bold select-none mt-0.5 shadow-inner">
                  <Target className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">
                      Target Sel:
                    </span>
                    <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 rounded px-1 py-0.5">
                      {step.tasks && step.tasks.length > 1 && (
                        <button
                          onClick={handlePrevTask}
                          className="p-0.5 rounded hover:bg-blue-500/15 text-blue-500 transition-colors"
                          title="Tugas Sebelumnya"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-[10px] px-1 select-none">
                        {activeTask.cellAddress}
                      </span>
                      {step.tasks && step.tasks.length > 1 && (
                        <button
                          onClick={handleNextTask}
                          className="p-0.5 rounded hover:bg-blue-500/15 text-blue-500 transition-colors"
                          title="Tugas Selanjutnya"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <span className="text-muted-foreground font-semibold text-[11px] truncate max-w-[200px]">
                      ({activeTask.label})
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {activeTask.hint}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                {activeTask.validFormulas && activeTask.validFormulas.length > 0 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFormulaKey(!showFormulaKey);
                      }}
                      className="h-7 px-2.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 rounded-md border border-blue-500/20 flex items-center gap-1"
                    >
                      {showFormulaKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      <span>{showFormulaKey ? "Sembunyikan" : "Lihat Rumus"}</span>
                    </Button>
                    {role === "instruktur" && (
                      <Button
                        size="sm"
                        onClick={handleAutoFill}
                        className="h-7 px-2.5 text-[10px] font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-md shadow-sm flex items-center gap-1"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Masukkan Rumus</span>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Reveal Formula Key Area */}
          {showFormulaKey && !isSuccess && activeTask.validFormulas && activeTask.validFormulas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-2.5 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between gap-2 overflow-hidden shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 select-none">
                  <Key className="h-3.5 w-3.5 text-amber-500 mr-0.5" /> Kunci Rumus:
                </span>
                <code className="bg-muted px-2 py-0.5 rounded font-mono font-bold text-foreground border border-border/80 text-[11px] select-all">
              {activeTask.validFormulas[0]}
                </code>
              </div>
              {role === "instruktur" && (
                <span className="text-[10px] text-muted-foreground italic select-none">Klik "Masukkan Rumus" untuk otomatis mengisi</span>
              )}
            </motion.div>
          )}

          {/* Detailed Formula Syntax Guide inside Top Panel */}
          {!isSuccess && isEditingInline && (() => {
            const guide = getFormulaGuide(formulaInput);
            if (!guide || guide.type !== "guide") return null;

            return (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-card border border-border/60 dark:border-border/40 text-xs space-y-2.5 shadow-sm border-t-2 border-t-emerald-500/50"
              >
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-semibold text-muted-foreground/80 dark:text-muted-foreground/60 tracking-wider uppercase">Panduan Argumentasi Rumus</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {guide.doc.name}()
                  </span>
                </div>
                <div className="space-y-2">
                  {guide.doc.params[guide.currentParamIdx] && (
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        Argumen Saat Ini: {guide.doc.params[guide.currentParamIdx].name}
                      </div>
                      <p className="text-[11px] text-foreground/80 dark:text-foreground/70 leading-relaxed font-sans">
                        {guide.doc.params[guide.currentParamIdx].desc}
                      </p>
                    </div>
                  )}
                  <div className="h-px bg-border/40" />
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-semibold text-muted-foreground/75 dark:text-muted-foreground/50 uppercase tracking-wide">
                      Deskripsi Fungsi
                    </div>
                    <p className="text-[10px] text-muted-foreground dark:text-muted-foreground/80 italic leading-relaxed font-sans">
                      {guide.doc.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {/* Validation Feedback */}
          <FormulaBar />
        </div>
      )}

      {/* 3. Grid Canvas Wrapper */}
      <div className="flex-1 overflow-auto w-full max-w-full p-4 bg-background/50 select-none md:py-8 min-h-0">
        {step.headers.length === 0 ? (
          <div className="text-center p-8 max-w-sm space-y-4 mx-auto">
            <div className="h-14 w-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/25">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-foreground">Sesi Membaca Materi</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bab ini berisi penjelasan materi secara teoritis. Silakan pelajari penjelasan konsep di panel kiri, lalu klik <strong>Tantangan Berikutnya</strong> jika sudah siap!
              </p>
            </div>
          </div>
        ) : (
          <table
            className="border-collapse border border-border font-mono text-sm table-fixed"
            style={{ width: colWidths.length > 0 ? `${colWidths.reduce((sum, w) => sum + w, 0)}px` : "100%" }}
          >
          {/* Colgroup for Resizable Columns */}
          <colgroup>
            {colWidths.map((width, idx) => (
              <col key={idx} style={{ width: `${width}px` }} />
            ))}
          </colgroup>
          {/* Header Row */}
          <thead>
            <tr className="bg-muted/40">
              {step.headers.map((header, idx) => {
                const isBlocked = idx > 0 && (idx - 1) === blockedColIndex;
                return (
                  <th
                    key={idx}
                    onClick={() => handleColHeaderClick(idx)}
                    className={cn(
                      "border border-border p-2 text-center font-semibold text-xs text-muted-foreground bg-muted/20 cursor-pointer transition-all duration-150 hover:bg-muted/40 select-none relative group",
                      isBlocked && "bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-500 font-extrabold border-b-2 border-emerald-500/50 shadow-inner"
                    )}
                  >
                    {idx === 0 ? header : String.fromCharCode(65 + idx - 1)}

                    {/* Resize handle */}
                    {idx > 0 && (
                      <div
                        onMouseDown={(e) => handleResizeStart(e, idx)}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          "absolute top-0 bottom-0 w-[5px] cursor-col-resize hover:bg-blue-500/40 active:bg-blue-500 select-none z-30 transition-all",
                          resizingColIdx === idx ? "bg-blue-500" : "bg-transparent group-hover:bg-border/60"
                        )}
                        style={{ right: "-2.5px" }}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {step.dummyData.map((row, rowIdx) => {
              const isRowBlocked = rowIdx === blockedRowIndex;
              
              return (
                <tr key={rowIdx} className="hover:bg-muted/10 transition-colors duration-150">
                  {/* Row Index Label */}
                  <td
                    onClick={() => handleRowHeaderClick(rowIdx)}
                    className={cn(
                      "border border-border p-2 text-center text-xs font-semibold text-muted-foreground bg-muted/20 cursor-pointer transition-all duration-150 hover:bg-muted/40 select-none",
                      isRowBlocked && "bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-500 font-extrabold border-r-2 border-emerald-500/50 shadow-inner"
                    )}
                  >
                    {row.rowNum}
                  </td>

                  {/* Data Cells */}
                  {row.cells.map((cell, cellIdx) => {
                    let taskIndex = -1;
                    if (step.tasks && step.tasks.length > 0) {
                      taskIndex = step.tasks.findIndex(
                        (t) => t.resultCell.row === rowIdx && t.resultCell.col === cellIdx
                      );
                    }
                    const isMultiTaskCell = taskIndex !== -1;
                    const isResultCell = (step.tasks && step.tasks.length > 0)
                      ? (taskIndex === selectedTaskIndex) 
                      : (rowIdx === step.resultCell.row && cellIdx === step.resultCell.col);

                    const isAnyResultCell = isResultCell || isMultiTaskCell;
                    
                    const isNearBottom = rowIdx >= step.dummyData.length - 4;
                    
                    const isColRowBlocked = cellIdx === blockedColIndex || isRowBlocked;

                    // Calculate range selection bounds
                    const isCellSelected =
                      selectionStart &&
                      selectionEnd &&
                      rowIdx >= Math.min(selectionStart.row, selectionEnd.row) &&
                      rowIdx <= Math.max(selectionStart.row, selectionEnd.row) &&
                      cellIdx >= Math.min(selectionStart.col, selectionEnd.col) &&
                      cellIdx <= Math.max(selectionStart.col, selectionEnd.col);

                    // Excel style selection borders
                    let selectionBorderClasses = "";
                    if (isCellSelected && selectionStart && selectionEnd) {
                      const minR = Math.min(selectionStart.row, selectionEnd.row);
                      const maxR = Math.max(selectionStart.row, selectionEnd.row);
                      const minC = Math.min(selectionStart.col, selectionEnd.col);
                      const maxC = Math.max(selectionStart.col, selectionEnd.col);

                      if (rowIdx === minR) selectionBorderClasses += " border-t-2 border-t-blue-500 dark:border-t-blue-400";
                      if (rowIdx === maxR) selectionBorderClasses += " border-b-2 border-b-blue-500 dark:border-b-blue-400";
                      if (cellIdx === minC) selectionBorderClasses += " border-l-2 border-l-blue-500 dark:border-l-blue-400";
                      if (cellIdx === maxC) selectionBorderClasses += " border-r-2 border-r-blue-500 dark:border-r-blue-400";
                    }

                    const isEditingThisCell = isResultCell && isEditingInline;

                    const isTaskCorrect = isMultiTaskCell && step.tasks && step.tasks[taskIndex] && !isEditingThisCell
                      ? checkFormula(
                          taskAnswers[taskIndex] || "",
                          step.tasks[taskIndex].validFormulas,
                          step.tasks[taskIndex].expectedResult,
                          step.dummyData,
                          step.headers,
                          taskAnswers,
                          step.tasks
                        )
                      : false;

                    const isCellLocked = isMultiTaskCell && step.tasks && step.tasks[taskIndex]
                      ? isTaskLocked(
                          step.tasks[taskIndex],
                          taskAnswers,
                          step.tasks,
                          step.dummyData,
                          step.headers
                        )
                      : false;

                    const showAsSuccess = isAnyResultCell && (isSuccess || isTaskCorrect) && !isEditingThisCell;
                    const showAsEditing = isResultCell && !isCellLocked && (isEditingInline || !isSuccess);
                    const showAsPendingTask = !isSuccess && isMultiTaskCell && !isResultCell && !isTaskCorrect && !isCellLocked;
                    const showAsLockedTask = !isSuccess && isMultiTaskCell && isCellLocked && !isTaskCorrect;

                    const peersOnThisCell = Object.values(peerStates).filter(
                      (p) => p && p.stepId === step.id && p.activeCell && p.activeCell.row === rowIdx && p.activeCell.col === cellIdx
                    );
                    const hasPeer = peersOnThisCell.length > 0;

                    const peerColorMap: Record<string, { border: string, bg: string, text: string }> = {
                      emerald: { border: "border-emerald-500", bg: "bg-emerald-500", text: "text-emerald-500" },
                      indigo: { border: "border-indigo-500", bg: "bg-indigo-500", text: "text-indigo-500" },
                      rose: { border: "border-rose-500", bg: "bg-rose-500", text: "text-rose-500" },
                      amber: { border: "border-amber-500", bg: "bg-amber-500", text: "text-amber-500" },
                      violet: { border: "border-violet-500", bg: "bg-violet-500", text: "text-violet-500" },
                      sky: { border: "border-sky-500", bg: "bg-sky-500", text: "text-sky-500" },
                    };

                    const firstPeer = peersOnThisCell[0];
                    const peerColor = firstPeer ? (peerColorMap[firstPeer.color] || peerColorMap.emerald) : null;
                    
                    let peerBorderClasses = "";
                    if (hasPeer && peerColor) {
                      peerBorderClasses = `ring-2 ring-inset ${peerColor.border} z-20`;
                    }

                    return (
                      <td
                        key={cellIdx}
                        onMouseDown={() => handleCellMouseDown(rowIdx, cellIdx, isResultCell, taskIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIdx, cellIdx)}
                        onClick={() => handleCellClick(rowIdx, cellIdx, isResultCell, taskIndex)}
                        onDoubleClick={() => handleCellDoubleClick(rowIdx, cellIdx, isResultCell, taskIndex)}
                        className={cn(
                          "border border-border relative transition-all duration-150 select-none",
                          (hasPeer || cell.className?.includes("overflow-visible") || (showAsEditing && isEditingInline)) ? "overflow-visible" : "truncate",
                          !isAnyResultCell && "p-2.5 cursor-crosshair",
                          cell.header && "bg-muted/10 font-semibold text-foreground text-xs",
                          cell.highlight && "bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
                          isColRowBlocked && "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20",
                          isCellSelected && "bg-blue-500/10 dark:bg-blue-500/15",
                          selectionBorderClasses,
                          peerBorderClasses,
                          showAsEditing && "bg-blue-500/5 dark:bg-blue-500/10 ring-2 ring-blue-500 dark:ring-blue-400/80 z-10 text-blue-600 dark:text-blue-400 font-bold",
                          showAsPendingTask && "bg-amber-500/5 dark:bg-amber-500/10 border border-dashed border-amber-500/30 text-amber-500/80 dark:text-amber-400/80 font-semibold cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/50 p-2.5 text-center",
                          showAsLockedTask && "bg-muted/15 border border-border text-muted-foreground/35 cursor-not-allowed p-2.5 text-center",
                          isAnyResultCell && showAsSuccess && "bg-emerald-500/20 dark:bg-emerald-500/25 border-emerald-500/50 text-emerald-600 dark:text-emerald-300 font-extrabold shadow-inner p-2.5",
                          cell.borderTop && "border-t-2 border-t-slate-400 dark:border-t-slate-500",
                          cell.borderBottom && "border-b-2 border-b-slate-400 dark:border-b-slate-500",
                          cell.borderLeft && "border-l-2 border-l-slate-400 dark:border-l-slate-500",
                          cell.borderRight && "border-r-2 border-r-slate-400 dark:border-r-slate-500",
                          cell.borderDouble && "border-b-double border-b-4 border-b-slate-400 dark:border-b-slate-500",
                          cell.borderTop === false && "border-t-0",
                          cell.borderBottom === false && "border-b-0",
                          cell.borderLeft === false && "border-l-0",
                          cell.borderRight === false && "border-r-0",
                          cell.bgColor,
                          cell.className
                        )}
                      >
                        {/* Cell Value Rendering */}
                        {showAsSuccess ? (
                          <span className="flex items-center space-x-1.5 justify-center">
                            <span>{isMultiTaskCell ? step.tasks![taskIndex].expectedResult : step.expectedResult}</span>
                          </span>
                        ) : showAsLockedTask ? (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 select-none py-1.5">
                            <Lock className="h-3.5 w-3.5 opacity-30" />
                          </div>
                        ) : showAsPendingTask ? (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xs select-none">
                            {cell.value}
                          </div>
                        ) : showAsEditing ? (
                          isEditingInline ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <input
                                id="inline-cell-input"
                                ref={cellInputRef}
                                type="text"
                                value={formulaInput}
                                onChange={(e) => setFormulaInput(e.target.value)}
                                onKeyDown={handleInlineInputKeyDown}
                                onBlur={handleInlineInputBlur}
                                onMouseDown={(e) => e.stopPropagation()}
                                onMouseUp={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                                onDoubleClick={(e) => e.stopPropagation()}
                                className="w-full h-full bg-transparent border-none outline-none focus:ring-0 px-2 py-2 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 text-center select-text"
                                placeholder="=RUMUS"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck={false}
                              />

                              {/* Autocomplete / Syntax Guide Tooltip */}
                              {(() => {
                                if (isSelecting) return null;
                                const guide = getFormulaGuide(formulaInput);
                                if (!guide) return null;

                                if (guide.type === "suggestions") {
                                  const tooltipPositionClass = isNearBottom ? "bottom-full mb-1" : "top-full mt-1";
                                  return (
                                    <motion.div 
                                      initial={{ opacity: 0, y: isNearBottom ? 8 : -8, scale: 0.96 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      transition={{ duration: 0.12, ease: "easeOut" }}
                                      className={cn(
                                        "absolute left-0 bg-background/95 dark:bg-slate-950/95 backdrop-blur-md border border-border/80 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-200/20 dark:shadow-black/50 z-50 w-60 font-sans select-none overflow-hidden max-h-52 overflow-y-auto scrollbar-thin border-t-2 border-t-emerald-500/50",
                                        tooltipPositionClass
                                      )}
                                      onMouseDown={(e) => e.preventDefault()} // Prevent blur
                                    >
                                      {guide.list.map((doc) => (
                                        <button
                                          key={doc.name}
                                          onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setFormulaInput(`=${doc.name}(`);
                                            // Keep input focused
                                            setTimeout(() => {
                                              const inlineInput = document.getElementById("inline-cell-input") as HTMLInputElement;
                                              if (inlineInput) {
                                                inlineInput.focus();
                                                const length = inlineInput.value.length;
                                                inlineInput.setSelectionRange(length, length);
                                              }
                                            }, 10);
                                          }}
                                          className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/5 hover:text-foreground text-foreground border-b border-border/40 dark:border-slate-800/60 last:border-b-0 cursor-pointer transition-colors duration-100 flex flex-col gap-0.5 group"
                                        >
                                          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500">{doc.name}</span>
                                          <span className="text-[10px] text-muted-foreground font-normal truncate group-hover:text-muted-foreground/80">{doc.desc}</span>
                                        </button>
                                      ))}
                                    </motion.div>
                                  );
                                }

                                if (guide.type === "guide") {
                                  const tooltipPositionClass = isNearBottom ? "bottom-full mb-1" : "top-full mt-1";
                                  return (
                                    <motion.div 
                                      initial={{ opacity: 0, y: isNearBottom ? 8 : -8, scale: 0.96 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      transition={{ duration: 0.12, ease: "easeOut" }}
                                      className={cn(
                                        "absolute left-0 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-lg shadow-xl px-2.5 py-1.5 z-50 whitespace-nowrap font-sans select-none pointer-events-none border-t border-t-emerald-500/50",
                                        tooltipPositionClass
                                      )}
                                    >
                                      <div className="text-[11px] font-mono font-semibold text-slate-300 flex items-center">
                                        <span className="text-emerald-400 font-extrabold mr-1">{guide.doc.name}</span>
                                        <span className="opacity-60 mr-0.5">(</span>
                                        {guide.doc.params.map((param, pIdx) => {
                                          const isCurrent = pIdx === guide.currentParamIdx;
                                          return (
                                            <span key={pIdx} className="flex items-center">
                                              {pIdx > 0 && <span className="opacity-40 mx-0.5">,</span>}
                                              <span className={cn(
                                                "transition-all duration-150 px-1 py-0.2 rounded text-[10px]",
                                                isCurrent 
                                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm" 
                                                  : "opacity-40 text-slate-300 font-normal"
                                              )}>
                                                {param.name}
                                              </span>
                                            </span>
                                          );
                                        })}
                                        <span className="opacity-60 ml-0.5">)</span>
                                      </div>
                                    </motion.div>
                                  );
                                }

                                return null;
                              })()}
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs select-none p-2.5 cursor-pointer">
                              {formulaInput || cell.value}
                            </div>
                          )
                        ) : (
                          typeof cell.value === "number" ? cell.value.toLocaleString() : cell.value
                        )}

                        {/* Small Active Cell Indicator Corner Dot */}
                        {isAnyResultCell && showAsSuccess && (
                          <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border border-white bg-emerald-500" />
                        )}

                        {/* Peer active flag */}
                        {peersOnThisCell.map((peer, pIdx) => {
                          const c = peerColorMap[peer.color] || peerColorMap.emerald;
                          return (
                            <div
                              key={peer.userId + pIdx}
                              className={cn(
                                "absolute -top-3.5 left-0 text-[8px] text-white px-1 py-0.5 rounded font-sans select-none z-30 pointer-events-none whitespace-nowrap leading-none font-bold",
                                c.bg
                              )}
                              style={{ transform: `translateY(${-pIdx * 12}px)` }}
                            >
                              {peer.name}
                            </div>
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>

      {/* 4. Selection helper notification at the bottom */}
      {selectionStart && selectionEnd && !isSuccess && (
        <div className="px-4 py-2 border-t border-border bg-blue-500/5 dark:bg-blue-500/10 text-xs font-semibold text-blue-500 flex items-center justify-between select-none shrink-0">
          <span>Rentang terblokir: <strong className="font-mono bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">{getSelectedRangeString(selectionStart, selectionEnd)}</strong></span>
          <span className="text-[10px] text-muted-foreground font-mono">Seret sel untuk mengubah pilihan</span>
        </div>
      )}
    </div>
  );
}
