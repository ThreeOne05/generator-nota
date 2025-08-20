export const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const formatNumID = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const formatLongDateID = (date: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

export const formatFromDateInput = (dateStr: string) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return formatLongDateID(date);
};

// Helpers input rupiah & digit
export const onlyDigits = (s: string) => s.replace(/\D/g, "");
export const toRupiahInput = (n: number) => `Rp ${formatNumID(n)}`;
export const parseDigitsToNumber = (s: string): number | "" => {
  const d = onlyDigits(s);
  return d === "" ? "" : Number(d);
};
