"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  UserCheck
} from "lucide-react";

export default function LandingPage() {
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
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none z-0" />

      {/* Floating Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800b_1px,transparent_1px),linear-gradient(to_bottom,#8080800b_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

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

          <div className="flex items-center space-x-4">
            <Link 
              href="/belajar" 
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs font-semibold text-foreground rounded-lg group bg-gradient-to-br from-emerald-500 to-blue-600 group-hover:from-emerald-500 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-emerald-800 transition-all mt-2"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 font-medium tracking-tight">
                Mulai Belajar
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
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
              <Link 
                href="/belajar" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all group gap-2"
              >
                <span>Mulai Belajar Sekarang (Gratis)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
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
          <div className="lg:col-span-5 relative z-10 w-full flex justify-center">
            <motion.div 
              variants={itemVariants}
              className="relative w-full max-w-[450px] aspect-[9/10] bg-gradient-to-b from-card/90 to-card/50 border border-border/80 rounded-2xl shadow-2xl p-4 md:p-5 flex flex-col space-y-4 overflow-hidden backdrop-blur-sm group hover:border-emerald-500/40 transition-all duration-500"
            >
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
                  <div className="bg-blue-500/5 border-b border-r border-border/40 p-1 text-[8px] sm:text-[9px] font-bold text-slate-400">Dept</div>
                  <div className="bg-blue-500/5 border-b border-r border-border/40 p-1 text-[8px] sm:text-[9px] font-bold text-slate-400">Pokok</div>
                  <div className="bg-blue-500/5 border-b border-r border-border/40 p-1 text-[8px] sm:text-[9px] font-bold text-slate-400">Tunj.</div>
                  <div className="bg-blue-500/5 border-b border-r border-border/40 p-1 text-[8px] sm:text-[9px] font-bold text-slate-400">Total</div>
                  <div className="bg-blue-500/5 border-b border-border/40 p-1 text-[8px] sm:text-[9px] font-bold text-emerald-400">Status</div>

                  {/* Row 2 Rudi */}
                  <div className="bg-muted/10 border-b border-r border-border/40 p-1 text-center font-bold">2</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-300">ADM</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-300">5.000</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-300">600</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-300 bg-emerald-500/10 font-semibold text-emerald-400">5.600</div>
                  <div className="border-b border-border/40 p-1 bg-yellow-500/10 text-yellow-400 font-semibold animate-pulse">Sedang</div>

                  {/* Row 3 Dewi */}
                  <div className="bg-muted/10 border-b border-r border-border/40 p-1 text-center font-bold">3</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-300">DEV</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-300">7.000</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-300">1.000</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-300 bg-emerald-500/10 font-semibold text-emerald-400">8.000</div>
                  <div className="border-b border-border/40 p-1 text-slate-400 relative">
                    <span className="opacity-50">?</span>
                    <span className="absolute right-1 top-1 text-[7px] text-yellow-500"><Lock className="w-2.5 h-2.5 inline" /></span>
                  </div>

                  {/* Row 4 Andi */}
                  <div className="bg-muted/10 border-b border-r border-border/40 p-1 text-center font-bold">4</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-300">FIN</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-300">5.000</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-300">800</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-300 bg-emerald-500/10 font-semibold text-emerald-400">5.800</div>
                  <div className="border-b border-border/40 p-1 text-slate-400 relative">
                    <span className="opacity-50">?</span>
                    <span className="absolute right-1 top-1 text-[7px] text-yellow-500"><Lock className="w-2.5 h-2.5 inline" /></span>
                  </div>

                  {/* Row 5 Spacer */}
                  <div className="bg-muted/10 border-b border-r border-border/40 p-1 text-center font-bold">5</div>
                  <div className="border-b border-r border-border/40 p-1 text-slate-500 text-[8px] col-span-5 whitespace-nowrap overflow-hidden">=== REFERENSI GOLONGAN ===</div>

                  {/* Row 6 Ref Golongan */}
                  <div className="bg-muted/10 border-r border-border/40 p-1 text-center font-bold">6</div>
                  <div className="border-r border-border/40 p-1 text-slate-400">I</div>
                  <div className="border-r border-border/40 p-1 text-slate-300">5.000</div>
                  <div className="border-r border-border/40 p-1 text-slate-400">II</div>
                  <div className="border-r border-border/40 p-1 text-slate-300">7.000</div>
                  <div className="p-1"></div>
                </div>
              </div>

              {/* Float Cards (Confetti & Unlock badge Simulation) */}
              <div className="absolute bottom-6 -left-6 bg-slate-900 border border-emerald-500/30 px-3 py-2 rounded-xl shadow-lg flex items-center space-x-2 select-none transform hover:scale-105 transition-all">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-foreground">Formula Benar!</div>
                  <div className="text-[8px] text-muted-foreground">Confetti dilepaskan</div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-8 bg-slate-900 border border-yellow-500/30 px-3 py-2 rounded-xl shadow-lg flex items-center space-x-2 select-none transform hover:scale-105 transition-all">
                <Lock className="w-4 h-4 text-yellow-500" />
                <div>
                  <div className="text-[10px] font-bold text-foreground">Prerequisite Locked</div>
                  <div className="text-[8px] text-muted-foreground">Selesaikan Gaji Pokok dahulu</div>
                </div>
              </div>
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

          <div className="max-w-4xl mx-auto relative border-l border-border/60 ml-4 md:ml-32 pl-8 md:pl-12 space-y-12">
            
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-emerald-500 border-4 border-background flex items-center justify-center text-[10px] font-bold text-white shadow-md shadow-emerald-500/20">
                1
              </div>
              <div className="bg-card/40 border border-border/60 p-6 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Matematika Dasar & Statistik</span>
                </div>
                <h4 className="text-lg font-bold text-foreground">Kalkulasi Angka & Ringkasan Data</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Pelajari cara menjumlahkan data, menghitung rata-rata, mencari nilai tertinggi dan terendah menggunakan rumus wajib: `SUM`, `AVERAGE`, `MAX`, `MIN`.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-emerald-500 border-4 border-background flex items-center justify-center text-[10px] font-bold text-white shadow-md shadow-emerald-500/20">
                2
              </div>
              <div className="bg-card/40 border border-border/60 p-6 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Manipulasi Teks (Text Cleanup)</span>
                </div>
                <h4 className="text-lg font-bold text-foreground">Penggabungan & Pembersihan Teks Berantakan</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Pelajari cara merapikan nama, menghapus spasi ganda, mengambil huruf dari kiri/tengah/kanan dengan fungsi: `TRIM`, `PROPER`, `LEFT`, `MID`, `RIGHT`, `LEN`, `CONCATENATE`.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-emerald-500 border-4 border-background flex items-center justify-center text-[10px] font-bold text-white shadow-md shadow-emerald-500/20">
                3
              </div>
              <div className="bg-card/40 border border-border/60 p-6 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Logika Dasar & Nested IF</span>
                </div>
                <h4 className="text-lg font-bold text-foreground">Evaluasi Kondisi & Logika Bercabang</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Belajar mengambil keputusan otomatis berdasarkan nilai tertentu. Kuasai penggunaan single `IF` dan kombinasi **Nested IF (IF Bercabang)** untuk mengkategorikan status gaji atau nilai.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-emerald-500 border-4 border-background flex items-center justify-center text-[10px] font-bold text-white shadow-md shadow-emerald-500/20">
                4
              </div>
              <div className="bg-card/40 border border-border/60 p-6 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                  <Table className="w-3.5 h-3.5" />
                  <span>Lookup & Referensi Data</span>
                </div>
                <h4 className="text-lg font-bold text-foreground">VLOOKUP, HLOOKUP, dan XLOOKUP</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Hubungkan tabel utama Anda dengan tabel referensi secara dinamis. Pelajari pencarian vertikal (`VLOOKUP`), horizontal (`HLOOKUP`), dan fitur pencarian modern (`XLOOKUP`).
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative">
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-emerald-500 border-4 border-background flex items-center justify-center text-[10px] font-bold text-white shadow-md shadow-emerald-500/20">
                5
              </div>
              <div className="bg-card/40 border border-border/60 p-6 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>Studi Kasus Integrasi Akhir</span>
                </div>
                <h4 className="text-lg font-bold text-foreground">Studi Kasus Laporan Gaji & Evaluasi</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Ujian akhir sesungguhnya: Gabungkan semua rumus pembersihan nama, VLOOKUP golongan gaji, HLOOKUP tunjangan departemen, kalkulasi total gaji, dan Nested IF evaluasi status keaktifan dalam satu simulasi payroll.
                </p>
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
          <p>© {new Date().getFullYear()} ExcelMaster. Made with love for interactive learning.</p>
          <div className="flex space-x-6">
            <a href="#fitur" className="hover:text-foreground transition-colors">Fitur</a>
            <a href="#kurikulum" className="hover:text-foreground transition-colors">Kurikulum</a>
            <Link href="/belajar" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Mulai Belajar
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
