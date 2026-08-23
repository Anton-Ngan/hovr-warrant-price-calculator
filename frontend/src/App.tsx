import { useState } from "react";
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

function App() {
  const [modelInputs, setModelInputs] = useState<ModelInputs>({
    stockPrice: 3.5,
    warrantPrice: 0.9,
    impliedVolOverride: null,
    modelDateOffsetMonths: 0,
  });

  const [position, setPosition] = useState<Position>({
    mode: "plan",
    investment: 10_000,
    allocationPct: 50,
  });

  const [viewMode, setViewMode] = useState<ViewMode>("model");
  const [historicalMetric, setHistoricalMetric] =
    useState<HistoricalMetric>("price");

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 space y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-x1 font bold">{HOVR.warrantTicker} Risk Profile</h1>
        <button className="text-sm text-slate-400 hover:text-white">
          About
        </button>
      </header>

      <MetricsBar modelInputs={modelInputs} position={position} />

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

      {/* Main chart area */}
      <section className="bg-slate-900 rounded-lg p-4 h-64 flex items-center justify-center text-slate-500">
        {viewMode === "model"
          ? "Payoff chart placeholder"
          : `Historical chart placeholder (${historicalMetric})`}
      </section>

      {/* BS Market Check + Greeks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-lg p-4">
          BS Market Check placeholder
        </div>
        <div className="bg-slate-900 rounded-lg p-4">Greeks placeholder</div>
      </section>

      {/* Thresholds + Model Terms */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-lg p-4">
          Key Thresholds placeholder
        </div>
        <div className="bg-slate-900 rounded-lg p-4">
          Model Terms placeholder
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
