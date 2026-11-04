export type Nivel = "iniciante" | "intermediario" | "livre";

/** Caminho do arquivo → conteúdo. Imagens ficam guardadas como data URL (data:image/...). */
export type Arquivos = Record<string, string>;

export type Projeto = {
  id: string;
  nome: string;
  nivel: Nivel;
  arquivos: Arquivos;
  /** Pastas criadas pelo aluno (inclusive vazias). */
  pastas?: string[];
  criadoEm: string;
  atualizadoEm: string;
};

export type TipoArquivo = "html" | "css" | "js" | "imagem" | "texto";

export function tipoDoArquivo(caminho: string): TipoArquivo {
  const ext = caminho.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "html" || ext === "htm") return "html";
  if (ext === "css") return "css";
  if (ext === "js") return "js";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "imagem";
  return "texto";
}

export function linguagemMonaco(caminho: string): string {
  const t = tipoDoArquivo(caminho);
  return t === "js" ? "javascript" : t === "texto" || t === "imagem" ? "plaintext" : t;
}
