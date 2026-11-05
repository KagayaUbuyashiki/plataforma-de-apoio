import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Aviso } from "@/components/Aviso";
import { Icone, IconeCaixa } from "@/components/Icone";
import { papelDaSessao } from "@/lib/auth";
import { MSG_CONTA_REDEFINIDA } from "@/lib/contas";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { FormEntrar } from "./FormEntrar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

type Props = { searchParams: Promise<{ aviso?: string }> };

export default async function Entrar({ searchParams }: Props) {
  const { aviso } = await searchParams;
  if (supabaseConfigurado()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const papel = await papelDaSessao(supabase);
      if (papel === "instrutor") redirect("/admin");
      if (papel === "aluno") redirect("/minha-area");
    }
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 py-4 md:grid-cols-[1.1fr_1fr]">
      <div data-revelar className="vidro-forte rounded-3xl p-7 sm:p-9">
        <span className="chip">Área do aluno e do instrutor</span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Entrar</h1>
        <p className="mt-2 font-medium text-tinta-suave">Use o usuário e a senha que você criou.</p>
        {aviso === "redefinida" && (
          <div className="mt-5">
            <Aviso>{MSG_CONTA_REDEFINIDA}</Aviso>
          </div>
        )}
        <div className="mt-6">
          <FormEntrar />
        </div>
      </div>

      <Link
        href="/entrar/codigo"
        data-revelar
        style={{ "--d": 1 } as React.CSSProperties}
        className="vidro group flex flex-col justify-between rounded-3xl p-7 transition duration-500 hover:-translate-y-1 hover:bg-white/85 sm:p-9"
      >
        <div>
          <IconeCaixa nome="cadeado" cor="linear-gradient(135deg,#0ea5c6,#6366f1)" tamanho={52} className="transition duration-500 group-hover:-rotate-6" />
          <h2 className="mt-5 text-xl font-extrabold">Primeiro acesso? Tenho um código</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-tinta-suave">
            O instrutor te passa um código de acesso. Com ele você preenche a sua ficha e cria o seu usuário e a sua senha. Se a sua
            conta foi redefinida, use o código novo aqui também.
          </p>
        </div>
        <span className="mt-6 flex items-center gap-1.5 text-sm font-bold text-marca-600">
          Usar meu código <Icone nome="seta" tamanho={14} espessura={2.2} className="seta-anda" />
        </span>
      </Link>
    </div>
  );
}
