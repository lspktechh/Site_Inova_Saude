"use client";

import { edicao } from "@/lib/config";
import { PlayCircle } from "lucide-react";

/** Converte links do YouTube (watch, shorts, embed, youtu.be) para o endereço de incorporação */
function youtubeEmbed(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : null;
}

export function HeroVideo() {
  const video = edicao.videos?.destaque;
  const url = video?.url || "https://youtube.com/shorts/ICRkQAstx_c?feature=share";
  const embed = youtubeEmbed(url);
  const titulo = video?.titulo || "Chamada Oficial · INOVA SAÚDE 2026";

  return (
    <div className="bg-black/40 border border-white/20 rounded-2xl sm:rounded-3xl p-3 sm:p-4 backdrop-blur-md shadow-2xl relative overflow-hidden group max-w-[320px] sm:max-w-[340px] mx-auto w-full">
      {/* Linha decorativa no topo com o espectro ecohub */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--e1)] via-[var(--e3)] to-[var(--e6)]" />

      {/* Topo do card com badge e pulso */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1 pt-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--acento)] animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-white/90">
            Chamada Oficial
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15 flex items-center gap-1">
          <PlayCircle size={12} className="text-[var(--acento)]" />
          <span>Vídeo</span>
        </span>
      </div>

      {/* Moldura vertical 9:16 do vídeo em destaque */}
      <div className="aspect-[9/16] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-lg border border-white/10 relative">
        {embed ? (
          <iframe
            src={embed}
            title={titulo}
            className="w-full h-full"
            loading="eager"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-950">
            <PlayCircle size={36} className="text-[var(--acento)] mb-2" />
            <span className="text-xs text-white/70">Vídeo em carregamento</span>
          </div>
        )}
      </div>

      {/* Legenda curta */}
      <p className="text-xs text-white/75 mt-3 text-center leading-relaxed px-1">
        Assista e entenda como transformar sua dor de saúde em projeto até o Demoday.
      </p>
    </div>
  );
}
