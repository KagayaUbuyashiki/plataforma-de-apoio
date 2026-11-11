/**
 * Erros mais comuns de quem está começando com HTML e CSS.
 * Cada erro tem o código "antes" (com o problema) e "depois" (consertado).
 * As linhas em destacarAntes/destacarDepois são numeradas a partir de 1.
 */
export type Exemplo = { html: string; css?: string; destacarHtml?: number[]; destacarCss?: number[] };

export type ErroComum = {
  id: string;
  titulo: string;
  sintoma: string;
  porque: string;
  comoConsertar: string;
  palavras: string; // para a busca
  antes: Exemplo;
  depois: Exemplo;
  /** Quando o resultado não dá para mostrar num exemplo (ex.: arquivo que não existe). */
  observacao?: string;
};

export const ERROS: ErroComum[] = [
  {
    id: "tag-nao-fechada",
    titulo: "Esqueci de fechar uma tag",
    sintoma: "Um pedaço da página ficou todo em negrito, grande ou com o estilo errado, até o final.",
    porque: "Toda tag que abre (<strong>) precisa fechar (</strong>). Sem o fechamento, o navegador continua aplicando o efeito em tudo o que vem depois.",
    comoConsertar: "Procure a tag que abriu e coloque o fechamento com a barra / no lugar certo.",
    palavras: "negrito tudo fechar barra strong",
    antes: { html: "<p>Isso é <strong>importante.</p>\n<p>Mas isso não deveria estar em negrito.</p>", destacarHtml: [1] },
    depois: { html: "<p>Isso é <strong>importante</strong>.</p>\n<p>Agora só a palavra certa está em negrito.</p>", destacarHtml: [1] },
  },
  {
    id: "css-nao-carrega",
    titulo: "Meu CSS não funciona",
    sintoma: "Você escreveu o CSS, mas a página continua sem cor, sem estilo nenhum.",
    porque: "O <link> no <head> é a ponte entre o HTML e o arquivo de estilo. Se o nome do arquivo no href estiver diferente (style.css × estilo.css) ou faltar rel=\"stylesheet\", o navegador não acha o CSS.",
    comoConsertar: "Confira se o href tem exatamente o mesmo nome do arquivo, incluindo maiúsculas e a pasta (ex.: css/style.css).",
    palavras: "css nao funciona estilo link href stylesheet nada acontece",
    antes: { html: '<head>\n  <link rel="stylesheet" href="estilo.css">\n</head>\n<!-- O arquivo se chama style.css -->', destacarHtml: [2] },
    depois: { html: '<head>\n  <link rel="stylesheet" href="style.css">\n</head>', destacarHtml: [2] },
    observacao: "Este erro acontece entre arquivos, então o resultado aqui não muda. Abra o seu site e confira o nome do arquivo na lista de arquivos.",
  },
  {
    id: "imagem-nao-aparece",
    titulo: "A imagem não aparece",
    sintoma: "Aparece um ícone de imagem quebrada ou só o texto do alt.",
    porque: "O src precisa ter o caminho e o nome EXATOS do arquivo. Foto.JPG é diferente de foto.jpg, e se a imagem está na pasta img, o caminho é img/foto.jpg.",
    comoConsertar: "Copie o nome do arquivo como ele está na pasta (com maiúsculas, minúsculas e extensão) e inclua a pasta no caminho.",
    palavras: "imagem quebrada nao aparece src img foto caminho pasta",
    antes: { html: '<img src="Foto.JPG" alt="Praia limpa">\n<p>O arquivo se chama img/foto.jpg</p>', destacarHtml: [1] },
    depois: {
      html: `<img src="data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="90"><rect width="200" height="90" fill="#26BDE2"/><rect y="60" width="200" height="30" fill="#FDE68A"/></svg>')}" alt="Praia limpa">\n<p>Com o caminho certo, a imagem aparece.</p>`,
      destacarHtml: [1],
    },
  },
  {
    id: "acentos-quebrados",
    titulo: "Os acentos aparecem estranhos (Ã§, Ã£)",
    sintoma: "Palavras como \"ação\" aparecem como \"aÃ§Ã£o\".",
    porque: "O navegador não sabe qual \"alfabeto\" o arquivo usa. A linha <meta charset=\"UTF-8\"> avisa que o texto tem acentos do português.",
    comoConsertar: "Coloque <meta charset=\"UTF-8\"> como a primeira linha dentro do <head>.",
    palavras: "acento estranho caracteres charset utf-8 meta simbolos",
    antes: { html: "<head>\n  <title>Minha página</title>\n</head>", destacarHtml: [1, 2] },
    depois: { html: '<head>\n  <meta charset="UTF-8">\n  <title>Minha página</title>\n</head>', destacarHtml: [2] },
    observacao: "Os exemplos daqui já usam UTF-8, então o resultado não muda. No seu arquivo, sem essa linha, os acentos podem quebrar.",
  },
  {
    id: "ponto-e-virgula",
    titulo: "Esqueci o ; ou a } no CSS",
    sintoma: "Uma regra funciona, mas a próxima não, ou nada depois de certo ponto funciona.",
    porque: "No CSS, cada propriedade termina com ponto e vírgula (;) e cada bloco fecha com chave (}). Sem eles, o navegador junta as linhas e não entende.",
    comoConsertar: "Confira o final de cada linha dentro das chaves e se cada { tem a sua }.",
    palavras: "ponto e virgula chave css parou de funcionar",
    antes: { html: "<h1>Título</h1>\n<p>Texto</p>", css: "h1 {\n  color: red\n  font-size: 40px;\n}\np {\n  color: blue;", destacarCss: [2, 6] },
    depois: { html: "<h1>Título</h1>\n<p>Texto</p>", css: "h1 {\n  color: red;\n  font-size: 40px;\n}\np {\n  color: blue;\n}", destacarCss: [2, 7] },
  },
  {
    id: "classe-diferente",
    titulo: "O nome da classe não bate",
    sintoma: "Você criou o estilo da classe, mas o elemento não muda.",
    porque: "O nome no HTML (class=\"cartao\") e no CSS (.cartao) tem que ser IGUAL, letra por letra. .Cartao, .cartão e .cartao são três classes diferentes.",
    comoConsertar: "Copie o nome da classe do HTML e cole no CSS, sem acento e com as mesmas letras.",
    palavras: "classe class nao muda nome diferente ponto",
    antes: { html: '<div class="cartao">Meu cartão</div>', css: ".cartão {\n  background: #FCC30B;\n  padding: 16px;\n}", destacarCss: [1] },
    depois: { html: '<div class="cartao">Meu cartão</div>', css: ".cartao {\n  background: #FCC30B;\n  padding: 16px;\n}", destacarCss: [1] },
  },
  {
    id: "class-id",
    titulo: "Confundi class com id (. e #)",
    sintoma: "O estilo não aparece, mesmo com o nome certo.",
    porque: "No CSS, classe usa ponto (.destaque) e id usa cerquilha (#destaque). Se o HTML tem class=\"destaque\", o CSS precisa ser .destaque.",
    comoConsertar: "class = ponto (.) no CSS. id = cerquilha (#) no CSS.",
    palavras: "class id ponto cerquilha hashtag jogo da velha",
    antes: { html: '<p class="destaque">Texto em destaque</p>', css: "#destaque {\n  color: #C5192D;\n  font-weight: bold;\n}", destacarCss: [1] },
    depois: { html: '<p class="destaque">Texto em destaque</p>', css: ".destaque {\n  color: #C5192D;\n  font-weight: bold;\n}", destacarCss: [1] },
  },
  {
    id: "link-sem-https",
    titulo: "O link para outro site não abre",
    sintoma: "Ao clicar, aparece \"página não encontrada\" ou o endereço fica estranho, misturado com o seu site.",
    porque: "Sem https://, o navegador acha que \"brasil.un.org\" é um arquivo dentro do SEU site.",
    comoConsertar: "Para sites de fora, sempre comece o href com https://.",
    palavras: "link nao abre href https site externo pagina nao encontrada",
    antes: { html: '<a href="brasil.un.org">ONU Brasil</a>', destacarHtml: [1] },
    depois: { html: '<a href="https://brasil.un.org" target="_blank">ONU Brasil</a>', destacarHtml: [1] },
    observacao: "Os links dos exemplos não abrem (por segurança), mas a diferença está no endereço.",
  },
  {
    id: "elementos-colados",
    titulo: "Os elementos ficaram colados",
    sintoma: "As caixas encostam umas nas outras, ou o texto encosta na borda.",
    porque: "Faltou espaço: margin afasta por fora (entre as caixas) e padding afasta por dentro (entre a borda e o texto).",
    comoConsertar: "Use margin para separar as caixas e padding para dar respiro ao conteúdo. Ou, no flex, use gap.",
    palavras: "colado junto espaco margin padding gap encostado",
    antes: { html: '<div class="caixa">Caixa 1</div>\n<div class="caixa">Caixa 2</div>', css: ".caixa {\n  background: #26BDE2;\n  border: 2px solid #0A97D9;\n}" },
    depois: { html: '<div class="caixa">Caixa 1</div>\n<div class="caixa">Caixa 2</div>', css: ".caixa {\n  background: #26BDE2;\n  border: 2px solid #0A97D9;\n  padding: 12px;\n  margin-bottom: 12px;\n}", destacarCss: [4, 5] },
  },
  {
    id: "texto-uma-linha",
    titulo: "Pulei linha no código, mas na página ficou tudo junto",
    sintoma: "Você deu Enter no código, mas o texto aparece numa linha só.",
    porque: "O HTML ignora os Enters e espaços extras do código. Para separar, use parágrafos (<p>) ou, em casos especiais, <br>.",
    comoConsertar: "Coloque cada parágrafo dentro de um <p>. Use <br> só para quebras dentro do mesmo texto, como num endereço ou poema.",
    palavras: "linha junto enter quebra br paragrafo",
    antes: { html: "Primeira frase.\nSegunda frase.\nTerceira frase." },
    depois: { html: "<p>Primeira frase.</p>\n<p>Segunda frase.</p>\n<p>Terceira frase.</p>" },
  },
];
