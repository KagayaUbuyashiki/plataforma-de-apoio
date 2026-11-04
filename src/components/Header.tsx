"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icone } from "@/components/Icone";

const LINKS = [
  { href: "/", rotulo: "Início" },
  { href: "/aulas", rotulo: "Aulas" },
  { href: "/editor", rotulo: "Editor" },
  { href: "/sites", rotulo: "Sites" },
  { href: "/ods", rotulo: "ODS" },
  { href: "/contatos", rotulo: "Contatos" },
];

export function Header() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  const ativo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-3.5 z-30 mt-3.5 px-4">
      <div className="vidro mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full py-2 pl-4 pr-2">
        <Link href="/" className="group flex items-center gap-2.5 font-extrabold text-tinta" onClick={() => setAberto(false)}>
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-full bg-[conic-gradient(from_200deg,#0ea5c6,#6366f1,#ec4899,#0ea5c6)] font-mono text-[11px] font-bold text-white transition duration-500 group-hover:rotate-[20deg]"
          >
            &lt;/&gt;
          </span>
          <span className="leading-tight">
            Meu Primeiro Site
            <span className="block text-xs font-semibold text-tinta-suave">Plataforma de apoio</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Principal">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={ativo(l.href) ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition duration-300 ${
                ativo(l.href) ? "bg-white text-tinta shadow-[0_2px_8px_rgb(12_27_42/0.08)]" : "text-tinta-suave hover:bg-white/50 hover:text-tinta"
              }`}
            >
              {l.rotulo}
            </Link>
          ))}
        </nav>

        <Link href="/avaliar" className="btn-primario hidden !py-2.5 md:inline-flex">
          Avaliar aula
        </Link>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-tinta shadow-sm transition hover:scale-105 md:hidden"
          aria-expanded={aberto}
          aria-controls="menu-celular"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setAberto((v) => !v)}
        >
          <Icone nome={aberto ? "fechar" : "menu"} tamanho={22} espessura={2} />
        </button>
      </div>

      {aberto && (
        <nav
          id="menu-celular"
          className="vidro-forte mx-auto mt-2 flex max-w-6xl animate-entrar-menu flex-col gap-1 rounded-3xl p-3 md:hidden"
          aria-label="Principal"
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              aria-current={ativo(l.href) ? "page" : undefined}
              className={`rounded-2xl px-4 py-3 font-semibold ${ativo(l.href) ? "bg-white text-tinta shadow-sm" : "text-tinta-suave"}`}
            >
              {l.rotulo}
            </Link>
          ))}
          <Link href="/avaliar" onClick={() => setAberto(false)} className="btn-primario mt-1">
            Avaliar aula
          </Link>
        </nav>
      )}
    </header>
  );
}
