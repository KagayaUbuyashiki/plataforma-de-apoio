import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/Aviso";
import { BotaoRemover } from "@/components/admin/BotaoRemover";
import { botaoSecundario, cartao } from "@/components/admin/estilos";
import { listarSites } from "@/lib/dados";
import { removerSite } from "./actions";
import { FormSite } from "./FormSite";

export const metadata: Metadata = { title: "Gerenciar sites", robots: { index: false } };

type Props = { searchParams: Promise<{ salvo?: string }> };

export default async function AdminSites({ searchParams }: Props) {
  const { salvo } = await searchParams;
  const { dados: sites, erro } = await listarSites();
  const categorias = [...new Set(sites.map((s) => s.categoria).filter((c): c is string => Boolean(c)))];

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Sites de referência</h1>
        <Link href="/sites" className={botaoSecundario}>Ver página pública</Link>
      </div>

      {salvo && <Aviso tipo="sucesso">Site salvo com sucesso!</Aviso>}
      {erro && <Aviso tipo="erro">{erro}</Aviso>}

      <section>
        <h2 className="mb-3 text-xl font-extrabold">Adicionar site</h2>
        <FormSite categorias={categorias} />
      </section>

      <section className={cartao}>
        <h2 className="text-xl font-extrabold">Sites cadastrados ({sites.length})</h2>
        {sites.length === 0 ? (
          <p className="mt-2 text-sm text-tinta-suave">Nenhum site ainda.</p>
        ) : (
          <ul className="mt-4 divide-y divide-white/80">
            {sites.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium">{s.titulo}</p>
                  <p className="truncate text-sm text-tinta-suave">{s.url}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/sites/${s.id}`} className={botaoSecundario}>Editar</Link>
                  <BotaoRemover acao={removerSite} id={s.id} confirmacao={`Remover o site "${s.titulo}"?`} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
