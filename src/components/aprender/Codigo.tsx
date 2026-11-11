"use client";

import { useState, type ReactNode } from "react";
import { Icone } from "@/components/Icone";

type Token = { texto: string; classe?: string };

// Cores pensadas para o fundo escuro do bloco de código.
const COR = {
  tag: "text-[#7dd3fc]",
  atributo: "text-[#c4b5fd]",
  texto: "text-[#86efac]",
  comentario: "text-[#64748b] italic",
  propriedade: "text-[#7dd3fc]",
  valor: "text-[#fda4af]",
  seletor: "text-[#fde68a]",
  pontuacao: "text-[#94a3b8]",
};

/** Separa um trecho de HTML em partes coloridas (sem interpretar nada: só texto). */
function tokensHtml(codigo: string): Token[] {
  const re = /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z][\w-]*)|(\/?>)|("[^"]*")|([a-zA-Z-:]+)(?==)/g;
  return tokenizar(codigo, re, (m) =>
    m[1] ? COR.comentario : m[2] ? COR.tag : m[3] ? COR.tag : m[4] ? COR.texto : m[5] ? COR.atributo : undefined,
  );
}

/** Separa um trecho de CSS em partes coloridas. */
function tokensCss(codigo: string): Token[] {
  const re = /(\/\*[\s\S]*?\*\/)|([^{}\s][^{}]*?)(?=\s*\{)|([a-z-]+)(?=\s*:)|(:\s*)([^;{}]+)|([{};])/g;
  const saida: Token[] = [];
  let ultimo = 0;
  for (const m of codigo.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > ultimo) saida.push({ texto: codigo.slice(ultimo, i) });
    if (m[1]) saida.push({ texto: m[1], classe: COR.comentario });
    else if (m[2]) saida.push({ texto: m[2], classe: COR.seletor });
    else if (m[3]) saida.push({ texto: m[3], classe: COR.propriedade });
    else if (m[4] !== undefined) {
      saida.push({ texto: m[4], classe: COR.pontuacao });
      saida.push({ texto: m[5], classe: COR.valor });
    } else if (m[6]) saida.push({ texto: m[6], classe: COR.pontuacao });
    ultimo = i + m[0].length;
  }
  if (ultimo < codigo.length) saida.push({ texto: codigo.slice(ultimo) });
  return saida;
}

function tokenizar(codigo: string, re: RegExp, classe: (m: RegExpMatchArray) => string | undefined): Token[] {
  const saida: Token[] = [];
  let ultimo = 0;
  for (const m of codigo.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > ultimo) saida.push({ texto: codigo.slice(ultimo, i) });
    saida.push({ texto: m[0], classe: classe(m) });
    ultimo = i + m[0].length;
  }
  if (ultimo < codigo.length) saida.push({ texto: codigo.slice(ultimo) });
  return saida;
}

export type Linguagem = "html" | "css";

/** Bloco de código com cores, botão de copiar e linhas destacadas (ex.: o erro). */
export function Codigo({
  codigo,
  linguagem,
  destacar = [],
  rotulo,
  compacto = false,
}: {
  codigo: string;
  linguagem: Linguagem;
  destacar?: number[];
  rotulo?: ReactNode;
  compacto?: boolean;
}) {
  const [copiado, setCopiado] = useState(false);
  const tokens = linguagem === "html" ? tokensHtml(codigo) : tokensCss(codigo);

  // Reparte os tokens por linha para poder destacar linhas inteiras.
  const linhas: Token[][] = [[]];
  for (const t of tokens) {
    const partes = t.texto.split("\n");
    partes.forEach((p, i) => {
      if (i > 0) linhas.push([]);
      if (p) linhas[linhas.length - 1].push({ texto: p, classe: t.classe });
    });
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-[#0c1b2a] shadow-lg">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2 text-xs font-bold text-slate-400">
        <span className="font-mono">{rotulo ?? (linguagem === "html" ? "HTML" : "CSS")}</span>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(codigo);
              setCopiado(true);
              setTimeout(() => setCopiado(false), 1600);
            } catch {}
          }}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
          aria-label="Copiar código"
        >
          <Icone nome={copiado ? "check" : "documento"} tamanho={13} espessura={2.2} />
          {copiado ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <pre className={`overflow-x-auto font-mono leading-relaxed text-slate-100 ${compacto ? "p-3 text-[12.5px]" : "p-4 text-[13px]"}`}>
        <code>
          {linhas.map((l, i) => (
            <span
              key={i}
              className={`block min-h-[1.2em] rounded-sm ${destacar.includes(i + 1) ? "-mx-2 bg-red-500/20 px-2 shadow-[inset_3px_0_0_#f87171]" : ""}`}
            >
              {l.map((t, j) => (
                <span key={j} className={t.classe}>
                  {t.texto}
                </span>
              ))}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
