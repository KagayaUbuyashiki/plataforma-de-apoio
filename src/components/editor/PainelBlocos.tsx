"use client";

import { useState } from "react";
import { BLOCOS, GRUPOS_BLOCOS, type Bloco } from "@/lib/editor/blocos";

type Props = { aoInserir: (bloco: Bloco) => void };

/** Paleta do nível Iniciante: clicar num bloco insere o código explicado no arquivo certo. */
export function PainelBlocos({ aoInserir }: Props) {
  const [selecionado, setSelecionado] = useState<Bloco | null>(null);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-9 shrink-0 items-center px-4 text-[11px] uppercase tracking-wide text-[#bbbbbb]">Blocos</div>
      <p className="px-4 pb-2 text-xs leading-relaxed text-[#9d9d9d]">
        Coloque o cursor onde quer o bloco e clique nele. Os blocos de <strong className="text-[#cccccc]">Estilo</strong> vão para o{" "}
        <code className="text-[#d7ba7d]">style.css</code>.
      </p>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {GRUPOS_BLOCOS.map((grupo) => (
          <section key={grupo} className="mb-3">
            <h3 className="px-2 pb-1 text-[11px] font-bold uppercase text-[#cccccc]">{grupo}</h3>
            <ul className="flex flex-col gap-1">
              {BLOCOS.filter((b) => b.grupo === grupo).map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelecionado(b);
                      aoInserir(b);
                    }}
                    title={b.descricao}
                    className={`flex w-full items-start gap-2 rounded border px-2 py-1.5 text-left transition ${
                      selecionado?.id === b.id ? "border-[#007fd4] bg-[#04395e]" : "border-[#3c3c3c] bg-[#2d2d2d] hover:border-[#007fd4] hover:bg-[#2a2d2e]"
                    } ${b.arquivo === "style.css" ? "border-l-4 border-l-[#42a5f5]" : "border-l-4 border-l-[#e44d26]"}`}
                  >
                    <span className="text-base leading-5" aria-hidden>{b.icone}</span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium text-white">{b.nome}</span>
                      <span className="block text-[11px] leading-snug text-[#9d9d9d]">{b.descricao}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {selecionado && (
        <section className="max-h-[45%] shrink-0 overflow-y-auto border-t border-[#3c3c3c] bg-[#1e1e1e] px-4 py-3" aria-live="polite">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[13px] font-semibold text-white">
              {selecionado.icone} O que cada parte faz
            </h3>
            <button type="button" onClick={() => setSelecionado(null)} className="text-xs text-[#9d9d9d] hover:text-white" aria-label="Fechar explicação">✕</button>
          </div>
          <p className="mt-1 text-[11px] text-[#9d9d9d]">
            Inserido em <code className="text-[#d7ba7d]">{selecionado.arquivo}</code>. Use Ctrl+Z para desfazer.
          </p>
          <dl className="mt-2 flex flex-col gap-2">
            {selecionado.partes.map((p) => (
              <div key={p.codigo}>
                <dt><code className="rounded bg-[#2d2d2d] px-1.5 py-0.5 font-mono text-xs text-[#9cdcfe]">{p.codigo}</code></dt>
                <dd className="mt-0.5 text-xs leading-relaxed text-[#cccccc]">{p.explicacao}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}
