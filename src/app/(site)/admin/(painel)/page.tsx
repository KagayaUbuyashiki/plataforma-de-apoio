import type { Metadata } from "next";
import Link from "next/link";
import { cartao } from "@/components/admin/estilos";
import { exigirInstrutor } from "@/lib/auth";

export const metadata: Metadata = { title: "Painel do instrutor", robots: { index: false } };

export default async function Painel() {
  const { supabase } = await exigirInstrutor();
  const contar = async (tabela: string) => (await supabase.from(tabela).select("*", { count: "exact", head: true })).count ?? 0;
  const [sites, aulas, turmas, avaliacoes, contatos] = await Promise.all([
    contar("sites"),
    contar("aulas"),
    contar("turmas"),
    contar("avaliacoes_aula"),
    contar("contatos"),
  ]);

  const itens = [
    { href: "/admin/sites", titulo: "Sites", total: sites, texto: "Adicione os sites apresentados em aula (imagem, descrição e link)." },
    { href: "/admin/aulas", titulo: "Aulas", total: aulas, texto: "Escreva o resumo de cada aula, os materiais e os instrutores." },
    { href: "/admin/turmas", titulo: "Turmas", total: turmas, texto: "Crie os códigos que os alunos usam para avaliar." },
    { href: "/admin/contatos", titulo: "Contatos", total: contatos, texto: "Os contatos da equipe que os alunos veem na página Contatos." },
    { href: "/admin/avaliacoes", titulo: "Avaliações", total: avaliacoes, texto: "Veja médias, comentários e exporte em CSV." },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold">Painel do instrutor</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {itens.map((i) => (
          <Link key={i.href} href={i.href} className={`${cartao} transition hover:border-marca-500`}>
            <p className="text-sm font-medium text-slate-500">{i.titulo}</p>
            <p className="mt-1 text-4xl font-bold text-marca-700">{i.total}</p>
            <p className="mt-2 text-sm text-slate-600">{i.texto}</p>
          </Link>
        ))}
      </div>
      <div className={cartao}>
        <h2 className="font-semibold">Dica para o fim da aula</h2>
        <p className="mt-1 text-sm text-slate-600">
          Projete o endereço <code className="rounded bg-slate-100 px-1">/avaliar</code> e o código da turma no quadro. Os alunos
          avaliam em 1 minuto, de forma anônima, pelo celular ou pelo computador.
        </p>
      </div>
    </>
  );
}
