import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Meu Primeiro Site · Plataforma de apoio", template: "%s · Meu Primeiro Site" },
  description:
    "Resumos das aulas, editor de código, sites de referência, os 17 ODS e avaliação das aulas para alunos e voluntários do programa Meu Primeiro Site.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
