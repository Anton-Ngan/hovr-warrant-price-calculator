import { useBlackScholes } from "../hooks/useBlackScholes";
import { HOVR, RISK_FREE_RATE } from "../lib/constants";
import { formatDate, formatNumber, formatPercent } from "../lib/format";
import { getDateAtOffset, parseDateInputValue } from "../lib/time";
import type { ModelInputs } from "../lib/types";

interface ModelTermsProps {
  modelInputs: ModelInputs;
}

export function ModelTerms({ modelInputs }: ModelTermsProps) {
  const bs = useBlackScholes(modelInputs);
  const expiry = parseDateInputValue(HOVR.expiry);
  const modelDate = getDateAtOffset(modelInputs.modelDateOffsetDays);
  const daysLeft = Math.round(bs.T * 365.2425);

  const ivLabel =
    modelInputs.impliedVolOverride !== null
      ? "IV override"
      : "Market-implied IV";

  const rows = [
    {
      name: "Expiry",
      value: formatDate(expiry),
      hint: HOVR.warrantTicker,
    },
    {
      name: "Time to expiry",
      value: `${bs.T.toFixed(2)}y`,
      hint: `${daysLeft}d on the model date`,
    },
    {
      name: "Treasury",
      value: formatPercent(RISK_FREE_RATE, 2),
      hint: "Risk-free rate used in BS",
    },
    {
      name: "Model date",
      value: formatDate(modelDate),
      hint: "Scenario date, not the trade date",
    },
    {
      name: ivLabel,
      value: formatPercent(bs.iv),
      hint:
        modelInputs.impliedVolOverride !== null
          ? "Typed in Model Inputs"
          : "Solved from HOVRW vs today T",
    },
    {
      name: "Warrant supply",
      value: formatNumber(HOVR.totalWarrants, 0),
      hint: "Public + private placement",
    },
    {
      name: "Shares outstanding",
      value: formatNumber(HOVR.sharesOutstanding.value, 0),
      hint: `As of ${HOVR.sharesOutstanding.asof} — not live`,
    },
    {
      name: "Redemption",
      value: `$${HOVR.redemptionTrigger.toFixed(0)}`,
      hint: HOVR.redemptionRule,
    },
  ];

  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-300 mb-3">Model Terms</h2>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.name}
            className="flex items-baseline justify-between gap-3 bg-slate-800 rounded-lg p-3"
          >
            <div>
              <div className="text-sm text-slate-200">{row.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{row.hint}</div>
            </div>
            <div className="text-lg font-semibold tabular-nums whitespace-nowrap">
              {row.value}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}