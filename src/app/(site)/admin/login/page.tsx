import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Aviso } from "@/components/Aviso";
import { botaoSecundario, cartao } from "@/components/admin/estilos";
import { ehInstrutorAutorizado, MSG_NAO_AUTORIZADO } from "@/lib/auth";
import { diagnosticoSupabase, supabaseConfigurado } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { sair } from "./actions";
import { FormLogin } from "./FormLogin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

export default async function Login() {
  let naoAutorizado = false;
  if (supabaseConfigurado()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      if (await ehInstrutorAutorizado(supabase)) redirect("/admin");
      naoAutorizado = true;
    }
  }

  return (
    <div className="mx-auto max-w-sm py-8">
      <h1 className="text-2xl font-extrabold tracking-tight">Área do instrutor</h1>
      <p className="mt-1 text-sm text-tinta-suave">Acesso restrito aos instrutores e voluntários do programa.</p>
      {!supabaseConfigurado() && (
        <div className="mt-4">
          <Aviso tipo="erro">O Supabase ainda não foi configurado. Siga o passo a passo do README. Diagnóstico: {diagnosticoSupabase()}.</Aviso>
        </div>
      )}
      {naoAutorizado ? (
        <div className={`${cartao} mt-6 flex flex-col gap-4`}>
          <Aviso tipo="erro">{MSG_NAO_AUTORIZADO}</Aviso>
          <form action={sair}>
            <button type="submit" className={botaoSecundario}>Sair e entrar com outra conta</button>
          </form>
        </div>
      ) : (
        <div className={`${cartao} mt-6`}>
          <FormLogin />
        </div>
      )}
    </div>
  );
}
