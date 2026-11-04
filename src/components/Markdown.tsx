import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renderiza textos das aulas escritos em Markdown (HTML bruto é ignorado por segurança). */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-slate max-w-none text-tinta prose-headings:scroll-mt-28 prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-tinta prose-a:font-semibold prose-a:text-marca-600 prose-strong:text-tinta prose-code:rounded-md prose-code:bg-marca-50 prose-code:px-1 prose-code:py-0.5 prose-code:font-semibold prose-code:text-marca-700 prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-2xl prose-pre:bg-[#0c1b2a] prose-pre:shadow-lg [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:font-normal [&_pre_code]:text-slate-100 prose-img:rounded-2xl prose-th:text-tinta">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
