"use client";

import { useOptimistic, useTransition } from "react";
import { Icone } from "@/components/Icone";
import { marcarItem } from "./actions";

export type ItemChecklist = { item: string; titulo: string; texto?: string; grupo: "aulas" | "etapas" };

export function Checklist({ itens, feitos }: { itens: ItemChecklist[]; feitos: string[] }) {
  const [, iniciar] = useTransition();
  const [marcados, alterar] = useOptimistic(new Set(feitos), (atual, { item, feito }: { item: string; feito: boolean }) => {
    const novo = new Set(atual);
    if (feito) novo.add(item);
    else novo.delete(item);
    return novo;
  });

  const total = itens.length;
  const concluidos = itens.filter((i) => marcados.has(i.item)).length;
  const pct = total ? Math.round((concluidos / total) * 100) : 0;

  const alternar = (item: string) => {
    const feito = !marcados.has(item);
    iniciar(async () => {
      alterar({ item, feito });
      await marcarItem(item, feito);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div data-revelar className="vidro rounded-3xl p-6 sm:p-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-tinta-suave">Seu progresso</p>
            <p className="text-4xl font-extrabold tracking-tight">
              <span className="texto-aurora">{pct}%</span>
            </p>
          </div>
          <p className="text-sm font-semibold text-tinta-suave">
            {concluidos} de {total} itens
          </p>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/80" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do checklist">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#0ea5c6,#6366f1,#ec4899)] transition-[width] duration-700 ease-[cubic-bezier(.2,.7,.2,1)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {(["aulas", "etapas"] as const).map((grupo) => {
        const doGrupo = itens.filter((i) => i.grupo === grupo);
        if (doGrupo.length === 0) return null;
        return (
          <section key={grupo} data-revelar className="vidro rounded-3xl p-6 sm:p-7">
            <h2 className="text-xl font-extrabold">{grupo === "aulas" ? "Aulas" : "Etapas do projeto"}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {doGrupo.map((i) => {
                const feito = marcados.has(i.item);
                return (
                  <li key={i.item}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={feito}
                      onClick={() => alternar(i.item)}
                      className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-0.5 ${
                        feito ? "border-emerald-200 bg-emerald-50/80" : "border-white bg-white/60 hover:bg-white"
                      }`}
                    >
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition duration-300 ${
                          feito ? "scale-110 border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-transparent group-hover:border-marca-500"
                        }`}
                      >
                        <Icone nome="check" tamanho={16} espessura={3} />
                      </span>
                      <span className="min-w-0">
                        <span className={`block font-bold transition ${feito ? "text-emerald-900" : "text-tinta"}`}>{i.titulo}</span>
                        {i.texto && <span className="block text-sm font-medium text-tinta-suave">{i.texto}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
