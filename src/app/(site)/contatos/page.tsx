import type { Metadata } from "next";
import { Aviso } from "@/components/Aviso";
import { Titulo } from "@/components/Titulo";
import { formatarTelefone, linkWhatsapp } from "@/lib/contato";
import { listarContatos } from "@/lib/dados";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contatos" };

const botao =
  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition";

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
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="text-4xl" aria-hidden>📇</p>
          <h2 className="mt-3 text-lg font-semibold">Nenhum contato ainda</h2>
          <p className="mt-1 text-slate-600">Os contatos dos instrutores e da coordenação vão aparecer aqui.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contatos.map((c) => (
            <li key={c.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-marca-100 text-lg font-bold text-marca-700"
                  aria-hidden
                >
                  {c.nome.trim().charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h2 className="font-semibold text-slate-900">{c.nome}</h2>
                  {c.funcao && <p className="text-sm text-slate-500">{c.funcao}</p>}
                </div>
              </div>
              {c.descricao && <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{c.descricao}</p>}

              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {c.email && (
                  <a href={`mailto:${c.email}`} className={`${botao} border-slate-300 text-slate-700 hover:border-marca-500 hover:text-marca-700`}>
                    <span aria-hidden>✉️</span> {c.email}
                  </a>
                )}
                {c.telefone && c.whatsapp && (
                  <a
                    href={linkWhatsapp(c.telefone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${botao} border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-400`}
                  >
                    <span aria-hidden>💬</span> WhatsApp {formatarTelefone(c.telefone)}
                    <span className="sr-only">(abre em nova aba)</span>
                  </a>
                )}
                {c.telefone && !c.whatsapp && (
                  <a href={`tel:+${c.telefone.length <= 11 ? "55" + c.telefone : c.telefone}`} className={`${botao} border-slate-300 text-slate-700 hover:border-marca-500 hover:text-marca-700`}>
                    <span aria-hidden>📞</span> {formatarTelefone(c.telefone)}
                  </a>
                )}
                {c.link && (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${botao} border-slate-300 text-slate-700 hover:border-marca-500 hover:text-marca-700`}
                  >
                    <span aria-hidden>🔗</span> {(() => { try { return new URL(c.link).hostname.replace(/^www\./, ""); } catch { return "Link"; } })()}
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
