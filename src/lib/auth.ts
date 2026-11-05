import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const MSG_NAO_AUTORIZADO =
  "Esta conta ainda não foi autorizada como instrutor. Peça para o responsável pela plataforma liberar o seu e-mail.";

/** Verdadeiro se a conta logada está em instrutores_autorizados (função eh_instrutor no banco). */
export async function ehInstrutorAutorizado(supabase: SupabaseClient): Promise<boolean> {
  const { data, error } = await supabase.rpc("eh_instrutor");
  return !error && data === true;
}

/** Verdadeiro se a conta logada é de um aluno ativo (função eh_aluno no banco). */
export async function ehAlunoAtivo(supabase: SupabaseClient): Promise<boolean> {
  const { data, error } = await supabase.rpc("eh_aluno");
  return !error && data === true;
}

export type Papel = "instrutor" | "aluno" | null;

export async function papelDaSessao(supabase: SupabaseClient): Promise<Papel> {
  if (await ehInstrutorAutorizado(supabase)) return "instrutor";
  if (await ehAlunoAtivo(supabase)) return "aluno";
  return null;
}

/** Garante que há um instrutor AUTORIZADO logado; caso contrário, manda para o login. Retorna o cliente Supabase. */
export async function exigirInstrutor() {
  if (!supabaseConfigurado()) redirect("/entrar");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");
  if (!(await ehInstrutorAutorizado(supabase))) redirect("/entrar");
  return { supabase, user };
}

/** Garante que há um aluno ATIVO logado (conta redefinida pelo instrutor deixa de ser ativa na hora). */
export async function exigirAluno() {
  if (!supabaseConfigurado()) redirect("/entrar");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");
  const { data: aluno } = await supabase
    .from("alunos")
    .select("id, nome, como_chamar, situacao, turma_id, idade, escola, serie, cidade, experiencia, ja_criou_site, expectativa, ods_interesse")
    .eq("user_id", user.id)
    .eq("situacao", "ativo")
    .maybeSingle();
  if (!aluno) redirect("/entrar?aviso=redefinida");
  return { supabase, user, aluno };
}
