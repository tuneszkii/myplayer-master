import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RangeControl } from "@/components/RangeControl";
import {
  ATTR_GROUPS,
  attributeCaps,
  formatHeight,
  overallPotential,
  POSITIONS,
  weightRange,
  wingspanRange,
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
  const position = POSITIONS.find((p) => p.id === build.position)!;
  const wRange = weightRange(build.height);
  const wsRange = wingspanRange(build.height);
  const caps = useMemo(() => attributeCaps(build), [build]);
  const potential = overallPotential(caps);

  function setPosition(id: PositionId) {
    const p = POSITIONS.find((x) => x.id === id)!;
    const height = clamp(build.height, p.minHeight, p.maxHeight);
    onChange(normalize({ ...build, position: id, height }));
  }

  function setHeight(height: number) {
    onChange(normalize({ ...build, height }));
  }

  function normalize(b: Build): Build {
    const w = weightRange(b.height);
    const ws = wingspanRange(b.height);
    return {
      ...b,
      weight: clamp(b.weight, w.min, w.max),
      wingspan: clamp(b.wingspan, ws.min, ws.max),
    };
  }

  return (
    <div className="min-h-screen court-bg">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Save · {save.name}
            </p>
            <h1 className="mt-1 text-5xl leading-none sm:text-6xl">MyPlayer Builder</h1>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Overall potential
              </p>
              <p className="display text-5xl leading-none text-primary">{potential}</p>
            </div>
            <Button variant="outline" onClick={onBack}>
              Switch save
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="panel p-5">
              <h2 className="mb-4 text-2xl">1 · Position</h2>
              <div className="grid grid-cols-5 gap-2">
                {POSITIONS.map((p) => {
                  const active = p.id === build.position;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPosition(p.id)}
                      className={`rounded-md border px-2 py-3 text-center transition-all ${
                        active
                          ? "flame-bg border-transparent text-primary-foreground"
                          : "border-border bg-secondary text-foreground hover:border-primary"
                      }`}
                    >
                      <span className="display block text-2xl leading-none">{p.id}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {position.name} — {position.blurb} Height allowed:{" "}
                <span className="text-foreground">
                  {formatHeight(position.minHeight)} – {formatHeight(position.maxHeight)}
                </span>
              </p>
            </section>

            <section className="panel space-y-6 p-5">
              <h2 className="text-2xl">2 · Body</h2>
              <RangeControl
                label="Height"
                format="height"
                value={build.height}
                min={position.minHeight}
                max={position.maxHeight}
                onChange={setHeight}
              />
              <RangeControl
                label="Weight"
                unit=" lbs"
                value={build.weight}
                min={wRange.min}
                max={wRange.max}
                onChange={(weight) => onChange({ ...build, weight })}
                hint={`for ${formatHeight(build.height)}`}
              />
              <RangeControl
                label="Wingspan"
                format="height"
                value={build.wingspan}
                min={wsRange.min}
                max={wsRange.max}
                onChange={(wingspan) => onChange({ ...build, wingspan })}
                hint={`${build.wingspan - build.height >= 0 ? "+" : ""}${build.wingspan - build.height}" vs height`}
              />
            </section>

            <section className="panel p-5">
              <h2 className="mb-4 text-2xl">3 · Handedness</h2>
              <div className="grid grid-cols-2 gap-2">
                {(["Left", "Right"] as Handedness[]).map((h) => {
                  const active = build.hand === h;
                  return (
                    <button
                      key={h}
                      onClick={() => onChange({ ...build, hand: h })}
                      className={`rounded-md border py-3 text-sm font-semibold uppercase tracking-widest transition-all ${
                        active
                          ? "flame-bg border-transparent text-primary-foreground"
                          : "border-border bg-secondary hover:border-primary"
                      }`}
                    >
                      {h} hand
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <section className="panel p-5">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-2xl">4 · Attribute caps</h2>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {build.position} · {formatHeight(build.height)} · {build.weight} lbs ·{" "}
                {formatHeight(build.wingspan)} wingspan
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {ATTR_GROUPS.map((group) => (
                <div key={group}>
                  <h3 className="mb-3 border-b border-border pb-1 text-lg text-primary">{group}</h3>
                  <ul className="space-y-3">
                    {caps
                      .filter((c) => c.group === group)
                      .map((c) => (
                        <li key={c.key}>
                          <div className="flex items-baseline justify-between text-sm">
                            <span className="text-foreground">{c.label}</span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {c.min} – <span className="text-base text-primary">{c.max}</span>
                            </span>
                          </div>
                          <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full flame-bg"
                              style={{
                                marginLeft: `${c.min}%`,
                                width: `${Math.max(c.max - c.min, 2)}%`,
                              }}
                            />
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
