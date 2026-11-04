import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="py-20 text-center">
      <p className="font-mono text-6xl font-bold text-marca-600">404</p>
      <h1 className="mt-4 text-2xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-slate-600">Até os melhores sites têm links quebrados. 😉</p>
      <Link href="/" className="mt-6 inline-block rounded-md bg-marca-600 px-4 py-2 font-semibold text-white hover:bg-marca-700">
        Voltar para o início
      </Link>
    </div>
  );
}
