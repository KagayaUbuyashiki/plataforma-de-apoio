"use client";

import { useState } from "react";
import { ODS, paletaSugerida } from "@/data/ods";
import { Codigo } from "./Codigo";
import { Deslizante, Opcoes } from "./Controles";

const FONTES = ["Arial, sans-serif", "Georgia, serif", "Verdana, sans-serif", "'Courier New', monospace", "'Trebuchet MS', sans-serif"] as const;
const PESOS = ["normal", "bold"] as const;
const ALINHAMENTOS = ["left", "center", "right", "justify"] as const;

/** Luminância relativa (WCAG) de uma cor #rrggbb. */
function luminancia(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contraste entre duas cores (1 a 21). Para texto comum, o mínimo recomendado é 4,5. */
export function contraste(a: string, b: string) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

export function LabCores() {
  const [cor, setCor] = useState("#1f2937");
  const [fundo, setFundo] = useState("#fcc30b");
  const [tamanho, setTamanho] = useState(20);
  const [fonte, setFonte] = useState<(typeof FONTES)[number]>(FONTES[0]);
  const [peso, setPeso] = useState<(typeof PESOS)[number]>("normal");
  const [alinhar, setAlinhar] = useState<(typeof ALINHAMENTOS)[number]>("left");
  const [linha, setLinha] = useState(1.5);

  const c = contraste(cor, fundo);
  const nivel = c >= 7 ? { t: "Ótimo para ler", cls: "bg-emerald-100 text-emerald-800" } : c >= 4.5 ? { t: "Bom para ler", cls: "bg-emerald-50 text-emerald-700" } : c >= 3 ? { t: "Só para títulos grandes", cls: "bg-amber-100 text-amber-800" } : { t: "Difícil de ler", cls: "bg-red-100 text-red-800" };

  const usarOds = (numero: number) => {
    const ods = ODS.find((o) => o.numero === numero);
    if (!ods) return;
    const p = paletaSugerida(ods.cor);
    setFundo(p[2].cor.toLowerCase());
    setCor(p[1].cor.toLowerCase());
  };

  const css = `.texto {\n  color: ${cor};\n  background-color: ${fundo};\n  font-size: ${tamanho}px;\n  font-family: ${fonte};\n  font-weight: ${peso};\n  text-align: ${alinhar};\n  line-height: ${linha};\n}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-4">
        <div
          className="rounded-3xl p-6 shadow-lg transition-all duration-300 sm:p-8"
          style={{ color: cor, backgroundColor: fundo, fontSize: tamanho, fontFamily: fonte, fontWeight: peso, textAlign: alinhar, lineHeight: linha }}
        >
          <p style={{ fontSize: "1.4em", margin: 0 }}>Vida na Água</p>
          <p style={{ margin: "0.4em 0 0" }}>
            Os oceanos cobrem mais de 70% do planeta e produzem boa parte do oxigênio que respiramos. Proteger a vida marinha é proteger a nossa vida também.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white bg-white/70 p-4 text-sm font-medium" aria-live="polite">
          <span className="font-bold">Contraste: {c.toFixed(1).replace(".", ",")} : 1</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${nivel.cls}`}>{nivel.t}</span>
          <span className="text-tinta-suave">Para texto comum, use pelo menos 4,5 : 1. Assim, todo mundo consegue ler.</span>
        </div>
        <Codigo codigo={css} linguagem="css" rotulo="CSS gerado" />
      </div>

      <div className="vidro flex flex-col gap-5 self-start rounded-3xl p-5">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-sm font-bold">color</span>
            <input type="color" value={cor} onChange={(e) => setCor(e.target.value)} className="h-11 w-full cursor-pointer rounded-xl border border-white bg-white p-1" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-sm font-bold">background-color</span>
            <input type="color" value={fundo} onChange={(e) => setFundo(e.target.value)} className="h-11 w-full cursor-pointer rounded-xl border border-white bg-white p-1" />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-bold">Usar as cores de um ODS</span>
          <select defaultValue="" onChange={(e) => usarOds(Number(e.target.value))} className="rounded-xl border border-white bg-white/85 px-3 py-2 text-sm font-semibold">
            <option value="" disabled>
              Escolha um ODS…
            </option>
            {ODS.map((o) => (
              <option key={o.numero} value={o.numero}>
                {o.numero}. {o.nome}
              </option>
            ))}
          </select>
        </label>
        <Deslizante id="lab-font-size" rotulo="font-size" valor={tamanho} min={12} max={40} aoMudar={setTamanho} />
        <Deslizante id="lab-line-height" rotulo="line-height" valor={linha} min={1} max={2.4} passo={0.1} unidade="" cor="#6366f1" aoMudar={(v) => setLinha(Math.round(v * 10) / 10)} />
        <Opcoes rotulo="font-family" opcoes={FONTES} valor={fonte} aoMudar={setFonte} />
        <Opcoes rotulo="font-weight" opcoes={PESOS} valor={peso} aoMudar={setPeso} />
        <Opcoes rotulo="text-align" opcoes={ALINHAMENTOS} valor={alinhar} aoMudar={setAlinhar} />
      </div>
    </div>
  );
}
