"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={props.className}
      {...props}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signInWithPassword, signUp, signInWithGithub, isConfigured } = useAppStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = isSignUp 
        ? await signUp(email) 
        : await signInWithPassword(email);

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
          setEmail("");
        }, 1500);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Terjadi kesalahan" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGithub();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Gagal menginisialisasi GitHub OAuth" });
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
            <strong>Berjalan dalam Mode Demo.</strong> Kamu bisa masuk menggunakan alamat email mana saja secara langsung tanpa verifikasi.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-background/50 border-border/60 focus-visible:ring-emerald-500/50"
                required
                disabled={isLoading}
              />
            </div>
          </div>

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
            className="w-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-medium transition-colors"
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

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Atau masuk dengan</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-border/60 bg-background/50 hover:bg-accent/40 text-foreground transition-all duration-200"
          onClick={handleGithubLogin}
          disabled={isLoading || !isConfigured}
          title={!isConfigured ? "Konfigurasikan variabel Supabase untuk mengaktifkan OAuth" : ""}
        >
          <GithubIcon className="mr-2 h-4 w-4" />
          GitHub
        </Button>

        <div className="text-center text-xs text-muted-foreground mt-4">
          {isSignUp ? (
            <p>
              Sudah punya akun?{" "}
              <button 
                onClick={() => setIsSignUp(false)} 
                className="text-emerald-500 hover:underline font-semibold"
              >
                Masuk
              </button>
            </p>
          ) : (
            <p>
              Belum punya akun?{" "}
              <button 
                onClick={() => setIsSignUp(true)} 
                className="text-emerald-500 hover:underline font-semibold"
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
