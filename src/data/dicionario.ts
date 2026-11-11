import { ATRIBUTOS, PROPRIEDADES, TAGS } from "@/lib/editor/glossario";

/**
 * Dicionário visual: cada tag, atributo e propriedade do glossário do editor
 * com um exemplo que mostra o resultado na tela.
 */
export type TipoVerbete = "html" | "css" | "atributo";

export type Verbete = {
  id: string; // âncora: /aprender/dicionario#id
  tipo: TipoVerbete;
  nome: string;
  descricao: string;
  /** Código mostrado para o aluno. */
  codigoHtml: string;
  codigoCss?: string;
  /** O que é desenhado no resultado (pode ter um pouco de CSS extra para ficar visível). */
  demoHtml?: string;
  demoCss?: string;
  /** Quando o elemento não aparece na tela (ex.: <head>, <meta>). */
  invisivel?: string;
  altura?: number;
};

const FOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160" viewBox="0 0 320 160"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#26BDE2"/><stop offset="1" stop-color="#0A97D9"/></linearGradient></defs><rect width="320" height="160" fill="url(#g)"/><circle cx="250" cy="45" r="22" fill="#FCC30B"/><path d="M0 130 L80 80 L150 120 L220 70 L320 130 V160 H0Z" fill="#3F7E44"/></svg>`,
  );

// Exemplos especiais (quando o exemplo do glossário sozinho não mostra bem o resultado).
const DEMO_TAG: Record<string, Partial<Verbete>> = {
  img: { codigoHtml: '<img src="paisagem.jpg" alt="Montanhas verdes e um sol amarelo">', demoHtml: `<img src="${FOTO}" alt="Montanhas verdes e um sol amarelo" width="240">`, altura: 160 },
  div: { codigoHtml: '<div class="cartao">\n  <h3>Energia solar</h3>\n  <p>Vem da luz do sol.</p>\n</div>', demoCss: ".cartao{border:2px dashed #94a3b8;padding:12px;border-radius:8px}h3{margin:0 0 4px}p{margin:0}", altura: 130 },
  span: { codigoHtml: '<p>Isso é <span class="destaque">muito importante</span>!</p>', demoCss: ".destaque{background:#FCC30B;padding:2px 4px}" },
  header: { demoCss: "header{background:#e0f2fe;padding:8px 12px}h1{margin:0;font-size:22px}" },
  nav: { codigoHtml: '<nav>\n  <a href="#">Início</a>\n  <a href="#">Sobre</a>\n  <a href="#">Contato</a>\n</nav>', demoCss: "nav{background:#0c1b2a;padding:10px;border-radius:8px}nav a{color:#fff;margin-right:12px}" },
  main: { codigoHtml: "<main>\n  <h2>Conteúdo principal</h2>\n  <p>Aqui fica o assunto da página.</p>\n</main>", demoCss: "main{border:2px dashed #94a3b8;padding:8px 12px}h2{margin:0}" },
  article: { codigoHtml: "<article>\n  <h2>Notícia</h2>\n  <p>Um texto que faz sentido sozinho.</p>\n</article>", demoCss: "article{border:2px dashed #94a3b8;padding:8px 12px}h2{margin:0}" },
  aside: { codigoHtml: "<aside>\n  Você sabia? O Brasil tem a maior\n  floresta tropical do mundo.\n</aside>", demoCss: "aside{background:#fef3c7;border-left:4px solid #f59e0b;padding:8px 12px}" },
  section: { demoCss: "section{border:2px dashed #94a3b8;padding:8px 12px}h2{margin:0}" },
  footer: { demoCss: "footer{background:#f1f5f9;padding:4px 12px;font-size:14px}" },
  table: { demoCss: "th,td{border:1px solid #cbd5e1;padding:6px 12px}table{border-collapse:collapse}th{background:#f1f5f9}", altura: 120 },
  tr: { codigoHtml: "<table>\n  <tr><td>Ana</td><td>15 anos</td></tr>\n  <tr><td>Bruno</td><td>16 anos</td></tr>\n</table>", demoCss: "td{border:1px solid #cbd5e1;padding:6px 12px}table{border-collapse:collapse}" },
  th: { codigoHtml: "<table>\n  <tr><th>Nome</th><th>Idade</th></tr>\n  <tr><td>Ana</td><td>15</td></tr>\n</table>", demoCss: "th,td{border:1px solid #cbd5e1;padding:6px 12px}table{border-collapse:collapse}th{background:#f1f5f9}" },
  td: { codigoHtml: "<table>\n  <tr><td>Ana</td><td>15</td></tr>\n</table>", demoCss: "td{border:1px solid #cbd5e1;padding:6px 12px}table{border-collapse:collapse}" },
  li: { codigoHtml: "<ul>\n  <li>Energia eólica</li>\n  <li>Energia solar</li>\n</ul>" },
  form: { codigoHtml: '<form>\n  <label for="nome">Nome</label>\n  <input id="nome" placeholder="Seu nome">\n  <button>Enviar</button>\n</form>', demoCss: "form{display:flex;gap:8px;align-items:center;flex-wrap:wrap}" },
  label: { codigoHtml: '<label for="email">E-mail</label>\n<input id="email" type="email">', demoCss: "label{display:block;font-weight:bold;margin-bottom:4px}" },
  textarea: { codigoHtml: '<textarea placeholder="Escreva sua mensagem"></textarea>', altura: 120 },
  iframe: { invisivel: "Por segurança, os exemplos daqui não carregam outras páginas. No seu site, o <iframe> mostra o vídeo ou a página do endereço em src." },
  video: { invisivel: "O exemplo não carrega um vídeo de verdade. No seu site, coloque o arquivo .mp4 na pasta e use o nome dele em src." },
  link: { invisivel: "O <link> fica no <head> e não aparece na tela: ele só liga o arquivo de estilo (CSS) à página." },
  meta: { invisivel: "O <meta> fica no <head> e não aparece na tela. Com charset=\"UTF-8\", os acentos (á, ç, ã) aparecem certinhos." },
  title: { invisivel: "O <title> não aparece dentro da página: ele é o nome que aparece na aba do navegador." },
  head: { invisivel: "O <head> guarda informações sobre a página (título da aba, CSS). Nada dele aparece na tela." },
  body: { codigoHtml: "<body>\n  <h1>Tudo aqui aparece</h1>\n  <p>na tela do navegador.</p>\n</body>", demoHtml: "<h1 style=\"margin:0\">Tudo aqui aparece</h1><p>na tela do navegador.</p>" },
  html: { invisivel: "O <html> envolve o documento inteiro. O atributo lang=\"pt-BR\" avisa que a página está em português." },
};

// Para as propriedades CSS: em que elemento o exemplo é aplicado.
const DEMO_CSS: Record<string, { html: string; seletor?: string; extra?: string; altura?: number }> = {
  "background-image": { html: '<div class="caixa">Texto sobre a imagem</div>', extra: `.caixa{padding:40px 16px;color:#fff;font-weight:bold}`, altura: 130 },
  "box-shadow": { html: '<div class="caixa">Cartão com sombra</div>', extra: ".caixa{padding:16px;margin:8px;border-radius:8px}" },
  border: { html: '<div class="caixa">Caixa com borda</div>', extra: ".caixa{padding:12px}" },
  "border-radius": { html: '<div class="caixa">Cantos arredondados</div>', extra: ".caixa{padding:16px;background:#26BDE2;color:#fff}" },
  margin: { html: '<div class="caixa">Caixa 1</div>\n<div class="caixa">Caixa 2</div>', extra: ".caixa{background:#26BDE2;color:#fff;padding:8px}", altura: 150 },
  padding: { html: '<div class="caixa">Conteúdo</div>', extra: ".caixa{background:#26BDE2;color:#fff;border:2px solid #0A97D9}" },
  width: { html: '<div class="caixa">300px de largura</div>', extra: ".caixa{background:#26BDE2;color:#fff;padding:8px}" },
  height: { html: '<div class="caixa">200px de altura</div>', extra: ".caixa{background:#26BDE2;color:#fff;padding:8px}", altura: 240 },
  "max-width": { html: '<div class="caixa">Esta caixa nunca passa de 800px, mesmo numa tela grande.</div>', extra: ".caixa{background:#26BDE2;color:#fff;padding:8px}" },
  display: { html: '<div class="caixa">\n  <span>Sol</span>\n  <span>Vento</span>\n  <span>Água</span>\n</div>', extra: ".caixa span{background:#26BDE2;color:#fff;padding:8px 12px;margin:4px;display:block}" },
  "flex-direction": { html: '<div class="caixa">\n  <span>1</span>\n  <span>2</span>\n  <span>3</span>\n</div>', extra: ".caixa{display:flex;gap:6px}.caixa span{background:#26BDE2;color:#fff;padding:6px 14px}", altura: 150 },
  "justify-content": { html: '<div class="caixa">\n  <span>1</span>\n  <span>2</span>\n  <span>3</span>\n</div>', extra: ".caixa{display:flex;gap:6px;background:#f1f5f9;padding:6px}.caixa span{background:#26BDE2;color:#fff;padding:6px 14px}" },
  "align-items": { html: '<div class="caixa">\n  <span>1</span>\n  <span>2</span>\n  <span>3</span>\n</div>', extra: ".caixa{display:flex;gap:6px;height:100px;background:#f1f5f9;padding:6px}.caixa span{background:#26BDE2;color:#fff;padding:6px 14px}", altura: 140 },
  "flex-wrap": { html: '<div class="caixa">\n  <span>Um</span>\n  <span>Dois</span>\n  <span>Três</span>\n  <span>Quatro</span>\n  <span>Cinco</span>\n  <span>Seis</span>\n</div>', extra: ".caixa{display:flex;gap:6px;width:240px}.caixa span{background:#26BDE2;color:#fff;padding:6px 14px}", altura: 130 },
  gap: { html: '<div class="caixa">\n  <span>1</span>\n  <span>2</span>\n  <span>3</span>\n</div>', extra: ".caixa{display:flex}.caixa span{background:#26BDE2;color:#fff;padding:6px 14px}" },
  opacity: { html: '<div class="caixa">Um pouco transparente</div>', extra: ".caixa{background:#26BDE2;color:#fff;padding:12px}" },
  cursor: { html: '<button class="caixa">Passe o mouse aqui</button>', extra: ".caixa{padding:10px 16px}" },
  "list-style": { html: '<ul class="caixa">\n  <li>Sol</li>\n  <li>Vento</li>\n  <li>Água</li>\n</ul>' },
  "object-fit": { html: `<img class="caixa" src="${FOTO}" alt="Paisagem">`, extra: ".caixa{width:120px;height:120px;border-radius:8px}", altura: 160 },
  transition: { html: '<button class="caixa">Passe o mouse</button>', extra: ".caixa{padding:10px 16px;background:#26BDE2;color:#fff;border:0}.caixa:hover{background:#0A97D9;transform:scale(1.1)}" },
  "text-decoration": { html: '<a class="caixa" href="#">Link sem sublinhado</a>' },
  background: { html: '<div class="caixa">Fundo azul</div>', extra: ".caixa{padding:16px;color:#fff}" },
  "background-color": { html: '<div class="caixa">Fundo amarelo</div>', extra: ".caixa{padding:16px}" },
};

function verbeteDeTag(t: (typeof TAGS)[number]): Verbete {
  const especial = DEMO_TAG[t.tag] ?? {};
  const codigoHtml = especial.codigoHtml ?? t.exemplo.replace(/…/g, "Conteúdo");
  return {
    id: t.tag,
    tipo: "html",
    nome: `<${t.tag}>`,
    descricao: t.descricao,
    codigoHtml,
    demoHtml: especial.demoHtml ?? codigoHtml,
    demoCss: especial.demoCss,
    invisivel: especial.invisivel,
    altura: especial.altura,
  };
}

function verbeteDeCss(p: (typeof PROPRIEDADES)[number]): Verbete {
  const d = DEMO_CSS[p.nome] ?? { html: '<p class="caixa">Texto de exemplo para ver a diferença.</p>' };
  let declaracao = p.exemplo;
  // Exemplo com imagem: usa a ilustração embutida para o resultado aparecer de verdade.
  const declaracaoDemo = p.nome === "background-image" ? `background-image: url("${FOTO}"); background-size: cover;` : declaracao;
  if (p.nome === "background-image") declaracao = 'background-image: url("fundo.jpg");';
  const codigoCss = `.caixa {\n  ${declaracao}\n}`;
  return {
    id: `css-${p.nome}`,
    tipo: "css",
    nome: p.nome,
    descricao: p.descricao + (p.valores.length ? ` Valores comuns: ${p.valores.join(", ")}.` : ""),
    codigoHtml: d.html.replace(FOTO, "foto.jpg"),
    codigoCss,
    demoHtml: d.html,
    demoCss: `${d.extra ?? ""}.caixa{${declaracaoDemo}}`,
    altura: d.altura,
  };
}

const DEMO_ATRIBUTO: Record<string, { html: string; css?: string; invisivel?: string }> = {
  class: { html: '<p class="destaque">Parágrafo com classe</p>\n<p>Parágrafo comum</p>', css: ".destaque {\n  color: #C5192D;\n  font-weight: bold;\n}" },
  id: { html: '<h2 id="sobre">Sobre o projeto</h2>', css: "#sobre {\n  color: #0A97D9;\n}" },
  href: { html: '<a href="https://brasil.un.org">Site da ONU Brasil</a>' },
  src: { html: '<img src="foto.jpg" alt="Paisagem">' },
  alt: { html: '<img src="foto-que-nao-existe.jpg" alt="Crianças plantando árvores">' },
  target: { html: '<a href="https://brasil.un.org" target="_blank">Abre em nova aba</a>' },
  title: { html: '<p title="Objetivos de Desenvolvimento Sustentável">Passe o mouse em cima: ODS</p>' },
  style: { html: '<p style="color: green; font-size: 20px;">Texto verde</p>' },
  type: { html: '<input type="email" placeholder="seu@email.com">\n<input type="number" placeholder="Idade">' },
  placeholder: { html: '<input placeholder="Digite seu nome">' },
  lang: { html: '<html lang="pt-BR">', invisivel: "O lang não muda o visual: ele avisa ao navegador e aos leitores de tela que o texto está em português." },
  width: { html: '<img src="foto.jpg" alt="Paisagem" width="120">' },
  height: { html: '<img src="foto.jpg" alt="Paisagem" height="60">' },
  controls: { html: '<video src="video.mp4" controls></video>', invisivel: "O exemplo não carrega um vídeo de verdade. Com controls, aparecem os botões de play, pausa e volume." },
};

function verbeteDeAtributo(a: (typeof ATRIBUTOS)[number]): Verbete {
  const d = DEMO_ATRIBUTO[a.nome] ?? { html: `<p ${a.nome}="…">Exemplo</p>` };
  return {
    id: `attr-${a.nome}`,
    tipo: "atributo",
    nome: a.nome,
    descricao: a.descricao + (a.tags?.length ? ` Usado em: ${a.tags.map((t) => `<${t}>`).join(", ")}.` : ""),
    codigoHtml: d.html,
    codigoCss: d.css,
    demoHtml: d.html.replace(/src="foto\.jpg"/g, `src="${FOTO}"`),
    demoCss: d.css,
    invisivel: d.invisivel,
  };
}

export const VERBETES: Verbete[] = [
  ...TAGS.map(verbeteDeTag),
  ...ATRIBUTOS.map(verbeteDeAtributo),
  ...PROPRIEDADES.map(verbeteDeCss),
];
