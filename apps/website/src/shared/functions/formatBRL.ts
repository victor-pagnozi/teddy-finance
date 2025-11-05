export function formatBRL(value: number | undefined) {
  const v = Number.isFinite(value as number) ? (value as number) : 0;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(v);
}
