import type { Metadata } from "next";
import { Aviso } from "@/components/Aviso";
import { BotaoRemover } from "@/components/admin/BotaoRemover";
import { botao, botaoSecundario, campo, cartao, rotulo } from "@/components/admin/estilos";
import { exigirInstrutor } from "@/lib/auth";
import type { Instrutor, Turma } from "@/lib/tipos";
import { alternarTurma, criarTurma, removerInstrutor, removerTurma, salvarInstrutor } from "./actions";

export const metadata: Metadata = { title: "Turmas e instrutores", robots: { index: false } };

type Props = { searchParams: Promise<{ ok?: string; erro?: string }> };

export default async function AdminTurmas({ searchParams }: Props) {
  const { ok, erro } = await searchParams;
  const { supabase } = await exigirInstrutor();
  const [{ data: turmas }, { data: instrutores }] = await Promise.all([
    supabase.from("turmas").select("*").order("created_at", { ascending: false }),
    supabase.from("instrutores").select("*").order("nome"),
  ]);

  return (
    <>
      <h1 className="text-3xl font-bold">Turmas e instrutores</h1>
      {ok && <Aviso tipo="sucesso">{ok}</Aviso>}
      {erro && <Aviso tipo="erro">{erro}</Aviso>}

      <section className={`${cartao} flex flex-col gap-4`}>
        <div>
          <h2 className="text-xl font-semibold">Turmas</h2>
          <p className="text-sm text-slate-500">
            Os alunos digitam o <strong>código</strong> para avaliar. Desative a turma quando o programa acabar.
          </p>
        </div>
        <form action={criarTurma} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
          <div>
            <label htmlFor="t-nome" className={rotulo}>Nome *</label>
            <input id="t-nome" name="nome" required placeholder="Turma manhã" className={campo} />
          </div>
          <div>
            <label htmlFor="t-escola" className={rotulo}>Escola</label>
            <input id="t-escola" name="escola" className={campo} />
          </div>
          <div>
            <label htmlFor="t-cidade" className={rotulo}>Cidade</label>
            <input id="t-cidade" name="cidade" placeholder="Cataguases" className={campo} />
          </div>
          <div>
            <label htmlFor="t-codigo" className={rotulo}>Código *</label>
            <input id="t-codigo" name="codigo" required minLength={3} maxLength={40} placeholder="CATA-2026" className={`${campo} font-mono uppercase`} />
          </div>
          <button type="submit" className={botao}>Criar turma</button>
        </form>

        {(turmas as Turma[] | null)?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2 pr-4 font-medium">Turma</th>
                  <th className="py-2 pr-4 font-medium">Código</th>
                  <th className="py-2 pr-4 font-medium">Situação</th>
                  <th className="py-2 font-medium"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(turmas as Turma[]).map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 pr-4">
                      <p className="font-medium">{t.nome}</p>
                      <p className="text-slate-500">{[t.escola, t.cidade].filter(Boolean).join(" · ")}</p>
                    </td>
                    <td className="py-3 pr-4 font-mono text-base font-semibold">{t.codigo}</td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.ativa ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        {t.ativa ? "ativa" : "inativa"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <form action={alternarTurma}>
                          <input type="hidden" name="id" value={t.id} />
                          <input type="hidden" name="ativa" value={String(t.ativa)} />
                          <button type="submit" className={botaoSecundario}>{t.ativa ? "Desativar" : "Ativar"}</button>
                        </form>
                        <BotaoRemover acao={removerTurma} id={t.id} confirmacao={`Remover a turma ${t.nome}? As avaliações dela também serão apagadas.`} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Nenhuma turma ainda.</p>
        )}
      </section>

      <section className={`${cartao} flex flex-col gap-4`}>
        <div>
          <h2 className="text-xl font-semibold">Instrutores</h2>
          <p className="text-sm text-slate-500">
            Os nomes aparecem nas aulas e na avaliação. (A conta de login de cada instrutor é criada no Supabase; veja o README.)
          </p>
        </div>
        <form action={salvarInstrutor} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
          <div>
            <label htmlFor="i-nome" className={rotulo}>Nome *</label>
            <input id="i-nome" name="nome" required className={campo} />
          </div>
          <div>
            <label htmlFor="i-bio" className={rotulo}>Mini bio</label>
            <input id="i-bio" name="bio" placeholder="Ex.: Desenvolvedor(a) e voluntário(a) da Energisa" className={campo} />
          </div>
          <button type="submit" className={botao}>Cadastrar</button>
        </form>

        <ul className="divide-y divide-slate-100">
          {((instrutores as Instrutor[] | null) ?? []).map((i) => (
            <li key={i.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
              <form action={salvarInstrutor} className="grid flex-1 gap-2 sm:grid-cols-[1fr_2fr_auto] sm:items-center">
                <input type="hidden" name="id" value={i.id} />
                <input name="nome" defaultValue={i.nome} required aria-label={`Nome de ${i.nome}`} className={campo} />
                <input name="bio" defaultValue={i.bio ?? ""} aria-label={`Mini bio de ${i.nome}`} className={campo} />
                <button type="submit" className={botaoSecundario}>Salvar</button>
              </form>
              <BotaoRemover acao={removerInstrutor} id={i.id} confirmacao={`Remover ${i.nome}? As avaliações ligadas a este instrutor também serão apagadas.`} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
