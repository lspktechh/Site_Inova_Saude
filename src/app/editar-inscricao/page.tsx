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
  Play,
  FileText,
  Globe,
  UploadCloud,
  FileUp,
  Loader2,
} from "lucide-react";
import {
  checkLeaderLogin,
  requestLeaderMagicLink,
  loginWithPassword,
  verifyMagicLink,
  setLeaderPassword,
  getLeaderTeamData,
  updateLeaderTeamData,
  uploadLeaderWorkFile,
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
  const [linksAdicionais, setLinksAdicionais] = useState<
    Array<{
      tipo: string;
      titulo: string;
      linkUrl?: string;
      url?: string;
      arquivoNome?: string;
      originalName?: string;
      tamanhoBytes?: number;
      enviadoEm?: string;
    }>
  >([]);
  const [dataEnvioTrabalho, setDataEnvioTrabalho] = useState("");
  const [codigoSubmissao, setCodigoSubmissao] = useState("");
  const [novoArtefatoTipo, setNovoArtefatoTipo] = useState("Apresentação / Slides");
  const [novoArtefatoTitulo, setNovoArtefatoTitulo] = useState("");
  const [novoArtefatoUrl, setNovoArtefatoUrl] = useState("");

  function handleAddArtefato() {
    if (!novoArtefatoUrl.trim()) return;
    const cleanUrl = /^https?:\/\//i.test(novoArtefatoUrl.trim())
      ? novoArtefatoUrl.trim()
      : `https://${novoArtefatoUrl.trim()}`;
    const item = {
      tipo: novoArtefatoTipo,
      titulo: novoArtefatoTitulo.trim() || `Material (${novoArtefatoTipo})`,
      linkUrl: cleanUrl,
      url: cleanUrl,
    };
    setLinksAdicionais((prev) => [...prev, item]);
    setNovoArtefatoTitulo("");
    setNovoArtefatoUrl("");
  }

  function handleRemoveArtefato(index: number) {
    setLinksAdicionais((prev) => prev.filter((_, i) => i !== index));
  }

  // Estados para Upload Direto de Arquivo (PDF ou DOCX até 10MB)
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadDocError, setUploadDocError] = useState("");
  const [uploadDocSuccess, setUploadDocSuccess] = useState("");

  async function handleUploadDocumento(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadDocError("");
    setUploadDocSuccess("");

    const ext = file.name.toLowerCase().split(".").pop();
    if (ext !== "pdf" && ext !== "docx") {
      setUploadDocError("Formato não suportado. Por favor selecione um arquivo .pdf ou .docx.");
      e.target.value = "";
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      setUploadDocError(
        `O arquivo excede o limite máximo permitido de 10 MB (tamanho: ${(file.size / (1024 * 1024)).toFixed(2)} MB).`
      );
      e.target.value = "";
      return;
    }

    setUploadingDoc(true);
    try {
      const res = await uploadLeaderWorkFile(email, sessionToken, file);
      if (res.artefato) {
        setLinksAdicionais((prev) => [res.artefato, ...prev]);
        setUploadDocSuccess(`Arquivo "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB) enviado e salvo com sucesso!`);
      } else {
        setUploadDocSuccess("Arquivo enviado com sucesso!");
      }
    } catch (err: any) {
      setUploadDocError(err.message || "Erro ao realizar upload do arquivo.");
    } finally {
      setUploadingDoc(false);
      e.target.value = "";
    }
  }

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
        if (res.teamName) setTeamName(res.teamName);
        if (res.name) setLiderNome(res.name);
        setAuthStep("set_password");
        setSuccessMsg("E-mail verificado com sucesso! Digite sua nova senha de acesso abaixo.");
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
    setDataEnvioTrabalho(trab.enviado_em || "");
    setCodigoSubmissao(trab.codigo_submissao || "");
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
            {/* Tela: Link de Verificação Enviado */}
            {authStep === "magic_sent" && (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed text-left space-y-2">
                  <p>
                    <strong>E-mail enviado!</strong> Um link exclusivo de confirmação e redefinição foi encaminhado para <strong>{email}</strong>.
                  </p>
                  <p>
                    Abra o seu e-mail e clique no botão <strong>"Cadastrar Nova Senha"</strong> para abrir a página e definir sua nova senha de acesso.
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

            {/* Formulário: Cadastrar Nova Senha */}
            {authStep === "set_password" && (
              <form onSubmit={handleSetPassword} className="space-y-4">
                <div className="text-center pb-1">
                  <div className="w-12 h-12 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] mx-auto flex items-center justify-center mb-2">
                    <Key size={22} />
                  </div>
                  <h3 className="text-base font-bold text-[var(--fg)]">Cadastrar Nova Senha</h3>
                  <p className="text-xs text-[var(--fg-2)] mt-0.5">
                    Defina sua nova senha para gerenciar a equipe no INOVA SAÚDE 2026.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--borda)] text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[var(--fg-2)]">Equipe:</span>
                    <strong className="text-[var(--fg)]">{teamName || "Equipe Identificada"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--fg-2)]">E-mail:</span>
                    <strong className="text-[var(--fg)]">{email}</strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--fg)]">
                    Nova Senha (mínimo 6 caracteres):
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
                    placeholder="Repita a nova senha digitada"
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
                    <span>Salvando Nova Senha...</span>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Salvar Nova Senha e Acessar Equipe</span>
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
              <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-[var(--fg)]">Artefatos e Trabalhos Entregues</h2>
                  <p className="text-xs text-[var(--fg-2)]">
                    Links, arquivos e materiais que são avaliados pela banca examinadora no Demoday.
                  </p>
                </div>

                {/* Banner de Status do Trabalho */}
                {prototipoUrl || videoUrl || linksAdicionais.length > 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-[var(--fg)] flex items-center gap-2">
                          <span>Trabalho Registrado para o Demoday</span>
                          {codigoSubmissao && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
                              {codigoSubmissao}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[var(--fg-2)] mt-0.5">
                          {dataEnvioTrabalho
                            ? `Enviado/atualizado em: ${new Date(dataEnvioTrabalho).toLocaleString("pt-BR")}`
                            : "Materiais salvos e disponíveis para a banca de avaliação."}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <Check size={14} /> Pronto para Avaliação
                    </span>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                    <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[var(--fg)]">Nenhum artefato registrado ainda</div>
                      <div className="text-[11px] text-[var(--fg-2)] mt-0.5">
                        Adicione o link do protótipo e/ou vídeo demonstrativo abaixo e clique em{" "}
                        <strong>Salvar Todas as Informações</strong> para que a banca possa avaliar sua equipe.
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Protótipo / Aplicação */}
                  <div className="p-4 rounded-xl border border-[var(--borda)] bg-[var(--bg)] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[var(--fg)] flex items-center gap-2">
                        <Globe size={15} className="text-[var(--marca)]" />
                        <span>Link do Protótipo / Aplicação (Vercel / Figma / Canva / Web):</span>
                      </label>
                      {prototipoUrl && (
                        <a
                          href={prototipoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--marca)] hover:underline"
                        >
                          <ExternalLink size={12} />
                          <span>Testar Protótipo</span>
                        </a>
                      )}
                    </div>
                    <input
                      type="url"
                      value={prototipoUrl}
                      onChange={(e) => setPrototipoUrl(e.target.value)}
                      placeholder="https://ortho-track.vercel.app/ ou https://canva.com/..."
                      className="w-full p-2.5 bg-[var(--surf)] border border-[var(--borda)] rounded-xl text-xs focus:border-[var(--acao)] focus:outline-hidden font-mono"
                    />
                  </div>

                  {/* Vídeo Demonstrativo */}
                  <div className="p-4 rounded-xl border border-[var(--borda)] bg-[var(--bg)] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[var(--fg)] flex items-center gap-2">
                        <Play size={15} className="text-red-500" />
                        <span>Link do Vídeo Demonstrativo (YouTube / Google Drive):</span>
                      </label>
                      {videoUrl && (
                        <a
                          href={videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline"
                        >
                          <ExternalLink size={12} />
                          <span>Assistir Vídeo</span>
                        </a>
                      )}
                    </div>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... ou link do Drive"
                      className="w-full p-2.5 bg-[var(--surf)] border border-[var(--borda)] rounded-xl text-xs focus:border-[var(--acao)] focus:outline-hidden font-mono"
                    />
                  </div>

                  {/* UPLOAD DE ARQUIVO DO TRABALHO (PDF ou DOCX até 10MB) */}
                  <div className="p-5 rounded-xl border-2 border-dashed border-[var(--marca)]/40 hover:border-[var(--marca)] bg-[var(--bg)] space-y-3 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-bold text-[var(--fg)] flex items-center gap-2">
                        <UploadCloud size={17} className="text-[var(--marca)]" />
                        <span>Enviar Arquivo do Trabalho (PDF ou DOCX — máx. 10MB)</span>
                      </label>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] self-start sm:self-auto">
                        PDF ou DOCX • Máx. 10 MB
                      </span>
                    </div>

                    <p className="text-[11px] text-[var(--fg-2)] leading-relaxed">
                      Faça o upload do documento do trabalho da sua equipe (apresentação em slides, relatório descritivo, documentação técnica em formato <strong>PDF</strong> ou <strong>DOCX</strong>). O arquivo é salvo com segurança e fica disponível diretamente para os avaliadores.
                    </p>

                    <div className="relative rounded-xl border border-[var(--borda)] bg-[var(--surf)]/60 hover:bg-[var(--surf)] p-4 text-center transition-all cursor-pointer group">
                      <input
                        type="file"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        disabled={uploadingDoc}
                        onChange={handleUploadDocumento}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                        title="Selecione um arquivo PDF ou DOCX de até 10MB"
                      />
                      <div className="flex flex-col items-center justify-center gap-2 pointer-events-none py-2">
                        {uploadingDoc ? (
                          <>
                            <Loader2 size={32} className="text-[var(--marca)] animate-spin" />
                            <div className="text-xs font-bold text-[var(--fg)]">
                              Enviando arquivo e processando com o servidor...
                            </div>
                            <div className="text-[11px] text-[var(--fg-2)]">
                              Aguarde, gravando nos artefatos da equipe...
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="p-3 rounded-full bg-[var(--marca)]/15 text-[var(--marca)] group-hover:scale-110 transition-transform">
                              <FileUp size={24} />
                            </div>
                            <div className="text-xs font-bold text-[var(--fg)]">
                              Clique para escolher o arquivo ou arraste para cá
                            </div>
                            <div className="text-[11px] text-[var(--fg-2)]">
                              Apenas arquivos <strong>.pdf</strong> ou <strong>.docx</strong> de até <strong>10 MB</strong>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {uploadDocError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{uploadDocError}</span>
                      </div>
                    )}

                    {uploadDocSuccess && (
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={16} className="shrink-0" />
                        <span>{uploadDocSuccess}</span>
                      </div>
                    )}
                  </div>

                  {/* Materiais e Artefatos Adicionais (Slides em PDF, Pitch Deck, Figma) */}
                  <div className="p-4 rounded-xl border border-[var(--borda)] bg-[var(--bg)] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[var(--fg)] flex items-center gap-2">
                        <FileText size={15} className="text-amber-500" />
                        <span>Arquivos & Artefatos Cadastrados (PDFs, Documentos, Links):</span>
                      </label>
                      <span className="text-[11px] text-[var(--fg-2)]">
                        {linksAdicionais.length} {linksAdicionais.length === 1 ? "item" : "itens"}
                      </span>
                    </div>

                    {/* Lista dos artefatos cadastrados */}
                    {linksAdicionais.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {linksAdicionais.map((art, idx) => {
                          const artUrl = art.linkUrl || art.url || "";
                          const cleanArtUrl = artUrl
                            ? artUrl.startsWith("/api/") || artUrl.startsWith("/inscriptions/")
                              ? `https://137-131-233-254.sslip.io${artUrl}`
                              : /^https?:\/\//i.test(artUrl)
                              ? artUrl
                              : `https://${artUrl}`
                            : "";
                          const tipoRaw = (art.tipo || "").toUpperCase();
                          const isPdf = tipoRaw.includes("PDF") || (art.arquivoNome || "").toLowerCase().endsWith(".pdf") || artUrl.toLowerCase().endsWith(".pdf");
                          const isDocx = tipoRaw.includes("DOCX") || (art.arquivoNome || "").toLowerCase().endsWith(".docx") || artUrl.toLowerCase().endsWith(".docx");
                          const badgeColor = isPdf
                            ? "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
                            : isDocx
                            ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                            : "bg-[var(--bg)] text-[var(--marca)] border-[var(--borda)]";
                          const badgeLabel = isPdf ? "PDF" : isDocx ? "DOCX" : (art.tipo || "Artefato");
                          const tamanho = art.tamanhoBytes
                            ? ` • ${(art.tamanhoBytes / (1024 * 1024)).toFixed(2)} MB`
                            : "";

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-[var(--borda)] bg-[var(--surf)] text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0 ${badgeColor}`}>
                                  {badgeLabel}
                                </span>
                                <div className="truncate">
                                  <div className="font-semibold text-[var(--fg)] truncate flex items-center gap-1.5">
                                    <span>{art.titulo || art.originalName || art.arquivoNome || "Sem título"}</span>
                                    {tamanho && <span className="text-[10px] text-[var(--fg-2)] font-mono font-normal">{tamanho}</span>}
                                  </div>
                                  {cleanArtUrl && (
                                    <div className="text-[10px] font-mono text-[var(--fg-2)] truncate">
                                      {cleanArtUrl}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {cleanArtUrl && (
                                  <a
                                    href={cleanArtUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-[var(--bg)] hover:bg-[var(--borda)] text-[var(--fg)] transition-colors"
                                    title="Abrir / Baixar Artefato"
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveArtefato(idx)}
                                  className="p-1.5 rounded-lg bg-[var(--bg)] hover:bg-red-500/10 text-red-500 transition-colors"
                                  title="Remover Artefato"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Formulário para Adicionar Novo Artefato via Link Externo */}
                    <div className="pt-2 border-t border-[var(--borda)] space-y-2">
                      <div className="text-[11px] font-bold text-[var(--fg)]">+ Ou adicionar Link Externo (Figma, GitHub, Slides):</div>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <select
                          value={novoArtefatoTipo}
                          onChange={(e) => setNovoArtefatoTipo(e.target.value)}
                          className="sm:col-span-4 p-2 bg-[var(--surf)] border border-[var(--borda)] rounded-lg text-xs focus:border-[var(--acao)] focus:outline-hidden"
                        >
                          <option value="Apresentação / Slides">Apresentação / Slides</option>
                          <option value="Documento PDF">Documento PDF</option>
                          <option value="Figma / Design">Figma / Design</option>
                          <option value="Repositório GitHub">Repositório GitHub</option>
                          <option value="Outro Link">Outro Link</option>
                        </select>
                        <input
                          type="text"
                          value={novoArtefatoTitulo}
                          onChange={(e) => setNovoArtefatoTitulo(e.target.value)}
                          placeholder="Título (ex: Slides do Pitch)"
                          className="sm:col-span-4 p-2 bg-[var(--surf)] border border-[var(--borda)] rounded-lg text-xs focus:border-[var(--acao)] focus:outline-hidden"
                        />
                        <input
                          type="url"
                          value={novoArtefatoUrl}
                          onChange={(e) => setNovoArtefatoUrl(e.target.value)}
                          placeholder="https://..."
                          className="sm:col-span-4 p-2 bg-[var(--surf)] border border-[var(--borda)] rounded-lg text-xs focus:border-[var(--acao)] focus:outline-hidden font-mono"
                        />
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleAddArtefato}
                          disabled={!novoArtefatoUrl.trim()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--marca)] text-white text-xs font-bold hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>Adicionar à Lista</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Observações Técnicas */}
                  <div>
                    <label className="text-xs font-bold text-[var(--fg)]">
                      Observações e Orientações para a Banca Examinadora:
                    </label>
                    <textarea
                      rows={3}
                      value={observacoesTrabalho}
                      onChange={(e) => setObservacoesTrabalho(e.target.value)}
                      placeholder="Instruções para acesso (ex: login de teste no protótipo, detalhes da demonstração ou contexto técnico)..."
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
