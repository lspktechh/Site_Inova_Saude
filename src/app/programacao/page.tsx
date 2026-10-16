import Link from "next/link";
import { edicao } from "@/lib/config";
import { Calendar, Clock, MapPin, CheckCircle, ArrowRight, Award } from "lucide-react";

export default function ProgramacaoPage() {
  const etapas = [
    {
      data: "17/10 a 23/10",
      titulo: "Período Oficial de Inscrições",
      descricao:
        "Abertura do formulário guiado em três trilhas. As equipes submetem o problema recortado e especificam a forma do protótipo.",
      destaque: "Inscrições encerram impreterivelmente em 23/10 às 23h59",
      tipo: "online",
    },
    {
      data: "24/10 a 30/10",
      titulo: "Pareamento de Equipes & Fila de Conversa",
      descricao:
        "Triagem da Comissão Organizadora. Rodadas de alinhamento de 20 minutos com equipes que acionaram trava sanitária ou escolheram dispositivos complexos (Formas C e D).",
      destaque: "Ajuste fino de escopo e banco de talentos ativo",
      tipo: "online",
    },
    {
      data: "31/10 · 09h30 às 12h30",
      titulo: "Oficina Presencial de Refinamento",
      descricao:
        "Encontro presencial no campus. Mentores aplicam o Feedback Capture Grid (d.school de Stanford) avaliando pontos fortes, críticas, perguntas e ideias sem gerar nota classificatória.",
      destaque: "Credenciamento oficial por QR Code na entrada",
      tipo: "presencial",
    },
    {
      data: "03/11",
      titulo: "Avaliação Classificatória",
      descricao:
        "Banca independente de avaliadores pontua as propostas pelas 3 Lentes da Inovação (Desejabilidade, Viabilidade, Exequibilidade) e afere o TRL. Os 7 projetos com maior pontuação avançam.",
      destaque: "Divulgação dos 7 times finalistas do Pitch Final",
      tipo: "avaliacao",
    },
    {
      data: "05/11 · 19h00 às 22h00",
      titulo: "Pitch Final & Premiação",
      descricao:
        "Apresentação das 7 equipes finalistas perante a banca examinadora, convidados do ecossistema de saúde e parceiros institucionais. Entrega de troféus e certificados.",
      destaque: "Auditório Principal da Universidade Positivo",
      tipo: "presencial",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] text-xs font-mono font-semibold">
          <Calendar size={14} />
          <span>Cronograma Oficial · {edicao.edicao.nome}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">
          Programação do Evento
        </h1>
        <p className="text-base text-[var(--fg-2)] max-w-3xl leading-relaxed">
          Confira as datas, horários e locais de cada marco da maratona. Lembre-se que as vagas são limitadas
          e o credenciamento presencial nos dias 31/10 e 05/11 é obrigatório para emissão de certificado.
        </p>
      </div>

      <div className="relative border-l-2 border-[var(--borda)] ml-4 sm:ml-6 space-y-10 pl-6 sm:pl-8">
        {etapas.map((etapa, idx) => (
          <div key={idx} className="relative group">
            {/* Marcador na linha do tempo */}
            <div
              className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full border-4 border-[var(--bg)] flex items-center justify-center ${
                etapa.tipo === "presencial"
                  ? "bg-[var(--acao)]"
                  : etapa.tipo === "avaliacao"
                  ? "bg-[var(--alerta)]"
                  : "bg-[var(--marca)]"
              }`}
            />

            <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-7 space-y-3 shadow-xs hover:border-[var(--marca-2)] transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-[var(--marca)] bg-[var(--surf-2)] px-2.5 py-1 rounded-md">
                  {etapa.data}
                </span>
                <span
                  className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    etapa.tipo === "presencial"
                      ? "bg-[var(--acao)]/10 text-[var(--acao)]"
                      : "bg-[var(--marca-2)]/10 text-[var(--marca-2)]"
                  }`}
                >
                  {etapa.tipo}
                </span>
              </div>

              <h3 className="text-xl font-bold text-[var(--fg)]">{etapa.titulo}</h3>
              <p className="text-sm text-[var(--fg-2)] leading-relaxed">{etapa.descricao}</p>

              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[var(--fg)] font-semibold">
                <CheckCircle size={14} className="text-[var(--acao)]" />
                <span>{etapa.destaque}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--surf-2)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="font-bold text-lg text-[var(--fg)]">Pronto para transformar a saúde?</h4>
          <p className="text-sm text-[var(--fg-2)]">
            As inscrições encerram em 23/10. O formulário leva cerca de 18 minutos para a equipe.
          </p>
        </div>
        <Link
          href="/inscricao"
          className="shrink-0 bg-[var(--acao)] text-white font-bold text-sm px-6 py-3 rounded-lg hover:brightness-105 transition-all inline-flex items-center gap-2"
        >
          <span>Garantir minha vaga</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
