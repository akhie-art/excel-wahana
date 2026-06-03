"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { checkFormula } from "@/lib/modules";
import { Button } from "@/components/ui/button";
import { Check, X, CheckSquare, Lightbulb } from "lucide-react";

interface TaskSidebarProps {
  onClose: () => void;
  isFullScreen?: boolean;
}

export function TaskSidebar({ onClose, isFullScreen = false }: TaskSidebarProps) {
  const {
    getCurrentStep,
    isSuccess,
    selectedTaskIndex,
    taskAnswers,
    setSelectedTaskIndex
  } = useAppStore();

  const step = getCurrentStep();

  return (
    <div className={cn(
      "w-[300px] h-full bg-card flex flex-col overflow-hidden select-text transition-all duration-300",
      isFullScreen
        ? "border-l border-border/60 rounded-none"
        : "border border-border/60 rounded-xl shadow-sm"
    )}>
      {/* Sidebar Header */}
      <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
          <span>Petunjuk Soal</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="h-6 w-6 text-muted-foreground hover:text-foreground rounded-md"
          title="Sembunyikan Petunjuk"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">

        {/* Tugas Kamu */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide select-none">
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Tugas Kamu</span>
          </div>
          <div
            className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: step.instructions
                .replace(/([^\n])[ \t]*(\d+\.\s+)/g, "$1\n$2")
                .replace(/([^\n*])[ \t]*(\*\s+)/g, "$1\n$2")
                .replace(/([^\n])[ \t]*(-\s+)/g, "$1\n$2")
                .replace(/\*\*(.*?)\*\*/g, "<strong class='text-emerald-600 dark:text-emerald-400 font-bold'>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em class='italic text-foreground/90'>$1</em>")
                .replace(/_(.*?)_/g, "<em class='italic text-foreground/90'>$1</em>")
                .replace(/`(.*?)`/g, "<code class='bg-muted px-1.5 py-0.5 rounded font-mono text-xs text-foreground border border-border/60'>$1</code>")
            }}
          />
        </div>

        {/* Task List */}
        {step.tasks && step.tasks.length > 0 && (
          <>
            <div className="h-px bg-border/60" />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide select-none">
                <span>Daftar Sel</span>
              </div>
              <div className="space-y-1.5">
                {step.tasks.map((task, idx) => {
                  const isCellActive = idx === selectedTaskIndex;
                  const colLetter = String.fromCharCode(65 + task.resultCell.col);
                  const rowNumber = step.dummyData[task.resultCell.row].rowNum;
                  const cellAddress = `${colLetter}${rowNumber}`;

                  const isCompleted = taskAnswers && taskAnswers[idx]
                    ? checkFormula(
                        taskAnswers[idx],
                        task.validFormulas,
                        task.expectedResult,
                        step.dummyData,
                        step.headers,
                        taskAnswers,
                        step.tasks!
                      )
                    : false;

                  return (
                    <div
                      key={idx}
                      onClick={() => !isSuccess && setSelectedTaskIndex(idx)}
                      className={cn(
                        "flex flex-col gap-1.5 px-3 py-2.5 rounded-lg border text-xs cursor-pointer select-none transition-all duration-150",
                        isCellActive
                          ? "bg-blue-500/5 border-blue-500/25 ring-1 ring-blue-500/20"
                          : isCompleted
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : "border-border/50 hover:bg-muted/40"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border",
                            isCellActive
                              ? "bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-400"
                              : isCompleted
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : "bg-muted border-border/60 text-muted-foreground"
                          )}>
                            {cellAddress}
                          </span>
                          <span className={cn(
                            "font-medium truncate max-w-[140px]",
                            isCompleted ? "text-muted-foreground" : "text-foreground/80"
                          )}>{task.label}</span>
                        </div>
                        {isCompleted ? (
                          <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                            <Check className="h-3 w-3" /> Selesai
                          </span>
                        ) : isCellActive ? (
                          <span className="text-[10px] text-blue-500 font-semibold animate-pulse shrink-0">Aktif</span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/50 shrink-0">Belum</span>
                        )}
                      </div>

                      {isCellActive && !isSuccess && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed pt-1.5 border-t border-border/40">
                          {task.hint}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
