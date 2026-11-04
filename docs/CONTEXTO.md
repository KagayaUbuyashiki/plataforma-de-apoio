# Contexto do projeto — Plataforma de Apoio · Meu Primeiro Site

Resumo do estado atual, para retomar o trabalho em uma nova conversa.
Última atualização: 04/11/2026.

## O que é

Plataforma de apoio para alunos e voluntários do programa **Meu Primeiro Site**, da Junior Achievement Brasil com o Instituto Energisa, no **Rio Pomba Valley** (Zona da Mata, MG).
- Cerca de 22h30 de aulas.
- Cada aluno cria um site em HTML/CSS sobre um dos **17 ODS** da ONU.
- Responsável e autor dos commits: **Matheus Sá De Araujo Miranda**.

## Regras de trabalho (pedidas pelo responsável)

- Tudo em **português (pt-BR)**: textos, commits e comentários.
- Commits com autor `Matheus Sá De Araujo Miranda <150400827+KagayaUbuyashiki@users.noreply.github.com>`, **sem** linhas de coautoria e **sem mencionar ferramentas de IA** no código, nos commits ou nos arquivos. Os alunos veem o repositório.
- Commit e push **direto na `main`**. **Não abrir PR.**
- Nunca commitar chaves ou senhas. O `.env.local` está no `.gitignore`.

## Stack

- Next.js 15.5 (App Router e Server Actions), React 19, TypeScript e Tailwind 4.
- Supabase: Postgres + Auth + Storage.
- Deploy na Vercel: **https://plataforma-de-apoio.vercel.app**.
- Editor: Monaco 0.55.1 (o do VS Code), `@monaco-editor/react`, `emmet-monaco-es` e `jszip`.

## Funcionalidades prontas

| Rota | O que faz |
|---|---|
| `/` | Início: o programa, as etapas e os 17 ODS |
| `/aulas`, `/aulas/[slug]` | Resumos das aulas em Markdown, materiais e instrutores |
| `/sites` | Cards clicáveis de sites de referência (imagem, descrição, link), com filtros |
| `/ods`, `/ods/[n]` | Os 17 ODS: explicação, ideias, perguntas e paleta CSS |
| `/editor`, `/editor/[nivel]` | Editor estilo VS Code em 3 níveis: **iniciante** (blocos com explicação), **intermediário** (autocompletar em português), **livre** (cria arquivos, Emmet `!`). Prévia ao vivo, salva no navegador, baixa e importa .zip |
| `/contatos` | Contatos da equipe (e-mail, WhatsApp, telefone, link), cadastrados pelos instrutores |
| `/avaliar` | Avaliação **anônima** da aula e de cada instrutor, liberada pelo código da turma |
| `/admin/*` | Painel (só instrutores **autorizados**): sites (upload de imagem), aulas, turmas, instrutores, contatos, avaliações com médias e CSV |

## Estrutura

- `src/app/(site)/`: páginas com cabeçalho e rodapé (inclui `admin/`).
- `src/app/editor/[nivel]/`: editor em tela cheia.
- `src/components/`: componentes visuais. O editor fica em `src/components/editor/` (Workbench, Explorador, Previa, PainelBlocos…).
- `src/lib/`:
  - `supabase/config.ts`: lê as variáveis de ambiente; aceita vários nomes, tira aspas e tem `diagnosticoSupabase()`;
  - `auth.ts`: `exigirInstrutor()` e `ehInstrutorAutorizado()`;
  - `dados.ts`: leituras;
  - `editor/`: glossário, blocos, missões, prévia e zip.
- `src/data/ods.ts`: conteúdo dos 17 ODS.
- `supabase/migrations/0001…0004`, `supabase/seed.sql`.
- `scripts/copiar-monaco.mjs`: copia o Monaco para `public/monaco/` (fora do Git) e gera a tradução pt-BR dos menus. Roda no `postinstall`, `predev` e `prebuild`.

## Supabase

- Projeto **plataforma-de-apoio**, id `plnsjkupknhetnhfmkqj`, região us-east-1, criado pela integração da Vercel.
- URL `https://plnsjkupknhetnhfmkqj.supabase.co`.
- O site usa a chave **publicável** (`sb_publishable_…`, pública por natureza).
- Já aplicado no projeto, nesta ordem:
  1. `0001_init`;
  2. seed (Aula 1, turma `TESTE-2026`, "Instrutor(a) exemplo");
  3. `0002_instrutores_autorizados`;
  4. `0003_ajustes_desempenho`;
  5. `0004_contatos`.
- Segurança:
  - RLS em todas as tabelas;
  - a escrita exige `public.eh_instrutor()`, ou seja, estar em `instrutores_autorizados`;
  - os alunos avaliam pelas funções `verificar_turma` e `enviar_avaliacao`;
  - o bucket público `previews` só aceita imagens, e só instrutor autorizado envia.
- Autorizar um instrutor (no SQL Editor):
  ```sql
  insert into public.instrutores_autorizados (user_id, email)
  select id, email from auth.users where email = 'email@exemplo.com';
  ```
- O verificador do Supabase (advisors) só aponta avisos intencionais: funções públicas da avaliação e a tabela de autorizados sem políticas.

## Vercel

- As variáveis estão configuradas e o site **já conecta ao banco** (confirmado pela página `/contatos`).

## Testes feitos (todos passaram)

- API real do Supabase: 33 verificações de segurança, mais as de contatos.
- Interface contra o banco real:
  - login de conta não autorizada barrado;
  - painel: turma, instrutor, aula e upload de imagem;
  - contatos de ponta a ponta.
- Editor: 44 verificações nos 3 níveis, em dev e em produção.
- Lint, tipos e build de produção sem erros.
- Observação do ambiente de testes na nuvem: o Node precisa de `NODE_USE_ENV_PROXY=1` para acessar o Supabase pelo proxy.

## Pendências

1. **Apagar os dados de teste do banco** (o Supabase pede confirmação ao apagar):
   - o site "MDN Web Docs";
   - a turma `CATA-2026`;
   - o instrutor "Maria Teste";
   - as contas `instrutor.teste@example.com` (autorizada) e `nao.autorizado@example.com`. A senha da conta de teste foi gerada só para os testes; se precisar dela, redefina por SQL ou apague a conta.
2. O responsável criar a **própria conta** em Authentication → Users (com Auto Confirm) e informar o e-mail para autorização.
3. No Supabase, **desligar o cadastro público** (Authentication → Sign In / Providers → Email → "Allow new users to sign up").
4. **Trocar as chaves secretas que foram expostas numa conversa:**
   - a senha do banco (Database → Reset password; depois atualizar as variáveis `POSTGRES_*` na Vercel);
   - a secret key (`sb_secret_…`): criar uma nova e apagar a antiga;
   - desativar as chaves legacy (`service_role`, JWT secret). O site usa a chave publicável, então não é afetado. Depois, remover `NEXT_PUBLIC_SUPABASE_ANON_KEY` (legacy) da Vercel.
5. Apagar no GitHub a branch antiga (a única além da `main`, em GitHub → Branches), que tem um commit antigo com outro autor. O ambiente de trabalho não tem permissão para apagar branches.

## Ideias para depois

Mural dos projetos dos alunos, checklist do projeto, "cola" de HTML/CSS, critérios da banca e cronograma, área do voluntário, dúvidas anônimas, QR Code de avaliação, quiz por aula.
