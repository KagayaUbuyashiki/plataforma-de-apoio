/** Utilidades para exibir contatos (telefone formatado e link do WhatsApp). */

/** 32999998888 → (32) 99999-8888 */
export function formatarTelefone(numeros: string): string {
  const d = numeros.replace(/\D/g, "");
  const local = d.length > 11 && d.startsWith("55") ? d.slice(2) : d;
  if (local.length === 11) return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  if (local.length === 10) return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  return numeros;
}

/** Link wa.me (acrescenta o 55 do Brasil quando o número vem só com DDD). */
export function linkWhatsapp(numeros: string): string {
  const d = numeros.replace(/\D/g, "");
  return `https://wa.me/${d.length <= 11 ? "55" + d : d}`;
}
