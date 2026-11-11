"use client";

import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { registrarDesafios } from "@/app/(site)/aprender/desafios/actions";
import { Icone } from "@/components/Icone";
import { DESAFIO_POR_SLUG, DESAFIOS } from "@/data/desafios";
import { rodar, type Ctx } from "@/lib/desafios/verificar";
import { marcarDesafioLocal } from "@/lib/desafios/progresso";
import { getNivel } from "@/lib/editor/niveis";
import { documentoExemplo } from "./ExemploAoVivo";

// O Monaco só existe no navegador.
const EditorCodigo = dynamic(() => import("@/components/editor/EditorCodigo").then((m) => m.EditorCodigo), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm text-slate-400">Carregando o editor…</div>,
});

type Aba = "html" | "css";

export function Desafio({ slug }: { slug: string }) {
  const d = DESAFIO_POR_SLUG.get(slug)!;
  const nivel = getNivel("intermediario")!;
  const [codigo, setCodigo] = useState({ html: d.html, css: d.css });
  const [aba, setAba] = useState<Aba>("html");
  const [resultado, setResultado] = useState<boolean[]>(d.verificacoes.map(() => false));
  const [dicas, setDicas] = useState(0);
  const [verSolucao, setVerSolucao] = useState(false);
  const [venceu, setVenceu] = useState(false);
  const [salvo, setSalvo] = useState<boolean | null>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const editores = useRef<{ ed?: editor.IStandaloneCodeEditor; monaco?: Monaco }>({});

  const caminho = (a: Aba) => `desafios/${slug}/${a === "html" ? "index.html" : "style.css"}`;
  const srcDoc = useMemo(() => documentoExemplo(codigo.html, codigo.css), [codigo]);
  const indice = DESAFIOS.findIndex((x) => x.slug === slug);
  const proximo = DESAFIOS[indice + 1];

  // Confere o código sempre que a prévia termina de carregar.
  const conferir = useCallback(() => {
    const f = iframe.current;
    const doc = f?.contentDocument;
    const win = f?.contentWindow;
    const ctx: Ctx | null = doc && win ? { doc, win, css: codigo.css.replace(/\/\*[\s\S]*?\*\//g, "") } : null;
    const r = rodar(d.verificacoes, ctx);
    setResultado(r);
    if (r.every(Boolean) && !venceu) {
      setVenceu(true);
      marcarDesafioLocal(slug);
      registrarDesafios([slug]).then((x) => setSalvo(x.salvo)).catch(() => setSalvo(false));
    }
  }, [codigo.css, d.verificacoes, slug, venceu]);

  // Pequena espera depois de digitar, para não redesenhar a cada tecla.
  const [docAtrasado, setDocAtrasado] = useState(srcDoc);
  useEffect(() => {
    const t = setTimeout(() => setDocAtrasado(srcDoc), 350);
    return () => clearTimeout(t);
  }, [srcDoc]);

  const recomecar = () => {
    if (!confirm("Voltar o código para o começo do desafio?")) return;
    const m = editores.current.monaco;
    for (const a of ["html", "css"] as Aba[]) {
      m?.editor.getModels().find((md: editor.ITextModel) => md.uri.toString().endsWith(caminho(a)))?.setValue(a === "html" ? d.html : d.css);
    }
    setCodigo({ html: d.html, css: d.css });
  };

  const feitos = resultado.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        {/* Editor */}
        <div className="flex min-w-0 flex-col overflow-hidden rounded-3xl bg-[#1e1e1e] shadow-[0_30px_60px_-30px_rgb(12_27_42/0.7)]">
          <div className="flex items-center gap-1 border-b border-white/10 px-3 pt-2" role="tablist" aria-label="Arquivos">
            {(["html", "css"] as Aba[]).map((a) => (
              <button
                key={a}
                role="tab"
                aria-selected={aba === a}
                onClick={() => setAba(a)}
                className={`rounded-t-lg px-4 py-2 font-mono text-xs font-bold transition ${aba === a ? "bg-[#1e1e1e] text-white shadow-[inset_0_2px_0_#0ea5c6]" : "text-slate-400 hover:text-white"}`}
              >
                {a === "html" ? "index.html" : "style.css"}
              </button>
            ))}
            <button type="button" onClick={recomecar} className="ml-auto rounded-full px-3 py-1 text-xs font-bold text-slate-400 transition hover:bg-white/10 hover:text-white">
              Recomeçar
            </button>
          </div>
          <div className="h-[340px] sm:h-[400px]">
            <EditorCodigo
              key={aba}
              caminho={caminho(aba)}
              conteudo={codigo[aba]}
              nivel={nivel}
              aoMudar={(_c, v) => setCodigo((x) => ({ ...x, [aba]: v }))}
              aoMoverCursor={() => {}}
              aoMontar={(ed, monaco) => {
                editores.current = { ed, monaco };
              }}
            />
          </div>
        </div>

        {/* Verificações */}
        <aside className="vidro flex flex-col gap-4 self-start rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold">O que precisa ter</h2>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold tabular-nums text-tinta-suave">
              {feitos}/{resultado.length}
            </span>
          </div>
          <ul className="flex flex-col gap-2" aria-live="polite">
            {d.verificacoes.map((v, i) => (
              <li
                key={v.texto}
                className={`flex items-start gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold transition duration-500 ${resultado[i] ? "bg-emerald-50 text-emerald-900" : "bg-white/70 text-tinta-suave"}`}
              >
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full transition duration-500 ${resultado[i] ? "scale-110 bg-emerald-500 text-white" : "border-2 border-slate-300 text-transparent"}`}
                >
                  <Icone nome="check" tamanho={12} espessura={3} />
                </span>
                <span>
                  {v.texto}
                  <span className="sr-only">{resultado[i] ? " (feito)" : " (falta)"}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* Dicas aos poucos; a solução só depois de ver todas */}
          <div className="flex flex-col gap-2">
            {d.dicas.slice(0, dicas).map((t, i) => (
              <p key={t} className="animate-surgir flex items-start gap-2 rounded-2xl bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-900">
                <Icone nome="lampada" tamanho={16} espessura={2} className="mt-0.5 shrink-0" /> <span><b>Dica {i + 1}:</b> {t}</span>
              </p>
            ))}
            {!venceu && dicas < d.dicas.length && (
              <button type="button" onClick={() => setDicas((n) => n + 1)} className="btn-secundario !py-2">
                <Icone nome="lampada" tamanho={16} espessura={2} /> {dicas === 0 ? "Preciso de uma dica" : "Mais uma dica"}
              </button>
            )}
            {!venceu && dicas >= d.dicas.length && !verSolucao && (
              <button
                type="button"
                onClick={() => confirm("Tente mais um pouquinho antes! Quer mesmo ver a solução?") && setVerSolucao(true)}
                className="text-sm font-bold text-tinta-suave underline-offset-4 hover:underline"
              >
                Ver a solução
              </button>
            )}
          </div>
        </aside>
      </div>

      {verSolucao && !venceu && (
        <div className="vidro animate-surgir flex flex-col gap-3 rounded-3xl p-5">
          <p className="font-extrabold">Uma solução possível</p>
          <p className="text-sm font-medium text-tinta-suave">Compare com o seu código e tente escrever de novo do seu jeito. Existem outras respostas certas!</p>
          <div className="grid gap-3 md:grid-cols-2">
            <pre className="overflow-x-auto rounded-2xl bg-[#0c1b2a] p-4 font-mono text-[13px] text-slate-100">{d.solucao.html}</pre>
            {d.solucao.css && <pre className="overflow-x-auto rounded-2xl bg-[#0c1b2a] p-4 font-mono text-[13px] text-slate-100">{d.solucao.css}</pre>}
          </div>
        </div>
      )}

      {/* Resultado ao vivo (sem scripts; o site só lê os estilos para conferir) */}
      <div className="overflow-hidden rounded-3xl border border-white bg-white shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-2 text-xs font-bold text-tinta-suave">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden /> Resultado ao vivo
        </div>
        <iframe ref={iframe} title="Resultado do seu código" srcDoc={docAtrasado} sandbox="allow-same-origin" onLoad={conferir} className="block h-64 w-full border-0" />
      </div>

      {venceu && <Comemoracao salvo={salvo} proximo={proximo ? { slug: proximo.slug, titulo: proximo.titulo } : null} />}
    </div>
  );
}

const CORES_CONFETE = ["#E5243B", "#FCC30B", "#4C9F38", "#26BDE2", "#A21942", "#FD6925", "#6366f1"];

function Comemoracao({ salvo, proximo }: { salvo: boolean | null; proximo: { slug: string; titulo: string } | null }) {
  const confetes = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        cor: CORES_CONFETE[i % CORES_CONFETE.length],
        x: (Math.random() - 0.5) * 520,
        y: -(80 + Math.random() * 220),
        r: Math.random() * 540 - 270,
        atraso: Math.random() * 0.15,
      })),
    [],
  );
  return (
    <div role="status" className="vidro-forte animate-surgir relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl p-8 text-center">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-24">
        {confetes.map((c, i) => (
          <span
            key={i}
            className="absolute h-3 w-2 rounded-sm motion-safe:animate-[confete_1.2s_cubic-bezier(.2,.7,.2,1)_both]"
            style={{ background: c.cor, "--x": `${c.x}px`, "--y": `${c.y}px`, "--r": `${c.r}deg`, animationDelay: `${c.atraso}s` } as React.CSSProperties}
          />
        ))}
      </div>
      <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white shadow-[0_12px_30px_-10px_#10b981] motion-safe:animate-pulsar">
        <Icone nome="check" tamanho={32} espessura={3} />
      </span>
      <p className="text-2xl font-extrabold">Desafio concluído!</p>
      <p className="max-w-md text-sm font-medium text-tinta-suave">
        {salvo ? "Já entrou no seu checklist da Minha área." : "Ficou salvo neste navegador. Entre na sua conta para guardar no seu checklist."}
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/aprender/desafios" className="btn-secundario">
          Todos os desafios
        </Link>
        {proximo && (
          <Link href={`/aprender/desafios/${proximo.slug}`} className="btn-primario group">
            Próximo: {proximo.titulo} <Icone nome="seta" tamanho={16} espessura={2.2} className="seta-anda" />
          </Link>
        )}
      </div>
    </div>
  );
}
