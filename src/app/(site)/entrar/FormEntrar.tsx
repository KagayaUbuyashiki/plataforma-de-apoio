"use client";

import { useActionState } from "react";
import { botao, campo, rotulo } from "@/components/admin/estilos";
import { Aviso } from "@/components/Aviso";
import { enviarSemLimpar } from "@/lib/formulario";
import { entrar } from "./actions";

export function FormEntrar() {
  const [erro, acao, enviando] = useActionState(entrar, null);
  return (
    <form onSubmit={enviarSemLimpar(acao)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="usuario" className={rotulo}>Usuário</label>
        <input
          id="usuario"
          name="usuario"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={120}
          required
          className={campo}
          placeholder="ex.: maria.silva"
        />
      </div>
      <div>
        <label htmlFor="senha" className={rotulo}>Senha</label>
        <input id="senha" name="senha" type="password" autoComplete="current-password" maxLength={200} required className={campo} />
      </div>
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <button type="submit" disabled={enviando} className={botao}>
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
