import {
  badgeStates,
  buildIdentity,
  buildQuality,
  categoryRatings,
  overall,
  poolStates,
  attributeCaps,
  TARGET_OVR,
  type Build,
} from "@/lib/builder";

const TIER_COLOR: Record<string, string> = {
  None: "text-muted-foreground",
  Bronze: "text-accent",
  Silver: "text-foreground",
  Gold: "text-primary",
  Elite: "text-primary",
  "Hall of Fame": "text-destructive",
};

export function BuildSummary({ build, spent, budget }: { build: Build; spent: number; budget: number }) {
  const ovr = overall(build.position, build.attrs);
  const cats = categoryRatings(build.position, build.attrs);
  const quality = buildQuality(build);
  const identity = buildIdentity(build);
  const badges = badgeStates(build.attrs);
  const pools = poolStates(attributeCaps(build), build.attrs);
  const done = ovr >= TARGET_OVR;

  return (
    <div className="space-y-4">
      <section className="panel p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Overall</p>
            <p className="display text-6xl leading-none text-primary">{ovr}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Build quality
            </p>
            <p className="display text-6xl leading-none">{quality.score}</p>
          </div>
        </div>
        <p className={`mt-2 text-sm ${done ? "text-accent" : "text-muted-foreground"}`}>
          {done
            ? "99 OVR solved. Refine distribution to raise Build Quality."
            : `${TARGET_OVR - ovr} OVR to go · ${Math.max(0, Math.round(budget - spent))} budget left`}
        </p>
      </section>

      <section className="panel p-4">
        <h3 className="mb-3 text-lg text-primary">Build identity</h3>
        <p className="display text-3xl leading-none">{identity.archetype}</p>
        <p className="mt-1 text-sm text-muted-foreground">{identity.blurb}</p>
        <p className="mt-2 text-xs uppercase tracking-widest text-accent">
          Takeover · {identity.takeover}
        </p>
      </section>

      <section className="panel p-4">
        <h3 className="mb-3 text-lg text-primary">Category ratings</h3>
        <ul className="space-y-2">
          {cats.map((c) => (
            <li key={c.id}>
              <div className="flex items-baseline justify-between text-sm">
                <span>
                  {c.id}{" "}
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {Math.round(c.weight * 100)}% weight
                  </span>
                </span>
                <span className="display text-2xl leading-none text-primary">{c.rating}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full flame-bg" style={{ width: `${c.rating}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel p-4">
        <h3 className="mb-3 text-lg text-primary">Shared potential pools</h3>
        <ul className="space-y-2">
          {pools.map((p) => (
            <li key={p.id}>
              <div className="flex items-baseline justify-between text-sm">
                <span>{p.label}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {p.used}/{p.capacity}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full flame-bg"
                  style={{ width: `${Math.min(100, (p.used / Math.max(p.capacity, 1)) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel p-4">
        <h3 className="mb-3 text-lg text-primary">Badge access</h3>
        <ul className="grid grid-cols-2 gap-2">
          {badges.map((b) => (
            <li key={b.key} className="rounded border border-border bg-secondary/40 px-2 py-1.5">
              <p className="truncate text-xs text-foreground">{b.label}</p>
              <p className={`text-sm font-semibold ${TIER_COLOR[b.tier]}`}>{b.tier}</p>
              {b.next != null && (
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  next at {b.next}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel p-4">
        <h3 className="mb-3 text-lg text-primary">Quality breakdown</h3>
        <ul className="space-y-1 text-sm">
          {[
            ["Attribute efficiency", quality.efficiency],
            ["Badge thresholds", quality.badges],
            ["Position fit", quality.fit],
            ["Physical / skill synergy", quality.synergy],
            ["Weakness severity", quality.weakness],
          ].map(([label, v]) => (
            <li key={label as string} className="flex justify-between">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-mono">{v}</span>
            </li>
          ))}
          <li className="flex justify-between">
            <span className="text-muted-foreground">Elite attributes (90+)</span>
            <span className="font-mono">{quality.elite}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Wasted attributes</span>
            <span className="font-mono">{quality.dead}</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
