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
  { id: "PG", name: "Point Guard", blurb: "Floor general. Handles + speed.", minHeight: 67, maxHeight: 78 },
  { id: "SG", name: "Shooting Guard", blurb: "Scorer off the catch and drive.", minHeight: 72, maxHeight: 81 },
  { id: "SF", name: "Small Forward", blurb: "Two-way wing, does everything.", minHeight: 75, maxHeight: 82 },
  { id: "PF", name: "Power Forward", blurb: "Glass + paint presence.", minHeight: 77, maxHeight: 85 },
  { id: "C", name: "Center", blurb: "Rim protector, lob threat.", minHeight: 80, maxHeight: 87 },
];

export function formatHeight(inches: number) {
  return `${Math.floor(inches / 12)}'${inches % 12}"`;
}

export function weightRange(heightIn: number) {
  const min = Math.round(1.95 * heightIn + 5);
  const max = min + 95;
  return { min, max };
}

export function wingspanRange(heightIn: number) {
  return { min: heightIn - 3, max: heightIn + 9 };
}

export interface Build {
  position: PositionId;
  height: number;
  weight: number;
  wingspan: number;
  hand: Handedness;
}

export interface SaveSlot {
  id: string;
  name: string;
  build: Build | null;
  updatedAt: number;
}

type AttrKey =
  | "closeShot" | "drivingLayup" | "drivingDunk" | "standingDunk" | "postControl"
  | "midRange" | "threePoint" | "freeThrow"
  | "passAccuracy" | "ballHandle" | "speedWithBall"
  | "interiorDefense" | "perimeterDefense" | "steal" | "block" | "offensiveRebound" | "defensiveRebound"
  | "speed" | "acceleration" | "strength" | "vertical" | "stamina";

interface AttrDef {
  key: AttrKey;
  label: string;
  group: string;
  base: number; // cap at reference height 78" (6'6"), mid weight, neutral wingspan
  perInch: number; // cap change per inch of height above 78
  perLb: number; // cap change per lb of weight above the mid of the range
  perWing: number; // cap change per inch of wingspan above height
  peak?: number; // optional height (in) where cap peaks; falls off both ways
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
  { key: "offensiveRebound", label: "Offensive Rebound", group: "Defense", base: 72, perInch: 3.0, perLb: 0.1, perWing: 0.7 },
  { key: "defensiveRebound", label: "Defensive Rebound", group: "Defense", base: 76, perInch: 3.0, perLb: 0.1, perWing: 0.7 },
  { key: "speed", label: "Speed", group: "Physicals", base: 92, perInch: -2.4, perLb: -0.22, perWing: 0 },
  { key: "acceleration", label: "Acceleration", group: "Physicals", base: 92, perInch: -2.5, perLb: -0.24, perWing: 0 },
  { key: "strength", label: "Strength", group: "Physicals", base: 74, perInch: 1.9, perLb: 0.34, perWing: 0 },
  { key: "vertical", label: "Vertical", group: "Physicals", base: 93, perInch: -0.5, perLb: -0.26, perWing: 0 },
  { key: "stamina", label: "Stamina", group: "Physicals", base: 92, perInch: -0.8, perLb: -0.12, perWing: 0 },
];

const POSITION_BIAS: Record<PositionId, Partial<Record<AttrKey, number>>> = {
  PG: { ballHandle: 4, passAccuracy: 5, speedWithBall: 4, postControl: -8, block: -6, standingDunk: -5 },
  SG: { threePoint: 3, midRange: 2, drivingDunk: 2, postControl: -5, block: -4 },
  SF: { perimeterDefense: 2, drivingDunk: 2, closeShot: 2 },
  PF: { offensiveRebound: 3, defensiveRebound: 3, strength: 3, interiorDefense: 2, threePoint: -3, ballHandle: -4 },
  C: { block: 5, standingDunk: 4, interiorDefense: 4, defensiveRebound: 4, strength: 4, threePoint: -6, ballHandle: -8, speedWithBall: -6 },
};

export interface AttrCap {
  key: AttrKey;
  label: string;
  group: string;
  min: number;
  max: number;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function attributeCaps(build: Build): AttrCap[] {
  const { min: wMin, max: wMax } = weightRange(build.height);
  const wMid = (wMin + wMax) / 2;
  const dW = build.weight - wMid;
  const dWing = build.wingspan - build.height;

  return ATTRS.map((a) => {
    let cap: number;
    if (a.peak != null) {
      cap = a.base - Math.abs(build.height - a.peak) * (a.peakFall ?? 2);
    } else {
      cap = a.base + (build.height - 78) * a.perInch;
    }
    cap += dW * a.perLb + dWing * a.perWing;
    cap += POSITION_BIAS[build.position][a.key] ?? 0;
    const max = clamp(Math.round(cap), 32, 99);
    const min = clamp(Math.round(max * 0.28) + 20, 25, max);
    return { key: a.key, label: a.label, group: a.group, min, max };
  });
}

export const ATTR_GROUPS = ["Finishing", "Shooting", "Playmaking", "Defense", "Physicals"];

export function overallPotential(caps: AttrCap[]) {
  const avg = caps.reduce((s, c) => s + c.max, 0) / caps.length;
  return clamp(Math.round(avg * 0.62 + 34), 60, 99);
}
