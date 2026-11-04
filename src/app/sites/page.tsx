import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/Aviso";
import { SiteCard } from "@/components/SiteCard";
import { Titulo } from "@/components/Titulo";
import { getOds } from "@/data/ods";
import { listarSites } from "@/lib/dados";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sites de referência" };

type Props = { searchParams: Promise<{ categoria?: string; ods?: string }> };

export default async function Sites({ searchParams }: Props) {
  const { categoria, ods } = await searchParams;
  const { dados: sites, erro } = await listarSites();

  const categorias = [...new Set(sites.map((s) => s.categoria).filter((c): c is string => Boolean(c)))].sort();
  const odsUsados = [...new Set(sites.map((s) => s.ods_numero).filter((n): n is number => n != null))].sort((a, b) => a - b);

  const filtrados = sites.filter(
    (s) => (!categoria || s.categoria === categoria) && (!ods || String(s.ods_numero) === ods),
  );

  const filtro = (ativo: boolean) =>
    `rounded-full border px-3 py-1 text-sm font-medium transition ${
      ativo ? "border-marca-600 bg-marca-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-marca-500"
    }`;

  return (
    <>
      <Titulo
        titulo="Sites de referência"
        subtitulo="Sites que apresentamos nas aulas para inspirar o seu projeto. Clique em um card para abrir o site em uma nova aba."
      />

      {erro && <Aviso tipo="erro">Não foi possível carregar os sites: {erro}</Aviso>}

      {(categorias.length > 0 || odsUsados.length > 0) && (
        <div className="mb-6 flex flex-wrap gap-2" aria-label="Filtros">
          <Link href="/sites" className={filtro(!categoria && !ods)}>
            Todos
          </Link>
          {categorias.map((c) => (
            <Link key={c} href={`/sites?categoria=${encodeURIComponent(c)}`} className={filtro(categoria === c)}>
              {c}
            </Link>
          ))}
          {odsUsados.map((n) => (
            <Link key={n} href={`/sites?ods=${n}`} className={filtro(ods === String(n))} title={getOds(n)?.nome}>
              ODS {n}
            </Link>
          ))}
        </div>
      )}

      {!erro && filtrados.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="text-4xl" aria-hidden>🌐</p>
          <h2 className="mt-3 text-lg font-semibold">Nenhum site ainda</h2>
          <p className="mt-1 text-slate-600">Os sites apresentados nas aulas vão aparecer aqui.</p>
          <Link href="/admin/sites" className="mt-4 inline-block text-sm font-semibold text-marca-700 hover:underline">
            Sou instrutor: adicionar um site →
          </Link>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((s) => (
            <li key={s.id}>
              <SiteCard site={s} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
