import JSZip from "jszip";
import { tipoDoArquivo, type Arquivos } from "./tipos";

const MIME: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml",
};
const ACEITOS = /\.(html?|css|js|txt|md|json|png|jpe?g|gif|webp|svg)$/i;
const MAX_ARQUIVO = 2 * 1024 * 1024;

export function nomeDeArquivoSeguro(nome: string) {
  return (
    nome
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^\w-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "meu-site"
  );
}

/** Gera e baixa um .zip com os arquivos reais do projeto (imagens como arquivos binários). */
export async function baixarZip(nome: string, arquivos: Arquivos, pastas: string[] = []) {
  const zip = new JSZip();
  for (const pasta of pastas) zip.folder(pasta);
  for (const [caminho, conteudo] of Object.entries(arquivos)) {
    if (conteudo.startsWith("data:")) zip.file(caminho, conteudo.split(",")[1] ?? "", { base64: true });
    else zip.file(caminho, conteudo);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nomeDeArquivoSeguro(nome)}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Lê um .zip e devolve os arquivos (remove a pasta raiz se todos estiverem dentro dela). */
export async function lerZip(arquivo: File): Promise<{ arquivos: Arquivos; ignorados: string[] }> {
  const zip = await JSZip.loadAsync(arquivo);
  const arquivos: Arquivos = {};
  const ignorados: string[] = [];

  const entradas = Object.values(zip.files).filter((f) => !f.dir && !f.name.startsWith("__MACOSX/") && !f.name.split("/").pop()!.startsWith("."));
  for (const entrada of entradas) {
    if (!ACEITOS.test(entrada.name)) {
      ignorados.push(entrada.name);
      continue;
    }
    if (tipoDoArquivo(entrada.name) === "imagem") {
      const b64 = await entrada.async("base64");
      if (b64.length * 0.75 > MAX_ARQUIVO) {
        ignorados.push(entrada.name);
        continue;
      }
      const ext = entrada.name.split(".").pop()!.toLowerCase();
      arquivos[entrada.name] = `data:${MIME[ext]};base64,${b64}`;
    } else {
      arquivos[entrada.name] = await entrada.async("string");
    }
  }

  // Se tudo estiver dentro de uma única pasta (ex.: "meu-site/index.html"), tira essa pasta.
  const caminhos = Object.keys(arquivos);
  const primeira = caminhos[0]?.split("/")[0];
  if (primeira && caminhos.length > 0 && caminhos.every((c) => c.includes("/") && c.split("/")[0] === primeira)) {
    const semRaiz: Arquivos = {};
    for (const c of caminhos) semRaiz[c.slice(primeira.length + 1)] = arquivos[c];
    return { arquivos: semRaiz, ignorados };
  }
  return { arquivos, ignorados };
}

/** Converte uma imagem enviada pelo aluno em data URL. */
export function imagemParaDataUrl(arquivo: File): Promise<string> {
  return new Promise((ok, erro) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result));
    r.onerror = () => erro(r.error);
    r.readAsDataURL(arquivo);
  });
}
