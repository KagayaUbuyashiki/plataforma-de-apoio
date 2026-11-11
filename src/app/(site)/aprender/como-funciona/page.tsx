import type { Metadata } from "next";
import { HistoriaWeb } from "@/components/aprender/HistoriaWeb";
import { Titulo } from "@/components/Titulo";

export const metadata: Metadata = {
  title: "Como a web funciona",
  description: "O que acontece quando você abre um site: navegador, servidor, HTML e CSS, explicado em 5 passos animados.",
};

export default function PaginaComoFunciona() {
  return (
    <>
      <Titulo
        selo="Aprender"
        titulo="Como a web funciona"
        subtitulo="O que acontece entre digitar um endereço e a página aparecer na tela? Avance pelos 5 passos."
      />
      <HistoriaWeb />
    </>
  );
}
