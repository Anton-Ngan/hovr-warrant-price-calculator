import { useDeferredValue, useState } from "react";
import type {
  ModelInputs,
  Position,
  ViewMode,
  HistoricalMetric,
} from "./lib/types";
import { HOVR } from "./lib/constants";
import { MetricsBar } from "./components/MetricsBar";
import { PositionBuilder } from "./components/PositionBuilder";
import { ModelPayOffInputs } from "./components/ModelPayOffInputs";
import { PayoffChart } from "./components/PayoffChart";
import { ChartCapSlider } from "./components/ChartCapSlider";
import type { PayoffPoint } from "./lib/payoff";
import { GreeksGrid } from "./components/GreeksGrid";
import { ThresholdList } from "./components/ThresholdList";
import { ModelTerms } from "./components/ModelTerms";

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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 space y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-x1 font bold">{HOVR.warrantTicker} Risk Profile</h1>
        <button className="text-sm text-slate-400 hover:text-white">
          About
        </button>
      </header>

      <MetricsBar modelInputs={modelInputs} position={position} hoveredPoint={hoveredPoint}/>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-lg p-4">
          <PositionBuilder
            position={position}
            modelInputs={modelInputs}
            onChange={setPosition}
          />
        </div>
        <div className="bg-slate-900 rounded-lg p-4">
          <ModelPayOffInputs
            modelInputs={modelInputs}
            onChange={setModelInputs}
          />
        </div>
      </section>

      {/* View toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setViewMode("model")}
          className={`px-3 py-1 rounded ${viewMode === "model" ? "bg-blue-600" : "bg-slate-800"}`}
        >
          Model
        </button>
        <button
          onClick={() => setViewMode("historical")}
          className={`px-3 py-1 rounded ${viewMode === "historical" ? "bg-blue-600" : "bg-slate-800"}`}
        >
          Historical
        </button>
      </div>

      <section className="bg-slate-900 rounded-lg p-4 space-y-3">
      {viewMode === "model" ? (
        <>
          <ChartCapSlider value={chartCap} onChange={setChartCap} />
          <PayoffChart
            modelInputs={deferredModelInputs}
            position={deferredPosition}
            chartCap={deferredChartCap}
            onHover={setHoveredPoint}
          />
        </>
      ) : (
        <div className="h-64 flex items-center justify-center text-slate-500">
          Historical chart placeholder ({historicalMetric})
        </div>
      )}
    </section>

    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-900 rounded-lg p-4">
        <GreeksGrid
          modelInputs={modelInputs}
          hoveredPoint={hoveredPoint}
        />
      </div>
      <div className="bg-slate-900 rounded-lg p-4">
        <ThresholdList
          modelInputs={modelInputs}
          position={position}
          chartCap={chartCap}
          hoveredPoint={hoveredPoint}
        />
      </div>
    </section>

    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-900 rounded-lg p-4">
        <ModelTerms modelInputs={modelInputs} />
      </div>
    </section>

    {/* Footer */}
    <footer className="text-xs text-slate-500 text-center py-4">
      Not financial advice. Model limitations apply — verify independently.
    </footer>
  </div>
  );
}

export default App;
