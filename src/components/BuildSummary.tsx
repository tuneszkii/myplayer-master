import {
  BADGE_CATEGORIES,
  badgeStates,
  buildIdentity,
  buildQuality,
  categoryRatings,
  nearMissIdentities,
  overall,
  TAKEOVERS,
  TARGET_OVR,
  type Build,
} from "@/lib/builder";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TIER_COLOR: Record<string, string> = {
  None: "text-muted-foreground",
  Bronze: "text-accent",
  Silver: "text-foreground",
  Gold: "text-primary",
  Elite: "text-primary",
  Legendary: "text-destructive",
};

export function BuildSummary({
  build,
  name,
  spent,
  budget,
  pivot,
}: {
  build: Build;
  name: string;
  spent: number;
  budget: number;
  pivot: number;
}) {
  const ovr = overall(build.position, build.attrs, pivot);
  const cats = categoryRatings(build.position, build.attrs);
  const quality = buildQuality(build);
  const identity = buildIdentity(build);
  const badges = badgeStates(build.attrs);
  const nearMisses = nearMissIdentities(build);
  const takeover = TAKEOVERS.find((t) => t.id === build.takeover);
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
            ? "99 OVR reached. Refine distribution to raise Build Quality."
            : `${TARGET_OVR - ovr} OVR to go · ${Math.max(0, Math.round(budget - spent))} budget left`}
        </p>
      </section>

      <section className="panel p-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {name} · final build
        </p>
        <h3 className="mt-1 text-lg text-primary">Build name</h3>
        <p className="display text-3xl leading-none">{identity.archetype}</p>
        <p className="mt-1 text-sm text-muted-foreground">{identity.blurb}</p>
        <p className="mt-2 text-xs uppercase tracking-widest text-accent">
          Takeover · {takeover ? takeover.label : identity.takeover}
        </p>
      </section>

      <section className="panel p-4">
        <h3 className="mb-1 text-lg text-primary">Builds you came close to</h3>
        <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          Shift points toward these skills to land the name instead
        </p>
        <ul className="space-y-2">
          {nearMisses.map((n) => (
            <li
              key={n.archetype}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-secondary/40 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="display truncate text-xl leading-tight">{n.archetype}</p>
                <p className="truncate text-xs text-muted-foreground">{n.blurb}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-accent">−{n.gap}</span>
            </li>
          ))}
        </ul>
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
        <h3 className="mb-1 text-lg text-primary">Badge access</h3>
        <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          Hover a badge for what it does
        </p>
        <TooltipProvider delayDuration={100}>
          <div className="space-y-4">
            {BADGE_CATEGORIES.map((cat) => (
              <div key={cat}>
                <h4 className="mb-2 border-b border-border pb-1 text-xs uppercase tracking-widest text-accent">
                  {cat}
                </h4>
                <ul className="grid grid-cols-2 gap-2">
                  {badges
                    .filter((b) => b.category === cat)
                    .map((b) => (
                      <li key={b.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              title={b.desc}
                              className="cursor-help rounded border border-border bg-secondary/40 px-2 py-1.5 transition-colors hover:border-primary"
                            >
                              <p className="truncate text-xs text-foreground">{b.label}</p>
                              <p className={`text-sm font-semibold ${TIER_COLOR[b.tier]}`}>
                                {b.tier}
                              </p>
                              {b.next != null && (
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                                  next at {b.next}
                                </p>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-64">
                            <p className="text-xs font-semibold">{b.label}</p>
                            <p className="text-xs text-muted-foreground">{b.desc}</p>
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </TooltipProvider>
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
