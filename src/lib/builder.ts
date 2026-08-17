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

/* ---------------- attribute connections ---------------- */

/**
 * Attribute connections
 *
 * These are NOT hard 1:1 gates.
 *
 * Instead, an attribute's maximum is influenced by supporting attributes.
 * This is closer to the NBA 2K builder philosophy:
 *
 * - You can specialize.
 * - You don't have to max every supporting stat.
 * - But extreme ratings require a reasonable foundation.
 *
 * Example:
 *
 * 88 Speed With Ball does not require 88 Speed.
 * But you will need a combination of Speed + Ball Handle
 * that supports an 88 SWB.
 */

export interface AttributeConnection {
  /**
   * Attributes that contribute to the connected attribute.
   */
  supports: AttrKey[];

  /**
   * How much of the supporting average contributes.
   *
   * 0.50 means the supporting average contributes 50%.
   */
  supportWeight: number;

  /**
   * Minimum amount of support before the connection begins
   * limiting the attribute.
   */
  softFloor: number;

  /**
   * How strongly the attribute is limited when support is low.
   *
   * Example:
   * 0.75 means only 75% of the support deficit is applied.
   */
  penalty: number;
}

export const ATTRIBUTE_CONNECTIONS: Partial<
  Record<AttrKey, AttributeConnection>
> = {
  /* ---------------- shooting ---------------- */

  threePoint: {
    supports: ["midRange", "freeThrow"],
    supportWeight: 0.65,
    softFloor: 65,
    penalty: 0.55,
  },

  midRange: {
    supports: ["threePoint", "freeThrow", "closeShot"],
    supportWeight: 0.55,
    softFloor: 60,
    penalty: 0.45,
  },

  freeThrow: {
    supports: ["midRange", "threePoint"],
    supportWeight: 0.35,
    softFloor: 60,
    penalty: 0.35,
  },

  closeShot: {
    supports: ["midRange", "drivingLayup"],
    supportWeight: 0.30,
    softFloor: 55,
    penalty: 0.30,
  },

  /* ---------------- finishing ---------------- */

  drivingDunk: {
    supports: ["vertical", "strength", "drivingLayup"],
    supportWeight: 0.60,
    softFloor: 60,
    penalty: 0.65,
  },

  drivingLayup: {
    supports: ["speed", "ballHandle", "closeShot"],
    supportWeight: 0.35,
    softFloor: 60,
    penalty: 0.35,
  },

  standingDunk: {
    supports: ["strength", "vertical", "closeShot"],
    supportWeight: 0.50,
    softFloor: 60,
    penalty: 0.55,
  },

  postControl: {
    supports: ["strength", "closeShot", "midRange"],
    supportWeight: 0.40,
    softFloor: 60,
    penalty: 0.40,
  },

  /* ---------------- playmaking ---------------- */

  speedWithBall: {
    supports: ["speed", "ballHandle"],
    supportWeight: 0.70,
    softFloor: 65,
    penalty: 0.70,
  },

  ballHandle: {
    supports: ["speed", "speedWithBall", "agility"],
    supportWeight: 0.30,
    softFloor: 60,
    penalty: 0.30,
  },

  passAccuracy: {
    supports: ["ballHandle", "speedWithBall"],
    supportWeight: 0.20,
    softFloor: 55,
    penalty: 0.25,
  },

  /* ---------------- defense ---------------- */

  perimeterDefense: {
    supports: ["speed", "agility", "steal"],
    supportWeight: 0.50,
    softFloor: 65,
    penalty: 0.50,
  },

  steal: {
    supports: ["perimeterDefense", "agility"],
    supportWeight: 0.45,
    softFloor: 60,
    penalty: 0.45,
  },

  interiorDefense: {
    supports: ["strength", "block"],
    supportWeight: 0.50,
    softFloor: 60,
    penalty: 0.50,
  },

  block: {
    supports: ["interiorDefense", "vertical", "strength"],
    supportWeight: 0.55,
    softFloor: 60,
    penalty: 0.55,
  },

  /* ---------------- rebounding ---------------- */

  offensiveRebound: {
    supports: ["defensiveRebound", "strength", "vertical"],
    supportWeight: 0.50,
    softFloor: 60,
    penalty: 0.50,
  },

  defensiveRebound: {
    supports: ["offensiveRebound", "strength", "vertical"],
    supportWeight: 0.55,
    softFloor: 60,
    penalty: 0.55,
  },

  /* ---------------- physicals ---------------- */

  speed: {
    supports: ["agility", "perimeterDefense"],
    supportWeight: 0.30,
    softFloor: 60,
    penalty: 0.30,
  },

  agility: {
    supports: ["speed", "perimeterDefense"],
    supportWeight: 0.30,
    softFloor: 60,
    penalty: 0.30,
  },

  vertical: {
    supports: ["drivingDunk", "block", "strength"],
    supportWeight: 0.25,
    softFloor: 60,
    penalty: 0.25,
  },

  strength: {
    supports: ["interiorDefense", "postControl", "standingDunk"],
    supportWeight: 0.25,
    softFloor: 55,
    penalty: 0.25,
  },
};

/**
 * Calculates the supporting rating for an attribute.
 *
 * We use a weighted average rather than requiring every connected
 * attribute to be equally high.
 */
function connectionSupport(
  key: AttrKey,
  attrs: Attributes,
): number {
  const connection = ATTRIBUTE_CONNECTIONS[key];

  if (!connection) return 99;

  const values = connection.supports.map(
    (support) => attrs[support],
  );

  if (values.length === 0) return 99;

  return (
    values.reduce((sum, value) => sum + value, 0) /
    values.length
  );
}

/**
 * Calculates the maximum legal rating for a connected attribute.
 *
 * Important:
 *
 * This is a SOFT gate.
 *
 * A player with:
 *
 * Speed 80
 * Ball Handle 80
 *
 * can still get very high SWB.
 *
 * But a player with:
 *
 * Speed 55
 * Ball Handle 50
 *
 * cannot dump 95 points into SWB.
 */
export function connectedMax(
  key: AttrKey,
  caps: Record<AttrKey, number>,
  attrs: Attributes,
): number {
  const hardCap = caps[key];
  const connection = ATTRIBUTE_CONNECTIONS[key];

  if (!connection) {
    return hardCap;
  }

  const support = connectionSupport(key, attrs);

  if (support >= connection.softFloor) {
    /*
     * Once the supporting attributes reach the floor,
     * the connection stops heavily restricting the rating.
     *
     * We still allow the body's hard cap to control the final maximum.
     */
    return hardCap;
  }

  /*
   * Deficit below the support floor.
   */
  const deficit = connection.softFloor - support;

  /*
   * Only apply part of the deficit.
   *
   * This creates a gradual restriction rather than a hard gate.
   */
  const penalty =
    deficit * connection.penalty;

  return Math.max(
    BASE_ATTR,
    Math.round(hardCap - penalty),
  );
}

/**
 * Highest value an attribute can currently reach.
 */
export function effectiveMax(
  key: AttrKey,
  caps: Record<AttrKey, number>,
  attrs?: Attributes,
): number {
  if (!attrs) {
    return Math.max(
      BASE_ATTR,
      caps[key],
    );
  }

  return Math.max(
    BASE_ATTR,
    Math.min(
      caps[key],
      connectedMax(key, caps, attrs),
    ),
  );
}

/**
 * Enforces connections after attributes are changed.
 *
 * Unlike the old system, this does NOT drag an attribute directly
 * down to another attribute's rating.
 *
 * Instead, it only respects the calculated soft maximum.
 */
export function enforceDependencies(
  attrs: Attributes,
  caps?: Record<AttrKey, number>,
): Attributes {
  if (!caps) {
    return { ...attrs };
  }

  const out = { ...attrs };

  /*
   * Run multiple passes because attributes can support each other.
   */
  for (let pass = 0; pass < 4; pass++) {
    let changed = false;

    for (const key of ATTR_KEYS) {
      const max = effectiveMax(
        key,
        caps,
        out,
      );

      if (out[key] > max) {
        out[key] = max;
        changed = true;
      }
    }

    if (!changed) break;
  }

  return out;
}

/**
 * Kept for compatibility with any UI code that imports
 * ATTR_DEPENDENTS.
 */
export const ATTR_DEPENDENCIES: Partial<
  Record<AttrKey, AttrKey>
> = {};

export const ATTR_DEPENDENTS: Partial<
  Record<AttrKey, AttrKey[]>
> = {};


/* ---------------- nonlinear cost ---------------- */

/** Base progressive cost of the point taking an attribute from `value` to `value + 1`. */
export function tierCost(value: number) {
  if (value <= 69) return 1.00;
  if (value <= 79) return 1.15;
  if (value <= 84) return 1.35;
  if (value <= 89) return 1.70;
  if (value <= 94) return 2.40;
  if (value <= 97) return 3.75;
  return 5.50;
}

export function eliteTax(value: number) {
  if (value <= 79) return 1.00;
  if (value <= 84) return 1.05;
  if (value <= 89) return 1.15;
  if (value <= 91) return 1.80;
  if (value <= 94) return 2.35;
  if (value <= 97) return 3.10;
  return 4.50;
}

/**
 * Attributes that swing gameplay the most carry a premium once they cross 89,
 * so stacking several of them is what really drains the budget.
 */
const PREMIUM_ATTRS: Partial<Record<AttrKey, number> > = {
  threePoint: 1.18,
  midRange: 1.08,

  drivingDunk: 1.20,

  ballHandle: 1.18,
  speedWithBall: 1.15,

  perimeterDefense: 1.15,
  steal: 1.10,

  speed: 1.10,
  agility: 1.08,

  block: 1.12,
  interiorDefense: 1.08,

  standingDunk: 1.10,

  defensiveRebound: 1.08,
  offensiveRebound: 1.05,
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

const BUILD_FINISH_MARGIN = 1.00;

/** Overall scale on the reference-build cost. Slightly generous so builds can
 * afford a bit of what they don't specialize in without being busted. */
const GLOBAL_BUDGET_MULTIPLIER = 1.12;

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
  attrs = enforceDependencies(attrs, body.height);

  return spentBudget(
    body.position,
    attrs,
  );
}

function calculateBudget(body: Body) {
  const base = referenceBudget(body);

  const bodyModifier = bodyBudgetMultiplier(body);
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

  const remaining = Math.max(
    0,
    math.budget - spent,
  );

  const next = cheapestNextCost(
    build.position,
    build.attrs,
    math.caps,
  );

  /*
   * The build is finished when:
   *
   * 1. There is effectively no budget remaining, OR
   * 2. There is no legal attribute point left to purchase.
   *
   * Importantly, if there is enough budget for another point,
   * the build CANNOT be 99.
   */
  const exhausted =
    next == null ||
    remaining <= 0.01 ||
    next > remaining + 0.01;

  /*
   * 99 is the completed-build rating.
   *
   * This guarantees:
   *
   * Budget exhausted -> 99
   * Budget remaining -> max 98
   */
  const ovr = exhausted
    ? TARGET_OVR
    : Math.min(raw, 98);

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
      if (attrs[k] >= effectiveMax(k, caps, attrs, body.height)) continue;
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
  { id: "rimAttack", label: "Rim Attacker", category: "Finishing", attr: "drivingLayup", steps: S1, desc: "Improves the player's ability to reach and finish at the basket when driving." },
  { id: "contactScoring", label: "Contact Scorer", category: "Finishing", attr: "drivingDunk", steps: S2, desc: "Helps maintain finishing effectiveness when absorbing body contact from defenders." },
  { id: "closeTouch", label: "Soft Touch", category: "Finishing", attr: "closeShot", steps: S1, desc: "Improves consistency on short shots and finishes around the basket." },
  { id: "drivingCraft", label: "Crafty Finisher", category: "Finishing", attr: "drivingLayup", steps: S1, desc: "Improves the ability to adjust angles, avoid defenders, and finish after changing direction." },
  { id: "aerialFinishing", label: "Aerial Finisher", category: "Finishing", attr: "drivingDunk", steps: S2, desc: "Improves control and accuracy when finishing while airborne." },
  { id: "postTechnique", label: "Post Technician", category: "Finishing", attr: "postControl", steps: S1, desc: "Improves effectiveness when creating scoring opportunities with back-to-basket moves." },
  { id: "drawContact", label: "Foul Magnet", category: "Finishing", attr: "strength", steps: S1, desc: "Increases the likelihood of forcing physical interactions when attacking the basket." },
  { id: "finishConsistency", label: "Reliable Finisher", category: "Finishing", attr: "closeShot", steps: S3, desc: "Reduces performance drops on difficult or contested finishing attempts." },

  // Defense & Rebounding
  { id: "onBallContainment", label: "On-Ball Stopper", category: "Defense & Rebounding", attr: "perimeterDefense", steps: S1, desc: "Helps the defender stay attached to ball handlers and prevent straight-line drives." },
  { id: "reactionSpeed", label: "Quick Reflexes", category: "Defense & Rebounding", attr: "agility", steps: S1, desc: "Improves how quickly the player responds to sudden offensive movements." },
  { id: "disruption", label: "Ball Hawk", category: "Defense & Rebounding", attr: "steal", steps: S2, desc: "Makes it easier to interfere with dribbles, passing lanes, and offensive actions." },
  { id: "rimProtection", label: "Rim Protector", category: "Defense & Rebounding", attr: "block", steps: S1, desc: "Improves the ability to challenge, alter, and discourage shots near the basket." },
  { id: "defensivePositioning", label: "Defensive Anchor", category: "Defense & Rebounding", attr: "interiorDefense", steps: S3, desc: "Helps the player automatically maintain better defensive angles and spacing." },
  { id: "screenResistance", label: "Screen Buster", category: "Defense & Rebounding", attr: "strength", steps: S1, desc: "Reduces the effectiveness of screens against the defender." },
  { id: "deflectionSkill", label: "Passing Lane Menace", category: "Defense & Rebounding", attr: "steal", steps: S1, desc: "Improves the player's ability to get hands on nearby passes without completely committing to a steal." },
  { id: "boxOutStrength", label: "Box-Out Beast", category: "Defense & Rebounding", attr: "strength", steps: S1, desc: "Improves the ability to establish and maintain rebounding position against opponents." },
  { id: "reboundControl", label: "Secure Hands", category: "Defense & Rebounding", attr: "defensiveRebound", steps: S1, desc: "Improves the ability to secure rebounds and maintain possession after grabbing them." },
  { id: "crashAwareness", label: "Glass Crasher", category: "Defense & Rebounding", attr: "offensiveRebound", steps: S1, desc: "Improves positioning and decision-making when attacking the offensive glass." },

  // Shooting
  { id: "deepAccuracy", label: "Deep Threat", category: "Shooting", attr: "threePoint", steps: S1, desc: "Improves shooting consistency from long distance." },
  { id: "pullUpAccuracy", label: "Pull-Up Sniper", category: "Shooting", attr: "midRange", steps: S1, desc: "Improves shot effectiveness when shooting immediately after creating space or moving." },
  { id: "setShotAccuracy", label: "Set Shot Accuracy", category: "Shooting", attr: "threePoint", steps: S1, desc: "Improves consistency on stationary shots with the player's feet set." },
  { id: "midrangePrecision", label: "Midrange Maestro", category: "Shooting", attr: "midRange", steps: S1, desc: "Improves accuracy on shots from the intermediate range." },
  { id: "foulLineAccuracy", label: "Free Throw Ace", category: "Shooting", attr: "freeThrow", steps: S3, desc: "Improves consistency on free throws." },
  { id: "shotStability", label: "Steady Shooter", category: "Shooting", attr: "midRange", steps: S1, desc: "Reduces the negative effect of defensive pressure and movement on shooting." },
  { id: "releaseControl", label: "Smooth Release", category: "Shooting", attr: "threePoint", steps: S1, desc: "Makes the player's ideal shooting window more forgiving and consistent." },
  { id: "range", label: "Range", category: "Shooting", attr: "threePoint", steps: T(60, 75, 85, 93, 98), desc: "Extends the distance from which the player can shoot effectively." },
  { id: "pressureShooting", label: "Pressure Shooting", category: "Shooting", attr: "freeThrow", steps: S3, desc: "Improves shooting performance during high-pressure situations such as late-game possessions." },

  // Playmaking
  { id: "handleControl", label: "Tight Handles", category: "Playmaking", attr: "ballHandle", steps: S1, desc: "Improves the player's ability to maintain control while performing dribble moves." },
  { id: "changeOfDirection", label: "Ankle Breaker", category: "Playmaking", attr: "speedWithBall", steps: S1, desc: "Makes directional changes quicker and more responsive while dribbling." },
  { id: "burstCreation", label: "First Step", category: "Playmaking", attr: "speedWithBall", steps: S1, desc: "Improves the ability to accelerate out of dribble moves and create separation." },
  { id: "passingPrecision", label: "Dime Dropper", category: "Playmaking", attr: "passAccuracy", steps: S1, desc: "Improves pass accuracy, particularly on difficult or tightly targeted passes." },
  { id: "passingSpeed", label: "Zip Passer", category: "Playmaking", attr: "passAccuracy", steps: S1, desc: "Increases the speed at which passes travel to teammates." },
  { id: "decisionMaking", label: "Floor General", category: "Playmaking", attr: "passAccuracy", steps: S3, desc: "Improves the player's ability to select effective actions based on the defensive situation." },
  { id: "courtVision", label: "Court Vision", category: "Playmaking", attr: "passAccuracy", steps: S1, desc: "Improves awareness of open teammates and passing opportunities." },
  { id: "ballSecurity", label: "Strong Grip", category: "Playmaking", attr: "ballHandle", steps: S3, desc: "Reduces the likelihood of losing the ball when pressured or performing risky actions." },
  { id: "paceControl", label: "Change Pace", category: "Playmaking", attr: "speedWithBall", steps: S1, desc: "Improves the ability to change speeds and manipulate defenders while attacking." },
  { id: "playmakingUnderPressure", label: "Unpluckable", category: "Playmaking", attr: "ballHandle", steps: S1, desc: "Reduces the negative effects of defensive pressure on dribbling and passing." },
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

type TraitId =
  | "deep" | "mid" | "slash" | "paint" | "play"
  | "perimD" | "rimD" | "glass" | "athletic";

const TRAIT_PREFIX: Record<TraitId, string> = {
  deep: "Sharpshooting",
  mid: "Shot-Creating",
  slash: "Slashing",
  paint: "Post-Scoring",
  play: "Playmaking",
  perimD: "Lockdown",
  rimD: "Rim-Protecting",
  glass: "Glass-Cleaning",
  athletic: "High-Flying",
};

const TRAIT_NOUN: Record<TraitId, string> = {
  deep: "Sniper",
  mid: "Shot Creator",
  slash: "Slasher",
  paint: "Post Threat",
  play: "Playmaker",
  perimD: "Perimeter Lock",
  rimD: "Paint Anchor",
  glass: "Rebounder",
  athletic: "Athlete",
};

const TRAIT_TAKEOVER: Record<TraitId, string> = {
  deep: "Spot Up Precision",
  mid: "Shot Creator",
  slash: "Slasher",
  paint: "Post Scorer",
  play: "Playmaker",
  perimD: "Lockdown Defender",
  rimD: "Rim Protector",
  glass: "Rebounder",
  athletic: "Slasher",
};

const TRAIT_BLURB: Record<TraitId, string> = {
  deep: "Punishes any space beyond the arc.",
  mid: "Creates and hits tough looks off the bounce.",
  slash: "Lives in the paint and finishes through traffic.",
  paint: "Bullies defenders with back-to-basket scoring.",
  play: "Runs the offense and finds every open teammate.",
  perimD: "Smothers ball handlers on the perimeter.",
  rimD: "Turns the paint into a no-fly zone.",
  glass: "Owns both ends of the glass.",
  athletic: "Wins with pure speed and explosiveness.",
};

const POSITION_NOUN: Record<PositionId, string> = {
  PG: "Guard",
  SG: "Wing",
  SF: "Forward",
  PF: "Forward",
  C: "Big",
};

export function buildIdentity(build: Build): Identity {
  const a = build.attrs;
  const caps = attributeCaps(build);

  // Score each trait relative to what this body could reach, so different
  // frames and spending patterns produce genuinely different identities.
  const rel = (keys: AttrKey[]) =>
    keys.reduce((s, k) => s + a[k] / Math.max(caps[k], 1), 0) / keys.length;
  const raw = (keys: AttrKey[]) => keys.reduce((s, k) => s + a[k], 0) / keys.length;

  const allTraits: { id: TraitId; score: number; level: number }[] = [
    { id: "deep", score: rel(["threePoint"]) * 1.05, level: raw(["threePoint"]) },
    { id: "mid", score: rel(["midRange", "ballHandle"]), level: raw(["midRange", "ballHandle"]) },
    { id: "slash", score: rel(["drivingDunk", "drivingLayup"]), level: raw(["drivingDunk", "drivingLayup"]) },
    { id: "paint", score: rel(["postControl", "standingDunk", "closeShot"]), level: raw(["postControl", "standingDunk", "closeShot"]) },
    { id: "play", score: rel(["passAccuracy", "speedWithBall"]), level: raw(["passAccuracy", "speedWithBall"]) },
    { id: "perimD", score: rel(["perimeterDefense", "steal"]), level: raw(["perimeterDefense", "steal"]) },
    { id: "rimD", score: rel(["block", "interiorDefense"]), level: raw(["block", "interiorDefense"]) },
    { id: "glass", score: rel(["offensiveRebound", "defensiveRebound"]), level: raw(["offensiveRebound", "defensiveRebound"]) },
    { id: "athletic", score: rel(["vertical", "speed", "agility"]) * 0.9, level: raw(["vertical", "speed", "agility"]) },
  ];

  const traits = allTraits
    .filter((t) => t.level >= 55)
    .sort((a2, b2) => b2.score - a2.score);

  if (traits.length === 0) {
    return {
      archetype: `Developing ${POSITION_NOUN[build.position]}`,
      blurb: "No standout skill yet — keep spending attribute points.",
      takeover: "None",
    };
  }

  const first = traits[0]!;
  const second = traits[1];

  const offense: TraitId[] = ["deep", "mid", "slash", "paint", "play", "athletic"];
  const defense: TraitId[] = ["perimD", "rimD", "glass"];
  const twoWay =
    traits.some((t) => offense.includes(t.id) && t.level >= 78) &&
    traits.some((t) => defense.includes(t.id) && t.level >= 78);

  const nounTrait = second && second.id !== first.id ? second.id : first.id;
  let noun = TRAIT_NOUN[nounTrait];
  if (nounTrait === first.id) noun = `${POSITION_NOUN[build.position]}`;

  const elite = first.level >= 93 ? "Elite " : "";
  const archetype = `${twoWay ? "2-Way " : elite}${TRAIT_PREFIX[first.id]} ${noun}`;

  const blurb = second
    ? `${TRAIT_BLURB[first.id]} ${TRAIT_BLURB[second.id]}`
    : TRAIT_BLURB[first.id];

  return { archetype, blurb, takeover: TRAIT_TAKEOVER[first.id] };
}

/* ---------------- helpers ---------------- */

export function clampAttrsToBody(
  build: Build,
): Build {
  const caps = attributeCaps(build);

  let attrs = {
    ...build.attrs,
  };

  for (const k of ATTR_KEYS) {
    attrs[k] = clamp(
      attrs[k] ?? BASE_ATTR,
      BASE_ATTR,
      caps[k],
    );
  }

  attrs = enforceDependencies(
    attrs,
    caps,
  );

  return {
    ...build,
    attrs,
  };
}
