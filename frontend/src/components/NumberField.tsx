interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
}

export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  step,
}: NumberFieldProps) {
  return (
    <label className="block text-sm">
      {label}
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full bg-slate-800 rounded px-2 py-1"
      />
    </label>
  );
}
