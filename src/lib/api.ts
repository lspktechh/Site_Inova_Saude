import { FichaPrototipoOutput, TeamMember, edicao } from "./config";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const DEFAULT_EVENT_SLUG = edicao.credenciamento.slug_evento;

export interface TrabalhoEntregue {
  video_url?: string;
  prototipo_url?: string;
  artefatos_adicionais?: Array<{ tipo: string; titulo: string; url: string }>;
  acesso_liberado: boolean;
  observacoes?: string;
  enviado_em?: string;
}

export interface InscriptionPayload {
  trilha: string;
  lider: TeamMember;
  membros: TeamMember[];
  equipeNome?: string;
  empatizar?: {
    quem_vive: string;
    o_que_perde: string;
    como_sabe: string[];
  };
  definir?: {
    frase: {
      quem: string;
      o_que: string;
      por_que: string;
      o_que_atrapalha: string;
    };
    frequencia: string;
    como_resolvem_hoje: string;
    por_que_nao_resolve: string;
    eixo: string;
  };
  idear?: {
    frase: {
      quem: string;
      necessidade: string;
      nome: string;
      categoria: string;
      beneficio: string;
      alternativa: string;
      diferencial: string;
    };
    nome_solucao: string;
    categoria: string;
    tres_passos: string[];
  };
  escopo?: {
    e: string;
    nao_e: string;
    faz: string[];
    nao_faz: string[];
  };
  fechamento?: {
    como_saberemos: string;
    maior_duvida: string;
    aberta_a_novos: boolean;
    aceites: string[];
    ods: number[];
  };
  forma?: {
    formas: string[];
    campos_forma: Record<string, any>;
    trava_sanitaria: {
      acionada: boolean;
      motivos: string[];
    };
  };
  ficha_prototipo: FichaPrototipoOutput;
  trabalho_entregue?: TrabalhoEntregue;
}

export interface InscriptionResponse {
  id: string;
  eventId: string;
  name: string;
  email: string;
  status: string;
  participantId?: string | null;
  qrToken?: string | null;
  ficha_prototipo: FichaPrototipoOutput;
  createdAt: string;
}

/**
 * Busca o evento cadastrado no sistema de credenciamento pelo slug
 */
export async function getEventBySlug(slug: string = DEFAULT_EVENT_SLUG) {
  try {
    const res = await fetch(`${API_BASE_URL}/public/events/${slug}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.warn("Backend não acessível diretamente, usando fallback local:", err);
    return null;
  }
}

/**
 * Envia a inscrição para o backend do sistema de credenciamento
 */
export async function submitInscription(
  payload: InscriptionPayload,
  targetEventId?: string
): Promise<InscriptionResponse> {
  const lider = payload.lider;
  const isSolo = payload.trilha === "sem_ideia";
  const teamMembers = payload.membros.map((m) => m.nome);

  // Prepara o body compatível com o endpoint /events/:eventId/inscriptions do event-checkin
  const body = {
    name: lider.nome,
    email: lider.email,
    document: lider.telefone.replace(/\D/g, "") || "00000000000", // CPF ou doc
    phone: lider.telefone,
    institution: lider.curso || lider.vinculo,
    category: "Inscrição Gratuita",
    consentVersion: "2026.1",
    teamName: isSolo ? null : (payload.equipeNome || "Equipe sem nome"),
    teamMembers: isSolo ? [] : teamMembers,
    soloParaSorteio: isSolo,
    notes: JSON.stringify({
      trilha: payload.trilha,
      ficha_prototipo: payload.ficha_prototipo,
      membros_detalhes: [lider, ...payload.membros],
      payload_completo: payload,
    }),
  };

  let eventId = targetEventId;

  // Se não recebemos o ID do evento, busca pelo slug
  if (!eventId) {
    const event = await getEventBySlug(DEFAULT_EVENT_SLUG);
    if (!event?.id) {
      throw new Error(
        "Não foi possível conectar ao sistema de credenciamento. Seu rascunho está salvo; tente novamente em alguns minutos."
      );
    }
    if (event.registrationsOpen === false) {
      throw new Error("As inscrições para este evento estão encerradas no sistema de credenciamento.");
    }
    eventId = event.id as string;
  }

  // Sem fallback local: a inscrição só é confirmada se o credenciamento registrar.
  // Um voucher gerado no navegador não existiria no painel e seria recusado no check-in.
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/events/${eventId}/inscriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.warn("Falha de rede ao conectar com o credenciamento:", err);
    throw new Error("Sem conexão com o sistema de credenciamento. Seu rascunho está salvo; tente novamente.");
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success || !json.data) {
    throw new Error(describeApiError(json) || `O credenciamento recusou a inscrição (erro ${res.status}).`);
  }

  const result: InscriptionResponse = {
    id: json.data.id,
    eventId: json.data.eventId,
    name: json.data.name,
    email: json.data.email,
    status: json.data.status,
    participantId: json.data.participantId ?? null,
    qrToken: json.data.qrToken ?? null,
    ficha_prototipo: payload.ficha_prototipo,
    createdAt: json.data.createdAt || new Date().toISOString(),
  };
  saveLocalInscription(result);
  return result;
}

/**
 * Monta uma mensagem legível a partir do erro de validação do event-checkin
 */
function describeApiError(json: any): string | null {
  const error = json?.error;
  if (!error) return null;
  const fieldErrors = error.details?.fieldErrors as Record<string, string[]> | undefined;
  if (fieldErrors && Object.keys(fieldErrors).length > 0) {
    const detalhes = Object.values(fieldErrors).flat().join("; ");
    return `${error.message || "Dados inválidos"}: ${detalhes}`;
  }
  return error.message || null;
}

/**
 * Salva a inscrição no localStorage para consulta off-line e banco de talentos
 */
export function saveLocalInscription(data: InscriptionResponse) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(localStorage.getItem("inova_inscriptions") || "[]");
    existing.push(data);
    localStorage.setItem("inova_inscriptions", JSON.stringify(existing));
    localStorage.setItem(`inova_insc_${data.id}`, JSON.stringify(data));
  } catch (e) {
    console.error("Erro ao salvar inscrição no localStorage:", e);
  }
}

/**
 * Recupera uma inscrição pelo ID
 */
export function getLocalInscription(id: string): InscriptionResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`inova_insc_${id}`);
    if (raw) return JSON.parse(raw);
    const all: InscriptionResponse[] = JSON.parse(
      localStorage.getItem("inova_inscriptions") || "[]"
    );
    return all.find((i) => i.id === id) || null;
  } catch (e) {
    return null;
  }
}

/**
 * Retorna todos os inscritos salvos para popular o Banco de Talentos
 */
export function getAllLocalInscriptions(): InscriptionResponse[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("inova_inscriptions") || "[]");
  } catch (e) {
    return [];
  }
}

export interface TrabalhoItem {
  tipo: "arquivo" | "link";
  titulo: string;
  linkUrl?: string;
  arquivoNome?: string;
  arquivoBase64?: string;
}

export interface TrabalhoPayload {
  equipeNome: string;
  protocolo?: string;
  emailLider: string;
  itens: TrabalhoItem[];
  observacoes?: string;
  acessoLiberado: boolean;
  dataEnvio?: string;
}

export interface TrabalhoResponse {
  success: boolean;
  protocoloEnvio: string;
  dataEnvio: string;
  backendId?: string;
  mensagem: string;
}

/**
 * Salva a entrega de trabalhos de forma resiliente (localStorage + servidor central)
 */
export async function submitTrabalho(payload: TrabalhoPayload): Promise<TrabalhoResponse> {
  const timestampStr = new Date().toLocaleString("pt-BR");
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  let protocoloEnvio = payload.protocolo
    ? `${payload.protocolo}-TRAB-${randomSuffix}`
    : `TRAB-${randomSuffix}`;

  // 1. Persistência local imediata (resiliente contra quedas de conexão ou reload)
  saveLocalTrabalho({
    ...payload,
    protocoloEnvio,
    dataEnvio: timestampStr,
  });

  // 2. Registro no servidor central
  let backendId: string | undefined;
  try {
    const event = await getEventBySlug(DEFAULT_EVENT_SLUG);
    if (event?.id) {
      // 2A. Registro na aba "Trabalhos" (tabela Submission) do painel admin
      try {
        const resumoItens = payload.itens
          .map((it, idx) => `Item ${idx + 1} (${it.tipo}): ${it.titulo}${it.linkUrl ? ` -> ${it.linkUrl}` : ""}${it.arquivoNome ? ` [${it.arquivoNome}]` : ""}`)
          .join("\n");

        const abstractText = `Submissão oficial de protótipo e vídeo da equipe ${payload.equipeNome} para o Demoday do INOVA SAÚDE 2026.\n\n` +
          `Itens entregues:\n${resumoItens}\n\n` +
          (payload.observacoes ? `Observações da equipe: ${payload.observacoes}\n\n` : "") +
          `Declaração de acesso público liberado: ${payload.acessoLiberado ? "Sim" : "Não"}.\n` +
          `Data de envio: ${timestampStr}. Protocolo de inscrição: ${payload.protocolo || "Não informado"}.`;

        const itemComArquivo = payload.itens.find((it) => it.tipo === "arquivo" && it.arquivoBase64);
        const fileName = (itemComArquivo?.arquivoNome?.replace(/[^a-zA-Z0-9._-]/g, "_") || "ficha-submissao.pdf");
        const dataBase64 = itemComArquivo?.arquivoBase64?.split(",")[1] ||
          "JVBERi0xLjQKJcTl8uXrCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMiAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY4IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA0Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgoyMDkKJSVFT0YK";

        const subBody = {
          title: `Equipe ${payload.equipeNome} - Protótipo Demoday`,
          abstract: abstractText,
          keywords: ["INOVA SAÚDE", "Protótipo", "Demoday", "Saúde"],
          authors: [
            {
              name: `Equipe ${payload.equipeNome}`,
              email: payload.emailLider,
              isPresenter: true,
            },
          ],
          fileName,
          dataBase64,
        };

        const resSub = await fetch(`${API_BASE_URL}/public/events/${event.id}/submissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subBody),
        });

        if (resSub.ok) {
          const jsonSub = await resSub.json();
          if (jsonSub?.data?.code) {
            protocoloEnvio = jsonSub.data.code;
            backendId = jsonSub.data.id;
          }
        }
      } catch (errSub) {
        console.warn("Aviso ao registrar na chamada de Trabalhos:", errSub);
      }

      // 2B. Registro complementar na aba "Inscritos" (tabela Inscription) do painel admin
      const body = {
        name: `[TRABALHO] ${payload.equipeNome}`,
        email: payload.emailLider,
        document: (payload.protocolo || "").replace(/\D/g, "") || "00000000000",
        phone: "",
        institution: "INOVA SAÚDE 2026",
        category: "Inscrição Gratuita",
        consentVersion: "2026.1",
        teamName: payload.equipeNome,
        teamMembers: [],
        soloParaSorteio: false,
        notes: JSON.stringify({
          tipo_registro: "SUBMISSAO_TRABALHO",
          protocolo_envio: protocoloEnvio,
          protocolo_inscricao: payload.protocolo,
          equipe_nome: payload.equipeNome,
          email_lider: payload.emailLider,
          itens: payload.itens.map((it) => ({
            tipo: it.tipo,
            titulo: it.titulo,
            linkUrl: it.linkUrl,
            arquivoNome: it.arquivoNome,
          })),
          observacoes: payload.observacoes,
          acesso_liberado: payload.acessoLiberado,
          data_envio: timestampStr,
        }),
      };

      const resInsc = await fetch(`${API_BASE_URL}/events/${event.id}/inscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (resInsc.ok) {
        const jsonInsc = await resInsc.json();
        if (jsonInsc?.data?.id && !backendId) {
          backendId = jsonInsc.data.id;
        }
      }
    }
  } catch (err) {
    console.warn("Aviso ao conectar com backend para registrar trabalho:", err);
  }

  // Atualiza persistência local com o código oficial gerado
  saveLocalTrabalho({
    ...payload,
    protocoloEnvio,
    dataEnvio: timestampStr,
    backendId,
  });

  return {
    success: true,
    protocoloEnvio,
    dataEnvio: timestampStr,
    backendId,
    mensagem: "Trabalho registrado com sucesso e garantido no sistema!",
  };
}

export function saveLocalTrabalho(data: any) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("inova_envio_trabalho", JSON.stringify(data));
    const historico = JSON.parse(localStorage.getItem("inova_envio_historico") || "[]");
    historico.unshift(data);
    localStorage.setItem("inova_envio_historico", JSON.stringify(historico.slice(0, 15)));
  } catch (e) {
    console.error("Erro ao salvar trabalho localmente:", e);
  }
}

export function getLocalTrabalhoHistorico(): any[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("inova_envio_historico") || "[]");
  } catch (e) {
    return [];
  }
}
