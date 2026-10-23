"use client";

import { useState } from "react";
import { edicao } from "@/lib/config";
import { PlayCircle } from "lucide-react";

/** Extrai o ID de 11 caracteres de um link do YouTube */
function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

/** Converte para o endereço de incorporação otimizado */
function youtubeEmbed(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1&modestbranding=1`;
}

export function HeroVideo() {
  const video = edicao.videos?.destaque;
  const url = video?.url || "https://youtube.com/shorts/ICRkQAstx_c?feature=share";
  const videoId = getYouTubeId(url);
  const embed = videoId ? youtubeEmbed(videoId) : null;
  const titulo = video?.titulo || "Chamada Oficial · INOVA SAÚDE 2026";
  const [isLoaded, setIsLoaded] = useState(false);
  const thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;

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
      <div className="aspect-[9/16] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 shadow-lg border border-white/10 relative">
        {/* Poster Thumbnail para eliminar 100% tela preta */}
        {thumbnailUrl && (
          <div
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500 ${
              isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            style={{
              backgroundImage: `url(${thumbnailUrl})`,
              backgroundColor: "#061320",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          </div>
        )}

        {/* Indicador de carregamento suave */}
        {!isLoaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 pointer-events-none transition-opacity duration-300">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-[var(--acento)] animate-spin" />
            <span className="text-white text-xs font-mono font-medium mt-3 drop-shadow px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs">
              Carregando vídeo...
            </span>
          </div>
        )}

        {embed ? (
          <iframe
            src={embed}
            title={titulo}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full relative z-10 transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
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
