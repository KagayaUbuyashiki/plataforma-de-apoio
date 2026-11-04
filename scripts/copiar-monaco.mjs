// Copia o editor Monaco (o mesmo do VS Code) para public/monaco/vs,
// para a plataforma funcionar sem depender de CDN (ex.: rede da escola),
// e gera uma tradução em português dos textos mais visíveis do editor.
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import vm from "node:vm";

const VERSAO_TRADUCAO = "pt1";

const require = createRequire(import.meta.url);
const raiz = dirname(require.resolve("monaco-editor/package.json"));
const versao = JSON.parse(readFileSync(join(raiz, "package.json"), "utf8")).version + "+" + VERSAO_TRADUCAO;
const origem = join(raiz, "min", "vs");
const pastaMonaco = join(process.cwd(), "public", "monaco");
const destino = join(pastaMonaco, "vs");
const marca = join(pastaMonaco, "VERSAO");

// O pacote pt-br do Monaco vem vazio; traduzimos o que o aluno mais vê.
const TRADUCOES = {
  "Match Case": "Diferenciar maiúsculas/minúsculas",
  "Match Whole Word": "Palavra inteira",
  "Use Regular Expression": "Usar expressão regular",
  "Preserve Case": "Preservar maiúsculas/minúsculas",
  Close: "Fechar",
  "No results": "Nenhum resultado",
  Undo: "Desfazer",
  Redo: "Refazer",
  "Select All": "Selecionar tudo",
  "Loading...": "Carregando...",
  "Command Palette": "Paleta de comandos",
  "Go to Symbol...": "Ir para símbolo...",
  Cut: "Recortar",
  Copy: "Copiar",
  Paste: "Colar",
  "Copy As": "Copiar como",
  "Paste As...": "Colar como...",
  "Quick Fix...": "Correção rápida...",
  "Refactor...": "Refatorar...",
  "Source Action...": "Ação de código...",
  "Toggle Line Comment": "Comentar/descomentar linha",
  "Toggle Block Comment": "Comentar/descomentar bloco",
  Find: "Localizar",
  Replace: "Substituir",
  "Previous Match": "Resultado anterior",
  "Next Match": "Próximo resultado",
  "Find in Selection": "Localizar na seleção",
  "Replace All": "Substituir tudo",
  "Toggle Replace": "Mostrar/ocultar substituir",
  "{0} of {1}": "{0} de {1}",
  Fold: "Recolher",
  Unfold: "Expandir",
  "Format Document": "Formatar documento",
  "Format Selection": "Formatar seleção",
  Peek: "Espiar",
  "Go to Definition": "Ir para definição",
  "Peek Definition": "Espiar definição",
  "Go to References": "Ir para referências",
  "Change All Occurrences": "Alterar todas as ocorrências",
  "Rename Symbol": "Renomear símbolo",
  Insert: "Inserir",
  "Show Less": "Mostrar menos",
  "Show More": "Mostrar mais",
  "No suggestions.": "Nenhuma sugestão.",
  "Read More": "Ler mais",
};

/** Executa o pacote de mensagens em inglês para obter a lista de textos (na mesma ordem dos índices). */
function lerMensagensIngles() {
  const codigo = readFileSync(join(destino, "nls.messages.js.js"), "utf8");
  const ctx = {};
  ctx.globalThis = ctx;
  ctx.define = (_id, deps, fn) => {
    const fabrica = typeof deps === "function" ? deps : fn;
    const exportado = fabrica({ getDefaultExportFromCjs: (x) => x }, {});
    for (const v of Object.values(exportado ?? {})) if (typeof v === "function") try { v(); } catch {}
  };
  vm.createContext(ctx);
  vm.runInContext(codigo, ctx);
  return ctx._VSCODE_NLS_MESSAGES;
}

if (existsSync(marca) && readFileSync(marca, "utf8") === versao) {
  console.log(`monaco ${versao} já está em public/monaco`);
} else {
  rmSync(pastaMonaco, { recursive: true, force: true });
  cpSync(origem, destino, { recursive: true });

  const ingles = lerMensagensIngles();
  if (Array.isArray(ingles)) {
    const pt = ingles.map((m) => (typeof m === "string" && TRADUCOES[m]) || null);
    // O carregador pede o módulo "vs/nls.messages.pt-br"; entradas null caem no texto original (inglês).
    writeFileSync(
      join(destino, "nls.messages.pt-br.js"),
      `define("vs/nls.messages.pt-br",(function(){"use strict";globalThis._VSCODE_NLS_LANGUAGE="pt-br";globalThis._VSCODE_NLS_MESSAGES=${JSON.stringify(pt)};}));\n`,
    );
    console.log(`tradução pt-br gerada (${pt.filter(Boolean).length} textos)`);
  } else {
    console.warn("não foi possível ler as mensagens do Monaco; o editor ficará em inglês");
  }

  writeFileSync(marca, versao);
  console.log(`monaco ${versao} copiado para public/monaco/vs`);
}
