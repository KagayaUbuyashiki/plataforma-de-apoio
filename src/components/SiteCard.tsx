import Image from "next/image";
import { Icone } from "@/components/Icone";
import { corDoTexto, getOds } from "@/data/ods";
import type { Site } from "@/lib/tipos";

/** O card inteiro é um link: clicar em qualquer parte abre o site em uma nova aba. */
export function SiteCard({ site, imagemLocal = false, atraso = 0 }: { site: Site; imagemLocal?: boolean; atraso?: number }) {
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
      data-revelar
      style={{ "--d": atraso } as React.CSSProperties}
      className="vidro group flex h-full flex-col overflow-hidden rounded-3xl transition duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-2 hover:bg-white/85"
    >
      <div className="relative m-2 mb-0 aspect-video overflow-hidden rounded-2xl bg-white/60">
        {site.imagem_url ? (
          <Image
            src={site.imagem_url}
            alt={`Prévia do site ${site.titulo}`}
            fill
            unoptimized={imagemLocal}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#7dd3fc,#6366f1_60%,#ec4899)] font-mono text-4xl font-bold text-white">
            &lt;/&gt;
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap gap-2">
          {site.categoria && (
            <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-bold text-tinta-suave">{site.categoria}</span>
          )}
          {ods && (
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-bold"
              style={{ backgroundColor: ods.cor, color: corDoTexto(ods.cor) }}
            >
              ODS {ods.numero}
            </span>
          )}
        </div>
        <h2 className="text-lg font-extrabold tracking-tight text-tinta transition group-hover:text-marca-600">{site.titulo}</h2>
        {site.descricao && <p className="line-clamp-3 text-sm font-medium leading-relaxed text-tinta-suave">{site.descricao}</p>}
        <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-bold text-marca-600">
          {dominio}
          <Icone nome="externo" tamanho={14} espessura={2.2} className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span className="sr-only">(abre em nova aba)</span>
        </span>
      </div>
    </a>
  );
}
