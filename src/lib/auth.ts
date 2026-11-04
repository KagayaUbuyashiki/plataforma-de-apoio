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

/** Garante que há um instrutor AUTORIZADO logado; caso contrário, manda para o login. Retorna o cliente Supabase. */
export async function exigirInstrutor() {
  if (!supabaseConfigurado()) redirect("/admin/login");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  if (!(await ehInstrutorAutorizado(supabase))) redirect("/admin/login");
  return { supabase, user };
}
