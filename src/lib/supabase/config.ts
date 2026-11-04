/**
 * URL e chave pública do Supabase.
 * Aceita os nomes usados no .env.example e também os que a integração
 * Vercel + Supabase cria sozinha (SUPABASE_URL, ..._PUBLISHABLE_KEY, ..._ANON_KEY).
 * Todo acesso ao Supabase acontece no servidor, então as variáveis sem
 * NEXT_PUBLIC_ também funcionam.
 *
 * Os valores são lidos com nomes literais (process.env.NOME) para o Next
 * conseguir embutir as variáveis NEXT_PUBLIC_ na build.
 */

/** Tira espaços e aspas coladas por engano junto com o valor (ex.: "https://..."). */
function limpar(valor: string | undefined): string {
  return (valor ?? "").trim().replace(/^["']+|["']+$/g, "").trim();
}

type Candidata = { nome: string; valor: string };

const URLS: Candidata[] = [
  { nome: "NEXT_PUBLIC_SUPABASE_URL", valor: limpar(process.env.NEXT_PUBLIC_SUPABASE_URL) },
  { nome: "SUPABASE_URL", valor: limpar(process.env.SUPABASE_URL) },
];

// A chave publicável (sb_publishable_...) vem primeiro: ela continua valendo
// mesmo se as chaves antigas (JWT "anon") forem desativadas no Supabase.
const CHAVES: Candidata[] = [
  { nome: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", valor: limpar(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) },
  { nome: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY", valor: limpar(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) },
  { nome: "SUPABASE_PUBLISHABLE_KEY", valor: limpar(process.env.SUPABASE_PUBLISHABLE_KEY) },
  { nome: "NEXT_PUBLIC_SUPABASE_ANON_KEY", valor: limpar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) },
  { nome: "SUPABASE_ANON_KEY", valor: limpar(process.env.SUPABASE_ANON_KEY) },
];

const urlValida = (v: string) => /^https?:\/\/[^\s"']+$/.test(v);
const chaveValida = (v: string) => /^(sb_publishable_[\w-]+|eyJ[\w-]+\.[\w-]+\.[\w-]+)$/.test(v);

export const SUPABASE_URL = (URLS.find((c) => urlValida(c.valor))?.valor ?? "").replace(/\/+$/, "");
export const SUPABASE_ANON_KEY = CHAVES.find((c) => chaveValida(c.valor))?.valor ?? "";

/** Permite rodar a plataforma (ex.: página dos ODS) mesmo antes de configurar o Supabase. */
export function supabaseConfigurado(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

/**
 * Explica, sem mostrar os valores, o que falta na configuração.
 * Ajuda a descobrir o problema na Vercel (variável ausente, com aspas, no ambiente errado...).
 */
export function diagnosticoSupabase(): string {
  if (supabaseConfigurado()) return "";
  const descrever = (lista: Candidata[], valida: (v: string) => boolean, oQue: string) => {
    const presentes = lista.filter((c) => c.valor);
    if (presentes.length === 0) return `nenhuma variável de ${oQue} encontrada (${lista.map((c) => c.nome).join(", ")})`;
    const ok = presentes.find((c) => valida(c.valor));
    if (ok) return `${oQue}: ok (${ok.nome})`;
    return `${oQue}: ${presentes.map((c) => c.nome).join(", ")} existe, mas o valor não parece válido`;
  };
  return [descrever(URLS, urlValida, "URL"), descrever(CHAVES, chaveValida, "chave pública")].join("; ");
}
