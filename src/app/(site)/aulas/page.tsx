import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/Aviso";
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
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="text-4xl" aria-hidden>📚</p>
          <h2 className="mt-3 text-lg font-semibold">Nenhuma aula publicada ainda</h2>
          <p className="mt-1 text-slate-600">Os resumos aparecem aqui depois de cada encontro.</p>
        </div>
      )}

      <ol className="flex flex-col gap-4">
        {aulas.map((a) => (
          <li key={a.id}>
            <Link
              href={`/aulas/${a.slug}`}
              className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-marca-500 hover:shadow-md sm:items-center"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-marca-50 font-mono text-xl font-bold text-marca-700">
                {String(a.numero).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-slate-500">
                  Aula {a.numero}
                  {a.data && <> · {formatarData(a.data)}</>}
                  {a.instrutores.length > 0 && <> · {a.instrutores.map((i) => i.nome).join(", ")}</>}
                </p>
                <h2 className="text-lg font-semibold text-slate-900 group-hover:text-marca-700">{a.titulo}</h2>
                {a.resumo_md && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{a.resumo_md.replace(/[*_`#]/g, "")}</p>}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
