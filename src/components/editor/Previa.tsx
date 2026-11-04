"use client";

import { useEffect, useRef, useState } from "react";
import { montarPrevia } from "@/lib/editor/montarPrevia";
import { resolverCaminho } from "@/lib/editor/caminhos";
import { tipoDoArquivo, type Arquivos } from "@/lib/editor/tipos";
import { IconeExterno, IconeRecarregar } from "./icones";

type Props = { arquivos: Arquivos; pagina: string | null; aoNavegar: (pagina: string) => void };

/** Navegador embutido: mostra o site montado a partir dos arquivos, atualizando enquanto o aluno digita. */
export function Previa({ arquivos, pagina, aoNavegar }: Props) {
  const iframe = useRef<HTMLIFrameElement>(null);
  const [doc, setDoc] = useState("");
  const [versao, setVersao] = useState(0);
  const [aviso, setAviso] = useState<string | null>(null);
  const paginas = Object.keys(arquivos).filter((c) => tipoDoArquivo(c) === "html").sort();
  const atual = pagina && arquivos[pagina] != null ? pagina : (paginas.includes("index.html") ? "index.html" : paginas[0] ?? null);

  // Atualiza a prévia 300 ms depois da última tecla
  useEffect(() => {
    const t = setTimeout(() => setDoc(montarPrevia(arquivos, atual ?? "")), 300);
    return () => clearTimeout(t);
  }, [arquivos, atual]);

  // Links entre páginas do projeto (o iframe avisa por mensagem)
  useEffect(() => {
    const ouvir = (e: MessageEvent) => {
      if (e.source !== iframe.current?.contentWindow || !atual) return;
      const href = (e.data as { mpsNavegar?: string })?.mpsNavegar;
      if (typeof href !== "string") return;
      const destino = resolverCaminho(atual, href);
      if (destino && arquivos[destino] != null && tipoDoArquivo(destino) === "html") {
        setAviso(null);
        aoNavegar(destino);
      } else {
        setAviso(`O link aponta para "${href}", mas esse arquivo não existe no projeto.`);
        setTimeout(() => setAviso(null), 4000);
      }
    };
    window.addEventListener("message", ouvir);
    return () => window.removeEventListener("message", ouvir);
  }, [arquivos, atual, aoNavegar]);

  function abrirEmNovaAba() {
    const url = URL.createObjectURL(new Blob([montarPrevia(arquivos, atual ?? "")], { type: "text/html" }));
    window.open(url, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#1e1e1e]">
      <div className="flex h-9 shrink-0 items-center gap-1 border-b border-[#2b2b2b] bg-[#252526] px-2">
        <button type="button" onClick={() => setVersao((v) => v + 1)} title="Recarregar" aria-label="Recarregar a prévia" className="rounded p-1 text-[#c5c5c5] hover:bg-[#3c3c3c]">
          <IconeRecarregar className="h-4 w-4" />
        </button>
        <label className="sr-only" htmlFor="pagina-previa">Página</label>
        <select
          id="pagina-previa"
          value={atual ?? ""}
          onChange={(e) => aoNavegar(e.target.value)}
          className="h-6 min-w-0 flex-1 rounded-sm border border-[#3c3c3c] bg-[#3c3c3c] px-2 font-mono text-xs text-[#cccccc] outline-none focus:border-[#007fd4]"
        >
          {paginas.length === 0 && <option value="">sem páginas</option>}
          {paginas.map((p) => (
            <option key={p} value={p}>meu-site/{p}</option>
          ))}
        </select>
        <button type="button" onClick={abrirEmNovaAba} title="Abrir em nova aba" aria-label="Abrir a prévia em nova aba" className="rounded p-1 text-[#c5c5c5] hover:bg-[#3c3c3c]">
          <IconeExterno className="h-4 w-4" />
        </button>
      </div>
      <div className="relative min-h-0 flex-1 bg-white">
        <iframe
          key={versao}
          ref={iframe}
          title="Prévia do site"
          srcDoc={doc}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-modals"
          className="h-full w-full border-0 bg-white"
        />
        {aviso && (
          <div role="status" className="absolute inset-x-2 top-2 rounded border border-[#be1100] bg-[#5a1d1d] px-3 py-2 text-xs text-white shadow-lg">
            {aviso}
          </div>
        )}
      </div>
    </div>
  );
}
