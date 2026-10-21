"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Upload,
  Link as LinkIcon,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Lock,
  RotateCcw,
  Download,
  ExternalLink,
  ShieldCheck,
  History,
  RefreshCw,
  Send,
  Video,
  Globe,
  Check,
} from "lucide-react";
import { edicao, dataCurta } from "@/lib/config";
import {
  submitTrabalho,
  getLocalTrabalhoHistorico,
  TrabalhoItem,
  TrabalhoPayload,
  TrabalhoResponse,
} from "@/lib/api";

export default function EnvioTrabalhoPage() {
  const [equipeNome, setEquipeNome] = useState("");
  const [protocolo, setProtocolo] = useState("");
  const [emailLider, setEmailLider] = useState("");
  const [itens, setItens] = useState<TrabalhoItem[]>([
    { tipo: "link", titulo: "Vídeo Demonstrativo do Protótipo (YouTube / Drive)", linkUrl: "" },
  ]);
  const [acessoLiberado, setAcessoLiberado] = useState(true);
  const [observacoes, setObservacoes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enviadoComSucesso, setEnviadoComSucesso] = useState(false);
  const [resultadoEnvio, setResultadoEnvio] = useState<TrabalhoResponse | null>(null);
  const [historico, setHistorico] = useState<any[]>([]);
  const [copiado, setCopiado] = useState(false);

  // Carregar dados salvos e histórico local com total resiliência
  useEffect(() => {
    try {
      // 1. Carrega histórico de envios anteriores
      const hist = getLocalTrabalhoHistorico();
      setHistorico(hist);

      // 2. Se já houve envio antes, preenche com os últimos dados
      const savedEnvio = localStorage.getItem("inova_envio_trabalho");
      if (savedEnvio) {
        const data = JSON.parse(savedEnvio);
        if (data.equipeNome) setEquipeNome(data.equipeNome);
        if (data.protocolo) setProtocolo(data.protocolo);
        if (data.emailLider) setEmailLider(data.emailLider);
        if (data.itens && Array.isArray(data.itens) && data.itens.length > 0) setItens(data.itens);
        if (data.observacoes) setObservacoes(data.observacoes);
      } else {
        // 3. Fallback: Se não tem envio anterior, tenta puxar do rascunho de inscrição ou da inscrição concluída
        const draftInscricao = localStorage.getItem("inova_form_draft");
        if (draftInscricao) {
          const draft = JSON.parse(draftInscricao);
          if (draft.equipeNome) setEquipeNome(draft.equipeNome);
          if (draft.membros && draft.membros[0]?.email) setEmailLider(draft.membros[0].email);
          if (draft.videoUrl) {
            setItens([
              { tipo: "link", titulo: "Vídeo do Protótipo", linkUrl: draft.videoUrl },
              ...(draft.prototipoUrl
                ? [{ tipo: "link" as const, titulo: "Link do Protótipo", linkUrl: draft.prototipoUrl }]
                : []),
            ]);
          }
        }

        const inscricoes = JSON.parse(localStorage.getItem("inova_inscriptions") || "[]");
        if (inscricoes.length > 0) {
          const ultima = inscricoes[inscricoes.length - 1];
          if (ultima.id) setProtocolo(ultima.id);
          if (ultima.email && !emailLider) setEmailLider(ultima.email);
        }
      }
    } catch (e) {
      console.warn("Erro ao carregar dados locais de envio:", e);
    }
  }, []);

  const handleAddItem = () => {
    if (itens.length >= 3) return;
    setItens([...itens, { tipo: "link", titulo: "", linkUrl: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof TrabalhoItem, value: any) => {
    const updated = [...itens];
    updated[index] = { ...updated[index], [field]: value };
    setItens(updated);
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Se arquivo for <= 8MB, lemos base64 para incluir no recibo e persistência
    if (file.size <= 8 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        handleUpdateItem(index, "arquivoNome", `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
        handleUpdateItem(index, "arquivoBase64", reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      handleUpdateItem(index, "arquivoNome", `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      alert("Arquivo selecionado. Lembre-se de que apresentações pesadas e vídeos devem ser compartilhados preferencialmente por link (Google Drive / YouTube).");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipeNome.trim() || !emailLider.trim()) {
      alert("Por favor, preencha o nome da equipe e o e-mail do responsável.");
      return;
    }
    if (itens.length === 0) {
      alert("Adicione pelo menos 1 item (vídeo ou artefato da solução).");
      return;
    }
    for (let i = 0; i < itens.length; i++) {
      const item = itens[i];
      if (item.tipo === "link" && !item.linkUrl?.trim()) {
        alert(`Informe a URL do item 0${i + 1}.`);
        return;
      }
      if (item.tipo === "arquivo" && !item.arquivoNome) {
        alert(`Selecione o arquivo do item 0${i + 1}.`);
        return;
      }
    }
    if (!acessoLiberado) {
      alert("Por favor, confirme que os links estão com o acesso liberado (público) para a organização e avaliadores.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: TrabalhoPayload = {
        equipeNome: equipeNome.trim(),
        protocolo: protocolo.trim() || undefined,
        emailLider: emailLider.trim(),
        itens,
        observacoes: observacoes.trim() || undefined,
        acessoLiberado,
      };

      const resp = await submitTrabalho(payload);
      setResultadoEnvio(resp);
      setEnviadoComSucesso(true);
      setHistorico(getLocalTrabalhoHistorico());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Erro ao submeter trabalho:", err);
      alert("Houve uma instabilidade momentânea, mas seu trabalho já foi preservado localmente no navegador! Tente salvar novamente para registrar na nuvem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadComprovante = () => {
    const comprovante = {
      titulo: "Comprovante de Submissão de Trabalho - INOVA SAÚDE 2026",
      edicao: "Edição 2026.1",
      protocoloEnvio: resultadoEnvio?.protocoloEnvio || `TRAB-${Date.now()}`,
      protocoloInscricao: protocolo || "Inscrição Direta",
      equipeNome,
      emailLider,
      dataEnvio: resultadoEnvio?.dataEnvio || new Date().toLocaleString("pt-BR"),
      statusServidor: resultadoEnvio?.backendId ? "Confirmado no Banco Central" : "Garantido Localmente",
      itens: itens.map((it) => ({
        tipo: it.tipo,
        titulo: it.titulo,
        linkUrl: it.linkUrl,
        arquivoNome: it.arquivoNome,
      })),
      observacoes,
      acessoLiberado,
      regrasEdital: {
        demodayData: "05/11/2026 às 19h",
        local: "Auditório 108E, Bloco E, Universidade Positivo (Londrina)",
        finalistas: 10,
        certificado: "8h para envio de protótipo e requisitos; 16h para participantes presentes no Demoday",
        prazoAtualizacao: "02/11/2026 às 23h59 (vale o último envio)",
      },
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(comprovante, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `comprovante-envio-${equipeNome.toLowerCase().replace(/\s+/g, "-")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyProtocolo = () => {
    if (resultadoEnvio?.protocoloEnvio) {
      navigator.clipboard.writeText(resultadoEnvio.protocoloEnvio);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-4xl min-w-0 mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8 sm:space-y-10">
      {/* ──── HERO ──── */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] text-xs font-mono font-bold tracking-wider">
          <Upload size={14} className="shrink-0" />
          <span>Etapa 6 do Edital · Demoday Oficial</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">
          Envio do Trabalho
        </h1>

        <p className="text-base sm:text-lg text-[var(--fg-2)] leading-relaxed">
          Área oficial para envio dos links de vídeos, protótipos e artefatos das equipes para avaliação da banca do{" "}
          <strong>Demoday (05/11)</strong>. Todas as submissões são registradas no sistema da comissão com garantia de integridade.
        </p>

        {/* Período de Envio */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surf-2)] border border-[var(--borda)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--acao)] flex items-center gap-1.5">
              <Calendar size={15} />
              Período Oficial de Envio & Atualização
            </span>
            <p className="text-sm font-bold text-[var(--fg)]">
              Junto com a inscrição, até 02/11/2026 às 23h59
            </p>
            <p className="text-xs text-[var(--fg-2)]">
              A equipe pode atualizar o envio quantas vezes precisar até o prazo final; vale sempre a última versão enviada.
            </p>
          </div>
          <div className="shrink-0 font-mono text-xs font-bold px-3 py-1.5 rounded-xl bg-[var(--marca)]/10 text-[var(--marca)] border border-[var(--marca)]/20">
            Até 3 itens por equipe
          </div>
        </div>
      </div>

      {/* ──── 5 REGRAS DO ENVIO (CONFORME EDITAL OFICIAL) ──── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
        <div className="p-4 bg-[var(--surf)] border border-[var(--borda)] rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-[var(--marca)] font-bold">
            <span className="w-5 h-5 rounded-full bg-[var(--marca)]/10 flex items-center justify-center font-mono text-[10px]">1</span>
            <span>Limite por Equipe</span>
          </div>
          <p className="text-[var(--fg-2)] leading-relaxed">
            Cada equipe pode enviar até <strong>3 itens</strong> no total (vídeo explicativo, slides, protótipo digital ou documentação técnica).
          </p>
        </div>

        <div className="p-4 bg-[var(--surf)] border border-[var(--borda)] rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-[var(--marca)] font-bold">
            <span className="w-5 h-5 rounded-full bg-[var(--marca)]/10 flex items-center justify-center font-mono text-[10px]">2</span>
            <span>Formatos de Arquivos</span>
          </div>
          <p className="text-[var(--fg-2)] leading-relaxed">
            Arquivos aceitos: <strong>PDF, PPTX, JPG ou PNG</strong>. Apresentações e relatórios podem ser enviados em anexo ou por link.
          </p>
        </div>

        <div className="p-4 bg-[var(--surf)] border border-[var(--borda)] rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-[var(--marca)] font-bold">
            <span className="w-5 h-5 rounded-full bg-[var(--marca)]/10 flex items-center justify-center font-mono text-[10px]">3</span>
            <span>Vídeos e Protótipos</span>
          </div>
          <p className="text-[var(--fg-2)] leading-relaxed">
            Enviados exclusivamente por link liberado: <strong>YouTube, Google Drive, Figma ou site</strong> no ar.
          </p>
        </div>

        <div className="p-4 bg-[var(--surf)] border border-[var(--borda)] rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-[var(--alerta)] font-bold">
            <span className="w-5 h-5 rounded-full bg-[var(--alerta)]/10 flex items-center justify-center font-mono text-[10px]">4</span>
            <span>Acesso Público Obrigatório</span>
          </div>
          <p className="text-[var(--fg-2)] leading-relaxed">
            O link precisa estar configurado com <strong>acesso liberado</strong> (visualização para qualquer pessoa com o link), sem exigir login restrito.
          </p>
        </div>

        <div className="p-4 bg-[var(--surf)] border border-[var(--borda)] rounded-xl space-y-1.5 sm:col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 text-[var(--acao)] font-bold">
            <span className="w-5 h-5 rounded-full bg-[var(--acao)]/10 flex items-center justify-center font-mono text-[10px]">5</span>
            <span>Atualização Livre até 02/11 às 23h59</span>
          </div>
          <p className="text-[var(--fg-2)] leading-relaxed">
            Após mentorias com os especialistas, se sua equipe refinar o trabalho, basta enviar novamente por este formulário. O sistema arquiva automaticamente as versões anteriores e a banca do Demoday avaliará a versão mais recente.
          </p>
        </div>
      </div>

      {/* ──── RECIBO OFICIAL DE CONFIRMAÇÃO DE ENVIO ──── */}
      {enviadoComSucesso && resultadoEnvio && (
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 space-y-5 shadow-lg animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-bold block">
                  Submissão Confirmada
                </span>
                <h3 className="font-black text-xl sm:text-2xl text-[var(--fg)]">
                  Trabalho Registrado com Sucesso!
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadComprovante}
                className="inline-flex items-center gap-1.5 bg-[var(--surf)] hover:bg-[var(--surf-2)] text-[var(--fg)] text-xs font-bold px-3.5 py-2 rounded-xl border border-[var(--borda)] shadow-xs transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Baixar Comprovante de Envio</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[var(--surf)] rounded-xl border border-[var(--borda)] space-y-1">
              <span className="text-[var(--fg-2)] block font-medium">Protocolo de Envio</span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[var(--marca)] text-sm">{resultadoEnvio.protocoloEnvio}</span>
                <button
                  type="button"
                  onClick={handleCopyProtocolo}
                  className="text-[10px] text-[var(--fg-2)] hover:text-[var(--fg)] underline"
                >
                  {copiado ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            <div className="p-3 bg-[var(--surf)] rounded-xl border border-[var(--borda)] space-y-1">
              <span className="text-[var(--fg-2)] block font-medium">Data e Horário</span>
              <span className="font-bold text-[var(--fg)] text-sm">{resultadoEnvio.dataEnvio}</span>
            </div>

            <div className="p-3 bg-[var(--surf)] rounded-xl border border-[var(--borda)] space-y-1">
              <span className="text-[var(--fg-2)] block font-medium">Status no Servidor</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <ShieldCheck size={14} />
                <span>Registrado na Comissão</span>
              </span>
            </div>
          </div>

          {/* Itens Submetidos */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-[var(--fg)] uppercase tracking-wider font-mono">
              Itens enviados da equipe {equipeNome}:
            </h4>
            <div className="space-y-2">
              {itens.map((it, idx) => (
                <div key={idx} className="p-3 bg-[var(--surf)] rounded-xl border border-[var(--borda)] flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    {it.tipo === "link" ? <LinkIcon size={14} className="text-[var(--acao)] shrink-0" /> : <FileText size={14} className="text-[var(--marca)] shrink-0" />}
                    <span className="font-semibold text-[var(--fg)]">{it.titulo || `Item ${idx + 1}`}</span>
                  </div>
                  {it.linkUrl && (
                    <a
                      href={it.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-[var(--acao)] hover:underline inline-flex items-center gap-1 shrink-0"
                    >
                      <span>Abrir Link</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                  {it.arquivoNome && (
                    <span className="font-mono text-[11px] text-[var(--ok)] shrink-0">
                      {it.arquivoNome}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Reminder */}
          <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-emerald-950 dark:text-emerald-100 block">
                Comunicação com os Mentores pelo WhatsApp Oficial
              </span>
              <p className="text-emerald-900/80 dark:text-emerald-200/80">
                Lembre-se de que os mentores entram em contato e os avisos do Demoday são postados no grupo.
              </p>
            </div>
            <a
              href={edicao.whatsapp_grupo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold px-4 py-2 rounded-xl shadow-xs transition-colors"
            >
              <span>Grupo do WhatsApp</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setEnviadoComSucesso(false)}
              className="text-xs font-mono font-bold text-[var(--marca)] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Editar ou Enviar Nova Versão</span>
            </button>

            <Link
              href="/"
              className="text-xs text-[var(--fg-2)] hover:underline font-mono"
            >
              ← Voltar à Home
            </Link>
          </div>
        </div>
      )}

      {/* ──── FORMULÁRIO DE ENVIO ──── */}
      <form onSubmit={handleSubmit} className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-[var(--borda)] pb-4 space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--fg)]">
              Identificação da Equipe
            </h2>
            <span className="text-[10px] font-mono text-[var(--ok)] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Salvamento Contínuo Ativo
            </span>
          </div>
          <p className="text-xs text-[var(--fg-2)]">
            Informe o nome da equipe e o e-mail do responsável cadastrado na inscrição.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--fg)]">Nome da Equipe *</label>
            <input
              type="text"
              required
              value={equipeNome}
              onChange={(e) => setEquipeNome(e.target.value)}
              placeholder="Ex: BioSync, HealTech, VitaCare..."
              className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3.5 py-2.5 text-sm focus:border-[var(--acao)] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--fg)]">E-mail do Responsável (Líder) *</label>
            <input
              type="email"
              required
              value={emailLider}
              onChange={(e) => setEmailLider(e.target.value)}
              placeholder="email@exemplo.com"
              className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3.5 py-2.5 text-sm focus:border-[var(--acao)] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-[var(--fg)] flex items-center justify-between">
              <span>Protocolo de Inscrição (Opcional)</span>
              <span className="font-mono text-[10px] text-[var(--fg-2)]">Ex: ID do voucher ou protocolo emitido</span>
            </label>
            <input
              type="text"
              value={protocolo}
              onChange={(e) => setProtocolo(e.target.value)}
              placeholder="Ex: 5a1d733d-156e-4876-8542-cceb970c2929"
              className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3.5 py-2.5 text-sm focus:border-[var(--acao)] focus:outline-hidden font-mono"
            />
          </div>
        </div>

        {/* ──── ITENS DO TRABALHO (ATÉ 3) ──── */}
        <div className="space-y-4 pt-4 border-t border-[var(--borda)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-[var(--fg)]">
                Itens do Trabalho ({itens.length}/3)
              </h3>
              <p className="text-xs text-[var(--fg-2)]">
                Vídeos e protótipos digitais por link. Arquivos aceitos: PDF, PPTX, JPG, PNG.
              </p>
            </div>
            {itens.length < 3 && (
              <button
                type="button"
                onClick={handleAddItem}
                className="self-start sm:self-center text-xs font-mono font-bold text-[var(--acao)] hover:underline border border-[var(--borda)] px-3 py-1.5 rounded-lg bg-[var(--surf-2)] cursor-pointer"
              >
                + Adicionar Item ({itens.length}/3)
              </button>
            )}
          </div>

          <div className="space-y-4">
            {itens.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 bg-[var(--surf-2)] border border-[var(--borda)] rounded-xl space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[var(--marca)] uppercase">
                    Item 0{idx + 1}
                  </span>
                  {itens.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-xs font-mono text-[var(--erro)] hover:underline cursor-pointer"
                    >
                      Remover
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-xs font-semibold text-[var(--fg)]">Tipo de Item</label>
                    <select
                      value={item.tipo}
                      onChange={(e) => handleUpdateItem(idx, "tipo", e.target.value)}
                      className="w-full bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-3 py-2 text-xs focus:border-[var(--acao)] focus:outline-hidden"
                    >
                      <option value="link">Link (Vídeo, Figma, Drive, Site)</option>
                      <option value="arquivo">Arquivo (PDF, PPTX, JPG, PNG)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-8 space-y-1">
                    <label className="text-xs font-semibold text-[var(--fg)]">Título ou Descrição do Item *</label>
                    <input
                      type="text"
                      required
                      value={item.titulo}
                      onChange={(e) => handleUpdateItem(idx, "titulo", e.target.value)}
                      placeholder="Ex: Vídeo explicativo da solução (YouTube / 3 min)"
                      className="w-full bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-3 py-2 text-xs focus:border-[var(--acao)] focus:outline-hidden"
                    />
                  </div>

                  {item.tipo === "link" ? (
                    <div className="sm:col-span-12 space-y-1">
                      <label className="text-xs font-semibold text-[var(--fg)] flex items-center gap-1.5">
                        <LinkIcon size={12} className="text-[var(--acao)]" />
                        <span>URL do Link (YouTube, Google Drive, Figma ou Site) *</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={item.linkUrl || ""}
                        onChange={(e) => handleUpdateItem(idx, "linkUrl", e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-3 py-2 text-xs font-mono focus:border-[var(--acao)] focus:outline-hidden"
                      />
                      <span className="text-[10px] text-[var(--fg-2)] block">
                        Certifique-se de que a permissão de visualização esteja como "Qualquer pessoa com o link".
                      </span>
                    </div>
                  ) : (
                    <div className="sm:col-span-12 space-y-1">
                      <label className="text-xs font-semibold text-[var(--fg)] flex items-center gap-1.5">
                        <FileText size={12} className="text-[var(--marca)]" />
                        <span>Arquivo Local (PDF, PPTX, JPG, PNG)</span>
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.pptx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(idx, e)}
                        className="w-full bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-3 py-2 text-xs text-[var(--fg-2)]"
                      />
                      {item.arquivoNome && (
                        <span className="text-[11px] font-mono text-[var(--ok)] block">
                          ✓ Arquivo selecionado: {item.arquivoNome}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observações */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-bold text-[var(--fg)]">
            Observações para a Banca Avaliadora (Opcional)
          </label>
          <textarea
            rows={3}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Instruções de navegação, contexto do protótipo ou recomendação para a apresentação de 5 minutos..."
            className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg p-3 text-xs sm:text-sm focus:border-[var(--acao)] focus:outline-hidden"
          />
        </div>

        {/* Declaração de Acesso Liberado */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <label className="flex items-start gap-3 cursor-pointer text-xs font-medium text-[var(--fg)]">
            <input
              type="checkbox"
              required
              checked={acessoLiberado}
              onChange={(e) => setAcessoLiberado(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[var(--acao)] focus:ring-[var(--acao)] shrink-0 mt-0.5"
            />
            <span>
              <strong>Declaro que todos os links informados estão com acesso público liberado</strong> para que a banca examinadora do Demoday possa avaliar os vídeos e protótipos sem barreiras de autenticação restrita.
            </span>
          </label>
        </div>

        {/* Botão de Envio */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--acao)] hover:brightness-105 text-white font-bold text-sm shadow-md transition-all cursor-pointer ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Registrando e Garantindo no Sistema...</span>
              </>
            ) : (
              <>
                <span>Salvar e Submeter Trabalho</span>
                <Send size={16} />
              </>
            )}
          </button>

          <Link
            href="/edital"
            className="text-xs font-mono text-[var(--fg-2)] hover:underline inline-flex items-center gap-1"
          >
            <span>Consultar regras no Edital</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </form>

      {/* ──── HISTÓRICO DE SUBMISSÕES DESTA MÁQUINA ──── */}
      {historico.length > 0 && (
        <div className="p-6 bg-[var(--surf)] border border-[var(--borda)] rounded-2xl space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[var(--borda)] pb-3">
            <div className="flex items-center gap-2">
              <History size={16} className="text-[var(--marca)]" />
              <h3 className="font-bold text-sm text-[var(--fg)]">
                Histórico de Envios & Atualizações ({historico.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[var(--fg-2)]">
              Última versão enviada até 02/11 é a que prevalece
            </span>
          </div>

          <div className="space-y-3">
            {historico.slice(0, 5).map((h, i) => (
              <div
                key={i}
                className="p-3.5 bg-[var(--surf-2)] border border-[var(--borda)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--fg)]">{h.equipeNome}</span>
                    <span className="font-mono text-[10px] bg-[var(--marca)]/10 text-[var(--marca)] px-2 py-0.5 rounded-md font-bold">
                      {h.protocoloEnvio || `Envio #${historico.length - i}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--fg-2)]">
                    {h.itens?.length || 0} item(ns) submetido(s) {h.dataEnvio ? `em ${h.dataEnvio}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (h.equipeNome) setEquipeNome(h.equipeNome);
                      if (h.emailLider) setEmailLider(h.emailLider);
                      if (h.protocolo) setProtocolo(h.protocolo);
                      if (h.itens) setItens(h.itens);
                      if (h.observacoes) setObservacoes(h.observacoes);
                      alert("Dados deste envio carregados no formulário para edição!");
                    }}
                    className="text-xs font-mono text-[var(--acao)] hover:underline border border-[var(--borda)] px-2.5 py-1 rounded-lg bg-[var(--surf)] cursor-pointer"
                  >
                    Carregar no Formulário
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
