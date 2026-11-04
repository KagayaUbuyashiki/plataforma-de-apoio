import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listarAulas, listarInstrutores } from "@/lib/dados";
import { FormAula } from "../FormAula";

export const metadata: Metadata = { title: "Editar aula", robots: { index: false } };

export default async function EditarAula({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ dados: aulas }, { dados: instrutores }] = await Promise.all([listarAulas(), listarInstrutores()]);
  const aula = aulas.find((a) => a.id === id);
  if (!aula) notFound();
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight">Editar aula {aula.numero}</h1>
      <FormAula aula={aula} instrutores={instrutores} proximoNumero={aula.numero} />
    </>
  );
}
