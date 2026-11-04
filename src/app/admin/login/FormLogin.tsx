"use client";

import { useActionState } from "react";
import { Aviso } from "@/components/Aviso";
import { enviarSemLimpar } from "@/lib/formulario";
import { botao, campo, rotulo } from "@/components/admin/estilos";
import { entrar } from "./actions";

export function FormLogin() {
  const [erro, acao, enviando] = useActionState(entrar, null);
  return (
    <form onSubmit={enviarSemLimpar(acao)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className={rotulo}>E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={campo} />
      </div>
      <div>
        <label htmlFor="senha" className={rotulo}>Senha</label>
        <input id="senha" name="senha" type="password" autoComplete="current-password" required className={campo} />
      </div>
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <button type="submit" disabled={enviando} className={botao}>
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
