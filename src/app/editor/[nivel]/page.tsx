import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkbenchCliente } from "@/components/editor/WorkbenchCliente";
import { getNivel, NIVEIS } from "@/lib/editor/niveis";

type Props = { params: Promise<{ nivel: string }> };

export function generateStaticParams() {
  return NIVEIS.map((n) => ({ nivel: n.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = getNivel((await params).nivel);
  return { title: n ? `Editor · ${n.nome}` : "Editor" };
}

export default async function PaginaEditor({ params }: Props) {
  const nivel = getNivel((await params).nivel);
  if (!nivel) notFound();
  // O editor imita o VS Code: mantém a fonte do sistema em vez da fonte do restante da plataforma.
  return (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <WorkbenchCliente nivel={nivel.id} />
    </div>
  );
}
