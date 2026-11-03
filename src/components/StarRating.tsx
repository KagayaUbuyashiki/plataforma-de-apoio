"use client";

import { useState } from "react";

type Props = { nome: string; rotulo: string; descricao?: string };

const LEGENDAS = ["", "Muito ruim", "Ruim", "Regular", "Boa", "Excelente"];

/** Estrelas de 1 a 5 feitas com radio buttons (funciona com teclado e leitores de tela). */
export function StarRating({ nome, rotulo, descricao }: Props) {
  const [valor, setValor] = useState(0);
  const [hover, setHover] = useState(0);
  const mostrado = hover || valor;

  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="font-medium text-slate-800">{rotulo}</legend>
      {descricao && <p className="text-sm text-slate-500">{descricao}</p>}
      <div className="mt-1 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
            <input
              type="radio"
              name={nome}
              value={n}
              required
              className="peer sr-only"
              checked={valor === n}
              onChange={() => setValor(n)}
            />
            <span className="sr-only">
              {n} de 5 — {LEGENDAS[n]}
            </span>
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              aria-hidden
              className={`rounded transition peer-focus-visible:ring-2 peer-focus-visible:ring-marca-500 ${
                n <= mostrado ? "fill-amber-400 text-amber-500" : "fill-slate-200 text-slate-300"
              }`}
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
            </svg>
          </label>
        ))}
        <span className="ml-2 min-w-24 text-sm text-slate-600" aria-hidden>
          {mostrado ? LEGENDAS[mostrado] : ""}
        </span>
      </div>
    </fieldset>
  );
}
