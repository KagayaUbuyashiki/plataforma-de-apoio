-- =============================================================
-- Contas por usuário (instrutores e alunos), códigos de acesso dos
-- alunos e checklist de progresso.
--
-- Segurança:
-- - Senhas: ficam só no Supabase Auth (auth.users), com hash bcrypt.
-- - Códigos de acesso: o banco guarda apenas o HMAC-SHA256 (com a chave secreta do servidor).
-- - contas_login, tokens_aluno e tentativas_acesso não têm políticas:
--   só o servidor (chave secreta) acessa.
-- - Alunos só leem os próprios dados; instrutores autorizados leem tudo.
-- =============================================================

-- ---------- Tabelas ----------

-- Usuário de login (ex.: "bituca014", "maria.silva") ligado à conta do Auth.
create table if not exists public.contas_login (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  usuario    text not null unique check (usuario ~ '^[a-z0-9][a-z0-9._-]{2,29}$'),
  papel      text not null check (papel in ('instrutor', 'aluno')),
  criado_em  timestamptz not null default now()
);

create table if not exists public.alunos (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid unique references auth.users(id) on delete set null,
  nome           text not null check (length(trim(nome)) between 2 and 80),
  turma_id       uuid references public.turmas(id) on delete set null,
  -- aguardando_token: ainda não fez o primeiro acesso ou teve a conta redefinida.
  situacao       text not null default 'aguardando_token' check (situacao in ('aguardando_token', 'ativo')),
  -- Ficha (dados mínimos; os alunos são menores de idade)
  como_chamar    text check (length(como_chamar) <= 40),
  idade          int  check (idade between 8 and 99),
  escola         text check (length(escola) <= 120),
  serie          text check (length(serie) <= 40),
  cidade         text check (length(cidade) <= 80),
  experiencia    text check (experiencia in ('nunca', 'pouco', 'sim')),
  ja_criou_site  boolean,
  expectativa    text check (length(expectativa) <= 500),
  ods_interesse  int  check (ods_interesse between 1 and 17),
  ficha_em       timestamptz,
  criado_por     uuid references auth.users(id) on delete set null,
  created_at     timestamptz not null default now()
);

create table if not exists public.tokens_aluno (
  id          uuid primary key default gen_random_uuid(),
  aluno_id    uuid not null references public.alunos(id) on delete cascade,
  hash_token  text not null unique check (hash_token ~ '^[0-9a-f]{64}$'),
  expira_em   timestamptz not null,
  usado_em    timestamptz,
  criado_por  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- No máximo um código ainda não usado por aluno.
create unique index if not exists tokens_aluno_um_ativo on public.tokens_aluno (aluno_id) where usado_em is null;

-- Checklist: "aula:<uuid>" ou "etapa:<slug>".
create table if not exists public.progresso_aluno (
  aluno_id      uuid not null references public.alunos(id) on delete cascade,
  item          text not null check (
    item ~ '^aula:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    or item in ('etapa:escolher-ods', 'etapa:html', 'etapa:css', 'etapa:apresentar')
  ),
  concluido_em  timestamptz not null default now(),
  primary key (aluno_id, item)
);

-- Limite de tentativas (login e códigos). A chave é um hash, nunca o IP ou o usuário em texto.
create table if not exists public.tentativas_acesso (
  id         bigint generated always as identity primary key,
  chave      text not null check (chave ~ '^[0-9a-f]{64}$'),
  criado_em  timestamptz not null default now()
);

create index if not exists alunos_turma_idx           on public.alunos (turma_id);
create index if not exists alunos_criado_por_idx      on public.alunos (criado_por);
create index if not exists tokens_aluno_criado_por_idx on public.tokens_aluno (criado_por);
create index if not exists tentativas_acesso_idx      on public.tentativas_acesso (chave, criado_em);

alter table public.contas_login      enable row level security;
alter table public.alunos            enable row level security;
alter table public.tokens_aluno      enable row level security;
alter table public.progresso_aluno   enable row level security;
alter table public.tentativas_acesso enable row level security;

-- Nada de acesso direto pela API para as tabelas sensíveis.
revoke all on public.contas_login, public.tokens_aluno, public.tentativas_acesso from anon, authenticated;

-- alunos: pela API, o instrutor só escolhe nome e turma. user_id e situação
-- (que ligam a ficha a uma conta do Auth) só o servidor altera, com a chave secreta.
-- Sem isso, um instrutor poderia ligar a ficha à conta de outra pessoa e redefinir a senha dela.
revoke all on public.alunos from anon;
revoke insert, update on public.alunos from authenticated;
grant insert (nome, turma_id, criado_por) on public.alunos to authenticated;
grant update (nome, turma_id) on public.alunos to authenticated;
revoke insert, update on public.progresso_aluno from anon;

-- ---------- Funções auxiliares ----------

-- Id do aluno da conta logada (ou null).
create or replace function public.meu_aluno_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select a.id from public.alunos a where a.user_id = auth.uid() and a.situacao = 'ativo';
$$;

create or replace function public.eh_aluno()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.meu_aluno_id() is not null;
$$;

revoke all on function public.meu_aluno_id() from public;
revoke all on function public.eh_aluno() from public;
grant execute on function public.meu_aluno_id() to authenticated;
grant execute on function public.eh_aluno() to authenticated;

-- ---------- Políticas ----------

-- alunos: o aluno lê a própria linha; o instrutor lê e gerencia todas.
-- O aluno NÃO altera a tabela direto (a ficha passa por salvar_ficha()).
create policy "alunos: aluno le a propria ficha" on public.alunos
  for select to authenticated using (user_id = (select auth.uid()) or (select public.eh_instrutor()));
create policy "alunos: instrutores criam" on public.alunos
  for insert to authenticated with check ((select public.eh_instrutor()));
create policy "alunos: instrutores editam" on public.alunos
  for update to authenticated using ((select public.eh_instrutor())) with check ((select public.eh_instrutor()));
create policy "alunos: instrutores apagam" on public.alunos
  for delete to authenticated using ((select public.eh_instrutor()));

-- progresso: o aluno marca e desmarca só os próprios itens; o instrutor só lê.
create policy "progresso: aluno e instrutor leem" on public.progresso_aluno
  for select to authenticated using (aluno_id = (select public.meu_aluno_id()) or (select public.eh_instrutor()));
create policy "progresso: aluno marca" on public.progresso_aluno
  for insert to authenticated with check (
    aluno_id = (select public.meu_aluno_id())
    and (
      item like 'etapa:%'
      or exists (select 1 from public.aulas au where 'aula:' || au.id::text = item and au.publicada)
    )
  );
create policy "progresso: aluno desmarca" on public.progresso_aluno
  for delete to authenticated using (aluno_id = (select public.meu_aluno_id()));

-- ---------- Ficha pelo próprio aluno ----------
-- Só muda as colunas da ficha, nunca situação, user_id, nome ou turma.
create or replace function public.salvar_ficha(p_ficha jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid := public.meu_aluno_id();
begin
  if v_id is null then
    raise exception 'Faça login como aluno.' using errcode = '42501';
  end if;

  update public.alunos set
    como_chamar   = nullif(left(trim(coalesce(p_ficha->>'como_chamar', '')), 40), ''),
    idade         = nullif(p_ficha->>'idade', '')::int,
    escola        = nullif(left(trim(coalesce(p_ficha->>'escola', '')), 120), ''),
    serie         = nullif(left(trim(coalesce(p_ficha->>'serie', '')), 40), ''),
    cidade        = nullif(left(trim(coalesce(p_ficha->>'cidade', '')), 80), ''),
    experiencia   = nullif(p_ficha->>'experiencia', ''),
    ja_criou_site = (p_ficha->>'ja_criou_site')::boolean,
    expectativa   = nullif(left(trim(coalesce(p_ficha->>'expectativa', '')), 500), ''),
    ods_interesse = nullif(p_ficha->>'ods_interesse', '')::int,
    ficha_em      = now()
  where id = v_id;
end;
$$;

revoke all on function public.salvar_ficha(jsonb) from public;
grant execute on function public.salvar_ficha(jsonb) to authenticated;

-- ---------- Limite de tentativas (só o servidor chama) ----------

-- Quantas tentativas a chave teve na janela.
create or replace function public.contar_tentativas(p_chave text, p_janela_segundos int)
returns int
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::int from public.tentativas_acesso
  where chave = p_chave and criado_em > now() - make_interval(secs => p_janela_segundos);
$$;

create or replace function public.registrar_tentativa(p_chave text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.tentativas_acesso where criado_em < now() - interval '1 day';
  insert into public.tentativas_acesso (chave) values (p_chave);
$$;

create or replace function public.limpar_tentativas(p_chave text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.tentativas_acesso where chave = p_chave;
$$;

-- ---------- Uso atômico do código de acesso (só o servidor chama) ----------
-- Marca o código como usado e devolve o aluno. Dois envios ao mesmo tempo:
-- só um consegue (UPDATE ... WHERE usado_em IS NULL).
create or replace function public.consumir_token(p_hash text)
returns table (aluno_id uuid)
language sql
security definer
set search_path = public
as $$
  update public.tokens_aluno t
     set usado_em = now()
   where t.hash_token = p_hash and t.usado_em is null and t.expira_em > now()
  returning t.aluno_id;
$$;

revoke all on function public.contar_tentativas(text, int) from public, anon, authenticated;
revoke all on function public.registrar_tentativa(text) from public, anon, authenticated;
revoke all on function public.limpar_tentativas(text) from public, anon, authenticated;
revoke all on function public.consumir_token(text) from public, anon, authenticated;
grant execute on function public.contar_tentativas(text, int) to service_role;
grant execute on function public.registrar_tentativa(text) to service_role;
grant execute on function public.limpar_tentativas(text) to service_role;
grant execute on function public.consumir_token(text) to service_role;
