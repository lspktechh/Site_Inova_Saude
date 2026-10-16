import Link from "next/link";
import { edicao, dataCurta } from "@/lib/config";
import { Clock, MapPin, ArrowRight, ExternalLink, ChevronDown } from "lucide-react";

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
    <div className="w-full max-w-4xl min-w-0 mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10 sm:space-y-14">
      {/* ──── CABEÇALHO ──── */}
      <div className="space-y-3 max-w-2xl">
        <span className="rotulo">Cronograma · {edicao.edicao.nome}</span>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">Programação</h1>
        <p className="text-base text-[var(--fg-2)] leading-relaxed">
          Nos dias presenciais, o check-in é feito pelo QR Code individual e garante o certificado de 20 horas.
        </p>
      </div>

      {/* ──── LINHA DO TEMPO ──── */}
      <ol className="relative space-y-4">
        <span className="absolute left-[1.15rem] sm:left-[1.4rem] top-4 bottom-4 border-l-2 border-[var(--borda)]" aria-hidden />
        {etapas.map((etapa) => {
          const isAtivo = etapa.status === "ativo";
          const cor = isAtivo
            ? "var(--acao)"
            : etapa.tipo === "presencial"
            ? "var(--marca)"
            : etapa.tipo === "avaliacao"
            ? "var(--alerta)"
            : "var(--fg-2)";
          const [dia, resto] = etapa.data.split(" · ");
          return (
            <li key={etapa.titulo} className="relative flex gap-4 sm:gap-6">
              <span
                className={`relative z-10 mt-5 w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full border-4 border-[var(--bg)] ${
                  isAtivo ? "shadow-[0_0_14px_var(--acao)]" : ""
                }`}
                style={{ background: cor }}
              />

              <details
                open={isAtivo}
                className={`expansivel flex-1 min-w-0 bg-[var(--surf)] border rounded-2xl ${
                  isAtivo ? "border-[var(--acao)]" : "border-[var(--borda)]"
                }`}
              >
                <summary className="p-5 sm:p-6">
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-extrabold text-lg" style={{ color: cor }}>
                        {dia}
                      </span>
                      {resto && <span className="text-sm text-[var(--fg-2)]">{resto}</span>}
                      {isAtivo && (
                        <span className="text-[11px] font-bold text-white bg-[var(--acao)] px-2.5 py-0.5 rounded-full">
                          Agora
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[var(--fg)] leading-snug">{etapa.titulo}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--fg-2)]">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={14} /> {etapa.horario}
                      </span>
                      {etapa.local && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14} /> {etapa.local}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown size={20} className="seta text-[var(--fg-2)]" />
                </summary>

                <div className="px-5 sm:px-6 pb-6 space-y-3 text-sm leading-relaxed">
                  <p className="text-[var(--fg-2)]">{etapa.descricao}</p>
                  <p className="font-semibold text-[var(--fg)]">→ {etapa.destaque}</p>
                </div>
              </details>
            </li>
          );
        })}
      </ol>

      {/* ──── LOCAL ──── */}
      <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-[var(--marca)]/10 text-[var(--marca)] flex items-center justify-center shrink-0">
          <MapPin size={24} />
        </div>
        <div className="flex-1 space-y-1">
          <h2 className="text-lg font-bold text-[var(--fg)]">Universidade Positivo · Campus Londrina</h2>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">
            Oficinas e Pitch Final na UP e no ecohub Londrina/PR. Estacionamento gratuito e check-in ágil na portaria.
          </p>
        </div>
        <a
          href="https://maps.google.com/?q=Universidade+Positivo+Londrina"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--marca)] hover:underline"
        >
          Abrir no Maps <ExternalLink size={14} />
        </a>
      </div>

      {/* ──── CTA FINAL ──── */}
      <div className="bg-[var(--marca-fundo)] text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="font-extrabold text-xl sm:text-2xl">Pronto para transformar a saúde?</h2>
          <p className="text-sm text-white/75 max-w-xl">Inscrições até {dataCurta(edicao.datas.inscricoes.encerramento)} às 23h59. O voucher sai na hora.</p>
        </div>
        <Link
          href="/inscricao"
          className="shrink-0 bg-[var(--acento)] text-[#1e1708] font-bold text-sm px-7 py-3.5 rounded-xl hover:brightness-105 transition-all inline-flex items-center gap-2 shadow-lg"
        >
          Garantir minha vaga <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
