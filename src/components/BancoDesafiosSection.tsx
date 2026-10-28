"use client";

import { useState } from "react";
import { ExternalLink, Lightbulb, MapPin, Sparkles } from "lucide-react";
import { bancoDesafios, type FonteBanco } from "@/lib/config";

type Aba = "problemas" | "solucoes";

const TODOS = "Todos";

/** Cor de destaque de cada aba. Tokens que o tema escuro já clareia, para manter o contraste dos links e selos. */
const COR_ABA: Record<Aba, string> = {
  problemas: "var(--acao)",
  solucoes: "var(--marca)",
};

/** Etiquetas de curso na mesma paleta por área do Banco de Talentos: saúde verde, tecnologia ciano. */
const GRUPO_CURSO: Record<string, "saude" | "tech"> = {
  Odontologia: "saude",
  Enfermagem: "saude",
  Farmácia: "saude",
  Fisioterapia: "saude",
  Biomedicina: "saude",
  Psicologia: "saude",
  ADS: "tech",
  "Eng. de Software": "tech",
};

const COR_GRUPO = {
  saude: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  tech: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800",
};

const COR_NEUTRA = "bg-[var(--surf-2)] text-[var(--fg)] border-[var(--borda)]";

interface ComCursos {
  cursos: string[];
  soma_com?: string[];
}

/** Um item aparece no filtro se o curso é dele ou se a equipe dele precisa desse curso. */
function casaCurso(item: ComCursos, curso: string): boolean {
  return curso === TODOS || item.cursos.includes(curso) || (item.soma_com ?? []).includes(curso);
}

function listarCursos(itens: ComCursos[]): string[] {
  const todos = new Set<string>();
  itens.forEach((i) => {
    i.cursos.forEach((c) => todos.add(c));
    (i.soma_com ?? []).forEach((c) => todos.add(c));
  });
  return Array.from(todos).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function Curso({ nome, destaque, cor, neutro }: { nome: string; destaque: boolean; cor: string; neutro?: boolean }) {
  const grupo = GRUPO_CURSO[nome];
  const estilo = neutro || !grupo ? COR_NEUTRA : COR_GRUPO[grupo];
  if (destaque) {
    return (
      <span
        className="text-[11px] font-medium px-2 py-0.5 rounded-md border text-[var(--surf)]"
        style={{ backgroundColor: cor, borderColor: cor }}
      >
        {nome}
      </span>
    );
  }
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${estilo}`}>{nome}</span>;
}

function Rodape({ fontes, cor }: { fontes: FonteBanco[]; cor: string }) {
  return (
    <div className="pt-5 mt-6 border-t border-[var(--borda)] flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <span className="font-mono text-xs text-[var(--fg-2)]">{fontes.length > 1 ? "Fontes" : "Fonte"}</span>
      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
        {fontes.map((f) => (
          <a
            key={f.url}
            href={f.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
            style={{ color: cor }}
          >
            <span>{f.nome}</span>
            <ExternalLink size={14} aria-hidden="true" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Selo({ texto, cor }: { texto: string; cor: string }) {
  return (
    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md" style={{ background: "var(--surf-2)", color: cor }}>
      {texto}
    </span>
  );
}

function Icone({ icone: Icon, cor }: { icone: typeof MapPin; cor: string }) {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--surf-2)" }}>
      <Icon size={20} style={{ color: cor }} />
    </div>
  );
}

export function BancoDesafiosSection() {
  const { problemas, solucoes_que_viraram_empresa: solucoes, fontes_consultadas_em } = bancoDesafios;

  const [aba, setAba] = useState<Aba>("problemas");
  const [curso, setCurso] = useState<string>(TODOS);

  const itensDaAba: ComCursos[] = aba === "problemas" ? problemas : solucoes;
  const cursos = listarCursos(itensDaAba);
  // Trocar de aba pode deixar o curso escolhido sem itens; nesse caso volta para "Todos".
  const cursoAtivo = cursos.includes(curso) ? curso : TODOS;
  const cor = COR_ABA[aba];

  const problemasVisiveis = problemas
    .map((p, i) => ({ p, numero: i + 1 }))
    .filter(({ p }) => casaCurso(p, cursoAtivo));
  const solucoesVisiveis = solucoes
    .map((s, i) => ({ s, numero: i + 1 }))
    .filter(({ s }) => casaCurso(s, cursoAtivo));

  const total = aba === "problemas" ? problemas.length : solucoes.length;
  const visiveis = aba === "problemas" ? problemasVisiveis.length : solucoesVisiveis.length;
  const rotuloItem = aba === "problemas" ? "problemas" : "soluções";

  const classePilula = (selecionada: boolean) =>
    `flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono whitespace-nowrap transition-all cursor-pointer border ${
      selecionada
        ? "text-[var(--surf)] shadow-md scale-105"
        : "bg-[var(--surf)] text-[var(--fg-2)] border-[var(--borda)] hover:border-[var(--fg-2)]/30 hover:text-[var(--fg)]"
    }`;
  const estiloPilula = (selecionada: boolean) => (selecionada ? { backgroundColor: cor, borderColor: cor } : {});

  return (
    <section id="banco-de-desafios" className="space-y-8 scroll-mt-24">
      {/* ──── CABEÇALHO DA SEÇÃO ──── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--marca)]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--fg-2)] font-bold flex items-center gap-1.5">
            <Lightbulb size={14} className="text-[var(--marca)]" />
            <span>Banco de Desafios</span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--fg)]">
          Problemas reais e soluções que já viraram empresa
        </h2>
        <p className="text-sm sm:text-base text-[var(--fg-2)] max-w-3xl leading-relaxed">
          Cada problema traz a fonte de onde veio o dado. Escolha o <strong>curso</strong> para ver o que é da sua área
          e também o que pede a sua ajuda em equipes de outros cursos. Professores podem usar o filtro para indicar
          problemas à turma.
        </p>
      </div>

      {/* ──── SELETOR DE ABAS (MESMO PADRÃO DAS PÍLULAS DOS VÍDEOS) ──── */}
      <div
        role="tablist"
        aria-label="Tipo de conteúdo do banco"
        className="flex flex-wrap items-center justify-start sm:justify-center gap-2 px-1"
      >
        {(
          [
            { id: "problemas", rotulo: `Problemas reais (${problemas.length})`, icone: MapPin },
            { id: "solucoes", rotulo: `Soluções que viraram empresa (${solucoes.length})`, icone: Sparkles },
          ] as const
        ).map(({ id, rotulo, icone: IconeAba }) => {
          const selecionada = aba === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`aba-${id}`}
              aria-selected={selecionada}
              aria-controls="painel-banco"
              onClick={() => setAba(id)}
              className={classePilula(selecionada)}
              style={selecionada ? { backgroundColor: COR_ABA[id], borderColor: COR_ABA[id] } : {}}
            >
              <IconeAba size={13} aria-hidden="true" />
              <span>{rotulo}</span>
            </button>
          );
        })}
      </div>

      {/* ──── FILTRO POR CURSO ──── */}
      <div className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--fg-2)] font-bold text-left sm:text-center">
          Filtrar por curso
        </p>
        <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 px-1">
          {[TODOS, ...cursos].map((c) => {
            const selecionado = cursoAtivo === c;
            const quantidade = itensDaAba.filter((i) => casaCurso(i, c)).length;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={selecionado}
                onClick={() => setCurso(c)}
                className={classePilula(selecionado)}
                style={estiloPilula(selecionado)}
              >
                {c} <span className="opacity-70">({quantidade})</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[var(--fg-2)] text-left sm:text-center" aria-live="polite">
          Mostrando {visiveis} de {total} {rotuloItem}
          {cursoAtivo !== TODOS ? ` para ${cursoAtivo}` : ""}.
        </p>
      </div>

      {/* ──── CARDS ──── */}
      <div id="painel-banco" role="tabpanel" aria-labelledby={`aba-${aba}`}>
        {aba === "problemas" ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problemasVisiveis.map(({ p, numero }) => (
              <li
                key={p.pergunta}
                className="health-card p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden"
                style={{ borderTop: `4px solid ${cor}` }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Selo texto={`Problema ${String(numero).padStart(2, "0")}`} cor={cor} />
                      {p.eixo && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surf-2)] text-[var(--fg)] font-semibold">
                          {p.eixo}
                        </span>
                      )}
                    </div>
                    <Icone icone={MapPin} cor={cor} />
                  </div>

                  <h3 className="text-xl font-bold text-[var(--fg)] leading-snug">{p.pergunta}</h3>
                  <p className="text-sm text-[var(--fg-2)] leading-relaxed">{p.contexto}</p>

                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {p.cursos.map((c) => (
                        <Curso key={c} nome={c} destaque={c === cursoAtivo} cor={cor} />
                      ))}
                    </div>
                    {p.soma_com.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] uppercase font-semibold text-[var(--fg-2)]">Soma com:</span>
                        {p.soma_com.map((c) => (
                          <Curso key={c} nome={c} destaque={c === cursoAtivo} cor={cor} neutro />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Rodape fontes={p.fontes} cor={cor} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solucoesVisiveis.map(({ s, numero }) => (
              <li
                key={s.nome}
                className="health-card p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden"
                style={{ borderTop: `4px solid ${cor}` }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Selo texto={`Solução ${String(numero).padStart(2, "0")}`} cor={cor} />
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surf-2)] text-[var(--fg)] font-semibold">
                        {s.tipo} · {s.onde}
                      </span>
                    </div>
                    <Icone icone={Sparkles} cor={cor} />
                  </div>

                  <h3 className="text-xl font-bold text-[var(--fg)] leading-snug">{s.nome}</h3>
                  <p className="text-sm text-[var(--fg-2)] leading-relaxed">{s.o_que_faz}</p>

                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-1.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <Sparkles size={14} className="text-emerald-600" aria-hidden="true" />
                      <span>Lição:</span>
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--fg-2)] leading-relaxed">{s.licao}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {s.cursos.map((c) => (
                      <Curso key={c} nome={c} destaque={c === cursoAtivo} cor={cor} />
                    ))}
                  </div>
                </div>

                <Rodape fontes={s.fontes} cor={cor} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-[var(--fg-2)]">Fontes consultadas em {fontes_consultadas_em}.</p>
    </section>
  );
}
