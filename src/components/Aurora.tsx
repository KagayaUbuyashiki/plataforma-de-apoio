/** Fundo com manchas de cor desfocadas que se movem devagar (aurora). Fica fixo atrás de todo o conteúdo. */
const MANCHAS = [
  { cor: "#7dd3fc", tamanho: 620, estilo: { left: "-8%", top: "-14%" }, atraso: "0s" },
  { cor: "#c4b5fd", tamanho: 560, estilo: { right: "-6%", top: "-8%" }, atraso: "-6s" },
  { cor: "#5eead4", tamanho: 520, estilo: { left: "35%", top: "30%" }, atraso: "-11s" },
  { cor: "#fbcfe8", tamanho: 560, estilo: { left: "-10%", bottom: "-12%" }, atraso: "-3s" },
  { cor: "#a5f3fc", tamanho: 600, estilo: { right: "-12%", bottom: "-6%" }, atraso: "-8s" },
];

export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {MANCHAS.map((m) => (
        <span
          key={m.cor}
          className="aurora-mancha"
          style={{ ...m.estilo, width: m.tamanho, height: m.tamanho, background: m.cor, animationDelay: m.atraso }}
        />
      ))}
    </div>
  );
}
