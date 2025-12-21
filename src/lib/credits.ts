export const CREDIT_UNITS_PER_CREDIT = 10;
export const CHAT_CREDIT_UNITS = 1;
export const RENDER_CREDIT_UNITS = 10;
export const MINIMUM_CREDITS_UNITS = CREDIT_UNITS_PER_CREDIT;

export function creditsToUnits(credits: number): number {
  return Math.round(credits * CREDIT_UNITS_PER_CREDIT);
}

export function unitsToCredits(units: number): number {
  return units / CREDIT_UNITS_PER_CREDIT;
}

export function formatCredits(units: number): string {
  const value = unitsToCredits(units);
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}
