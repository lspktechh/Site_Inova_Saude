"use client";

import { Check, Save } from "lucide-react";

interface StepProgressNavProps {
  currentStep: number;
  availableSteps: number[];
  onSelectStep: (step: number) => void;
  draftSaved: boolean;
}

const STEP_TITLES: Record<number, string> = {
  0: "Trilha",
  1: "Identificação",
  2: "Competências",
  3: "Empatizar",
  4: "Definir",
  5: "Idear",
  6: "Escopo",
  7: "Fechamento",
  8: "Protótipo",
  9: "Credenciamento",
};

export function StepProgressNav({
  currentStep,
  availableSteps,
  onSelectStep,
  draftSaved,
}: StepProgressNavProps) {
  const currentIndex = availableSteps.indexOf(currentStep);
  const totalSteps = availableSteps.length;
  const progressPercent = Math.round((currentIndex / (totalSteps - 1)) * 100);

  return (
    <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Top Header: Step Counter & Auto-save status */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[var(--marca)]/10 text-[var(--marca)]">
            Passo {currentIndex + 1} de {totalSteps}
          </span>
          <span className="font-bold text-[var(--fg)] hidden sm:inline">
            · {STEP_TITLES[currentStep] || "Etapa"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--ok)] font-medium">
          <Save size={13} className={draftSaved ? "" : "animate-spin"} />
          <span>{draftSaved ? "Rascunho salvo" : "Salvando..."}</span>
        </div>
      </div>

      {/* Progress Bar com gradiente suave */}
      <div className="relative w-full bg-[var(--surf-2)] h-2.5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--marca)] via-[var(--marca-2)] to-[var(--acao)] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stepper horizontal rolável no mobile */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
        {availableSteps.map((step, idx) => {
          const isCurrent = step === currentStep;
          const isCompleted = idx < currentIndex;
          const isPending = idx > currentIndex;

          return (
            <button
              key={step}
              type="button"
              disabled={isPending}
              onClick={() => onSelectStep(step)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all cursor-pointer disabled:cursor-not-allowed ${
                isCurrent
                  ? "bg-[var(--marca)] text-white font-bold shadow-xs scale-102"
                  : isCompleted
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-[var(--surf-2)] text-[var(--fg-2)] opacity-60"
              }`}
            >
              {isCompleted ? (
                <Check size={12} className="stroke-[3]" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
              )}
              <span className="font-sans font-medium whitespace-nowrap">
                {STEP_TITLES[step] || `Passo ${idx + 1}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
