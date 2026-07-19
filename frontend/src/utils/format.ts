/**
 * Shared formatting utilities used across the application.
 * Centralises locale-specific formatting so it can be changed in one place.
 */

const LOCALE = "en-IN";

/**
 * Format a number as Indian Rupees.
 * Handles Prisma Decimal values serialised as strings.
 * @example formatCurrency(1250000) → "₹12,50,000"
 */
export function formatCurrency(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "₹—";
  return `₹${num.toLocaleString(LOCALE)}`;
}

/**
 * Format an integer with locale-appropriate grouping separators.
 * @example formatNumber(100000) → "1,00,000"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString(LOCALE);
}

/**
 * Format an ISO date string as a short readable date.
 * @example formatDate("2024-03-15T10:30:00Z") → "15 Mar 2024"
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format an ISO date string as a short time.
 * @example formatTime("2024-03-15T10:30:00Z") → "10:30 AM"
 */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Capitalise the first letter of a string and lowercase the rest.
 * Useful for rendering Prisma enum values.
 * @example titleCase("HATCHBACK") → "Hatchback"
 */
export function titleCase(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
