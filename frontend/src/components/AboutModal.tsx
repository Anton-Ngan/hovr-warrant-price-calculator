import { useEffect } from "react";
import { HOVR, RISK_FREE_RATE } from "../lib/constants";
import { formatDate, formatNumber, formatPercent } from "../lib/format";
import { parseDateInputValue } from "../lib/time";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const expiry = parseDateInputValue(HOVR.expiry);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        className="bg-slate-900 rounded-lg max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 id="about-title" className="text-lg font-semibold">
            About this tool
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <p>
            A payoff and risk-profile calculator for {HOVR.company} (
            {HOVR.stockTicker}/{HOVR.warrantTicker}) {HOVR.sector} warrants.
            It prices the warrant with Black-Scholes, lets you plan or track a
            mixed stock+warrant book, and compares that book to all-stock,
            all-warrant, and forced-redemption outcomes.
          </p>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              Warrant terms
            </h3>
            <ul className="space-y-1 text-slate-400">
              <li>Strike {HOVR.strike.toFixed(2)} USD</li>
              <li>Expiry {formatDate(expiry)}</li>
              <li>
                Redemption ${HOVR.redemptionTrigger.toFixed(0)} ({HOVR.redemptionRule})
              </li>
              <li>
                Warrant supply {formatNumber(HOVR.totalWarrants, 0)}
              </li>
              <li>
                Shares outstanding {formatNumber(HOVR.sharesOutstanding.value, 0)}{" "}
                (as of {HOVR.sharesOutstanding.asof}, not live)
              </li>
              <li>
                Risk-free rate {formatPercent(RISK_FREE_RATE, 2)} (Treasury proxy)
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              What it assumes
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>
                The warrant is modelled as a European call. Early exercise and
                the exact redemption mechanics are simplified.
              </li>
              <li>
                Implied vol is solved from today&apos;s HOVRW price and today&apos;s
                time to expiry, then held fixed when you move the model date
                (so you can see theta). An IV override replaces that.
              </li>
              <li>
                Historical charts are simulated until live market data (Phase 3).
              </li>
            </ul>
          </div>

          <p className="text-slate-500 text-xs leading-relaxed">
            Informational only — not advice or a recommendation. Data and
            calculations may be wrong or delayed. Black-Scholes is a model, not
            the market. Verify independently before making any decision.
          </p>
        </div>
      </div>
    </div>
  );
}