import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { exigirInstrutor } from "@/lib/auth";
import type { Contato } from "@/lib/tipos";
import { FormContato } from "../FormContato";

export const metadata: Metadata = { title: "Editar contato", robots: { index: false } };

export default async function EditarContato({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await exigirInstrutor();
  const { data } = await supabase.from("contatos").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <>
      <h1 className="text-3xl font-bold">Editar contato</h1>
      <FormContato contato={data as Contato} />
    </>
  );
}
