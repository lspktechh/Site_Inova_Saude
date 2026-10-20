"use client";

import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, Printer, Download, Sparkles, ShieldCheck, MapPin, Calendar, Users, MessageCircle } from "lucide-react";
import { asset, edicao, dataCurta } from "@/lib/config";

interface OfficialVoucherProps {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  qrToken: string;
  membersCount: number;
  membersList?: Array<{ nome: string; curso?: string; papel?: string }>;
  submissionId: string;
  onDownloadJson?: () => void;
}

export function OfficialVoucher({
  teamName,
  leaderName,
  leaderEmail,
  qrToken,
  membersCount,
  membersList = [],
  submissionId,
  onDownloadJson,
}: OfficialVoucherProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* ──── AVISO OBRIGATÓRIO: GRUPO DO WHATSAPP ──── */}
      <div className="bg-emerald-500/15 border-2 border-emerald-500/40 rounded-2xl p-5 sm:p-6 text-white space-y-3 print:hidden">
        <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs font-black uppercase tracking-wider text-emerald-400">
                Passo Obrigatório · Grupo Oficial no WhatsApp
              </span>
            </div>
            <h4 className="text-lg font-bold text-white">
              Entre agora no Grupo de Participantes do INOVA SAÚDE 2026
            </h4>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl">
              É pelo grupo oficial que a coordenação repassa mentorias, prazos de envio de links de vídeo e protótipo (junto com a inscrição, até 02/11) e a lista dos 10 finalistas para o Demoday. A entrada de todos os integrantes é <strong>obrigatória</strong>.
            </p>
          </div>
          <a
            href={edicao.whatsapp_grupo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <MessageCircle size={18} />
            <span>Entrar no Grupo Oficial</span>
          </a>
        </div>
      </div>

      {/* ──── O PASSE FÍSICO / VOUCHER DE CREDENCIAMENTO ──── */}
      <div className="relative bg-gradient-to-br from-[#072F56] via-[#093d6f] to-[#041B32] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 print:border-black print:text-black print:bg-white print:shadow-none">
        {/* Marca d'água de segurança de fundo */}
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
          <span className="text-8xl sm:text-9xl font-black font-mono tracking-widest uppercase">
            INOVA 2026
          </span>
        </div>

        {/* Faixa superior com logos e status */}
        <div className="p-6 sm:p-8 border-b border-white/15 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={asset("/logos/up_neg.png")}
              alt="Universidade Positivo"
              className="h-7 w-auto object-contain brightness-110"
            />
            <div className="h-6 w-px bg-white/20" />
            <img
              src={asset("/logos/eco_branco.png")}
              alt="ecohub"
              className="h-6 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
              Credenciamento Homologado
            </span>
          </div>
        </div>

        {/* Corpo do Cartão / Ticket */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          {/* Informações da Equipe / Participante */}
          <div className="md:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--acento)] font-bold">
                Passaporte Oficial de Inovação · 2ª Edição
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {teamName || leaderName}
              </h3>
              <p className="text-sm text-white/80 font-medium">
                Pessoa de Contato: <span className="text-white font-bold">{leaderName}</span> ({leaderEmail})
              </p>
            </div>

            {/* Grid de Informações Chave */}
            <div className="grid grid-cols-2 gap-3.5 pt-2 text-xs">
              <div className="col-span-2 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-1.5 text-white/70 font-mono mb-1">
                  <Calendar size={13} className="text-[var(--acento)]" />
                  <span>{edicao.rotulos.evento_final} (10 equipes finalistas) · registro de presença</span>
                </div>
                <strong className="text-white text-sm block">
                  {dataCurta(edicao.datas.pitch_final.data)} · {edicao.datas.pitch_final.inicio.replace(":", "h")} às {edicao.datas.pitch_final.fim.replace(":", "h")}
                </strong>
                <span className="text-[11px] text-white/80">
                  {edicao.datas.pitch_final.local}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-1.5 text-white/70 font-mono mb-1">
                  <Users size={13} className="text-[var(--acento)]" />
                  <span>Integrantes</span>
                </div>
                <strong className="text-white text-sm block">{membersCount} pessoa(s)</strong>
                <span className="text-[11px] text-white/60">3 a 6 integrantes</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-1.5 text-white/70 font-mono mb-1">
                  <ShieldCheck size={13} className="text-[var(--acento)]" />
                  <span>Certificação</span>
                </div>
                <strong className="text-white text-sm block">8h e 16h</strong>
                <span className="text-[11px] text-white/70">8h inscrição / 16h Demoday</span>
              </div>
            </div>

            {/* Lista dos Integrantes Cadastrados */}
            {membersList.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-mono text-white/60 uppercase block mb-1.5">
                  Membros Confirmados no Grupo:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {membersList.map((m, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-white/15 px-2.5 py-1 rounded-lg border border-white/15 text-white font-medium"
                    >
                      {m.nome} {m.curso ? `(${m.curso})` : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Área do QR Code com Estilo de Leitura Óptica */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-white rounded-2xl text-gray-900 shadow-xl border border-white/30 relative">
            <div className="relative p-2 bg-white rounded-xl border border-gray-100 flex items-center justify-center">
              <QRCodeSVG
                value={qrToken || `INOVA2026-CHECKIN-${submissionId}`}
                size={170}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="text-center mt-3 space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500 font-bold block">
                Token de Credenciamento Rápido
              </span>
              <span className="font-mono text-xs font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-md border border-gray-200 block">
                {qrToken || `INOVA-${submissionId.substring(0, 8).toUpperCase()}`}
              </span>
              <p className="text-[11px] text-gray-500 pt-1 leading-tight">
                Apresente este voucher no celular ou impresso na entrada do evento.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé com conformidade institucional legal */}
        <div className="px-6 sm:px-8 py-3.5 bg-black/25 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-white/70">
          <span>Promoção: Instituto Cruzeiro do Sul · Realização: ecohub Londrina · Parceria: Universidade Positivo</span>
          <span>Apoio financeiro: Fundação Araucária e SETI, Gov. do Estado do Paraná</span>
        </div>
      </div>

      {/* Botões de Ação do Voucher */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surf)] border border-[var(--borda)] text-sm font-bold text-[var(--fg)] hover:bg-[var(--surf-2)] transition-colors shadow-2xs cursor-pointer"
          >
            <Printer size={16} />
            <span>Imprimir / Salvar PDF</span>
          </button>

          {onDownloadJson && (
            <button
              type="button"
              onClick={onDownloadJson}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surf)] border border-[var(--borda)] text-sm font-bold text-[var(--fg)] hover:bg-[var(--surf-2)] transition-colors shadow-2xs cursor-pointer"
            >
              <Download size={16} />
              <span>Baixar Ficha (.JSON)</span>
            </button>
          )}
        </div>

        <span className="text-xs font-mono text-[var(--ok)] font-semibold flex items-center gap-1.5">
          <CheckCircle size={15} />
          <span>Vaga garantida no sistema central</span>
        </span>
      </div>
    </div>
  );
}
