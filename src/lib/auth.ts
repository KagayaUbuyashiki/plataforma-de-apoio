import { redirect } from "next/navigation";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** Garante que há um instrutor logado; caso contrário, manda para o login. Retorna o cliente Supabase. */
export async function exigirInstrutor() {
  if (!supabaseConfigurado()) redirect("/admin/login");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return { supabase, user };
}
