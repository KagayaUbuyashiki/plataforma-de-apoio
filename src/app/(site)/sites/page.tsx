import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/Aviso";
import { Icone, IconeCaixa } from "@/components/Icone";
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
    `rounded-full border px-4 py-1.5 text-sm font-bold transition duration-300 ${
      ativo ? "border-tinta bg-tinta text-white shadow-[0_8px_18px_-10px_rgb(12_27_42/0.7)]" : "border-white bg-white/60 text-tinta-suave backdrop-blur hover:-translate-y-0.5 hover:bg-white hover:text-tinta"
    }`;

  return (
    <>
      <Titulo
        titulo="Sites de referência"
        subtitulo="Sites que apresentamos nas aulas para inspirar o seu projeto. Clique em um card para abrir o site em uma nova aba."
      />

      {erro && <Aviso tipo="erro">Não foi possível carregar os sites: {erro}</Aviso>}

      {(categorias.length > 0 || odsUsados.length > 0) && (
        <div data-revelar className="mb-8 flex flex-wrap gap-2" aria-label="Filtros">
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
        <div data-revelar className="vidro rounded-3xl border-dashed px-6 py-16 text-center">
          <IconeCaixa nome="globo" cor="#14b8a6" tamanho={56} className="mx-auto" />
          <h2 className="mt-4 text-lg font-extrabold">Nenhum site ainda</h2>
          <p className="mt-1 font-medium text-tinta-suave">Os sites apresentados nas aulas vão aparecer aqui.</p>
          <Link href="/admin/sites" className="group mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-marca-600">
            Sou instrutor: adicionar um site <Icone nome="seta" tamanho={14} espessura={2.2} className="seta-anda" />
          </Link>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((s, i) => (
            <li key={s.id}>
              <SiteCard site={s} atraso={i % 3} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
