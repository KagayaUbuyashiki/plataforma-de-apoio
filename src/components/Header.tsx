"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", rotulo: "Início" },
  { href: "/aulas", rotulo: "Aulas" },
  { href: "/sites", rotulo: "Sites" },
  { href: "/ods", rotulo: "ODS" },
];

export function Header() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  const ativo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-marca-900" onClick={() => setAberto(false)}>
          <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg bg-marca-600 font-mono text-sm text-white">
            &lt;/&gt;
          </span>
          <span className="leading-tight">
            Meu Primeiro Site
            <span className="block text-xs font-normal text-slate-500">Plataforma de apoio</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={ativo(l.href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                ativo(l.href) ? "bg-marca-50 text-marca-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {l.rotulo}
            </Link>
          ))}
          <Link
            href="/avaliar"
            className="ml-2 rounded-md bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700"
          >
            Avaliar aula
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-expanded={aberto}
          aria-controls="menu-celular"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setAberto((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            {aberto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {aberto && (
        <nav id="menu-celular" className="border-t border-slate-200 px-4 pb-4 md:hidden" aria-label="Principal">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              aria-current={ativo(l.href) ? "page" : undefined}
              className={`block rounded-md px-3 py-3 font-medium ${ativo(l.href) ? "bg-marca-50 text-marca-700" : "text-slate-700"}`}
            >
              {l.rotulo}
            </Link>
          ))}
          <Link
            href="/avaliar"
            onClick={() => setAberto(false)}
            className="mt-2 block rounded-md bg-marca-600 px-3 py-3 text-center font-semibold text-white"
          >
            Avaliar aula
          </Link>
        </nav>
      )}
    </header>
  );
}
