"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { edicao, competencias, dataCurta } from "@/lib/config";
import {
  Users,
  UserPlus,
  Sparkles,
  ArrowRight,
  Check,
  Search,
  Mail,
  Filter,
  CheckCircle2,
  Calendar,
  MessageSquare,
  X,
  Send,
} from "lucide-react";
import { getAllLocalInscriptions } from "@/lib/api";

interface Candidato {
  id: string;
  nome: string;
  vinculo: string;
  curso: string;
  competencias: string[];
  papel: string;
  eixoInteresse: string;
  email?: string;
  bio?: string;
}

interface EquipeComVaga {
  id: string;
  nome: string;
  ideia: string;
  eixo: string;
  vagasRestantes: number;
  competenciasPresentes: string[];
  faltaNaEquipe: string[];
  liderContato: string;
}

// Mapa de competências para formatação visual inteligente por domínio
const COMPETENCIA_MAP: Record<string, { label: string; cor: string; grupo: string }> = {
  // Saúde
  enfermagem: { label: "Enfermagem", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },
  medicina: { label: "Medicina", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },
  fisioterapia: { label: "Fisioterapia", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },
  psicologia: { label: "Psicologia", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },
  biomedicina: { label: "Biomedicina", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },
  nutricao: { label: "Nutrição", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },
  saude_coletiva: { label: "Saúde Coletiva & SUS", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },

  // Tecnologia
  frontend: { label: "Front-end Web", cor: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800", grupo: "tech" },
  backend: { label: "Back-end API", cor: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800", grupo: "tech" },
  mobile: { label: "Mobile iOS/Android", cor: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800", grupo: "tech" },
  banco_dados: { label: "Banco de Dados", cor: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800", grupo: "tech" },
  api: { label: "APIs e Integrações", cor: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800", grupo: "tech" },
  ia: { label: "Inteligência Artificial", cor: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800", grupo: "tech" },

  // Design
  ux: { label: "UX Research", cor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800", grupo: "design" },
  ui: { label: "UI Design", cor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800", grupo: "design" },
  figma: { label: "Figma Prototipagem", cor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800", grupo: "design" },
  design_grafico: { label: "Design Gráfico", cor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800", grupo: "design" },

  // Maker & Hardware
  cad: { label: "Modelagem 3D CAD", cor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800", grupo: "maker" },
  operacao_impressora: { label: "Impressão 3D FDM", cor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800", grupo: "maker" },
  corte_laser: { label: "Corte Laser / CNC", cor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800", grupo: "maker" },
  eletronica: { label: "Eletrônica & Arduino", cor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800", grupo: "maker" },
  prototipagem_fisica: { label: "Prototipagem Física", cor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800", grupo: "maker" },

  // Gestão & Comunicação
  pitch: { label: "Apresentação & Pitch", cor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800", grupo: "gestao" },
  gestao_projetos: { label: "Gestão de Projetos", cor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800", grupo: "gestao" },
  entrevista: { label: "Entrevistas com Pacientes", cor: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-800", grupo: "pesquisa" },
};

function formatCompetencia(id: string) {
  if (COMPETENCIA_MAP[id]) return COMPETENCIA_MAP[id];
  return {
    label: id.replace(/_/g, " "),
    cor: "bg-[var(--surf-2)] text-[var(--fg)] border-[var(--borda)]",
    grupo: "geral",
  };
}

const CANDIDATOS_INICIAIS: Candidato[] = [
  {
    id: "cand-1",
    nome: "Mariana Silva Costa",
    vinculo: "Aluno de graduação",
    curso: "Enfermagem · 4º ano (UP)",
    competencias: ["enfermagem", "saude_coletiva", "entrevista"],
    papel: "Pesquisar o problema e validar com pacientes",
    eixoInteresse: "Infraestrutura em Saude Digital",
    email: "mariana.costa@up.edu.br",
    bio: "Vivência em estágio hospitalar de clínica médica. Conheço na prática o fluxo de prescrição e triagem.",
  },
  {
    id: "cand-2",
    nome: "Lucas Ferreira Lima",
    vinculo: "Aluno de graduação",
    curso: "Engenharia de Software · 3º ano",
    competencias: ["frontend", "backend", "mobile", "api"],
    papel: "Construir a solução de software",
    eixoInteresse: "Logistica e Gestao de Servicos de Saude",
    email: "lucas.flima@gmail.com",
    bio: "Desenvolvo em React, Next.js e Node.js. Busco equipe que precise transformar ideia de software em protótipo real.",
  },
  {
    id: "cand-3",
    nome: "Beatriz Oliveira Duarte",
    vinculo: "Aluno de pós-graduação",
    curso: "Design de Interação & UX",
    competencias: ["ux", "ui", "figma", "design_grafico"],
    papel: "Desenhar a experiência e telas no Figma",
    eixoInteresse: "Saude Mental e Bem-Estar",
    email: "beatriz.ux@outlook.com",
    bio: "Especialista em design centrado no ser humano. Posso desenhar telas navegáveis prontas para teste com usuários.",
  },
  {
    id: "cand-4",
    nome: "Guilherme Santos",
    vinculo: "Comunidade externa",
    curso: "Makerspace Londrina · Prototipagem",
    competencias: ["cad", "operacao_impressora", "corte_laser", "prototipagem_fisica"],
    papel: "Construir peça física em 3D",
    eixoInteresse: "Logistica e Gestao de Servicos de Saude",
    email: "guilherme.maker@londrina.org",
    bio: "Opero impressoras 3D FDM e corte a laser. Sei modelar peças no SolidWorks e Fusion 360 respeitando encaixes.",
  },
  {
    id: "cand-5",
    nome: "Carolina Mendes",
    vinculo: "Profissional de saúde",
    curso: "Hospital Universitário · Fisioterapia",
    competencias: ["fisioterapia", "saude_coletiva", "gestao_projetos"],
    papel: "Coordenar a equipe e validar usabilidade clínica",
    eixoInteresse: "Capacitacao e Formacao Profissional",
    email: "carolina.fisioterapia@hu.uel.br",
    bio: "Atuação em reabilitação motora e leitos hospitalares. Quero contribuir com dores reais da ergonomia assistencial.",
  },
];

const EQUIPES_INICIAIS: EquipeComVaga[] = [
  {
    id: "eq-1",
    nome: "Pulso Rápido",
    ideia: "Dispositivo adaptador impresso em 3D para fixação e transporte seguro de bombas de infusão em leitos de emergência.",
    eixo: "Logistica e Gestao de Servicos de Saude",
    vagasRestantes: 2,
    competenciasPresentes: ["enfermagem", "frontend"],
    faltaNaEquipe: ["Modelagem 3D (CAD)", "Operação de impressora 3D", "UI/UX Figma"],
    liderContato: "marcelo.enfermagem@up.edu.br",
  },
  {
    id: "eq-2",
    nome: "AcolheMais",
    ideia: "Plataforma de acolhimento precoce e escuta qualificada para profissionais de enfermagem com triagem humanizada.",
    eixo: "Saude Mental e Bem-Estar",
    vagasRestantes: 1,
    competenciasPresentes: ["psicologia", "medicina", "figma"],
    faltaNaEquipe: ["Desenvolvimento Back-end", "Banco de dados e API"],
    liderContato: "gabriela.psico@up.edu.br",
  },
  {
    id: "eq-3",
    nome: "DoseCerta Digital",
    ideia: "Validador automático de prescrições hospitalares com reconciliação medicamentosa preventiva.",
    eixo: "Infraestrutura em Saude Digital",
    vagasRestantes: 3,
    competenciasPresentes: ["biomedicina", "backend"],
    faltaNaEquipe: ["UI/UX Figma", "Falar em público (Pitch)", "Enfermagem"],
    liderContato: "felipe.farmacia@up.edu.br",
  },
];

export default function BancoDeTalentosPage() {
  const [tab, setTab] = useState<"equipes" | "candidatos">("equipes");
  const [filtroEixo, setFiltroEixo] = useState<string>("todos");
  const [filtroDominio, setFiltroDominio] = useState<string>("todos");
  const [busca, setBusca] = useState<string>("");
  const [conviteEnviado, setConviteEnviado] = useState<Record<string, boolean>>({});

  // Modal de contato rápido
  const [modalContato, setModalContato] = useState<{
    aberto: boolean;
    destinatarioNome: string;
    destinatarioEmail: string;
    tipo: "equipe" | "candidato";
  }>({
    aberto: false,
    destinatarioNome: "",
    destinatarioEmail: "",
    tipo: "equipe",
  });

  const [equipes, setEquipes] = useState<EquipeComVaga[]>(EQUIPES_INICIAIS);
  const [candidatos, setCandidatos] = useState<Candidato[]>(CANDIDATOS_INICIAIS);

  // Carrega inscrições locais
  useEffect(() => {
    const locais = getAllLocalInscriptions();
    locais.forEach((insc) => {
      if (insc.ficha_prototipo) {
        const fp = insc.ficha_prototipo;
        if (fp.formas && fp.falta_na_equipe) {
          const novaEq: EquipeComVaga = {
            id: insc.id,
            nome: (insc.name ? `${insc.name} Team` : "Equipe Inovadora"),
            ideia: fp.funcao || "Solução inovadora em saúde",
            eixo: fp.eixo || edicao.eixos_tematicos[0],
            vagasRestantes: 2,
            competenciasPresentes: fp.competencias_equipe || [],
            faltaNaEquipe: fp.falta_na_equipe.length > 0 ? fp.falta_na_equipe : ["Comunicação e Pitch"],
            liderContato: insc.email,
          };
          setEquipes((prev) => (prev.some((e) => e.id === insc.id) ? prev : [novaEq, ...prev]));
        }
      }
    });
  }, []);

  const abrirModal = (nome: string, email: string, tipo: "equipe" | "candidato") => {
    setModalContato({
      aberto: true,
      destinatarioNome: nome,
      destinatarioEmail: email,
      tipo,
    });
  };

  const fecharModal = () => {
    setModalContato((prev) => ({ ...prev, aberto: false }));
  };

  // Filtragem inteligente de Equipes
  const equipesFiltradas = useMemo(() => {
    return equipes.filter((eq) => {
      const matchEixo = filtroEixo === "todos" ? true : eq.eixo === filtroEixo;
      const matchBusca =
        !busca ||
        eq.nome.toLowerCase().includes(busca.toLowerCase()) ||
        eq.ideia.toLowerCase().includes(busca.toLowerCase()) ||
        eq.faltaNaEquipe.some((f) => f.toLowerCase().includes(busca.toLowerCase()));
      return matchEixo && matchBusca;
    });
  }, [equipes, filtroEixo, busca]);

  // Filtragem inteligente de Candidatos
  const candidatosFiltrados = useMemo(() => {
    return candidatos.filter((cand) => {
      const matchEixo = filtroEixo === "todos" ? true : cand.eixoInteresse === filtroEixo;
      const matchDominio =
        filtroDominio === "todos"
          ? true
          : cand.competencias.some((c) => COMPETENCIA_MAP[c]?.grupo === filtroDominio);
      const matchBusca =
        !busca ||
        cand.nome.toLowerCase().includes(busca.toLowerCase()) ||
        cand.curso.toLowerCase().includes(busca.toLowerCase()) ||
        cand.competencias.some((c) => c.toLowerCase().includes(busca.toLowerCase()));
      return matchEixo && matchDominio && matchBusca;
    });
  }, [candidatos, filtroEixo, filtroDominio, busca]);

  return (
    <div className="w-full max-w-6xl min-w-0 mx-auto px-3 sm:px-6 py-8 sm:py-16 space-y-8 sm:space-y-10">
      {/* ──── CABEÇALHO ──── */}
      <div className="space-y-3 max-w-2xl">
        <span className="rotulo">Pareamento de participantes</span>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">Banco de Talentos</h1>
        <p className="text-base text-[var(--fg-2)] leading-relaxed">
          Sem grupo? Encontre pessoas de Saúde, Tech, Design e Maker e forme uma equipe de 3 a 6 pessoas.
        </p>
      </div>

      {/* ──── CONTROLES DE BUSCA E FILTROS ──── */}
      <div className="space-y-4">
        {/* Campo de Busca Rápida */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-2)]" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar habilidade ou palavra-chave (ex: Figma, 3D, Enfermagem)"
            className="w-full pl-10 pr-4 py-3 bg-[var(--surf)] border border-[var(--borda)] rounded-xl text-sm focus:border-[var(--acao)] focus:outline-hidden"
          />
        </div>

        {/* Linha de Abas e Seletores */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Seletor de Abas */}
          <div className="grid grid-cols-2 sm:inline-flex gap-1 p-1 bg-[var(--surf-2)] rounded-xl">
            <button
              type="button"
              onClick={() => setTab("equipes")}
              className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                tab === "equipes"
                  ? "bg-[var(--surf)] text-[var(--fg)] shadow-sm"
                  : "text-[var(--fg-2)] hover:text-[var(--fg)]"
              }`}
            >
              Equipes com vaga ({equipesFiltradas.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("candidatos")}
              className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                tab === "candidatos"
                  ? "bg-[var(--surf)] text-[var(--fg)] shadow-sm"
                  : "text-[var(--fg-2)] hover:text-[var(--fg)]"
              }`}
            >
              Pessoas ({candidatosFiltrados.length})
            </button>
          </div>

          {/* Filtros Dropdown / Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filtroEixo}
              onChange={(e) => setFiltroEixo(e.target.value)}
              className="w-full sm:w-auto bg-[var(--surf)] border border-[var(--borda)] rounded-xl px-3 py-2.5 text-sm focus:outline-hidden"
            >
              <option value="todos">Todos os eixos</option>
              {edicao.eixos_tematicos.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            {tab === "candidatos" && (
              <select
                value={filtroDominio}
                onChange={(e) => setFiltroDominio(e.target.value)}
                className="bg-[var(--surf)] border border-[var(--borda)] rounded-xl px-3 py-2.5 text-sm focus:outline-hidden"
              >
                <option value="todos">Todas as áreas</option>
                <option value="saude">🏥 Saúde & Clínica</option>
                <option value="tech">💻 Tecnologia & Dev</option>
                <option value="design">🎨 Design & UX</option>
                <option value="maker">🛠️ Maker & 3D</option>
                <option value="gestao">📈 Gestão & Negócios</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* ──── LISTA DE EQUIPES COM VAGAS ──── */}
      {tab === "equipes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipesFiltradas.map((eq) => {
            const enviado = conviteEnviado[eq.id];
            return (
              <div
                key={eq.id}
                className="health-card p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[var(--acao)] bg-[var(--acao)]/10 px-3 py-1 rounded-full">
                      {eq.vagasRestantes} {eq.vagasRestantes === 1 ? "vaga" : "vagas"}
                    </span>
                    <span className="text-xs text-[var(--fg-2)] truncate max-w-[60%]" title={eq.eixo}>
                      {eq.eixo}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[var(--fg)]">{eq.nome}</h3>
                    <p className="text-sm text-[var(--fg-2)] mt-2 leading-relaxed">{eq.ideia}</p>
                  </div>

                  {/* Lacunas calculadas que faltam na equipe */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[var(--alerta)] block">Procuram</span>
                    <div className="flex flex-wrap gap-1.5">
                      {eq.faltaNaEquipe.map((falta) => (
                        <span
                          key={falta}
                          className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--alerta)]/10 text-[var(--fg)]"
                        >
                          {falta}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => abrirModal(eq.nome, eq.liderContato, "equipe")}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 text-sm font-bold px-4 py-3 rounded-xl bg-[var(--acao)] text-white hover:bg-[var(--acao-hover)] transition-colors cursor-pointer"
                >
                  <Mail size={15} />
                  Pedir para entrar
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ──── LISTA DE CANDIDATOS DISPONÍVEIS ──── */}
      {tab === "candidatos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidatosFiltrados.map((cand) => {
            return (
              <div
                key={cand.id}
                className="health-card p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 shrink-0 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] font-bold flex items-center justify-center">
                      {cand.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[var(--surf)]" title="Disponível para time" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-[var(--fg)] leading-tight">{cand.nome}</h3>
                      <p className="text-xs text-[var(--fg-2)]">{cand.curso}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[var(--marca)]">{cand.papel}</p>
                    {cand.bio && (
                      <p className="text-sm text-[var(--fg-2)] mt-1.5 leading-relaxed">{cand.bio}</p>
                    )}
                  </div>

                  {/* Competências com Cores de Domínio */}
                  <div>
                    <div className="flex flex-wrap gap-1.5">
                      {cand.competencias.map((comp) => {
                        const fmt = formatCompetencia(comp);
                        return (
                          <span
                            key={comp}
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${fmt.cor}`}
                          >
                            {fmt.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => abrirModal(cand.nome, cand.email || "contato@inova.com", "candidato")}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 text-sm font-bold px-4 py-3 rounded-xl bg-[var(--acao)] text-white hover:brightness-105 transition-all cursor-pointer"
                >
                  <UserPlus size={15} />
                  Convidar para o time
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ──── MODAL DE CONTATO / PAREAMENTO RÁPIDO ──── */}
      {modalContato.aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={fecharModal}
              className="absolute right-4 top-4 text-[var(--fg-2)] hover:text-[var(--fg)] p-1 rounded-lg"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--marca)] font-bold">
                Conectar Participantes
              </span>
              <h3 className="text-xl font-bold text-[var(--fg)]">
                {modalContato.tipo === "equipe"
                  ? `Entrar em contato com ${modalContato.destinatarioNome}`
                  : `Convidar ${modalContato.destinatarioNome}`}
              </h3>
              <p className="text-xs text-[var(--fg-2)]">
                Envie uma mensagem direta para a pessoa de contato para alinhar a entrada na equipe antes da oficina do dia 31/10.
              </p>
            </div>

            <div className="p-3.5 bg-[var(--surf-2)] rounded-xl border border-[var(--borda)] space-y-1.5 text-xs font-mono">
              <div className="text-[var(--fg-2)]">Destinatário:</div>
              <div className="font-bold text-[var(--fg)]">{modalContato.destinatarioEmail}</div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--fg)]">Mensagem Padrão Sugerida:</label>
              <textarea
                readOnly
                rows={4}
                className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-xl p-3 text-xs text-[var(--fg-2)] font-mono leading-relaxed"
                value={
                  modalContato.tipo === "equipe"
                    ? `Olá! Vi o projeto da sua equipe "${modalContato.destinatarioNome}" no Banco de Talentos do INOVA SAÚDE 2026. Tenho interesse em preencher uma das vagas abertas para colaborarmos na maratona. Como podemos conversar?`
                    : `Olá ${modalContato.destinatarioNome}! Vimos seu perfil no Banco de Talentos do INOVA SAÚDE 2026 e suas habilidades combinam com o que precisamos na nossa equipe. Gostaríamos de convidar você para participar conosco!`
                }
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--borda)]">
              <button
                type="button"
                onClick={fecharModal}
                className="px-4 py-2 text-xs font-medium text-[var(--fg-2)] hover:text-[var(--fg)]"
              >
                Cancelar
              </button>
              <a
                href={`mailto:${modalContato.destinatarioEmail}?subject=${encodeURIComponent(
                  `INOVA SAÚDE 2026 - Conexão: ${modalContato.destinatarioNome}`
                )}&body=${encodeURIComponent(
                  modalContato.tipo === "equipe"
                    ? `Olá! Vi o projeto da sua equipe no Banco de Talentos do INOVA SAÚDE 2026 e gostaria de me juntar a vocês.`
                    : `Olá ${modalContato.destinatarioNome}! Gostamos do seu perfil no Banco de Talentos do INOVA SAÚDE 2026 e gostaríamos de convidar você para nosso time.`
                )}`}
                onClick={fecharModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--marca)] text-white text-xs font-bold hover:bg-[var(--marca-2)] transition-colors shadow-xs"
              >
                <Send size={14} />
                <span>Abrir e Enviar E-mail</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ──── CHAMADA PARA AÇÃO FINAL ──── */}
      <div className="bg-[var(--marca-fundo)] text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Ainda não cadastrou seu perfil ou equipe?
          </h3>
          <p className="text-sm text-white/80 max-w-xl">
            Escolha sua trilha no formulário; seu perfil aparece aqui para pareamento até {dataCurta(edicao.datas.pareamento.fim)}.
          </p>
        </div>
        <Link
          href="/inscricao"
          className="shrink-0 bg-[var(--acento)] text-[#1e1708] text-sm font-bold px-7 py-3.5 rounded-xl hover:brightness-105 transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <span>Fazer Inscrição Agora</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
