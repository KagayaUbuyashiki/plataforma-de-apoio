-- =============================================================
-- Contatos: página pública /contatos, gerenciada pelos instrutores.
-- ATENÇÃO: tudo o que for cadastrado aqui fica visível para qualquer
-- pessoa que acessar o site.
-- =============================================================

create table if not exists public.contatos (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null check (length(trim(nome)) between 1 and 120),
  funcao      text check (length(funcao) <= 80),
  email       text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefone    text check (telefone is null or telefone ~ '^[0-9]{10,13}$'),
  whatsapp    boolean not null default false,
  link        text check (link is null or link ~* '^https?://'),
  descricao   text check (length(descricao) <= 500),
  ordem       int not null default 0,
  created_at  timestamptz not null default now(),
  constraint contatos_tem_forma_de_contato check (email is not null or telefone is not null or link is not null)
);

alter table public.contatos enable row level security;

drop policy if exists "contatos: leitura publica" on public.contatos;
create policy "contatos: leitura publica" on public.contatos for select using (true);

drop policy if exists "contatos: instrutores criam" on public.contatos;
create policy "contatos: instrutores criam" on public.contatos
  for insert to authenticated with check ((select public.eh_instrutor()));

drop policy if exists "contatos: instrutores editam" on public.contatos;
create policy "contatos: instrutores editam" on public.contatos
  for update to authenticated using ((select public.eh_instrutor())) with check ((select public.eh_instrutor()));

drop policy if exists "contatos: instrutores apagam" on public.contatos;
create policy "contatos: instrutores apagam" on public.contatos
  for delete to authenticated using ((select public.eh_instrutor()));
