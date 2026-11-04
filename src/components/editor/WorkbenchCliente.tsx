"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { Nivel } from "@/lib/editor/tipos";

const Carregando = () => <div className="grid h-dvh place-items-center bg-[#1e1e1e] text-sm text-[#8a8a8a]">Carregando o editor…</div>;

// O editor só existe no navegador (usa localStorage e o Monaco).
const Workbench = dynamic(() => import("./Workbench").then((m) => m.Workbench), { ssr: false, loading: Carregando });

export function WorkbenchCliente({ nivel }: { nivel: Nivel }) {
  return (
    <Suspense fallback={<Carregando />}>
      <Workbench nivel={nivel} />
    </Suspense>
  );
}
