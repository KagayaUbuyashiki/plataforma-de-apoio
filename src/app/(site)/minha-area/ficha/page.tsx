import type { Metadata } from "next";
import { Titulo } from "@/components/Titulo";
import { exigirAluno } from "@/lib/auth";
import { FormFichaAluno } from "./FormFichaAluno";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Minha ficha", robots: { index: false } };

export default async function MinhaFicha() {
  const { aluno } = await exigirAluno();
  const s = (v: string | number | null) => (v == null ? "" : String(v));
  return (
    <div className="mx-auto max-w-2xl">
      <Titulo selo="Minha área" titulo="Minha ficha" subtitulo="Atualize os seus dados quando quiser." />
      <FormFichaAluno
        ficha={{
          como_chamar: s(aluno.como_chamar),
          idade: s(aluno.idade),
          escola: s(aluno.escola),
          serie: s(aluno.serie),
          cidade: s(aluno.cidade),
          experiencia: s(aluno.experiencia),
          ja_criou_site: aluno.ja_criou_site == null ? "" : aluno.ja_criou_site ? "sim" : "nao",
          expectativa: s(aluno.expectativa),
          ods_interesse: s(aluno.ods_interesse),
        }}
      />
    </div>
  );
}
