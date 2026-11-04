import type { Metadata } from "next";
import Link from "next/link";
import { Titulo } from "@/components/Titulo";
import { NIVEIS } from "@/lib/editor/niveis";
import { ProjetosSalvos } from "./ProjetosSalvos";

export const metadata: Metadata = { title: "Editor de código" };

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
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-marca-500 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl" aria-hidden>{n.icone}</span>
              <span className="font-mono text-sm font-bold text-marca-600">Nível {i + 1}</span>
            </div>
            <h2 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-marca-700">{n.nome}</h2>
            <p className="mt-1 text-sm text-slate-600">{n.resumo}</p>
            <ul className="mt-4 flex flex-col gap-1.5 text-sm text-slate-700">
              {n.recursos.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-marca-600" aria-hidden>✓</span>
                  {r}
                </li>
              ))}
            </ul>
            <span className="mt-auto pt-6 text-sm font-semibold text-marca-700">Novo projeto →</span>
          </Link>
        ))}
      </div>

      <ProjetosSalvos />

      <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 md:grid-cols-3">
        <div>
          <h2 className="font-semibold">⌨️ Atalhos úteis</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li><kbd className="rounded border px-1">Ctrl</kbd> + <kbd className="rounded border px-1">Z</kbd> desfaz</li>
            <li><kbd className="rounded border px-1">Ctrl</kbd> + <kbd className="rounded border px-1">S</kbd> salva</li>
            <li><kbd className="rounded border px-1">Ctrl</kbd> + <kbd className="rounded border px-1">Espaço</kbd> mostra sugestões</li>
            <li><kbd className="rounded border px-1">Ctrl</kbd> + <kbd className="rounded border px-1">/</kbd> comenta a linha</li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold">🚀 No nível Livre</h2>
          <p className="mt-2 text-sm text-slate-600">
            Digite <code className="rounded bg-slate-100 px-1">!</code> e aperte <kbd className="rounded border px-1">Tab</kbd> para gerar a estrutura
            do HTML. Experimente também <code className="rounded bg-slate-100 px-1">ul&gt;li*3</code> + Tab.
          </p>
        </div>
        <div>
          <h2 className="font-semibold">💾 Seus arquivos</h2>
          <p className="mt-2 text-sm text-slate-600">
            O <strong>.zip</strong> tem os arquivos de verdade (index.html, style.css…). Descompacte e abra o index.html no navegador, ou envie
            para a banca!
          </p>
        </div>
      </section>
    </div>
  );
}
