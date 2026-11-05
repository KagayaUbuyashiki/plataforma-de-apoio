"use server";

import { redirect } from "next/navigation";
import { exigirAluno } from "@/lib/auth";
import { esquemaFicha } from "@/lib/ficha";

export async function salvarFicha(_anterior: string | null, formData: FormData): Promise<string | null> {
  const { supabase } = await exigirAluno();
  const campos = ["como_chamar", "idade", "escola", "serie", "cidade", "experiencia", "ja_criou_site", "expectativa", "ods_interesse"];
  const ficha = esquemaFicha.safeParse(Object.fromEntries(campos.map((c) => [c, String(formData.get(c) ?? "")])));
  if (!ficha.success) return ficha.error.issues[0]?.message ?? "Confira os dados da ficha.";
  const f = ficha.data;
  // salvar_ficha() só altera as colunas da ficha do próprio aluno.
  const { error } = await supabase.rpc("salvar_ficha", {
    p_ficha: { ...f, ja_criou_site: f.ja_criou_site === "sim", ods_interesse: f.ods_interesse === "" ? null : f.ods_interesse },
  });
  if (error) return "Não foi possível salvar. Tente de novo.";
  redirect("/minha-area");
}
