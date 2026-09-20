/**
 * ELVARIA BEAUTY — Reusable Currency & Price Formatter
 * Supports international currencies with configurable default (USD).
 * All prices across the storefront, cart, checkout, and admin use this utility.
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
  decimals: number;
}

export const DEFAULT_CURRENCY: CurrencyConfig = {
  code: 'USD',
  symbol: '$',
  locale: 'en-US',
  decimals: 2,
};

/**
 * Formats a numeric price into a localized currency string.
 * Example: formatPrice(29) => "$29.00"
 */
export function formatPrice(
  amount: number,
  currencyCode?: string | null,
  locale = 'en-US'
): string {
  const code = (currencyCode || 'USD').toUpperCase();
  if (typeof amount !== 'number' || isNaN(amount)) {
    return code === 'USD' ? '$0.00' : `0.00 ${code}`;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback if locale or currency code is unfamiliar
    return `${code} ${amount.toFixed(2)}`;
  }
}

export function getCurrencySymbol(currencyCode?: string | null): string {
  const code = (currencyCode || 'USD').toUpperCase();
  if (code === 'USD') return '$';
  if (code === 'EUR') return '€';
  if (code === 'GBP') return '£';
  if (code === 'CAD') return 'CA$';
  if (code === 'AUD') return 'AU$';
  return code;
}
