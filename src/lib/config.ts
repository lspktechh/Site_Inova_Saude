import edicaoJson from "../config/edicao.json";
import formularioJson from "../config/formulario.json";
import competenciasJson from "../config/competencias.json";
import formasPrototipoJson from "../config/formas-prototipo.json";
import avaliacaoJson from "../config/avaliacao.json";
import fichaSchemaJson from "../config/ficha-prototipo.schema.json";

export const edicao = edicaoJson;
export const formulario = formularioJson as any;
export const competencias = competenciasJson as any;
export const formasPrototipo = formasPrototipoJson as any;
export const avaliacao = avaliacaoJson as any;
export const fichaSchema = fichaSchemaJson as any;

export type TrackId = "equipe_com_ideia" | "ideia_sem_equipe" | "sem_ideia";

export interface TeamMember {
  id: string;
  isLeader?: boolean;
  nome: string;
  email: string;
  telefone: string;
  vinculo: string;
  curso: string;
  disponibilidade: string[];
  competencias: string[];
  papel: string;
}

export interface FichaPrototipoOutput {
  edicao: string;
  equipe_id: string;
  formas: string[];
  funcao: string;
  usuario: string;
  dor: string;
  eixo: string;
  software?: {
    usuario_principal?: string;
    telas?: Array<{ nome?: string; acao_principal?: string }>;
    dado_entra?: string;
    dado_sai?: string;
    integracao?: string | null;
    plataforma?: string[];
    tom_visual?: string | null;
  };
  peca_3d?: {
    encaixe?: {
      em?: string;
      medida_mm?: number | null;
      folga_mm?: number | null;
    };
    envelope_mm?: [number, number, number];
    cabe_na_mesa?: boolean;
    requisitos?: string[];
    material?: string | null;
    material_sugerido_por?: string | null;
    quantidade?: number;
    montagem?: boolean;
  };
  dispositivo?: {
    mede_ou_aciona?: string;
    onde_fica?: string;
    alimentacao?: string;
    depende_de?: string[];
    ja_existe?: string;
  };
  servico?: {
    quem_executa_hoje?: string;
    passo_a_passo_atual?: string[];
    o_que_muda?: string;
    artefato?: string[];
    quem_valida?: string;
  };
  referencias?: string[];
  contato_paciente?: boolean;
  trava_sanitaria: {
    acionada: boolean;
    motivos: string[];
    restricao: "nenhuma" | "maquete_de_demonstracao";
  };
  competencias_equipe: string[];
  falta_na_equipe: string[];
  fila_comissao: boolean;
  conversa_agendada?: string | null;
  geracao_ia?: {
    produzida_em?: string | null;
    ferramenta?: string | null;
    e_rascunho: true;
  };
  status: "rascunho" | "pronta_para_geracao" | "em_triagem" | "gerada" | "arquivada";
}

/**
 * Calcula as lacunas da equipe cruzando as competências marcadas pelos integrantes
 * com as competências exigidas pelas formas de protótipo selecionadas.
 */
export function calculateFaltaNaEquipe(
  teamSkills: string[],
  selectedFormas: string[]
): string[] {
  const missing: Set<string> = new Set();
  const exigidasPorForma = competencias.competencias_exigidas_por_forma as Record<
    string,
    string[]
  >;

  for (const forma of selectedFormas) {
    const requiredList = exigidasPorForma[forma];
    if (requiredList) {
      // Se a equipe não marcou nenhuma das competências chave requeridas por essa forma
      const hasAny = requiredList.some((skill) => teamSkills.includes(skill));
      if (!hasAny) {
        // Aponta as principais competências faltantes
        requiredList.forEach((skill) => missing.add(skill));
      }
    }
  }

  return Array.from(missing);
}

/**
 * Sugere material de impressão 3D reativamente conforme as regras de fabricação
 */
export function getMaterialSuggestion(requisitos: string[]): {
  materialId: string | null;
  razao: string;
} {
  const regras = edicao.fabricacao.sugestao_material.regras;
  for (const regra of regras) {
    if (regra.se.length === 0) {
      // Regra padrão
      return { materialId: regra.entao, razao: regra.razao };
    }
    const match = regra.se.every((r) => requisitos.includes(r));
    if (match) {
      return { materialId: regra.entao, razao: regra.razao };
    }
  }
  return { materialId: "pla", razao: "sem requisito especial, o PLA é o mais fácil e barato de imprimir" };
}

/**
 * Checa se o envelope da peça física cabe na mesa de impressão 3D configurada
 */
export function checkBedEnvelope(
  envelope: [number, number, number]
): {
  cabeNaMesa: boolean;
  limites: { x: number; y: number; z: number };
  violacoes: string[];
} {
  const limites = edicao.fabricacao.mesa_impressao_mm;
  const [comprimento, largura, altura] = envelope;
  const violacoes: string[] = [];

  if (comprimento > limites.x) violacoes.push(`comprimento (${comprimento} mm > ${limites.x} mm)`);
  if (largura > limites.y) violacoes.push(`largura (${largura} mm > ${limites.y} mm)`);
  if (altura > limites.z) violacoes.push(`altura (${altura} mm > ${limites.z} mm)`);

  return {
    cabeNaMesa: violacoes.length === 0,
    limites,
    violacoes,
  };
}
