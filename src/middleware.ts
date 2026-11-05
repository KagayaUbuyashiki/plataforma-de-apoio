import type { NextRequest } from "next/server";
import { atualizarSessao } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return atualizarSessao(request);
}

export const config = {
  // Só roda nas páginas que dependem de sessão; páginas públicas ficam mais rápidas.
  matcher: ["/admin/:path*", "/minha-area/:path*", "/entrar/:path*", "/api/eu"],
  // Runtime Node (estável no Next 15.5): evita avisos do supabase-js no Edge Runtime.
  runtime: "nodejs",
};
