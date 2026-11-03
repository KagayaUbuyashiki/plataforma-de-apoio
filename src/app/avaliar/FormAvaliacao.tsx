"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { Aviso } from "@/components/Aviso";
import { StarRating } from "@/components/StarRating";
import { formatarData } from "@/lib/formatar";
import { enviarSemLimpar } from "@/lib/formulario";
import type { AulaComInstrutores } from "@/lib/tipos";
import { enviarAvaliacao, verificarCodigo, type EstadoEnvio } from "./actions";

type Props = { aulas: AulaComInstrutores[]; aulaInicial?: string; avaliadas: string[] };
type Etapa = "codigo" | "aula" | "notas";

const campo =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-marca-500 focus:outline-none focus:ring-2 focus:ring-marca-500/30";
const botao =
  "rounded-lg bg-marca-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-marca-700 disabled:cursor-not-allowed disabled:opacity-60";

export function FormAvaliacao({ aulas, aulaInicial, avaliadas }: Props) {
  const inicial = aulas.find((a) => a.id === aulaInicial)?.id ?? null;
  const [etapa, setEtapa] = useState<Etapa>("codigo");
  const [codigo, setCodigo] = useState("");
  const [turma, setTurma] = useState("");
  const [aulaId, setAulaId] = useState<string | null>(inicial);
  const [erroCodigo, setErroCodigo] = useState<string | null>(null);
  const [rodada, setRodada] = useState(0);
  const [verificando, iniciar] = useTransition();
  const [jaAvaliadas, setJaAvaliadas] = useState(avaliadas);

  const aula = aulas.find((a) => a.id === aulaId);

  function confirmarCodigo(e: React.FormEvent) {
    e.preventDefault();
    setErroCodigo(null);
    iniciar(async () => {
      const r = await verificarCodigo(codigo);
      if (!r.ok) return setErroCodigo(r.erro);
      setTurma(r.turma);
      setEtapa(aulaId ? "notas" : "aula");
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Progresso etapa={etapa} />

      {etapa === "codigo" && (
        <form onSubmit={confirmarCodigo} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label htmlFor="codigo" className="font-semibold text-slate-900">
            Código da turma
          </label>
          <p className="mt-1 text-sm text-slate-500">O instrutor vai mostrar o código no quadro ou no projetor.</p>
          <input
            id="codigo"
            name="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="Ex.: CATA-2026"
            autoComplete="off"
            autoCapitalize="characters"
            required
            className={`${campo} mt-3 font-mono text-lg tracking-wider`}
          />
          {erroCodigo && (
            <div className="mt-3">
              <Aviso tipo="erro">{erroCodigo}</Aviso>
            </div>
          )}
          <button type="submit" disabled={verificando} className={`${botao} mt-4`}>
            {verificando ? "Verificando…" : "Continuar"}
          </button>
        </form>
      )}

      {etapa === "aula" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Turma: <strong className="text-slate-800">{turma}</strong>
          </p>
          <h2 className="mt-2 font-semibold text-slate-900">Qual aula você quer avaliar?</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {aulas.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => {
                    setAulaId(a.id);
                    setEtapa("notas");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition hover:border-marca-500 hover:bg-marca-50"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-marca-50 font-mono font-bold text-marca-700">
                    {a.numero}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-slate-900">{a.titulo}</span>
                    {a.data && <span className="block text-sm text-slate-500">{formatarData(a.data)}</span>}
                  </span>
                  {jaAvaliadas.includes(a.id) && (
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      já avaliada aqui
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {etapa === "notas" && aula && (
        <FormNotas
          key={`${aula.id}-${rodada}`}
          aula={aula}
          codigo={codigo}
          turma={turma}
          jaAvaliada={jaAvaliadas.includes(aula.id)}
          onTrocarAula={() => setEtapa("aula")}
          onEnviado={() => setJaAvaliadas((v) => [...new Set([...v, aula.id])])}
          onNovaAvaliacao={() => {
            setRodada((r) => r + 1);
            setEtapa("aula");
          }}
        />
      )}
    </div>
  );
}

function Progresso({ etapa }: { etapa: Etapa }) {
  const etapas: { id: Etapa; rotulo: string }[] = [
    { id: "codigo", rotulo: "Código" },
    { id: "aula", rotulo: "Aula" },
    { id: "notas", rotulo: "Avaliação" },
  ];
  const atual = etapas.findIndex((e) => e.id === etapa);
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Etapas">
      {etapas.map((e, i) => (
        <li key={e.id} className="flex items-center gap-2" aria-current={i === atual ? "step" : undefined}>
          <span
            className={`grid h-7 w-7 place-items-center rounded-full font-semibold ${
              i <= atual ? "bg-marca-600 text-white" : "bg-slate-200 text-slate-500"
            }`}
          >
            {i + 1}
          </span>
          <span className={i <= atual ? "font-medium text-slate-900" : "text-slate-500"}>{e.rotulo}</span>
          {i < etapas.length - 1 && <span className="mx-1 h-px w-6 bg-slate-300" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}

type FormNotasProps = {
  aula: AulaComInstrutores;
  codigo: string;
  turma: string;
  jaAvaliada: boolean;
  onTrocarAula: () => void;
  onEnviado: () => void;
  onNovaAvaliacao: () => void;
};

function FormNotas({ aula, codigo, turma, jaAvaliada, onTrocarAula, onEnviado, onNovaAvaliacao }: FormNotasProps) {
  const [estado, acao, enviando] = useActionState(async (anterior: EstadoEnvio, fd: FormData) => {
    const r = await enviarAvaliacao(anterior, fd);
    if (r.ok) onEnviado();
    return r;
  }, { ok: false, erro: null });

  if (estado.ok) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <p className="text-5xl" aria-hidden>🎉</p>
        <h2 className="mt-3 text-2xl font-bold text-slate-900">Obrigado pela avaliação!</h2>
        <p className="mt-2 text-slate-600">Sua opinião ajuda a melhorar as próximas aulas.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={`/aulas/${aula.slug}`} className={botao}>
            Ver o resumo da aula
          </Link>
          <button
            type="button"
            onClick={onNovaAvaliacao}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 hover:border-marca-500"
          >
            Outra pessoa vai avaliar neste aparelho
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={enviarSemLimpar(acao)}>
      <input type="hidden" name="codigo" value={codigo} />
      <input type="hidden" name="aula_id" value={aula.id} />

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
        <span>
          Turma <strong className="text-slate-800">{turma}</strong> · Aula {aula.numero}:{" "}
          <strong className="text-slate-800">{aula.titulo}</strong>
        </span>
        <button type="button" onClick={onTrocarAula} className="font-medium text-marca-700 hover:underline">
          Trocar aula
        </button>
      </div>

      {jaAvaliada && (
        <Aviso>
          Este aparelho já enviou uma avaliação desta aula. Se você é outra pessoa usando o mesmo computador, pode continuar
          normalmente.
        </Aviso>
      )}

      <section className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Sobre a aula</h2>
        <StarRating nome="nota_geral" rotulo="Nota geral da aula" />
        <StarRating nome="nota_conteudo" rotulo="Conteúdo" descricao="O que foi ensinado foi útil e fácil de entender?" />
        <StarRating nome="nota_ritmo" rotulo="Ritmo" descricao="A velocidade da aula foi boa para você acompanhar?" />
        <div>
          <label htmlFor="comentario" className="font-medium text-slate-800">
            Comentário (opcional)
          </label>
          <textarea
            id="comentario"
            name="comentario"
            rows={3}
            maxLength={1000}
            placeholder="O que você mais gostou? O que podemos melhorar?"
            className={`${campo} mt-1`}
          />
        </div>
      </section>

      {aula.instrutores.map((inst) => (
        <section key={inst.id} className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <input type="hidden" name="instrutor_ids" value={inst.id} />
          <h2 className="text-lg font-bold text-slate-900">Sobre {inst.nome}</h2>
          <StarRating nome={`inst_${inst.id}_clareza`} rotulo="Clareza" descricao="Explicou de um jeito fácil de entender?" />
          <StarRating nome={`inst_${inst.id}_dominio`} rotulo="Domínio do conteúdo" descricao="Mostrou que conhece bem o assunto?" />
          <StarRating nome={`inst_${inst.id}_atencao`} rotulo="Atenção e paciência" descricao="Tirou suas dúvidas e te ajudou quando precisou?" />
          <div>
            <label htmlFor={`inst_${inst.id}_comentario`} className="font-medium text-slate-800">
              Recado para {inst.nome} (opcional)
            </label>
            <textarea
              id={`inst_${inst.id}_comentario`}
              name={`inst_${inst.id}_comentario`}
              rows={2}
              maxLength={1000}
              className={`${campo} mt-1`}
            />
          </div>
        </section>
      ))}

      {estado.erro && <Aviso tipo="erro">{estado.erro}</Aviso>}

      <button type="submit" disabled={enviando} className={`${botao} self-start text-lg`}>
        {enviando ? "Enviando…" : "Enviar avaliação"}
      </button>
    </form>
  );
}
