import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icone, IconeCaixa } from "@/components/Icone";
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
      <Link href="/ods" className="btn-secundario group self-start !px-4 !py-2">
        <Icone nome="setaVoltar" tamanho={16} espessura={2.2} className="transition group-hover:-translate-x-1" /> Todos os ODS
      </Link>

      <header
        data-revelar
        className="reflexo relative overflow-hidden rounded-[32px] px-6 py-12 sm:px-12 sm:py-14"
        style={{ backgroundColor: ods.cor, color: texto, boxShadow: `0 30px 60px -30px ${ods.cor}` }}
      >
        <span aria-hidden className="absolute -right-16 -top-20 h-72 w-72 animate-flutuar rounded-full bg-white/20 blur-2xl" />
        <span aria-hidden className="absolute -bottom-24 right-40 h-56 w-56 animate-flutuar rounded-full bg-black/10 blur-2xl [animation-delay:-3s]" />
        <p className="relative text-7xl font-extrabold leading-none tracking-tight sm:text-8xl">{ods.numero}</p>
        <h1 className="relative mt-4 text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">{ods.nome}</h1>
        <p className="relative mt-3 max-w-2xl text-lg font-medium opacity-90">{ods.lema}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section data-revelar style={{ "--d": 1 } as React.CSSProperties} className="vidro rounded-3xl p-7 lg:col-span-2">
          <h2 className="text-xl font-extrabold">O que é?</h2>
          <p className="mt-2 font-medium leading-relaxed text-[#2b3a4a]">{ods.resumo}</p>
          <h2 className="mt-6 text-xl font-extrabold">Por que importa?</h2>
          <p className="mt-2 font-medium leading-relaxed text-[#2b3a4a]">{ods.porQueImporta}</p>
          <h2 className="mt-6 flex items-center gap-2.5 text-xl font-extrabold">
            <IconeCaixa nome="pino" cor={ods.cor} tamanho={32} className="!rounded-xl" /> Perto de você
          </h2>
          <p className="mt-2 font-medium leading-relaxed text-[#2b3a4a]">{ods.pertoDeVoce}</p>
        </section>

        <section data-revelar style={{ "--d": 2 } as React.CSSProperties} className="vidro rounded-3xl p-7">
          <h2 className="flex items-center gap-2.5 text-xl font-extrabold">
            <IconeCaixa nome="lupa" cor="#6366f1" tamanho={32} className="!rounded-xl" /> Perguntas para pesquisar
          </h2>
          <ul className="mt-4 space-y-2.5 font-medium text-[#2b3a4a]">
            {ods.perguntas.map((p) => (
              <li key={p} className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ods.cor }} aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section data-revelar style={{ "--d": 1 } as React.CSSProperties} className="vidro rounded-3xl p-7">
        <h2 className="flex items-center gap-2.5 text-xl font-extrabold">
          <IconeCaixa nome="lampada" cor="#f59e0b" tamanho={32} className="!rounded-xl" /> Ideias de seções para o seu site
        </h2>
        <ol className="mt-5 grid gap-3 md:grid-cols-3">
          {ods.ideias.map((ideia, i) => (
            <li key={ideia} className="rounded-2xl p-5 transition duration-500 hover:-translate-y-1" style={{ backgroundColor: paleta[2].cor }}>
              <span className="font-mono text-sm font-bold" style={{ color: paleta[1].cor }}>
                Página {i + 1}
              </span>
              <p className="mt-1 font-semibold text-slate-800">{ideia}</p>
            </li>
          ))}
        </ol>
      </section>

      <section data-revelar style={{ "--d": 1 } as React.CSSProperties} className="vidro rounded-3xl p-7">
        <h2 className="flex items-center gap-2.5 text-xl font-extrabold">
          <IconeCaixa nome="paleta" cor="#ec4899" tamanho={32} className="!rounded-xl" /> Paleta de cores sugerida
        </h2>
        <p className="mt-2 text-sm font-medium text-tinta-suave">
          Baseada na cor oficial do ODS {ods.numero}. Copie o código para o seu arquivo CSS e use, por exemplo,{" "}
          <code className="rounded-md bg-white/80 px-1.5 py-0.5 font-semibold text-tinta">color: var(--cor-principal);</code>
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <ul className="grid grid-cols-4 gap-2">
            {paleta.map((p) => (
              <li key={p.nome} className="text-center">
                <div className="aspect-square rounded-2xl border border-white shadow-sm transition duration-500 hover:-translate-y-1 hover:scale-105" style={{ backgroundColor: p.cor }} />
                <p className="mt-1.5 text-xs font-bold">{p.nome}</p>
                <p className="font-mono text-xs text-tinta-suave">{p.cor}</p>
              </li>
            ))}
          </ul>
          <pre className="overflow-x-auto rounded-2xl bg-tinta p-5 text-sm text-slate-100 shadow-lg">
            <code>{css}</code>
          </pre>
        </div>
      </section>

      <nav className="flex justify-between gap-4" aria-label="Navegação entre ODS">
        {anterior ? (
          <Link href={`/ods/${anterior.numero}`} className="btn-secundario group">
            <Icone nome="setaVoltar" tamanho={16} espessura={2.2} className="transition group-hover:-translate-x-1" /> ODS {anterior.numero}
          </Link>
        ) : (
          <span />
        )}
        {proximo && (
          <Link href={`/ods/${proximo.numero}`} className="btn-primario group">
            ODS {proximo.numero} <Icone nome="seta" tamanho={16} espessura={2.2} className="seta-anda" />
          </Link>
        )}
      </nav>
    </article>
  );
}
