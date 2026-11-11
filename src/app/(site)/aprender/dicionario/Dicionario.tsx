"use client";

import { useEffect, useMemo, useState } from "react";
import { Codigo } from "@/components/aprender/Codigo";
import { Resultado } from "@/components/aprender/ExemploAoVivo";
import { Icone } from "@/components/Icone";
import type { TipoVerbete, Verbete } from "@/data/dicionario";

const FILTROS: { valor: TipoVerbete | "todos"; rotulo: string }[] = [
  { valor: "todos", rotulo: "Tudo" },
  { valor: "html", rotulo: "Tags HTML" },
  { valor: "atributo", rotulo: "Atributos" },
  { valor: "css", rotulo: "Propriedades CSS" },
];

const COR_TIPO: Record<TipoVerbete, string> = {
  html: "bg-sky-100 text-sky-800",
  atributo: "bg-violet-100 text-violet-800",
  css: "bg-pink-100 text-pink-800",
};
const NOME_TIPO: Record<TipoVerbete, string> = { html: "HTML", atributo: "Atributo", css: "CSS" };

/** Tira acentos e deixa minúsculo, para a busca achar "titulo" em "Título". */
const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Dicionario({ verbetes }: { verbetes: Verbete[] }) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<TipoVerbete | "todos">("todos");

  // Link direto (/aprender/dicionario#h1): mostra o verbete mesmo se um filtro estiver ativo.
  useEffect(() => {
    const alvo = decodeURIComponent(window.location.hash.slice(1));
    if (alvo) setTimeout(() => document.getElementById(alvo)?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
  }, []);

  const lista = useMemo(() => {
    const q = normalizar(busca.trim().replace(/[<>]/g, ""));
    return verbetes.filter(
      (v) => (filtro === "todos" || v.tipo === filtro) && (!q || normalizar(`${v.nome} ${v.descricao}`).includes(q)),
    );
  }, [busca, filtro, verbetes]);

  return (
    <div className="flex flex-col gap-6">
      <div data-revelar className="vidro sticky top-24 z-20 flex flex-col gap-3 rounded-3xl p-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Buscar no dicionário</span>
          <Icone nome="lupa" tamanho={18} espessura={2.2} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tinta-suave" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Busque: título, imagem, cor, centralizar, link…"
            className="w-full rounded-full border border-white bg-white/85 py-3 pl-11 pr-4 font-semibold text-tinta outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:ring-4 focus:ring-marca-500/20"
          />
        </label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por tipo">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              type="button"
              aria-pressed={filtro === f.valor}
              onClick={() => setFiltro(f.valor)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition duration-300 ${
                filtro === f.valor ? "bg-tinta text-white shadow-[0_8px_18px_-10px_rgb(12_27_42/0.7)]" : "bg-white/70 text-tinta-suave hover:bg-white hover:text-tinta"
              }`}
            >
              {f.rotulo}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm font-semibold text-tinta-suave" aria-live="polite">
        {lista.length} {lista.length === 1 ? "resultado" : "resultados"}
      </p>

      {lista.length === 0 && (
        <div className="vidro rounded-3xl px-6 py-12 text-center">
          <p className="text-lg font-extrabold">Nada encontrado</p>
          <p className="mt-1 font-medium text-tinta-suave">Tente outra palavra, como “cor”, “lista” ou “espaço”.</p>
        </div>
      )}

      <ul className="flex flex-col gap-5">
        {lista.map((v) => (
          <li key={v.id} id={v.id} className="vidro animate-surgir scroll-mt-44 rounded-3xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-mono text-xl font-extrabold text-tinta">{v.nome}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${COR_TIPO[v.tipo]}`}>{NOME_TIPO[v.tipo]}</span>
              <a href={`#${v.id}`} className="ml-auto text-xs font-bold text-tinta-suave transition hover:text-marca-600" aria-label={`Link direto para ${v.nome}`}>
                <Icone nome="link" tamanho={16} espessura={2.1} />
              </a>
            </div>
            <p className="mt-2 max-w-3xl font-medium leading-relaxed text-[#2b3a4a]">{v.descricao}</p>
            <div className="mt-4">
              {v.invisivel ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <Codigo codigo={v.codigoHtml} linguagem="html" compacto />
                  <div className="flex items-start gap-3 rounded-2xl border border-white bg-white/70 p-4 text-sm font-medium text-tinta-suave">
                    <Icone nome="lampada" tamanho={20} espessura={2} className="mt-0.5 shrink-0 text-amber-500" />
                    {v.invisivel}
                  </div>
                </div>
              ) : (
                <ExemploAoVivoComDemo v={v} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Mostra o código do verbete, mas desenha o resultado com o CSS de demonstração. */
function ExemploAoVivoComDemo({ v }: { v: Verbete }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-3">
        <Codigo codigo={v.codigoHtml} linguagem="html" compacto />
        {v.codigoCss && <Codigo codigo={v.codigoCss} linguagem="css" compacto />}
      </div>
      <Resultado html={v.demoHtml ?? v.codigoHtml} css={v.demoCss} altura={v.altura} />
    </div>
  );
}
