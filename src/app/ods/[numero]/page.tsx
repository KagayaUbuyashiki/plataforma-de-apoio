import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { corDoTexto, getOds, ODS, paletaSugerida } from "@/data/ods";

type Props = { params: Promise<{ numero: string }> };

export function generateStaticParams() {
  return ODS.map((o) => ({ numero: String(o.numero) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ods = getOds(Number((await params).numero));
  return { title: ods ? `ODS ${ods.numero}: ${ods.nome}` : "ODS" };
}

export default async function OdsDetalhe({ params }: Props) {
  const ods = getOds(Number((await params).numero));
  if (!ods) notFound();

  const texto = corDoTexto(ods.cor);
  const paleta = paletaSugerida(ods.cor);
  const anterior = getOds(ods.numero - 1);
  const proximo = getOds(ods.numero + 1);
  const css = `:root {\n${paleta.map((p) => `  --cor-${p.nome}: ${p.cor};`).join("\n")}\n}`;

  return (
    <article className="flex flex-col gap-8">
      <Link href="/ods" className="text-sm font-medium text-marca-700 hover:underline">
        ← Todos os ODS
      </Link>

      <header className="rounded-2xl px-6 py-10 sm:px-10" style={{ backgroundColor: ods.cor, color: texto }}>
        <p className="text-6xl font-black leading-none sm:text-7xl">{ods.numero}</p>
        <h1 className="mt-3 text-3xl font-bold uppercase sm:text-4xl">{ods.nome}</h1>
        <p className="mt-3 max-w-2xl text-lg opacity-90">{ods.lema}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-xl font-bold">O que é?</h2>
          <p className="mt-2 text-slate-700">{ods.resumo}</p>
          <h2 className="mt-6 text-xl font-bold">Por que importa?</h2>
          <p className="mt-2 text-slate-700">{ods.porQueImporta}</p>
          <h2 className="mt-6 text-xl font-bold">📍 Perto de você</h2>
          <p className="mt-2 text-slate-700">{ods.pertoDeVoce}</p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold">🔎 Perguntas para pesquisar</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
            {ods.perguntas.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold">💡 Ideias de seções para o seu site</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {ods.ideias.map((ideia, i) => (
            <li key={ideia} className="rounded-lg p-4" style={{ backgroundColor: paleta[2].cor }}>
              <span className="font-mono text-sm font-bold" style={{ color: paleta[1].cor }}>
                Página {i + 1}
              </span>
              <p className="mt-1 font-medium text-slate-800">{ideia}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold">🎨 Paleta de cores sugerida</h2>
        <p className="mt-1 text-sm text-slate-600">
          Baseada na cor oficial do ODS {ods.numero}. Copie o código para o seu arquivo CSS e use, por exemplo,{" "}
          <code className="rounded bg-slate-100 px-1">color: var(--cor-principal);</code>
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <ul className="grid grid-cols-4 gap-2">
            {paleta.map((p) => (
              <li key={p.nome} className="text-center">
                <div className="aspect-square rounded-lg border border-slate-200" style={{ backgroundColor: p.cor }} />
                <p className="mt-1 text-xs font-semibold">{p.nome}</p>
                <p className="font-mono text-xs text-slate-500">{p.cor}</p>
              </li>
            ))}
          </ul>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
            <code>{css}</code>
          </pre>
        </div>
      </section>

      <nav className="flex justify-between gap-4" aria-label="Navegação entre ODS">
        {anterior ? (
          <Link href={`/ods/${anterior.numero}`} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:border-marca-500">
            ← ODS {anterior.numero}
          </Link>
        ) : (
          <span />
        )}
        {proximo && (
          <Link href={`/ods/${proximo.numero}`} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:border-marca-500">
            ODS {proximo.numero} →
          </Link>
        )}
      </nav>
    </article>
  );
}
