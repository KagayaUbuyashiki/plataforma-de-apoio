import { createClient } from "@/lib/supabase/server";
import { diagnosticoSupabase, supabaseConfigurado } from "@/lib/supabase/config";
import type { Aula, AulaComInstrutores, Contato, Instrutor, Site } from "@/lib/tipos";

export type Resultado<T> = { dados: T; erro: string | null };

const SEM_CONFIG = `O banco de dados ainda não foi configurado (veja o README). Diagnóstico: ${diagnosticoSupabase()}.`;

type AulaBruta = Aula & { aula_instrutores?: { instrutores: Instrutor | null }[] };

function comInstrutores(a: AulaBruta): AulaComInstrutores {
  const { aula_instrutores, ...aula } = a;
  return {
    ...aula,
    materiais: Array.isArray(aula.materiais) ? aula.materiais : [],
    instrutores: (aula_instrutores ?? [])
      .map((ai) => ai.instrutores)
      .filter((i): i is Instrutor => Boolean(i)),
  };
}

export async function listarSites(): Promise<Resultado<Site[]>> {
  if (!supabaseConfigurado()) return { dados: [], erro: SEM_CONFIG };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .order("ordem", { ascending: true })
    .order("created_at", { ascending: false });
  return { dados: (data as Site[]) ?? [], erro: error?.message ?? null };
}

/** Aulas visíveis para o público (só publicadas, pela RLS) ou todas, para instrutores logados. */
export async function listarAulas(): Promise<Resultado<AulaComInstrutores[]>> {
  if (!supabaseConfigurado()) return { dados: [], erro: SEM_CONFIG };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("aulas")
    .select("*, aula_instrutores(instrutores(*))")
    .order("numero", { ascending: true });
  return { dados: ((data as AulaBruta[]) ?? []).map(comInstrutores), erro: error?.message ?? null };
}

export async function buscarAula(slug: string): Promise<Resultado<AulaComInstrutores | null>> {
  if (!supabaseConfigurado()) return { dados: null, erro: SEM_CONFIG };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("aulas")
    .select("*, aula_instrutores(instrutores(*))")
    .eq("slug", slug)
    .maybeSingle();
  return { dados: data ? comInstrutores(data as AulaBruta) : null, erro: error?.message ?? null };
}

export async function listarInstrutores(): Promise<Resultado<Instrutor[]>> {
  if (!supabaseConfigurado()) return { dados: [], erro: SEM_CONFIG };
  const supabase = await createClient();
  const { data, error } = await supabase.from("instrutores").select("*").order("nome");
  return { dados: (data as Instrutor[]) ?? [], erro: error?.message ?? null };
}

export async function listarContatos(): Promise<Resultado<Contato[]>> {
  if (!supabaseConfigurado()) return { dados: [], erro: SEM_CONFIG };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contatos")
    .select("*")
    .order("ordem", { ascending: true })
    .order("nome", { ascending: true });
  return { dados: (data as Contato[]) ?? [], erro: error?.message ?? null };
}
