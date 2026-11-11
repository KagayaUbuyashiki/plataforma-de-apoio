"use client";

import { useEffect, useMemo, useState } from "react";
import { IconeCaixa } from "@/components/Icone";
import { calcularConquistas, type DadosConquistas } from "@/lib/conquistas";

function lerLista(chave: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(chave) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** Faixa de medalhas da Minha área, com aviso animado quando uma medalha nova é ganha. */
export function Conquistas({ dados, usuario }: { dados: Omit<DadosConquistas, "labs">; usuario: string }) {
  // Cada pessoa tem a sua lista de medalhas já comemoradas (o computador da escola pode ser compartilhado).
  const chaveVistas = `mps-conquistas-vistas-${usuario}`;
  const [labs, setLabs] = useState<string[]>([]);
  const [novas, setNovas] = useState<string[]>([]);

  useEffect(() => {
    setLabs(lerLista("mps-labs"));
  }, []);

  const lista = useMemo(() => calcularConquistas({ ...dados, labs }), [dados, labs]);
  const ganhas = lista.filter((c) => c.ganha);
  const idsGanhas = ganhas.map((c) => c.id).join(",");

  // Medalhas que ainda não foram comemoradas neste navegador.
  useEffect(() => {
    const vistas = new Set(lerLista(chaveVistas));
    const recentes = idsGanhas.split(",").filter((id) => id && !vistas.has(id));
    if (recentes.length === 0) return;
    setNovas(recentes);
    try {
      localStorage.setItem(chaveVistas, JSON.stringify([...vistas, ...recentes]));
    } catch {}
    const t = setTimeout(() => setNovas([]), 5000);
    return () => clearTimeout(t);
  }, [idsGanhas, chaveVistas]);

  const primeiraNova = lista.find((c) => c.id === novas[0]);

  return (
    <section data-revelar className="vidro relative rounded-3xl p-6 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="text-xl font-extrabold">Conquistas</h2>
        <p className="text-sm font-bold text-tinta-suave">
          {ganhas.length} de {lista.length}
        </p>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {lista.map((c) => {
          const nova = novas.includes(c.id);
          return (
            <li
              key={c.id}
              title={c.texto}
              className={`relative flex flex-col items-center gap-2 rounded-2xl p-3 text-center transition duration-500 ${
                c.ganha ? "bg-white/85 shadow-sm" : "bg-white/40"
              } ${nova ? "ring-4 ring-amber-300 motion-safe:animate-pulsar" : ""}`}
            >
              <span className={c.ganha ? "" : "opacity-40 grayscale"}>
                <IconeCaixa nome={c.icone} cor={c.ganha ? c.cor : "#94a3b8"} tamanho={44} />
              </span>
              {c.ganha && (
                <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  <span className="absolute -inset-y-4 -left-1/2 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/70 to-transparent motion-safe:animate-[brilho_3s_ease-in-out_infinite]" />
                </span>
              )}
              <span className={`text-xs font-extrabold leading-tight ${c.ganha ? "text-tinta" : "text-tinta-suave"}`}>{c.titulo}</span>
              <span className="text-[11px] font-medium leading-snug text-tinta-suave">{c.texto}</span>
              <span className="sr-only">{c.ganha ? "Conquistada" : "Ainda não conquistada"}</span>
            </li>
          );
        })}
      </ul>

      {primeiraNova && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 animate-surgir items-center gap-3 rounded-full bg-tinta py-2 pl-2 pr-5 text-white shadow-2xl">
          <IconeCaixa nome={primeiraNova.icone} cor={primeiraNova.cor} tamanho={40} className="!rounded-full" />
          <span>
            <span className="block text-xs font-bold text-amber-300">Nova conquista!</span>
            <span className="block text-sm font-extrabold">{primeiraNova.titulo}</span>
          </span>
        </div>
      )}
    </section>
  );
}
