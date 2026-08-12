import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatHeight, POSITIONS, type SaveSlot } from "@/lib/builder";

interface Props {
  saves: SaveSlot[];
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
}

export function SaveSelect({ saves, onSelect, onCreate, onDelete }: Props) {
  const [name, setName] = useState("");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">NBA 2K26</p>
        <h1 className="mt-2 text-6xl leading-none text-foreground sm:text-7xl">MyPlayer Builder</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Pick a save file to load a build, or start a new one. Position sets your height range,
          height sets weight and wingspan, and everything together sets your attribute caps.
        </p>
      </header>

      <div className="panel divide-y divide-border">
        {saves.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">No saves yet — create your first below.</p>
        )}
        {saves.map((s) => {
          const pos = s.build ? POSITIONS.find((p) => p.id === s.build!.position) : null;
          return (
            <div key={s.id} className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-md flame-bg text-lg font-bold text-primary-foreground">
                {s.name.slice(0, 2).toUpperCase()}
              </div>
              <button
                onClick={() => onSelect(s.id)}
                className="flex-1 text-left transition-colors hover:text-primary"
              >
                <span className="display block text-2xl leading-tight">{s.name}</span>
                <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                  {s.build && pos
                    ? `${pos.id} · ${formatHeight(s.build.height)} · ${s.build.weight} lbs · ${s.build.hand}-handed`
                    : "Empty slot"}
                </span>
              </button>
              <Button variant="outline" size="sm" onClick={() => onSelect(s.id)}>
                Load
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(s.id)}
              >
                Delete
              </Button>
            </div>
          );
        })}
      </div>

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          onCreate(name.trim());
          setName("");
        }}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New save name (e.g. Season 1 Guard)"
          maxLength={24}
        />
        <Button type="submit" className="shrink-0">
          Create save
        </Button>
      </form>
    </div>
  );
}
