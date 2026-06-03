"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { AuthModal } from "@/components/auth-modal";
import { useTheme } from "next-themes";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Table, 
  Terminal, 
  Award, 
  Eye, 
  HelpCircle, 
  Zap, 
  GraduationCap, 
  BookOpen, 
  UserCheck,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react";

export default function LandingPage() {
  const { user, loadUserAndProgress } = useAppStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? resolvedTheme : "dark";
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [defaultSignUp, setDefaultSignUp] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openAuthModal = (signUp: boolean) => {
    setDefaultSignUp(signUp);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    loadUserAndProgress();
  }, [loadUserAndProgress]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("showLogin") === "true") {
        openAuthModal(false); // Open in Login mode
        router.replace("/");
      }
    }
  }, [router]);

  // ─── Scroll-Driven Parallax ────────────────────────────────────────────────
  const { scrollY } = useScroll();
  
  // Background glowing blobs shift at different ratios
  const yBlob1 = useTransform(scrollY, [0, 800], [0, -120]);
  const yBlob2 = useTransform(scrollY, [0, 800], [0, 100]);
  const yBlob3 = useTransform(scrollY, [0, 800], [0, -60]);
  
  // Background grid pattern shifts slightly slower
  const yGrid = useTransform(scrollY, [0, 800], [0, -50]);

  // Main visual mockup card shifts on scroll
  const yCardScroll = useTransform(scrollY, [0, 800], [0, -40]);

  // ─── Mouse-Interactive Parallax ───────────────────────────────────────────
  // Motion values for normalized cursor coordinates (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for cursor movement
  const springX = useSpring(mouseX, { stiffness: 120, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 18 });

  // 3D Card Rotation based on mouse
  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  // Glare radial background
  const glareBg = useTransform(
    [springX, springY],
    ([xVal, yVal]) => {
      const pctX = (Number(xVal) + 0.5) * 100;
      const pctY = (Number(yVal) + 0.5) * 100;
      return `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(16, 185, 129, 0.12) 0%, transparent 60%)`;
    }
  );

  // Multi-layered offset values for floating icons/elements
  const floatX1 = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const floatY1 = useTransform(springY, [-0.5, 0.5], [-20, 20]);
  
  const floatX2 = useTransform(springX, [-0.5, 0.5], [30, -30]);
  const floatY2 = useTransform(springY, [-0.5, 0.5], [30, -30]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    mouseX.set(x / width);
    mouseY.set(y / height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Background Decorative Gradients & Grid Wrapper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div style={{ y: yBlob1 }} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <motion.div style={{ y: yBlob2 }} className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/10 blur-[150px]" />
        <motion.div style={{ y: yBlob3 }} className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[100px]" />
        <motion.div style={{ y: yGrid }} className="absolute inset-0 bg-[linear-gradient(to_right,#8080800b_1px,transparent_1px),linear-gradient(to_bottom,#8080800b_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* 1. Header/Navbar */}
      <header className="sticky top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-md z-50 transition-all">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md shadow-emerald-500/20">
              <span className="font-mono text-sm font-bold text-white">XL</span>
            </div>
            <span className="font-bold tracking-tight text-foreground text-base md:text-lg">ExcelMaster</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
            <a href="#fitur" className="hover:text-emerald-500 transition-colors">Fitur Utama</a>
            <a href="#kurikulum" className="hover:text-emerald-500 transition-colors">Kurikulum</a>
            <a href="#faq" className="hover:text-emerald-500 transition-colors">FAQ</a>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <div className="flex items-center p-0.5 bg-muted/40 border border-border/30 rounded-full mr-2">
              <button
                onClick={() => setTheme("light")}
                className={`h-8 px-2.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTheme === "light"
                    ? "bg-white text-amber-500 shadow-xs border border-border/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Light Mode"
              >
                <Sun className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Light</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`h-8 px-2.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTheme === "dark"
                    ? "bg-slate-800 text-sky-400 shadow-xs border border-border/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Dark Mode"
              >
                <Moon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Dark</span>
              </button>
            </div>

            {mounted && user ? (
              <Link 
                href="/belajar" 
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs font-semibold text-foreground rounded-lg group bg-gradient-to-br from-emerald-500 to-blue-600 group-hover:from-emerald-500 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-emerald-800 transition-all mt-2 cursor-pointer"
              >
                <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 font-medium tracking-tight">
                  Dashboard Belajar
                </span>
              </Link>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal(false)}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-1.5"
                >
                  Masuk
                </button>
                <button
                  onClick={() => openAuthModal(true)}
                  className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs font-semibold text-foreground rounded-lg group bg-gradient-to-br from-emerald-500 to-blue-600 group-hover:from-emerald-500 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-emerald-800 transition-all mt-2 cursor-pointer"
                >
                  <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 font-medium tracking-tight">
                    Mulai Belajar
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg border border-border/40 hover:bg-muted/10 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-background/95 backdrop-blur-md border-b border-border/40 z-40 p-6 flex flex-col space-y-6 shadow-xl animate-in slide-in-from-top-5 duration-200">
            <nav className="flex flex-col space-y-4 font-semibold text-foreground text-sm">
              <a 
                href="#fitur" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-emerald-500 transition-colors py-2 border-b border-border/20"
              >
                Fitur Utama
              </a>
              <a 
                href="#kurikulum" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-emerald-500 transition-colors py-2 border-b border-border/20"
              >
                Kurikulum
              </a>
              <a 
                href="#faq" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-emerald-500 transition-colors py-2"
              >
                FAQ
              </a>
            </nav>

            <div className="flex flex-col space-y-4 pt-4 border-t border-border/40">
              {/* Theme Toggle (Mobile) */}
              <div className="flex flex-col space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pilih Tema</span>
                <div className="flex items-center p-0.5 bg-muted/40 border border-border/30 rounded-full w-fit">
                  <button
                    onClick={() => setTheme("light")}
                    className={`h-8 px-4 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      activeTheme === "light"
                        ? "bg-white text-amber-500 shadow-xs border border-border/10"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`h-8 px-4 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      activeTheme === "dark"
                        ? "bg-slate-800 text-sky-400 shadow-xs border border-border/10"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* Auth/Dashboard Actions (Mobile) */}
              <div className="flex flex-col space-y-2 pt-2">
                {mounted && user ? (
                  <Link 
                    href="/belajar" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-semibold text-foreground rounded-lg group bg-gradient-to-br from-emerald-500 to-blue-600 group-hover:from-emerald-500 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-emerald-800 transition-all cursor-pointer"
                  >
                    <span className="w-full text-center relative px-4 py-2.5 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 font-medium tracking-tight">
                      Dashboard Belajar
                    </span>
                  </Link>
                ) : (
                  <div className="flex flex-col space-y-2.5">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal(false);
                      }}
                      className="w-full text-center py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border/60 hover:bg-muted/10 rounded-lg transition-colors cursor-pointer"
                    >
                      Masuk
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal(true);
                      }}
                      className="w-full inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-semibold text-foreground rounded-lg group bg-gradient-to-br from-emerald-500 to-blue-600 group-hover:from-emerald-500 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-emerald-800 transition-all cursor-pointer"
                    >
                      <span className="w-full text-center relative px-4 py-2.5 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 font-medium tracking-tight">
                        Mulai Belajar
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 max-w-[1400px] mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 overflow-visible"
      >
        {/* Floating Parallax Elements (Formulas/Icons) */}
        <motion.div
          style={{ x: floatX1, y: floatY2, opacity: 0.15 }}
          className="absolute top-[10%] left-[5%] text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 select-none pointer-events-none hidden lg:block"
        >
          =SUM(F2:G2)
        </motion.div>
        <motion.div
          style={{ x: floatX2, y: floatY1, opacity: 0.12 }}
          className="absolute bottom-[25%] left-[42%] text-xs font-mono font-bold text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 select-none pointer-events-none hidden lg:block"
        >
          =VLOOKUP(C2, A7:B8, 2, FALSE)
        </motion.div>
        <motion.div
          style={{ x: floatX1, y: floatY1, opacity: 0.15 }}
          className="absolute top-[15%] right-[25%] text-xs font-mono font-bold text-purple-500 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 select-none pointer-events-none hidden lg:block"
        >
          =IF(H2&gt;=7500, "Tinggi", "Rendah")
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column: Copywriting */}
          <div className="lg:col-span-7 flex flex-col space-y-8 text-center lg:text-left">
            <motion.div variants={itemVariants} className="inline-flex items-center self-center lg:self-start space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Pembelajaran Excel Interaktif Gratis</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants} 
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground"
            >
              Kuasai Rumus Excel Secara <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400">Interaktif</span> Tanpa Ribet
            </motion.h1>

            <motion.p 
              variants={itemVariants} 
              className="text-base sm:text-lg md:text-xl text-muted-foreground font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Uji formula Anda secara langsung di dalam simulator spreadsheet browser. Dapatkan visual feedback instan, fitur penguncian sel dinamis, dan tantangan studi kasus nyata.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              {mounted && user ? (
                <Link 
                  href="/belajar" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all group gap-2 cursor-pointer"
                >
                  <span>Mulai Belajar Sekarang (Gratis)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button 
                  onClick={() => openAuthModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all group gap-2 cursor-pointer"
                >
                  <span>Mulai Belajar Sekarang (Gratis)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <a 
                href="#fitur" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl border border-border bg-card/40 hover:bg-card/80 text-foreground transition-all gap-2"
              >
                <span>Pelajari Fitur</span>
              </a>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-border/40 max-w-lg mx-auto lg:mx-0"
            >
              <div>
                <h4 className="text-2xl font-bold text-foreground">7+</h4>
                <p className="text-xs text-muted-foreground">Kategori Modul</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-foreground">30+</h4>
                <p className="text-xs text-muted-foreground">Soal & Tantangan</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-emerald-400">100%</h4>
                <p className="text-xs text-muted-foreground">Gratis & Tanpa Instal</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Mockup Container */}
          <div 
            className="lg:col-span-5 relative z-10 w-full flex justify-center overflow-visible"
            style={{ perspective: 1000 }}
          >
            <motion.div 
              variants={itemVariants}
              style={{ 
                rotateX, 
                rotateY, 
                y: yCardScroll,
                transformStyle: "preserve-3d" 
              }}
              className="relative w-full max-w-[450px] aspect-[9/10] bg-gradient-to-b from-card/90 to-card/50 border border-border/80 rounded-2xl shadow-2xl p-4 md:p-5 flex flex-col space-y-4 overflow-visible backdrop-blur-sm group hover:border-emerald-500/40 transition-all duration-500"
            >
              {/* Dynamic Glare Overlay */}
              <motion.div 
                className="absolute inset-0 rounded-2xl pointer-events-none z-20"
                style={{ background: glareBg }}
              />

              {/* Glass Header details */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-2 py-0.5 rounded">
                  studi-kasus-payroll.xlsx
                </div>
              </div>

              {/* Interactive cell simulator visual mockup */}
              <div className="flex-1 flex flex-col bg-background/50 border border-border/40 rounded-lg overflow-hidden font-mono text-[10px] sm:text-xs">
                {/* Fake Formula Bar */}
                <div className="h-7 border-b border-border/40 bg-muted/10 px-2 flex items-center space-x-2 text-muted-foreground">
                  <span className="font-bold text-emerald-500 text-xs">fx</span>
                  <div className="h-4 w-[1px] bg-border" />
                  <span className="text-[10px] text-foreground truncate select-none">{"=IF(H2>=7500,\"Tinggi\",IF(H2>=5500,\"Sedang\",\"Rendah\"))"}</span>
                </div>

                {/* Visual Grid Mock */}
                <div className="flex-1 grid grid-cols-6 grid-rows-7 border-collapse">
                  {/* Row 0 Header */}
                  <div className="bg-muted/30 border-b border-r border-border/40 p-1 font-semibold text-center select-none text-muted-foreground"></div>
                  <div className="bg-muted/30 border-b border-r border-border/40 p-1 font-semibold text-center select-none text-muted-foreground">E</div>
                  <div className="bg-muted/30 border-b border-r border-border/40 p-1 font-semibold text-center select-none text-muted-foreground">F</div>
                  <div className="bg-muted/30 border-b border-r border-border/40 p-1 font-semibold text-center select-none text-muted-foreground">G</div>
                  <div className="bg-muted/30 border-b border-r border-border/40 p-1 font-semibold text-center select-none text-muted-foreground">H</div>
                  <div className="bg-muted/30 border-b border-border/40 p-1 font-semibold text-center select-none text-muted-foreground">I</div>

                  {/* Row 1 Karyawan header */}
                  <div className="bg-muted/10 border-b border-r border-border/40 p-1 text-center font-bold">1</div>
                  <div className="bg-blue-500/5 border-b border-r border-border/40 p-1 text-[8px] sm:text-[9px] font-bold text-slate-600 dark:text-slate-400">Dept</div>
                  <div className="bg-blue-500/5 border-b border-r border-border/40 p-1 text-[8px] sm:text-[9px] font-bold text-slate-600 dark:text-slate-400">Pokok</div>
                  <div className="bg-blue-500/5 border-b border-r border-border/40 p-1 text-[8px] sm:text-[9px] font-bold text-slate-600 dark:text-slate-400">Tunj.</div>
                  <div className="bg-blue-500/5 border-b border-r border-border/40 p-1 text-[8px] sm:text-[9px] font-bold text-slate-600 dark:text-slate-400">Total</div>
                  <div className="bg-blue-500/5 border-b border-border/40 p-1 text-[8px] sm:text-[9px] font-bold text-emerald-600 dark:text-emerald-400">Status</div>

                  {/* Row 2 Rudi */}
                  <div className="bg-muted/10 border-b border-r border-border/40 p-1 text-center font-bold">2</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-700 dark:text-slate-300">ADM</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-700 dark:text-slate-300">5.000</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-700 dark:text-slate-300">600</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-700 dark:text-slate-300 bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400">5.600</div>
                  <div className="border-b border-border/40 p-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-semibold animate-pulse">Sedang</div>

                  {/* Row 3 Dewi */}
                  <div className="bg-muted/10 border-b border-r border-border/40 p-1 text-center font-bold">3</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-700 dark:text-slate-300">DEV</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-700 dark:text-slate-300">7.000</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-700 dark:text-slate-300">1.000</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-700 dark:text-slate-300 bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400">8.000</div>
                  <div className="border-b border-border/40 p-1 text-slate-600 dark:text-slate-400 relative">
                    <span className="opacity-50">?</span>
                    <span className="absolute right-1 top-1 text-[7px] text-yellow-600 dark:text-yellow-500"><Lock className="w-2.5 h-2.5 inline" /></span>
                  </div>

                  {/* Row 4 Andi */}
                  <div className="bg-muted/10 border-b border-r border-border/40 p-1 text-center font-bold">4</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-700 dark:text-slate-300">FIN</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-700 dark:text-slate-300">5.000</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-700 dark:text-slate-300">800</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-700 dark:text-slate-300 bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400">5.800</div>
                  <div className="border-b border-border/40 p-1 text-slate-600 dark:text-slate-400 relative">
                    <span className="opacity-50">?</span>
                    <span className="absolute right-1 top-1 text-[7px] text-yellow-600 dark:text-yellow-500"><Lock className="w-2.5 h-2.5 inline" /></span>
                  </div>

                  {/* Row 5 Spacer */}
                  <div className="bg-muted/10 border-b border-r border-border/40 p-1 text-center font-bold">5</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-600 dark:text-slate-500 text-[8px] col-span-5 whitespace-nowrap overflow-hidden">REFERENSI GOLONGAN</div>

                  {/* Row 6 Ref Golongan */}
                  <div className="bg-muted/10 border-r border-border/40 p-1 text-center font-bold">6</div>
                  <div className="border-r border-border/40 p-1 text-slate-600 dark:text-slate-400">I</div>
                  <div className="border-r border-border/40 p-1 text-slate-700 dark:text-slate-300">5.000</div>
                  <div className="border-r border-border/40 p-1 text-slate-600 dark:text-slate-400">II</div>
                  <div className="border-r border-border/40 p-1 text-slate-700 dark:text-slate-300">7.000</div>
                  <div className="p-1"></div>
                </div>
              </div>

              {/* Float Cards (Confetti & Unlock badge Simulation) */}
              <motion.div 
                style={{ 
                  x: floatX1, 
                  y: floatY1, 
                  transformStyle: "preserve-3d",
                  transform: "translateZ(60px)"
                }}
                className="absolute bottom-6 -left-6 bg-white/95 dark:bg-slate-900/95 border border-emerald-500/20 dark:border-emerald-500/30 px-3 py-2 rounded-xl shadow-lg flex items-center space-x-2 select-none transform hover:scale-105 transition-all z-40 backdrop-blur-md"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-foreground">Formula Benar!</div>
                  <div className="text-[8px] text-muted-foreground">Confetti dilepaskan</div>
                </div>
              </motion.div>

              <motion.div 
                style={{ 
                  x: floatX2, 
                  y: floatY2, 
                  transformStyle: "preserve-3d",
                  transform: "translateZ(40px)"
                }}
                className="absolute top-1/2 -right-8 bg-white/95 dark:bg-slate-900/95 border border-yellow-500/20 dark:border-yellow-500/30 px-3 py-2 rounded-xl shadow-lg flex items-center space-x-2 select-none transform hover:scale-105 transition-all z-40 backdrop-blur-md"
              >
                <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                <div>
                  <div className="text-[10px] font-bold text-foreground">Prerequisite Locked</div>
                  <div className="text-[8px] text-muted-foreground">Selesaikan Gaji Pokok dahulu</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 3. Features Section */}
      <section id="fitur" className="relative z-10 py-24 bg-card/20 border-y border-border/40">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Kenapa Belajar di ExcelMaster?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Kami merancang sistem pembelajaran hands-on termodern yang langsung menguji keterampilan pemecahan masalah Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-card border border-border/60 p-6 rounded-2xl flex flex-col space-y-4 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Table className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Interactive Sheet Simulator</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tidak memerlukan instalasi Microsoft Excel atau Google Sheets. Ketik rumus Anda secara langsung dalam grid yang responsif.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border/60 p-6 rounded-2xl flex flex-col space-y-4 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Instant Visual Feedback</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tahu secara langsung jika rumus Anda salah melalui efek getar pada sel, atau rayakan jawaban yang benar dengan letupan confetti.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border/60 p-6 rounded-2xl flex flex-col space-y-4 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Prerequisite Cell Locking</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sel yang bergantung pada perhitungan lain akan terkunci secara cerdas dan terbuka otomatis setelah sel prasyaratnya berhasil diselesaikan.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card border border-border/60 p-6 rounded-2xl flex flex-col space-y-4 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Interactive Column Resizing</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sama seperti Excel sungguhan, Anda dapat menyeret garis tepi kolom di bagian header untuk memperlebar kolom yang terpotong.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card border border-border/60 p-6 rounded-2xl flex flex-col space-y-4 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Integrated Case Studies</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Uji kemampuan akhir Anda lewat studi kasus berskala besar seperti Laporan Gaji & Evaluasi Penggajian Karyawan terpadu.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card border border-border/60 p-6 rounded-2xl flex flex-col space-y-4 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Instructor & Peserta POV</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Dua sudut pandang interaktif: belajar sebagai siswa atau kelola dan evaluasi data serta progres kelas sebagai instruktur.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Curriculum / Roadmap Section */}
      <section id="kurikulum" className="relative z-10 py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Kurikulum Excel Terarah & Sistematis
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Belajar dari nol hingga mahir dengan kurikulum terstruktur yang mencakup rumus paling populer di dunia kerja.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative border-l-2 border-dashed border-emerald-500/20 dark:border-emerald-500/10 ml-4 md:ml-32 pl-8 md:pl-12 space-y-12">
            
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -left-[49px] md:-left-[65px] top-3.5 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-4 border-background flex items-center justify-center text-xs font-bold text-white shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/30 group-hover:scale-110 transition-all duration-300 z-10">
                1
              </div>
              <div className="relative bg-card/30 hover:bg-card/65 border border-border/60 hover:border-emerald-500/30 p-6 rounded-xl space-y-2.5 transition-all duration-300 shadow-xs hover:shadow-lg hover:shadow-emerald-500/[0.02]">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Matematika Dasar & Statistik</span>
                </div>
                <h4 className="text-lg font-bold text-foreground group-hover:text-emerald-400 transition-colors">Kalkulasi Angka & Ringkasan Data</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Pelajari cara menjumlahkan data, menghitung rata-rata, mencari nilai tertinggi dan terendah menggunakan rumus wajib: <code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">SUM</code>, <code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">AVERAGE</code>, <code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">MAX</code>, dan <code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">MIN</code>.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {["SUM", "AVERAGE", "MAX", "MIN", "COUNT"].map((formula) => (
                    <span key={formula} className="px-2 py-0.5 bg-muted/60 dark:bg-slate-800/60 border border-border/40 rounded-md text-[10px] font-mono text-muted-foreground font-semibold hover:border-emerald-500/20 hover:text-emerald-400 transition-colors">
                      {formula}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -left-[49px] md:-left-[65px] top-3.5 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-4 border-background flex items-center justify-center text-xs font-bold text-white shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/30 group-hover:scale-110 transition-all duration-300 z-10">
                2
              </div>
              <div className="relative bg-card/30 hover:bg-card/65 border border-border/60 hover:border-emerald-500/30 p-6 rounded-xl space-y-2.5 transition-all duration-300 shadow-xs hover:shadow-lg hover:shadow-emerald-500/[0.02]">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Manipulasi Teks (Text Cleanup)</span>
                </div>
                <h4 className="text-lg font-bold text-foreground group-hover:text-emerald-400 transition-colors">Penggabungan & Pembersihan Teks Berantakan</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Pelajari cara merapikan nama, menghapus spasi ganda, mengambil huruf dari kiri/tengah/kanan dengan fungsi: <code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">TRIM</code>, <code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">PROPER</code>, <code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">LEFT</code>, <code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">MID</code>, <code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">RIGHT</code>, <code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">LEN</code>, dan <code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">CONCATENATE</code>.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {["TRIM", "PROPER", "LEFT", "MID", "RIGHT", "LEN", "CONCATENATE"].map((formula) => (
                    <span key={formula} className="px-2 py-0.5 bg-muted/60 dark:bg-slate-800/60 border border-border/40 rounded-md text-[10px] font-mono text-muted-foreground font-semibold hover:border-emerald-500/20 hover:text-emerald-400 transition-colors">
                      {formula}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -left-[49px] md:-left-[65px] top-3.5 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-4 border-background flex items-center justify-center text-xs font-bold text-white shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/30 group-hover:scale-110 transition-all duration-300 z-10">
                3
              </div>
              <div className="relative bg-card/30 hover:bg-card/65 border border-border/60 hover:border-emerald-500/30 p-6 rounded-xl space-y-2.5 transition-all duration-300 shadow-xs hover:shadow-lg hover:shadow-emerald-500/[0.02]">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Logika Dasar & Nested IF</span>
                </div>
                <h4 className="text-lg font-bold text-foreground group-hover:text-emerald-400 transition-colors">Evaluasi Kondisi & Logika Bercabang</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Belajar mengambil keputusan otomatis berdasarkan nilai tertentu. Kuasai penggunaan single <code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">IF</code> dan kombinasi <strong className="font-semibold text-foreground">Nested IF (IF Bercabang)</strong> untuk mengkategorikan status gaji atau nilai.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {["IF", "AND", "OR", "NESTED IF"].map((formula) => (
                    <span key={formula} className="px-2 py-0.5 bg-muted/60 dark:bg-slate-800/60 border border-border/40 rounded-md text-[10px] font-mono text-muted-foreground font-semibold hover:border-emerald-500/20 hover:text-emerald-400 transition-colors">
                      {formula}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              <div className="absolute -left-[49px] md:-left-[65px] top-3.5 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-4 border-background flex items-center justify-center text-xs font-bold text-white shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/30 group-hover:scale-110 transition-all duration-300 z-10">
                4
              </div>
              <div className="relative bg-card/30 hover:bg-card/65 border border-border/60 hover:border-emerald-500/30 p-6 rounded-xl space-y-2.5 transition-all duration-300 shadow-xs hover:shadow-lg hover:shadow-emerald-500/[0.02]">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <Table className="w-3.5 h-3.5" />
                  <span>Lookup & Referensi Data</span>
                </div>
                <h4 className="text-lg font-bold text-foreground group-hover:text-emerald-400 transition-colors">VLOOKUP, HLOOKUP, dan XLOOKUP</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Hubungkan tabel utama Anda dengan tabel referensi secara dinamis. Pelajari pencarian vertikal (<code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">VLOOKUP</code>), horizontal (<code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">HLOOKUP</code>), dan fitur pencarian modern (<code className="px-1 py-0.5 bg-muted dark:bg-slate-800/80 rounded font-mono text-emerald-600 dark:text-emerald-400 text-xs">XLOOKUP</code>).
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {["VLOOKUP", "HLOOKUP", "XLOOKUP", "INDEX", "MATCH"].map((formula) => (
                    <span key={formula} className="px-2 py-0.5 bg-muted/60 dark:bg-slate-800/60 border border-border/40 rounded-md text-[10px] font-mono text-muted-foreground font-semibold hover:border-emerald-500/20 hover:text-emerald-400 transition-colors">
                      {formula}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative group">
              <div className="absolute -left-[49px] md:-left-[65px] top-3.5 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-4 border-background flex items-center justify-center text-xs font-bold text-white shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/30 group-hover:scale-110 transition-all duration-300 z-10">
                5
              </div>
              <div className="relative bg-card/30 hover:bg-card/65 border border-border/60 hover:border-emerald-500/30 p-6 rounded-xl space-y-2.5 transition-all duration-300 shadow-xs hover:shadow-lg hover:shadow-emerald-500/[0.02]">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>Studi Kasus Integrasi Akhir</span>
                </div>
                <h4 className="text-lg font-bold text-foreground group-hover:text-emerald-400 transition-colors">Studi Kasus Laporan Gaji & Evaluasi</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Ujian akhir sesungguhnya: Gabungkan semua rumus pembersihan nama, VLOOKUP golongan gaji, HLOOKUP tunjangan departemen, kalkulasi total gaji, dan Nested IF evaluasi status keaktifan dalam satu simulasi payroll.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {["LAPORAN GAJI", "NESTED LOGIC", "DATA INTEGRATION", "PAYROLL PROJECT"].map((formula) => (
                    <span key={formula} className="px-2 py-0.5 bg-muted/60 dark:bg-slate-800/60 border border-border/40 rounded-md text-[10px] font-mono text-muted-foreground font-semibold hover:border-emerald-500/20 hover:text-emerald-400 transition-colors">
                      {formula}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section id="faq" className="relative z-10 py-24 bg-card/10 border-t border-border/40">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Pertanyaan Umum</h2>
            <p className="text-muted-foreground text-sm">Masih ragu? Berikut beberapa informasi tambahan tentang platform ini.</p>
          </div>

          <div className="space-y-6">
            
            <div className="bg-card border border-border/60 p-6 rounded-xl">
              <h4 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                Apakah platform belajar ini gratis?
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed pl-6">
                Ya! Platform ExcelMaster sepenuhnya gratis dan open-source. Anda tidak perlu membayar langganan apa pun untuk mengakses seluruh materi dan studi kasus penggajian.
              </p>
            </div>

            <div className="bg-card border border-border/60 p-6 rounded-xl">
              <h4 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                Bagaimana platform memvalidasi jawaban saya?
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed pl-6">
                Platform kami memiliki mesin validator bawaan di sisi klien yang menganalisis sintaks dan struktur rumus yang Anda ketik secara real-time. Mesin ini mendukung variasi penulisan spasi, kapitalisasi huruf, serta separator regional (seperti pemisah koma `,` atau titik koma `;`).
              </p>
            </div>

            <div className="bg-card border border-border/60 p-6 rounded-xl">
              <h4 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                Bagaimana progres belajar saya disimpan?
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed pl-6">
                Secara default, jika Anda tidak menyambungkan akun database Supabase, progres Anda akan disimpan secara otomatis di memori lokal browser (`localStorage`). Jika Anda menghapus data browser, progres Anda dapat hilang. Anda dapat menghubungkan Supabase untuk menyimpan progres secara permanen di cloud.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="relative z-10 border-t border-border/40 py-12 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-white font-mono text-[10px] font-bold">
              XL
            </div>
            <span className="font-bold tracking-tight text-foreground">ExcelMaster</span>
          </div>
          <p>© {new Date().getFullYear()} Wahana Prestasi.</p>
          <div className="flex space-x-6">
            <a href="#fitur" className="hover:text-foreground transition-colors">Fitur</a>
            <a href="#kurikulum" className="hover:text-foreground transition-colors">Kurikulum</a>
            {mounted && user ? (
              <Link href="/belajar" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer">
                Mulai Belajar
              </Link>
            ) : (
              <button 
                onClick={() => openAuthModal(true)} 
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                Mulai Belajar
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Authentication modal dialog */}
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} defaultSignUp={defaultSignUp} />
    </div>
  );
}
