"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Save,
  Users,
  FileEdit,
  Clock,
  History,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  LogOut,
  Info,
} from "lucide-react";
import {
  checkLeaderLogin,
  requestLeaderMagicLink,
  loginWithPassword,
  verifyMagicLink,
  setLeaderPassword,
  getLeaderTeamData,
  updateLeaderTeamData,
} from "@/lib/api";

export default function EditarInscricaoPage() {
  // Estados de Autenticação
  const [authStep, setAuthStep] = useState<"email" | "password" | "magic_sent" | "set_password" | "authenticated">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [magicToken, setMagicToken] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Dados da Equipe em Edição
  const [teamName, setTeamName] = useState("");
  const [liderNome, setLiderNome] = useState("");
  const [membros, setMembros] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"equipe" | "problema" | "solucao" | "metricas" | "artefatos" | "historico">("equipe");

  // Campos Empatizar / Definir
  const [quemVive, setQuemVive] = useState("");
  const [oQuePerde, setOQuePerde] = useState("");
  const [comoSabe, setComoSabe] = useState<string[]>([]);
  const [frequencia, setFrequencia] = useState("");
  const [comoResolvemHoje, setComoResolvemHoje] = useState("");
  const [porQueNaoResolve, setPorQueNaoResolve] = useState("");
  const [eixo, setEixo] = useState("");

  // Campos Idear / Escopo
  const [nomeSolucao, setNomeSolucao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [passo1, setPasso1] = useState("");
  const [passo2, setPasso2] = useState("");
  const [passo3, setPasso3] = useState("");
  const [escopoE, setEscopoE] = useState("");
  const [escopoNaoE, setEscopoNaoE] = useState("");
  const [escopoFaz, setEscopoFaz] = useState("");
  const [escopoNaoFaz, setEscopoNaoFaz] = useState("");

  // Campos Métricas / Fechamento
  const [comoSaberemos, setComoSaberemos] = useState("");
  const [maiorDuvida, setMaiorDuvida] = useState("");

  // Artefatos
  const [prototipoUrl, setPrototipoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [observacoesTrabalho, setObservacoesTrabalho] = useState("");
  const [linksAdicionais, setLinksAdicionais] = useState<{ tipo: string; titulo: string; url: string }[]>([]);

  // Histórico de auditoria da equipe
  const [historicoEdicoes, setHistoricoEdicoes] = useState<any[]>([]);
  const [salvando, setSalvando] = useState(false);

  // 1. Checa se o usuário veio por Magic Link na URL (?token=...&email=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    const emailParam = params.get("email");

    if (tokenParam && emailParam) {
      setEmail(emailParam);
      setMagicToken(tokenParam);
      validarMagicLinkUrl(emailParam, tokenParam);
    } else {
      // Tenta recuperar sessão existente no localStorage
      const savedSession = localStorage.getItem("inova_leader_session");
      const savedEmail = localStorage.getItem("inova_leader_email");
      if (savedSession && savedEmail) {
        setEmail(savedEmail);
        setSessionToken(savedSession);
        carregarDadosEquipe(savedEmail, savedSession);
      }
    }
  }, []);

  async function validarMagicLinkUrl(targetEmail: string, token: string) {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await verifyMagicLink(targetEmail, token);
      if (res.verified) {
        setAuthStep("set_password");
        setSuccessMsg("E-mail verificado com sucesso! Crie uma senha para proteger o acesso à sua equipe.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Link inválido ou expirado. Solicite um novo acesso.");
      setAuthStep("email");
    } finally {
      setLoading(false);
    }
  }

  // 2. Passo 1: Informa o e-mail do líder
  async function handleCheckEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Informe um e-mail válido.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await checkLeaderLogin(email);
      if (!res.exists) {
        setErrorMsg(res.message || "E-mail de líder não encontrado.");
        return;
      }

      setTeamName(res.teamName || "");
      if (res.name) setLiderNome(res.name);

      if (res.hasPassword) {
        // Já tem senha -> Pede a senha
        setAuthStep("password");
        setSuccessMsg(`Bem-vindo de volta! Digite a senha cadastrada para a equipe ${res.teamName}.`);
      } else {
        // Não tem senha -> Enviou o link por e-mail
        setAuthStep("magic_sent");
        setSuccessMsg(res.message || "Link de verificação enviado para o seu e-mail.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao consultar e-mail do líder.");
    } finally {
      setLoading(false);
    }
  }

  // 3. Login com senha
  async function handleLoginPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setErrorMsg("Digite sua senha.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await loginWithPassword(email, password);
      if (res.sessionToken) {
        setSessionToken(res.sessionToken);
        localStorage.setItem("inova_leader_session", res.sessionToken);
        localStorage.setItem("inova_leader_email", email);
        carregarDadosCompletosNoEstado(res.data);
        setAuthStep("authenticated");
        setSuccessMsg("Login realizado com sucesso! Você já pode editar as informações da equipe.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Senha incorreta.");
    } finally {
      setLoading(false);
    }
  }

  // 3b. Esqueci minha senha -> Solicita novo link mágico
  async function handleForgotPassword() {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await requestLeaderMagicLink(email);
      setAuthStep("magic_sent");
      setSuccessMsg(res.message || "Enviamos um novo link de verificação para o seu e-mail.");
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao solicitar novo link.");
    } finally {
      setLoading(false);
    }
  }

  // 4. Criação de senha após magic link
  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg("A senha deve conter no mínimo 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("As senhas digitadas não coincidem.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await setLeaderPassword(email, magicToken, newPassword);
      if (res.sessionToken) {
        setSessionToken(res.sessionToken);
        localStorage.setItem("inova_leader_session", res.sessionToken);
        localStorage.setItem("inova_leader_email", email);
        carregarDadosCompletosNoEstado(res.data);
        setAuthStep("authenticated");
        setSuccessMsg("Senha cadastrada com sucesso! Bem-vindo ao painel da sua equipe.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao cadastrar senha.");
    } finally {
      setLoading(false);
    }
  }

  // 5. Carrega dados via sessão
  async function carregarDadosEquipe(userEmail: string, token: string) {
    setLoading(true);
    try {
      const data = await getLeaderTeamData(userEmail, token);
      carregarDadosCompletosNoEstado(data);
      setAuthStep("authenticated");
    } catch (err) {
      // Sessão expirou
      localStorage.removeItem("inova_leader_session");
      setAuthStep("email");
    } finally {
      setLoading(false);
    }
  }

  function carregarDadosCompletosNoEstado(data: any) {
    if (!data) return;
    setTeamName(data.teamName || "");
    setLiderNome(data.liderNome || "");
    setMembros(Array.isArray(data.membros) ? data.membros : []);

    const emp = data.empatizar || {};
    setQuemVive(emp.quem_vive || "");
    setOQuePerde(emp.o_que_perde || "");
    setComoSabe(Array.isArray(emp.como_sabe) ? emp.como_sabe : []);

    const defn = data.definir || {};
    setFrequencia(defn.frequencia || "");
    setComoResolvemHoje(defn.como_resolvem_hoje || "");
    setPorQueNaoResolve(defn.por_que_nao_resolve || "");
    setEixo(defn.eixo || "");

    const ide = data.idear || {};
    setNomeSolucao(ide.nome_solucao || "");
    setCategoria(ide.categoria || "");
    const passos = Array.isArray(ide.tres_passos) ? ide.tres_passos : [];
    setPasso1(passos[0] || "");
    setPasso2(passos[1] || "");
    setPasso3(passos[2] || "");

    const esc = data.escopo || {};
    setEscopoE(esc.e || "");
    setEscopoNaoE(esc.nao_e || "");
    setEscopoFaz(Array.isArray(esc.faz) ? esc.faz.join("\n") : esc.faz || "");
    setEscopoNaoFaz(Array.isArray(esc.nao_faz) ? esc.nao_faz.join("\n") : esc.nao_faz || "");

    const fech = data.fechamento || {};
    setComoSaberemos(fech.como_saberemos || "");
    setMaiorDuvida(fech.maior_duvida || "");

    const trab = data.trabalho_entregue || {};
    setPrototipoUrl(trab.prototipo_url || "");
    setVideoUrl(trab.video_url || "");
    setObservacoesTrabalho(trab.observacoes || "");
    setLinksAdicionais(Array.isArray(trab.artefatos_adicionais) ? trab.artefatos_adicionais : []);

    setHistoricoEdicoes(Array.isArray(data.historico_edicoes) ? data.historico_edicoes : []);
  }

  function handleLogout() {
    localStorage.removeItem("inova_leader_session");
    localStorage.removeItem("inova_leader_email");
    setSessionToken("");
    setAuthStep("email");
    setPassword("");
    setNewPassword("");
    setSuccessMsg("");
    setErrorMsg("");
  }

  // 6. Salvar todas as alterações da equipe
  async function handleSalvarAlteracoes() {
    setSalvando(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      teamName,
      membros,
      empatizar: {
        quem_vive: quemVive,
        o_que_perde: oQuePerde,
        como_sabe: comoSabe,
      },
      definir: {
        frequencia,
        como_resolvem_hoje: comoResolvemHoje,
        por_que_nao_resolve: porQueNaoResolve,
        eixo,
      },
      idear: {
        nome_solucao: nomeSolucao,
        categoria,
        tres_passos: [passo1, passo2, passo3].filter(Boolean),
      },
      escopo: {
        e: escopoE,
        nao_e: escopoNaoE,
        faz: escopoFaz.split("\n").map((s) => s.trim()).filter(Boolean),
        nao_faz: escopoNaoFaz.split("\n").map((s) => s.trim()).filter(Boolean),
      },
      fechamento: {
        como_saberemos: comoSaberemos,
        maior_duvida: maiorDuvida,
      },
      trabalho_entregue: {
        prototipo_url: prototipoUrl,
        video_url: videoUrl,
        observacoes: observacoesTrabalho,
        artefatos_adicionais: linksAdicionais,
        acesso_liberado: true,
        enviado_em: new Date().toISOString(),
      },
    };

    try {
      const res = await updateLeaderTeamData(email, sessionToken, payload);
      setSuccessMsg("Informações da equipe salvas com sucesso! O log de auditoria foi gravado no banco de dados.");
      if (res.data) {
        carregarDadosCompletosNoEstado(res.data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao salvar alterações.");
    } finally {
      setSalvando(false);
    }
  }

  // Helpers para membros
  function handleAddMembro() {
    if (membros.length >= 6) return;
    setMembros([
      ...membros,
      {
        id: `membro-${Date.now()}`,
        nome: "",
        email: "",
        telefone: "",
        curso: "",
        papel: "Construir a solucao",
        vinculo: "Aluno de graduacao",
      },
    ]);
  }

  function handleUpdateMembro(idx: number, campo: string, valor: any) {
    const novos = [...membros];
    novos[idx] = { ...novos[idx], [campo]: valor };
    setMembros(novos);
  }

  function handleRemoveMembro(idx: number) {
    if (membros.length <= 1) return;
    const novos = membros.filter((_, i) => i !== idx);
    setMembros(novos);
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] pb-24">
      {/* ──── TOPO / CABEÇALHO ──── */}
      <header className="border-b border-[var(--borda)] bg-[var(--surf)] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[var(--marca)] font-black text-lg tracking-tight">
            <span>INOVA SAÚDE 2026</span>
          </Link>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <Link href="/banco-de-talentos" className="hidden sm:inline-block text-[var(--fg-2)] hover:text-[var(--fg)]">
              Banco de Talentos
            </Link>
            <Link href="/regulamento" className="hidden sm:inline-block text-[var(--fg-2)] hover:text-[var(--fg)]">
              Regulamento
            </Link>
            {authStep === "authenticated" && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--borda)] text-[var(--erro)] hover:bg-red-500/10 cursor-pointer transition-colors"
              >
                <LogOut size={14} />
                <span>Sair</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        {/* Banner de status / Feedback */}
        {errorMsg && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMsg}</div>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{successMsg}</div>
          </div>
        )}

        {/* ──── ETAPAS DE AUTENTICAÇÃO DO LÍDER ──── */}
        {authStep !== "authenticated" ? (
          <div className="max-w-md mx-auto my-12 bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[var(--marca)]/10 text-[var(--marca)] mx-auto flex items-center justify-center">
                <ShieldCheck size={26} />
              </div>
              <h1 className="text-2xl font-black text-[var(--fg)] tracking-tight">
                Portal de Edição da Equipe
              </h1>
              <p className="text-xs text-[var(--fg-2)] leading-relaxed">
                Área exclusiva para o líder da equipe editar membros, proposta e artefatos enviados.
              </p>
            </div>

            {/* Formulário: Informar E-mail */}
            {authStep === "email" && (
              <form onSubmit={handleCheckEmail} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--fg)]">
                    E-mail do Líder da Equipe:
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-2)]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemplo@posgraduacao.up.edu.br"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-sm focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>
                  <p className="text-[11px] text-[var(--fg-2)]">
                    O sistema verificará se você já possui senha ou enviará um link de confirmação para este e-mail.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--marca)] text-white font-bold text-sm hover:bg-[var(--marca-2)] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  {loading ? (
                    <span>Verificando...</span>
                  ) : (
                    <>
                      <span>Continuar</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Formulário: Já tem senha -> Digitar Senha */}
            {authStep === "password" && (
              <form onSubmit={handleLoginPassword} className="space-y-4">
                <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--borda)] text-xs space-y-1">
                  <div><strong>Equipe:</strong> {teamName}</div>
                  <div><strong>Líder:</strong> {email}</div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--fg)]">
                    Sua Senha de Acesso:
                  </label>
                  <div className="relative">
                    <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-2)]" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite sua senha cadastrada"
                      required
                      autoFocus
                      className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-sm focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--acao)] text-white font-bold text-sm hover:bg-[var(--acao-hover)] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  {loading ? (
                    <span>Entrando...</span>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Entrar no Painel</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthStep("email");
                      setPassword("");
                    }}
                    className="text-[var(--fg-2)] hover:underline cursor-pointer"
                  >
                    Trocar de e-mail
                  </button>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[var(--marca)] font-bold hover:underline cursor-pointer"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              </form>
            )}

            {/* Tela: Link de Verificação Enviado */}
            {authStep === "magic_sent" && (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed text-left space-y-2">
                  <p>
                    <strong>E-mail enviado!</strong> Um link exclusivo de confirmação foi encaminhado para <strong>{email}</strong>.
                  </p>
                  <p>
                    Abra o seu e-mail e clique no botão <strong>"Acessar e Definir Minha Senha"</strong> para entrar e criar sua senha de proteção.
                  </p>
                </div>

                <div className="text-xs text-[var(--fg-2)]">
                  Não recebeu? Verifique sua caixa de spam ou lixo eletrônico.
                </div>

                <button
                  type="button"
                  onClick={() => setAuthStep("email")}
                  className="text-xs font-bold text-[var(--marca)] hover:underline cursor-pointer"
                >
                  Voltar e tentar outro e-mail
                </button>
              </div>
            )}

            {/* Formulário: Definir Senha Inicial */}
            {authStep === "set_password" && (
              <form onSubmit={handleSetPassword} className="space-y-4">
                <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--borda)] text-xs space-y-1">
                  <div><strong>Equipe:</strong> {teamName}</div>
                  <div><strong>E-mail Verificado:</strong> {email}</div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--fg)]">
                    Criar Nova Senha (mínimo 6 caracteres):
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                    required
                    className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-sm focus:border-[var(--acao)] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--fg)]">
                    Confirme a Nova Senha:
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha digitada"
                    required
                    className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-sm focus:border-[var(--acao)] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--acao)] text-white font-bold text-sm hover:bg-[var(--acao-hover)] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  {loading ? (
                    <span>Salvando...</span>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Cadastrar Senha e Acessar Equipe</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ──── PAINEL DO LÍDER: EDIÇÃO COMPLETA DA EQUIPE ──── */
          <div className="space-y-6">
            {/* Header da Equipe */}
            <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--marca)]/10 text-[var(--marca)]">
                    Painel do Líder
                  </span>
                  <span className="text-xs text-[var(--fg-2)]">Autenticado com Segurança</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[var(--fg)] tracking-tight">
                  {teamName || "Minha Equipe"}
                </h1>
                <p className="text-xs text-[var(--fg-2)]">
                  Líder: <strong>{liderNome}</strong> ({email}) · Edições registradas no log de auditoria
                </p>
              </div>

              {/* Botão Salvar Alterações */}
              <button
                type="button"
                onClick={handleSalvarAlteracoes}
                disabled={salvando}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--acao)] text-white text-sm font-bold hover:bg-[var(--acao-hover)] transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {salvando ? (
                  <span>Salvando Alterações...</span>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>
            </div>

            {/* Barra de Abas */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--borda)]">
              {[
                { id: "equipe", label: "Integrantes", icon: Users },
                { id: "problema", label: "Problema & Dor", icon: FileEdit },
                { id: "solucao", label: "Solução & Escopo", icon: Sparkles },
                { id: "metricas", label: "Métricas de Sucesso", icon: CheckCircle2 },
                { id: "artefatos", label: "Artefatos & Links", icon: ExternalLink },
                { id: "historico", label: "Histórico de Edições", icon: History },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[var(--marca)] text-white shadow-xs"
                        : "bg-[var(--surf)] text-[var(--fg-2)] hover:text-[var(--fg)] border border-[var(--borda)]"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ──── ABA 1: INTEGRANTES DA EQUIPE ──── */}
            {activeTab === "equipe" && (
              <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--fg)]">Membros da Equipe (3 a 6 pessoas)</h2>
                    <p className="text-xs text-[var(--fg-2)]">Mantenha a equipe com divisão de papéis e cursos atualizados.</p>
                  </div>
                  {membros.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddMembro}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--marca)]/10 text-[var(--marca)] text-xs font-bold hover:bg-[var(--marca)]/20 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Adicionar Membro</span>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {membros.map((m, idx) => (
                    <div key={m.id || idx} className="p-4 rounded-xl border border-[var(--borda)] bg-[var(--bg)] space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-[var(--fg-2)]">
                        <span>{idx === 0 ? "★ Líder da Equipe" : `Integrante #${idx + 1}`}</span>
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMembro(idx)}
                            className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-[var(--fg-2)]">Nome Completo:</label>
                          <input
                            type="text"
                            value={m.nome || ""}
                            onChange={(e) => handleUpdateMembro(idx, "nome", e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-[var(--surf)] border border-[var(--borda)] rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[var(--fg-2)]">E-mail:</label>
                          <input
                            type="email"
                            value={m.email || ""}
                            onChange={(e) => handleUpdateMembro(idx, "email", e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-[var(--surf)] border border-[var(--borda)] rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[var(--fg-2)]">Telefone / WhatsApp:</label>
                          <input
                            type="text"
                            value={m.telefone || ""}
                            onChange={(e) => handleUpdateMembro(idx, "telefone", e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-[var(--surf)] border border-[var(--borda)] rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[var(--fg-2)]">Curso / Formação:</label>
                          <input
                            type="text"
                            value={m.curso || ""}
                            onChange={(e) => handleUpdateMembro(idx, "curso", e.target.value)}
                            placeholder="Ex: Odontologia, Software..."
                            className="w-full mt-1 px-3 py-1.5 bg-[var(--surf)] border border-[var(--borda)] rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ──── ABA 2: PROBLEMA & DOR ──── */}
            {activeTab === "problema" && (
              <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-[var(--fg)]">A Dor e o Beneficiário</h2>
                  <p className="text-xs text-[var(--fg-2)]">Quem sofre com o problema e como a equipe constatou essa necessidade.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--fg)]">Quem vive esse problema (Beneficiário):</label>
                    <textarea
                      rows={2}
                      value={quemVive}
                      onChange={(e) => setQuemVive(e.target.value)}
                      placeholder="Ex: Cirurgiões-dentistas que utilizam materiais de moldagem..."
                      className="w-full mt-1 p-3 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--fg)]">O que essa pessoa perde ou sente (A Dor Real):</label>
                    <textarea
                      rows={2}
                      value={oQuePerde}
                      onChange={(e) => setOQuePerde(e.target.value)}
                      placeholder="Descreva o tempo perdido, desperdício de insumos, custo ou dor física..."
                      className="w-full mt-1 p-3 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[var(--fg)]">Frequência do Problema:</label>
                      <input
                        type="text"
                        value={frequencia}
                        onChange={(e) => setFrequencia(e.target.value)}
                        placeholder="Ex: Diariamente, Em todo atendimento..."
                        className="w-full mt-1 p-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs focus:border-[var(--acao)] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--fg)]">Eixo Temático:</label>
                      <input
                        type="text"
                        value={eixo}
                        onChange={(e) => setEixo(e.target.value)}
                        placeholder="Ex: Logística e Gestão de Serviços de Saúde..."
                        className="w-full mt-1 p-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs focus:border-[var(--acao)] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--fg)]">Como o problema é resolvido hoje:</label>
                    <textarea
                      rows={2}
                      value={comoResolvemHoje}
                      onChange={(e) => setComoResolvemHoje(e.target.value)}
                      placeholder="Qual é a prática atual e o que os profissionais fazem hoje?"
                      className="w-full mt-1 p-3 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--fg)]">Por que as soluções atuais não resolvem:</label>
                    <textarea
                      rows={2}
                      value={porQueNaoResolve}
                      onChange={(e) => setPorQueNaoResolve(e.target.value)}
                      placeholder="Quais as falhas ou custos das soluções que existem hoje?"
                      className="w-full mt-1 p-3 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ──── ABA 3: SOLUÇÃO & ESCOPO ──── */}
            {activeTab === "solucao" && (
              <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-[var(--fg)]">Solução & Delimitação de Escopo</h2>
                  <p className="text-xs text-[var(--fg-2)]">O que a solução faz e deliberadamente deixa de fazer.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--fg)]">Nome da Solução:</label>
                    <input
                      type="text"
                      value={nomeSolucao}
                      onChange={(e) => setNomeSolucao(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--fg)]">Categoria:</label>
                    <input
                      type="text"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      placeholder="Ex: Dispositivo físico, Software, Processo..."
                      className="w-full mt-1 p-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* 3 Passos */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--fg)]">Os 3 Passos da Solução:</label>
                  <input
                    type="text"
                    value={passo1}
                    onChange={(e) => setPasso1(e.target.value)}
                    placeholder="Passo 1: Como o usuário inicia o uso..."
                    className="w-full p-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={passo2}
                    onChange={(e) => setPasso2(e.target.value)}
                    placeholder="Passo 2: O que a solução processa ou entrega..."
                    className="w-full p-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={passo3}
                    onChange={(e) => setPasso3(e.target.value)}
                    placeholder="Passo 3: Como conclui e entrega o benefício..."
                    className="w-full p-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs"
                  />
                </div>

                {/* Lean Inception: É / NÃO É / FAZ / NÃO FAZ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-emerald-600">A Solução É:</label>
                    <textarea
                      rows={2}
                      value={escopoE}
                      onChange={(e) => setEscopoE(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-red-500">A Solução NÃO É:</label>
                    <textarea
                      rows={2}
                      value={escopoNaoE}
                      onChange={(e) => setEscopoNaoE(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-emerald-600">A Solução FAZ (1 por linha):</label>
                    <textarea
                      rows={3}
                      value={escopoFaz}
                      onChange={(e) => setEscopoFaz(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-red-500">A Solução NÃO FAZ (1 por linha):</label>
                    <textarea
                      rows={3}
                      value={escopoNaoFaz}
                      onChange={(e) => setEscopoNaoFaz(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ──── ABA 4: MÉTRICAS DE SUCESSO ──── */}
            {activeTab === "metricas" && (
              <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-[var(--fg)]">Métricas e Validação</h2>
                  <p className="text-xs text-[var(--fg-2)]">Como saberemos que a solução deu certo e quais as dúvidas em aberto.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--fg)]">Como saberemos que deu certo (Métrica Observável):</label>
                    <textarea
                      rows={3}
                      value={comoSaberemos}
                      onChange={(e) => setComoSaberemos(e.target.value)}
                      placeholder="Ex: Redução de 40% no custo com ponteiras e diminuição de resíduos plásticos na clínica..."
                      className="w-full mt-1 p-3 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--fg)]">Maior Dúvida da Equipe:</label>
                    <textarea
                      rows={3}
                      value={maiorDuvida}
                      onChange={(e) => setMaiorDuvida(e.target.value)}
                      placeholder="O que a equipe ainda precisa testar ou comprovar clinicamente/tecnicamente?"
                      className="w-full mt-1 p-3 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ──── ABA 5: ARTEFATOS & PROTÓTIPO ──── */}
            {activeTab === "artefatos" && (
              <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-[var(--fg)]">Artefatos e Trabalhos Entregues</h2>
                  <p className="text-xs text-[var(--fg-2)]">Links diretos que serão avaliados pela banca e mentores.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--fg)]">Link do Protótipo / Apresentação (Canva / Figma / Drive / Web):</label>
                    <input
                      type="url"
                      value={prototipoUrl}
                      onChange={(e) => setPrototipoUrl(e.target.value)}
                      placeholder="https://canva.link/... ou https://..."
                      className="w-full mt-1 p-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs focus:border-[var(--acao)] focus:outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--fg)]">Link do Vídeo Demonstrativo (YouTube / Google Drive):</label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... ou link do Drive"
                      className="w-full mt-1 p-2.5 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs focus:border-[var(--acao)] focus:outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--fg)]">Observações sobre o Protótipo:</label>
                    <textarea
                      rows={2}
                      value={observacoesTrabalho}
                      onChange={(e) => setObservacoesTrabalho(e.target.value)}
                      placeholder="Notas adicionais sobre como testar ou visualizar o protótipo..."
                      className="w-full mt-1 p-3 bg-[var(--bg)] border border-[var(--borda)] rounded-xl text-xs focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ──── ABA 6: HISTÓRICO DE AUDITORIA ──── */}
            {activeTab === "historico" && (
              <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-[var(--fg)]">Registro de Auditoria & Alterações</h2>
                  <p className="text-xs text-[var(--fg-2)]">Todas as edições feitas pelo líder ficam registradas com data, horário e IP.</p>
                </div>

                {historicoEdicoes.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[var(--fg-2)]">
                    Nenhuma alteração registrada ainda nesta sessão.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historicoEdicoes.map((log, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-[var(--borda)] bg-[var(--bg)] text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-[var(--fg)]">
                          <span>{new Date(log.timestamp).toLocaleString("pt-BR")}</span>
                          <span className="font-mono text-[10px] text-[var(--fg-2)]">IP: {log.ip}</span>
                        </div>
                        <div className="text-[var(--fg-2)]">
                          Alterado por: <strong>{log.autor}</strong>
                        </div>
                        {Array.isArray(log.alteracoes) && log.alteracoes.length > 0 && (
                          <ul className="list-disc pl-4 text-[11px] text-[var(--marca)] pt-1 space-y-0.5">
                            {log.alteracoes.map((alt: string, i: number) => (
                              <li key={i}>{alt}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Rodapé de Ação */}
            <div className="p-4 rounded-2xl bg-[var(--surf)] border border-[var(--borda)] flex items-center justify-between shadow-xs">
              <span className="text-xs text-[var(--fg-2)]">
                Lembre-se de clicar em salvar para confirmar qualquer alteração.
              </span>
              <button
                type="button"
                onClick={handleSalvarAlteracoes}
                disabled={salvando}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--acao)] text-white text-xs sm:text-sm font-bold hover:bg-[var(--acao-hover)] transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {salvando ? "Gravando no Banco..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
