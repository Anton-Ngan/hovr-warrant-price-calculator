import { Pool } from "pg";
import type { Ticker } from "./csvStore.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});

export async function loadPgCloses(ticker: Ticker): Promise<Map<string, number>> {
  const result = await pool.query<{ date: Date; close: string }>(
    `SELECT date, close FROM daily_closes WHERE ticker = $1`,
    [ticker],
  );
  const map = new Map<string, number>();
  for (const row of result.rows) {
    const iso = row.date.toISOString().slice(0, 10);
    map.set(iso, Number(row.close));
  }
  return map;
}

export async function appendPgCloseIfAbsent(
  ticker: Ticker,
  yyyyMmDd: string,
  close: number,
): Promise<boolean> {
  const result = await pool.query(
    `INSERT INTO daily_closes (ticker, date, close)
     VALUES ($1, $2::date, $3)
     ON CONFLICT (ticker, date) DO NOTHING`,
    [ticker, yyyyMmDd, close],
  );
  return (result.rowCount ?? 0) > 0;
}

export async function ensureSchema(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS daily_closes (
      ticker TEXT NOT NULL,
      date   DATE NOT NULL,
      close  NUMERIC NOT NULL,
      PRIMARY KEY (ticker, date)
    )
  `);
}