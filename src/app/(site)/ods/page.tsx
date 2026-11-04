import type { Metadata } from "next";
import { OdsCard } from "@/components/OdsCard";
import { Titulo } from "@/components/Titulo";
import { ODS } from "@/data/ods";

export const metadata: Metadata = { title: "Os 17 ODS" };

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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {ODS.map((o) => (
          <OdsCard key={o.numero} ods={o} />
        ))}
      </div>

      <section className="mt-12 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 md:grid-cols-3">
        <div>
          <h2 className="font-semibold">🧭 Como escolher o seu tema</h2>
          <p className="mt-2 text-sm text-slate-600">
            Pense no que te incomoda ou te inspira na sua cidade, na sua escola ou no mundo. O melhor tema é aquele sobre o qual
            você tem vontade de pesquisar.
          </p>
        </div>
        <div>
          <h2 className="font-semibold">🔎 Pesquise em fontes confiáveis</h2>
          <p className="mt-2 text-sm text-slate-600">
            Prefira sites oficiais (ONU Brasil, IBGE, prefeituras, universidades) e sempre cite de onde tirou as informações.
          </p>
        </div>
        <div>
          <h2 className="font-semibold">📍 Traga para perto de você</h2>
          <p className="mt-2 text-sm text-slate-600">
            Mostre como o ODS aparece na Zona da Mata e na sua cidade. Exemplos locais deixam o site muito mais interessante!
          </p>
        </div>
      </section>
    </>
  );
}
