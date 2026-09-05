import { HOVR } from "./constants.js";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}

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

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateInputValue(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  if (year === undefined || month === undefined || day === undefined) {
    throw new Error(`Invalid date: ${value}`);
  }
  return new Date(year, month - 1, day);
}
