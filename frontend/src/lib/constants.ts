export const HOVR = {
  company: "Horizon Aircraft",
  stockTicker: "HOVR",
  warrantTicker: "HOVRW",
  strike: 11.5,
  expiry: "2029-01-12", // https://www.cnbc.com/quotes/HOVRW
  redemptionTrigger: 18.0,
  redemptionRule: "20 of 30 trading days",
  // https://www.sec.gov/Archives/edgar/data/1930021/000121390024042349/ea0205917-424b3_newhorizon.htm
  // Pono Public Warrants + Pono Private Placement Warrants = 11,500,000 + 565,375 = 12,065,375
  totalWarrants: 12_065_375,
  // https://au.finance.yahoo.com/quote/HOVR/key-statistics/
  sharesOutstanding: {
    value: 66_830_000,
    asof: "2026-08-21",
  },
  sector: "eVTOL / Aerospace",
};
