"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { edicao, dataCurta, encerramentoVisivel } from "@/lib/config";

// Com prazo definido e liberado pela Comissão, conta até o fim das inscrições;
// senão, conta até o evento presencial (Pitch Final).
const prazo = encerramentoVisivel();
const pitch = edicao.datas.pitch_final;
const alvo = prazo
  ? { iso: `${prazo}T23:59:59-03:00`, titulo: "Encerramento das Inscrições" }
  : { iso: `${pitch.data}T${pitch.inicio}:00-03:00`, titulo: `Contagem para o ${edicao.rotulos.evento_final}` };

export function HeroCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    dias: number;
    horas: number;
    minutos: number;
    segundos: number;
  }>({ dias: 7, horas: 12, minutos: 40, segundos: 0 });

  useEffect(() => {
    const targetDate = new Date(alvo.iso).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
        return;
      }

      const dias = Math.floor(difference / (1000 * 60 * 60 * 24));
      const horas = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ dias, horas, minutos, segundos });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/40 border border-white/20 rounded-2xl p-5 sm:p-7 backdrop-blur-md shadow-2xl relative overflow-hidden group">
      {/* Linha decorativa no topo com as cores do ecohub */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--e1)] via-[var(--e3)] to-[var(--e6)]" />

      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--acento)] animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-white/90">
            {alvo.titulo}
          </span>
        </div>
        <Clock size={16} className="text-[var(--acento)]" />
      </div>

      {/* Grade do contador regressivo */}
      <div className="grid grid-cols-4 gap-2 text-center py-2">
        <div className="bg-white/10 rounded-xl p-2.5 sm:p-3 border border-white/10">
          <span className="text-2xl sm:text-4xl font-extrabold font-mono text-[var(--acento)] block">
            {String(timeLeft.dias).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase text-white/70">dias</span>
        </div>
        <div className="bg-white/10 rounded-xl p-2.5 sm:p-3 border border-white/10">
          <span className="text-2xl sm:text-4xl font-extrabold font-mono text-white block">
            {String(timeLeft.horas).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase text-white/70">horas</span>
        </div>
        <div className="bg-white/10 rounded-xl p-2.5 sm:p-3 border border-white/10">
          <span className="text-2xl sm:text-4xl font-extrabold font-mono text-white block">
            {String(timeLeft.minutos).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase text-white/70">min</span>
        </div>
        <div className="bg-white/10 rounded-xl p-2.5 sm:p-3 border border-white/10">
          <span className="text-2xl sm:text-4xl font-extrabold font-mono text-[var(--acao)] block">
            {String(timeLeft.segundos).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase text-white/70">seg</span>
        </div>
      </div>

      <p className="text-xs text-white/75 mt-4 leading-relaxed">
        {prazo ? (
          <>Inscrições até <strong>{dataCurta(prazo)} às 23h59</strong>. </>
        ) : (
          <>
            <strong>{dataCurta(pitch.data)} · {pitch.inicio.replace(":", "h")}</strong> · evento presencial.{" "}
          </>
        )}
        Presença registrada pelo QR Code libera o certificado de {edicao.certificado.horas} horas.
      </p>
    </div>
  );
}
