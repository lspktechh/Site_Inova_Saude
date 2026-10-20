import Link from "next/link";
import { edicao, dataCurta, encerramentoVisivel } from "@/lib/config";
import { Calendar, Clock, MapPin, CheckCircle, ArrowRight, Award, Compass, ExternalLink } from "lucide-react";

export default function ProgramacaoPage() {
  const { datas, certificado, rotulos } = edicao;
  const prazo = encerramentoVisivel();
  const pitch = datas.pitch_final;

  const etapas = [
    {
      data: "20/10 a 02/11/2026",
      status: "ativo",
      titulo: "Inscrições Online",
      descricao:
        "Formulário guiado em três trilhas (equipe com ideia, ideia sem equipe e banco de talentos). Equipes de 3 a 6 pessoas de qualquer curso ou comunidade externa.",
      destaque: "WhatsApp e e-mail do responsável obrigatórios para mentorias",
      tipo: "online",
      horario: "Até 23h59 de 02/11/2026",
    },
    {
      data: "Da inscrição até 02/11/2026",
      status: "ativo",
      titulo: "Mentorias a Distância",
      descricao:
        "A organização entra em contato com cada equipe inscrita pelo WhatsApp ou e-mail cadastrado para agendar mentorias a partir da ideia enviada, refinando o problema, solução e protótipo.",
      destaque: "Mentores entram em contato pelo WhatsApp e e-mail",
      tipo: "online",
      horario: "Horários agendados com a equipe",
    },
    {
      data: "Junto com a inscrição, até 02/11",
      status: "ativo",
      titulo: "Envio dos Links do Vídeo e do Protótipo",
      descricao:
        "Envio de vídeo explicativo e protótipo (físico ou digital) por links com acesso público ou liberado (YouTube, Drive, Figma ou site). A equipe pode atualizar quantas vezes precisar até o prazo.",
      destaque: "Até 3 itens; link liberado para a banca examinadora",
      tipo: "online",
      horario: "Até 23h59 de 02/11/2026",
    },
    {
      data: "03/11/2026 · Segunda",
      status: "futuro",
      titulo: "Divulgação dos 10 Finalistas",
      descricao:
        "Banca avaliadora pontua as propostas e seleciona as 10 equipes com maior pontuação para se apresentarem presencialmente no Demoday.",
      destaque: "Divulgação oficial das 10 equipes classificadas",
      tipo: "avaliacao",
      horario: "Pelos canais oficiais do evento",
    },
    {
      data: "05/11/2026 · Quinta",
      status: "futuro",
      titulo: "Demoday no 3º COPOL & Premiação",
      descricao:
        "Apresentação presencial dos 10 finalistas perante a banca examinadora (5 min de apresentação + 5 min de considerações) no Congresso Odontológico Positivo Londrinense. Às 19h abertura; 19h30 apresentações; ao final, anúncio da premiação.",
      destaque: "Presença com QR Code libera certificado de 16h",
      tipo: "presencial",
      horario: "19h00 às 22h30",
      local: "Auditório 108E, Bloco E · Universidade Positivo Londrina (3º COPOL)",
    },
  ];

  return (
    <div className="w-full max-w-5xl min-w-0 mx-auto px-3 sm:px-6 py-8 sm:py-16 space-y-8 sm:space-y-12">
      {/* ──── HERO DA PROGRAMAÇÃO ──── */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 max-w-full px-3 py-1.5 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] text-[11px] sm:text-xs font-mono font-bold tracking-wider">
          <Calendar size={14} className="shrink-0" />
          <span className="truncate">Cronograma Oficial · {edicao.edicao.nome}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">
          Programação do Evento
        </h1>
        <p className="text-base text-[var(--fg-2)] max-w-3xl leading-relaxed">
          Confira as datas oficiais conforme o Edital. Certificado de 8h para quem cumprir os requisitos da inscrição e de 16h para os presentes no Demoday em 05/11 (Auditório 108E, Bloco E, UP Londrina).
        </p>
      </div>

      {/* ──── LINHA DO TEMPO ESTILIZADA ──── */}
      <div className="relative border-l-2 border-[var(--borda)] ml-3 sm:ml-6 space-y-8 pl-5 sm:pl-8">
        {etapas.map((etapa, idx) => {
          const isAtivo = etapa.status === "ativo";
          return (
            <div key={idx} className="relative group">
              {/* Marcador na Linha do Tempo com Pulso Vivo para Fase Ativa */}
              <div
                className={`absolute -left-[31px] sm:-left-[43px] top-2 w-6 h-6 rounded-full border-4 border-[var(--bg)] flex items-center justify-center transition-all ${
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
                className={`bg-[var(--surf)] border rounded-2xl p-4 sm:p-7 space-y-3.5 transition-all shadow-xs ${
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
          O {rotulos.evento_final} com a banca e a premiação acontecem nas instalações da Universidade Positivo e do ecossistema de inovação ecohub em Londrina/PR. Estacionamento gratuito e credenciamento ágil com leitores na portaria.
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
            {prazo ? `As inscrições encerram em ${dataCurta(prazo)} às 23h59. ` : "Inscrições abertas e gratuitas. "}
            Garanta a vaga da sua equipe e receba o voucher na hora.
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
