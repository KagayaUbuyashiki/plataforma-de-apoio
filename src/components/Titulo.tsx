type Props = { titulo: string; subtitulo?: React.ReactNode; selo?: React.ReactNode; children?: React.ReactNode };

/** Cabeçalho padrão das páginas. */
export function Titulo({ titulo, subtitulo, selo, children }: Props) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div data-revelar>
        {selo && <span className="chip mb-4">{selo}</span>}
        <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-tinta sm:text-5xl">{titulo}</h1>
        {subtitulo && <p className="mt-3 max-w-2xl text-lg font-medium leading-relaxed text-tinta-suave">{subtitulo}</p>}
      </div>
      {children && (
        <div data-revelar style={{ "--d": 2 } as React.CSSProperties}>
          {children}
        </div>
      )}
    </div>
  );
}
