"use server";

import { redirect } from "next/navigation";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { ehInstrutorAutorizado, MSG_NAO_AUTORIZADO } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function entrar(_anterior: string | null, formData: FormData): Promise<string | null> {
  if (!supabaseConfigurado()) return "Configure o Supabase no arquivo .env.local antes de entrar (veja o README).";

  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  if (!email || !senha) return "Preencha e-mail e senha.";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) return "E-mail ou senha incorretos.";

  if (!(await ehInstrutorAutorizado(supabase))) {
    await supabase.auth.signOut();
    return MSG_NAO_AUTORIZADO;
  }

  redirect("/admin");
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
