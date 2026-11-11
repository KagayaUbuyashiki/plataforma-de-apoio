import type { Metadata } from "next";
import { Titulo } from "@/components/Titulo";
import { RESUMO_DESAFIOS, TRILHAS } from "@/data/desafios";
import { ListaDesafios } from "./ListaDesafios";

export const metadata: Metadata = {
  title: "Desafios de HTML e CSS",
  description: "Exercícios curtos com correção automática: escreva o código e veja as verificações ficarem verdes.",
};

export default function PaginaDesafios() {
  return (
    <>
      <Titulo
        selo="Aprender"
        titulo="Desafios"
        subtitulo="Exercícios curtos com correção na hora: escreva o código e veja cada item ficar verde. Se travar, peça uma dica!"
      />
      <ListaDesafios desafios={RESUMO_DESAFIOS} trilhas={TRILHAS} />
    </>
  );
}
