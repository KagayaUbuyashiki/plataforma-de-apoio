"use client";

import { useMemo, useRef, useState } from "react";
import { IconeImagem, IconeNovaPasta, IconeNovoArquivo, IconeSeta, IconeTipo } from "./icones";

type No = { nome: string; caminho: string; pasta: boolean; filhos: No[] };

function montarArvore(caminhos: string[], pastas: string[]): No[] {
  const raiz: No = { nome: "", caminho: "", pasta: true, filhos: [] };
  const garantirPasta = (caminho: string): No => {
    let atual = raiz;
    for (const parte of caminho.split("/").filter(Boolean)) {
      const c = atual.caminho ? `${atual.caminho}/${parte}` : parte;
      let prox = atual.filhos.find((f) => f.pasta && f.nome === parte);
      if (!prox) {
        prox = { nome: parte, caminho: c, pasta: true, filhos: [] };
        atual.filhos.push(prox);
      }
      atual = prox;
    }
    return atual;
  };
  pastas.forEach(garantirPasta);
  for (const caminho of caminhos) {
    const partes = caminho.split("/");
    const pai = garantirPasta(partes.slice(0, -1).join("/"));
    pai.filhos.push({ nome: partes.at(-1)!, caminho, pasta: false, filhos: [] });
  }
  const ordenar = (nos: No[]) => {
    nos.sort((a, b) => (a.pasta === b.pasta ? a.nome.localeCompare(b.nome) : a.pasta ? -1 : 1));
    nos.forEach((n) => ordenar(n.filhos));
  };
  ordenar(raiz.filhos);
  return raiz.filhos;
}

type Edicao = { modo: "arquivo" | "pasta" | "renomear"; base: string; alvo?: string; pasta?: boolean };

type Props = {
  nomeProjeto: string;
  caminhos: string[];
  pastas: string[];
  ativo: string | null;
  gerencia: boolean;
  aoAbrir: (caminho: string) => void;
  aoCriar: (caminho: string, tipo: "arquivo" | "pasta") => string | null;
  aoRenomear: (de: string, para: string, pasta: boolean) => string | null;
  aoExcluir: (caminho: string, pasta: boolean) => void;
  aoEnviarImagens: (arquivos: FileList, pasta: string) => void;
};

export function Explorador(props: Props) {
  const { nomeProjeto, caminhos, pastas, ativo, gerencia } = props;
  const arvore = useMemo(() => montarArvore(caminhos, pastas), [caminhos, pastas]);
  const [fechadas, setFechadas] = useState<Set<string>>(new Set());
  const [pastaSel, setPastaSel] = useState("");
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const inputImagem = useRef<HTMLInputElement>(null);
  /** Evita confirmar duas vezes (Enter seguido do blur ao desmontar o campo). */
  const tratado = useRef(false);

  const alternar = (c: string) =>
    setFechadas((s) => {
      const n = new Set(s);
      if (n.has(c)) n.delete(c);
      else n.add(c);
      return n;
    });

  const abrirEdicao = (e: Edicao) => {
    tratado.current = false;
    setErro(null);
    setEdicao(e);
  };

  const iniciar = (modo: Edicao["modo"]) => {
    abrirEdicao({ modo, base: pastaSel });
    if (pastaSel) setFechadas((s) => { const n = new Set(s); n.delete(pastaSel); return n; });
  };

  function confirmar(valor: string) {
    if (!edicao || tratado.current) return;
    const nome = valor.trim();
    if (!nome) return setEdicao(null);
    let msg: string | null;
    if (edicao.modo === "renomear") {
      const pai = edicao.alvo!.split("/").slice(0, -1).join("/");
      msg = props.aoRenomear(edicao.alvo!, pai ? `${pai}/${nome}` : nome, Boolean(edicao.pasta));
    } else {
      msg = props.aoCriar(edicao.base ? `${edicao.base}/${nome}` : nome, edicao.modo);
    }
    if (msg) setErro(msg);
    else {
      tratado.current = true;
      setErro(null);
      setEdicao(null);
    }
  }

  const campoEdicao = (profundidade: number, inicial: string, pasta: boolean) => (
    <div style={{ paddingLeft: 8 + profundidade * 12 }} className="pr-2">
      <div className="flex items-center gap-1">
        <IconeTipo caminho={inicial || (pasta ? "" : "novo.html")} pasta={pasta} />
        <input
          autoFocus
          defaultValue={inicial}
          aria-label={pasta ? "Nome da pasta" : "Nome do arquivo"}
          placeholder={pasta ? "nome-da-pasta" : "ex.: index.html"}
          onFocus={(e) => {
            const ponto = e.target.value.lastIndexOf(".");
            e.target.setSelectionRange(0, ponto > 0 ? ponto : e.target.value.length);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") confirmar(e.currentTarget.value);
            if (e.key === "Escape") { tratado.current = true; setEdicao(null); setErro(null); }
          }}
          onBlur={(e) => (e.currentTarget.value.trim() ? confirmar(e.currentTarget.value) : setEdicao(null))}
          className="w-full border border-[#007fd4] bg-[#3c3c3c] px-1 py-0.5 text-[13px] text-white outline-none"
        />
      </div>
      {erro && <p className="mt-1 border border-[#be1100] bg-[#5a1d1d] px-2 py-1 text-xs text-white">{erro}</p>}
    </div>
  );

  const renderNos = (nos: No[], prof: number): React.ReactNode =>
    nos.map((no) => {
      if (edicao?.modo === "renomear" && edicao.alvo === no.caminho) return <div key={no.caminho}>{campoEdicao(prof, no.nome, no.pasta)}</div>;
      const aberta = no.pasta && !fechadas.has(no.caminho);
      const selecionado = no.pasta ? pastaSel === no.caminho : ativo === no.caminho;
      return (
        <div key={no.caminho}>
          <div
            role="treeitem"
            aria-selected={selecionado}
            aria-expanded={no.pasta ? aberta : undefined}
            tabIndex={0}
            onClick={() => {
              if (no.pasta) {
                alternar(no.caminho);
                setPastaSel(no.caminho);
              } else {
                setPastaSel(no.caminho.split("/").slice(0, -1).join("/"));
                props.aoAbrir(no.caminho);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.click();
              if (e.key === "F2" && gerencia) abrirEdicao({ modo: "renomear", base: "", alvo: no.caminho, pasta: no.pasta });
              if (e.key === "Delete" && gerencia) props.aoExcluir(no.caminho, no.pasta);
            }}
            style={{ paddingLeft: 8 + prof * 12 }}
            className={`group flex h-[22px] cursor-pointer items-center gap-1 pr-2 text-[13px] outline-none focus-visible:outline-1 focus-visible:outline-[#007fd4] ${
              selecionado && !no.pasta ? "bg-[#37373d] text-white" : "text-[#cccccc] hover:bg-[#2a2d2e]"
            }`}
          >
            {no.pasta ? (
              <IconeSeta className={`h-3.5 w-3.5 shrink-0 transition-transform ${aberta ? "rotate-90" : ""}`} />
            ) : (
              <span className="w-3.5 shrink-0" />
            )}
            {!no.pasta && <IconeTipo caminho={no.caminho} />}
            <span className="truncate">{no.nome}</span>
            {gerencia && (
              <span className="ml-auto hidden gap-1 group-hover:flex">
                <button
                  type="button"
                  title="Renomear (F2)"
                  aria-label={`Renomear ${no.nome}`}
                  onClick={(e) => { e.stopPropagation(); abrirEdicao({ modo: "renomear", base: "", alvo: no.caminho, pasta: no.pasta }); }}
                  className="rounded px-1 text-[#c5c5c5] hover:bg-[#45494e]"
                >
                  ✎
                </button>
                <button
                  type="button"
                  title="Excluir (Delete)"
                  aria-label={`Excluir ${no.nome}`}
                  onClick={(e) => { e.stopPropagation(); props.aoExcluir(no.caminho, no.pasta); }}
                  className="rounded px-1 text-[#c5c5c5] hover:bg-[#45494e]"
                >
                  🗑
                </button>
              </span>
            )}
          </div>
          {no.pasta && aberta && (
            <div role="group">
              {edicao && edicao.modo !== "renomear" && edicao.base === no.caminho && campoEdicao(prof + 1, "", edicao.modo === "pasta")}
              {renderNos(no.filhos, prof + 1)}
            </div>
          )}
        </div>
      );
    });

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-9 shrink-0 items-center justify-between px-4 text-[11px] uppercase tracking-wide text-[#bbbbbb]">
        <span>Explorador</span>
      </div>
      <div className="group/titulo flex h-[22px] shrink-0 items-center justify-between pl-2 pr-1 text-[11px] font-bold uppercase text-[#cccccc]">
        <button type="button" onClick={() => setPastaSel("")} className="flex items-center gap-1 truncate" title="Selecionar a pasta principal">
          <IconeSeta className="h-3.5 w-3.5 rotate-90" />
          <span className="truncate">{nomeProjeto}</span>
        </button>
        {gerencia && (
          <span className="flex gap-0.5">
            <button type="button" title="Novo arquivo" aria-label="Novo arquivo" onClick={() => iniciar("arquivo")} className="rounded p-0.5 hover:bg-[#45494e]">
              <IconeNovoArquivo className="h-4 w-4" />
            </button>
            <button type="button" title="Nova pasta" aria-label="Nova pasta" onClick={() => iniciar("pasta")} className="rounded p-0.5 hover:bg-[#45494e]">
              <IconeNovaPasta className="h-4 w-4" />
            </button>
            <button type="button" title="Enviar imagem" aria-label="Enviar imagem" onClick={() => inputImagem.current?.click()} className="rounded p-0.5 hover:bg-[#45494e]">
              <IconeImagem className="h-4 w-4" />
            </button>
            <input
              ref={inputImagem}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files?.length) props.aoEnviarImagens(e.target.files, pastaSel);
                e.target.value = "";
              }}
            />
          </span>
        )}
      </div>

      <div role="tree" aria-label="Arquivos do projeto" className="min-h-0 flex-1 overflow-y-auto pb-4">
        {edicao && edicao.modo !== "renomear" && edicao.base === "" && campoEdicao(0, "", edicao.modo === "pasta")}
        {renderNos(arvore, 0)}
        {caminhos.length === 0 && !edicao && (
          <div className="px-4 py-3 text-[13px] leading-relaxed text-[#cccccc]">
            <p>A pasta está vazia.</p>
            {gerencia && (
              <>
                <p className="mt-2 text-[#9d9d9d]">Comece criando a página inicial do site:</p>
                <button
                  type="button"
                  onClick={() => iniciar("arquivo")}
                  className="mt-3 w-full rounded-sm bg-[#0e639c] px-3 py-1.5 text-[13px] text-white hover:bg-[#1177bb]"
                >
                  Novo arquivo
                </button>
                <p className="mt-3 text-xs text-[#9d9d9d]">
                  Dica: chame de <code className="text-[#d7ba7d]">index.html</code>. Depois, digite <code className="text-[#d7ba7d]">!</code> e aperte{" "}
                  <kbd className="rounded border border-[#555] px-1">Tab</kbd>.
                </p>
              </>
            )}
          </div>
        )}
      </div>
      {!gerencia && (
        <p className="border-t border-[#2b2b2b] px-4 py-2 text-[11px] text-[#9d9d9d]">
          Neste nível os arquivos já vêm criados. No nível <strong>Livre</strong>, você cria os seus.
        </p>
      )}
    </div>
  );
}
