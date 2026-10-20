import Link from "next/link";
import {
  FileText,
  Calendar,
  Users,
  Award,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Download,
  Printer,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { edicao } from "@/lib/config";

export const metadata = {
  title: "Edital Oficial · INOVA SAÚDE 2026",
  description: "Regulamento e edital oficial da 2ª edição do INOVA SAÚDE 2026: inscrições de 20/10 a 02/11, mentorias, Demoday no 3º COPOL, critérios e certificados de 8h e 16h.",
};

export default function EditalPage() {
  const whatsappUrl = edicao.whatsapp_grupo?.url || "https://chat.whatsapp.com/IBDoKA6L0Sk9cpn0efoFWa";

  const criterios = [
    { criterio: "Problema", avalia: "Relevância e clareza do problema de saúde", peso: 2 },
    { criterio: "Inovação", avalia: "Originalidade da solução", peso: 2 },
    { criterio: "Viabilidade", avalia: "Possibilidade real de colocar a solução em prática", peso: 2 },
    { criterio: "Impacto", avalia: "Benefício para as pessoas e alinhamento aos ODS", peso: 2 },
    { criterio: "Protótipo e apresentação", avalia: "Qualidade do protótipo e clareza da apresentação", peso: 2 },
  ];

  const certificados = [
    { quem: "Integrantes das equipes que cumpriram todos os requisitos da inscrição", horas: "8 horas" },
    { quem: "Presentes no Demoday em 5 de novembro, com credenciamento e presença registrados", horas: "16 horas" },
  ];

  const cronograma = [
    { etapa: "Inscrições", data: "20/10/2026 a 02/11/2026", detalhe: "Pelo formulário em superinteligencia.tec.br/inscricao" },
    { etapa: "Mentorias", data: "Da inscrição até 02/11/2026", detalhe: "A distância, pelo WhatsApp ou e-mail cadastrado" },
    { etapa: "Envio dos links do vídeo e do protótipo", data: "Junto com a inscrição, até 02/11/2026", detalhe: "Por link liberado (YouTube, Google Drive, Figma ou site)" },
    { etapa: "Divulgação dos 10 finalistas", data: "03/11/2026", detalhe: "Pelos canais oficiais do evento" },
    { etapa: "Demoday no 3º COPOL", data: "05/11/2026, das 19h às 22h30", detalhe: "Auditório 108E, Bloco E · Universidade Positivo Londrina" },
  ];

  return (
    <div className="w-full max-w-4xl min-w-0 mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-10 sm:space-y-12">
      {/* ──── HERO DO EDITAL ──── */}
      <header className="space-y-4 border-b border-[var(--borda)] pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--marca)]/10 text-[var(--marca)] text-xs font-mono font-bold tracking-wider">
            <FileText size={14} className="shrink-0" />
            <span>Documento Oficial · 20/10/2026</span>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <Link
              href="/inscricao"
              className="inline-flex items-center gap-2 bg-[var(--acao)] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs hover:brightness-105 transition-all"
            >
              <span>Ir para Inscrição</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight">
          Edital INOVA SAÚDE 2026
        </h1>

        <p className="text-base sm:text-lg text-[var(--fg-2)] leading-relaxed">
          Regulamento completo, normas de participação, critérios de avaliação, cronograma e orientações para a submissão de propostas da 2ª edição do evento.
        </p>

        {/* Grupo do WhatsApp Obrigatório */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:border-emerald-700">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <MessageCircle size={15} />
              Aviso Obrigatório da Organização
            </span>
            <p className="text-xs sm:text-sm text-[var(--fg)]">
              Após enviar a inscrição, todos os inscritos devem entrar no grupo de WhatsApp de orientações.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            <span>Entrar no Grupo WhatsApp</span>
            <ExternalLink size={15} />
          </a>
        </div>

        {/* Índice Rápido */}
        <nav aria-label="Sumário do Edital" className="pt-2 print:hidden">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--fg-2)] block mb-2">
            Navegação rápida pelos artigos:
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            <a href="#apresentacao" className="px-3 py-1 rounded-lg bg-[var(--surf-2)] hover:bg-[var(--borda)] text-[var(--fg)] transition-colors">1. Apresentação</a>
            <a href="#participacao" className="px-3 py-1 rounded-lg bg-[var(--surf-2)] hover:bg-[var(--borda)] text-[var(--fg)] transition-colors">2. Quem pode participar</a>
            <a href="#inscricoes" className="px-3 py-1 rounded-lg bg-[var(--surf-2)] hover:bg-[var(--borda)] text-[var(--fg)] transition-colors">3. Inscrições</a>
            <a href="#mentorias" className="px-3 py-1 rounded-lg bg-[var(--surf-2)] hover:bg-[var(--borda)] text-[var(--fg)] transition-colors">4. Mentorias</a>
            <a href="#avaliacao" className="px-3 py-1 rounded-lg bg-[var(--surf-2)] hover:bg-[var(--borda)] text-[var(--fg)] transition-colors">5. Avaliação</a>
            <a href="#demoday" className="px-3 py-1 rounded-lg bg-[var(--surf-2)] hover:bg-[var(--borda)] text-[var(--fg)] transition-colors">6. Demoday</a>
            <a href="#premiacao" className="px-3 py-1 rounded-lg bg-[var(--surf-2)] hover:bg-[var(--borda)] text-[var(--fg)] transition-colors">7. Premiação</a>
            <a href="#certificados" className="px-3 py-1 rounded-lg bg-[var(--surf-2)] hover:bg-[var(--borda)] text-[var(--fg)] transition-colors">8. Certificados</a>
            <a href="#cronograma" className="px-3 py-1 rounded-lg bg-[var(--surf-2)] hover:bg-[var(--borda)] text-[var(--fg)] transition-colors">9. Cronograma</a>
            <a href="#disposicoes" className="px-3 py-1 rounded-lg bg-[var(--surf-2)] hover:bg-[var(--borda)] text-[var(--fg)] transition-colors">10. Disposições</a>
          </div>
        </nav>
      </header>

      {/* ──── CONTEÚDO DO EDITAL ──── */}
      <article className="space-y-10 sm:space-y-12 text-[var(--fg)] leading-relaxed text-sm sm:text-base">
        {/* 1. Apresentação */}
        <section id="apresentacao" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--marca)] flex items-center gap-2 border-b border-[var(--borda)] pb-2">
            <span>1. Apresentação</span>
          </h2>
          <p>
            O <strong>INOVA SAÚDE 2026</strong> é um ideathon em que estudantes criam soluções para problemas reais da saúde, recebem mentoria e apresentam um protótipo no Demoday, em <strong>5 de novembro de 2026</strong>.
          </p>
          <p>
            A segunda edição é promovida pelo <strong>Instituto Cruzeiro do Sul</strong>, com realização do <strong>ecohub Londrina</strong> e parceria da <strong>Universidade Positivo</strong>. O Demoday acontece dentro do <strong>3º COPOL (Congresso Odontológico Positivo Londrinense)</strong>. O evento conta com apoio financeiro da <strong>Fundação Araucária</strong> e da <strong>Secretaria da Ciência, Tecnologia e Ensino Superior do Paraná (SETI)</strong>.
          </p>
          <p className="p-3.5 bg-[var(--surf-2)] rounded-xl border border-[var(--borda)]">
            <strong>Tema:</strong> aberto, voltado à saúde, para atender os diversos cursos da instituição e a comunidade externa que atua na área da saúde.
          </p>
        </section>

        {/* 2. Quem pode participar */}
        <section id="participacao" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--marca)] flex items-center gap-2 border-b border-[var(--borda)] pb-2">
            <span>2. Quem pode participar</span>
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Estudantes de todos os cursos da Universidade Positivo Londrina e pessoas da comunidade externa que estudam ou atuam na área da saúde.</li>
            <li>A inscrição é feita em equipe de <strong>3 a 6 integrantes</strong>. O ideal é formar equipes multidisciplinares, com integrantes de cursos ou áreas diferentes.</li>
            <li>Cada estudante participa de uma só equipe.</li>
          </ul>
        </section>

        {/* 3. Inscrições */}
        <section id="inscricoes" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--marca)] flex items-center gap-2 border-b border-[var(--borda)] pb-2">
            <span>3. Inscrições</span>
          </h2>
          <p>
            As inscrições são <strong>100% gratuitas</strong> e vão de <strong>20 de outubro a 2 de novembro de 2026</strong>, pelo formulário oficial em{" "}
            <Link href="/inscricao" className="text-[var(--acao)] font-bold underline">
              superinteligencia.tec.br/inscricao
            </Link>.
          </p>
          <p>A equipe informa no formulário:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>nome, curso, <strong>WhatsApp e e-mail</strong> de cada integrante (obrigatórios para contato do mentor);</li>
            <li>o problema de saúde escolhido e a ideia de solução;</li>
            <li>quais Objetivos de Desenvolvimento Sustentável (ODS) a solução pretende atender (mínimo 1, máximo 3).</li>
          </ul>
          <div className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 text-sm">
            <strong>Atenção:</strong> Depois de enviar o formulário, todos os inscritos devem entrar no grupo de WhatsApp de orientações:{" "}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--acao)] underline font-bold">
              chat.whatsapp.com/IBDoKA6L0Sk9cpn0efoFWa
            </a>. A entrada no grupo é <strong>obrigatória</strong>.
          </div>
        </section>

        {/* 4. Mentorias */}
        <section id="mentorias" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--marca)] flex items-center gap-2 border-b border-[var(--borda)] pb-2">
            <span>4. Mentorias</span>
          </h2>
          <p>
            A organização entra em contato com cada equipe inscrita, pelo WhatsApp ou e-mail cadastrado do responsável, para agendar mentorias a partir da ideia enviada. As mentorias acontecem <strong>até 2 de novembro de 2026, a distância</strong>, e ajudam a equipe a refinar o problema, a solução e o protótipo.
          </p>
        </section>

        {/* 5. Avaliação e seleção */}
        <section id="avaliacao" className="space-y-4 scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--marca)] flex items-center gap-2 border-b border-[var(--borda)] pb-2">
            <span>5. Avaliação e seleção</span>
          </h2>
          <p>
            Uma banca avaliadora seleciona as <strong>10 equipes mais bem avaliadas</strong> para o Demoday. Se um finalista desistir, a vaga passa para a próxima equipe da classificação.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-[var(--borda)] shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[var(--surf-2)] border-b border-[var(--borda)] text-[var(--fg)] font-mono uppercase text-[11px]">
                <tr>
                  <th className="p-3 sm:p-4">Critério</th>
                  <th className="p-3 sm:p-4">O que se avalia</th>
                  <th className="p-3 sm:p-4 text-center">Peso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--borda)] bg-[var(--surf)]">
                {criterios.map((c) => (
                  <tr key={c.criterio} className="hover:bg-[var(--surf-2)]/50 transition-colors">
                    <td className="p-3 sm:p-4 font-bold text-[var(--fg)]">{c.criterio}</td>
                    <td className="p-3 sm:p-4 text-[var(--fg-2)]">{c.avalia}</td>
                    <td className="p-3 sm:p-4 text-center font-mono font-bold text-[var(--marca)]">{c.peso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs sm:text-sm text-[var(--fg-2)]">
            • Na seleção dos finalistas valem os <strong>4 primeiros critérios</strong>. No Demoday valem os <strong>5 critérios</strong>.<br />
            • Os 10 finalistas serão divulgados em <strong>3 de novembro de 2026</strong>, pelos canais oficiais do evento.
          </p>
        </section>

        {/* 6. Demoday */}
        <section id="demoday" className="space-y-4 scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--marca)] flex items-center gap-2 border-b border-[var(--borda)] pb-2">
            <span>6. Demoday</span>
          </h2>
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surf-2)] border border-[var(--borda)] space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--marca)] uppercase tracking-wider">
              <Calendar size={14} />
              <span>Data, Horário e Local</span>
            </div>
            <p className="font-bold text-base text-[var(--fg)]">
              5 de novembro de 2026, das 19h às 22h30
            </p>
            <p className="text-sm text-[var(--fg-2)] flex items-start gap-1.5">
              <MapPin size={16} className="text-[var(--marca)] shrink-0 mt-0.5" />
              <span>
                3º COPOL · <strong>Auditório 108E do Bloco E</strong> da Universidade Positivo, Campus Londrina (R. João Rogério Ribeiro Bonesi, 150).
              </span>
            </p>
            <p className="text-xs text-[var(--fg-2)] pt-1">
              Às 19h: falas da organização e convidados. Às 19h30: início das apresentações dos finalistas.
            </p>
          </div>

          <ul className="list-disc pl-5 space-y-2">
            <li>
              Cada finalista apresenta a solução com um <strong>protótipo, físico ou digital</strong>. Sites e protótipos digitais são mostrados em vídeo, para evitar problemas de exibição. O vídeo e os demais artefatos criados são enviados por link (YouTube, Google Drive, Figma ou site), <strong>junto com a inscrição, até 2 de novembro de 2026</strong>. O link precisa estar com <strong>acesso liberado</strong> para a organização. A equipe pode atualizar o envio quantas vezes precisar até esse prazo.
            </li>
            <li>
              São <strong>5 minutos de apresentação</strong> e mais <strong>5 minutos de considerações da banca</strong>.
            </li>
            <li>
              O tempo é controlado por cronômetro visível. Ao fim dos 5 minutos, a apresentação é encerrada.
            </li>
            <li>A banca define a classificação final.</li>
          </ul>
        </section>

        {/* 7. Premiação */}
        <section id="premiacao" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--marca)] flex items-center gap-2 border-b border-[var(--borda)] pb-2">
            <span>7. Premiação</span>
          </h2>
          <p>
            As <strong>3 equipes mais bem classificadas</strong> no Demoday recebem premiação. O resultado oficial é anunciado ao fim do Demoday.
          </p>
          <p className="text-sm text-[var(--fg-2)]">
            Os prêmios serão divulgados nos próximos dias, pelos canais oficiais do evento.
          </p>
        </section>

        {/* 8. Certificados */}
        <section id="certificados" className="space-y-4 scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--marca)] flex items-center gap-2 border-b border-[var(--borda)] pb-2">
            <span>8. Certificados</span>
          </h2>
          <p>
            O certificado de atividades complementares vale só para as equipes que cumpriram todos os requisitos da inscrição.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-[var(--borda)] shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[var(--surf-2)] border-b border-[var(--borda)] text-[var(--fg)] font-mono uppercase text-[11px]">
                <tr>
                  <th className="p-3 sm:p-4">Quem recebe</th>
                  <th className="p-3 sm:p-4 text-right">Carga Horária</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--borda)] bg-[var(--surf)]">
                {certificados.map((c) => (
                  <tr key={c.horas} className="hover:bg-[var(--surf-2)]/50 transition-colors">
                    <td className="p-3 sm:p-4 font-medium text-[var(--fg)]">{c.quem}</td>
                    <td className="p-3 sm:p-4 text-right font-mono font-bold text-[var(--marca)] text-base whitespace-nowrap">
                      {c.horas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[var(--fg-2)]">
            * O credenciamento é feito na entrada do Demoday em 5 de novembro, via leitura do QR Code individual.
          </p>
        </section>

        {/* 9. Cronograma */}
        <section id="cronograma" className="space-y-4 scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--marca)] flex items-center gap-2 border-b border-[var(--borda)] pb-2">
            <span>9. Cronograma</span>
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-[var(--borda)] shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[var(--surf-2)] border-b border-[var(--borda)] text-[var(--fg)] font-mono uppercase text-[11px]">
                <tr>
                  <th className="p-3 sm:p-4">Etapa</th>
                  <th className="p-3 sm:p-4">Data</th>
                  <th className="p-3 sm:p-4">Observações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--borda)] bg-[var(--surf)]">
                {cronograma.map((item) => (
                  <tr key={item.etapa} className="hover:bg-[var(--surf-2)]/50 transition-colors">
                    <td className="p-3 sm:p-4 font-bold text-[var(--fg)]">{item.etapa}</td>
                    <td className="p-3 sm:p-4 font-mono font-bold text-[var(--acao)] whitespace-nowrap">{item.data}</td>
                    <td className="p-3 sm:p-4 text-[var(--fg-2)]">{item.detalhe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 10. Disposições gerais */}
        <section id="disposicoes" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--marca)] flex items-center gap-2 border-b border-[var(--borda)] pb-2">
            <span>10. Disposições gerais</span>
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>As ideias e os protótipos continuam sendo das equipes que os criaram.</li>
            <li>Ao se inscrever, o participante autoriza o uso de sua imagem e voz nos registros do evento, sem fins comerciais.</li>
            <li>Os dados pessoais são usados só para organizar o evento, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</li>
            <li>A inscrição implica aceitar as regras deste edital.</li>
            <li>Os casos omissos são resolvidos pela Comissão Organizadora.</li>
          </ul>

          <div className="pt-4 border-t border-[var(--borda)] space-y-2">
            <p className="text-sm">
              <strong>Contato Oficial da Comissão:</strong>{" "}
              <a href="mailto:helton.azevedo@up.edu.br" className="text-[var(--acao)] font-bold underline">
                helton.azevedo@up.edu.br
              </a>
            </p>
            <p className="text-xs text-[var(--fg-2)] font-mono leading-relaxed">
              Promoção: Instituto Cruzeiro do Sul · Realização: ecohub · Parceria: Universidade Positivo · Apoio financeiro: Fundação Araucária e SETI, Governo do Estado do Paraná
            </p>
          </div>
        </section>
      </article>

      {/* ──── CTA FINAL DO EDITAL ──── */}
      <footer className="pt-8 border-t border-[var(--borda)] flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <Link
          href="/inscricao"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--marca)] hover:bg-[var(--marca-2)] text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-md transition-all text-center"
        >
          <span>Fazer Inscrição no Formulário</span>
          <ArrowRight size={18} />
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all text-center"
        >
          <MessageCircle size={18} />
          <span>Grupo WhatsApp Oficial</span>
        </a>
      </footer>
    </div>
  );
}
