import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatHeight, type SaveSlot } from "@/lib/builder";

interface Props {
  saves: SaveSlot[];
  onEdit: (id: string) => void;
  onCreate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function SaveSelect({ saves, onEdit, onCreate, onDelete }: Props) {
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [name, setName] = useState("");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">NBA 2K26</p>
        <h1 className="mt-2 text-5xl leading-none sm:text-7xl">MyPlayer Builder</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Ten build slots. Open an empty slot to start the build creator, or edit and delete the
          builds you already made.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {saves.map((slot, i) => {
          const build = slot.build;
          const creating = creatingId === slot.id;

          if (build) {
            return (
              <li key={slot.id} className="panel p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      Slot {i + 1} · {build.position} · {build.hand}-handed
                    </p>
                    <p className="display truncate text-3xl leading-tight">{slot.name}</p>
                  </div>
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-md flame-bg text-base font-bold text-primary-foreground">
                    {slot.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3">
                  {[
                    ["Height", formatHeight(build.height)],
                    ["Weight", `${build.weight} lbs`],
                    ["Wingspan", formatHeight(build.wingspan)],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        {label}
                      </dt>
                      <dd className="font-mono text-sm text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => onEdit(slot.id)}>
                    Edit build
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(slot.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            );
          }

          return (
            <li key={slot.id} className="panel p-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Slot {i + 1}
              </p>
              {creating ? (
                <form
                  className="mt-2 space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!name.trim()) return;
                    onCreate(slot.id, name.trim());
                    setName("");
                    setCreatingId(null);
                  }}
                >
                  <Input
                    autoFocus
                    value={name}
                    maxLength={24}
                    placeholder="Build name"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" type="submit" className="flex-1">
                      Start builder
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => setCreatingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setName("");
                    setCreatingId(slot.id);
                  }}
                  className="mt-2 flex h-[7.5rem] w-full flex-col items-center justify-center rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <span className="display text-4xl leading-none">+</span>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.25em]">Empty slot</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
