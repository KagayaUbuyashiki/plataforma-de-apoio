import Image from "next/image";
import { corDoTexto, getOds } from "@/data/ods";
import type { Site } from "@/lib/tipos";

/** O card inteiro é um link: clicar em qualquer parte abre o site em uma nova aba. */
export function SiteCard({ site, imagemLocal = false }: { site: Site; imagemLocal?: boolean }) {
  const ods = site.ods_numero ? getOds(site.ods_numero) : undefined;
  let dominio = site.url;
  try {
    dominio = new URL(site.url).hostname.replace(/^www\./, "");
  } catch {}

  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-marca-500 hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {site.imagem_url ? (
          <Image
            src={site.imagem_url}
            alt={`Prévia do site ${site.titulo}`}
            fill
            unoptimized={imagemLocal}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-marca-100 to-marca-500 font-mono text-4xl font-bold text-white">
            &lt;/&gt;
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-2">
          {site.categoria && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">{site.categoria}</span>
          )}
          {ods && (
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: ods.cor, color: corDoTexto(ods.cor) }}
            >
              ODS {ods.numero}
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold text-slate-900 group-hover:text-marca-700">{site.titulo}</h2>
        {site.descricao && <p className="line-clamp-3 text-sm text-slate-600">{site.descricao}</p>}
        <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-marca-700">
          {dominio}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
          <span className="sr-only">(abre em nova aba)</span>
        </span>
      </div>
    </a>
  );
}
