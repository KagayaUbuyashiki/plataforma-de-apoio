import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/Aviso";
import { BotaoRemover } from "@/components/admin/BotaoRemover";
import { botaoSecundario, cartao } from "@/components/admin/estilos";
import { formatarTelefone } from "@/lib/contato";
import { listarContatos } from "@/lib/dados";
import { removerContato } from "./actions";
import { FormContato } from "./FormContato";

export const metadata: Metadata = { title: "Gerenciar contatos", robots: { index: false } };

export default async function AdminContatos({ searchParams }: { searchParams: Promise<{ salvo?: string }> }) {
  const { salvo } = await searchParams;
  const { dados: contatos, erro } = await listarContatos();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Contatos</h1>
        <Link href="/contatos" className={botaoSecundario}>Ver página pública</Link>
      </div>

      {salvo && <Aviso tipo="sucesso">Contato salvo com sucesso!</Aviso>}
      {erro && <Aviso tipo="erro">{erro}</Aviso>}

      <section>
        <h2 className="mb-3 text-xl font-semibold">Adicionar contato</h2>
        <FormContato />
      </section>

      <section className={cartao}>
        <h2 className="text-xl font-semibold">Contatos cadastrados ({contatos.length})</h2>
        {contatos.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Nenhum contato ainda.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-200">
            {contatos.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    {c.nome}
                    {c.funcao && <span className="font-normal text-slate-500"> · {c.funcao}</span>}
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    {[c.email, c.telefone && `${formatarTelefone(c.telefone)}${c.whatsapp ? " (WhatsApp)" : ""}`, c.link].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/contatos/${c.id}`} className={botaoSecundario}>Editar</Link>
                  <BotaoRemover acao={removerContato} id={c.id} confirmacao={`Remover o contato "${c.nome}"?`} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
