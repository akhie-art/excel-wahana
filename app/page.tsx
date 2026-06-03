"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { AuthModal } from "@/components/auth-modal";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  Sparkles,
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight,
  Table,
  Terminal,
  Award,
  HelpCircle,
  Zap,
  GraduationCap,
  BookOpen,
  UserCheck,
  LayoutDashboard,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Play,
  RotateCcw,
  TrendingUp,
  Lightbulb,
  BarChart2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── Typing Animation Hook ─────────────────────────────────────────────────
function useTypingEffect(
  texts: string[],
  typingSpeed = 60,
  deletingSpeed = 30,
  pauseMs = 2000
) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];

    if (isPaused) {
      const t = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseMs);
      return () => clearTimeout(t);
    }

    if (!isDeleting && displayText === current) {
      setIsPaused(true);
      return;
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
      return;
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const t = setTimeout(() => {
      setDisplayText(
        isDeleting
          ? current.slice(0, displayText.length - 1)
          : current.slice(0, displayText.length + 1)
      );
    }, speed);
    return () => clearTimeout(t);
  }, [displayText, isDeleting, isPaused, textIndex, texts, typingSpeed, deletingSpeed, pauseMs]);

  return displayText;
}

// ─── Mini Playground ────────────────────────────────────────────────────────
const PLAYGROUND_DATA = {
  rows: [
    { dept: "ADM", pokok: 5000, tunj: 600 },
    { dept: "DEV", pokok: 7000, tunj: 1000 },
    { dept: "FIN", pokok: 5000, tunj: 800 },
  ],
};

type CellResult = { value: string | number; status: "correct" | "error" | "empty" };

function MiniPlayground() {
  const [formula, setFormula] = useState("");
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [results, setResults] = useState<(CellResult)[]>([
    { value: "", status: "empty" },
    { value: "", status: "empty" },
    { value: "", status: "empty" },
  ]);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFormula = useCallback((f: string, row: number): CellResult => {
    const normalized = f.trim().toUpperCase().replace(/\s+/g, "");
    const d = PLAYGROUND_DATA.rows[row];
    const expectedTotal = d.pokok + d.tunj;

    // Accept =SUM(Fx,Gx) or =Fx+Gx style
    const sumPatterns = [
      /^=SUM\(F\d,G\d\)$/,
      /^=SUM\(G\d,F\d\)$/,
      /^=F\d\+G\d$/,
      /^=G\d\+F\d$/,
      /^=SUM\(F\d:G\d\)$/,
    ];
    if (sumPatterns.some((p) => p.test(normalized))) {
      return { value: expectedTotal.toLocaleString("id-ID"), status: "correct" };
    }
    // Accept hardcoded correct value
    if (normalized === `=${expectedTotal}`) {
      return { value: expectedTotal.toLocaleString("id-ID"), status: "correct" };
    }
    return { value: "Salah", status: "error" };
  }, []);

  const handleSubmit = useCallback(() => {
    if (activeRow === null || !formula.trim()) return;

    const result = validateFormula(formula, activeRow);
    const newResults = [...results];
    newResults[activeRow] = result;
    setResults(newResults);

    if (result.status === "error") {
      setShakeRow(activeRow);
      setTimeout(() => setShakeRow(null), 600);
    } else {
      // check all done
      const allCorrect = newResults.every(r => r.status === "correct");
      if (allCorrect) {
        setAllDone(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }

    setFormula("");
    setActiveRow(null);
  }, [activeRow, formula, results, validateFormula]);

  const handleReset = () => {
    setResults([
      { value: "", status: "empty" },
      { value: "", status: "empty" },
      { value: "", status: "empty" },
    ]);
    setFormula("");
    setActiveRow(null);
    setAllDone(false);
    setShowConfetti(false);
  };

  const handleCellClick = (rowIndex: number) => {
    if (results[rowIndex].status === "correct") return;
    setActiveRow(rowIndex);
    setFormula("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="relative w-full max-w-[480px] mx-auto">
      {/* Glow ring */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-emerald-500/30 via-transparent to-blue-500/30 blur-xl opacity-60 pointer-events-none" />

      <div className="relative bg-card/80 border border-border/70 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Window Chrome */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/20">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
          <div className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-md">
            playground.xlsx · Coba Sekarang
          </div>
          <button
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Formula Bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40 bg-background/40">
          <span className="font-bold text-emerald-500 text-sm font-mono">fx</span>
          <div className="w-px h-4 bg-border" />
          {activeRow !== null ? (
            <div className="flex-1 flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-mono bg-muted/40 px-1.5 rounded">
                H{activeRow + 2}
              </span>
              <input
                ref={inputRef}
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder={`=SUM(F${activeRow + 2},G${activeRow + 2})`}
                className="flex-1 bg-transparent text-xs font-mono text-foreground placeholder:text-muted-foreground/40 outline-none border-none"
                autoFocus
              />
              <button
                onClick={handleSubmit}
                className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
              >
                Enter ↵
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-muted-foreground/50 italic flex items-center gap-1">
              {allDone ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400 font-medium not-italic">Semua sel selesai!</span>
                </>
              ) : (
                "Klik sel Total (H) untuk mulai..."
              )}
            </span>
          )}
        </div>

        {/* Spreadsheet Grid */}
        <div className="font-mono text-[11px] overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-6 border-b border-border/40 bg-muted/30">
            <div className="p-2 text-center text-muted-foreground font-semibold text-[10px] border-r border-border/30" />
            {["Dept (E)", "Pokok (F)", "Tunj (G)", "Total (H)", "Status (I)"].map(h => (
              <div key={h} className={`p-2 text-center text-[9px] font-bold border-r border-border/30 last:border-r-0 ${h.includes("H") ? "text-emerald-500" : "text-muted-foreground"}`}>
                {h}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {PLAYGROUND_DATA.rows.map((row, i) => {
            const result = results[i];
            const isActive = activeRow === i;
            const isShaking = shakeRow === i;
            const isCorrect = result.status === "correct";
            const status = isCorrect
              ? row.pokok + row.tunj >= 7500 ? "Tinggi" : row.pokok + row.tunj >= 5500 ? "Sedang" : "Rendah"
              : null;

            return (
              <motion.div
                key={i}
                className={`grid grid-cols-6 border-b border-border/30 last:border-b-0 transition-colors ${isActive ? "bg-emerald-500/5" : "hover:bg-muted/10"}`}
                animate={isShaking ? { x: [-4, 4, -4, 4, -2, 2, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="p-2 text-center text-muted-foreground font-bold border-r border-border/30 bg-muted/20 text-[10px]">
                  {i + 2}
                </div>
                <div className="p-2 border-r border-border/30 text-foreground/80">{row.dept}</div>
                <div className="p-2 border-r border-border/30 text-foreground/80">{row.pokok.toLocaleString("id-ID")}</div>
                <div className="p-2 border-r border-border/30 text-foreground/80">{row.tunj.toLocaleString("id-ID")}</div>

                {/* Clickable Total Cell */}
                <div
                  onClick={() => handleCellClick(i)}
                  className={`p-2 border-r border-border/30 font-semibold cursor-pointer transition-all relative ${
                    isCorrect
                      ? "bg-emerald-500/15 text-emerald-500"
                      : isActive
                      ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/50"
                      : "text-muted-foreground/40 hover:bg-muted/20"
                  }`}
                >
                  {isCorrect ? (
                    <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      {result.value}
                    </motion.span>
                  ) : isActive ? (
                    <span className="animate-pulse text-emerald-400">|</span>
                  ) : (
                    <span className="text-[10px]">· klik</span>
                  )}
                </div>

                {/* Status Cell */}
                <div className={`p-2 font-semibold text-[10px] ${
                  isCorrect
                    ? status === "Tinggi"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : status === "Sedang"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"
                    : "text-muted-foreground/20"
                }`}>
                  {isCorrect ? (
                    <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                      {status}
                    </motion.span>
                  ) : "—"}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom hint */}
        <div className="px-4 py-2.5 bg-muted/20 border-t border-border/40 flex items-center justify-between">
          <p className="text-[9px] text-muted-foreground flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-yellow-500 shrink-0" />
            <span>Ketik <code className="font-mono text-emerald-400">=SUM(F2,G2)</code> lalu tekan Enter</span>
          </p>
          {allDone && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-[10px] font-bold text-emerald-400 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" /> Selesai!
            </motion.span>
          )}
        </div>
      </div>

      {/* Floating success badge */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl shadow-emerald-500/30 flex items-center gap-2"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Semua Rumus Benar! +50 XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── FAQ Accordion ──────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "Apakah platform belajar ini gratis?",
    a: "Ya! Platform Excel Wahana sepenuhnya gratis. Anda tidak perlu membayar langganan apa pun untuk mengakses seluruh materi dan studi kasus penggajian.",
  },
  {
    q: "Bagaimana platform memvalidasi jawaban saya?",
    a: "Platform kami memiliki mesin validator bawaan di sisi klien yang menganalisis sintaks dan struktur rumus secara real-time. Mesin ini mendukung variasi penulisan spasi, kapitalisasi huruf, serta separator regional (koma `,` atau titik koma `;`).",
  },
  {
    q: "Bagaimana progres belajar saya disimpan?",
    a: "Progres Anda disimpan secara otomatis di localStorage browser. Dengan mendaftar akun gratis, progres Anda akan tersimpan secara permanen di cloud melalui Supabase sehingga bisa diakses dari perangkat mana pun.",
  },
  {
    q: "Apakah saya perlu menginstall software tambahan?",
    a: "Tidak sama sekali! Excel Wahana berjalan sepenuhnya di browser Anda. Tidak perlu menginstall Microsoft Excel, Google Sheets, atau software apa pun. Cukup buka browser dan mulai belajar.",
  },
  {
    q: "Apa perbedaan akun Peserta dan Instruktur?",
    a: "Akun Peserta digunakan untuk mengerjakan soal dan memantau progres belajar pribadi. Akun Instruktur mendapat akses ke dashboard manajemen kelas, pembuatan soal kustom, dan pemantauan progres seluruh peserta.",
  },
];

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <motion.div
            key={i}
            className={`border rounded-xl overflow-hidden transition-colors duration-300 ${
              isOpen
                ? "border-emerald-500/40 bg-emerald-500/[0.03]"
                : "border-border/60 bg-card hover:border-border"
            }`}
            layout
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <span className={`text-sm font-semibold transition-colors ${isOpen ? "text-foreground" : "text-foreground/80"}`}>
                  {item.q}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="shrink-0 text-muted-foreground"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed pl-14">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Curriculum Step ─────────────────────────────────────────────────────────
const CURRICULUM_STEPS = [
  {
    num: 1,
    badge: "Matematika Dasar & Statistik",
    icon: BookOpen,
    title: "Kalkulasi Angka & Ringkasan Data",
    description: "Pelajari cara menjumlahkan data, menghitung rata-rata, mencari nilai tertinggi dan terendah menggunakan rumus wajib.",
    formulas: ["SUM", "AVERAGE", "MAX", "MIN", "COUNT"],
    color: "emerald",
  },
  {
    num: 2,
    badge: "Manipulasi Teks (Text Cleanup)",
    icon: Terminal,
    title: "Penggabungan & Pembersihan Teks",
    description: "Pelajari cara merapikan nama, menghapus spasi ganda, mengambil karakter dari kiri/tengah/kanan.",
    formulas: ["TRIM", "PROPER", "LEFT", "MID", "RIGHT", "LEN", "CONCATENATE"],
    color: "blue",
  },
  {
    num: 3,
    badge: "Logika Dasar & Nested IF",
    icon: Lock,
    title: "Evaluasi Kondisi & Logika Bercabang",
    description: "Belajar mengambil keputusan otomatis berdasarkan nilai tertentu. Kuasai IF tunggal dan kombinasi Nested IF.",
    formulas: ["IF", "AND", "OR", "NESTED IF"],
    color: "yellow",
  },
  {
    num: 4,
    badge: "Lookup & Referensi Data",
    icon: Table,
    title: "VLOOKUP, HLOOKUP, dan XLOOKUP",
    description: "Hubungkan tabel utama Anda dengan tabel referensi secara dinamis menggunakan fungsi pencarian terpopuler.",
    formulas: ["VLOOKUP", "HLOOKUP", "XLOOKUP", "INDEX", "MATCH"],
    color: "purple",
  },
  {
    num: 5,
    badge: "Studi Kasus Integrasi Akhir",
    icon: Award,
    title: "Studi Kasus Laporan Gaji & Evaluasi",
    description: "Ujian akhir sesungguhnya: Gabungkan semua rumus dalam satu simulasi payroll karyawan yang komprehensif.",
    formulas: ["LAPORAN GAJI", "NESTED LOGIC", "DATA INTEGRATION", "PAYROLL PROJECT"],
    color: "rose",
  },
];

const colorMap: Record<string, { dot: string; badge: string; formula: string; hover: string }> = {
  emerald: {
    dot: "from-emerald-400 to-teal-500 shadow-emerald-500/20 group-hover:shadow-emerald-500/40",
    badge: "text-emerald-400",
    formula: "hover:border-emerald-500/30 hover:text-emerald-400",
    hover: "hover:border-emerald-500/30 group-hover:text-emerald-400",
  },
  blue: {
    dot: "from-blue-400 to-indigo-500 shadow-blue-500/20 group-hover:shadow-blue-500/40",
    badge: "text-blue-400",
    formula: "hover:border-blue-500/30 hover:text-blue-400",
    hover: "hover:border-blue-500/30 group-hover:text-blue-400",
  },
  yellow: {
    dot: "from-yellow-400 to-amber-500 shadow-yellow-500/20 group-hover:shadow-yellow-500/40",
    badge: "text-yellow-400",
    formula: "hover:border-yellow-500/30 hover:text-yellow-400",
    hover: "hover:border-yellow-500/30 group-hover:text-yellow-400",
  },
  purple: {
    dot: "from-purple-400 to-violet-500 shadow-purple-500/20 group-hover:shadow-purple-500/40",
    badge: "text-purple-400",
    formula: "hover:border-purple-500/30 hover:text-purple-400",
    hover: "hover:border-purple-500/30 group-hover:text-purple-400",
  },
  rose: {
    dot: "from-rose-400 to-pink-500 shadow-rose-500/20 group-hover:shadow-rose-500/40",
    badge: "text-rose-400",
    formula: "hover:border-rose-500/30 hover:text-rose-400",
    hover: "hover:border-rose-500/30 group-hover:text-rose-400",
  },
};

const DUMMY_ARTICLES = [
  {
    id: 1,
    title: "Cara Menggunakan Rumus VLOOKUP untuk Pemula di Excel Wahana",
    excerpt: "Pelajari langkah-langkah dasar menggunakan fungsi pencarian VLOOKUP untuk menghubungkan data antar tabel secara otomatis dengan simulator interaktif.",
    content: "Fungsi VLOOKUP (Vertical Lookup) merupakan salah satu rumus pencarian paling populer di Excel. Rumus ini digunakan untuk mencari suatu nilai di kolom paling kiri dari suatu rentang tabel, lalu mengembalikan nilai di baris yang sama dari kolom lain yang Anda tentukan.\n\nStruktur rumusnya adalah:\n`=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])`\n\n- `lookup_value`: Nilai atau sel kunci yang ingin dicari.\n- `table_array`: Rentang tabel tempat pencarian data dilakukan.\n- `col_index_num`: Nomor indeks kolom hasil (dimulai dari 1 untuk kolom paling kiri).\n- `range_lookup`: Gunakan `FALSE` untuk pencarian presisi (exact match).\n\nDi Excel Wahana, Anda dapat mempraktikkan langsung rumus ini menggunakan simulator interaktif kami yang memberikan umpan balik (feedback) instan begitu Anda mengetikkan rumus di sel target.",
    category: "Rumus Lookup",
    date: "04 Juni 2026",
    readTime: "5 menit baca",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20"
  },
  {
    id: 2,
    title: "10 Rumus Matematika Dasar Excel yang Wajib Dikuasai di Excel Wahana",
    excerpt: "Daftar lengkap rumus matematika dasar dari SUM, AVERAGE, hingga COUNT yang akan melipatgandakan produktivitas harian Anda di dunia kerja.",
    content: "Menguasai rumus matematika dasar adalah kunci utama melipatgandakan kecepatan kerja administratif Anda. Berikut adalah beberapa rumus wajib:\n\n1. `SUM`: Menjumlahkan angka dalam suatu rentang.\n2. `AVERAGE`: Mencari nilai rata-rata.\n3. `COUNT`: Menghitung jumlah sel yang berisi angka.\n4. `MAX`: Menampilkan nilai tertinggi.\n5. `MIN`: Menampilkan nilai terendah.\n\nDengan simulator Excel Wahana, Anda tidak hanya menghafal rumus melainkan langsung diuji pada tabel rekapitulasi data keuangan nyata tanpa perlu menginstal aplikasi tambahan di komputer Anda.",
    category: "Tips & Trik",
    date: "02 Juni 2026",
    readTime: "7 menit baca",
    gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/20"
  },
  {
    id: 3,
    title: "Mengenal Perbedaan VLOOKUP, HLOOKUP, dan XLOOKUP di Excel Wahana",
    excerpt: "Bingung memilih fungsi pencarian yang tepat? Simak panduan perbandingan fitur dan efisiensi VLOOKUP, HLOOKUP, dan fungsi modern XLOOKUP.",
    content: "Excel memiliki beberapa rumus pencarian (lookup) dengan karakteristik berbeda:\n\n- **VLOOKUP**: Mencari data secara vertikal (ke bawah) berdasarkan kolom kunci paling kiri.\n- **HLOOKUP**: Mencari data secara horizontal (ke kanan) berdasarkan baris kunci paling atas.\n- **XLOOKUP**: Fitur modern yang fleksibel. Bisa mencari data ke segala arah (kanan maupun kiri, atas maupun bawah) tanpa takut susunan tabel berubah.\n\nPelajari kapan harus menggunakan masing-masing rumus di Excel Wahana dan uji kemampuan Anda menyusun argumen parameter pencarian secara tepat melalui tantangan bertahap.",
    category: "Analisis Data",
    date: "29 Mei 2026",
    readTime: "6 menit baca",
    gradient: "from-purple-500/10 to-violet-500/10 border-purple-500/20"
  },
  {
    id: 4,
    title: "Tips Membersihkan Data Teks yang Berantakan dengan TRIM dan PROPER",
    excerpt: "Data nama atau alamat sering memiliki spasi ganda atau huruf kapital acak? Rapikan secara otomatis menggunakan formula TRIM dan PROPER.",
    content: "Data mentah sering kali kotor akibat kesalahan entri manual, seperti huruf kapital acak-acakan atau spasi ganda tak terlihat yang bisa merusak validasi rumus lookup.\n\n- `TRIM(teks)`: Menghapus spasi ekstra di awal, tengah, dan akhir kalimat, menyisakan hanya satu spasi bersih antar kata.\n- `PROPER(teks)`: Mengubah karakter pertama setiap kata menjadi huruf kapital dan huruf lainnya menjadi kecil.\n\nAnda dapat menggabungkan keduanya menjadi `=PROPER(TRIM(A2))` untuk menghasilkan nama yang rapi secara instan. Cobalah modul khusus pembersihan teks kami di dashboard belajar Excel Wahana!",
    category: "Pembersihan Data",
    date: "25 Mei 2026",
    readTime: "4 menit baca",
    gradient: "from-amber-500/10 to-orange-500/10 border-amber-500/20"
  },
  {
    id: 5,
    title: "Panduan Lengkap Menggunakan Fungsi Logika IF Bertingkat (Nested IF)",
    excerpt: "Kuasai logika bercabang di Excel. Panduan praktis menyusun rumus Nested IF untuk mengevaluasi banyak kondisi tanpa terjadi error sintaks.",
    content: "Fungsi `IF` bertingkat (Nested IF) digunakan jika Anda perlu menguji lebih dari satu kondisi logika secara berurutan.\n\nRumus umumnya:\n`=IF(Kondisi1, Hasil1, IF(Kondisi2, Hasil2, HasilAlternatif))`\n\nMisalnya untuk menentukan grade nilai siswa:\n`=IF(B2>=85, \"A\", IF(B2>=70, \"B\", \"C\"))`\n\nHal paling krusial dalam Nested IF adalah memastikan tanda kurung tutup `)` di akhir rumus sama jumlahnya dengan total fungsi `IF` yang Anda buka. Latih kemampuan logika logaritma bercabang Anda di simulator interaktif Excel Wahana.",
    category: "Fungsi Logika",
    date: "21 Mei 2026",
    readTime: "8 menit baca",
    gradient: "from-rose-500/10 to-pink-500/10 border-rose-500/20"
  },
  {
    id: 6,
    title: "Cara Menghitung Payroll Gaji Karyawan Menggunakan Excel Wahana",
    excerpt: "Simulasi studi kasus nyata: Menggabungkan rumus logika, pencarian data, dan statistik untuk menyusun laporan payroll bulanan secara otomatis.",
    content: "Menyusun sistem penggajian (payroll) adalah tugas harian divisi HRD. Proses ini biasanya melibatkan penggabungan beberapa rumus:\n\n1. Gunakan `VLOOKUP` untuk menarik Gaji Pokok berdasarkan golongan jabatan karyawan.\n2. Terapkan logika `IF` untuk menentukan bonus lembur berdasarkan jam kerja tambahan.\n3. Jumlahkan seluruh komponen gaji dengan rumus `SUM`.\n\nExcel Wahana menyediakan Ujian Laporan Payroll Terintegrasi pada modul akhir untuk menguji kemampuan Anda menyelesaikan kasus nyata secara mandiri.",
    category: "Studi Kasus",
    date: "18 Mei 2026",
    readTime: "10 menit baca",
    gradient: "from-teal-500/10 to-emerald-500/10 border-teal-500/20"
  },
  {
    id: 7,
    title: "Mengenal Fungsi INDEX dan MATCH sebagai Alternatif Terbaik VLOOKUP",
    excerpt: "Mengapa para profesional Excel lebih memilih INDEX & MATCH dibanding VLOOKUP? Pelajari kelebihan fleksibilitas pencarian ke arah kiri.",
    content: "Meskipun VLOOKUP sangat populer, ia memiliki keterbatasan besar yaitu tidak bisa mengambil data di sebelah kiri kolom kunci.\n\nKombinasi `INDEX` dan `MATCH` hadir untuk mengatasi keterbatasan tersebut:\n- `MATCH(lookup_value, lookup_array, 0)`: Mencari posisi indeks baris dari nilai kunci.\n- `INDEX(array, row_num)`: Mengambil nilai pada baris/kolom tertentu di rentang data.\n\nDengan menggabungkannya: `=INDEX(kolom_hasil, MATCH(nilai_kunci, kolom_kunci, 0))`, Anda mendapatkan pencarian dua arah yang fleksibel dan hemat memori pada file berukuran besar. Pelajari trik lanjutan ini di Excel Wahana.",
    category: "Rumus Tingkat Lanjut",
    date: "14 Mei 2026",
    readTime: "6 menit baca",
    gradient: "from-indigo-500/10 to-sky-500/10 border-indigo-500/20"
  },
  {
    id: 8,
    title: "Cara Mudah Menghitung Nilai Rata-Rata Kelas dengan Rumus AVERAGE",
    excerpt: "Panduan praktis bagi pendidik untuk mengkalkulasi rata-rata nilai ujian murid serta menyaring data nilai secara cepat dan efisien.",
    content: "Mencari rata-rata nilai adalah salah satu operasi dasar yang paling sering digunakan pendidik.\n\nRumus dasarnya adalah:\n`=AVERAGE(sel_awal:sel_akhir)`\n\nMisalnya untuk menghitung nilai rata-rata dari baris 2 sampai baris 10 di kolom C:\n`=AVERAGE(C2:C10)`\n\nSimulator Excel Wahana menyediakan studi kasus rekap nilai ujian kelas, membantu Anda mempraktikkan langsung rumus rata-rata dan menganalisis nilai murid secara dinamis.",
    category: "Rumus Dasar",
    date: "10 Mei 2026",
    readTime: "3 menit baca",
    gradient: "from-sky-500/10 to-blue-500/10 border-sky-500/20"
  },
  {
    id: 9,
    title: "Cara Menggunakan Rumus Statistik Dasar: MAX, MIN, dan COUNT di Excel",
    excerpt: "Pelajari cara menyaring nilai tertinggi, mencari nilai terendah, dan menghitung jumlah entri data numerik secara otomatis dalam sekali klik.",
    content: "Statistik dasar membantu Anda menarik simpulan cepat dari sekumpulan data:\n\n- `MAX(A2:A10)`: Mengetahui nilai terbesar (misal penjualan tertinggi).\n- `MIN(A2:A10)`: Mengetahui nilai terkecil (misal pengeluaran paling minim).\n- `COUNT(A2:A10)`: Menghitung berapa jumlah sel yang terisi angka (mengabaikan sel kosong atau berisi huruf).\n\nPelajari cara menyaring visualisasi data ekstrem ini di simulator interaktif Excel Wahana.",
    category: "Statistik Dasar",
    date: "06 Mei 2026",
    readTime: "4 menit baca",
    gradient: "from-violet-500/10 to-fuchsia-500/10 border-violet-500/20"
  },
  {
    id: 10,
    title: "Mendeteksi Kesalahan Formula Excel dan Cara Cepat Mengatasinya",
    excerpt: "Sering menemui error #DIV/0!, #N/A, atau #VALUE! di Excel? Temukan arti dari masing-masing kode error tersebut dan cara memperbaikinya.",
    content: "Error formula di Excel sering kali membingungkan pemula. Berikut arti dan cara mengatasinya:\n\n- `#DIV/0!`: Pembagian dengan angka nol atau sel kosong. Perbaiki data pembagi Anda.\n- `#N/A`: Data pencarian VLOOKUP tidak ditemukan di tabel referensi. Periksa kembali kecocokan karakter data kunci.\n- `#VALUE!`: Tipe data tidak cocok, misalnya menjumlahkan angka dengan huruf. Periksa format angka di dalam sel Anda.\n\nDi Excel Wahana, simulator kami akan mendeteksi dan menjelaskan kesalahan pengetikan rumus Anda secara real-time untuk mempercepat proses pembelajaran.",
    category: "Penyelesaian Masalah",
    date: "02 Mei 2026",
    readTime: "5 menit baca",
    gradient: "from-pink-500/10 to-rose-500/10 border-pink-500/20"
  },
  {
    id: 11,
    title: "Cara Menggunakan Rumus VLOOKUP dengan Kriteria Ganda di Excel Wahana",
    excerpt: "Secara bawaan, VLOOKUP hanya mencari satu kriteria. Pelajari trik membuat kolom pembantu (helper) untuk mencari data dengan kriteria ganda.",
    content: "Secara bawaan, `VLOOKUP` hanya mencari satu kriteria di kolom terkiri. Untuk menggunakan kriteria ganda, Anda dapat membuat kolom pembantu (*helper column*) yang menggabungkan dua kriteria kunci tersebut menggunakan simbol ampersand `&`.\n\nMisalnya di sel A2: `=B2&C2`.\nSetelah itu, lakukan pencarian menggunakan nilai gabungan tersebut:\n`=VLOOKUP(nilai1&nilai2, A:D, 4, FALSE)`\n\nCara ini sangat efektif, cepat, dan mudah diimplementasikan tanpa memerlukan rumus array yang rumit di simulator Excel Wahana.",
    category: "Rumus Tingkat Lanjut",
    date: "28 April 2026",
    readTime: "7 menit baca",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20"
  },
  {
    id: 12,
    title: "Mengenal Fungsi IFERROR untuk Menangani Pesan Error Excel di Excel Wahana",
    excerpt: "Laporan Excel Anda terlihat kurang rapi karena pesan error? Bungkus rumus Anda dengan IFERROR untuk menampilkan pesan khusus yang bersih.",
    content: "Ketika rumus Anda menghasilkan error seperti `#N/A` atau `#DIV/0!`, laporan Anda akan terlihat kurang profesional. Gunakan fungsi `IFERROR` di Excel Wahana untuk menangani hal tersebut secara elegan.\n\nRumus umumnya:\n`=IFERROR(rumus_utama, nilai_alternatif)`\n\nContoh:\n`=IFERROR(VLOOKUP(A2, B:D, 3, FALSE), \"Data Tidak Ditemukan\")`\n\nDengan begitu, jika terjadi kesalahan pencarian, Excel akan menampilkan teks *'Data Tidak Ditemukan'* alih-alih menampilkan kode error bawaan yang membingungkan pembaca.",
    category: "Penyelesaian Masalah",
    date: "24 April 2026",
    readTime: "4 menit baca",
    gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/20"
  },
  {
    id: 13,
    title: "Panduan Rumus COUNTIF dan COUNTIFS Bersyarat di Excel Wahana",
    excerpt: "Hitung jumlah sel yang memenuhi kondisi tertentu secara otomatis. Kuasai penggunaan COUNTIF untuk satu syarat dan COUNTIFS untuk banyak syarat.",
    content: "Untuk menghitung jumlah sel berdasarkan kondisi tertentu, Excel menyediakan fungsi `COUNTIF` dan `COUNTIFS`:\n\n- `COUNTIF(range, kriteria)`: Digunakan untuk satu syarat tunggal.\n  Contoh: `=COUNTIF(A2:A10, \"DEV\")` untuk menghitung jumlah karyawan di divisi DEV.\n- `COUNTIFS(range1, kriteria1, range2, kriteria2, ...)`: Digunakan untuk banyak syarat sekaligus.\n  Contoh: `=COUNTIFS(A2:A10, \"DEV\", B2:B10, \">5000000\")` untuk menghitung berapa karyawan DEV yang memiliki gaji di atas 5 juta.\n\nKedua rumus ini sangat berguna untuk membuat ringkasan dashboard data sekolah atau bisnis Anda di platform Excel Wahana.",
    category: "Analisis Data",
    date: "20 April 2026",
    readTime: "6 menit baca",
    gradient: "from-purple-500/10 to-violet-500/10 border-purple-500/20"
  },
  {
    id: 14,
    title: "Cara Menggunakan Rumus SUMIF untuk Menjumlahkan Data Kriteria di Excel Wahana",
    excerpt: "Pelajari cara menjumlahkan nominal transaksi atau nilai angka secara selektif berdasarkan divisi atau kategori menggunakan SUMIF.",
    content: "Rumus `SUMIF` membantu Anda menjumlahkan nilai numerik hanya jika sel terkait memenuhi kriteria tertentu.\n\nStruktur rumusnya:\n`=SUMIF(range_kriteria, kriteria, [range_jumlah])`\n\nContoh di Excel Wahana:\n`=SUMIF(A2:A10, \"DEV\", B2:B10)`\n\nRumus di atas akan menjumlahkan total nominal di kolom B (Gaji) khusus untuk divisi \"DEV\" di kolom A. Jika Anda memiliki lebih dari satu kriteria (misal departemen DEV dan status Kontrak), Anda dapat menggunakan fungsi `SUMIFS`.",
    category: "Rumus Dasar",
    date: "16 April 2026",
    readTime: "5 menit baca",
    gradient: "from-amber-500/10 to-orange-500/10 border-amber-500/20"
  },
  {
    id: 15,
    title: "Tips Menggunakan Rumus CONCATENATE dan Simbol Ampersand (&) di Excel Wahana",
    excerpt: "Gabungkan nama depan, nama belakang, atau kode barang secara dinamis. Simak tips menyatukan teks dengan spasi pemisah di Excel.",
    content: "Menggabungkan data teks dari sel yang berbeda sering kali diperlukan, misalnya menggabungkan Nama Depan dan Nama Belakang karyawan agar mempermudah pembuatan slip gaji.\n\nAda dua cara utama yang bisa dicoba di Excel Wahana:\n1. Menggunakan fungsi `CONCATENATE`:\n   `=CONCATENATE(A2, \" \", B2)`\n2. Menggunakan simbol ampersand `&` (lebih cepat dan direkomendasikan):\n   `=A2 & \" \" & B2`\n\nTanda `\" \"` (spasi di dalam tanda kutip) berfungsi memberikan jarak pemisah antar teks agar tidak menempel satu sama lain.",
    category: "Pembersihan Data",
    date: "12 April 2026",
    readTime: "4 menit baca",
    gradient: "from-rose-500/10 to-pink-500/10 border-rose-500/20"
  },
  {
    id: 16,
    title: "Mengenal Fungsi DATE, DAY, MONTH, dan YEAR untuk Waktu di Excel Wahana",
    excerpt: "Kuasai manipulasi data tanggal di Excel. Pecah dan satukan kembali data hari, bulan, dan tahun untuk mempermudah laporan berkala.",
    content: "Manajemen tanggal adalah salah satu kebutuhan utama dalam penyusunan database payroll atau proyek.\n\n- `DATE(tahun, bulan, tanggal)`: Membuat format tanggal yang valid di Excel.\n- `DAY(sel)`: Mengambil angka hari dari suatu tanggal.\n- `MONTH(sel)`: Mengambil angka bulan.\n- `YEAR(sel)`: Mengambil angka tahun.\n\nContoh jika sel A2 berisi `04/06/2026`, maka `=MONTH(A2)` akan mengembalikan hasil `6` (Juni). Ini mempermudah Anda melakukan filter laporan bulanan di Excel Wahana secara otomatis.",
    category: "Manipulasi Tanggal",
    date: "08 April 2026",
    readTime: "5 menit baca",
    gradient: "from-teal-500/10 to-emerald-500/10 border-teal-500/20"
  },
  {
    id: 17,
    title: "Cara Menghitung Persentase Kenaikan dan Penurunan Angka di Excel Wahana",
    excerpt: "Analisis performa penjualan atau kenaikan gaji karyawan secara objektif. Simak rumus dasar perhitungan persentase selisih data.",
    content: "Menghitung persentase perubahan (kenaikan atau penurunan) antara nilai lama dan nilai baru sangat penting untuk analisis data.\n\nRumus dasarnya adalah:\n`=(Nilai Baru - Nilai Lama) / Nilai Lama`\n\nContoh di Excel Wahana:\nJika target penjualan lama ada di sel B2 dan hasil baru di sel C2, rumusnya:\n`=(C2-B2)/B2`\n\nSetelah memasukkan rumus tersebut, ubah format sel menjadi *Percentage* (%) agar Excel otomatis menampilkan lambang persen secara rapi.",
    category: "Tips & Trik",
    date: "04 April 2026",
    readTime: "3 menit baca",
    gradient: "from-indigo-500/10 to-sky-500/10 border-indigo-500/20"
  },
  {
    id: 18,
    title: "Panduan Membuat Grafik Sederhana di Excel Wahana dari Hasil Rekap",
    excerpt: "Ubah baris data numerik Anda menjadi grafik yang informatif dan menarik. Simak cara memilih jenis chart yang tepat untuk dashboard Anda.",
    content: "Setelah selesai merangkum data menggunakan rumus `SUM` atau `AVERAGE`, langkah berikutnya adalah menyajikan data tersebut secara visual agar mudah dipahami atasan.\n\nLangkahnya:\n1. Blok seluruh tabel ringkasan data Anda.\n2. Klik menu *Insert* lalu pilih jenis grafik (*Chart*) yang sesuai.\n   - **Bar/Column Chart**: Sangat baik untuk perbandingan antar divisi.\n   - **Line Chart**: Cocok untuk melihat tren perkembangan dari waktu ke waktu.\n\nGrafik yang informatif selalu didasarkan pada data sumber rumus yang bersih dan terstruktur di Excel Wahana.",
    category: "Visualisasi Data",
    date: "30 Maret 2026",
    readTime: "6 menit baca",
    gradient: "from-sky-500/10 to-blue-500/10 border-sky-500/20"
  },
  {
    id: 19,
    title: "Menggunakan Fungsi UPPER, LOWER, dan PROPER untuk Huruf Kapital di Excel Wahana",
    excerpt: "Rapikan teks nama atau alamat dalam sekali seret. Ubah semua teks menjadi huruf besar, kecil, atau kapital di setiap awal kata.",
    content: "Mengatur konsistensi huruf kapital sangat penting untuk kerapian dokumen sebelum dicetak atau dianalisis.\n\n- `UPPER(teks)`: Mengubah seluruh teks menjadi huruf besar (kapital) semua.\n- `LOWER(teks)`: Mengubah seluruh teks menjadi huruf kecil semua.\n- `PROPER(teks)`: Mengubah huruf pertama di setiap kata menjadi huruf kapital, dan sisanya menjadi huruf kecil.\n\nContoh: jika sel A2 berisi *\"laporan payroll\"*, maka `=PROPER(A2)` akan menghasilkan *\"Laporan Payroll\"* secara otomatis. Kombinasikan ini untuk merapikan nama karyawan Anda di platform Excel Wahana.",
    category: "Pembersihan Data",
    date: "26 Maret 2026",
    readTime: "4 menit baca",
    gradient: "from-violet-500/10 to-fuchsia-500/10 border-violet-500/20"
  },
  {
    id: 20,
    title: "Tips Produktif Excel Wahana: Mengunci Sel dengan Absolute Reference ($)",
    excerpt: "Rumus Anda menghasilkan error saat disalin ke bawah? Pelajari cara menyematkan simbol dolar ($) untuk mengunci referensi sel tabel lookup.",
    content: "Saat Anda menyalin rumus ke baris di bawahnya, alamat sel di dalamnya akan otomatis bergeser ke bawah. Untuk mengunci referensi sel tertentu agar tidak ikut bergeser (misalnya tabel referensi VLOOKUP), Anda harus menggunakan **Absolute Reference** dengan simbol dolar `$` di Excel Wahana.\n\n- `$B$2`: Mengunci sel B2 secara penuh (kolom dan baris tidak akan bergeser).\n- `B$2`: Hanya mengunci baris 2 (kolom bebas bergeser).\n- `$B2`: Hanya mengunci kolom B (baris bebas bergeser).\n\nTekan tombol `F4` pada keyboard Anda setelah menunjuk sel untuk menyisipkan simbol `$` secara otomatis dan cepat.",
    category: "Tips & Trik",
    date: "22 Maret 2026",
    readTime: "5 menit baca",
    gradient: "from-pink-500/10 to-rose-500/10 border-pink-500/20"
  }
];

// ─── Main Page ───────────────────────────────────────────────────────────────
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
  const [visibleArticles, setVisibleArticles] = useState(6);
  const [activeReadingArticle, setActiveReadingArticle] = useState<typeof DUMMY_ARTICLES[0] | null>(null);

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
        openAuthModal(false);
        router.replace("/");
      }
    }
  }, [router]);

  // ─── Typing animation for formula bar ─────────────────────────────────────
  const formulas = [
    "=SUM(F2:G2)",
    "=IF(H2>=7500,\"Tinggi\",IF(H2>=5500,\"Sedang\",\"Rendah\"))",
    "=VLOOKUP(E2,A7:B8,2,FALSE)",
    "=TRIM(PROPER(B2))",
    "=AVERAGE(H2:H10)",
  ];
  const typedFormula = useTypingEffect(formulas, 55, 25, 2200);

  // ─── Scroll Parallax ───────────────────────────────────────────────────────
  const { scrollY } = useScroll();
  const yBlob1 = useTransform(scrollY, [0, 800], [0, -120]);
  const yBlob2 = useTransform(scrollY, [0, 800], [0, 100]);
  const yBlob3 = useTransform(scrollY, [0, 800], [0, -60]);
  const yGrid = useTransform(scrollY, [0, 800], [0, -50]);

  // ─── Mouse Parallax ────────────────────────────────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 18 });
  const floatX1 = useTransform(springX, [-0.5, 0.5], [-16, 16]);
  const floatY1 = useTransform(springY, [-0.5, 0.5], [-16, 16]);
  const floatX2 = useTransform(springX, [-0.5, 0.5], [24, -24]);
  const floatY2 = useTransform(springY, [-0.5, 0.5], [24, -24]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { y: 28, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: "easeOut" as const } },
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div style={{ y: yBlob1 }} className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-emerald-500/8 blur-[140px]" />
        <motion.div style={{ y: yBlob2 }} className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/8 blur-[160px]" />
        <motion.div style={{ y: yBlob3 }} className="absolute top-[35%] right-[15%] w-[35%] h-[35%] rounded-full bg-indigo-500/5 blur-[100px]" />
        <motion.div style={{ y: yGrid }} className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* ═══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md shadow-emerald-500/30">
              <span className="font-mono text-sm font-bold text-white">XL</span>
            </div>
            <span className="font-bold tracking-tight text-foreground text-base">Excel Wahana</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
            <a href="#fitur" className="hover:text-emerald-500 transition-colors">Fitur</a>
            <a href="#kurikulum" className="hover:text-emerald-500 transition-colors">Kurikulum</a>
            <a href="#playground" className="hover:text-emerald-500 transition-colors">Playground</a>
            <a href="#artikel" className="hover:text-emerald-500 transition-colors">Artikel</a>
            <a href="#faq" className="hover:text-emerald-500 transition-colors">FAQ</a>
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <div className="flex items-center p-0.5 bg-muted/40 border border-border/30 rounded-full">
              <button
                onClick={() => setTheme("light")}
                className={`h-7 px-2.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${activeTheme === "light" ? "bg-white text-amber-500 shadow-sm border border-border/10" : "text-muted-foreground hover:text-foreground"}`}
                title="Light Mode"
              >
                <Sun className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Light</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`h-7 px-2.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${activeTheme === "dark" ? "bg-slate-800 text-sky-400 shadow-sm border border-border/10" : "text-muted-foreground hover:text-foreground"}`}
                title="Dark Mode"
              >
                <Moon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Dark</span>
              </button>
            </div>

            {mounted && user ? (
              <Link href="/belajar" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md shadow-emerald-500/25 transition-all hover:-translate-y-px cursor-pointer">
                Dashboard Belajar <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <button onClick={() => openAuthModal(false)} className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-1.5">
                  Masuk
                </button>
                <button onClick={() => openAuthModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md shadow-emerald-500/25 transition-all hover:-translate-y-px cursor-pointer">
                  Mulai Gratis <ArrowRight className="w-3.5 h-3.5" />
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute inset-x-0 top-16 bg-background/98 backdrop-blur-xl border-b border-border/40 z-40 p-6 flex flex-col space-y-6 shadow-xl"
            >
              <nav className="flex flex-col space-y-1">
                {["#fitur|Fitur Utama", "#kurikulum|Kurikulum", "#playground|Playground", "#artikel|Artikel Edukasi", "#faq|FAQ"].map(item => {
                  const [href, label] = item.split("|");
                  return (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm font-medium text-foreground hover:text-emerald-500 transition-colors py-2.5 px-2 rounded-lg hover:bg-muted/10 border-b border-border/10 last:border-0"
                    >
                      {label}
                    </a>
                  );
                })}
              </nav>
              <div className="flex flex-col gap-3 pt-2 border-t border-border/40">
                <div className="flex items-center p-0.5 bg-muted/40 border border-border/30 rounded-full w-fit">
                  <button onClick={() => setTheme("light")} className={`h-8 px-4 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${activeTheme === "light" ? "bg-white text-amber-500 shadow-sm" : "text-muted-foreground"}`}>
                    <Sun className="h-3.5 w-3.5" /> Light
                  </button>
                  <button onClick={() => setTheme("dark")} className={`h-8 px-4 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${activeTheme === "dark" ? "bg-slate-800 text-sky-400 shadow-sm" : "text-muted-foreground"}`}>
                    <Moon className="h-3.5 w-3.5" /> Dark
                  </button>
                </div>
                {mounted && user ? (
                  <Link href="/belajar" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-2.5 text-sm font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer">
                    Dashboard Belajar
                  </Link>
                ) : (
                  <>
                    <button onClick={() => { setIsMobileMenuOpen(false); openAuthModal(false); }} className="w-full text-center py-2.5 text-sm font-semibold text-muted-foreground border border-border/60 rounded-lg hover:bg-muted/10 transition-colors cursor-pointer">
                      Masuk
                    </button>
                    <button onClick={() => { setIsMobileMenuOpen(false); openAuthModal(true); }} className="w-full text-center py-2.5 text-sm font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer">
                      Mulai Gratis
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══ HERO ════════════════════════════════════════════════════════════ */}
      <section
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 max-w-[1400px] mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 overflow-visible"
      >
        {/* Floating Formula Pills */}
        <motion.div style={{ x: floatX1, y: floatY2, opacity: 0.18 }} className="absolute top-[12%] left-[3%] text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 select-none pointer-events-none hidden lg:block">
          =SUM(F2:G2)
        </motion.div>
        <motion.div style={{ x: floatX2, y: floatY1, opacity: 0.14 }} className="absolute bottom-[22%] left-[40%] text-xs font-mono font-bold text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 select-none pointer-events-none hidden lg:block">
          =VLOOKUP(C2, A7:B8, 2, FALSE)
        </motion.div>
        <motion.div style={{ x: floatX1, y: floatY1, opacity: 0.16 }} className="absolute top-[18%] right-[22%] text-xs font-mono font-bold text-purple-500 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 select-none pointer-events-none hidden lg:block">
          {`=IF(H2>=7500,"Tinggi","Rendah")`}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left: Copy */}
          <div className="lg:col-span-6 flex flex-col space-y-7 text-center lg:text-left">
            <motion.div variants={itemVariants} className="inline-flex items-center self-center lg:self-start space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Pembelajaran Excel Interaktif · Gratis</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-foreground">
              Kuasai Rumus Excel{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500">
                Secara Interaktif
              </span>{" "}
              Tanpa Ribet
            </motion.h1>

            <motion.p variants={itemVariants} className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Uji formula Anda di simulator spreadsheet browser. Dapatkan visual feedback instan, prerequisite cell locking dinamis, dan tantangan studi kasus nyata.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              {mounted && user ? (
                <Link href="/belajar" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 transform hover:-translate-y-0.5 transition-all group gap-2 cursor-pointer">
                  <span>Mulai Belajar Sekarang</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button onClick={() => openAuthModal(true)} className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 transform hover:-translate-y-0.5 transition-all group gap-2 cursor-pointer">
                  <span>Mulai Belajar Sekarang (Gratis)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <a href="#playground" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl border border-border bg-card/40 hover:bg-card/80 text-foreground transition-all gap-2">
                <Play className="w-4 h-4 text-emerald-500" />
                <span>Coba Playground</span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 pt-6 border-t border-border/40 max-w-md mx-auto lg:mx-0">
              {[
                { val: "7+", label: "Kategori Modul" },
                { val: "30+", label: "Soal & Tantangan" },
                { val: "100%", label: "Gratis & Tanpa Instal", accent: true },
              ].map(s => (
                <div key={s.label}>
                  <h4 className={`text-2xl font-extrabold ${s.accent ? "text-emerald-400" : "text-foreground"}`}>{s.val}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Animated Formula Bar Preview */}
          <motion.div variants={itemVariants} className="lg:col-span-6 flex flex-col gap-4">
            {/* Formula Bar Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-blue-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative bg-card/70 border border-border/70 rounded-2xl p-4 backdrop-blur-sm shadow-xl">
                {/* Chrome */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/40">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-2 py-0.5 rounded">studi-kasus-payroll.xlsx</div>
                  <div className="w-14" />
                </div>
                {/* Typing Formula Bar */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="font-bold text-emerald-500 text-sm font-mono">fx</span>
                  <div className="w-px h-4 bg-border" />
                  <span className="text-xs font-mono text-foreground flex-1 min-h-[1.2em]">
                    {typedFormula}
                    <span className="inline-block w-0.5 h-3.5 bg-emerald-500 ml-0.5 animate-pulse align-middle" />
                  </span>
                </div>
                {/* Mini Grid Preview */}
                <div className="font-mono text-[10px] border border-border/30 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-5 bg-muted/30 border-b border-border/30">
                    {["", "Dept", "Pokok", "Total", "Status"].map((h, i) => (
                      <div key={i} className={`p-1.5 text-center font-bold border-r border-border/20 last:border-0 ${i === 3 ? "text-emerald-500" : "text-muted-foreground"}`}>{h}</div>
                    ))}
                  </div>
                  {[
                    { dept: "ADM", pokok: "5.000", total: "5.600", status: "Sedang", sc: "yellow" },
                    { dept: "DEV", pokok: "7.000", total: "8.000", status: "Tinggi", sc: "emerald" },
                    { dept: "FIN", pokok: "5.000", total: "5.800", status: "Sedang", sc: "yellow" },
                  ].map((r, i) => (
                    <div key={i} className="grid grid-cols-5 border-b border-border/20 last:border-0 hover:bg-muted/10">
                      <div className="p-1.5 text-center text-muted-foreground font-bold border-r border-border/20 bg-muted/10">{i + 2}</div>
                      <div className="p-1.5 border-r border-border/20 text-foreground/80">{r.dept}</div>
                      <div className="p-1.5 border-r border-border/20 text-foreground/80">{r.pokok}</div>
                      <div className="p-1.5 border-r border-border/20 font-semibold text-emerald-500 bg-emerald-500/8">{r.total}</div>
                      <div className={`p-1.5 font-semibold ${r.sc === "emerald" ? "text-emerald-400 bg-emerald-500/8" : "text-yellow-400 bg-yellow-500/8"}`}>
                        {r.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <motion.div style={{ x: floatX1 }} className="flex items-center gap-2 bg-card/90 border border-emerald-500/20 px-3 py-2 rounded-xl shadow-lg backdrop-blur-md text-[11px]">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-emerald-500" /></div>
                <div><div className="font-bold text-foreground">Formula Benar!</div><div className="text-muted-foreground text-[9px]">Confetti dilepaskan</div></div>
              </motion.div>
              <motion.div style={{ x: floatX2 }} className="flex items-center gap-2 bg-card/90 border border-yellow-500/20 px-3 py-2 rounded-xl shadow-lg backdrop-blur-md text-[11px]">
                <Lock className="w-4 h-4 text-yellow-500" />
                <div><div className="font-bold text-foreground">Prerequisite Locked</div><div className="text-muted-foreground text-[9px]">Selesaikan sel sebelumnya</div></div>
              </motion.div>
              <motion.div style={{ x: floatX1 }} className="flex items-center gap-2 bg-card/90 border border-blue-500/20 px-3 py-2 rounded-xl shadow-lg backdrop-blur-md text-[11px]">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <div><div className="font-bold text-foreground">Progress Tersimpan</div><div className="text-muted-foreground text-[9px]">Tersimpan otomatis</div></div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ BENTO FEATURES ══════════════════════════════════════════════════ */}
      <section id="fitur" className="relative z-10 py-28 border-y border-border/40 bg-muted/5">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" /> Kenapa Excel Wahana?
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Sistem Pembelajaran Paling Modern
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Dirancang hands-on dari awal untuk langsung menguji keterampilan pemecahan masalah nyata Anda.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
            {/* Big Card 1: Interactive Simulator */}
            <div className="lg:col-span-2 group relative overflow-hidden bg-card border border-border/60 rounded-2xl p-7 flex flex-col gap-5 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                  <Table className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400/70 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">No. 1 Feature</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-emerald-400 transition-colors">Interactive Sheet Simulator</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Tidak perlu instalasi Microsoft Excel atau Google Sheets. Ketik rumus Anda secara langsung dalam grid responsif persis seperti spreadsheet sungguhan, lengkap dengan formula bar, resize kolom, dan cell navigation.</p>
              </div>
              {/* Mini visual demo */}
              <div className="mt-auto font-mono text-[10px] border border-border/30 rounded-lg overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <div className="grid grid-cols-4 bg-muted/30 border-b border-border/20">
                  {["", "A", "B", "C"].map(h => <div key={h} className="p-1.5 text-center text-muted-foreground font-bold border-r border-border/20 last:border-0">{h}</div>)}
                </div>
                <div className="grid grid-cols-4 border-b border-border/20">
                  <div className="p-1.5 text-center text-muted-foreground bg-muted/10 border-r border-border/20 font-bold">1</div>
                  <div className="p-1.5 border-r border-border/20 text-foreground/70">Nama</div>
                  <div className="p-1.5 border-r border-border/20 text-foreground/70">Nilai</div>
                  <div className="p-1.5 text-emerald-400 font-semibold">Grade</div>
                </div>
                <div className="grid grid-cols-4">
                  <div className="p-1.5 text-center text-muted-foreground bg-muted/10 border-r border-border/20 font-bold">2</div>
                  <div className="p-1.5 border-r border-border/20 text-foreground/70">Andi</div>
                  <div className="p-1.5 border-r border-border/20 text-foreground/70">85</div>
                  <div className="p-1.5 ring-1 ring-emerald-500/50 text-emerald-400 bg-emerald-500/8 animate-pulse text-[9px]">=IF(B2&gt;=80…</div>
                </div>
              </div>
            </div>

            {/* Card: Instant Feedback */}
            <div className="group relative overflow-hidden bg-card border border-border/60 rounded-2xl p-7 flex flex-col gap-4 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-blue-400 transition-colors">Instant Visual Feedback</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Tahu secara langsung apakah rumus Anda salah melalui efek getar, atau rayakan jawaban yang benar dengan letupan confetti spektakuler.</p>
              </div>
              <div className="mt-auto flex gap-2">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Benar → Confetti
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                  <X className="w-3 h-3" /> Salah → Shake
                </div>
              </div>
            </div>

            {/* Card: Cell Locking */}
            <div className="group relative overflow-hidden bg-card border border-border/60 rounded-2xl p-7 flex flex-col gap-4 hover:border-yellow-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:scale-110 group-hover:bg-yellow-500/20 transition-all duration-300">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-yellow-400 transition-colors">Prerequisite Cell Locking</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Sel yang bergantung pada perhitungan lain akan terkunci secara cerdas dan terbuka otomatis setelah prasyaratnya selesai.</p>
              </div>
              <div className="mt-auto flex items-center gap-2 text-[10px] text-muted-foreground">
                <Lock className="w-3.5 h-3.5 text-yellow-400" />
                <span>Gaji Total harus diisi sebelum Status terbuka</span>
              </div>
            </div>

            {/* Card: Column Resize */}
            <div className="group relative overflow-hidden bg-card border border-border/60 rounded-2xl p-7 flex flex-col gap-4 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-purple-400 transition-colors">Interactive Column Resizing</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Sama seperti Excel sungguhan — seret garis tepi header kolom untuk memperlebar kolom yang terpotong dengan mulus.</p>
              </div>
            </div>

            {/* Big Card 2: Dashboard Progres Belajar */}
            <div className="lg:col-span-2 group relative overflow-hidden bg-card border border-border/60 rounded-2xl p-7 flex flex-col gap-5 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400/70 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Self-Paced Learning</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-emerald-400 transition-colors">Dashboard Progres Belajar Mandiri</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Pantau perkembangan belajar Anda secara real-time. Setiap modul formula, tantangan studi kasus, dan latihan interaktif yang Anda selesaikan akan terekam otomatis dalam profil personal Anda.</p>
              </div>
              {/* Visual Mini Progress Bar */}
              <div className="mt-auto space-y-3 p-4 bg-muted/20 border border-border/20 rounded-xl select-none">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-foreground">
                    <span>Modul 1: VLOOKUP & Pencarian Data</span>
                    <span className="text-emerald-400 font-mono text-[10px]">100% Selesai</span>
                  </div>
                  <div className="w-full h-2 bg-border/40 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: "100%" }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-foreground">
                    <span>Modul 2: Formula IF Bertingkat (Nested IF)</span>
                    <span className="text-amber-400 font-mono text-[10px]">60% Sedang Berjalan</span>
                  </div>
                  <div className="w-full h-2 bg-border/40 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Case Studies */}
            <div className="group relative overflow-hidden bg-card border border-border/60 rounded-2xl p-7 flex flex-col gap-4 hover:border-rose-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/5">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all duration-300">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-rose-400 transition-colors">Integrated Case Studies</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Uji kemampuan akhir lewat studi kasus berskala nyata seperti Laporan Gaji & Evaluasi Penggajian Karyawan terpadu.</p>
              </div>
              <div className="mt-auto text-[10px] font-mono font-semibold px-3 py-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 w-fit flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5" /> Payroll Project · VLOOKUP + Nested IF
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MINI PLAYGROUND ═════════════════════════════════════════════════ */}
      <section id="playground" className="relative z-10 py-28">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold w-fit">
                <Play className="w-3.5 h-3.5" /> Live Playground
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Coba Langsung{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Tanpa Daftar</span>
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Klik pada kolom <strong className="text-foreground">Total (H)</strong> di tabel sebelah kanan, ketikkan rumus Excel Anda (contoh: <code className="text-emerald-400 font-mono text-sm bg-emerald-500/10 px-1.5 rounded">{"=SUM(F2,G2)"}</code>), lalu tekan <kbd className="px-1.5 py-0.5 rounded border border-border text-xs font-mono">Enter</kbd>.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { formula: "=SUM(F2,G2)", desc: "Menjumlahkan Gaji Pokok + Tunjangan" },
                  { formula: "=F2+G2", desc: "Cara alternatif yang juga diterima" },
                  { formula: "=SUM(F2:G2)", desc: "Menggunakan range cells" },
                ].map(hint => (
                  <div key={hint.formula} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-border/60 hover:border-emerald-500/30 transition-colors">
                    <code className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">{hint.formula}</code>
                    <span className="text-sm text-muted-foreground">→ {hint.desc}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/60 italic">
                * Semua variasi dan kombinasi rumus yang logis akan diterima sebagai jawaban yang benar.
              </p>
            </div>

            {/* Right: Playground */}
            <MiniPlayground />
          </div>
        </div>
      </section>

      {/* ═══ CURRICULUM ══════════════════════════════════════════════════════ */}
      <section id="kurikulum" className="relative z-10 py-28 border-y border-border/40 bg-muted/5">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" /> Kurikulum Terstruktur
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Dari Nol Hingga Mahir
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Kurikulum terstruktur yang mencakup rumus paling populer dan relevan di dunia kerja.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="relative pl-16 space-y-6">
              <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500/40 via-purple-500/20 to-transparent rounded-full" />

              {CURRICULUM_STEPS.map((step, i) => {
                const c = colorMap[step.color];
                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="relative group"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute -left-10 top-4 w-9 h-9 rounded-full bg-gradient-to-br ${c.dot} border-2 border-background flex items-center justify-center text-xs font-extrabold text-white shadow-md group-hover:scale-110 transition-all duration-300 z-10`}>
                      {step.num}
                    </div>

                    <div className="relative bg-card/50 hover:bg-card/80 border border-border/60 hover:border-emerald-500/20 p-6 rounded-2xl space-y-3 transition-all duration-300 hover:shadow-xl group-hover:shadow-emerald-500/5 backdrop-blur-sm">
                      {/* Hover glow */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

                      <div className={`flex items-center gap-2 text-xs font-bold ${c.badge}`}>
                        <step.icon className="w-3.5 h-3.5" />
                        <span>{step.badge}</span>
                      </div>

                      <h4 className={`text-lg font-bold text-foreground ${c.hover} transition-colors duration-200`}>
                        {step.title}
                      </h4>

                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>

                      {/* Formula tags with hover tooltip */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {step.formulas.map(formula => (
                          <span
                            key={formula}
                            className={`px-2 py-0.5 bg-muted/50 border border-border/40 rounded-md text-[10px] font-mono text-muted-foreground font-semibold cursor-default transition-all duration-150 ${c.formula}`}
                          >
                            {formula}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ARTIKEL & EDUKASI SECTION ═══════════════════════════════════════ */}
      <section id="artikel" className="relative z-10 py-28 border-t border-border/40 bg-muted/5">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" /> Artikel & Edukasi Excel
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Wawasan & Panduan Rumus Excel
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Tingkatkan pemahaman teori Anda dengan kumpulan tips, panduan formula, dan studi kasus spreadsheet terpopuler.
            </p>
          </div>

          {/* Grid of Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DUMMY_ARTICLES.slice(0, visibleArticles).map((article) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "group relative overflow-hidden bg-card border border-border/60 hover:border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/[0.02]"
                )}
              >
                {/* Background soft glow gradient */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10", article.gradient.split(" ")[0], article.gradient.split(" ")[1])} />
                
                <div className="space-y-4">
                  {/* Meta tag & Read time */}
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                    <span className="text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/10">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-foreground group-hover:text-emerald-500 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 font-sans">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer card */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40 text-[11px] font-medium text-muted-foreground select-none">
                  <span>{article.date}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveReadingArticle(article);
                    }}
                    className="inline-flex items-center gap-1 text-emerald-500 font-bold hover:text-emerald-400 transition-colors cursor-pointer bg-transparent border-none p-0"
                  >
                    Mulai Membaca <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Show More Button */}
          {visibleArticles < DUMMY_ARTICLES.length && (
            <div className="flex justify-center mt-12">
              <Button
                onClick={() => setVisibleArticles(DUMMY_ARTICLES.length)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-px cursor-pointer"
              >
                Tampilkan Semua Artikel ({DUMMY_ARTICLES.length})
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ FAQ ACCORDION ═══════════════════════════════════════════════════ */}
      <section id="faq" className="relative z-10 py-28">
        <div className="max-w-[860px] mx-auto px-6">
          <div className="text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/60 text-muted-foreground text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" /> FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Pertanyaan Umum</h2>
            <p className="text-muted-foreground text-sm">Masih ragu? Berikut jawaban dari pertanyaan yang paling sering ditanyakan.</p>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* ═══ CTA BANNER ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 border-t border-border/40">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-card to-blue-500/10 border border-emerald-500/20 p-10 md:p-16 text-center flex flex-col items-center gap-8">
            {/* Glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[60%] h-[200px] bg-emerald-500/15 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Mulai Gratis Hari Ini
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                Siap Jadi Master Excel?
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Bergabunglah dan mulai perjalanan belajar Excel interaktif Anda sekarang. Gratis, tanpa instalasi, tanpa batas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative">
              {mounted && user ? (
                <Link href="/belajar" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-xl shadow-emerald-500/30 transition-all hover:-translate-y-0.5 cursor-pointer">
                  Lanjut ke Dashboard Belajar <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <button onClick={() => openAuthModal(true)} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-xl shadow-emerald-500/30 transition-all hover:-translate-y-0.5 cursor-pointer">
                    Daftar Gratis Sekarang <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => openAuthModal(false)} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-card/50 hover:bg-card text-foreground font-semibold text-sm transition-all hover:-translate-y-0.5 cursor-pointer">
                    Sudah punya akun? Masuk
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-border/40 py-10 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-mono text-[11px] font-bold">XL</div>
            <span className="font-bold tracking-tight text-foreground">Excel Wahana</span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Wahana Prestasi. Platform pembelajaran Excel interaktif gratis.</p>
          <div className="flex space-x-6 text-xs">
            <a href="#fitur" className="hover:text-foreground transition-colors">Fitur</a>
            <a href="#kurikulum" className="hover:text-foreground transition-colors">Kurikulum</a>
            <a href="#playground" className="hover:text-foreground transition-colors">Playground</a>
            {mounted && user ? (
              <Link href="/belajar" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer">Mulai Belajar</Link>
            ) : (
              <button onClick={() => openAuthModal(true)} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer bg-transparent border-none p-0">
                Mulai Belajar
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} defaultSignUp={defaultSignUp} />

      {/* Article Detail Modal */}
      <Dialog open={activeReadingArticle !== null} onOpenChange={(open) => !open && setActiveReadingArticle(null)}>
        <DialogContent className="max-w-xs sm:max-w-lg p-6 overflow-hidden border border-border/60 bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl">
          {activeReadingArticle && (
            <>
              <DialogHeader className="space-y-2.5 select-none text-left">
                <div className="flex items-center justify-between text-[9px] font-extrabold tracking-wider uppercase text-muted-foreground">
                  <span className="text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/15">
                    {activeReadingArticle.category}
                  </span>
                  <span>{activeReadingArticle.readTime}</span>
                </div>
                <DialogTitle className="text-base sm:text-xl font-bold tracking-tight text-foreground leading-snug">
                  {activeReadingArticle.title}
                </DialogTitle>
                <DialogDescription className="text-[10px] text-muted-foreground font-mono">
                  Dipublikasikan pada: {activeReadingArticle.date}
                </DialogDescription>
              </DialogHeader>

              <div 
                className="my-4 text-xs sm:text-sm text-foreground/90 dark:text-foreground/80 leading-relaxed font-sans border-y border-border/40 py-4 max-h-[300px] overflow-y-auto pr-1.5 scrollbar-thin select-text whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: activeReadingArticle.content
                    .replace(/`(.*?)`/g, '<code class="bg-muted dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[11px] text-emerald-600 dark:text-emerald-400 border border-border/60 font-semibold">$1</code>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="italic text-foreground/90">$1</em>')
                }}
              />

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1 select-none">
                {mounted && user ? (
                  <Link
                    href="/belajar"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-px cursor-pointer"
                    onClick={() => setActiveReadingArticle(null)}
                  >
                    <span>Coba Latihan di Simulator</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-px cursor-pointer"
                    onClick={() => {
                      setActiveReadingArticle(null);
                      openAuthModal(true);
                    }}
                  >
                    <span>Daftar Gratis & Latihan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setActiveReadingArticle(null)}
                  className="px-4 py-3 rounded-xl border border-border bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground font-semibold text-xs transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
