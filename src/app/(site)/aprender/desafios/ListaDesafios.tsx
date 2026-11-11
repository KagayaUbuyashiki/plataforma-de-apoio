"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icone } from "@/components/Icone";
import type { Trilha } from "@/data/desafios";
import { desafiosLocais, marcarDesafioLocal } from "@/lib/desafios/progresso";
import { meusDesafios, registrarDesafios } from "./actions";

type Resumo = { slug: string; trilha: Trilha; titulo: string; enunciado: string };

export function ListaDesafios({ desafios, trilhas }: { desafios: Resumo[]; trilhas: { id: Trilha; titulo: string; texto: string; cor: string }[] }) {
  const [feitos, setFeitos] = useState<Set<string>>(new Set());
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const locais = desafiosLocais();
    setFeitos(new Set(locais));
    // Aluno logado: junta o que está na conta com o que está no navegador (e salva na conta o que faltar).
    meusDesafios()
      .then((daConta) => {
        if (!daConta) return;
        setLogado(true);
        daConta.forEach(marcarDesafioLocal);
        const faltando = locais.filter((s) => !daConta.includes(s));
        if (faltando.length) registrarDesafios(faltando).catch(() => {});
        setFeitos(new Set([...locais, ...daConta]));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {!logado && (
        <p className="vidro flex items-start gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-tinta-suave">
          <Icone nome="usuario" tamanho={18} espessura={2} className="mt-0.5 shrink-0" />
          <span>
            O seu progresso fica salvo neste navegador. <Link href="/entrar" className="font-bold text-marca-600 hover:underline">Entre na sua conta</Link> para guardar
            no seu checklist e ganhar medalhas.
          </span>
        </p>
      )}
      {trilhas.map((t, ti) => {
        const lista = desafios.filter((d) => d.trilha === t.id);
        const feitosTrilha = lista.filter((d) => feitos.has(d.slug)).length;
        const pct = Math.round((feitosTrilha / lista.length) * 100);
        return (
          <section key={t.id} data-revelar style={{ "--d": ti } as React.CSSProperties} className="vidro rounded-[28px] p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.12em]" style={{ color: t.cor }}>
                  Trilha {ti + 1}
                </p>
                <h2 className="text-2xl font-extrabold tracking-tight">{t.titulo}</h2>
                <p className="text-sm font-medium text-tinta-suave">{t.texto}</p>
              </div>
              <div className="flex w-48 items-center gap-2">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${pct}%`, background: t.cor }} />
                </div>
                <span className="text-xs font-bold tabular-nums text-tinta-suave">
                  {feitosTrilha}/{lista.length}
                </span>
              </div>
            </div>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {lista.map((d, i) => {
                const feito = feitos.has(d.slug);
                return (
                  <li key={d.slug}>
                    <Link
                      href={`/aprender/desafios/${d.slug}`}
                      className={`group flex h-full flex-col gap-2 rounded-2xl border p-4 transition duration-300 hover:-translate-y-1 ${feito ? "border-emerald-200 bg-emerald-50/80" : "border-white bg-white/70 hover:bg-white"}`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold ${feito ? "bg-emerald-500 text-white" : "text-white"}`}
                          style={feito ? undefined : { background: t.cor }}
                        >
                          {feito ? <Icone nome="check" tamanho={14} espessura={3} /> : i + 1}
                        </span>
                        <span className="font-extrabold">{d.titulo}</span>
                      </span>
                      <span className="line-clamp-2 text-sm font-medium text-tinta-suave">{d.enunciado}</span>
                      <span className="mt-auto flex items-center gap-1 pt-1 text-xs font-bold text-marca-600">
                        {feito ? "Fazer de novo" : "Começar"} <Icone nome="seta" tamanho={12} espessura={2.4} className="seta-anda" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
