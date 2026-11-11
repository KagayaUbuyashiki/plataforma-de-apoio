"use client";

import Link from "next/link";
import { useState } from "react";
import { Icone } from "@/components/Icone";

const PASSOS = [
  {
    titulo: "Você digita um endereço",
    texto:
      "Tudo começa no navegador (Chrome, Edge, Firefox…). Você digita um endereço, como plataforma-de-apoio.vercel.app, ou clica num link. Esse endereço é como o endereço de uma casa: diz onde o site mora.",
  },
  {
    titulo: "O navegador faz um pedido",
    texto:
      "O navegador manda um pedido pela internet até o servidor: um computador ligado o tempo todo, que guarda os arquivos do site. É como pedir uma pizza por telefone: \"me manda a página inicial, por favor\".",
  },
  {
    titulo: "O servidor manda os arquivos",
    texto:
      "O servidor responde mandando os arquivos do site: o index.html, o style.css e as imagens. São os mesmos tipos de arquivo que você cria no programa!",
  },
  {
    titulo: "O navegador monta a página",
    texto:
      "O navegador lê o HTML, que é o esqueleto (títulos, textos, imagens, links), e depois aplica o CSS, que é a roupa (cores, fontes, espaços, layout). Juntando os dois, ele desenha a página.",
  },
  {
    titulo: "A página aparece!",
    texto:
      "Pronto: em menos de um segundo, a página aparece na sua tela. O seu site do Meu Primeiro Site funciona exatamente assim. Quando você abre o seu index.html, o navegador lê o seu HTML e o seu CSS para desenhar a página.",
  },
];

export function HistoriaWeb() {
  const [passo, setPasso] = useState(0);
  const ultimo = passo === PASSOS.length - 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="vidro-forte overflow-hidden rounded-[32px] p-4 sm:p-8">
        <Cena passo={passo} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div key={passo} className="animate-surgir" aria-live="polite">
          <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-marca-600">
            Passo {passo + 1} de {PASSOS.length}
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{PASSOS[passo].titulo}</h2>
          <p className="mt-3 max-w-3xl text-lg font-medium leading-relaxed text-[#2b3a4a]">{PASSOS[passo].texto}</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setPasso((p) => Math.max(0, p - 1))} disabled={passo === 0} className="btn-secundario disabled:opacity-40">
            <Icone nome="setaVoltar" tamanho={16} espessura={2.2} /> Voltar
          </button>
          {!ultimo ? (
            <button type="button" onClick={() => setPasso((p) => p + 1)} className="btn-primario group">
              Próximo <Icone nome="seta" tamanho={16} espessura={2.2} className="seta-anda" />
            </button>
          ) : (
            <button type="button" onClick={() => setPasso(0)} className="btn-primario">
              Ver de novo
            </button>
          )}
        </div>
      </div>

      <ol className="flex justify-center gap-2" aria-label="Passos">
        {PASSOS.map((p, i) => (
          <li key={p.titulo}>
            <button
              type="button"
              onClick={() => setPasso(i)}
              aria-label={`Passo ${i + 1}: ${p.titulo}`}
              aria-current={i === passo ? "step" : undefined}
              className={`h-2.5 rounded-full transition-all duration-500 ${i === passo ? "w-10 bg-tinta" : i < passo ? "w-2.5 bg-marca-500" : "w-2.5 bg-white"}`}
            />
          </li>
        ))}
      </ol>

      {ultimo && (
        <div className="vidro animate-surgir flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-extrabold">Mão na massa!</p>
            <p className="text-sm font-medium text-tinta-suave">Agora que você sabe como funciona, que tal criar a sua página?</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/aprender/desafios" className="btn-secundario">
              Fazer um desafio
            </Link>
            <Link href="/editor" className="btn-primario group">
              Abrir o editor <Icone nome="seta" tamanho={16} espessura={2.2} className="seta-anda" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/** Diagrama: navegador (esquerda), internet (meio) e servidor (direita). */
function Cena({ passo }: { passo: number }) {
  const ativo = (n: number) => (passo === n ? 1 : 0.35);
  const montado = passo >= 3;
  const pronto = passo >= 4;

  return (
    <svg viewBox="0 0 760 300" className="h-auto w-full" role="img" aria-label="Navegador, internet e servidor trocando arquivos">
      <defs>
        <linearGradient id="hw-ceu" x1="0" x2="1">
          <stop offset="0" stopColor="#e0f2fe" />
          <stop offset="1" stopColor="#ede9fe" />
        </linearGradient>
        <style>{`
          .hw-viaja{animation:hw-viaja 1.6s cubic-bezier(.4,0,.2,1) infinite}
          .hw-volta{animation:hw-volta 1.6s cubic-bezier(.4,0,.2,1) infinite}
          .hw-digita{animation:hw-digita 2s steps(28) infinite}
          .hw-surge{animation:hw-surge .7s cubic-bezier(.2,.7,.2,1) both}
          @keyframes hw-viaja{0%{transform:translateX(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(330px);opacity:0}}
          @keyframes hw-volta{0%{transform:translateX(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(-330px);opacity:0}}
          @keyframes hw-digita{from{width:0}to{width:150px}}
          @keyframes hw-surge{from{opacity:0;transform:translateY(10px)}}
          @media (prefers-reduced-motion:reduce){.hw-viaja,.hw-volta,.hw-digita,.hw-surge{animation:none}}
        `}</style>
      </defs>

      {/* Internet (nuvem) */}
      <g opacity={passo === 1 || passo === 2 ? 1 : 0.45} style={{ transition: "opacity .5s" }}>
        <path d="M330 120c0-22 18-38 40-36 8-16 26-26 44-22 20-12 48-2 54 20 18 2 30 16 28 34-2 16-16 26-32 26H350c-12 0-20-10-20-22z" fill="url(#hw-ceu)" stroke="#a5b4fc" strokeWidth="2" />
        <text x="410" y="132" textAnchor="middle" fontSize="16" fontWeight="800" fill="#4f46e5">internet</text>
      </g>

      {/* Navegador */}
      <g style={{ transition: "opacity .5s" }} opacity={passo === 1 || passo === 2 ? 0.6 : 1}>
        <rect x="20" y="40" width="250" height="220" rx="16" fill="#fff" stroke="#0c1b2a" strokeWidth="3" />
        <rect x="20" y="40" width="250" height="34" rx="16" fill="#0c1b2a" />
        <circle cx="40" cy="57" r="5" fill="#f87171" />
        <circle cx="56" cy="57" r="5" fill="#fbbf24" />
        <circle cx="72" cy="57" r="5" fill="#34d399" />
        <rect x="88" y="48" width="170" height="18" rx="9" fill="#1e293b" />
        <svg x="96" y="48" width={passo === 0 ? undefined : 150} height="18" className={passo === 0 ? "hw-digita" : undefined} overflow="hidden">
          <text x="0" y="13" fontSize="11" fill="#e2e8f0" fontFamily="monospace">meuprimeirosite.com.br</text>
        </svg>

        {/* Conteúdo da página: aparece aos poucos */}
        {montado ? (
          <g className="hw-surge" key="pagina">
            <rect x="36" y="88" width="218" height="40" rx="8" fill={pronto ? "#26BDE2" : "none"} stroke="#94a3b8" strokeDasharray={pronto ? "0" : "5 4"} style={{ transition: "fill .6s" }} />
            <text x="48" y="114" fontSize="16" fontWeight="800" fill={pronto ? "#fff" : "#0c1b2a"}>Vida na Água</text>
            <rect x="36" y="140" width="150" height="10" rx="5" fill={pronto ? "#94a3b8" : "#cbd5e1"} />
            <rect x="36" y="158" width="190" height="10" rx="5" fill={pronto ? "#94a3b8" : "#cbd5e1"} />
            <rect x="36" y="182" width="100" height="62" rx="8" fill={pronto ? "#FDE68A" : "none"} stroke="#94a3b8" strokeDasharray={pronto ? "0" : "5 4"} style={{ transition: "fill .6s" }} />
            <rect x="148" y="182" width="106" height="62" rx="8" fill={pronto ? "#3F7E44" : "none"} stroke="#94a3b8" strokeDasharray={pronto ? "0" : "5 4"} style={{ transition: "fill .6s" }} />
            {passo === 3 && (
              <g className="hw-surge">
                <text x="145" y="275" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0c1b2a">HTML (esqueleto) + CSS (roupa)</text>
              </g>
            )}
          </g>
        ) : (
          <text x="145" y="165" textAnchor="middle" fontSize="14" fontWeight="700" fill="#94a3b8">
            {passo === 0 ? "esperando…" : "carregando…"}
          </text>
        )}
        <text x="145" y={montado ? 296 : 290} textAnchor="middle" fontSize="15" fontWeight="800" fill="#0c1b2a" opacity={montado ? 0 : ativo(0)}>
          navegador
        </text>
      </g>

      {/* Servidor */}
      <g opacity={passo === 1 || passo === 2 ? 1 : 0.45} style={{ transition: "opacity .5s" }}>
        <rect x="560" y="70" width="170" height="160" rx="16" fill="#0c1b2a" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="576" y={88 + i * 44} width="138" height="32" rx="8" fill="#1e293b" />
            <circle cx="592" cy={104 + i * 44} r="4" fill={passo === 1 ? "#34d399" : "#64748b"} />
            <rect x="606" y={100 + i * 44} width="90" height="8" rx="4" fill="#334155" />
          </g>
        ))}
        <text x="645" y="256" textAnchor="middle" fontSize="15" fontWeight="800" fill="#0c1b2a">servidor</text>
      </g>

      {/* Pedido indo */}
      {passo === 1 && (
        <g className="hw-viaja" style={{ transformBox: "fill-box" }}>
          <rect x="230" y="104" width="80" height="30" rx="15" fill="#6366f1" />
          <text x="270" y="124" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">pedido</text>
        </g>
      )}

      {/* Arquivos voltando */}
      {passo === 2 && (
        <g>
          {[
            ["index.html", "#E5243B", 0],
            ["style.css", "#26BDE2", 0.4],
            ["foto.jpg", "#4C9F38", 0.8],
          ].map(([nome, cor, atraso]) => (
            <g key={nome as string} className="hw-volta" style={{ animationDelay: `${atraso}s` }}>
              <rect x="560" y={150 + (atraso as number) * 30} width="92" height="28" rx="8" fill={cor as string} />
              <text x="606" y={169 + (atraso as number) * 30} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">
                {nome}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
