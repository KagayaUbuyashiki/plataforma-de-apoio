"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirInstrutor } from "@/lib/auth";

const voltar = (params: Record<string, string>) => redirect(`/admin/turmas?${new URLSearchParams(params)}`);
const texto = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function criarTurma(formData: FormData) {
  const { supabase } = await exigirInstrutor();
  const nome = texto(formData, "nome");
  const codigo = texto(formData, "codigo").toUpperCase().replace(/\s+/g, "-");
  if (!nome || codigo.length < 3) voltar({ erro: "Informe o nome da turma e um código com pelo menos 3 caracteres." });

  const { error } = await supabase.from("turmas").insert({
    nome,
    codigo,
    escola: texto(formData, "escola") || null,
    cidade: texto(formData, "cidade") || null,
  });
  if (error) voltar({ erro: error.code === "23505" ? `O código ${codigo} já está em uso.` : error.message });

  revalidatePath("/admin/turmas");
  voltar({ ok: `Turma criada com o código ${codigo}.` });
}

export async function alternarTurma(formData: FormData) {
  const { supabase } = await exigirInstrutor();
  const id = texto(formData, "id");
  const ativa = texto(formData, "ativa") === "true";
  await supabase.from("turmas").update({ ativa: !ativa }).eq("id", id);
  revalidatePath("/admin/turmas");
}

export async function removerTurma(formData: FormData) {
  const { supabase } = await exigirInstrutor();
  await supabase.from("turmas").delete().eq("id", texto(formData, "id"));
  revalidatePath("/admin/turmas");
}

export async function salvarInstrutor(formData: FormData) {
  const { supabase } = await exigirInstrutor();
  const id = texto(formData, "id");
  const nome = texto(formData, "nome");
  if (!nome) voltar({ erro: "Informe o nome do instrutor." });
  const registro = { nome, bio: texto(formData, "bio") || null };

  const { error } = id
    ? await supabase.from("instrutores").update(registro).eq("id", id)
    : await supabase.from("instrutores").insert(registro);
  if (error) voltar({ erro: error.message });

  revalidatePath("/", "layout");
  voltar({ ok: id ? "Instrutor atualizado." : "Instrutor cadastrado." });
}

export async function removerInstrutor(formData: FormData) {
  const { supabase } = await exigirInstrutor();
  await supabase.from("instrutores").delete().eq("id", texto(formData, "id"));
  revalidatePath("/", "layout");
}
