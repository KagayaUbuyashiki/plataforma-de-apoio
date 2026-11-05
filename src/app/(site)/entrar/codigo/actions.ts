"use server";

import { redirect } from "next/navigation";
import { esquemaFicha } from "@/lib/ficha";
import {
  ehContaDeAluno,
  emailDoUsuario,
  esquemaUsuario,
  excedeuLimite,
  ipDoCliente,
  LIMITES,
  MSG_CODIGO_INVALIDO,
  MSG_MUITAS_TENTATIVAS,
  problemaNaSenha,
  registrarFalha,
} from "@/lib/contas";
import { createAdminClient } from "@/lib/supabase/admin";
import { contasConfiguradas } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { buscarCodigoValido, consumirCodigo, devolverCodigo, hashDoCodigo, normalizarCodigo } from "@/lib/tokens";

export type Ficha = {
  como_chamar: string;
  idade: string;
  escola: string;
  serie: string;
  cidade: string;
  experiencia: string;
  ja_criou_site: string;
  expectativa: string;
  ods_interesse: string;
};

export type EstadoCodigo =
  | { etapa: "codigo"; erro: string | null }
  | {
      etapa: "ficha";
      erro: string | null;
      codigo: string;
      nome: string;
      primeiroAcesso: boolean;
      usuario: string;
      ficha: Ficha;
    };

const ficha_vazia: Ficha = {
  como_chamar: "",
  idade: "",
  escola: "",
  serie: "",
  cidade: "",
  experiencia: "",
  ja_criou_site: "",
  expectativa: "",
  ods_interesse: "",
};

type LinhaAluno = {
  id: string;
  nome: string;
  user_id: string | null;
  como_chamar: string | null;
  idade: number | null;
  escola: string | null;
  serie: string | null;
  cidade: string | null;
  experiencia: string | null;
  ja_criou_site: boolean | null;
  expectativa: string | null;
  ods_interesse: number | null;
};

async function carregarAluno(alunoId: string) {
  const admin = createAdminClient();
  const { data: aluno } = await admin
    .from("alunos")
    .select("id, nome, user_id, como_chamar, idade, escola, serie, cidade, experiencia, ja_criou_site, expectativa, ods_interesse")
    .eq("id", alunoId)
    .maybeSingle<LinhaAluno>();
  if (!aluno) return null;
  let usuario = "";
  if (aluno.user_id) {
    const { data: conta } = await admin.from("contas_login").select("usuario").eq("user_id", aluno.user_id).maybeSingle();
    usuario = conta?.usuario ?? "";
  }
  return { aluno, usuario };
}

function fichaDoAluno(a: LinhaAluno): Ficha {
  return {
    como_chamar: a.como_chamar ?? "",
    idade: a.idade != null ? String(a.idade) : "",
    escola: a.escola ?? "",
    serie: a.serie ?? "",
    cidade: a.cidade ?? "",
    experiencia: a.experiencia ?? "",
    ja_criou_site: a.ja_criou_site == null ? "" : a.ja_criou_site ? "sim" : "nao",
    expectativa: a.expectativa ?? "",
    ods_interesse: a.ods_interesse != null ? String(a.ods_interesse) : "",
  };
}

/** Passo 1: confere o código (sem gastar) e mostra a ficha. */
export async function verificarCodigo(_anterior: EstadoCodigo, formData: FormData): Promise<EstadoCodigo> {
  if (!contasConfiguradas()) return { etapa: "codigo", erro: "O login ainda não foi configurado na plataforma." };

  const ip = await ipDoCliente();
  if (await excedeuLimite("codigo-ip", ip, LIMITES.codigoPorIp)) return { etapa: "codigo", erro: MSG_MUITAS_TENTATIVAS };

  const codigo = normalizarCodigo(String(formData.get("codigo") ?? ""));
  const token = codigo ? await buscarCodigoValido(hashDoCodigo(codigo)) : null;
  const dados = token ? await carregarAluno(token.aluno_id) : null;
  if (!codigo || !dados) {
    await registrarFalha("codigo-ip", ip);
    return { etapa: "codigo", erro: MSG_CODIGO_INVALIDO };
  }

  return {
    etapa: "ficha",
    erro: null,
    codigo,
    nome: dados.aluno.nome,
    primeiroAcesso: !dados.aluno.user_id,
    usuario: dados.usuario,
    ficha: dados.aluno.user_id ? fichaDoAluno(dados.aluno) : ficha_vazia,
  };
}

/** Passo 2: valida tudo, gasta o código, cria ou reativa a conta e entra. */
export async function concluirAcesso(anterior: EstadoCodigo, formData: FormData): Promise<EstadoCodigo> {
  if (anterior.etapa !== "ficha" || !contasConfiguradas()) return { etapa: "codigo", erro: MSG_CODIGO_INVALIDO };

  const ip = await ipDoCliente();
  if (await excedeuLimite("codigo-ip", ip, LIMITES.codigoPorIp)) return { etapa: "codigo", erro: MSG_MUITAS_TENTATIVAS };

  const fichaDigitada = Object.fromEntries(Object.keys(ficha_vazia).map((k) => [k, String(formData.get(k) ?? "")])) as Ficha;
  const voltar = (erro: string): EstadoCodigo => ({ ...anterior, erro, ficha: fichaDigitada });

  // O código vem do passo 1 (estado do formulário), mas é sempre conferido de novo aqui.
  const codigo = normalizarCodigo(anterior.codigo);
  if (!codigo) return { etapa: "codigo", erro: MSG_CODIGO_INVALIDO };
  const hash = hashDoCodigo(codigo);
  const token = await buscarCodigoValido(hash);
  const dados = token ? await carregarAluno(token.aluno_id) : null;
  if (!token || !dados) {
    await registrarFalha("codigo-ip", ip);
    return { etapa: "codigo", erro: MSG_CODIGO_INVALIDO };
  }
  const { aluno } = dados;
  const primeiroAcesso = !aluno.user_id;

  const ficha = esquemaFicha.safeParse(fichaDigitada);
  if (!ficha.success) return voltar(ficha.error.issues[0]?.message ?? "Confira os dados da ficha.");

  let usuario = dados.usuario;
  if (primeiroAcesso) {
    const u = esquemaUsuario.safeParse(String(formData.get("usuario") ?? ""));
    if (!u.success) return voltar(u.error.issues[0]?.message ?? "Usuário inválido.");
    usuario = u.data;
  }
  const senha = String(formData.get("senha") ?? "");
  if (senha !== String(formData.get("confirmar") ?? "")) return voltar("As duas senhas não são iguais.");
  const problema = problemaNaSenha(senha, usuario, aluno.nome);
  if (problema) return voltar(problema);

  const admin = createAdminClient();
  if (primeiroAcesso) {
    const { data: jaExiste } = await admin.from("contas_login").select("user_id").eq("usuario", usuario).maybeSingle();
    if (jaExiste) return voltar("Esse usuário já existe. Escolha outro.");
  }

  // Daqui em diante o código é gasto (atômico: dois envios ao mesmo tempo não passam).
  const alunoDoCodigo = await consumirCodigo(hash);
  if (alunoDoCodigo !== aluno.id) return { etapa: "codigo", erro: MSG_CODIGO_INVALIDO };

  const f = ficha.data;
  const camposFicha = {
    como_chamar: f.como_chamar || null,
    idade: f.idade,
    escola: f.escola,
    serie: f.serie,
    cidade: f.cidade,
    experiencia: f.experiencia,
    ja_criou_site: f.ja_criou_site === "sim",
    expectativa: f.expectativa || null,
    ods_interesse: f.ods_interesse === "" ? null : f.ods_interesse,
    ficha_em: new Date().toISOString(),
  };

  let userId = aluno.user_id;
  if (primeiroAcesso) {
    const { data: criado, error } = await admin.auth.admin.createUser({
      email: emailDoUsuario(usuario),
      password: senha,
      email_confirm: true,
      app_metadata: { papel: "aluno" },
    });
    if (error || !criado.user) {
      await devolverCodigo(hash);
      return voltar(error?.code === "email_exists" ? "Esse usuário já existe. Escolha outro." : "Não foi possível criar a conta. Tente de novo.");
    }
    userId = criado.user.id;
    const { error: erroConta } = await admin.from("contas_login").insert({ user_id: userId, usuario, papel: "aluno" });
    if (erroConta) {
      await admin.auth.admin.deleteUser(userId);
      await devolverCodigo(hash);
      return voltar("Esse usuário já existe. Escolha outro.");
    }
  } else {
    // Conta redefinida: senha nova e desbloqueio (só se a conta for mesmo de aluno).
    if (!(await ehContaDeAluno(userId!))) {
      await devolverCodigo(hash);
      return { etapa: "codigo", erro: MSG_CODIGO_INVALIDO };
    }
    const { error } = await admin.auth.admin.updateUserById(userId!, { password: senha, ban_duration: "none" });
    if (error) {
      await devolverCodigo(hash);
      return voltar("Não foi possível atualizar a senha. Tente de novo.");
    }
  }

  await admin.from("alunos").update({ ...camposFicha, user_id: userId, situacao: "ativo" }).eq("id", aluno.id);

  const supabase = await createClient();
  const { error: erroLogin } = await supabase.auth.signInWithPassword({ email: emailDoUsuario(usuario), password: senha });
  if (erroLogin) redirect("/entrar");
  redirect("/minha-area?bemvindo=1");
}
