import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-16 px-4 pb-8">
      <div className="vidro mx-auto flex max-w-6xl flex-col gap-3 rounded-3xl px-6 py-5 text-sm font-medium text-tinta-suave sm:flex-row sm:items-center sm:justify-between">
        <p>
          Plataforma de apoio para alunos e voluntários do programa <strong className="text-tinta">Meu Primeiro Site</strong>, no Rio
          Pomba Valley.
        </p>
        <Link href="/admin" className="font-bold text-tinta transition hover:text-marca-600">
          Área do instrutor
        </Link>
      </div>
    </footer>
  );
}
