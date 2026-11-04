"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Aviso } from "@/components/Aviso";
import { enviarSemLimpar } from "@/lib/formulario";
import { Markdown } from "@/components/Markdown";
import { botao, botaoSecundario, campo, cartao, rotulo } from "@/components/admin/estilos";
import type { AulaComInstrutores, Instrutor } from "@/lib/tipos";
import { salvarAula } from "./actions";

type Props = { aula?: AulaComInstrutores; instrutores: Instrutor[]; proximoNumero: number };

const AJUDA_MD = "Markdown: ## Título, **negrito**, - lista, [link](https://...), e ``` para blocos de código.";

export function FormAula({ aula, instrutores, proximoNumero }: Props) {
  const [estado, acao, salvando] = useActionState(salvarAula, { erro: null });
  const [resumo, setResumo] = useState(aula?.resumo_md ?? "");
  const [conteudo, setConteudo] = useState(aula?.conteudo_md ?? "");
  const [previa, setPrevia] = useState(false);
  const selecionados = new Set(aula?.instrutores.map((i) => i.id));

  return (
    <form onSubmit={enviarSemLimpar(acao)} className="flex flex-col gap-6">
      {aula && <input type="hidden" name="id" value={aula.id} />}

      <section className={`${cartao} grid gap-4 sm:grid-cols-[6rem_1fr]`}>
        <div>
          <label htmlFor="numero" className={rotulo}>Nº *</label>
          <input id="numero" name="numero" type="number" min={0} required defaultValue={aula?.numero ?? proximoNumero} className={campo} />
        </div>
        <div>
          <label htmlFor="titulo" className={rotulo}>Título *</label>
          <input id="titulo" name="titulo" required maxLength={150} defaultValue={aula?.titulo} placeholder="Ex.: Listas, links e imagens" className={campo} />
        </div>
        <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="data" className={rotulo}>Data</label>
            <input id="data" name="data" type="date" defaultValue={aula?.data ?? ""} className={campo} />
          </div>
          <div>
            <label htmlFor="slug" className={rotulo}>Endereço da página</label>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <span>/aulas/</span>
              <input id="slug" name="slug" defaultValue={aula?.slug} placeholder={`aula-${aula?.numero ?? proximoNumero}`} className={campo} />
            </div>
          </div>
        </div>
      </section>

      <section className={`${cartao} flex flex-col gap-4`}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold">Textos da aula</h2>
          <button type="button" onClick={() => setPrevia((v) => !v)} className={botaoSecundario}>
            {previa ? "Editar" : "Pré-visualizar"}
          </button>
        </div>
        <p className="text-xs text-slate-500">{AJUDA_MD}</p>

        {/* Os campos ficam sempre no formulário (escondidos na pré-visualização) para serem enviados. */}
        <div className={previa ? "hidden" : "flex flex-col gap-4"}>
          <div>
            <label htmlFor="resumo_md" className={rotulo}>Resumo (aparece em destaque e na lista de aulas)</label>
            <textarea id="resumo_md" name="resumo_md" rows={3} value={resumo} onChange={(e) => setResumo(e.target.value)} className={`${campo} font-mono text-sm`} />
          </div>
          <div>
            <label htmlFor="conteudo_md" className={rotulo}>Conteúdo completo</label>
            <textarea id="conteudo_md" name="conteudo_md" rows={18} value={conteudo} onChange={(e) => setConteudo(e.target.value)} className={`${campo} font-mono text-sm`} />
          </div>
        </div>
        {previa && (
          <div className="flex flex-col gap-6 rounded-lg border border-slate-200 p-4">
            <div className="rounded-lg border-l-4 border-marca-500 bg-marca-50 p-4">
              <Markdown>{resumo || "_Sem resumo._"}</Markdown>
            </div>
            <Markdown>{conteudo || "_Sem conteúdo._"}</Markdown>
          </div>
        )}
      </section>

      <section className={`${cartao} grid gap-6 md:grid-cols-2`}>
        <div>
          <label htmlFor="materiais" className={rotulo}>Materiais (um por linha: Título | link)</label>
          <textarea
            id="materiais"
            name="materiais"
            rows={5}
            defaultValue={aula?.materiais.map((m) => `${m.titulo} | ${m.url}`).join("\n")}
            placeholder={"Slides da aula | https://...\nOs 17 ODS | /ods"}
            className={`${campo} font-mono text-sm`}
          />
        </div>
        <fieldset>
          <legend className={rotulo}>Instrutores desta aula</legend>
          {instrutores.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhum instrutor cadastrado. <Link href="/admin/turmas" className="text-marca-700 underline">Cadastre aqui</Link>.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {instrutores.map((i) => (
                <li key={i.id}>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="instrutores" value={i.id} defaultChecked={selecionados.has(i.id)} className="h-4 w-4" />
                    {i.nome}
                  </label>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-slate-500">Os alunos avaliam cada instrutor marcado.</p>
        </fieldset>
      </section>

      <label className="flex items-center gap-2 font-medium">
        <input type="checkbox" name="publicada" defaultChecked={aula?.publicada ?? false} className="h-5 w-5" />
        Publicar (visível para os alunos e disponível para avaliação)
      </label>

      {estado.erro && <Aviso tipo="erro">{estado.erro}</Aviso>}

      <div className="flex gap-3">
        <button type="submit" disabled={salvando} className={botao}>
          {salvando ? "Salvando…" : "Salvar aula"}
        </button>
        <Link href="/admin/aulas" className={botaoSecundario}>Cancelar</Link>
      </div>
    </form>
  );
}
