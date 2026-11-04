import type { Metadata } from "next";
import { Aviso } from "@/components/Aviso";
import { Titulo } from "@/components/Titulo";
import { listarAulas } from "@/lib/dados";
import { aulasJaAvaliadas } from "./actions";
import { FormAvaliacao } from "./FormAvaliacao";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Avaliar aula" };

type Props = { searchParams: Promise<{ aula?: string }> };

export default async function Avaliar({ searchParams }: Props) {
  const { aula } = await searchParams;
  const [{ dados, erro }, avaliadas] = await Promise.all([listarAulas(), aulasJaAvaliadas()]);
  const aulas = dados.filter((a) => a.publicada).reverse(); // mais recente primeiro

  return (
    <div className="mx-auto max-w-2xl">
      <Titulo
        titulo="Avaliar aula"
        subtitulo="Sua avaliação é anônima: não pedimos nome nem e-mail. Seja sincero(a), é assim que as próximas aulas ficam melhores!"
      />
      {erro ? (
        <Aviso tipo="erro">Não foi possível carregar as aulas: {erro}</Aviso>
      ) : aulas.length === 0 ? (
        <Aviso>Ainda não há aulas disponíveis para avaliação.</Aviso>
      ) : (
        <FormAvaliacao aulas={aulas} aulaInicial={aula} avaliadas={avaliadas} />
      )}
    </div>
  );
}
