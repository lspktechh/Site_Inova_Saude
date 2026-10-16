import Link from "next/link";
import { edicao } from "@/lib/config";
import { ArrowRight, Compass, ShieldCheck, Stethoscope, Activity, Cpu } from "lucide-react";

export default function DesafiosPage() {
  const eixos = [
    {
      nome: "Infraestrutura em Saúde Digital",
      icone: Cpu,
      cor: "var(--e4)",
      descricao:
        "Sistemas de prontuário, conectividade, interoperabilidade entre atenção básica e hospitais, segurança da informação e gestão eficiente de dados clínicos no SUS e rede privada.",
      doresExemplo: [
        "Atraso e perda de dados na transição do paciente entre a UBS e o pronto-socorro.",
        "Dificuldade de validação imediata de receitas e prescrições médicas na farmácia pública.",
        "Lentidão no preenchimento de múltiplos sistemas repetitivos por enfermeiros e médicos.",
      ],
    },
    {
      nome: "Saúde Mental e Bem-Estar",
      icone: Activity,
      cor: "var(--e1)",
      descricao:
        "Suporte psicológico, acolhimento precoce, combate ao esgotamento profissional (burnout) em equipes de saúde, promoção de hábitos saudáveis e acompanhamento longitudinal humanizado.",
      doresExemplo: [
        "Altos índices de ansiedade e exaustão em equipes de enfermagem em plantões noturnos.",
        "Falta de canais anônimos e acessíveis de acolhimento psicológico preventivo.",
        "Dificuldade de adesão continuada a tratamentos terapêuticos e farmacológicos.",
      ],
    },
    {
      nome: "Logística e Gestão de Serviços de Saúde",
      icone: Stethoscope,
      cor: "var(--e5)",
      descricao:
        "Gestão de leitos, controle de insumos e medicamentos, otimização de filas cirúrgicas, transporte de amostras biológicas e agilidade no fluxo operacional hospitalar.",
      doresExemplo: [
        "Demora de até 40 minutos entre a liberação da alta do paciente e a higienização do leito.",
        "Desperdício ou falta de medicamentos críticos por ausência de rastreamento de lote em tempo real.",
        "Improviso na fixação de frascos de soro e bombas de infusão nas grades das camas.",
      ],
    },
    {
      nome: "Capacitação e Formação Profissional",
      icone: Compass,
      cor: "var(--e2)",
      descricao:
        "Treinamento contínuo de equipes assistenciais, simulação realística, materiais educativos interativos e atualização rápida em novos protocolos sanitários.",
      doresExemplo: [
        "Equipes recém-formadas com insegurança na montagem e calibração de ventiladores mecânicos.",
        "Treinamentos tradicionais em apostilas estáticas com baixa retenção de protocolos de biossegurança.",
        "Falta de recursos maker e modelos anatômicos de baixo custo para treinamento prático.",
      ],
    },
    {
      nome: "Sustentabilidade e Responsabilidade Digital",
      icone: ShieldCheck,
      cor: "var(--e6)",
      descricao:
        "Redução de resíduos plásticos hospitalares, substituição inteligente de itens descartáveis, eficiência energética e uso ético de tecnologias em benefício do meio ambiente.",
      doresExemplo: [
        "Volume massivo de descartáveis hospitalares de uso único que poderiam ter suportes esterilizáveis.",
        "Descarte incorreto de insumos de saúde e pilhas de equipamentos de monitoramento.",
        "Consumo excessivo de papel em formulários manuais de auditoria sanitária.",
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] text-xs font-mono font-semibold">
          <span>Áreas de Impacto · Edital nº 4/2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">
          Desafios & Eixos Temáticos
        </h1>
        <p className="text-base text-[var(--fg-2)] max-w-3xl leading-relaxed">
          Cada equipe inscrita no <strong>INOVA SAÚDE 2026</strong> deve direcionar sua solução para um dos
          cinco eixos prioritários abaixo. Conheça as dores reais do território para inspirar o projeto da sua equipe.
        </p>
      </div>

      <div className="space-y-8">
        {eixos.map((eixo, idx) => {
          const Icon = eixo.icone;
          return (
            <div
              key={eixo.nome}
              className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs hover:border-[var(--marca-2)] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--borda)] pb-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ background: eixo.cor }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[var(--fg-2)] uppercase">
                      Eixo 0{idx + 1}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[var(--fg)]">
                      {eixo.nome}
                    </h3>
                  </div>
                </div>

                <Link
                  href={`/inscricao?eixo=${encodeURIComponent(eixo.nome)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--acao)] hover:underline font-mono"
                >
                  <span>Propor solução neste eixo</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <p className="text-sm text-[var(--fg-2)] leading-relaxed">
                {eixo.descricao}
              </p>

              <div className="bg-[var(--surf-2)] rounded-xl p-5 space-y-3">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--fg)] font-bold block">
                  Exemplos de Dores Reais Identificadas:
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-[var(--fg-2)]">
                  {eixo.doresExemplo.map((dor, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-[var(--acao)] font-bold font-mono">›</span>
                      <span>{dor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-6">
        <Link
          href="/inscricao"
          className="inline-flex items-center gap-2 bg-[var(--acao)] hover:brightness-105 text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-md transition-all"
        >
          <span>Escolher meu desafio e iniciar inscrição</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
