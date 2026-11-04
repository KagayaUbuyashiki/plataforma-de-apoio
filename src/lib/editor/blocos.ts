/** Blocos do nível Iniciante: cada um insere código real, já comentado, e explica cada parte. */

export type Parte = { codigo: string; explicacao: string };

export type Bloco = {
  id: string;
  grupo: "Textos" | "Listas" | "Mídia" | "Estrutura" | "Estilo";
  icone: string;
  nome: string;
  descricao: string;
  arquivo: "index.html" | "style.css";
  codigo: string;
  partes: Parte[];
};

export const BLOCOS: Bloco[] = [
  // ---------- Textos ----------
  {
    id: "titulo",
    grupo: "Textos",
    icone: "🔠",
    nome: "Título",
    descricao: "O título principal da página. Use só um por página.",
    arquivo: "index.html",
    codigo: `<!-- <h1> = título principal (heading 1). -->
<h1>Escreva o título aqui</h1>`,
    partes: [
      { codigo: "<h1>", explicacao: "Abre o título. O número vai de 1 (mais importante) até 6." },
      { codigo: "Escreva o título aqui", explicacao: "O texto que vai aparecer. Troque pelo seu!" },
      { codigo: "</h1>", explicacao: "Fecha o título. A barra / indica o fechamento." },
    ],
  },
  {
    id: "subtitulo",
    grupo: "Textos",
    icone: "🔡",
    nome: "Subtítulo",
    descricao: "Título de uma parte (seção) da página.",
    arquivo: "index.html",
    codigo: `<!-- <h2> = subtítulo, um nível abaixo do <h1>. -->
<h2>Escreva o subtítulo aqui</h2>`,
    partes: [
      { codigo: "<h2>", explicacao: "Abre o subtítulo (heading 2)." },
      { codigo: "</h2>", explicacao: "Fecha o subtítulo." },
    ],
  },
  {
    id: "paragrafo",
    grupo: "Textos",
    icone: "📝",
    nome: "Parágrafo",
    descricao: "Um bloco de texto corrido.",
    arquivo: "index.html",
    codigo: `<!-- <p> = parágrafo de texto. -->
<p>Escreva o seu texto aqui. Ele pode ser bem comprido!</p>`,
    partes: [
      { codigo: "<p>", explicacao: "Abre o parágrafo (p de paragraph)." },
      { codigo: "</p>", explicacao: "Fecha o parágrafo. Cada parágrafo começa em uma nova linha." },
    ],
  },
  {
    id: "destaque",
    grupo: "Textos",
    icone: "💪",
    nome: "Texto em destaque",
    descricao: "Deixa uma palavra importante em negrito.",
    arquivo: "index.html",
    codigo: `<!-- <strong> deixa o texto em negrito, mostrando que é importante. -->
<p>Esta parte é <strong>muito importante</strong>!</p>`,
    partes: [
      { codigo: "<strong>", explicacao: "Começa o trecho importante (aparece em negrito)." },
      { codigo: "</strong>", explicacao: "Termina o trecho em negrito. O resto do parágrafo fica normal." },
    ],
  },

  // ---------- Listas ----------
  {
    id: "lista",
    grupo: "Listas",
    icone: "📋",
    nome: "Lista com marcadores",
    descricao: "Uma lista de itens com bolinhas (•).",
    arquivo: "index.html",
    codigo: `<!-- <ul> = lista não ordenada (com bolinhas). -->
<ul>
  <!-- Cada <li> é um item da lista. -->
  <li>Primeiro item</li>
  <li>Segundo item</li>
  <li>Terceiro item</li>
</ul>`,
    partes: [
      { codigo: "<ul>", explicacao: "Abre a lista. ul = unordered list (lista sem ordem, com bolinhas)." },
      { codigo: "<li>…</li>", explicacao: "Um item da lista (li = list item). Para mais itens, copie esta linha." },
      { codigo: "</ul>", explicacao: "Fecha a lista. Todos os <li> precisam ficar entre <ul> e </ul>." },
    ],
  },
  {
    id: "lista-numerada",
    grupo: "Listas",
    icone: "🔢",
    nome: "Lista numerada",
    descricao: "Uma lista com números (1, 2, 3…), boa para passo a passo.",
    arquivo: "index.html",
    codigo: `<!-- <ol> = lista ordenada (numerada). -->
<ol>
  <li>Primeiro passo</li>
  <li>Segundo passo</li>
  <li>Terceiro passo</li>
</ol>`,
    partes: [
      { codigo: "<ol>", explicacao: "Abre a lista numerada. ol = ordered list. Os números aparecem sozinhos!" },
      { codigo: "<li>…</li>", explicacao: "Cada item da lista." },
      { codigo: "</ol>", explicacao: "Fecha a lista numerada." },
    ],
  },

  // ---------- Mídia ----------
  {
    id: "link",
    grupo: "Mídia",
    icone: "🔗",
    nome: "Link",
    descricao: "Um texto clicável que leva para outro site.",
    arquivo: "index.html",
    codigo: `<!-- <a> = link. href é o endereço para onde ele leva.
     target="_blank" abre em uma nova aba. -->
<a href="https://brasil.un.org/pt-br/sdgs" target="_blank">Conheça os ODS</a>`,
    partes: [
      { codigo: "<a", explicacao: "Abre o link (a de anchor, âncora)." },
      { codigo: 'href="…"', explicacao: "O endereço do site para onde o link leva. Precisa começar com https://" },
      { codigo: 'target="_blank"', explicacao: "Faz o link abrir em uma nova aba (opcional)." },
      { codigo: "Conheça os ODS", explicacao: "O texto clicável que aparece na tela." },
      { codigo: "</a>", explicacao: "Fecha o link." },
    ],
  },
  {
    id: "imagem",
    grupo: "Mídia",
    icone: "🖼️",
    nome: "Imagem",
    descricao: "Mostra uma foto ou ilustração.",
    arquivo: "index.html",
    codigo: `<!-- <img> = imagem. src é o endereço da imagem;
     alt descreve a imagem para quem não consegue vê-la. -->
<img src="https://placehold.co/600x300?text=Minha+imagem" alt="Descreva a imagem aqui">`,
    partes: [
      { codigo: "<img", explicacao: "Abre a imagem. Ela NÃO tem tag de fechamento." },
      { codigo: 'src="…"', explicacao: "O endereço da imagem (source = fonte). Pode ser um link da internet." },
      { codigo: 'alt="…"', explicacao: "Texto alternativo: descreve a imagem para leitores de tela. Muito importante para a acessibilidade!" },
    ],
  },

  // ---------- Estrutura ----------
  {
    id: "cabecalho",
    grupo: "Estrutura",
    icone: "🧭",
    nome: "Cabeçalho com menu",
    descricao: "O topo do site, com o nome e um menu de links.",
    arquivo: "index.html",
    codigo: `<!-- <header> = cabeçalho (topo do site). -->
<header>
  <h1>Nome do meu site</h1>
  <!-- <nav> = menu de navegação com links. -->
  <nav>
    <a href="#sobre">Sobre</a>
    <a href="#dados">Dados</a>
    <a href="#ajudar">Como ajudar</a>
  </nav>
</header>`,
    partes: [
      { codigo: "<header>", explicacao: "Agrupa o topo do site: título e menu." },
      { codigo: "<nav>", explicacao: "Agrupa os links do menu (nav = navigation)." },
      { codigo: 'href="#sobre"', explicacao: "O # leva para a parte da página que tem id=\"sobre\"." },
    ],
  },
  {
    id: "secao",
    grupo: "Estrutura",
    icone: "📦",
    nome: "Seção",
    descricao: "Uma parte da página sobre um assunto, com subtítulo e texto.",
    arquivo: "index.html",
    codigo: `<!-- <section> = uma seção (parte) da página.
     id="sobre" dá um nome para os links do menu acharem esta parte. -->
<section id="sobre">
  <h2>Sobre o tema</h2>
  <p>Explique aqui o seu ODS com as suas palavras.</p>
</section>`,
    partes: [
      { codigo: '<section id="sobre">', explicacao: "Abre uma seção. O id é o nome dela (use nomes sem espaço)." },
      { codigo: "<h2> e <p>", explicacao: "Dentro da seção ficam o subtítulo e os textos." },
      { codigo: "</section>", explicacao: "Fecha a seção." },
    ],
  },
  {
    id: "cartao",
    grupo: "Estrutura",
    icone: "🗂️",
    nome: "Cartão",
    descricao: "Uma caixa para destacar uma informação (combine com o bloco de estilo \"Estilo do cartão\").",
    arquivo: "index.html",
    codigo: `<!-- <div> = caixa genérica. class="cartao" dá um nome
     para estilizarmos essa caixa no CSS. -->
<div class="cartao">
  <h3>Você sabia?</h3>
  <p>Escreva aqui uma curiosidade sobre o seu tema.</p>
</div>`,
    partes: [
      { codigo: '<div class="cartao">', explicacao: "Abre uma caixa. A class é o nome usado no CSS (.cartao)." },
      { codigo: "<h3>", explicacao: "Um título pequeno dentro do cartão." },
      { codigo: "</div>", explicacao: "Fecha a caixa." },
    ],
  },
  {
    id: "tabela",
    grupo: "Estrutura",
    icone: "📊",
    nome: "Tabela",
    descricao: "Organiza dados em linhas e colunas.",
    arquivo: "index.html",
    codigo: `<!-- <table> = tabela. <tr> = linha; <th> = célula de título; <td> = célula comum. -->
<table>
  <tr>
    <th>Fonte de energia</th>
    <th>Renovável?</th>
  </tr>
  <tr>
    <td>Solar</td>
    <td>Sim</td>
  </tr>
  <tr>
    <td>Carvão</td>
    <td>Não</td>
  </tr>
</table>`,
    partes: [
      { codigo: "<table>", explicacao: "Abre a tabela." },
      { codigo: "<tr>", explicacao: "Uma linha da tabela (table row)." },
      { codigo: "<th>", explicacao: "Célula de título, aparece em negrito (table header)." },
      { codigo: "<td>", explicacao: "Célula comum com um dado (table data)." },
    ],
  },
  {
    id: "rodape",
    grupo: "Estrutura",
    icone: "🦶",
    nome: "Rodapé",
    descricao: "O fim da página, com autoria e fontes.",
    arquivo: "index.html",
    codigo: `<!-- <footer> = rodapé (final da página). -->
<footer>
  <p>Site feito por Seu Nome · Fontes: ONU Brasil, IBGE</p>
</footer>`,
    partes: [
      { codigo: "<footer>", explicacao: "Abre o rodapé. Coloque seu nome e as fontes que você pesquisou." },
      { codigo: "</footer>", explicacao: "Fecha o rodapé." },
    ],
  },

  // ---------- Estilo (CSS) ----------
  {
    id: "css-fundo",
    grupo: "Estilo",
    icone: "🎨",
    nome: "Cor de fundo",
    descricao: "Muda a cor do fundo da página inteira.",
    arquivo: "style.css",
    codigo: `/* Cor de fundo da página inteira (body = corpo). */
body {
  background-color: #fff6da; /* troque o código da cor! */
}`,
    partes: [
      { codigo: "body", explicacao: "O seletor: escolhe QUEM recebe o estilo. body = a página toda." },
      { codigo: "{ … }", explicacao: "Entre as chaves ficam as regras de estilo." },
      { codigo: "background-color", explicacao: "A propriedade: o que queremos mudar (cor de fundo)." },
      { codigo: "#fff6da;", explicacao: "O valor: a cor em código hexadecimal. Termine sempre com ponto e vírgula." },
    ],
  },
  {
    id: "css-titulos",
    grupo: "Estilo",
    icone: "🖍️",
    nome: "Cor dos títulos",
    descricao: "Muda a cor e o tamanho dos títulos.",
    arquivo: "style.css",
    codigo: `/* Estilo dos títulos h1 e h2 (a vírgula aplica nos dois). */
h1, h2 {
  color: #a47f07;     /* cor do texto */
  font-size: 32px;    /* tamanho da letra */
}`,
    partes: [
      { codigo: "h1, h2", explicacao: "Escolhe todos os <h1> e <h2>. A vírgula separa vários seletores." },
      { codigo: "color", explicacao: "Cor do texto." },
      { codigo: "font-size", explicacao: "Tamanho da letra, em pixels (px)." },
    ],
  },
  {
    id: "css-fonte",
    grupo: "Estilo",
    icone: "🔤",
    nome: "Tipo de letra",
    descricao: "Escolhe a fonte de todo o site.",
    arquivo: "style.css",
    codigo: `/* Tipo de letra de todo o site. */
body {
  font-family: Verdana, sans-serif;
  line-height: 1.6; /* espaço entre as linhas */
}`,
    partes: [
      { codigo: "font-family", explicacao: "A fonte. Coloque mais de uma opção: se a primeira faltar, usa a próxima." },
      { codigo: "line-height", explicacao: "A altura da linha. 1.6 deixa o texto mais fácil de ler." },
    ],
  },
  {
    id: "css-centralizar",
    grupo: "Estilo",
    icone: "↔️",
    nome: "Centralizar texto",
    descricao: "Deixa os títulos centralizados.",
    arquivo: "style.css",
    codigo: `/* Centraliza o texto dos títulos. */
h1, h2 {
  text-align: center;
}`,
    partes: [
      { codigo: "text-align", explicacao: "Alinhamento do texto: left (esquerda), center (centro) ou right (direita)." },
    ],
  },
  {
    id: "css-cartao",
    grupo: "Estilo",
    icone: "🃏",
    nome: "Estilo do cartão",
    descricao: "Deixa o bloco \"Cartão\" bonito: fundo branco, borda arredondada e sombra.",
    arquivo: "style.css",
    codigo: `/* .cartao escolhe os elementos com class="cartao" (o ponto indica classe). */
.cartao {
  background-color: white;
  padding: 16px;                               /* espaço interno */
  margin: 16px 0;                              /* espaço externo */
  border-radius: 12px;                         /* cantos arredondados */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);   /* sombra */
}`,
    partes: [
      { codigo: ".cartao", explicacao: "O ponto escolhe elementos pela class. Aqui: todos com class=\"cartao\"." },
      { codigo: "padding", explicacao: "Espaço DENTRO da caixa, entre a borda e o texto." },
      { codigo: "margin", explicacao: "Espaço FORA da caixa, afastando dos vizinhos." },
      { codigo: "border-radius", explicacao: "Arredonda os cantos." },
      { codigo: "box-shadow", explicacao: "Coloca uma sombra suave em volta." },
    ],
  },
  {
    id: "css-menu",
    grupo: "Estilo",
    icone: "🧷",
    nome: "Estilo do menu",
    descricao: "Deixa os links do menu lado a lado e sem sublinhado.",
    arquivo: "style.css",
    codigo: `/* Links do menu lado a lado, com espaço entre eles. */
nav {
  display: flex;   /* coloca os itens lado a lado */
  gap: 16px;       /* espaço entre os links */
}

/* "nav a" = os links que estão DENTRO do nav. */
nav a {
  color: #0b7a92;
  text-decoration: none; /* tira o sublinhado */
  font-weight: bold;
}`,
    partes: [
      { codigo: "display: flex", explicacao: "Organiza os filhos (os links) lado a lado." },
      { codigo: "gap", explicacao: "Espaço entre os itens." },
      { codigo: "nav a", explicacao: "Escolhe os <a> que estão dentro do <nav> (seletor descendente)." },
      { codigo: "text-decoration: none", explicacao: "Remove o sublinhado dos links." },
    ],
  },
  {
    id: "css-imagens",
    grupo: "Estilo",
    icone: "📐",
    nome: "Imagens que cabem na tela",
    descricao: "Impede que as imagens fiquem maiores que a tela (ótimo no celular).",
    arquivo: "style.css",
    codigo: `/* Imagens nunca passam da largura da tela. */
img {
  max-width: 100%;
  border-radius: 8px;
}`,
    partes: [
      { codigo: "max-width: 100%", explicacao: "A largura máxima é 100% do espaço disponível: a imagem encolhe no celular." },
      { codigo: "border-radius", explicacao: "Arredonda os cantos da imagem." },
    ],
  },
];

export const GRUPOS_BLOCOS = ["Textos", "Listas", "Mídia", "Estrutura", "Estilo"] as const;
