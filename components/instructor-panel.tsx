"use client";

import { useState } from "react";
import { StudentsTab } from "./instructor/students-tab";
import { ChallengesListTab } from "./instructor/challenges-list-tab";
import { LiveSpectateView } from "./instructor/live-spectate-view";
import { LiveMonitoringTab } from "./instructor/live-monitoring-tab";
import { TemplatesTab } from "./instructor/templates-tab";
import { useAppStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";
import { Users, List, Radio, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

export function InstructorPanel() {
  const [activeTab, setActiveTab] = useState<"live" | "students" | "list" | "templates">("students");
  const [spectatedStudentId, setSpectatedStudentId] = useState<string | null>(null);

  const { peerStates } = useAppStore(
    useShallow((state) => ({
      peerStates: state.peerStates,
    }))
  );

  const onlineCount = Object.values(peerStates).filter(
    (peer) => peer && peer.role === "peserta"
  ).length;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 h-[calc(100vh-100px)] overflow-hidden">
      
      {/* Sidebar Controls Panel */}
      <div className="w-full md:w-64 shrink-0 flex flex-col space-y-2 bg-card border border-border/80 rounded-xl p-4 shadow-sm select-none">
        <div className="px-2 py-1 pb-3 border-b border-border/60">
          <h2 className="text-sm font-bold tracking-tight text-foreground">Dasbor Instruktur</h2>
          <p className="text-[10px] text-muted-foreground font-mono">PANEL KONTROL UTAMA</p>
        </div>

        <button
          onClick={() => {
            setActiveTab("students");
            setSpectatedStudentId(null);
          }}
          className={cn(
            "w-full text-left flex items-center space-x-2.5 p-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer",
            activeTab === "students" && !spectatedStudentId
              ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <Users className="h-4 w-4" />
          <span>Progres Belajar</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("live");
            setSpectatedStudentId(null);
          }}
          className={cn(
            "w-full text-left flex items-center justify-between p-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer",
            activeTab === "live" && !spectatedStudentId
              ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <div className="flex items-center space-x-2.5">
            <Radio className={cn("h-4 w-4", onlineCount > 0 && "text-rose-500 animate-pulse")} />
            <span>Pantau Live</span>
          </div>
          {onlineCount > 0 && (
            <span className="text-[9px] font-mono font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse">
              {onlineCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab("list");
            setSpectatedStudentId(null);
          }}
          className={cn(
            "w-full text-left flex items-center space-x-2.5 p-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer",
            activeTab === "list" && !spectatedStudentId
              ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <List className="h-4 w-4" />
          <span>Daftar Tantangan</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("templates");
            setSpectatedStudentId(null);
          }}
          className={cn(
            "w-full text-left flex items-center space-x-2.5 p-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer",
            activeTab === "templates" && !spectatedStudentId
              ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Kelola Template</span>
        </button>
      </div>

      {/* Main Panel Content (Scrollable) */}
      <div className="flex-1 h-full overflow-y-auto pr-2 pb-6">
        
        {spectatedStudentId ? (
          /* Live Monitoring Screen delegated to separate optimized component */
          <LiveSpectateView 
            studentId={spectatedStudentId} 
            onBack={() => setSpectatedStudentId(null)} 
          />
        ) : (
          <>
            {/* Tab 1: Students Analytics List */}
            {activeTab === "students" && (
              <StudentsTab />
            )}

            {/* Tab 2: Live Monitoring Screen */}
            {activeTab === "live" && (
              <LiveMonitoringTab onSpectate={(id) => setSpectatedStudentId(id)} />
            )}

            {/* Tab 3: List challenges with nested dialog for Create/Edit */}
            {activeTab === "list" && (
              <ChallengesListTab />
            )}

            {/* Tab 4: Manage templates CRUD */}
            {activeTab === "templates" && (
              <TemplatesTab />
            )}
          </>
        )}

      </div>
    </div>
  );
}


