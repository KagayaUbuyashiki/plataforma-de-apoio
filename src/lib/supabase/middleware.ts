import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { OPCOES_COOKIE, SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurado } from "./config";

export async function atualizarSessao(request: NextRequest) {
  let response = NextResponse.next({ request });
  const caminho = request.nextUrl.pathname;
  const ehAdmin = caminho.startsWith("/admin");
  const ehLogin = caminho === "/admin/login";
  const ehAreaAluno = caminho.startsWith("/minha-area");

  if (!supabaseConfigurado()) {
    if ((ehAdmin && !ehLogin) || ehAreaAluno) return NextResponse.redirect(new URL("/entrar", request.url));
    return response;
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookieOptions: OPCOES_COOKIE,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, { ...options, ...OPCOES_COOKIE }));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (((ehAdmin && !ehLogin) || ehAreaAluno) && !user) {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }
  // O papel (instrutor ou aluno) é conferido em cada página: exigirInstrutor() e exigirAluno().

  return response;
}
