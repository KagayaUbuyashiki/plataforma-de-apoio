"use client";

import { useState } from "react";
import { Codigo } from "./Codigo";
import { Deslizante } from "./Controles";

type Camada = "margin" | "border" | "padding" | "width" | "border-radius";

const CORES = {
  margin: { fundo: "rgb(251 146 60 / 0.25)", borda: "#fb923c", texto: "text-orange-700" },
  border: { fundo: "#f59e0b", borda: "#b45309", texto: "text-amber-800" },
  padding: { fundo: "rgb(74 222 128 / 0.35)", borda: "#22c55e", texto: "text-emerald-700" },
  conteudo: { fundo: "#7dd3fc", borda: "#0ea5c6", texto: "text-sky-800" },
};

const EXPLICACAO: Record<Camada, string> = {
  margin: "margin é o espaço do LADO DE FORA da borda: afasta a caixa das vizinhas. No desenho ele aparece em laranja para você enxergar; no site, ele é transparente.",
  border: "border é a linha em volta da caixa. Aqui ela tem a cor âmbar e a espessura que você escolheu.",
  padding: "padding é o espaço do LADO DE DENTRO, entre a borda e o conteúdo. No desenho ele aparece em verde; no site, ele fica com a cor de fundo da caixa.",
  width: "width é a largura da caixa. Com box-sizing: border-box, ela já inclui o padding e a borda.",
  "border-radius": "border-radius arredonda os cantos. Com valores grandes, a caixa vira quase uma pílula.",
};

/** Laboratório do "modelo de caixa": margin, border, padding e conteúdo. */
export function LabCaixa() {
  const [margin, setMargin] = useState(24);
  const [border, setBorder] = useState(6);
  const [padding, setPadding] = useState(20);
  const [width, setWidth] = useState(260);
  const [raio, setRaio] = useState(12);
  const [mudando, setMudando] = useState<Camada>("padding");

  const muda = (c: Camada, f: (v: number) => void) => (v: number) => {
    setMudando(c);
    f(v);
  };

  const css = `.caixa {\n  width: ${width}px;\n  margin: ${margin}px;\n  border: ${border}px solid #f59e0b;\n  padding: ${padding}px;\n  border-radius: ${raio}px;\n  background-color: #7dd3fc;\n}`;
  const pisca = (c: Camada) => (mudando === c ? "animate-pulse" : "");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-4">
        <div className="vidro-forte overflow-x-auto rounded-3xl p-4 sm:p-6">
          {/* A área laranja tracejada representa a margem (que, de verdade, é transparente). */}
          <div className="relative mx-auto w-max transition-all duration-300" style={{ padding: margin, background: CORES.margin.fundo, outline: `2px dashed ${CORES.margin.borda}`, borderRadius: 8 }}>
            <span className={`absolute left-2 top-1 font-mono text-[11px] font-bold ${CORES.margin.texto} ${pisca("margin")}`}>margin</span>
            <div
              className={`relative box-border transition-all duration-300 ${pisca("border")}`}
              style={{ width, border: `${border}px solid ${CORES.border.fundo}`, padding, borderRadius: raio, background: CORES.padding.fundo }}
            >
              {border > 0 && <span className={`absolute -top-5 right-2 font-mono text-[11px] font-bold ${CORES.border.texto}`}>border</span>}
              {padding >= 14 && <span className={`absolute left-2 top-0.5 font-mono text-[11px] font-bold ${CORES.padding.texto} ${pisca("padding")}`}>padding</span>}
              <div
                className="grid min-h-16 place-items-center px-2 text-center text-sm font-bold text-sky-900 transition-all duration-300"
                style={{ background: CORES.conteudo.fundo, borderRadius: Math.max(0, raio - border - padding) }}
              >
                conteúdo
              </div>
            </div>
          </div>
          <ul className="mt-4 flex flex-wrap justify-center gap-3 text-xs font-bold">
            {(
              [
                ["margin", CORES.margin.borda],
                ["border", CORES.border.fundo],
                ["padding", CORES.padding.borda],
                ["conteúdo", CORES.conteudo.borda],
              ] as const
            ).map(([n, c]) => (
              <li key={n} className="flex items-center gap-1.5 text-tinta-suave">
                <span className="h-3 w-3 rounded-sm" style={{ background: c }} aria-hidden />
                {n}
              </li>
            ))}
          </ul>
        </div>
        <p className="rounded-2xl border border-white bg-white/70 p-4 text-sm font-medium leading-relaxed text-[#2b3a4a]" aria-live="polite">
          {EXPLICACAO[mudando]}
        </p>
        <Codigo codigo={css} linguagem="css" rotulo="CSS gerado" />
      </div>

      <div className="vidro flex flex-col gap-5 self-start rounded-3xl p-5">
        <Deslizante id="lab-margin" rotulo="margin" valor={margin} min={0} max={60} cor={CORES.margin.borda} aoMudar={muda("margin", setMargin)} />
        <Deslizante id="lab-border" rotulo="border" valor={border} min={0} max={20} cor={CORES.border.fundo} aoMudar={muda("border", setBorder)} />
        <Deslizante id="lab-padding" rotulo="padding" valor={padding} min={0} max={60} cor={CORES.padding.borda} aoMudar={muda("padding", setPadding)} />
        <Deslizante id="lab-width" rotulo="width" valor={width} min={140} max={420} passo={10} aoMudar={muda("width", setWidth)} />
        <Deslizante id="lab-radius" rotulo="border-radius" valor={raio} min={0} max={80} cor="#6366f1" aoMudar={muda("border-radius", setRaio)} />
      </div>
    </div>
  );
}
