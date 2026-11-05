# Segurança — checklist da plataforma

Baseado no OWASP ASVS (níveis 1 e 2), adaptado para a plataforma. Marque de novo a cada mudança grande.
Testes automáticos: `npm run test:seguranca` (precisa do Supabase local: `npx supabase start`).

## Senhas e contas
- [x] Senhas guardadas **só** no Supabase Auth, com hash bcrypt (`auth.users.encrypted_password` começa com `$2`). Nenhuma senha em tabela nossa, em log ou no código.
- [x] Login por usuário: cada usuário recebe um e-mail interno `usuario@contas.invalid` (domínio reservado, nunca recebe mensagens).
- [x] Regras para alunos: 8 a 72 caracteres, letras e números, sem senhas comuns, sem o usuário ou o nome. (Teste: "senhas fracas são recusadas".)
- [x] Mensagem de erro genérica: "Usuário ou senha incorretos." (Teste: "mesma mensagem…".)
- [x] Cadastro público desligado no Supabase (`enable_signup = false`): contas de aluno só nascem de um código gerado pelo instrutor.
- [ ] **Aviso:** o instrutor `bituca014` usa senha igual ao usuário, por decisão do responsável. Recomendado trocar por uma senha forte.

## Códigos de acesso (tokens)
- [x] 10 caracteres aleatórios (`crypto.randomInt`, ~50 bits), válidos por 7 dias, uso único.
- [x] O banco guarda só o HMAC-SHA256 do código, com a chave secreta do servidor. (Teste: "o banco guarda só hash".)
- [x] Uso atômico: dois envios ao mesmo tempo, só um passa. (Teste: "consumo atômico".)
- [x] O código aparece uma única vez para o instrutor e não vai para a URL.
- [x] Código usado ou vencido é recusado. (Testes.)

## Redefinição pelo instrutor
- [x] Troca a senha por um valor aleatório e **bloqueia** a conta: sessões abertas perdem o acesso na hora (`situacao` deixa de ser `ativo`).
- [x] Gera um código novo; ao usá-lo, o aluno cria outra senha e a conta é desbloqueada. (Teste: "Redefinição pelo instrutor".)
- [x] O servidor só redefine, bloqueia ou apaga contas que são de **aluno** (`ehContaDeAluno`). O banco não deixa o instrutor mudar `user_id` nem `situacao` pela API. (Teste: "Instrutor não mexe em contas que não são de aluno".)
- [ ] Conhecido e aceito: quem digitar o usuário de uma conta redefinida vê o aviso "Sua conta foi redefinida…" (o Supabase informa o bloqueio antes de conferir a senha). Revela só que aquela conta foi redefinida.

## Controle de acesso (RLS)
- [x] RLS ligado em todas as tabelas. Toda escrita de conteúdo exige `eh_instrutor()`; ser "logado" não basta (alunos também fazem login).
- [x] Aluno lê só a própria ficha e o próprio checklist; não marca nem desmarca itens de outro; não altera situação, `user_id` ou nome. (Testes de "Controle de acesso".)
- [x] `contas_login`, `tokens_aluno` e `tentativas_acesso` sem nenhuma política e sem permissões para `anon`/`authenticated`.
- [x] Funções sensíveis (`consumir_token`, `contar_tentativas`, `registrar_tentativa`, `limpar_tentativas`) só para `service_role`.
- [x] Páginas: `/admin/*` exige `exigirInstrutor()`, `/minha-area/*` exige `exigirAluno()`; o middleware manda visitantes para `/entrar`.
- [ ] Depois de cada migração em produção: rodar os avisos de segurança do Supabase (Advisors → Security).

## Limite de tentativas
- [x] Login: 5 erros por usuário e 30 por IP a cada 15 minutos. Código: 10 erros por IP a cada 15 minutos. (Testes.)
- [x] As chaves do contador são HMAC (não guardamos IP nem usuário em texto) e são apagadas depois de 1 dia.
- [x] IP lido de `x-real-ip`/`x-forwarded-for`, definidos pela Vercel (não confiáveis fora dela).

## Sessão e navegador
- [x] Cookies de sessão `httpOnly`, `sameSite=lax` e `secure` em produção. (Teste: "cookies de sessão são httpOnly".)
- [x] Server Actions do Next.js conferem a origem (proteção contra CSRF).
- [x] Cabeçalhos: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `frame-ancestors 'self'`, `Permissions-Policy`, HSTS.
- [ ] CSP completa: não aplicada porque quebraria o editor Monaco e a prévia ao vivo.

## Segredos
- [x] Chave secreta (`SUPABASE_SECRET_KEY` ou `SUPABASE_SERVICE_ROLE_KEY`) só no servidor (`import "server-only"`), nunca com `NEXT_PUBLIC_`. (Teste: "a chave secreta não aparece no HTML nem nos arquivos enviados ao navegador".)
- [x] `.env.local` fora do Git. Nenhuma senha ou chave no repositório (ele é público).

## Dados dos alunos (LGPD — menores de idade)
- [x] Ficha mínima: nome, como quer ser chamado, idade, escola, série, cidade, experiência, expectativa e ODS de interesse. Sem documentos, telefone, endereço ou e-mail.
- [x] O formulário explica quem vê os dados. Só o próprio aluno e os instrutores leem a ficha.
- [x] O instrutor pode excluir o aluno: apaga a conta, a ficha e o checklist.
- [x] As avaliações das aulas continuam anônimas (sem ligação com a conta do aluno).

## No painel do Supabase (produção)
- [ ] Authentication → Providers → Email: "Allow new users to sign up" desligado.
- [ ] Authentication → Policies: tamanho mínimo de senha 8.
- [ ] Authentication → Rate Limits: revisar se o limite de logins por IP comporta uma turma inteira entrando ao mesmo tempo (todos os logins saem do servidor da Vercel).
