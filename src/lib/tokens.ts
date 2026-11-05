import "server-only";
import { createHmac, randomBytes, randomInt } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { SUPABASE_SECRET_KEY } from "@/lib/supabase/config";

/**
 * Códigos de acesso dos alunos.
 * - 10 caracteres do alfabeto de Crockford (sem I, L, O, U): ~50 bits aleatórios.
 * - Valem 7 dias e só podem ser usados uma vez.
 * - O banco guarda apenas o HMAC-SHA256 do código (com a chave secreta do servidor):
 *   mesmo quem visse o banco não conseguiria descobrir os códigos.
 * - O código aparece uma única vez para o instrutor.
 */
const ALFABETO = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const TAMANHO = 10;
export const VALIDADE_DIAS = 7;

export function gerarCodigo(): string {
  let s = "";
  for (let i = 0; i < TAMANHO; i++) s += ALFABETO[randomInt(ALFABETO.length)];
  return `${s.slice(0, 5)}-${s.slice(5)}`;
}

/** Normaliza o que o aluno digitou: maiúsculas, sem espaços/hífens, letras parecidas trocadas. */
export function normalizarCodigo(digitado: string): string | null {
  const s = digitado
    .toUpperCase()
    .replace(/[\s-]/g, "")
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1");
  if (s.length !== TAMANHO || [...s].some((c) => !ALFABETO.includes(c))) return null;
  return s;
}

export function hashDoCodigo(codigoNormalizado: string): string {
  return createHmac("sha256", SUPABASE_SECRET_KEY).update(`codigo:${codigoNormalizado}`).digest("hex");
}

/** Cria um código novo para o aluno (apaga o anterior ainda não usado) e devolve o código em texto. */
export async function criarCodigoParaAluno(alunoId: string, criadoPor: string): Promise<string> {
  const admin = createAdminClient();
  await admin.from("tokens_aluno").delete().eq("aluno_id", alunoId).is("usado_em", null);
  const codigo = gerarCodigo();
  const expira = new Date(Date.now() + VALIDADE_DIAS * 24 * 60 * 60 * 1000);
  const { error } = await admin.from("tokens_aluno").insert({
    aluno_id: alunoId,
    hash_token: hashDoCodigo(normalizarCodigo(codigo)!),
    expira_em: expira.toISOString(),
    criado_por: criadoPor,
  });
  if (error) throw new Error("Não foi possível gerar o código.");
  return codigo;
}

/** Procura um código válido (sem consumir). */
export async function buscarCodigoValido(hash: string) {
  const { data } = await createAdminClient()
    .from("tokens_aluno")
    .select("id, aluno_id")
    .eq("hash_token", hash)
    .is("usado_em", null)
    .gt("expira_em", new Date().toISOString())
    .maybeSingle();
  return data;
}

/** Marca o código como usado de forma atômica. Devolve o aluno, ou null se já tinha sido usado/vencido. */
export async function consumirCodigo(hash: string): Promise<string | null> {
  const { data, error } = await createAdminClient().rpc("consumir_token", { p_hash: hash });
  if (error || !Array.isArray(data) || data.length === 0) return null;
  return (data[0] as { aluno_id: string }).aluno_id;
}

/** Devolve o código para "não usado" (quando algo falha depois de consumir). */
export async function devolverCodigo(hash: string) {
  await createAdminClient().from("tokens_aluno").update({ usado_em: null }).eq("hash_token", hash);
}

/** Senha aleatória forte, usada para invalidar a senha antiga quando o instrutor redefine a conta. */
export function senhaAleatoria(): string {
  return randomBytes(36).toString("base64url");
}
