import { z } from "zod";

/** Validação da ficha do aluno (dados mínimos). */
const texto = (max: number) => z.string().trim().max(max);

export const esquemaFicha = z.object({
  como_chamar: texto(40),
  idade: z.coerce.number({ invalid_type_error: "Informe a sua idade." }).int().min(8, "Idade inválida.").max(99, "Idade inválida."),
  escola: texto(120).min(2, "Informe a sua escola."),
  serie: texto(40).min(1, "Informe o seu ano ou série."),
  cidade: texto(80).min(2, "Informe a sua cidade."),
  experiencia: z.enum(["nunca", "pouco", "sim"], { errorMap: () => ({ message: "Conte se você já programou antes." }) }),
  ja_criou_site: z.enum(["sim", "nao"], { errorMap: () => ({ message: "Conte se você já criou um site." }) }),
  expectativa: texto(500),
  ods_interesse: z.union([z.literal(""), z.coerce.number().int().min(1).max(17)]),
});

