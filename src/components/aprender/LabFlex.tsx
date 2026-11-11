"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Codigo } from "./Codigo";
import { Deslizante, Opcoes } from "./Controles";

const DIRECOES = ["row", "column", "row-reverse", "column-reverse"] as const;
const JUSTIFY = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"] as const;
const ALIGN = ["stretch", "flex-start", "center", "flex-end"] as const;
const WRAP = ["nowrap", "wrap"] as const;

const CORES = ["#E5243B", "#FCC30B", "#4C9F38", "#26BDE2", "#A21942"];
const ALTURAS = [48, 72, 56, 88, 64];

const FRASES = {
  "flex-direction": {
    row: "row: as caixas ficam lado a lado, da esquerda para a direita.",
    column: "column: as caixas ficam uma embaixo da outra.",
    "row-reverse": "row-reverse: lado a lado, mas começando pela direita.",
    "column-reverse": "column-reverse: uma embaixo da outra, começando por baixo.",
  },
  "justify-content": {
    "flex-start": "flex-start: junta as caixas no começo.",
    center: "center: junta as caixas no meio. É o jeito mais fácil de centralizar!",
    "flex-end": "flex-end: junta as caixas no final.",
    "space-between": "space-between: a primeira vai para o começo, a última para o fim, e o espaço que sobra fica entre elas.",
    "space-around": "space-around: cada caixa ganha o mesmo espaço dos dois lados.",
    "space-evenly": "space-evenly: todos os espaços (inclusive nas pontas) ficam iguais.",
  },
  "align-items": {
    stretch: "stretch: as caixas esticam para ocupar toda a altura disponível.",
    "flex-start": "flex-start: alinha as caixas pelo topo.",
    center: "center: alinha as caixas pelo meio.",
    "flex-end": "flex-end: alinha as caixas por baixo.",
  },
  "flex-wrap": {
    nowrap: "nowrap: todas as caixas tentam caber numa linha só (podem ficar espremidas).",
    wrap: "wrap: quando não cabem, as caixas descem para a linha de baixo.",
  },
} as const;

type Ultima = keyof typeof FRASES | "gap";

export function LabFlex() {
  const [direcao, setDirecao] = useState<(typeof DIRECOES)[number]>("row");
  const [justify, setJustify] = useState<(typeof JUSTIFY)[number]>("flex-start");
  const [align, setAlign] = useState<(typeof ALIGN)[number]>("stretch");
  const [wrap, setWrap] = useState<(typeof WRAP)[number]>("nowrap");
  const [gap, setGap] = useState(12);
  const [qtd, setQtd] = useState(4);
  const [ultima, setUltima] = useState<Ultima>("justify-content");

  // Animação FLIP: guarda a posição de cada caixa e, depois de mudar o layout, faz ela "deslizar" até a nova posição.
  const caixas = useRef<(HTMLDivElement | null)[]>([]);
  const antes = useRef<DOMRect[]>([]);
  const guardar = () => {
    antes.current = caixas.current.map((el) => el?.getBoundingClientRect() ?? new DOMRect());
  };
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    caixas.current.forEach((el, i) => {
      const a = antes.current[i];
      if (!el || !a || (a.width === 0 && a.height === 0)) return;
      const b = el.getBoundingClientRect();
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 450, easing: "cubic-bezier(.2,.7,.2,1)" });
    });
  }, [direcao, justify, align, wrap, gap, qtd]);

  const com =
    <T,>(prop: Ultima, f: (v: T) => void) =>
    (v: T) => {
      guardar();
      setUltima(prop);
      f(v);
    };

  const css = `.container {\n  display: flex;\n  flex-direction: ${direcao};\n  justify-content: ${justify};\n  align-items: ${align};\n  flex-wrap: ${wrap};\n  gap: ${gap}px;\n}`;
  const frase =
    ultima === "gap"
      ? "gap: o espaço entre uma caixa e outra. Bem mais fácil do que colocar margin em cada uma!"
      : ultima === "flex-direction"
        ? FRASES["flex-direction"][direcao]
        : ultima === "justify-content"
          ? FRASES["justify-content"][justify]
          : ultima === "align-items"
            ? FRASES["align-items"][align]
            : FRASES["flex-wrap"][wrap];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-4">
        <div className="vidro-forte rounded-3xl p-4 sm:p-6">
          <div
            className="flex min-h-64 rounded-2xl border-2 border-dashed border-slate-300 bg-white/70 p-3"
            style={{ flexDirection: direcao, justifyContent: justify, alignItems: align, flexWrap: wrap, gap }}
          >
            {Array.from({ length: qtd }, (_, i) => (
              <div
                key={i}
                ref={(el) => {
                  caixas.current[i] = el;
                }}
                className="grid min-w-14 place-items-center rounded-xl px-4 text-lg font-extrabold text-white shadow-md"
                style={{ background: CORES[i], height: align === "stretch" ? undefined : ALTURAS[i], minHeight: 48 }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        <p className="rounded-2xl border border-white bg-white/70 p-4 text-sm font-medium leading-relaxed text-[#2b3a4a]" aria-live="polite">
          <strong className="font-mono">{ultima}</strong> → {frase}
        </p>
        <Codigo codigo={css} linguagem="css" rotulo="CSS gerado" />
      </div>

      <div className="vidro flex flex-col gap-5 self-start rounded-3xl p-5">
        <Opcoes rotulo="flex-direction" opcoes={DIRECOES} valor={direcao} aoMudar={com("flex-direction", setDirecao)} />
        <Opcoes rotulo="justify-content" opcoes={JUSTIFY} valor={justify} aoMudar={com("justify-content", setJustify)} />
        <Opcoes rotulo="align-items" opcoes={ALIGN} valor={align} aoMudar={com("align-items", setAlign)} />
        <Opcoes rotulo="flex-wrap" opcoes={WRAP} valor={wrap} aoMudar={com("flex-wrap", setWrap)} />
        <Deslizante id="lab-gap" rotulo="gap" valor={gap} min={0} max={40} aoMudar={com("gap", setGap)} />
        <Deslizante id="lab-qtd" rotulo="quantas caixas" valor={qtd} min={2} max={5} unidade="" cor="#6366f1" aoMudar={(v) => { guardar(); setQtd(v); }} />
      </div>
    </div>
  );
}
