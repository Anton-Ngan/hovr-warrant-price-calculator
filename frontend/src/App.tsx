import { useDeferredValue, useState } from "react";
import type {
  ModelInputs,
  Position,
  ViewMode,
  HistoricalMetric,
} from "./lib/types";
import { HOVR } from "./lib/constants";
import { MetricsBar } from "./components/MetricsBar";
import { PositionBuilder } from "./components/Position/PositionBuilder";
import { ModelPayOffInputs } from "./components/ModelPayOffInputs";
import { PayoffChart } from "./components/PayoffChart";
import { ChartCapSlider } from "./components/ChartCapSlider";
import type { PayoffPoint } from "./lib/payoff";
import { GreeksGrid } from "./components/GreeksGrid";
import { ThresholdList } from "./components/ThresholdList";
import { ModelTerms } from "./components/ModelTerms";
import { HistoricalChart } from "./components/HistoricalChart";
import { AboutModal } from "./components/AboutModal";
import { Card } from "./components/UI/Card";
import { ModelDateControl } from "./components/ModelDateControl";
import { SegmentedControl } from "./components/UI/SegmentedControl";
import { formatDate } from "./lib/format";

function App() {
  const [modelInputs, setModelInputs] = useState<ModelInputs>({
    stockPrice: 3.5,
    warrantPrice: 0.9,
    impliedVolOverride: null,
    modelDateOffsetDays: 0,
  });

  const [position, setPosition] = useState<Position>({
    mode: "plan",
    investment: 10_000,
    allocationPct: 50,
  });

  const [viewMode, setViewMode] = useState<ViewMode>("model");
  const [historicalMetric, setHistoricalMetric] =
    useState<HistoricalMetric>("price");

  const [chartCap, setChartCap] = useState(25);

  const [hoveredPoint, setHoveredPoint] = useState<PayoffPoint | null>(null);
  const deferredModelInputs = useDeferredValue(modelInputs);
  const deferredPosition = useDeferredValue(position);
  const deferredChartCap = useDeferredValue(chartCap);

  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-zinc-950 text-zinc-100 font-sans">
      <header className="shrink-0 flex items-center justify-between gap-4 px-4 py-2 border-b border-white/5">
        <div className="flex items-baseline gap-3 min-w-0">
          <h1 className="text-lg font-semibold tracking-tight truncate">
            {HOVR.stockTicker} & {HOVR.warrantTicker} Risk Profile
          </h1>
          <span className="text-sm text-zinc-400 tabular-nums shrink-0">
            {formatDate(new Date())}
          </span>
        </div>
        <button
          type="button"
          className="text-xs px-2.5 py-1 rounded-md text-zinc-300 hover:text-white hover:bg-white/5 shrink-0"
          onClick={() => setAboutOpen(true)}
        >
          About
        </button>
        <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      </header>

      <div className="flex-1 min-h-0 grid grid-cols-[280px_minmax(0,1fr)_300px] gap-3 p-3">
        <aside className="min-h-0 flex flex-col gap-3 overflow-y-auto">
          <Card className="shrink-0">
            <PositionBuilder
              position={position}
              modelInputs={modelInputs}
              onChange={setPosition}
            />
          </Card>
          <Card className="shrink-0">
            <ModelPayOffInputs
              modelInputs={modelInputs}
              onChange={setModelInputs}
            />
          </Card>
        </aside>

        <main className="min-h-0 flex flex-col gap-2">
          <div className="flex items-start gap-3 shrink-0">
            <div className="shrink-0 pt-0.5">
              <SegmentedControl
                value={viewMode}
                onChange={(next) => {
                  setViewMode(next);
                  if (next === "historical") setHoveredPoint(null);
                }}
                options={[
                  { id: "model", label: "Model" },
                  { id: "historical", label: "Historical" },
                ]}
              />
            </div>
            {viewMode === "model" ? (
              <>
                <ModelDateControl
                  modelInputs={modelInputs}
                  onChange={setModelInputs}
                />
                <ChartCapSlider value={chartCap} onChange={setChartCap} />
              </>
            ) : null}
          </div>

          <Card className="flex-1 min-h-0 p-2 overflow-hidden">
            {viewMode === "model" ? (
              <PayoffChart
                modelInputs={deferredModelInputs}
                position={deferredPosition}
                chartCap={deferredChartCap}
                onHover={setHoveredPoint}
              />
            ) : (
              <HistoricalChart
                metric={historicalMetric}
                onMetricChange={setHistoricalMetric}
              />
            )}
          </Card>
        </main>

        <aside className="min-h-0 flex flex-col gap-3 overflow-y-auto">
          <Card className="shrink-0">
            <MetricsBar
              modelInputs={modelInputs}
              position={position}
              hoveredPoint={hoveredPoint}
            />
          </Card>
          <Card className="shrink-0">
            <ThresholdList
              modelInputs={modelInputs}
              position={position}
              chartCap={chartCap}
              hoveredPoint={hoveredPoint}
            />
          </Card>
          <Card className="shrink-0">
            <GreeksGrid
              modelInputs={modelInputs}
              hoveredPoint={hoveredPoint}
            />
          </Card>
          <Card className="shrink-0">
            <ModelTerms modelInputs={modelInputs} />
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default App;
