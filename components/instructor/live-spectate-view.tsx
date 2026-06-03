"use client";

import { useAppStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getColLetter } from "./utils";
import { checkFormula } from "@/lib/modules";

interface LiveSpectateViewProps {
  studentId: string;
  onBack: () => void;
}

export function LiveSpectateView({ studentId, onBack }: LiveSpectateViewProps) {
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
                        {i === 0 ? "" : getColLetter(i - 1)}
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
                            ? checkFormula(
                                studentAnswer,
                                spectatedStep.tasks![taskIndex].validFormulas,
                                spectatedStep.tasks![taskIndex].expectedResult,
                                spectatedStep.dummyData,
                                spectatedStep.headers,
                                spectatedStudent.taskAnswers || [],
                                spectatedStep.tasks!
                              )
                            : checkFormula(
                                studentAnswer,
                                spectatedStep.validFormulas,
                                spectatedStep.expectedResult,
                                spectatedStep.dummyData,
                                spectatedStep.headers,
                                [],
                                []
                              ))
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
