interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: string }[];
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex rounded-lg bg-white/5 p-0.5 ring-1 ring-white/10">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
            value === opt.id
              ? "bg-white/10 text-white"
              : "text-zinc-300 hover:text-zinc-100"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
