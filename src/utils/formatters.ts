/**
 * Formatting utilities for Indian Currency (INR), Numbers, and Percentages
 */

/**
 * Formats a numeric value into the Indian numbering system:
 * e.g., 500 -> ₹500
 * 2000 -> ₹2,000
 * 100000 -> ₹1,00,000
 * 1000000 -> ₹10,00,000
 */
export function formatINR(value: number, includeFraction = false): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '₹0';
  }

  const rounded = Math.round(value * 100) / 100;
  const hasFractions = rounded % 1 !== 0 || includeFraction;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: hasFractions ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(rounded);
}

/**
 * Formats a percentage value (e.g. 0.65 -> 0.65%)
 */
export function formatPercent(value: number): string {
  if (isNaN(value) || value === 0) return '0%';
  return `${value}%`;
}

/**
 * Parses user input into a clean positive number
 */
export function cleanNumericInput(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}
