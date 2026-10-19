import { FichaPrototipoOutput, TeamMember, edicao } from "./config";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const DEFAULT_EVENT_SLUG = edicao.credenciamento.slug_evento;

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
