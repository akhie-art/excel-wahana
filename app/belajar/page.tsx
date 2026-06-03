"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Navbar } from "@/components/navbar";
import { LeftPanel } from "@/components/left-panel";
import { ExcelTable } from "@/components/excel-table";
import { TaskSidebar } from "@/components/task-sidebar";
import { InstructorPanel } from "@/components/instructor-panel";
import { Loader2 } from "lucide-react";
import { useMultiplayer } from "@/hooks/use-multiplayer";
import { cn } from "@/lib/utils";

export default function BelajarPage() {
  const { loadUserAndProgress, isLoading, role, user } = useAppStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load progress details and auth session on page load
  useEffect(() => {
    loadUserAndProgress();
  }, [loadUserAndProgress]);

  // Auth route guard: redirect to landing page if not logged in
  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/?showLogin=true");
    }
  }, [mounted, isLoading, user, router]);

  // Activate multiplayer collaboration (presence & cursor sync)
  useMultiplayer();

  if (!mounted || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground space-y-4 select-none">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <div className="absolute font-mono text-[10px] text-emerald-500 font-bold">XL</div>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <p className="text-sm font-semibold tracking-tight">Menyiapkan Ruang Belajar...</p>
          <p className="text-xs text-muted-foreground font-mono">Menghubungkan progres belajar</p>
        </div>
      </div>
    );
  }

  // 2. Main learning UI (Unlocks when user is logged in)
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Glow blobs background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none z-0" />

      {/* Top Navigation */}
      {!isFullScreen && <Navbar />}

      {/* Main Content Layout */}
      <main className={cn(
        "flex-1 flex flex-col overflow-hidden relative z-10",
        isFullScreen
          ? "w-screen h-screen p-0 max-w-none bg-background"
          : "max-w-[1600px] w-full mx-auto px-5 py-5 h-[calc(100vh-64px)] overflow-hidden"
      )}>
        {role === "instruktur" ? (
          <InstructorPanel />
        ) : (
          <div className={cn(
            "flex-1 flex",
            isFullScreen
              ? "flex-row gap-0 h-full overflow-hidden"
              : "flex-col gap-4 h-full overflow-hidden"
          )}>
            {/* Top Panel: Theory & Instructions */}
            {!isFullScreen && (
              <section className="w-full shrink-0 bg-card/65 backdrop-blur-md border border-border/50 rounded-xl p-4.5 overflow-hidden shadow-sm">
                <LeftPanel />
              </section>
            )}

            {/* Bottom Panel: Interactive Canvas */}
            <section className={cn(
              "w-full flex-1 flex flex-col min-h-0 min-w-0 bg-background/95 backdrop-blur-sm md:bg-transparent h-full",
              isFullScreen ? "h-full" : "h-full"
            )}>
              {/* Interactive Sheet + Task Sidebar */}
              <div className={cn(
                "flex-1 flex flex-row overflow-hidden min-h-0 min-w-0",
                isFullScreen ? "gap-0" : "gap-4"
              )}>
                <div className="flex-1 h-full overflow-hidden min-h-0 min-w-0">
                  <ExcelTable
                     isFullScreen={isFullScreen}
                     isSidebarOpen={isSidebarOpen}
                     onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
                     onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  />
                </div>

                {isFullScreen && isSidebarOpen && (
                  <section className="h-full shrink-0">
                    <TaskSidebar onClose={() => setIsSidebarOpen(false)} isFullScreen={isFullScreen} />
                  </section>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
