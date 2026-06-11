"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useAppStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { 
  Gamepad2, 
  RefreshCw, 
  ArrowLeft, 
  CheckCircle2, 
  Trophy, 
  Sparkles, 
  Clock, 
  Lightbulb,
  Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface WordInfo {
  id: number;
  direction: "across" | "down";
  number: number;
  word: string;
  clue: string;
  cells: [number, number][];
}

const WORDS: WordInfo[] = [
  {
    id: 1,
    direction: "across",
    number: 1,
    word: "VLOOKUP",
    clue: "Fungsi pencarian vertikal untuk mengambil data dari kolom tabel referensi.",
    cells: [[1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8]]
  },
  {
    id: 2,
    direction: "down",
    number: 2,
    word: "AVERAGE",
    clue: "Fungsi untuk menghitung nilai rata-rata dari sekelompok angka dalam sel.",
    cells: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2]]
  },
  {
    id: 3,
    direction: "down",
    number: 3,
    word: "PROPER",
    clue: "Mengubah huruf pertama dari setiap kata menjadi huruf besar (kapital).",
    cells: [[1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8]]
  },
  {
    id: 4,
    direction: "across",
    number: 4,
    word: "SHEET",
    clue: "Lembar kerja elektronik tempat data baris dan kolom disimpan.",
    cells: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]]
  },
  {
    id: 5,
    direction: "across",
    number: 5,
    word: "MATCH",
    clue: "Fungsi untuk mencari posisi indeks relatif suatu nilai di baris atau kolom.",
    cells: [[4, 1], [4, 2], [4, 3], [4, 4], [4, 5]]
  },
  {
    id: 6,
    direction: "down",
    number: 6,
    word: "COUNT",
    clue: "Fungsi untuk menghitung jumlah sel yang berisi nilai angka saja.",
    cells: [[4, 4], [5, 4], [6, 4], [7, 4], [8, 4]]
  },
  {
    id: 7,
    direction: "across",
    number: 7,
    word: "SUM",
    clue: "Fungsi paling dasar untuk menjumlahkan seluruh data angka dalam range.",
    cells: [[6, 3], [6, 4], [6, 5]]
  },
  {
    id: 8,
    direction: "across",
    number: 8,
    word: "TRIM",
    clue: "Fungsi untuk menghapus spasi ganda atau ekstra yang tidak diinginkan di teks.",
    cells: [[8, 4], [8, 5], [8, 6], [8, 7]]
  }
];

const ACTIVE_CELLS: Record<string, { correctLetter: string; number?: number }> = {
  "0,2": { correctLetter: "A", number: 2 },
  "1,2": { correctLetter: "V", number: 1 },
  "1,3": { correctLetter: "L" },
  "1,4": { correctLetter: "O" },
  "1,5": { correctLetter: "O" },
  "1,6": { correctLetter: "K" },
  "1,7": { correctLetter: "U" },
  "1,8": { correctLetter: "P", number: 3 },
  "2,0": { correctLetter: "S", number: 4 },
  "2,1": { correctLetter: "H" },
  "2,2": { correctLetter: "E" },
  "2,3": { correctLetter: "E" },
  "2,4": { correctLetter: "T" },
  "2,8": { correctLetter: "R" },
  "3,2": { correctLetter: "R" },
  "3,8": { correctLetter: "O" },
  "4,1": { correctLetter: "M", number: 5 },
  "4,2": { correctLetter: "A" },
  "4,3": { correctLetter: "T" },
  "4,4": { correctLetter: "C", number: 6 },
  "4,5": { correctLetter: "H" },
  "4,8": { correctLetter: "P" },
  "5,2": { correctLetter: "G" },
  "5,4": { correctLetter: "O" },
  "5,8": { correctLetter: "E" },
  "6,2": { correctLetter: "E" },
  "6,3": { correctLetter: "S", number: 7 },
  "6,4": { correctLetter: "U" },
  "6,5": { correctLetter: "M" },
  "6,8": { correctLetter: "R" },
  "7,4": { correctLetter: "N" },
  "8,4": { correctLetter: "T", number: 8 },
  "8,5": { correctLetter: "R" },
  "8,6": { correctLetter: "I" },
  "8,7": { correctLetter: "M" },
};

export default function TTSPage() {
  const { loadUserAndProgress, progress } = useAppStore();
  const [gridValues, setGridValues] = useState<string[][]>(
    Array(9).fill(null).map(() => Array(9).fill(""))
  );
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const [activeDirection, setActiveDirection] = useState<"across" | "down">("across");
  
  // Game state
  const [isValidated, setIsValidated] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [lockedCells, setLockedCells] = useState<Record<string, boolean>>({});

  const cellRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    loadUserAndProgress();
  }, [loadUserAndProgress]);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && !isGameFinished) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isGameFinished]);

  // Derived selectedWord using useMemo to avoid cascading render warnings
  const selectedWord = useMemo(() => {
    if (!focusedCell) return null;
    const matchedWords = WORDS.filter(w => 
      w.cells.some(([r, c]) => r === focusedCell.row && c === focusedCell.col)
    );
    if (matchedWords.length === 0) return null;
    
    const correctDirWord = matchedWords.find(w => w.direction === activeDirection);
    return correctDirWord || matchedWords[0];
  }, [focusedCell, activeDirection]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getCellKey = (r: number, c: number) => `${r},${c}`;

  // Handle click on a crossword grid cell
  const handleCellClick = (row: number, col: number) => {
    if (!ACTIVE_CELLS[getCellKey(row, col)]) return;

    const matches = WORDS.filter(w => w.cells.some(([r, c]) => r === row && c === col));

    if (focusedCell?.row === row && focusedCell?.col === col) {
      // Toggle direction if clicking the same cell again (and it has intersection)
      if (matches.length > 1) {
        setActiveDirection(prev => prev === "across" ? "down" : "across");
      }
    } else {
      setFocusedCell({ row, col });
      // If the clicked cell doesn't belong to the current activeDirection, auto-switch
      const hasWordInCurrentDir = matches.some(w => w.direction === activeDirection);
      if (!hasWordInCurrentDir && matches.length > 0) {
        setActiveDirection(matches[0].direction);
      }
    }
  };

  // Handle typing inside crossword cell
  const handleCellChange = (row: number, col: number, value: string) => {
    if (isGameFinished) return;

    const char = value.slice(-1).toUpperCase();
    if (char && !/[A-Z]/.test(char)) return; // Allow letters only

    const newValues = [...gridValues.map(r => [...r])];
    newValues[row][col] = char;
    setGridValues(newValues);
    setIsValidated(false);

    if (char !== "" && selectedWord) {
      // Move focus to next cell of active word
      const cellIndex = selectedWord.cells.findIndex(([r, c]) => r === row && c === col);
      if (cellIndex !== -1 && cellIndex < selectedWord.cells.length - 1) {
        const [nextRow, nextCol] = selectedWord.cells[cellIndex + 1];
        setFocusedCell({ row: nextRow, col: nextCol });
        cellRefs.current[getCellKey(nextRow, nextCol)]?.focus();
      }
    }
  };

  // Keyboard navigation (Backspace, arrows, etc.)
  const handleKeyDown = (row: number, col: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isGameFinished) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      const newValues = [...gridValues.map(r => [...r])];

      if (gridValues[row][col] !== "") {
        // Clear current cell first if it has a letter
        newValues[row][col] = "";
        setGridValues(newValues);
        setIsValidated(false);
      } else if (selectedWord) {
        // Move focus backward and clear previous cell
        const cellIndex = selectedWord.cells.findIndex(([r, c]) => r === row && c === col);
        if (cellIndex > 0) {
          const [prevRow, prevCol] = selectedWord.cells[cellIndex - 1];
          // Check if previous cell is locked (hint)
          if (!lockedCells[getCellKey(prevRow, prevCol)]) {
            newValues[prevRow][prevCol] = "";
            setGridValues(newValues);
          }
          setFocusedCell({ row: prevRow, col: prevCol });
          cellRefs.current[getCellKey(prevRow, prevCol)]?.focus();
          setIsValidated(false);
        }
      }
    } else if (e.key === "ArrowRight" && col < 8) {
      e.preventDefault();
      if (ACTIVE_CELLS[getCellKey(row, col + 1)]) {
        setFocusedCell({ row, col: col + 1 });
        cellRefs.current[getCellKey(row, col + 1)]?.focus();
        setActiveDirection("across");
      }
    } else if (e.key === "ArrowLeft" && col > 0) {
      e.preventDefault();
      if (ACTIVE_CELLS[getCellKey(row, col - 1)]) {
        setFocusedCell({ row, col: col - 1 });
        cellRefs.current[getCellKey(row, col - 1)]?.focus();
        setActiveDirection("across");
      }
    } else if (e.key === "ArrowDown" && row < 8) {
      e.preventDefault();
      if (ACTIVE_CELLS[getCellKey(row + 1, col)]) {
        setFocusedCell({ row: row + 1, col });
        cellRefs.current[getCellKey(row + 1, col)]?.focus();
        setActiveDirection("down");
      }
    } else if (e.key === "ArrowUp" && row > 0) {
      e.preventDefault();
      if (ACTIVE_CELLS[getCellKey(row - 1, col)]) {
        setFocusedCell({ row: row - 1, col });
        cellRefs.current[getCellKey(row - 1, col)]?.focus();
        setActiveDirection("down");
      }
    }
  };

  // Clue click handler: focus the word's first cell
  const handleClueClick = (word: WordInfo) => {
    const [firstRow, firstCol] = word.cells[0];
    setFocusedCell({ row: firstRow, col: firstCol });
    setActiveDirection(word.direction);
    cellRefs.current[getCellKey(firstRow, firstCol)]?.focus();
  };

  // Check answers validation logic
  const handleCheckAnswers = async () => {
    setIsValidated(true);
    let allCorrect = true;

    // Check if every active cell matches its target correct letter
    for (const key in ACTIVE_CELLS) {
      const [rStr, cStr] = key.split(",");
      const r = parseInt(rStr);
      const c = parseInt(cStr);
      if (gridValues[r][c].toUpperCase() !== ACTIVE_CELLS[key].correctLetter) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setIsGameFinished(true);
      setTimerActive(false);
      
      // Award Confetti
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#10b981", "#3b82f6", "#f59e0b", "#ffffff"]
        });
      });

      // Synchronize/Update Supabase student progress steps completed
      if (progress) {
        try {
          const gameId = "tts-excel";
          const currentCompleted = progress.completed_steps || [];
          if (!currentCompleted.includes(gameId)) {
            const completed_steps = [...currentCompleted, gameId];
            const now = new Date();
            await supabase
              .from("user_progress")
              .update({
                completed_steps,
                last_active_at: now.toISOString(),
              })
              .eq("user_id", progress.user_id);
          }
        } catch (err) {
          console.error("Gagal menyinkronkan progres game TTS ke database:", err);
        }
      }
    }
  };

  // Reset entire crossword board
  const handleResetBoard = () => {
    if (window.confirm("Apakah Anda yakin ingin mengulang dari awal? Seluruh jawaban Anda akan terhapus.")) {
      setGridValues(Array(9).fill(null).map(() => Array(9).fill("")));
      setLockedCells({});
      setFocusedCell(null);
      setIsValidated(false);
      setIsGameFinished(false);
      setHintsUsed(0);
      setElapsedTime(0);
      setTimerActive(true);
    }
  };

  // Help Hint revealing focused cell letter
  const handleUseHint = () => {
    if (!focusedCell || isGameFinished) return;
    
    const key = getCellKey(focusedCell.row, focusedCell.col);
    const correctLetter = ACTIVE_CELLS[key]?.correctLetter;
    
    if (!correctLetter) return;

    const newValues = [...gridValues.map(r => [...r])];
    newValues[focusedCell.row][focusedCell.col] = correctLetter;
    setGridValues(newValues);
    
    // Lock cell so it cannot be cleared
    setLockedCells(prev => ({
      ...prev,
      [key]: true
    }));

    setHintsUsed(prev => prev + 1);
    setIsValidated(false);

    // Auto focus next cell if available
    if (selectedWord) {
      const cellIndex = selectedWord.cells.findIndex(([r, c]) => r === focusedCell.row && c === focusedCell.col);
      if (cellIndex !== -1 && cellIndex < selectedWord.cells.length - 1) {
        const [nextRow, nextCol] = selectedWord.cells[cellIndex + 1];
        setFocusedCell({ row: nextRow, col: nextCol });
        cellRefs.current[getCellKey(nextRow, nextCol)]?.focus();
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Background radial overlays */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-teal-500/5 blur-[130px] pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 relative z-10 space-y-8">
        
        {/* Breadcrumb / Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1 select-none">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4 animate-bounce" /> Arena Rekreasi Belajar
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              Teka-Teki Silang (TTS) Excel
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Uji pengetahuan dan wawasan Anda mengenai fungsi, rumus, dan konsep dasar Microsoft Excel dalam teka-teki silang interaktif.
            </p>
          </div>

          <Link href="/belajar">
            <Button variant="outline" className="h-9 gap-1.5 text-xs font-semibold border-border/80 hover:bg-accent/40 rounded-xl cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali Belajar
            </Button>
          </Link>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 select-none">
          <div className="bg-card/50 border border-border/50 rounded-2xl p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Waktu Berjalan</div>
              <div className="text-sm font-extrabold font-mono text-foreground">{formatTime(elapsedTime)}</div>
            </div>
          </div>

          <div className="bg-card/50 border border-border/50 rounded-2xl p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Lightbulb className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Bantuan Dipakai</div>
              <div className="text-sm font-extrabold text-foreground">{hintsUsed} kali</div>
            </div>
          </div>

          <div className="bg-card/50 border border-border/50 rounded-2xl p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Trophy className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Reward Selesai</div>
              <div className="text-sm font-extrabold text-foreground text-blue-400">+100 XP</div>
            </div>
          </div>

          <div className="bg-card/50 border border-border/50 rounded-2xl p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Unlock className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Status Sinkron</div>
              <div className="text-[11px] font-bold text-emerald-400">Tersambung</div>
            </div>
          </div>
        </div>

        {/* Puzzle Board & Clues Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: The Crossword Grid */}
          <div className="lg:col-span-7 flex flex-col items-center space-y-4">
            
            {/* Grid Container */}
            <div className="bg-card/65 border border-border/60 rounded-3xl p-5 md:p-8 flex items-center justify-center w-full shadow-lg shadow-emerald-500/5 relative">
              <div className="grid grid-cols-9 gap-1.5 max-w-[420px] w-full aspect-square font-mono">
                {Array(9).fill(null).map((_, rIdx) => 
                  Array(9).fill(null).map((_, cIdx) => {
                    const cellKey = getCellKey(rIdx, cIdx);
                    const cellMeta = ACTIVE_CELLS[cellKey];
                    const isCellActive = !!cellMeta;
                    const value = gridValues[rIdx][cIdx];
                    const isCellFocused = focusedCell?.row === rIdx && focusedCell?.col === cIdx;
                    
                    const isPartOfSelectedWord = selectedWord?.cells.some(
                      ([r, c]) => r === rIdx && c === cIdx
                    );

                    const isCellLocked = lockedCells[cellKey];
                    
                    let statusColor = "border-border/60 bg-muted/10";
                    if (isCellActive) {
                      statusColor = "border-border bg-card/90 hover:border-emerald-500/50 cursor-pointer";
                      if (isPartOfSelectedWord) {
                        statusColor = "border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-500/15";
                      }
                      if (isCellFocused) {
                        statusColor = "border-emerald-500 bg-emerald-500/20 ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-background z-20 scale-[1.01]";
                      }
                      if (isValidated && value !== "") {
                        if (value.toUpperCase() === cellMeta.correctLetter) {
                          statusColor = "border-emerald-500 bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/25";
                        } else {
                          statusColor = "border-rose-500 bg-rose-500/10 text-rose-500 animate-shake";
                        }
                      }
                      if (isCellLocked) {
                        statusColor = "border-amber-500/40 bg-amber-500/10 text-amber-500 font-bold dark:bg-amber-500/15";
                      }
                    }

                    return (
                      <div 
                        key={cellKey} 
                        onClick={() => isCellActive && handleCellClick(rIdx, cIdx)}
                        className={`border rounded-xl aspect-square flex items-center justify-center relative overflow-hidden transition-all duration-200 select-none ${statusColor}`}
                      >
                        {/* Clue Number (if exists) */}
                        {isCellActive && cellMeta.number && (
                          <span className="absolute top-1 left-1.5 text-[8px] md:text-[9px] font-bold text-muted-foreground/80 leading-none">
                            {cellMeta.number}
                          </span>
                        )}

                        {/* Letter Input */}
                        {isCellActive ? (
                          <input
                            ref={(el) => { cellRefs.current[cellKey] = el; }}
                            type="text"
                            maxLength={1}
                            value={value}
                            disabled={isCellLocked || isGameFinished}
                            onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(rIdx, cIdx, e)}
                            className="w-full h-full text-center bg-transparent border-none outline-none font-extrabold text-base sm:text-lg text-foreground focus:ring-0 uppercase pt-2"
                          />
                        ) : (
                          /* Black square */
                          <div className="absolute inset-0 bg-neutral-900/60 dark:bg-black/60 backdrop-blur-[1px]" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Board Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-[420px] select-none">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetBoard}
                disabled={isGameFinished}
                className="h-9 gap-1.5 text-xs font-semibold px-4 border-border/80 hover:bg-accent/40 rounded-xl cursor-pointer flex-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Board
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleUseHint}
                disabled={!focusedCell || isGameFinished || lockedCells[getCellKey(focusedCell.row, focusedCell.col)]}
                className="h-9 gap-1.5 text-xs font-semibold px-4 text-amber-500 border-amber-500/20 hover:bg-amber-500/10 rounded-xl cursor-pointer flex-1"
              >
                <Lightbulb className="w-3.5 h-3.5" /> Buka Huruf
              </Button>

              <Button
                size="sm"
                onClick={handleCheckAnswers}
                disabled={isGameFinished}
                className="h-9 gap-1.5 text-xs font-bold px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer flex-2 shadow-md hover:-translate-y-px active:translate-y-0 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Periksa Jawaban
              </Button>
            </div>
          </div>

          {/* RIGHT PANEL: Clues List & Selection Help */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Clue Panel */}
            <div className="bg-emerald-500/[0.03] border border-emerald-500/20 rounded-2xl p-4.5 select-none relative overflow-hidden">
              <div className="absolute top-[-30px] right-[-30px] w-20 h-20 rounded-full bg-emerald-500/5 blur-lg pointer-events-none" />
              <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 shrink-0" /> Petunjuk Terpilih
              </div>
              <AnimatePresence mode="wait">
                {selectedWord ? (
                  <motion.div 
                    key={selectedWord.id}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    className="space-y-1.5 mt-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                        {selectedWord.number} {selectedWord.direction === "across" ? "Mendatar" : "Menurun"}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground font-semibold">({selectedWord.word.length} Huruf)</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-relaxed leading-snug">
                      {selectedWord.clue}
                    </p>
                  </motion.div>
                ) : (
                  <div className="text-xs text-muted-foreground italic mt-2.5">
                    Silakan klik kotak kosong pada papan TTS di sebelah kiri untuk melihat petunjuk pengerjaan.
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Across Clues List */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">👉 Mendatar (Across)</h3>
              <div className="space-y-2">
                {WORDS.filter(w => w.direction === "across").map(word => {
                  const isWordActive = selectedWord?.id === word.id;
                  return (
                    <div 
                      key={word.id}
                      onClick={() => handleClueClick(word)}
                      className={`text-xs p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${
                        isWordActive 
                          ? "border-emerald-500/40 bg-emerald-500/5 shadow-inner" 
                          : "border-border/60 bg-card/65 hover:border-border hover:bg-card"
                      }`}
                    >
                      <div className={`h-6 w-6 rounded-lg font-bold flex items-center justify-center shrink-0 text-[10px] ${
                        isWordActive ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        {word.number}
                      </div>
                      <div className="space-y-1 leading-snug">
                        <p className={`font-semibold text-[11px] ${isWordActive ? "text-emerald-400 font-bold" : "text-foreground/80"}`}>
                          {word.clue}
                        </p>
                        <span className="text-[9px] font-mono text-muted-foreground/80">({word.word.length} huruf)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Down Clues List */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">👇 Menurun (Down)</h3>
              <div className="space-y-2">
                {WORDS.filter(w => w.direction === "down").map(word => {
                  const isWordActive = selectedWord?.id === word.id;
                  return (
                    <div 
                      key={word.id}
                      onClick={() => handleClueClick(word)}
                      className={`text-xs p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${
                        isWordActive 
                          ? "border-emerald-500/40 bg-emerald-500/5 shadow-inner" 
                          : "border-border/60 bg-card/65 hover:border-border hover:bg-card"
                      }`}
                    >
                      <div className={`h-6 w-6 rounded-lg font-bold flex items-center justify-center shrink-0 text-[10px] ${
                        isWordActive ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        {word.number}
                      </div>
                      <div className="space-y-1 leading-snug">
                        <p className={`font-semibold text-[11px] ${isWordActive ? "text-emerald-400 font-bold" : "text-foreground/80"}`}>
                          {word.clue}
                        </p>
                        <span className="text-[9px] font-mono text-muted-foreground/80">({word.word.length} huruf)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* GAME COMPLETED VICTORY DIALOG MODAL */}
      <Dialog open={isGameFinished} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md w-[90vw] border border-border/80 bg-background/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center">
          {/* Confetti decoration in bg */}
          <div className="absolute top-[-20px] right-[-20px] w-28 h-28 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
          <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />

          {/* Victory Icon Trophy */}
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner relative z-10 border border-emerald-500/20 animate-bounce">
            <Trophy className="h-9 w-9 text-emerald-400" />
          </div>

          <div className="space-y-2.5 mt-4 relative z-10 select-none">
            <h2 className="text-xl font-black text-foreground tracking-tight flex items-center justify-center gap-1.5">
              Selamat! TTS Selesai <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
            </h2>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Anda berhasil menyelesaikan teka-teki silang pengetahuan Excel ini dengan sempurna! Seluruh jawaban Anda benar.
            </p>
          </div>

          {/* Recap Summary statistics */}
          <div className="grid grid-cols-2 gap-3.5 py-4 w-full select-none">
            <div className="bg-muted/40 border border-border/40 rounded-xl p-3">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Waktu Penyelesaian</div>
              <div className="text-sm font-extrabold text-foreground font-mono">{formatTime(elapsedTime)}</div>
            </div>
            <div className="bg-muted/40 border border-border/40 rounded-xl p-3">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Jumlah Bantuan</div>
              <div className="text-sm font-extrabold text-foreground">{hintsUsed} kali</div>
            </div>
          </div>

          {/* Completion Action buttons */}
          <div className="flex items-center justify-center gap-3 w-full pt-2">
            <Link href="/belajar" className="flex-1">
              <Button
                type="button"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 w-full rounded-xl cursor-pointer"
              >
                Kembali ke Belajar
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Minimal stub for UI Dialog
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, children }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      {children}
    </div>
  );
}

function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`bg-card text-card-foreground border border-border ${className}`}>
      {children}
    </div>
  );
}
