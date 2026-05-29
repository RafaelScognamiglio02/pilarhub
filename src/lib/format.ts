export const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export const percent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

export function money(value: number) {
  return currency.format(value || 0);
}

export function ratio(value: number) {
  return percent.format(Number.isFinite(value) ? value : 0);
}

export function labelize(value?: string | null) {
  if (!value) return "-";
  return value
    .replace(/_/g, " ")
    .replace("Itau", "Itaú")
    .replace("Acoes", "Ações")
    .replace("Renda Fixa", "Renda Fixa");
}

export function inputDate(value?: Date | null) {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}
