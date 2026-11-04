"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Aviso } from "@/components/Aviso";
import { excluirProjeto, listarProjetos, novoProjeto, obterProjeto, salvarProjeto, type ResumoProjeto } from "@/lib/editor/armazenamento";
import { getNivel } from "@/lib/editor/niveis";
import { baixarZip, lerZip } from "@/lib/editor/zip";

const dataHora = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

/** Projetos guardados neste navegador + importar .zip. */
export function ProjetosSalvos() {
  const router = useRouter();
  const [projetos, setProjetos] = useState<ResumoProjeto[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => setProjetos(listarProjetos()), []);

  async function importar(arquivo: File) {
    setErro(null);
    try {
      const { arquivos, ignorados } = await lerZip(arquivo);
      if (Object.keys(arquivos).length === 0) return setErro("Não encontrei arquivos de site (.html, .css, imagens) dentro do .zip.");
      const p = novoProjeto("livre", arquivo.name.replace(/\.zip$/i, ""), arquivos);
      if (!salvarProjeto(p)) return setErro("O navegador não deixou salvar (talvez o espaço esteja cheio). Exclua projetos antigos.");
      if (ignorados.length) alert(`Alguns arquivos foram ignorados (tipo não suportado ou muito grandes):\n${ignorados.join("\n")}`);
      router.push(`/editor/livre?projeto=${p.id}`);
    } catch {
      setErro("Não consegui abrir esse arquivo. Ele é mesmo um .zip?");
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Meus projetos neste computador</h2>
          <p className="text-sm text-slate-500">
            Ficam salvos neste navegador. Para levar para casa ou para outro computador, use <strong>Baixar .zip</strong>.
          </p>
        </div>
        <button type="button" onClick={() => input.current?.click()} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-marca-500">
          Abrir .zip
        </button>
        <input ref={input} type="file" accept=".zip,application/zip" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) importar(f); e.target.value = ""; }} />
      </div>

      {erro && <div className="mt-4"><Aviso tipo="erro">{erro}</Aviso></div>}

      {projetos === null ? (
        <p className="mt-4 text-sm text-slate-500">Carregando…</p>
      ) : projetos.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Nenhum projeto ainda. Escolha um nível acima para começar!</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {projetos.map((p) => {
            const n = getNivel(p.nivel);
            return (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <Link href={`/editor/${p.nivel}?projeto=${p.id}`} className="group min-w-0">
                  <p className="font-medium text-slate-900 group-hover:text-marca-700">{p.nome}</p>
                  <p className="text-sm text-slate-500">
                    {n?.icone} {n?.nome} · editado em {dataHora.format(new Date(p.atualizadoEm))}
                  </p>
                </Link>
                <div className="flex gap-2">
                  <Link href={`/editor/${p.nivel}?projeto=${p.id}`} className="rounded-lg bg-marca-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-marca-700">
                    Abrir
                  </Link>
                  <button
                    type="button"
                    onClick={() => { const c = obterProjeto(p.id); if (c) baixarZip(c.nome, c.arquivos, c.pastas); }}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-marca-500"
                  >
                    .zip
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm(`Excluir o projeto "${p.nome}"? Não dá para desfazer.`)) return;
                      excluirProjeto(p.id);
                      setProjetos(listarProjetos());
                    }}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
