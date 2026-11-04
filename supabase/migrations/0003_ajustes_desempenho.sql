-- =============================================================
-- Ajustes de desempenho apontados pelo verificador do Supabase.
-- 1) Índices nas chaves estrangeiras que não tinham.
-- 2) As políticas "gerenciam" eram FOR ALL e repetiam o SELECT que já é
--    público; agora cobrem só INSERT/UPDATE/DELETE (uma política por ação).
-- =============================================================

create index if not exists aula_instrutores_instrutor_idx on public.aula_instrutores (instrutor_id);
create index if not exists avaliacoes_instrutor_avaliacao_idx on public.avaliacoes_instrutor (avaliacao_id);

do $$
declare
  t text;
begin
  -- Tabelas que já têm leitura pública: a escrita fica só para instrutor autorizado.
  foreach t in array array['sites', 'instrutores', 'aulas', 'aula_instrutores'] loop
    execute format('drop policy if exists %I on public.%I', t || ': instrutores gerenciam', t);
    execute format('drop policy if exists %I on public.%I', t || ': instrutores criam', t);
    execute format('drop policy if exists %I on public.%I', t || ': instrutores editam', t);
    execute format('drop policy if exists %I on public.%I', t || ': instrutores apagam', t);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select public.eh_instrutor()))', t || ': instrutores criam', t);
    execute format('create policy %I on public.%I for update to authenticated using ((select public.eh_instrutor())) with check ((select public.eh_instrutor()))', t || ': instrutores editam', t);
    execute format('create policy %I on public.%I for delete to authenticated using ((select public.eh_instrutor()))', t || ': instrutores apagam', t);
  end loop;
end $$;
