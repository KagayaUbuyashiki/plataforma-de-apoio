import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { montarRelatorio } from "@/lib/relatorio";

/** Exporta as avaliações em CSV (separado por ";" para abrir direto no Excel em português). */
export async function GET(request: NextRequest) {
  if (!supabaseConfigurado()) return new NextResponse("Supabase não configurado.", { status: 503 });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/admin/login", request.url));

  const turma = request.nextUrl.searchParams.get("turma") || undefined;
  const r = await montarRelatorio(supabase, turma);
  if (r.erro) return new NextResponse(r.erro, { status: 500 });

  const aula = new Map(r.aulas.map((a) => [a.id, `${a.numero}. ${a.titulo}`]));
  const turmaNome = new Map(r.turmas.map((t) => [t.id, t.nome]));
  const instrutor = new Map(r.instrutores.map((i) => [i.id, i.nome]));

  const cabecalho = ["tipo", "data", "turma", "aula", "instrutor", "geral", "conteudo", "ritmo", "clareza", "dominio", "atencao", "comentario"];
  const linhas: (string | number | null)[][] = [];
  for (const a of r.avaliacoes) {
    const base = [a.created_at, turmaNome.get(a.turma_id) ?? "", aula.get(a.aula_id) ?? ""];
    linhas.push(["aula", ...base, "", a.nota_geral, a.nota_conteudo, a.nota_ritmo, "", "", "", a.comentario]);
    for (const i of a.avaliacoes_instrutor) {
      linhas.push(["instrutor", ...base, instrutor.get(i.instrutor_id) ?? "", "", "", "", i.nota_clareza, i.nota_dominio, i.nota_atencao, i.comentario]);
    }
  }

  const celula = (v: string | number | null) => {
    let s = v == null ? "" : String(v);
    if (/^[=+\-@]/.test(s)) s = `'${s}`; // evita fórmulas maliciosas ao abrir no Excel
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const corpo = [cabecalho, ...linhas].map((l) => l.map(celula).join(";")).join("\r\n");

  return new NextResponse("﻿" + corpo, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="avaliacoes-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
