/**
 * URL e chave pública do Supabase.
 * Aceita os nomes usados no .env.example e também os que a integração
 * Vercel + Supabase cria sozinha (SUPABASE_URL, ..._PUBLISHABLE_KEY, ..._ANON_KEY).
 * Todo acesso ao Supabase acontece no servidor, então as variáveis sem
 * NEXT_PUBLIC_ também funcionam.
 */
function primeiro(...valores: (string | undefined)[]): string {
  return valores.map((v) => v?.trim() ?? "").find((v) => v.length > 0) ?? "";
}

export const SUPABASE_URL = primeiro(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_URL);

export const SUPABASE_ANON_KEY = primeiro(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY,
  process.env.SUPABASE_PUBLISHABLE_KEY,
  process.env.SUPABASE_ANON_KEY,
);

/** Permite rodar a plataforma (ex.: página dos ODS) mesmo antes de configurar o Supabase. */
export function supabaseConfigurado(): boolean {
  return SUPABASE_URL.startsWith("http") && SUPABASE_ANON_KEY.length > 0;
}
