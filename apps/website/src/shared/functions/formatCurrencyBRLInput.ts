export function formatCurrencyBRLInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const number = Number(digits) / 100;
  const formatted = number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R$ ${formatted}`;
}
