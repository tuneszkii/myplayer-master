import { useHoldRepeat } from "@/hooks/use-hold-repeat";
import {
  BASE_ATTR,
  POSITION_WEIGHTS,
  pointCost,
  type AttrKey,
  type PositionId,
} from "@/lib/builder";

interface Props {
  attrKey: AttrKey;
  label: string;
  value: number;
  cap: number;
  max: number; // effective max (body potential cap)
  position: PositionId;
  remaining: number;
  /** Change to this attribute's cap from the last body/position change. */
  capDelta?: number;
  onStep: (delta: number) => void;
}

export function AttributeRow({
  attrKey,
  label,
  value,
  cap,
  max,
  position,
  remaining,
  capDelta,
  onStep,
}: Props) {
  const weight = POSITION_WEIGHTS[position][attrKey];
  const nextCost = value < max ? pointCost(position, attrKey, value) : null;
  const canUp = nextCost != null && nextCost <= remaining;
  const canDown = value > BASE_ATTR;

  const up = useHoldRepeat(() => onStep(1));
  const down = useHoldRepeat(() => onStep(-1));

  return (
    <li className="rounded-md border border-border bg-secondary/40 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm text-foreground">{label}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            cap {cap}
            {capDelta ? (
              <span className={capDelta > 0 ? " text-accent" : " text-destructive"}>
                {" "}
                {capDelta > 0 ? "▲" : "▼"}
                {Math.abs(capDelta)}
              </span>
            ) : null}{" "}
            · {weight.toFixed(2)}x{max < cap ? " · gated" : ""}
            {nextCost != null && (
              <span className={canUp ? " text-accent" : " text-destructive"}>
                {" "}
                · next {nextCost.toFixed(1)}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label={`Lower ${label}`}
            disabled={!canDown}
            {...down}
            className="h-8 w-8 select-none touch-none rounded border border-border text-lg leading-none disabled:opacity-30"
          >
            −
          </button>
          <span className="display w-10 text-center text-3xl leading-none text-primary">
            {value}
          </span>
          <button
            aria-label={`Raise ${label}`}
            disabled={!canUp}
            {...up}
            className="h-8 w-8 select-none touch-none rounded border border-border text-lg leading-none disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="relative h-full w-full">
          <div
            className="absolute inset-y-0 left-0 bg-muted"
            style={{ width: `${max}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full flame-bg"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </li>
  );
}
