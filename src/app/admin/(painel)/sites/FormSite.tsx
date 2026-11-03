"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Aviso } from "@/components/Aviso";
import { enviarSemLimpar } from "@/lib/formulario";
import { SiteCard } from "@/components/SiteCard";
import { botao, botaoSecundario, campo, cartao, rotulo } from "@/components/admin/estilos";
import { ODS } from "@/data/ods";
import type { Site } from "@/lib/tipos";
import { salvarSite } from "./actions";

/** Formulário de site com pré-visualização do card ao vivo. */
export function FormSite({ site, categorias }: { site?: Site; categorias: string[] }) {
  const [estado, acao, salvando] = useActionState(salvarSite, { erro: null });
  const [previa, setPrevia] = useState<Site>(
    site ?? {
      id: "previa",
      titulo: "",
      descricao: "",
      url: "https://",
      imagem_url: null,
      categoria: null,
      ods_numero: null,
      ordem: 0,
      created_at: "",
    },
  );
  const [imagemLocal, setImagemLocal] = useState<string | null>(null);
  const atualizar = (campo: keyof Site, valor: string) =>
    setPrevia((p) => ({ ...p, [campo]: campo === "ods_numero" ? (valor ? Number(valor) : null) : valor }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <form onSubmit={enviarSemLimpar(acao)} className={`${cartao} flex flex-col gap-4`}>
        {site && <input type="hidden" name="id" value={site.id} />}

        <div>
          <label htmlFor="titulo" className={rotulo}>Título *</label>
          <input id="titulo" name="titulo" required maxLength={120} defaultValue={site?.titulo} onChange={(e) => atualizar("titulo", e.target.value)} className={campo} />
        </div>

        <div>
          <label htmlFor="url" className={rotulo}>Link do site *</label>
          <input id="url" name="url" type="url" required placeholder="https://exemplo.com.br" defaultValue={site?.url} onChange={(e) => atualizar("url", e.target.value)} className={campo} />
        </div>

        <div>
          <label htmlFor="descricao" className={rotulo}>Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            rows={3}
            maxLength={500}
            placeholder="Por que este site é uma boa referência? O que os alunos devem observar?"
            defaultValue={site?.descricao}
            onChange={(e) => atualizar("descricao", e.target.value)}
            className={campo}
          />
        </div>

        <div>
          <label htmlFor="imagem" className={rotulo}>Imagem de preview (JPG, PNG ou WEBP, até 2 MB)</label>
          <input
            id="imagem"
            name="imagem"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setImagemLocal(f ? URL.createObjectURL(f) : null);
            }}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-marca-50 file:px-3 file:py-2 file:font-semibold file:text-marca-700 hover:file:bg-marca-100"
          />
          <p className="mt-1 text-xs text-slate-500">Dica: tire um print da página inicial do site (proporção 16:9 fica melhor).</p>
          {site?.imagem_url && (
            <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" name="remover_imagem" /> Remover a imagem atual
            </label>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="categoria" className={rotulo}>Categoria</label>
            <input id="categoria" name="categoria" list="categorias" maxLength={40} placeholder="Ex.: Inspiração" defaultValue={site?.categoria ?? ""} onChange={(e) => atualizar("categoria", e.target.value)} className={campo} />
            <datalist id="categorias">
              {categorias.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor="ods_numero" className={rotulo}>ODS relacionado</label>
            <select id="ods_numero" name="ods_numero" defaultValue={site?.ods_numero ?? ""} onChange={(e) => atualizar("ods_numero", e.target.value)} className={campo}>
              <option value="">Nenhum</option>
              {ODS.map((o) => (
                <option key={o.numero} value={o.numero}>
                  {o.numero}. {o.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ordem" className={rotulo}>Ordem</label>
            <input id="ordem" name="ordem" type="number" defaultValue={site?.ordem ?? 0} className={campo} />
          </div>
        </div>

        {estado.erro && <Aviso tipo="erro">{estado.erro}</Aviso>}

        <div className="flex gap-3">
          <button type="submit" disabled={salvando} className={botao}>
            {salvando ? "Salvando…" : site ? "Salvar alterações" : "Adicionar site"}
          </button>
          {site && (
            <Link href="/admin/sites" className={botaoSecundario}>
              Cancelar
            </Link>
          )}
        </div>
      </form>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-500">Prévia do card</p>
        <div className="pointer-events-none">
          <SiteCard
            site={{
              ...previa,
              titulo: previa.titulo || "Título do site",
              imagem_url: imagemLocal ?? previa.imagem_url,
            }}
            imagemLocal={Boolean(imagemLocal)}
          />
        </div>
      </div>
    </div>
  );
}
