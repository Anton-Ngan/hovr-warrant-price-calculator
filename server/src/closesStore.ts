import {
    appendCloseIfAbsent as appendCsv,
    loadCSVClosePrices,
    type Ticker,
} from "./csvStore.js";
import {
    appendPgCloseIfAbsent,
    loadPgCloses,
} from "./pgStore.js";
  
export type { Ticker };

function usePostgres(): boolean {
    return Boolean(process.env.DATABASE_URL);
}

export async function loadCloses(ticker: Ticker): Promise<Map<string, number>> {
    if (usePostgres()) return loadPgCloses(ticker);
    return loadCSVClosePrices(ticker);
}

export async function appendCloseIfAbsent(
    ticker: Ticker,
    yyyyMmDd: string,
    close: number,
    ): Promise<boolean> {
    if (usePostgres()) return appendPgCloseIfAbsent(ticker, yyyyMmDd, close);
    return appendCsv(ticker, yyyyMmDd, close);
}