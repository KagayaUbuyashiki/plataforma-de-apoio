/** Formata uma data "AAAA-MM-DD" como "3 de novembro de 2026" (sem erro de fuso horário). */
export function formatarData(data: string | null): string | null {
  if (!data) return null;
  const [a, m, d] = data.split("-").map(Number);
  if (!a || !m || !d) return null;
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(a, m - 1, d)),
  );
}

export function media(valores: number[]): number | null {
  if (valores.length === 0) return null;
  return valores.reduce((s, v) => s + v, 0) / valores.length;
}

export function formatarMedia(v: number | null): string {
  return v == null ? "—" : v.toFixed(1).replace(".", ",");
}
