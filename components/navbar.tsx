"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { EXCEL_MODULES } from "@/lib/modules";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, // <-- Added this missing import
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { AuthModal } from "./auth-modal";
import { Award, Flame, LogOut, Moon, Sun, User, Database, ShieldAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, progress, isConfigured, signOut, role, setRole } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [authOpen, setAuthOpen] = useState(false);

  // Calculate total completed steps vs total steps
  const totalSteps = EXCEL_MODULES.reduce((acc, mod) => acc + mod.steps.length, 0);
  const completedSteps = progress?.completed_steps?.length || 0;
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

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

          {/* Connection Status Banner (Demo Mode) */}
          {!isConfigured && (
            <div className="hidden lg:flex items-center space-x-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-lg px-3 py-1.5 text-[11px] font-medium select-none">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Local Demo</span>
            </div>
          )}

          {/* Supabase Status Banner (Connected) */}
          {isConfigured && (
            <div className="hidden lg:flex items-center space-x-1 bg-emerald-500/15 border border-emerald-500/25 text-emerald-500 rounded-lg px-3 py-1.5 text-[11px] font-medium select-none">
              <Database className="h-3.5 w-3.5" />
              <span>Supabase Cloud</span>
            </div>
          )}

          {/* User Profile / Auth Action */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="h-9 px-3 space-x-2 border border-border/80 bg-background/50 hover:bg-accent/40 rounded-lg flex items-center cursor-pointer text-xs font-semibold text-foreground transition-all duration-150 outline-hidden">
                <User className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="max-w-[120px] truncate">
                  {user.email?.split("@")[0]}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border border-border/80 bg-background/95 backdrop-blur-md">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    Profil Saya
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <div className="px-2 py-1.5 text-sm font-medium text-foreground truncate">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs font-semibold text-muted-foreground select-none">
                  Streak: {progress?.streak_count} Hari
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs font-semibold text-muted-foreground select-none">
                  Tantangan: {completedSteps} Selesai
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={signOut}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-semibold text-xs"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => setAuthOpen(true)}
              className="h-9 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-semibold text-xs rounded-lg transition-colors px-4"
            >
              Masuk
            </Button>
          )}
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}