import { resolverCaminho } from "./caminhos";
import { tipoDoArquivo, type Arquivos } from "./tipos";

/** Script injetado na prévia: navegação entre páginas do projeto e links externos em nova aba. */
const SCRIPT_PREVIA = `<script>(function(){
document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest?e.target.closest('a[href]'):null; if(!a)return;
  var href=a.getAttribute('href')||'';
  if(href.charAt(0)==='#'){e.preventDefault();var id=decodeURIComponent(href.slice(1));var el=id?document.getElementById(id):null;
    if(el){el.scrollIntoView({behavior:'smooth'});}else if(!id){window.scrollTo({top:0,behavior:'smooth'});} return;}
  if(/^(https?:)?\\/\\//i.test(href)||/^(mailto|tel):/i.test(href)){a.setAttribute('target','_blank');a.setAttribute('rel','noopener');return;}
  e.preventDefault(); parent.postMessage({mpsNavegar:href},'*');
},true);
document.addEventListener('submit',function(e){e.preventDefault();},true);
})();</script>`;

/** Troca url(...) do CSS por imagens do projeto (data URL). */
function trocarUrlsCss(css: string, base: string, arquivos: Arquivos): string {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (orig, _q, ref: string) => {
    const caminho = resolverCaminho(base, ref);
    const dado = caminho ? arquivos[caminho] : undefined;
    return dado && dado.startsWith("data:") ? `url("${dado}")` : orig;
  });
}

/**
 * Monta um HTML único para o <iframe srcdoc>, embutindo CSS, JS e imagens do projeto
 * (o iframe não consegue ler os arquivos "de verdade", então tudo vai junto).
 */
export function montarPrevia(arquivos: Arquivos, pagina: string): string {
  const html = arquivos[pagina];
  if (html == null) {
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#555;padding:24px">
      <h2>Nenhuma página para mostrar</h2><p>Crie um arquivo <code>index.html</code> para ver a prévia.</p></body></html>`;
  }

  let saida = html
    // <link rel="stylesheet" href="..."> → <style>
    .replace(/<link\b[^>]*>/gi, (tag) => {
      if (!/rel\s*=\s*["']?stylesheet/i.test(tag)) return tag;
      const href = tag.match(/href\s*=\s*["']([^"']+)["']/i)?.[1];
      const caminho = href ? resolverCaminho(pagina, href) : null;
      if (!caminho || arquivos[caminho] == null) return tag;
      return `<style data-arquivo="${caminho}">\n${trocarUrlsCss(arquivos[caminho], caminho, arquivos)}\n</style>`;
    })
    // <script src="..."></script> → script embutido
    .replace(/<script\b([^>]*)\bsrc\s*=\s*["']([^"']+)["']([^>]*)>\s*<\/script>/gi, (tag, _a, src: string) => {
      const caminho = resolverCaminho(pagina, src);
      if (!caminho || arquivos[caminho] == null) return tag;
      return `<script data-arquivo="${caminho}">\n${arquivos[caminho].replace(/<\/script/gi, "<\\/script")}\n</script>`;
    })
    // src="foto.png" (img, video, source...) → data URL
    .replace(/(\s(?:src|poster)\s*=\s*)(["'])([^"']+)\2/gi, (orig, prefixo: string, q: string, ref: string) => {
      const caminho = resolverCaminho(pagina, ref);
      const dado = caminho ? arquivos[caminho] : undefined;
      return dado && tipoDoArquivo(caminho!) === "imagem" ? `${prefixo}${q}${dado}${q}` : orig;
    })
    // style="background: url(...)" e <style> dentro do HTML
    .replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (_t, attrs: string, css: string) =>
      /data-arquivo/.test(attrs) ? _t : `<style${attrs}>${trocarUrlsCss(css, pagina, arquivos)}</style>`,
    );

  saida = /<\/body>/i.test(saida) ? saida.replace(/<\/body>(?![\s\S]*<\/body>)/i, `${SCRIPT_PREVIA}</body>`) : saida + SCRIPT_PREVIA;
  return saida;
}

