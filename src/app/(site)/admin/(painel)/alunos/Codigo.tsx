"use client";

import { useState } from "react";
import { Aviso } from "@/components/Aviso";
import { Icone } from "@/components/Icone";
import type { ResultadoCodigo } from "./actions";

/** Mostra o código UMA vez, com botão de copiar. Ele não fica salvo em lugar nenhum. */
export function MostrarCodigo({ resultado }: { resultado: ResultadoCodigo }) {
  const [copiado, setCopiado] = useState(false);
  if (!resultado) return null;
  if (resultado.erro !== undefined) return <Aviso tipo="erro">{resultado.erro}</Aviso>;
  const { codigo, nome } = resultado;
  return (
    <div className="animate-surgir rounded-2xl border-2 border-dashed border-marca-500/50 bg-white/85 p-5">
      <p className="text-sm font-semibold text-tinta-suave">
        Código de acesso de <strong className="text-tinta">{nome}</strong> (vale 7 dias, uma vez só):
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <code className="texto-aurora font-mono text-3xl font-extrabold tracking-[0.15em]">{codigo}</code>
        <button
          type="button"
          className="btn-secundario !px-3.5 !py-1.5"
          onClick={async () => {
            await navigator.clipboard.writeText(codigo);
            setCopiado(true);
          }}
        >
          <Icone nome={copiado ? "check" : "documento"} tamanho={14} espessura={2.2} /> {copiado ? "Copiado" : "Copiar"}
        </button>
      </div>
      <p className="mt-2 text-xs font-medium text-tinta-suave">
        Anote ou passe agora para o aluno: por segurança, este código não aparece de novo. O aluno usa em Entrar → “Tenho um código”.
      </p>
    </div>
  );
}
