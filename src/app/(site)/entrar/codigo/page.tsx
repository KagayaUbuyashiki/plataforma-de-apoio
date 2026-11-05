import type { Metadata } from "next";
import { Titulo } from "@/components/Titulo";
import { FormCodigo } from "./FormCodigo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Código de acesso", robots: { index: false } };

export default function Codigo() {
  return (
    <div className="mx-auto max-w-2xl">
      <Titulo
        selo="Primeiro acesso"
        titulo="Tenho um código"
        subtitulo="Digite o código que o instrutor te passou. Ele vale uma vez só, por 7 dias."
      />
      <FormCodigo />
    </div>
  );
}
