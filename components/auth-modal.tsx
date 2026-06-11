"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, Lock, Key, Eye, EyeOff, Sparkles, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSignUp?: boolean;
  defaultResetPassword?: boolean;
  defaultErrorMessage?: string;
}

const translateAuthError = (message: string): string => {
  const msg = message.toLowerCase();
  if (msg.includes("invalid login credentials")) {
    return "Nama lengkap/email atau password salah!";
  }
  if (msg.includes("user already registered") || msg.includes("already registered")) {
    return "Nama lengkap atau email sudah terdaftar!";
  }
  if (msg.includes("password should be at least")) {
    return "Password minimal harus 6 karakter!";
  }
  if (msg.includes("signup requires a valid password") || msg.includes("signup requires a password")) {
    return "Registrasi memerlukan password yang valid!";
  }
  if (msg.includes("invalid email")) {
    return "Format email tidak valid!";
  }
  if (msg.includes("unsupported provider") || msg.includes("provider is not enabled")) {
    return "Metode Google Sign-In belum diaktifkan di Dashboard Supabase. Harap aktifkan di menu Authentication -> Providers -> Google.";
  }
  if (msg.includes("security purposes") && msg.includes("request this after")) {
    const secondsMatch = msg.match(/after (\d+) seconds/);
    const seconds = secondsMatch ? secondsMatch[1] : "beberapa";
    return `Demi keamanan, Anda hanya dapat mengirim ulang permintaan setelah ${seconds} detik.`;
  }
  return message;
};

export function AuthModal({ 
  open, 
  onOpenChange, 
  defaultSignUp = false, 
  defaultResetPassword = false,
  defaultErrorMessage = ""
}: AuthModalProps) {
  const { signInWithPassword, signUp, signInWithGoogle, resetPassword, updatePassword, isConfigured } = useAppStore();
  const [isSignUp, setIsSignUp] = useState(defaultSignUp);
  const [authView, setAuthView] = useState<"auth" | "forgot" | "reset">("auth");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (open) {
      setIsSignUp(defaultSignUp);
      setAuthView(defaultResetPassword ? "reset" : "auth");
      if (defaultErrorMessage) {
        setMessage({ type: "error", text: defaultErrorMessage });
      } else {
        setMessage(null);
      }
    } else {
      setShowPassword(false);
      setShowConfirmPassword(false);
      setAuthView("auth");
      setIsGoogleLoading(false);
      setMessage(null);
    }
  }, [open, defaultSignUp, defaultResetPassword, defaultErrorMessage]);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string; color: string }>({
    score: 0,
    label: "",
    color: "",
  });

  // Calculate password strength for registration
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: "", color: "" });
      return;
    }
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = "Sangat Lemah";
    let color = "bg-rose-500";
    if (score >= 4) {
      label = "Sangat Kuat";
      color = "bg-emerald-500";
    } else if (score >= 3) {
      label = "Kuat";
      color = "bg-teal-500";
    } else if (score >= 2) {
      label = "Sedang";
      color = "bg-amber-500";
    } else if (score >= 1) {
      label = "Lemah";
      color = "bg-rose-400";
    }

    setPasswordStrength({ score, label, color });
  }, [password]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setMessage(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setMessage({ type: "error", text: translateAuthError(error.message) });
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: translateAuthError(err.message || "Terjadi kesalahan") });
      setIsGoogleLoading(false);
    }
  };

  const deriveEmailFromName = (name: string): string => {
    const clean = name.trim();
    if (clean.includes("@")) {
      return clean.toLowerCase();
    }
    return clean.toLowerCase().replace(/[^a-z0-9]/g, "") + "@excelwahana.com";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authView === "forgot") {
      if (!fullName) {
        setMessage({ type: "error", text: "Email tidak boleh kosong!" });
        return;
      }
      setIsLoading(true);
      setMessage(null);
      try {
        const { error } = await resetPassword(fullName.trim());
        if (error) {
          setMessage({ type: "error", text: translateAuthError(error.message) });
        } else {
          setMessage({
            type: "success",
            text: "Link reset password telah dikirim ke email Anda!"
          });
          setFullName("");
        }
      } catch (err: any) {
        setMessage({ type: "error", text: translateAuthError(err.message || "Terjadi kesalahan") });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (authView === "reset") {
      if (password.length < 6) {
        setMessage({ type: "error", text: "Password minimal harus 6 karakter!" });
        return;
      }
      if (password !== confirmPassword) {
        setMessage({ type: "error", text: "Konfirmasi password tidak cocok!" });
        return;
      }
      setIsLoading(true);
      setMessage(null);
      try {
        const { error } = await updatePassword(password);
        if (error) {
          setMessage({ type: "error", text: translateAuthError(error.message) });
        } else {
          setMessage({
            type: "success",
            text: "Password berhasil diperbarui! Silakan gunakan password baru Anda."
          });
          setTimeout(() => {
            onOpenChange(false);
            setMessage(null);
            setPassword("");
            setConfirmPassword("");
            setAuthView("auth");
          }, 2000);
        }
      } catch (err: any) {
        setMessage({ type: "error", text: translateAuthError(err.message || "Terjadi kesalahan") });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Default "auth" view
    if (!fullName) {
      setMessage({ type: "error", text: "Nama lengkap tidak boleh kosong!" });
      return;
    }

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
        setMessage({ type: "error", text: translateAuthError(error.message) });
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
      setMessage({ type: "error", text: translateAuthError(err.message || "Terjadi kesalahan") });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-md md:max-w-[780px] p-0 overflow-hidden border border-border/60 bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col md:flex-row h-auto">
        
        {/* Left Side: Product Illustration (Visible only on desktop md and up) */}
        <div className="w-full md:w-[360px] bg-muted/40 dark:bg-muted/10 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border/40 relative overflow-hidden hidden md:flex shrink-0 select-none">
          {/* Background glows */}
          <div className="absolute -left-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 relative z-10">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md dark:shadow-teal-900/20">
              <span className="text-white font-extrabold text-sm font-mono">X</span>
            </div>
            <span className="font-extrabold tracking-tight text-foreground text-sm">Excel Wahana</span>
          </div>

          {/* Headline & Mini Simulator Mockup */}
          <div className="space-y-6 my-auto relative z-10">
            <h3 className="text-base font-bold text-foreground leading-tight text-left">
              Simulator Excel Interaktif
            </h3>

            {/* Mini Mock Spreadsheet Illustration */}
            <div className="bg-background/60 dark:bg-background/30 border border-border/40 rounded-xl p-4 shadow-sm backdrop-blur-xs relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-mono text-muted-foreground font-bold tracking-wider">LATIHAN SIMULATOR</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-1.5 font-mono text-[9px]">
                {/* Header Row */}
                <div className="grid grid-cols-3 gap-2 pb-1 border-b border-border/40 text-muted-foreground font-bold">
                  <div>Gaji Pokok</div>
                  <div>Tunjangan</div>
                  <div>Total Gaji</div>
                </div>
                {/* Data Row */}
                <div className="grid grid-cols-3 gap-2 text-foreground/80">
                  <div>5.000.000</div>
                  <div>1.000.000</div>
                  <div className="text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.5 rounded flex items-center justify-between">
                    <span>6.000.000</span>
                    <span className="text-[8px] font-bold">✓</span>
                  </div>
                </div>
                {/* Active Cell Formula Input Bar */}
                <div className="mt-3 pt-2 border-t border-border/40 flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold text-[10px]">fx</span>
                  <div className="bg-background/80 dark:bg-background/40 border border-border/60 rounded px-2 py-0.5 flex-1 text-muted-foreground select-none">
                    =SUM(A2:B2)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal footer */}
          <div className="text-[10px] text-muted-foreground/50 relative z-10 pt-4 border-t border-border/20">
            Wahana Prestasi © {new Date().getFullYear()}
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative">
          {/* Top Accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 md:hidden" />

          <DialogHeader className="flex flex-col items-center md:items-start pt-2 md:pt-0">
            {/* Logo visible only on mobile */}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md dark:shadow-teal-900/20 mb-3 select-none md:hidden">
              <span className="text-white font-extrabold text-base font-mono">X</span>
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-center md:text-left text-foreground">
              {authView === "forgot" 
                ? "Reset Password" 
                : authView === "reset" 
                  ? "Perbarui Password" 
                  : isSignUp ? "Buat Akun Baru" : "Selamat Datang Kembali"}
            </DialogTitle>
            <DialogDescription className="text-center md:text-left text-muted-foreground text-xs mt-1.5 max-w-[280px] md:max-w-none leading-relaxed">
              {authView === "forgot"
                ? "Masukkan alamat email terdaftar Anda untuk menerima link reset password."
                : authView === "reset"
                  ? "Tentukan password baru untuk mengamankan akun Anda."
                  : isSignUp 
                    ? "Daftar untuk mencatat progres belajar simulator Excel secara interaktif." 
                    : "Masuk untuk melanjutkan tantangan spreadsheet Anda."}
            </DialogDescription>
          </DialogHeader>

          {authView === "auth" && (
            <>
              {/* Sliding Tab Switcher */}
              <div className="relative flex p-1 bg-muted/60 dark:bg-muted/30 rounded-xl border border-border/40 my-4 select-none">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setMessage(null); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg relative z-10 transition-colors duration-200 cursor-pointer ${
                    !isSignUp ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {!isSignUp && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-20 flex items-center justify-center gap-1.5">
                    Masuk
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setMessage(null); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg relative z-10 transition-colors duration-200 cursor-pointer ${
                    isSignUp ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isSignUp && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-20 flex items-center justify-center gap-1.5">
                    Daftar
                  </span>
                </button>
              </div>

              {/* Google OAuth Login Button */}
              <div className="space-y-3 mb-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full h-10 text-xs font-semibold border-border/60 hover:bg-muted/40 rounded-xl cursor-pointer flex items-center justify-center transition-all duration-200 select-none shadow-xs"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <svg className="mr-2.5 h-4 w-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          fill="#EA4335"
                        />
                      </svg>
                      {isSignUp ? "Daftar dengan Google" : "Masuk dengan Google"}
                    </>
                  )}
                </Button>

                <div className="relative flex py-1.5 items-center select-none">
                  <div className="flex-grow border-t border-border/40" />
                  <span className="flex-shrink mx-3 text-muted-foreground/50 text-[10px] uppercase font-bold tracking-wider">Atau</span>
                  <div className="flex-grow border-t border-border/40" />
                </div>
              </div>
            </>
          )}

          {authView === "auth" && !isConfigured && (
            <div className="relative overflow-hidden bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border border-amber-500/15 text-amber-600 dark:text-amber-500 rounded-xl p-3 text-xs leading-relaxed text-left flex gap-2.5 mb-3 shadow-xs select-none">
              <ShieldCheck className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="font-bold text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-500">Mode Demo Aktif</strong>
                <p className="text-muted-foreground/80 dark:text-muted-foreground/60 text-[10px] leading-relaxed">
                  Masukkan Nama Lengkap apa saja langsung untuk login. Tidak memerlukan registrasi atau password asli.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authView === "forgot" && (
              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Alamat Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@anda.com"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-9 bg-background/30 dark:bg-background/20 border-border/40 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {authView === "reset" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10 bg-background/30 dark:bg-background/20 border-border/40 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground/60 hover:text-foreground cursor-pointer focus:outline-none transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9 pr-10 bg-background/30 dark:bg-background/20 border-border/40 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground/60 hover:text-foreground cursor-pointer focus:outline-none transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {authView === "auth" && (
              <>
                {/* Full Name Input */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {isSignUp ? "Nama Lengkap" : "Nama Lengkap atau Email"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={isSignUp ? "Nama Lengkap Anda" : "Nama Lengkap atau Email"}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-9 bg-background/30 dark:bg-background/20 border-border/40 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Password
                    </label>
                    {isSignUp && passwordStrength.label && (
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        Kekuatan: <span className={passwordStrength.score >= 3 ? "text-emerald-500 font-bold" : passwordStrength.score >= 2 ? "text-amber-500 font-bold" : "text-rose-500 font-bold"}>{passwordStrength.label}</span>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10 bg-background/30 dark:bg-background/20 border-border/40 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground/60 hover:text-foreground cursor-pointer focus:outline-none transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {/* Password strength progress bar */}
                  {isSignUp && password && (
                    <div className="h-1 w-full bg-muted/60 dark:bg-muted/20 rounded-full overflow-hidden mt-1 flex gap-1 select-none">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength.score ? passwordStrength.color : "bg-muted/80 dark:bg-muted/40"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  {/* Lupa Password trigger */}
                  {!isSignUp && (
                    <div className="text-right mt-1.5">
                      <button
                        type="button"
                        onClick={() => { setMessage(null); setAuthView("forgot"); }}
                        className="text-[11px] text-emerald-500 hover:text-emerald-400 font-semibold cursor-pointer focus:outline-none"
                      >
                        Lupa password?
                      </button>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input (only on Sign Up) */}
                <AnimatePresence mode="wait">
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label htmlFor="confirmPassword" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Konfirmasi Password
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-9 pr-10 bg-background/30 dark:bg-background/20 border-border/40 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 text-muted-foreground/60 hover:text-foreground cursor-pointer focus:outline-none transition-colors"
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl text-xs leading-relaxed border ${
                  message.type === "success"
                    ? "bg-emerald-500/[0.04] border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-destructive/[0.04] border-destructive/20 text-destructive dark:text-red-400"
                }`}
              >
                {message.text}
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 text-white font-semibold transition-all duration-300 py-5 rounded-xl cursor-pointer shadow-md shadow-emerald-500/10 dark:shadow-emerald-500/5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    {authView === "forgot"
                      ? "Kirim Link Reset"
                      : authView === "reset"
                        ? "Perbarui Password"
                        : isSignUp ? "Daftar Sekarang" : "Masuk ke Dashboard"}
                    <Sparkles className="h-3.5 w-3.5 text-emerald-100" />
                  </span>
                )}
              </Button>
            </motion.div>

            {authView === "forgot" && (
              <div className="text-center mt-3 select-none">
                <button
                  type="button"
                  onClick={() => { setMessage(null); setAuthView("auth"); }}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer focus:outline-none transition-colors"
                >
                  ← Kembali ke Halaman Masuk
                </button>
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
