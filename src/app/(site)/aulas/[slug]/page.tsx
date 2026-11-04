import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Aviso } from "@/components/Aviso";
import { Markdown } from "@/components/Markdown";
import { buscarAula } from "@/lib/dados";
import { formatarData } from "@/lib/formatar";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dados } = await buscarAula((await params).slug);
  return { title: dados ? `Aula ${dados.numero}: ${dados.titulo}` : "Aula" };
}

export default async function AulaDetalhe({ params }: Props) {
  const { dados: aula, erro } = await buscarAula((await params).slug);
  if (erro) return <Aviso tipo="erro">Não foi possível carregar a aula: {erro}</Aviso>;
  if (!aula) notFound();

  return (
    <article className="grid gap-8 lg:grid-cols-[1fr_18rem]">
      <div className="min-w-0">
        <Link href="/aulas" className="text-sm font-medium text-marca-700 hover:underline">
          ← Todas as aulas
        </Link>
        <p className="mt-6 font-mono text-sm font-bold text-marca-600">
          Aula {aula.numero}
          {aula.data && <span className="font-sans font-normal text-slate-500"> · {formatarData(aula.data)}</span>}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{aula.titulo}</h1>
        {!aula.publicada && (
          <div className="mt-4">
            <Aviso>Esta aula ainda não está publicada; só instrutores conseguem vê-la.</Aviso>
          </div>
        )}
        {aula.resumo_md && (
          <div className="mt-6 rounded-xl border-l-4 border-marca-500 bg-marca-50 p-5">
            <Markdown>{aula.resumo_md}</Markdown>
          </div>
        )}
        {aula.conteudo_md && (
          <div className="mt-8">
            <Markdown>{aula.conteudo_md}</Markdown>
          </div>
        )}
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <Link
          href={`/avaliar?aula=${aula.id}`}
          className="rounded-xl bg-marca-600 p-5 text-white shadow-sm transition hover:bg-marca-700"
        >
          <span className="text-2xl" aria-hidden>⭐</span>
          <p className="mt-1 font-semibold">Avaliar esta aula</p>
          <p className="text-sm text-marca-100">É anônimo e leva 1 minuto.</p>
        </Link>

        <Link
          href="/editor"
          className="rounded-xl border border-slate-200 bg-[#1e1e1e] p-5 text-white shadow-sm transition hover:border-marca-500"
        >
          <span className="font-mono text-sm text-[#569cd6]" aria-hidden>&lt;/&gt;</span>
          <p className="mt-1 font-semibold">Praticar no editor</p>
          <p className="text-sm text-slate-300">Teste o código da aula e veja o resultado ao vivo.</p>
        </Link>

        {aula.instrutores.length > 0 && (
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Instrutores</h2>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {aula.instrutores.map((i) => (
                <li key={i.id}>{i.nome}</li>
              ))}
            </ul>
          </section>
        )}

        {aula.materiais.length > 0 && (
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Materiais</h2>
            <ul className="mt-2 space-y-2 text-sm">
              {aula.materiais.map((m) => {
                const externo = /^https?:\/\//.test(m.url);
                return (
                  <li key={m.url + m.titulo}>
                    <a
                      href={m.url}
                      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="font-medium text-marca-700 hover:underline"
                    >
                      {m.titulo}
                      {externo && <span aria-hidden> ↗</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </aside>
    </article>
  );
}
