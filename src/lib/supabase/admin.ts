import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SECRET_KEY, SUPABASE_URL } from "./config";

/**
 * Cliente com a chave SECRETA: ignora as regras de acesso (RLS).
 * Use só no servidor, depois de conferir quem está pedindo (exigirInstrutor, código válido...).
 */
export function createAdminClient() {
  if (!SUPABASE_SECRET_KEY) throw new Error("Chave secreta do Supabase não configurada (SUPABASE_SECRET_KEY ou SUPABASE_SERVICE_ROLE_KEY).");
  return createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
