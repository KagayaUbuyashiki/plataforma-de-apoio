import type { Metadata } from "next";
import Link from "next/link";
import { Icone, IconeCaixa, type NomeIcone } from "@/components/Icone";
import { Titulo } from "@/components/Titulo";

export const metadata: Metadata = {
  title: "Aprender HTML e CSS",
  description: "Dicionário visual, laboratórios interativos, erros comuns e como a web funciona: tudo para quem está começando com HTML e CSS.",
};

const AREAS: { href: string; titulo: string; texto: string; icone: NomeIcone; cor: string; destaque?: string }[] = [
  {
    href: "/aprender/como-funciona",
    titulo: "Como a web funciona",
    texto: "O que acontece entre digitar um endereço e a página aparecer? Uma história em 5 passos animados.",
    icone: "globo",
    cor: "#6366f1",
    destaque: "Comece por aqui",
  },
  {
    href: "/aprender/dicionario",
    titulo: "Dicionário visual",
    texto: "Cada tag HTML e propriedade CSS explicada em palavras simples, com o código e o resultado lado a lado.",
    icone: "livro",
    cor: "#0ea5c6",
  },
  {
    href: "/aprender/laboratorio",
    titulo: "Laboratórios de CSS",
    texto: "Mexa nos controles e veja margin, padding, cores, fontes e Flexbox mudarem na hora.",
    icone: "paleta",
    cor: "#ec4899",
  },
  {
    href: "/aprender/erros",
    titulo: "Meu site não funciona!",
    texto: "Os erros mais comuns de quem está começando, por que acontecem e como consertar.",
    icone: "lupa",
    cor: "#f59e0b",
  },
];

export default function Aprender() {
  return (
    <>
      <Titulo
        selo="Aprender"
        titulo="Aprenda HTML e CSS do seu jeito"
        subtitulo="Materiais para consultar quando bater a dúvida, brincar com o código e entender de verdade como as coisas funcionam."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {AREAS.map((a, i) => (
          <Link
            key={a.href}
            href={a.href}
            data-revelar
            style={{ "--d": i } as React.CSSProperties}
            className="vidro group relative flex flex-col gap-4 overflow-hidden rounded-[28px] p-7 transition duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-2 hover:bg-white/85 sm:p-8"
          >
            <span
              aria-hidden
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-2xl transition duration-700 group-hover:scale-150 group-hover:opacity-40"
              style={{ background: a.cor }}
            />
            <div className="flex items-start justify-between gap-3">
              <IconeCaixa nome={a.icone} cor={a.cor} tamanho={56} className="transition duration-500 group-hover:-rotate-6 group-hover:scale-105" />
              {a.destaque && <span className="chip">{a.destaque}</span>}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">{a.titulo}</h2>
              <p className="mt-2 font-medium leading-relaxed text-tinta-suave">{a.texto}</p>
            </div>
            <span className="mt-auto flex items-center gap-1.5 text-sm font-bold text-marca-600">
              Abrir <Icone nome="seta" tamanho={14} espessura={2.2} className="seta-anda" />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
