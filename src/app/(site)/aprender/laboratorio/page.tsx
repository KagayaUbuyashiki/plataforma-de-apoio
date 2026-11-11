import type { Metadata } from "next";
import { Titulo } from "@/components/Titulo";
import { Laboratorios } from "./Laboratorios";

export const metadata: Metadata = {
  title: "Laboratórios de CSS",
  description: "Mexa nos controles e veja o CSS mudar na hora: caixa (margin, border, padding), cores e textos, e Flexbox.",
};

export default function PaginaLaboratorio() {
  return (
    <>
      <Titulo
        selo="Aprender"
        titulo="Laboratórios de CSS"
        subtitulo="Mexa nos controles e veja o resultado na hora. Quando gostar, copie o CSS gerado para o seu site."
      />
      <Laboratorios />
    </>
  );
}
