import type { Metadata } from "next";
import { listarAulas, listarInstrutores } from "@/lib/dados";
import { FormAula } from "../FormAula";

export const metadata: Metadata = { title: "Nova aula", robots: { index: false } };

export default async function NovaAula() {
  const [{ dados: aulas }, { dados: instrutores }] = await Promise.all([listarAulas(), listarInstrutores()]);
  const proximo = Math.max(0, ...aulas.map((a) => a.numero)) + 1;
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight">Nova aula</h1>
      <FormAula instrutores={instrutores} proximoNumero={proximo} />
    </>
  );
}
