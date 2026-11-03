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
| `/avaliar` | alunos | Avaliação **anônima** da aula e de cada instrutor (estrelas de 1 a 5 e comentário), liberada pelo **código da turma** |
| `/admin` | instrutores | Login; cadastro de sites (com upload de imagem), aulas (Markdown com pré-visualização), turmas, códigos e instrutores; relatório de avaliações com exportação CSV |

## Tecnologias

- **Next.js 15** (App Router e Server Actions), **TypeScript** e **Tailwind CSS 4**
- **Supabase**: Postgres, Auth (login dos instrutores) e Storage (imagens de preview)
- Hospedagem sugerida: **Vercel** (gratuita)

## Configuração (uma vez só)

### 1. Criar o projeto no Supabase

1. Crie uma conta em <https://supabase.com> e um projeto novo. O plano gratuito é suficiente.
2. Abra **SQL Editor → New query**, cole o conteúdo de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) e clique em **Run**.
3. (Opcional) Faça o mesmo com [`supabase/seed.sql`](supabase/seed.sql) para criar uma aula de exemplo e a turma de teste `TESTE-2026`.
4. **Bloqueie novos cadastros:** vá em **Authentication → Sign In / Providers → Email** e desative **"Allow new users to sign up"**. Assim, só quem você criar consegue entrar no painel.
5. **Crie a conta de cada instrutor** em **Authentication → Users → Add user → Create new user**, informando e-mail e senha e marcando **Auto Confirm User**.

> Importante: qualquer conta criada no Supabase Auth tem acesso total ao painel. Por isso o cadastro público precisa ficar desativado.

### 2. Rodar no seu computador

```bash
npm install
cp .env.example .env.local   # preencha com Project Settings → API (URL e chave anon/public)
npm run dev                  # abre em http://localhost:3000
```

### 3. Publicar na internet (Vercel)

1. Em <https://vercel.com>, importe este repositório do GitHub.
2. Em **Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Clique em **Deploy**. Pronto: cada `git push` na branch principal publica uma nova versão.

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
src/app/              páginas (cada pasta é uma rota)
  avaliar/            formulário de avaliação + Server Actions
  admin/login/        login dos instrutores
  admin/(painel)/     área protegida: sites, aulas, turmas, avaliações
src/components/       componentes visuais (SiteCard, OdsCard, StarRating…)
src/data/ods.ts       conteúdo dos 17 ODS (edite aqui para mudar os textos)
src/lib/              acesso ao Supabase, tipos e utilidades
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
