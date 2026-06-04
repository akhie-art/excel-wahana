"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useAppStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import fallbackFormulas from "@/lib/formulas-data.json";
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  Download, 
  ArrowLeft, 
  Sparkles,
  Command, 
  Grid,
  FileSpreadsheet,
  HelpCircle,
  Code,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TemplateImageSlider } from "@/components/template-image-slider";

const DUMMY_TEMPLATES = [
  {
    title: "Template Slip Gaji & Payroll Otomatis",
    format: "xlsx (Excel)",
    size: "142 KB",
    downloads: "1,240 unduhan",
    description: "Template siap pakai lengkap dengan slip gaji interaktif yang terhubung langsung dengan tabel database karyawan menggunakan rumus VLOOKUP."
  },
  {
    title: "Dashboard KPI Keuangan & Kas Bulanan",
    format: "xlsx (Excel)",
    size: "98 KB",
    downloads: "850 unduhan",
    description: "Pantau arus kas masuk dan keluar secara bulanan lengkap dengan grafik tren performa laba rugi otomatis dan ringkasan persentase bulanan."
  },
  {
    title: "Rekap Nilai Siswa & Raport Guru",
    format: "xlsx (Excel)",
    size: "115 KB",
    downloads: "590 unduhan",
    description: "Permudah pembagian rapor dengan sistem pengisi nilai bersyarat menggunakan COUNTIF, AVERAGE, serta konversi Grade otomatis (A, B, C, D)."
  },
  {
    title: "Jadwal Kerja Shift Karyawan Mingguan",
    format: "xlsx (Excel)",
    size: "76 KB",
    downloads: "920 unduhan",
    description: "Template penjadwalan shift kerja bergilir yang menghitung total jam kerja mingguan secara otomatis dan mendeteksi bentrok jadwal."
  }
];

const DUMMY_SHORTCUTS = [
  { keyWin: "F4", keyMac: "F4 (atau Fn+F4)", action: "Absolute Reference", desc: "Mengunci sel dengan simbol $ (misal $B$2) saat menulis rumus agar referensi tidak bergeser." },
  { keyWin: "Ctrl + ;", keyMac: "Cmd + ;", action: "Input Tanggal Hari Ini", desc: "Memasukkan tanggal hari ini secara instan ke dalam sel aktif tanpa mengetik manual." },
  { keyWin: "Ctrl + Shift + L", keyMac: "Cmd + Shift + F", action: "Aktifkan Filter Data", desc: "Memasang tombol drop-down filter di baris header tabel secara instan." },
  { keyWin: "Ctrl + Page Down / Up", keyMac: "Option + Right / Left", action: "Navigasi Sheet", desc: "Berpindah antar tab lembar kerja (sheet) ke kanan atau ke kiri tanpa klik mouse." },
  { keyWin: "Ctrl + T", keyMac: "Cmd + T", action: "Ubah ke Format Table", desc: "Mengonversi rentang data biasa menjadi format Excel Table resmi lengkap dengan auto-styling." },
  { keyWin: "Alt + =", keyMac: "Cmd + Shift + T", action: "Auto SUM", desc: "Menyisipkan rumus penjumlahan =SUM() secara otomatis untuk rentang data di atas atau di kiri sel." }
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function PerpustakaanPage() {
  const { loadUserAndProgress } = useAppStore();
  
  // State for formula database & fallbacks
  const [formulas, setFormulas] = useState<any[]>(fallbackFormulas);
  const [templates, setTemplates] = useState<any[]>(DUMMY_TEMPLATES);
  const [displayLimit, setDisplayLimit] = useState(24);
  const [activeTab, setActiveTab] = useState<"all" | "formulas" | "templates" | "shortcuts">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  useEffect(() => {
    loadUserAndProgress();
  }, [loadUserAndProgress]);

  // Reset selected letter filter when active tab changes
  useEffect(() => {
    setSelectedLetter(null);
  }, [activeTab]);

  // Load formulas dynamically from Supabase database with fallback to JSON
  useEffect(() => {
    async function loadDbFormulas() {
      try {
        const { data, error } = await supabase
          .from("excel_formulas")
          .select("*")
          .order("nama_rumus", { ascending: true });
        
        if (error) throw error;
        if (data && data.length > 0) {
          setFormulas(data);
        }
      } catch (err) {
        console.warn("Koneksi Supabase offline/belum disemai, menggunakan data cadangan JSON lokal.", err);
      }
    }
    loadDbFormulas();
  }, []);

  // Load templates dynamically from Supabase
  useEffect(() => {
    async function loadDbTemplates() {
      try {
        const { data, error } = await supabase
          .from("excel_templates")
          .select("*");
        
        if (error) throw error;
        if (data && data.length > 0) {
          setTemplates(data);
        }
      } catch (err) {
        console.warn("Koneksi Supabase offline/belum disemai, menggunakan template lokal.", err);
      }
    }
    loadDbTemplates();
  }, []);

  // Handle formula copy to clipboard
  const handleCopyFormula = (syntax: string, index: number) => {
    navigator.clipboard.writeText(syntax);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Real or mock template download action
  const handleDownloadTemplate = (template: any, index: number) => {
    setDownloadingIndex(index);
    setTimeout(() => {
      setDownloadingIndex(null);
      if (template.file_url) {
        const link = document.createElement("a");
        link.href = template.file_url;
        link.download = template.file_name || "template.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Template berhasil diunduh (Simulasi)! Terima kasih telah mencoba.");
      }
    }, 1500);
  };

  // Map database format to layout presentation fields
  const mappedFormulas = formulas.map(f => ({
    name: f.nama_rumus || '',
    category: f.versi === '-' ? 'Dasar / Umum' : f.versi || 'Umum',
    syntax: f.syntax || '',
    description: f.penjelasan || '',
    tip: f.tip || ''
  }));

  // Reset pagination limit when search query or selected letter changes
  useEffect(() => {
    setDisplayLimit(24);
  }, [searchQuery, selectedLetter]);

  // Filter logic based on search query & selected letter
  const filteredFormulas = mappedFormulas.filter(formula => {
    const matchesSearch = 
      formula.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formula.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formula.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesLetter = !selectedLetter || formula.name.toUpperCase().startsWith(selectedLetter);
    
    return matchesSearch && matchesLetter;
  });

  const displayedFormulas = filteredFormulas.slice(0, displayLimit);

  const filteredTemplates = templates.filter(template => 
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredShortcuts = DUMMY_SHORTCUTS.filter(shortcut => 
    shortcut.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shortcut.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none z-0" />

      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 relative z-10 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4" /> Perpustakaan Belajar
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Kamus Rumus, Template & Shortcuts
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pusat referensi terlengkap untuk membantu Anda menyelesaikan tugas-tugas Excel Wahana lebih cepat.
            </p>
          </div>

          <Link href="/belajar">
            <Button variant="outline" className="h-9 gap-1.5 text-xs font-semibold self-start border-border/80 hover:bg-accent/40 rounded-xl cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali Belajar
            </Button>
          </Link>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={
                activeTab === "formulas"
                  ? `Cari dari ${formulas.length} rumus Excel...`
                  : activeTab === "templates"
                  ? "Cari template Excel gratis..."
                  : activeTab === "shortcuts"
                  ? "Cari pintasan keyboard..."
                  : "Cari rumus, fungsi, template, atau shortcut..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-border/80 bg-background/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-sans"
            />
          </div>

          {/* Navigation Tab Filters */}
          <div className="flex items-center p-1 rounded-xl bg-muted/30 border border-border/40 overflow-x-auto w-full md:w-auto scrollbar-none select-none">
            {[
              { id: "all", label: "Semua", icon: Grid },
              { id: "formulas", label: "Kamus Rumus", icon: Code },
              { id: "templates", label: "Template Excel", icon: FileSpreadsheet },
              { id: "shortcuts", label: "Shortcuts", icon: Command },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-card text-foreground shadow-sm border border-border/40"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid List Contents */}
        <div className="space-y-12">
          
          {/* SECTION 1: KAMUS RUMUS */}
          {(activeTab === "all" || activeTab === "formulas") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/20 pb-2">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-500" /> Kamus Rumus & Fungsi
                </h2>
                <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                  {filteredFormulas.length} rumus tersedia
                </span>
              </div>

              {/* Alphabet A-Z Filter Bar */}
              {activeTab === "formulas" && (
                <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none select-none border-b border-border/10 w-full">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground mr-1.5 shrink-0">Filter Abjad:</span>
                  <button
                    onClick={() => setSelectedLetter(null)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all shrink-0 cursor-pointer ${
                      selectedLetter === null
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                        : "bg-muted/65 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    ALL
                  </button>
                  {ALPHABET.map(letter => {
                    const hasFormulas = mappedFormulas.some(f => f.name.toUpperCase().startsWith(letter));
                    return (
                      <button
                        key={letter}
                        disabled={!hasFormulas}
                        onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
                        className={`w-6 h-6 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center justify-center shrink-0 ${
                          !hasFormulas
                            ? "opacity-20 cursor-not-allowed"
                            : "cursor-pointer"
                        } ${
                          selectedLetter === letter
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                            : hasFormulas
                              ? "bg-muted/65 text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                              : "bg-transparent text-muted-foreground/30"
                        }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              )}

              {filteredFormulas.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-border/60 rounded-xl text-muted-foreground text-xs">
                  Tidak ada rumus yang cocok dengan kata kunci pencarian Anda.
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {displayedFormulas.map((formula, idx) => (
                      <div 
                        key={`${formula.name}-${idx}`} 
                        className="group relative overflow-hidden bg-card/65 backdrop-blur-sm border border-border/60 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                              {formula.category}
                            </span>
                            <button
                              onClick={() => handleCopyFormula(formula.syntax, idx)}
                              className="p-1.5 rounded-lg border border-border/60 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                              title="Salin Sintaks Rumus"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-emerald-500 font-mono">Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span className="font-mono">Salin</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div>
                            <h3 className="text-base font-extrabold text-foreground group-hover:text-emerald-400 transition-colors">
                              {formula.name}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                              {formula.description}
                            </p>
                          </div>

                          <div className="p-3 bg-muted/40 rounded-xl border border-border/20 space-y-1.5">
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider font-extrabold">Sintaks:</div>
                            <div className="text-xs font-mono text-foreground font-semibold break-all bg-background/50 p-2 rounded border border-border/20">
                              {formula.syntax}
                            </div>
                          </div>

                          {formula.tip && (
                            <div className="text-[11px] text-muted-foreground/90 bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex gap-2">
                              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-amber-500">Pro-Tip:</span> {formula.tip}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 mt-4 border-t border-border/20 flex items-center justify-end">
                          <Link href="/belajar">
                            <span className="text-[11px] font-bold text-emerald-500 hover:text-emerald-600 inline-flex items-center gap-1 cursor-pointer">
                              Coba di Simulator &rarr;
                            </span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredFormulas.length > displayLimit && (
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={() => setDisplayLimit(prev => prev + 24)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 py-2 text-xs font-bold shadow-md cursor-pointer transition-all hover:-translate-y-px"
                      >
                        Muat Lebih Banyak Rumus ({filteredFormulas.length - displayLimit} lagi)
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: TEMPLATE EXCEL */}
          {(activeTab === "all" || activeTab === "templates") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/20 pb-2">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Template Excel Gratis (Unduhan)
                </h2>
                <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                  {filteredTemplates.length} file tersedia
                </span>
              </div>

              {filteredTemplates.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-border/60 rounded-xl text-muted-foreground text-xs">
                  Tidak ada template yang cocok dengan pencarian Anda.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template, idx) => (
                    <div 
                      key={template.id || template.title} 
                      className="group relative overflow-hidden bg-card/65 backdrop-blur-sm border border-border/60 hover:border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
                    >
                      <div className="space-y-4">
                        
                        {/* Screenshots Preview Strip */}
                        {template.images && template.images.length > 0 && (
                          <TemplateImageSlider 
                            images={template.images} 
                            onImageClick={setPreviewImageUrl} 
                            title={template.title} 
                          />
                        )}

                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="text-base font-extrabold text-foreground group-hover:text-emerald-400 transition-colors pt-1">
                              {template.title}
                            </h3>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap bg-muted px-2 py-1 rounded">
                            {template.format}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {template.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-border/20 flex items-center justify-between text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span>Ukuran: <strong className="font-mono text-foreground font-semibold">{template.size}</strong></span>
                          <span>|</span>
                          <span className="font-mono text-foreground/80">{template.downloads}</span>
                        </div>

                        <Button 
                          onClick={() => handleDownloadTemplate(template, idx)}
                          className="h-8 gap-1.5 text-[11px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 cursor-pointer"
                          disabled={downloadingIndex === idx}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{downloadingIndex === idx ? "Mengunduh..." : "Unduh Gratis"}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: KEYBOARD SHORTCUTS */}
          {(activeTab === "all" || activeTab === "shortcuts") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/20 pb-2">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Command className="w-4 h-4 text-emerald-500" /> Pintasan Keyboard (Shortcuts) Esensial
                </h2>
                <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                  {filteredShortcuts.length} pintasan terdaftar
                </span>
              </div>

              {filteredShortcuts.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-border/60 rounded-xl text-muted-foreground text-xs">
                  Tidak ada pintasan yang cocok dengan pencarian Anda.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-border/65 bg-card/40 backdrop-blur-sm">
                  <table className="w-full text-left border-collapse text-xs select-none">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border/60 text-muted-foreground font-bold font-mono">
                        <th className="p-4 w-[25%]">Fungsi / Aksi</th>
                        <th className="p-4 w-[20%]">Pintasan Windows</th>
                        <th className="p-4 w-[20%]">Pintasan macOS</th>
                        <th className="p-4 w-[35%]">Penjelasan Kegunaan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {filteredShortcuts.map(shortcut => (
                        <tr key={shortcut.action} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4 font-bold text-foreground">{shortcut.action}</td>
                          <td className="p-4">
                            <kbd className="px-2.5 py-1 rounded-lg border border-border/60 bg-muted/60 font-mono text-[10px] font-bold text-foreground shadow-sm">
                              {shortcut.keyWin}
                            </kbd>
                          </td>
                          <td className="p-4">
                            <kbd className="px-2.5 py-1 rounded-lg border border-border/60 bg-muted/60 font-mono text-[10px] font-bold text-foreground shadow-sm">
                              {shortcut.keyMac}
                            </kbd>
                          </td>
                          <td className="p-4 text-muted-foreground leading-relaxed">{shortcut.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

      </main>

      {/* Image Preview Lightbox Modal */}
      <Dialog open={!!previewImageUrl} onOpenChange={(open) => !open && setPreviewImageUrl(null)}>
        <DialogContent className="sm:max-w-5xl w-[95vw] border-none bg-black/95 backdrop-blur-md p-0 overflow-hidden shadow-2xl rounded-2xl flex flex-col items-center justify-center">
          {previewImageUrl && (
            <div className="relative w-full h-[80vh] flex items-center justify-center p-4">
              <button 
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/80 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-50"
                title="Tutup Preview"
              >
                <X className="h-5 w-5" />
              </button>
              <img 
                src={previewImageUrl} 
                alt="Pratinjau Resolusi Penuh" 
                className="max-w-full max-h-full object-contain rounded-lg border border-white/5 select-none"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
