"use client";

import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { listarProjetos, novoProjeto, obterProjeto, salvarProjeto } from "@/lib/editor/armazenamento";
import type { Bloco } from "@/lib/editor/blocos";
import { caminhoValido } from "@/lib/editor/caminhos";
import { getNivel } from "@/lib/editor/niveis";
import { linguagemMonaco, tipoDoArquivo, type Nivel, type Projeto } from "@/lib/editor/tipos";
import { baixarZip, imagemParaDataUrl } from "@/lib/editor/zip";
import { EditorCodigo } from "./EditorCodigo";
import { Explorador } from "./Explorador";
import { IconeArquivos, IconeBlocos, IconeFechar, IconeMissoes, IconeOlho, IconeTipo } from "./icones";
import { PainelBlocos } from "./PainelBlocos";
import { PainelMissoes, useMissoes } from "./PainelMissoes";
import { Previa } from "./Previa";

type Painel = "explorador" | "blocos" | "missoes";
type Vista = "painel" | "codigo" | "previa";

const EXTENSOES_TEXTO = /\.(html|css|js|txt|md)$/i;
const MAX_IMAGEM = 1024 * 1024;

export function Workbench({ nivel: nivelId }: { nivel: Nivel }) {
  const cfg = getNivel(nivelId)!;
  const router = useRouter();
  const params = useSearchParams();

  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [abertos, setAbertos] = useState<string[]>([]);
  const [ativo, setAtivo] = useState<string | null>(null);
  const [pagina, setPagina] = useState<string | null>(null);
  const [painel, setPainel] = useState<Painel | null>(cfg.blocos ? "blocos" : "explorador");
  const [mostrarPrevia, setMostrarPrevia] = useState(true);
  const [vista, setVista] = useState<Vista>("codigo");
  const [cursor, setCursor] = useState({ linha: 1, coluna: 1 });
  const [salvo, setSalvo] = useState<"salvo" | "pendente" | "erro">("salvo");
  const [aviso, setAviso] = useState<string | null>(null);
  const [geracao, setGeracao] = useState(0);
  const [renomeandoProjeto, setRenomeandoProjeto] = useState(false);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const realce = useRef<{ caminho: string; inicio: number; fim: number } | null>(null);
  const carregou = useRef(false);
  const ultimo = useRef<Projeto | null>(null);
  const missoes = useMissoes(nivelId, projeto?.arquivos ?? {});

  const avisar = useCallback((msg: string) => {
    setAviso(msg);
    window.setTimeout(() => setAviso((a) => (a === msg ? null : a)), 4500);
  }, []);

  // ---------- Carregar ou criar o projeto ----------
  useEffect(() => {
    if (carregou.current) return;
    carregou.current = true;
    const id = params.get("projeto");
    let p = id ? obterProjeto(id) : null;
    if (p && p.nivel !== nivelId) {
      router.replace(`/editor/${p.nivel}?projeto=${p.id}`);
      return;
    }
    if (!p) {
      const n = listarProjetos().filter((x) => x.nivel === nivelId).length + 1;
      p = novoProjeto(nivelId, `Meu site ${n}`, cfg.arquivosIniciais());
      salvarProjeto(p);
      router.replace(`/editor/${nivelId}?projeto=${p.id}`);
    }
    abrirProjeto(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function abrirProjeto(p: Projeto) {
    setProjeto(p);
    ultimo.current = p;
    const textos = Object.keys(p.arquivos)
      .filter((c) => tipoDoArquivo(c) !== "imagem")
      .sort((a, b) => (a === "index.html" ? -1 : b === "index.html" ? 1 : a.localeCompare(b)));
    const inicial = textos[0] ?? null;
    setAbertos(textos.slice(0, 3));
    setAtivo(inicial);
    setPagina(inicial && tipoDoArquivo(inicial) === "html" ? inicial : null);
  }

  // ---------- Salvamento automático ----------
  useEffect(() => {
    if (!projeto || salvo !== "pendente") return;
    const t = window.setTimeout(() => {
      const atualizado = { ...projeto, atualizadoEm: new Date().toISOString() };
      setSalvo(salvarProjeto(atualizado) ? "salvo" : "erro");
    }, 500);
    return () => window.clearTimeout(t);
  }, [projeto, salvo]);

  useEffect(() => {
    ultimo.current = projeto;
  }, [projeto]);

  useEffect(() => {
    const salvarAgora = () => {
      if (ultimo.current) salvarProjeto({ ...ultimo.current, atualizadoEm: new Date().toISOString() });
    };
    window.addEventListener("pagehide", salvarAgora);
    return () => window.removeEventListener("pagehide", salvarAgora);
  }, []);

  const alterar = useCallback((muda: (p: Projeto) => Projeto) => {
    setProjeto((p) => (p ? muda(p) : p));
    setSalvo("pendente");
  }, []);

  const aoMudarConteudo = useCallback(
    (caminho: string, valor: string) => {
      alterar((p) => (p.arquivos[caminho] === valor ? p : { ...p, arquivos: { ...p.arquivos, [caminho]: valor } }));
    },
    [alterar],
  );

  // ---------- Abas ----------
  function abrir(caminho: string) {
    setAbertos((a) => (a.includes(caminho) ? a : [...a, caminho]));
    setAtivo(caminho);
    if (tipoDoArquivo(caminho) === "html") setPagina(caminho);
    if (window.matchMedia("(max-width: 767px)").matches) setVista("codigo");
  }

  function fecharAba(caminho: string) {
    setAbertos((a) => {
      const i = a.indexOf(caminho);
      const resto = a.filter((c) => c !== caminho);
      if (ativo === caminho) setAtivo(resto[Math.min(i, resto.length - 1)] ?? null);
      return resto;
    });
  }

  // Aplica o destaque das linhas inseridas depois que o editor troca de arquivo
  useEffect(() => {
    const r = realce.current;
    const ed = editorRef.current;
    if (!r || !ed || r.caminho !== ativo) return;
    const t = window.setTimeout(() => destacar(r.inicio, r.fim), 60);
    realce.current = null;
    return () => window.clearTimeout(t);
  });

  function destacar(inicio: number, fim: number) {
    const ed = editorRef.current;
    const monaco = monacoRef.current;
    if (!ed || !monaco) return;
    const colecao = ed.createDecorationsCollection([
      { range: new monaco.Range(inicio, 1, fim, 1), options: { isWholeLine: true, className: "mps-linha-nova" } },
    ]);
    ed.revealLinesInCenterIfOutsideViewport(inicio, fim);
    ed.setPosition({ lineNumber: fim, column: ed.getModel()?.getLineMaxColumn(fim) ?? 1 });
    ed.focus();
    window.setTimeout(() => colecao.clear(), 2600);
  }

  // ---------- Blocos (Iniciante) ----------
  function inserirBloco(b: Bloco) {
    const monaco = monacoRef.current;
    const ed = editorRef.current;
    if (!projeto) return;
    if (!monaco || !ed) return avisar("O editor ainda está carregando. Espere um instante e clique de novo.");
    if (projeto.arquivos[b.arquivo] == null) return avisar(`O arquivo ${b.arquivo} não existe. Use "Restaurar modelo".`);

    const uri = monaco.Uri.parse(b.arquivo);
    const model = monaco.editor.getModel(uri) ?? monaco.editor.createModel(projeto.arquivos[b.arquivo], linguagemMonaco(b.arquivo), uri);
    const texto = model.getValue();
    const recuar = (codigo: string, ind: string) => codigo.split("\n").map((l) => (l ? ind + l : l)).join("\n");
    let range: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number };
    let inserir: string;
    let linhaInicial: number;

    if (b.arquivo.endsWith(".html")) {
      const abreBody = texto.match(/<body[^>]*>/i);
      const fimAbre = abreBody ? (abreBody.index ?? 0) + abreBody[0].length : -1;
      const fechaBody = texto.toLowerCase().lastIndexOf("</body>");
      const pos = ativo === b.arquivo ? ed.getPosition() : null;
      const offset = pos ? model.getOffsetAt(pos) : -1;

      if (pos && fimAbre >= 0 && offset >= fimAbre && (fechaBody < 0 || offset <= fechaBody)) {
        // Cursor dentro do <body>: insere logo abaixo da linha atual
        const linha = model.getLineContent(pos.lineNumber);
        const ind = linha.match(/^\s*/)?.[0] ?? "";
        if (linha.trim() === "") {
          range = { startLineNumber: pos.lineNumber, startColumn: 1, endLineNumber: pos.lineNumber, endColumn: linha.length + 1 };
          inserir = recuar(b.codigo, ind || "    ");
          linhaInicial = pos.lineNumber;
        } else {
          const fimLinha = linha.length + 1;
          range = { startLineNumber: pos.lineNumber, startColumn: fimLinha, endLineNumber: pos.lineNumber, endColumn: fimLinha };
          inserir = "\n\n" + recuar(b.codigo, ind);
          linhaInicial = pos.lineNumber + 2;
        }
      } else if (fechaBody >= 0) {
        // Senão: antes de </body>
        const p = model.getPositionAt(fechaBody);
        const ind = (model.getLineContent(p.lineNumber).match(/^\s*/)?.[0] ?? "") + "  ";
        range = { startLineNumber: p.lineNumber, startColumn: 1, endLineNumber: p.lineNumber, endColumn: 1 };
        inserir = recuar(b.codigo, ind) + "\n\n";
        linhaInicial = p.lineNumber;
      } else {
        const ultima = model.getLineCount();
        const col = model.getLineMaxColumn(ultima);
        range = { startLineNumber: ultima, startColumn: col, endLineNumber: ultima, endColumn: col };
        inserir = "\n" + b.codigo + "\n";
        linhaInicial = ultima + 1;
      }
    } else {
      // CSS: sempre no final do arquivo
      const ultima = model.getLineCount();
      const col = model.getLineMaxColumn(ultima);
      range = { startLineNumber: ultima, startColumn: col, endLineNumber: ultima, endColumn: col };
      inserir = (texto.endsWith("\n") || texto === "" ? "" : "\n") + "\n" + b.codigo + "\n";
      linhaInicial = ultima + (texto.endsWith("\n") || texto === "" ? 1 : 2);
    }

    const linhaFinal = linhaInicial + b.codigo.split("\n").length - 1;
    if (ativo === b.arquivo) {
      ed.pushUndoStop();
      ed.executeEdits("bloco", [{ range, text: inserir, forceMoveMarkers: true }]);
      ed.pushUndoStop();
      destacar(linhaInicial, linhaFinal);
    } else {
      model.pushStackElement();
      model.pushEditOperations([], [{ range, text: inserir }], () => null);
      model.pushStackElement();
      aoMudarConteudo(b.arquivo, model.getValue());
      realce.current = { caminho: b.arquivo, inicio: linhaInicial, fim: linhaFinal };
      abrir(b.arquivo);
    }
    if (window.matchMedia("(max-width: 767px)").matches) setVista("codigo");
  }

  // ---------- Arquivos (Livre) ----------
  const existe = (p: Projeto, c: string) => p.arquivos[c] != null || (p.pastas ?? []).includes(c) || Object.keys(p.arquivos).some((a) => a.startsWith(c + "/"));

  function descartarModelos(filtro: (c: string) => boolean) {
    const monaco = monacoRef.current;
    if (!monaco) return;
    for (const m of monaco.editor.getModels()) {
      const c = m.uri.path.replace(/^\//, "");
      if (!filtro(c)) continue;
      // Desanexa do editor antes de descartar (descartar o modelo em uso quebra o Monaco)
      const ed = editorRef.current;
      if (ed && ed.getModel() === m) ed.setModel(null);
      m.dispose();
    }
  }

  function criar(caminho: string, tipo: "arquivo" | "pasta"): string | null {
    if (!projeto) return "Projeto não carregado.";
    const erro = caminhoValido(caminho);
    if (erro) return erro;
    const c = caminho.trim().replace(/^\/+|\/+$/g, "");
    if (existe(projeto, c)) return `Já existe "${c}" neste projeto.`;
    if (tipo === "pasta") {
      alterar((p) => ({ ...p, pastas: [...(p.pastas ?? []), c] }));
      return null;
    }
    if (!c.includes(".")) return "Coloque a extensão no nome, ex.: pagina.html ou estilo.css";
    if (!EXTENSOES_TEXTO.test(c)) return "Crie arquivos .html, .css ou .js. Para imagens, use o botão de enviar imagem.";
    alterar((p) => ({ ...p, arquivos: { ...p.arquivos, [c]: "" } }));
    abrir(c);
    return null;
  }

  function renomear(de: string, para: string, pasta: boolean): string | null {
    if (!projeto) return "Projeto não carregado.";
    const destino = para.trim().replace(/^\/+|\/+$/g, "");
    if (destino === de) return null;
    const erro = caminhoValido(destino);
    if (erro) return erro;
    if (existe(projeto, destino)) return `Já existe "${destino}" neste projeto.`;
    if (!pasta && tipoDoArquivo(de) !== "imagem" && !EXTENSOES_TEXTO.test(destino)) return "Mantenha uma extensão válida (.html, .css, .js).";
    const troca = (c: string) => (pasta ? (c === de || c.startsWith(de + "/") ? destino + c.slice(de.length) : c) : c === de ? destino : c);
    descartarModelos((c) => c === de || (pasta && c.startsWith(de + "/")));
    alterar((p) => ({
      ...p,
      arquivos: Object.fromEntries(Object.entries(p.arquivos).map(([c, v]) => [troca(c), v])),
      pastas: (p.pastas ?? []).map(troca),
    }));
    setAbertos((a) => a.map(troca));
    setAtivo((a) => (a ? troca(a) : a));
    setPagina((a) => (a ? troca(a) : a));
    return null;
  }

  function excluir(caminho: string, pasta: boolean) {
    if (!confirm(pasta ? `Excluir a pasta "${caminho}" e tudo o que tem dentro?` : `Excluir "${caminho}"?`)) return;
    const sai = (c: string) => c === caminho || (pasta && c.startsWith(caminho + "/"));
    descartarModelos(sai);
    alterar((p) => ({
      ...p,
      arquivos: Object.fromEntries(Object.entries(p.arquivos).filter(([c]) => !sai(c))),
      pastas: (p.pastas ?? []).filter((c) => !sai(c)),
    }));
    setAbertos((a) => a.filter((c) => !sai(c)));
    if (ativo && sai(ativo)) setAtivo(null);
    if (pagina && sai(pagina)) setPagina(null);
  }

  async function enviarImagens(lista: FileList, pasta: string) {
    if (!projeto) return;
    const novos: Record<string, string> = {};
    for (const arq of Array.from(lista)) {
      if (!arq.type.startsWith("image/")) { avisar(`"${arq.name}" não é uma imagem.`); continue; }
      if (arq.size > MAX_IMAGEM) { avisar(`"${arq.name}" é maior que 1 MB. Diminua a imagem antes de enviar.`); continue; }
      const ext = arq.name.split(".").pop()?.toLowerCase() ?? "png";
      const base = arq.name.replace(/\.[^.]+$/, "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w-]+/g, "-").toLowerCase() || "imagem";
      let nome = `${base}.${ext}`;
      let i = 2;
      while (existe(projeto, pasta ? `${pasta}/${nome}` : nome) || novos[pasta ? `${pasta}/${nome}` : nome]) nome = `${base}-${i++}.${ext}`;
      novos[pasta ? `${pasta}/${nome}` : nome] = await imagemParaDataUrl(arq);
    }
    const caminhos = Object.keys(novos);
    if (!caminhos.length) return;
    alterar((p) => ({ ...p, arquivos: { ...p.arquivos, ...novos } }));
    avisar(`Imagem adicionada! Use: <img src="${caminhos[0]}" alt="descrição">`);
  }

  function restaurarModelo() {
    if (!projeto || !confirm("Voltar os arquivos para o modelo inicial? Tudo o que você fez neste projeto será apagado.")) return;
    descartarModelos(() => true);
    const p = { ...projeto, arquivos: cfg.arquivosIniciais(), pastas: [] };
    setGeracao((g) => g + 1);
    abrirProjeto(p);
    setSalvo("pendente");
  }

  // ---------- Atalhos ----------
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (ultimo.current) setSalvo(salvarProjeto({ ...ultimo.current, atualizadoEm: new Date().toISOString() }) ? "salvo" : "erro");
        avisar("Projeto salvo neste navegador. Para levar para casa, use \"Baixar .zip\".");
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [avisar]);

  if (!projeto) {
    return <div className="grid h-dvh place-items-center bg-[#1e1e1e] text-sm text-[#8a8a8a]">Abrindo o projeto…</div>;
  }

  const ehImagem = ativo ? tipoDoArquivo(ativo) === "imagem" : false;
  const linguagem = ativo ? { html: "HTML", css: "CSS", js: "JavaScript", imagem: "Imagem", texto: "Texto" }[tipoDoArquivo(ativo)] : "";
  const atividades: { id: Painel; rotulo: string; Icone: typeof IconeArquivos; mostrar: boolean }[] = [
    { id: "explorador", rotulo: "Explorador", Icone: IconeArquivos, mostrar: true },
    { id: "blocos", rotulo: "Blocos", Icone: IconeBlocos, mostrar: cfg.blocos },
    { id: "missoes", rotulo: "Missões", Icone: IconeMissoes, mostrar: cfg.missoes },
  ];

  const conteudoPainel = (p: Painel) =>
    p === "blocos" ? (
      <PainelBlocos aoInserir={inserirBloco} />
    ) : p === "missoes" ? (
      <PainelMissoes nivel={nivelId} arquivos={projeto.arquivos} />
    ) : (
      <Explorador
        nomeProjeto={projeto.nome}
        caminhos={Object.keys(projeto.arquivos)}
        pastas={projeto.pastas ?? []}
        ativo={ativo}
        gerencia={cfg.gerenciaArquivos}
        aoAbrir={abrir}
        aoCriar={criar}
        aoRenomear={renomear}
        aoExcluir={excluir}
        aoEnviarImagens={enviarImagens}
      />
    );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#1e1e1e] text-[#cccccc]" style={{ colorScheme: "dark" }}>
      {/* Barra de título */}
      <header className="flex h-9 shrink-0 items-center gap-2 border-b border-[#2b2b2b] bg-[#3c3c3c] px-2 text-[13px]">
        <Link href="/editor" className="flex items-center gap-2 rounded px-2 py-1 hover:bg-[#505050]" title="Voltar para os projetos">
          <span className="grid h-5 w-5 place-items-center rounded bg-[#0b7a92] font-mono text-[9px] font-bold text-white" aria-hidden>&lt;/&gt;</span>
          <span className="hidden sm:inline">Projetos</span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          {renomeandoProjeto ? (
            <input
              autoFocus
              defaultValue={projeto.nome}
              aria-label="Nome do projeto"
              maxLength={60}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
                if (e.key === "Escape") setRenomeandoProjeto(false);
              }}
              onBlur={(e) => {
                const nome = e.currentTarget.value.trim();
                if (nome) alterar((p) => ({ ...p, nome }));
                setRenomeandoProjeto(false);
              }}
              className="w-56 border border-[#007fd4] bg-[#3c3c3c] px-2 py-0.5 text-center text-white outline-none"
            />
          ) : (
            <button type="button" onClick={() => setRenomeandoProjeto(true)} className="truncate rounded px-2 py-0.5 hover:bg-[#505050]" title="Renomear projeto">
              {projeto.nome}
            </button>
          )}
          <span className="hidden shrink-0 rounded bg-[#505050] px-1.5 py-0.5 text-[11px] sm:inline">
            {cfg.icone} {cfg.nome}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {!cfg.gerenciaArquivos && (
            <button type="button" onClick={restaurarModelo} className="hidden rounded px-2 py-1 hover:bg-[#505050] lg:inline" title="Voltar ao modelo inicial">
              Restaurar modelo
            </button>
          )}
          <button
            type="button"
            onClick={() => baixarZip(projeto.nome, projeto.arquivos, projeto.pastas)}
            className="rounded bg-[#0e639c] px-2.5 py-1 text-white hover:bg-[#1177bb]"
            title="Baixar todos os arquivos em um .zip"
          >
            Baixar .zip
          </button>
          <button
            type="button"
            onClick={() => setMostrarPrevia((v) => !v)}
            aria-pressed={mostrarPrevia}
            className={`hidden rounded p-1 md:inline-flex ${mostrarPrevia ? "bg-[#505050] text-white" : "hover:bg-[#505050]"}`}
            title={mostrarPrevia ? "Esconder a prévia" : "Mostrar a prévia"}
            aria-label="Mostrar ou esconder a prévia"
          >
            <IconeOlho className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Alternador do celular */}
      <nav className="flex shrink-0 border-b border-[#2b2b2b] bg-[#252526] md:hidden" aria-label="Áreas do editor">
        {(["painel", "codigo", "previa"] as Vista[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVista(v)}
            aria-pressed={vista === v}
            className={`flex-1 py-2 text-xs font-medium ${vista === v ? "border-b-2 border-[#007fd4] text-white" : "text-[#9d9d9d]"}`}
          >
            {v === "painel" ? (cfg.blocos ? "Blocos" : "Arquivos") : v === "codigo" ? "Código" : "Prévia"}
          </button>
        ))}
      </nav>

      <div className="flex min-h-0 flex-1">
        {/* Barra de atividades */}
        <nav className="hidden w-12 shrink-0 flex-col items-center bg-[#333333] md:flex" aria-label="Painéis">
          {atividades.filter((a) => a.mostrar).map(({ id, rotulo, Icone }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPainel((p) => (p === id ? null : id))}
              aria-pressed={painel === id}
              title={rotulo}
              aria-label={rotulo}
              className={`relative grid h-12 w-12 place-items-center ${painel === id ? "text-white" : "text-[#858585] hover:text-white"}`}
            >
              {painel === id && <span className="absolute inset-y-0 left-0 w-0.5 bg-white" />}
              <Icone className="h-6 w-6" />
              {id === "missoes" && missoes.lista.length > 0 && (
                <span className="absolute bottom-1.5 right-1.5 rounded-full bg-[#007acc] px-1 text-[9px] font-bold text-white">
                  {missoes.feitas.size}/{missoes.lista.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Barra lateral */}
        <aside
          className={`${vista === "painel" ? "flex" : "hidden"} ${painel ? "md:flex" : "md:hidden"} min-h-0 w-full flex-col border-r border-[#2b2b2b] bg-[#252526] md:w-64 md:shrink-0 lg:w-72`}
        >
          <div className="flex shrink-0 border-b border-[#2b2b2b] md:hidden">
            {atividades.filter((a) => a.mostrar).map(({ id, rotulo }) => (
              <button key={id} type="button" onClick={() => setPainel(id)} className={`flex-1 py-1.5 text-[11px] ${painel === id ? "text-white" : "text-[#9d9d9d]"}`}>
                {rotulo}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1">{conteudoPainel(painel ?? (cfg.blocos ? "blocos" : "explorador"))}</div>
        </aside>

        {/* Editor */}
        <section className={`${vista === "codigo" ? "flex" : "hidden"} min-w-0 flex-1 flex-col md:flex`} aria-label="Código">
          <div className="flex h-9 shrink-0 overflow-x-auto bg-[#252526]" role="tablist" aria-label="Arquivos abertos">
            {abertos.map((c) => (
              <div
                key={c}
                role="tab"
                aria-selected={c === ativo}
                className={`group flex shrink-0 cursor-pointer items-center gap-1.5 border-r border-[#252526] pl-3 pr-1 text-[13px] ${
                  c === ativo ? "border-t border-t-[#007fd4] bg-[#1e1e1e] text-white" : "bg-[#2d2d2d] text-[#969696] hover:text-[#cccccc]"
                }`}
                onClick={() => abrir(c)}
                onAuxClick={(e) => e.button === 1 && fecharAba(c)}
              >
                <IconeTipo caminho={c} />
                <span title={c}>{c.split("/").pop()}</span>
                <button
                  type="button"
                  aria-label={`Fechar ${c}`}
                  onClick={(e) => { e.stopPropagation(); fecharAba(c); }}
                  className={`rounded p-0.5 hover:bg-[#3c3c3c] ${c === ativo ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  <IconeFechar className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          {ativo && (
            <div className="flex h-6 shrink-0 items-center gap-1 bg-[#1e1e1e] px-4 text-xs text-[#a9a9a9]">
              {["meu-site", ...ativo.split("/")].map((p, i, l) => (
                <span key={i} className="flex items-center gap-1">
                  {p}
                  {i < l.length - 1 && <span aria-hidden>›</span>}
                </span>
              ))}
            </div>
          )}
          <div className="relative min-h-0 flex-1">
            {!ativo ? (
              <div className="grid h-full place-items-center p-6 text-center">
                <div>
                  <p className="font-mono text-5xl text-[#3c3c3c]" aria-hidden>&lt;/&gt;</p>
                  <p className="mt-4 text-sm text-[#9d9d9d]">
                    {cfg.gerenciaArquivos ? "Crie um arquivo no Explorador para começar." : "Abra um arquivo no Explorador."}
                  </p>
                </div>
              </div>
            ) : ehImagem ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 overflow-auto bg-[#1e1e1e] p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={projeto.arquivos[ativo]} alt={`Imagem ${ativo}`} className="max-h-[60%] max-w-full rounded border border-[#3c3c3c] bg-[repeating-conic-gradient(#2d2d2d_0%_25%,#3c3c3c_0%_50%)] bg-[length:16px_16px]" />
                <p className="text-xs text-[#9d9d9d]">Para usar no HTML:</p>
                <code className="select-all rounded bg-[#2d2d2d] px-3 py-1.5 font-mono text-xs text-[#ce9178]">
                  &lt;img src=&quot;{ativo}&quot; alt=&quot;descreva a imagem&quot;&gt;
                </code>
              </div>
            ) : (
              <EditorCodigo
                key={geracao}
                caminho={ativo}
                conteudo={projeto.arquivos[ativo] ?? ""}
                nivel={cfg}
                aoMudar={aoMudarConteudo}
                aoMoverCursor={(linha, coluna) => setCursor({ linha, coluna })}
                aoMontar={(ed, monaco) => {
                  editorRef.current = ed;
                  monacoRef.current = monaco;
                }}
              />
            )}
          </div>
        </section>

        {/* Prévia */}
        <section
          className={`${vista === "previa" ? "flex" : "hidden"} ${mostrarPrevia ? "md:flex" : "md:hidden"} min-w-0 flex-1 flex-col border-l border-[#2b2b2b] md:max-w-[45%]`}
          aria-label="Prévia do site"
        >
          <Previa arquivos={projeto.arquivos} pagina={pagina} aoNavegar={setPagina} />
        </section>
      </div>

      {/* Barra de status */}
      <footer className="flex h-6 shrink-0 items-center justify-between gap-3 bg-[#007acc] px-2 text-xs text-white">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0">{cfg.icone} {cfg.nome}</span>
          <span className="truncate" aria-live="polite">
            {salvo === "salvo" ? "✓ Salvo neste navegador" : salvo === "pendente" ? "Salvando…" : "⚠ Não foi possível salvar — baixe o .zip"}
          </span>
          {missoes.lista.length > 0 && (
            <button type="button" onClick={() => { setPainel("missoes"); setVista("painel"); }} className="hidden shrink-0 hover:underline sm:inline">
              Missões {missoes.feitas.size}/{missoes.lista.length}
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {ativo && !ehImagem && <span>Ln {cursor.linha}, Col {cursor.coluna}</span>}
          <span className="hidden sm:inline">Espaços: 2</span>
          <span className="hidden sm:inline">UTF-8</span>
          {linguagem && <span>{linguagem}</span>}
        </div>
      </footer>

      {aviso && (
        <div role="status" className="fixed bottom-9 right-3 z-50 max-w-sm rounded border border-[#454545] bg-[#252526] px-4 py-3 text-[13px] text-[#cccccc] shadow-2xl">
          <span className="mr-2 text-[#3794ff]" aria-hidden>ⓘ</span>
          {aviso}
        </div>
      )}
    </div>
  );
}
