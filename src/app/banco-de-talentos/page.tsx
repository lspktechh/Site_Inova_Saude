"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { edicao, competencias } from "@/lib/config";
import { Users, UserPlus, Sparkles, ArrowRight, Check, Search, Mail } from "lucide-react";
import { getAllLocalInscriptions, InscriptionResponse } from "@/lib/api";

interface Candidato {
  id: string;
  nome: string;
  vinculo: string;
  curso: string;
  competencias: string[];
  papel: string;
  eixoInteresse: string;
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

// Dados iniciais enriquecidos para demonstração imediata do Banco de Talentos
const CANDIDATOS_EXEMPLO: Candidato[] = [
  {
    id: "cand-1",
    nome: "Mariana Silva Costa",
    vinculo: "Aluno de graduacao",
    curso: "Enfermagem · 4º ano",
    competencias: ["enfermagem", "saude_coletiva", "entrevista"],
    papel: "Pesquisar o problema",
    eixoInteresse: "Infraestrutura em Saude Digital",
  },
  {
    id: "cand-2",
    nome: "Lucas Ferreira Lima",
    vinculo: "Aluno de graduacao",
    curso: "Engenharia de Software · 3º ano",
    competencias: ["frontend", "backend", "mobile", "api"],
    papel: "Construir a solucao",
    eixoInteresse: "Logistica e Gestao de Servicos de Saude",
  },
  {
    id: "cand-3",
    nome: "Beatriz Oliveira Duarte",
    vinculo: "Aluno de pos",
    curso: "Design de Interacao & UX",
    competencias: ["ux", "ui", "figma", "design_grafico"],
    papel: "Desenhar a experiencia",
    eixoInteresse: "Saude Mental e Bem-Estar",
  },
  {
    id: "cand-4",
    nome: "Guilherme Santos",
    vinculo: "Comunidade externa",
    curso: "Makerspace Londrina · Prototipagem",
    competencias: ["cad", "operacao_impressora", "corte_laser", "prototipagem_fisica"],
    papel: "Construir a solucao",
    eixoInteresse: "Logistica e Gestao de Servicos de Saude",
  },
  {
    id: "cand-5",
    nome: "Carolina Mendes",
    vinculo: "Profissional de saude",
    curso: "Hospital Universitário · Fisioterapia",
    competencias: ["fisioterapia", "saude_coletiva", "gestao_projetos"],
    papel: "Coordenar a equipe",
    eixoInteresse: "Capacitacao e Formacao Profissional",
  },
];

const EQUIPES_EXEMPLO: EquipeComVaga[] = [
  {
    id: "eq-1",
    nome: "Pulso Rápido",
    ideia: "Dispositivo adaptador para fixação e transporte seguro de bombas de infusão em leitos de emergência.",
    eixo: "Logistica e Gestao de Servicos de Saude",
    vagasRestantes: 2,
    competenciasPresentes: ["enfermagem", "frontend"],
    faltaNaEquipe: ["Modelagem 3D (CAD)", "Operação de impressora 3D", "UI/UX"],
    liderContato: "marcelo.enfermagem@up.edu.br",
  },
  {
    id: "eq-2",
    nome: "AcolheMais",
    ideia: "Plataforma de triagem humanizada e escuta qualificada para profissionais de saúde em esgotamento profissional.",
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
  const [tab, setTab] = useState<"candidatos" | "equipes">("equipes");
  const [filtroEixo, setFiltroEixo] = useState<string>("todos");
  const [conviteEnviado, setConviteEnviado] = useState<Record<string, boolean>>({});

  const [equipes, setEquipes] = useState<EquipeComVaga[]>(EQUIPES_EXEMPLO);
  const [candidatos, setCandidatos] = useState<Candidato[]>(CANDIDATOS_EXEMPLO);

  // Carrega inscrições recentes do storage para enriquecer o banco
  useEffect(() => {
    const locais = getAllLocalInscriptions();
    locais.forEach((insc) => {
      if (insc.ficha_prototipo) {
        const fp = insc.ficha_prototipo;
        if (fp.formas && fp.falta_na_equipe) {
          // Equipe cadastrada
          const novaEq: EquipeComVaga = {
            id: insc.id,
            nome: insc.name + " Team",
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

  const handleConvidar = (id: string) => {
    setConviteEnviado({ ...conviteEnviado, [id]: true });
  };

  const equipesFiltradas = equipes.filter((e) =>
    filtroEixo === "todos" ? true : e.eixo === filtroEixo
  );

  const candidatosFiltrados = candidatos.filter((c) =>
    filtroEixo === "todos" ? true : c.eixoInteresse === filtroEixo
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Topo / Banner explicativo */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] text-xs font-mono font-semibold">
          <Users size={14} />
          <span>Pareamento Dinâmico de Participantes</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">
          Banco de Talentos
        </h1>
        <p className="text-base text-[var(--fg-2)] max-w-3xl leading-relaxed">
          Ninguém fica de fora do <strong>INOVA SAÚDE 2026</strong> por não ter equipe. Aqui você encontra
          pessoas com as competências exatas que faltam no seu grupo ou encontra equipes com vagas abertas precisando do seu conhecimento.
        </p>
      </div>

      {/* Controles de Filtro e Abas */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[var(--borda)] pb-4">
        {/* Abas */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("equipes")}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === "equipes"
                ? "bg-[var(--marca)] text-white shadow-xs"
                : "bg-[var(--surf)] border border-[var(--borda)] text-[var(--fg-2)] hover:border-[var(--marca-2)]"
            }`}
          >
            Equipes com Vagas ({equipesFiltradas.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("candidatos")}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === "candidatos"
                ? "bg-[var(--marca)] text-white shadow-xs"
                : "bg-[var(--surf)] border border-[var(--borda)] text-[var(--fg-2)] hover:border-[var(--marca-2)]"
            }`}
          >
            Pessoas Disponíveis ({candidatosFiltrados.length})
          </button>
        </div>

        {/* Filtro por Eixo Temático */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--fg-2)] font-mono whitespace-nowrap">Eixo:</span>
          <select
            value={filtroEixo}
            onChange={(e) => setFiltroEixo(e.target.value)}
            className="bg-[var(--surf)] border border-[var(--borda)] rounded-lg px-3 py-2 text-xs font-medium focus:border-[var(--acao)] focus:outline-hidden"
          >
            <option value="todos">Todos os Eixos Temáticos</option>
            {edicao.eixos_tematicos.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Equipes com Vagas */}
      {tab === "equipes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipesFiltradas.map((eq) => {
            const enviado = conviteEnviado[eq.id];
            return (
              <div
                key={eq.id}
                className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[var(--acao)] bg-[var(--acao)]/10 px-2.5 py-1 rounded-full">
                      {eq.vagasRestantes} vaga(s) restante(s)
                    </span>
                    <span className="text-[11px] font-mono text-[var(--fg-2)]">
                      {eq.eixo.split(" ")[0]}...
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[var(--fg)]">{eq.nome}</h3>
                    <p className="text-xs text-[var(--fg-2)] mt-2 leading-relaxed">
                      "{eq.ideia}"
                    </p>
                  </div>

                  {/* Lacunas calculadas */}
                  <div className="p-3.5 bg-[var(--alerta)]/5 border border-[var(--alerta)]/25 rounded-xl space-y-1.5">
                    <span className="text-[11px] font-mono font-bold text-[var(--alerta)] uppercase tracking-wider block">
                      ⚠️ O que está faltando na equipe:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {eq.faltaNaEquipe.map((falta) => (
                        <span
                          key={falta}
                          className="text-[11px] font-semibold bg-white px-2 py-0.5 rounded border border-[var(--borda)] text-[var(--fg)]"
                        >
                          {falta}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-[var(--borda)] flex items-center justify-between">
                  <a
                    href={`mailto:${eq.liderContato}?subject=Quero entrar na equipe ${encodeURIComponent(eq.nome)} - INOVA SAÚDE 2026`}
                    onClick={() => handleConvidar(eq.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
                      enviado
                        ? "bg-[var(--ok)] text-white"
                        : "bg-[var(--marca)] text-white hover:bg-[var(--marca-2)]"
                    }`}
                  >
                    {enviado ? (
                      <>
                        <Check size={14} />
                        <span>Pedido Aberto</span>
                      </>
                    ) : (
                      <>
                        <Mail size={14} />
                        <span>Pedir para Entrar</span>
                      </>
                    )}
                  </a>
                  <span className="text-[11px] text-[var(--fg-2)] font-mono">Contato direto</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lista de Candidatos Disponíveis */}
      {tab === "candidatos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidatosFiltrados.map((cand) => {
            const convidado = conviteEnviado[cand.id];
            return (
              <div
                key={cand.id}
                className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[var(--marca)] bg-[var(--surf-2)] px-2.5 py-1 rounded-md font-semibold">
                      {cand.papel}
                    </span>
                    <UserPlus size={18} className="text-[var(--marca-2)]" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[var(--fg)]">{cand.nome}</h3>
                    <p className="text-xs text-[var(--fg-2)]">{cand.curso}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-[var(--fg-2)] block uppercase">
                      Habilidades e Interesses:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cand.competencias.map((comp) => (
                        <span
                          key={comp}
                          className="text-[11px] bg-[var(--surf-2)] text-[var(--fg)] px-2 py-0.5 rounded border border-[var(--borda)]"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-[var(--borda)] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleConvidar(cand.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
                      convidado
                        ? "bg-[var(--ok)] text-white"
                        : "bg-[var(--acao)] text-white hover:brightness-105"
                    }`}
                  >
                    {convidado ? (
                      <>
                        <Check size={14} />
                        <span>Convite Enviado</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        <span>Convidar para Time</span>
                      </>
                    )}
                  </button>
                  <span className="text-[11px] text-[var(--fg-2)] font-mono">Disponível</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chamada para Ação */}
      <div className="bg-[var(--surf-2)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-[var(--fg)]">Ainda não cadastrou seu perfil ou equipe?</h3>
          <p className="text-sm text-[var(--fg-2)] mt-1">
            Escolha a trilha correspondente no formulário guiado e apareça automaticamente aqui.
          </p>
        </div>
        <Link
          href="/inscricao"
          className="shrink-0 bg-[var(--marca)] text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-[var(--marca-2)] transition-colors inline-flex items-center gap-2"
        >
          <span>Fazer Inscrição Agora</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
