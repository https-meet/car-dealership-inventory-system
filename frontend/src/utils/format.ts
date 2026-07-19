const LOCALE = "en-IN";

export function formatCurrency(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return "INR --";
  return `INR ${num.toLocaleString(LOCALE)}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString(LOCALE);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function titleCase(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
