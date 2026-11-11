-- =============================================================
-- Desafios da área Aprender: o checklist do aluno passa a aceitar
-- "desafio:<slug>" (marcado quando o aluno resolve um desafio).
-- A correção roda no navegador; um aluno poderia marcar sem resolver,
-- o que é aceitável numa atividade de autoaprendizagem.
-- =============================================================

alter table public.progresso_aluno drop constraint if exists progresso_aluno_item_check;
alter table public.progresso_aluno add constraint progresso_aluno_item_check check (
  item ~ '^aula:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  or item in ('etapa:escolher-ods', 'etapa:html', 'etapa:css', 'etapa:apresentar')
  or item ~ '^desafio:[a-z0-9-]{2,40}$'
);

drop policy if exists "progresso: aluno marca" on public.progresso_aluno;
create policy "progresso: aluno marca" on public.progresso_aluno
  for insert to authenticated with check (
    aluno_id = (select public.meu_aluno_id())
    and (
      item like 'etapa:%'
      or item like 'desafio:%'
      or exists (select 1 from public.aulas au where 'aula:' || au.id::text = item and au.publicada)
    )
  );
