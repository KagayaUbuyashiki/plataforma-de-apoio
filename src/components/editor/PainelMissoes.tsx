"use client";

import { useDeferredValue, useMemo } from "react";
import { contextoDoProjeto, MISSOES } from "@/lib/editor/missoes";
import type { Arquivos, Nivel } from "@/lib/editor/tipos";

/** Calcula quais missões já foram cumpridas (usado no painel e na barra de status). */
export function useMissoes(nivel: Nivel, arquivos: Arquivos) {
  const adiado = useDeferredValue(arquivos);
  return useMemo(() => {
    const lista = MISSOES[nivel] ?? [];
    if (lista.length === 0 || typeof DOMParser === "undefined") return { lista: [], feitas: new Set<string>() };
    const ctx = contextoDoProjeto(adiado);
    const feitas = new Set(lista.filter((m) => { try { return m.feita(ctx); } catch { return false; } }).map((m) => m.id));
    return { lista, feitas };
  }, [nivel, adiado]);
}

export function PainelMissoes({ nivel, arquivos }: { nivel: Nivel; arquivos: Arquivos }) {
  const { lista, feitas } = useMissoes(nivel, arquivos);
  const pct = lista.length ? Math.round((feitas.size / lista.length) * 100) : 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-9 shrink-0 items-center px-4 text-[11px] uppercase tracking-wide text-[#bbbbbb]">Missões</div>
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between text-xs text-[#cccccc]">
          <span>{feitas.size} de {lista.length} concluídas</span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded bg-[#3c3c3c]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso das missões">
          <div className="h-full bg-[#89d185] transition-all" style={{ width: `${pct}%` }} />
        </div>
        {lista.length > 0 && feitas.size === lista.length && (
          <p className="mt-3 rounded border border-[#89d185]/40 bg-[#89d185]/10 px-3 py-2 text-xs text-[#d4f7d2]">
            🎉 Parabéns! Você completou todas as missões deste nível.
          </p>
        )}
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {lista.map((m) => {
          const ok = feitas.has(m.id);
          return (
            <li key={m.id} className="flex gap-2 rounded px-2 py-2 hover:bg-[#2a2d2e]">
              <span
                className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-sm border text-[10px] ${ok ? "border-[#89d185] bg-[#89d185] text-[#1e1e1e]" : "border-[#6b6b6b]"}`}
                aria-hidden
              >
                {ok ? "✓" : ""}
              </span>
              <span className="min-w-0">
                <span className={`block text-[13px] ${ok ? "text-[#89d185] line-through decoration-1" : "text-white"}`}>
                  {m.texto}
                  <span className="sr-only">{ok ? " (concluída)" : " (pendente)"}</span>
                </span>
                <span className="block text-[11px] leading-snug text-[#9d9d9d]">{m.dica}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
