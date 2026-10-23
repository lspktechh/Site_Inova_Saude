import Link from "next/link";
import { edicao, formulario, dataCurta } from "@/lib/config";
import { ArrowRight, Users, Sparkles, UserPlus, Calendar, Award, CheckCircle2, ShieldCheck, Cpu, Activity, Stethoscope, Compass } from "lucide-react";
import { HeroVideo } from "@/components/HeroVideo";
import { DesafiosAreasSection } from "@/components/DesafiosAreasSection";
import { OdsSection } from "@/components/OdsSection";

export default function HomePage() {
  const trilhas = (formulario.etapas[0] as any).opcoes || [];
  const eixos = [
    {
      nome: "Infraestrutura em Saúde Digital",
      icone: Cpu,
      cor: "var(--e4)",
      impacto: "Prontuários interoperáveis, segurança de dados clínicos e redução de filas de atendimento.",
      dorExemplo: "Médicos e enfermeiros preenchendo o mesmo dado cadastral em 3 sistemas desconectados.",
    },
    {
      nome: "Saúde Mental e Bem-Estar",
      icone: Activity,
      cor: "var(--e1)",
      impacto: "Prevenção de burnout em plantonistas, acolhimento precoce e suporte psicológico comunitário.",
      dorExemplo: "Altos índices de exaustão e sobrecarga emocional em equipes de enfermagem na UTI.",
    },
    {
      nome: "Logística e Gestão de Serviços de Saúde",
      icone: Stethoscope,
      cor: "var(--e5)",
      impacto: "Giro de leitos ágil, rastreamento de medicamentos e eliminação de desperdício hospitalar.",
      dorExemplo: "Demora de até 40 min para higienizar o leito após a alta hospitalar.",
    },
    {
      nome: "Capacitação e Formação Profissional",
      icone: Compass,
      cor: "var(--e2)",
      impacto: "Simulação realística, materiais interativos e atualização rápida em protocolos clínicos.",
      dorExemplo: "Insegurança de alunos recém-formados na calibração de ventiladores mecânicos.",
    },
    {
      nome: "Sustentabilidade e Responsabilidade Digital",
      icone: ShieldCheck,
      cor: "var(--e6)",
      impacto: "Redução de descartáveis plásticos na rotina hospitalar e uso ético de tecnologias verdes.",
      dorExemplo: "Tonéis de resíduos descartáveis que poderiam ter adaptadores duráveis e esterilizáveis.",
    },
  ];

  return (
    <div className="w-full max-w-full min-w-0 space-y-16 sm:space-y-24 pb-20">
      {/* ──── HERO SECTION COM AMBIENTE CLÍNICO-DIGITAL ──── */}
      <section className="relative overflow-hidden glass-hero text-white py-16 sm:py-24 border-b border-white/10">
        {/* Onda ECG estilizada no fundo */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center overflow-hidden">
          <svg
            className="w-full h-48 stroke-[var(--acao)]"
            viewBox="0 0 1200 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,75 L300,75 L320,30 L340,110 L360,20 L380,95 L400,75 L700,75 L720,25 L740,120 L760,15 L780,100 L800,75 L1200,75"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-ecg"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            {/* Informações da edição e status */}
            <div className="flex items-center gap-2.5 max-w-full flex-wrap text-xs sm:text-sm font-mono tracking-wider">
              <span className="text-[var(--acento)] font-bold">2ª edição · Londrina</span>
              <span className="text-white/40">|</span>
              <span className="text-emerald-400 font-bold">Inscrições Abertas</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-balance">
              Transforme uma dor real da saúde em{" "}
              <span className="shimmer-text">solução</span>.
            </h1>

            <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed">
              Equipes de 3 a 6 pessoas, de qualquer curso. Você traz o problema que viu acontecer no hospital, UBS ou clínica; a gente ajuda a transformar em projeto até o Pitch Final.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/inscricao"
                className="inline-flex items-center justify-center gap-2.5 bg-[var(--acento)] text-[#1e1708] font-bold text-base px-7 py-4 rounded-xl shadow-lg hover:brightness-105 active:scale-95 transition-all text-center"
              >
                <span>Inscrever Minha Equipe</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/edital"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium text-base px-6 py-4 rounded-xl border border-white/20 transition-all text-center"
              >
                <span>Ler Edital Oficial</span>
              </Link>
              <Link
                href="/banco-de-talentos"
                className="inline-flex items-center justify-center gap-1.5 text-white/80 hover:text-white font-medium text-sm px-3 py-3 transition-all text-center"
              >
                <Users size={16} />
                <span>Banco de Talentos</span>
              </Link>
            </div>

            {/* Pílulas de datas com ícones */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/10 border border-white/20 text-white/90">
                <Calendar size={13} className="text-[var(--acento)]" />
                <span>Inscrições até 02/11</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/10 border border-white/20 text-white/90">
                <Award size={13} className="text-[var(--acento)]" />
                <span>{edicao.rotulos.evento_final}: 05/11 às 19h (Auditório 108E)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/10 border border-white/20 text-white/90">
                <CheckCircle2 size={13} className="text-[var(--acento)]" />
                <span>Certificados de 8h e 16h</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/10 border border-white/20 text-white/90">
                <Award size={13} className="text-[var(--acento)]" />
                <span>Com premiação (10 finalistas)</span>
              </div>
            </div>
          </div>

          {/* Vídeo Oficial no lugar do Contador de Dias */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <HeroVideo />
          </div>
        </div>
      </section>

      {/* ──── DESAFIOS DAS ÁREAS (Farmácia, Fisioterapia, Enfermagem) COM VÍDEOS E ÍCONES ──── */}
      <DesafiosAreasSection />

      {/* ──── TRÊS FORMAS DE PARTICIPAR (ESTILIZADAS E RESPONSIVAS) ──── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--marca)]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--fg-2)] font-bold">
              Como Funciona a Entrada
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--fg)]">
            Três caminhos de participação
          </h2>
          <p className="text-sm sm:text-base text-[var(--fg-2)] max-w-2xl leading-relaxed">
            O formulário é adaptativo: a trilha que você escolher renderiza apenas o que faz sentido para você.
            Ninguém fica de fora por não ter grupo formado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trilhas.map((trilha: any, idx: number) => {
            const isGroup = trilha.trilha === "equipe_com_ideia";
            const isIdeaOnly = trilha.trilha === "ideia_sem_equipe";

            const accentColor = isGroup ? "var(--e5)" : isIdeaOnly ? "var(--e4)" : "var(--e1)";
            const Icon = isGroup ? Users : isIdeaOnly ? Sparkles : UserPlus;

            return (
              <div
                key={trilha.trilha}
                className="health-card p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group"
                style={{ borderTop: `4px solid ${accentColor}` }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-xs font-bold px-2.5 py-1 rounded-md"
                      style={{ background: "var(--surf-2)", color: accentColor }}
                    >
                      Trilha 0{idx + 1}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: "var(--surf-2)" }}
                    >
                      <Icon size={20} style={{ color: accentColor }} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[var(--fg)] leading-snug group-hover:text-[var(--marca)] transition-colors">
                    {trilha.titulo}
                  </h3>

                  <p className="text-sm text-[var(--fg-2)] leading-relaxed">
                    {trilha.descricao}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[var(--borda)] flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--fg-2)]">
                    {trilha.estimativa}
                  </span>
                  <Link
                    href={`/inscricao?trilha=${trilha.trilha}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
                    style={{ color: accentColor }}
                  >
                    <span>Começar</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ──── OS 5 EIXOS TEMÁTICOS COM CONTEXTO REAL ──── */}
      <section className="bg-[var(--surf-2)] py-16 border-y border-[var(--borda)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--marca)] font-bold">
                Edital nº 4/2026 · Áreas Prioritárias
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--fg)] tracking-tight">
                Os 5 Eixos de Desafios da Saúde
              </h2>
              <p className="text-sm sm:text-base text-[var(--fg-2)] max-w-2xl leading-relaxed">
                Você pode propor uma solução em qualquer um dos 5 eixos temáticos abaixo. Conheça as dores reais mapeadas no território.
              </p>
            </div>

            <Link
              href="/desafios"
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--marca)] hover:underline whitespace-nowrap"
            >
              <span>Ver todos os desafios detalhados</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {eixos.map((eixo, i) => {
              const Icon = eixo.icone;
              return (
                <div
                  key={eixo.nome}
                  className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 shadow-xs hover:border-[var(--marca-2)] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                        style={{ background: eixo.cor }}
                      >
                        <Icon size={20} />
                      </div>
                      <span className="font-mono text-xs font-bold text-[var(--fg-2)] uppercase">
                        Eixo 0{i + 1}
                      </span>
                    </div>

                    <h4 className="font-bold text-lg text-[var(--fg)] leading-snug">
                      {eixo.nome}
                    </h4>

                    <p className="text-xs text-[var(--fg-2)] leading-relaxed">
                      {eixo.impacto}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--borda)]/60">
                    <span className="font-mono text-[10px] text-[var(--alerta)] font-semibold uppercase block mb-1">
                      Dor Real Mapeada:
                    </span>
                    <p className="text-xs text-[var(--fg)] italic leading-tight">
                      "{eixo.dorExemplo}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── ODS DA ONU ──── */}
      <OdsSection />

      {/* ──── METODOLOGIA DE DESIGN THINKING & CREDENCIAMENTO ──── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="health-card p-7 sm:p-9 space-y-4 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-[var(--acao)]/10 text-[var(--acao)] flex items-center justify-center">
            <Sparkles size={22} />
          </div>
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--acao)] font-bold block">
            Pedagogia da Inovação
          </span>
          <h3 className="text-2xl font-bold text-[var(--fg)]">
            Formulário que ensina enquanto você preenche
          </h3>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">
            Diferente de formulários comuns que pedem "descreva sua ideia" numa caixa de texto solta, o formulário do INOVA SAÚDE guia você com Design Thinking (Empatizar e Definir) e Lean Inception (É / Não é / Faz / Não faz), mostrando exemplos de "Assim funciona" e "Assim não" campo a campo.
          </p>
          <div className="pt-3 flex flex-wrap gap-2 text-xs font-mono text-[var(--fg)]">
            <span className="bg-[var(--surf-2)] px-2.5 py-1 rounded-md border border-[var(--borda)]">💡 Rascunho salvo a cada campo</span>
            <span className="bg-[var(--surf-2)] px-2.5 py-1 rounded-md border border-[var(--borda)]">⏱ ~18 minutos</span>
          </div>
        </div>

        <div className="health-card p-7 sm:p-9 space-y-4 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-[var(--marca)]/10 text-[var(--marca)] flex items-center justify-center">
            <CheckCircle2 size={22} />
          </div>
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--marca)] font-bold block">
            Credenciamento Digital em Tempo Real
          </span>
          <h3 className="text-2xl font-bold text-[var(--fg)]">
            QR Code Oficial & Controle de Presença
          </h3>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">
            Ao finalizar a inscrição, o participante recebe seu voucher com QR Code. As mentorias ocorrem a distância pelo WhatsApp e e-mail cadastrados. O envio dos links de protótipo e vídeo é feito até 02/11. No dia {dataCurta(edicao.datas.pitch_final.data)}, os 10 finalistas apresentam-se no Demoday (Auditório 108E, Bloco E, UP Londrina). Certificado de 8h pelo cumprimento dos requisitos e de 16h para quem comparecer ao evento.
          </p>
          <div className="pt-3 flex items-center gap-3">
            <Link
              href="/inscricao"
              className="text-sm font-bold text-[var(--acao)] hover:underline inline-flex items-center gap-1.5"
            >
              <span>Ir para o formulário de inscrição</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ──── BANNER DE PREMIAÇÃO OFICIAL ──── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[var(--marca-fundo)] text-white rounded-3xl p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border border-white/15 relative overflow-hidden">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[var(--acento)] text-[#1e1708] flex items-center justify-center shrink-0 shadow-md">
              <Award size={30} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl sm:text-2xl font-extrabold text-white">Haverá premiação para as equipes finalistas</h4>
              <p className="text-sm text-white/80 max-w-2xl leading-relaxed">
                {edicao.premiacao.texto_site}
              </p>
            </div>
          </div>
          <Link
            href="/regulamento"
            className="shrink-0 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider px-5 py-3 rounded-xl border border-white/25 transition-all text-center"
          >
            Ver Rúbrica & Critérios
          </Link>
        </div>
      </section>
    </div>
  );
}
