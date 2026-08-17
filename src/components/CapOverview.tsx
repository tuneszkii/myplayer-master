import { ATTR_LIST, CATEGORIES, type AttrKey, type Attributes } from "@/lib/builder";

interface Props {
  caps: Record<AttrKey, number>;
  attrs: Attributes;
  capDeltas: Partial<Record<AttrKey, number>>;
}

/** Display-only view of how the current body shapes every attribute cap. */
export function CapOverview({ caps, attrs, capDeltas }: Props) {
  return (
    <section className="panel p-4">
      <h2 className="text-xl">Potential caps</h2>
      <p className="mb-3 text-xs text-muted-foreground">
        Display only — see how your frame moves every attribute ceiling.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((cat) => (
          <div key={cat.id}>
            <h3 className="mb-2 border-b border-border pb-1 text-xs uppercase tracking-widest text-accent">
              {cat.id}
            </h3>
            <ul className="space-y-1.5">
              {ATTR_LIST.filter((a) => a.group === cat.id).map((a) => {
                const cap = caps[a.key];
                const delta = capDeltas[a.key];
                return (
                  <li key={a.key}>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2">
                      <span className="truncate text-xs text-muted-foreground">{a.label}</span>
                      <span className="font-mono text-xs text-foreground">
                        {attrs[a.key]}
                        <span className="text-muted-foreground"> / {cap}</span>
                        {delta ? (
                          <span className={delta > 0 ? "text-accent" : "text-destructive"}>
                            {" "}
                            {delta > 0 ? "▲" : "▼"}
                            {Math.abs(delta)}
                          </span>
                        ) : null}
                      </span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
                      <div className="relative h-full w-full">
                        <div
                          className="absolute inset-y-0 left-0 bg-muted"
                          style={{ width: `${Math.min(100, cap)}%` }}
                        />
                        <div
                          className="absolute inset-y-0 left-0 rounded-full flame-bg"
                          style={{ width: `${Math.min(100, attrs[a.key])}%` }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
