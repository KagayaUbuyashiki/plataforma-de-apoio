import type { Monaco } from "@monaco-editor/react";
import type { editor, IDisposable, IRange, Position } from "monaco-editor";
import { ATRIBUTOS, PROPRIEDADES, PROPRIEDADES_POR_NOME, TAGS, TAGS_POR_NOME, ATRIBUTOS_POR_NOME } from "./glossario";

/**
 * Ajuda em português para o editor:
 * - autocompletar de tags, atributos, seletores, propriedades e valores CSS;
 * - explicação ao passar o mouse.
 * Os provedores são registrados uma vez por instância do Monaco e consultam
 * `estado` para saber se estão ligados no nível atual.
 */
export const estadoAjuda = { completar: false, explicar: false };

const TAGS_VAZIAS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

let registrado = false;

function textoAte(model: editor.ITextModel, p: Position) {
  return model.getValueInRange({ startLineNumber: 1, startColumn: 1, endLineNumber: p.lineNumber, endColumn: p.column });
}

function faixaDaPalavra(model: editor.ITextModel, p: Position): IRange {
  const w = model.getWordUntilPosition(p);
  return { startLineNumber: p.lineNumber, endLineNumber: p.lineNumber, startColumn: w.startColumn, endColumn: w.endColumn };
}

function docTag(tag: string) {
  const t = TAGS_POR_NOME.get(tag);
  return t ? { value: `**<${t.tag}>** — ${t.descricao}\n\n\`\`\`html\n${t.exemplo}\n\`\`\`` } : undefined;
}

function docProp(nome: string) {
  const p = PROPRIEDADES_POR_NOME.get(nome);
  return p ? { value: `**${p.nome}** — ${p.descricao}\n\n\`\`\`css\n${p.exemplo}\n\`\`\`` } : undefined;
}

export function registrarAjuda(monaco: Monaco): void {
  if (registrado) return;
  registrado = true;
  const { CompletionItemKind: K, CompletionItemInsertTextRule: R } = monaco.languages;
  const SUGERIR_DE_NOVO = { id: "editor.action.triggerSuggest", title: "Sugerir" };

  // ---------------- HTML: autocompletar ----------------
  monaco.languages.registerCompletionItemProvider("html", {
    triggerCharacters: ["<", " "],
    provideCompletionItems(model: editor.ITextModel, position: Position) {
      if (!estadoAjuda.completar) return { suggestions: [] };
      const antes = textoAte(model, position);
      if (antes.lastIndexOf("<!--") > antes.lastIndexOf("-->")) return { suggestions: [] }; // dentro de comentário
      const abreStyle = antes.lastIndexOf("<style"), fechaStyle = antes.lastIndexOf("</style");
      if (abreStyle > fechaStyle) return { suggestions: [] }; // CSS dentro do HTML: deixa quieto
      const range = faixaDaPalavra(model, position);
      const abre = antes.lastIndexOf("<");
      const fecha = antes.lastIndexOf(">");

      if (abre > fecha) {
        const dentro = antes.slice(abre + 1);
        // Logo após "<": nome da tag
        if (/^[a-zA-Z0-9]*$/.test(dentro)) {
          return {
            suggestions: TAGS.map((t, i) => ({
              label: t.tag,
              kind: K.Snippet,
              detail: t.descricao.split(".")[0],
              documentation: docTag(t.tag),
              insertText: t.trecho,
              insertTextRules: R.InsertAsSnippet,
              sortText: String(i).padStart(3, "0"),
              range,
            })),
          };
        }
        // Dentro da tag: atributos (se não estiver dentro de aspas)
        const aspas = (dentro.match(/"/g) ?? []).length;
        const tag = dentro.match(/^([a-zA-Z0-9]+)\s/)?.[1]?.toLowerCase();
        if (tag && aspas % 2 === 0) {
          return {
            suggestions: ATRIBUTOS.filter((a) => !a.tags || a.tags.includes(tag)).map((a) => ({
              label: a.nome,
              kind: K.Property,
              detail: a.descricao,
              documentation: { value: `**${a.nome}** — ${a.descricao}` },
              insertText: a.nome === "controls" ? "controls" : `${a.nome}="$1"`,
              insertTextRules: R.InsertAsSnippet,
              sortText: a.tags ? "0" + a.nome : "1" + a.nome,
              range,
            })),
          };
        }
        return { suggestions: [] };
      }

      // No meio do texto: digitar "h" já sugere <h1>…<h6> completos
      if (!model.getWordUntilPosition(position).word) return { suggestions: [] };
      return {
        suggestions: TAGS.filter((t) => !["html", "head", "body", "meta", "link", "title"].includes(t.tag)).map((t, i) => ({
          label: `<${t.tag}>`,
          filterText: t.tag,
          kind: K.Snippet,
          detail: t.descricao.split(".")[0],
          documentation: docTag(t.tag),
          insertText: `<${t.trecho}`,
          insertTextRules: R.InsertAsSnippet,
          sortText: String(i).padStart(3, "0"),
          range,
        })),
      };
    },
  });

  // ---------------- CSS: autocompletar ----------------
  monaco.languages.registerCompletionItemProvider("css", {
    triggerCharacters: [":", " ", "\n", "{", ";"],
    provideCompletionItems(model: editor.ITextModel, position: Position) {
      if (!estadoAjuda.completar) return { suggestions: [] };
      const antes = textoAte(model, position).replace(/\/\*[\s\S]*?\*\//g, "");
      if (antes.lastIndexOf("/*") > antes.lastIndexOf("*/")) return { suggestions: [] };
      const range = faixaDaPalavra(model, position);
      const dentroDeRegra = antes.lastIndexOf("{") > antes.lastIndexOf("}");

      if (!dentroDeRegra) {
        // Seletores: as tags mais comuns
        if (!model.getWordUntilPosition(position).word) return { suggestions: [] };
        return {
          suggestions: TAGS.filter((t) => !["html", "head", "meta", "link", "title", "br", "hr"].includes(t.tag)).map((t) => ({
            label: t.tag,
            kind: K.Class,
            detail: `Escolhe todos os <${t.tag}> da página`,
            documentation: docTag(t.tag),
            insertText: `${t.tag} {\n\t$0\n}`,
            insertTextRules: R.InsertAsSnippet,
            range,
          })),
        };
      }

      const trecho = antes.slice(Math.max(antes.lastIndexOf("{"), antes.lastIndexOf(";")) + 1);
      const valor = trecho.match(/([a-z-]+)\s*:\s*[^:]*$/);
      if (valor) {
        // Depois de "propriedade:" → valores sugeridos
        const prop = PROPRIEDADES_POR_NOME.get(valor[1]);
        if (!prop) return { suggestions: [] };
        return {
          suggestions: prop.valores.map((v, i) => ({
            label: v,
            kind: K.Value,
            detail: `Valor para ${prop.nome}`,
            documentation: docProp(prop.nome),
            insertText: v,
            sortText: String(i).padStart(2, "0"),
            range,
          })),
        };
      }
      // Nome da propriedade
      return {
        suggestions: PROPRIEDADES.map((p) => ({
          label: p.nome,
          kind: K.Property,
          detail: p.descricao,
          documentation: docProp(p.nome),
          insertText: `${p.nome}: $0;`,
          insertTextRules: R.InsertAsSnippet,
          command: p.valores.length ? SUGERIR_DE_NOVO : undefined,
          range,
        })),
      };
    },
  });

  // ---------------- Explicação ao passar o mouse ----------------
  monaco.languages.registerHoverProvider("html", {
    provideHover(model: editor.ITextModel, position: Position) {
      if (!estadoAjuda.explicar) return null;
      const w = model.getWordAtPosition(position);
      if (!w) return null;
      const linha = model.getLineContent(position.lineNumber);
      const antes = linha.slice(0, w.startColumn - 1);
      const depois = linha.slice(w.endColumn - 1);
      const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: w.startColumn, endColumn: w.endColumn };
      if (/<\/?$/.test(antes) && TAGS_POR_NOME.has(w.word.toLowerCase())) {
        return { range, contents: [docTag(w.word.toLowerCase())!] };
      }
      const attr = ATRIBUTOS_POR_NOME.get(w.word.toLowerCase());
      if (attr && /^\s*=/.test(depois)) return { range, contents: [{ value: `**${attr.nome}** — ${attr.descricao}` }] };
      return null;
    },
  });

  monaco.languages.registerHoverProvider("css", {
    provideHover(model: editor.ITextModel, position: Position) {
      if (!estadoAjuda.explicar) return null;
      const linha = model.getLineContent(position.lineNumber);
      // Palavras CSS têm hífen (background-color): procura manualmente
      const col = position.column - 1;
      let ini = col, fim = col;
      while (ini > 0 && /[a-z-]/i.test(linha[ini - 1])) ini--;
      while (fim < linha.length && /[a-z-]/i.test(linha[fim])) fim++;
      const palavra = linha.slice(ini, fim).toLowerCase();
      const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: ini + 1, endColumn: fim + 1 };
      if (PROPRIEDADES_POR_NOME.has(palavra) && /^\s*:/.test(linha.slice(fim))) return { range, contents: [docProp(palavra)!] };
      if (TAGS_POR_NOME.has(palavra) && /^[\s,{.:#>]/.test(linha.slice(fim) || " ") && !/:\s*$/.test(linha.slice(0, ini))) {
        return { range, contents: [{ value: `**${palavra}** (seletor) — escolhe todos os <${palavra}> da página.\n\n${TAGS_POR_NOME.get(palavra)!.descricao}` }] };
      }
      return null;
    },
  });
}

/** Liga/desliga o autocompletar nativo (em inglês) do Monaco conforme o nível. */
export function configurarLinguagens(monaco: Monaco, ajudaPortugues: boolean) {
  const ns = monaco as unknown as {
    html?: { htmlDefaults: { modeConfiguration: object; setModeConfiguration(c: object): void } };
    css?: { cssDefaults: { modeConfiguration: object; setModeConfiguration(c: object): void } };
  };
  const nativo = !ajudaPortugues;
  for (const d of [ns.html?.htmlDefaults, ns.css?.cssDefaults]) {
    d?.setModeConfiguration({ ...d.modeConfiguration, completionItems: nativo, hovers: nativo });
  }
  estadoAjuda.completar = ajudaPortugues;
  estadoAjuda.explicar = ajudaPortugues;
}

/** Fecha a tag automaticamente: ao digitar ">" em <p>, coloca </p> depois do cursor. */
export function ativarFechamentoDeTags(ed: editor.IStandaloneCodeEditor): IDisposable {
  return ed.onDidChangeModelContent((e) => {
    if (e.isUndoing || e.isRedoing || e.changes.length !== 1) return;
    const mudanca = e.changes[0];
    if (mudanca.text !== ">") return;
    const model = ed.getModel();
    if (!model || model.getLanguageId() !== "html") return;
    // Colunas do Monaco começam em 1: "col" é a posição do cursor logo depois do ">" digitado.
    const linha = mudanca.range.startLineNumber;
    const col = mudanca.range.startColumn + 1;
    const conteudo = model.getLineContent(linha);
    const antes = conteudo.slice(0, col - 1);
    const m = antes.match(/<([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^<>]*)?>$/);
    if (!m || m[0].endsWith("/>")) return;
    const tag = m[1].toLowerCase();
    if (TAGS_VAZIAS.has(tag)) return;
    if (conteudo.slice(col - 1).startsWith(`</${tag}>`)) return;
    setTimeout(() => {
      ed.executeEdits("fechar-tag", [{ range: { startLineNumber: linha, startColumn: col, endLineNumber: linha, endColumn: col }, text: `</${tag}>` }]);
      ed.setPosition({ lineNumber: linha, column: col }); // cursor fica entre <tag> e </tag>
    }, 0);
  });
}

