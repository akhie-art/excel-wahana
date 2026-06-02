"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Navbar } from "@/components/navbar";
import { LeftPanel } from "@/components/left-panel";
import { ExcelTable } from "@/components/excel-table";
import { TaskSidebar } from "@/components/task-sidebar";
import { InstructorPanel } from "@/components/instructor-panel";
import { AuthModal } from "@/components/auth-modal";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BelajarPage() {
  const { loadUserAndProgress, isLoading, role, user } = useAppStore();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  // Load progress details and auth session on page load
  useEffect(() => {
    loadUserAndProgress();
  }, [loadUserAndProgress]);

  // Open AuthModal automatically if user is not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      setAuthOpen(true);
    }
  }, [isLoading, user]);

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

  // 1. Auth Guard / Login Wall
  if (!user) {
    return (
      <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
        
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800b_1px,transparent_1px),linear-gradient(to_bottom,#8080800b_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Header */}
        <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md z-10">
          <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md shadow-emerald-500/20">
                <span className="font-mono text-sm font-bold text-white">XL</span>
              </div>
              <span className="font-bold tracking-tight text-foreground text-base md:text-lg">ExcelMaster</span>
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Link>
          </div>
        </header>

        {/* Main Content Login Wall */}
        <main className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-md bg-card/60 border border-border/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center space-y-6">
            
            {/* Lock Badge */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wide uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Akses Terbatas</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Masuk ke Ruang Belajar</h2>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
                Silakan masuk atau buat akun baru terlebih dahulu untuk mengakses spreadsheet interaktif dan menyimpan progres belajar Anda.
              </p>
            </div>

            <div className="w-full flex flex-col space-y-3 pt-2">
              <Button 
                onClick={() => setAuthOpen(true)}
                className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                Masuk / Buat Akun
              </Button>
              <Link 
                href="/"
                className="w-full h-11 inline-flex items-center justify-center border border-border bg-background/40 hover:bg-background/80 text-foreground font-semibold rounded-xl text-xs transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-6 text-center text-xs text-muted-foreground border-t border-border/40 bg-background/50 backdrop-blur-sm">
          © {new Date().getFullYear()} ExcelMaster. Hak Cipta Dilindungi.
        </footer>

        {/* Auth Modal */}
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      </div>
    );
  }

  // 2. Main learning UI (Unlocks when user is logged in)
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
