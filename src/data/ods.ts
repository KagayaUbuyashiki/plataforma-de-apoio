/**
 * Os 17 Objetivos de Desenvolvimento Sustentável (ODS) da ONU — Agenda 2030.
 * Nomes oficiais em português e cores oficiais da identidade visual da ONU.
 * Os textos são introdutórios e servem de ponto de partida para a pesquisa
 * dos alunos; incentive-os a buscar dados atualizados em fontes oficiais.
 */

export type Ods = {
  numero: number;
  nome: string;
  cor: string;
  /** Frase curta que resume o objetivo. */
  lema: string;
  resumo: string;
  porQueImporta: string;
  /** Ganchos para pensar o tema perto de casa. */
  pertoDeVoce: string;
  /** Sugestões de seções para o site do aluno. */
  ideias: string[];
  /** Perguntas que guiam a pesquisa. */
  perguntas: string[];
};

export const ODS: Ods[] = [
  {
    numero: 1,
    nome: "Erradicação da Pobreza",
    cor: "#E5243B",
    lema: "Acabar com a pobreza em todas as suas formas, em todos os lugares.",
    resumo:
      "Pobreza não é só falta de dinheiro: é também não ter acesso a moradia digna, alimentação, saúde, educação e oportunidades. Este ODS busca garantir que todas as pessoas tenham o básico para viver com dignidade.",
    porQueImporta:
      "Milhões de pessoas no mundo e no Brasil ainda vivem com renda insuficiente para suas necessidades básicas. A pobreza afeta todos os outros ODS: saúde, educação, trabalho e segurança.",
    pertoDeVoce:
      "Que programas sociais existem na sua cidade? Há ONGs, bancos de alimentos ou projetos comunitários que ajudam famílias em situação de vulnerabilidade?",
    ideias: [
      "O que é pobreza multidimensional (explicada com ícones e exemplos)",
      "Programas e iniciativas que combatem a pobreza no Brasil",
      "Como os jovens podem ajudar: voluntariado e projetos locais",
    ],
    perguntas: [
      "Qual a diferença entre pobreza e extrema pobreza?",
      "Como a pobreza afeta o acesso à educação?",
      "Que iniciativas da sua região ajudam a reduzir a pobreza?",
    ],
  },
  {
    numero: 2,
    nome: "Fome Zero e Agricultura Sustentável",
    cor: "#DDA63A",
    lema: "Acabar com a fome, alcançar a segurança alimentar e promover a agricultura sustentável.",
    resumo:
      "Este ODS quer que todas as pessoas tenham comida suficiente e de qualidade o ano inteiro, produzida de um jeito que respeite o meio ambiente e valorize os pequenos agricultores.",
    porQueImporta:
      "O mundo produz alimento suficiente, mas ainda há muita gente passando fome, enquanto uma grande quantidade de comida é desperdiçada. A agricultura familiar é responsável por boa parte do que chega à mesa dos brasileiros.",
    pertoDeVoce:
      "A Zona da Mata mineira tem forte tradição rural. Existem feiras livres, hortas comunitárias ou produtores familiares na sua cidade?",
    ideias: [
      "Segurança alimentar: o que significa ter comida de qualidade",
      "Agricultura familiar e feiras da região",
      "Dicas para reduzir o desperdício de alimentos em casa",
    ],
    perguntas: [
      "Por que ainda existe fome se o mundo produz comida suficiente?",
      "O que é agricultura sustentável?",
      "Quanto alimento é desperdiçado no Brasil e como evitar?",
    ],
  },
  {
    numero: 3,
    nome: "Saúde e Bem-Estar",
    cor: "#4C9F38",
    lema: "Assegurar uma vida saudável e promover o bem-estar para todas as pessoas, em todas as idades.",
    resumo:
      "Saúde envolve corpo e mente: vacinação, acesso a médicos, alimentação, prevenção de doenças, saúde mental e redução de acidentes. Este ODS busca que todos possam viver mais e melhor.",
    porQueImporta:
      "O Brasil tem o SUS, um dos maiores sistemas públicos de saúde do mundo. Ainda assim, temas como saúde mental dos jovens, vacinação e acidentes de trânsito precisam de atenção.",
    pertoDeVoce:
      "Como funciona a Unidade Básica de Saúde (UBS) do seu bairro? Que campanhas de saúde acontecem na sua escola ou cidade?",
    ideias: [
      "Saúde mental na adolescência: sinais e onde buscar ajuda",
      "A importância da vacinação (com linha do tempo de vacinas)",
      "Hábitos saudáveis: sono, alimentação e atividade física",
    ],
    perguntas: [
      "O que é o SUS e quais serviços ele oferece?",
      "Por que a saúde mental é tão importante quanto a física?",
      "Como a vacinação protege toda a comunidade?",
    ],
  },
  {
    numero: 4,
    nome: "Educação de Qualidade",
    cor: "#C5192D",
    lema: "Garantir educação inclusiva, equitativa e de qualidade, e oportunidades de aprendizado ao longo da vida.",
    resumo:
      "Educação de qualidade é mais do que estar matriculado: é aprender de verdade, em escolas seguras e acessíveis, com professores valorizados e oportunidades para todos, inclusive pessoas com deficiência.",
    porQueImporta:
      "A educação abre portas para o trabalho, a renda e a cidadania. Aprender tecnologia, como você está fazendo agora, é parte disso!",
    pertoDeVoce:
      "Que cursos gratuitos existem na sua região? Programas como o Meu Primeiro Site são exemplos de educação ao longo da vida.",
    ideias: [
      "Educação inclusiva: como tornar a escola acessível para todos",
      "Cursos e oportunidades gratuitas para jovens",
      "Como a tecnologia pode ajudar a aprender",
    ],
    perguntas: [
      "O que é uma educação de qualidade?",
      "Por que muitos jovens abandonam a escola?",
      "Como a educação muda a vida de uma comunidade?",
    ],
  },
  {
    numero: 5,
    nome: "Igualdade de Gênero",
    cor: "#FF3A21",
    lema: "Alcançar a igualdade de gênero e empoderar todas as mulheres e meninas.",
    resumo:
      "Este ODS busca acabar com a discriminação e a violência contra mulheres e meninas, garantir salários iguais e incentivar a participação feminina na política, na ciência e na tecnologia.",
    porQueImporta:
      "Mulheres ainda ganham menos que homens em muitas funções e são minoria em áreas como tecnologia. Quanto mais diversidade, melhores as soluções para todos.",
    pertoDeVoce:
      "Quantas meninas e quantos meninos há na sua turma de programação? Que mulheres inspiradoras da sua cidade você conhece?",
    ideias: [
      "Mulheres que mudaram a história da tecnologia",
      "Igualdade no trabalho e na escola: o que ainda falta",
      "Canais de ajuda e combate à violência contra a mulher",
    ],
    perguntas: [
      "Por que existem menos mulheres na área de tecnologia?",
      "O que é desigualdade salarial de gênero?",
      "Como meninos e meninas podem ajudar a construir igualdade?",
    ],
  },
  {
    numero: 6,
    nome: "Água Potável e Saneamento",
    cor: "#26BDE2",
    lema: "Garantir disponibilidade e manejo sustentável da água e saneamento para todas as pessoas.",
    resumo:
      "Água limpa para beber e saneamento básico (coleta e tratamento de esgoto) são direitos fundamentais. Este ODS também cuida da proteção de rios, nascentes e do uso consciente da água.",
    porQueImporta:
      "Ainda há brasileiros sem acesso a esgoto tratado, o que causa doenças e polui rios. Cuidar da água é cuidar da saúde de todos.",
    pertoDeVoce:
      "O Rio Pomba, que dá nome ao Rio Pomba Valley, faz parte da bacia do Rio Paraíba do Sul. Como está a saúde dos rios da sua cidade?",
    ideias: [
      "O caminho da água: da nascente até a torneira",
      "Os rios da nossa região e como protegê-los",
      "Dicas para economizar água no dia a dia",
    ],
    perguntas: [
      "O que é saneamento básico?",
      "De onde vem a água que chega na sua casa?",
      "Como a poluição dos rios afeta a vida das pessoas?",
    ],
  },
  {
    numero: 7,
    nome: "Energia Limpa e Acessível",
    cor: "#FCC30B",
    lema: "Garantir acesso a fontes de energia confiáveis, sustentáveis e modernas para todas as pessoas.",
    resumo:
      "Este ODS busca levar energia elétrica a todos, aumentar o uso de fontes renováveis (como solar, eólica e hidráulica) e usar a energia de forma mais eficiente.",
    porQueImporta:
      "A energia move escolas, hospitais e a internet. O Brasil tem uma das matrizes elétricas mais renováveis do mundo, mas ainda pode avançar em eficiência e energia solar.",
    pertoDeVoce:
      "De onde vem a energia da sua casa? Você já viu placas solares nos telhados da sua cidade? (Dica: a Energisa, parceira do programa, é uma distribuidora de energia.)",
    ideias: [
      "Fontes de energia renováveis x não renováveis (com comparativo)",
      "Como a energia chega até a sua casa",
      "Dicas para economizar energia",
    ],
    perguntas: [
      "O que torna uma energia \"limpa\"?",
      "Como funciona a energia solar?",
      "Que atitudes simples reduzem o consumo de energia?",
    ],
  },
  {
    numero: 8,
    nome: "Trabalho Decente e Crescimento Econômico",
    cor: "#A21942",
    lema: "Promover o crescimento econômico sustentado, o emprego pleno e o trabalho decente para todas as pessoas.",
    resumo:
      "Trabalho decente é ter emprego com salário justo, segurança, direitos e respeito. Este ODS também combate o trabalho infantil e incentiva oportunidades para jovens.",
    porQueImporta:
      "O desemprego entre jovens é maior que a média. Qualificação, como aprender programação, ajuda a entrar no mercado de trabalho.",
    pertoDeVoce:
      "Quais são as principais atividades econômicas da sua cidade? Que profissões de tecnologia podem surgir na região com o Rio Pomba Valley?",
    ideias: [
      "Profissões do futuro na área de tecnologia",
      "Direitos do jovem trabalhador e do jovem aprendiz",
      "Empreendedorismo jovem: ideias e exemplos",
    ],
    perguntas: [
      "O que é trabalho decente?",
      "Quais direitos têm os jovens aprendizes?",
      "Como a tecnologia está mudando as profissões?",
    ],
  },
  {
    numero: 9,
    nome: "Indústria, Inovação e Infraestrutura",
    cor: "#FD6925",
    lema: "Construir infraestrutura resiliente, promover a industrialização sustentável e fomentar a inovação.",
    resumo:
      "Estradas, internet, pontes e fábricas sustentáveis fazem parte da infraestrutura de um país. Este ODS incentiva a inovação, a pesquisa e o acesso à internet para todos.",
    porQueImporta:
      "Sem internet de qualidade e infraestrutura, as cidades do interior ficam para trás. Polos de inovação como o Rio Pomba Valley querem mudar isso.",
    pertoDeVoce:
      "O Rio Pomba Valley busca transformar a Zona da Mata em um polo de tecnologia. Que empresas e startups inovadoras existem na região?",
    ideias: [
      "O que é um polo de inovação (e o Rio Pomba Valley)",
      "Inclusão digital: internet para todos",
      "Invenções brasileiras que mudaram o mundo",
    ],
    perguntas: [
      "O que é inovação?",
      "Por que o acesso à internet é importante hoje?",
      "Como uma cidade do interior pode se tornar um polo de tecnologia?",
    ],
  },
  {
    numero: 10,
    nome: "Redução das Desigualdades",
    cor: "#DD1367",
    lema: "Reduzir a desigualdade dentro dos países e entre eles.",
    resumo:
      "Este ODS busca oportunidades iguais para todas as pessoas, independentemente de renda, cor, origem, idade, deficiência ou religião.",
    porQueImporta:
      "O Brasil é um dos países mais desiguais do mundo. Reduzir desigualdades melhora a vida de todos e fortalece a democracia.",
    pertoDeVoce:
      "Sua cidade é acessível para pessoas com deficiência? Todos os bairros têm o mesmo acesso a escola, saúde e lazer?",
    ideias: [
      "Os vários tipos de desigualdade (renda, racial, regional)",
      "Acessibilidade: como incluir pessoas com deficiência (inclusive na web!)",
      "Ações afirmativas e inclusão",
    ],
    perguntas: [
      "O que é desigualdade social?",
      "Como a acessibilidade digital ajuda a reduzir desigualdades?",
      "Que grupos sofrem mais com a desigualdade no Brasil?",
    ],
  },
  {
    numero: 11,
    nome: "Cidades e Comunidades Sustentáveis",
    cor: "#FD9D24",
    lema: "Tornar as cidades e comunidades inclusivas, seguras, resilientes e sustentáveis.",
    resumo:
      "Cidades sustentáveis têm transporte público, moradia digna, áreas verdes, coleta de lixo e preservam sua cultura e patrimônio histórico.",
    porQueImporta:
      "A maior parte dos brasileiros vive em cidades. Planejar bem o espaço urbano evita enchentes, melhora o trânsito e a qualidade de vida.",
    pertoDeVoce:
      "Cataguases é conhecida pelo seu patrimônio da arquitetura modernista e pela tradição do cinema. Que patrimônios culturais existem na sua cidade?",
    ideias: [
      "Patrimônio histórico e cultural da minha cidade",
      "Mobilidade urbana: bicicleta, ônibus e calçadas acessíveis",
      "Como seria a cidade ideal (com ideias dos moradores)",
    ],
    perguntas: [
      "O que torna uma cidade sustentável?",
      "Por que preservar o patrimônio histórico?",
      "Que problemas urbanos existem no seu bairro e como resolvê-los?",
    ],
  },
  {
    numero: 12,
    nome: "Consumo e Produção Responsáveis",
    cor: "#BF8B2E",
    lema: "Assegurar padrões de produção e de consumo sustentáveis.",
    resumo:
      "Este ODS propõe produzir e consumir de forma consciente: gerar menos lixo, reciclar, reaproveitar e escolher produtos que respeitem o meio ambiente e as pessoas.",
    porQueImporta:
      "Consumimos mais recursos do que o planeta consegue repor. Lixo eletrônico, plástico e fast fashion são grandes desafios atuais.",
    pertoDeVoce:
      "Sua cidade tem coleta seletiva? Existem cooperativas de catadores ou pontos de descarte de lixo eletrônico?",
    ideias: [
      "Os 5 Rs: repensar, recusar, reduzir, reutilizar e reciclar",
      "Lixo eletrônico: o que fazer com celulares e computadores velhos",
      "Moda sustentável e brechós",
    ],
    perguntas: [
      "O que é consumo consciente?",
      "Para onde vai o lixo da sua cidade?",
      "Como a reciclagem gera renda e emprego?",
    ],
  },
  {
    numero: 13,
    nome: "Ação Contra a Mudança Global do Clima",
    cor: "#3F7E44",
    lema: "Tomar medidas urgentes para combater a mudança do clima e seus impactos.",
    resumo:
      "As mudanças climáticas causam ondas de calor, secas, enchentes e tempestades mais fortes. Este ODS busca reduzir a emissão de gases poluentes e preparar as cidades para esses eventos.",
    porQueImporta:
      "Os jovens de hoje são a geração que mais vai sentir os efeitos das mudanças climáticas, e também a que pode fazer a maior diferença.",
    pertoDeVoce:
      "Sua região já sofreu com enchentes ou secas fortes? Como a Defesa Civil da sua cidade se prepara para eventos extremos?",
    ideias: [
      "O que é o efeito estufa (com ilustrações simples)",
      "Eventos climáticos extremos no Brasil",
      "Atitudes para reduzir sua pegada de carbono",
    ],
    perguntas: [
      "Qual a diferença entre tempo e clima?",
      "Por que o planeta está esquentando?",
      "O que a sua escola pode fazer pelo clima?",
    ],
  },
  {
    numero: 14,
    nome: "Vida na Água",
    cor: "#0A97D9",
    lema: "Conservar e usar de forma sustentável os oceanos, mares e recursos marinhos.",
    resumo:
      "Oceanos regulam o clima e abrigam milhões de espécies. Este ODS combate a poluição por plástico, a pesca predatória e protege os ecossistemas aquáticos.",
    porQueImporta:
      "Grande parte do lixo que chega ao mar vem dos rios. Ou seja, mesmo longe do litoral, o que fazemos em Minas Gerais afeta o oceano.",
    pertoDeVoce:
      "Os rios da Zona da Mata seguem até o mar pela bacia do Paraíba do Sul. Que peixes e animais vivem nos rios da sua região?",
    ideias: [
      "Do rio ao mar: como o lixo chega ao oceano",
      "Animais aquáticos ameaçados",
      "Como reduzir o uso de plástico",
    ],
    perguntas: [
      "Por que os oceanos são importantes para quem não mora no litoral?",
      "Quanto tempo o plástico leva para se decompor?",
      "O que é pesca sustentável?",
    ],
  },
  {
    numero: 15,
    nome: "Vida Terrestre",
    cor: "#56C02B",
    lema: "Proteger, recuperar e promover o uso sustentável das florestas e da biodiversidade terrestre.",
    resumo:
      "Este ODS cuida das florestas, dos solos e dos animais e plantas terrestres: combater o desmatamento, recuperar áreas degradadas e proteger espécies ameaçadas.",
    porQueImporta:
      "O Brasil tem uma das maiores biodiversidades do planeta. A Mata Atlântica, bioma da Zona da Mata, é um dos mais ameaçados.",
    pertoDeVoce:
      "A própria Zona da Mata leva esse nome por causa da Mata Atlântica. Existem parques, reservas ou áreas de reflorestamento na sua região?",
    ideias: [
      "Mata Atlântica: o bioma da nossa região",
      "Animais e plantas ameaçados de extinção",
      "Projetos de reflorestamento e como participar",
    ],
    perguntas: [
      "O que é biodiversidade?",
      "Por que a Mata Atlântica está ameaçada?",
      "Como o desmatamento afeta a água e o clima?",
    ],
  },
  {
    numero: 16,
    nome: "Paz, Justiça e Instituições Eficazes",
    cor: "#00689D",
    lema: "Promover sociedades pacíficas e inclusivas, acesso à justiça e instituições eficazes e transparentes.",
    resumo:
      "Este ODS busca reduzir a violência, combater a corrupção, garantir acesso à justiça e fortalecer instituições transparentes, onde todos possam participar das decisões.",
    porQueImporta:
      "Sem paz e instituições confiáveis, nenhum outro objetivo avança. Participar, votar e se informar são formas de cidadania.",
    pertoDeVoce:
      "Você sabe como funciona a Câmara de Vereadores da sua cidade? Existe grêmio estudantil na sua escola?",
    ideias: [
      "Cidadania digital: fake news, cyberbullying e segurança na internet",
      "Como funcionam os poderes e onde o jovem pode participar",
      "Cultura de paz na escola",
    ],
    perguntas: [
      "O que é cidadania?",
      "Como identificar uma notícia falsa?",
      "De que formas um jovem pode participar das decisões da cidade?",
    ],
  },
  {
    numero: 17,
    nome: "Parcerias e Meios de Implementação",
    cor: "#19486A",
    lema: "Fortalecer os meios de implementação e revitalizar a parceria global para o desenvolvimento sustentável.",
    resumo:
      "Nenhum país, empresa ou pessoa consegue cumprir os ODS sozinho. Este objetivo incentiva parcerias entre governos, empresas, ONGs e sociedade, além do compartilhamento de tecnologia e conhecimento.",
    porQueImporta:
      "Parcerias multiplicam resultados. O próprio Meu Primeiro Site nasceu de uma parceria entre a Junior Achievement, o Instituto Energisa e voluntários.",
    pertoDeVoce:
      "Que parcerias entre escolas, empresas e ONGs existem na sua cidade? O Rio Pomba Valley é um exemplo de parceria pela inovação.",
    ideias: [
      "Exemplos de parcerias que transformam comunidades",
      "O que são os ODS e a Agenda 2030 (visão geral dos 17)",
      "Voluntariado: como ser parte da mudança",
    ],
    perguntas: [
      "Por que parcerias são importantes para os ODS?",
      "O que é a Agenda 2030?",
      "Como empresas e ONGs podem trabalhar juntas?",
    ],
  },
];

export function getOds(numero: number): Ods | undefined {
  return ODS.find((o) => o.numero === numero);
}

/** Mistura uma cor hex com outra (0 = só a cor, 1 = só a outra). */
export function misturar(hex: string, com: string, peso: number): string {
  const a = hexParaRgb(hex);
  const b = hexParaRgb(com);
  const r = a.map((v, i) => Math.round(v + (b[i] - v) * peso));
  return "#" + r.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

/** Escolhe texto preto ou branco com melhor contraste sobre a cor. */
export function corDoTexto(hex: string): "#FFFFFF" | "#111827" {
  const [r, g, b] = hexParaRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const contrasteBranco = 1.05 / (lum + 0.05);
  const contrastePreto = (lum + 0.05) / (0.0417 + 0.05);
  return contrasteBranco >= contrastePreto ? "#FFFFFF" : "#111827";
}

/** Paleta sugerida para o site do aluno a partir da cor do ODS. */
export function paletaSugerida(hex: string) {
  return [
    { nome: "principal", cor: hex.toUpperCase() },
    { nome: "escura", cor: misturar(hex, "#000000", 0.35) },
    { nome: "clara", cor: misturar(hex, "#FFFFFF", 0.85) },
    { nome: "texto", cor: "#1F2937" },
  ];
}

function hexParaRgb(hex: string): number[] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
