import "dotenv/config";
import { loadCSVClosePrices, type Ticker } from "../csvStore.js";
import { appendPgCloseIfAbsent, ensureSchema } from "../pgStore.js";

async function seedTicker(ticker: Ticker): Promise<number> {
  const rows = loadCSVClosePrices(ticker);
  let added = 0;
  for (const [date, close] of rows) {
    const wrote = await appendPgCloseIfAbsent(ticker, date, close);
    if (wrote) added += 1;
  }
  return added;
}

await ensureSchema();
const hovr = await seedTicker("HOVR");
const hovrw = await seedTicker("HOVRW");
console.log(`seeded HOVR +${hovr} HOVRW +${hovrw}`);