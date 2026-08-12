import { Slider } from "@/components/ui/slider";
import { formatHeight } from "@/lib/builder";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  format?: "height" | "plain";
  hint?: string;
  onChange: (v: number) => void;
}

export function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  format = "plain",
  hint,
  onChange,
}: Props) {
  const fmt = (n: number) => (format === "height" ? formatHeight(n) : `${n}${unit}`);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <span className="display text-3xl leading-none text-primary">{fmt(value)}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      />
      <div className="flex justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
        <span>Min {fmt(min)}</span>
        {hint && <span className="text-accent">{hint}</span>}
        <span>Max {fmt(max)}</span>
      </div>
    </div>
  );
}
