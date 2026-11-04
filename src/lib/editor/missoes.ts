import type { Arquivos, Nivel } from "./tipos";
import { tipoDoArquivo } from "./tipos";

export type Contexto = { doc: Document; css: string };
export type Missao = { id: string; texto: string; dica: string; feita: (c: Contexto) => boolean };

const tem = (c: Contexto, seletor: string, min = 1) => c.doc.querySelectorAll(seletor).length >= min;
const textoMudou = (c: Contexto, seletor: string, padrao: RegExp) => {
  const el = c.doc.querySelector(seletor);
  return Boolean(el && el.textContent?.trim() && !padrao.test(el.textContent));
};

const INICIANTE: Missao[] = [
  { id: "i-titulo", texto: "Troque o texto do título principal", dica: "Mude o \"Olá, mundo!\" dentro do <h1> para o nome do seu site.", feita: (c) => textoMudou(c, "h1", /Olá, mundo!|Escreva o título aqui/) },
  { id: "i-paragrafo", texto: "Tenha pelo menos 2 parágrafos", dica: "Use o bloco 📝 Parágrafo.", feita: (c) => tem(c, "p", 2) },
  { id: "i-lista", texto: "Crie uma lista com 3 itens", dica: "Use o bloco 📋 Lista com marcadores.", feita: (c) => tem(c, "ul li, ol li", 3) },
  { id: "i-link", texto: "Adicione um link", dica: "Use o bloco 🔗 Link.", feita: (c) => tem(c, "a[href]") },
  { id: "i-imagem", texto: "Coloque uma imagem com descrição (alt)", dica: "Use o bloco 🖼️ Imagem e escreva o alt.", feita: (c) => [...c.doc.querySelectorAll("img")].some((i) => (i.getAttribute("alt") ?? "").trim().length > 0 && i.getAttribute("alt") !== "Descreva a imagem aqui") },
  { id: "i-fundo", texto: "Mude a cor de fundo", dica: "Use o bloco 🎨 Cor de fundo e troque o código da cor.", feita: (c) => [...c.css.matchAll(/background(?:-color)?\s*:\s*([^;}]+)/gi)].some((m) => m[1].trim().toLowerCase() !== "#f5f5f5") },
];

const INTERMEDIARIO: Missao[] = [
  { id: "m-estrutura", texto: "Use <header>, <main> e <footer>", dica: "Essas tags organizam a página em topo, conteúdo e rodapé.", feita: (c) => tem(c, "header") && tem(c, "main") && tem(c, "footer") },
  { id: "m-titulos", texto: "Tenha um <h1> e pelo menos dois <h2>", dica: "Um título principal e subtítulos para cada seção.", feita: (c) => tem(c, "h1") && tem(c, "h2", 2) },
  { id: "m-menu", texto: "Crie um menu <nav> com 3 links", dica: "Digite nav e depois a dentro dele.", feita: (c) => tem(c, "nav a", 3) },
  { id: "m-lista", texto: "Use uma lista (<ul> ou <ol>)", dica: "Digite ul e escolha a sugestão.", feita: (c) => tem(c, "ul li, ol li", 2) },
  { id: "m-imagem", texto: "Coloque uma imagem com alt", dica: "Digite img e preencha src e alt.", feita: (c) => [...c.doc.querySelectorAll("img")].some((i) => (i.getAttribute("alt") ?? "").trim().length > 0) },
  { id: "m-classe", texto: "Estilize uma classe no CSS", dica: "Coloque class=\"algo\" em uma tag e use .algo { } no CSS.", feita: (c) => /\.[a-zA-Z][\w-]*\s*[{,]/.test(c.css) && tem(c, "[class]") },
  { id: "m-css", texto: "Use pelo menos 5 propriedades CSS diferentes", dica: "Ex.: color, background-color, font-size, padding, border-radius.", feita: (c) => new Set([...c.css.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1])).size >= 5 },
  { id: "m-flex", texto: "Use display: flex em algum lugar", dica: "Ótimo para deixar os links do menu lado a lado.", feita: (c) => /display\s*:\s*flex/.test(c.css) },
];

export const MISSOES: Partial<Record<Nivel, Missao[]>> = { iniciante: INICIANTE, intermediario: INTERMEDIARIO };

/** Monta o contexto de verificação (HTML do index + todo o CSS sem comentários). */
export function contextoDoProjeto(arquivos: Arquivos): Contexto {
  const html = arquivos["index.html"] ?? Object.entries(arquivos).find(([p]) => tipoDoArquivo(p) === "html")?.[1] ?? "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const css = Object.entries(arquivos)
    .filter(([p]) => tipoDoArquivo(p) === "css")
    .map(([, c]) => c)
    .join("\n")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  // Ignora o CSS digitado dentro de <style> também
  const inline = [...doc.querySelectorAll("style")].map((s) => s.textContent ?? "").join("\n");
  return { doc, css: css + "\n" + inline };
}
