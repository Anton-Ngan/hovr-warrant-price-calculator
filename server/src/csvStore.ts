import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DATA_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../data",
);

export const CSV_PATH = {
  HOVR: path.join(DATA_DIR, "hovr_daily_closing_price.csv"),
  HOVRW: path.join(DATA_DIR, "hovrw_daily_closing_price.csv"),
} as const;

export type Ticker = keyof typeof CSV_PATH;

/** "4/6/2023 16:00:00" → "2023-04-06" */
export function parseCsvDate(raw: string): string {
  const mdy = raw.trim().split(" ")[0];
  if (mdy === undefined) {
    throw new Error(`Bad CSV date: ${raw}`);
  }
  const [m, d, y] = mdy.split("/").map(Number);
  if (m === undefined || d === undefined || y === undefined) {
    throw new Error(`Bad CSV date: ${raw}`);
  }
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function loadCSVClosePrices(ticker: Ticker): Map<string, number> {
  const map = new Map<string, number>();
  const lines = readFileSync(CSV_PATH[ticker], "utf8").trim().split("\n").slice(1);

  for (const line of lines) {
    const [dateRaw, closeRaw] = line.split(",");
    if (dateRaw === undefined || closeRaw === undefined) {
      throw new Error(`Bad CSV row: ${line}`);
    }
    map.set(parseCsvDate(dateRaw), Number(closeRaw));
  }
  return map;
}