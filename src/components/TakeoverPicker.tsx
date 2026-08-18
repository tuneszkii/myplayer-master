import { ATTR_LABEL, takeoverStates, type Attributes } from "@/lib/builder";

interface Props {
  attrs: Attributes;
  selected: string | undefined;
  onSelect: (id: string) => void;
}

/** Takeovers unlock from attributes; locked ones stay greyed out. */
export function TakeoverPicker({ attrs, selected, onSelect }: Props) {
  const states = takeoverStates(attrs);

  return (
    <section className="panel p-4">
      <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <h3 className="text-lg text-primary">Takeover</h3>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {states.filter((s) => s.unlocked).length} available
        </p>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {states.map(({ def, unlocked, missing }) => {
          const active = selected === def.id && unlocked;
          return (
            <li key={def.id}>
              <button
                disabled={!unlocked}
                onClick={() => onSelect(def.id)}
                className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                  active
                    ? "flame-bg border-transparent text-primary-foreground"
                    : unlocked
                      ? "border-border bg-secondary hover:border-primary"
                      : "border-border/50 bg-secondary/20 opacity-40"
                }`}
              >
                <p className="display text-xl leading-none">{def.label}</p>
                <p
                  className={`mt-1 text-xs ${active ? "" : "text-muted-foreground"}`}
                >
                  {def.desc}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest">
                  {unlocked ? (
                    <span className={active ? "" : "text-accent"}>
                      {active ? "Selected" : "Unlocked"}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      needs{" "}
                      {missing
                        .map((m) => `${ATTR_LABEL[m.key]} ${m.min} (${m.have})`)
                        .join(" · ")}
                    </span>
                  )}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
