import { AnimacoesScroll } from "@/components/AnimacoesScroll";
import { Aurora } from "@/components/Aurora";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

/** Layout das páginas comuns da plataforma (com cabeçalho e rodapé). */
export default function LayoutSite({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <Aurora />
      <AnimacoesScroll />
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:py-14">
        {children}
      </main>
      <Footer />
    </div>
  );
}
