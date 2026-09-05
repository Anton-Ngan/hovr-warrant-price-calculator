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
        className="bg-zinc-900 rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 id="about-title" className="text-lg font-semibold">
            About this tool
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-2.5 py-1 rounded-md text-zinc-300 hover:text-white hover:bg-white/5"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 text-sm text-zinc-300">
          <p>
            A payoff and risk-profile calculator for {HOVR.company} (
            {HOVR.stockTicker}/{HOVR.warrantTicker}) {HOVR.sector} warrants.
            It prices the warrant with Black-Scholes, lets you plan or track a
            mixed stock+warrant book, and compares that book to all-stock,
            all-warrant, and forced-redemption outcomes.
          </p>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
              Warrant terms
            </h3>
            <ul className="space-y-1 text-zinc-300">
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
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
              What it assumes
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-zinc-300">
              <li>
                The warrant is modelled as a European call. Early exercise and
                the exact redemption mechanics are simplified.
              </li>
              <li>
                Implied vol is solved from today&apos;s HOVRW price and today&apos;s
                time to expiry, then held fixed when you move the model date
                (so you can see theta). An IV override replaces that.
              </li>
            </ul>
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed">
            Informational only, this is not advice or a recommendation. Data and
            calculations may be wrong or delayed. Black-Scholes is a model, not
            the market. Verify independently before making any decision.
          </p>
        </div>
      </div>
    </div>
  );
}