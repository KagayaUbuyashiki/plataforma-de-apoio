import Link from "next/link";
import { corDoTexto, type Ods } from "@/data/ods";

type Props = { ods: Ods; compacto?: boolean };

export function OdsCard({ ods, compacto = false }: Props) {
  const texto = corDoTexto(ods.cor);
  return (
    <Link
      href={`/ods/${ods.numero}`}
      title={`ODS ${ods.numero}: ${ods.nome}`}
      className={`group flex aspect-square flex-col justify-between overflow-hidden rounded-xl shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        compacto ? "p-2 sm:p-3" : "p-3 sm:p-4"
      }`}
      style={{ backgroundColor: ods.cor, color: texto }}
    >
      <span className={`font-black leading-none ${compacto ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"}`}>{ods.numero}</span>
      {/* hyphens-auto + overflow-wrap evitam que palavras longas (ex.: INFRAESTRUTURA) estourem o card */}
      <span
        lang="pt-BR"
        className={`font-bold uppercase leading-tight hyphens-auto [overflow-wrap:anywhere] ${
          compacto ? "text-[10px] sm:text-[11px]" : "text-xs sm:text-sm"
        }`}
      >
        {ods.nome}
      </span>
    </Link>
  );
}
