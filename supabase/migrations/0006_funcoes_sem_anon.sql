-- =============================================================
-- O Supabase dá EXECUTE para "anon" em funções novas por padrão.
-- As funções da área do aluno só fazem sentido para quem está logado.
-- (Apontado pelo verificador de segurança do Supabase.)
-- =============================================================
revoke execute on function public.meu_aluno_id() from anon;
revoke execute on function public.eh_aluno() from anon;
revoke execute on function public.salvar_ficha(jsonb) from anon;
