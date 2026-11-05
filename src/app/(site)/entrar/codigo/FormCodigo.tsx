"use client";

import { useActionState } from "react";
import { botao, campo, rotulo } from "@/components/admin/estilos";
import { Aviso } from "@/components/Aviso";
import { enviarSemLimpar } from "@/lib/formulario";
import { concluirAcesso, verificarCodigo, type EstadoCodigo } from "./actions";
import { CamposFicha } from "./CamposFicha";

const inicial: EstadoCodigo = { etapa: "codigo", erro: null };

export function FormCodigo() {
  const [estadoCodigo, acaoCodigo, verificando] = useActionState(verificarCodigo, inicial);
  if (estadoCodigo.etapa === "ficha") return <FormFicha inicial={estadoCodigo} />;

  return (
    <form onSubmit={enviarSemLimpar(acaoCodigo)} className="vidro-forte animate-surgir flex flex-col gap-4 rounded-3xl p-7">
      <div>
        <label htmlFor="codigo" className={rotulo}>Código de acesso</label>
        <p className="mb-2 text-sm font-medium text-tinta-suave">O instrutor te passa um código parecido com ABCDE-12345.</p>
        <input
          id="codigo"
          name="codigo"
          required
          autoComplete="one-time-code"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={20}
          placeholder="ABCDE-12345"
          className={`${campo} font-mono text-lg uppercase tracking-[0.2em]`}
        />
      </div>
      {estadoCodigo.erro && <Aviso tipo="erro">{estadoCodigo.erro}</Aviso>}
      <button type="submit" disabled={verificando} className={`${botao} self-start`}>
        {verificando ? "Conferindo…" : "Continuar"}
      </button>
    </form>
  );
}

function FormFicha({ inicial: dados }: { inicial: Extract<EstadoCodigo, { etapa: "ficha" }> }) {
  const [estado, acao, enviando] = useActionState(concluirAcesso, dados as EstadoCodigo);
  if (estado.etapa !== "ficha") {
    return <Aviso tipo="erro">{estado.erro ?? "Código inválido. Recarregue a página e tente de novo."}</Aviso>;
  }
  const f = estado.ficha;

  return (
    <form onSubmit={enviarSemLimpar(acao)} className="flex flex-col gap-5">
      <div className="vidro-forte animate-surgir rounded-3xl p-7">
        <span className="chip">{estado.primeiroAcesso ? "Primeiro acesso" : "Conta redefinida"}</span>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight">Olá, {estado.nome.split(" ")[0]}!</h2>
        <p className="mt-1 font-medium text-tinta-suave">
          {estado.primeiroAcesso
            ? "Preencha a sua ficha e crie o seu usuário e a sua senha. Depois disso você entra só com eles."
            : "O instrutor redefiniu a sua conta. Confira a sua ficha e crie uma senha nova."}
        </p>
      </div>

      <CamposFicha ficha={f} />

      <fieldset className="vidro-forte animate-surgir grid gap-4 rounded-3xl p-7 sm:grid-cols-2">
        <legend className="sr-only">Seu acesso</legend>
        <h3 className="text-lg font-extrabold sm:col-span-2">Seu acesso</h3>
        {estado.primeiroAcesso ? (
          <div className="sm:col-span-2">
            <label htmlFor="usuario" className={rotulo}>Escolha o seu usuário</label>
            <input
              id="usuario"
              name="usuario"
              required
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              minLength={3}
              maxLength={30}
              pattern="[a-zA-Z0-9][a-zA-Z0-9._\-]{2,29}"
              placeholder="ex.: maria.silva"
              className={campo}
            />
            <p className="mt-1 text-xs font-medium text-tinta-suave">Letras sem acento, números, ponto, hífen ou _. É com ele que você vai entrar.</p>
          </div>
        ) : (
          <p className="text-sm font-medium sm:col-span-2">
            Seu usuário continua: <strong className="font-mono">{estado.usuario}</strong>
          </p>
        )}
        <div>
          <label htmlFor="senha" className={rotulo}>Senha</label>
          <input id="senha" name="senha" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className={campo} />
        </div>
        <div>
          <label htmlFor="confirmar" className={rotulo}>Repita a senha</label>
          <input id="confirmar" name="confirmar" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className={campo} />
        </div>
        <p className="text-xs font-medium text-tinta-suave sm:col-span-2">
          Pelo menos 8 caracteres, com letras e números. Não use o seu nome nem o seu usuário.
        </p>
      </fieldset>

      {estado.erro && <Aviso tipo="erro">{estado.erro}</Aviso>}
      <button type="submit" disabled={enviando} className={`${botao} self-start !px-7 !py-3.5 !text-base`}>
        {enviando ? "Salvando…" : estado.primeiroAcesso ? "Criar minha conta" : "Salvar e entrar"}
      </button>
    </form>
  );
}
