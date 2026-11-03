import type { Metadata } from "next";
import { Aviso } from "@/components/Aviso";
import { cartao } from "@/components/admin/estilos";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { FormLogin } from "./FormLogin";

export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

export default function Login() {
  return (
    <div className="mx-auto max-w-sm py-8">
      <h1 className="text-2xl font-bold">Área do instrutor</h1>
      <p className="mt-1 text-sm text-slate-600">Acesso restrito aos instrutores e voluntários do programa.</p>
      {!supabaseConfigurado() && (
        <div className="mt-4">
          <Aviso tipo="erro">O Supabase ainda não foi configurado. Siga o passo a passo do README.</Aviso>
        </div>
      )}
      <div className={`${cartao} mt-6`}>
        <FormLogin />
      </div>
    </div>
  );
}
