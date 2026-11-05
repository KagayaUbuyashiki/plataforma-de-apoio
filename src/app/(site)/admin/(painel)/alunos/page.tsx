import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/Aviso";
import { cartao } from "@/components/admin/estilos";
import { Icone } from "@/components/Icone";
import { exigirInstrutor } from "@/lib/auth";
import { ETAPAS_PROJETO } from "@/lib/checklist";
import { contasConfiguradas } from "@/lib/supabase/config";
import { FormNovoAluno } from "./Formularios";

export const metadata: Metadata = { title: "Alunos", robots: { index: false } };

export default async function AdminAlunos() {
  const { supabase } = await exigirInstrutor();
  const [{ data: alunos }, { data: turmas }, { data: progresso }, { count: totalAulas }] = await Promise.all([
    supabase.from("alunos").select("id, nome, situacao, turma_id, user_id, ficha_em").order("nome"),
    supabase.from("turmas").select("id, nome").order("nome"),
    supabase.from("progresso_aluno").select("aluno_id"),
    supabase.from("aulas").select("id", { count: "exact", head: true }).eq("publicada", true),
  ]);
  const totalItens = (totalAulas ?? 0) + ETAPAS_PROJETO.length;
  const feitos = new Map<string, number>();
  for (const p of progresso ?? []) feitos.set(p.aluno_id, (feitos.get(p.aluno_id) ?? 0) + 1);
  const nomeTurma = new Map((turmas ?? []).map((t) => [t.id, t.nome]));

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight">Alunos</h1>
      {!contasConfiguradas() && (
        <Aviso tipo="erro">Falta configurar a chave secreta do Supabase (SUPABASE_SERVICE_ROLE_KEY) no servidor para gerar códigos e redefinir contas.</Aviso>
      )}

      <section className={`${cartao} flex flex-col gap-4`}>
        <div>
          <h2 className="text-xl font-extrabold">Cadastrar aluno</h2>
          <p className="text-sm text-tinta-suave">
            Digite o nome do aluno e gere o código de acesso. No primeiro acesso ele preenche a ficha e cria o próprio usuário e senha.
          </p>
        </div>
        <FormNovoAluno turmas={turmas ?? []} />
      </section>

      <section className={`${cartao} flex flex-col gap-3`}>
        <h2 className="text-xl font-extrabold">Todos os alunos ({alunos?.length ?? 0})</h2>
        {alunos?.length ? (
          <ul className="divide-y divide-white/80">
            {alunos.map((a) => {
              const pct = totalItens ? Math.round(((feitos.get(a.id) ?? 0) / totalItens) * 100) : 0;
              return (
                <li key={a.id}>
                  <Link href={`/admin/alunos/${a.id}`} className="group flex flex-wrap items-center gap-4 rounded-2xl px-2 py-3 transition hover:bg-white/70">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{a.nome}</p>
                      <p className="text-sm text-tinta-suave">{a.turma_id ? nomeTurma.get(a.turma_id) : "Sem turma"}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        a.situacao === "ativo" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {a.situacao === "ativo" ? "com conta" : a.user_id ? "aguardando código (redefinida)" : "aguardando primeiro acesso"}
                    </span>
                    <div className="flex w-40 items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                        <div className="h-full rounded-full bg-[linear-gradient(90deg,#0ea5c6,#6366f1)]" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-9 text-right text-xs font-bold text-tinta-suave">{pct}%</span>
                    </div>
                    <Icone nome="seta" tamanho={16} espessura={2.2} className="seta-anda text-tinta-suave" />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-tinta-suave">Nenhum aluno cadastrado ainda.</p>
        )}
      </section>
    </>
  );
}
