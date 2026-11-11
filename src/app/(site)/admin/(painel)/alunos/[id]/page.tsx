import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BotaoRemover } from "@/components/admin/BotaoRemover";
import { cartao } from "@/components/admin/estilos";
import { Icone, IconeCaixa } from "@/components/Icone";
import { ProgressoDesafios } from "@/components/ProgressoDesafios";
import { calcularConquistas } from "@/lib/conquistas";
import { getOds } from "@/data/ods";
import { exigirInstrutor } from "@/lib/auth";
import { ETAPAS_PROJETO, EXPERIENCIAS } from "@/lib/checklist";
import { createAdminClient } from "@/lib/supabase/admin";
import { contasConfiguradas } from "@/lib/supabase/config";
import { excluirAluno } from "../actions";
import { AcoesConta } from "../Formularios";

export const metadata: Metadata = { title: "Aluno", robots: { index: false } };

type Props = { params: Promise<{ id: string }> };

export default async function AdminAluno({ params }: Props) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { supabase } = await exigirInstrutor();
  const { data: aluno } = await supabase.from("alunos").select("*").eq("id", id).maybeSingle();
  if (!aluno) notFound();

  const [{ data: aulas }, { data: progresso }] = await Promise.all([
    supabase.from("aulas").select("id, numero, titulo").eq("publicada", true).order("numero"),
    supabase.from("progresso_aluno").select("item, concluido_em").eq("aluno_id", id),
  ]);
  let usuario = "";
  if (aluno.user_id && contasConfiguradas()) {
    const { data } = await createAdminClient().from("contas_login").select("usuario").eq("user_id", aluno.user_id).maybeSingle();
    usuario = data?.usuario ?? "";
  }
  const feito = new Set((progresso ?? []).map((p) => p.item));
  const itens = [
    ...(aulas ?? []).map((a) => ({ item: `aula:${a.id}`, titulo: `Aula ${a.numero}: ${a.titulo}` })),
    ...ETAPAS_PROJETO.map((e) => ({ item: e.item, titulo: e.titulo })),
  ];
  const ods = aluno.ods_interesse ? getOds(aluno.ods_interesse) : undefined;
  const todosItens = (progresso ?? []).map((p) => p.item);
  // "Curioso(a)" depende do navegador do aluno, então não aparece aqui.
  const medalhas = calcularConquistas({ itens: todosItens, aulasPublicadas: (aulas ?? []).map((a) => a.id), odsInteresse: aluno.ods_interesse }).filter(
    (c) => c.id !== "curioso",
  );
  const exp = EXPERIENCIAS.find((e) => e.valor === aluno.experiencia)?.rotulo;

  return (
    <>
      <Link href="/admin/alunos" className="btn-secundario group self-start !px-4 !py-2">
        <Icone nome="setaVoltar" tamanho={16} espessura={2.2} className="transition group-hover:-translate-x-1" /> Todos os alunos
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{aluno.nome}</h1>
          <p className="text-sm font-semibold text-tinta-suave">
            {aluno.situacao === "ativo" ? `Usuário: ${usuario || "—"}` : "Aguardando entrar com o código"}
          </p>
        </div>
        <BotaoRemover acao={excluirAluno} id={aluno.id} rotulo="Excluir aluno" confirmacao={`Excluir ${aluno.nome}? A conta, a ficha e o checklist serão apagados.`} />
      </div>

      <section className={`${cartao} flex flex-col gap-3`}>
        <h2 className="text-xl font-extrabold">Acesso</h2>
        <AcoesConta id={aluno.id} nome={aluno.nome} temConta={Boolean(aluno.user_id)} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${cartao} flex flex-col gap-3`}>
          <h2 className="text-xl font-extrabold">Ficha</h2>
          {aluno.ficha_em ? (
            <dl className="grid gap-2 text-sm">
              {[
                ["Como quer ser chamado(a)", aluno.como_chamar],
                ["Idade", aluno.idade],
                ["Escola", aluno.escola],
                ["Ano / série", aluno.serie],
                ["Cidade", aluno.cidade],
                ["Experiência", exp],
                ["Já criou site", aluno.ja_criou_site == null ? null : aluno.ja_criou_site ? "Sim" : "Não"],
                ["ODS de interesse", ods ? `${ods.numero}. ${ods.nome}` : null],
                ["O que espera aprender", aluno.expectativa],
              ].map(([r, v]) => (
                <div key={String(r)} className="flex justify-between gap-3 rounded-xl bg-white/60 px-3 py-2">
                  <dt className="font-semibold text-tinta-suave">{r}</dt>
                  <dd className="whitespace-pre-line text-right font-bold">{v == null || v === "" ? "—" : String(v)}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-tinta-suave">A ficha aparece aqui depois do primeiro acesso.</p>
          )}
        </section>

        <section className={`${cartao} flex flex-col gap-3`}>
          <h2 className="text-xl font-extrabold">
            Checklist ({itens.filter((i) => feito.has(i.item)).length} de {itens.length})
          </h2>
          <ul className="flex flex-col gap-2">
            {itens.map((i) => (
              <li key={i.item} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold ${feito.has(i.item) ? "bg-emerald-50 text-emerald-900" : "bg-white/60 text-tinta-suave"}`}>
                <span className={`grid h-6 w-6 place-items-center rounded-full ${feito.has(i.item) ? "bg-emerald-500 text-white" : "border-2 border-slate-300 text-transparent"}`}>
                  <Icone nome="check" tamanho={12} espessura={3} />
                </span>
                {i.titulo}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ProgressoDesafios itens={todosItens} comLinks={false} />

      <section className={`${cartao} flex flex-col gap-3`}>
        <h2 className="text-xl font-extrabold">
          Medalhas ({medalhas.filter((m) => m.ganha).length} de {medalhas.length})
        </h2>
        <ul className="flex flex-wrap gap-3">
          {medalhas.map((m) => (
            <li key={m.id} title={m.texto} className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-bold ${m.ganha ? "bg-white" : "bg-white/40 text-tinta-suave"}`}>
              <span className={m.ganha ? "" : "opacity-40 grayscale"}>
                <IconeCaixa nome={m.icone} cor={m.ganha ? m.cor : "#94a3b8"} tamanho={30} className="!rounded-full" />
              </span>
              {m.titulo}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
