"use client";

import Link from "next/link";
import { useActionState } from "react";
import { botao } from "@/components/admin/estilos";
import { Aviso } from "@/components/Aviso";
import type { Ficha } from "@/app/(site)/entrar/codigo/actions";
import { CamposFicha } from "@/app/(site)/entrar/codigo/CamposFicha";
import { enviarSemLimpar } from "@/lib/formulario";
import { salvarFicha } from "./actions";

export function FormFichaAluno({ ficha }: { ficha: Ficha }) {
  const [erro, acao, enviando] = useActionState(salvarFicha, null);
  return (
    <form onSubmit={enviarSemLimpar(acao)} className="flex flex-col gap-5">
      <CamposFicha ficha={ficha} />
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <div className="flex gap-3">
        <button type="submit" disabled={enviando} className={botao}>
          {enviando ? "Salvando…" : "Salvar ficha"}
        </button>
        <Link href="/minha-area" className="btn-secundario">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
