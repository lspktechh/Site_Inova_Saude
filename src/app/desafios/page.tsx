import Link from "next/link";
import { edicao } from "@/lib/config";
import { ArrowRight, Compass, ShieldCheck, Stethoscope, Activity, Cpu, Lightbulb, ChevronDown } from "lucide-react";

export default function DesafiosPage() {
  const eixos = [
    {
      nome: "Infraestrutura em Saúde Digital",
      icone: Cpu,
      cor: "var(--e4)",
      badge: "Sistemas & Dados Clínicos",
      descricao:
        "Sistemas de prontuário, conectividade, interoperabilidade entre atenção básica e hospitais, segurança da informação e gestão eficiente de dados clínicos no SUS e rede privada.",
      doresExemplo: [
        "Atraso e perda de dados na transição do paciente entre a UBS e o pronto-socorro.",
        "Dificuldade de validação imediata de receitas e prescrições médicas na farmácia pública.",
        "Lentidão no preenchimento de múltiplos sistemas repetitivos por enfermeiros e médicos.",
      ],
      oportunidades: "Prontuários integrados, automação de triagem, apps de prescrição segura e interoperabilidade.",
    },
    {
      nome: "Saúde Mental e Bem-Estar",
      icone: Activity,
      cor: "var(--e1)",
      badge: "Cuidado Humanizado & Equipes",
      descricao:
        "Suporte psicológico, acolhimento precoce, combate ao esgotamento profissional (burnout) em equipes de saúde, promoção de hábitos saudáveis e acompanhamento longitudinal humanizado.",
      doresExemplo: [
        "Altos índices de ansiedade e exaustão em equipes de enfermagem em plantões noturnos.",
        "Falta de canais anônimos e acessíveis de acolhimento psicológico preventivo.",
        "Dificuldade de adesão continuada a tratamentos terapêuticos e farmacológicos.",
      ],
      oportunidades: "Plataformas de escuta qualificada, bots de suporte emocional e monitoramento de estresse.",
    },
    {
      nome: "Logística e Gestão de Serviços de Saúde",
      icone: Stethoscope,
      cor: "var(--e5)",
      badge: "Operações & Leitos",
      descricao:
        "Gestão de leitos, controle de insumos e medicamentos, otimização de filas cirúrgicas, transporte de amostras biológicas e agilidade no fluxo operacional hospitalar.",
      doresExemplo: [
        "Demora de até 40 minutos entre a liberação da alta do paciente e a higienização do leito.",
        "Desperdício ou falta de medicamentos críticos por ausência de rastreamento de lote em tempo real.",
        "Improviso na fixação de frascos de soro e bombas de infusão nas grades das camas.",
      ],
      oportunidades: "Dispositivos adaptadores 3D para grades/soro, rastreamento RFID/QR de bolsas de sangue e kits cirúrgicos.",
    },
    {
      nome: "Capacitação e Formação Profissional",
      icone: Compass,
      cor: "var(--e2)",
      badge: "Simulação & Maker",
      descricao:
        "Treinamento contínuo de equipes assistenciais, simulação realística, materiais educativos interativos e atualização rápida em novos protocolos sanitários.",
      doresExemplo: [
        "Equipes recém-formadas com insegurança na montagem e calibração de ventiladores mecânicos.",
        "Treinamentos tradicionais em apostilas estáticas com baixa retenção de protocolos de biossegurança.",
        "Falta de recursos maker e modelos anatômicos de baixo custo para treinamento prático.",
      ],
      oportunidades: "Simuladores anatômicos impressos em 3D de baixo custo, realidade aumentada e guias interativos.",
    },
    {
      nome: "Sustentabilidade e Responsabilidade Digital",
      icone: ShieldCheck,
      cor: "var(--e6)",
      badge: "Economia Circular & Ética",
      descricao:
        "Redução de resíduos plásticos hospitalares, substituição inteligente de itens descartáveis, eficiência energética e uso ético de tecnologias em benefício do meio ambiente.",
      doresExemplo: [
        "Volume massivo de descartáveis hospitalares de uso único que poderiam ter suportes esterilizáveis.",
        "Descarte incorreto de insumos de saúde e pilhas de equipamentos de monitoramento.",
        "Consumo excessivo de papel em formulários manuais de auditoria sanitária.",
      ],
      oportunidades: "Materiais biodegradáveis, peças reutilizáveis autoclaváveis e processos sem papel.",
    },
  ];

  return (
    <div className="w-full max-w-5xl min-w-0 mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10 sm:space-y-14">
      {/* ──── CABEÇALHO ──── */}
      <div className="space-y-3 max-w-2xl">
        <span className="rotulo">Edital nº 4/2026</span>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">Desafios & eixos</h1>
        <p className="text-base text-[var(--fg-2)] leading-relaxed">
          Cada proposta recorta uma dor real da rotina de saúde. Use as dores mapeadas abaixo como inspiração.
        </p>
      </div>

      {/* ──── EIXOS ──── */}
      <div className="space-y-4">
        {eixos.map((eixo, idx) => {
          const Icon = eixo.icone;
          return (
            <details
              key={eixo.nome}
              open={idx === 0}
              className="expansivel group bg-[var(--surf)] border border-[var(--borda)] rounded-2xl overflow-hidden"
              style={{ borderLeft: `5px solid ${eixo.cor}` }}
            >
              <summary className="p-5 sm:p-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: eixo.cor, color: ["var(--e1)", "var(--e2)"].includes(eixo.cor) ? "#1e1708" : "#fff" }}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-[var(--fg-2)]">
                      Eixo {idx + 1} · {eixo.badge}
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[var(--fg)] leading-snug">{eixo.nome}</h2>
                  </div>
                </div>
                <ChevronDown size={20} className="seta text-[var(--fg-2)]" />
              </summary>

              <div className="px-5 sm:px-6 pb-6 space-y-5 sm:pl-[5.5rem]">
                <p className="text-sm sm:text-base text-[var(--fg-2)] leading-relaxed">{eixo.descricao}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2.5">
                    <h3 className="text-sm font-bold text-[var(--fg)]">Dores reais em campo</h3>
                    <ul className="space-y-2 text-sm text-[var(--fg-2)]">
                      {eixo.doresExemplo.map((dor, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: eixo.cor }} />
                          <span className="leading-relaxed">{dor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="text-sm font-bold text-[var(--fg)] flex items-center gap-1.5">
                      <Lightbulb size={15} className="text-[var(--acao)]" />
                      Oportunidades
                    </h3>
                    <p className="text-sm text-[var(--fg-2)] leading-relaxed">{eixo.oportunidades}</p>
                  </div>
                </div>

                <Link
                  href={`/inscricao?eixo=${encodeURIComponent(eixo.nome)}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[var(--acao)] hover:underline"
                >
                  Inscrever projeto neste eixo <ArrowRight size={15} />
                </Link>
              </div>
            </details>
          );
        })}
      </div>

      {/* ──── CTA FINAL ──── */}
      <div className="bg-[var(--marca-fundo)] text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="font-extrabold text-xl sm:text-2xl">Já identificou um problema em saúde?</h2>
          <p className="text-sm text-white/75 max-w-xl">Comece o formulário guiado. Sua equipe é mentorada até o protótipo final.</p>
        </div>
        <Link
          href="/inscricao"
          className="shrink-0 bg-[var(--acento)] text-[#1e1708] font-bold text-sm px-7 py-3.5 rounded-xl hover:brightness-105 transition-all inline-flex items-center gap-2 shadow-lg"
        >
          Iniciar inscrição <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
