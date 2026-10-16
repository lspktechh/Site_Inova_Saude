import Link from "next/link";
import { edicao, formulario, site } from "@/lib/config";
import {
  ArrowRight,
  Users,
  Sparkles,
  UserPlus,
  Award,
  ShieldCheck,
  Cpu,
  Activity,
  Stethoscope,
  Compass,
  ChevronDown,
  Route,
  ClipboardList,
  QrCode,
  BadgeCheck,
} from "lucide-react";
import { HeroCountdown } from "@/components/HeroCountdown";

export default function HomePage() {
  const trilhas = (formulario.etapas[0] as any).opcoes || [];
  const eixos = [
    {
      nome: "Infraestrutura em Saúde Digital",
      icone: Cpu,
      cor: "var(--e4)",
      impacto: "Prontuários interoperáveis, segurança de dados clínicos e menos filas.",
      dorExemplo: "Médicos e enfermeiros preenchendo o mesmo dado cadastral em 3 sistemas desconectados.",
    },
    {
      nome: "Saúde Mental e Bem-Estar",
      icone: Activity,
      cor: "var(--e1)",
      impacto: "Prevenção de burnout, acolhimento precoce e suporte psicológico comunitário.",
      dorExemplo: "Altos índices de exaustão e sobrecarga emocional em equipes de enfermagem na UTI.",
    },
    {
      nome: "Logística e Gestão de Serviços de Saúde",
      icone: Stethoscope,
      cor: "var(--e5)",
      impacto: "Giro de leitos ágil, rastreio de medicamentos e menos desperdício.",
      dorExemplo: "Demora de até 40 min para higienizar o leito após a alta hospitalar.",
    },
    {
      nome: "Capacitação e Formação Profissional",
      icone: Compass,
      cor: "var(--e2)",
      impacto: "Simulação realística, materiais interativos e protocolos atualizados.",
      dorExemplo: "Insegurança de alunos recém-formados na calibração de ventiladores mecânicos.",
    },
    {
      nome: "Sustentabilidade e Responsabilidade Digital",
      icone: ShieldCheck,
      cor: "var(--e6)",
      impacto: "Menos descartáveis plásticos e uso ético de tecnologias verdes.",
      dorExemplo: "Tonéis de resíduos descartáveis que poderiam ter adaptadores duráveis e esterilizáveis.",
    },
  ];

  const iconesPasso: Record<string, typeof Route> = {
    trilha: Route,
    formulario: ClipboardList,
    qrcode: QrCode,
    certificado: BadgeCheck,
  };
  const comoFunciona = site.home.como_funciona;
  const passos = comoFunciona.passos;

  return (
    <div className="w-full max-w-full min-w-0 space-y-20 sm:space-y-28 pb-20">
      {/* ──── HERO ──── */}
      <section className="relative overflow-hidden glass-hero text-white py-16 sm:py-24">
        <div className="absolute inset-0 pointer-events-none opacity-15 flex items-center justify-center overflow-hidden">
          <svg className="w-full h-48 stroke-[var(--acao)]" viewBox="0 0 1200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <div className="lg:col-span-7 space-y-7">
            <p className="text-sm font-semibold">
              <span className="text-[var(--acento)]">2ª edição · Londrina</span>
              <span className="text-white/30 mx-2">·</span>
              <span className="text-emerald-400">Inscrições abertas</span>
            </p>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-balance">
              Transforme uma dor real da saúde em <span className="shimmer-text">solução</span>.
            </h1>

            <p className="text-base sm:text-lg text-white/80 max-w-lg leading-relaxed">
              Equipes de 3 a 6 pessoas, de qualquer curso. Traga o problema que você viu no hospital, UBS ou
              clínica, e a gente ajuda a transformar em projeto até o Pitch Final.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/inscricao"
                className="inline-flex items-center justify-center gap-2.5 bg-[var(--acento)] text-[#1e1708] font-bold text-base px-7 py-4 rounded-xl shadow-lg hover:brightness-105 active:scale-95 transition-all"
              >
                Inscrever minha equipe
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/banco-de-talentos"
                className="inline-flex items-center justify-center gap-2 text-white/90 hover:text-white font-medium text-base px-6 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition-all"
              >
                <Users size={18} />
                Banco de Talentos
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroCountdown />
          </div>
        </div>
      </section>

      {/* ──── TRÊS CAMINHOS ──── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="rotulo">Como entrar</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--fg)]">
            Três caminhos de participação
          </h2>
          <p className="text-[var(--fg-2)]">Ninguém fica de fora por não ter grupo formado.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trilhas.map((trilha: any) => {
            const isGroup = trilha.trilha === "equipe_com_ideia";
            const isIdeaOnly = trilha.trilha === "ideia_sem_equipe";
            const cor = isGroup ? "var(--e5)" : isIdeaOnly ? "var(--e4)" : "var(--e1)";
            const Icon = isGroup ? Users : isIdeaOnly ? Sparkles : UserPlus;

            return (
              <Link
                key={trilha.trilha}
                href={`/inscricao?trilha=${trilha.trilha}`}
                className="health-card p-7 flex flex-col gap-5 group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: cor, color: cor === "var(--e1)" ? "#1e1708" : "#fff" }}
                >
                  <Icon size={26} />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold text-[var(--fg)] leading-snug">{trilha.titulo}</h3>
                  <p className="text-sm text-[var(--fg-2)] leading-relaxed">{trilha.descricao}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--fg-2)]">{trilha.estimativa}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-[var(--acao)]">
                    Começar <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ──── 5 EIXOS ──── */}
      <section className="bg-[var(--surf-2)] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="rotulo">Edital nº 4/2026</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--fg)] tracking-tight">
                Os 5 eixos de desafios
              </h2>
            </div>
            <Link
              href="/desafios"
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--marca)] hover:underline whitespace-nowrap"
            >
              Ver desafios detalhados <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {eixos.map((eixo) => {
              const Icon = eixo.icone;
              return (
                <div
                  key={eixo.nome}
                  className="bg-[var(--surf)] rounded-2xl p-5 flex flex-col gap-4 border border-transparent hover:border-[var(--borda)] transition-all"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: eixo.cor, color: ["var(--e1)", "var(--e2)"].includes(eixo.cor) ? "#1e1708" : "#fff" }}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="font-bold text-base text-[var(--fg)] leading-snug">{eixo.nome}</h3>
                    <p className="text-xs text-[var(--fg-2)] leading-relaxed">{eixo.impacto}</p>
                  </div>
                  <details className="expansivel text-xs">
                    <summary className="font-semibold text-[var(--alerta)]">
                      Dor real mapeada
                      <ChevronDown size={14} className="seta" />
                    </summary>
                    <p className="pt-2 text-[var(--fg)] italic leading-snug">“{eixo.dorExemplo}”</p>
                  </details>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── COMO FUNCIONA ──── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="rotulo">{comoFunciona.rotulo}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--fg)]">{comoFunciona.titulo}</h2>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {passos.map((passo, i) => {
            const Icon = iconesPasso[passo.icone] ?? Route;
            return (
              <li key={passo.titulo} className="relative flex flex-col items-center text-center gap-3">
                {i < passos.length - 1 && (
                  <span className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] right-[calc(-50%+2.5rem)] border-t-2 border-dashed border-[var(--borda)]" />
                )}
                <div className="relative w-16 h-16 rounded-full bg-[var(--acao)]/10 text-[var(--acao)] flex items-center justify-center">
                  <Icon size={28} />
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[var(--acao)] text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-[var(--fg)]">{passo.titulo}</h3>
                <p className="text-sm text-[var(--fg-2)] leading-relaxed max-w-[16rem]">{passo.texto}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ──── PREMIAÇÃO ──── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[var(--marca-fundo)] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[var(--acento)] text-[#1e1708] flex items-center justify-center shrink-0">
              <Award size={30} />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold">Premiação para as equipes finalistas</h2>
              <p className="text-sm text-white/75 max-w-xl">{edicao.premiacao.texto_site}</p>
            </div>
          </div>
          <Link
            href="/regulamento"
            className="shrink-0 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all"
          >
            Ver critérios <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
