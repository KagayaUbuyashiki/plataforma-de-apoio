import Link from "next/link";
import { Icone } from "@/components/Icone";
import { RESUMO_DESAFIOS, TRILHAS } from "@/data/desafios";

/** Progresso nas trilhas de desafios (Minha área e visão do instrutor). */
export function ProgressoDesafios({ itens, comLinks = true }: { itens: string[]; comLinks?: boolean }) {
  const feitos = new Set(itens);
  return (
    <section data-revelar className="vidro flex flex-col gap-4 rounded-3xl p-6 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="text-xl font-extrabold">Desafios</h2>
        {comLinks && (
          <Link href="/aprender/desafios" className="group flex items-center gap-1 text-sm font-bold text-marca-600">
            Ver os desafios <Icone nome="seta" tamanho={14} espessura={2.2} className="seta-anda" />
          </Link>
        )}
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {TRILHAS.map((t) => {
          const lista = RESUMO_DESAFIOS.filter((d) => d.trilha === t.id);
          const n = lista.filter((d) => feitos.has(`desafio:${d.slug}`)).length;
          return (
            <li key={t.id} className="rounded-2xl bg-white/70 p-4">
              <p className="text-sm font-extrabold">{t.titulo}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full" style={{ width: `${(n / lista.length) * 100}%`, background: t.cor }} />
                </div>
                <span className="text-xs font-bold tabular-nums text-tinta-suave">
                  {n}/{lista.length}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
