"use client";

import { useState, useEffect } from "react";
import { edicao, site, dataCurta } from "@/lib/config";

export function HeroCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    dias: number;
    horas: number;
    minutos: number;
    segundos: number;
  }>({ dias: 7, horas: 12, minutos: 40, segundos: 0 });

  useEffect(() => {
    const targetDate = new Date(
      `${edicao.datas.inscricoes.encerramento}T${site.contagem.hora_encerramento}`
    ).getTime();

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

  const unidades = [
    { valor: timeLeft.dias, rotulo: "dias", destaque: true },
    { valor: timeLeft.horas, rotulo: "horas" },
    { valor: timeLeft.minutos, rotulo: "min" },
    { valor: timeLeft.segundos, rotulo: "seg" },
  ];

  const { datas, rotulos } = edicao;
  const marcos = [
    { data: dataCurta(datas.inscricoes.encerramento), rotulo: "Fim das inscrições" },
    { data: dataCurta(datas.oficina.data), rotulo: rotulos.oficina },
    { data: dataCurta(datas.avaliacao_classificatoria.data), rotulo: "Classificação" },
    { data: dataCurta(datas.pitch_final.data), rotulo: rotulos.evento_final },
  ];

  return (
    <div className="bg-white/[0.06] border border-white/15 rounded-3xl p-6 sm:p-7 backdrop-blur-md shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--e1)] via-[var(--e3)] to-[var(--e6)]" />

      <p className="text-sm font-semibold text-white/80 mb-4">{site.contagem.titulo}</p>

      <div className="grid grid-cols-4 gap-2 text-center">
        {unidades.map((u) => (
          <div key={u.rotulo}>
            <span
              className={`text-3xl sm:text-5xl font-black font-mono block tabular-nums ${
                u.destaque ? "text-[var(--acento)]" : "text-white"
              }`}
            >
              {String(u.valor).padStart(2, "0")}
            </span>
            <span className="text-xs text-white/60">{u.rotulo}</span>
          </div>
        ))}
      </div>

      {/* Linha do tempo compacta */}
      <ol className="mt-7 pt-6 border-t border-white/10 grid grid-cols-4 gap-1 text-center">
        {marcos.map((m, i) => (
          <li key={m.data} className="flex flex-col items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-[var(--acento)]" : "bg-white/30"}`} />
            <span className="text-sm font-bold text-white">{m.data}</span>
            <span className="text-[11px] leading-tight text-white/60">{m.rotulo}</span>
          </li>
        ))}
      </ol>

      <p className="text-[11px] text-white/45 mt-5 text-center">
        {site.contagem.rodape}
      </p>
    </div>
  );
}
