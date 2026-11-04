import Link from "next/link";
import LayoutSite from "./(site)/layout";

export default function NaoEncontrado() {
  return (
    <LayoutSite>
      <div className="relative py-20 text-center">
        <p data-revelar className="texto-aurora text-[8rem] font-extrabold leading-none tracking-[-0.06em] sm:text-[11rem]">404</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Página não encontrada</h1>
        <p className="mt-3 text-lg font-medium text-tinta-suave">Até os melhores sites têm links quebrados.</p>
        <Link href="/" className="btn-primario mt-8">
          Voltar para o início
        </Link>
      </div>
    </LayoutSite>
  );
}
