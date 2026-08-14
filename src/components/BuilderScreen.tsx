import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RangeControl } from "@/components/RangeControl";
import { AttributeRow } from "@/components/AttributeRow";
import { BuildSummary } from "@/components/BuildSummary";
import {
  ATTR_LIST,
  attributeCaps,
  BASE_ATTR,
  CATEGORIES,
  baseAttributes,
  clampAttrsToBody,
  displayOverall,
  effectiveMax,
  enforceDependencies,
  formatHeight,
  overall,
  pointCost,
  POSITIONS,
  spentBudget,
  TARGET_OVR,
  buildMath,
  weightRange,
  wingspanRange,
  type AttrKey,
  type Build,
  type Handedness,
  type PositionId,
  type SaveSlot,
} from "@/lib/builder";

interface Props {
  save: SaveSlot;
  build: Build;
  onChange: (b: Build) => void;
  onBack: () => void;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function BuilderScreen({ save, build, onChange, onBack }: Props) {
  const [tab, setTab] = useState<"body" | "attrs" | "summary">("body");
  const position = POSITIONS.find((p) => p.id === build.position)!;
  const wRange = weightRange(build.height, build.position);
  const wsRange = wingspanRange(build.height);

  const math = useMemo(
    () =>
      buildMath({
        position: build.position,
        height: build.height,
        weight: build.weight,
        wingspan: build.wingspan,
      }),
    [build.position, build.height, build.weight, build.wingspan],
  );
  const caps = math.caps;
  const budget = math.budget;
  const spent = useMemo(() => spentBudget(build.position, build.attrs), [build.position, build.attrs]);
  const remaining = budget - spent;
  const { ovr, exhausted } = displayOverall(build, math, spent);
  const ready = ovr >= TARGET_OVR;

  // Show how the body/position change moved every potential cap.
  const prevCapsRef = useRef(caps);
  const bodyKey = `${build.position}|${build.height}|${build.weight}|${build.wingspan}`;
  const prevBodyKey = useRef(bodyKey);
  const [capDeltas, setCapDeltas] = useState<Partial<Record<AttrKey, number>>>({});

  useEffect(() => {
    if (prevBodyKey.current === bodyKey) return;
    const prev = prevCapsRef.current;
    const deltas: Partial<Record<AttrKey, number>> = {};
    for (const k of Object.keys(caps) as AttrKey[]) {
      const d = caps[k] - (prev[k] ?? caps[k]);
      if (d !== 0) deltas[k] = d;
    }
    prevCapsRef.current = caps;
    prevBodyKey.current = bodyKey;
    setCapDeltas(deltas);
    const t = setTimeout(() => setCapDeltas({}), 2600);
    return () => clearTimeout(t);
  }, [bodyKey, caps]);

  function setBody(patch: Partial<Build>) {
    const next = { ...build, ...patch };
    const w = weightRange(next.height, next.position);
    const ws = wingspanRange(next.height);
    next.weight = clamp(next.weight, w.min, w.max);
    next.wingspan = clamp(next.wingspan, ws.min, ws.max);
    onChange(clampAttrsToBody(next));
  }

  function setPosition(id: PositionId) {
    const p = POSITIONS.find((x) => x.id === id)!;
    setBody({ position: id, height: clamp(build.height, p.minHeight, p.maxHeight) });
  }

  // Held +/- buttons fire faster than React re-renders, so step from a ref of
  // the freshest build rather than the render-time prop.
  const liveRef = useRef(build);
  liveRef.current = build;

  function stepAttr(key: AttrKey, delta: number) {
    const current = liveRef.current;
    const currentCaps = attributeCaps(current);
    const max = effectiveMax(key, currentCaps, current.attrs);
    const target = clamp(current.attrs[key] + delta, BASE_ATTR, max);
    if (target === current.attrs[key]) return;
    if (delta > 0) {
      const left = budget - spentBudget(current.position, current.attrs);
      if (pointCost(current.position, key, current.attrs[key]) > left) return;
    }
    const next = {
      ...current,
      attrs: enforceDependencies({ ...current.attrs, [key]: target }),
    };
    liveRef.current = next;
    onChange(next);
  }


  const tabs: { id: typeof tab; label: string }[] = [
    { id: "body", label: "Body" },
    { id: "attrs", label: "Attributes" },
    { id: "summary", label: "Build" },
  ];

  return (
    <div className="min-h-screen court-bg">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        <header className="mb-5 border-b border-border pb-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                Save · {save.name}
              </p>
              <h1 className="mt-1 text-4xl leading-none sm:text-6xl">MyPlayer Builder</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Overall
                </p>
                <p className="display text-4xl leading-none text-primary">{ovr}</p>
              </div>
              <Button variant="outline" size="sm" onClick={onBack}>
                Saves
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Attribute budget</span>
              <span className="font-mono text-foreground">
                {Math.round(spent)} / {budget}
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full flame-bg"
                style={{ width: `${Math.min(100, (spent / budget) * 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-secondary/40 px-3 py-2">
            <p className={`text-xs ${ready ? "text-accent" : "text-muted-foreground"}`}>
              {ready
                ? exhausted
                  ? "Budget is fully spent — build locked in at 99 overall."
                  : "Build is a 99 overall — you can continue."
                : `Build must reach 99 overall to continue · ${TARGET_OVR - ovr} to go`}
            </p>
            <Button size="sm" disabled={!ready} onClick={onBack}>
              Continue
            </Button>
          </div>


          <div className="mt-4 grid grid-cols-3 gap-2 lg:hidden">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-md border py-2 text-xs font-semibold uppercase tracking-widest ${
                  tab === t.id
                    ? "flame-bg border-transparent text-primary-foreground"
                    : "border-border bg-secondary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)_minmax(0,340px)]">
          <div className={`${tab === "body" ? "" : "hidden"} space-y-5 lg:block`}>
            <section className="panel p-4">
              <h2 className="mb-3 text-xl">1 · Position</h2>
              <div className="grid grid-cols-5 gap-2">
                {POSITIONS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPosition(p.id)}
                    className={`rounded-md border px-1 py-3 text-center transition-all ${
                      p.id === build.position
                        ? "flame-bg border-transparent text-primary-foreground"
                        : "border-border bg-secondary hover:border-primary"
                    }`}
                  >
                    <span className="display block text-2xl leading-none">{p.id}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {position.name} — {position.blurb} Height:{" "}
                <span className="text-foreground">
                  {formatHeight(position.minHeight)} – {formatHeight(position.maxHeight)}
                </span>
              </p>
            </section>

            <section className="panel space-y-6 p-4">
              <h2 className="text-xl">2 · Body</h2>
              <RangeControl
                label="Height"
                format="height"
                value={build.height}
                min={position.minHeight}
                max={position.maxHeight}
                onChange={(height) => setBody({ height })}
              />
              <RangeControl
                label="Weight"
                unit=" lbs"
                value={build.weight}
                min={wRange.min}
                max={wRange.max}
                onChange={(weight) => setBody({ weight })}
                hint={`for ${formatHeight(build.height)}`}
              />
              <RangeControl
                label="Wingspan"
                format="height"
                value={build.wingspan}
                min={wsRange.min}
                max={wsRange.max}
                onChange={(wingspan) => setBody({ wingspan })}
                hint={`${build.wingspan - build.height >= 0 ? "+" : ""}${build.wingspan - build.height}" vs height`}
              />
              <p className="text-xs text-muted-foreground">
                Body changes reset attributes that exceed the new potential caps.
              </p>
            </section>

            <section className="panel p-4">
              <h2 className="mb-3 text-xl">3 · Handedness</h2>
              <div className="grid grid-cols-2 gap-2">
                {(["Left", "Right"] as Handedness[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => onChange({ ...build, hand: h })}
                    className={`rounded-md border py-3 text-xs font-semibold uppercase tracking-widest ${
                      build.hand === h
                        ? "flame-bg border-transparent text-primary-foreground"
                        : "border-border bg-secondary hover:border-primary"
                    }`}
                  >
                    {h} hand
                  </button>
                ))}
              </div>
            </section>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => onChange({ ...build, attrs: baseAttributes() })}
            >
              Reset attributes to 25
            </Button>
          </div>

          <section className={`${tab === "attrs" ? "" : "hidden"} panel p-4 lg:block`}>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-xl">4 · Attributes</h2>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {build.position} · {formatHeight(build.height)} · {build.weight} lbs ·{" "}
                {formatHeight(build.wingspan)} span
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {CATEGORIES.map((cat) => (
                <div key={cat.id}>
                  <h3 className="mb-2 border-b border-border pb-1 text-base text-primary">
                    {cat.id}
                  </h3>
                  <ul className="space-y-2">
                    {ATTR_LIST.filter((a) => a.group === cat.id).map((a) => (
                      <AttributeRow
                        key={a.key}
                        attrKey={a.key}
                        label={a.label}
                        value={build.attrs[a.key]}
                        cap={caps[a.key]}
                        max={effectiveMax(a.key, caps, build.attrs)}
                        capDelta={capDeltas[a.key]}
                        position={build.position}
                        remaining={remaining}
                        onStep={(d) => stepAttr(a.key, d)}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <div className={`${tab === "summary" ? "" : "hidden"} lg:block`}>
            <BuildSummary build={build} spent={spent} budget={budget} pivot={math.pivot} />
          </div>
        </div>
      </div>
    </div>
  );
}
