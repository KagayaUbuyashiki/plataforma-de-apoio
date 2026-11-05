"use server";

import { revalidatePath } from "next/cache";
import { exigirAluno } from "@/lib/auth";
import { itemValido } from "@/lib/checklist";

/** Marca ou desmarca um item do checklist do próprio aluno (as regras do banco também conferem). */
export async function marcarItem(item: string, feito: boolean): Promise<{ ok: boolean }> {
  if (!itemValido(item)) return { ok: false };
  const { supabase, aluno } = await exigirAluno();
  const { error } = feito
    ? await supabase.from("progresso_aluno").upsert({ aluno_id: aluno.id, item }, { onConflict: "aluno_id,item", ignoreDuplicates: true })
    : await supabase.from("progresso_aluno").delete().eq("aluno_id", aluno.id).eq("item", item);
  revalidatePath("/minha-area");
  return { ok: !error };
}
