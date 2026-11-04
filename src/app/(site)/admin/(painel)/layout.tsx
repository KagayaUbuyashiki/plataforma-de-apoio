import Link from "next/link";
import { exigirInstrutor } from "@/lib/auth";
import { sair } from "../login/actions";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/admin", rotulo: "Painel" },
  { href: "/admin/sites", rotulo: "Sites" },
  { href: "/admin/aulas", rotulo: "Aulas" },
  { href: "/admin/turmas", rotulo: "Turmas e instrutores" },
  { href: "/admin/contatos", rotulo: "Contatos" },
  { href: "/admin/avaliacoes", rotulo: "Avaliações" },
];

export default async function LayoutPainel({ children }: { children: React.ReactNode }) {
  const { user } = await exigirInstrutor();

  return (
    <div className="flex flex-col gap-8">
      <div className="vidro flex flex-col gap-3 rounded-3xl p-2 sm:flex-row sm:items-center sm:justify-between sm:rounded-full">
        <nav className="flex flex-wrap gap-1" aria-label="Painel do instrutor">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-3.5 py-2 text-sm font-semibold text-tinta-suave transition hover:bg-white hover:text-tinta">
              {l.rotulo}
            </Link>
          ))}
        </nav>
        <form action={sair} className="flex items-center gap-3 px-3 text-sm font-medium text-tinta-suave">
          <span className="truncate">{user.email}</span>
          <button type="submit" className="rounded-full bg-white/70 px-3.5 py-1.5 font-bold text-tinta transition hover:bg-red-50 hover:text-red-700">
            Sair
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
