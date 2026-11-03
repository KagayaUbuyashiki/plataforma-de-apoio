-- =============================================================
-- Plataforma de Apoio — Meu Primeiro Site
-- Migração inicial: tabelas, segurança (RLS), funções e Storage.
-- Rode este arquivo inteiro no Supabase: SQL Editor > New query.
-- =============================================================

-- ---------- Tabelas ----------

create table if not exists public.turmas (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  escola      text,
  cidade      text,
  codigo      text not null unique check (codigo = upper(codigo) and length(codigo) between 3 and 40),
  ativa       boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.instrutores (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  foto_url    text,
  bio         text,
  created_at  timestamptz not null default now()
);

create table if not exists public.aulas (
  id           uuid primary key default gen_random_uuid(),
  numero       int  not null,
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  titulo       text not null,
  data         date,
  resumo_md    text not null default '',
  conteudo_md  text not null default '',
  materiais    jsonb not null default '[]'::jsonb,  -- [{ "titulo": "...", "url": "https://..." }]
  publicada    boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists public.aula_instrutores (
  aula_id       uuid not null references public.aulas(id) on delete cascade,
  instrutor_id  uuid not null references public.instrutores(id) on delete cascade,
  primary key (aula_id, instrutor_id)
);

create table if not exists public.sites (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  descricao   text not null default '',
  url         text not null check (url ~* '^https?://'),
  imagem_url  text,
  categoria   text,
  ods_numero  int check (ods_numero between 1 and 17),
  ordem       int not null default 0,
  created_at  timestamptz not null default now()
);

-- Avaliações são ANÔNIMAS: nenhuma coluna identifica o aluno.
create table if not exists public.avaliacoes_aula (
  id             uuid primary key default gen_random_uuid(),
  aula_id        uuid not null references public.aulas(id) on delete cascade,
  turma_id       uuid not null references public.turmas(id) on delete cascade,
  nota_geral     int not null check (nota_geral between 1 and 5),
  nota_conteudo  int not null check (nota_conteudo between 1 and 5),
  nota_ritmo     int not null check (nota_ritmo between 1 and 5),
  comentario     text check (length(comentario) <= 1000),
  created_at     timestamptz not null default now()
);

create table if not exists public.avaliacoes_instrutor (
  id             uuid primary key default gen_random_uuid(),
  avaliacao_id   uuid not null references public.avaliacoes_aula(id) on delete cascade,
  instrutor_id   uuid not null references public.instrutores(id) on delete cascade,
  nota_clareza   int not null check (nota_clareza between 1 and 5),
  nota_dominio   int not null check (nota_dominio between 1 and 5),
  nota_atencao   int not null check (nota_atencao between 1 and 5),
  comentario     text check (length(comentario) <= 1000)
);

create index if not exists avaliacoes_aula_aula_idx  on public.avaliacoes_aula (aula_id);
create index if not exists avaliacoes_aula_turma_idx on public.avaliacoes_aula (turma_id);
create index if not exists avaliacoes_instrutor_idx  on public.avaliacoes_instrutor (instrutor_id);

-- ---------- Segurança (Row Level Security) ----------
-- "authenticated" = instrutores logados. Desative o cadastro público
-- (Authentication > Providers > Email > "Allow new users to sign up" = off)
-- e crie as contas dos instrutores manualmente.

alter table public.turmas               enable row level security;
alter table public.instrutores          enable row level security;
alter table public.aulas                enable row level security;
alter table public.aula_instrutores     enable row level security;
alter table public.sites                enable row level security;
alter table public.avaliacoes_aula      enable row level security;
alter table public.avaliacoes_instrutor enable row level security;

-- Leitura pública
create policy "sites: leitura publica"            on public.sites            for select using (true);
create policy "instrutores: leitura publica"      on public.instrutores      for select using (true);
create policy "aula_instrutores: leitura publica" on public.aula_instrutores for select using (true);
create policy "aulas: leitura das publicadas"     on public.aulas            for select using (publicada or auth.role() = 'authenticated');

-- Escrita somente para instrutores logados
create policy "sites: instrutores gerenciam"            on public.sites            for all to authenticated using (true) with check (true);
create policy "instrutores: instrutores gerenciam"      on public.instrutores      for all to authenticated using (true) with check (true);
create policy "aulas: instrutores gerenciam"            on public.aulas            for all to authenticated using (true) with check (true);
create policy "aula_instrutores: instrutores gerenciam" on public.aula_instrutores for all to authenticated using (true) with check (true);
create policy "turmas: instrutores gerenciam"           on public.turmas           for all to authenticated using (true) with check (true);

-- Avaliações: instrutores só leem e apagam. Ninguém insere direto —
-- o envio passa pela função enviar_avaliacao() abaixo.
create policy "avaliacoes_aula: instrutores leem"       on public.avaliacoes_aula      for select to authenticated using (true);
create policy "avaliacoes_aula: instrutores apagam"     on public.avaliacoes_aula      for delete to authenticated using (true);
create policy "avaliacoes_instrutor: instrutores leem"  on public.avaliacoes_instrutor for select to authenticated using (true);

-- ---------- Funções públicas (usadas pelos alunos) ----------

-- Confere o código da turma sem expor a tabela de turmas.
create or replace function public.verificar_turma(p_codigo text)
returns table (id uuid, nome text)
language sql
security definer
set search_path = public
stable
as $$
  select t.id, t.nome
  from public.turmas t
  where t.codigo = upper(trim(p_codigo)) and t.ativa
  limit 1;
$$;

-- Grava uma avaliação anônima de aula + instrutores.
-- p_avaliacao = {
--   "nota_geral": 5, "nota_conteudo": 4, "nota_ritmo": 3, "comentario": "...",
--   "instrutores": [
--     { "instrutor_id": "uuid", "nota_clareza": 5, "nota_dominio": 5, "nota_atencao": 4, "comentario": "..." }
--   ]
-- }
create or replace function public.enviar_avaliacao(p_codigo text, p_aula_id uuid, p_avaliacao jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_turma_id     uuid;
  v_avaliacao_id uuid;
  v_inst         jsonb;
  v_inst_id      uuid;
begin
  select t.id into v_turma_id
  from public.turmas t
  where t.codigo = upper(trim(p_codigo)) and t.ativa;

  if v_turma_id is null then
    raise exception 'Código da turma inválido ou turma inativa.' using errcode = 'P0001';
  end if;

  if not exists (select 1 from public.aulas a where a.id = p_aula_id and a.publicada) then
    raise exception 'Aula não encontrada.' using errcode = 'P0001';
  end if;

  insert into public.avaliacoes_aula (aula_id, turma_id, nota_geral, nota_conteudo, nota_ritmo, comentario)
  values (
    p_aula_id,
    v_turma_id,
    (p_avaliacao->>'nota_geral')::int,
    (p_avaliacao->>'nota_conteudo')::int,
    (p_avaliacao->>'nota_ritmo')::int,
    nullif(left(trim(coalesce(p_avaliacao->>'comentario', '')), 1000), '')
  )
  returning id into v_avaliacao_id;

  for v_inst in select * from jsonb_array_elements(coalesce(p_avaliacao->'instrutores', '[]'::jsonb))
  loop
    v_inst_id := (v_inst->>'instrutor_id')::uuid;

    -- Só aceita instrutores que realmente deram essa aula
    if not exists (
      select 1 from public.aula_instrutores ai
      where ai.aula_id = p_aula_id and ai.instrutor_id = v_inst_id
    ) then
      raise exception 'Instrutor não pertence a esta aula.' using errcode = 'P0001';
    end if;

    insert into public.avaliacoes_instrutor (avaliacao_id, instrutor_id, nota_clareza, nota_dominio, nota_atencao, comentario)
    values (
      v_avaliacao_id,
      v_inst_id,
      (v_inst->>'nota_clareza')::int,
      (v_inst->>'nota_dominio')::int,
      (v_inst->>'nota_atencao')::int,
      nullif(left(trim(coalesce(v_inst->>'comentario', '')), 1000), '')
    );
  end loop;

  return v_avaliacao_id;
end;
$$;

revoke all on function public.verificar_turma(text) from public;
revoke all on function public.enviar_avaliacao(text, uuid, jsonb) from public;
grant execute on function public.verificar_turma(text) to anon, authenticated;
grant execute on function public.enviar_avaliacao(text, uuid, jsonb) to anon, authenticated;

-- ---------- Storage: imagens de preview dos sites ----------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('previews', 'previews', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "previews: leitura publica"
  on storage.objects for select using (bucket_id = 'previews');
create policy "previews: instrutores enviam"
  on storage.objects for insert to authenticated with check (bucket_id = 'previews');
create policy "previews: instrutores atualizam"
  on storage.objects for update to authenticated using (bucket_id = 'previews');
create policy "previews: instrutores apagam"
  on storage.objects for delete to authenticated using (bucket_id = 'previews');
