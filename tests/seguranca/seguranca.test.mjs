/**
 * Testes de segurança do login de alunos e instrutores.
 *
 * Rodam contra o Supabase LOCAL (npx supabase start) e o site em modo dev:
 *   npm run test:seguranca
 * Variáveis: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SECRET_KEY, APP_URL.
 * NUNCA rode contra o banco de produção: os testes criam e apagam contas.
 */
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { after, before, describe, test } from "node:test";
import { createClient } from "@supabase/supabase-js";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const URL_SB = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUB = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SECRETA = process.env.SUPABASE_SECRET_KEY;
const APP = process.env.APP_URL ?? "http://localhost:3100";
if (!URL_SB?.startsWith("http://127.0.0.1") && !URL_SB?.startsWith("http://localhost")) {
  throw new Error("Estes testes só rodam contra o Supabase LOCAL.");
}

const admin = createClient(URL_SB, SECRETA, { auth: { persistSession: false } });
const DOMINIO = "contas.invalid";
const ALFABETO = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const hashCodigo = (c) => createHmac("sha256", SECRETA).update(`codigo:${c.replace("-", "")}`).digest("hex");
const codigoAleatorio = () => {
  let s = "";
  for (let i = 0; i < 10; i++) s += ALFABETO[Math.floor(Math.random() * 32)];
  return `${s.slice(0, 5)}-${s.slice(5)}`;
};
const sufixo = () => randomUUID().slice(0, 8);

let browser;
const criados = { alunos: [], usuarios: [] };

/** Cada contexto finge um IP diferente, para os limites de tentativa não se misturarem entre testes. */
async function novaPagina() {
  const ctx = await browser.newContext({ extraHTTPHeaders: { "x-real-ip": `10.0.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` } });
  return ctx.newPage();
}

/** Espera o envio terminar: ou a página muda de endereço, ou aparece uma mensagem de erro. */
async function aguardarResultado(page, caminhoAtual) {
  await Promise.race([
    page.waitForURL((u) => u.pathname !== caminhoAtual, { timeout: 20000 }),
    page.waitForSelector('form [role="alert"]', { timeout: 20000 }),
  ]).catch(() => {});
  await page.waitForLoadState("networkidle").catch(() => {});
}

async function entrarComo(page, usuario, senha) {
  await page.goto(`${APP}/entrar`);
  await page.fill("#usuario", usuario);
  await page.fill("#senha", senha);
  await page.click('button[type="submit"]');
  await aguardarResultado(page, "/entrar");
}

/** Cria um aluno + código direto no banco (atalho para os testes de acesso). */
async function alunoComCodigo({ expirado = false } = {}) {
  const { data: aluno } = await admin.from("alunos").insert({ nome: `Aluno Teste ${sufixo()}` }).select("id, nome").single();
  criados.alunos.push(aluno.id);
  const codigo = codigoAleatorio();
  const expira = new Date(Date.now() + (expirado ? -1 : 1) * 24 * 3600 * 1000).toISOString();
  await admin.from("tokens_aluno").insert({ aluno_id: aluno.id, hash_token: hashCodigo(codigo), expira_em: expira });
  return { ...aluno, codigo };
}

/** Faz o primeiro acesso pela interface e devolve usuário e senha. */
async function primeiroAcesso(page, codigo, { usuario = `aluno.${sufixo()}`, senha = "Pinheiro2026x" } = {}) {
  await page.goto(`${APP}/entrar/codigo`);
  await page.fill("#codigo", codigo);
  await page.click('button[type="submit"]');
  await page.waitForSelector("#escola", { timeout: 15000 });
  await page.fill("#idade", "15");
  await page.fill("#escola", "Escola Estadual Teste");
  await page.fill("#serie", "9º ano");
  await page.fill("#cidade", "Cataguases");
  await page.click('label:has(input[name="experiencia"][value="nunca"])');
  await page.click('label:has(input[name="ja_criou_site"][value="nao"])');
  if (await page.$("#usuario")) await page.fill("#usuario", usuario);
  await page.fill("#senha", senha);
  await page.fill("#confirmar", senha);
  await page.click('button[type="submit"]');
  await aguardarResultado(page, "/entrar/codigo");
  return { usuario, senha };
}

/** Cliente Supabase logado como o usuário (o que um aluno mal-intencionado teria nas mãos). */
async function clienteDe(usuario, senha) {
  const c = createClient(URL_SB, PUB, { auth: { persistSession: false } });
  const { error } = await c.auth.signInWithPassword({ email: `${usuario}@${DOMINIO}`, password: senha });
  assert.equal(error, null, `login de ${usuario} falhou: ${error?.message}`);
  return c;
}

async function idDoUsuario(usuario) {
  const { data } = await admin.from("contas_login").select("user_id").eq("usuario", usuario).single();
  criados.usuarios.push(data.user_id);
  return data.user_id;
}

before(async () => {
  browser = await chromium.launch();
  // Instrutor de teste
  const { data } = await admin.auth.admin.createUser({ email: `instrutor.teste@${DOMINIO}`, password: "InstrutorTeste9", email_confirm: true });
  if (data?.user) {
    criados.usuarios.push(data.user.id);
    await admin.from("instrutores_autorizados").insert({ user_id: data.user.id, email: data.user.email });
    await admin.from("contas_login").insert({ user_id: data.user.id, usuario: "instrutor.teste", papel: "instrutor" });
  }
});

after(async () => {
  await browser?.close();
  for (const id of criados.usuarios) await admin.auth.admin.deleteUser(id).catch(() => {});
  if (criados.alunos.length) await admin.from("alunos").delete().in("id", criados.alunos);
  await admin.from("tentativas_acesso").delete().gt("id", 0);
});

describe("Códigos de acesso (tokens)", () => {
  test("instrutor gera o código pela interface e o aluno faz o primeiro acesso", async () => {
    const page = await novaPagina();
    await entrarComo(page, "instrutor.teste", "InstrutorTeste9");
    assert.match(page.url(), /\/admin$/);
    await page.goto(`${APP}/admin/alunos`);
    const nome = `Maria Teste ${sufixo()}`;
    await page.fill("#a-nome", nome);
    await page.click("text=Cadastrar e gerar código");
    const codigo = (await page.locator("code").first().textContent({ timeout: 15000 })).trim();
    assert.match(codigo, /^[0-9A-Z]{5}-[0-9A-Z]{5}$/);
    const { data: aluno } = await admin.from("alunos").select("id").eq("nome", nome).single();
    criados.alunos.push(aluno.id);

    const pAluno = await novaPagina();
    const { usuario } = await primeiroAcesso(pAluno, codigo);
    assert.match(pAluno.url(), /\/minha-area/);
    await idDoUsuario(usuario);
  });

  test("código já usado não funciona de novo", async () => {
    const a = await alunoComCodigo();
    const page = await novaPagina();
    const { usuario } = await primeiroAcesso(page, a.codigo);
    await idDoUsuario(usuario);
    const outra = await novaPagina();
    await outra.goto(`${APP}/entrar/codigo`);
    await outra.fill("#codigo", a.codigo);
    await outra.click('button[type="submit"]');
    await outra.waitForSelector("text=Código inválido", { timeout: 15000 });
  });

  test("dois usos ao mesmo tempo: só um consegue (consumo atômico)", async () => {
    const a = await alunoComCodigo();
    const h = hashCodigo(a.codigo);
    const [r1, r2] = await Promise.all([admin.rpc("consumir_token", { p_hash: h }), admin.rpc("consumir_token", { p_hash: h })]);
    const sucessos = [r1, r2].filter((r) => Array.isArray(r.data) && r.data.length === 1).length;
    assert.equal(sucessos, 1);
  });

  test("código vencido é recusado", async () => {
    const a = await alunoComCodigo({ expirado: true });
    const page = await novaPagina();
    await page.goto(`${APP}/entrar/codigo`);
    await page.fill("#codigo", a.codigo);
    await page.click('button[type="submit"]');
    await page.waitForSelector("text=Código inválido", { timeout: 15000 });
  });

  test("força bruta: depois de 10 códigos errados o IP é bloqueado", async () => {
    const page = await novaPagina();
    for (let i = 0; i < 10; i++) {
      await page.goto(`${APP}/entrar/codigo`);
      await page.fill("#codigo", codigoAleatorio());
      await page.click('button[type="submit"]');
      await page.waitForSelector("text=Código inválido", { timeout: 15000 });
    }
    const valido = await alunoComCodigo();
    await page.goto(`${APP}/entrar/codigo`);
    await page.fill("#codigo", valido.codigo);
    await page.click('button[type="submit"]');
    await page.waitForSelector("text=Muitas tentativas", { timeout: 15000 });
  });

  test("o banco guarda só hash: nenhum código ou senha em texto", async () => {
    const a = await alunoComCodigo();
    const { data: tokens } = await admin.from("tokens_aluno").select("hash_token").eq("aluno_id", a.id);
    assert.equal(tokens.length, 1);
    assert.match(tokens[0].hash_token, /^[0-9a-f]{64}$/);
    assert.notEqual(tokens[0].hash_token.toUpperCase(), a.codigo.replace("-", ""));
  });
});

describe("Redefinição pelo instrutor", () => {
  test("senha antiga para de funcionar, o aluno é avisado e entra com código novo", async () => {
    const a = await alunoComCodigo();
    const page = await novaPagina();
    const { usuario, senha } = await primeiroAcesso(page, a.codigo);
    await idDoUsuario(usuario);
    assert.match(page.url(), /\/minha-area/);

    const pInstrutor = await novaPagina();
    await entrarComo(pInstrutor, "instrutor.teste", "InstrutorTeste9");
    await pInstrutor.goto(`${APP}/admin/alunos/${a.id}`);
    pInstrutor.on("dialog", (d) => d.accept());
    await pInstrutor.click("text=Recuperar conta / redefinir senha");
    const novo = (await pInstrutor.locator("code").first().textContent({ timeout: 15000 })).trim();

    // A sessão aberta do aluno perde o acesso na hora
    await page.goto(`${APP}/minha-area`);
    assert.doesNotMatch(page.url(), /\/minha-area$/);

    const p2 = await novaPagina();
    await entrarComo(p2, usuario, senha);
    await p2.waitForSelector("text=Sua conta foi redefinida pelo instrutor", { timeout: 15000 });

    await primeiroAcesso(p2, novo, { senha: "Ipe2027amarelo" });
    assert.match(p2.url(), /\/minha-area/);
    const p3 = await novaPagina();
    await entrarComo(p3, usuario, "Ipe2027amarelo");
    assert.match(p3.url(), /\/minha-area/);
  });
});

describe("Controle de acesso (um aluno não vê nem altera dados de outro)", () => {
  let A, B, clienteA;
  before(async () => {
    const a = await alunoComCodigo();
    const b = await alunoComCodigo();
    A = { ...a, ...(await primeiroAcesso(await novaPagina(), a.codigo)) };
    B = { ...b, ...(await primeiroAcesso(await novaPagina(), b.codigo)) };
    await idDoUsuario(A.usuario);
    await idDoUsuario(B.usuario);
    await admin.from("progresso_aluno").insert({ aluno_id: B.id, item: "etapa:html" });
    clienteA = await clienteDe(A.usuario, A.senha);
  });

  test("aluno só enxerga a própria ficha", async () => {
    const { data } = await clienteA.from("alunos").select("id");
    assert.deepEqual(data.map((x) => x.id), [A.id]);
  });

  test("aluno não lê o progresso de outro", async () => {
    const { data } = await clienteA.from("progresso_aluno").select("*").eq("aluno_id", B.id);
    assert.equal(data.length, 0);
  });

  test("aluno não marca itens no checklist de outro", async () => {
    const { error } = await clienteA.from("progresso_aluno").insert({ aluno_id: B.id, item: "etapa:css" });
    assert.ok(error, "deveria ser bloqueado pelas regras do banco");
  });

  test("aluno não desmarca itens de outro", async () => {
    await clienteA.from("progresso_aluno").delete().eq("aluno_id", B.id);
    const { data } = await admin.from("progresso_aluno").select("item").eq("aluno_id", B.id);
    assert.equal(data.length, 1);
  });

  test("aluno não muda a própria situação nem o user_id", async () => {
    await clienteA.from("alunos").update({ situacao: "aguardando_token", user_id: null, nome: "Hacker" }).eq("id", A.id);
    const { data } = await admin.from("alunos").select("situacao, user_id, nome").eq("id", A.id).single();
    assert.equal(data.situacao, "ativo");
    assert.notEqual(data.user_id, null);
    assert.notEqual(data.nome, "Hacker");
  });

  test("salvar_ficha altera só a ficha do próprio aluno", async () => {
    const { error } = await clienteA.rpc("salvar_ficha", { p_ficha: { escola: "Nova Escola", idade: 16, cidade: "Leopoldina", serie: "1º ano" } });
    assert.equal(error, null);
    const { data } = await admin.from("alunos").select("id, escola").in("id", [A.id, B.id]);
    assert.equal(data.find((x) => x.id === A.id).escola, "Nova Escola");
    assert.equal(data.find((x) => x.id === B.id).escola, "Escola Estadual Teste");
  });

  test("aluno não marca aula inexistente ou item inventado", async () => {
    const r1 = await clienteA.from("progresso_aluno").insert({ aluno_id: A.id, item: `aula:${randomUUID()}` });
    const r2 = await clienteA.from("progresso_aluno").insert({ aluno_id: A.id, item: "etapa:<script>" });
    assert.ok(r1.error && r2.error);
  });

  test("aluno não acessa tabelas e funções do servidor", async () => {
    for (const t of ["tokens_aluno", "contas_login", "tentativas_acesso", "instrutores_autorizados"]) {
      const { data, error } = await clienteA.from(t).select("*");
      assert.ok(error || data.length === 0, `aluno leu ${t}`);
    }
    for (const [fn, args] of [
      ["consumir_token", { p_hash: "0".repeat(64) }],
      ["contar_tentativas", { p_chave: "0".repeat(64), p_janela_segundos: 60 }],
      ["limpar_tentativas", { p_chave: "0".repeat(64) }],
    ]) {
      const { error } = await clienteA.rpc(fn, args);
      assert.ok(error, `aluno chamou ${fn}`);
    }
  });

  test("aluno não escreve em tabelas de instrutor (aulas, sites, turmas, alunos)", async () => {
    const r = await Promise.all([
      clienteA.from("aulas").insert({ numero: 99, slug: `x-${sufixo()}`, titulo: "x" }),
      clienteA.from("sites").insert({ titulo: "x", url: "https://x.com" }),
      clienteA.from("turmas").insert({ nome: "x", codigo: `X${sufixo()}`.toUpperCase() }),
      clienteA.from("alunos").insert({ nome: "Aluno Falso" }),
    ]);
    for (const x of r) assert.ok(x.error, "escrita deveria ser bloqueada");
  });

  test("visitante anônimo não lê dados de alunos", async () => {
    const anon = createClient(URL_SB, PUB, { auth: { persistSession: false } });
    for (const t of ["alunos", "progresso_aluno", "tokens_aluno", "contas_login"]) {
      const { data, error } = await anon.from(t).select("*");
      assert.ok(error || data.length === 0, `anônimo leu ${t}`);
    }
  });

  test("aluno logado não entra no painel do instrutor", async () => {
    const page = await novaPagina();
    await entrarComo(page, A.usuario, A.senha);
    await page.goto(`${APP}/admin/alunos`);
    assert.doesNotMatch(page.url(), /\/admin/);
  });
});

describe("Login", () => {
  test("visitante não acessa a minha área", async () => {
    const page = await novaPagina();
    await page.goto(`${APP}/minha-area`);
    assert.match(page.url(), /\/entrar/);
  });

  test("mesma mensagem para usuário inexistente e senha errada", async () => {
    const page = await novaPagina();
    await entrarComo(page, `ninguem.${sufixo()}`, "QualquerCoisa1");
    const m1 = await page.locator('form [role="alert"]').textContent();
    await entrarComo(page, "instrutor.teste", "SenhaErrada1");
    const m2 = await page.locator('form [role="alert"]').textContent();
    assert.equal(m1, m2);
  });

  test("5 senhas erradas bloqueiam o usuário (mesmo com a senha certa depois)", async () => {
    const a = await alunoComCodigo();
    const { usuario, senha } = await primeiroAcesso(await novaPagina(), a.codigo);
    await idDoUsuario(usuario);
    for (let i = 0; i < 5; i++) {
      const p = await novaPagina(); // IPs diferentes: o bloqueio é pelo usuário
      await entrarComo(p, usuario, `Errada${i}abc`);
    }
    const p = await novaPagina();
    await entrarComo(p, usuario, senha);
    await p.waitForSelector("text=Muitas tentativas", { timeout: 15000 });
  });

  test("senhas fracas são recusadas no primeiro acesso", async () => {
    for (const senha of ["12345678", "abcdefgh", "curta1"]) {
      const a = await alunoComCodigo();
      const page = await novaPagina();
      await primeiroAcesso(page, a.codigo, { senha });
      assert.doesNotMatch(page.url(), /\/minha-area/, `aceitou a senha fraca ${senha}`);
    }
    const a = await alunoComCodigo();
    const page = await novaPagina();
    await primeiroAcesso(page, a.codigo, { usuario: `joana${sufixo()}`, senha: "joana" + "Teste123" });
    assert.doesNotMatch(page.url(), /\/minha-area/, "aceitou senha com parte do usuário");
  });

  test("cookies de sessão são httpOnly", async () => {
    const a = await alunoComCodigo();
    const page = await novaPagina();
    const { usuario } = await primeiroAcesso(page, a.codigo);
    await idDoUsuario(usuario);
    const cookies = await page.context().cookies();
    const sessao = cookies.filter((c) => c.name.startsWith("sb-"));
    assert.ok(sessao.length > 0);
    for (const c of sessao) assert.equal(c.httpOnly, true, `${c.name} sem httpOnly`);
    assert.equal(await page.evaluate(() => document.cookie.includes("sb-")), false);
  });
});

describe("Segredos", () => {
  test("a chave secreta não aparece no HTML nem nos arquivos enviados ao navegador", async () => {
    for (const rota of ["/", "/entrar", "/entrar/codigo", "/ods"]) {
      const html = await (await fetch(`${APP}${rota}`)).text();
      assert.equal(html.includes(SECRETA), false, `chave em ${rota}`);
    }
    const pasta = join(process.cwd(), ".next", "static");
    const arquivos = [];
    const varrer = (d) => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) varrer(p);
        else if (p.endsWith(".js")) arquivos.push(p);
      }
    };
    varrer(pasta);
    assert.ok(arquivos.length > 0);
    for (const p of arquivos) assert.equal(readFileSync(p, "utf8").includes(SECRETA), false, `chave em ${p}`);
  });
});
