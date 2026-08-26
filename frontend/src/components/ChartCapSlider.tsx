interface ChartCapSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function ChartCapSlider({ value, onChange }: ChartCapSliderProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-slate-400 whitespace-nowrap">
        Chart range: $0 - {value}
      </span>
      <input
        type="range"
        min={18}
        max={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1"
      />
    </div>
  );
}
