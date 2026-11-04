# Plataforma de Apoio · Meu Primeiro Site

Plataforma central para **alunos e voluntários** do programa **Meu Primeiro Site** no **Rio Pomba Valley**, na Zona da Mata mineira.

> **Sobre o programa:** o Meu Primeiro Site é uma iniciativa da Junior Achievement Brasil com o Instituto Energisa e faz parte do Rio Pomba Valley, polo de tecnologia e inovação da região. São cerca de 22h30 de atividades, com apoio de voluntários. Cada jovem cria **individualmente** um site em **HTML e CSS** sobre um dos **17 Objetivos de Desenvolvimento Sustentável (ODS)** da ONU. Os sites são apresentados a uma banca de voluntários.

## O que a plataforma oferece

| Página | Para quem | O que faz |
|---|---|---|
| `/` | todos | Boas-vindas, explicação do programa, as etapas do projeto e atalhos |
| `/aulas` e `/aulas/[slug]` | todos | Resumo de cada aula, com códigos de exemplo, materiais e instrutores |
| `/sites` | todos | Galeria de **cards clicáveis** (imagem de preview, descrição e link), com filtro por categoria e por ODS |
| `/ods` e `/ods/[n]` | todos | Os 17 ODS: explicação, por que importa, ganchos locais, perguntas de pesquisa, ideias de páginas e **paleta de cores em CSS** pronta para copiar |
| `/editor` | alunos | **Editor de código estilo VS Code** com prévia ao vivo, em 3 níveis (veja abaixo). Projetos salvos no navegador, com download e upload em `.zip` |
| `/contatos` | todos | Contatos da equipe (e-mail, WhatsApp, telefone, link e observação), cadastrados pelos instrutores em `/admin/contatos` |
| `/avaliar` | alunos | Avaliação **anônima** da aula e de cada instrutor (estrelas de 1 a 5 e comentário), liberada pelo **código da turma** |
| `/admin` | instrutores | Login; cadastro de sites (com upload de imagem), aulas (Markdown com pré-visualização), turmas, códigos, instrutores e contatos; relatório de avaliações com exportação CSV |

## Editor de código (`/editor`)

O editor é o **Monaco**, o mesmo do VS Code, com tema escuro, abas, explorador de arquivos, barra de status e pré-visualização do site ao vivo.

| | 🧩 Iniciante | ⌨️ Intermediário | 🚀 Livre |
|---|---|---|---|
| Arquivos | `index.html` e `style.css` já criados e comentados linha a linha | Estrutura básica pronta | O aluno cria, nomeia e organiza arquivos e pastas, e envia imagens |
| Como escreve | **Blocos**: clicar em "Lista", "Link", "Cor de fundo"… insere o código real, comentado, e explica cada parte | Digitando, com **autocompletar em português** (digite `h` e aparecem `<h1>`…`<h6>` com explicação) | Digitando, com o autocompletar padrão e os atalhos **Emmet** (`!` + Tab, `ul>li*3` + Tab) |
| Explicação ao passar o mouse | ✓ | ✓ | — |
| Missões com verificação automática | ✓ | ✓ | — |

- **Prévia:**
  - atualiza enquanto o aluno digita;
  - junta HTML, CSS (inclusive em pastas, como `css/style.css`) e imagens;
  - permite navegar entre páginas pelos links;
  - avisa quando um link aponta para um arquivo que não existe.
- **Salvamento:**
  - automático, no navegador (vários projetos por computador, cada um com nome);
  - **Baixar .zip** gera os arquivos de verdade;
  - **Abrir .zip** (na tela `/editor`) traz um projeto de volta.
- **Sem depender de CDN:**
  - o Monaco é copiado para `public/monaco/` pelo script `scripts/copiar-monaco.mjs`, que roda sozinho no `npm install`, no `npm run dev` e no `npm run build`;
  - a pasta fica fora do Git;
  - o mesmo script gera a tradução em português dos menus do editor.
- O conteúdo didático fica em `src/lib/editor/`:
  - `glossario.ts`: tags e propriedades explicadas;
  - `blocos.ts`: blocos do Iniciante;
  - `missoes.ts`: desafios;
  - `niveis.ts`: arquivos iniciais de cada nível.

  Edite esses arquivos para adaptar o conteúdo às suas aulas.

## Tecnologias

- **Next.js 15** (App Router e Server Actions), **TypeScript** e **Tailwind CSS 4**
- **Supabase**: Postgres, Auth (login dos instrutores) e Storage (imagens de preview)
- Hospedagem sugerida: **Vercel** (gratuita)

## Configuração (uma vez só)

### 1. Criar o projeto no Supabase

1. Crie uma conta em <https://supabase.com> e um projeto novo. O plano gratuito é suficiente.
2. Abra **SQL Editor → New query**, cole o conteúdo de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) e clique em **Run**.
3. Faça o mesmo, nesta ordem, com:
   - [`supabase/seed.sql`](supabase/seed.sql) (opcional): cria uma aula de exemplo e a turma de teste `TESTE-2026`;
   - [`supabase/migrations/0002_instrutores_autorizados.sql`](supabase/migrations/0002_instrutores_autorizados.sql): faz só os instrutores **autorizados** entrarem no painel.
   - [`supabase/migrations/0003_ajustes_desempenho.sql`](supabase/migrations/0003_ajustes_desempenho.sql): índices e ajustes de desempenho;
   - [`supabase/migrations/0004_contatos.sql`](supabase/migrations/0004_contatos.sql): tabela da página de Contatos.
4. **Bloqueie novos cadastros:** vá em **Authentication → Sign In / Providers → Email** e desative **"Allow new users to sign up"**.
5. **Crie a conta de cada instrutor** em **Authentication → Users → Add user → Create new user**, informando e-mail e senha e marcando **Auto Confirm User**.
6. **Autorize a conta** no **SQL Editor**, trocando o e-mail:

   ```sql
   insert into public.instrutores_autorizados (user_id, email)
   select id, email from auth.users where email = 'email.do.instrutor@exemplo.com';
   ```

   Para tirar o acesso de alguém: `delete from public.instrutores_autorizados where email = '...';`

> Segurança: entrar no painel exige estar na lista `instrutores_autorizados`. Mesmo que alguém crie uma conta, ela não vê turmas nem avaliações e não altera nada até ser autorizada. Mesmo assim, deixe o cadastro público desligado.

### 2. Rodar no seu computador

```bash
npm install
cp .env.example .env.local   # preencha com Project Settings → API (URL e chave anon/public)
npm run dev                  # abre em http://localhost:3000
```

### 3. Publicar na internet (Vercel)

1. Em <https://vercel.com>, importe este repositório do GitHub.
2. Ligue o banco ao projeto da Vercel de uma destas formas:
   - **Pela integração:** na aba **Storage** do projeto, conecte o banco do Supabase. A Vercel cria as variáveis sozinha (`SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`…), e a plataforma reconhece esses nomes.
   - **Na mão:** em **Settings → Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Os valores ficam no Supabase, em **Project Settings → API Keys**; a chave publicável `sb_publishable_…` também serve.
3. **Depois de criar ou mudar variáveis, faça um novo deploy:** **Deployments → ⋯ → Redeploy**. As variáveis só entram na próxima build. Sem isso, o site continua mostrando "O banco de dados ainda não foi configurado".
4. Cada `git push` na branch principal publica uma nova versão.

## Como usar em sala

1. **Antes do programa:** em `/admin/turmas`, crie a turma com um código fácil (ex.: `CATA-2026`) e cadastre os instrutores.
2. **Depois de cada aula:** em `/admin/aulas`, escreva o resumo, marque os instrutores e clique em **Publicar**.
3. **No fim da aula:** projete o endereço `/avaliar` e o código da turma. Os alunos avaliam em cerca de 1 minuto, pelo celular ou pelo computador.
4. **Sites de referência:** em `/admin/sites`, adicione a imagem (um print do site), a descrição e o link. O card aparece em `/sites`.
5. **Resultados:** em `/admin/avaliacoes`, veja médias por aula e por instrutor, leia os comentários e exporte em CSV (abre direto no Excel).

### Como funciona o anonimato

- As avaliações **não guardam nome, e-mail nem IP**: só a turma, a aula, as notas e o comentário.
- O envio passa pela função `enviar_avaliacao`, no banco. Ela valida o código da turma, a aula e os instrutores, e grava tudo de uma vez.
- Para evitar envios repetidos, um cookie marca a aula como "já avaliada" naquele navegador. Isso gera só um **aviso, sem bloquear**, porque em laboratórios de informática vários alunos usam o mesmo computador.

## Estrutura do código

```
src/app/(site)/       páginas com cabeçalho e rodapé (cada pasta é uma rota)
  avaliar/            formulário de avaliação + Server Actions
  editor/             escolha do nível e projetos salvos
  admin/login/        login dos instrutores
  admin/(painel)/     área protegida: sites, aulas, turmas, avaliações
src/app/editor/[nivel]/  o editor em tela cheia
src/components/       componentes visuais (SiteCard, OdsCard, StarRating…)
src/components/editor/   interface estilo VS Code (explorador, abas, prévia, blocos…)
src/data/ods.ts       conteúdo dos 17 ODS (edite aqui para mudar os textos)
src/lib/              acesso ao Supabase, tipos e utilidades
src/lib/editor/       conteúdo e lógica do editor (glossário, blocos, missões, prévia, .zip)
scripts/              cópia do Monaco para public/ e tradução dos menus
supabase/             SQL do banco (tabelas, segurança, funções) e dados de exemplo
```

## Comandos

```bash
npm run dev        # desenvolvimento
npm run build      # build de produção
npm run lint       # ESLint
npm run typecheck  # TypeScript
```

## Ideias para as próximas versões

1. **Mural dos projetos dos alunos**: galeria dos sites finais por turma, que pode servir de vitrine para a banca.
2. **Checklist do projeto**: etapas (ODS escolhido, estrutura HTML, CSS, imagens, publicação), com progresso salvo no navegador.
3. **"Cola" de HTML e CSS**: glossário de tags e propriedades com exemplos para copiar.
4. **Critérios da banca e cronograma**: o que será avaliado e as datas importantes.
5. **Área do voluntário**: roteiro de cada aula, dicas didáticas e checklist do dia.
6. **Dúvidas anônimas**: caixa de perguntas respondidas pelos instrutores.
7. **QR Code de avaliação**: gerado no painel para projetar no fim da aula.
8. **Quiz rápido por aula**, para fixar o conteúdo.
