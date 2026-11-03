import Link from "next/link";
import { OdsCard } from "@/components/OdsCard";
import { ODS } from "@/data/ods";
import { listarAulas } from "@/lib/dados";

export const dynamic = "force-dynamic";

const ATALHOS = [
  { href: "/aulas", titulo: "Aulas", texto: "Resumos, códigos de exemplo e materiais de cada encontro.", icone: "📚" },
  { href: "/sites", titulo: "Sites de referência", texto: "Sites que apresentamos em aula para inspirar o seu projeto.", icone: "🌐" },
  { href: "/ods", titulo: "Os 17 ODS", texto: "Entenda cada objetivo e encontre ideias para o tema do seu site.", icone: "🎯" },
  { href: "/avaliar", titulo: "Avaliar aula", texto: "Dê sua opinião, de forma anônima, sobre a aula e os instrutores.", icone: "⭐" },
];

const ETAPAS = [
  { titulo: "Escolha um ODS", texto: "Pesquise os 17 objetivos e escolha o tema que mais combina com você." },
  { titulo: "Estruture com HTML", texto: "Monte as páginas com títulos, textos, imagens, listas e links." },
  { titulo: "Dê estilo com CSS", texto: "Cores, fontes, espaçamentos e layout para deixar o site com a sua cara." },
  { titulo: "Apresente", texto: "Mostre o seu site para a banca de voluntários e celebre na formatura!" },
];

export default async function Inicio() {
  const { dados: aulas } = await listarAulas();
  const ultima = aulas.filter((a) => a.publicada).at(-1);

  return (
    <div className="flex flex-col gap-16">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-marca-900 via-marca-700 to-marca-500 px-6 py-12 text-white sm:px-12 sm:py-16">
        <p className="font-mono text-sm text-marca-100">&lt;h1&gt;Bem-vindo(a)!&lt;/h1&gt;</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
          Tudo o que você precisa para criar o seu primeiro site
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-marca-100">
          Resumos das aulas, sites de inspiração, os temas dos ODS e um espaço para você avaliar cada encontro.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {ultima ? (
            <Link href={`/aulas/${ultima.slug}`} className="rounded-md bg-white px-5 py-3 font-semibold text-marca-900 hover:bg-marca-50">
              Ver a última aula: {ultima.titulo}
            </Link>
          ) : (
            <Link href="/aulas" className="rounded-md bg-white px-5 py-3 font-semibold text-marca-900 hover:bg-marca-50">
              Ver as aulas
            </Link>
          )}
          <Link href="/ods" className="rounded-md border border-white/40 px-5 py-3 font-semibold text-white hover:bg-white/10">
            Explorar os ODS
          </Link>
        </div>
      </section>

      <section aria-labelledby="atalhos">
        <h2 id="atalhos" className="sr-only">Atalhos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ATALHOS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-marca-500 hover:shadow-md"
            >
              <span className="text-3xl" aria-hidden>{a.icone}</span>
              <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-marca-700">{a.titulo}</h3>
              <p className="mt-1 text-sm text-slate-600">{a.texto}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">O que é o Meu Primeiro Site?</h2>
          <div className="mt-4 space-y-3 text-slate-700">
            <p>
              O <strong>Meu Primeiro Site</strong> é um programa da <strong>Junior Achievement Brasil</strong> em parceria com o{" "}
              <strong>Instituto Energisa</strong>, que mostra que qualquer pessoa pode aprender a programar.
            </p>
            <p>
              Aqui na Zona da Mata ele faz parte do <strong>Rio Pomba Valley</strong>, um polo de tecnologia, inovação e
              empreendedorismo da região.
            </p>
            <p>
              Ao longo de cerca de <strong>22 horas</strong> de atividades, com apoio de voluntários, cada jovem cria{" "}
              <strong>individualmente</strong> um site em <strong>HTML e CSS</strong> tendo como tema um dos{" "}
              <strong>17 Objetivos de Desenvolvimento Sustentável (ODS)</strong> da ONU.
            </p>
          </div>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {ETAPAS.map((e, i) => (
            <li key={e.titulo} className="rounded-xl border border-slate-200 bg-white p-5">
              <span className="font-mono text-sm font-bold text-marca-600">Etapa {i + 1}</span>
              <h3 className="mt-1 font-semibold">{e.titulo}</h3>
              <p className="mt-1 text-sm text-slate-600">{e.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Os 17 ODS</h2>
          <Link href="/ods" className="text-sm font-semibold text-marca-700 hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-9">
          {ODS.map((o) => (
            <OdsCard key={o.numero} ods={o} compacto />
          ))}
        </div>
      </section>
    </div>
  );
}
