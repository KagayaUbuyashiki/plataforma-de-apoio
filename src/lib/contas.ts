import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { SUPABASE_SECRET_KEY } from "@/lib/supabase/config";

/**
 * Contas por usuário (sem e-mail). O Supabase Auth exige um e-mail, então cada
 * usuário recebe um endereço interno no domínio reservado ".invalid", que
 * nunca recebe mensagens. As senhas ficam só no Supabase Auth, com hash bcrypt.
 */
export const DOMINIO_INTERNO = "contas.invalid";

export const MSG_LOGIN_INVALIDO = "Usuário ou senha incorretos.";
export const MSG_MUITAS_TENTATIVAS = "Muitas tentativas. Espere 15 minutos e tente de novo.";
export const MSG_CONTA_REDEFINIDA =
  "Sua conta foi redefinida pelo instrutor. Para entrar, use o novo código de acesso que ele vai te passar em “Tenho um código”.";
export const MSG_CODIGO_INVALIDO = "Código inválido, já usado ou vencido. Confira com o instrutor.";

export const esquemaUsuario = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9][a-z0-9._-]{2,29}$/, "O usuário deve ter de 3 a 30 caracteres: letras sem acento, números, ponto, hífen ou _.");

export function emailDoUsuario(usuario: string) {
  return `${usuario}@${DOMINIO_INTERNO}`;
}

/** Aceita "usuario" ou um e-mail (instrutores antigos entram com e-mail). */
export function emailDoIdentificador(identificador: string): string | null {
  const v = identificador.trim().toLowerCase();
  if (v.includes("@")) return z.string().email().safeParse(v).success ? v : null;
  const u = esquemaUsuario.safeParse(v);
  return u.success ? emailDoUsuario(u.data) : null;
}

// Senhas comuns (as mais usadas no Brasil e no mundo) que não podem ser escolhidas.
const SENHAS_COMUNS = new Set([
  "12345678", "123456789", "1234567890", "87654321", "11111111", "00000000", "12341234", "11223344",
  "password", "password1", "senha123", "senha1234", "minhasenha", "qwerty123", "qwertyuiop", "abc12345",
  "abcd1234", "iloveyou", "brasil123", "flamengo", "corinthians", "palmeiras", "vasco123", "gremio123",
  "102030405", "10203040", "a1b2c3d4", "aaaaaaaa", "asdfghjk", "mudar123", "admin123", "escola123",
]);

/** Regras de senha. O hash é feito pelo Supabase Auth (bcrypt); 72 é o limite do bcrypt. */
export function problemaNaSenha(senha: string, usuario: string, nome = ""): string | null {
  if (senha.length < 8) return "A senha precisa ter pelo menos 8 caracteres.";
  if (new TextEncoder().encode(senha).length > 72) return "A senha pode ter no máximo 72 caracteres.";
  const minuscula = senha.toLowerCase();
  if (SENHAS_COMUNS.has(minuscula) || /^(.)\1+$/.test(senha)) return "Essa senha é muito comum. Escolha outra.";
  // Nem o usuário inteiro, nem pedaços dele ("joana" em "joana.silva") ou do nome.
  const pedacos = (t: string) =>
    t
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[^a-z]+/)
      .filter((p) => p.length >= 4);
  if (usuario && (minuscula.includes(usuario.toLowerCase()) || pedacos(usuario).some((p) => minuscula.includes(p))))
    return "A senha não pode conter o seu usuário.";
  if (pedacos(nome).some((p) => minuscula.includes(p))) return "A senha não pode conter o seu nome.";
  if (!/[a-zA-Z]/.test(senha) || !/[0-9]/.test(senha)) return "Use letras e números na senha.";
  return null;
}

// ---------- Limite de tentativas ----------

const JANELA_SEGUNDOS = 15 * 60;

/** IP de quem fez a requisição (na Vercel, x-forwarded-for é definido pela própria plataforma). */
export async function ipDoCliente(): Promise<string> {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconhecido";
}

/** Chave do contador: HMAC com a chave secreta, para não guardar IP ou usuário em texto. */
function chave(tipo: string, valor: string) {
  return createHmac("sha256", SUPABASE_SECRET_KEY).update(`${tipo}:${valor}`).digest("hex");
}

export async function excedeuLimite(tipo: string, valor: string, limite: number): Promise<boolean> {
  const { data, error } = await createAdminClient().rpc("contar_tentativas", {
    p_chave: chave(tipo, valor),
    p_janela_segundos: JANELA_SEGUNDOS,
  });
  if (error) throw new Error("Falha ao verificar o limite de tentativas.");
  return (data as number) >= limite;
}

export async function registrarFalha(tipo: string, valor: string) {
  await createAdminClient().rpc("registrar_tentativa", { p_chave: chave(tipo, valor) });
}

export async function limparFalhas(tipo: string, valor: string) {
  await createAdminClient().rpc("limpar_tentativas", { p_chave: chave(tipo, valor) });
}

export const LIMITES = {
  loginPorUsuario: 5,
  loginPorIp: 30,
  codigoPorIp: 10,
} as const;
