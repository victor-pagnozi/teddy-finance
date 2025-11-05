export function parseCurrencyBRLToNumber(display: string): number {
  const digits = display.replace(/\D/g, "");
  return Number(digits) / 100;
}
