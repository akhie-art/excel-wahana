"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Check, BookOpen, ChevronRight, ChevronDown } from "lucide-react";

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
      <div className="flex items-center space-x-2 pb-2 border-b border-border/80">
        <BookOpen className="h-4 w-4 text-emerald-500" />
        <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
          Daftar Kurikulum
        </h3>
      </div>

      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
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

          return (
            <div key={module.id} className="space-y-1">
              {/* Module header */}
              <div className="flex items-center justify-between px-2 py-1 select-none">
                <span className="text-xs font-bold text-foreground/80 truncate">
                  {module.title}
                </span>
                <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded font-medium">
                  {completedInModule}/{module.steps.length}
                </span>
              </div>

              {/* Rows */}
              <div className="space-y-0.5 pl-2 border-l border-border/60 ml-2">
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
                          "w-full text-left flex items-center justify-between p-2 rounded-lg text-xs transition-all duration-150 group",
                          isActive
                            ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          {isCompleted ? (
                            <div className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                              <Check className="h-2.5 w-2.5 stroke-[3px]" />
                            </div>
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-border/80 flex items-center justify-center shrink-0 group-hover:border-emerald-500/40 transition-colors">
                              <span className="text-[8px] font-mono text-muted-foreground/60 group-hover:text-emerald-500">
                                {item.originalIdx + 1}
                              </span>
                            </div>
                          )}
                          <span className="truncate">{item.title}</span>
                        </div>
                        <ChevronRight
                          className={cn(
                            "h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 shrink-0",
                            isActive && "opacity-100 translate-x-0 text-emerald-500"
                          )}
                        />
                      </button>
                    );
                  }

                  // ── Grouped steps (1 item in list, expandable) ───────────
                  const { groupId, groupLabel, items } = row;
                  const isExpanded = !collapsed[groupId]; // default: expanded
                  const completedInGroup = items.filter((s) =>
                    progress?.completed_steps?.includes(s.id)
                  ).length;
                  const allDone = completedInGroup === items.length;
                  const isGroupActive = items.some(
                    (s) => modIdx === currentModuleIndex && s.originalIdx === currentStepIndex
                  );

                  // Click the group header → jump to first incomplete step
                  const handleGroupHeaderClick = () => {
                    const firstIncomplete = items.find(
                      (s) => !progress?.completed_steps?.includes(s.id)
                    );
                    jumpToStep(modIdx, (firstIncomplete ?? items[items.length - 1]).originalIdx);
                  };

                  return (
                    <div key={groupId} className="space-y-0.5">
                      {/* Group header row */}
                      <div
                        className={cn(
                          "w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all duration-150",
                          isGroupActive
                            ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-semibold"
                            : "text-muted-foreground"
                        )}
                      >
                        {/* Expand/collapse toggle */}
                        <button
                          onClick={() => toggle(groupId)}
                          className="flex items-center space-x-2 flex-1 truncate text-left"
                        >
                          {/* Status icon */}
                          {allDone ? (
                            <div className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                              <Check className="h-2.5 w-2.5 stroke-[3px]" />
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                                isGroupActive
                                  ? "border-emerald-500 bg-emerald-500/10"
                                  : "border-border/80"
                              )}
                            >
                              <span className="text-[7px] font-bold font-mono leading-none">
                                {completedInGroup}/{items.length}
                              </span>
                            </div>
                          )}
                          <span className="truncate font-medium">{groupLabel}</span>
                        </button>

                        {/* Chevron toggle */}
                        <button
                          onClick={() => toggle(groupId)}
                          className="shrink-0 ml-1 p-0.5 hover:text-foreground"
                          title={isExpanded ? "Sembunyikan" : "Tampilkan"}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Sub-steps (visible when expanded) */}
                      {isExpanded && (
                        <div className="pl-6 space-y-0.5">
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
                                  "w-full text-left flex items-center space-x-1.5 px-2 py-1 rounded-md text-[11px] transition-all duration-150",
                                  isSubActive
                                    ? "text-emerald-500 dark:text-emerald-400 font-semibold"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                )}
                              >
                                {isSubCompleted ? (
                                  <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                                ) : (
                                  <span className="text-[9px] font-mono shrink-0">
                                    {subIdx + 1}.
                                  </span>
                                )}
                                <span className="truncate">{subLabel}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
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
