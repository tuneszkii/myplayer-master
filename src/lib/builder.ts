export type PositionId = "PG" | "SG" | "SF" | "PF" | "C";
export type Handedness = "Left" | "Right";

export interface Position {
  id: PositionId;
  name: string;
  blurb: string;
  minHeight: number; // inches
  maxHeight: number;
}

export const POSITIONS: Position[] = [
  { id: "PG", name: "Point Guard", blurb: "-", minHeight: 67, maxHeight: 78 },
  { id: "SG", name: "Shooting Guard", blurb: "-", minHeight: 75, maxHeight: 80 },
  { id: "SF", name: "Small Forward", blurb: "-", minHeight: 78, maxHeight: 82 },
  { id: "PF", name: "Power Forward", blurb: "-", minHeight: 80, maxHeight: 83 },
  { id: "C", name: "Center", blurb: "-", minHeight: 81, maxHeight: 88 },
];

export function formatHeight(inches: number) {
  return `${Math.floor(inches / 12)}'${inches % 12}"`;
}

export function weightRange(heightIn: number, position: PositionId) {
  const min = Math.round(1.95 * heightIn + 5);

  const positionBonus = {
    PG: 45,
    SG: 50,
    SF: 60,
    PF: 75,
    C: 90,
  }[position];

  const max = min + positionBonus;

  return { min, max };
}

export function wingspanRange(heightIn: number) {
  return { min: heightIn - 3, max: heightIn + 6 };
}

export const BASE_ATTR = 25;
export const TARGET_OVR = 99;

export type AttrKey =
  | "closeShot" | "drivingLayup" | "drivingDunk" | "standingDunk" | "postControl"
  | "midRange" | "threePoint" | "freeThrow"
  | "passAccuracy" | "ballHandle" | "speedWithBall"
  | "interiorDefense" | "perimeterDefense" | "steal" | "block"
  | "offensiveRebound" | "defensiveRebound"
  | "speed" | "agility" | "strength" | "vertical";

export type Attributes = Record<AttrKey, number>;

export type CategoryId = "Finishing" | "Shooting" | "Playmaking" | "Defense" | "Rebounding" | "Physicals";

export const CATEGORIES: { id: CategoryId; attrs: AttrKey[] }[] = [
  { id: "Finishing", attrs: ["closeShot", "drivingLayup", "drivingDunk", "standingDunk", "postControl"] },
  { id: "Shooting", attrs: ["midRange", "threePoint", "freeThrow"] },
  { id: "Playmaking", attrs: ["passAccuracy", "ballHandle", "speedWithBall"] },
  { id: "Defense", attrs: ["interiorDefense", "perimeterDefense", "steal", "block"] },
  { id: "Rebounding", attrs: ["offensiveRebound", "defensiveRebound"] },
  { id: "Physicals", attrs: ["speed", "agility", "strength", "vertical"] },
];

export const ATTR_GROUPS = CATEGORIES.map((c) => c.id);

interface AttrDef {
  key: AttrKey;
  label: string;
  group: CategoryId;
  base: number; // cap at reference height 78", mid weight, neutral wingspan
  perInch: number;
  perLb: number;
  perWing: number;
  peak?: number;
  peakFall?: number;
}

const ATTRS: AttrDef[] = [
  { key: "closeShot", label: "Close Shot", group: "Finishing", base: 92, perInch: 0.6, perLb: 0, perWing: 0.3 },
  { key: "drivingLayup", label: "Driving Layup", group: "Finishing", base: 93, perInch: -2.4, perLb: -0.1, perWing: 0 },
  { key: "drivingDunk", label: "Driving Dunk", group: "Finishing", base: 96, perInch: 0, perLb: -0.15, perWing: 0.5, peak: 79, peakFall: 2.2 },
  { key: "standingDunk", label: "Standing Dunk", group: "Finishing", base: 70, perInch: 3.2, perLb: 0.08, perWing: 0.8 },
  { key: "postControl", label: "Post Control", group: "Finishing", base: 72, perInch: 2.9, perLb: 0.14, perWing: 0.4 },
  { key: "midRange", label: "Mid-Range Shot", group: "Shooting", base: 93, perInch: -1.4, perLb: -0.06, perWing: 0 },
  { key: "threePoint", label: "Three-Point Shot", group: "Shooting", base: 92, perInch: -2.6, perLb: -0.1, perWing: 0 },
  { key: "freeThrow", label: "Free Throw", group: "Shooting", base: 92, perInch: -1.1, perLb: -0.04, perWing: 0 },
  { key: "passAccuracy", label: "Pass Accuracy", group: "Playmaking", base: 90, perInch: -1.8, perLb: -0.05, perWing: 0 },
  { key: "ballHandle", label: "Ball Handle", group: "Playmaking", base: 90, perInch: -3.1, perLb: -0.12, perWing: 0 },
  { key: "speedWithBall", label: "Speed With Ball", group: "Playmaking", base: 90, perInch: -3.0, perLb: -0.16, perWing: 0 },
  { key: "interiorDefense", label: "Interior Defense", group: "Defense", base: 78, perInch: 2.6, perLb: 0.16, perWing: 0.5 },
  { key: "perimeterDefense", label: "Perimeter Defense", group: "Defense", base: 92, perInch: -2.2, perLb: -0.12, perWing: 0.4 },
  { key: "steal", label: "Steal", group: "Defense", base: 90, perInch: -2.0, perLb: -0.08, perWing: 0.5 },
  { key: "block", label: "Block", group: "Defense", base: 74, perInch: 3.0, perLb: 0.05, perWing: 1.0 },
  { key: "offensiveRebound", label: "Offensive Rebound", group: "Rebounding", base: 72, perInch: 3.0, perLb: 0.1, perWing: 0.7 },
  { key: "defensiveRebound", label: "Defensive Rebound", group: "Rebounding", base: 76, perInch: 3.0, perLb: 0.1, perWing: 0.7 },
  { key: "speed", label: "Speed", group: "Physicals", base: 92, perInch: -2.4, perLb: -0.22, perWing: 0 },
  { key: "agility", label: "Agility", group: "Physicals", base: 92, perInch: -2.5, perLb: -0.24, perWing: 0 },
  { key: "strength", label: "Strength", group: "Physicals", base: 74, perInch: 1.9, perLb: 0.34, perWing: 0 },
  { key: "vertical", label: "Vertical", group: "Physicals", base: 93, perInch: -0.5, perLb: -0.26, perWing: 0 },
];

export const ATTR_LIST = ATTRS.map((a) => ({ key: a.key, label: a.label, group: a.group }));
export const ATTR_KEYS = ATTRS.map((a) => a.key);
export const ATTR_LABEL = Object.fromEntries(ATTRS.map((a) => [a.key, a.label])) as Record<AttrKey, string>;

/* ---------------- position attribute weights ---------------- */

export const POSITION_WEIGHTS: Record<PositionId, Record<AttrKey, number>> = {
  PG: {
    threePoint: 1.25, midRange: 1.10, freeThrow: 1.00, closeShot: 0.95, postControl: 0.55,
    drivingLayup: 1.05, drivingDunk: 1.00, standingDunk: 0.65,
    passAccuracy: 1.20, ballHandle: 1.25, speedWithBall: 1.20,
    perimeterDefense: 1.10, interiorDefense: 0.60, steal: 1.05, block: 0.50,
    offensiveRebound: 0.45, defensiveRebound: 0.50,
    speed: 1.15, agility: 1.15, strength: 0.65, vertical: 1.00,
  },

  SG: {
    threePoint: 1.20, midRange: 1.10, freeThrow: 1.00, closeShot: 1.00, postControl: 0.65,
    drivingLayup: 1.05, drivingDunk: 1.10, standingDunk: 0.75,
    passAccuracy: 1.05, ballHandle: 1.15, speedWithBall: 1.15,
    perimeterDefense: 1.15, interiorDefense: 0.70, steal: 1.10, block: 0.65,
    offensiveRebound: 0.55, defensiveRebound: 0.60,
    speed: 1.15, agility: 1.15, strength: 0.75, vertical: 1.05,
  },

  SF: {
    threePoint: 1.05, midRange: 1.00, freeThrow: 0.95, closeShot: 1.05, postControl: 0.85,
    drivingLayup: 1.00, drivingDunk: 1.15, standingDunk: 0.95,
    passAccuracy: 0.95, ballHandle: 0.95, speedWithBall: 1.00,
    perimeterDefense: 1.10, interiorDefense: 0.90, steal: 1.00, block: 0.95,
    offensiveRebound: 0.85, defensiveRebound: 0.90,
    speed: 1.00, agility: 1.00, strength: 0.95, vertical: 1.15,
  },

  PF: {
    threePoint: 0.90, midRange: 0.95, freeThrow: 0.90, closeShot: 1.10, postControl: 1.15,
    drivingLayup: 0.90, drivingDunk: 1.20, standingDunk: 1.20,
    passAccuracy: 0.90, ballHandle: 0.80, speedWithBall: 0.80,
    perimeterDefense: 0.95, interiorDefense: 1.15, steal: 0.90, block: 1.15,
    offensiveRebound: 1.10, defensiveRebound: 1.15,
    speed: 0.90, agility: 0.85, strength: 1.15, vertical: 1.15,
  },

  C: {
    threePoint: 0.80, midRange: 0.85, freeThrow: 0.85, closeShot: 1.15, postControl: 1.20,
    drivingLayup: 0.75, drivingDunk: 0.95, standingDunk: 1.30,
    passAccuracy: 0.80, ballHandle: 0.65, speedWithBall: 0.60,
    perimeterDefense: 0.75, interiorDefense: 1.30, steal: 0.70, block: 1.30,
    offensiveRebound: 1.25, defensiveRebound: 1.30,
    speed: 0.75, agility: 0.70, strength: 1.30, vertical: 1.00,
  },
};

/* ---------------- body-based potential caps ---------------- */

export interface Build {
  position: PositionId;
  height: number;
  weight: number;
  wingspan: number;
  hand: Handedness;
  attrs: Attributes;
}

export interface SaveSlot {
  id: string;
  name: string;
  build: Build | null;
  updatedAt: number;
}

export interface Body {
  position: PositionId;
  height: number;
  weight: number;
  wingspan: number;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function attributeCaps(body: Body): Record<AttrKey, number> {
  const { min: wMin, max: wMax } = weightRange(body.height, body.position);
  const wMid = (wMin + wMax) / 2;
  const dW = body.weight - wMid;
  const dWing = body.wingspan - body.height;
  const out = {} as Record<AttrKey, number>;

  for (const a of ATTRS) {
    let cap: number;
    if (a.peak != null) {
      cap = a.base - Math.abs(body.height - a.peak) * (a.peakFall ?? 2);
    } else {
      cap = a.base + (body.height - 78) * a.perInch;
    }
    cap += dW * a.perLb + dWing * a.perWing;
    out[a.key] = clamp(Math.round(cap), 32, 99);
  }
  return out;
}

export function baseAttributes(): Attributes {
  return Object.fromEntries(ATTR_KEYS.map((k) => [k, BASE_ATTR])) as Attributes;
}

/* ---------------- attribute connections + potential limits ---------------- */

/**
 * Attribute relationships inspired by 2K-style builder interactions.
 *
 * These are soft connections rather than one-to-one hard gates. A connected
 * attribute can still be strong on its own, but pushing it extremely high
 * requires supporting attributes to be developed as well.
 */
export interface AttrConnection {
  key: AttrKey;
  supports: AttrKey[];
  supportRatio: number;
  floor: number;
}

export const ATTR_CONNECTIONS: AttrConnection[] = [
  // Playmaking
  { key: "speedWithBall", supports: ["speed", "ballHandle"], supportRatio: 1.00, floor: 55 },

  // Finishing
  { key: "drivingDunk", supports: ["vertical", "strength"], supportRatio: 1.08, floor: 70 },
  { key: "drivingLayup", supports: ["speed", "ballHandle"], supportRatio: 1.05, floor: 65 },
  { key: "standingDunk", supports: ["strength", "vertical"], supportRatio: 1.10, floor: 55 },
  { key: "postControl", supports: ["strength", "closeShot"], supportRatio: 1.05, floor: 55 },

  // Shooting
  { key: "threePoint", supports: ["midRange"], supportRatio: 1.10, floor: 65 },
  { key: "midRange", supports: ["threePoint"], supportRatio: 1.10, floor: 65 },

  // Defense
  { key: "steal", supports: ["perimeterDefense", "agility"], supportRatio: 1.05, floor: 60 },
  { key: "perimeterDefense", supports: ["agility", "steal"], supportRatio: 1.05, floor: 60 },
  { key: "block", supports: ["interiorDefense", "vertical"], supportRatio: 1.10, floor: 60 },
  { key: "interiorDefense", supports: ["strength", "block"], supportRatio: 1.05, floor: 60 },

  // Rebounding
  { key: "defensiveRebound", supports: ["strength", "vertical"], supportRatio: 1.10, floor: 55 },
  { key: "offensiveRebound", supports: ["strength", "vertical"], supportRatio: 1.10, floor: 50 },
];

function connectionFor(key: AttrKey) {
  return ATTR_CONNECTIONS.find((c) => c.key === key);
}

function connectionMax(key: AttrKey, attrs: Attributes) {
  const connection = connectionFor(key);
  if (!connection) return Infinity;

  const average =
    connection.supports.reduce((sum, support) => sum + attrs[support], 0) /
    connection.supports.length;

  return Math.max(
    connection.floor,
    Math.round(average * connection.supportRatio),
  );
}

/**
 * Highest legal value an attribute can currently reach.
 */
export function effectiveMax(
  key: AttrKey,
  caps: Record<AttrKey, number>,
  attrs?: Attributes,
): number {
  let max = caps[key];

  if (attrs) {
    max = Math.min(max, connectionMax(key, attrs));
  }

  return Math.max(BASE_ATTR, Math.round(max));
}

/**
 * Repeatedly enforce soft attribute connections so lowering a supporting stat
 * also lowers a dependent stat when necessary.
 */
export function enforceDependencies(attrs: Attributes): Attributes {
  const out = { ...attrs };

  for (let pass = 0; pass < 6; pass++) {
    let changed = false;

    for (const connection of ATTR_CONNECTIONS) {
      const max = connectionMax(connection.key, out);

      if (out[connection.key] > max) {
        out[connection.key] = max;
        changed = true;
      }
    }

    if (!changed) break;
  }

  return out;
}

/**
 * Raising a connected attribute past its soft gate is allowed — the supporting
 * attributes are pulled up with it (2K-style), and the caller pays for those
 * extra points too. Returns null when the move is impossible (hard body caps).
 */
export function planAttrStep(
  position: PositionId,
  attrs: Attributes,
  caps: Record<AttrKey, number>,
  key: AttrKey,
  delta: number,
): { attrs: Attributes; cost: number } | null {
  if (delta < 0) {
    const target = Math.max(BASE_ATTR, attrs[key] - 1);
    if (target === attrs[key]) return null;
    const next = enforceDependencies({ ...attrs, [key]: target });
    return { attrs: next, cost: costBetween(position, attrs, next) };
  }

  const target = attrs[key] + 1;
  if (target > Math.round(caps[key])) return null;

  const next: Attributes = { ...attrs, [key]: target };

  for (let pass = 0; pass < 12; pass++) {
    let changed = false;

    for (const c of ATTR_CONNECTIONS) {
      const value = next[c.key];
      if (value <= connectionMax(c.key, next)) continue;

      // Needed support average so this attribute is legal at its value.
      const needAvg = value / c.supportRatio;
      let deficit = needAvg * c.supports.length -
        c.supports.reduce((s, k2) => s + next[k2], 0);

      // Spread the requirement over the supports, cheapest headroom first.
      const order = [...c.supports].sort((a, b) => next[a] - next[b]);
      for (const s of order) {
        if (deficit <= 0.0001) break;
        const room = Math.round(caps[s]) - next[s];
        if (room <= 0) continue;
        const add = Math.min(room, Math.ceil(deficit));
        next[s] += add;
        deficit -= add;
        changed = true;
      }

      if (deficit > 0.0001) return null; // supports are capped out
    }

    if (!changed) break;
  }

  return { attrs: next, cost: costBetween(position, attrs, next) };
}

/** Net budget cost of moving from one attribute set to another. */
export function costBetween(
  position: PositionId,
  from: Attributes,
  to: Attributes,
) {
  let total = 0;

  for (const k of ATTR_KEYS) {
    for (let v = from[k]; v < to[k]; v++) total += pointCost(position, k, v);
    for (let v = to[k]; v < from[k]; v++) total -= pointCost(position, k, v);
  }

  return total;
}

/* Compatibility exports for code that still references the old names. */
export const ATTR_DEPENDENCIES: Partial<Record<AttrKey, AttrKey>> = {};
export const ATTR_DEPENDENTS: Partial<Record<AttrKey, AttrKey[]>> = {};


/* ---------------- nonlinear cost ---------------- */

/** Base progressive cost of the point taking an attribute from `value` to `value + 1`. */
export function tierCost(value: number) {
  if (value <= 69) return 1.00;
  if (value <= 79) return 1.15;
  if (value <= 84) return 1.35;
  if (value <= 89) return 1.65;
  if (value <= 94) return 2.25;
  if (value <= 97) return 3.25;
  return 4.50;
}

/** Extra multiplier applied to every point above 89 — the "90+ tax". */
export function eliteTax(value: number) {
  if (value <= 79) return 1.00;
  if (value <= 84) return 1.05;
  if (value <= 89) return 1.15;
  if (value <= 94) return 1.45;
  if (value <= 97) return 1.75;
  return 2.25;
}

/**
 * Attributes that swing gameplay the most carry a premium once they cross 89,
 * so stacking several of them is what really drains the budget.
 */
const PREMIUM_ATTRS: Partial<Record<AttrKey, number>> = {
  threePoint: 1.12,
  midRange: 1.05,

  drivingDunk: 1.10,

  ballHandle: 1.10,
  speedWithBall: 1.08,

  perimeterDefense: 1.08,
  steal: 1.05,

  speed: 1.05,
  agility: 1.05,

  block: 1.05,
  interiorDefense: 1.05,

  standingDunk: 1.05,
};

/** Cost of the single point taking `key` from `from` to `from + 1`. */
export function pointCost(
  position: PositionId,
  key: AttrKey,
  from: number,
) {
  const premium =
    from >= 89
      ? (PREMIUM_ATTRS[key] ?? 1)
      : 1;

  return (
    tierCost(from) *
    eliteTax(from) *
    POSITION_WEIGHTS[position][key] *
    premium
  );
}

export function spentBudget(
  position: PositionId,
  attrs: Attributes,
) {
  let total = 0;

  for (const k of ATTR_KEYS) {
    for (let v = BASE_ATTR; v < attrs[k]; v++) {
      total += pointCost(position, k, v);
    }
  }

  return total;
}

/** Cheapest legal next point, or null when nothing more can be bought. */
export function cheapestNextCost(
  position: PositionId,
  attrs: Attributes,
  caps: Record<AttrKey, number>,
) {
  let best: number | null = null;

  for (const k of ATTR_KEYS) {
    const max = effectiveMax(k, caps, attrs);

    if (attrs[k] >= max) continue;

    const cost = pointCost(
      position,
      k,
      attrs[k],
    );

    if (best == null || cost < best) {
      best = cost;
    }
  }

  return best;
}


/* ---------------- categories + OVR ---------------- */

export interface CategoryRating {
  id: CategoryId;
  rating: number;
  weight: number;
}

function categoryWeights(position: PositionId) {
  const w = POSITION_WEIGHTS[position];

  const raw = CATEGORIES.map((c) =>
    c.attrs.reduce((s, k) => s + w[k], 0) /
    c.attrs.length,
  );

  const sum = raw.reduce((s, v) => s + v, 0);

  return raw.map((v) => v / sum);
}

export function categoryRatings(
  position: PositionId,
  attrs: Attributes,
): CategoryRating[] {
  const w = POSITION_WEIGHTS[position];
  const cw = categoryWeights(position);

  return CATEGORIES.map((c, i) => {
    const wsum = c.attrs.reduce(
      (s, k) => s + w[k],
      0,
    );

    const rating =
      c.attrs.reduce(
        (s, k) => s + attrs[k] * w[k],
        0,
      ) / wsum;

    return {
      id: c.id,
      rating: Math.round(rating),
      weight: cw[i]!,
    };
  });
}

/**
 * Converts an attribute into its OVR contribution.
 *
 * The curve rewards high attributes without making low/irrelevant attributes
 * destroy the overall rating. This is intentionally less aggressive than the
 * previous 1.30 curve because the builder should recognize specialized builds.
 */
function impact(value: number) {
  const t = clamp(
    (value - BASE_ATTR) / (99 - BASE_ATTR),
    0,
    1,
  );

  return (
    BASE_ATTR +
    (99 - BASE_ATTR) * Math.pow(t, 1.12)
  );
}

export function weightedComposite(
  position: PositionId,
  attrs: Attributes,
) {
  const w = POSITION_WEIGHTS[position];

  let num = 0;
  let den = 0;

  for (const k of ATTR_KEYS) {
    num += impact(attrs[k]) * w[k];
    den += w[k];
  }

  return den > 0 ? num / den : BASE_ATTR;
}

/**
 * Calculates OVR directly from the actual attribute profile.
 *
 * OVR is deliberately independent of the build budget. The budget controls
 * what the user can afford; OVR describes what they actually built.
 *
 * A small elite bonus rewards genuine specialization while a light weakness
 * penalty prevents a build with several 90s and everything else at 25 from
 * immediately becoming a 99.
 */
export function overall(
  position: PositionId,
  attrs: Attributes,
  _pivot?: number,
) {
  const w = POSITION_WEIGHTS[position];

  let weighted = 0;
  let totalWeight = 0;

  for (const k of ATTR_KEYS) {
    weighted += impact(attrs[k]) * w[k];
    totalWeight += w[k];
  }

  const baseComposite =
    totalWeight > 0
      ? weighted / totalWeight
      : BASE_ATTR;

  const eliteValues = ATTR_KEYS
    .map((k) => attrs[k])
    .filter((v) => v >= 85)
    .sort((a, b) => b - a);

  let eliteBonus = 0;

  for (let i = 0; i < eliteValues.length; i++) {
    const strength = Math.max(0, eliteValues[i]! - 84);
    const diminishing = 1 / (1 + i * 0.20);
    eliteBonus += strength * 0.035 * diminishing;
  }

  const weakAttrs = ATTR_KEYS.filter((k) => attrs[k] < 50);
  const weaknessPenalty = weakAttrs.reduce((sum, k) => {
    return sum + (50 - attrs[k]) * 0.025;
  }, 0);

  return clamp(
    Math.round(baseComposite + eliteBonus - weaknessPenalty),
    BASE_ATTR,
    TARGET_OVR,
  );
}

const BUILD_FINISH_MARGIN = 1.035;

/** Overall scale on the reference-build cost. */
const GLOBAL_BUDGET_MULTIPLIER = 1.0;

/** Slight per-position tuning of how far the budget stretches. */
const POSITION_BUDGET_MULTIPLIER: Record<PositionId, number> = {
  PG: 1.0,
  SG: 1.0,
  SF: 1.0,
  PF: 1.0,
  C: 1.0,
};

/**
 * Extreme frames (very tall/heavy or very small) get a small budget nudge so
 * every legal body can still finish at 99.
 */
function bodyBudgetMultiplier(body: Body): number {
  const pos = POSITIONS.find((p) => p.id === body.position)!;
  const span = Math.max(1, pos.maxHeight - pos.minHeight);
  const heightRatio = (body.height - pos.minHeight) / span; // 0..1
  const w = weightRange(body.height, body.position);
  const weightRatio = (body.weight - w.min) / Math.max(1, w.max - w.min);
  const ws = wingspanRange(body.height);
  const spanRatio = (body.wingspan - ws.min) / Math.max(1, ws.max - ws.min);

  // Bodies at the edges of their ranges are more specialized: give them a
  // touch more budget than perfectly average frames.
  const extremity =
    (Math.abs(heightRatio - 0.5) + Math.abs(weightRatio - 0.5) + Math.abs(spanRatio - 0.5)) / 1.5;

  return 1 + extremity * 0.04;
}


function referenceAttributes(position: PositionId): Attributes {
  const attrs = baseAttributes();

  switch (position) {
    case "PG":
      attrs.closeShot = 70;
      attrs.drivingLayup = 80;
      attrs.drivingDunk = 87;
      attrs.midRange = 79;
      attrs.threePoint = 88;
      attrs.freeThrow = 75;

      attrs.passAccuracy = 80;
      attrs.ballHandle = 86;
      attrs.speedWithBall = 75;

      attrs.perimeterDefense = 85;
      attrs.interiorDefense = 75;
      attrs.steal = 79;
      attrs.block = 68;

      attrs.offensiveRebound = 45;
      attrs.defensiveRebound = 65;

      attrs.speed = 85;
      attrs.agility = 85;
      attrs.strength = 65;
      attrs.vertical = 75;
      break;

    case "SG":
      attrs.closeShot = 70;
      attrs.drivingLayup = 80;
      attrs.drivingDunk = 85;
      attrs.midRange = 80;
      attrs.threePoint = 88;
      attrs.freeThrow = 75;

      attrs.passAccuracy = 75;
      attrs.ballHandle = 84;
      attrs.speedWithBall = 78;

      attrs.perimeterDefense = 84;
      attrs.interiorDefense = 65;
      attrs.steal = 75;
      attrs.block = 60;

      attrs.offensiveRebound = 45;
      attrs.defensiveRebound = 60;

      attrs.speed = 84;
      attrs.agility = 84;
      attrs.strength = 65;
      attrs.vertical = 78;
      break;

    case "SF":
      attrs.closeShot = 75;
      attrs.drivingLayup = 80;
      attrs.drivingDunk = 85;
      attrs.standingDunk = 70;
      attrs.midRange = 78;
      attrs.threePoint = 83;
      attrs.freeThrow = 75;

      attrs.passAccuracy = 70;
      attrs.ballHandle = 78;
      attrs.speedWithBall = 75;

      attrs.perimeterDefense = 82;
      attrs.interiorDefense = 70;
      attrs.steal = 72;
      attrs.block = 65;

      attrs.offensiveRebound = 60;
      attrs.defensiveRebound = 70;

      attrs.speed = 80;
      attrs.agility = 80;
      attrs.strength = 75;
      attrs.vertical = 80;
      break;

    case "PF":
      attrs.closeShot = 80;
      attrs.drivingLayup = 70;
      attrs.drivingDunk = 85;
      attrs.standingDunk = 85;
      attrs.postControl = 75;

      attrs.midRange = 75;
      attrs.threePoint = 78;
      attrs.freeThrow = 70;

      attrs.passAccuracy = 65;
      attrs.ballHandle = 65;
      attrs.speedWithBall = 60;

      attrs.perimeterDefense = 75;
      attrs.interiorDefense = 82;
      attrs.steal = 60;
      attrs.block = 78;

      attrs.offensiveRebound = 75;
      attrs.defensiveRebound = 82;

      attrs.speed = 75;
      attrs.agility = 72;
      attrs.strength = 85;
      attrs.vertical = 78;
      break;

    case "C":
      attrs.closeShot = 85;
      attrs.drivingLayup = 65;
      attrs.drivingDunk = 75;
      attrs.standingDunk = 90;
      attrs.postControl = 85;

      attrs.midRange = 70;
      attrs.threePoint = 75;
      attrs.freeThrow = 70;

      attrs.passAccuracy = 65;
      attrs.ballHandle = 50;
      attrs.speedWithBall = 45;

      attrs.perimeterDefense = 65;
      attrs.interiorDefense = 88;
      attrs.steal = 50;
      attrs.block = 85;

      attrs.offensiveRebound = 80;
      attrs.defensiveRebound = 90;

      attrs.speed = 70;
      attrs.agility = 65;
      attrs.strength = 90;
      attrs.vertical = 75;
      break;
  }

  return attrs;
}

function referenceBudget(body: Body) {
  const caps = attributeCaps(body);
  let attrs = referenceAttributes(body.position);

  /*
   * Body dimensions still matter.
   */
  for (const k of ATTR_KEYS) {
    attrs[k] = clamp(
      attrs[k],
      BASE_ATTR,
      caps[k],
    );
  }

  /*
   * Apply attribute connections after body caps.
   */
  attrs = enforceDependencies(attrs);

  return spentBudget(
    body.position,
    attrs,
  );
}

function calculateBudget(body: Body) {
  const base = referenceBudget(body);

  const bodyModifier =
    bodyBudgetMultiplier(body);

  const positionModifier =
    POSITION_BUDGET_MULTIPLIER[body.position];

  return Math.round(
    base *
      GLOBAL_BUDGET_MULTIPLIER *
      bodyModifier *
      positionModifier *
      BUILD_FINISH_MARGIN,
  );
}

/**
 * OVR as shown to the player. Safety valve: once the remaining budget can no
 * longer buy a single legal point, the build is finished by definition, so it
 * reads 99 instead of stranding the player at 98.
 */
export function displayOverall(
  build: Build,
  math: BuildMath,
  spent: number,
): { ovr: number; exhausted: boolean } {
  const raw = overall(
    build.position,
    build.attrs,
    math.pivot,
  );

  const remaining = Math.max(0, math.budget - spent);

  const next = cheapestNextCost(
    build.position,
    build.attrs,
    math.caps,
  );

  /*
   * A build is exhausted only when there is literally no budget remaining,
   * or there are no legal upgrades left at all.
   *
   * Crucially, an expensive next point that the player cannot currently afford
   * does NOT turn the build into a 99.
   */
  const exhausted =
    remaining <= 0.001 ||
    next == null;

  /*
   * Hard safety rule:
   *
   * If the player still has any budget left, 99 can never be displayed.
   * This eliminates the previous "99 OVR with points remaining" bug.
   */
  const ovr = exhausted
    ? raw
    : Math.min(raw, TARGET_OVR - 1);

  return {
    ovr,
    exhausted,
  };
}

/* ---------------- budget calibration (greedy solver) ---------------- */

export interface BuildMath {
  caps: Record<AttrKey, number>;
  pivot: number;
  budget: number;
}

interface WalkStep {
  composite: number;
  cost: number;
}

/** Greedy walk over legal points, picking best (or worst) composite-per-cost. */
function walk(body: Body, caps: Record<AttrKey, number>, mode: "best" | "worst", limit = Infinity) {
  const attrs = baseAttributes();
  const path: WalkStep[] = [{ composite: weightedComposite(body.position, attrs), cost: 0 }];
  let cost = 0;

  for (let step = 0; step < 4000; step++) {
    let pick: { key: AttrKey; ratio: number; cost: number } | null = null;
    for (const k of ATTR_KEYS) {
      if (attrs[k] >= effectiveMax(k, caps, attrs)) continue;
      const c = pointCost(body.position, k, attrs[k]);
      if (cost + c > limit) continue;
      const before = weightedComposite(body.position, attrs);
      attrs[k] += 1;
      const gain = weightedComposite(body.position, attrs) - before;
      attrs[k] -= 1;
      const ratio = gain / c;
      const better = mode === "best" ? ratio > (pick?.ratio ?? -Infinity) : ratio < (pick?.ratio ?? Infinity);
      if (!pick || better) pick = { key: k, ratio, cost: c };
    }
    if (!pick) break;
    attrs[pick.key] += 1;
    cost += pick.cost;
    path.push({ composite: weightedComposite(body.position, attrs), cost });
  }
  return path;
}

/**
 * OVR no longer depends on a body-specific pivot. Keep the pivot field for
 * compatibility with existing UI/state code.
 */
export function buildMath(body: Body): BuildMath {
  const caps = attributeCaps(body);
  const budget = calculateBudget(body);

  return {
    caps,
    pivot: TARGET_OVR,
    budget,
  };
}


/* ---------------- badges ---------------- */

export type BadgeTier = "None" | "Bronze" | "Silver" | "Gold" | "Elite" | "Legendary";

export const BADGE_TIER_ORDER: BadgeTier[] = ["None", "Bronze", "Silver", "Gold", "Elite", "Legendary"];

export type BadgeCategory = "Finishing" | "Shooting" | "Playmaking" | "Defense & Rebounding";

export interface BadgeDef {
  id: string;
  label: string;
  category: BadgeCategory;
  attr: AttrKey;
  desc: string;
  /** Bronze, Silver, Gold, Elite, Legendary thresholds. */
  steps: [number, number, number, number, number];
}

const T = (a: number, b: number, c: number, d: number, e: number) =>
  [a, b, c, d, e] as [number, number, number, number, number];

const S1 = T(55, 70, 82, 92, 97);
const S2 = T(50, 68, 80, 90, 96);
const S3 = T(60, 72, 84, 93, 98);

export const BADGES: BadgeDef[] = [
  // Finishing
  { id: "rimAttack", label: "Rim Attack", category: "Finishing", attr: "drivingLayup", steps: S1, desc: "Improves the player's ability to reach and finish at the basket when driving." },
  { id: "contactScoring", label: "Contact Scoring", category: "Finishing", attr: "drivingDunk", steps: S2, desc: "Helps maintain finishing effectiveness when absorbing body contact from defenders." },
  { id: "closeTouch", label: "Close Touch", category: "Finishing", attr: "closeShot", steps: S1, desc: "Improves consistency on short shots and finishes around the basket." },
  { id: "drivingCraft", label: "Driving Craft", category: "Finishing", attr: "drivingLayup", steps: S1, desc: "Improves the ability to adjust angles, avoid defenders, and finish after changing direction." },
  { id: "aerialFinishing", label: "Aerial Finishing", category: "Finishing", attr: "drivingDunk", steps: S2, desc: "Improves control and accuracy when finishing while airborne." },
  { id: "postTechnique", label: "Post Technique", category: "Finishing", attr: "postControl", steps: S1, desc: "Improves effectiveness when creating scoring opportunities with back-to-basket moves." },
  { id: "drawContact", label: "Draw Contact", category: "Finishing", attr: "strength", steps: S1, desc: "Increases the likelihood of forcing physical interactions when attacking the basket." },
  { id: "finishConsistency", label: "Finish Consistency", category: "Finishing", attr: "closeShot", steps: S3, desc: "Reduces performance drops on difficult or contested finishing attempts." },

  // Defense & Rebounding
  { id: "onBallContainment", label: "On-Ball Containment", category: "Defense & Rebounding", attr: "perimeterDefense", steps: S1, desc: "Helps the defender stay attached to ball handlers and prevent straight-line drives." },
  { id: "reactionSpeed", label: "Reaction Speed", category: "Defense & Rebounding", attr: "agility", steps: S1, desc: "Improves how quickly the player responds to sudden offensive movements." },
  { id: "disruption", label: "Disruption", category: "Defense & Rebounding", attr: "steal", steps: S2, desc: "Makes it easier to interfere with dribbles, passing lanes, and offensive actions." },
  { id: "rimProtection", label: "Rim Protection", category: "Defense & Rebounding", attr: "block", steps: S1, desc: "Improves the ability to challenge, alter, and discourage shots near the basket." },
  { id: "defensivePositioning", label: "Defensive Positioning", category: "Defense & Rebounding", attr: "interiorDefense", steps: S3, desc: "Helps the player automatically maintain better defensive angles and spacing." },
  { id: "screenResistance", label: "Screen Resistance", category: "Defense & Rebounding", attr: "strength", steps: S1, desc: "Reduces the effectiveness of screens against the defender." },
  { id: "deflectionSkill", label: "Deflection Skill", category: "Defense & Rebounding", attr: "steal", steps: S1, desc: "Improves the player's ability to get hands on nearby passes without completely committing to a steal." },
  { id: "boxOutStrength", label: "Box-Out Strength", category: "Defense & Rebounding", attr: "strength", steps: S1, desc: "Improves the ability to establish and maintain rebounding position against opponents." },
  { id: "reboundControl", label: "Rebound Control", category: "Defense & Rebounding", attr: "defensiveRebound", steps: S1, desc: "Improves the ability to secure rebounds and maintain possession after grabbing them." },
  { id: "crashAwareness", label: "Crash Awareness", category: "Defense & Rebounding", attr: "offensiveRebound", steps: S1, desc: "Improves positioning and decision-making when attacking the offensive glass." },

  // Shooting
  { id: "deepAccuracy", label: "Deep Accuracy", category: "Shooting", attr: "threePoint", steps: S1, desc: "Improves shooting consistency from long distance." },
  { id: "pullUpAccuracy", label: "Pull-Up Accuracy", category: "Shooting", attr: "midRange", steps: S1, desc: "Improves shot effectiveness when shooting immediately after creating space or moving." },
  { id: "setShotAccuracy", label: "Set Shot Accuracy", category: "Shooting", attr: "threePoint", steps: S1, desc: "Improves consistency on stationary shots with the player's feet set." },
  { id: "midrangePrecision", label: "Midrange Precision", category: "Shooting", attr: "midRange", steps: S1, desc: "Improves accuracy on shots from the intermediate range." },
  { id: "foulLineAccuracy", label: "Foul-Line Accuracy", category: "Shooting", attr: "freeThrow", steps: S3, desc: "Improves consistency on free throws." },
  { id: "shotStability", label: "Shot Stability", category: "Shooting", attr: "midRange", steps: S1, desc: "Reduces the negative effect of defensive pressure and movement on shooting." },
  { id: "releaseControl", label: "Release Control", category: "Shooting", attr: "threePoint", steps: S1, desc: "Makes the player's ideal shooting window more forgiving and consistent." },
  { id: "range", label: "Range", category: "Shooting", attr: "threePoint", steps: T(60, 75, 85, 93, 98), desc: "Extends the distance from which the player can shoot effectively." },
  { id: "pressureShooting", label: "Pressure Shooting", category: "Shooting", attr: "freeThrow", steps: S3, desc: "Improves shooting performance during high-pressure situations such as late-game possessions." },

  // Playmaking
  { id: "handleControl", label: "Handle Control", category: "Playmaking", attr: "ballHandle", steps: S1, desc: "Improves the player's ability to maintain control while performing dribble moves." },
  { id: "changeOfDirection", label: "Change of Direction", category: "Playmaking", attr: "speedWithBall", steps: S1, desc: "Makes directional changes quicker and more responsive while dribbling." },
  { id: "burstCreation", label: "Burst Creation", category: "Playmaking", attr: "speedWithBall", steps: S1, desc: "Improves the ability to accelerate out of dribble moves and create separation." },
  { id: "passingPrecision", label: "Passing Precision", category: "Playmaking", attr: "passAccuracy", steps: S1, desc: "Improves pass accuracy, particularly on difficult or tightly targeted passes." },
  { id: "passingSpeed", label: "Passing Speed", category: "Playmaking", attr: "passAccuracy", steps: S1, desc: "Increases the speed at which passes travel to teammates." },
  { id: "decisionMaking", label: "Decision Making", category: "Playmaking", attr: "passAccuracy", steps: S3, desc: "Improves the player's ability to select effective actions based on the defensive situation." },
  { id: "courtVision", label: "Court Vision", category: "Playmaking", attr: "passAccuracy", steps: S1, desc: "Improves awareness of open teammates and passing opportunities." },
  { id: "ballSecurity", label: "Ball Security", category: "Playmaking", attr: "ballHandle", steps: S3, desc: "Reduces the likelihood of losing the ball when pressured or performing risky actions." },
  { id: "paceControl", label: "Pace Control", category: "Playmaking", attr: "speedWithBall", steps: S1, desc: "Improves the ability to change speeds and manipulate defenders while attacking." },
  { id: "playmakingUnderPressure", label: "Playmaking Under Pressure", category: "Playmaking", attr: "ballHandle", steps: S1, desc: "Reduces the negative effects of defensive pressure on dribbling and passing." },
];

export const BADGE_CATEGORIES: BadgeCategory[] = [
  "Finishing",
  "Shooting",
  "Playmaking",
  "Defense & Rebounding",
];

export interface BadgeState {
  id: string;
  key: AttrKey;
  label: string;
  category: BadgeCategory;
  desc: string;
  value: number;
  tier: BadgeTier;
  next: number | null;
}

export function badgeStates(attrs: Attributes): BadgeState[] {
  return BADGES.map((b) => {
    const v = attrs[b.attr];
    let tierIndex = 0;
    b.steps.forEach((min, i) => {
      if (v >= min) tierIndex = i + 1;
    });
    const next = b.steps.find((min) => v < min) ?? null;
    return {
      id: b.id,
      key: b.attr,
      label: b.label,
      category: b.category,
      desc: b.desc,
      value: v,
      tier: BADGE_TIER_ORDER[tierIndex]!,
      next,
    };
  });
}


/* ---------------- build quality ---------------- */

export interface Quality {
  score: number;
  efficiency: number;
  badges: number;
  fit: number;
  synergy: number;
  weakness: number;
  elite: number;
  dead: number;
}

export function buildQuality(build: Build): Quality {
  const { position, attrs } = build;
  const caps = attributeCaps(build);
  const w = POSITION_WEIGHTS[position];

  let spendW = 0;
  let spendTotal = 0;
  for (const k of ATTR_KEYS) {
    const pts = attrs[k] - BASE_ATTR;
    spendTotal += pts;
    spendW += pts * w[k];
  }
  const avgWeight = spendTotal > 0 ? spendW / spendTotal : 0;
  const efficiency = clamp(Math.round(((avgWeight - 0.75) / 0.5) * 100), 0, 100);

  const badges = badgeStates(attrs);
  const TIER_SCORE: Record<BadgeTier, number> = {
    None: 0,
    Bronze: 1,
    Silver: 2,
    Gold: 3,
    Elite: 4,
    Legendary: 5,
  };
  let badgePts = 0;
  let badgeMax = 0;
  for (const b of badges) {
    badgePts += TIER_SCORE[b.tier] * w[b.key];
    badgeMax += 5 * w[b.key];
  }
  const badgeScore = clamp(Math.round((badgePts / Math.max(badgeMax, 1)) * 100), 0, 100);


  const keyAttrs = ATTR_KEYS.filter((k) => w[k] >= 1.1);
  const fitRaw = keyAttrs.reduce((s, k) => s + attrs[k] / Math.max(caps[k], 1), 0) / Math.max(keyAttrs.length, 1);
  const fit = clamp(Math.round(fitRaw * 100), 0, 100);

  const synergyPairs: [AttrKey, AttrKey][] = [
    ["drivingDunk", "vertical"],
    ["standingDunk", "strength"],
    ["speedWithBall", "ballHandle"],
    ["threePoint", "midRange"],
    ["block", "interiorDefense"],
    ["perimeterDefense", "agility"],
    ["defensiveRebound", "strength"],
  ];
  const synergy = clamp(
    Math.round(
      100 -
        (synergyPairs.reduce((s, [a, b]) => s + Math.abs(attrs[a] - attrs[b]), 0) / synergyPairs.length) * 2.2,
    ),
    0,
    100,
  );

  const weakAttrs = keyAttrs.filter((k) => attrs[k] < 60);
  const weakness = clamp(Math.round(100 - weakAttrs.length * 18), 0, 100);
  const elite = ATTR_KEYS.filter((k) => attrs[k] >= 90).length;
  const dead = ATTR_KEYS.filter((k) => attrs[k] - BASE_ATTR > 0 && w[k] <= 0.7).length;

  const score = clamp(
    Math.round(
      efficiency * 0.28 +
        badgeScore * 0.24 +
        fit * 0.2 +
        synergy * 0.12 +
        weakness * 0.16 +
        Math.min(elite, 6) * 1.2 -
        dead * 2.2,
    ),
    0,
    99,
  );

  return { score, efficiency, badges: badgeScore, fit, synergy, weakness, elite, dead };
}

/* ---------------- archetype + takeover ---------------- */

export interface Identity {
  archetype: string;
  blurb: string;
  takeover: string;
}

export function buildIdentity(build: Build): Identity {
  const a = build.attrs;
  const shoot3 = a.threePoint;
  const mid = a.midRange;
  const handles = (a.ballHandle + a.speedWithBall) / 2;
  const finish = (a.drivingDunk + a.drivingLayup) / 2;
  const paint = (a.standingDunk + a.postControl + a.closeShot) / 3;
  const rim = (a.block + a.interiorDefense) / 2;
  const perim = (a.perimeterDefense + a.steal) / 2;
  const glass = (a.offensiveRebound + a.defensiveRebound) / 2;
  const pass = a.passAccuracy;
  const athletic = (a.vertical + a.speed + a.agility) / 3;
  const twoWay = Math.max(perim, rim) >= 82;
  const big = build.height >= 80;

  const candidates: { archetype: string; score: number; blurb: string; takeover: string }[] = [
    { archetype: "3-Level Shot Creator", score: shoot3 * 1.1 + mid + handles * 0.9 - glass * 0.3, blurb: "Scores from everywhere off the bounce.", takeover: "Shot Creator" },
    { archetype: "Inside-Out Playmaker", score: pass * 1.2 + handles + shoot3 * 0.7 + paint * 0.3, blurb: "Runs the offense, punishes drop coverage.", takeover: "Playmaker" },
    { archetype: "2-Way Slashing Guard", score: finish + athletic * 0.9 + perim * 1.1 + handles * 0.6, blurb: "Often plays over the rim, guards the best player on the court consistently..", takeover: "Slasher" },
    { archetype: "2-Way 3-Level Scorer", score: shoot3 + mid + finish + perim * 0.9, blurb: "Elite scorer who still defends.", takeover: "Shot Creator" },
    { archetype: "Slashing Point Forward", score: finish + pass * 1.1 + (big ? 8 : 0) + handles * 0.6, blurb: "Big frame, guard skills, rim pressure.", takeover: "Slasher" },
    { archetype: "Defensive Point Forward", score: perim * 1.2 + pass + rim * 0.7 + (big ? 6 : 0), blurb: "Guards 1-5, initiates offense.", takeover: "Lockdown Defender" },
    { archetype: "Glass-Cleaning Finisher", score: glass * 1.3 + paint + athletic * 0.5, blurb: "Owns the offensive glass and the rim.", takeover: "Rebounder" },
    { archetype: "Stretch Four", score: shoot3 * 1.3 + (big ? 10 : 0) + rim * 0.6 + glass * 0.5, blurb: "Pulls bigs out of the paint.", takeover: "Shot Creator" },
    { archetype: "2-Way Inside-Out Scorer", score: paint + shoot3 * 1.05 + rim * 0.8, blurb: "Post and perimeter scoring with defense.", takeover: "Post Scorer" },
    { archetype: "Paint Beast", score: paint * 1.15 + rim * 1.2 + a.strength * 0.6 + glass * 0.6, blurb: "The interior belongs to him.", takeover: "Rim Protector" },
  ];

  const best = candidates.reduce((m, c) => (c.score > m.score ? c : m));
  const blurb = twoWay ? `${best.blurb} Holds up on both ends.` : best.blurb;
  return { archetype: best.archetype, blurb, takeover: best.takeover };
}

/* ---------------- helpers ---------------- */

export function clampAttrsToBody(build: Build): Build {
  const caps = attributeCaps(build);
  const attrs = { ...build.attrs };
  for (const k of ATTR_KEYS) attrs[k] = clamp(attrs[k] ?? BASE_ATTR, BASE_ATTR, caps[k]);
  return { ...build, attrs: enforceDependencies(attrs) };
}
