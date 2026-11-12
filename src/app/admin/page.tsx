"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  Award,
  Users,
  Star,
  MessageSquare,
  Building2,
  Video,
  Clock,
  Trash2,
  ChevronRight,
  X,
  ExternalLink,
  ShieldCheck,
  BarChart3,
  ListOrdered,
  FileSpreadsheet,
} from "lucide-react";
import {
  adminLoginEvaluation,
  getEventEvaluations,
  deleteEventEvaluation,
  EvaluationReport,
  EvaluationItem,
} from "@/lib/api";

export default function AdminEvaluationsPage() {
  const [token, setToken] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  // Dados do relatório
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erroCarregamento, setErroCarregamento] = useState<string>("");

  // Filtros e busca
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterHoras, setFilterHoras] = useState<string>("todos");
  const [filterNps, setFilterNps] = useState<string>("todos");
  const [tabAtiva, setTabAtiva] = useState<"respostas" | "metricas" | "depoimentos" | "certificados">("respostas");

  // Modal de Detalhes
  const [itemSelecionado, setItemSelecionado] = useState<EvaluationItem | null>(null);
  const [copiadoFeedback, setCopiadoFeedback] = useState<string>("");

  // Ao montar, verifica se já existe sessão salva
  useEffect(() => {
    const savedToken = sessionStorage.getItem("inova_eval_admin_token") || localStorage.getItem("inova_eval_admin_token");
    if (savedToken) {
      setToken(savedToken);
      carregarDados(savedToken);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);

    try {
      const resp = await adminLoginEvaluation(emailInput.trim(), passwordInput.trim());
      setToken(resp.token);
      sessionStorage.setItem("inova_eval_admin_token", resp.token);
      sessionStorage.setItem("inova_eval_admin_email", resp.email);
      await carregarDados(resp.token);
    } catch (err: any) {
      setLoginError(err.message || "Credenciais inválidas. Verifique o e-mail e a senha.");
    } finally {
      setLoggingIn(false);
    }
  }

  function handleLogout() {
    setToken("");
    setReport(null);
    sessionStorage.removeItem("inova_eval_admin_token");
    sessionStorage.removeItem("inova_eval_admin_email");
    localStorage.removeItem("inova_eval_admin_token");
  }

  async function carregarDados(authToken?: string) {
    const activeToken = authToken || token;
    if (!activeToken) return;

    setCarregando(true);
    setErroCarregamento("");

    try {
      const data = await getEventEvaluations(activeToken);
      setReport(data);
    } catch (err: any) {
      setErroCarregamento(err.message || "Erro ao carregar dados.");
      if (err.message?.includes("não autorizado") || err.message?.includes("Sessão")) {
        handleLogout();
      }
    } finally {
      setCarregando(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Confirma a exclusão desta avaliação?")) return;
    try {
      await deleteEventEvaluation(id, token);
      if (itemSelecionado?.id === id) setItemSelecionado(null);
      await carregarDados();
    } catch (err: any) {
      alert(err.message || "Erro ao excluir avaliação.");
    }
  }

  function copiarParaTransferencia(texto: string, label: string) {
    navigator.clipboard.writeText(texto);
    setCopiadoFeedback(label);
    setTimeout(() => setCopiadoFeedback(""), 3000);
  }

  // Filtragem de respostas
  const respostasFiltradas = useMemo(() => {
    if (!report?.itens) return [];

    return report.itens.filter((item) => {
      const matchSearch =
        !searchTerm.trim() ||
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cursoPeriodo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchHoras =
        filterHoras === "todos" ||
        (filterHoras === "16" && item.horasCertificado === 16) ||
        (filterHoras === "8" && item.horasCertificado === 8);

      const matchNps =
        filterNps === "todos" ||
        (filterNps === "promotores" && item.nps >= 9) ||
        (filterNps === "neutros" && item.nps >= 7 && item.nps <= 8) ||
        (filterNps === "detratores" && item.nps <= 6);

      return matchSearch && matchHoras && matchNps;
    });
  }, [report, searchTerm, filterHoras, filterNps]);

  // Exportação para CSV
  function exportarCsv() {
    if (!report?.itens || report.itens.length === 0) {
      alert("Nenhuma avaliação disponível para exportação.");
      return;
    }

    const headers = [
      "Data e Hora",
      "Nome Completo",
      "E-mail",
      "Curso e Período",
      "NPS",
      "O que mais ajudou",
      "Mentoria",
      "O que aprendeu",
      "O que mudaria",
      "Continuar no ecohub",
      "Depoimento",
      "Autoriza Depoimento",
      "Esteve no Demoday",
      "Papel no Demoday",
      "Nota Organização",
      "Nota Horário",
      "Nota Feedback Banca",
      "Apresentação Destaque",
      "Gravar Vídeo",
      "Horas Certificado",
    ];

    const rows = report.itens.map((i) => [
      new Date(i.createdAt).toLocaleString("pt-BR"),
      `"${i.nome.replace(/"/g, '""')}"`,
      `"${i.email.replace(/"/g, '""')}"`,
      `"${i.cursoPeriodo.replace(/"/g, '""')}"`,
      i.nps,
      `"${(i.oQueAjudou || []).join("; ").replace(/"/g, '""')}"`,
      `"${i.mentoriaNota.replace(/"/g, '""')}"`,
      `"${(i.aprendizado || "").replace(/"/g, '""')}"`,
      `"${(i.mudancas || "").replace(/"/g, '""')}"`,
      `"${i.continuarEcohub.replace(/"/g, '""')}"`,
      `"${(i.depoimento || "").replace(/"/g, '""')}"`,
      `"${i.autorizaDepoimento.replace(/"/g, '""')}"`,
      i.esteveDemoday ? "Sim" : "Não",
      `"${(i.papelDemoday || "").replace(/"/g, '""')}"`,
      i.demodayOrganizacao || "",
      i.demodayHorario || "",
      i.demodayFeedbackBanca || "",
      `"${(i.demodayApresentacao || "").replace(/"/g, '""')}"`,
      i.demodayGravarVideo || "",
      i.horasCertificado,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `avaliacoes-inova-saude-2026-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Listas de e-mails para certificados
  const emails16h = useMemo(() => {
    return (report?.itens || [])
      .filter((i) => i.horasCertificado === 16)
      .map((i) => `${i.nome} <${i.email}>`)
      .join("\n");
  }, [report]);

  const emails8h = useMemo(() => {
    return (report?.itens || [])
      .filter((i) => i.horasCertificado === 8)
      .map((i) => `${i.nome} <${i.email}>`)
      .join("\n");
  }, [report]);

  /* ========================================================= */
  /* TELA DE LOGIN                                             */
  /* ========================================================= */
  if (!token) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[rgba(11,66,121,0.1)] text-[var(--marca)] flex items-center justify-center mx-auto">
              <Lock size={24} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--fg)] tracking-tight">
              Acesso Administrativo
            </h1>
            <p className="text-xs sm:text-sm text-[var(--fg-2)]">
              Painel de Avaliações e Certificados · INOVA SAÚDE 2026
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-[rgba(179,48,31,0.1)] border border-[var(--erro)] text-[var(--erro)] text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase font-mono text-[var(--fg)] mb-1">
                E-mail institucional
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Digite seu e-mail"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-[var(--fg)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--marca)]"
                />
                <Mail size={16} className="absolute left-3.5 top-3 text-[var(--fg-2)]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase font-mono text-[var(--fg)] mb-1">
                Senha de acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-[var(--fg)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--marca)]"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-[var(--fg-2)]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[var(--fg-2)] hover:text-[var(--fg)]"
                  aria-label="Revelar senha"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 px-4 rounded-xl bg-[var(--marca)] text-white font-bold text-sm hover:brightness-110 active:scale-98 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loggingIn ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Entrar no Painel</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[var(--borda)]">
            <Link href="/" className="text-xs text-[var(--marca)] hover:underline">
              Voltar ao site do evento
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================= */
  /* PAINEL ADMINISTRATIVO AUTENTICADO                         */
  /* ========================================================= */
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col">
      {/* Topo / Barra de Navegação Admin */}
      <header className="sticky top-0 z-30 bg-[var(--surf)] border-b border-[var(--borda)] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-extrabold text-base sm:text-lg text-[var(--marca)] truncate">
              INOVA SAÚDE 2026
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[rgba(11,66,121,0.1)] text-[var(--marca)] shrink-0">
              Admin Avaliações
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {copiadoFeedback && (
              <span className="text-xs font-mono text-[var(--ok)] font-bold hidden sm:inline">
                {copiadoFeedback} copiado!
              </span>
            )}

            <button
              onClick={() => carregarDados()}
              disabled={carregando}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-[var(--borda)] bg-[var(--surf)] text-xs font-medium hover:bg-[var(--surf-2)] flex items-center gap-1.5"
              title="Atualizar dados"
            >
              <RefreshCw size={14} className={carregando ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>

            <button
              onClick={exportarCsv}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[var(--acao)] text-white text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-xs"
              title="Exportar respostas para CSV"
            >
              <FileSpreadsheet size={14} />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-[var(--borda)] text-[var(--erro)] text-xs font-semibold hover:bg-[rgba(179,48,31,0.06)] flex items-center gap-1.5"
              title="Sair do painel"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Banner de Erro se houver */}
        {erroCarregamento && (
          <div className="p-4 rounded-xl bg-[rgba(179,48,31,0.1)] border border-[var(--erro)] text-[var(--erro)] text-sm flex items-center justify-between">
            <span>{erroCarregamento}</span>
            <button
              onClick={() => carregarDados()}
              className="px-3 py-1 bg-[var(--erro)] text-white rounded-lg text-xs font-bold"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* CARDS DE KPIS / MÉTRICAS GERAIS                          */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Total de Respostas */}
          <div className="p-4 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] shadow-xs">
            <span className="text-xs font-mono uppercase text-[var(--fg-2)] block mb-1">
              Total Respostas
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[var(--fg)]">
              {report?.metricas.total ?? 0}
            </div>
            <span className="text-xs text-[var(--fg-2)]">participantes avaliados</span>
          </div>

          {/* NPS Médio */}
          <div className="p-4 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] shadow-xs">
            <span className="text-xs font-mono uppercase text-[var(--fg-2)] block mb-1">
              NPS Médio
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[var(--marca)] flex items-center gap-1.5">
              <span>{report?.metricas.npsMedio ?? 0}</span>
              <span className="text-xs font-normal text-[var(--fg-2)]">/10</span>
            </div>
            <span className="text-xs text-[var(--ok)] font-semibold">
              Score: {report?.metricas.npsScore ?? 0}
            </span>
          </div>

          {/* Certificados 16 Horas */}
          <div className="p-4 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] shadow-xs">
            <span className="text-xs font-mono uppercase text-[var(--fg-2)] block mb-1">
              Demoday (16h)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[var(--marca)]">
              {report?.metricas.horasCertificados.horas16h ?? 0}
            </div>
            <span className="text-xs text-[var(--fg-2)]">presentes presenciais</span>
          </div>

          {/* Certificados 8 Horas */}
          <div className="p-4 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] shadow-xs">
            <span className="text-xs font-mono uppercase text-[var(--fg-2)] block mb-1">
              Online (8h)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[var(--acao)]">
              {report?.metricas.horasCertificados.horas8h ?? 0}
            </div>
            <span className="text-xs text-[var(--fg-2)]">etapa a distância</span>
          </div>

          {/* Média Organização Demoday */}
          <div className="p-4 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] shadow-xs">
            <span className="text-xs font-mono uppercase text-[var(--fg-2)] block mb-1">
              Org. Demoday
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[var(--fg)] flex items-center gap-1">
              <span>{report?.metricas.demoday.mediaOrganizacao ?? "-"}</span>
              <span className="text-xs font-normal text-[var(--fg-2)]">/5</span>
            </div>
            <span className="text-xs text-[var(--fg-2)]">avaliação da banca</span>
          </div>

          {/* Interesse no ecohub */}
          <div className="p-4 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] shadow-xs">
            <span className="text-xs font-mono uppercase text-[var(--fg-2)] block mb-1">
              ecohub
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[var(--acao)]">
              {(report?.metricas.continuarEcohub.preIncubadora ?? 0) +
                (report?.metricas.continuarEcohub.espacoMaker ?? 0)}
            </div>
            <span className="text-xs text-[var(--fg-2)]">querem continuar</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* NAVEGAÇÃO DE ABAS                                         */}
        {/* ========================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--borda)] pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTabAtiva("respostas")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tabAtiva === "respostas"
                  ? "bg-[var(--marca)] text-white shadow-xs"
                  : "bg-[var(--surf)] text-[var(--fg-2)] hover:text-[var(--fg)] border border-[var(--borda)]"
              }`}
            >
              Respostas ({respostasFiltradas.length})
            </button>

            <button
              onClick={() => setTabAtiva("metricas")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tabAtiva === "metricas"
                  ? "bg-[var(--marca)] text-white shadow-xs"
                  : "bg-[var(--surf)] text-[var(--fg-2)] hover:text-[var(--fg)] border border-[var(--borda)]"
              }`}
            >
              Métricas & Rankings
            </button>

            <button
              onClick={() => setTabAtiva("depoimentos")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tabAtiva === "depoimentos"
                  ? "bg-[var(--marca)] text-white shadow-xs"
                  : "bg-[var(--surf)] text-[var(--fg-2)] hover:text-[var(--fg)] border border-[var(--borda)]"
              }`}
            >
              Mural de Depoimentos
            </button>

            <button
              onClick={() => setTabAtiva("certificados")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tabAtiva === "certificados"
                  ? "bg-[var(--marca)] text-white shadow-xs"
                  : "bg-[var(--surf)] text-[var(--fg-2)] hover:text-[var(--fg)] border border-[var(--borda)]"
              }`}
            >
              Emissão de Certificados
            </button>
          </div>

          <Link
            href="/avaliacao"
            target="_blank"
            className="text-xs text-[var(--marca)] hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <span>Abrir formulário de avaliação</span>
            <ExternalLink size={13} />
          </Link>
        </div>

        {/* ========================================================= */}
        {/* ABA 1: RESPOSTAS INDIVIDUAIS                             */}
        {/* ========================================================= */}
        {tabAtiva === "respostas" && (
          <div className="space-y-4">
            {/* Barra de Filtros */}
            <div className="p-4 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome, e-mail ou curso..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-xs text-[var(--fg)] focus:outline-hidden focus:ring-2 focus:ring-[var(--marca)]"
                />
                <Search size={15} className="absolute left-3 top-2.5 text-[var(--fg-2)]" />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterHoras}
                  onChange={(e) => setFilterHoras(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-xs text-[var(--fg)] font-medium"
                >
                  <option value="todos">Certificado: Todos</option>
                  <option value="16">16 Horas (Demoday)</option>
                  <option value="8">8 Horas (Online)</option>
                </select>

                <select
                  value={filterNps}
                  onChange={(e) => setFilterNps(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-xs text-[var(--fg)] font-medium"
                >
                  <option value="todos">NPS: Todos</option>
                  <option value="promotores">Promotores (9 e 10)</option>
                  <option value="neutros">Neutros (7 e 8)</option>
                  <option value="detratores">Detratores (0 a 6)</option>
                </select>
              </div>
            </div>

            {/* Tabela de Resultados */}
            <div className="rounded-2xl border border-[var(--borda)] bg-[var(--surf)] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg)] border-b border-[var(--borda)] font-mono text-[var(--fg-2)] uppercase">
                    <tr>
                      <th className="py-3 px-4">Data/Hora</th>
                      <th className="py-3 px-4">Participante</th>
                      <th className="py-3 px-4">Curso / Período</th>
                      <th className="py-3 px-4 text-center">NPS</th>
                      <th className="py-3 px-4">Mentoria</th>
                      <th className="py-3 px-4 text-center">Demoday</th>
                      <th className="py-3 px-4 text-center">Certificado</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--borda)]">
                    {respostasFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-[var(--fg-2)]">
                          Nenhuma avaliação encontrada com os filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      respostasFiltradas.map((item) => (
                        <tr key={item.id} className="hover:bg-[var(--bg)] transition-colors">
                          <td className="py-3 px-4 font-mono text-[var(--fg-2)]">
                            {new Date(item.createdAt).toLocaleDateString("pt-BR")}{" "}
                            <span className="text-[10px]">
                              {new Date(item.createdAt).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <strong className="text-[var(--fg)] block">{item.nome}</strong>
                            <span className="text-[var(--fg-2)] text-[11px]">{item.email}</span>
                          </td>
                          <td className="py-3 px-4 text-[var(--fg)]">{item.cursoPeriodo}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full font-mono font-bold text-xs ${
                                item.nps >= 9
                                  ? "bg-[rgba(11,129,97,0.15)] text-[var(--ok)]"
                                  : item.nps >= 7
                                  ? "bg-[rgba(248,196,18,0.2)] text-[var(--alerta)]"
                                  : "bg-[rgba(179,48,31,0.15)] text-[var(--erro)]"
                              }`}
                            >
                              {item.nps}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[var(--fg-2)]">{item.mentoriaNota}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                                item.esteveDemoday
                                  ? "bg-[rgba(11,66,121,0.12)] text-[var(--marca)]"
                                  : "bg-[var(--bg)] text-[var(--fg-2)] border border-[var(--borda)]"
                              }`}
                            >
                              {item.esteveDemoday ? "Sim" : "Não"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                                item.horasCertificado === 16
                                  ? "bg-[var(--marca)] text-white"
                                  : "bg-[var(--acao)] text-white"
                              }`}
                            >
                              {item.horasCertificado}h
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            <button
                              onClick={() => setItemSelecionado(item)}
                              className="px-2.5 py-1 rounded-lg bg-[var(--surf-2)] hover:bg-[var(--borda)] text-[var(--fg)] font-semibold text-[11px]"
                            >
                              Ver Ficha
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1 rounded-lg hover:bg-[rgba(179,48,31,0.1)] text-[var(--erro)]"
                              title="Excluir avaliação"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA 2: MÉTRICAS & RANKINGS                                */}
        {/* ========================================================= */}
        {tabAtiva === "metricas" && report && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* O que mais ajudou */}
            <div className="p-6 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[var(--fg)] flex items-center gap-2">
                <BarChart3 size={18} className="text-[var(--marca)]" />
                <span>O que mais ajudou as equipes</span>
              </h3>
              <div className="space-y-3">
                {report.metricas.oQueAjudouRanking.length === 0 ? (
                  <p className="text-xs text-[var(--fg-2)]">Nenhum dado registrado ainda.</p>
                ) : (
                  report.metricas.oQueAjudouRanking.map((item, idx) => {
                    const pct =
                      report.metricas.total > 0
                        ? Math.round((item.contagem / report.metricas.total) * 100)
                        : 0;

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-[var(--fg)]">{item.opcao}</span>
                          <span className="font-mono text-[var(--fg-2)]">
                            {item.contagem} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[var(--bg)] overflow-hidden">
                          <div
                            className="h-full bg-[var(--marca)] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Avaliação do Demoday */}
            <div className="p-6 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[var(--fg)] flex items-center gap-2">
                <Star size={18} className="text-[var(--marca)]" />
                <span>Avaliação do Demoday (Notas 1 a 5)</span>
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] border border-[var(--borda)]">
                  <span className="text-xs font-medium text-[var(--fg)]">Organização geral</span>
                  <span className="text-base font-black text-[var(--marca)] font-mono">
                    {report.metricas.demoday.mediaOrganizacao ?? "-"} / 5
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] border border-[var(--borda)]">
                  <span className="text-xs font-medium text-[var(--fg)]">Cumprimento do horário</span>
                  <span className="text-base font-black text-[var(--marca)] font-mono">
                    {report.metricas.demoday.mediaHorario ?? "-"} / 5
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] border border-[var(--borda)]">
                  <span className="text-xs font-medium text-[var(--fg)]">Feedback da banca</span>
                  <span className="text-base font-black text-[var(--marca)] font-mono">
                    {report.metricas.demoday.mediaFeedbackBanca ?? "-"} / 5
                  </span>
                </div>

                <div className="pt-2 border-t border-[var(--borda)] flex justify-between text-xs text-[var(--fg-2)]">
                  <span>Disponíveis para vídeo 2027:</span>
                  <strong className="text-[var(--ok)] font-mono">
                    {report.metricas.demoday.gravarVideoSim} sim / {report.metricas.demoday.gravarVideoNao} não
                  </strong>
                </div>
              </div>
            </div>

            {/* Continuidade no Ecohub */}
            <div className="p-6 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[var(--fg)] flex items-center gap-2">
                <Building2 size={18} className="text-[var(--acao)]" />
                <span>Continuidade no Ecohub</span>
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-[var(--bg)]">
                  <span>Sim, na pré-incubadora:</span>
                  <strong className="font-mono text-sm text-[var(--fg)]">
                    {report.metricas.continuarEcohub.preIncubadora}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-[var(--bg)]">
                  <span>Sim, no espaço maker:</span>
                  <strong className="font-mono text-sm text-[var(--fg)]">
                    {report.metricas.continuarEcohub.espacoMaker}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-[var(--bg)]">
                  <span>Não agora:</span>
                  <strong className="font-mono text-sm text-[var(--fg-2)]">
                    {report.metricas.continuarEcohub.naoAgora}
                  </strong>
                </div>
              </div>
            </div>

            {/* Distribuição de NPS */}
            <div className="p-6 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[var(--fg)] flex items-center gap-2">
                <Users size={18} className="text-[var(--marca)]" />
                <span>Distribuição de NPS</span>
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-[rgba(11,129,97,0.08)] border border-[rgba(11,129,97,0.2)]">
                  <span className="font-medium text-[var(--ok)]">Promotores (9 e 10):</span>
                  <strong className="font-mono text-sm text-[var(--ok)]">
                    {report.metricas.npsDistribuicao.promotores}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-[rgba(248,196,18,0.08)] border border-[rgba(248,196,18,0.2)]">
                  <span className="font-medium text-[var(--alerta)]">Neutros (7 e 8):</span>
                  <strong className="font-mono text-sm text-[var(--alerta)]">
                    {report.metricas.npsDistribuicao.neutros}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-[rgba(179,48,31,0.08)] border border-[rgba(179,48,31,0.2)]">
                  <span className="font-medium text-[var(--erro)]">Detratores (0 a 6):</span>
                  <strong className="font-mono text-sm text-[var(--erro)]">
                    {report.metricas.npsDistribuicao.detratores}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA 3: MURAL DE DEPOIMENTOS                               */}
        {/* ========================================================= */}
        {tabAtiva === "depoimentos" && report && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--surf)] border border-[var(--borda)] text-xs text-[var(--fg-2)]">
              Use estes depoimentos para a divulgação oficial da edição de 2027. O status de autorização indica se o participante permitiu o uso do nome e curso.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.itens
                .filter((i) => i.depoimento && i.depoimento.trim())
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            item.autorizaDepoimento.includes("com meu nome")
                              ? "bg-[rgba(11,129,97,0.15)] text-[var(--ok)]"
                              : item.autorizaDepoimento.includes("sem meu nome")
                              ? "bg-[rgba(11,66,121,0.15)] text-[var(--marca)]"
                              : "bg-[var(--bg)] text-[var(--fg-2)]"
                          }`}
                        >
                          {item.autorizaDepoimento}
                        </span>
                        <span className="font-mono text-[11px] text-[var(--fg-2)]">
                          NPS: {item.nps}
                        </span>
                      </div>

                      <p className="text-sm text-[var(--fg)] italic leading-relaxed">
                        &quot;{item.depoimento}&quot;
                      </p>
                    </div>

                    <div className="border-t border-[var(--borda)] pt-3 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-[var(--fg)] block">{item.nome}</strong>
                        <span className="text-[var(--fg-2)] text-[11px]">{item.cursoPeriodo}</span>
                      </div>
                      <button
                        onClick={() =>
                          copiarParaTransferencia(
                            `"${item.depoimento}" — ${item.nome}, ${item.cursoPeriodo}`,
                            "Depoimento"
                          )
                        }
                        className="px-2.5 py-1 rounded-lg border border-[var(--borda)] hover:bg-[var(--bg)] text-xs font-semibold flex items-center gap-1"
                      >
                        <Copy size={12} />
                        <span>Copiar</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA 4: EMISSÃO DE CERTIFICADOS                            */}
        {/* ========================================================= */}
        {tabAtiva === "certificados" && report && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lista 16 Horas */}
            <div className="p-6 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[var(--fg)] flex items-center gap-2">
                    <Award size={18} className="text-[var(--marca)]" />
                    <span>Certificados de 16 Horas (Demoday)</span>
                  </h3>
                  <span className="text-xs text-[var(--fg-2)] font-mono">
                    Total: {report.metricas.horasCertificados.horas16h} participantes
                  </span>
                </div>
                <button
                  onClick={() => copiarParaTransferencia(emails16h, "Lista 16h")}
                  className="px-3 py-1.5 rounded-lg bg-[var(--marca)] text-white text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-xs"
                >
                  <Copy size={13} />
                  <span>Copiar Lista</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={12}
                value={emails16h}
                className="w-full p-3 rounded-xl border border-[var(--borda)] bg-[var(--bg)] font-mono text-xs text-[var(--fg)] leading-relaxed focus:outline-hidden"
                placeholder="Nenhum participante elegível ainda."
              />
            </div>

            {/* Lista 8 Horas */}
            <div className="p-6 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[var(--fg)] flex items-center gap-2">
                    <Award size={18} className="text-[var(--acao)]" />
                    <span>Certificados de 8 Horas (Online)</span>
                  </h3>
                  <span className="text-xs text-[var(--fg-2)] font-mono">
                    Total: {report.metricas.horasCertificados.horas8h} participantes
                  </span>
                </div>
                <button
                  onClick={() => copiarParaTransferencia(emails8h, "Lista 8h")}
                  className="px-3 py-1.5 rounded-lg bg-[var(--acao)] text-white text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-xs"
                >
                  <Copy size={13} />
                  <span>Copiar Lista</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={12}
                value={emails8h}
                className="w-full p-3 rounded-xl border border-[var(--borda)] bg-[var(--bg)] font-mono text-xs text-[var(--fg)] leading-relaxed focus:outline-hidden"
                placeholder="Nenhum participante elegível ainda."
              />
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: VISUALIZAÇÃO COMPLETA DA AVALIAÇÃO                */}
      {/* ========================================================= */}
      {itemSelecionado && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.65)] flex items-center justify-center p-4">
          <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-[var(--borda)] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[var(--marca)] font-bold">
                  Ficha Individual de Avaliação
                </span>
                <h2 className="text-xl font-bold text-[var(--fg)]">{itemSelecionado.nome}</h2>
                <span className="text-xs text-[var(--fg-2)]">
                  {itemSelecionado.email} · {itemSelecionado.cursoPeriodo}
                </span>
              </div>
              <button
                onClick={() => setItemSelecionado(null)}
                className="p-1 rounded-lg text-[var(--fg-2)] hover:text-[var(--fg)] hover:bg-[var(--bg)]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[var(--bg)]">
                <div>
                  <span className="text-[var(--fg-2)] block font-mono">Certificado Elegível</span>
                  <strong className="text-sm text-[var(--marca)]">
                    {itemSelecionado.horasCertificado} Horas (
                    {itemSelecionado.esteveDemoday ? "Demoday Presencial" : "Etapa Online"})
                  </strong>
                </div>
                <div>
                  <span className="text-[var(--fg-2)] block font-mono">Nota de Recomendação (NPS)</span>
                  <strong className="text-sm text-[var(--fg)]">{itemSelecionado.nps} de 10</strong>
                </div>
              </div>

              <div>
                <strong className="text-[var(--fg)] block mb-1">O que mais ajudou a equipe:</strong>
                <ul className="list-disc pl-5 text-[var(--fg-2)] space-y-0.5">
                  {itemSelecionado.oQueAjudou.map((op, i) => (
                    <li key={i}>{op}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-[var(--fg)] block mb-1">Avaliação da mentoria:</strong>
                <p className="text-[var(--fg-2)]">{itemSelecionado.mentoriaNota}</p>
              </div>

              <div>
                <strong className="text-[var(--fg)] block mb-1">
                  O que aprendeu que não aprenderia em sala:
                </strong>
                <p className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--borda)] text-[var(--fg)] leading-relaxed">
                  {itemSelecionado.aprendizado}
                </p>
              </div>

              {itemSelecionado.mudancas && (
                <div>
                  <strong className="text-[var(--fg)] block mb-1">O que mudaria na próxima edição:</strong>
                  <p className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--borda)] text-[var(--fg)] leading-relaxed">
                    {itemSelecionado.mudancas}
                  </p>
                </div>
              )}

              <div>
                <strong className="text-[var(--fg)] block mb-1">Interesse de continuidade no ecohub:</strong>
                <p className="text-[var(--fg-2)]">{itemSelecionado.continuarEcohub}</p>
              </div>

              <div>
                <strong className="text-[var(--fg)] block mb-1">Depoimento do participante:</strong>
                <p className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--borda)] text-[var(--fg)] italic leading-relaxed">
                  &quot;{itemSelecionado.depoimento}&quot;
                </p>
                <span className="text-[11px] text-[var(--fg-2)] mt-1 block">
                  Autorização: {itemSelecionado.autorizaDepoimento}
                </span>
              </div>

              {itemSelecionado.esteveDemoday && (
                <div className="pt-3 border-t border-[var(--borda)] space-y-3">
                  <span className="text-xs font-mono font-bold uppercase text-[var(--marca)]">
                    Respostas do Demoday
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <strong>Papel:</strong> {itemSelecionado.papelDemoday}
                    </div>
                    <div>
                      <strong>Organização:</strong> {itemSelecionado.demodayOrganizacao} / 5
                    </div>
                    <div>
                      <strong>Cumprimento Horário:</strong> {itemSelecionado.demodayHorario} / 5
                    </div>
                    <div>
                      <strong>Feedback da Banca:</strong> {itemSelecionado.demodayFeedbackBanca} / 5
                    </div>
                  </div>

                  <div>
                    <strong className="text-[var(--fg)] block mb-1">Apresentação destaque:</strong>
                    <p className="p-2.5 rounded-xl bg-[var(--bg)] text-[var(--fg)]">
                      {itemSelecionado.demodayApresentacao}
                    </p>
                  </div>

                  <div>
                    <strong>Topa gravar vídeo de 30s:</strong> {itemSelecionado.demodayGravarVideo}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[var(--borda)] flex justify-end">
              <button
                onClick={() => setItemSelecionado(null)}
                className="px-4 py-2 rounded-xl bg-[var(--marca)] text-white font-bold text-xs hover:brightness-110"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
