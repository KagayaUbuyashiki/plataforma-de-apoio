import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { exigirInstrutor } from "@/lib/auth";
import type { Site } from "@/lib/tipos";
import { FormSite } from "../FormSite";

export const metadata: Metadata = { title: "Editar site", robots: { index: false } };

export default async function EditarSite({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await exigirInstrutor();
  const [{ data: site }, { data: todos }] = await Promise.all([
    supabase.from("sites").select("*").eq("id", id).maybeSingle(),
    supabase.from("sites").select("categoria"),
  ]);
  if (!site) notFound();
  const categorias = [...new Set((todos ?? []).map((s) => s.categoria).filter(Boolean))] as string[];

  return (
    <>
      <h1 className="text-3xl font-bold">Editar site</h1>
      <FormSite site={site as Site} categorias={categorias} />
    </>
  );
}
