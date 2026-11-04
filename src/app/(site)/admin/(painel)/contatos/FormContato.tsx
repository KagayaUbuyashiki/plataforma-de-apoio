"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Aviso } from "@/components/Aviso";
import { botao, botaoSecundario, campo, cartao, rotulo } from "@/components/admin/estilos";
import { formatarTelefone } from "@/lib/contato";
import { enviarSemLimpar } from "@/lib/formulario";
import type { Contato } from "@/lib/tipos";
import { salvarContato } from "./actions";

export function FormContato({ contato }: { contato?: Contato }) {
  const [estado, acao, salvando] = useActionState(salvarContato, { erro: null });

  return (
    <form onSubmit={enviarSemLimpar(acao)} className={`${cartao} flex flex-col gap-4`}>
      {contato && <input type="hidden" name="id" value={contato.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className={rotulo}>Nome *</label>
          <input id="nome" name="nome" required maxLength={120} defaultValue={contato?.nome} placeholder="Ex.: Ana Souza" className={campo} />
        </div>
        <div>
          <label htmlFor="funcao" className={rotulo}>Função</label>
          <input id="funcao" name="funcao" maxLength={80} defaultValue={contato?.funcao ?? ""} placeholder="Ex.: Instrutora, Coordenação" className={campo} />
        </div>
        <div>
          <label htmlFor="email" className={rotulo}>E-mail</label>
          <input id="email" name="email" type="email" maxLength={160} defaultValue={contato?.email ?? ""} className={campo} />
        </div>
        <div>
          <label htmlFor="telefone" className={rotulo}>Telefone (com DDD)</label>
          <input
            id="telefone"
            name="telefone"
            inputMode="tel"
            defaultValue={contato?.telefone ? formatarTelefone(contato.telefone) : ""}
            placeholder="(32) 99999-8888"
            className={campo}
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="whatsapp" defaultChecked={contato?.whatsapp ?? true} className="h-4 w-4" />
            Este número tem WhatsApp
          </label>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="link" className={rotulo}>Link (Instagram, LinkedIn, site…)</label>
          <input id="link" name="link" type="url" maxLength={300} defaultValue={contato?.link ?? ""} placeholder="https://" className={campo} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="descricao" className={rotulo}>Observação</label>
          <textarea
            id="descricao"
            name="descricao"
            rows={2}
            maxLength={500}
            defaultValue={contato?.descricao ?? ""}
            placeholder="Ex.: Tira dúvidas de CSS. Responde de segunda a sexta, das 14h às 18h."
            className={campo}
          />
        </div>
        <div>
          <label htmlFor="ordem" className={rotulo}>Ordem na página</label>
          <input id="ordem" name="ordem" type="number" defaultValue={contato?.ordem ?? 0} className={campo} />
        </div>
      </div>

      <Aviso>Tudo o que for cadastrado aqui fica visível para qualquer pessoa que abrir a página de Contatos.</Aviso>
      {estado.erro && <Aviso tipo="erro">{estado.erro}</Aviso>}

      <div className="flex gap-3">
        <button type="submit" disabled={salvando} className={botao}>
          {salvando ? "Salvando…" : contato ? "Salvar alterações" : "Adicionar contato"}
        </button>
        {contato && <Link href="/admin/contatos" className={botaoSecundario}>Cancelar</Link>}
      </div>
    </form>
  );
}
