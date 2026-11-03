export type Turma = {
  id: string;
  nome: string;
  escola: string | null;
  cidade: string | null;
  codigo: string;
  ativa: boolean;
  created_at: string;
};

export type Instrutor = {
  id: string;
  nome: string;
  foto_url: string | null;
  bio: string | null;
};

export type Material = { titulo: string; url: string };

export type Aula = {
  id: string;
  numero: number;
  slug: string;
  titulo: string;
  data: string | null;
  resumo_md: string;
  conteudo_md: string;
  materiais: Material[];
  publicada: boolean;
};

export type AulaComInstrutores = Aula & { instrutores: Instrutor[] };

export type Site = {
  id: string;
  titulo: string;
  descricao: string;
  url: string;
  imagem_url: string | null;
  categoria: string | null;
  ods_numero: number | null;
  ordem: number;
  created_at: string;
};

export type AvaliacaoAula = {
  id: string;
  aula_id: string;
  turma_id: string;
  nota_geral: number;
  nota_conteudo: number;
  nota_ritmo: number;
  comentario: string | null;
  created_at: string;
};

export type AvaliacaoInstrutor = {
  id: string;
  avaliacao_id: string;
  instrutor_id: string;
  nota_clareza: number;
  nota_dominio: number;
  nota_atencao: number;
  comentario: string | null;
};
