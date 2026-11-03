import type { SupabaseClient } from "@supabase/supabase-js";
import { media } from "@/lib/formatar";
import type { Aula, AvaliacaoAula, AvaliacaoInstrutor, Instrutor, Turma } from "@/lib/tipos";

export type AvaliacaoCompleta = AvaliacaoAula & { avaliacoes_instrutor: AvaliacaoInstrutor[] };

export type Relatorio = {
  turmas: Turma[];
  aulas: Aula[];
  instrutores: Instrutor[];
  avaliacoes: AvaliacaoCompleta[];
  porAula: { aula: Aula; total: number; geral: number | null; conteudo: number | null; ritmo: number | null }[];
  porInstrutor: { instrutor: Instrutor; total: number; clareza: number | null; dominio: number | null; atencao: number | null }[];
  mediaGeral: number | null;
  erro: string | null;
};

/** Junta avaliações, aulas, turmas e instrutores e calcula as médias (filtro opcional por turma). */
export async function montarRelatorio(supabase: SupabaseClient, turmaId?: string): Promise<Relatorio> {
  let consulta = supabase
    .from("avaliacoes_aula")
    .select("*, avaliacoes_instrutor(*)")
    .order("created_at", { ascending: false })
    .range(0, 4999);
  if (turmaId) consulta = consulta.eq("turma_id", turmaId);

  const [av, au, tu, ins] = await Promise.all([
    consulta,
    supabase.from("aulas").select("*").order("numero"),
    supabase.from("turmas").select("*").order("nome"),
    supabase.from("instrutores").select("*").order("nome"),
  ]);

  const avaliacoes = (av.data as AvaliacaoCompleta[]) ?? [];
  const aulas = (au.data as Aula[]) ?? [];
  const instrutores = (ins.data as Instrutor[]) ?? [];
  const todasInst = avaliacoes.flatMap((a) => a.avaliacoes_instrutor);

  const porAula = aulas
    .map((aula) => {
      const doAula = avaliacoes.filter((a) => a.aula_id === aula.id);
      return {
        aula,
        total: doAula.length,
        geral: media(doAula.map((a) => a.nota_geral)),
        conteudo: media(doAula.map((a) => a.nota_conteudo)),
        ritmo: media(doAula.map((a) => a.nota_ritmo)),
      };
    })
    .filter((l) => l.total > 0 || l.aula.publicada);

  const porInstrutor = instrutores.map((instrutor) => {
    const dele = todasInst.filter((a) => a.instrutor_id === instrutor.id);
    return {
      instrutor,
      total: dele.length,
      clareza: media(dele.map((a) => a.nota_clareza)),
      dominio: media(dele.map((a) => a.nota_dominio)),
      atencao: media(dele.map((a) => a.nota_atencao)),
    };
  });

  return {
    turmas: (tu.data as Turma[]) ?? [],
    aulas,
    instrutores,
    avaliacoes,
    porAula,
    porInstrutor,
    mediaGeral: media(avaliacoes.map((a) => a.nota_geral)),
    erro: av.error?.message ?? au.error?.message ?? tu.error?.message ?? ins.error?.message ?? null,
  };
}
