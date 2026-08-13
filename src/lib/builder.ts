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
  { id: "SG", name: "Shooting Guard", blurb: "-", minHeight: 72, maxHeight: 81 },
  { id: "SF", name: "Small Forward", blurb: "-", minHeight: 75, maxHeight: 82 },
  { id: "PF", name: "Power Forward", blurb: "-", minHeight: 77, maxHeight: 85 },
  { id: "C", name: "Center", blurb: "-", minHeight: 80, maxHeight: 87 },
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
    threePoint: 1.35, midRange: 1.15, freeThrow: 1.05, closeShot: 0.95, postControl: 0.5,
    drivingLayup: 1.1, drivingDunk: 1.05, standingDunk: 0.6,
    passAccuracy: 1.3, ballHandle: 1.35, speedWithBall: 1.3,
    perimeterDefense: 1.15, interiorDefense: 0.55, steal: 1.1, block: 0.45,
    offensiveRebound: 0.35, defensiveRebound: 0.4,
    speed: 1.25, agility: 1.25, strength: 0.55, vertical: 1.0,
  },
  SG: {
    threePoint: 1.3, midRange: 1.15, freeThrow: 1.05, closeShot: 1.0, postControl: 0.6,
    drivingLayup: 1.1, drivingDunk: 1.15, standingDunk: 0.7,
    passAccuracy: 1.1, ballHandle: 1.2, speedWithBall: 1.2,
    perimeterDefense: 1.2, interiorDefense: 0.65, steal: 1.15, block: 0.6,
    offensiveRebound: 0.45, defensiveRebound: 0.5,
    speed: 1.2, agility: 1.2, strength: 0.65, vertical: 1.1,
  },
  SF: {
    threePoint: 1.1, midRange: 1.05, freeThrow: 1.0, closeShot: 1.05, postControl: 0.85,
    drivingLayup: 1.0, drivingDunk: 1.2, standingDunk: 0.9,
    passAccuracy: 0.95, ballHandle: 0.95, speedWithBall: 1.0,
    perimeterDefense: 1.15, interiorDefense: 0.9, steal: 1.0, block: 0.9,
    offensiveRebound: 0.75, defensiveRebound: 0.8,
    speed: 1.05, agility: 1.05, strength: 0.9, vertical: 1.2,
  },
  PF: {
    threePoint: 0.85, midRange: 0.95, freeThrow: 0.9, closeShot: 1.15, postControl: 1.2,
    drivingLayup: 0.85, drivingDunk: 1.3, standingDunk: 1.25,
    passAccuracy: 0.85, ballHandle: 0.75, speedWithBall: 0.75,
    perimeterDefense: 0.9, interiorDefense: 1.25, steal: 0.85, block: 1.25,
    offensiveRebound: 1.2, defensiveRebound: 1.25,
    speed: 0.85, agility: 0.8, strength: 1.25, vertical: 1.25,
  },
  C: {
    threePoint: 0.7, midRange: 0.8, freeThrow: 0.8, closeShot: 1.25, postControl: 1.3,
    drivingLayup: 0.7, drivingDunk: 0.9, standingDunk: 1.4,
    passAccuracy: 0.75, ballHandle: 0.6, speedWithBall: 0.55,
    perimeterDefense: 0.65, interiorDefense: 1.4, steal: 0.65, block: 1.4,
    offensiveRebound: 1.35, defensiveRebound: 1.4,
    speed: 0.65, agility: 0.6, strength: 1.4, vertical: 1.0,
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

/* ---------------- potential limits ---------------- */

/**
 * Highest value an attribute can currently be raised to. Only the body's hard
 * potential cap applies — there are no category maximums, so the position
 * weighting (cost) is what limits how far a build can be pushed.
 */
export function effectiveMax(key: AttrKey, caps: Record<AttrKey, number>): number {
  return Math.max(BASE_ATTR, caps[key]);
}


/* ---------------- nonlinear cost ---------------- */

export function tierCost(value: number) {
  if (value <= 60) return 1.0;
  if (value <= 70) return 1.2;
  if (value <= 80) return 1.5;
  if (value <= 85) return 2.0;
  if (value <= 90) return 2.8;
  if (value <= 94) return 4.0;
  if (value <= 97) return 5.5;
  return 8.0;
}

/** Cost of the single point taking `key` from `from` to `from + 1`. */
export function pointCost(position: PositionId, key: AttrKey, from: number) {
  return tierCost(from) * POSITION_WEIGHTS[position][key];
}

export function spentBudget(position: PositionId, attrs: Attributes) {
  let total = 0;
  for (const k of ATTR_KEYS) {
    for (let v = BASE_ATTR; v < attrs[k]; v++) total += pointCost(position, k, v);
  }
  return total;
}

/* ---------------- categories + OVR ---------------- */

export interface CategoryRating {
  id: CategoryId;
  rating: number;
  weight: number;
}

function categoryWeights(position: PositionId) {
  const w = POSITION_WEIGHTS[position];
  const raw = CATEGORIES.map((c) => c.attrs.reduce((s, k) => s + w[k], 0) / c.attrs.length);
  const sum = raw.reduce((s, v) => s + v, 0);
  return raw.map((v) => v / sum);
}

export function categoryRatings(position: PositionId, attrs: Attributes): CategoryRating[] {
  const w = POSITION_WEIGHTS[position];
  const cw = categoryWeights(position);
  return CATEGORIES.map((c, i) => {
    const wsum = c.attrs.reduce((s, k) => s + w[k], 0);
    const rating = c.attrs.reduce((s, k) => s + attrs[k] * w[k], 0) / wsum;
    return { id: c.id, rating: Math.round(rating), weight: cw[i]! };
  });
}

export function weightedComposite(position: PositionId, attrs: Attributes) {
  const w = POSITION_WEIGHTS[position];
  const cw = categoryWeights(position);
  let total = 0;
  CATEGORIES.forEach((c, i) => {
    const wsum = c.attrs.reduce((s, k) => s + w[k], 0);
    const rating = c.attrs.reduce((s, k) => s + attrs[k] * w[k], 0) / wsum;
    total += rating * cw[i]!;
  });
  return total;
}

/**
 * 99 OVR maps to a weighted-category composite of `pivot`, which is solved per
 * body: it sits just under the best composite this body can legally reach, so
 * 99 is a budget puzzle rather than a reward for maxing everything.
 */
export function overall(position: PositionId, attrs: Attributes, pivot: number) {
  const composite = weightedComposite(position, attrs);
  const progress = (composite - BASE_ATTR) / Math.max(pivot - BASE_ATTR, 1);
  return clamp(Math.round(BASE_ATTR + (TARGET_OVR - BASE_ATTR) * progress), BASE_ATTR, TARGET_OVR);
}

/* ---------------- budget calibration (greedy solver) ---------------- */

export interface BuildMath {
  caps: Record<AttrKey, number>;
  pivot: number;
  budget: number;
}

/**
 * Greedily solve the body for composite-per-cost efficiency. The walk gives us
 * both the ceiling of this body (the pivot for 99 OVR) and the cost of getting
 * there (the attribute budget, plus a small slack).
 */
export function buildMath(body: Body): BuildMath {
  const caps = attributeCaps(body);
  const attrs = baseAttributes();
  const path: { composite: number; cost: number }[] = [
    { composite: weightedComposite(body.position, attrs), cost: 0 },
  ];
  let cost = 0;

  for (let step = 0; step < 4000; step++) {
    let best: { key: AttrKey; ratio: number; cost: number } | null = null;
    for (const k of ATTR_KEYS) {
      if (attrs[k] >= caps[k]) continue;

      const c = pointCost(body.position, k, attrs[k]);
      const before = weightedComposite(body.position, attrs);
      attrs[k] += 1;
      const gain = weightedComposite(body.position, attrs) - before;
      attrs[k] -= 1;
      const ratio = gain / c;
      if (!best || ratio > best.ratio) best = { key: k, ratio, cost: c };
    }
    if (!best) break;
    attrs[best.key] += 1;
    cost += best.cost;
    path.push({ composite: weightedComposite(body.position, attrs), cost });
  }

  const ceiling = path[path.length - 1]!.composite;
  const pivot = BASE_ATTR + (ceiling - BASE_ATTR) * 0.9;
  const needed = path.find((p) => p.composite >= pivot)?.cost ?? cost;
  return { caps, pivot, budget: Math.round(needed * 1.06) };
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
  return { ...build, attrs };
}

