"use client";

import Editor, { loader, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useEffect, useRef } from "react";
import { ativarFechamentoDeTags, configurarLinguagens, registrarAjuda } from "@/lib/editor/ajudaMonaco";
import type { ConfigNivel } from "@/lib/editor/niveis";
import { linguagemMonaco } from "@/lib/editor/tipos";

// Monaco servido pela própria plataforma (sem CDN) e com menus em português.
loader.config({ paths: { vs: "/monaco/vs" }, "vs/nls": { availableLanguages: { "*": "pt-br" } } });

type Props = {
  caminho: string;
  conteudo: string;
  nivel: ConfigNivel;
  aoMudar: (caminho: string, valor: string) => void;
  aoMoverCursor: (linha: number, coluna: number) => void;
  aoMontar: (ed: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
};

export function EditorCodigo({ caminho, conteudo, nivel, aoMudar, aoMoverCursor, aoMontar }: Props) {
  const descartar = useRef<(() => void)[]>([]);

  useEffect(() => () => descartar.current.forEach((d) => d()), []);

  return (
    <Editor
      path={caminho}
      defaultValue={conteudo}
      language={linguagemMonaco(caminho)}
      theme="vs-dark"
      loading={<div className="grid h-full place-items-center text-sm text-[#8a8a8a]">Carregando o editor…</div>}
      onChange={(v) => aoMudar(caminho, v ?? "")}
      onMount={(ed, monaco) => {
        registrarAjuda(monaco);
        configurarLinguagens(monaco, nivel.ajudaPortugues);
        const fechar = ativarFechamentoDeTags(ed);
        descartar.current.push(() => fechar.dispose());
        ed.onDidChangeCursorPosition((e) => aoMoverCursor(e.position.lineNumber, e.position.column));
        if (nivel.emmet) {
          import("emmet-monaco-es").then(({ emmetHTML, emmetCSS }) => {
            // "standard" usa a API pública de tokens (o modo padrão quebra no Monaco 0.55)
            const a = emmetHTML(monaco, ["html"], { tokenizer: "standard" });
            const b = emmetCSS(monaco, ["css"], { tokenizer: "standard" });
            descartar.current.push(a, b);
          });
        }
        aoMontar(ed, monaco);
        ed.focus();
      }}
      options={{
        fontSize: 14,
        fontFamily: "Consolas, 'Courier New', ui-monospace, monospace",
        tabSize: 2,
        insertSpaces: true,
        wordWrap: "on",
        automaticLayout: true,
        // Minimapa só em telas largas (no celular ele rouba espaço do código)
        minimap: { enabled: typeof window !== "undefined" && window.innerWidth >= 900, renderCharacters: false },
        scrollBeyondLastLine: false,
        padding: { top: 8 },
        smoothScrolling: true,
        cursorBlinking: "smooth",
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true, indentation: true },
        quickSuggestions: { other: true, comments: false, strings: false },
        suggestOnTriggerCharacters: true,
        tabCompletion: nivel.emmet ? "on" : "off",
        snippetSuggestions: "top",
        suggest: { showStatusBar: true, preview: true },
        fixedOverflowWidgets: true,
        linkedEditing: true,
        renderWhitespace: "none",
      }}
    />
  );
}
