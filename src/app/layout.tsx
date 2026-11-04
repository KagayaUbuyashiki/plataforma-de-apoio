import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Meu Primeiro Site · Plataforma de apoio", template: "%s · Meu Primeiro Site" },
  description:
    "Resumos das aulas, editor de código, sites de referência, os 17 ODS e avaliação das aulas para alunos e voluntários do programa Meu Primeiro Site.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={manrope.variable} suppressHydrationWarning>
      <head>
        {/* Marca que o JavaScript está ativo: só assim os blocos começam escondidos para a animação de entrada. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
