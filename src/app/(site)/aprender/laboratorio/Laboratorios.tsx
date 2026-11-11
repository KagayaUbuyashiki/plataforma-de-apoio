"use client";

import { useEffect, useState } from "react";
import { IconeCaixa, type NomeIcone } from "@/components/Icone";
import { LabCaixa } from "@/components/aprender/LabCaixa";
import { LabCores } from "@/components/aprender/LabCores";
import { LabFlex } from "@/components/aprender/LabFlex";

const LABS: { id: string; titulo: string; texto: string; icone: NomeIcone; cor: string }[] = [
  { id: "caixa", titulo: "Caixa", texto: "margin, border e padding", icone: "pasta", cor: "#f59e0b" },
  { id: "cores", titulo: "Cores e textos", texto: "cores, fontes e leitura", icone: "paleta", cor: "#ec4899" },
  { id: "flex", titulo: "Flexbox", texto: "organizar lado a lado", icone: "grafico", cor: "#0ea5c6" },
];

/** Guarda no navegador quais laboratórios a pessoa já abriu (usado na conquista "Curioso(a)"). */
function marcarVisitado(id: string) {
  try {
    const atual = new Set<string>(JSON.parse(localStorage.getItem("mps-labs") ?? "[]"));
    atual.add(id);
    localStorage.setItem("mps-labs", JSON.stringify([...atual]));
  } catch {}
}

export function Laboratorios() {
  const [aba, setAba] = useState("caixa");

  useEffect(() => {
    const doHash = window.location.hash.slice(1);
    if (LABS.some((l) => l.id === doHash)) setAba(doHash);
  }, []);
  useEffect(() => {
    marcarVisitado(aba);
    history.replaceState(null, "", `#${aba}`);
  }, [aba]);

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Laboratórios" className="grid grid-cols-3 gap-2 sm:gap-3">
        {LABS.map((l, i) => (
          <button
            key={l.id}
            role="tab"
            id={`aba-${l.id}`}
            aria-selected={aba === l.id}
            aria-controls={`painel-${l.id}`}
            onClick={() => setAba(l.id)}
            data-revelar
            style={{ "--d": i } as React.CSSProperties}
            className={`group flex flex-col items-center gap-2 rounded-3xl p-3 text-center transition duration-300 sm:flex-row sm:gap-3 sm:p-4 sm:text-left ${
              aba === l.id ? "bg-white shadow-[0_16px_40px_-20px_rgb(12_27_42/0.45)] ring-2 ring-tinta" : "vidro hover:-translate-y-1 hover:bg-white/85"
            }`}
          >
            <IconeCaixa nome={l.icone} cor={l.cor} tamanho={40} className="transition duration-500 group-hover:-rotate-6" />
            <span>
              <span className="block text-sm font-extrabold sm:text-base">{l.titulo}</span>
              <span className="hidden text-sm font-medium text-tinta-suave sm:block">{l.texto}</span>
            </span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`painel-${aba}`} aria-labelledby={`aba-${aba}`} key={aba} className="animate-surgir">
        {aba === "caixa" && <LabCaixa />}
        {aba === "cores" && <LabCores />}
        {aba === "flex" && <LabFlex />}
      </div>
    </div>
  );
}
