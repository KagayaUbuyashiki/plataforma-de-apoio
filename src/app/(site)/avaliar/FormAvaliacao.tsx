"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { Aviso } from "@/components/Aviso";
import { botao, campo } from "@/components/admin/estilos";
import { IconeCaixa } from "@/components/Icone";
import { StarRating } from "@/components/StarRating";
import { formatarData } from "@/lib/formatar";
import { enviarSemLimpar } from "@/lib/formulario";
import type { AulaComInstrutores } from "@/lib/tipos";
import { enviarAvaliacao, verificarCodigo, type EstadoEnvio } from "./actions";

type Props = { aulas: AulaComInstrutores[]; aulaInicial?: string; avaliadas: string[] };
type Etapa = "codigo" | "aula" | "notas";


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
        <form onSubmit={confirmarCodigo} className="vidro-forte animate-surgir rounded-3xl p-6">
          <label htmlFor="codigo" className="text-lg font-extrabold text-tinta">
            Código da turma
          </label>
          <p className="mt-1 text-sm text-tinta-suave">O instrutor vai mostrar o código no quadro ou no projetor.</p>
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
        <div className="vidro-forte animate-surgir rounded-3xl p-6">
          <p className="text-sm text-tinta-suave">
            Turma: <strong className="text-tinta">{turma}</strong>
          </p>
          <h2 className="mt-2 text-lg font-extrabold text-tinta">Qual aula você quer avaliar?</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {aulas.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => {
                    setAulaId(a.id);
                    setEtapa("notas");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl border border-white bg-white/60 p-3 text-left transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#0ea5c6,#6366f1)] font-mono font-bold text-white">
                    {a.numero}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-tinta">{a.titulo}</span>
                    {a.data && <span className="block text-sm text-tinta-suave">{formatarData(a.data)}</span>}
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
    <ol className="flex flex-wrap items-center gap-1.5 text-sm sm:gap-2" aria-label="Etapas">
      {etapas.map((e, i) => (
        <li key={e.id} className="flex items-center gap-1.5 sm:gap-2" aria-current={i === atual ? "step" : undefined}>
          <span
            className={`grid h-8 w-8 place-items-center rounded-full font-extrabold transition duration-500 ${
              i <= atual ? "bg-[linear-gradient(135deg,#0ea5c6,#6366f1)] text-white shadow-[0_8px_16px_-8px_#6366f1]" : "bg-white/70 text-tinta-suave"
            } ${i === atual ? "scale-110" : ""}`}
          >
            {i + 1}
          </span>
          <span className={i <= atual ? "font-bold text-tinta" : "font-medium text-tinta-suave"}>{e.rotulo}</span>
          {i < etapas.length - 1 && <span className={`mx-0.5 h-0.5 w-4 rounded-full sm:mx-1 sm:w-8 transition duration-500 ${i < atual ? "bg-marca-500" : "bg-white"}`} aria-hidden />}
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
      <div className="vidro-forte animate-surgir rounded-3xl p-8 text-center">
        <IconeCaixa nome="festa" cor="linear-gradient(135deg,#f59e0b,#ec4899)" tamanho={64} className="mx-auto animate-flutuar" />
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-tinta">Obrigado pela avaliação!</h2>
        <p className="mt-2 text-tinta-suave">Sua opinião ajuda a melhorar as próximas aulas.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={`/aulas/${aula.slug}`} className={botao}>
            Ver o resumo da aula
          </Link>
          <button
            type="button"
            onClick={onNovaAvaliacao}
            className="btn-secundario"
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

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-tinta-suave">
        <span>
          Turma <strong className="text-tinta">{turma}</strong> · Aula {aula.numero}:{" "}
          <strong className="text-tinta">{aula.titulo}</strong>
        </span>
        <button type="button" onClick={onTrocarAula} className="btn-secundario !px-3.5 !py-1.5">
          Trocar aula
        </button>
      </div>

      {jaAvaliada && (
        <Aviso>
          Este aparelho já enviou uma avaliação desta aula. Se você é outra pessoa usando o mesmo computador, pode continuar
          normalmente.
        </Aviso>
      )}

      <section className="vidro-forte flex animate-surgir flex-col gap-5 rounded-3xl p-6">
        <h2 className="text-lg font-extrabold text-tinta">Sobre a aula</h2>
        <StarRating nome="nota_geral" rotulo="Nota geral da aula" />
        <StarRating nome="nota_conteudo" rotulo="Conteúdo" descricao="O que foi ensinado foi útil e fácil de entender?" />
        <StarRating nome="nota_ritmo" rotulo="Ritmo" descricao="A velocidade da aula foi boa para você acompanhar?" />
        <div>
          <label htmlFor="comentario" className="font-bold text-tinta">
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
        <section key={inst.id} className="vidro-forte flex animate-surgir flex-col gap-5 rounded-3xl p-6">
          <input type="hidden" name="instrutor_ids" value={inst.id} />
          <h2 className="text-lg font-extrabold text-tinta">Sobre {inst.nome}</h2>
          <StarRating nome={`inst_${inst.id}_clareza`} rotulo="Clareza" descricao="Explicou de um jeito fácil de entender?" />
          <StarRating nome={`inst_${inst.id}_dominio`} rotulo="Domínio do conteúdo" descricao="Mostrou que conhece bem o assunto?" />
          <StarRating nome={`inst_${inst.id}_atencao`} rotulo="Atenção e paciência" descricao="Tirou suas dúvidas e te ajudou quando precisou?" />
          <div>
            <label htmlFor={`inst_${inst.id}_comentario`} className="font-bold text-tinta">
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

      <button type="submit" disabled={enviando} className={`${botao} self-start !px-7 !py-3.5 !text-base`}>
        {enviando ? "Enviando…" : "Enviar avaliação"}
      </button>
    </form>
  );
}
