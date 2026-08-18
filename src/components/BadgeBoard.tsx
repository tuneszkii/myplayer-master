import { BADGE_CATEGORIES, badgeStates, type Attributes } from "@/lib/builder";

const TIER_COLOR: Record<string, string> = {
  Bronze: "text-accent",
  Silver: "text-foreground",
  Gold: "text-primary",
  Elite: "text-primary",
  Legendary: "text-destructive",
};

/** Usable badges show their tier; locked badges are greyed out, 2K-style. */
export function BadgeBoard({ attrs }: { attrs: Attributes }) {
  const badges = badgeStates(attrs);
  const usable = badges.filter((b) => b.tier !== "None").length;

  return (
    <section className="panel p-4">
      <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <h3 className="text-lg text-primary">Badges</h3>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {usable} usable · {badges.length - usable} locked
        </p>
      </div>

      <div className="space-y-4">
        {BADGE_CATEGORIES.map((cat) => (
          <div key={cat}>
            <h4 className="mb-2 border-b border-border pb-1 text-xs uppercase tracking-widest text-accent">
              {cat}
            </h4>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {badges
                .filter((b) => b.category === cat)
                .map((b) => {
                  const locked = b.tier === "None";
                  return (
                    <li
                      key={b.id}
                      title={b.desc}
                      className={`rounded border px-2 py-1.5 ${
                        locked
                          ? "border-border/50 bg-secondary/20 opacity-40"
                          : "border-primary/40 bg-secondary/60"
                      }`}
                    >
                      <p className="truncate text-xs text-foreground">{b.label}</p>
                      <p
                        className={`text-sm font-semibold ${
                          locked ? "text-muted-foreground" : TIER_COLOR[b.tier]
                        }`}
                      >
                        {locked ? "Locked" : b.tier}
                      </p>
                      {b.next != null && (
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          next at {b.next}
                        </p>
                      )}
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
