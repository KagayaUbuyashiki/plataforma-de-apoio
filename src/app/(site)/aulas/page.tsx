import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/Aviso";
import { Icone, IconeCaixa } from "@/components/Icone";
import { Titulo } from "@/components/Titulo";
import { listarAulas } from "@/lib/dados";
import { formatarData } from "@/lib/formatar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Aulas" };

export default async function Aulas() {
  const { dados, erro } = await listarAulas();
  const aulas = dados.filter((a) => a.publicada);

  return (
    <>
      <Titulo titulo="Aulas" subtitulo="O resumo de cada encontro, com os códigos de exemplo e os materiais para estudar em casa." />

      {erro && <Aviso tipo="erro">Não foi possível carregar as aulas: {erro}</Aviso>}

      {!erro && aulas.length === 0 && (
        <div data-revelar className="vidro rounded-3xl border-dashed px-6 py-16 text-center">
          <IconeCaixa nome="livro" cor="#0ea5c6" tamanho={56} className="mx-auto" />
          <h2 className="mt-4 text-lg font-extrabold">Nenhuma aula publicada ainda</h2>
          <p className="mt-1 font-medium text-tinta-suave">Os resumos aparecem aqui depois de cada encontro.</p>
        </div>
      )}

      <ol className="flex flex-col gap-4">
        {aulas.map((a, i) => (
          <li key={a.id} data-revelar style={{ "--d": Math.min(i, 6) } as React.CSSProperties}>
            <Link
              href={`/aulas/${a.slug}`}
              className="vidro group flex gap-4 rounded-3xl p-5 transition duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1 hover:bg-white/85 sm:items-center sm:p-6"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#0ea5c6,#6366f1)] font-mono text-xl font-bold text-white shadow-[0_10px_20px_-8px_#6366f1] transition duration-500 group-hover:-rotate-6">
                {String(a.numero).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-tinta-suave">
                  Aula {a.numero}
                  {a.data && <> · {formatarData(a.data)}</>}
                  {a.instrutores.length > 0 && <> · {a.instrutores.map((i) => i.nome).join(", ")}</>}
                </p>
                <h2 className="text-lg font-extrabold tracking-tight text-tinta transition group-hover:text-marca-600">{a.titulo}</h2>
                {a.resumo_md && <p className="mt-1 line-clamp-2 text-sm font-medium text-tinta-suave">{a.resumo_md.replace(/[*_`#]/g, "")}</p>}
              </div>
              <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-white/80 text-tinta transition duration-300 group-hover:bg-tinta group-hover:text-white sm:grid">
                <Icone nome="seta" tamanho={16} espessura={2.2} className="seta-anda" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
