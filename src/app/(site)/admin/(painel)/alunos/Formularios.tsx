"use client";

import { useActionState } from "react";
import { botao, botaoSecundario, campo, rotulo } from "@/components/admin/estilos";
import { criarAluno, gerarNovoCodigo, redefinirConta, type ResultadoCodigo } from "./actions";
import { MostrarCodigo } from "./Codigo";

export function FormNovoAluno({ turmas }: { turmas: { id: string; nome: string }[] }) {
  const [resultado, acao, enviando] = useActionState(criarAluno, null as ResultadoCodigo);
  return (
    <div className="flex flex-col gap-4">
      <form action={acao} className="grid gap-3 sm:grid-cols-[1fr_14rem_auto] sm:items-end">
        <div>
          <label htmlFor="a-nome" className={rotulo}>Nome do aluno *</label>
          <input id="a-nome" name="nome" required minLength={2} maxLength={80} placeholder="Nome e sobrenome" className={campo} />
        </div>
        <div>
          <label htmlFor="a-turma" className={rotulo}>Turma</label>
          <select id="a-turma" name="turma_id" className={campo} defaultValue="">
            <option value="">Sem turma</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={enviando} className={botao}>
          {enviando ? "Gerando…" : "Cadastrar e gerar código"}
        </button>
      </form>
      <MostrarCodigo resultado={resultado} />
    </div>
  );
}

export function AcoesConta({ id, nome, temConta }: { id: string; nome: string; temConta: boolean }) {
  const [resNovo, acaoNovo, gerando] = useActionState(gerarNovoCodigo, null as ResultadoCodigo);
  const [resReset, acaoReset, redefinindo] = useActionState(redefinirConta, null as ResultadoCodigo);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {!temConta && (
          <form action={acaoNovo}>
            <input type="hidden" name="id" value={id} />
            <button type="submit" disabled={gerando} className={botaoSecundario}>
              {gerando ? "Gerando…" : "Gerar novo código"}
            </button>
          </form>
        )}
        {temConta && (
          <form
            action={acaoReset}
            onSubmit={(e) => {
              if (!confirm(`Redefinir a conta de ${nome}? A senha atual deixa de funcionar e ${nome} vai precisar entrar com um código novo.`))
                e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={id} />
            <button type="submit" disabled={redefinindo} className={botaoSecundario}>
              {redefinindo ? "Redefinindo…" : "Recuperar conta / redefinir senha"}
            </button>
          </form>
        )}
      </div>
      <MostrarCodigo resultado={resNovo ?? resReset} />
    </div>
  );
}
