import Link from "next/link";
import { edicao, asset } from "@/lib/config";

export function Footer() {
  const marcas = edicao.marcas;
  const contato = edicao.contato;

  return (
    <footer className="bg-[var(--marca-fundo)] text-white mt-auto border-t border-[rgba(255,255,255,0.15)]">
      {/* pb extra no celular: a barra fixa "Inscrever Agora" (MobileQuickBar) cobriria a assinatura */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-14 space-y-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[rgba(255,255,255,0.7)] mb-4">
            Realização e Apoio Institucional (Art. 11 · Edital nº 4/2026)
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-10">
            {/* Instituto Cruzeiro do Sul */}
            <img
              src={asset("/logos/ics_neg.png")}
              alt="Instituto Cruzeiro do Sul"
              className="h-7 sm:h-10 w-auto max-w-[100px] sm:max-w-none object-contain"
            />
            {/* ecohub */}
            <img
              src={asset("/logos/eco_branco.png")}
              alt="ecohub"
              className="h-6 sm:h-9 w-auto max-w-[90px] sm:max-w-none object-contain"
            />
            {/* Universidade Positivo */}
            <img
              src={asset("/logos/up_neg.png")}
              alt="Universidade Positivo"
              className="h-6 sm:h-9 w-auto max-w-[90px] sm:max-w-none object-contain"
            />
            {/* Fundação Araucária */}
            <img
              src={asset("/logos/fa_neg.png")}
              alt="Fundação Araucária"
              className="h-7 sm:h-10 w-auto max-w-[100px] sm:max-w-none object-contain"
            />
            {/* Governo do Estado do Paraná / SETI */}
            <img
              src={asset("/logos/pr_brasao.png")}
              alt="Governo do Estado do Paraná / SETI"
              className="h-8 sm:h-11 w-auto max-w-[110px] sm:max-w-none object-contain"
            />
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.2)] pt-6 space-y-4">
          <p className="text-sm text-[rgba(255,255,255,0.88)] leading-relaxed max-w-4xl">
            {marcas.frase_apoio}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[rgba(255,255,255,0.8)] pt-1">
            <Link href="/avaliacao" className="hover:text-[var(--acento)] underline">
              Avaliação & Certificado
            </Link>
            <span>·</span>
            <Link href="/admin" className="hover:text-[var(--acento)] underline">
              Painel Admin (Avaliações)
            </Link>
            <span>·</span>
            <Link href="/editar-inscricao" className="hover:text-[var(--acento)] underline">
              Área da Equipe
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[rgba(255,255,255,0.65)] font-mono">
            <span className="break-all">Contato: <a href={`mailto:${contato.email_evento}`} className="text-[var(--acento)] underline">{contato.email_evento}</a></span>
            <span>{contato.responsavel_comissao}</span>
            <span className="text-[var(--acento)]">Art. 11 e 12 cumpridos</span>
          </div>
        </div>

        {/* Desenvolvido por LSPK Tech */}
        <div className="border-t border-[rgba(255,255,255,0.2)] pt-6 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[rgba(255,255,255,0.6)]">
            Desenvolvido por
          </span>
          <a
            href="https://www.instagram.com/lspktech"
            target="_blank"
            rel="noopener noreferrer"
            title="LSPK Tech no Instagram"
            aria-label="Desenvolvido por LSPK Tech — abrir Instagram"
            className="group inline-flex rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--acento)]"
          >
            <img
              src={asset("/logos/lspk-logo.svg")}
              alt="LSPK Tech"
              width={420}
              height={104}
              loading="lazy"
              className="h-8 sm:h-9 w-auto opacity-90 transition duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:drop-shadow-[0_4px_14px_rgba(59,91,255,0.45)]"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
