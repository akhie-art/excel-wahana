"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Navbar } from "@/components/navbar";
import { LeftPanel } from "@/components/left-panel";
import { ExcelTable } from "@/components/excel-table";
import { TaskSidebar } from "@/components/task-sidebar";
import { InstructorPanel } from "@/components/instructor-panel";
import { Loader2, Database, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { loadUserAndProgress, isLoading, isConfigured, role } = useAppStore();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load progress details and auth session on page load
  useEffect(() => {
    loadUserAndProgress();
  }, [loadUserAndProgress]);

  if (isLoading) {
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navigation */}
      {!isFullScreen && <Navbar />}

      {/* Main Content Layout */}
      <main className={cn(
        "flex-1 flex flex-col overflow-hidden",
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
              : "flex-col md:flex-row gap-5 h-full overflow-y-auto md:overflow-hidden pr-0 md:pr-1 scrollbar-thin"
          )}>
            {/* Left Panel: Theory & Instructions */}
            {!isFullScreen && (
              <section className="flex flex-col w-full md:w-[36%] h-auto md:h-full min-h-[250px] bg-card border border-border/60 rounded-xl p-5 overflow-hidden order-2 md:order-1">
                <LeftPanel />
              </section>
            )}

            {/* Right Panel: Interactive Canvas */}
            <section className={cn(
              "w-full md:flex-1 flex flex-col sticky top-0 md:relative z-20 order-1 md:order-2 bg-background/95 backdrop-blur-sm pb-2 md:pb-0 md:bg-transparent min-h-0",
              isFullScreen ? "h-full" : "h-[360px] sm:h-[440px] md:h-full shrink-0 md:shrink"
            )}>
              {/* Interactive Sheet + Task Sidebar */}
              <div className={cn(
                "flex-1 flex flex-row overflow-hidden min-h-0",
                isFullScreen ? "gap-0" : "gap-5"
              )}>
                <div className="flex-1 h-full overflow-hidden min-h-0">
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
