import { NextResponse } from "next/server";
import { papelDaSessao } from "@/lib/auth";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Diz ao cabeçalho se há alguém logado (só o papel, nada de dados pessoais). */
export async function GET() {
  let papel: "instrutor" | "aluno" | null = null;
  if (supabaseConfigurado()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) papel = await papelDaSessao(supabase);
  }
  return NextResponse.json({ papel }, { headers: { "Cache-Control": "private, no-store" } });
}
