import type { Metadata } from "next";
import { Titulo } from "@/components/Titulo";
import { VERBETES } from "@/data/dicionario";
import { Dicionario } from "./Dicionario";

export const metadata: Metadata = {
  title: "Dicionário de HTML e CSS",
  description: "Cada tag HTML e propriedade CSS explicada em português simples, com o código e o resultado ao vivo.",
};

export default function PaginaDicionario() {
  return (
    <>
      <Titulo
        selo="Aprender"
        titulo="Dicionário visual"
        subtitulo="Cada tag do HTML e cada propriedade do CSS explicada em palavras simples, com o código e o resultado lado a lado. Copie e use no seu site!"
      />
      <Dicionario verbetes={VERBETES} />
    </>
  );
}
