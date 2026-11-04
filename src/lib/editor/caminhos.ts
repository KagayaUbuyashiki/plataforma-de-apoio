/** Resolve um endereço relativo (ex.: "../css/style.css") a partir do arquivo atual. Retorna null para links externos. */
export function resolverCaminho(base: string, ref: string): string | null {
  const limpo = ref.trim();
  if (!limpo || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(limpo)) return null;
  let semHash = limpo.split(/[?#]/)[0];
  try {
    semHash = decodeURIComponent(semHash);
  } catch {}
  const partes = (semHash.startsWith("/") ? [] : base.split("/").slice(0, -1)).concat(semHash.split("/"));
  const saida: string[] = [];
  for (const p of partes) {
    if (p === "" || p === ".") continue;
    if (p === "..") saida.pop();
    else saida.push(p);
  }
  return saida.join("/");
}

/** Nome válido de arquivo/pasta: letras, números, - _ . e barras para pastas. */
export function caminhoValido(caminho: string): string | null {
  const c = caminho.trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (!c) return "Digite um nome.";
  if (c.split("/").some((p) => p === "" || p === "." || p === "..")) return "Nome inválido.";
  if (!/^[\w\-./ ]+$/.test(c)) return "Use só letras sem acento, números, - _ e . (ex.: sobre.html).";
  if (/\s/.test(c)) return "Evite espaços nos nomes de arquivos. Use - no lugar (ex.: minha-pagina.html).";
  return null;
}
