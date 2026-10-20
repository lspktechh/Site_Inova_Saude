import Link from "next/link";
import { avaliacao, formasPrototipo, edicao, dataCurta } from "@/lib/config";
import { Scale, ShieldCheck, HelpCircle, ArrowRight, CheckCircle2, AlertOctagon, Award, MessageCircle } from "lucide-react";

export default function RegulamentoPage() {
  const criterios = avaliacao.classificatoria.criterios;
  const idoneidade = avaliacao.idoneidade.regras;
  const descritores = avaliacao.classificatoria.descritores_padrao as Record<string, string>;

  const faqs = [
    {
      p: "Quem pode se inscrever no INOVA SAÚDE 2026?",
      r: "Qualquer pessoa! Alunos de graduação e pós-graduação de todos os cursos, docentes, colaboradores técnico-administrativos, comunidade externa e profissionais de saúde atuantes.",
    },
    {
      p: "Posso me inscrever se eu não tiver equipe?",
      r: "Sim! Na Etapa 0, escolha 'Quero entrar numa equipe' ou 'Tenho ideia, procuro equipe'. Você será incluído automaticamente no Banco de Talentos público para pareamento enquanto as inscrições estiverem abertas.",
    },
    {
      p: "Qual é o tamanho permitido para as equipes?",
      r: "As equipes devem ter no mínimo 3 e no máximo 6 integrantes para terem a inscrição homologada.",
    },
    {
      p: "A inscrição tem algum custo?",
      r: "Não. A inscrição é 100% gratuita. Todo o evento, as mentorias e a premiação são financiados pelo Instituto Cruzeiro do Sul, Fundação Araucária e SETI.",
    },
    {
      p: "Posso usar inteligência artificial para gerar imagens e protótipos?",
      r: "Sim, como rascunho de concepção. Porém, pela regra de honestidade do evento, qualquer imagem gerada por IA deve ser identificada como tal na ficha. Equipe que apresentar imagem de IA fingindo ser produto funcionando perde pontos em exequibilidade.",
    },
    {
      p: "Como funciona a emissão de certificados?",
      r: "O certificado de 8 horas complementares é conferido aos integrantes das equipes que cumprirem todos os requisitos da inscrição e envio de protótipo. O certificado de 16 horas é emitido para quem comparecer presencialmente ao Demoday em 5 de novembro (Auditório 108E, Bloco E, UP Londrina), mediante leitura do QR Code individual no credenciamento.",
    },
    {
      p: "Como funcionam as mentorias?",
      r: "A organização entra em contato com cada equipe inscrita pelo WhatsApp ou e-mail cadastrado do líder para agendar mentorias a partir da ideia enviada. As mentorias acontecem até 2 de novembro a distância.",
    },
    {
      p: "Como e quando enviar o protótipo e o vídeo?",
      r: "O vídeo e os demais artefatos criados são enviados por link liberado (YouTube, Google Drive, Figma ou site) junto com a inscrição, até 2 de novembro de 2026. A equipe pode atualizar quantas vezes precisar até o prazo final; vale o último envio.",
    },
    {
      p: "Haverá premiação?",
      r: edicao.premiacao.texto_site,
    },
  ];

  return (
    <div className="w-full max-w-5xl min-w-0 mx-auto px-3 sm:px-6 py-8 sm:py-16 space-y-10 sm:space-y-14">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 max-w-full px-3 py-1 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] text-xs font-mono font-semibold">
            <Scale size={14} className="shrink-0" />
            <span className="truncate">Normas & Critérios de Avaliação</span>
          </div>

          <Link
            href="/edital"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-[var(--acao)] text-white px-3.5 py-1.5 rounded-xl hover:brightness-105 transition-all shadow-xs"
          >
            <span>Ver Edital Oficial na Íntegra</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">
          Regulamento & Critérios
        </h1>
        <p className="text-base text-[var(--fg-2)] max-w-3xl leading-relaxed">
          Transparência total desde a inscrição: conheça como sua solução será avaliada pela banca examinadora, os 5 critérios oficiais do Edital (peso 2 cada) e tire suas dúvidas.
        </p>
      </div>

      {/* Rúbrica Ponderada e Critérios */}
      <section className="w-full max-w-full min-w-0 bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-4 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-[var(--borda)] pb-4 space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--marca-2)] font-bold">
            {avaliacao.classificatoria.nome}
          </span>
          <h2 className="text-2xl font-bold text-[var(--fg)]">
            As Três Lentes da Inovação (Nota Máxima: 50 pontos)
          </h2>
          <p className="text-xs text-[var(--fg-2)]">
            Metodologia consagrada pela IDEO. Cada proposta é avaliada por 2 pareceristas independentes.
          </p>
        </div>

        <div className="divide-y divide-[var(--borda)]">
          {criterios.map((c) => (
            <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--acao)] font-bold">
                  {c.lente}
                </span>
                <h4 className="text-base font-bold text-[var(--fg)]">{c.rotulo}</h4>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-[var(--fg-2)]">Peso</span>
                <span className="font-mono text-base font-bold text-[var(--marca)] bg-[var(--surf-2)] px-3 py-1 rounded-lg">
                  {c.peso}x
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Descritores da Escala */}
        <div className="bg-[var(--surf-2)] p-5 rounded-xl space-y-3">
          <h4 className="text-xs font-mono uppercase font-bold text-[var(--fg)]">
            O que significa cada nota (Escala de 1 a 5):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
            {Object.entries(descritores).map(([nota, desc]) => (
              <div key={nota} className="p-2.5 bg-white rounded-lg border border-[var(--borda)] space-y-1">
                <span className="font-mono font-bold text-sm text-[var(--marca)] block">Nota {nota}</span>
                <span className="text-[var(--fg-2)] leading-tight block">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premiação e Certificado */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-[var(--surf)] border border-[var(--borda)] rounded-2xl space-y-2">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-[var(--acao)]" />
            <h3 className="font-bold text-base text-[var(--fg)]">Premiação</h3>
          </div>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">{edicao.premiacao.texto_site}</p>
        </div>
        <div className="p-6 bg-[var(--surf)] border border-[var(--borda)] rounded-2xl space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-[var(--acao)]" />
            <h3 className="font-bold text-base text-[var(--fg)]">Certificados de 8h e 16h</h3>
          </div>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">
            Certificado de 8 horas complementares para integrantes que cumprirem todos os requisitos da inscrição. Certificado de 16 horas para presentes no Demoday em 5 de novembro com credenciamento e presença registrados via QR Code.
          </p>
        </div>
        <div className="md:col-span-2 p-6 bg-[var(--surf)] border border-[var(--borda)] rounded-2xl space-y-2">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-[var(--acao)]" />
            <h3 className="font-bold text-base text-[var(--fg)]">Mentorias a distância</h3>
          </div>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">{edicao.mentoria.texto}</p>
        </div>
      </section>

      {/* Os 7 Requisitos de Idoneidade */}
      <section className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-[var(--borda)] pb-4 space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--acao)] font-bold">
            Garantia de Lisura
          </span>
          <h2 className="text-2xl font-bold text-[var(--fg)]">
            Os 7 Requisitos de Idoneidade da Banca
          </h2>
          <p className="text-xs text-[var(--fg-2)]">
            Regras de integridade embutidas no sistema para assegurar avaliação justa e impessoal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {idoneidade.map((item, i) => (
            <div key={item.id} className="p-4 bg-[var(--bg)] border border-[var(--borda)] rounded-xl space-y-1.5">
              <span className="font-mono text-xs font-bold text-[var(--marca)]">0{i + 1}.</span>
              <p className="text-xs text-[var(--fg)] font-medium leading-relaxed">{item.texto}</p>
              <span className="text-[11px] font-mono text-[var(--fg-2)] block pt-1 border-t border-[var(--borda)]/50">
                Implementação: {item.implementacao}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Regra de Honestidade sobre IA */}
      <section className="p-6 bg-[var(--alerta)]/10 border-l-4 border-[var(--alerta)] rounded-r-2xl space-y-3">
        <div className="flex items-center gap-2">
          <AlertOctagon size={20} className="text-[var(--alerta)]" />
          <h3 className="font-bold text-base text-[var(--fg)]">
            Cláusula de Honestidade Tecnológica sobre IA
          </h3>
        </div>
        <p className="text-sm text-[var(--fg-2)] leading-relaxed">
          {formasPrototipo.regra_de_honestidade.texto}
        </p>
      </section>

      {/* Perguntas Frequentes (FAQ) */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--marca)] font-bold">
            Dúvidas Comuns
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)]">
            Perguntas Frequentes (FAQ)
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[var(--surf)] border border-[var(--borda)] rounded-xl p-5 space-y-2 shadow-2xs"
            >
              <h4 className="text-base font-bold text-[var(--fg)] flex items-start gap-2">
                <HelpCircle size={18} className="text-[var(--marca-2)] shrink-0 mt-0.5" />
                <span>{faq.p}</span>
              </h4>
              <p className="text-sm text-[var(--fg-2)] pl-6 leading-relaxed">{faq.r}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center pt-4">
        <Link
          href="/inscricao"
          className="inline-flex items-center gap-2 bg-[var(--marca)] hover:bg-[var(--marca-2)] text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-md transition-all"
        >
          <span>Concordo e quero inscrever minha equipe</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
