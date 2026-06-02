"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, Lock, Key } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signInWithPassword, signUp, isConfigured } = useAppStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const deriveEmailFromName = (name: string): string => {
    const clean = name.trim();
    if (clean.includes("@")) {
      return clean.toLowerCase();
    }
    // Convert "Rudi Widodo" to "rudiwidodo@excelmaster.com"
    return clean.toLowerCase().replace(/[^a-z0-9]/g, "") + "@excelmaster.com";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;

    if (isSignUp) {
      if (password.length < 6) {
        setMessage({ type: "error", text: "Password minimal harus 6 karakter!" });
        return;
      }
      if (password !== confirmPassword) {
        setMessage({ type: "error", text: "Konfirmasi password tidak cocok!" });
        return;
      }
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const email = deriveEmailFromName(fullName);
      const { error } = isSignUp 
        ? await signUp(email, password, fullName) 
        : await signInWithPassword(email, password);

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ 
          type: "success", 
          text: isSignUp ? "Akun berhasil dibuat!" : "Berhasil masuk!" 
        });
        setTimeout(() => {
          onOpenChange(false);
          setMessage(null);
          setFullName("");
          setPassword("");
          setConfirmPassword("");
        }, 1500);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Terjadi kesalahan" });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] border border-border/80 bg-background/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-center">
            {isSignUp ? "Buat akun baru" : "Selamat datang kembali"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-sm mt-1">
            {isSignUp 
              ? "Bergabunglah dengan ExcelMaster untuk mencatat progres belajar kamu." 
              : "Masuk untuk melanjutkan pelajaran terakhir kamu."}
          </DialogDescription>
        </DialogHeader>

        {!isConfigured && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-lg p-3 text-xs leading-relaxed text-center my-1">
            <strong>Berjalan dalam Mode Demo.</strong> Kamu bisa membuat akun atau masuk menggunakan Nama Lengkap apa saja langsung tanpa verifikasi.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Full Name Input */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {isSignUp ? "Nama Lengkap" : "Nama Lengkap / Email"}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
              <Input
                id="fullName"
                type="text"
                placeholder={isSignUp ? "Nama Lengkap Anda" : "Nama Lengkap atau Email"}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-9 bg-background/50 border-border/60 focus-visible:ring-emerald-500/50"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 bg-background/50 border-border/60 focus-visible:ring-emerald-500/50"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Confirm Password Input (only on Sign Up) */}
          {isSignUp && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 bg-background/50 border-border/60 focus-visible:ring-emerald-500/50"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {message && (
            <div
              className={`p-3 rounded-lg text-xs leading-relaxed ${
                message.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-destructive/10 border border-destructive/20 text-destructive-foreground"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-medium transition-colors cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isSignUp ? (
              "Daftar"
            ) : (
              "Masuk"
            )}
          </Button>
        </form>


        <div className="text-center text-xs text-muted-foreground mt-4">
          {isSignUp ? (
            <p>
              Sudah punya akun?{" "}
              <button 
                onClick={() => setIsSignUp(false)} 
                className="text-emerald-500 hover:underline font-semibold cursor-pointer"
              >
                Masuk
              </button>
            </p>
          ) : (
            <p>
              Belum punya akun?{" "}
              <button 
                onClick={() => setIsSignUp(true)} 
                className="text-emerald-500 hover:underline font-semibold cursor-pointer"
              >
                Buat akun
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
