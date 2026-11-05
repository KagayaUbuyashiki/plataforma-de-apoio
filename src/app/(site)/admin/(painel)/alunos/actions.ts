"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { exigirInstrutor } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { contasConfiguradas } from "@/lib/supabase/config";
import { criarCodigoParaAluno, senhaAleatoria } from "@/lib/tokens";

export type ResultadoCodigo = { codigo: string; nome: string; erro?: undefined } | { erro: string; codigo?: undefined } | null;

const id = z.string().uuid();
const SEM_CHAVE = "Falta configurar a chave secreta do Supabase (SUPABASE_SERVICE_ROLE_KEY) no servidor.";

export async function criarAluno(_anterior: ResultadoCodigo, formData: FormData): Promise<ResultadoCodigo> {
  const { supabase, user } = await exigirInstrutor();
  if (!contasConfiguradas()) return { erro: SEM_CHAVE };
  const nome = String(formData.get("nome") ?? "").trim().replace(/\s+/g, " ");
  const turma = String(formData.get("turma_id") ?? "");
  if (nome.length < 2 || nome.length > 80) return { erro: "Informe o nome completo do aluno (2 a 80 caracteres)." };
  if (turma && !id.safeParse(turma).success) return { erro: "Turma inválida." };

  const { data, error } = await supabase
    .from("alunos")
    .insert({ nome, turma_id: turma || null, criado_por: user.id })
    .select("id")
    .single();
  if (error || !data) return { erro: "Não foi possível cadastrar o aluno." };

  const codigo = await criarCodigoParaAluno(data.id, user.id);
  revalidatePath("/admin/alunos");
  return { codigo, nome };
}

/** Gera um código novo (o anterior, se não foi usado, deixa de valer). */
export async function gerarNovoCodigo(_anterior: ResultadoCodigo, formData: FormData): Promise<ResultadoCodigo> {
  const { supabase, user } = await exigirInstrutor();
  if (!contasConfiguradas()) return { erro: SEM_CHAVE };
  const alunoId = id.safeParse(formData.get("id"));
  if (!alunoId.success) return { erro: "Aluno inválido." };
  const { data: aluno } = await supabase.from("alunos").select("id, nome, situacao").eq("id", alunoId.data).maybeSingle();
  if (!aluno) return { erro: "Aluno não encontrado." };
  if (aluno.situacao === "ativo") return { erro: "Este aluno já tem conta. Para ele entrar com um código novo, use “Redefinir conta”." };
  const codigo = await criarCodigoParaAluno(aluno.id, user.id);
  revalidatePath("/admin/alunos");
  return { codigo, nome: aluno.nome };
}

/**
 * Recupera a conta: invalida a senha atual (valor aleatório), bloqueia a conta
 * (encerra as sessões) e gera um código novo. O aluno é avisado ao tentar entrar.
 */
export async function redefinirConta(_anterior: ResultadoCodigo, formData: FormData): Promise<ResultadoCodigo> {
  const { supabase, user } = await exigirInstrutor();
  if (!contasConfiguradas()) return { erro: SEM_CHAVE };
  const alunoId = id.safeParse(formData.get("id"));
  if (!alunoId.success) return { erro: "Aluno inválido." };
  const { data: aluno } = await supabase.from("alunos").select("id, nome, user_id").eq("id", alunoId.data).maybeSingle();
  if (!aluno) return { erro: "Aluno não encontrado." };

  const admin = createAdminClient();
  if (aluno.user_id) {
    const { error } = await admin.auth.admin.updateUserById(aluno.user_id, { password: senhaAleatoria(), ban_duration: "876000h" });
    if (error) return { erro: "Não foi possível redefinir a conta. Tente de novo." };
  }
  await admin.from("alunos").update({ situacao: "aguardando_token" }).eq("id", aluno.id);
  const codigo = await criarCodigoParaAluno(aluno.id, user.id);
  revalidatePath("/admin/alunos");
  return { codigo, nome: aluno.nome };
}

export async function excluirAluno(formData: FormData) {
  const { supabase } = await exigirInstrutor();
  const alunoId = id.safeParse(formData.get("id"));
  if (!alunoId.success) return;
  const { data: aluno } = await supabase.from("alunos").select("id, user_id").eq("id", alunoId.data).maybeSingle();
  if (!aluno) return;
  if (aluno.user_id && contasConfiguradas()) await createAdminClient().auth.admin.deleteUser(aluno.user_id);
  await supabase.from("alunos").delete().eq("id", aluno.id);
  revalidatePath("/admin/alunos");
  redirect("/admin/alunos");
}
