"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Pill,
  Activity,
  Stethoscope,
  Microscope,
  Cpu,
  ArrowRight,
  Video,
  Sparkles,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

interface DesafioAreaConfig {
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

interface CarouselItem {
  id: string;
  areaId: string;
  area: string;
  videoBadge: string;
  videoLabel?: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  icone: string;
  cor: string;
  url: string;
  videoId: string;
  thumbnailUrl: string;
}

interface VideoPlayerFrameProps {
  url: string;
  titulo: string;
  isAtivo: boolean;
}

function VideoPlayerFrame({ url, titulo, isAtivo }: VideoPlayerFrameProps) {
  const videoId = getYouTubeId(url);
  const embed = videoId ? youtubeEmbed(videoId) : null;
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Thumbnail oficial do YouTube (carregamento instantâneo no milissegundo zero)
  const thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;

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
    <div className="absolute inset-0 w-full h-full bg-slate-950">
      {/* 1. Poster Thumbnail oficial instantâneo */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
        </div>
      )}

      {/* 2. Feedback de carregamento suave */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 pointer-events-none transition-opacity duration-300">
          <div className="w-9 h-9 rounded-full border-2 border-white/20 border-t-[var(--acento)] animate-spin" />
          <span className="text-white text-[11px] font-mono font-semibold mt-2.5 drop-shadow px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs">
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
          loading="eager"
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

/** Calcula o offset relativo no carrossel circular (-2, -1, 0, 1, 2) */
function getOffset(index: number, activeIndex: number, total: number) {
  let diff = (index - activeIndex) % total;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

/** Retorna o estilo de transformação 3D de acordo com a posição relativa do card */
function getCardStyle(offset: number, isMobile: boolean, cor: string): React.CSSProperties {
  // Centro: em exibição, colorido, foco total
  if (offset === 0) {
    return {
      transform: "translate3d(-50%, -50%, 0) scale(1)",
      zIndex: 30,
      opacity: 1,
      filter: "none",
      boxShadow: `0 20px 45px -15px rgba(0,0,0,0.85), 0 0 35px -5px ${cor}70`,
      border: `2px solid ${cor}`,
      pointerEvents: "auto",
    };
  }

  // Laterais imediatas (offset = -1 ou +1): acinzentados, escala 0.85, zIndex 20
  if (Math.abs(offset) === 1) {
    const xPct = isMobile ? (offset < 0 ? -52 : 52) : offset < 0 ? -70 : 70;
    return {
      transform: `translate3d(calc(-50% + ${xPct}%), -50%, 0) scale(${isMobile ? 0.86 : 0.85})`,
      zIndex: 20,
      opacity: 0.72,
      filter: "grayscale(100%) brightness(0.75) contrast(0.9)",
      boxShadow: "0 10px 25px -10px rgba(0,0,0,0.6)",
      border: "1px solid rgba(255,255,255,0.12)",
      pointerEvents: "auto",
    };
  }

  // Laterais externas (offset = -2 ou +2): acinzentados mais distantes, escala 0.70, zIndex 10
  if (Math.abs(offset) === 2) {
    const xPct = isMobile ? (offset < 0 ? -96 : 96) : offset < 0 ? -135 : 135;
    return {
      transform: `translate3d(calc(-50% + ${xPct}%), -50%, 0) scale(${isMobile ? 0.72 : 0.7})`,
      zIndex: 10,
      opacity: 0.4,
      filter: "grayscale(100%) brightness(0.55) contrast(0.8)",
      boxShadow: "0 5px 15px -8px rgba(0,0,0,0.5)",
      border: "1px solid rgba(255,255,255,0.08)",
      pointerEvents: "auto",
    };
  }

  // Qualquer outro: oculto fora do palco
  return {
    transform: `translate3d(calc(-50% + ${offset < 0 ? -200 : 200}%), -50%, 0) scale(0.5)`,
    zIndex: 0,
    opacity: 0,
    pointerEvents: "none",
  };
}

export function DesafiosAreasSection() {
  const rawAreas = ((edicao as any).desafios_areas || []) as DesafioAreaConfig[];

  // Achata a lista de desafios em itens sequenciais do carrossel.
  // Quando uma categoria tem mais de um vídeo (ex: Enfermagem), eles ficam estritamente em sequência!
  const carouselItems: CarouselItem[] = [];
  rawAreas.forEach((desafio) => {
    if (desafio.videos && desafio.videos.length > 0) {
      desafio.videos.forEach((vid, vidIdx) => {
        const vidId = getYouTubeId(vid.url) || "";
        carouselItems.push({
          id: `${desafio.id}-${vidIdx + 1}`,
          areaId: desafio.id,
          area: desafio.area,
          videoBadge: `${desafio.area} · ${vid.titulo || `Vídeo ${vidIdx + 1}`}`,
          videoLabel: vid.titulo || `Vídeo ${vidIdx + 1}`,
          titulo: `${desafio.titulo} (${vid.titulo || `Vídeo ${vidIdx + 1}`})`,
          subtitulo: desafio.subtitulo,
          descricao: desafio.descricao,
          icone: desafio.icone,
          cor: desafio.cor || "var(--marca)",
          url: vid.url,
          videoId: vidId,
          thumbnailUrl: vidId ? `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg` : "",
        });
      });
    } else {
      const vidId = getYouTubeId(desafio.url) || "";
      carouselItems.push({
        id: desafio.id,
        areaId: desafio.id,
        area: desafio.area,
        videoBadge: desafio.area,
        titulo: desafio.titulo,
        subtitulo: desafio.subtitulo,
        descricao: desafio.descricao,
        icone: desafio.icone,
        cor: desafio.cor || "var(--marca)",
        url: desafio.url,
        videoId: vidId,
        thumbnailUrl: vidId ? `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg` : "",
      });
    }
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detecção de tamanho de tela para ajuste refinado de perspectiva
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = carouselItems.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  // Suporte a gestos de arrasto (swipe) no mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (carouselItems.length === 0) return null;

  const activeItem = carouselItems[activeIndex];
  const ActiveIcon = ICONES[activeItem.icone] || Sparkles;

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
          Professores e profissionais de <strong>Farmácia</strong>, <strong>Fisioterapia</strong>,{" "}
          <strong>Enfermagem</strong>, <strong>Biomedicina</strong> e <strong>Computação</strong> gravaram
          vídeos rápidos explicando dores e necessidades reais de cada campo assistencial e tecnológico. Assista aos vídeos e
          inspire o projeto da sua equipe!
        </p>
      </div>

      {/* ──── SELETOR RÁPIDO DE ÁREAS (PILLS SUPERIORES) ──── */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-1">
        {carouselItems.map((item, idx) => {
          const isSelected = activeIndex === idx;
          const ItemIcon = ICONES[item.icone] || Sparkles;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? "text-white shadow-md scale-105"
                  : "bg-[var(--surf)] text-[var(--fg-2)] border-[var(--borda)] hover:border-[var(--fg-2)]/30 hover:text-[var(--fg)]"
              }`}
              style={
                isSelected
                  ? { backgroundColor: item.cor, borderColor: item.cor }
                  : {}
              }
            >
              <ItemIcon size={13} />
              <span>{item.videoBadge}</span>
            </button>
          );
        })}
      </div>

      {/* ──── PALCO DO CARROSSEL 3D COVERFLOW (1 EM EXIBIÇÃO + 4 ACINZENTADOS) ──── */}
      <div
        className="relative w-full h-[430px] sm:h-[510px] md:h-[540px] flex items-center justify-center overflow-x-clip select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Setas de navegação flutuantes */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Vídeo anterior"
          className="absolute left-1 sm:left-3 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/65 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Próximo vídeo"
          className="absolute right-1 sm:right-3 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/65 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>

        {/* Renderização de todos os cards no palco */}
        {carouselItems.map((item, idx) => {
          const offset = getOffset(idx, activeIndex, total);
          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 2;
          const cardStyle = getCardStyle(offset, isMobile, item.cor);
          const ItemIcon = ICONES[item.icone] || Sparkles;

          if (!isVisible) {
            return (
              <div
                key={item.id}
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none transition-all duration-500 ease-out"
                style={cardStyle}
              />
            );
          }

          return (
            <div
              key={item.id}
              onClick={() => {
                if (!isCenter) setActiveIndex(idx);
              }}
              role="button"
              tabIndex={isCenter ? -1 : 0}
              aria-label={isCenter ? item.titulo : `Ver vídeo do ${item.titulo}`}
              className={`absolute left-1/2 top-1/2 aspect-[9/16] w-[215px] sm:w-[270px] md:w-[290px] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 ease-out select-none ${
                isCenter ? "cursor-default" : "cursor-pointer group hover:brightness-95"
              }`}
              style={cardStyle}
            >
              {isCenter ? (
                /* Card Central: Player Interativo com Poster Instantâneo */
                <div className="relative w-full h-full bg-slate-950">
                  {/* Badge de identificação da área ativa */}
                  <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between gap-1 pointer-events-none">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold text-white shadow-md backdrop-blur-md"
                      style={{ backgroundColor: item.cor }}
                    >
                      <ItemIcon size={12} />
                      <span className="truncate">{item.videoBadge}</span>
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--acento)] animate-pulse" />
                  </div>

                  {/* Player de Vídeo */}
                  <VideoPlayerFrame
                    url={item.url}
                    titulo={`${item.titulo} · INOVA SAÚDE 2026`}
                    isAtivo={true}
                  />
                </div>
              ) : (
                /* Cards Laterais Acinzentados (2 de cada lado) */
                <div className="relative w-full h-full bg-slate-950 overflow-hidden">
                  {/* Thumbnail de Alta Resolução em Grayscale */}
                  {item.thumbnailUrl && (
                    <div
                      className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${item.thumbnailUrl})`,
                        backgroundColor: "#061320",
                      }}
                    />
                  )}

                  {/* Vinheta escura para dar profundidade e contraste */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

                  {/* Topo do card lateral: Badge do curso */}
                  <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white/90 bg-white/20 backdrop-blur-xs">
                      <ItemIcon size={11} />
                      <span className="truncate">{item.area}</span>
                    </span>
                    {item.videoLabel && (
                      <span className="text-[10px] font-mono text-white/70 bg-black/40 px-1.5 py-0.5 rounded">
                        {item.videoLabel}
                      </span>
                    )}
                  </div>

                  {/* Centro do card lateral: Botão Play com indicação de clique */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center z-10">
                    <div className="w-12 h-12 rounded-full bg-black/70 border border-white/30 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                      <Play size={20} className="fill-white ml-0.5" />
                    </div>
                    <span className="text-white text-[11px] font-mono font-bold mt-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                      Clique para ver
                    </span>
                  </div>

                  {/* Rodapé do card lateral: Título resumido */}
                  <div className="absolute bottom-3 inset-x-3 z-10">
                    <p className="text-white/90 text-xs font-bold truncate drop-shadow">
                      {item.titulo}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ──── PAINEL DETALHADO DO DESAFIO EM EXIBIÇÃO ──── */}
      <div className="health-card p-6 sm:p-8 max-w-3xl mx-auto space-y-5 border border-[var(--borda)] shadow-lg transition-all duration-300">
        {/* Cabeçalho do Painel: Ícone + Área + Título + Navegação */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--borda)] pb-5">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 transition-transform hover:scale-105"
              style={{ backgroundColor: activeItem.cor }}
            >
              <ActiveIcon size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${activeItem.cor} 15%, transparent)`,
                    color: activeItem.cor,
                  }}
                >
                  Curso de {activeItem.area} {activeItem.videoLabel ? `· ${activeItem.videoLabel}` : ""}
                </span>
                <span className="font-mono text-xs text-[var(--fg-2)] font-semibold">
                  {activeIndex + 1} de {total}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[var(--fg)] mt-1 leading-snug">
                {activeItem.titulo}
              </h3>
            </div>
          </div>

          {/* Botões de navegação rápida Anterior / Próximo */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Vídeo anterior"
              className="w-10 h-10 rounded-xl bg-[var(--surf-2)] border border-[var(--borda)] text-[var(--fg)] hover:text-[var(--marca)] hover:border-[var(--marca)] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Próximo vídeo"
              className="w-10 h-10 rounded-xl bg-[var(--surf-2)] border border-[var(--borda)] text-[var(--fg)] hover:text-[var(--marca)] hover:border-[var(--marca)] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Subtítulo e Descrição da Dor Real */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-[var(--fg-2)] uppercase tracking-wider">
            {activeItem.subtitulo}
          </p>
          <p className="text-sm sm:text-base text-[var(--fg)] leading-relaxed">
            {activeItem.descricao}
          </p>
        </div>

        {/* Rodapé do Painel: Indicadores (Dots) + CTA de Inscrição */}
        <div className="pt-5 border-t border-[var(--borda)] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Pontinhos indicadores do carrossel */}
          <div className="flex items-center gap-2">
            {carouselItems.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Ir para ${item.titulo}`}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  activeIndex === idx
                    ? "w-8"
                    : "w-2.5 bg-[var(--borda)] hover:bg-[var(--fg-2)]/40"
                }`}
                style={activeIndex === idx ? { backgroundColor: item.cor } : {}}
              />
            ))}
          </div>

          {/* Botão de Inscrição na Área */}
          <Link
            href="/inscricao"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-2.5 px-6 rounded-xl text-sm font-bold transition-all text-center shadow-md active:scale-95 text-white cursor-pointer hover:opacity-95"
            style={{
              backgroundColor: activeItem.cor,
            }}
          >
            <span>Inscrever Solução nesta Área</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
