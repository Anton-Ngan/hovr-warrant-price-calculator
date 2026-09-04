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
    <label className="block text-xs uppercase tracking-wide text-zinc-400">
      {label}
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="field-input mt-0.5"
      />
    </label>
  );
}
