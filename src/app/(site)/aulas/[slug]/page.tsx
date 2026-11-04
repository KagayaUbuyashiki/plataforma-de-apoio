import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Aviso } from "@/components/Aviso";
import { Icone, IconeCaixa } from "@/components/Icone";
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
        <Link href="/aulas" className="btn-secundario group !px-4 !py-2">
          <Icone nome="setaVoltar" tamanho={16} espessura={2.2} className="transition group-hover:-translate-x-1" /> Todas as aulas
        </Link>
        <div data-revelar className="mt-8">
          <span className="chip">
            Aula {aula.numero}
            {aula.data && <span className="font-semibold text-tinta-suave"> · {formatarData(aula.data)}</span>}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">{aula.titulo}</h1>
        </div>
        {!aula.publicada && (
          <div className="mt-4">
            <Aviso>Esta aula ainda não está publicada; só instrutores conseguem vê-la.</Aviso>
          </div>
        )}
        {aula.resumo_md && (
          <div data-revelar style={{ "--d": 1 } as React.CSSProperties} className="vidro mt-8 rounded-3xl !border-l-4 !border-l-marca-500 p-6">
            <Markdown>{aula.resumo_md}</Markdown>
          </div>
        )}
        {aula.conteudo_md && (
          <div data-revelar style={{ "--d": 2 } as React.CSSProperties} className="vidro-forte mt-6 rounded-3xl p-6 sm:p-10">
            <Markdown>{aula.conteudo_md}</Markdown>
          </div>
        )}
      </div>

      <aside data-revelar style={{ "--d": 3 } as React.CSSProperties} className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
        <Link
          href={`/avaliar?aula=${aula.id}`}
          className="group rounded-3xl bg-[linear-gradient(135deg,#0b7a92,#4f46e5)] p-6 text-white shadow-[0_20px_40px_-20px_#4f46e5] transition duration-500 hover:-translate-y-1"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 transition duration-500 group-hover:rotate-12">
            <Icone nome="estrela" tamanho={20} espessura={2} />
          </span>
          <p className="mt-3 font-extrabold">Avaliar esta aula</p>
          <p className="text-sm font-medium text-white/80">É anônimo e leva 1 minuto.</p>
        </Link>

        <Link
          href="/editor"
          className="group rounded-3xl bg-tinta p-6 text-white shadow-[0_20px_40px_-20px_rgb(12_27_42/0.8)] transition duration-500 hover:-translate-y-1"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 font-mono text-sm text-[#7dd3fc]" aria-hidden>&lt;/&gt;</span>
          <p className="mt-3 font-extrabold">Praticar no editor</p>
          <p className="text-sm font-medium text-slate-300">Teste o código da aula e veja o resultado ao vivo.</p>
        </Link>

        {aula.instrutores.length > 0 && (
          <section className="vidro rounded-3xl p-6">
            <h2 className="font-extrabold">Instrutores</h2>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-tinta">
              {aula.instrutores.map((i) => (
                <li key={i.id} className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-marca-100 text-xs font-extrabold text-marca-700" aria-hidden>
                    {i.nome.trim().charAt(0).toUpperCase()}
                  </span>
                  {i.nome}
                </li>
              ))}
            </ul>
          </section>
        )}

        {aula.materiais.length > 0 && (
          <section className="vidro rounded-3xl p-6">
            <h2 className="font-extrabold">Materiais</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {aula.materiais.map((m) => {
                const externo = /^https?:\/\//.test(m.url);
                return (
                  <li key={m.url + m.titulo}>
                    <a
                      href={m.url}
                      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2.5 font-bold text-tinta transition hover:bg-white hover:text-marca-600"
                    >
                      <IconeCaixa nome="documento" cor="#14b8a6" tamanho={28} className="!rounded-lg" />
                      <span className="min-w-0 flex-1">{m.titulo}</span>
                      {externo && <Icone nome="externo" tamanho={14} espessura={2.2} className="shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
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
