import type { Metadata } from "next";
import { Titulo } from "@/components/Titulo";
import { ERROS } from "@/data/erros";
import { ListaErros } from "./ListaErros";

export const metadata: Metadata = {
  title: "Meu site não funciona!",
  description: "Os erros mais comuns de quem está começando com HTML e CSS, com o porquê e como consertar.",
};

export default function PaginaErros() {
  return (
    <>
      <Titulo
        selo="Aprender"
        titulo="Meu site não funciona!"
        subtitulo="Calma: todo mundo erra, até quem programa há anos. Aqui estão os problemas mais comuns, por que acontecem e como consertar."
      />
      <ListaErros erros={ERROS} />
    </>
  );
}
