import { useEffect, useState } from "react";

export interface HistoryPoint {
  [key: string]: number;
  date: number;
  stockPrice: number;
  warrantPrice: number;
  iv: number;
}

export function useHistoricalData() {
  const [points, setPoints] = useState<HistoryPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<HistoryPoint[]>;
      })
      .then(setPoints)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "history failed"),
      );
  }, []);

  return { points, error };
}