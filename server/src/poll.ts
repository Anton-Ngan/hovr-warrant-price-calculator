import { appendCloseIfAbsent, type Ticker } from "./csvStore.js";
import { fetchQuote, type Quote } from "./finnhub.js";
import { formatEtDate, isAfterCloseEt, isWeekdayEt } from "./marketHours.js";

export interface LiveQuotes {
  stockPrice: number;
  warrantPrice: number;
  timestamp: number;
}

let liveCache: LiveQuotes | null = null;

export function getLiveCache(): LiveQuotes | null {
  return liveCache;
}

function maybeAppend(ticker: Ticker, quote: Quote, now: Date): void {
  if (!isWeekdayEt(now) || !isAfterCloseEt(now)) return;

  const todayEt = formatEtDate(now);
  const tradeDayEt = formatEtDate(new Date(quote.t * 1000));
  // HOVRW is thinly traded. Finnhub may return a price of yesterday's last sale.
  // Skip if the trade day is not today.
  if (tradeDayEt !== todayEt) return;  

  const wrote = appendCloseIfAbsent(ticker, todayEt, quote.c);
  if (wrote) console.log(`appended ${ticker} ${todayEt} ${quote.c}`);
}

export async function pollOnce(): Promise<void> {
  const now = new Date();
  const [stock, warrant] = await Promise.all([
    fetchQuote("HOVR"),
    fetchQuote("HOVRW"),
  ]);

  liveCache = {
    stockPrice: stock.c,
    warrantPrice: warrant.c,
    timestamp: Date.now(),
  };

  maybeAppend("HOVR", stock, now);
  maybeAppend("HOVRW", warrant, now);
}

export function startPoller(ms = 60_000): void {
  void pollOnce();
  setInterval(() => {
    void pollOnce().catch((err) => console.error("poll failed", err));
  }, ms);
}