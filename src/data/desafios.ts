import {
  $,
  $$,
  cssTem,
  ehAmarelo,
  ehBranco,
  ehClara,
  ehTransparente,
  ehVermelho,
  estilo,
  px,
  tem,
  texto,
  type Verificacao,
} from "@/lib/desafios/verificar";

export type Trilha = "html" | "css" | "layout";

export type Desafio = {
  slug: string;
  trilha: Trilha;
  titulo: string;
  enunciado: string;
  html: string;
  css: string;
  verificacoes: Verificacao[];
  dicas: string[];
  solucao: { html: string; css: string };
};

export const TRILHAS: { id: Trilha; titulo: string; texto: string; cor: string }[] = [
  { id: "html", titulo: "HTML básico", texto: "Títulos, textos, listas, links, imagens e a estrutura da página.", cor: "#0ea5c6" },
  { id: "css", titulo: "Primeiros estilos", texto: "Cores, fundo, tamanho e alinhamento do texto, e classes.", cor: "#ec4899" },
  { id: "layout", titulo: "Caixas e layout", texto: "Espaços, bordas, sombras e Flexbox para organizar a página.", cor: "#6366f1" },
];

const CARTAO_HTML = '<div class="cartao">\n  <h2>Vida na Água</h2>\n  <p>Os oceanos produzem boa parte do oxigênio que respiramos.</p>\n</div>';

export const DESAFIOS: Desafio[] = [
  // ---------- HTML ----------
  {
    slug: "titulo-e-paragrafo",
    trilha: "html",
    titulo: "Título e parágrafo",
    enunciado: "Crie um título principal (<h1>) com o tema do seu site e, embaixo dele, um parágrafo (<p>) explicando o tema.",
    html: "<!-- Escreva aqui embaixo -->\n",
    css: "",
    verificacoes: [
      { texto: "Tem um <h1> com texto", ok: (c) => texto($(c, "h1")).length >= 3 },
      { texto: "Tem um <p> com pelo menos 20 letras", ok: (c) => $$(c, "p").some((p) => texto(p).length >= 20) },
      { texto: "O <h1> vem antes do <p>", ok: (c) => { const h = $(c, "h1"), p = $(c, "p"); return Boolean(h && p && h.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING); } },
    ],
    dicas: ["O título fica entre <h1> e </h1>.", "Depois, escreva o texto entre <p> e </p>, na linha de baixo."],
    solucao: { html: "<h1>Vida na Água</h1>\n<p>Os oceanos cobrem mais de 70% do planeta e precisam da nossa ajuda.</p>", css: "" },
  },
  {
    slug: "lista",
    trilha: "html",
    titulo: "Lista de ações",
    enunciado: "Faça uma lista com pelo menos 3 ações que ajudam o planeta. Pode ser com marcadores (<ul>) ou numerada (<ol>).",
    html: "<h2>Como ajudar</h2>\n",
    css: "",
    verificacoes: [
      { texto: "Tem uma lista <ul> ou <ol>", ok: (c) => tem(c, "ul, ol") },
      { texto: "A lista tem pelo menos 3 itens <li>", ok: (c) => tem(c, "ul li, ol li", 3) },
      { texto: "Todos os itens têm texto", ok: (c) => $$(c, "li").length > 0 && $$(c, "li").every((li) => texto(li).length >= 2) },
    ],
    dicas: ["Abra a lista com <ul> e feche com </ul>.", "Cada item fica dentro de <li> … </li>, entre a abertura e o fechamento da lista."],
    solucao: { html: "<h2>Como ajudar</h2>\n<ul>\n  <li>Economizar água</li>\n  <li>Separar o lixo</li>\n  <li>Plantar árvores</li>\n</ul>", css: "" },
  },
  {
    slug: "link",
    trilha: "html",
    titulo: "Link para outro site",
    enunciado: "Crie um link com o texto \"ONU Brasil\" que leve para https://brasil.un.org e abra numa nova aba.",
    html: "<p>Saiba mais no site da ONU:</p>\n",
    css: "",
    verificacoes: [
      { texto: "Tem um link <a>", ok: (c) => tem(c, "a") },
      { texto: "O href começa com https://", ok: (c) => $$(c, "a").some((a) => /^https:\/\//.test(a.getAttribute("href") ?? "")) },
      { texto: "O link leva para brasil.un.org", ok: (c) => $$(c, "a").some((a) => (a.getAttribute("href") ?? "").includes("brasil.un.org")) },
      { texto: "Abre em nova aba (target=\"_blank\")", ok: (c) => $$(c, "a").some((a) => a.getAttribute("target") === "_blank") },
      { texto: "O link tem um texto para clicar", ok: (c) => $$(c, "a").some((a) => texto(a).length >= 2) },
    ],
    dicas: ['O endereço vai no atributo href: <a href="https://...">.', 'Para abrir em nova aba, acrescente target="_blank" dentro da tag <a>.'],
    solucao: { html: '<p>Saiba mais no site da ONU:</p>\n<a href="https://brasil.un.org" target="_blank">ONU Brasil</a>', css: "" },
  },
  {
    slug: "imagem",
    trilha: "html",
    titulo: "Imagem com descrição",
    enunciado: "Coloque uma imagem usando o arquivo \"praia.jpg\" e escreva uma descrição no alt, para quem não consegue ver a imagem.",
    html: "<h2>Praia limpa</h2>\n",
    css: "",
    verificacoes: [
      { texto: "Tem uma tag <img>", ok: (c) => tem(c, "img") },
      { texto: "O src aponta para praia.jpg", ok: (c) => $$(c, "img").some((i) => (i.getAttribute("src") ?? "").trim() === "praia.jpg") },
      { texto: "O alt descreve a imagem (pelo menos 10 letras)", ok: (c) => $$(c, "img").some((i) => (i.getAttribute("alt") ?? "").trim().length >= 10) },
    ],
    dicas: ["A imagem não tem fechamento: é só <img ...>.", 'Use dois atributos: src="praia.jpg" e alt="o que aparece na foto".'],
    solucao: { html: '<h2>Praia limpa</h2>\n<img src="praia.jpg" alt="Praia com areia limpa e mar azul">', css: "" },
  },
  {
    slug: "estrutura",
    trilha: "html",
    titulo: "Estrutura da página",
    enunciado: "Organize a página em três partes: <header> com o <h1>, <main> com um parágrafo e <footer> com o seu nome.",
    html: "<h1>Energia Limpa</h1>\n<p>A energia do sol e do vento não polui.</p>\n<p>Feito por: seu nome</p>\n",
    css: "",
    verificacoes: [
      { texto: "Tem <header>, <main> e <footer>", ok: (c) => tem(c, "header") && tem(c, "main") && tem(c, "footer") },
      { texto: "O <h1> está dentro do <header>", ok: (c) => tem(c, "header h1") },
      { texto: "Tem um parágrafo dentro do <main>", ok: (c) => $$(c, "main p").some((p) => texto(p).length > 0) },
      { texto: "O <footer> tem texto", ok: (c) => texto($(c, "footer")).length >= 3 },
    ],
    dicas: ["Envolva o <h1> com <header> e </header>.", "Faça o mesmo com o parágrafo (<main>) e com a linha final (<footer>)."],
    solucao: { html: "<header>\n  <h1>Energia Limpa</h1>\n</header>\n<main>\n  <p>A energia do sol e do vento não polui.</p>\n</main>\n<footer>\n  <p>Feito por: Ana</p>\n</footer>", css: "" },
  },

  // ---------- CSS ----------
  {
    slug: "cor-do-titulo",
    trilha: "css",
    titulo: "Título vermelho",
    enunciado: "No CSS, deixe o título <h1> com a cor vermelha.",
    html: "<h1>Erradicação da Pobreza</h1>\n<p>Ninguém deve ficar para trás.</p>",
    css: "/* Escreva o CSS aqui */\n",
    verificacoes: [
      { texto: "Tem uma regra para o h1 no CSS", ok: (c) => cssTem(c, /(^|[\s,}])h1\s*[{,]/) },
      { texto: "O título está vermelho", ok: (c) => ehVermelho(estilo(c, "h1", "color")) },
      { texto: "O parágrafo continua com a cor normal", ok: (c) => !ehVermelho(estilo(c, "p", "color")) },
    ],
    dicas: ["Comece com o seletor h1 e abra chaves: h1 { }.", "Dentro das chaves, use a propriedade color: color: red;"],
    solucao: { html: "<h1>Erradicação da Pobreza</h1>\n<p>Ninguém deve ficar para trás.</p>", css: "h1 {\n  color: red;\n}" },
  },
  {
    slug: "fundo-da-pagina",
    trilha: "css",
    titulo: "Cor de fundo",
    enunciado: "Mude a cor de fundo da página inteira (o body) para uma cor clara, diferente de branco.",
    html: "<h1>Vida Terrestre</h1>\n<p>As florestas são a casa de milhões de espécies.</p>",
    css: "",
    verificacoes: [
      { texto: "Tem uma regra para o body", ok: (c) => cssTem(c, /(^|[\s,}])body\s*[{,]/) },
      { texto: "O fundo não é branco nem transparente", ok: (c) => { const v = estilo(c, "body", "background-color"); return !ehTransparente(v) && !ehBranco(v); } },
      { texto: "O fundo é claro (o texto continua fácil de ler)", ok: (c) => ehClara(estilo(c, "body", "background-color")) },
    ],
    dicas: ["Use o seletor body.", "A propriedade é background-color. Cores claras: #e8f5e9, lightyellow, #e0f2fe…"],
    solucao: { html: "<h1>Vida Terrestre</h1>\n<p>As florestas são a casa de milhões de espécies.</p>", css: "body {\n  background-color: #e8f5e9;\n}" },
  },
  {
    slug: "tamanho-da-letra",
    trilha: "css",
    titulo: "Letra maior",
    enunciado: "Deixe o texto do parágrafo maior: com 20px ou mais.",
    html: "<p>Educação de qualidade muda a vida das pessoas.</p>",
    css: "",
    verificacoes: [
      { texto: "Usa a propriedade font-size", ok: (c) => cssTem(c, /font-size\s*:/) },
      { texto: "O parágrafo tem 20px ou mais", ok: (c) => px(estilo(c, "p", "font-size")) >= 20 },
    ],
    dicas: ["O seletor do parágrafo é p.", "font-size: 22px; deixa a letra com 22 pixels."],
    solucao: { html: "<p>Educação de qualidade muda a vida das pessoas.</p>", css: "p {\n  font-size: 22px;\n}" },
  },
  {
    slug: "centralizar-texto",
    trilha: "css",
    titulo: "Título no centro",
    enunciado: "Centralize o título <h1> na página.",
    html: "<h1>Igualdade de Gênero</h1>\n<p>Direitos iguais para todas as pessoas.</p>",
    css: "",
    verificacoes: [
      { texto: "O título está centralizado", ok: (c) => estilo(c, "h1", "text-align") === "center" },
      { texto: "O parágrafo continua alinhado à esquerda", ok: (c) => ["start", "left"].includes(estilo(c, "p", "text-align")) },
    ],
    dicas: ["A propriedade para alinhar texto é text-align.", "h1 { text-align: center; }"],
    solucao: { html: "<h1>Igualdade de Gênero</h1>\n<p>Direitos iguais para todas as pessoas.</p>", css: "h1 {\n  text-align: center;\n}" },
  },
  {
    slug: "classe-destaque",
    trilha: "css",
    titulo: "Uma classe só sua",
    enunciado: "Crie no CSS a classe .destaque com fundo amarelo e coloque class=\"destaque\" em UM dos parágrafos.",
    html: "<p>Energia solar.</p>\n<p>Energia eólica.</p>\n<p>Energia das águas.</p>",
    css: "",
    verificacoes: [
      { texto: "O CSS tem a regra .destaque", ok: (c) => cssTem(c, /\.destaque\s*[{,]/) },
      { texto: "Um parágrafo tem class=\"destaque\"", ok: (c) => tem(c, "p.destaque") },
      { texto: "Só um parágrafo está destacado", ok: (c) => $$(c, "p.destaque").length === 1 },
      { texto: "O destaque tem fundo amarelo", ok: (c) => ehAmarelo(estilo(c, ".destaque", "background-color")) },
    ],
    dicas: ['No HTML: <p class="destaque">…</p> (sem o ponto).', "No CSS, com ponto: .destaque { background-color: yellow; }"],
    solucao: { html: '<p>Energia solar.</p>\n<p class="destaque">Energia eólica.</p>\n<p>Energia das águas.</p>', css: ".destaque {\n  background-color: yellow;\n}" },
  },

  // ---------- Layout ----------
  {
    slug: "espacamento",
    trilha: "layout",
    titulo: "Espaço para respirar",
    enunciado: "O cartão está apertado. Dê pelo menos 16px de padding (espaço de dentro) e 24px de margin (espaço de fora) à .cartao.",
    html: CARTAO_HTML,
    css: ".cartao {\n  background-color: #e0f2fe;\n}\n",
    verificacoes: [
      { texto: "padding de 16px ou mais em todos os lados", ok: (c) => ["top", "right", "bottom", "left"].every((l) => px(estilo(c, ".cartao", `padding-${l}`)) >= 16) },
      { texto: "margin de 24px ou mais", ok: (c) => ["top", "bottom"].every((l) => px(estilo(c, ".cartao", `margin-${l}`)) >= 24) },
    ],
    dicas: ["padding afasta o texto da borda; margin afasta o cartão do resto.", "Dentro da .cartao: padding: 16px; margin: 24px;"],
    solucao: { html: CARTAO_HTML, css: ".cartao {\n  background-color: #e0f2fe;\n  padding: 16px;\n  margin: 24px;\n}" },
  },
  {
    slug: "borda-arredondada",
    trilha: "layout",
    titulo: "Borda e cantos redondos",
    enunciado: "Coloque uma borda de 2px na .cartao e arredonde os cantos (border-radius de 12px ou mais).",
    html: CARTAO_HTML,
    css: ".cartao {\n  padding: 16px;\n}\n",
    verificacoes: [
      { texto: "Tem borda de 2px ou mais", ok: (c) => px(estilo(c, ".cartao", "border-top-width")) >= 2 && estilo(c, ".cartao", "border-top-style") !== "none" },
      { texto: "Cantos arredondados (12px ou mais)", ok: (c) => px(estilo(c, ".cartao", "border-top-left-radius")) >= 12 },
    ],
    dicas: ["A borda precisa de espessura, estilo e cor: border: 2px solid #0A97D9;", "Para arredondar: border-radius: 16px;"],
    solucao: { html: CARTAO_HTML, css: ".cartao {\n  padding: 16px;\n  border: 2px solid #0A97D9;\n  border-radius: 16px;\n}" },
  },
  {
    slug: "sombra",
    trilha: "layout",
    titulo: "Cartão com sombra",
    enunciado: "Faça o cartão \"flutuar\": coloque uma sombra (box-shadow) na .cartao.",
    html: CARTAO_HTML,
    css: ".cartao {\n  padding: 16px;\n  margin: 16px;\n  border-radius: 12px;\n  background-color: white;\n}\n",
    verificacoes: [{ texto: "A .cartao tem sombra", ok: (c) => !["", "none"].includes(estilo(c, ".cartao", "box-shadow")) }],
    dicas: ["A propriedade é box-shadow.", "Experimente: box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);"],
    solucao: { html: CARTAO_HTML, css: ".cartao {\n  padding: 16px;\n  margin: 16px;\n  border-radius: 12px;\n  background-color: white;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n}" },
  },
  {
    slug: "menu-lado-a-lado",
    trilha: "layout",
    titulo: "Menu lado a lado",
    enunciado: "Os links do menu estão um embaixo do outro. Use display: flex no <nav> para deixá-los lado a lado, com um espaço (gap) entre eles.",
    html: '<nav>\n  <a href="#">Início</a>\n  <a href="#">Sobre</a>\n  <a href="#">Contato</a>\n</nav>',
    css: "nav a {\n  display: block;\n  background-color: #0A97D9;\n  color: white;\n  padding: 8px 12px;\n}\n",
    verificacoes: [
      { texto: "O <nav> usa display: flex", ok: (c) => estilo(c, "nav", "display") === "flex" },
      { texto: "Os links ficaram lado a lado", ok: (c) => { const a = $$(c, "nav a"); return a.length >= 2 && Math.abs(a[0].getBoundingClientRect().top - a[a.length - 1].getBoundingClientRect().top) < 2; } },
      { texto: "Tem espaço entre os links (gap)", ok: (c) => px(estilo(c, "nav", "column-gap")) > 0 },
    ],
    dicas: ["Crie uma regra para o nav: nav { }.", "Dentro dela: display: flex; gap: 12px;"],
    solucao: { html: '<nav>\n  <a href="#">Início</a>\n  <a href="#">Sobre</a>\n  <a href="#">Contato</a>\n</nav>', css: "nav a {\n  display: block;\n  background-color: #0A97D9;\n  color: white;\n  padding: 8px 12px;\n}\nnav {\n  display: flex;\n  gap: 12px;\n}" },
  },
  {
    slug: "centralizar-com-flex",
    trilha: "layout",
    titulo: "Centro perfeito",
    enunciado: "Centralize a caixa .conteudo bem no meio da .tela (na horizontal e na vertical) usando flex.",
    html: '<div class="tela">\n  <div class="conteudo">Bem no meio!</div>\n</div>',
    css: ".tela {\n  height: 220px;\n  background-color: #ede9fe;\n}\n.conteudo {\n  background-color: #6366f1;\n  color: white;\n  padding: 16px;\n}\n",
    verificacoes: [
      { texto: "A .tela usa display: flex", ok: (c) => estilo(c, ".tela", "display") === "flex" },
      { texto: "Centralizada na horizontal (justify-content)", ok: (c) => estilo(c, ".tela", "justify-content") === "center" },
      { texto: "Centralizada na vertical (align-items)", ok: (c) => estilo(c, ".tela", "align-items") === "center" },
    ],
    dicas: ["Quem organiza é o \"pai\": as regras vão na .tela, não na .conteudo.", "display: flex; justify-content: center; align-items: center;"],
    solucao: { html: '<div class="tela">\n  <div class="conteudo">Bem no meio!</div>\n</div>', css: ".tela {\n  height: 220px;\n  background-color: #ede9fe;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.conteudo {\n  background-color: #6366f1;\n  color: white;\n  padding: 16px;\n}" },
  },
];

export const DESAFIO_POR_SLUG = new Map(DESAFIOS.map((d) => [d.slug, d]));

/** Dados "seguros" para listar (sem funções), usados por componentes do servidor. */
export const RESUMO_DESAFIOS = DESAFIOS.map(({ slug, trilha, titulo, enunciado }) => ({ slug, trilha, titulo, enunciado }));
