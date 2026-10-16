import Link from "next/link";
import { edicao, formulario } from "@/lib/config";
import { ArrowRight, Users, Sparkles, UserPlus, Calendar, Award, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const trilhas = (formulario.etapas[0] as any).opcoes || [];
  const eixos = edicao.eixos_tematicos;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="bg-[var(--marca-fundo)] text-white py-14 sm:py-20 border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] text-xs font-mono tracking-wider text-[var(--acento)]">
              <span>{edicao.edicao.numero}ª edição · {edicao.edicao.cidade}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Transforme uma dor real da saúde em{" "}
              <em className="not-italic text-[var(--acento)]">solução</em>.
            </h1>

            <p className="text-lg sm:text-xl text-[rgba(255,255,255,0.85)] max-w-2xl leading-relaxed">
              Equipes de 3 a 6 pessoas, de qualquer curso. Você traz o problema que viu acontecer; a gente ajuda a transformar em projeto até o Pitch Final.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/inscricao"
                className="inline-flex items-center gap-2 bg-[var(--acento)] text-[#1e1708] font-bold text-base px-6 py-3.5 rounded-lg shadow-md hover:brightness-105 transition-all"
              >
                <span>Inscrever minha equipe</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/banco-de-talentos"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium text-base px-6 py-3.5 rounded-lg border border-white/20 transition-all"
              >
                <span>Banco de Talentos</span>
                <Users size={18} />
              </Link>
            </div>

            {/* Pílulas de datas */}
            <div className="flex flex-wrap gap-2.5 pt-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-white/25 bg-black/20 text-white/90">
                <Calendar size={13} className="text-[var(--acento)]" />
                <span>Oficina 31/10</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-white/25 bg-black/20 text-white/90">
                <Calendar size={13} className="text-[var(--acento)]" />
                <span>Classificação 03/11</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-white/25 bg-black/20 text-white/90">
                <Award size={13} className="text-[var(--acento)]" />
                <span>Pitch Final 05/11</span>
              </div>
            </div>
          </div>

          {/* Card de Prazo */}
          <div className="lg:col-span-4 bg-black/30 border border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xs space-y-4 shadow-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-white/70 block">
              Inscrições encerram em
            </span>
            <div className="text-5xl sm:text-6xl font-black text-[var(--acento)] font-display tracking-tight">
              23/10
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Aberto a estudantes de graduação e pós de todos os cursos, docentes, comunidade externa e profissionais de saúde.
            </p>
            <div className="pt-2 border-t border-white/15 flex items-center gap-2 text-xs text-white/70">
              <CheckCircle2 size={15} className="text-[var(--acao)]" />
              <span>Inscrição gratuita e confirmada na hora</span>
            </div>
          </div>
        </div>
      </section>

      {/* Três Formas de Participar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="space-y-3 mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--fg-2)]">
            Entrada no Evento
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--fg)]">
            Três formas de participar
          </h2>
          <p className="text-[var(--fg-2)] max-w-2xl text-base">
            Esta escolha é a primeira etapa do formulário e define a sua trilha. Ninguém fica de fora por não ter grupo ou ideia pronta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trilhas.map((trilha, idx) => {
            const isGroup = trilha.trilha === "equipe_com_ideia";
            const isIdeaOnly = trilha.trilha === "ideia_sem_equipe";
            return (
              <div
                key={trilha.trilha}
                className="bg-[var(--surf)] border border-[var(--borda)] rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border-t-4 border-t-[var(--marca)]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--marca-2)] bg-[var(--surf-2)] px-2.5 py-1 rounded-md">
                      0{idx + 1}
                    </span>
                    {isGroup && <Users size={20} className="text-[var(--marca-2)]" />}
                    {isIdeaOnly && <Sparkles size={20} className="text-[var(--acao)]" />}
                    {!isGroup && !isIdeaOnly && <UserPlus size={20} className="text-[var(--alerta)]" />}
                  </div>

                  <h3 className="text-xl font-bold text-[var(--fg)] group-hover:text-[var(--marca)] transition-colors">
                    {trilha.titulo}
                  </h3>

                  <p className="text-sm text-[var(--fg-2)] leading-relaxed">
                    {trilha.descricao}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[var(--borda)] flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--fg-2)]">
                    {trilha.estimativa}
                  </span>
                  <Link
                    href={`/inscricao?trilha=${trilha.trilha}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--acao)] hover:underline"
                  >
                    <span>Começar</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Os Cinco Eixos Temáticos */}
      <section className="bg-[var(--surf-2)] py-14 border-y border-[var(--borda)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--fg-2)]">
              Desafios Regionais
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)] tracking-tight">
              Os 5 Eixos Temáticos
            </h2>
            <p className="text-[var(--fg-2)] max-w-2xl text-base">
              Sua equipe pode atacar qualquer dor real dentro dessas áreas prioritárias da saúde e tecnologia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eixos.map((eixo, i) => (
              <div
                key={eixo}
                className="bg-[var(--surf)] border border-[var(--borda)] rounded-xl p-5 shadow-2xs hover:border-[var(--marca-2)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: `var(--e${(i % 6) + 1})` }}
                  />
                  <h4 className="font-bold text-base text-[var(--fg)]">{eixo}</h4>
                </div>
                <p className="text-xs text-[var(--fg-2)] pl-6">
                  Dores reais em hospitais, UBSs, clínicas e na formação de profissionais da saúde.
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Link
              href="/desafios"
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--marca)] hover:underline"
            >
              <span>Ver exemplos de dores e desafios detalhados</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Metodologia de Ensino & Credenciamento */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--acao)] font-semibold">
            Metodologia Integrada
          </span>
          <h3 className="text-2xl font-bold text-[var(--fg)]">
            Design Thinking & Lean Inception na prática
          </h3>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">
            O formulário foi desenhado para ensinar você a estruturar uma boa ideia enquanto preenche.
            Você passa pelas etapas de <strong>Empatizar</strong> (de quem é a dor), <strong>Definir</strong> (recorte do problema),
            <strong>Idear</strong> (visão do produto) e <strong>Escopo</strong> (É / Não é / Faz / Não faz).
          </p>
          <div className="pt-2">
            <span className="inline-block text-xs font-mono bg-[var(--surf-2)] text-[var(--fg-2)] px-3 py-1.5 rounded-lg border border-[var(--borda)]">
              💡 Exemplos de "Assim funciona" e "Assim não" em cada campo
            </span>
          </div>
        </div>

        <div className="bg-[var(--surf)] border border-[var(--borda)] rounded-2xl p-6 sm:p-8 space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--marca)] font-semibold">
            Credenciamento Digital
          </span>
          <h3 className="text-2xl font-bold text-[var(--fg)]">
            QR Code Oficial & Controle de Presença
          </h3>
          <p className="text-sm text-[var(--fg-2)] leading-relaxed">
            Todas as inscrições são vinculadas diretamente ao sistema central de credenciamento. Cada integrante
            recebe um voucher digital exclusivo com QR Code para leitura rápida nos terminais da oficina e da banca final,
            assegurando o registro oficial de presença e emissão do certificado.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/inscricao"
              className="text-sm font-bold text-[var(--acao)] hover:underline inline-flex items-center gap-1"
            >
              <span>Fazer inscrição agora</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Faixa de Premiação */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[var(--marca-fundo)] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--acento)] text-[#1e1708] flex items-center justify-center shrink-0">
              <Award size={26} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Premiação para Finalistas</h4>
              <p className="text-sm text-white/80 max-w-xl">
                {edicao.premiacao.texto_site}
              </p>
            </div>
          </div>
          <Link
            href="/regulamento"
            className="shrink-0 text-xs font-mono uppercase tracking-wider text-[var(--acento)] border border-[var(--acento)]/40 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Ver Regulamento
          </Link>
        </div>
      </section>
    </div>
  );
}
