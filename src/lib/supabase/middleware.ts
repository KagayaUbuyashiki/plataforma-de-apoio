import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurado } from "./config";

export async function atualizarSessao(request: NextRequest) {
  let response = NextResponse.next({ request });
  const ehAdmin = request.nextUrl.pathname.startsWith("/admin");
  const ehLogin = request.nextUrl.pathname === "/admin/login";

  if (!supabaseConfigurado()) {
    if (ehAdmin && !ehLogin) return NextResponse.redirect(new URL("/admin/login", request.url));
    return response;
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (ehAdmin && !ehLogin && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (ehLogin && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}
