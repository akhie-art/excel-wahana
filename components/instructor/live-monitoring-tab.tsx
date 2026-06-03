"use client";

import { useAppStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getColLetter } from "./utils";
import { cn } from "@/lib/utils";
import { Radio, AlertTriangle, Activity, ScreenShare } from "lucide-react";

interface LiveMonitoringTabProps {
  onSpectate: (id: string) => void;
}

export function LiveMonitoringTab({ onSpectate }: LiveMonitoringTabProps) {
  const { peerStates, modules, students } = useAppStore(
    useShallow((state) => ({
      peerStates: state.peerStates,
      modules: state.modules,
      students: state.students,
    }))
  );

  const onlineStudents = Object.entries(peerStates)
    .filter(([_, peer]) => peer && peer.role === "peserta")
    .map(([clientId, peer]) => ({ clientId, ...peer }));

  const onlineStudentsCount = onlineStudents.length;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border/40 gap-4 select-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Radio className="h-5 w-5 text-rose-500 animate-pulse" />
              Pemantauan Kelas Live
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 inline-block animate-pulse"></span>
              {onlineStudentsCount} Online
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Pantau layar pengerjaan rumus Excel peserta didik secara real-time langsung dari browser Anda.
          </p>
        </div>
      </div>

      {/* RLS Policy / Sync Warning Alert */}
      {onlineStudentsCount > 0 && students.length === 0 && (
        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 text-xs space-y-1.5 animate-in fade-in duration-200">
          <p className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
            Akses Database Terhambat (RLS Policy)
          </p>
          <p className="leading-relaxed font-sans">
            Peserta terdeteksi aktif online, tetapi data tidak tampil pada tabel progres. Ini terjadi karena <strong>Row Level Security (RLS) Policy</strong> pada database Supabase Anda membatasi akses baca bagi akun Instruktur.
          </p>
          <p className="font-semibold font-sans">
            Silakan jalankan script SQL migrasi di Supabase SQL Editor Anda untuk membukanya secara instan.
          </p>
        </div>
      )}

      {/* Grid of online student cards */}
      {onlineStudentsCount > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {onlineStudents.map((peer) => {
            const peerStep = modules.flatMap((m) => m.steps).find((s) => s.id === peer.stepId);
            return (
              <Card 
                key={peer.clientId} 
                className="border border-rose-500/15 bg-card/50 backdrop-blur-md shadow-sm hover:shadow-md hover:border-rose-500/35 hover:bg-card/85 transition-all duration-300 rounded-2xl relative overflow-hidden group"
              >
                {/* Subtle light effect inside the card */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/10 transition-colors duration-300" />
                
                <CardHeader className="pb-3 pt-4.5 px-5">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-extrabold tracking-tight text-foreground truncate max-w-[150px]">
                      {peer.name}
                    </CardTitle>
                    
                    {/* Glowing Live Badge */}
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1.5 select-none tracking-wider uppercase font-mono">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                      </span>
                      Aktif
                    </span>
                  </div>
                  <CardDescription className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 mt-1 select-none">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45 shrink-0" />
                    <span className="truncate">
                      {peerStep ? `Tugas: ${peerStep.title}` : `Membaca pengantar modul`}
                    </span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-4 px-5 text-xs space-y-3 font-mono">
                  {/* Position coordinates formatted like excel sheet indicators */}
                  <div className="flex justify-between items-center text-muted-foreground select-none">
                    <span className="text-[11px] font-medium font-sans">Posisi Sel:</span>
                    <span className="font-bold text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded font-mono shadow-2xs">
                      {peer.activeCell ? `${getColLetter(peer.activeCell.col)}${peer.activeCell.row + 1}` : "-"}
                    </span>
                  </div>
                  
                  {/* Formula mini bar */}
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-[10px] font-medium font-sans select-none">Formula diketik:</span>
                    <div className="relative flex items-center bg-muted/40 dark:bg-muted/10 border border-border/50 rounded-xl px-3 py-2 shadow-inner group-hover:bg-muted/65 transition-colors">
                      <span className="font-mono text-xs font-bold text-muted-foreground/60 mr-2.5 select-none">fₓ</span>
                      <code className="block text-[11px] font-bold truncate max-w-full text-rose-600 dark:text-rose-400 font-mono tracking-tight">
                        {peer.formulaInput || "(belum ada input)"}
                      </code>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pb-4.5 pt-0 px-5">
                  <Button
                    size="sm"
                    onClick={() => onSpectate(peer.clientId)}
                    className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-[10px] py-2 shadow-xs hover:shadow-md hover:shadow-rose-500/15 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 group-hover:scale-[1.01]"
                  >
                    <ScreenShare className="h-3.5 w-3.5" />
                    Pantau Layar Live
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State with pulsing eye/radar animation */
        <Card className="border border-dashed border-border/80 bg-card/10 rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-5 shadow-2xs select-none">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 animate-ping duration-1000"></div>
            <div className="relative h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Kelas Sedang Hening</h3>
            <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
              Belum ada peserta yang aktif online di dalam latihan saat ini. Sistem akan otomatis memunculkan layar pengerjaan mereka di sini begitu mereka mulai mengetik rumus.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
