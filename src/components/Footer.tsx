import { edicao, asset } from "@/lib/config";

export function Footer() {
  const marcas = edicao.marcas;
  const contato = edicao.contato;

  return (
    <footer className="bg-[var(--marca-fundo)] text-white mt-auto border-t border-[rgba(255,255,255,0.15)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[rgba(255,255,255,0.7)] mb-4">
            Realização e Apoio Institucional (Art. 11 · Edital nº 4/2026)
          </p>
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            {/* Instituto Cruzeiro do Sul */}
            <img
              src={asset("/logos/ics_neg.png")}
              alt="Instituto Cruzeiro do Sul"
              className="h-9 sm:h-10 w-auto object-contain"
            />
            {/* ecohub */}
            <img
              src={asset("/logos/eco_branco.png")}
              alt="ecohub"
              className="h-8 sm:h-9 w-auto object-contain"
            />
            {/* Universidade Positivo */}
            <img
              src={asset("/logos/up_neg.png")}
              alt="Universidade Positivo"
              className="h-8 sm:h-9 w-auto object-contain"
            />
            {/* Fundação Araucária */}
            <img
              src={asset("/logos/fa_neg.png")}
              alt="Fundação Araucária"
              className="h-9 sm:h-10 w-auto object-contain"
            />
            {/* Governo do Estado do Paraná / SETI */}
            <img
              src={asset("/logos/pr_brasao.png")}
              alt="Governo do Estado do Paraná / SETI"
              className="h-10 sm:h-11 w-auto object-contain"
            />
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.2)] pt-6 space-y-3">
          <p className="text-sm text-[rgba(255,255,255,0.88)] leading-relaxed max-w-4xl">
            {marcas.frase_apoio}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[rgba(255,255,255,0.65)] font-mono">
            <span>Contato: <a href={`mailto:${contato.email_evento}`} className="text-[var(--acento)] underline">{contato.email_evento}</a></span>
            <span>{contato.responsavel_comissao}</span>
            <span className="text-[var(--acento)]">Art. 11 e 12 cumpridos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
