import type { Metadata } from "next";
import { Aviso } from "@/components/Aviso";
import { Icone, IconeCaixa } from "@/components/Icone";
import { Titulo } from "@/components/Titulo";
import { formatarTelefone, linkWhatsapp } from "@/lib/contato";
import { listarContatos } from "@/lib/dados";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contatos" };

const botao =
  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-bold transition duration-300";

export default async function Contatos() {
  const { dados: contatos, erro } = await listarContatos();

  return (
    <>
      <Titulo
        titulo="Contatos"
        subtitulo="Ficou com dúvida sobre o seu site, as aulas ou o programa? Fale com a equipe do Meu Primeiro Site."
      />

      {erro && <Aviso tipo="erro">Não foi possível carregar os contatos: {erro}</Aviso>}

      {!erro && contatos.length === 0 ? (
        <div data-revelar className="vidro rounded-3xl border-dashed px-6 py-16 text-center">
          <IconeCaixa nome="contato" cor="#6366f1" tamanho={56} className="mx-auto" />
          <h2 className="mt-4 text-lg font-extrabold">Nenhum contato ainda</h2>
          <p className="mt-1 font-medium text-tinta-suave">Os contatos dos instrutores e da coordenação vão aparecer aqui.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contatos.map((c, i) => (
            <li
              key={c.id}
              data-revelar
              style={{ "--d": i % 3 } as React.CSSProperties}
              className="vidro flex flex-col rounded-3xl p-6 transition duration-500 hover:-translate-y-1 hover:bg-white/80"
            >
              <div className="flex items-start gap-3">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#0ea5c6,#6366f1)] text-lg font-extrabold text-white shadow-[0_10px_20px_-8px_#6366f1]"
                  aria-hidden
                >
                  {c.nome.trim().charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h2 className="font-extrabold text-tinta">{c.nome}</h2>
                  {c.funcao && <p className="text-sm font-semibold text-tinta-suave">{c.funcao}</p>}
                </div>
              </div>
              {c.descricao && <p className="mt-3 whitespace-pre-line text-sm font-medium leading-relaxed text-tinta-suave">{c.descricao}</p>}

              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {c.email && (
                  <a href={`mailto:${c.email}`} className={`${botao} border-white bg-white/70 text-tinta hover:-translate-y-0.5 hover:bg-white hover:text-marca-600`}>
                    <Icone nome="email" tamanho={15} espessura={2.1} /> {c.email}
                  </a>
                )}
                {c.telefone && c.whatsapp && (
                  <a
                    href={linkWhatsapp(c.telefone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${botao} border-emerald-200 bg-emerald-50/90 text-emerald-800 hover:-translate-y-0.5 hover:border-emerald-400`}
                  >
                    <Icone nome="conversa" tamanho={15} espessura={2.1} /> WhatsApp {formatarTelefone(c.telefone)}
                    <span className="sr-only">(abre em nova aba)</span>
                  </a>
                )}
                {c.telefone && !c.whatsapp && (
                  <a href={`tel:+${c.telefone.length <= 11 ? "55" + c.telefone : c.telefone}`} className={`${botao} border-white bg-white/70 text-tinta hover:-translate-y-0.5 hover:bg-white hover:text-marca-600`}>
                    <Icone nome="telefone" tamanho={15} espessura={2.1} /> {formatarTelefone(c.telefone)}
                  </a>
                )}
                {c.link && (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${botao} border-white bg-white/70 text-tinta hover:-translate-y-0.5 hover:bg-white hover:text-marca-600`}
                  >
                    <Icone nome="link" tamanho={15} espessura={2.1} /> {(() => { try { return new URL(c.link).hostname.replace(/^www\./, ""); } catch { return "Link"; } })()}
                    <span className="sr-only">(abre em nova aba)</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
