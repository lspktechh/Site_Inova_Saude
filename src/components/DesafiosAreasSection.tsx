"use client";

import Link from "next/link";
import { Pill, Activity, Stethoscope, ArrowRight, Video, Sparkles } from "lucide-react";
import { edicao } from "@/lib/config";

/** Converte links do YouTube (watch, shorts, embed, youtu.be) para o endereço de incorporação */
function youtubeEmbed(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : null;
}

const ICONES: Record<string, any> = {
  Pill,
  Activity,
  Stethoscope,
};

export function DesafiosAreasSection() {
  const areas = (edicao as any).desafios_areas || [];
  if (areas.length === 0) return null;

  return (
    <section id="desafios-areas" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      {/* ──── CABEÇALHO DA SEÇÃO ──── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--marca)]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--fg-2)] font-bold flex items-center gap-1.5">
            <Video size={14} className="text-[var(--marca)]" />
            <span>Vídeos dos Cursos de Saúde</span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--fg)]">
          Desafios por Área da Faculdade
        </h2>
        <p className="text-sm sm:text-base text-[var(--fg-2)] max-w-3xl leading-relaxed">
          Professores e profissionais de <strong>Farmácia</strong>, <strong>Fisioterapia</strong> e <strong>Enfermagem</strong> gravaram
          vídeos rápidos explicando dores e necessidades reais de cada campo assistencial. Assista aos vídeos e
          inspire o projeto da sua equipe!
        </p>
      </div>

      {/* ──── GRADE RESPONSIVA DOS 3 DESAFIOS (1 col no mobile, 3 cols em desktop) ──── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {areas.map((desafio: any) => {
          const Icon = ICONES[desafio.icone] || Sparkles;
          const embed = youtubeEmbed(desafio.url);
          const cor = desafio.cor || "var(--marca)";

          return (
            <div
              key={desafio.id}
              className="health-card p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group border border-[var(--borda)] hover:border-[var(--marca-2)] transition-all duration-300"
              style={{ borderTop: `4px solid ${cor}` }}
            >
              {/* Topo do card: Ícone + Tags + Título */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
                    style={{ backgroundColor: cor }}
                  >
                    <Icon size={22} />
                  </div>
                  <span
                    className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
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

                {/* Player Vertical Responsivo no formato Short (9:16) */}
                <div className="py-1">
                  <div className="aspect-[9/16] w-full max-w-[260px] sm:max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-black shadow-lg border border-[var(--borda)] relative">
                    {embed ? (
                      <iframe
                        src={embed}
                        title={`${desafio.titulo} · INOVA SAÚDE 2026`}
                        className="w-full h-full"
                        loading="lazy"
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
        })}
      </div>
    </section>
  );
}
