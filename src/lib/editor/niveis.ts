import type { Arquivos, Nivel } from "./tipos";

export type ConfigNivel = {
  id: Nivel;
  nome: string;
  icone: string;
  resumo: string;
  recursos: string[];
  /** Pode criar, renomear e apagar arquivos e pastas. */
  gerenciaArquivos: boolean;
  blocos: boolean;
  missoes: boolean;
  /** Autocompletar e explicações em português (glossário da plataforma). */
  ajudaPortugues: boolean;
  /** Atalhos do VS Code: "!" + Tab, ul>li*3, etc. */
  emmet: boolean;
  arquivosIniciais: () => Arquivos;
};

const HTML_INICIANTE = `<!DOCTYPE html>
<!-- ⬆ Avisa ao navegador que este arquivo é uma página HTML moderna. -->

<!-- <html> envolve TODO o documento. lang="pt-BR" diz que o conteúdo está em português. -->
<html lang="pt-BR">

  <!-- <head> guarda informações SOBRE a página. Nada daqui aparece na tela. -->
  <head>
    <!-- charset="UTF-8" permite usar acentos: á, ç, ã... -->
    <meta charset="UTF-8">
    <!-- Faz o site se ajustar à tela do celular. -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <title> é o texto que aparece na aba do navegador. -->
    <title>Meu Primeiro Site</title>
    <!-- <link> liga o arquivo de estilo (cores, fontes...) a esta página. -->
    <link rel="stylesheet" href="style.css">
  </head>

  <!-- <body> é o CORPO: tudo o que aparece na tela fica aqui dentro. -->
  <body>

    <!-- <h1> é o título principal da página. -->
    <h1>Olá, mundo!</h1>

    <!-- <p> é um parágrafo de texto. -->
    <p>Este é o meu primeiro site. Clique nos blocos ao lado para adicionar mais coisas!</p>

  </body>
</html>
`;

const CSS_INICIANTE = `/* Este é o arquivo de ESTILO (CSS).
   Aqui você escolhe cores, tamanhos e fontes.
   A regra é: seletor { propriedade: valor; } */

/* "body" escolhe o corpo inteiro da página. */
body {
  /* font-family: o tipo de letra. */
  font-family: Arial, sans-serif;
  /* background-color: a cor do fundo. */
  background-color: #f5f5f5;
  /* color: a cor do texto. */
  color: #1f2937;
  /* padding: espaço interno nas bordas da página. */
  padding: 24px;
}

/* "h1" escolhe todos os títulos principais. */
h1 {
  color: #0b7a92;
}
`;

const HTML_INTERMEDIARIO = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meu site sobre o ODS</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Comece a digitar aqui. Dica: digite "h" e veja as sugestões! -->

</body>
</html>
`;

const CSS_INTERMEDIARIO = `/* Estilos do site. Dica: digite "col" e veja as sugestões. */

`;

export const NIVEIS: ConfigNivel[] = [
  {
    id: "iniciante",
    nome: "Iniciante",
    icone: "🧩",
    resumo: "Monte o site com blocos. Cada bloco coloca o código pronto e explica o que cada parte faz.",
    recursos: ["Arquivos já criados e comentados", "Paleta de blocos com explicação", "Missões para cumprir"],
    gerenciaArquivos: false,
    blocos: true,
    missoes: true,
    ajudaPortugues: true,
    emmet: false,
    arquivosIniciais: () => ({ "index.html": HTML_INICIANTE, "style.css": CSS_INICIANTE }),
  },
  {
    id: "intermediario",
    nome: "Intermediário",
    icone: "⌨️",
    resumo: "Agora você digita! O editor sugere as tags e propriedades enquanto você escreve, com explicação em português.",
    recursos: ["Estrutura básica pronta", "Autocompletar com explicação", "Explicação ao passar o mouse", "Missões para cumprir"],
    gerenciaArquivos: false,
    blocos: false,
    missoes: true,
    ajudaPortugues: true,
    emmet: false,
    arquivosIniciais: () => ({ "index.html": HTML_INTERMEDIARIO, "style.css": CSS_INTERMEDIARIO }),
  },
  {
    id: "livre",
    nome: "Livre",
    icone: "🚀",
    resumo: "Como no VS Code: você cria os arquivos, dá os nomes e organiza as pastas. Digite ! e Tab para gerar o documento.",
    recursos: ["Crie arquivos e pastas", "Atalhos Emmet (!, ul>li*3…)", "Envie imagens", "Várias páginas com links"],
    gerenciaArquivos: true,
    blocos: false,
    missoes: false,
    ajudaPortugues: false,
    emmet: true,
    arquivosIniciais: () => ({}),
  },
];

export function getNivel(id: string): ConfigNivel | undefined {
  return NIVEIS.find((n) => n.id === id);
}
