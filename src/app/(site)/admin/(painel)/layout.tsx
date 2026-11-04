import Link from "next/link";
import { exigirInstrutor } from "@/lib/auth";
import { sair } from "../login/actions";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/admin", rotulo: "Painel" },
  { href: "/admin/sites", rotulo: "Sites" },
  { href: "/admin/aulas", rotulo: "Aulas" },
  { href: "/admin/turmas", rotulo: "Turmas e instrutores" },
  { href: "/admin/avaliacoes", rotulo: "Avaliações" },
];

export default async function LayoutPainel({ children }: { children: React.ReactNode }) {
  const { user } = await exigirInstrutor();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap gap-1" aria-label="Painel do instrutor">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-marca-50 hover:text-marca-700">
              {l.rotulo}
            </Link>
          ))}
        </nav>
        <form action={sair} className="flex items-center gap-3 px-3 text-sm text-slate-500">
          <span className="truncate">{user.email}</span>
          <button type="submit" className="font-medium text-slate-700 hover:text-red-700">
            Sair
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
