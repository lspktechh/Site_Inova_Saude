import { edicao, asset } from "@/lib/config";
import { PlayCircle } from "lucide-react";

interface Video {
  titulo?: string;
  url: string;
  formato?: "vertical" | "horizontal";
}

/** Converte links do YouTube (watch, youtu.be, shorts) para o endereço de incorporação */
function youtubeEmbed(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : null;
}

function Player({ video, destaque = false }: { video: Video; destaque?: boolean }) {
  const vertical = video.formato !== "horizontal";
  const embed = youtubeEmbed(video.url);
  const moldura = vertical
    ? `aspect-[9/16] w-full ${destaque ? "max-w-[340px]" : "max-w-[240px]"}`
    : "aspect-video w-full";

  return (
    <figure className={`space-y-2 ${vertical ? "" : "w-full"}`}>
      <div className={`${moldura} mx-auto rounded-2xl overflow-hidden bg-black shadow-lg border border-[var(--borda)]`}>
        {embed ? (
          <iframe
            src={embed}
            title={video.titulo || "Vídeo do INOVA SAÚDE"}
            className="w-full h-full"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : video.url ? (
          <video src={asset(video.url)} controls playsInline preload="metadata" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 relative">
            <div className="w-14 h-14 rounded-full bg-[var(--acento)] text-[#1e1708] flex items-center justify-center mb-3 shadow-lg">
              <PlayCircle size={28} />
            </div>
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--acento)] font-bold">
              Vídeo de Divulgação
            </span>
            <p className="text-xs text-white/70 mt-1 max-w-[200px] leading-relaxed">
              Formato vertical gravado no celular · Disponível em breve
            </p>
          </div>
        )}
      </div>
      {video.titulo && (
        <figcaption className="text-sm font-semibold text-[var(--fg)] text-center">{video.titulo}</figcaption>
      )}
    </figure>
  );
}

/** Vídeo em destaque + demais em sequência. Fica oculta até haver um vídeo em edicao.json > videos.destaque */
export function VideoSection() {
  const videos = edicao.videos as { titulo: string; destaque: Video | null; demais: Video[] };
  if (!videos.destaque) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      <div className="flex items-center gap-2">
        <PlayCircle size={22} className="text-[var(--acao)]" />
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--fg)]">{videos.titulo}</h2>
      </div>

      <Player video={videos.destaque} destaque />

      {videos.demais.length > 0 && (
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          {videos.demais.map((v) => (
            <div key={v.url} className="snap-start shrink-0 w-[70%] sm:w-[240px]">
              <Player video={v} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
