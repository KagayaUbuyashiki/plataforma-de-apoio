/** Itens fixos do checklist (as etapas do projeto). As aulas publicadas entram como "aula:<id>". */
export const ETAPAS_PROJETO = [
  { item: "etapa:escolher-ods", titulo: "Escolhi o meu ODS", texto: "Pesquisei os 17 objetivos e escolhi o tema do meu site." },
  { item: "etapa:html", titulo: "Estruturei com HTML", texto: "Montei as páginas com títulos, textos, imagens, listas e links." },
  { item: "etapa:css", titulo: "Dei estilo com CSS", texto: "Cores, fontes, espaçamentos e layout com a minha cara." },
  { item: "etapa:apresentar", titulo: "Apresentei o meu site", texto: "Mostrei o site para a banca de voluntários." },
] as const;

const REGEX_ITEM = /^(aula:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|etapa:(escolher-ods|html|css|apresentar)|desafio:[a-z0-9-]{2,40})$/;

export function itemValido(item: string) {
  return REGEX_ITEM.test(item);
}

export const EXPERIENCIAS = [
  { valor: "nunca", rotulo: "Nunca programei" },
  { valor: "pouco", rotulo: "Já mexi um pouco" },
  { valor: "sim", rotulo: "Já programei antes" },
] as const;
