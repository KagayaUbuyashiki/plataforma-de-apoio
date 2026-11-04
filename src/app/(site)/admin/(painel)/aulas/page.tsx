import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/Aviso";
import { BotaoRemover } from "@/components/admin/BotaoRemover";
import { botao, botaoSecundario, cartao } from "@/components/admin/estilos";
import { listarAulas } from "@/lib/dados";
import { formatarData } from "@/lib/formatar";
import { removerAula } from "./actions";

export const metadata: Metadata = { title: "Gerenciar aulas", robots: { index: false } };

export default async function AdminAulas({ searchParams }: { searchParams: Promise<{ salvo?: string }> }) {
  const { salvo } = await searchParams;
  const { dados: aulas, erro } = await listarAulas();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Aulas</h1>
        <Link href="/admin/aulas/nova" className={botao}>+ Nova aula</Link>
      </div>
      {salvo && <Aviso tipo="sucesso">Aula salva com sucesso!</Aviso>}
      {erro && <Aviso tipo="erro">{erro}</Aviso>}

      <section className={cartao}>
        {aulas.length === 0 ? (
          <p className="text-sm text-tinta-suave">Nenhuma aula cadastrada.</p>
        ) : (
          <ul className="divide-y divide-white/80">
            {aulas.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    {a.numero}. {a.titulo}{" "}
                    <span
                      className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        a.publicada ? "bg-emerald-50 text-emerald-700" : "bg-white/70 text-tinta-suave"
                      }`}
                    >
                      {a.publicada ? "publicada" : "rascunho"}
                    </span>
                  </p>
                  <p className="text-sm text-tinta-suave">
                    /aulas/{a.slug}
                    {a.data && <> · {formatarData(a.data)}</>}
                    {a.instrutores.length > 0 && <> · {a.instrutores.map((i) => i.nome).join(", ")}</>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/aulas/${a.slug}`} className={botaoSecundario}>Ver</Link>
                  <Link href={`/admin/aulas/${a.id}`} className={botaoSecundario}>Editar</Link>
                  <BotaoRemover
                    acao={removerAula}
                    id={a.id}
                    confirmacao={`Remover a aula "${a.titulo}"? As avaliações dela também serão apagadas.`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
