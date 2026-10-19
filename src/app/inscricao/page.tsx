"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  edicao,
  formulario,
  competencias,
  formasPrototipo,
  calculateFaltaNaEquipe,
  getMaterialSuggestion,
  checkBedEnvelope,
  TrackId,
  TeamMember,
  FichaPrototipoOutput,
  ods,
} from "@/lib/config";
import { submitInscription, InscriptionPayload, InscriptionResponse } from "@/lib/api";
import {
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Save,
  Users,
  Plus,
  Trash2,
  Sparkles,
  Info,
  Download,
  QrCode,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { StepProgressNav } from "@/components/StepProgressNav";
import { PrinterBedVisualizer } from "@/components/PrinterBedVisualizer";
import { OfficialVoucher } from "@/components/OfficialVoucher";

const OPCOES_DISPONIBILIDADE: string[] =
  formulario.etapas[1].campos.find((c: any) => c.id === "disponibilidade")?.opcoes || [];
const CAMPO_ODS = formulario.etapas[7].campos.find((c: any) => c.id === "ods");
const MAX_ODS: number = CAMPO_ODS?.max ?? edicao.ods.max_por_equipe;

function InscriptionContent() {
  const searchParams = useSearchParams();
  const trilhaParam = (searchParams.get("trilha") as TrackId) || "equipe_com_ideia";

  // Estados principais
  const [trilha, setTrilha] = useState<TrackId>(trilhaParam);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [draftSaved, setDraftSaved] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<InscriptionResponse | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState<boolean>(false);

  // Etapa 1: Equipe e Integrantes
  const [equipeNome, setEquipeNome] = useState<string>("Equipe Inovadora");
  const [membros, setMembros] = useState<TeamMember[]>([
    {
      id: "lider-1",
      isLeader: true,
      nome: "",
      email: "",
      telefone: "",
      vinculo: "Aluno de graduacao",
      curso: "",
      disponibilidade: [...OPCOES_DISPONIBILIDADE],
      competencias: [],
      papel: "Coordenar a equipe",
    },
  ]);

  // Etapa 3: Empatizar
  const [quemVive, setQuemVive] = useState<string>("");
  const [oQuePerde, setOQuePerde] = useState<string>("");
  const [comoSabe, setComoSabe] = useState<string[]>([]);

  // Etapa 4: Definir
  const [fraseDefinir, setFraseDefinir] = useState({
    quem: "",
    o_que: "",
    por_que: "",
    o_que_atrapalha: "",
  });
  const [frequencia, setFrequencia] = useState<string>("Varias vezes por dia");
  const [comoResolvemHoje, setComoResolvemHoje] = useState<string>("");
  const [porQueNaoResolve, setPorQueNaoResolve] = useState<string>("");
  const [eixoTematico, setEixoTematico] = useState<string>(edicao.eixos_tematicos[0]);

  // Etapa 5: Idear
  const [fraseIdear, setFraseIdear] = useState({
    quem: "",
    necessidade: "",
    nome: "",
    categoria: "Aplicativo",
    beneficio: "",
    alternativa: "",
    diferencial: "",
  });
  const [nomeSolucao, setNomeSolucao] = useState<string>("");
  const [categoriaSolucao, setCategoriaSolucao] = useState<string>("Aplicativo");
  const [tresPassos, setTresPassos] = useState<string[]>(["", "", ""]);

  // Etapa 6: Escopo (É / Não é / Faz / Não faz)
  const [escopoE, setEscopoE] = useState<string>("");
  const [escopoNaoE, setEscopoNaoE] = useState<string>("");
  const [escopoFaz, setEscopoFaz] = useState<string[]>(["", "", ""]);
  const [escopoNaoFaz, setEscopoNaoFaz] = useState<string[]>(["", "", ""]);

  // Etapa 7: Fechamento
  const [comoSaberemos, setComoSaberemos] = useState<string>("");
  const [maiorDuvida, setMaiorDuvida] = useState<string>("");
  const [abertaANovos, setAbertaANovos] = useState<boolean>(true);
  const [aceites, setAceites] = useState<string[]>([]);
  const [odsSelecionadas, setOdsSelecionadas] = useState<number[]>([]);

  // Etapa 8: Formas de Protótipo
  const [formasSelecionadas, setFormasSelecionadas] = useState<string[]>(["forma_a"]);
  const [formaPrincipal, setFormaPrincipal] = useState<string>("forma_a");

  // Forma A (Software)
  const [softUsuario, setSoftUsuario] = useState<string>("");
  const [softTelas, setSoftTelas] = useState<Array<{ nome: string; acao: string }>>([
    { nome: "", acao: "" },
    { nome: "", acao: "" },
    { nome: "", acao: "" },
  ]);
  const [softDadoEntra, setSoftDadoEntra] = useState<string>("");
  const [softDadoSai, setSoftDadoSai] = useState<string>("");
  const [softIntegracao, setSoftIntegracao] = useState<string>("");
  const [softPlataforma, setSoftPlataforma] = useState<string[]>(["Web no computador"]);
  const [softTomVisual, setSoftTomVisual] = useState<string>("Direto e operacional");

  // Forma B (Peça 3D)
  const [pecaFuncao, setPecaFuncao] = useState<string>("");
  const [pecaEncaixaEm, setPecaEncaixaEm] = useState<string>("");
  const [pecaMedidaEncaixe, setPecaMedidaEncaixe] = useState<string>("");
  const [pecaFolga, setPecaFolga] = useState<string>("Mais ou menos 1 mm");
  const [pecaEnvelope, setPecaEnvelope] = useState<[number, number, number]>([100, 50, 40]);
  const [pecaRequisitos, setPecaRequisitos] = useState<string[]>(["peso_ate_1kg", "limpeza_alcool"]);
  const [pecaMaterial, setPecaMaterial] = useState<string>("");
  const [pecaQuantidade, setPecaQuantidade] = useState<number>(1);
  const [pecaMontagem, setPecaMontagem] = useState<boolean>(false);

  // Forma C (Dispositivo)
  const [dispMedeAciona, setDispMedeAciona] = useState<string>("");
  const [dispOndeFica, setDispOndeFica] = useState<string>("");
  const [dispAlimentacao, setDispAlimentacao] = useState<string>("USB");
  const [dispDependeDe, setDispDependeDe] = useState<string[]>([]);
  const [dispJaExiste, setDispJaExiste] = useState<string>("");

  // Forma D (Serviço)
  const [servQuemExecuta, setServQuemExecuta] = useState<string>("");
  const [servPassoAtual, setServPassoAtual] = useState<string[]>(["", ""]);
  const [servOQueMuda, setServOQueMuda] = useState<string>("");
  const [servArtefato, setServArtefato] = useState<string[]>([]);
  const [servQuemValida, setServQuemValida] = useState<string>("");

  // Trava sanitária
  const [travaSanitaria, setTravaSanitaria] = useState<string[]>([]);

  // Função central para persistir todos os campos no localStorage
  const saveDraftToStorage = () => {
    try {
      const draft = {
        updatedAt: new Date().toISOString(),
        currentStep,
        trilha,
        membros,
        equipeNome,
        quemVive,
        oQuePerde,
        comoSabe,
        fraseDefinir,
        frequencia,
        comoResolvemHoje,
        porQueNaoResolve,
        eixoTematico,
        fraseIdear,
        nomeSolucao,
        categoriaSolucao,
        tresPassos,
        escopoE,
        escopoNaoE,
        escopoFaz,
        escopoNaoFaz,
        comoSaberemos,
        maiorDuvida,
        abertaANovos,
        aceites,
        odsSelecionadas,
        formasSelecionadas,
        formaPrincipal,
        softUsuario,
        softTelas,
        softDadoEntra,
        softDadoSai,
        softIntegracao,
        softPlataforma,
        softTomVisual,
        pecaFuncao,
        pecaEncaixaEm,
        pecaMedidaEncaixe,
        pecaFolga,
        pecaEnvelope,
        pecaRequisitos,
        pecaMaterial,
        pecaQuantidade,
        pecaMontagem,
        dispMedeAciona,
        dispOndeFica,
        dispAlimentacao,
        dispDependeDe,
        dispJaExiste,
        servQuemExecuta,
        servPassoAtual,
        servOQueMuda,
        servArtefato,
        servQuemValida,
        travaSanitaria,
      };
      localStorage.setItem("inova_form_draft", JSON.stringify(draft));
      const now = new Date();
      const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setLastSavedTime(timeStr);
      setDraftSaved(true);
      return true;
    } catch (e) {
      console.warn("Erro ao salvar rascunho no localStorage:", e);
      return false;
    }
  };

  // Carregar rascunho do localStorage com segurança ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem("inova_form_draft");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.trilha) setTrilha(data.trilha);
        if (typeof data.currentStep === "number") setCurrentStep(data.currentStep);
        if (data.equipeNome) setEquipeNome(data.equipeNome);
        if (data.membros && Array.isArray(data.membros) && data.membros.length > 0) setMembros(data.membros);
        if (data.quemVive) setQuemVive(data.quemVive);
        if (data.oQuePerde) setOQuePerde(data.oQuePerde);
        if (data.comoSabe) setComoSabe(data.comoSabe);
        if (data.fraseDefinir) setFraseDefinir(data.fraseDefinir);
        if (data.frequencia) setFrequencia(data.frequencia);
        if (data.comoResolvemHoje) setComoResolvemHoje(data.comoResolvemHoje);
        if (data.porQueNaoResolve) setPorQueNaoResolve(data.porQueNaoResolve);
        if (data.eixoTematico) setEixoTematico(data.eixoTematico);
        if (data.fraseIdear) setFraseIdear(data.fraseIdear);
        if (data.nomeSolucao) setNomeSolucao(data.nomeSolucao);
        if (data.categoriaSolucao) setCategoriaSolucao(data.categoriaSolucao);
        if (data.tresPassos) setTresPassos(data.tresPassos);
        if (data.escopoE) setEscopoE(data.escopoE);
        if (data.escopoNaoE) setEscopoNaoE(data.escopoNaoE);
        if (data.escopoFaz) setEscopoFaz(data.escopoFaz);
        if (data.escopoNaoFaz) setEscopoNaoFaz(data.escopoNaoFaz);
        if (data.comoSaberemos) setComoSaberemos(data.comoSaberemos);
        if (data.maiorDuvida) setMaiorDuvida(data.maiorDuvida);
        if (typeof data.abertaANovos === "boolean") setAbertaANovos(data.abertaANovos);
        if (data.aceites) setAceites(data.aceites);
        if (Array.isArray(data.odsSelecionadas)) setOdsSelecionadas(data.odsSelecionadas.slice(0, MAX_ODS));
        if (data.formasSelecionadas) setFormasSelecionadas(data.formasSelecionadas);
        if (data.formaPrincipal) setFormaPrincipal(data.formaPrincipal);
        if (data.softUsuario) setSoftUsuario(data.softUsuario);
        if (data.softTelas) setSoftTelas(data.softTelas);
        if (data.softDadoEntra) setSoftDadoEntra(data.softDadoEntra);
        if (data.softDadoSai) setSoftDadoSai(data.softDadoSai);
        if (data.softIntegracao) setSoftIntegracao(data.softIntegracao);
        if (data.softPlataforma) setSoftPlataforma(data.softPlataforma);
        if (data.softTomVisual) setSoftTomVisual(data.softTomVisual);
        if (data.pecaFuncao) setPecaFuncao(data.pecaFuncao);
        if (data.pecaEncaixaEm) setPecaEncaixaEm(data.pecaEncaixaEm);
        if (data.pecaMedidaEncaixe) setPecaMedidaEncaixe(data.pecaMedidaEncaixe);
        if (data.pecaFolga) setPecaFolga(data.pecaFolga);
        if (data.pecaEnvelope) setPecaEnvelope(data.pecaEnvelope);
        if (data.pecaRequisitos) setPecaRequisitos(data.pecaRequisitos);
        if (data.pecaMaterial) setPecaMaterial(data.pecaMaterial);
        if (data.pecaQuantidade) setPecaQuantidade(data.pecaQuantidade);
        if (typeof data.pecaMontagem === "boolean") setPecaMontagem(data.pecaMontagem);
        if (data.dispMedeAciona) setDispMedeAciona(data.dispMedeAciona);
        if (data.dispOndeFica) setDispOndeFica(data.dispOndeFica);
        if (data.dispAlimentacao) setDispAlimentacao(data.dispAlimentacao);
        if (data.dispDependeDe) setDispDependeDe(data.dispDependeDe);
        if (data.dispJaExiste) setDispJaExiste(data.dispJaExiste);
        if (data.servQuemExecuta) setServQuemExecuta(data.servQuemExecuta);
        if (data.servPassoAtual) setServPassoAtual(data.servPassoAtual);
        if (data.servOQueMuda) setServOQueMuda(data.servOQueMuda);
        if (data.servArtefato) setServArtefato(data.servArtefato);
        if (data.servQuemValida) setServQuemValida(data.servQuemValida);
        if (data.travaSanitaria) setTravaSanitaria(data.travaSanitaria);

        if (data.updatedAt) {
          const date = new Date(data.updatedAt);
          setLastSavedTime(date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        }
        setShowDraftBanner(true);
      }
    } catch (e) {
      console.warn("Rascunho não carregado:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Salvar rascunho automaticamente a cada alteração (debounced, após carga inicial)
  useEffect(() => {
    if (!isLoaded) return;
    setDraftSaved(false);
    const timer = setTimeout(() => {
      saveDraftToStorage();
    }, 500);
    return () => clearTimeout(timer);
  }, [
    isLoaded,
    currentStep,
    trilha,
    membros,
    equipeNome,
    quemVive,
    oQuePerde,
    comoSabe,
    fraseDefinir,
    frequencia,
    comoResolvemHoje,
    porQueNaoResolve,
    eixoTematico,
    fraseIdear,
    nomeSolucao,
    categoriaSolucao,
    tresPassos,
    escopoE,
    escopoNaoE,
    escopoFaz,
    escopoNaoFaz,
    comoSaberemos,
    maiorDuvida,
    abertaANovos,
    aceites,
    odsSelecionadas,
    formasSelecionadas,
    formaPrincipal,
    softUsuario,
    softTelas,
    softDadoEntra,
    softDadoSai,
    softIntegracao,
    softPlataforma,
    softTomVisual,
    pecaFuncao,
    pecaEncaixaEm,
    pecaMedidaEncaixe,
    pecaFolga,
    pecaEnvelope,
    pecaRequisitos,
    pecaMaterial,
    pecaQuantidade,
    pecaMontagem,
    dispMedeAciona,
    dispOndeFica,
    dispAlimentacao,
    dispDependeDe,
    dispJaExiste,
    servQuemExecuta,
    servPassoAtual,
    servOQueMuda,
    servArtefato,
    servQuemValida,
    travaSanitaria,
  ]);

  // Função para salvar rascunho manualmente com feedback imediato
  const handleManualSaveDraft = () => {
    const success = saveDraftToStorage();
    if (success) {
      setToastMessage("✓ Rascunho salvo no seu dispositivo com sucesso!");
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Função para descartar rascunho e recomeçar
  const handleClearDraft = () => {
    if (typeof window !== "undefined" && window.confirm("Deseja realmente limpar o rascunho e recomeçar a inscrição do zero?")) {
      localStorage.removeItem("inova_form_draft");
      window.location.reload();
    }
  };

  // Se a trilha for sem ideia, as etapas são apenas 0, 1, 2, 7 (aceites) e 9 (final)
  const availableSteps = useMemo(() => {
    if (trilha === "sem_ideia") {
      return [0, 1, 2, 7, 9];
    }
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  }, [trilha]);

  // Sugestão reativa de material para impressão 3D
  const sugestaoMaterial = useMemo(() => {
    return getMaterialSuggestion(pecaRequisitos);
  }, [pecaRequisitos]);

  // Verificação reativa do envelope da mesa 3D
  const envelopeCheck = useMemo(() => {
    return checkBedEnvelope(pecaEnvelope);
  }, [pecaEnvelope]);

  // Competências combinadas de todos os membros
  const allTeamSkills = useMemo(() => {
    const skills = new Set<string>();
    membros.forEach((m) => m.competencias.forEach((c) => skills.add(c)));
    return Array.from(skills);
  }, [membros]);

  // Cálculo reativo de competências faltantes na equipe
  const faltaNaEquipe = useMemo(() => {
    return calculateFaltaNaEquipe(allTeamSkills, formasSelecionadas);
  }, [allTeamSkills, formasSelecionadas]);

  // Verificação de trava sanitária acionada
  const isTravaAcionada = useMemo(() => {
    const ativas = travaSanitaria.filter((t) => t !== "nenhuma");
    return ativas.length > 0;
  }, [travaSanitaria]);

  // Montagem da Ficha de Protótipo estruturada
  const fichaGerada = useMemo<FichaPrototipoOutput>(() => {
    const lider = membros[0] || { nome: "", curso: "" };
    return {
      edicao: edicao.edicao.id,
      equipe_id: "INSC-" + (lider.nome ? lider.nome.substring(0, 3).toUpperCase() : "001"),
      formas: formasSelecionadas,
      funcao: pecaFuncao || nomeSolucao || "Solução inovadora para saúde",
      usuario: quemVive || fraseDefinir.quem || "Profissionais e pacientes",
      dor: oQuePerde || fraseDefinir.por_que || "Ineficiência ou sobrecarga no atendimento",
      eixo: eixoTematico,
      software: formasSelecionadas.includes("forma_a")
        ? {
            usuario_principal: softUsuario || quemVive,
            telas: softTelas.filter((t) => t.nome),
            dado_entra: softDadoEntra,
            dado_sai: softDadoSai,
            integracao: softIntegracao || null,
            plataforma: softPlataforma,
            tom_visual: softTomVisual || null,
          }
        : undefined,
      peca_3d: formasSelecionadas.includes("forma_b")
        ? {
            encaixe: {
              em: pecaEncaixaEm,
              medida_mm: parseFloat(pecaMedidaEncaixe) || null,
              folga_mm: pecaFolga === "Mais ou menos 0,5 mm" ? 0.5 : pecaFolga === "Mais ou menos 1 mm" ? 1.0 : pecaFolga === "Mais ou menos 2 mm" ? 2.0 : null,
            },
            envelope_mm: pecaEnvelope,
            cabe_na_mesa: envelopeCheck.cabeNaMesa,
            requisitos: pecaRequisitos,
            material: pecaMaterial || sugestaoMaterial.materialId,
            material_sugerido_por: sugestaoMaterial.razao,
            quantidade: pecaQuantidade,
            montagem: pecaMontagem,
          }
        : undefined,
      dispositivo: formasSelecionadas.includes("forma_c")
        ? {
            mede_ou_aciona: dispMedeAciona,
            onde_fica: dispOndeFica,
            alimentacao: dispAlimentacao,
            depende_de: dispDependeDe,
            ja_existe: dispJaExiste,
          }
        : undefined,
      servico: formasSelecionadas.includes("forma_d")
        ? {
            quem_executa_hoje: servQuemExecuta,
            passo_a_passo_atual: servPassoAtual.filter((p) => p),
            o_que_muda: servOQueMuda,
            artefato: servArtefato,
            quem_valida: servQuemValida,
          }
        : undefined,
      contato_paciente: isTravaAcionada,
      trava_sanitaria: {
        acionada: isTravaAcionada,
        motivos: travaSanitaria.filter((t) => t !== "nenhuma"),
        restricao: isTravaAcionada ? "maquete_de_demonstracao" : "nenhuma",
      },
      competencias_equipe: allTeamSkills,
      falta_na_equipe: faltaNaEquipe,
      fila_comissao:
        isTravaAcionada ||
        formasSelecionadas.includes("forma_c") ||
        formasSelecionadas.includes("forma_d") ||
        !envelopeCheck.cabeNaMesa,
      ods: trilha === "sem_ideia" ? undefined : odsSelecionadas,
      status: "pronta_para_geracao",
    };
  }, [
    membros,
    formasSelecionadas,
    pecaFuncao,
    nomeSolucao,
    quemVive,
    fraseDefinir,
    oQuePerde,
    eixoTematico,
    softUsuario,
    softTelas,
    softDadoEntra,
    softDadoSai,
    softIntegracao,
    softPlataforma,
    softTomVisual,
    pecaEncaixaEm,
    pecaMedidaEncaixe,
    pecaFolga,
    pecaEnvelope,
    envelopeCheck,
    pecaRequisitos,
    pecaMaterial,
    sugestaoMaterial,
    pecaQuantidade,
    pecaMontagem,
    dispMedeAciona,
    dispOndeFica,
    dispAlimentacao,
    dispDependeDe,
    dispJaExiste,
    servQuemExecuta,
    servPassoAtual,
    servOQueMuda,
    servArtefato,
    servQuemValida,
    isTravaAcionada,
    travaSanitaria,
    allTeamSkills,
    faltaNaEquipe,
  ]);

  // Adicionar integrante à equipe (mínimo 3, máximo 6)
  const handleAddMember = () => {
    if (membros.length >= edicao.equipe.max_integrantes) return;
    setMembros([
      ...membros,
      {
        id: `membro-${Date.now()}`,
        nome: "",
        email: "",
        telefone: "",
        vinculo: "Aluno de graduacao",
        curso: "",
        disponibilidade: [...OPCOES_DISPONIBILIDADE],
        competencias: [],
        papel: "Construir a solucao",
      },
    ]);
  };

  const handleRemoveMember = (index: number) => {
    if (index === 0) return; // Líder não pode ser removido
    setMembros(membros.filter((_, i) => i !== index));
  };

  const handleUpdateMember = (index: number, field: keyof TeamMember, value: any) => {
    const updated = [...membros];
    updated[index] = { ...updated[index], [field]: value };
    setMembros(updated);
  };

  // Validação do que a Comissão exige para seguir
  const validarEtapa = (etapa: number): string | null => {
    if (etapa === 1) {
      const lider = membros[0];
      if (!lider?.nome.trim()) return "Preencha o nome completo do responsável pela equipe.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lider.email.trim()))
        return "Informe um e-mail válido do responsável. É por ele que o mentor entra em contato.";
      const digitos = lider.telefone.replace(/\D/g, "");
      if (digitos.length < 10 || digitos.length > 13)
        return "Informe o WhatsApp do responsável com DDD. É por ele que o mentor entra em contato.";
    }
    if (etapa === 7) {
      if (trilha !== "sem_ideia" && (odsSelecionadas.length < 1 || odsSelecionadas.length > MAX_ODS))
        return `Marque de 1 a ${MAX_ODS} ODS que a solução espera atender.`;
      const opcoesAceite: string[] = formulario.etapas[7].campos.find((c: any) => c.id === "aceites")?.opcoes || [];
      if (!opcoesAceite.every((o) => aceites.includes(o)))
        return "Para enviar, é preciso marcar todas as declarações de aceite.";
    }
    return null;
  };

  // Navegação entre etapas
  const handleNext = () => {
    const erro = validarEtapa(currentStep);
    if (erro) {
      alert(erro);
      return;
    }
    const currentIndex = availableSteps.indexOf(currentStep);
    if (currentIndex < availableSteps.length - 1) {
      setCurrentStep(availableSteps[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    const currentIndex = availableSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(availableSteps[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Submissão final
  const handleSubmit = async () => {
    for (const etapa of [1, 7]) {
      const erro = availableSteps.includes(etapa) ? validarEtapa(etapa) : null;
      if (erro) {
        alert(erro);
        setCurrentStep(etapa);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }
    setIsSubmitting(true);
    try {
      const payload: InscriptionPayload = {
        trilha,
        lider: membros[0],
        membros: membros.slice(1),
        equipeNome: trilha === "sem_ideia" ? undefined : equipeNome,
        empatizar: { quem_vive: quemVive, o_que_perde: oQuePerde, como_sabe: comoSabe },
        definir: {
          frase: fraseDefinir,
          frequencia,
          como_resolvem_hoje: comoResolvemHoje,
          por_que_nao_resolve: porQueNaoResolve,
          eixo: eixoTematico,
        },
        idear: {
          frase: fraseIdear,
          nome_solucao: nomeSolucao,
          categoria: categoriaSolucao,
          tres_passos: tresPassos,
        },
        escopo: { e: escopoE, nao_e: escopoNaoE, faz: escopoFaz, nao_faz: escopoNaoFaz },
        fechamento: {
          como_saberemos: comoSaberemos,
          maior_duvida: maiorDuvida,
          aberta_a_novos: abertaANovos,
          aceites,
          ods: trilha === "sem_ideia" ? [] : odsSelecionadas,
        },
        forma: {
          formas: formasSelecionadas,
          campos_forma: {
            software: softTelas,
            peca_3d: { pecaEncaixaEm, pecaEnvelope, pecaMaterial },
          },
          trava_sanitaria: {
            acionada: isTravaAcionada,
            motivos: travaSanitaria,
          },
        },
        ficha_prototipo: fichaGerada,
      };

      const result = await submitInscription(payload);
      setSubmissionResult(result);
      setCurrentStep(9); // Tela final
    } catch (err) {
      console.error("Erro ao enviar inscrição:", err);
      alert("Houve um problema ao enviar a inscrição. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download do JSON da ficha estruturada
  const handleDownloadFicha = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fichaGerada, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ficha-prototipo-${fichaGerada.equipe_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-4xl min-w-0 mx-auto px-3 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-8 relative">
      {/* Toast Flutuante de Confirmação */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-[var(--marca-fundo)] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-2.5 text-xs font-mono">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner de Rascunho Recuperado */}
      {showDraftBanner && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="font-bold">Rascunho recuperado: </span>
              <span>
                Continuando de onde parou
                {equipeNome ? ` (${equipeNome})` : ""}
                {lastSavedTime ? ` · Salvo às ${lastSavedTime}` : ""}.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setShowDraftBanner(false)}
              className="text-[var(--fg-2)] hover:text-[var(--fg)] text-xs font-mono px-2 py-1 rounded cursor-pointer"
            >
              Dispensar
            </button>
            <button
              type="button"
              onClick={handleClearDraft}
              className="inline-flex items-center gap-1 text-[var(--erro)] hover:underline text-xs font-mono px-2 py-1 cursor-pointer"
              title="Limpar rascunho e começar novo formulário"
            >
              <RotateCcw size={12} />
              <span>Limpar Rascunho</span>
            </button>
          </div>
        </div>
      )}

      {/* Navegação de Etapas Inteligente e Responsiva */}
      <StepProgressNav
        currentStep={currentStep}
        availableSteps={availableSteps}
        onSelectStep={(s) => {
          setCurrentStep(s);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        draftSaved={draftSaved}
        onSaveDraft={handleManualSaveDraft}
        lastSavedTime={lastSavedTime}
      />

      {/* Conteúdo da Etapa Atual */}
      <div className="w-full max-w-full min-w-0 bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-4 sm:p-10 shadow-sm space-y-6 sm:space-y-8">
        {/* ETAPA 0: ESCOLHA DE TRILHA */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--marca)] font-bold">
                Passo Inicial
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)]">
                {formulario.etapas[0].titulo}
              </h2>
              <p className="text-sm text-[var(--fg-2)]">{formulario.etapas[0].ajuda}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2">
              {formulario.etapas[0].opcoes.map((opcao) => {
                const isSelected = trilha === opcao.trilha;
                return (
                  <button
                    key={opcao.trilha}
                    type="button"
                    onClick={() => setTrilha(opcao.trilha as TrackId)}
                    className={`text-left p-6 rounded-xl border-2 transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? "border-[var(--acao)] bg-[var(--acao)]/5 shadow-xs"
                        : "border-[var(--borda)] hover:border-[var(--marca-2)] bg-[var(--surf)]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <h3 className="text-lg font-bold text-[var(--fg)]">{opcao.titulo}</h3>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-[var(--acao)] bg-[var(--acao)]" : "border-[var(--borda)]"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--fg-2)] leading-relaxed">{opcao.descricao}</p>
                    <span className="font-mono text-xs text-[var(--fg-2)] pt-2 border-t border-[var(--borda)]/50">
                      ⏱ {opcao.estimativa}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ETAPA 1: QUEM É VOCÊ (LÍDER E MEMBROS) */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--marca)] font-bold">
                Identificação & Contato
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)]">Quem é você</h2>
              <p className="text-sm text-[var(--fg-2)]">
                {trilha === "equipe_com_ideia"
                  ? "Cadastre o líder e os integrantes da sua equipe (entre 3 e 6 pessoas)."
                  : "Seus dados pessoais para contato e geração do voucher oficial de credenciamento."}
              </p>
            </div>

            {trilha === "equipe_com_ideia" && (
              <div className="space-y-1.5 p-4 bg-[var(--surf-2)] rounded-xl border border-[var(--borda)]">
                <label className="text-sm font-bold text-[var(--fg)]">Nome da Equipe</label>
                <input
                  type="text"
                  value={equipeNome}
                  onChange={(e) => setEquipeNome(e.target.value)}
                  placeholder="Ex: BioSync, HealTech, Pulso Digital..."
                  className="w-full bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-3.5 py-2.5 text-base focus:border-[var(--acao)] focus:outline-hidden"
                />
              </div>
            )}

            {/* Lista de Integrantes */}
            <div className="space-y-6">
              {membros.map((membro, index) => (
                <div
                  key={membro.id}
                  className="p-5 sm:p-6 bg-[var(--surf)] border border-[var(--borda)] rounded-xl space-y-4 shadow-2xs relative"
                >
                  <div className="flex items-center justify-between border-b border-[var(--borda)] pb-3">
                    <span className="font-bold text-sm text-[var(--marca)] uppercase tracking-wider">
                      {index === 0 ? "Líder da Inscrição (Pessoa de Contato)" : `Integrante 0${index + 1}`}
                    </span>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(index)}
                        className="text-xs text-[var(--erro)] hover:underline inline-flex items-center gap-1 font-mono"
                      >
                        <Trash2 size={13} />
                        <span>Remover</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--fg)]">Nome completo *</label>
                      <input
                        type="text"
                        value={membro.nome}
                        onChange={(e) => handleUpdateMember(index, "nome", e.target.value)}
                        placeholder="Nome civil do participante"
                        className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3 py-2 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--fg)]">
                        {index === 0 ? "E-mail do responsável pela equipe *" : "E-mail"}
                      </label>
                      <input
                        type="email"
                        value={membro.email}
                        onChange={(e) => handleUpdateMember(index, "email", e.target.value)}
                        placeholder="email@exemplo.com"
                        className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3 py-2 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--fg)]">
                        {index === 0 ? "WhatsApp do responsável pela equipe *" : "WhatsApp"}
                      </label>
                      <input
                        type="tel"
                        value={membro.telefone}
                        onChange={(e) => handleUpdateMember(index, "telefone", e.target.value)}
                        placeholder="(43) 99999-9999"
                        className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3 py-2 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                      />
                      {index === 0 && (
                        <p className="text-[11px] text-[var(--fg-2)]">{formulario.etapas[1].campos[2].ajuda}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--fg)]">Vínculo institucional *</label>
                      <select
                        value={membro.vinculo}
                        onChange={(e) => handleUpdateMember(index, "vinculo", e.target.value)}
                        className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3 py-2 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                      >
                        {formulario.etapas[1].campos[3].opcoes?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-[var(--fg)]">Curso ou instituição *</label>
                      <input
                        type="text"
                        value={membro.curso}
                        onChange={(e) => handleUpdateMember(index, "curso", e.target.value)}
                        placeholder="Ex: Engenharia de Software, Enfermagem, Medicina, ADS, etc."
                        className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3 py-2 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {trilha === "equipe_com_ideia" && membros.length < edicao.equipe.max_integrantes && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="w-full py-3 border-2 border-dashed border-[var(--borda)] hover:border-[var(--acao)] rounded-xl text-sm font-bold text-[var(--marca-2)] hover:text-[var(--acao)] flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus size={16} />
                  <span>Adicionar integrante à equipe ({membros.length}/{edicao.equipe.max_integrantes})</span>
                </button>
              )}

              {trilha === "equipe_com_ideia" && membros.length < edicao.equipe.min_integrantes && (
                <div className="p-3 bg-[var(--alerta)]/10 border-l-3 border-[var(--alerta)] text-xs text-[var(--fg)]">
                  ⚠️ Pelo regulamento, a equipe precisa ter no mínimo {edicao.equipe.min_integrantes} pessoas e no máximo {edicao.equipe.max_integrantes}.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ETAPA 2: O QUE VOCÊ SABE FAZER (COMPETÊNCIAS) */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--marca)] font-bold">
                Mapeamento de Habilidades
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)]">O que você sabe fazer</h2>
              <p className="text-sm text-[var(--fg-2)] leading-relaxed">
                {competencias._regra_do_grupo_primeira_vez ||
                  "Marque tudo que você já fez ou tem vontade de fazer. Não precisa ser especialista."}
              </p>
            </div>

            <div className="space-y-6">
              {competencias.grupos.map((grupo) => (
                <div key={grupo.id} className="space-y-2.5">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--fg-2)] font-bold">
                    {grupo.rotulo}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {grupo.opcoes.map((op) => {
                      const isSelected = membros[0].competencias.includes(op.id);
                      return (
                        <button
                          key={op.id}
                          type="button"
                          onClick={() => {
                            const current = membros[0].competencias;
                            const updated = isSelected
                              ? current.filter((c) => c !== op.id)
                              : [...current, op.id];
                            handleUpdateMember(0, "competencias", updated);
                          }}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            isSelected
                              ? "bg-[var(--marca)] border-[var(--marca)] text-white font-medium"
                              : op.destaque
                              ? "border-[var(--acao)] text-[var(--acao)] font-semibold bg-[var(--acao)]/5"
                              : "border-[var(--borda)] text-[var(--fg-2)] hover:border-[var(--marca-2)]"
                          }`}
                        >
                          {op.rotulo}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Papel que pretende assumir */}
            <div className="pt-4 border-t border-[var(--borda)] space-y-2">
              <label className="text-sm font-bold text-[var(--fg)]">
                Papel que pretendo assumir na maratona
              </label>
              <select
                value={membros[0].papel}
                onChange={(e) => handleUpdateMember(0, "papel", e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--acao)] focus:outline-hidden"
              >
                {formulario.etapas[2].campos[1].opcoes?.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[var(--fg-2)]">
                {formulario.etapas[2].campos[1].ajuda}
              </p>
            </div>
          </div>
        )}

        {/* ETAPA 3: EMPATIZAR (DESIGN THINKING) */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--acao)] font-bold">
                Design Thinking · Etapa 1
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)]">
                EMPATIZAR, de quem é a dor
              </h2>
              <p className="text-sm text-[var(--fg-2)]">
                Antes de pensar em qualquer aplicativo ou produto, precisamos entender a pessoa real que vive o problema.
              </p>
            </div>

            {/* Quem vive esse problema */}
            <div className="space-y-3">
              <label className="text-base font-bold text-[var(--fg)]">
                Quem vive esse problema? *
              </label>
              <p className="text-xs text-[var(--fg-2)]">
                {formulario.etapas[3].campos[0].ajuda}
              </p>
              <input
                type="text"
                value={quemVive}
                onChange={(e) => setQuemVive(e.target.value)}
                placeholder="Ex: A enfermeira do plantão noturno da UBS do Jardim Leonor"
                className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3.5 py-2.5 text-base focus:border-[var(--acao)] focus:outline-hidden"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[var(--acao)]/5 border border-[var(--acao)]/30 rounded-lg text-xs space-y-1">
                  <span className="font-mono uppercase font-bold text-[var(--acao)] block">Assim funciona</span>
                  <span className="text-[var(--fg)]">{formulario.etapas[3].campos[0].exemplo_bom}</span>
                </div>
                <div className="p-3 bg-[var(--erro)]/5 border border-[var(--erro)]/30 rounded-lg text-xs space-y-1">
                  <span className="font-mono uppercase font-bold text-[var(--erro)] block">Assim não</span>
                  <span className="text-[var(--fg)]">{formulario.etapas[3].campos[0].exemplo_ruim}</span>
                </div>
              </div>
            </div>

            {/* O que essa pessoa perde ou sente */}
            <div className="space-y-3">
              <label className="text-base font-bold text-[var(--fg)]">
                O que essa pessoa perde ou sente? *
              </label>
              <p className="text-xs text-[var(--fg-2)]">
                {formulario.etapas[3].campos[1].ajuda}
              </p>
              <textarea
                rows={3}
                value={oQuePerde}
                onChange={(e) => setOQuePerde(e.target.value)}
                placeholder="Ex: Ela refaz o mesmo cadastro três vezes por turno e atrasa o atendimento dos pacientes com dor..."
                className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg p-3 text-sm focus:border-[var(--acao)] focus:outline-hidden"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[var(--acao)]/5 border border-[var(--acao)]/30 rounded-lg text-xs space-y-1">
                  <span className="font-mono uppercase font-bold text-[var(--acao)] block">Assim funciona</span>
                  <span className="text-[var(--fg)]">{formulario.etapas[3].campos[1].exemplo_bom}</span>
                </div>
                <div className="p-3 bg-[var(--erro)]/5 border border-[var(--erro)]/30 rounded-lg text-xs space-y-1">
                  <span className="font-mono uppercase font-bold text-[var(--erro)] block">Assim não</span>
                  <span className="text-[var(--fg)]">{formulario.etapas[3].campos[1].exemplo_ruim}</span>
                </div>
              </div>
            </div>

            {/* Como você sabe disso */}
            <div className="space-y-3">
              <label className="text-base font-bold text-[var(--fg)]">
                Como você sabe disso? *
              </label>
              <p className="text-xs text-[var(--fg-2)]">
                {formulario.etapas[3].campos[2].ajuda}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {formulario.etapas[3].campos[2].opcoes?.map((opcao) => {
                  const isSelected = comoSabe.includes(opcao);
                  const isDestaque = opcao === formulario.etapas[3].campos[2].opcao_destaque;
                  return (
                    <button
                      key={opcao}
                      type="button"
                      onClick={() => {
                        setComoSabe(
                          isSelected ? comoSabe.filter((s) => s !== opcao) : [...comoSabe, opcao]
                        );
                      }}
                      className={`text-xs px-3.5 py-2 rounded-full border transition-all ${
                        isSelected
                          ? "bg-[var(--marca)] border-[var(--marca)] text-white font-medium"
                          : isDestaque
                          ? "border-[var(--acao)] text-[var(--acao)] font-bold bg-[var(--acao)]/5"
                          : "border-[var(--borda)] text-[var(--fg-2)] hover:border-[var(--marca-2)]"
                      }`}
                    >
                      {opcao}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 4: DEFINIR (DESIGN THINKING) */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--acao)] font-bold">
                Design Thinking · Etapa 2
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)]">
                DEFINIR, qual é o problema exatamente
              </h2>
              <p className="text-sm text-[var(--fg-2)]">
                Sintetize a dor preenchendo as lacunas da frase estruturada abaixo.
              </p>
            </div>

            {/* Frase com lacunas */}
            <div className="p-5 sm:p-6 bg-[var(--bg)] border border-[var(--borda)] rounded-xl space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--fg-2)] font-bold block">
                A dor em uma frase estruturada
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[var(--acao)] font-mono">1. Quem precisa</span>
                  <input
                    type="text"
                    value={fraseDefinir.quem}
                    onChange={(e) => setFraseDefinir({ ...fraseDefinir, quem: e.target.value })}
                    placeholder="Ex: A equipe de enfermagem da UTI..."
                    className="w-full bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-3 py-2 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[var(--acao)] font-mono">2. De o quê</span>
                  <input
                    type="text"
                    value={fraseDefinir.o_que}
                    onChange={(e) => setFraseDefinir({ ...fraseDefinir, o_que: e.target.value })}
                    placeholder="Ex: Um suporte confiável para bomba de infusão..."
                    className="w-full bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-3 py-2 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[var(--acao)] font-mono">3. Porque (a razão)</span>
                  <input
                    type="text"
                    value={fraseDefinir.por_que}
                    onChange={(e) => setFraseDefinir({ ...fraseDefinir, por_que: e.target.value })}
                    placeholder="Ex: O fio desconecta durante a transferência do leito..."
                    className="w-full bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-3 py-2 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[var(--acao)] font-mono">4. Mas hoje (o obstáculo)</span>
                  <input
                    type="text"
                    value={fraseDefinir.o_que_atrapalha}
                    onChange={(e) => setFraseDefinir({ ...fraseDefinir, o_que_atrapalha: e.target.value })}
                    placeholder="Ex: Eles usam esparadrapo improvisado que solta..."
                    className="w-full bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-3 py-2 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Frequência */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--fg)]">
                Com que frequência esse problema acontece?
              </label>
              <select
                value={frequencia}
                onChange={(e) => setFrequencia(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--acao)] focus:outline-hidden"
              >
                {formulario.etapas[4].campos[0].opcoes?.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Como é resolvido hoje e por que não resolve */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--fg)]">Como é resolvido hoje?</label>
                <p className="text-xs text-[var(--fg-2)]">{formulario.etapas[4].campos[1].ajuda}</p>
                <textarea
                  rows={3}
                  value={comoResolvemHoje}
                  onChange={(e) => setComoResolvemHoje(e.target.value)}
                  placeholder="Ex: Papel na prancheta, mensagens no WhatsApp..."
                  className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg p-3 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--fg)]">Por que isso não resolve?</label>
                <p className="text-xs text-[var(--fg-2)]">O que falha na gambiarra atual?</p>
                <textarea
                  rows={3}
                  value={porQueNaoResolve}
                  onChange={(e) => setPorQueNaoResolve(e.target.value)}
                  placeholder="Ex: Perde-se informação na troca de turno e não há histórico confiável..."
                  className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg p-3 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Eixo Temático */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--fg)]">Eixo Temático Prioritário</label>
              <select
                value={eixoTematico}
                onChange={(e) => setEixoTematico(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--acao)] focus:outline-hidden font-medium"
              >
                {edicao.eixos_tematicos.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ETAPA 5: IDEAR E A VISÃO DO PRODUTO (LEAN INCEPTION) */}
        {currentStep === 5 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--marca-2)] font-bold">
                Lean Inception · Visão do Produto
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)]">
                IDEAR e a visão do produto
              </h2>
              <p className="text-sm text-[var(--fg-2)]">
                Defina o nome preliminar da solução e como ela funcionaria de maneira enxuta.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--fg)]">
                  Nome provisório da solução *
                </label>
                <p className="text-xs text-[var(--fg-2)]">{formulario.etapas[5].campos[0].ajuda}</p>
                <input
                  type="text"
                  value={nomeSolucao}
                  onChange={(e) => setNomeSolucao(e.target.value)}
                  placeholder="Ex: DoseCerta, LeitoÁgil, SmartFix..."
                  className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3 py-2.5 text-base focus:border-[var(--acao)] focus:outline-hidden font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--fg)]">Categoria *</label>
                <p className="text-xs text-[var(--fg-2)]">Que tipo de produto melhor atende?</p>
                <select
                  value={categoriaSolucao}
                  onChange={(e) => setCategoriaSolucao(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                >
                  {formulario.etapas[5].campos[1].opcoes?.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Três passos essenciais */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-[var(--fg)]">
                Como funcionaria, em três passos *
              </label>
              <p className="text-xs text-[var(--fg-2)]">{formulario.etapas[5].campos[2].ajuda}</p>
              <div className="space-y-2.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[var(--surf-2)] border border-[var(--borda)] flex items-center justify-center font-mono text-xs font-bold text-[var(--marca)] shrink-0">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      value={tresPassos[i]}
                      onChange={(e) => {
                        const copy = [...tresPassos];
                        copy[i] = e.target.value;
                        setTresPassos(copy);
                      }}
                      placeholder={
                        i === 0
                          ? "Passo 1: O profissional fotografa ou cadastra a requisição..."
                          : i === 1
                          ? "Passo 2: O sistema cruza os dados e gera o alerta instantâneo..."
                          : "Passo 3: A farmácia recebe a dosagem validada pronta para entrega."
                      }
                      className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3 py-2 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 6: É, NÃO É, FAZ, NÃO FAZ (DELIMITAÇÃO DE ESCOPO) */}
        {currentStep === 6 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--marca-2)] font-bold">
                Lean Inception · Escopo
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)]">
                É, NÃO É, FAZ, NÃO FAZ
              </h2>
              <p className="text-sm text-[var(--fg-2)]">
                {formulario.etapas[6].microcopy_topo}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* É */}
              <div className="p-4 bg-[var(--surf)] border-2 border-[var(--borda)] rounded-xl space-y-2">
                <span className="font-mono text-xs font-bold text-[var(--acao)] uppercase tracking-wider">
                  É (A natureza da solução)
                </span>
                <input
                  type="text"
                  value={escopoE}
                  onChange={(e) => setEscopoE(e.target.value)}
                  placeholder="Ex: Um painel simples de ocupação de leitos"
                  className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg p-2.5 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                />
              </div>

              {/* NÃO É */}
              <div className="p-4 bg-[var(--surf)] border-2 border-[var(--borda)] rounded-xl space-y-2">
                <span className="font-mono text-xs font-bold text-[var(--erro)] uppercase tracking-wider">
                  NÃO É (O que podem confundir com ela)
                </span>
                <input
                  type="text"
                  value={escopoNaoE}
                  onChange={(e) => setEscopoNaoE(e.target.value)}
                  placeholder="Ex: Não é um prontuário eletrônico completo"
                  className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg p-2.5 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                />
              </div>

              {/* FAZ */}
              <div className="p-4 bg-[var(--surf)] border-2 border-[var(--borda)] rounded-xl space-y-2">
                <span className="font-mono text-xs font-bold text-[var(--acao)] uppercase tracking-wider">
                  FAZ (Até 3 funcionalidades essenciais)
                </span>
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <input
                      key={i}
                      type="text"
                      value={escopoFaz[i]}
                      onChange={(e) => {
                        const copy = [...escopoFaz];
                        copy[i] = e.target.value;
                        setEscopoFaz(copy);
                      }}
                      placeholder={`Funcionalidade ${i + 1}`}
                      className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-2.5 py-1.5 text-xs focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  ))}
                </div>
              </div>

              {/* NÃO FAZ */}
              <div className="p-4 bg-[var(--surf)] border-2 border-[var(--borda)] rounded-xl space-y-2">
                <span className="font-mono text-xs font-bold text-[var(--erro)] uppercase tracking-wider">
                  NÃO FAZ (Fora do escopo)
                </span>
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <input
                      key={i}
                      type="text"
                      value={escopoNaoFaz[i]}
                      onChange={(e) => {
                        const copy = [...escopoNaoFaz];
                        copy[i] = e.target.value;
                        setEscopoNaoFaz(copy);
                      }}
                      placeholder={`Fora do escopo ${i + 1}`}
                      className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-2.5 py-1.5 text-xs focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 7: FECHAMENTO & ACEITES LEGAIS */}
        {currentStep === 7 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--marca)] font-bold">
                Métricas & Termos
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)]">Fechamento</h2>
              <p className="text-sm text-[var(--fg-2)]">
                Como saberemos que a solução deu certo e termos legais de participação.
              </p>
            </div>

            {trilha !== "sem_ideia" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--fg)]">
                    Como saberemos que deu certo? *
                  </label>
                  <p className="text-xs text-[var(--fg-2)]">{formulario.etapas[7].campos[0].ajuda}</p>
                  <input
                    type="text"
                    value={comoSaberemos}
                    onChange={(e) => setComoSaberemos(e.target.value)}
                    placeholder="Ex: Reduzir em 30 minutos o tempo entre a alta e o leito liberado"
                    className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--fg)]">
                    A maior dúvida de vocês *
                  </label>
                  <p className="text-xs text-[var(--acao)] font-semibold">
                    💡 {formulario.etapas[7].campos[1].ajuda}
                  </p>
                  <textarea
                    rows={2}
                    value={maiorDuvida}
                    onChange={(e) => setMaiorDuvida(e.target.value)}
                    placeholder="Ex: Não temos certeza se a ANVISA exige certificação de classe 2 para esse tipo de sensor..."
                    className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg p-3 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                  />
                </div>

                <div className="p-4 bg-[var(--surf-2)] rounded-xl space-y-2">
                  <label className="text-sm font-bold text-[var(--fg)] block">
                    Equipe aberta a novos integrantes no Banco de Talentos?
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setAbertaANovos(true)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                        abertaANovos
                          ? "bg-[var(--acao)] border-[var(--acao)] text-white"
                          : "border-[var(--borda)] bg-[var(--surf)] text-[var(--fg-2)]"
                      }`}
                    >
                      Sim, queremos integrantes
                    </button>
                    <button
                      type="button"
                      onClick={() => setAbertaANovos(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                        !abertaANovos
                          ? "bg-[var(--marca)] border-[var(--marca)] text-white"
                          : "border-[var(--borda)] bg-[var(--surf)] text-[var(--fg-2)]"
                      }`}
                    >
                      Não, equipe fechada
                    </button>
                  </div>
                </div>
              </>
            )}

            {trilha !== "sem_ideia" && (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <label className="text-sm font-bold text-[var(--fg)]">{CAMPO_ODS.rotulo} *</label>
                  <span className="text-xs font-mono text-[var(--fg-2)] shrink-0">
                    {odsSelecionadas.length}/{MAX_ODS}
                  </span>
                </div>
                <p className="text-xs text-[var(--fg-2)]">{CAMPO_ODS.ajuda}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ods.lista.map((o) => {
                    const marcada = odsSelecionadas.includes(o.numero);
                    const bloqueada = !marcada && odsSelecionadas.length >= MAX_ODS;
                    return (
                      <button
                        key={o.numero}
                        type="button"
                        aria-pressed={marcada}
                        disabled={bloqueada}
                        onClick={() =>
                          setOdsSelecionadas(
                            marcada ? odsSelecionadas.filter((n) => n !== o.numero) : [...odsSelecionadas, o.numero]
                          )
                        }
                        className={`flex items-center gap-3 p-2 pr-3 rounded-lg border text-left transition-all ${
                          marcada
                            ? "border-[var(--acao)] bg-[var(--acao)]/10"
                            : "border-[var(--borda)] bg-[var(--surf)] hover:bg-[var(--surf-2)]"
                        } ${bloqueada ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <span
                          className="w-9 h-9 shrink-0 rounded-md flex items-center justify-center text-white font-black text-sm"
                          style={{ background: o.cor }}
                        >
                          {o.numero}
                        </span>
                        <span className="text-xs font-medium text-[var(--fg)] leading-snug flex-1">{o.nome}</span>
                        {marcada && <CheckCircle size={16} className="text-[var(--acao)] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Aceites obrigatórios */}
            <div className="space-y-3 pt-4 border-t border-[var(--borda)]">
              <label className="text-sm font-bold text-[var(--fg)]">
                Declarações e Consentimento LGPD (Art. 8º, §1º) *
              </label>
              {formulario.etapas[7].campos[3].opcoes?.map((opcao) => {
                const checked = aceites.includes(opcao);
                return (
                  <label
                    key={opcao}
                    className="flex items-start gap-3 p-3 rounded-lg border border-[var(--borda)] hover:bg-[var(--surf-2)] cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setAceites(
                          e.target.checked ? [...aceites, opcao] : aceites.filter((a) => a !== opcao)
                        );
                      }}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--acao)] focus:ring-[var(--acao)]"
                    />
                    <span className="text-xs text-[var(--fg)] font-medium leading-relaxed">{opcao}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* ETAPA 8: QUE FORMA A SOLUÇÃO VAI TER */}
        {currentStep === 8 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--marca)] font-bold">
                Especificação do Protótipo
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)]">
                Que forma a solução vai ter?
              </h2>
              <p className="text-sm text-[var(--fg-2)]">
                Selecione as formas que compõem sua proposta (pode marcar mais de uma).
              </p>
            </div>

            {/* Regra de Honestidade sobre IA */}
            <div className="p-4 bg-[var(--surf-2)] border-l-4 border-[var(--acento)] rounded-r-xl text-xs space-y-1">
              <span className="font-mono uppercase font-bold text-[var(--fg)] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[var(--acento)]" />
                <span>Regra sobre protótipos de Inteligência Artificial</span>
              </span>
              <p className="text-[var(--fg-2)] leading-relaxed">
                {formasPrototipo.regra_de_honestidade.texto}
              </p>
            </div>

            {/* Cartões de seleção de Formas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formasPrototipo.formas.map((forma) => {
                const isSelected = formasSelecionadas.includes(forma.id);
                const isPrincipal = formaPrincipal === forma.id;
                return (
                  <div
                    key={forma.id}
                    onClick={() => {
                      if (isSelected) {
                        if (formasSelecionadas.length > 1) {
                          setFormasSelecionadas(formasSelecionadas.filter((f) => f !== forma.id));
                          if (isPrincipal) {
                            setFormaPrincipal(formasSelecionadas.find((f) => f !== forma.id) || "forma_a");
                          }
                        }
                      } else {
                        setFormasSelecionadas([...formasSelecionadas, forma.id]);
                      }
                    }}
                    className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? "border-[var(--acao)] bg-[var(--acao)]/5 shadow-xs"
                        : "border-[var(--borda)] bg-[var(--surf)] hover:border-[var(--marca-2)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[var(--marca)] bg-[var(--surf-2)] px-2 py-0.5 rounded">
                        Forma {forma.letra}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-[var(--acao)] bg-[var(--acao)]" : "border-[var(--borda)]"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[var(--fg)]">{forma.titulo}</h4>
                      <p className="text-xs text-[var(--fg-2)] mt-1">{forma.descricao}</p>
                    </div>
                    <span className="text-[11px] font-mono text-[var(--fg-2)] pt-2 border-t border-[var(--borda)]/60">
                      Entregável: {forma.gera}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CAMPOS ESPECÍFICOS DA FORMA B (IMPRESSÃO 3D) */}
            {formasSelecionadas.includes("forma_b") && (
              <div className="p-6 bg-[var(--surf-2)] border border-[var(--borda)] rounded-2xl space-y-6">
                <div className="flex items-center gap-2 border-b border-[var(--borda)] pb-3">
                  <span className="font-mono text-xs font-bold text-[var(--acao)] bg-white px-2 py-0.5 rounded">
                    Forma B · Parâmetros 3D
                  </span>
                  <h4 className="text-base font-bold text-[var(--fg)]">Envelope & Impressão Física</h4>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--fg)]">
                    O que a peça faz, em uma frase? *
                  </label>
                  <input
                    type="text"
                    value={pecaFuncao}
                    onChange={(e) => setPecaFuncao(e.target.value)}
                    placeholder="Ex: Prende o frasco de soro na grade da cama sem precisar de fita"
                    className="w-full bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-3 py-2 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--fg)]">Em que ela encaixa?</label>
                    <input
                      type="text"
                      value={pecaEncaixaEm}
                      onChange={(e) => setPecaEncaixaEm(e.target.value)}
                      placeholder="Ex: Grade tubular de 22 mm, braço da cadeira..."
                      className="w-full bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-3 py-2 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--fg)]">Medida aproximada do encaixe (mm)</label>
                    <input
                      type="number"
                      value={pecaMedidaEncaixe}
                      onChange={(e) => setPecaMedidaEncaixe(e.target.value)}
                      placeholder="Ex: 22"
                      className="w-full bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-3 py-2 text-sm focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Envelope 3D com checagem contra mesa */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--fg)]">
                    Tamanho total aproximado (Comprimento × Largura × Altura em mm)
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <input
                      type="number"
                      value={pecaEnvelope[0]}
                      onChange={(e) => setPecaEnvelope([Number(e.target.value), pecaEnvelope[1], pecaEnvelope[2]])}
                      placeholder="X (mm)"
                      className="w-full min-w-0 bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm text-center focus:border-[var(--acao)] focus:outline-hidden"
                    />
                    <input
                      type="number"
                      value={pecaEnvelope[1]}
                      onChange={(e) => setPecaEnvelope([pecaEnvelope[0], Number(e.target.value), pecaEnvelope[2]])}
                      placeholder="Y (mm)"
                      className="w-full min-w-0 bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm text-center focus:border-[var(--acao)] focus:outline-hidden"
                    />
                    <input
                      type="number"
                      value={pecaEnvelope[2]}
                      onChange={(e) => setPecaEnvelope([pecaEnvelope[0], pecaEnvelope[1], Number(e.target.value)])}
                      placeholder="Z (mm)"
                      className="w-full min-w-0 bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm text-center focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>

                  {/* Simulador Interativo da Mesa 3D */}
                  <div className="pt-2">
                    <PrinterBedVisualizer
                      x={pecaEnvelope[0]}
                      y={pecaEnvelope[1]}
                      z={pecaEnvelope[2]}
                      limitX={envelopeCheck.limites.x}
                      limitY={envelopeCheck.limites.y}
                      limitZ={envelopeCheck.limites.z}
                    />
                  </div>
                </div>

                {/* Requisitos e Sugestão Automática de Material */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-[var(--fg)] block">
                    Ela precisa aguentar o que? (Requisitos de uso)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formasPrototipo.formas[1].campos[5].opcoes?.map((req) => {
                      const isChecked = pecaRequisitos.includes(req.id);
                      return (
                        <button
                          key={req.id}
                          type="button"
                          onClick={() => {
                            setPecaRequisitos(
                              isChecked
                                ? pecaRequisitos.filter((r) => r !== req.id)
                                : [...pecaRequisitos, req.id]
                            );
                          }}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            isChecked
                              ? "bg-[var(--marca)] text-white font-medium border-[var(--marca)]"
                              : "border-[var(--borda)] text-[var(--fg-2)] bg-white hover:border-[var(--marca-2)]"
                          }`}
                        >
                          {req.rotulo}
                        </button>
                      );
                    })}
                  </div>

                  {/* Sugestão reativa de material com explicação na tela */}
                  <div className="p-3 bg-white border border-[var(--borda)] rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--marca)]">
                      <span>Material sugerido:</span>
                      <span className="uppercase font-mono bg-[var(--surf-2)] px-2 py-0.5 rounded text-[var(--acao)]">
                        {sugestaoMaterial.materialId || "Conversa com o mentor"}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--fg-2)]">
                      <strong>Motivo:</strong> {sugestaoMaterial.razao}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TRAVA SANITÁRIA (EM TODAS AS FORMAS) */}
            <div className="p-5 sm:p-6 bg-[var(--surf)] border-2 border-[var(--borda)] rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className="text-[var(--alerta)]" />
                <h4 className="font-bold text-base text-[var(--fg)]">
                  {formasPrototipo.trava_sanitaria.rotulo} *
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {formasPrototipo.trava_sanitaria.opcoes.map((opcao) => {
                  const checked = travaSanitaria.includes(opcao.id);
                  return (
                    <label
                      key={opcao.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                        checked ? "border-[var(--alerta)] bg-[var(--alerta)]/5 font-bold" : "border-[var(--borda)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (opcao.id === "nenhuma") {
                            setTravaSanitaria(e.target.checked ? ["nenhuma"] : []);
                          } else {
                            const withoutNone = travaSanitaria.filter((t) => t !== "nenhuma");
                            setTravaSanitaria(
                              e.target.checked ? [...withoutNone, opcao.id] : withoutNone.filter((t) => t !== opcao.id)
                            );
                          }
                        }}
                        className="h-4 w-4 text-[var(--alerta)] focus:ring-[var(--alerta)] rounded border-gray-300"
                      />
                      <span>{opcao.rotulo}</span>
                    </label>
                  );
                })}
              </div>

              {isTravaAcionada && (
                <div className="p-3 bg-[var(--alerta)]/10 border-l-3 border-[var(--alerta)] rounded-r-lg text-xs text-[var(--fg)] space-y-1">
                  <span className="font-bold text-[var(--alerta)] font-mono uppercase block">Trava Sanitária Acionada</span>
                  <p>{formasPrototipo.trava_sanitaria.efeito.mensagem_na_tela}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ETAPA 9: CONFIRMAÇÃO & VOUCHER DE CREDENCIAMENTO */}
        {currentStep === 9 && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-[var(--acao)]/10 text-[var(--acao)] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={36} />
              </div>
              <h2 className="text-3xl font-extrabold text-[var(--fg)]">
                Inscrição Confirmada com Sucesso!
              </h2>
              <p className="text-sm text-[var(--fg-2)] max-w-lg mx-auto">
                Sua vaga e a da sua equipe estão garantidas no <strong>INOVA SAÚDE 2026</strong>.
                Os participantes já foram integrados ao sistema central de credenciamento.
              </p>
            </div>

            {/* Voucher Oficial de Credenciamento com QR Code */}
            <OfficialVoucher
              teamName={equipeNome}
              leaderName={membros[0]?.nome || "Líder"}
              leaderEmail={membros[0]?.email || ""}
              qrToken={submissionResult?.qrToken || `INOVA2026-CHECKIN-${submissionResult?.id || "DEMO"}`}
              membersCount={membros.length}
              membersList={membros}
              submissionId={submissionResult?.id || "DEMO"}
              onDownloadJson={handleDownloadFicha}
            />

            {/* Ficha de Protótipo Gerada (JSON Legível) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-[var(--fg)]">
                  Ficha de Protótipo Gerada (Schema Oficial)
                </h4>
                <button
                  type="button"
                  onClick={handleDownloadFicha}
                  className="text-xs font-mono text-[var(--marca)] hover:underline inline-flex items-center gap-1.5"
                >
                  <Download size={14} />
                  <span>Baixar JSON da Ficha</span>
                </button>
              </div>

              <pre className="p-4 sm:p-5 bg-black/90 text-green-400 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-gray-800">
                {JSON.stringify(fichaGerada, null, 2)}
              </pre>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-[var(--borda)]">
              <Link
                href="/banco-de-talentos"
                className="text-sm font-bold text-[var(--marca)] hover:underline"
              >
                ← Acessar Banco de Talentos
              </Link>
              <Link
                href="/"
                className="bg-[var(--marca)] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[var(--marca-2)] transition-colors"
              >
                Voltar à Página Inicial
              </Link>
            </div>
          </div>
        )}

        {/* Botões de Ação e Navegação com Salvamento Explícito */}
        {currentStep < 9 && (
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-[var(--borda)]">
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl border border-[var(--borda)] text-sm font-medium text-[var(--fg-2)] hover:bg-[var(--surf-2)] transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Voltar</span>
                </button>
              )}

              {/* Botão Salvar Rascunho */}
              <button
                type="button"
                onClick={handleManualSaveDraft}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl border border-[var(--borda)] bg-[var(--surf)] hover:bg-[var(--surf-2)] text-[11px] sm:text-xs font-mono font-bold text-[var(--fg)] transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Salvar rascunho no navegador agora"
              >
                <Save size={14} className={draftSaved ? "text-[var(--ok)] shrink-0" : "text-[var(--alerta)] shrink-0"} />
                <span className="truncate">{draftSaved ? (lastSavedTime ? `Salvo ${lastSavedTime}` : "Salvo") : "Salvar Rascunho"}</span>
              </button>
            </div>

            {currentStep === availableSteps[availableSteps.length - 2] ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-xl bg-[var(--acao)] hover:brightness-105 text-white font-bold text-sm sm:text-base shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? "Enviando Inscrição..." : "Finalizar Inscrição"}</span>
                <CheckCircle size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--marca)] hover:bg-[var(--marca-2)] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <span>Avançar</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[var(--fg-2)] font-mono">Carregando formulário...</div>}>
      <InscriptionContent />
    </Suspense>
  );
}
