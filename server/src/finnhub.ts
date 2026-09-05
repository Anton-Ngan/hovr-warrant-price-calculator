const BASE = "https://finnhub.io/api/v1/quote";

export interface Quote {
  c: number;
  t: number;
}

export async function fetchQuote(symbol: string): Promise<Quote> {
  const token = process.env.FINNHUB_TOKEN;
  if (!token) {
    throw new Error("FINNHUB_TOKEN is missing from .env");
  }

  const url = `${BASE}?symbol=${encodeURIComponent(symbol)}&token=${token}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Finnhub ${symbol} HTTP ${response.status}`);
  }

  const body = (await response.json()) as Quote;
  if (typeof body.c !== "number" || body.c === 0) {   // c === 0 is Finnhub’s “unknown symbol / no data” shape.
    throw new Error(`Finnhub ${symbol} returned no price`);
  }
  return body;
}

export async function getCurrent() {
  const [stock, warrant] = await Promise.all([
    fetchQuote("HOVR"),
    fetchQuote("HOVRW"),
  ]);

  return {
    stockPrice: stock.c,
    warrantPrice: warrant.c,
    timestamp: Date.now(),
  };
}