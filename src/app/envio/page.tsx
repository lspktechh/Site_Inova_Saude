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
} from "lucide-react";
import { edicao, dataCurta } from "@/lib/config";

interface TrabalhoItem {
  tipo: "arquivo" | "link";
  titulo: string;
  linkUrl?: string;
  arquivoNome?: string;
}

export default function EnvioTrabalhoPage() {
  const [equipeNome, setEquipeNome] = useState("");
  const [protocolo, setProtocolo] = useState("");
  const [emailLider, setEmailLider] = useState("");
  const [itens, setItens] = useState<TrabalhoItem[]>([
    { tipo: "link", titulo: "Vídeo do Protótipo (YouTube / Drive)", linkUrl: "" },
  ]);
  const [acessoLiberado, setAcessoLiberado] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [enviadoComSucesso, setEnviadoComSucesso] = useState(false);
  const [dataEnvio, setDataEnvio] = useState<string | null>(null);

  // Carregar rascunho de envio do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("inova_envio_trabalho");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.equipeNome) setEquipeNome(data.equipeNome);
        if (data.protocolo) setProtocolo(data.protocolo);
        if (data.emailLider) setEmailLider(data.emailLider);
        if (data.itens && Array.isArray(data.itens)) setItens(data.itens);
        if (data.observacoes) setObservacoes(data.observacoes);
        if (data.dataEnvio) setDataEnvio(data.dataEnvio);
      }
    } catch (e) {
      console.warn("Erro ao carregar envio:", e);
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

  const handleSubmit = (e: React.FormEvent) => {
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
        alert(`Informe o link do item 0${i + 1}.`);
        return;
      }
    }
    if (!acessoLiberado) {
      alert("Por favor, confirme que os links estão com o acesso liberado (público) para a organização e avaliadores.");
      return;
    }

    const payload = {
      equipeNome,
      protocolo,
      emailLider,
      itens,
      observacoes,
      acessoLiberado,
      dataEnvio: new Date().toLocaleString("pt-BR"),
    };

    try {
      localStorage.setItem("inova_envio_trabalho", JSON.stringify(payload));
      setDataEnvio(payload.dataEnvio);
      setEnviadoComSucesso(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar envio.");
    }
  };

  return (
    <div className="w-full max-w-4xl min-w-0 mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8 sm:space-y-10">
      {/* ──── HERO ──── */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] text-xs font-mono font-bold tracking-wider">
          <Upload size={14} className="shrink-0" />
          <span>Etapa 6 do Edital · Demoday</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">
          Envio do Trabalho
        </h1>

        <p className="text-base sm:text-lg text-[var(--fg-2)] leading-relaxed">
          Área oficial para envio dos links de vídeos, protótipos e arquivos das equipes para avaliação da banca do <strong>Demoday (05/11)</strong>.
        </p>

        {/* Período de Envio */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surf-2)] border border-[var(--borda)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--acao)] flex items-center gap-1.5">
              <Calendar size={15} />
              Período Oficial de Envio
            </span>
            <p className="text-sm font-bold text-[var(--fg)]">
              Junto com a inscrição, até 02/11/2026 às 23h59
            </p>
            <p className="text-xs text-[var(--fg-2)]">
              A equipe pode atualizar o envio quantas vezes precisar até o prazo de 02/11; vale a última versão enviada.
            </p>
          </div>
          <div className="shrink-0 font-mono text-xs font-bold px-3 py-1.5 rounded-xl bg-[var(--marca)]/10 text-[var(--marca)] border border-[var(--marca)]/20">
            Até 3 itens por equipe
          </div>
        </div>
      </div>

      {/* ──── 5 REGRAS DO ENVIO (CONFORME EDITAL) ──── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
        <div className="p-4 bg-[var(--surf)] border border-[var(--borda)] rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-[var(--marca)] font-bold">
            <span className="w-5 h-5 rounded-full bg-[var(--marca)]/10 flex items-center justify-center font-mono text-[10px]">1</span>
            <span>Limite por Equipe</span>
          </div>
          <p className="text-[var(--fg-2)] leading-relaxed">
            Cada equipe pode enviar até <strong>3 itens</strong> no total (vídeo, slides, protótipo digital ou documentação).
          </p>
        </div>

        <div className="p-4 bg-[var(--surf)] border border-[var(--borda)] rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-[var(--marca)] font-bold">
            <span className="w-5 h-5 rounded-full bg-[var(--marca)]/10 flex items-center justify-center font-mono text-[10px]">2</span>
            <span>Arquivos Aceitos</span>
          </div>
          <p className="text-[var(--fg-2)] leading-relaxed">
            Formatos permitidos para upload: <strong>PDF, PPTX, JPG ou PNG</strong>.
          </p>
        </div>

        <div className="p-4 bg-[var(--surf)] border border-[var(--borda)] rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-[var(--marca)] font-bold">
            <span className="w-5 h-5 rounded-full bg-[var(--marca)]/10 flex items-center justify-center font-mono text-[10px]">3</span>
            <span>Vídeos e Protótipos</span>
          </div>
          <p className="text-[var(--fg-2)] leading-relaxed">
            Enviados exclusivamente por link: <strong>YouTube, Google Drive, Figma ou site</strong>.
          </p>
        </div>

        <div className="p-4 bg-[var(--surf)] border border-[var(--borda)] rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-[var(--alerta)] font-bold">
            <span className="w-5 h-5 rounded-full bg-[var(--alerta)]/10 flex items-center justify-center font-mono text-[10px]">4</span>
            <span>Acesso Liberado</span>
          </div>
          <p className="text-[var(--fg-2)] leading-relaxed">
            O link precisa estar com <strong>acesso público ou liberado</strong> para a banca sem exigência de login restrito.
          </p>
        </div>

        <div className="p-4 bg-[var(--surf)] border border-[var(--borda)] rounded-xl space-y-1.5 sm:col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 text-[var(--acao)] font-bold">
            <span className="w-5 h-5 rounded-full bg-[var(--acao)]/10 flex items-center justify-center font-mono text-[10px]">5</span>
            <span>Atualização Livre até 02/11 às 23h59</span>
          </div>
          <p className="text-[var(--fg-2)] leading-relaxed">
            Se sua equipe refinar o trabalho após as mentorias, basta reenviar o formulário. O sistema arquiva versões anteriores e considera sempre o último envio dentro do prazo (02/11).
          </p>
        </div>
      </div>

      {/* ──── CONFIRMAÇÃO DE ENVIO ──── */}
      {enviadoComSucesso && (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 size={24} className="shrink-0" />
            <h3 className="font-bold text-lg">Trabalho Registrado com Sucesso!</h3>
          </div>
          <p className="text-sm text-[var(--fg)]">
            Os artefatos da equipe <strong>{equipeNome}</strong> foram salvos no sistema {dataEnvio ? `em ${dataEnvio}` : ""}. A banca do Demoday terá acesso para avaliação.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setEnviadoComSucesso(false)}
              className="text-xs font-mono font-bold text-[var(--marca)] hover:underline inline-flex items-center gap-1"
            >
              <RotateCcw size={13} />
              <span>Editar / Atualizar Envio</span>
            </button>
          </div>
        </div>
      )}

      {/* ──── FORMULÁRIO DE ENVIO ──── */}
      <form onSubmit={handleSubmit} className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-[var(--borda)] pb-4 space-y-1">
          <h2 className="text-xl font-bold text-[var(--fg)]">
            Identificação da Equipe
          </h2>
          <p className="text-xs text-[var(--fg-2)]">
            Informe os dados cadastrados na inscrição oficial.
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
              placeholder="Ex: BioSync, HealTech..."
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
              <span className="font-mono text-[10px] text-[var(--fg-2)]">Ex: INSC-001 ou ID do voucher</span>
            </label>
            <input
              type="text"
              value={protocolo}
              onChange={(e) => setProtocolo(e.target.value)}
              placeholder="Ex: INSC-LID ou token de credenciamento"
              className="w-full bg-[var(--bg)] border border-[var(--borda)] rounded-lg px-3.5 py-2.5 text-sm focus:border-[var(--acao)] focus:outline-hidden font-mono"
            />
          </div>
        </div>

        {/* ──── ITENS DO TRABALHO (ATÉ 3) ──── */}
        <div className="space-y-4 pt-4 border-t border-[var(--borda)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[var(--fg)]">
                Itens do Trabalho ({itens.length}/3)
              </h3>
              <p className="text-xs text-[var(--fg-2)]">
                Vídeos e protótipos digitais devem ser enviados por link. Arquivos aceitos: PDF, PPTX, JPG, PNG.
              </p>
            </div>
            {itens.length < 3 && (
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-mono font-bold text-[var(--acao)] hover:underline border border-[var(--borda)] px-3 py-1.5 rounded-lg bg-[var(--surf-2)]"
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
                      className="text-xs font-mono text-[var(--erro)] hover:underline"
                    >
                      Remover
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-xs font-semibold text-[var(--fg)]">Formato do Item</label>
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
                      placeholder="Ex: Vídeo de demonstração do protótipo (3 min)"
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
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpdateItem(idx, "arquivoNome", file.name);
                        }}
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
            Observações para a Banca Examinadora (Opcional)
          </label>
          <textarea
            rows={3}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Alguma instrução de visualização, contexto do protótipo ou recomendação para a apresentação de 5 minutos..."
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
              <strong>Declaro que todos os links informados estão com acesso liberado</strong> (visualização pública) para que os avaliadores da banca possam assistir aos vídeos e examinar os protótipos sem bloqueios de login.
            </span>
          </label>
        </div>

        {/* Botão de Envio */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--acao)] hover:brightness-105 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Salvar e Submeter Trabalho</span>
            <CheckCircle2 size={16} />
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
    </div>
  );
}
