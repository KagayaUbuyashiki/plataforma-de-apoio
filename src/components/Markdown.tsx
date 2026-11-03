import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renderiza textos das aulas escritos em Markdown (HTML bruto é ignorado por segurança). */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-a:text-marca-700 prose-pre:bg-slate-900 prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
