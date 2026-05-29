export function text(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function numberValue(formData: FormData, key: string) {
  const input = text(formData, key, "0");
  const raw = input.includes(",")
    ? input.replace(/\./g, "").replace(",", ".")
    : input;
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
}

export function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? value : null;
}

export function nullableDate(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? new Date(`${value}T12:00:00`) : null;
}
