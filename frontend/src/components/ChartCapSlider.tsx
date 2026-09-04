interface ChartCapSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function ChartCapSlider({ value, onChange }: ChartCapSliderProps) {
  return (
    <label className="flex items-center gap-2 text-xs text-zinc-400 shrink-0">
      <span className="whitespace-nowrap uppercase tracking-wide">
        Range $0–{value}
      </span>
      <input
        type="range"
        min={18}
        max={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-clean w-24"
      />
    </label>
  );
}
