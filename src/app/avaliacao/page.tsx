"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  Send,
  Building2,
  Users,
  Check,
  Home,
  MessageSquareQuote,
  Star,
  Compass,
  ExternalLink,
} from "lucide-react";
import { submitEventEvaluation, EvaluationPayload } from "@/lib/api";

const AJUDOU_OPCOES = [
  "Vídeos de desafios no site",
  "Mentoria",
  "Grupo de WhatsApp",
  "Edital e site",
  "Colegas de outros cursos",
];

const MENTORIA_OPCOES = [
  "1 (ruim)",
  "2",
  "3",
  "4",
  "5 (ótima)",
  "Não tive contato com mentor",
];

const CONTINUAR_ECOHUB_OPCOES = [
  "Sim, na pré-incubadora",
  "Sim, no espaço maker",
  "Não agora",
];

const AUTORIZA_DEPOIMENTO_OPCOES = [
  "Sim, com meu nome e curso",
  "Sim, sem meu nome",
  "Não",
];

export default function AvaliacaoPage() {
  // Seção 1: Identificação
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cursoPeriodo, setCursoPeriodo] = useState("");

  // Seção 2: Experiência
  const [nps, setNps] = useState<number | null>(null);
  const [oQueAjudou, setOQueAjudou] = useState<string[]>([]);
  const [outroAjudou, setOutroAjudou] = useState("");
  const [usarOutro, setUsarOutro] = useState(false);
  const [mentoriaNota, setMentoriaNota] = useState("");
  const [aprendizado, setAprendizado] = useState("");
  const [mudancas, setMudancas] = useState("");
  const [continuarEcohub, setContinuarEcohub] = useState("");

  // Seção 3: Depoimento
  const [depoimento, setDepoimento] = useState("");
  const [autorizaDepoimento, setAutorizaDepoimento] = useState("");

  // Seção 4: Demoday
  const [esteveDemoday, setEsteveDemoday] = useState<boolean | null>(null);

  // Seção 5: Sobre o Demoday
  const [papelDemoday, setPapelDemoday] = useState("");
  const [demodayOrganizacao, setDemodayOrganizacao] = useState<number | null>(null);
  const [demodayHorario, setDemodayHorario] = useState<number | null>(null);
  const [demodayFeedbackBanca, setDemodayFeedbackBanca] = useState<number | null>(null);
  const [demodayApresentacao, setDemodayApresentacao] = useState("");
  const [demodayGravarVideo, setDemodayGravarVideo] = useState("");

  // Estados de envio
  const [enviando, setEnviando] = useState(false);
  const [erroMsg, setErroMsg] = useState("");
  const [sucesso, setSucesso] = useState<{
    nome: string;
    email: string;
    horasCertificado: number;
    esteveDemoday: boolean;
  } | null>(null);

  function toggleAjudou(opcao: string) {
    if (oQueAjudou.includes(opcao)) {
      setOQueAjudou(oQueAjudou.filter((item) => item !== opcao));
    } else {
      if (oQueAjudou.length >= 3) {
        return;
      }
      setOQueAjudou([...oQueAjudou, opcao]);
    }
  }

  function handleOutroChange(texto: string) {
    setOutroAjudou(texto);
    const semOutro = oQueAjudou.filter((opt) => AJUDOU_OPCOES.includes(opt));
    if (texto.trim()) {
      if (semOutro.length < 3) {
        setOQueAjudou([...semOutro, `Outro: ${texto.trim()}`]);
      }
    } else {
      setOQueAjudou(semOutro);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErroMsg("");

    // Validação Seção 1
    if (!nome.trim()) {
      setErroMsg("Preencha seu nome completo.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErroMsg("Digite um e-mail válido.");
      return;
    }
    if (!cursoPeriodo.trim()) {
      setErroMsg("Informe seu curso e período (ou 'comunidade externa').");
      return;
    }

    // Validação Seção 2
    if (nps === null) {
      setErroMsg("Dê sua nota de recomendação de 0 a 10.");
      return;
    }
    if (oQueAjudou.length === 0) {
      setErroMsg("Selecione ao menos 1 item que mais ajudou sua equipe (máximo 3).");
      return;
    }
    if (oQueAjudou.length > 3) {
      setErroMsg("Selecione no máximo 3 opções no item sobre o que mais ajudou.");
      return;
    }
    if (!mentoriaNota) {
      setErroMsg("Avalie como foi a mentoria.");
      return;
    }
    if (!aprendizado.trim()) {
      setErroMsg("Conte o que aprendeu que não aprenderia em sala de aula.");
      return;
    }
    if (!continuarEcohub) {
      setErroMsg("Informe se tem interesse em continuar a ideia no ecohub.");
      return;
    }

    // Validação Seção 3
    if (!depoimento.trim()) {
      setErroMsg("Escreva seu depoimento sobre como foi participar do INOVA SAÚDE.");
      return;
    }
    if (!autorizaDepoimento) {
      setErroMsg("Selecione se podemos usar seu depoimento.");
      return;
    }

    // Validação Seção 4
    if (esteveDemoday === null) {
      setErroMsg("Responda se esteve presente no Demoday de 05/11.");
      return;
    }

    // Validação Seção 5 (se esteve no Demoday)
    if (esteveDemoday) {
      if (!papelDemoday) {
        setErroMsg("Informe se estava em equipe finalista ou na plateia do Demoday.");
        return;
      }
      if (!demodayOrganizacao || !demodayHorario || !demodayFeedbackBanca) {
        setErroMsg("Atribua as notas de 1 a 5 para Organização, Horário e Feedback da Banca.");
        return;
      }
      if (!demodayApresentacao.trim()) {
        setErroMsg("Informe qual apresentação mais chamou sua atenção no Demoday.");
        return;
      }
      if (!demodayGravarVideo) {
        setErroMsg("Informe se topa gravar vídeo de 30 segundos.");
        return;
      }
    }

    setEnviando(true);

    const payload: EvaluationPayload = {
      nome: nome.trim(),
      email: email.trim(),
      cursoPeriodo: cursoPeriodo.trim(),
      nps,
      oQueAjudou,
      mentoriaNota,
      aprendizado: aprendizado.trim(),
      mudancas: mudancas.trim() || undefined,
      continuarEcohub,
      depoimento: depoimento.trim(),
      autorizaDepoimento,
      esteveDemoday,
      papelDemoday: esteveDemoday ? papelDemoday : undefined,
      demodayOrganizacao: esteveDemoday && demodayOrganizacao ? demodayOrganizacao : undefined,
      demodayHorario: esteveDemoday && demodayHorario ? demodayHorario : undefined,
      demodayFeedbackBanca: esteveDemoday && demodayFeedbackBanca ? demodayFeedbackBanca : undefined,
      demodayApresentacao: esteveDemoday ? demodayApresentacao.trim() : undefined,
      demodayGravarVideo: esteveDemoday ? demodayGravarVideo : undefined,
    };

    try {
      const resp = await submitEventEvaluation(payload);
      setSucesso({
        nome: resp.nome,
        email: resp.email,
        horasCertificado: resp.horasCertificado,
        esteveDemoday: Boolean(esteveDemoday),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErroMsg(err.message || "Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="w-full max-w-4xl min-w-0 mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {sucesso ? (
          /* Card de Confirmação de Sucesso */
          <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-10 shadow-lg text-center space-y-6">
            <div className="w-16 h-16 bg-[rgba(11,129,97,0.12)] text-[var(--ok)] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-mono tracking-wider text-[var(--ok)] font-bold">
                Avaliação Concluída
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--fg)]">
                Obrigado, {sucesso.nome}!
              </h1>
              <p className="text-sm sm:text-base text-[var(--fg-2)] max-w-xl mx-auto">
                Sua avaliação do INOVA SAÚDE 2026 foi registrada com sucesso e suas respostas ajudam a aprimorar as próximas edições.
              </p>
            </div>

            {/* Destaque do Certificado */}
            <div className="bg-[var(--bg)] border border-[var(--borda)] rounded-xl p-5 max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center gap-3">
                <Award size={24} className="text-[var(--marca)] shrink-0" />
                <div>
                  <div className="text-xs text-[var(--fg-2)] uppercase font-mono">
                    Certificado Liberado
                  </div>
                  <div className="text-lg font-bold text-[var(--fg)]">
                    {sucesso.horasCertificado} horas de atividades complementares
                  </div>
                </div>
              </div>

              <div className="text-xs text-[var(--fg-2)] border-t border-[var(--borda)] pt-3 space-y-1">
                <p>
                  <strong>Modalidade:</strong> {sucesso.esteveDemoday ? "Etapa Online + Demoday Presencial (16 horas)" : "Etapa Online (8 horas)"}
                </p>
                <p>
                  <strong>E-mail vinculado:</strong> {sucesso.email}
                </p>
              </div>
            </div>

            {/* Acesso ao Portal LSPK Eventos */}
            <div className="max-w-md mx-auto space-y-3 pt-2">
              <a
                href={`https://lspkeventos.com.br/?email=${encodeURIComponent(sucesso.email)}&evento=inova-saude-2026&certificado=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--marca)] text-white font-bold text-sm sm:text-base hover:brightness-110 transition-all shadow-md cursor-pointer"
              >
                <span>Acessar LSPK Eventos para Baixar Certificado</span>
                <ExternalLink size={18} />
              </a>

              <p className="text-xs text-[var(--fg-2)] text-center leading-relaxed">
                Seu certificado oficial com código de validação e QR Code é emitido e autenticado pela plataforma <strong>LSPK Eventos</strong>. Ao clicar no botão, seu e-mail e o evento INOVA SAÚDE 2026 já estarão selecionados para você acessar seus documentos.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--marca)] text-white font-bold text-sm hover:brightness-110 transition-all shadow-sm"
              >
                <Home size={16} />
                <span>Voltar à Página Inicial</span>
              </Link>
              <Link
                href="/programacao"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--surf-2)] text-[var(--fg)] font-semibold text-sm hover:bg-[var(--borda)] transition-all"
              >
                <span>Ver Programação</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          /* Formulário Oficial de Avaliação */
          <div className="space-y-8">
            {/* Topo / Apresentação */}
            <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[rgba(11,66,121,0.1)] text-[var(--marca)]">
                  <Award size={14} />
                  Liberação de Certificado Oficial
                </span>
                <span className="text-xs font-mono text-[var(--fg-2)] flex items-center gap-1">
                  <Clock size={13} />
                  Tempo estimado: 5 minutos
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--fg)]">
                Avaliação INOVA SAÚDE 2026
              </h1>

              <p className="text-sm sm:text-base text-[var(--fg-2)] leading-relaxed">
                Responda às questões abaixo para registrar sua experiência e liberar seu certificado de participação.
              </p>

              {/* Box explicativo das cargas horárias */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--borda)] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(11,129,97,0.12)] text-[var(--ok)] flex items-center justify-center shrink-0 font-bold text-sm">
                    8h
                  </div>
                  <div className="text-xs">
                    <strong className="text-[var(--fg)] block">Etapa Online</strong>
                    <span className="text-[var(--fg-2)]">
                      Certificado de 8 horas para quem participou do projeto e envio.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--borda)] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(11,66,121,0.15)] text-[var(--marca)] flex items-center justify-center shrink-0 font-bold text-sm">
                    16h
                  </div>
                  <div className="text-xs">
                    <strong className="text-[var(--fg)] block">Etapa Online + Demoday</strong>
                    <span className="text-[var(--fg-2)]">
                      Certificado de 16 horas para presentes no evento presencial de 05/11.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagem de Erro Geral */}
            {erroMsg && (
              <div className="p-4 rounded-xl bg-[rgba(179,48,31,0.1)] border border-[var(--erro)] text-[var(--erro)] text-sm flex items-start gap-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <strong>Atenção:</strong> {erroMsg}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-8">
              {/* ========================================================= */}
              {/* SEÇÃO 1: IDENTIFICAÇÃO                                   */}
              {/* ========================================================= */}
              <section className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-[var(--borda)] pb-3">
                  <span className="text-xs font-mono font-bold uppercase text-[var(--marca)] tracking-wider">
                    Seção 1 de 4
                  </span>
                  <h2 className="text-xl font-bold text-[var(--fg)]">
                    Identificação do Participante
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Nome Completo */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-1">
                      Nome completo <span className="text-[var(--erro)]">*</span>
                    </label>
                    <span className="block text-xs text-[var(--fg-2)] mb-2">
                      Preencha exatamente do jeito que deve sair no seu certificado.
                    </span>
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Maria Eduarda Silva"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-[var(--fg)] focus:outline-hidden focus:ring-2 focus:ring-[var(--marca)] text-sm"
                    />
                  </div>

                  {/* E-mail */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-1">
                      E-mail usado na inscrição <span className="text-[var(--erro)]">*</span>
                    </label>
                    <span className="block text-xs text-[var(--fg-2)] mb-2">
                      O certificado será enviado para este endereço.
                    </span>
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemplo@posilondrina.com.br"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-[var(--fg)] focus:outline-hidden focus:ring-2 focus:ring-[var(--marca)] text-sm"
                    />
                  </div>

                  {/* Curso e Período */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-1">
                      Curso e período <span className="text-[var(--erro)]">*</span>
                    </label>
                    <span className="block text-xs text-[var(--fg-2)] mb-2">
                      Se você não é estudante da Universidade Positivo, escreva &quot;comunidade externa&quot;.
                    </span>
                    <input
                      type="text"
                      required
                      value={cursoPeriodo}
                      onChange={(e) => setCursoPeriodo(e.target.value)}
                      placeholder="Ex: Odontologia - 4º período (ou comunidade externa)"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-[var(--fg)] focus:outline-hidden focus:ring-2 focus:ring-[var(--marca)] text-sm"
                    />
                  </div>
                </div>
              </section>

              {/* ========================================================= */}
              {/* SEÇÃO 2: EXPERIÊNCIA                                     */}
              {/* ========================================================= */}
              <section className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-[var(--borda)] pb-3">
                  <span className="text-xs font-mono font-bold uppercase text-[var(--marca)] tracking-wider">
                    Seção 2 de 4
                  </span>
                  <h2 className="text-xl font-bold text-[var(--fg)]">
                    Sua Experiência
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* NPS 0 a 10 */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-1">
                      De 0 a 10, quanto você recomendaria o INOVA SAÚDE a um colega? <span className="text-[var(--erro)]">*</span>
                    </label>
                    <div className="flex justify-between text-xs text-[var(--fg-2)] font-mono mb-2">
                      <span>0 - Não recomendaria</span>
                      <span>10 - Recomendaria muito</span>
                    </div>

                    <div className="grid grid-cols-11 gap-1 sm:gap-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                        const isSelected = nps === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setNps(num)}
                            className={`py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-bold transition-all border ${
                              isSelected
                                ? "bg-[var(--marca)] text-white border-[var(--marca)] shadow-sm scale-105"
                                : "bg-[var(--bg)] text-[var(--fg)] border-[var(--borda)] hover:border-[var(--marca)]"
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* O que mais ajudou sua equipe (até 3) */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-1">
                      O que mais ajudou sua equipe? Marque até 3 opções. <span className="text-[var(--erro)]">*</span>
                    </label>
                    <span className="block text-xs text-[var(--fg-2)] mb-3">
                      Selecionadas: {oQueAjudou.length} de 3
                    </span>

                    <div className="space-y-2">
                      {AJUDOU_OPCOES.map((opcao) => {
                        const isChecked = oQueAjudou.includes(opcao);
                        const isDisabled = !isChecked && oQueAjudou.length >= 3;

                        return (
                          <label
                            key={opcao}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                              isChecked
                                ? "bg-[rgba(11,66,121,0.06)] border-[var(--marca)] font-semibold text-[var(--fg)]"
                                : isDisabled
                                ? "opacity-50 cursor-not-allowed border-[var(--borda)] bg-[var(--bg)]"
                                : "border-[var(--borda)] bg-[var(--bg)] hover:border-[var(--marca-2)]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={isDisabled}
                              onChange={() => toggleAjudou(opcao)}
                              className="w-4 h-4 rounded text-[var(--marca)] border-[var(--borda)] focus:ring-[var(--marca)]"
                            />
                            <span>{opcao}</span>
                          </label>
                        );
                      })}

                      {/* Opção Outro */}
                      <div className="pt-1">
                        <label className="flex items-center gap-3 text-sm text-[var(--fg)] cursor-pointer mb-2">
                          <input
                            type="checkbox"
                            checked={usarOutro}
                            onChange={(e) => {
                              setUsarOutro(e.target.checked);
                              if (!e.target.checked) handleOutroChange("");
                            }}
                            className="w-4 h-4 rounded text-[var(--marca)] border-[var(--borda)] focus:ring-[var(--marca)]"
                          />
                          <span className="font-medium">Outro</span>
                        </label>

                        {usarOutro && (
                          <input
                            type="text"
                            value={outroAjudou}
                            onChange={(e) => handleOutroChange(e.target.value)}
                            placeholder="Descreva o que ajudou..."
                            className="w-full px-4 py-2 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-[var(--fg)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--marca)]"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Como foi a mentoria */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-2">
                      Como foi a mentoria? <span className="text-[var(--erro)]">*</span>
                    </label>
                    <div className="space-y-2">
                      {MENTORIA_OPCOES.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                            mentoriaNota === opt
                              ? "bg-[rgba(11,66,121,0.06)] border-[var(--marca)] font-semibold text-[var(--fg)]"
                              : "border-[var(--borda)] bg-[var(--bg)] hover:border-[var(--marca-2)]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="mentoria"
                            value={opt}
                            checked={mentoriaNota === opt}
                            onChange={(e) => setMentoriaNota(e.target.value)}
                            className="w-4 h-4 text-[var(--marca)] border-[var(--borda)] focus:ring-[var(--marca)]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* O que aprendeu */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-1">
                      O que você aprendeu aqui que não aprenderia em sala de aula? <span className="text-[var(--erro)]">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={aprendizado}
                      onChange={(e) => setAprendizado(e.target.value)}
                      placeholder="Compartilhe suas descobertas, trabalho em equipe, prototipagem ou contato com desafios reais..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-[var(--fg)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--marca)]"
                    />
                  </div>

                  {/* O que mudaria (opcional) */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-1">
                      O que você mudaria na próxima edição?
                    </label>
                    <span className="block text-xs text-[var(--fg-2)] mb-2">
                      Sugestões e pontos de melhoria (opcional).
                    </span>
                    <textarea
                      rows={2}
                      value={mudancas}
                      onChange={(e) => setMudancas(e.target.value)}
                      placeholder="Prazos, oficinas, comunicação, temas ou formatos..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-[var(--fg)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--marca)]"
                    />
                  </div>

                  {/* Quer continuar com a ideia no ecohub */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-2">
                      Quer continuar com a ideia no ecohub? <span className="text-[var(--erro)]">*</span>
                    </label>
                    <div className="space-y-2">
                      {CONTINUAR_ECOHUB_OPCOES.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                            continuarEcohub === opt
                              ? "bg-[rgba(11,66,121,0.06)] border-[var(--marca)] font-semibold text-[var(--fg)]"
                              : "border-[var(--borda)] bg-[var(--bg)] hover:border-[var(--marca-2)]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="continuarEcohub"
                            value={opt}
                            checked={continuarEcohub === opt}
                            onChange={(e) => setContinuarEcohub(e.target.value)}
                            className="w-4 h-4 text-[var(--marca)] border-[var(--borda)] focus:ring-[var(--marca)]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ========================================================= */}
              {/* SEÇÃO 3: SEU DEPOIMENTO                                  */}
              {/* ========================================================= */}
              <section className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-[var(--borda)] pb-3">
                  <span className="text-xs font-mono font-bold uppercase text-[var(--marca)] tracking-wider">
                    Seção 3 de 4
                  </span>
                  <h2 className="text-xl font-bold text-[var(--fg)]">
                    Seu Depoimento
                  </h2>
                  <p className="text-xs text-[var(--fg-2)] mt-1">
                    Alguns depoimentos vão aparecer na divulgação da próxima edição do INOVA SAÚDE.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-1">
                      Em 2 ou 3 frases, conte como foi participar do INOVA SAÚDE <span className="text-[var(--erro)]">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={depoimento}
                      onChange={(e) => setDepoimento(e.target.value)}
                      placeholder="Descreva sua experiência, superação de desafios ou sensação de ver a ideia nascer..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-[var(--fg)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--marca)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-2">
                      Podemos usar seu depoimento? <span className="text-[var(--erro)]">*</span>
                    </label>
                    <div className="space-y-2">
                      {AUTORIZA_DEPOIMENTO_OPCOES.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                            autorizaDepoimento === opt
                              ? "bg-[rgba(11,66,121,0.06)] border-[var(--marca)] font-semibold text-[var(--fg)]"
                              : "border-[var(--borda)] bg-[var(--bg)] hover:border-[var(--marca-2)]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="autorizaDepoimento"
                            value={opt}
                            checked={autorizaDepoimento === opt}
                            onChange={(e) => setAutorizaDepoimento(e.target.value)}
                            className="w-4 h-4 text-[var(--marca)] border-[var(--borda)] focus:ring-[var(--marca)]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ========================================================= */}
              {/* SEÇÃO 4: DEMODAY DE 05/11                                */}
              {/* ========================================================= */}
              <section className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-[var(--borda)] pb-3">
                  <span className="text-xs font-mono font-bold uppercase text-[var(--marca)] tracking-wider">
                    Seção 4 de 4
                  </span>
                  <h2 className="text-xl font-bold text-[var(--fg)]">
                    Participação no Demoday
                  </h2>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-[var(--fg)]">
                    Você esteve no Demoday de 05/11, no auditório 108E? <span className="text-[var(--erro)]">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEsteveDemoday(true)}
                      className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        esteveDemoday === true
                          ? "bg-[rgba(11,66,121,0.08)] border-[var(--marca)] ring-2 ring-[var(--marca)]"
                          : "border-[var(--borda)] bg-[var(--bg)] hover:border-[var(--marca-2)]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          esteveDemoday === true
                            ? "bg-[var(--marca)] border-[var(--marca)] text-white"
                            : "border-[var(--borda)]"
                        }`}
                      >
                        {esteveDemoday === true && <Check size={12} />}
                      </div>
                      <div>
                        <strong className="block text-sm text-[var(--fg)]">Sim, estive presente</strong>
                        <span className="text-xs text-[var(--fg-2)]">
                          Libera certificado de 16 horas mediante resposta da seção final.
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEsteveDemoday(false)}
                      className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        esteveDemoday === false
                          ? "bg-[rgba(11,129,97,0.08)] border-[var(--ok)] ring-2 ring-[var(--ok)]"
                          : "border-[var(--borda)] bg-[var(--bg)] hover:border-[var(--marca-2)]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          esteveDemoday === false
                            ? "bg-[var(--ok)] border-[var(--ok)] text-white"
                            : "border-[var(--borda)]"
                        }`}
                      >
                        {esteveDemoday === false && <Check size={12} />}
                      </div>
                      <div>
                        <strong className="block text-sm text-[var(--fg)]">Não estive presente</strong>
                        <span className="text-xs text-[var(--fg-2)]">
                          Libera certificado de 8 horas referente à etapa online.
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Subseção condicional do Demoday (Seção 5) */}
                {esteveDemoday === true && (
                  <div className="pt-6 border-t border-[var(--borda)] space-y-6">
                    <div className="p-3.5 rounded-xl bg-[rgba(11,66,121,0.06)] border border-[rgba(11,66,121,0.18)] text-xs text-[var(--marca)]">
                      <strong>Sobre o Demoday:</strong> Estas respostas confirmam sua presença para a emissão do certificado de 16 horas.
                    </div>

                    {/* Papel no Demoday */}
                    <div>
                      <label className="block text-sm font-bold text-[var(--fg)] mb-2">
                        Você estava em uma equipe finalista ou na plateia? <span className="text-[var(--erro)]">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["Equipe finalista", "Plateia"].map((papel) => (
                          <label
                            key={papel}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                              papelDemoday === papel
                                ? "bg-[rgba(11,66,121,0.06)] border-[var(--marca)] font-semibold text-[var(--fg)]"
                                : "border-[var(--borda)] bg-[var(--bg)] hover:border-[var(--marca-2)]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="papelDemoday"
                            value={papel}
                            checked={papelDemoday === papel}
                            onChange={(e) => setPapelDemoday(e.target.value)}
                            className="w-4 h-4 text-[var(--marca)] border-[var(--borda)] focus:ring-[var(--marca)]"
                          />
                          <span>{papel}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Grid de notas 1 a 5 */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-1">
                      Dê uma nota de 1 a 5 para os aspectos do Demoday <span className="text-[var(--erro)]">*</span>
                    </label>
                    <span className="block text-xs text-[var(--fg-2)] mb-3">
                      1 = Insatisfatório | 5 = Excelente
                    </span>

                    <div className="space-y-3">
                      {/* Organização */}
                      <div className="p-3.5 rounded-xl border border-[var(--borda)] bg-[var(--bg)] space-y-2">
                        <div className="flex justify-between items-center text-sm font-medium text-[var(--fg)]">
                          <span>Organização geral do evento</span>
                          <span className="font-mono text-xs text-[var(--marca)] font-bold">
                            {demodayOrganizacao ? `Nota: ${demodayOrganizacao}` : "Não avaliado"}
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setDemodayOrganizacao(val)}
                              className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                                demodayOrganizacao === val
                                  ? "bg-[var(--marca)] text-white border-[var(--marca)]"
                                  : "bg-[var(--surf)] text-[var(--fg)] border-[var(--borda)] hover:border-[var(--marca)]"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Cumprimento de horário */}
                      <div className="p-3.5 rounded-xl border border-[var(--borda)] bg-[var(--bg)] space-y-2">
                        <div className="flex justify-between items-center text-sm font-medium text-[var(--fg)]">
                          <span>Cumprimento do horário e cronograma</span>
                          <span className="font-mono text-xs text-[var(--marca)] font-bold">
                            {demodayHorario ? `Nota: ${demodayHorario}` : "Não avaliado"}
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setDemodayHorario(val)}
                              className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                                demodayHorario === val
                                  ? "bg-[var(--marca)] text-white border-[var(--marca)]"
                                  : "bg-[var(--surf)] text-[var(--fg)] border-[var(--borda)] hover:border-[var(--marca)]"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Feedback da banca */}
                      <div className="p-3.5 rounded-xl border border-[var(--borda)] bg-[var(--bg)] space-y-2">
                        <div className="flex justify-between items-center text-sm font-medium text-[var(--fg)]">
                          <span>Feedback e comentários da banca avaliadora</span>
                          <span className="font-mono text-xs text-[var(--marca)] font-bold">
                            {demodayFeedbackBanca ? `Nota: ${demodayFeedbackBanca}` : "Não avaliado"}
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setDemodayFeedbackBanca(val)}
                              className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                                demodayFeedbackBanca === val
                                  ? "bg-[var(--marca)] text-white border-[var(--marca)]"
                                  : "bg-[var(--surf)] text-[var(--fg)] border-[var(--borda)] hover:border-[var(--marca)]"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apresentação destaque */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-1">
                      Qual apresentação mais chamou sua atenção, e por quê? <span className="text-[var(--erro)]">*</span>
                    </label>
                    <textarea
                      required={esteveDemoday}
                      rows={3}
                      value={demodayApresentacao}
                      onChange={(e) => setDemodayApresentacao(e.target.value)}
                      placeholder="Nome do projeto, ideia apresentada ou diferencial que te marcou..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-[var(--fg)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--marca)]"
                    />
                  </div>

                  {/* Topa gravar vídeo */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--fg)] mb-2">
                      Topa gravar um vídeo de 30 segundos para divulgar a edição de 2027? <span className="text-[var(--erro)]">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Sim", "Não"].map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                            demodayGravarVideo === opt
                              ? "bg-[rgba(11,66,121,0.06)] border-[var(--marca)] font-semibold text-[var(--fg)]"
                              : "border-[var(--borda)] bg-[var(--bg)] hover:border-[var(--marca-2)]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="demodayGravarVideo"
                            value={opt}
                            checked={demodayGravarVideo === opt}
                            onChange={(e) => setDemodayGravarVideo(e.target.value)}
                            className="w-4 h-4 text-[var(--marca)] border-[var(--borda)] focus:ring-[var(--marca)]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Botão de Envio Principal */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={enviando}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[var(--marca)] to-[var(--marca-2)] text-white font-extrabold text-base hover:brightness-110 active:scale-98 transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enviando ? (
                  <span>Registrando avaliação...</span>
                ) : (
                  <>
                    <Send size={18} />
                    <span>
                      {esteveDemoday === true
                        ? "Enviar Avaliação Oficial (Certificado de 16 horas)"
                        : "Enviar Avaliação Oficial (Certificado de 8 horas)"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
