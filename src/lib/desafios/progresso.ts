/** Progresso dos desafios guardado no navegador (vale também para quem não está logado). */
const CHAVE = "mps-desafios";

export function desafiosLocais(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE) ?? "[]");
    return Array.isArray(v) ? v.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function marcarDesafioLocal(slug: string) {
  try {
    const atual = new Set(desafiosLocais());
    atual.add(slug);
    localStorage.setItem(CHAVE, JSON.stringify([...atual]));
  } catch {}
}
