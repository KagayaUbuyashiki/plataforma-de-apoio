import Link from "next/link";
import { corDoTexto, type Ods } from "@/data/ods";

type Props = { ods: Ods; compacto?: boolean; atraso?: number };

export function OdsCard({ ods, compacto = false, atraso = 0 }: Props) {
  const texto = corDoTexto(ods.cor);
  return (
    <Link
      href={`/ods/${ods.numero}`}
      title={`ODS ${ods.numero}: ${ods.nome}`}
      data-revelar
      className={`reflexo group flex aspect-square flex-col justify-between overflow-hidden rounded-[18px] transition duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1.5 hover:-rotate-2 ${
        compacto ? "p-2.5 sm:p-3" : "p-3.5 sm:p-4"
      }`}
      style={{ backgroundColor: ods.cor, color: texto, boxShadow: `0 12px 24px -14px ${ods.cor}`, "--d": atraso } as React.CSSProperties}
    >
      <span className={`font-extrabold leading-none tracking-tight ${compacto ? "text-2xl sm:text-[28px]" : "text-4xl sm:text-5xl"}`}>
        {ods.numero}
      </span>
      {/* hyphens-auto + overflow-wrap evitam que palavras longas (ex.: INFRAESTRUTURA) estourem o card */}
      <span
        lang="pt-BR"
        className={`font-extrabold uppercase leading-tight hyphens-auto [overflow-wrap:anywhere] ${
          compacto ? "text-[10px] sm:text-[10.5px]" : "text-xs sm:text-sm"
        }`}
      >
        {ods.nome}
      </span>
    </Link>
  );
}
