import Link from "next/link";
import { avaliacao, formasPrototipo, edicao } from "@/lib/config";
import { ShieldCheck, ArrowRight, AlertOctagon, ChevronDown, Plus } from "lucide-react";

export default function RegulamentoPage() {
  const criterios = avaliacao.classificatoria.criterios;
  const idoneidade = avaliacao.idoneidade.regras;
  const descritores = avaliacao.classificatoria.descritores_padrao as Record<string, string>;
  const pesoMaximo = Math.max(...criterios.map((c: any) => c.peso));
  const coresLente: Record<string, string> = {
    Desejabilidade: "var(--e4)",
    Viabilidade: "var(--e5)",
    Exequibilidade: "var(--e6)",
    Equipe: "var(--e1)",
  };

  const faqs = [
    {
      p: "Quem pode se inscrever no INOVA SAÚDE 2026?",
      r: "Qualquer pessoa! Alunos de graduação e pós-graduação de todos os cursos, docentes, colaboradores técnico-administrativos, comunidade externa e profissionais de saúde atuantes.",
    },
    {
      p: "Posso me inscrever se eu não tiver equipe?",
      r: "Sim! Na Etapa 0, escolha 'Quero entrar numa equipe' ou 'Tenho ideia, procuro equipe'. Você será incluído automaticamente no Banco de Talentos público para pareamento até 30/10.",
    },
    {
      p: "Qual é o tamanho permitido para as equipes?",
      r: "As equipes devem ter no mínimo 3 e no máximo 6 integrantes para serem homologadas na oficina presencial.",
    },
    {
      p: "A inscrição tem algum custo?",
      r: "Não. A inscrição é 100% gratuita. Todo o evento, materiais da oficina e mentorias são financiados pelo Instituto Cruzeiro do Sul, Fundação Araucária e SETI.",
    },
    {
      p: "Posso usar inteligência artificial para gerar imagens e protótipos?",
      r: "Sim, como rascunho de concepção. Porém, pela regra de honestidade do evento, qualquer imagem gerada por IA deve ser identificada como tal na ficha. Equipe que apresentar imagem de IA fingindo ser produto funcionando perde pontos em exequibilidade.",
    },
    {
      p: "Como funciona a emissão de certificados?",
      r: "O certificado oficial de 20 horas de atividades complementares é emitido digitalmente com validação online por QR Code para todos os participantes que realizarem o check-in na oficina (31/10) e no Pitch Final (05/11).",
    },
  ];

  return (
    <div className="w-full max-w-4xl min-w-0 mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12 sm:space-y-16">
      {/* ──── CABEÇALHO ──── */}
      <div className="space-y-3 max-w-2xl">
        <span className="rotulo">Normas & avaliação</span>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">Regulamento</h1>
        <p className="text-base text-[var(--fg-2)] leading-relaxed">
          Como sua solução será avaliada, as regras de idoneidade da banca e as dúvidas mais comuns.
        </p>
      </div>

      {/* ──── RÚBRICA ──── */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)]">
            Três lentes da inovação
          </h2>
          <p className="text-sm text-[var(--fg-2)]">
            {avaliacao.classificatoria.nome} · nota máxima {avaliacao.classificatoria.nota_maxima} pontos ·{" "}
            {avaliacao.classificatoria.avaliadores_por_proposta} avaliadores independentes por proposta (método IDEO)
          </p>
        </div>

        <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-5 sm:p-7 space-y-5">
          {criterios.map((c: any) => {
            const cor = coresLente[c.lente] ?? "var(--marca)";
            return (
              <div key={c.id} className="space-y-2">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: cor }}>
                      {c.lente}
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-[var(--fg)] leading-snug">{c.rotulo}</p>
                  </div>
                  <span className="font-mono font-bold text-[var(--fg)] shrink-0">{c.peso}×</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--surf-2)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(c.peso / pesoMaximo) * 100}%`, background: cor }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Escala de 1 a 5 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--fg)]">O que significa cada nota</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {Object.entries(descritores).map(([nota, desc]) => (
              <div key={nota} className="flex sm:flex-col items-start gap-3 sm:gap-2 p-3 rounded-xl bg-[var(--surf)] border border-[var(--borda)]">
                <span
                  className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ background: "var(--marca-2)", opacity: 0.45 + Number(nota) * 0.11 }}
                >
                  {nota}
                </span>
                <span className="text-xs text-[var(--fg-2)] leading-snug">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── IDONEIDADE ──── */}
      <section>
        <details className="expansivel bg-[var(--surf)] border border-[var(--borda)] rounded-2xl">
          <summary className="p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[var(--acao)]/10 text-[var(--acao)] flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[var(--fg)]">
                  Os {idoneidade.length} requisitos de idoneidade da banca
                </h2>
                <p className="text-sm text-[var(--fg-2)]">Regras de integridade embutidas no sistema.</p>
              </div>
            </div>
            <ChevronDown size={20} className="seta text-[var(--fg-2)]" />
          </summary>
          <ol className="px-5 sm:px-6 pb-6 space-y-4">
            {idoneidade.map((item: any, i: number) => (
              <li key={item.id} className="flex gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-[var(--surf-2)] text-[var(--marca)] text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm text-[var(--fg)] leading-relaxed">{item.texto}</p>
                  <p className="text-xs text-[var(--fg-2)]">Como: {item.implementacao}</p>
                </div>
              </li>
            ))}
          </ol>
        </details>
      </section>

      {/* ──── HONESTIDADE SOBRE IA ──── */}
      <section className="flex gap-4 p-5 sm:p-6 bg-[var(--alerta)]/10 rounded-2xl">
        <AlertOctagon size={22} className="text-[var(--alerta)] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="font-bold text-[var(--fg)]">Honestidade sobre IA</h2>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">{formasPrototipo.regra_de_honestidade.texto}</p>
        </div>
      </section>

      {/* ──── FAQ ──── */}
      <section className="space-y-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)]">Perguntas frequentes</h2>
        <div className="divide-y divide-[var(--borda)] border-y border-[var(--borda)]">
          {faqs.map((faq) => (
            <details key={faq.p} className="expansivel group">
              <summary className="py-4 font-semibold text-[var(--fg)]">
                <span>{faq.p}</span>
                <Plus size={18} className="shrink-0 text-[var(--fg-2)] transition-transform group-open:rotate-45" />
              </summary>
              <p className="pb-5 text-sm text-[var(--fg-2)] leading-relaxed">{faq.r}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link
          href="/inscricao"
          className="inline-flex items-center gap-2 bg-[var(--acao)] hover:bg-[var(--acao-hover)] text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-md transition-all"
        >
          Concordo e quero me inscrever <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
