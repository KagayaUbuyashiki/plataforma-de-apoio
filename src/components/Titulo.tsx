type Props = { titulo: string; subtitulo?: React.ReactNode; children?: React.ReactNode };

/** Cabeçalho padrão das páginas. */
export function Titulo({ titulo, subtitulo, children }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{titulo}</h1>
        {subtitulo && <p className="mt-2 max-w-2xl text-slate-600">{subtitulo}</p>}
      </div>
      {children}
    </div>
  );
}
