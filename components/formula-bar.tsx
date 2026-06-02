"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle } from "lucide-react";

export function FormulaBar() {
  const {
    getCurrentStep,
    isSuccess,
    isValidated,
    lastErrorHint,
    nextStep,
  } = useAppStore();

  const step = getCurrentStep();

  // If there's no result or validation alert to show, return null
  if (!isValidated && !isSuccess) return null;

  return (
    <div className="w-full">
      {/* Feedback area */}
      <div className="min-h-[36px]">
        {isValidated && !isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-rose-500/8 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs shadow-sm"
          >
            <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <p className="font-semibold">Rumus belum tepat.</p>
              <p className="opacity-80 leading-relaxed">{lastErrorHint}</p>
            </div>
          </motion.div>
        )}

        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-emerald-500/8 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>
                Rumus benar!{" "}
                {step.tasks && step.tasks.length > 0
                  ? "Semua sel berhasil diisi."
                  : <>Hasil: <strong>{step.expectedResult}</strong></>}
              </span>
            </div>
            <Button
              size="sm"
              onClick={nextStep}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 h-7 text-xs rounded-md font-semibold transition-all duration-200 shadow-sm shrink-0"
            >
              Lanjutkan
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

