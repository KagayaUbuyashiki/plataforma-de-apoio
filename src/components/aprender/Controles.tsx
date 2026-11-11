"use client";

/** Controle deslizante com rótulo e valor (acessível por teclado: setas mudam o valor). */
export function Deslizante({
  id,
  rotulo,
  valor,
  min,
  max,
  passo = 1,
  unidade = "px",
  cor = "#0ea5c6",
  aoMudar,
}: {
  id: string;
  rotulo: string;
  valor: number;
  min: number;
  max: number;
  passo?: number;
  unidade?: string;
  cor?: string;
  aoMudar: (v: number) => void;
}) {
  const pct = ((valor - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="font-mono text-sm font-bold text-tinta">
          {rotulo}
        </label>
        <span className="rounded-full bg-white px-2.5 py-0.5 font-mono text-xs font-bold text-tinta-suave tabular-nums">
          {valor}
          {unidade}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={passo}
        value={valor}
        onChange={(e) => aoMudar(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-4 focus-visible:ring-marca-500/30 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-tinta [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-tinta [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition [&::-webkit-slider-thumb]:hover:scale-110"
        style={{ background: `linear-gradient(90deg, ${cor} ${pct}%, rgb(255 255 255 / 0.9) ${pct}%)` }}
      />
    </div>
  );
}

/** Grupo de botões para escolher um valor (funciona como "radio"). */
export function Opcoes<T extends string>({
  rotulo,
  opcoes,
  valor,
  aoMudar,
}: {
  rotulo: string;
  opcoes: readonly T[];
  valor: T;
  aoMudar: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 font-mono text-sm font-bold text-tinta">{rotulo}</legend>
      <div className="flex flex-wrap gap-1.5">
        {opcoes.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={valor === o}
            onClick={() => aoMudar(o)}
            className={`rounded-full px-3 py-1.5 font-mono text-xs font-bold transition duration-300 ${
              valor === o ? "bg-tinta text-white shadow-[0_6px_14px_-8px_rgb(12_27_42/0.8)]" : "bg-white/75 text-tinta-suave hover:bg-white hover:text-tinta"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
