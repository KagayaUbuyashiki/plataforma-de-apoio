import { RESUMO_DESAFIOS, type Trilha } from "@/data/desafios";
import type { NomeIcone } from "@/components/Icone";

/** Medalhas calculadas a partir do que o aluno já fez (checklist, desafios e quizzes). */
export type Conquista = { id: string; titulo: string; texto: string; icone: NomeIcone; cor: string; ganha: boolean };

export type DadosConquistas = {
  itens: string[]; // itens do progresso_aluno ("aula:…", "etapa:…", "desafio:…")
  aulasPublicadas: string[]; // ids
  quizzes?: { acertos: number; total: number }[];
  odsInteresse?: number | null;
  /** Laboratórios abertos (só existe no navegador do aluno). */
  labs?: string[] | null;
};

const desafiosDaTrilha = (t: Trilha) => RESUMO_DESAFIOS.filter((d) => d.trilha === t).map((d) => `desafio:${d.slug}`);

export function calcularConquistas(d: DadosConquistas): Conquista[] {
  const feitos = new Set(d.itens);
  const trilhaCompleta = (t: Trilha) => desafiosDaTrilha(t).every((i) => feitos.has(i));
  const desafios = d.itens.filter((i) => i.startsWith("desafio:")).length;
  const todasAulas = d.aulasPublicadas.length > 0 && d.aulasPublicadas.every((id) => feitos.has(`aula:${id}`));

  return [
    { id: "primeiro-passo", titulo: "Primeiro passo", texto: "Marcou o primeiro item do checklist.", icone: "foguete", cor: "#0ea5c6", ganha: feitos.size > 0 },
    { id: "ods", titulo: "Tema escolhido", texto: "Escolheu o ODS do seu site.", icone: "alvo", cor: "#ec4899", ganha: feitos.has("etapa:escolher-ods") || Boolean(d.odsInteresse) },
    { id: "desafiante", titulo: "Desafiante", texto: "Resolveu 5 desafios.", icone: "estrela", cor: "#f59e0b", ganha: desafios >= 5 },
    { id: "html", titulo: "Desbravador(a) do HTML", texto: "Completou a trilha HTML básico.", icone: "codigo", cor: "#0ea5c6", ganha: trilhaCompleta("html") },
    { id: "css", titulo: "Estilista", texto: "Completou a trilha Primeiros estilos.", icone: "paleta", cor: "#ec4899", ganha: trilhaCompleta("css") },
    { id: "layout", titulo: "Mestre do layout", texto: "Completou a trilha Caixas e layout.", icone: "grafico", cor: "#6366f1", ganha: trilhaCompleta("layout") },
    { id: "nota-10", titulo: "Nota 10", texto: "Acertou todas as perguntas de um quiz.", icone: "check", cor: "#10b981", ganha: (d.quizzes ?? []).some((q) => q.total > 0 && q.acertos === q.total) },
    { id: "assiduo", titulo: "Presença garantida", texto: "Marcou todas as aulas publicadas.", icone: "livro", cor: "#14b8a6", ganha: todasAulas },
    { id: "curioso", titulo: "Curioso(a)", texto: "Abriu os 3 laboratórios de CSS.", icone: "lupa", cor: "#8b5cf6", ganha: (d.labs ?? []).length >= 3 },
    { id: "apresentou", titulo: "Site no ar!", texto: "Apresentou o site para a banca.", icone: "festa", cor: "#E5243B", ganha: feitos.has("etapa:apresentar") },
  ];
}
