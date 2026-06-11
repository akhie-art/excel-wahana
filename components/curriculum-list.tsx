"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Check, BookOpen, ChevronRight, ChevronDown, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────────

interface StepWithIndex {
  id: string;
  title: string;
  group?: string;
  groupLabel?: string;
  originalIdx: number;
}

type CurriculumRow =
  | { kind: "step"; item: StepWithIndex }
  | { kind: "group"; groupId: string; groupLabel: string; items: StepWithIndex[] };

// ─── Component ──────────────────────────────────────────────────────────────

export function CurriculumList() {
  const { currentModuleIndex, currentStepIndex, progress, jumpToStep, modules } = useAppStore();

  // Groups are expanded by default
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-4">
      {/* Header Panel */}
      <div className="flex items-center space-x-2 pb-3 border-b border-border/60 select-none">
        <div className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
          <BookOpen className="h-3.5 w-3.5" />
        </div>
        <h3 className="font-extrabold text-xs text-foreground uppercase tracking-wider">
          Daftar Kurikulum & Latihan
        </h3>
      </div>

      {/* Curriculum Steps List */}
      <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border/80 hover:scrollbar-thumb-border">
        {modules.map((module, modIdx) => {
          const completedInModule = module.steps.filter((s) =>
            progress?.completed_steps?.includes(s.id)
          ).length;

          // Build flat list with original indices attached
          const stepsWithIdx: StepWithIndex[] = module.steps.map((s, i) => ({
            id: s.id,
            title: s.title,
            group: s.group,
            groupLabel: s.groupLabel,
            originalIdx: i,
          }));

          // Collapse into curriculum rows (individual or grouped)
          const rows: CurriculumRow[] = [];
          const seenGroups = new Set<string>();

          for (const s of stepsWithIdx) {
            if (s.group) {
              if (!seenGroups.has(s.group)) {
                seenGroups.add(s.group);
                rows.push({
                  kind: "group",
                  groupId: s.group,
                  groupLabel: s.groupLabel ?? s.group,
                  items: stepsWithIdx.filter((x) => x.group === s.group),
                });
              }
            } else {
              rows.push({ kind: "step", item: s });
            }
          }

          const isModuleActive = modIdx === currentModuleIndex;

          return (
            <div key={module.id} className="space-y-2">
              {/* Module header */}
              <div className="flex items-center justify-between px-2.5 py-1.5 select-none bg-muted/30 border border-border/40 rounded-xl">
                <span className={cn(
                  "text-xs font-black tracking-tight flex items-center gap-1.5",
                  isModuleActive ? "text-emerald-500 dark:text-emerald-400" : "text-foreground/80"
                )}>
                  <Layers className="h-3.5 w-3.5 shrink-0" />
                  {module.title}
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/15 shrink-0">
                  {completedInModule}/{module.steps.length} selesai
                </span>
              </div>

              {/* Rows List */}
              <div className="space-y-1.5 pl-2.5 border-l border-border/60 ml-3.5">
                {rows.map((row) => {
                  // ── Individual step ──────────────────────────────────────
                  if (row.kind === "step") {
                    const { item } = row;
                    const isActive =
                      modIdx === currentModuleIndex && item.originalIdx === currentStepIndex;
                    const isCompleted = progress?.completed_steps?.includes(item.id) ?? false;

                    return (
                      <button
                        key={item.id}
                        onClick={() => jumpToStep(modIdx, item.originalIdx)}
                        className={cn(
                          "w-full text-left flex items-center justify-between p-2 rounded-xl text-xs transition-all duration-200 group border relative cursor-pointer",
                          isActive
                            ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-500 dark:text-emerald-400 font-bold shadow-xs"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                          {isCompleted ? (
                            <div className="h-5 w-5 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                              <Check className="h-3 w-3 stroke-[3px]" />
                            </div>
                          ) : (
                            <div className={cn(
                              "h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 transition-all font-mono text-[9px] font-bold",
                              isActive
                                ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-500"
                                : "border-border bg-muted/20 text-muted-foreground/60 group-hover:border-emerald-500/40 group-hover:text-emerald-500"
                            )}>
                              {item.originalIdx + 1}
                            </div>
                          )}
                          <span className="truncate flex-1 pr-2 leading-none pt-0.5">{item.title}</span>
                        </div>
                        <ChevronRight
                          className={cn(
                            "h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0 text-muted-foreground",
                            isActive && "opacity-100 translate-x-0 text-emerald-500"
                          )}
                        />
                      </button>
                    );
                  }

                  // ── Grouped steps (expandable folder style) ──────────────────
                  const { groupId, groupLabel, items } = row;
                  const isExpanded = !collapsed[groupId]; // default: expanded
                  const completedInGroup = items.filter((s) =>
                    progress?.completed_steps?.includes(s.id)
                  ).length;
                  const allDone = completedInGroup === items.length;
                  const isGroupActive = items.some(
                    (s) => modIdx === currentModuleIndex && s.originalIdx === currentStepIndex
                  );

                  return (
                    <div key={groupId} className="space-y-1">
                      {/* Group header row */}
                      <div
                        className={cn(
                          "w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all duration-200 border",
                          isGroupActive
                            ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-bold"
                            : "border-transparent text-muted-foreground"
                        )}
                      >
                        {/* Expand/collapse toggle */}
                        <button
                          onClick={() => toggle(groupId)}
                          className="flex items-center space-x-2.5 min-w-0 flex-1 text-left cursor-pointer"
                        >
                          {/* Status icon */}
                          {allDone ? (
                            <div className="h-5 w-5 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                              <Check className="h-3 w-3 stroke-[3px]" />
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 transition-all font-mono text-[9px] font-black",
                                isGroupActive
                                  ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-500"
                                  : "border-border bg-muted/20 text-muted-foreground/60"
                              )}
                            >
                              {completedInGroup}/{items.length}
                            </div>
                          )}
                          <span className="truncate flex-1 pr-2 font-extrabold text-foreground leading-none pt-0.5">{groupLabel}</span>
                        </button>

                        {/* Chevron toggle */}
                        <button
                          onClick={() => toggle(groupId)}
                          className="shrink-0 ml-1 p-1 hover:text-foreground text-muted-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                          title={isExpanded ? "Sembunyikan" : "Tampilkan"}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Sub-steps (animated drop-down container) */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="pl-5 space-y-1 border-l border-border/40 ml-4.5 overflow-hidden"
                          >
                            {items.map((s, subIdx) => {
                              const isSubActive =
                                modIdx === currentModuleIndex && s.originalIdx === currentStepIndex;
                              const isSubCompleted =
                                progress?.completed_steps?.includes(s.id) ?? false;
                              // Extract suffix after last " - "
                              const subLabel = s.title.includes(" - ")
                                ? s.title.split(" - ").slice(-1)[0]
                                : s.title;

                              return (
                                <button
                                  key={s.id}
                                  onClick={() => jumpToStep(modIdx, s.originalIdx)}
                                  className={cn(
                                    "w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-[11px] transition-all duration-200 group border cursor-pointer",
                                    isSubActive
                                      ? "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-bold"
                                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                  )}
                                >
                                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                                    {isSubCompleted ? (
                                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                    ) : (
                                      <span className={cn(
                                        "text-[9px] font-mono shrink-0 w-4 font-bold",
                                        isSubActive ? "text-emerald-500" : "text-muted-foreground/60"
                                      )}>
                                        {subIdx + 1}.
                                      </span>
                                    )}
                                    <span className="truncate flex-1 pr-2 leading-none pt-0.5">{subLabel}</span>
                                  </div>
                                  <ChevronRight
                                    className={cn(
                                      "h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0 text-muted-foreground",
                                      isSubActive && "opacity-100 translate-x-0 text-emerald-500"
                                    )}
                                  />
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
