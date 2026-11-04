import Link from "next/link";
import { Icone, IconeCaixa, type NomeIcone } from "@/components/Icone";
import { OdsCard } from "@/components/OdsCard";
import { ODS } from "@/data/ods";
import { listarAulas } from "@/lib/dados";

export const dynamic = "force-dynamic";

const ATALHOS: { href: string; titulo: string; texto: string; icone: NomeIcone; cor: string }[] = [
  { href: "/aulas", titulo: "Aulas", texto: "Resumos, códigos de exemplo e materiais de cada encontro.", icone: "livro", cor: "#0ea5c6" },
  { href: "/editor", titulo: "Editor de código", texto: "Crie o seu site num editor igual ao VS Code, com prévia ao vivo.", icone: "codigo", cor: "#6366f1" },
  { href: "/sites", titulo: "Sites de referência", texto: "Sites que apresentamos em aula para inspirar o seu projeto.", icone: "globo", cor: "#14b8a6" },
  { href: "/ods", titulo: "Os 17 ODS", texto: "Entenda cada objetivo e encontre ideias para o tema do seu site.", icone: "alvo", cor: "#ec4899" },
  { href: "/avaliar", titulo: "Avaliar aula", texto: "Dê sua opinião, de forma anônima, sobre a aula e os instrutores.", icone: "estrela", cor: "#f59e0b" },
];

const ETAPAS = [
  { titulo: "Escolha um ODS", texto: "Pesquise os 17 objetivos e escolha o tema que mais combina com você." },
  { titulo: "Estruture com HTML", texto: "Monte as páginas com títulos, textos, imagens, listas e links." },
  { titulo: "Dê estilo com CSS", texto: "Cores, fontes, espaçamentos e layout para deixar o site com a sua cara." },
  { titulo: "Apresente", texto: "Mostre o seu site para a banca de voluntários e celebre na formatura!" },
];

const d = (n: number) => ({ "--d": n }) as React.CSSProperties;

export default async function Inicio() {
  const { dados: aulas } = await listarAulas();
  const ultima = aulas.filter((a) => a.publicada).at(-1);

  return (
    <div className="flex flex-col gap-20 sm:gap-24">
      <section className="relative px-2 pb-6 pt-8 text-center sm:pt-16">
        {/* Cartões flutuantes (decorativos, só em telas grandes) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="vidro absolute -left-4 top-0 animate-flutuar rounded-2xl px-4 py-3 text-left">
            <div className="flex items-center gap-3">
              <IconeCaixa nome="livro" cor="linear-gradient(135deg,#0ea5c6,#6366f1)" tamanho={38} />
              <div className="max-w-44">
                <b className="block text-sm">{ultima ? `Aula ${ultima.numero}` : "Aulas"}</b>
                <small className="block truncate font-medium text-tinta-suave">{ultima ? ultima.titulo : "Resumos de cada encontro"}</small>
              </div>
            </div>
          </div>
          <div className="vidro absolute right-0 top-10 animate-flutuar rounded-2xl px-4 py-3 text-left [animation-delay:-2s]">
            <div className="flex items-center gap-3">
              <span className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-[#0A97D9] text-sm font-extrabold text-white">17</span>
              <div>
                <b className="block text-sm">Objetivos da ONU</b>
                <small className="block font-medium text-tinta-suave">temas para o seu site</small>
              </div>
            </div>
          </div>
          <div className="vidro absolute bottom-0 left-12 animate-flutuar rounded-2xl px-4 py-3 text-left [animation-delay:-4s]">
            <b className="block text-sm tracking-[2px] text-amber-500">★★★★★</b>
            <small className="block font-medium text-tinta-suave">Avaliação anônima</small>
          </div>
          <div className="vidro absolute bottom-6 right-8 animate-flutuar rounded-2xl px-4 py-3 text-left [animation-delay:-1s]">
            <div className="flex items-center gap-3">
              <IconeCaixa nome="check" cor="#12b76a" tamanho={38} />
              <div>
                <b className="block text-sm">Prévia ao vivo</b>
                <small className="block font-medium text-tinta-suave">index.html · style.css</small>
              </div>
            </div>
          </div>
        </div>

        <span className="chip" data-revelar>
          <Icone nome="brilho" tamanho={14} espessura={2.2} /> Programa Meu Primeiro Site · Rio Pomba Valley
        </span>
        <h1
          data-revelar
          style={d(1)}
          className="mx-auto mt-6 max-w-4xl text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-[68px]"
        >
          Tudo o que você precisa para criar o seu <span className="texto-aurora">primeiro site</span>
        </h1>
        <p data-revelar style={d(2)} className="mx-auto mt-6 max-w-xl text-lg font-medium leading-relaxed text-tinta-suave">
          Resumos das aulas, sites de inspiração, os temas dos ODS e um espaço para você avaliar cada encontro.
        </p>
        <div data-revelar style={d(3)} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          {ultima ? (
            <Link href={`/aulas/${ultima.slug}`} className="btn-primario group">
              Ver a última aula: {ultima.titulo}
              <Icone nome="seta" tamanho={16} espessura={2.2} className="seta-anda" />
            </Link>
          ) : (
            <Link href="/aulas" className="btn-primario group">
              Ver as aulas
              <Icone nome="seta" tamanho={16} espessura={2.2} className="seta-anda" />
            </Link>
          )}
          <Link href="/ods" className="btn-secundario">
            Explorar os ODS
          </Link>
        </div>
      </section>

      <section aria-labelledby="atalhos">
        <h2 id="atalhos" className="sr-only">Atalhos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ATALHOS.map((a, i) => (
            <Link
              key={a.href}
              href={a.href}
              data-revelar
              style={d(i)}
              className="vidro group flex items-start gap-4 rounded-3xl p-5 transition duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-2 hover:bg-white/85 lg:block lg:p-6"
            >
              <IconeCaixa nome={a.icone} cor={a.cor} className="transition duration-500 group-hover:-rotate-6 group-hover:scale-105" />
              <div>
                <h3 className="text-[17px] font-extrabold tracking-tight lg:mt-5">{a.titulo}</h3>
                <p className="mt-1.5 text-sm font-medium leading-relaxed text-tinta-suave lg:mt-2">{a.texto}</p>
                <span className="mt-4 hidden items-center gap-1.5 text-sm font-bold text-marca-600 opacity-0 transition duration-300 group-hover:opacity-100 lg:flex">
                  Acessar <Icone nome="seta" tamanho={14} espessura={2.2} className="seta-anda" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div data-revelar className="vidro rounded-[28px] p-7 sm:p-10">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-marca-600">O programa</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-[42px] sm:leading-[1.1]">O que é o Meu Primeiro Site?</h2>
          <div className="mt-4 space-y-4 font-medium leading-relaxed text-[#2b3a4a]">
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
        <ol data-revelar style={d(2)} className="vidro grid gap-3.5 rounded-[28px] p-3.5 sm:grid-cols-2">
          {ETAPAS.map((e, i) => (
            <li
              key={e.titulo}
              className="rounded-[20px] border border-white bg-white/70 p-6 transition duration-500 hover:scale-[1.02] hover:bg-white/90"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,#0ea5c6,#6366f1)] text-sm font-extrabold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-extrabold">{e.titulo}</h3>
              <p className="mt-1.5 text-sm font-medium leading-relaxed text-tinta-suave">{e.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div data-revelar className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-marca-600">Temas</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-[42px]">Os 17 ODS</h2>
          <p className="mt-3 text-lg font-medium text-tinta-suave">Escolha o objetivo que vai guiar o seu site.</p>
        </div>
        <div className="vidro mt-10 rounded-[32px] p-4 sm:p-7">
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6 lg:grid-cols-9">
            {ODS.map((o, i) => (
              <OdsCard key={o.numero} ods={o} compacto atraso={(i % 9) * 0.5} />
            ))}
            <Link
              href="/ods"
              data-revelar
              style={d(4)}
              className="group flex aspect-square flex-col items-center justify-center gap-1 rounded-[18px] border border-dashed border-[#b7c6d3] bg-white/70 text-sm font-bold text-tinta-suave transition hover:bg-white hover:text-tinta"
            >
              Ver todos <Icone nome="seta" tamanho={16} espessura={2.2} className="seta-anda" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
