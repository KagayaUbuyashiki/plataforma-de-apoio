/** Ícones simples (traço) no estilo da barra de atividades do VS Code. */
type P = { className?: string };
const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const IconeArquivos = ({ className }: P) => (
  <svg {...base} className={className}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 3v0" /></svg>
);
export const IconeBlocos = ({ className }: P) => (
  <svg {...base} className={className}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M17.5 14v7M14 17.5h7" /></svg>
);
export const IconeMissoes = ({ className }: P) => (
  <svg {...base} className={className}><path d="M9 11l3 3 8-8" /><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
);
export const IconeOlho = ({ className }: P) => (
  <svg {...base} className={className}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const IconeNovoArquivo = ({ className }: P) => (
  <svg {...base} className={className}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M12 11v6M9 14h6" /></svg>
);
export const IconeNovaPasta = ({ className }: P) => (
  <svg {...base} className={className}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M12 10v6M9 13h6" /></svg>
);
export const IconeImagem = ({ className }: P) => (
  <svg {...base} className={className}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
);
export const IconeRecarregar = ({ className }: P) => (
  <svg {...base} className={className}><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>
);
export const IconeExterno = ({ className }: P) => (
  <svg {...base} className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6M10 14L21 3" /></svg>
);
export const IconeFechar = ({ className }: P) => (
  <svg {...base} className={className}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const IconeSeta = ({ className }: P) => (
  <svg {...base} className={className}><path d="M9 6l6 6-6 6" /></svg>
);

/** Ícone colorido por tipo de arquivo, como no VS Code. */
export function IconeTipo({ caminho, pasta = false }: { caminho: string; pasta?: boolean }) {
  if (pasta) return <span className="text-[#dcb67a]" aria-hidden>▸</span>;
  const ext = caminho.split(".").pop()?.toLowerCase();
  const mapa: Record<string, [string, string]> = {
    html: ["<>", "text-[#e44d26]"],
    htm: ["<>", "text-[#e44d26]"],
    css: ["#", "text-[#42a5f5]"],
    js: ["JS", "text-[#f1e05a]"],
    png: ["▣", "text-[#a074c4]"], jpg: ["▣", "text-[#a074c4]"], jpeg: ["▣", "text-[#a074c4]"], gif: ["▣", "text-[#a074c4]"], webp: ["▣", "text-[#a074c4]"], svg: ["▣", "text-[#ffb13b]"],
  };
  const [sim, cor] = mapa[ext ?? ""] ?? ["≡", "text-[#8a8a8a]"];
  return <span className={`inline-block w-4 shrink-0 text-center font-mono text-[11px] font-bold ${cor}`} aria-hidden>{sim}</span>;
}
