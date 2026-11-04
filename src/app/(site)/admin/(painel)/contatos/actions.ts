"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { exigirInstrutor } from "@/lib/auth";

export type EstadoContato = { erro: string | null };

const opcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

const esquema = z
  .object({
    nome: z.string().trim().min(1, "Informe o nome.").max(120),
    funcao: opcional(80),
    email: opcional(160).refine((v) => v === null || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), "E-mail inválido."),
    telefone: z
      .string()
      .transform((v) => v.replace(/\D/g, "") || null)
      .refine((v) => v === null || (v.length >= 10 && v.length <= 13), "Telefone inválido: use DDD + número, ex.: (32) 99999-8888."),
    whatsapp: z.boolean(),
    link: opcional(300).refine((v) => v === null || /^https?:\/\/\S+$/i.test(v), "O link precisa começar com https://"),
    descricao: opcional(500),
    ordem: z.coerce.number().int().default(0),
  })
  .refine((c) => c.email || c.telefone || c.link, { message: "Coloque pelo menos uma forma de contato: e-mail, telefone ou link." });

export async function salvarContato(_anterior: EstadoContato, formData: FormData): Promise<EstadoContato> {
  const { supabase } = await exigirInstrutor();
  const id = String(formData.get("id") ?? "") || null;
  const r = esquema.safeParse({
    nome: formData.get("nome") ?? "",
    funcao: formData.get("funcao") ?? "",
    email: formData.get("email") ?? "",
    telefone: formData.get("telefone") ?? "",
    whatsapp: formData.get("whatsapp") === "on",
    link: formData.get("link") ?? "",
    descricao: formData.get("descricao") ?? "",
    ordem: formData.get("ordem") || 0,
  });
  if (!r.success) return { erro: r.error.issues[0]?.message ?? "Dados inválidos." };

  const registro = { ...r.data, whatsapp: r.data.telefone ? r.data.whatsapp : false };
  const { error } = id
    ? await supabase.from("contatos").update(registro).eq("id", id)
    : await supabase.from("contatos").insert(registro);
  if (error) return { erro: `Não foi possível salvar: ${error.message}` };

  revalidatePath("/contatos");
  revalidatePath("/admin/contatos");
  redirect("/admin/contatos?salvo=1");
}

export async function removerContato(formData: FormData) {
  const { supabase } = await exigirInstrutor();
  await supabase.from("contatos").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/contatos");
  revalidatePath("/admin/contatos");
}
