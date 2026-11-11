import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Desafio } from "@/components/aprender/Desafio";
import { Icone } from "@/components/Icone";
import { DESAFIO_POR_SLUG, DESAFIOS, TRILHAS } from "@/data/desafios";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DESAFIOS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = DESAFIO_POR_SLUG.get((await params).slug);
  return { title: d ? `Desafio: ${d.titulo}` : "Desafio" };
}

export default async function PaginaDesafio({ params }: Props) {
  const { slug } = await params;
  const d = DESAFIO_POR_SLUG.get(slug);
  if (!d) notFound();
  const trilha = TRILHAS.find((t) => t.id === d.trilha)!;
  const daTrilha = DESAFIOS.filter((x) => x.trilha === d.trilha);
  const n = daTrilha.findIndex((x) => x.slug === slug) + 1;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/aprender/desafios" className="btn-secundario group self-start !px-4 !py-2">
        <Icone nome="setaVoltar" tamanho={16} espessura={2.2} className="transition group-hover:-translate-x-1" /> Todos os desafios
      </Link>
      <div data-revelar>
        <span className="chip" style={{ color: trilha.cor }}>
          {trilha.titulo} · {n} de {daTrilha.length}
        </span>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">{d.titulo}</h1>
        <p className="mt-3 max-w-3xl text-lg font-medium leading-relaxed text-[#2b3a4a]">{d.enunciado}</p>
      </div>
      <Desafio slug={d.slug} />
    </div>
  );
}
