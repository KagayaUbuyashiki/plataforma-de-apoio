import type { Arquivos, Nivel, Projeto } from "./tipos";

/**
 * Projetos salvos no navegador (localStorage). Cada projeto fica numa chave própria,
 * e um índice guarda a lista. Tudo em try/catch: em janela anônima ou com o
 * armazenamento cheio, o editor continua funcionando (e avisa para baixar o .zip).
 */

const INDICE = "mps-editor:indice";
const chave = (id: string) => `mps-editor:projeto:${id}`;

export type ResumoProjeto = Pick<Projeto, "id" | "nome" | "nivel" | "atualizadoEm">;

function ler<T>(k: string): T | null {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

export function listarProjetos(): ResumoProjeto[] {
  const lista = ler<ResumoProjeto[]>(INDICE) ?? [];
  return [...lista].sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
}

export function obterProjeto(id: string): Projeto | null {
  return ler<Projeto>(chave(id));
}

/** Salva o projeto. Retorna false se o navegador não deixou (ex.: espaço cheio). */
export function salvarProjeto(projeto: Projeto): boolean {
  try {
    localStorage.setItem(chave(projeto.id), JSON.stringify(projeto));
    const resumo: ResumoProjeto = { id: projeto.id, nome: projeto.nome, nivel: projeto.nivel, atualizadoEm: projeto.atualizadoEm };
    const lista = (ler<ResumoProjeto[]>(INDICE) ?? []).filter((p) => p.id !== projeto.id);
    localStorage.setItem(INDICE, JSON.stringify([resumo, ...lista]));
    return true;
  } catch {
    return false;
  }
}

export function excluirProjeto(id: string) {
  try {
    localStorage.removeItem(chave(id));
    localStorage.setItem(INDICE, JSON.stringify((ler<ResumoProjeto[]>(INDICE) ?? []).filter((p) => p.id !== id)));
  } catch {}
}

export function novoProjeto(nivel: Nivel, nome: string, arquivos: Arquivos): Projeto {
  const agora = new Date().toISOString();
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
  return { id, nome, nivel, arquivos, criadoEm: agora, atualizadoEm: agora };
}
