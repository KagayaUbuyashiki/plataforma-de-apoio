"use client";

import { useEffect, useMemo, useState } from "react";
import { Codigo } from "@/components/aprender/Codigo";
import { Resultado } from "@/components/aprender/ExemploAoVivo";
import { Icone } from "@/components/Icone";
import type { ErroComum, Exemplo } from "@/data/erros";

const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function ListaErros({ erros }: { erros: ErroComum[] }) {
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<string | null>(null);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (erros.some((e) => e.id === id)) {
      setAberto(id);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  }, [erros]);

  const lista = useMemo(() => {
    const q = normalizar(busca.trim());
    if (!q) return erros;
    return erros.filter((e) => q.split(/\s+/).every((p) => normalizar(`${e.titulo} ${e.sintoma} ${e.palavras}`).includes(p)));
  }, [busca, erros]);

  return (
    <div className="flex flex-col gap-5">
      <label data-revelar className="vidro relative block rounded-full p-1.5">
        <span className="sr-only">O que está acontecendo com o seu site?</span>
        <Icone nome="lupa" tamanho={18} espessura={2.2} className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-tinta-suave" />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="O que está acontecendo? Ex.: imagem não aparece, acento estranho…"
          className="w-full rounded-full border border-white bg-white/85 py-3 pl-12 pr-4 font-semibold outline-none placeholder:font-medium placeholder:text-slate-400 focus:ring-4 focus:ring-marca-500/20"
        />
      </label>

      {lista.length === 0 && (
        <div className="vidro rounded-3xl px-6 py-10 text-center">
          <p className="font-extrabold">Não achamos esse problema aqui.</p>
          <p className="mt-1 text-sm font-medium text-tinta-suave">Tente outras palavras ou chame um instrutor: é para isso que estamos aqui!</p>
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {lista.map((e, i) => {
          const estaAberto = aberto === e.id;
          return (
            <li key={e.id} id={e.id} data-revelar style={{ "--d": Math.min(i, 5) } as React.CSSProperties} className="vidro scroll-mt-28 overflow-hidden rounded-3xl">
              <button
                type="button"
                aria-expanded={estaAberto}
                aria-controls={`erro-${e.id}`}
                onClick={() => setAberto(estaAberto ? null : e.id)}
                className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-white/50 sm:p-6"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-100 text-lg font-extrabold text-red-600" aria-hidden>
                  !
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-extrabold">{e.titulo}</span>
                  <span className="block text-sm font-medium text-tinta-suave">{e.sintoma}</span>
                </span>
                <Icone nome="seta" tamanho={18} espessura={2.2} className={`shrink-0 transition-transform duration-300 ${estaAberto ? "rotate-90" : ""}`} />
              </button>

              {/* Abre com animação de altura (grid-rows 0fr → 1fr). */}
              <div id={`erro-${e.id}`} className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${estaAberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="min-h-0 overflow-hidden">
                  {estaAberto && (
                    <div className="flex flex-col gap-5 border-t border-white/80 p-5 sm:p-6">
                      <div className="grid gap-3 md:grid-cols-2">
                        <Bloco titulo="Por que acontece" icone="lampada" cor="text-amber-500">
                          {e.porque}
                        </Bloco>
                        <Bloco titulo="Como consertar" icone="check" cor="text-emerald-500">
                          {e.comoConsertar}
                        </Bloco>
                      </div>
                      <AntesDepois rotulo="Antes (com o erro)" ex={e.antes} tipo="antes" />
                      <AntesDepois rotulo="Depois (consertado)" ex={e.depois} tipo="depois" />
                      {e.observacao && (
                        <p className="flex items-start gap-2 text-sm font-medium text-tinta-suave">
                          <Icone nome="lampada" tamanho={16} espessura={2} className="mt-0.5 shrink-0" /> {e.observacao}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Bloco({ titulo, icone, cor, children }: { titulo: string; icone: "lampada" | "check"; cor: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white bg-white/70 p-4">
      <p className={`flex items-center gap-2 font-extrabold text-tinta`}>
        <Icone nome={icone} tamanho={18} espessura={2.2} className={cor} /> {titulo}
      </p>
      <p className="mt-1.5 text-sm font-medium leading-relaxed text-[#2b3a4a]">{children}</p>
    </div>
  );
}

function AntesDepois({ rotulo, ex, tipo }: { rotulo: string; ex: Exemplo; tipo: "antes" | "depois" }) {
  return (
    <div>
      <p className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${tipo === "antes" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
        {tipo === "antes" ? "✗" : "✓"} {rotulo}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-3">
          <Codigo codigo={ex.html} linguagem="html" destacar={tipo === "antes" ? ex.destacarHtml : []} compacto />
          {ex.css && <Codigo codigo={ex.css} linguagem="css" destacar={tipo === "antes" ? ex.destacarCss : []} compacto />}
        </div>
        <Resultado html={ex.html} css={ex.css} altura={130} titulo={tipo === "antes" ? "Resultado com o erro" : "Resultado consertado"} />
      </div>
    </div>
  );
}
