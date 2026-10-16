import Link from "next/link";
import { edicao } from "@/lib/config";
import { Calendar, Clock, MapPin, CheckCircle, ArrowRight, Award, Compass, ExternalLink } from "lucide-react";

export default function ProgramacaoPage() {
  const etapas = [
    {
      data: "17/10 a 23/10",
      status: "ativo",
      titulo: "Período Oficial de Inscrições",
      descricao:
        "Abertura do formulário guiado em três trilhas. As equipes submetem o problema recortado e especificam a forma do protótipo (Software, 3D, Dispositivo ou Serviço).",
      destaque: "Inscrições encerram impreterivelmente em 23/10 às 23h59",
      tipo: "online",
      horario: "Até 23h59 de 23/10",
    },
    {
      data: "24/10 a 30/10",
      status: "futuro",
      titulo: "Pareamento de Equipes & Fila de Conversa",
      descricao:
        "Triagem da Comissão Organizadora. Rodadas de alinhamento de 20 minutos com equipes que acionaram trava sanitária ou escolheram dispositivos complexos (Formas C e D).",
      destaque: "Ajuste fino de escopo e banco de talentos ativo",
      tipo: "online",
      horario: "Horários agendados",
    },
    {
      data: "31/10 · Sábado",
      status: "futuro",
      titulo: "Oficina Presencial de Refinamento",
      descricao:
        "Encontro presencial no campus. Mentores aplicam o Feedback Capture Grid (d.school de Stanford) avaliando pontos fortes, críticas, perguntas e ideias sem gerar nota classificatória.",
      destaque: "Credenciamento oficial por QR Code na entrada às 09h30",
      tipo: "presencial",
      horario: "09h30 às 12h30",
      local: "Laboratório Maker / UP Londrina",
    },
    {
      data: "03/11 · Terça",
      status: "futuro",
      titulo: "Avaliação Classificatória Independente",
      descricao:
        "Banca independente de avaliadores pontua as propostas pelas 3 Lentes da Inovação (Desejabilidade, Viabilidade, Exequibilidade) e afere o TRL. Os 7 projetos com maior pontuação avançam.",
      destaque: "Divulgação dos 7 times finalistas do Pitch Final",
      tipo: "avaliacao",
      horario: "Divulgação às 18h00",
    },
    {
      data: "05/11 · Quinta",
      status: "futuro",
      titulo: "Grande Pitch Final & Premiação",
      descricao:
        "Apresentação das 7 equipes finalistas perante a banca examinadora, convidados do ecossistema de saúde e parceiros institucionais. Entrega de troféus, certificados de 20h e premiação.",
      destaque: "Auditório Principal da Universidade Positivo Londrina",
      tipo: "presencial",
      horario: "19h00 às 22h00",
      local: "Auditório Principal UP",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* ──── HERO DA PROGRAMAÇÃO ──── */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] text-xs font-mono font-bold tracking-wider">
          <Calendar size={14} />
          <span>Cronograma Oficial · {edicao.edicao.nome}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">
          Programação do Evento
        </h1>
        <p className="text-base text-[var(--fg-2)] max-w-3xl leading-relaxed">
          Confira as datas, horários e locais de cada marco da maratona. O credenciamento presencial nos dias
          31/10 e 05/11 é realizado via leitura do QR Code individual e garante a emissão do certificado oficial de 20 horas.
        </p>
      </div>

      {/* ──── LINHA DO TEMPO ESTILIZADA ──── */}
      <div className="relative border-l-2 border-[var(--borda)] ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
        {etapas.map((etapa, idx) => {
          const isAtivo = etapa.status === "ativo";
          return (
            <div key={idx} className="relative group">
              {/* Marcador na Linha do Tempo com Pulso Vivo para Fase Ativa */}
              <div
                className={`absolute -left-[35px] sm:-left-[43px] top-2 w-6 h-6 rounded-full border-4 border-[var(--bg)] flex items-center justify-center transition-all ${
                  isAtivo
                    ? "bg-[var(--acao)] shadow-[0_0_12px_var(--acao)]"
                    : etapa.tipo === "presencial"
                    ? "bg-[var(--marca)]"
                    : etapa.tipo === "avaliacao"
                    ? "bg-[var(--alerta)]"
                    : "bg-[var(--borda)]"
                }`}
              >
                {isAtivo && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
              </div>

              <div
                className={`bg-[var(--surf)] border rounded-2xl p-6 sm:p-7 space-y-3.5 transition-all shadow-xs ${
                  isAtivo
                    ? "border-[var(--acao)] ring-2 ring-[var(--acao)]/15 shadow-md"
                    : "border-[var(--borda)] hover:border-[var(--marca-2)]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--marca)] bg-[var(--surf-2)] px-2.5 py-1 rounded-md">
                      {etapa.data}
                    </span>
                    {isAtivo && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-white bg-[var(--acao)] px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>Fase Atual</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--fg-2)]">
                    <Clock size={13} />
                    <span>{etapa.horario}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--fg)]">
                    {etapa.titulo}
                  </h3>
                  <p className="text-sm text-[var(--fg-2)] mt-1.5 leading-relaxed">
                    {etapa.descricao}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--borda)]/60 text-xs">
                  <div className="flex items-center gap-2 font-mono text-[var(--fg)] font-semibold">
                    <CheckCircle size={14} className="text-[var(--acao)]" />
                    <span>{etapa.destaque}</span>
                  </div>

                  {etapa.local && (
                    <div className="flex items-center gap-1.5 text-[var(--fg-2)] font-mono">
                      <MapPin size={13} className="text-[var(--marca)]" />
                      <span>{etapa.local}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ──── LOCAL DO EVENTO & MAPA ──── */}
      <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--marca)]/10 text-[var(--marca)] flex items-center justify-center">
            <MapPin size={22} />
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--marca)] font-bold">
              Local das Atividades Presenciais
            </span>
            <h3 className="text-xl font-bold text-[var(--fg)]">Universidade Positivo · Campus Londrina</h3>
          </div>
        </div>

        <p className="text-sm text-[var(--fg-2)] leading-relaxed">
          As oficinas práticas de prototipagem e o Pitch Final com a banca acontecem nas instalações da Universidade Positivo e do ecossistema de inovação ecohub em Londrina/PR. Estacionamento gratuito e credenciamento ágil com leitores na portaria.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="https://maps.google.com/?q=Universidade+Positivo+Londrina"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--marca)] hover:underline"
          >
            <Compass size={14} />
            <span>Abrir no Google Maps</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* ──── CTA FINAL ──── */}
      <div className="bg-gradient-to-r from-[#072F56] to-[#041B32] text-white rounded-3xl p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/15">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-extrabold text-xl sm:text-2xl text-white">Pronto para transformar a saúde?</h4>
          <p className="text-sm text-white/80 max-w-xl">
            As inscrições encerram em 23/10 às 23h59. Garanta a vaga da sua equipe e receba o voucher imediato.
          </p>
        </div>
        <Link
          href="/inscricao"
          className="shrink-0 bg-[var(--acento)] text-[#1e1708] font-bold text-sm px-7 py-3.5 rounded-xl hover:brightness-105 transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <span>Garantir Minha Vaga</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
