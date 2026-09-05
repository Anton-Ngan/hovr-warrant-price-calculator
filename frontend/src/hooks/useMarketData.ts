import { useEffect } from "react";
import type { ModelInputs } from "../lib/types";

interface CurrentQuote {
  stockPrice: number;
  warrantPrice: number;
}

export function useMarketData(
  setModelInputs: React.Dispatch<React.SetStateAction<ModelInputs>>,
) {
  useEffect(() => {
    const pull = () => {
      fetch("/api/current")
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
        })
        .catch((err) => console.error("live quote failed", err));
    };

    pull();
    const id = window.setInterval(pull, 60_000);
    return () => window.clearInterval(id);
  }, [setModelInputs]);
}