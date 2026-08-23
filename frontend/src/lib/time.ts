import { HOVR } from "./constants";

export function yearsBetween(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24 * 365.2425);
}

export function getBaseYearsToExpiry(): number {
  return Math.max(0, yearsBetween(new Date(), new Date(HOVR.expiry)));
}

export function getBaseDaysToExpiry(): number {
  return Math.round(getBaseYearsToExpiry() * 365.2425);
}

export function getDateAtOffset(offsetDays: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date;
}
