import Link from "next/link";
import { edicao } from "@/lib/config";
import { ArrowRight, Compass, ShieldCheck, Stethoscope, Activity, Cpu, Sparkles, MapPin } from "lucide-react";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* ──── HERO DE DESAFIOS ──── */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] text-xs font-mono font-bold tracking-wider">
          <Sparkles size={14} />
          <span>Áreas de Impacto Prioritárias · Edital nº 4/2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">
          Desafios & Eixos Temáticos
        </h1>
        <p className="text-base text-[var(--fg-2)] max-w-3xl leading-relaxed">
          Cada proposta no <strong>INOVA SAÚDE 2026</strong> deve recortar uma dor real observada na rotina
          assistencial ou operacional de saúde. Conheça as dores reais mapeadas no território para inspirar o projeto da sua equipe.
        </p>
      </div>

      {/* ──── LISTA DOS 5 EIXOS COM DESIGN HOSPITALAR/MAKER ──── */}
      <div className="space-y-8">
        {eixos.map((eixo, idx) => {
          const Icon = eixo.icone;
          return (
            <div
              key={eixo.nome}
              className="bg-[var(--surf)] border border-[var(--borda)] rounded-3xl p-6 sm:p-9 space-y-6 shadow-xs hover:border-[var(--marca-2)] hover:shadow-md transition-all relative overflow-hidden"
            >
              {/* Cabeçalho do Eixo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--borda)] pb-5">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ background: eixo.cor }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[var(--fg-2)] uppercase font-bold">
                        Eixo 0{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surf-2)] text-[var(--fg)] font-semibold">
                        {eixo.badge}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--fg)] mt-0.5">
                      {eixo.nome}
                    </h3>
                  </div>
                </div>

                <Link
                  href={`/inscricao?eixo=${encodeURIComponent(eixo.nome)}`}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[var(--acao)] hover:underline whitespace-nowrap bg-[var(--acao)]/10 px-4 py-2 rounded-xl border border-[var(--acao)]/20"
                >
                  <span>Inscrever Projeto Neste Eixo</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Descrição */}
              <p className="text-sm sm:text-base text-[var(--fg-2)] leading-relaxed">
                {eixo.descricao}
              </p>

              {/* Dores Mapeadas no Território */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-[var(--surf-2)] rounded-2xl p-5 space-y-3 border border-[var(--borda)]/60">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--fg)] font-bold flex items-center gap-1.5">
                    <MapPin size={14} className="text-[var(--marca)]" />
                    <span>Dores Reais Identificadas em Campo:</span>
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-[var(--fg-2)]">
                    {eixo.doresExemplo.map((dor, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-[var(--acao)] font-bold font-mono">›</span>
                        <span className="leading-relaxed">{dor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-600" />
                    <span>Oportunidades de Solução:</span>
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--fg-2)] leading-relaxed">
                    {eixo.oportunidades}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ──── CTA FINAL ──── */}
      <div className="bg-gradient-to-r from-[#072F56] to-[#041B32] text-white rounded-3xl p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/15">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-extrabold text-xl sm:text-2xl text-white">Já identificou um problema em saúde?</h4>
          <p className="text-sm text-white/80 max-w-xl">
            Inicie agora o formulário guiado. Você e sua equipe serão mentorados passo a passo até o protótipo final.
          </p>
        </div>
        <Link
          href="/inscricao"
          className="shrink-0 bg-[var(--acento)] text-[#1e1708] font-bold text-sm px-7 py-3.5 rounded-xl hover:brightness-105 transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <span>Iniciar Inscrição</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
