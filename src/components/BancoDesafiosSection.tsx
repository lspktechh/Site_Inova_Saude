"use client";

import { useState } from "react";
import { ExternalLink, Filter, Lightbulb, MapPin, Building2 } from "lucide-react";
import { bancoDesafios, type FonteBanco } from "@/lib/config";

type Aba = "problemas" | "solucoes";

const TODOS = "Todos";

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

function Fontes({ fontes }: { fontes: FonteBanco[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 mt-auto border-t border-[var(--borda)]">
      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-2)] font-bold">
        {fontes.length > 1 ? "Fontes" : "Fonte"}
      </span>
      {fontes.map((f) => (
        <a
          key={f.url}
          href={f.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--marca)] hover:underline"
        >
          <span>{f.nome}</span>
          <ExternalLink size={12} aria-hidden="true" />
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      ))}
    </div>
  );
}

function Curso({ nome, ativo, suave }: { nome: string; ativo: boolean; suave?: boolean }) {
  const estilo = ativo
    ? "bg-[var(--marca)] text-[var(--surf)] border-[var(--marca)]"
    : suave
      ? "bg-[var(--surf-2)] text-[var(--fg-2)] border-[var(--borda)]"
      : "bg-[var(--marca)]/10 text-[var(--marca)] border-[var(--marca)]/25";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold ${estilo}`}>
      {nome}
    </span>
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

  const problemasVisiveis = problemas
    .map((p, i) => ({ p, numero: i + 1 }))
    .filter(({ p }) => casaCurso(p, cursoAtivo));
  const solucoesVisiveis = solucoes
    .map((s, i) => ({ s, numero: i + 1 }))
    .filter(({ s }) => casaCurso(s, cursoAtivo));

  const total = aba === "problemas" ? problemas.length : solucoes.length;
  const visiveis = aba === "problemas" ? problemasVisiveis.length : solucoesVisiveis.length;
  const rotuloItem = aba === "problemas" ? "problemas" : "soluções";

  return (
    <section id="banco-de-desafios" className="space-y-6 scroll-mt-24">
      {/* ──── CABEÇALHO ──── */}
      <div className="space-y-3">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--fg-2)] font-bold flex items-center gap-1.5">
          <Lightbulb size={14} className="text-[var(--marca)]" />
          <span>Banco de Desafios</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--fg)]">
          Problemas reais e soluções que já viraram empresa
        </h2>
        <p className="text-sm sm:text-base text-[var(--fg-2)] max-w-3xl leading-relaxed">
          Cada problema traz a fonte de onde veio o dado. Escolha o curso para ver o que é da sua área e também o que
          pede a sua ajuda em equipes de outros cursos. Professores podem usar o filtro para indicar problemas à turma.
        </p>
      </div>

      {/* ──── ABAS ──── */}
      <div role="tablist" aria-label="Tipo de conteúdo do banco" className="inline-flex p-1 rounded-xl bg-[var(--surf-2)] border border-[var(--borda)]">
        {(
          [
            { id: "problemas", rotulo: `Problemas reais (${problemas.length})`, icone: MapPin },
            { id: "solucoes", rotulo: `Soluções que viraram empresa (${solucoes.length})`, icone: Building2 },
          ] as const
        ).map(({ id, rotulo, icone: Icone }) => {
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
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                selecionada
                  ? "bg-[var(--surf)] text-[var(--marca)] shadow-xs"
                  : "text-[var(--fg-2)] hover:text-[var(--fg)]"
              }`}
            >
              <Icone size={14} aria-hidden="true" />
              <span>{rotulo}</span>
            </button>
          );
        })}
      </div>

      {/* ──── FILTRO POR CURSO ──── */}
      <div className="space-y-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--fg-2)] font-bold flex items-center gap-1.5">
          <Filter size={12} aria-hidden="true" />
          <span>Filtrar por curso</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {[TODOS, ...cursos].map((c) => {
            const selecionado = cursoAtivo === c;
            const quantidade = itensDaAba.filter((i) => casaCurso(i, c)).length;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={selecionado}
                onClick={() => setCurso(c)}
                className={`px-3 py-1.5 rounded-full border text-xs font-bold font-mono transition-colors cursor-pointer ${
                  selecionado
                    ? "bg-[var(--marca)] text-[var(--surf)] border-[var(--marca)]"
                    : "bg-[var(--surf)] text-[var(--fg-2)] border-[var(--borda)] hover:border-[var(--marca-2)] hover:text-[var(--fg)]"
                }`}
              >
                {c} <span className="opacity-70">({quantidade})</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[var(--fg-2)]" aria-live="polite">
          Mostrando {visiveis} de {total} {rotuloItem}
          {cursoAtivo !== TODOS ? ` para ${cursoAtivo}` : ""}.
        </p>
      </div>

      {/* ──── LISTA ──── */}
      <div id="painel-banco" role="tabpanel" aria-labelledby={`aba-${aba}`}>
        {aba === "problemas" ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {problemasVisiveis.map(({ p, numero }) => (
              <li
                key={p.pergunta}
                className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-5 sm:p-6 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--fg-2)] uppercase">Problema {numero}</span>
                  {p.eixo && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surf-2)] text-[var(--fg)] font-semibold">
                      {p.eixo}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-extrabold text-[var(--fg)] leading-snug">{p.pergunta}</h3>
                <p className="text-sm text-[var(--fg-2)] leading-relaxed">{p.contexto}</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {p.cursos.map((c) => (
                    <Curso key={c} nome={c} ativo={c === cursoAtivo} />
                  ))}
                </div>
                {p.soma_com.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-[var(--fg-2)] font-semibold">Soma com:</span>
                    {p.soma_com.map((c) => (
                      <Curso key={c} nome={c} ativo={c === cursoAtivo} suave />
                    ))}
                  </div>
                )}
                <Fontes fontes={p.fontes} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {solucoesVisiveis.map(({ s, numero }) => (
              <li
                key={s.nome}
                className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-5 sm:p-6 flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--fg-2)] uppercase">Solução {numero}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surf-2)] text-[var(--fg)] font-semibold">
                    {s.tipo} · {s.onde}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-[var(--fg)] leading-snug">{s.nome}</h3>
                <p className="text-sm text-[var(--fg-2)] leading-relaxed">{s.o_que_faz}</p>
                <p className="text-sm text-[var(--fg)] leading-relaxed">
                  <strong>Lição:</strong> {s.licao}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {s.cursos.map((c) => (
                    <Curso key={c} nome={c} ativo={c === cursoAtivo} />
                  ))}
                </div>
                <Fontes fontes={s.fontes} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-[var(--fg-2)]">Fontes consultadas em {fontes_consultadas_em}.</p>
    </section>
  );
}
