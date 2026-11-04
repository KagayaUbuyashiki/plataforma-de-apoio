import type { Metadata } from "next";
import Link from "next/link";
import { Icone, IconeCaixa, type NomeIcone } from "@/components/Icone";
import { Titulo } from "@/components/Titulo";
import { NIVEIS } from "@/lib/editor/niveis";
import { ProjetosSalvos } from "./ProjetosSalvos";

export const metadata: Metadata = { title: "Editor de código" };

const VISUAL: Record<string, { icone: NomeIcone; cor: string }> = {
  iniciante: { icone: "brilho", cor: "#14b8a6" },
  intermediario: { icone: "teclado", cor: "#0ea5c6" },
  livre: { icone: "foguete", cor: "#6366f1" },
};

function Tecla({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-md border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-xs font-bold text-tinta shadow-[0_2px_0_#cbd5e1]">
      {children}
    </kbd>
  );
}

export default function Editor() {
  return (
    <div className="flex flex-col gap-10">
      <Titulo
        titulo="Editor de código"
        subtitulo="Crie o seu site aqui mesmo, num editor igual ao VS Code, vendo o resultado ao vivo. Escolha o nível que combina com você — dá para mudar quando quiser."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {NIVEIS.map((n, i) => (
          <Link
            key={n.id}
            href={`/editor/${n.id}`}
            data-revelar
            style={{ "--d": i } as React.CSSProperties}
            className="vidro group flex flex-col rounded-3xl p-7 transition duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-2 hover:bg-white/85"
          >
            <div className="flex items-center justify-between">
              <IconeCaixa
                nome={VISUAL[n.id]?.icone ?? "codigo"}
                cor={VISUAL[n.id]?.cor ?? "#0ea5c6"}
                className="transition duration-500 group-hover:-rotate-6 group-hover:scale-105"
              />
              <span className="chip">Nível {i + 1}</span>
            </div>
            <h2 className="mt-5 text-xl font-extrabold text-tinta">{n.nome}</h2>
            <p className="mt-1.5 text-sm font-medium leading-relaxed text-tinta-suave">{n.resumo}</p>
            <ul className="mt-5 flex flex-col gap-2 text-sm font-medium text-[#2b3a4a]">
              {n.recursos.map((r) => (
                <li key={r} className="flex gap-2.5">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-marca-100 text-marca-700" aria-hidden>
                    <Icone nome="check" tamanho={10} espessura={3} />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
            <span className="mt-auto flex items-center gap-1.5 pt-7 text-sm font-bold text-marca-600">
              Novo projeto <Icone nome="seta" tamanho={14} espessura={2.2} className="seta-anda" />
            </span>
          </Link>
        ))}
      </div>

      <ProjetosSalvos />

      <section data-revelar className="vidro grid gap-6 rounded-3xl p-6 sm:p-8 md:grid-cols-3">
        <div>
          <h2 className="flex items-center gap-2.5 font-extrabold"><IconeCaixa nome="teclado" cor="#0ea5c6" tamanho={32} className="!rounded-xl" /> Atalhos úteis</h2>
          <ul className="mt-3 space-y-2 text-sm font-medium text-tinta-suave">
            <li><Tecla>Ctrl</Tecla> + <Tecla>Z</Tecla> desfaz</li>
            <li><Tecla>Ctrl</Tecla> + <Tecla>S</Tecla> salva</li>
            <li><Tecla>Ctrl</Tecla> + <Tecla>Espaço</Tecla> mostra sugestões</li>
            <li><Tecla>Ctrl</Tecla> + <Tecla>/</Tecla> comenta a linha</li>
          </ul>
        </div>
        <div>
          <h2 className="flex items-center gap-2.5 font-extrabold"><IconeCaixa nome="foguete" cor="#6366f1" tamanho={32} className="!rounded-xl" /> No nível Livre</h2>
          <p className="mt-3 text-sm font-medium leading-relaxed text-tinta-suave">
            Digite <code className="rounded-md bg-white/80 px-1.5 font-semibold">!</code> e aperte <Tecla>Tab</Tecla> para gerar a estrutura
            do HTML. Experimente também <code className="rounded-md bg-white/80 px-1.5 font-semibold">ul&gt;li*3</code> + Tab.
          </p>
        </div>
        <div>
          <h2 className="flex items-center gap-2.5 font-extrabold"><IconeCaixa nome="disco" cor="#ec4899" tamanho={32} className="!rounded-xl" /> Seus arquivos</h2>
          <p className="mt-3 text-sm font-medium leading-relaxed text-tinta-suave">
            O <strong>.zip</strong> tem os arquivos de verdade (index.html, style.css…). Descompacte e abra o index.html no navegador, ou envie
            para a banca!
          </p>
        </div>
      </section>
    </div>
  );
}
