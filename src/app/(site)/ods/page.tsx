import type { Metadata } from "next";
import { IconeCaixa, type NomeIcone } from "@/components/Icone";
import { OdsCard } from "@/components/OdsCard";
import { Titulo } from "@/components/Titulo";
import { ODS } from "@/data/ods";

export const metadata: Metadata = { title: "Os 17 ODS" };

const DICAS: { titulo: string; texto: string; icone: NomeIcone; cor: string }[] = [
  {
    titulo: "Como escolher o seu tema",
    texto:
      "Pense no que te incomoda ou te inspira na sua cidade, na sua escola ou no mundo. O melhor tema é aquele sobre o qual você tem vontade de pesquisar.",
    icone: "bussola",
    cor: "#6366f1",
  },
  {
    titulo: "Pesquise em fontes confiáveis",
    texto: "Prefira sites oficiais (ONU Brasil, IBGE, prefeituras, universidades) e sempre cite de onde tirou as informações.",
    icone: "lupa",
    cor: "#0ea5c6",
  },
  {
    titulo: "Traga para perto de você",
    texto: "Mostre como o ODS aparece na Zona da Mata e na sua cidade. Exemplos locais deixam o site muito mais interessante!",
    icone: "pino",
    cor: "#ec4899",
  },
];

export default function OdsLista() {
  return (
    <>
      <Titulo
        titulo="Os 17 Objetivos de Desenvolvimento Sustentável"
        subtitulo={
          <>
            Os <strong>ODS</strong> são 17 metas globais criadas pela ONU em 2015, a chamada <strong>Agenda 2030</strong>, para acabar
            com a pobreza, proteger o planeta e garantir paz e prosperidade para todas as pessoas. O seu site vai falar sobre um
            deles. Clique em um ODS para conhecer o tema e ver ideias para o seu projeto.
          </>
        }
      />

      <div className="vidro rounded-[32px] p-4 sm:p-7">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ODS.map((o, i) => (
            <OdsCard key={o.numero} ods={o} atraso={(i % 6) * 0.6} />
          ))}
        </div>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {DICAS.map((dica, i) => (
          <div key={dica.titulo} data-revelar style={{ "--d": i } as React.CSSProperties} className="vidro rounded-3xl p-6">
            <IconeCaixa nome={dica.icone} cor={dica.cor} />
            <h2 className="mt-4 font-extrabold">{dica.titulo}</h2>
            <p className="mt-2 text-sm font-medium leading-relaxed text-tinta-suave">{dica.texto}</p>
          </div>
        ))}
      </section>
    </>
  );
}
