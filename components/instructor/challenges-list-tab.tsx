"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, PlusCircle, Lock, Sparkles, Binary, Search, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { ModuleStep } from "@/lib/modules";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateChallengeTab } from "./create-challenge-tab";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;

export function ChallengesListTab() {
  const { modules, deleteCustomStep } = useAppStore(
    useShallow((state) => ({
      modules: state.modules,
      deleteCustomStep: state.deleteCustomStep,
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStepInfo, setEditingStepInfo] = useState<{ step: ModuleStep; moduleId: string } | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModuleFilter, setSelectedModuleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Flatten steps for unified list view with search, filter, and pagination
  const allSteps = useMemo(() => {
    return modules.flatMap((module) => 
      module.steps.map((step) => ({
        ...step,
        moduleId: module.id,
        moduleTitle: module.title,
      }))
    );
  }, [modules]);

  // Filtered steps
  const filteredSteps = useMemo(() => {
    return allSteps.filter((step) => {
      const matchesSearch = 
        step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        step.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (step.validFormulas[0] && step.validFormulas[0].toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesModule = selectedModuleFilter === "all" || step.moduleId === selectedModuleFilter;

      return matchesSearch && matchesModule;
    });
  }, [allSteps, searchQuery, selectedModuleFilter]);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedModuleFilter]);

  // Pagination calculations
  const totalItems = filteredSteps.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  
  const paginatedSteps = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSteps.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredSteps, currentPage]);

  const startItemIndex = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItemIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  const totalStepsCount = allSteps.length;
  const customStepsCount = allSteps.filter((s) => s.isCustom).length;

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-border/40 gap-4 select-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
              Kurikulum & Tantangan
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {totalStepsCount} Total Soal
            </span>
            {customStepsCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {customStepsCount} Kustom
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Kelola materi modul pembelajaran, cari soal, dan tambahkan tantangan baru untuk peserta didik.
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Filters, and Create Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-muted/15 border border-border/50 p-3 rounded-2xl select-none">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
          <Input
            type="text"
            placeholder="Cari berdasarkan judul, deskripsi, atau rumus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs bg-background/50 border-border/60 focus-visible:ring-emerald-500/50"
          />
        </div>

        {/* Module Filter Dropdown */}
        <select
          value={selectedModuleFilter}
          onChange={(e) => setSelectedModuleFilter(e.target.value)}
          className="rounded-lg border border-border/60 bg-background/50 h-10 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer text-muted-foreground min-w-[150px]"
        >
          <option value="all">Semua Modul</option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>

        {/* Create Button */}
        <Button
          onClick={() => {
            setEditingStepInfo(null);
            setIsModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 h-10 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-xs transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tantangan Baru</span>
        </Button>
      </div>

      {/* Challenges List View */}
      {paginatedSteps.length > 0 ? (
        <div className="border border-border/60 bg-card/25 rounded-2xl overflow-hidden shadow-xs">
          <div className="divide-y divide-border/40">
            {paginatedSteps.map((step) => {
              return (
                <div 
                  key={step.id} 
                  className="p-4.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-muted/10 transition-colors duration-150 group/item"
                >
                  {/* Left side: Module Badge & Title & Description */}
                  <div className="space-y-1.5 min-w-0 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2 select-none">
                      <span className="text-[9px] font-sans font-bold text-muted-foreground/60 bg-muted border border-border/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {step.moduleTitle}
                      </span>
                      <span className="font-bold text-foreground text-xs leading-tight">
                        {step.title}
                      </span>
                      {step.isCustom ? (
                        <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-bold uppercase tracking-wider">
                          Kustom
                        </span>
                      ) : (
                        <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/60 font-semibold uppercase tracking-wider">
                          Bawaan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/80 font-sans leading-relaxed truncate-2-lines">
                      {step.shortDescription}
                    </p>
                  </div>

                  {/* Right side: Formula Code & Actions */}
                  <div className="flex items-center gap-3.5 shrink-0 justify-between lg:justify-end">
                    
                    {/* Answers Badges */}
                    <div className="flex flex-wrap items-center gap-2 select-none">
                      {step.tasks && step.tasks.length > 0 ? (
                        <span className="text-[10px] font-mono px-2.5 py-1 bg-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-500/10 rounded-lg font-bold flex items-center gap-1.5">
                          <Binary className="h-3.5 w-3.5" />
                          Ganda ({step.tasks.length} Sel Target)
                        </span>
                      ) : (
                        <>
                          <span 
                            title="Kunci Jawaban Rumus"
                            className="text-[10px] font-mono px-2.5 py-1 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 rounded-lg font-semibold flex items-center gap-1 max-w-[200px] truncate"
                          >
                            <span className="opacity-50 text-[9px]">fx</span> {step.validFormulas[0]}
                          </span>
                          {step.expectedResult && (
                            <span 
                              title="Nilai Hasil Target"
                              className="text-[10px] font-mono px-2.5 py-1 bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10 rounded-lg font-bold flex items-center gap-1"
                            >
                              <span className="opacity-50 text-[9px] font-sans font-bold">Hasil:</span> {step.expectedResult}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Divider on desktop */}
                    <div className="hidden lg:block h-4 w-[1px] bg-border/50" />

                    {/* Actions buttons */}
                    <div className="flex items-center gap-1.5">
                      {step.isCustom ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingStepInfo({ step, moduleId: step.moduleId });
                              setIsModalOpen(true);
                            }}
                            className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Edit Tantangan"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={async () => {
                              if (confirm(`Apakah Anda yakin ingin menghapus tantangan "${step.title}" dari kurikulum?`)) {
                                await deleteCustomStep(step.moduleId, step.id);
                              }
                            }}
                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Hapus Tantangan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      ) : (
                        <div 
                          className="h-8 w-8 flex items-center justify-center text-muted-foreground/40 rounded-lg"
                          title="Tantangan bawaan sistem tidak dapat diubah"
                        >
                          <Lock className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Footer */}
          <div className="p-4 bg-muted/10 border-t border-border/40 flex items-center justify-between gap-4 text-xs select-none">
            <span className="text-muted-foreground text-[11px] font-medium">
              Menampilkan <span className="font-bold text-foreground font-mono">{startItemIndex}</span> - <span className="font-bold text-foreground font-mono">{endItemIndex}</span> dari <span className="font-bold text-foreground font-mono">{totalItems}</span> tantangan
            </span>

            <div className="flex items-center gap-1.5">
              {/* Previous Page Button */}
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="h-8 w-8 rounded-lg cursor-pointer border-border/60 hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-xs font-bold font-mono cursor-pointer border-border/60",
                    currentPage === page 
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs" 
                      : "hover:bg-muted"
                  )}
                >
                  {page}
                </Button>
              ))}

              {/* Next Page Button */}
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="h-8 w-8 rounded-lg cursor-pointer border-border/60 hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <Card className="border border-dashed border-border/80 bg-card/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-2xs select-none">
          <div className="h-12 w-12 rounded-2xl bg-muted/40 border border-border/60 text-muted-foreground/60 flex items-center justify-center">
            <Inbox className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Tantangan Tidak Ditemukan</h3>
            <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
              Tidak ada tantangan yang cocok dengan pencarian atau filter modul yang aktif saat ini.
            </p>
          </div>
          {(searchQuery || selectedModuleFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedModuleFilter("all");
              }}
              className="text-[10px] font-bold h-8 border-border/60 hover:bg-muted rounded-lg cursor-pointer px-4"
            >
              Atur Ulang Pencarian
            </Button>
          )}
        </Card>
      )}

      {/* Modal Dialog for Creating/Editing Challenge */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && setIsModalOpen(false)}>
        <DialogContent className="max-w-6xl lg:max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto border border-border/80 bg-background/95 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{editingStepInfo ? "Edit Tantangan" : "Buat Tantangan Baru"}</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <CreateChallengeTab 
              editingStepInfo={editingStepInfo}
              onCancelEdit={() => setIsModalOpen(false)}
              onSubmitSuccess={() => setIsModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
