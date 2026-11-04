"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type EstadoEnvio = { ok: boolean; erro: string | null };

const COOKIE = "mps_avaliadas";

export async function verificarCodigo(codigo: string): Promise<{ ok: true; turma: string } | { ok: false; erro: string }> {
  const limpo = codigo.trim().toUpperCase();
  if (limpo.length < 3) return { ok: false, erro: "Digite o código que o instrutor passou." };
  if (!supabaseConfigurado()) return { ok: false, erro: "A plataforma ainda não foi conectada ao banco de dados." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("verificar_turma", { p_codigo: limpo });
  if (error) return { ok: false, erro: "Não foi possível verificar o código agora. Tente de novo." };
  const turma = Array.isArray(data) ? data[0] : null;
  if (!turma) return { ok: false, erro: "Código não encontrado. Confira com o instrutor." };
  return { ok: true, turma: turma.nome as string };
}

const nota = z.coerce.number().int().min(1, "Dê uma nota de 1 a 5.").max(5);
const comentario = z.string().trim().max(1000, "O comentário pode ter no máximo 1000 caracteres.").optional();

const esquema = z.object({
  codigo: z.string().trim().min(3),
  aula_id: z.string().uuid(),
  nota_geral: nota,
  nota_conteudo: nota,
  nota_ritmo: nota,
  comentario,
  instrutores: z.array(
    z.object({
      instrutor_id: z.string().uuid(),
      nota_clareza: nota,
      nota_dominio: nota,
      nota_atencao: nota,
      comentario,
    }),
  ),
});

export async function enviarAvaliacao(_anterior: EstadoEnvio, formData: FormData): Promise<EstadoEnvio> {
  if (!supabaseConfigurado()) return { ok: false, erro: "A plataforma ainda não foi conectada ao banco de dados." };

  const texto = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v : undefined;
  };

  const ids = formData.getAll("instrutor_ids").filter((v): v is string => typeof v === "string");
  const resultado = esquema.safeParse({
    codigo: texto("codigo"),
    aula_id: texto("aula_id"),
    nota_geral: texto("nota_geral"),
    nota_conteudo: texto("nota_conteudo"),
    nota_ritmo: texto("nota_ritmo"),
    comentario: texto("comentario"),
    instrutores: ids.map((id) => ({
      instrutor_id: id,
      nota_clareza: texto(`inst_${id}_clareza`),
      nota_dominio: texto(`inst_${id}_dominio`),
      nota_atencao: texto(`inst_${id}_atencao`),
      comentario: texto(`inst_${id}_comentario`),
    })),
  });

  if (!resultado.success) {
    return { ok: false, erro: "Preencha todas as estrelas antes de enviar." };
  }

  const { codigo, aula_id, ...avaliacao } = resultado.data;
  const supabase = await createClient();
  const { error } = await supabase.rpc("enviar_avaliacao", {
    p_codigo: codigo.toUpperCase(),
    p_aula_id: aula_id,
    p_avaliacao: avaliacao,
  });

  if (error) {
    // Mensagens criadas na função SQL (raise exception) são amigáveis; as demais, não.
    const amigavel = error.code === "P0001" ? error.message : "Não foi possível enviar agora. Tente de novo em instantes.";
    return { ok: false, erro: amigavel };
  }

  // Marca (só neste navegador) que esta aula já foi avaliada, para avisar sobre envios repetidos.
  const jar = await cookies();
  const avaliadas = new Set((jar.get(COOKIE)?.value ?? "").split(",").filter(Boolean));
  avaliadas.add(aula_id);
  jar.set(COOKIE, [...avaliadas].slice(-50).join(","), {
    maxAge: 60 * 60 * 24 * 120,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return { ok: true, erro: null };
}

export async function aulasJaAvaliadas(): Promise<string[]> {
  const jar = await cookies();
  return (jar.get(COOKIE)?.value ?? "").split(",").filter(Boolean);
}
