"use client";

import { useState } from "react";
import { useAppStore, StudentData } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";
import { Users, CheckCircle, Clock, BookOpen, Eye, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function StudentsTab() {
  const { students, modules } = useAppStore(
    useShallow((state) => ({
      students: state.students,
      modules: state.modules,
    }))
  );

  const [viewingStudent, setViewingStudent] = useState<StudentData | null>(null);

  const totalStepsCount = modules.reduce((acc, m) => acc + m.steps.length, 0);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Progres Belajar Peserta</h1>
        <p className="text-xs text-muted-foreground">Monitor nilai, tantangan terselesaikan, dan keaktifan belajar peserta didik.</p>
      </div>

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
                <th className="p-4 w-1/12 min-w-[100px]">Keaktifan Terakhir</th>
                <th className="p-4 w-[80px] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground text-xs font-sans">
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
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Tantangan Selesai</span>
                    <span className="text-xs font-bold text-foreground">{viewingStudent.completedCount} / {totalStepsCount}</span>
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
    </div>
  );
}
