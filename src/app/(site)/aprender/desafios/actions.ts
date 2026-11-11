"use server";

import { revalidatePath } from "next/cache";
import { DESAFIO_POR_SLUG } from "@/data/desafios";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** Id do aluno logado (ou null para visitantes e instrutores). Não redireciona. */
async function alunoAtual() {
  if (!supabaseConfigurado()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.rpc("meu_aluno_id");
  return data ? { supabase, alunoId: data as string } : null;
}

/** Desafios já resolvidos pelo aluno logado; null se não for aluno. */
export async function meusDesafios(): Promise<string[] | null> {
  const a = await alunoAtual();
  if (!a) return null;
  const { data } = await a.supabase.from("progresso_aluno").select("item").eq("aluno_id", a.alunoId).like("item", "desafio:%");
  return (data ?? []).map((d) => d.item.slice("desafio:".length));
}

/**
 * Registra desafios resolvidos no checklist do aluno logado.
 * Visitantes: não faz nada (o progresso fica só no navegador).
 */
export async function registrarDesafios(slugs: string[]): Promise<{ salvo: boolean }> {
  const validos = [...new Set(slugs)].filter((s) => typeof s === "string" && DESAFIO_POR_SLUG.has(s)).slice(0, 50);
  if (validos.length === 0) return { salvo: false };
  const a = await alunoAtual();
  if (!a) return { salvo: false };
  const { error } = await a.supabase
    .from("progresso_aluno")
    .upsert(validos.map((s) => ({ aluno_id: a.alunoId, item: `desafio:${s}` })), { onConflict: "aluno_id,item", ignoreDuplicates: true });
  revalidatePath("/minha-area");
  return { salvo: !error };
}
