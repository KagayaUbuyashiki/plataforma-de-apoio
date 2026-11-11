/**
 * Correção dos desafios. Roda no navegador, sobre a página do aluno desenhada
 * num iframe isolado (sem scripts), então dá para ler os estilos calculados.
 */
export type Ctx = {
  doc: Document;
  win: Window;
  css: string; // CSS digitado (sem comentários)
};

export type Verificacao = { texto: string; ok: (c: Ctx) => boolean };

export const $ = (c: Ctx, sel: string) => c.doc.querySelector<HTMLElement>(sel);
export const $$ = (c: Ctx, sel: string) => [...c.doc.querySelectorAll<HTMLElement>(sel)];
export const tem = (c: Ctx, sel: string, min = 1) => $$(c, sel).length >= min;
export const texto = (el: Element | null) => (el?.textContent ?? "").trim();

/** Estilo calculado pelo navegador (ex.: "rgb(255, 0, 0)", "20px"). */
export function estilo(c: Ctx, sel: string, prop: string): string {
  const el = $(c, sel);
  return el ? c.win.getComputedStyle(el).getPropertyValue(prop) : "";
}

export const px = (v: string) => parseFloat(v) || 0;

/** "rgb(r, g, b)" ou "rgba(r, g, b, a)" → [r, g, b, a]. */
export function rgb(v: string): [number, number, number, number] {
  const n = (v.match(/[\d.]+/g) ?? []).map(Number);
  return [n[0] ?? 0, n[1] ?? 0, n[2] ?? 0, n[3] ?? 1];
}

export const ehVermelho = (v: string) => {
  const [r, g, b, a] = rgb(v);
  return a > 0 && r >= 150 && g <= 110 && b <= 110;
};
export const ehAmarelo = (v: string) => {
  const [r, g, b, a] = rgb(v);
  return a > 0 && r >= 190 && g >= 160 && b <= 140;
};
export const ehTransparente = (v: string) => rgb(v)[3] === 0 || v === "transparent";
export const ehBranco = (v: string) => {
  const [r, g, b] = rgb(v);
  return r >= 250 && g >= 250 && b >= 250;
};
/** Cor clara o bastante para texto escuro continuar legível. */
export const ehClara = (v: string) => {
  const [r, g, b] = rgb(v);
  return 0.299 * r + 0.587 * g + 0.114 * b >= 150;
};

export const cssTem = (c: Ctx, re: RegExp) => re.test(c.css);

export function rodar(verificacoes: Verificacao[], c: Ctx | null): boolean[] {
  return verificacoes.map((v) => {
    if (!c) return false;
    try {
      return v.ok(c);
    } catch {
      return false;
    }
  });
}
