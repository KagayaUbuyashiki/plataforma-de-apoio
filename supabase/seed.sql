-- =============================================================
-- Dados de exemplo — rode DEPOIS de 0001_init.sql.
-- Edite os nomes e textos pelo painel /admin depois.
-- =============================================================

insert into public.turmas (nome, escola, cidade, codigo)
values ('Turma de teste', 'Escola exemplo', 'Cataguases', 'TESTE-2026')
on conflict (codigo) do nothing;

insert into public.instrutores (id, nome, bio)
values ('00000000-0000-0000-0000-000000000001', 'Instrutor(a) exemplo', 'Voluntário(a) do Meu Primeiro Site. Edite este perfil no painel.')
on conflict (id) do nothing;

insert into public.aulas (id, numero, slug, titulo, resumo_md, conteudo_md, materiais, publicada)
values (
  '00000000-0000-0000-0000-0000000000a1',
  1,
  'aula-1',
  'Boas-vindas: o que é um site?',
  $md$Nesta primeira aula conhecemos o programa **Meu Primeiro Site**, entendemos como a internet funciona e criamos nossa **primeira página em HTML**.$md$,
  $md$## O que vimos hoje

- **Internet x Web:** a internet é a rede que liga computadores; a web é o conjunto de sites que acessamos pelo navegador.
- **O que é um site:** um conjunto de arquivos (HTML, CSS, imagens) que o navegador lê e mostra na tela.
- **HTML** é a *estrutura* (títulos, parágrafos, imagens). **CSS** é a *aparência* (cores, fontes, espaçamentos).
- **Os ODS:** cada um vai escolher um dos 17 Objetivos de Desenvolvimento Sustentável como tema do seu site.

## Nossa primeira página

Crie uma pasta chamada `meu-site` e, dentro dela, um arquivo `index.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Meu Primeiro Site</title>
  </head>
  <body>
    <h1>Olá, mundo!</h1>
    <p>Este é o meu primeiro site.</p>
  </body>
</html>
```

Abra o arquivo no navegador (duplo clique) e veja o resultado!

## Para casa

1. Navegue pela página de **ODS** da plataforma e escolha 2 ou 3 temas que te interessam.
2. Mude o texto do `<h1>` e do `<p>` da sua página e veja o que acontece.$md$,
  '[
    {"titulo": "Os 17 ODS na plataforma", "url": "/ods"},
    {"titulo": "MDN: Noções básicas de HTML", "url": "https://developer.mozilla.org/pt-BR/docs/Learn/Getting_started_with_the_web/HTML_basics"},
    {"titulo": "Baixar o VS Code", "url": "https://code.visualstudio.com/"},
    {"titulo": "ONU Brasil: Objetivos de Desenvolvimento Sustentável", "url": "https://brasil.un.org/pt-br/sdgs"}
  ]'::jsonb,
  true
)
on conflict (id) do nothing;

insert into public.aula_instrutores (aula_id, instrutor_id)
values ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000001')
on conflict do nothing;
