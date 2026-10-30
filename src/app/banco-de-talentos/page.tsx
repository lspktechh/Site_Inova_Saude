"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { edicao } from "@/lib/config";
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
  Trash2,
  AlertTriangle,
  RefreshCw,
  Settings,
  HelpCircle,
} from "lucide-react";
import {
  getAllLocalInscriptions,
  getTalentPool,
  cancelPublicInscription,
  removeLocalInscription,
  InscriptionResponse,
  TalentPoolTeam,
  TalentPoolCandidate,
} from "@/lib/api";

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
  totalMembros?: number;
  membros?: string[];
  abertaANovos?: boolean;
}

// Mapa de competências para formatação visual inteligente por domínio
const COMPETENCIA_MAP: Record<string, { label: string; cor: string; grupo: string }> = {
  // Saúde
  enfermagem: { label: "Enfermagem", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },
  medicina: { label: "Medicina", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },
  fisioterapia: { label: "Fisioterapia", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },
  psicologia: { label: "Psicologia", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },
  biomedicina: { label: "Biomedicina", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },
  odontologia: { label: "Odontologia", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },
  nutricao: { label: "Nutrição", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },
  saude_coletiva: { label: "Saúde Coletiva & SUS", cor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800", grupo: "saude" },

  // Tecnologia
  frontend: { label: "Front-end Web", cor: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800", grupo: "tech" },
  backend: { label: "Back-end API", cor: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800", grupo: "tech" },
  mobile: { label: "Mobile iOS/Android", cor: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800", grupo: "tech" },
  banco_dados: { label: "Banco de Dados", cor: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800", grupo: "tech" },
  api: { label: "APIs e Integrações", cor: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800", grupo: "tech" },
  ia: { label: "Inteligência Artificial", cor: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800", grupo: "tech" },
  automacao: { label: "Automação", cor: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800", grupo: "tech" },

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
  escrita: { label: "Escrita e Conteúdo", cor: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-800", grupo: "pesquisa" },
};

function formatCompetencia(id: string) {
  if (COMPETENCIA_MAP[id]) return COMPETENCIA_MAP[id];
  return {
    label: id.replace(/_/g, " "),
    cor: "bg-[var(--surf-2)] text-[var(--fg)] border-[var(--borda)]",
    grupo: "geral",
  };
}

export default function BancoDeTalentosPage() {
  const [tab, setTab] = useState<"equipes" | "candidatos">("equipes");
  const [filtroEixo, setFiltroEixo] = useState<string>("todos");
  const [filtroDominio, setFiltroDominio] = useState<string>("todos");
  const [busca, setBusca] = useState<string>("");
  const [carregando, setCarregando] = useState<boolean>(true);

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

  // Modal de gerenciamento / cancelamento de inscrições por engano
  const [modalGerenciar, setModalGerenciar] = useState<boolean>(false);
  const [minhasInscricoes, setMinhasInscricoes] = useState<InscriptionResponse[]>([]);
  const [cancelarProtocolo, setCancelarProtocolo] = useState<string>("");
  const [cancelarEmail, setCancelarEmail] = useState<string>("");
  const [isProcessandoCancelamento, setIsProcessandoCancelamento] = useState<boolean>(false);
  const [msgGerenciamento, setMsgGerenciamento] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  const [equipes, setEquipes] = useState<EquipeComVaga[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);

  // Carrega Banco de Talentos centralizado do servidor (com fallback inteligente)
  const carregarBancoDeTalentos = async () => {
    setCarregando(true);
    try {
      const data = await getTalentPool();
      if (data && (data.equipes.length > 0 || data.candidatos.length > 0)) {
        setEquipes(data.equipes);
        setCandidatos(data.candidatos);
      } else {
        // Fallback local caso o backend esteja temporariamente inacessível
        carregarInscricoesLocais();
      }
    } catch (err) {
      console.warn("Falha ao carregar banco central, usando dados locais:", err);
      carregarInscricoesLocais();
    } finally {
      setCarregando(false);
      setMinhasInscricoes(getAllLocalInscriptions());
    }
  };

  const carregarInscricoesLocais = () => {
    const locais = getAllLocalInscriptions();
    const eqList: EquipeComVaga[] = [];
    const candList: Candidato[] = [];

    locais.forEach((insc) => {
      const fp = insc.ficha_prototipo;
      const isSolo = (insc as any).trilha === "sem_ideia" || !fp;
      if (isSolo) {
        candList.push({
          id: insc.id,
          nome: insc.name,
          email: insc.email,
          curso: "Participante INOVA SAÚDE",
          vinculo: "Aluno / Profissional",
          competencias: fp?.competencias_equipe || [],
          papel: "Disponível para equipe",
          eixoInteresse: fp?.eixo || edicao.eixos_tematicos[0],
        });
      } else if (fp) {
        const teamNameReal = (insc as any).teamName || (insc as any).equipeNome || `${insc.name} Team`;
        eqList.push({
          id: insc.id,
          nome: teamNameReal,
          ideia: fp.funcao || "Solução inovadora em saúde",
          eixo: fp.eixo || edicao.eixos_tematicos[0],
          vagasRestantes: 2,
          competenciasPresentes: fp.competencias_equipe || [],
          faltaNaEquipe: fp.falta_na_equipe && fp.falta_na_equipe.length > 0 ? fp.falta_na_equipe : ["Comunicação e Pitch"],
          liderContato: insc.email,
        });
      }
    });

    setEquipes(eqList);
    setCandidatos(candList);
  };

  useEffect(() => {
    carregarBancoDeTalentos();
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

  // Excluir inscrição criada por engano
  const handleCancelarInscricao = async (id: string, email: string) => {
    if (!confirm(`Deseja realmente cancelar e excluir a inscrição ${id}? Esta ação não pode ser desfeita.`)) {
      return;
    }
    setIsProcessandoCancelamento(true);
    setMsgGerenciamento(null);
    try {
      await cancelPublicInscription(id, email);
      removeLocalInscription(id);
      setMsgGerenciamento({
        tipo: "sucesso",
        texto: "Inscrição removida com sucesso do sistema e deste dispositivo!",
      });
      setMinhasInscricoes(getAllLocalInscriptions());
      await carregarBancoDeTalentos();
    } catch (err: any) {
      setMsgGerenciamento({
        tipo: "erro",
        texto: err?.message || "Não foi possível cancelar. Verifique se o e-mail informado confere com o cadastrado.",
      });
    } finally {
      setIsProcessandoCancelamento(false);
    }
  };

  // Filtragem inteligente de Equipes
  const equipesFiltradas = useMemo(() => {
    return equipes.filter((eq) => {
      const matchEixo = filtroEixo === "todos" ? true : eq.eixo === filtroEixo;
      const matchBusca =
        !busca ||
        eq.nome.toLowerCase().includes(busca.toLowerCase()) ||
        eq.ideia.toLowerCase().includes(busca.toLowerCase()) ||
        (eq.membros && eq.membros.some((m) => m.toLowerCase().includes(busca.toLowerCase()))) ||
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
      {/* ──── HERO DO BANCO DE TALENTOS ──── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 max-w-full px-3 py-1.5 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] text-[11px] sm:text-xs font-mono font-bold tracking-wider">
            <span className="truncate">Pareamento Oficial ao Vivo · 2ª Edição</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={carregarBancoDeTalentos}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--borda)] bg-[var(--surf)] hover:bg-[var(--surf-2)] text-xs text-[var(--fg-2)] hover:text-[var(--fg)] transition-all cursor-pointer font-mono"
              title="Atualizar lista em tempo real"
            >
              <RefreshCw size={13} className={carregando ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setModalGerenciar(true);
                setMsgGerenciamento(null);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-800 dark:text-amber-300 transition-all cursor-pointer"
            >
              <Settings size={13} />
              <span>Gerenciar Inscrições / Cancelar Grupo</span>
            </button>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">
          Banco de Talentos
        </h1>
        <p className="text-base text-[var(--fg-2)] max-w-3xl leading-relaxed">
          Ninguém fica de fora do <strong>INOVA SAÚDE 2026</strong> por não ter grupo. Conecte-se com alunos
          e profissionais de outras áreas (Saúde, Odontologia, Tech, Design e Maker) para formar equipes multidisciplinares completas de 3 a 6 pessoas.
        </p>

        {/* Notificação amigável de sincronização com o banco central */}
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sincronizado diretamente com a base oficial de credenciamento do INOVA SAÚDE.</span>
        </div>
      </div>

      {/* ──── CONTROLES DE BUSCA E FILTROS ──── */}
      <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
        {/* Campo de Busca Rápida */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-2)]" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por equipe, participante, curso, habilidade (ex: Odontologia, 3D, Figma)..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--surf-2)] border border-[var(--borda)] rounded-xl text-sm focus:border-[var(--acao)] focus:outline-hidden"
          />
        </div>

        {/* Linha de Abas e Seletores */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2 border-t border-[var(--borda)]">
          {/* Seletor de Abas */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => setTab("equipes")}
              className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                tab === "equipes"
                  ? "bg-[var(--marca)] text-white shadow-xs"
                  : "bg-[var(--surf-2)] text-[var(--fg-2)] hover:text-[var(--fg)]"
              }`}
            >
              Equipes com Vagas ({equipesFiltradas.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("candidatos")}
              className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                tab === "candidatos"
                  ? "bg-[var(--marca)] text-white shadow-xs"
                  : "bg-[var(--surf-2)] text-[var(--fg-2)] hover:text-[var(--fg)]"
              }`}
            >
              Pessoas Disponíveis ({candidatosFiltrados.length})
            </button>
          </div>

          {/* Filtros Dropdown / Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filtroEixo}
              onChange={(e) => setFiltroEixo(e.target.value)}
              className="w-full sm:w-auto bg-[var(--surf-2)] border border-[var(--borda)] rounded-xl px-3 py-2 text-xs font-mono font-medium focus:outline-hidden"
            >
              <option value="todos">Todos os 5 Eixos Temáticos</option>
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
                className="bg-[var(--surf-2)] border border-[var(--borda)] rounded-xl px-3 py-2 text-xs font-mono font-medium focus:outline-hidden"
              >
                <option value="todos">Todas as Áreas</option>
                <option value="saude">🏥 Saúde & Odontologia</option>
                <option value="tech">💻 Tecnologia & Dev</option>
                <option value="design">🎨 Design & UX</option>
                <option value="maker">🛠️ Maker & 3D</option>
                <option value="gestao">📈 Gestão & Negócios</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* ──── ESTADO DE CARREGAMENTO ──── */}
      {carregando && (
        <div className="py-12 text-center space-y-3">
          <RefreshCw size={28} className="animate-spin text-[var(--marca)] mx-auto" />
          <p className="text-sm font-mono text-[var(--fg-2)]">Sincronizando Banco de Talentos oficial...</p>
        </div>
      )}

      {/* ──── LISTA DE EQUIPES COM VAGAS ──── */}
      {!carregando && tab === "equipes" && (
        <>
          {equipesFiltradas.length === 0 ? (
            <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-12 text-center space-y-3">
              <Users size={40} className="mx-auto text-[var(--fg-2)] opacity-60" />
              <h3 className="text-lg font-bold text-[var(--fg)]">Nenhuma equipe encontrada com estes filtros</h3>
              <p className="text-xs text-[var(--fg-2)] max-w-md mx-auto">
                Tente ajustar os filtros de busca ou eixo temático para encontrar outros grupos formados no evento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipesFiltradas.map((eq) => {
                return (
                  <div
                    key={eq.id}
                    className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-[var(--marca-2)] hover:shadow-md transition-all relative"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--acao)] bg-[var(--acao)]/10 px-3 py-1 rounded-full">
                          {eq.vagasRestantes > 0 ? `${eq.vagasRestantes} vaga(s) restante(s)` : "Equipe Completa"}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--fg-2)] truncate max-w-[130px]">
                          {eq.eixo.split(" ")[0]}...
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-[var(--fg)]">{eq.nome}</h3>
                        <p className="text-xs text-[var(--fg-2)] mt-2 leading-relaxed">
                          "{eq.ideia}"
                        </p>

                        {/* Integrantes já confirmados no time */}
                        {eq.membros && eq.membros.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-[var(--borda)]/60 text-xs">
                            <span className="font-semibold text-[var(--fg)] text-[11px] uppercase tracking-wider block font-mono">
                              Integrantes ({eq.membros.length}):
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {eq.membros.map((m, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] font-medium px-2 py-0.5 rounded bg-[var(--surf-2)] text-[var(--fg)] border border-[var(--borda)]"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Lacunas calculadas que faltam na equipe */}
                      <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-xl space-y-1.5">
                        <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                          ⚠️ O que falta na equipe:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {eq.faltaNaEquipe.map((falta) => (
                            <span
                              key={falta}
                              className="text-[11px] font-semibold bg-white dark:bg-black/30 px-2 py-0.5 rounded border border-amber-500/30 text-amber-900 dark:text-amber-200"
                            >
                              {formatCompetencia(falta).label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-[var(--borda)] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => abrirModal(eq.nome, eq.liderContato, "equipe")}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-[var(--marca)] text-white hover:bg-[var(--marca-2)] transition-colors cursor-pointer"
                      >
                        <Mail size={14} />
                        <span>Pedir para Entrar</span>
                      </button>
                      <span className="text-[11px] text-[var(--fg-2)] font-mono">Contato direto</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ──── LISTA DE CANDIDATOS DISPONÍVEIS ──── */}
      {!carregando && tab === "candidatos" && (
        <>
          {candidatosFiltrados.length === 0 ? (
            <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-12 text-center space-y-3">
              <UserPlus size={40} className="mx-auto text-[var(--fg-2)] opacity-60" />
              <h3 className="text-lg font-bold text-[var(--fg)]">Nenhum candidato encontrado com estes filtros</h3>
              <p className="text-xs text-[var(--fg-2)] max-w-md mx-auto">
                Tente ajustar os filtros de busca ou áreas temáticas para encontrar outros participantes disponíveis.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidatosFiltrados.map((cand) => {
                return (
                  <div
                    key={cand.id}
                    className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-[var(--marca-2)] hover:shadow-md transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[var(--marca)] bg-[var(--surf-2)] px-2.5 py-1 rounded-md">
                          {cand.papel}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Disponível para time" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[var(--fg)]">{cand.nome}</h3>
                        <p className="text-xs font-medium text-[var(--fg-2)]">{cand.curso}</p>
                        {cand.bio && (
                          <p className="text-xs text-[var(--fg-2)] mt-2 italic leading-relaxed">
                            "{cand.bio}"
                          </p>
                        )}
                      </div>

                      {/* Competências com Cores de Domínio */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-[var(--fg-2)] uppercase block">
                          Habilidades Mapeadas:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cand.competencias && cand.competencias.length > 0 ? (
                            cand.competencias.map((comp) => {
                              const fmt = formatCompetencia(comp);
                              return (
                                <span
                                  key={comp}
                                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${fmt.cor}`}
                                >
                                  {fmt.label}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-[11px] text-[var(--fg-2)] italic font-mono">
                              Habilidades abertas / multiárea
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-[var(--borda)] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => abrirModal(cand.nome, cand.email || "contato@inova.com", "candidato")}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-[var(--acao)] text-white hover:brightness-105 transition-all cursor-pointer"
                      >
                        <UserPlus size={14} />
                        <span>Convidar para Time</span>
                      </button>
                      <span className="text-[11px] text-[var(--fg-2)] font-mono">Disponível</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ──── MODAL DE CONTATO / PAREAMENTO RÁPIDO ──── */}
      {modalContato.aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={fecharModal}
              className="absolute right-4 top-4 text-[var(--fg-2)] hover:text-[var(--fg)] p-1 rounded-lg cursor-pointer"
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
                Envie uma mensagem direta para a pessoa de contato para alinhar a entrada na equipe o quanto antes.
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
                className="px-4 py-2 text-xs font-medium text-[var(--fg-2)] hover:text-[var(--fg)] cursor-pointer"
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

      {/* ──── MODAL DE GERENCIAMENTO / CANCELAMENTO DE GRUPOS CRIADOS POR ENGANO ──── */}
      {modalGerenciar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setModalGerenciar(false)}
              className="absolute right-4 top-4 text-[var(--fg-2)] hover:text-[var(--fg)] p-1 rounded-lg cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                Autoatendimento de Inscrições
              </span>
              <h3 className="text-xl font-bold text-[var(--fg)]">
                Gerenciar Inscrições / Cancelar Grupo
              </h3>
              <p className="text-xs text-[var(--fg-2)] leading-relaxed">
                Se você criou um grupo ou inscrição por engano, você pode cancelá-la para que ela saia imediatamente do Banco de Talentos.
              </p>
            </div>

            {msgGerenciamento && (
              <div
                className={`p-3.5 rounded-xl text-xs font-mono border ${
                  msgGerenciamento.tipo === "sucesso"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                    : "bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300"
                }`}
              >
                {msgGerenciamento.texto}
              </div>
            )}

            {/* Inscrições salvas neste navegador */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--fg)] font-mono">
                Inscrições Registradas Neste Aparelho:
              </h4>

              {minhasInscricoes.length === 0 ? (
                <div className="p-4 bg-[var(--surf-2)] rounded-xl border border-[var(--borda)] text-xs text-[var(--fg-2)] font-mono text-center">
                  Nenhuma inscrição armazenada no navegador deste dispositivo.
                </div>
              ) : (
                <div className="space-y-2">
                  {minhasInscricoes.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-[var(--surf-2)] rounded-xl border border-[var(--borda)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-[var(--fg)]">
                          {(item as any).teamName || (item as any).equipeNome || item.name}
                        </div>
                        <div className="text-[11px] font-mono text-[var(--fg-2)]">
                          Protocolo: {item.id.slice(0, 8)}... · E-mail: {item.email}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          disabled={isProcessandoCancelamento}
                          onClick={() => handleCancelarInscricao(item.id, item.email)}
                          className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Cancelar e Excluir</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cancelamento manual por ID e E-mail */}
            <div className="pt-4 border-t border-[var(--borda)] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--fg)] font-mono">
                Ou Cancelar por Protocolo e E-mail:
              </h4>
              <p className="text-[11px] text-[var(--fg-2)]">
                Caso tenha feito a inscrição de outro celular ou computador, digite o UUID da inscrição e o e-mail cadastrado pelo líder:
              </p>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="ID da inscrição (ex: 609fc976-...)"
                  value={cancelarProtocolo}
                  onChange={(e) => setCancelarProtocolo(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--surf-2)] border border-[var(--borda)] rounded-xl text-xs font-mono focus:border-[var(--acao)] focus:outline-hidden"
                />
                <input
                  type="email"
                  placeholder="E-mail cadastrado na inscrição"
                  value={cancelarEmail}
                  onChange={(e) => setCancelarEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--surf-2)] border border-[var(--borda)] rounded-xl text-xs font-mono focus:border-[var(--acao)] focus:outline-hidden"
                />
                <button
                  type="button"
                  disabled={isProcessandoCancelamento || !cancelarProtocolo.trim() || !cancelarEmail.trim()}
                  onClick={() => handleCancelarInscricao(cancelarProtocolo.trim(), cancelarEmail.trim())}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>{isProcessandoCancelamento ? "Processando..." : "Confirmar Cancelamento Oficial"}</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--borda)] flex justify-end">
              <button
                type="button"
                onClick={() => setModalGerenciar(false)}
                className="px-4 py-2 text-xs font-medium text-[var(--fg-2)] hover:text-[var(--fg)] cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──── CHAMADA PARA AÇÃO FINAL ──── */}
      <div className="bg-gradient-to-r from-[#072F56] to-[#041B32] text-white rounded-3xl p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/15">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Ainda não cadastrou seu perfil ou equipe?
          </h3>
          <p className="text-sm text-white/80 max-w-xl">
            Escolha a trilha correspondente no formulário guiado. O sistema publica seu perfil aqui automaticamente para pareamento enquanto as inscrições estiverem abertas.
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
