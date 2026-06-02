"use client";

import { useAppStore } from "@/lib/store";
import { CurriculumList } from "./curriculum-list";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Award, BookOpen, Lightbulb, CheckSquare, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkFormula, isTaskLocked } from "@/lib/modules";

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

  const module = getCurrentModule();
  const step = getCurrentStep();

  const isFirstStep = currentModuleIndex === 0 && currentStepIndex === 0;
  const isLastStep =
    currentModuleIndex === modules.length - 1 &&
    currentStepIndex === modules[currentModuleIndex].steps.length - 1;

  return (
    <div className="h-full flex flex-col gap-5 overflow-y-auto pr-1 scrollbar-thin select-text">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground select-none font-medium">
        <span className="text-emerald-500 font-semibold">
          {module.title.includes("===")
            ? module.title.replace(/===/g, "").trim()
            : module.title.split(".")[0]}
        </span>
        <span className="opacity-40">/</span>
        <span className="truncate">{step.title}</span>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <h1 className="text-xl font-bold tracking-tight text-foreground leading-tight">
          {step.title}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {step.shortDescription}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/60" />

      {/* Concept Explanation */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide select-none">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Penjelasan</span>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
          {step.conceptExplanation.split("\n").map((para, idx) => {
            const formatted = para.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground font-semibold'>$1</strong>");
            const codeFormatted = formatted.replace(/`(.*?)`/g, "<code class='bg-muted px-1.5 py-0.5 rounded font-mono text-xs text-foreground border border-border/60'>$1</code>");
            return (
              <p
                key={idx}
                dangerouslySetInnerHTML={{ __html: codeFormatted }}
              />
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/60" />

      {/* Task Instructions */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide select-none">
          <CheckSquare className="h-3.5 w-3.5" />
          <span>Tugas Kamu</span>
        </div>
        <div
          className="text-sm text-foreground/85 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: step.instructions
              .replace(/\*\*(.*?)\*\*/g, "<strong class='text-emerald-600 dark:text-emerald-400 font-semibold'>$1</strong>")
              .replace(/`(.*?)`/g, "<code class='bg-muted px-1.5 py-0.5 rounded font-mono text-xs border border-border/60'>$1</code>")
          }}
        />
      </div>

      {/* Task List / Multi-cell steps */}
      {step.tasks && step.tasks.length > 0 && (
        <>
          <div className="h-px bg-border/60" />
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide select-none">
              <Lightbulb className="h-3.5 w-3.5" />
              <span>Daftar Sel Soal</span>
            </div>
            
            {/* Scrollable Container for Tasks */}
            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-border/80 hover:scrollbar-thumb-border scrollbar-track-transparent">
              {step.tasks.map((task, idx) => {
                const isCellActive = idx === selectedTaskIndex;
                const colLetter = String.fromCharCode(65 + task.resultCell.col);
                const rowNumber = step.dummyData[task.resultCell.row].rowNum;
                const cellAddress = `${colLetter}${rowNumber}`;

                const isCompleted = taskAnswers && taskAnswers[idx]
                  ? checkFormula(taskAnswers[idx], task.validFormulas)
                  : false;

                const isLocked = !isCompleted && isTaskLocked(task, taskAnswers, step.tasks!);

                return (
                  <div
                    key={idx}
                    onClick={() => !isSuccess && !isLocked && setSelectedTaskIndex(idx)}
                    className={cn(
                      "flex flex-col gap-1.5 px-3 py-2.5 rounded-lg border text-xs transition-all duration-150 select-none",
                      isCellActive
                        ? "bg-blue-500/5 border-blue-500/25 ring-1 ring-blue-500/20 cursor-pointer"
                        : isCompleted
                          ? "bg-emerald-500/5 border-emerald-500/20 cursor-pointer"
                          : isLocked
                            ? "bg-muted/10 border-dashed border-border/40 opacity-45 cursor-not-allowed"
                            : "border-border/50 hover:bg-muted/40 cursor-pointer"
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
                              : isLocked
                                ? "bg-muted border-border/30 text-muted-foreground/45"
                                : "bg-muted border-border/60 text-muted-foreground"
                        )}>
                          {cellAddress}
                        </span>
                        <span className={cn(
                          "font-medium",
                          isCompleted || isLocked ? "text-muted-foreground/60" : "text-foreground/80"
                        )}>{task.label}</span>
                      </div>
                      {isCompleted ? (
                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          <Check className="h-3 w-3" /> Selesai
                        </span>
                      ) : isCellActive ? (
                        <span className="text-[10px] text-blue-500 font-semibold animate-pulse">Aktif</span>
                      ) : isLocked ? (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50 font-medium">
                          <Lock className="h-3 w-3" /> Terkunci
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/50">Belum</span>
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

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2 mt-auto shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevStep}
          disabled={isFirstStep}
          className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 px-3"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Sebelumnya
        </Button>

        {isLastStep && isSuccess ? (
          <div className="flex items-center gap-1.5 text-emerald-500 font-semibold text-xs select-none">
            <Award className="h-4 w-4" />
            <span>Kursus Selesai!</span>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={nextStep}
            disabled={!isSuccess}
            className={cn(
              "font-semibold text-xs px-4 rounded-lg transition-all duration-200",
              isSuccess
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            Tantangan Berikutnya
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="border-t border-border/60 pt-4 shrink-0">
        <CurriculumList />
      </div>
    </div>
  );
}