"use server";

import { redirect } from "next/navigation";
import { papelDaSessao } from "@/lib/auth";
import {
  emailDoIdentificador,
  excedeuLimite,
  ipDoCliente,
  limparFalhas,
  LIMITES,
  MSG_CONTA_REDEFINIDA,
  MSG_LOGIN_INVALIDO,
  MSG_MUITAS_TENTATIVAS,
  registrarFalha,
} from "@/lib/contas";
import { contasConfiguradas, supabaseConfigurado } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function entrar(_anterior: string | null, formData: FormData): Promise<string | null> {
  if (!supabaseConfigurado()) return "O login ainda não foi configurado na plataforma. Avise o responsável.";
  // Sem a chave secreta, o login continua funcionando (o Supabase Auth tem limites próprios),
  // mas o nosso limite de tentativas fica desligado.
  const comLimite = contasConfiguradas();

  const identificador = String(formData.get("usuario") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");
  if (!identificador || !senha) return "Preencha usuário e senha.";

  const email = emailDoIdentificador(identificador);
  const ip = await ipDoCliente();
  if (
    comLimite &&
    ((await excedeuLimite("login-usuario", identificador, LIMITES.loginPorUsuario)) ||
      (await excedeuLimite("login-ip", ip, LIMITES.loginPorIp)))
  ) {
    return MSG_MUITAS_TENTATIVAS;
  }
  if (!email || senha.length > 200) {
    if (comLimite) await registrarFalha("login-ip", ip);
    return MSG_LOGIN_INVALIDO;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) {
    if (comLimite) {
      await registrarFalha("login-usuario", identificador);
      await registrarFalha("login-ip", ip);
    }
    // Conta bloqueada = o instrutor redefiniu a conta e o aluno precisa do código novo.
    if (error.code === "user_banned") return MSG_CONTA_REDEFINIDA;
    return MSG_LOGIN_INVALIDO;
  }

  const papel = await papelDaSessao(supabase);
  if (!papel) {
    await supabase.auth.signOut();
    return "Esta conta não tem acesso à plataforma. Fale com o instrutor.";
  }
  if (comLimite) await limparFalhas("login-usuario", identificador);
  redirect(papel === "instrutor" ? "/admin" : "/minha-area");
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/entrar");
}
