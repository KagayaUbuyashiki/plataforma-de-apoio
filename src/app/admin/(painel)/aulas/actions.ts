"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { exigirInstrutor } from "@/lib/auth";
import type { Material } from "@/lib/tipos";

export type EstadoAula = { erro: string | null };

function slugificar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Cada linha: "Título | https://link" (ou um caminho interno como /ods). */
function lerMateriais(texto: string): Material[] | string {
  const materiais: Material[] = [];
  for (const [i, linha] of texto.split("\n").entries()) {
    if (!linha.trim()) continue;
    const [titulo, url] = linha.split("|").map((p) => p.trim());
    if (!titulo || !url) return `Materiais, linha ${i + 1}: use o formato "Título | link".`;
    if (!/^(https?:\/\/|\/)/i.test(url)) return `Materiais, linha ${i + 1}: o link deve começar com https:// ou /.`;
    materiais.push({ titulo, url });
  }
  return materiais;
}

const esquema = z.object({
  numero: z.coerce.number().int().min(0, "Número inválido.").max(999),
  titulo: z.string().trim().min(1, "Informe o título.").max(150),
  slug: z.string().trim(),
  data: z.string().trim().transform((v) => v || null),
  resumo_md: z.string().max(5000),
  conteudo_md: z.string().max(50000),
  publicada: z.boolean(),
});

export async function salvarAula(_anterior: EstadoAula, formData: FormData): Promise<EstadoAula> {
  const { supabase } = await exigirInstrutor();
  const id = String(formData.get("id") ?? "") || null;

  const r = esquema.safeParse({
    numero: formData.get("numero"),
    titulo: formData.get("titulo") ?? "",
    slug: formData.get("slug") ?? "",
    data: formData.get("data") ?? "",
    resumo_md: formData.get("resumo_md") ?? "",
    conteudo_md: formData.get("conteudo_md") ?? "",
    publicada: formData.get("publicada") === "on",
  });
  if (!r.success) return { erro: r.error.issues[0]?.message ?? "Dados inválidos." };

  const materiais = lerMateriais(String(formData.get("materiais") ?? ""));
  if (typeof materiais === "string") return { erro: materiais };

  const slug = slugificar(r.data.slug || `aula-${r.data.numero}`);
  if (!slug) return { erro: "Endereço (slug) inválido." };

  const registro = { ...r.data, slug, materiais };
  const resposta = id
    ? await supabase.from("aulas").update(registro).eq("id", id).select("id").single()
    : await supabase.from("aulas").insert(registro).select("id").single();

  if (resposta.error) {
    const msg = resposta.error.code === "23505" ? `Já existe uma aula com o endereço "${slug}".` : resposta.error.message;
    return { erro: `Não foi possível salvar: ${msg}` };
  }

  const aulaId = resposta.data.id as string;
  const instrutores = formData.getAll("instrutores").map(String);
  await supabase.from("aula_instrutores").delete().eq("aula_id", aulaId);
  if (instrutores.length > 0) {
    const { error } = await supabase
      .from("aula_instrutores")
      .insert(instrutores.map((instrutor_id) => ({ aula_id: aulaId, instrutor_id })));
    if (error) return { erro: `Aula salva, mas houve erro ao salvar os instrutores: ${error.message}` };
  }

  revalidatePath("/", "layout");
  redirect("/admin/aulas?salvo=1");
}

export async function removerAula(formData: FormData) {
  const { supabase } = await exigirInstrutor();
  await supabase.from("aulas").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/", "layout");
}
