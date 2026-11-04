"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { exigirInstrutor } from "@/lib/auth";

const BUCKET = "previews";
const TIPOS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_BYTES = 2 * 1024 * 1024;

const esquema = z.object({
  titulo: z.string().trim().min(1, "Informe o título.").max(120),
  descricao: z.string().trim().max(500, "A descrição pode ter até 500 caracteres."),
  url: z.string().trim().url("Informe um link válido, começando com https://").refine((u) => /^https?:\/\//i.test(u), "O link precisa começar com http:// ou https://"),
  categoria: z.string().trim().max(40).transform((v) => v || null),
  ods_numero: z
    .string()
    .transform((v) => (v ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 1 && v <= 17), "ODS inválido."),
  ordem: z.coerce.number().int().default(0),
});

export type EstadoSite = { erro: string | null };

function caminhoNoStorage(url: string | null): string | null {
  if (!url) return null;
  const i = url.indexOf(`/${BUCKET}/`);
  return i === -1 ? null : decodeURIComponent(url.slice(i + BUCKET.length + 2));
}

export async function salvarSite(_anterior: EstadoSite, formData: FormData): Promise<EstadoSite> {
  const { supabase } = await exigirInstrutor();
  const id = String(formData.get("id") ?? "") || null;

  const r = esquema.safeParse({
    titulo: formData.get("titulo") ?? "",
    descricao: formData.get("descricao") ?? "",
    url: formData.get("url") ?? "",
    categoria: formData.get("categoria") ?? "",
    ods_numero: formData.get("ods_numero") ?? "",
    ordem: formData.get("ordem") || 0,
  });
  if (!r.success) return { erro: r.error.issues[0]?.message ?? "Dados inválidos." };

  let imagem_url: string | undefined;
  let antiga: string | null = null;
  const arquivo = formData.get("imagem");

  if (arquivo instanceof File && arquivo.size > 0) {
    const ext = TIPOS[arquivo.type];
    if (!ext) return { erro: "A imagem precisa ser JPG, PNG ou WEBP." };
    if (arquivo.size > MAX_BYTES) return { erro: "A imagem pode ter no máximo 2 MB." };

    const caminho = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(caminho, arquivo, { contentType: arquivo.type });
    if (error) return { erro: `Não foi possível enviar a imagem: ${error.message}` };
    imagem_url = supabase.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl;

    if (id) {
      const { data } = await supabase.from("sites").select("imagem_url").eq("id", id).maybeSingle();
      antiga = caminhoNoStorage(data?.imagem_url ?? null);
    }
  } else if (formData.get("remover_imagem") === "on" && id) {
    const { data } = await supabase.from("sites").select("imagem_url").eq("id", id).maybeSingle();
    antiga = caminhoNoStorage(data?.imagem_url ?? null);
    imagem_url = "";
  }

  const registro = { ...r.data, ...(imagem_url !== undefined ? { imagem_url: imagem_url || null } : {}) };
  const { error } = id
    ? await supabase.from("sites").update(registro).eq("id", id)
    : await supabase.from("sites").insert(registro);
  if (error) return { erro: `Não foi possível salvar: ${error.message}` };

  if (antiga) await supabase.storage.from(BUCKET).remove([antiga]);

  revalidatePath("/sites");
  revalidatePath("/admin/sites");
  redirect("/admin/sites?salvo=1");
}

export async function removerSite(formData: FormData) {
  const { supabase } = await exigirInstrutor();
  const id = String(formData.get("id") ?? "");
  const { data } = await supabase.from("sites").select("imagem_url").eq("id", id).maybeSingle();
  await supabase.from("sites").delete().eq("id", id);
  const caminho = caminhoNoStorage(data?.imagem_url ?? null);
  if (caminho) await supabase.storage.from(BUCKET).remove([caminho]);
  revalidatePath("/sites");
  revalidatePath("/admin/sites");
}
