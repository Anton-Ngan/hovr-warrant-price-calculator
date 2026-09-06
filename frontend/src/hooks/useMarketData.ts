import { useEffect, useState } from "react";
import type { ModelInputs } from "../lib/types";
import { apiUrl } from "../lib/api";

interface CurrentQuote {
  stockPrice: number;
  warrantPrice: number;
}

export type QuoteStatus = "loading" | "live" | "error";

export function useMarketData(
  setModelInputs: React.Dispatch<React.SetStateAction<ModelInputs>>,
): { quoteStatus: QuoteStatus } {
  const [quoteStatus, setQuoteStatus] = useState<QuoteStatus>("loading");

  useEffect(() => {
    const pull = () => {
      fetch(apiUrl("/api/current"))
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json() as Promise<CurrentQuote>;
        })
        .then((d) => {
          setModelInputs((prev) => ({
            ...prev,
            stockPrice: d.stockPrice,
            warrantPrice: d.warrantPrice,
          }));
          setQuoteStatus("live");
        })
        .catch((err) => {
          console.error("live quote failed", err);
          setQuoteStatus("error");
        });
    };

    pull();
    const id = window.setInterval(pull, 60_000);
    return () => window.clearInterval(id);
  }, [setModelInputs]);

  return { quoteStatus };
}