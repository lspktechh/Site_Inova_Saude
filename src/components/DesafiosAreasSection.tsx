"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Pill, Activity, Stethoscope, Microscope, Cpu, ArrowRight, Video, Sparkles, Play } from "lucide-react";
import { edicao } from "@/lib/config";

/** Extrai o ID de 11 caracteres de um link do YouTube */
function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

/** Converte para o endereço de incorporação com parâmetros de alta performance */
function youtubeEmbed(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1&modestbranding=1&enablejsapi=1`;
}

const ICONES: Record<string, any> = {
  Pill,
  Activity,
  Stethoscope,
  Microscope,
  Cpu,
};

interface VideoItem {
  titulo: string;
  url: string;
}

interface DesafioArea {
  id: string;
  area: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  icone: string;
  cor: string;
  url: string;
  videos?: VideoItem[];
}

interface VideoPlayerFrameProps {
  url: string;
  titulo: string;
  isAtivo: boolean;
  priority?: boolean;
}

function VideoPlayerFrame({ url, titulo, isAtivo, priority = false }: VideoPlayerFrameProps) {
  const videoId = getYouTubeId(url);
  const embed = videoId ? youtubeEmbed(videoId) : null;
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Thumbnail oficial do YouTube (carregamento instantâneo para eliminar 100% a tela preta)
  const thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;

  // Pausa automaticamente o vídeo se o usuário alternar para outra aba
  useEffect(() => {
    if (!isAtivo && iframeRef.current && isLoaded) {
      try {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
          "*"
        );
      } catch {
        // Fallback silencioso
      }
    }
  }, [isAtivo, isLoaded]);

  return (
    <div
      className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
        isAtivo ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
      }`}
    >
      {/* 1. Poster Thumbnail: renderizado no milissegundo 0 */}
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
          {/* Gradiente sutil para harmonização visual com a identidade do site */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45" />
        </div>
      )}

      {/* 2. Feedback de carregamento elegante enquanto o player inicializa */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 pointer-events-none transition-opacity duration-300">
          <div className="w-9 h-9 rounded-full border-2 border-white/20 border-t-[var(--acento)] animate-spin" />
          <span className="text-white text-[11px] font-mono font-semibold mt-2.5 drop-shadow-md px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs">
            Carregando vídeo...
          </span>
        </div>
      )}

      {/* 3. Iframe do YouTube */}
      {embed ? (
        <iframe
          ref={iframeRef}
          src={embed}
          title={titulo}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full relative z-10 transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading={priority ? "eager" : "lazy"}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-white bg-slate-900">
          <Video size={32} className="text-white/60 mb-2" />
          <span className="text-xs text-white/70">Vídeo explicativo</span>
        </div>
      )}
    </div>
  );
}

function DesafioAreaCard({ desafio }: { desafio: DesafioArea }) {
  const Icon = ICONES[desafio.icone] || Sparkles;
  const cor = desafio.cor || "var(--marca)";
  const temMultiplosVideos = desafio.videos && desafio.videos.length > 1;
  const [videoAtivoIndex, setVideoAtivoIndex] = useState(0);

  return (
    <div
      className="health-card p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group border border-[var(--borda)] hover:border-[var(--marca-2)] transition-all duration-300"
      style={{ borderTop: `4px solid ${cor}` }}
    >
      {/* Topo do card: Ícone + Tags + Título */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 shrink-0"
            style={{ backgroundColor: cor }}
          >
            <Icon size={22} />
          </div>
          <span
            className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider truncate"
            style={{
              backgroundColor: `color-mix(in srgb, ${cor} 12%, transparent)`,
              color: cor,
            }}
          >
            Curso de {desafio.area}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[var(--fg)] leading-snug group-hover:text-[var(--marca)] transition-colors">
            {desafio.titulo}
          </h3>
          <p className="text-xs font-semibold text-[var(--fg-2)] mt-0.5">
            {desafio.subtitulo}
          </p>
        </div>

        {/* Seletor de vídeos se houver mais de um (ex: Enfermagem) */}
        {temMultiplosVideos && (
          <div className="flex items-center gap-1.5 p-1 bg-[var(--surf-2)] rounded-xl border border-[var(--borda)]">
            {desafio.videos!.map((vid, idx) => {
              const ativo = videoAtivoIndex === idx;
              return (
                <button
                  key={vid.url}
                  type="button"
                  onClick={() => setVideoAtivoIndex(idx)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    ativo
                      ? "bg-[var(--surf)] text-[var(--fg)] shadow-xs border border-[var(--borda)]"
                      : "text-[var(--fg-2)] hover:text-[var(--fg)] hover:bg-[var(--surf)]/50"
                  }`}
                  style={ativo ? { color: cor } : {}}
                >
                  <Play size={11} className={ativo ? "fill-current" : ""} />
                  <span>{vid.titulo || `Vídeo ${idx + 1}`}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Player Vertical Responsivo no formato Short (9:16) com Pré-carregamento e Capa Instantânea */}
        <div className="py-1">
          <div className="aspect-[9/16] w-full max-w-[260px] sm:max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-slate-950 shadow-lg border border-[var(--borda)] relative">
            {temMultiplosVideos ? (
              desafio.videos!.map((vid, idx) => (
                <VideoPlayerFrame
                  key={vid.url}
                  url={vid.url}
                  titulo={`${desafio.titulo} (${vid.titulo || `Vídeo ${idx + 1}`}) · INOVA SAÚDE 2026`}
                  isAtivo={videoAtivoIndex === idx}
                  priority={true}
                />
              ))
            ) : (
              <VideoPlayerFrame
                url={desafio.url}
                titulo={`${desafio.titulo} · INOVA SAÚDE 2026`}
                isAtivo={true}
                priority={false}
              />
            )}
          </div>
        </div>

        <p className="text-xs text-[var(--fg-2)] leading-relaxed">
          {desafio.descricao}
        </p>
      </div>

      {/* Rodapé do card: Botão CTA para Inscrição */}
      <div className="pt-5 mt-4 border-t border-[var(--borda)]">
        <Link
          href="/inscricao"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold transition-all text-center shadow-xs active:scale-95"
          style={{
            backgroundColor: `color-mix(in srgb, ${cor} 14%, var(--surf))`,
            color: cor,
            border: `1px solid color-mix(in srgb, ${cor} 30%, transparent)`,
          }}
        >
          <span>Inscrever Solução nesta Área</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export function DesafiosAreasSection() {
  const areas = ((edicao as any).desafios_areas || []) as DesafioArea[];
  if (areas.length === 0) return null;

  return (
    <section id="desafios-areas" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      {/* ──── CABEÇALHO DA SEÇÃO ──── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--marca)]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--fg-2)] font-bold flex items-center gap-1.5">
            <Video size={14} className="text-[var(--marca)]" />
            <span>Vídeos dos Cursos da Faculdade</span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--fg)]">
          Desafios por Área da Faculdade
        </h2>
        <p className="text-sm sm:text-base text-[var(--fg-2)] max-w-3xl leading-relaxed">
          Professores e profissionais de <strong>Farmácia</strong>, <strong>Fisioterapia</strong>, <strong>Enfermagem</strong>, <strong>Biomedicina</strong> e <strong>Computação</strong> gravaram
          vídeos rápidos explicando dores e necessidades reais de cada campo assistencial e tecnológico. Assista aos vídeos e
          inspire o projeto da sua equipe!
        </p>
      </div>

      {/* ──── GRADE RESPONSIVA DOS DESAFIOS (1 col no mobile, 2 em tablet, 3 em desktop) ──── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {areas.map((desafio) => (
          <DesafioAreaCard key={desafio.id} desafio={desafio} />
        ))}
      </div>
    </section>
  );
}
