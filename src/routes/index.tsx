import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BuilderScreen } from "@/components/BuilderScreen";
import { SaveSelect } from "@/components/SaveSelect";
import {
  POSITIONS,
  baseAttributes,
  clampAttrsToBody,
  weightRange,
  wingspanRange,
  type Build,
  type SaveSlot,
} from "@/lib/builder";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NBA 2K26 MyPlayer Builder — Caps by Position & Body" },
      {
        name: "description",
        content:
          "Build an NBA 2K26 MyPlayer: pick a save, position, height, weight, wingspan and hand, and see live attribute caps.",
      },
      { property: "og:title", content: "NBA 2K26 MyPlayer Builder" },
      {
        property: "og:description",
        content:
          "Position-locked height ranges, height-locked weight and wingspan, and live min/max attribute caps.",
      },
    ],
  }),
  component: Index,
});

const STORAGE_KEY = "2k26-myplayer-saves";
const SLOT_COUNT = 10;

function emptySlots(): SaveSlot[] {
  return Array.from({ length: SLOT_COUNT }, (_, i) => ({
    id: `slot-${i + 1}`,
    name: `Slot ${i + 1}`,
    build: null,
    updatedAt: 0,
  }));
}

/** Normalizes stored saves into exactly 10 ordered slots. */
function toSlots(stored: SaveSlot[]): SaveSlot[] {
  const base = emptySlots();
  stored.slice(0, SLOT_COUNT).forEach((s, i) => {
    if (s?.build) base[i] = { ...base[i]!, ...s, id: base[i]!.id };
  });
  return base;
}

function defaultBuild(): Build {
  const pos = POSITIONS[2]!;
  const height = 78;
  return {
    position: pos.id,
    height,
    weight: Math.round((weightRange(height, pos.id).min + weightRange(height, pos.id).max) / 2),
    wingspan: wingspanRange(height).min + 5,
    hand: "Right",
    attrs: baseAttributes(),
  };
}

/** Older saves may lack attributes or exceed current caps. */
function migrate(build: Build): Build {
  return clampAttrsToBody({ ...build, attrs: { ...baseAttributes(), ...(build.attrs ?? {}) } });
}


function Index() {
  const [saves, setSaves] = useState<SaveSlot[]>(emptySlots());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setSaves(toSlots(raw ? (JSON.parse(raw) as SaveSlot[]) : []));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
  }, [saves, hydrated]);

  const active = saves.find((s) => s.id === activeId) ?? null;

  function createSave(id: string, name: string) {
    setSaves((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, name, build: defaultBuild(), updatedAt: Date.now() } : s,
      ),
    );
    setActiveId(id);
  }

  function editSave(id: string) {
    setSaves((prev) =>
      prev.map((s) => (s.id === id && s.build ? { ...s, build: migrate(s.build) } : s)),
    );
    setActiveId(id);
  }


  function updateBuild(build: Build) {
    setSaves((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, build, updatedAt: Date.now() } : s)),
    );
  }

  if (!hydrated) {
    return <div className="min-h-screen court-bg" />;
  }

  if (active?.build) {
    return (
      <BuilderScreen
        save={active}
        build={active.build}
        onChange={updateBuild}
        onBack={() => setActiveId(null)}
      />
    );
  }

  return (
    <div className="court-bg">
      <SaveSelect
        saves={saves}
        onEdit={editSave}
        onCreate={createSave}
        onDelete={(id) =>
          setSaves((prev) =>
            prev.map((s) =>
              s.id === id
                ? { ...s, name: `Slot ${s.id.split("-")[1]}`, build: null, updatedAt: 0 }
                : s,
            ),
          )
        }
      />
    </div>
  );
}
