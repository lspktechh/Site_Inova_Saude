import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { edicao, reais, listaComE, dataCurta } from "@/lib/config";

/** Faixa de destaque da premiação, logo abaixo da abertura da home. Tudo vem do edicao.json. */
export function PremiacaoDestaque() {
  const { premiacao, rotulos, datas } = edicao;
  const dataEvento = dataCurta(datas.pitch_final.data);

  // Enquanto a Comissão não liberar os valores, mantém o aviso simples de antes.
  if (!premiacao.divulgar_valores) {
    return (
      <section id="premiacao" className="max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="bg-[var(--marca-fundo)] text-white rounded-3xl p-7 sm:p-10 flex items-center gap-5 shadow-xl border border-white/15">
          <div className="w-14 h-14 rounded-2xl bg-[var(--acento)] text-[#1e1708] flex items-center justify-center shrink-0 shadow-md">
            <Award size={30} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Haverá premiação para as equipes finalistas</h2>
            <p className="text-sm text-white/80 max-w-2xl leading-relaxed">{premiacao.texto_site}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="premiacao" aria-labelledby="premiacao-titulo" className="max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-24">
      <div className="bg-[var(--marca-fundo)] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-white/15 space-y-8">
        {/* Título com o total */}
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[var(--acento)] text-[#1e1708] flex items-center justify-center shrink-0 shadow-md">
            <Award size={30} />
          </div>
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--acento)] font-bold block">
              Premiação · {rotulos.evento_final} {dataEvento}
            </span>
            <h2 id="premiacao-titulo" className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {reais(premiacao.total)} em prêmios para as {premiacao.colocacoes.length} melhores equipes
            </h2>
          </div>
        </div>

        {/* Valores por colocação: lista no celular, três cartões no desktop */}
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
          {premiacao.colocacoes.map((c) => {
            const primeiro = c.lugar === 1;
            return (
              <li
                key={c.lugar}
                className={`rounded-2xl border p-4 sm:p-6 flex items-center justify-between sm:flex-col sm:items-start sm:justify-between gap-1 sm:gap-6 ${
                  primeiro ? "bg-[var(--acento)]/10 border-[var(--acento)]/60" : "bg-white/5 border-white/15"
                }`}
              >
                <span
                  className={`font-mono text-xs sm:text-sm font-bold uppercase tracking-wider ${
                    primeiro ? "text-[var(--acento)]" : "text-white/70"
                  }`}
                >
                  {c.lugar}º lugar
                </span>
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">{reais(c.valor)}</span>
              </li>
            );
          })}
        </ol>

        {/* Apoio, anúncio e ações */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1 text-sm text-white/80 leading-relaxed">
            <p>
              <strong className="text-white">Apoio da premiação:</strong> {listaComE(premiacao.apoio)}.
            </p>
            <p>O resultado é anunciado ao fim do {rotulos.evento_final}, em {dataEvento}.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/inscricao"
              className="inline-flex items-center justify-center gap-2 bg-[var(--acento)] text-[#1e1708] font-bold text-sm px-6 py-3 rounded-xl shadow-lg hover:brightness-105 active:scale-95 transition-all text-center"
            >
              <span>Inscrever Minha Equipe</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/edital#premiacao"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl border border-white/25 transition-all text-center"
            >
              Ver no edital
            </Link>
            <Link
              href="/regulamento"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl border border-white/25 transition-all text-center"
            >
              Rúbrica & Critérios
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
