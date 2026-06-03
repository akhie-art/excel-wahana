"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { CurriculumList } from "./curriculum-list";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Award, BookOpen, Lightbulb, CheckSquare, Check, Lock, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkFormula, isTaskLocked } from "@/lib/modules";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function LeftPanel() {
  const {
    currentModuleIndex,
    currentStepIndex,
    getCurrentModule,
    getCurrentStep,
    isSuccess,
    prevStep,
    nextStep,
    modules,
    selectedTaskIndex,
    taskAnswers,
    setSelectedTaskIndex
  } = useAppStore();

  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);

  const module = getCurrentModule();
  const step = getCurrentStep();

  const isFirstStep = currentModuleIndex === 0 && currentStepIndex === 0;
  const isLastStep =
    currentModuleIndex === modules.length - 1 &&
    currentStepIndex === modules[currentModuleIndex].steps.length - 1;

  const hasTasks = step.tasks && step.tasks.length > 0;

  return (
    <div className="w-full select-text">
      
      {/* 4-Column Grid Layout for Horizontal view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Column 1: Title, info and lesson navigation (lg:col-span-3) */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-3 pr-2 border-r border-border/40 select-none">
          <div className="space-y-1">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
              <span className="text-emerald-500">
                {module.title.includes("===")
                  ? module.title.replace(/===/g, "").trim()
                  : module.title.split(".")[0]}
              </span>
              <span className="opacity-40">/</span>
              <span className="truncate max-w-[120px]">{step.title}</span>
            </div>

            {/* Title */}
            <h1 className="text-base font-bold tracking-tight text-foreground leading-tight truncate">
              {step.title}
            </h1>
            <p className="text-[11px] text-muted-foreground/80 leading-snug line-clamp-2">
              {step.shortDescription}
            </p>
          </div>

          {/* Navigation & Curriculum Button Row */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/40 mt-auto">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevStep}
              disabled={isFirstStep}
              className="h-8 w-8 rounded-lg cursor-pointer border-border/60 hover:bg-muted"
              title="Sebelumnya"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            {/* Curriculum Drawer Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCurriculumOpen(true)}
              className="h-8 text-xs font-semibold px-2.5 rounded-lg border-border/60 hover:bg-muted flex items-center gap-1 cursor-pointer flex-1"
            >
              <List className="h-3.5 w-3.5" />
              <span>Materi</span>
            </Button>

            {/* Next Button */}
            {isLastStep && isSuccess ? (
              <div className="flex items-center gap-1 text-emerald-500 font-semibold text-xs shrink-0 select-none">
                <Award className="h-4 w-4" />
              </div>
            ) : (
              <Button
                size="icon"
                onClick={nextStep}
                disabled={!isSuccess}
                className={cn(
                  "h-8 w-8 rounded-lg cursor-pointer shrink-0 transition-all",
                  isSuccess
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
                title="Tantangan Berikutnya"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Column 2: Concept Explanation (lg:col-span-3 or lg:col-span-4.5) */}
        <div className={cn(
          "flex flex-col space-y-2 pb-1 border-r border-border/40",
          hasTasks ? "lg:col-span-3" : "lg:col-span-4.5"
        )}>
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wide select-none">
            <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
            <span>Penjelasan</span>
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed overflow-y-auto max-h-[110px] pr-2 scrollbar-thin space-y-1.5">
            {step.conceptExplanation.split("\n").map((para, idx) => {
              let formatted = para.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground font-semibold'>$1</strong>");
              formatted = formatted.replace(/\*(.*?)\*/g, "<em class='italic text-foreground/90'>$1</em>");
              formatted = formatted.replace(/_(.*?)_/g, "<em class='italic text-foreground/90'>$1</em>");
              const codeFormatted = formatted.replace(/`(.*?)`/g, "<code class='bg-muted px-1.5 py-0.5 rounded font-mono text-[10px] text-foreground border border-border/60'>$1</code>");
              return (
                <p
                  key={idx}
                  dangerouslySetInnerHTML={{ __html: codeFormatted }}
                />
              );
            })}
          </div>
        </div>

        {/* Column 3: Task Instructions (lg:col-span-3 or lg:col-span-4.5) */}
        <div className={cn(
          "flex flex-col space-y-2 pb-1",
          hasTasks ? "lg:col-span-3 border-r border-border/40" : "lg:col-span-4.5"
        )}>
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wide select-none">
            <CheckSquare className="h-3.5 w-3.5 text-emerald-500" />
            <span>Tugas Kamu</span>
          </div>
          <div
            className="text-xs text-foreground/85 leading-relaxed overflow-y-auto max-h-[110px] pr-2 scrollbar-thin whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: step.instructions
                .replace(/([^\n])[ \t]*(\d+\.\s+)/g, "$1\n$2")
                .replace(/([^\n*])[ \t]*(\*\s+)/g, "$1\n$2")
                .replace(/([^\n])[ \t]*(-\s+)/g, "$1\n$2")
                .replace(/\*\*(.*?)\*\*/g, "<strong class='text-emerald-600 dark:text-emerald-400 font-bold'>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em class='italic text-foreground/90'>$1</em>")
                .replace(/_(.*?)_/g, "<em class='italic text-foreground/90'>$1</em>")
                .replace(/`(.*?)`/g, "<code class='bg-muted px-1.5 py-0.5 rounded font-mono text-[10px] text-foreground border border-border/60'>$1</code>")
            }}
          />
        </div>

        {/* Column 4: Task List / Multi-cell steps (lg:col-span-3) - Optional */}
        {hasTasks && (
          <div className="lg:col-span-3 flex flex-col space-y-2 pb-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wide select-none">
              <Lightbulb className="h-3.5 w-3.5 text-emerald-500" />
              <span>Daftar Sel Soal</span>
            </div>
            
            {/* Scrollable Container for Tasks */}
            <div className="space-y-1.5 overflow-y-auto max-h-[110px] pr-1.5 scrollbar-thin scrollbar-thumb-border/80 hover:scrollbar-thumb-border scrollbar-track-transparent">
              {step.tasks!.map((task, idx) => {
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

                const isLocked = !isCompleted && isTaskLocked(
                  task,
                  taskAnswers,
                  step.tasks!,
                  step.dummyData,
                  step.headers
                );

                return (
                  <div
                    key={idx}
                    onClick={() => !isSuccess && !isLocked && setSelectedTaskIndex(idx)}
                    className={cn(
                      "flex items-center justify-between px-2 py-1 rounded border text-[10px] transition-all duration-150 select-none",
                      isCellActive
                        ? "bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/30 cursor-pointer shadow-[0_0_8px_rgba(16,185,129,0.15)]"
                        : isCompleted
                          ? "bg-emerald-500/5 border-emerald-500/20 cursor-pointer"
                          : isLocked
                            ? "bg-muted/10 border-dashed border-border/40 opacity-45 cursor-not-allowed"
                            : "border-border/50 hover:bg-muted/40 cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={cn(
                        "font-mono text-[9px] font-bold px-1 rounded border",
                        isCellActive
                          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold"
                          : isCompleted
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : isLocked
                              ? "bg-muted border-border/30 text-muted-foreground/45"
                              : "bg-muted border-border/60 text-muted-foreground"
                      )}>
                        {cellAddress}
                      </span>
                      <span className={cn(
                        "font-medium truncate",
                        isCompleted || isLocked ? "text-muted-foreground/60" : "text-foreground/80"
                      )}>
                        {task.label.includes("(") ? task.label.split("(")[0].trim() : task.label}
                      </span>
                    </div>
                    {isCompleted ? (
                      <span className="flex items-center gap-0.5 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                        <Check className="h-3 w-3" /> Selesai
                      </span>
                    ) : isCellActive ? (
                      <span className="text-[9px] text-emerald-500 font-bold animate-pulse shrink-0">Aktif</span>
                    ) : isLocked ? (
                      <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground/50 font-semibold shrink-0">
                        <Lock className="h-2.5 w-2.5" /> Kunci
                      </span>
                    ) : (
                      <span className="text-[9px] text-muted-foreground/50 shrink-0">Belum</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Dialog Modal for Curriculum List Selection */}
      <Dialog open={isCurriculumOpen} onOpenChange={(open) => !open && setIsCurriculumOpen(false)}>
        <DialogContent className="max-w-md w-[90vw] max-h-[80vh] overflow-y-auto border border-border/80 bg-background/95 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Daftar Kurikulum & Materi</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <CurriculumList />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}