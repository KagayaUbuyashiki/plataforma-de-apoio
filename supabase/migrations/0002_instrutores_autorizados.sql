-- =============================================================
-- Reforço de segurança: só contas AUTORIZADAS são instrutores.
-- Antes, qualquer conta logada no Supabase Auth tinha acesso ao painel.
-- Agora é preciso estar na tabela instrutores_autorizados.
--
-- Para autorizar um instrutor (depois de criá-lo em Authentication → Users):
--   insert into public.instrutores_autorizados (user_id, email)
--   select id, email from auth.users where email = 'email@exemplo.com';
-- =============================================================

create table if not exists public.instrutores_autorizados (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  criado_em  timestamptz not null default now()
);

-- RLS ligada e nenhuma política: ninguém lê ou altera esta tabela pela API.
-- (Gerencie pelo SQL Editor do Supabase.)
alter table public.instrutores_autorizados enable row level security;

-- Diz se quem está chamando é um instrutor autorizado.
create or replace function public.eh_instrutor()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.instrutores_autorizados where user_id = auth.uid());
$$;

revoke all on function public.eh_instrutor() from public;
grant execute on function public.eh_instrutor() to anon, authenticated;

-- ---------- Troca das políticas "qualquer logado" por "instrutor autorizado" ----------
-- (select ...) faz o Postgres calcular a função uma vez por consulta, não por linha.

drop policy if exists "aulas: leitura das publicadas" on public.aulas;
create policy "aulas: leitura das publicadas" on public.aulas
  for select using (publicada or (select public.eh_instrutor()));

drop policy if exists "sites: instrutores gerenciam" on public.sites;
create policy "sites: instrutores gerenciam" on public.sites
  for all to authenticated using ((select public.eh_instrutor())) with check ((select public.eh_instrutor()));

drop policy if exists "instrutores: instrutores gerenciam" on public.instrutores;
create policy "instrutores: instrutores gerenciam" on public.instrutores
  for all to authenticated using ((select public.eh_instrutor())) with check ((select public.eh_instrutor()));

drop policy if exists "aulas: instrutores gerenciam" on public.aulas;
create policy "aulas: instrutores gerenciam" on public.aulas
  for all to authenticated using ((select public.eh_instrutor())) with check ((select public.eh_instrutor()));

drop policy if exists "aula_instrutores: instrutores gerenciam" on public.aula_instrutores;
create policy "aula_instrutores: instrutores gerenciam" on public.aula_instrutores
  for all to authenticated using ((select public.eh_instrutor())) with check ((select public.eh_instrutor()));

drop policy if exists "turmas: instrutores gerenciam" on public.turmas;
create policy "turmas: instrutores gerenciam" on public.turmas
  for all to authenticated using ((select public.eh_instrutor())) with check ((select public.eh_instrutor()));

drop policy if exists "avaliacoes_aula: instrutores leem" on public.avaliacoes_aula;
create policy "avaliacoes_aula: instrutores leem" on public.avaliacoes_aula
  for select to authenticated using ((select public.eh_instrutor()));

drop policy if exists "avaliacoes_aula: instrutores apagam" on public.avaliacoes_aula;
create policy "avaliacoes_aula: instrutores apagam" on public.avaliacoes_aula
  for delete to authenticated using ((select public.eh_instrutor()));

drop policy if exists "avaliacoes_instrutor: instrutores leem" on public.avaliacoes_instrutor;
create policy "avaliacoes_instrutor: instrutores leem" on public.avaliacoes_instrutor
  for select to authenticated using ((select public.eh_instrutor()));

-- Storage (imagens de preview)
drop policy if exists "previews: instrutores enviam" on storage.objects;
create policy "previews: instrutores enviam" on storage.objects
  for insert to authenticated with check (bucket_id = 'previews' and (select public.eh_instrutor()));

drop policy if exists "previews: instrutores atualizam" on storage.objects;
create policy "previews: instrutores atualizam" on storage.objects
  for update to authenticated using (bucket_id = 'previews' and (select public.eh_instrutor()));

drop policy if exists "previews: instrutores apagam" on storage.objects;
create policy "previews: instrutores apagam" on storage.objects
  for delete to authenticated using (bucket_id = 'previews' and (select public.eh_instrutor()));
