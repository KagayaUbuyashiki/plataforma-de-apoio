import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/Aviso";
import { Icone } from "@/components/Icone";
import { Titulo } from "@/components/Titulo";
import { getOds } from "@/data/ods";
import { sair } from "@/app/(site)/entrar/actions";
import { exigirAluno } from "@/lib/auth";
import { ETAPAS_PROJETO } from "@/lib/checklist";
import { Checklist, type ItemChecklist } from "./Checklist";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Minha área", robots: { index: false } };

type Props = { searchParams: Promise<{ bemvindo?: string }> };

export default async function MinhaArea({ searchParams }: Props) {
  const { bemvindo } = await searchParams;
  const { supabase, aluno } = await exigirAluno();

  const [{ data: aulas }, { data: progresso }] = await Promise.all([
    supabase.from("aulas").select("id, numero, titulo").eq("publicada", true).order("numero"),
    supabase.from("progresso_aluno").select("item").eq("aluno_id", aluno.id),
  ]);

  const itens: ItemChecklist[] = [
    ...(aulas ?? []).map((a) => ({ item: `aula:${a.id}`, titulo: `Aula ${a.numero}: ${a.titulo}`, grupo: "aulas" as const })),
    ...ETAPAS_PROJETO.map((e) => ({ item: e.item, titulo: e.titulo, texto: e.texto, grupo: "etapas" as const })),
  ];
  const nome = aluno.como_chamar || aluno.nome.split(" ")[0];
  const ods = aluno.ods_interesse ? getOds(aluno.ods_interesse) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <Titulo selo="Minha área" titulo={`Olá, ${nome}!`} subtitulo="Marque o que você já fez. O seu instrutor acompanha o seu progresso por aqui.">
        <form action={sair}>
          <button type="submit" className="btn-secundario">
            Sair
          </button>
        </form>
      </Titulo>

      {bemvindo && <Aviso tipo="sucesso">Conta pronta! A partir de agora você entra com o seu usuário e a sua senha.</Aviso>}

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Checklist itens={itens} feitos={(progresso ?? []).map((p) => p.item)} />

        <aside data-revelar className="vidro flex flex-col gap-4 self-start rounded-3xl p-6">
          <h2 className="font-extrabold">Minha ficha</h2>
          <dl className="grid gap-2 text-sm">
            <Linha rotulo="Nome" valor={aluno.nome} />
            <Linha rotulo="Escola" valor={aluno.escola} />
            <Linha rotulo="Ano / série" valor={aluno.serie} />
            <Linha rotulo="Cidade" valor={aluno.cidade} />
            {ods && <Linha rotulo="ODS de interesse" valor={`${ods.numero}. ${ods.nome}`} />}
          </dl>
          <Link href="/minha-area/ficha" className="btn-secundario group !py-2">
            Editar minha ficha <Icone nome="seta" tamanho={14} espessura={2.2} className="seta-anda" />
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string | null }) {
  return (
    <div className="flex justify-between gap-3 rounded-xl bg-white/60 px-3 py-2">
      <dt className="font-semibold text-tinta-suave">{rotulo}</dt>
      <dd className="text-right font-bold">{valor || "—"}</dd>
    </div>
  );
}
