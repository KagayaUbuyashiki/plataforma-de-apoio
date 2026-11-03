import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Plataforma de apoio para alunos e voluntários do programa <strong>Meu Primeiro Site</strong>, no Rio Pomba Valley.
        </p>
        <Link href="/admin" className="font-medium text-slate-600 hover:text-marca-700">
          Área do instrutor
        </Link>
      </div>
    </footer>
  );
}
