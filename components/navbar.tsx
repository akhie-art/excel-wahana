"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { EXCEL_MODULES } from "@/lib/modules";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Flame, Moon, Sun, User, Database, CheckCircle2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, progress, isConfigured, role, setRole, signOut } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md dark:shadow-teal-900/30">
              <span className="text-white font-extrabold text-base font-mono">X</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-foreground text-sm md:text-base">ExcelMaster</span>
              <span className="text-[10px] text-muted-foreground font-mono leading-none">Interactive LMS</span>
            </div>
          </div>

          <div className="h-9 w-9" />
        </div>
      </header>
    );
  }

  // Calculate total completed steps vs total steps
  const totalSteps = EXCEL_MODULES.reduce((acc, mod) => acc + mod.steps.length, 0);
  const completedSteps = progress?.completed_steps?.length || 0;
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const isInstructor = progress?.role === "instruktur" || user?.email === "instruktur@excel.com" || user?.email?.includes("instruktur");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md dark:shadow-teal-900/30">
            <span className="text-white font-extrabold text-base font-mono">X</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-foreground text-sm md:text-base">ExcelMaster</span>
            <span className="text-[10px] text-muted-foreground font-mono leading-none">Interactive LMS</span>
          </div>
        </div>

        {/* Course Progress Dashboard */}
        <div className="hidden md:flex items-center space-x-6 flex-1 max-w-lg mx-8">
          <div className="w-full space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Progres Belajar</span>
              </span>
              <span>{completedSteps} dari {totalSteps} tantangan</span>
            </div>
            <div className="h-2 w-full bg-secondary/80 rounded-full overflow-hidden border border-border/40">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">

          {/* Daily Streak */}
          {progress && role === "peserta" && (
            <div className="flex items-center space-x-1.5 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 text-amber-500 rounded-lg px-3 py-1.5 text-xs font-bold select-none">
              <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>{progress.streak_count} Hari</span>
            </div>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/40 hover:bg-accent/40"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>



          {/* Role Switcher Toggle Button */}
          {isInstructor && (
            <Button
              onClick={() => setRole(role === "instruktur" ? "peserta" : "instruktur")}
              className={cn(
                "h-9 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-xs border",
                role === "instruktur"
                  ? "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20"
                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
              )}
            >
              {role === "instruktur" ? (
                <>
                  <User className="h-3.5 w-3.5 text-rose-500" />
                  <span>Lihat Sebagai Siswa</span>
                </>
              ) : (
                <>
                  <Database className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Lihat Sebagai Instruktur</span>
                </>
              )}
            </Button>
          )}

          {/* User Info Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="h-9 px-3 text-xs font-semibold rounded-lg flex items-center gap-2 border border-border/80 bg-background/50 hover:bg-accent/40 select-none cursor-pointer text-foreground"
              >
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-[10px] uppercase">
                  {user.user_metadata?.name?.[0] || user.email?.[0] || "U"}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">
                  {user.user_metadata?.name || user.email?.split("@")[0]}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 border border-border/85 bg-card/95 backdrop-blur-md">
                <div className="flex flex-col space-y-1 px-2.5 py-2">
                  <span className="text-xs font-bold text-foreground truncate">
                    {user.user_metadata?.name || "Pengguna"}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground truncate">
                    {user.email}
                  </span>
                  <span className="inline-flex items-center self-start text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-muted mt-1 uppercase tracking-wide text-muted-foreground">
                    {progress?.role === "instruktur" ? "Instruktur" : "Peserta"}
                  </span>
                </div>
                
                <DropdownMenuSeparator />
                
                {isInstructor && (
                  <>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground px-2.5 pt-2 pb-1 select-none">
                      Mode Tampilan
                    </div>
                    <DropdownMenuItem
                      onClick={() => setRole("peserta")}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 cursor-pointer text-xs font-medium",
                        role === "peserta" && "bg-accent font-bold"
                      )}
                    >
                      <User className="h-3.5 w-3.5 text-rose-500" />
                      <span>Tampilan Peserta</span>
                      {role === "peserta" && <span className="ml-auto text-[9px] bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded-full font-bold">AKTIF</span>}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem
                      onClick={() => setRole("instruktur")}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 cursor-pointer text-xs font-medium",
                        role === "instruktur" && "bg-accent font-bold"
                      )}
                    >
                      <Database className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Tampilan Instruktur</span>
                      {role === "instruktur" && <span className="ml-auto text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full font-bold">AKTIF</span>}
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem
                  onClick={() => signOut()}
                  variant="destructive"
                  className="flex items-center gap-2 px-2 py-1.5 cursor-pointer text-xs font-medium text-rose-500 hover:bg-rose-500/10"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-500" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}