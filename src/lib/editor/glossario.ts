/**
 * Glossário em português de tags HTML e propriedades CSS.
 * Alimenta o autocompletar, as explicações ao passar o mouse e os blocos do editor.
 * Trechos usam a sintaxe de snippet do VS Code: $1, $2 = posições do cursor; $0 = posição final.
 */

export type TagHtml = {
  tag: string;
  descricao: string;
  exemplo: string;
  /** Snippet inserido (sem o "<" inicial; ele é acrescentado quando necessário). */
  trecho: string;
};

export type PropriedadeCss = {
  nome: string;
  descricao: string;
  exemplo: string;
  valores: string[];
};

export type AtributoHtml = { nome: string; descricao: string; tags?: string[] };

const bloco = (tag: string) => `${tag}>\n\t$0\n</${tag}>`;
const linha = (tag: string) => `${tag}>$0</${tag}>`;

export const TAGS: TagHtml[] = [
  { tag: "h1", descricao: "Título principal da página. Use só um <h1> por página: é o assunto mais importante.", exemplo: "<h1>Energia Limpa</h1>", trecho: linha("h1") },
  { tag: "h2", descricao: "Subtítulo de uma seção. Vem logo abaixo do <h1> em importância.", exemplo: "<h2>O que é energia solar?</h2>", trecho: linha("h2") },
  { tag: "h3", descricao: "Subtítulo de terceiro nível, dentro de uma seção que já tem <h2>.", exemplo: "<h3>Vantagens</h3>", trecho: linha("h3") },
  { tag: "h4", descricao: "Subtítulo de quarto nível (pouco usado).", exemplo: "<h4>Detalhe</h4>", trecho: linha("h4") },
  { tag: "h5", descricao: "Subtítulo de quinto nível (raramente usado).", exemplo: "<h5>Nota</h5>", trecho: linha("h5") },
  { tag: "h6", descricao: "O menor nível de subtítulo.", exemplo: "<h6>Observação</h6>", trecho: linha("h6") },
  { tag: "p", descricao: "Parágrafo: um bloco de texto corrido.", exemplo: "<p>A energia solar vem do sol.</p>", trecho: linha("p") },
  { tag: "a", descricao: "Link: leva para outra página ou site. O endereço vai no atributo href.", exemplo: '<a href="https://brasil.un.org">ONU Brasil</a>', trecho: 'a href="$1">$0</a>' },
  { tag: "img", descricao: "Imagem. src = endereço da imagem; alt = descrição para quem não consegue ver (acessibilidade). Não tem tag de fechamento.", exemplo: '<img src="foto.jpg" alt="Placas solares em um telhado">', trecho: 'img src="$1" alt="$2">' },
  { tag: "ul", descricao: "Lista não ordenada (com marcadores •). Cada item fica dentro de um <li>.", exemplo: "<ul>\n  <li>Sol</li>\n  <li>Vento</li>\n</ul>", trecho: "ul>\n\t<li>$1</li>\n\t<li>$2</li>\n\t<li>$0</li>\n</ul>" },
  { tag: "ol", descricao: "Lista ordenada (numerada 1, 2, 3…). Cada item fica dentro de um <li>.", exemplo: "<ol>\n  <li>Primeiro passo</li>\n  <li>Segundo passo</li>\n</ol>", trecho: "ol>\n\t<li>$1</li>\n\t<li>$2</li>\n\t<li>$0</li>\n</ol>" },
  { tag: "li", descricao: "Item de lista. Sempre fica dentro de um <ul> ou <ol>.", exemplo: "<li>Energia eólica</li>", trecho: linha("li") },
  { tag: "div", descricao: "Caixa genérica para agrupar elementos e aplicar estilo. Não tem significado próprio.", exemplo: '<div class="cartao">…</div>', trecho: bloco("div") },
  { tag: "span", descricao: "Trecho de texto genérico, dentro de uma linha, para aplicar estilo.", exemplo: '<span class="destaque">importante</span>', trecho: linha("span") },
  { tag: "header", descricao: "Cabeçalho da página ou de uma seção (logo, título, menu).", exemplo: "<header>\n  <h1>Meu site</h1>\n</header>", trecho: bloco("header") },
  { tag: "nav", descricao: "Menu de navegação: um grupo de links para as páginas do site.", exemplo: '<nav>\n  <a href="index.html">Início</a>\n</nav>', trecho: bloco("nav") },
  { tag: "main", descricao: "Conteúdo principal da página. Deve existir só um <main>.", exemplo: "<main>…</main>", trecho: bloco("main") },
  { tag: "section", descricao: "Seção temática da página, normalmente com um título <h2>.", exemplo: "<section>\n  <h2>Dados</h2>\n</section>", trecho: bloco("section") },
  { tag: "article", descricao: "Conteúdo independente, como uma notícia ou post.", exemplo: "<article>…</article>", trecho: bloco("article") },
  { tag: "aside", descricao: "Conteúdo lateral, complementar (curiosidades, links extras).", exemplo: "<aside>Você sabia?</aside>", trecho: bloco("aside") },
  { tag: "footer", descricao: "Rodapé da página: autoria, contato, fontes.", exemplo: "<footer>\n  <p>Feito por Ana</p>\n</footer>", trecho: bloco("footer") },
  { tag: "strong", descricao: "Texto importante, mostrado em negrito.", exemplo: "<strong>Atenção!</strong>", trecho: linha("strong") },
  { tag: "em", descricao: "Texto com ênfase, mostrado em itálico.", exemplo: "<em>muito</em>", trecho: linha("em") },
  { tag: "br", descricao: "Quebra de linha. Não tem tag de fechamento.", exemplo: "Linha 1<br>Linha 2", trecho: "br>$0" },
  { tag: "hr", descricao: "Linha horizontal que separa partes do conteúdo. Não tem fechamento.", exemplo: "<hr>", trecho: "hr>$0" },
  { tag: "button", descricao: "Botão clicável.", exemplo: "<button>Saiba mais</button>", trecho: linha("button") },
  { tag: "table", descricao: "Tabela. Linhas com <tr>, células de título com <th> e células comuns com <td>.", exemplo: "<table>\n  <tr><th>Fonte</th><th>%</th></tr>\n  <tr><td>Hídrica</td><td>60</td></tr>\n</table>", trecho: "table>\n\t<tr>\n\t\t<th>$1</th>\n\t\t<th>$2</th>\n\t</tr>\n\t<tr>\n\t\t<td>$3</td>\n\t\t<td>$0</td>\n\t</tr>\n</table>" },
  { tag: "tr", descricao: "Linha de uma tabela (table row).", exemplo: "<tr><td>…</td></tr>", trecho: "tr>\n\t<td>$0</td>\n</tr>" },
  { tag: "th", descricao: "Célula de título de uma tabela (em negrito).", exemplo: "<th>Nome</th>", trecho: linha("th") },
  { tag: "td", descricao: "Célula comum de uma tabela.", exemplo: "<td>Ana</td>", trecho: linha("td") },
  { tag: "form", descricao: "Formulário que agrupa campos para o visitante preencher.", exemplo: "<form>…</form>", trecho: bloco("form") },
  { tag: "input", descricao: "Campo de formulário. O atributo type define o tipo (text, email, number…). Não tem fechamento.", exemplo: '<input type="text" placeholder="Seu nome">', trecho: 'input type="${1:text}" placeholder="$2">$0' },
  { tag: "label", descricao: "Rótulo (nome) de um campo de formulário.", exemplo: '<label for="nome">Nome</label>', trecho: 'label for="$1">$0</label>' },
  { tag: "textarea", descricao: "Campo de texto com várias linhas.", exemplo: "<textarea></textarea>", trecho: linha("textarea") },
  { tag: "iframe", descricao: "Mostra outra página dentro da sua, como um vídeo do YouTube.", exemplo: '<iframe src="https://…"></iframe>', trecho: 'iframe src="$1"></iframe>$0' },
  { tag: "video", descricao: "Vídeo. Use o atributo controls para mostrar os botões de play.", exemplo: '<video src="video.mp4" controls></video>', trecho: 'video src="$1" controls></video>$0' },
  { tag: "link", descricao: "Liga um arquivo externo, como o CSS. Fica dentro do <head>.", exemplo: '<link rel="stylesheet" href="style.css">', trecho: 'link rel="stylesheet" href="${1:style.css}">$0' },
  { tag: "meta", descricao: "Informação sobre a página (codificação, descrição). Fica no <head>.", exemplo: '<meta charset="UTF-8">', trecho: 'meta $0>' },
  { tag: "title", descricao: "Título que aparece na aba do navegador. Fica dentro do <head>.", exemplo: "<title>Meu site</title>", trecho: linha("title") },
  { tag: "head", descricao: "Cabeça do documento: informações que não aparecem na página (título da aba, CSS).", exemplo: "<head>…</head>", trecho: bloco("head") },
  { tag: "body", descricao: "Corpo do documento: tudo o que aparece na tela fica aqui dentro.", exemplo: "<body>…</body>", trecho: bloco("body") },
  { tag: "html", descricao: "Elemento raiz: envolve todo o documento.", exemplo: '<html lang="pt-BR">…</html>', trecho: 'html lang="pt-BR">\n$0\n</html>' },
];

export const ATRIBUTOS: AtributoHtml[] = [
  { nome: "class", descricao: "Nome de classe para estilizar no CSS com .nome. Vários elementos podem ter a mesma classe." },
  { nome: "id", descricao: "Identificador único do elemento. No CSS, use #nome." },
  { nome: "href", descricao: "Endereço para onde o link leva.", tags: ["a", "link"] },
  { nome: "src", descricao: "Endereço (arquivo ou link) da imagem, vídeo ou página.", tags: ["img", "video", "iframe", "script"] },
  { nome: "alt", descricao: "Descrição da imagem, lida por leitores de tela. Importante para acessibilidade!", tags: ["img"] },
  { nome: "target", descricao: 'Onde abrir o link. "_blank" abre em uma nova aba.', tags: ["a"] },
  { nome: "title", descricao: "Texto que aparece ao parar o mouse sobre o elemento." },
  { nome: "style", descricao: "CSS direto no elemento (prefira usar o arquivo style.css)." },
  { nome: "type", descricao: "Tipo do campo ou botão (text, email, number, submit…).", tags: ["input", "button"] },
  { nome: "placeholder", descricao: "Texto de exemplo que aparece no campo vazio.", tags: ["input", "textarea"] },
  { nome: "lang", descricao: 'Idioma do conteúdo. Para português do Brasil: "pt-BR".' },
  { nome: "width", descricao: "Largura (em pixels).", tags: ["img", "video", "iframe"] },
  { nome: "height", descricao: "Altura (em pixels).", tags: ["img", "video", "iframe"] },
  { nome: "controls", descricao: "Mostra os controles (play, volume) do vídeo ou áudio.", tags: ["video", "audio"] },
];

export const PROPRIEDADES: PropriedadeCss[] = [
  { nome: "color", descricao: "Cor do texto.", exemplo: "color: #1F2937;", valores: ["black", "white", "red", "blue", "green", "#333333"] },
  { nome: "background-color", descricao: "Cor de fundo do elemento.", exemplo: "background-color: #FCC30B;", valores: ["white", "black", "#F5F5F5", "transparent"] },
  { nome: "background-image", descricao: "Imagem de fundo do elemento.", exemplo: 'background-image: url("fundo.jpg");', valores: ['url("")', "linear-gradient(red, blue)"] },
  { nome: "background", descricao: "Atalho para definir cor, imagem e posição do fundo de uma vez.", exemplo: "background: #26BDE2;", valores: [] },
  { nome: "font-size", descricao: "Tamanho da letra.", exemplo: "font-size: 18px;", valores: ["16px", "20px", "24px", "2rem"] },
  { nome: "font-family", descricao: "Tipo de letra (fonte). Coloque opções separadas por vírgula.", exemplo: "font-family: Arial, sans-serif;", valores: ["Arial, sans-serif", "Georgia, serif", "Verdana, sans-serif", "'Courier New', monospace"] },
  { nome: "font-weight", descricao: "Grossura da letra (normal ou negrito).", exemplo: "font-weight: bold;", valores: ["normal", "bold", "300", "700"] },
  { nome: "font-style", descricao: "Estilo da letra, como itálico.", exemplo: "font-style: italic;", valores: ["normal", "italic"] },
  { nome: "text-align", descricao: "Alinhamento do texto.", exemplo: "text-align: center;", valores: ["left", "center", "right", "justify"] },
  { nome: "text-decoration", descricao: "Sublinhado ou riscado do texto (útil para tirar o sublinhado dos links).", exemplo: "text-decoration: none;", valores: ["none", "underline", "line-through"] },
  { nome: "text-transform", descricao: "Transforma o texto em maiúsculas ou minúsculas.", exemplo: "text-transform: uppercase;", valores: ["uppercase", "lowercase", "capitalize", "none"] },
  { nome: "line-height", descricao: "Altura da linha (espaço entre as linhas do texto).", exemplo: "line-height: 1.6;", valores: ["1.4", "1.6", "2"] },
  { nome: "margin", descricao: "Espaço DO LADO DE FORA do elemento (afasta dos vizinhos).", exemplo: "margin: 20px;", valores: ["0", "10px", "20px", "0 auto"] },
  { nome: "padding", descricao: "Espaço DO LADO DE DENTRO do elemento (entre a borda e o conteúdo).", exemplo: "padding: 16px;", valores: ["0", "8px", "16px", "24px"] },
  { nome: "border", descricao: "Borda: espessura, estilo e cor.", exemplo: "border: 2px solid #333;", valores: ["1px solid black", "2px dashed red", "none"] },
  { nome: "border-radius", descricao: "Arredonda os cantos do elemento.", exemplo: "border-radius: 12px;", valores: ["4px", "12px", "50%"] },
  { nome: "width", descricao: "Largura do elemento.", exemplo: "width: 300px;", valores: ["100%", "50%", "300px", "auto"] },
  { nome: "height", descricao: "Altura do elemento.", exemplo: "height: 200px;", valores: ["100px", "200px", "auto"] },
  { nome: "max-width", descricao: "Largura máxima: o elemento não passa desse tamanho.", exemplo: "max-width: 800px;", valores: ["100%", "800px", "1200px"] },
  { nome: "display", descricao: "Como o elemento se comporta no layout. flex = organiza os filhos lado a lado.", exemplo: "display: flex;", valores: ["block", "inline", "inline-block", "flex", "grid", "none"] },
  { nome: "flex-direction", descricao: "Direção dos itens no flex: em linha (row) ou em coluna (column).", exemplo: "flex-direction: column;", valores: ["row", "column"] },
  { nome: "justify-content", descricao: "Alinha os itens do flex na direção principal (ex.: centralizar na horizontal).", exemplo: "justify-content: center;", valores: ["flex-start", "center", "flex-end", "space-between", "space-around"] },
  { nome: "align-items", descricao: "Alinha os itens do flex na outra direção (ex.: centralizar na vertical).", exemplo: "align-items: center;", valores: ["flex-start", "center", "flex-end", "stretch"] },
  { nome: "flex-wrap", descricao: "Deixa os itens do flex quebrarem para a linha de baixo quando não cabem.", exemplo: "flex-wrap: wrap;", valores: ["wrap", "nowrap"] },
  { nome: "gap", descricao: "Espaço entre os itens de um flex ou grid.", exemplo: "gap: 16px;", valores: ["8px", "16px", "24px"] },
  { nome: "box-shadow", descricao: "Sombra em volta do elemento.", exemplo: "box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);", valores: ["0 2px 8px rgba(0, 0, 0, 0.2)", "none"] },
  { nome: "opacity", descricao: "Transparência: 1 = visível, 0 = invisível.", exemplo: "opacity: 0.8;", valores: ["1", "0.8", "0.5"] },
  { nome: "cursor", descricao: "Formato do mouse ao passar sobre o elemento.", exemplo: "cursor: pointer;", valores: ["pointer", "default"] },
  { nome: "list-style", descricao: "Estilo dos marcadores de uma lista.", exemplo: "list-style: square;", valores: ["disc", "circle", "square", "none"] },
  { nome: "object-fit", descricao: "Como a imagem preenche o espaço (cover = preenche sem distorcer).", exemplo: "object-fit: cover;", valores: ["cover", "contain"] },
  { nome: "transition", descricao: "Anima a mudança de uma propriedade (ex.: ao passar o mouse).", exemplo: "transition: 0.3s;", valores: ["0.3s", "all 0.3s ease"] },
];

export const TAGS_POR_NOME = new Map(TAGS.map((t) => [t.tag, t]));
export const PROPRIEDADES_POR_NOME = new Map(PROPRIEDADES.map((p) => [p.nome, p]));
export const ATRIBUTOS_POR_NOME = new Map(ATRIBUTOS.map((a) => [a.nome, a]));
