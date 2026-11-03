import type { Metadata } from "next";
import { Aviso } from "@/components/Aviso";
import { botao, botaoSecundario, campo, cartao } from "@/components/admin/estilos";
import { exigirInstrutor } from "@/lib/auth";
import { formatarMedia } from "@/lib/formatar";
import { montarRelatorio } from "@/lib/relatorio";

export const metadata: Metadata = { title: "Avaliações", robots: { index: false } };

type Props = { searchParams: Promise<{ turma?: string }> };

function Nota({ v }: { v: number | null }) {
  const cor = v == null ? "text-slate-400" : v >= 4 ? "text-emerald-700" : v >= 3 ? "text-amber-700" : "text-red-700";
  return <span className={`font-semibold tabular-nums ${cor}`}>{formatarMedia(v)}</span>;
}

export default async function AdminAvaliacoes({ searchParams }: Props) {
  const { turma } = await searchParams;
  const { supabase } = await exigirInstrutor();
  const r = await montarRelatorio(supabase, turma || undefined);

  const nomeAula = new Map(r.aulas.map((a) => [a.id, `Aula ${a.numero}: ${a.titulo}`]));
  const nomeTurma = new Map(r.turmas.map((t) => [t.id, t.nome]));
  const nomeInstrutor = new Map(r.instrutores.map((i) => [i.id, i.nome]));
  const dataHora = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });

  const comentarios = r.avaliacoes.flatMap((a) => [
    ...(a.comentario ? [{ id: a.id, alvo: "Aula", texto: a.comentario, nota: a.nota_geral, a }] : []),
    ...a.avaliacoes_instrutor
      .filter((i) => i.comentario)
      .map((i) => ({ id: i.id, alvo: nomeInstrutor.get(i.instrutor_id) ?? "Instrutor", texto: i.comentario!, nota: null, a })),
  ]);

  const csv = `/admin/avaliacoes/csv${turma ? `?turma=${turma}` : ""}`;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold">Avaliações</h1>
        <div className="flex flex-wrap items-end gap-2">
          <form className="flex gap-2">
            <label htmlFor="turma" className="sr-only">Filtrar por turma</label>
            <select id="turma" name="turma" defaultValue={turma ?? ""} className={campo}>
              <option value="">Todas as turmas</option>
              {r.turmas.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
            <button type="submit" className={botaoSecundario}>Filtrar</button>
          </form>
          <a href={csv} className={botao}>Exportar CSV</a>
        </div>
      </div>

      {r.erro && <Aviso tipo="erro">{r.erro}</Aviso>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={cartao}>
          <p className="text-sm text-slate-500">Avaliações recebidas</p>
          <p className="mt-1 text-4xl font-bold text-marca-700">{r.avaliacoes.length}</p>
        </div>
        <div className={cartao}>
          <p className="text-sm text-slate-500">Nota geral média</p>
          <p className="mt-1 text-4xl font-bold"><Nota v={r.mediaGeral} /></p>
        </div>
        <div className={cartao}>
          <p className="text-sm text-slate-500">Comentários</p>
          <p className="mt-1 text-4xl font-bold text-marca-700">{comentarios.length}</p>
        </div>
      </div>

      <section className={`${cartao} overflow-x-auto`}>
        <h2 className="text-xl font-semibold">Por aula</h2>
        <table className="mt-3 w-full min-w-[32rem] text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-2 pr-4 font-medium">Aula</th>
              <th className="py-2 pr-4 text-right font-medium">Respostas</th>
              <th className="py-2 pr-4 text-right font-medium">Geral</th>
              <th className="py-2 pr-4 text-right font-medium">Conteúdo</th>
              <th className="py-2 text-right font-medium">Ritmo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {r.porAula.map((l) => (
              <tr key={l.aula.id}>
                <td className="py-2 pr-4">{l.aula.numero}. {l.aula.titulo}</td>
                <td className="py-2 pr-4 text-right tabular-nums">{l.total}</td>
                <td className="py-2 pr-4 text-right"><Nota v={l.geral} /></td>
                <td className="py-2 pr-4 text-right"><Nota v={l.conteudo} /></td>
                <td className="py-2 text-right"><Nota v={l.ritmo} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={`${cartao} overflow-x-auto`}>
        <h2 className="text-xl font-semibold">Por instrutor</h2>
        <table className="mt-3 w-full min-w-[32rem] text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-2 pr-4 font-medium">Instrutor</th>
              <th className="py-2 pr-4 text-right font-medium">Respostas</th>
              <th className="py-2 pr-4 text-right font-medium">Clareza</th>
              <th className="py-2 pr-4 text-right font-medium">Domínio</th>
              <th className="py-2 text-right font-medium">Atenção</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {r.porInstrutor.map((l) => (
              <tr key={l.instrutor.id}>
                <td className="py-2 pr-4">{l.instrutor.nome}</td>
                <td className="py-2 pr-4 text-right tabular-nums">{l.total}</td>
                <td className="py-2 pr-4 text-right"><Nota v={l.clareza} /></td>
                <td className="py-2 pr-4 text-right"><Nota v={l.dominio} /></td>
                <td className="py-2 text-right"><Nota v={l.atencao} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-slate-500">Notas de 1 a 5. Verde: 4 ou mais · Amarelo: de 3 a 4 · Vermelho: abaixo de 3.</p>
      </section>

      <section className={cartao}>
        <h2 className="text-xl font-semibold">Comentários</h2>
        {comentarios.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Nenhum comentário ainda.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {comentarios.map((c) => (
              <li key={c.id} className="rounded-lg border border-slate-200 p-4">
                <p className="whitespace-pre-line text-slate-800">“{c.texto}”</p>
                <p className="mt-2 text-xs text-slate-500">
                  Sobre: <strong>{c.alvo}</strong> · {nomeAula.get(c.a.aula_id)} · {nomeTurma.get(c.a.turma_id)} ·{" "}
                  {dataHora.format(new Date(c.a.created_at))}
                  {c.nota != null && <> · nota geral {c.nota}</>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
