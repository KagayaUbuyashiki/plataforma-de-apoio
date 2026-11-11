"use client";

import { useEffect, useRef, useState } from "react";
import { Codigo } from "./Codigo";

/** CSS de base dos exemplos: fonte legível e um respiro nas bordas. */
const BASE = `*{box-sizing:border-box}body{margin:0;padding:16px;font-family:Arial,Helvetica,sans-serif;color:#1f2937;background:#fff;font-size:16px;line-height:1.5}img{max-width:100%}`;

/** Monta o documento do exemplo. Sem scripts: o iframe tem sandbox vazio. */
export function documentoExemplo(html: string, css = "") {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${BASE}</style><style>${css}</style></head><body>${html}</body></html>`;
}

/** Resultado ao vivo, num iframe isolado (sandbox sem permissões: nenhum script roda). */
export function Resultado({ html, css = "", altura = 140, titulo = "Resultado" }: { html: string; css?: string; altura?: number; titulo?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  // Só cria o iframe quando ele aparece na tela (a página pode ter dezenas de exemplos).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisivel(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisivel(true);
        io.disconnect();
      }
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-white bg-white shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-slate-100 px-3 py-2 text-xs font-bold text-tinta-suave">
        <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
        {titulo}
      </div>
      {visivel ? (
        <iframe title={titulo} srcDoc={documentoExemplo(html, css)} sandbox="" className="block w-full border-0" style={{ height: altura }} />
      ) : (
        <div style={{ height: altura }} className="animate-pulse bg-slate-50" />
      )}
    </div>
  );
}

/** Código + resultado lado a lado (empilhados no celular). */
export function ExemploAoVivo({
  html,
  css = "",
  mostrar = "ambos",
  altura,
  destacarHtml,
  destacarCss,
  tituloResultado,
}: {
  html: string;
  css?: string;
  mostrar?: "html" | "css" | "ambos";
  altura?: number;
  destacarHtml?: number[];
  destacarCss?: number[];
  tituloResultado?: string;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-3">
        {mostrar !== "css" && <Codigo codigo={html} linguagem="html" destacar={destacarHtml} compacto />}
        {mostrar !== "html" && css && <Codigo codigo={css} linguagem="css" destacar={destacarCss} compacto />}
      </div>
      <Resultado html={html} css={css} altura={altura} titulo={tituloResultado} />
    </div>
  );
}
