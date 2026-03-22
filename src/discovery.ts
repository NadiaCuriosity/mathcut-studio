import type { FactRecord } from "./types";

export type StrategyType =
  | "doubling"
  | "add-one-group"
  | "subtract-one-group"
  | "halving"
  | "splitting";

export interface DerivedStrategy {
  type: StrategyType;
  anchorA: number;
  anchorB: number;
  anchorProduct: number;
  extraRows: number; // always positive magnitude
  extraProduct: number; // always positive magnitude
}

// Table → primary derivation strategy (PRD §5.2.3)
const TABLE_STRATEGIES: Record<
  number,
  { type: StrategyType; from: number | [number, number] }
> = {
  2: { type: "add-one-group", from: 1 },
  3: { type: "add-one-group", from: 2 },
  4: { type: "doubling", from: 2 },
  5: { type: "halving", from: 10 },
  6: { type: "add-one-group", from: 5 },
  7: { type: "splitting", from: [5, 2] },
  8: { type: "doubling", from: 4 },
  9: { type: "subtract-one-group", from: 10 },
  11: { type: "add-one-group", from: 10 },
  12: { type: "splitting", from: [10, 2] },
};

function isKnown(facts: FactRecord[], a: number, b: number): boolean {
  const f = facts.find((x) => x.a === a && x.b === b);
  return !!f && f.box >= 3;
}

export function findStrategy(
  a: number,
  b: number,
  facts: FactRecord[]
): DerivedStrategy | null {
  const strat = TABLE_STRATEGIES[a];

  if (strat) {
    switch (strat.type) {
      case "doubling": {
        const half = strat.from as number;
        if (isKnown(facts, half, b)) {
          return {
            type: "doubling",
            anchorA: half,
            anchorB: b,
            anchorProduct: half * b,
            extraRows: half,
            extraProduct: half * b,
          };
        }
        break;
      }
      case "add-one-group": {
        const from = strat.from as number;
        if (isKnown(facts, from, b)) {
          return {
            type: "add-one-group",
            anchorA: from,
            anchorB: b,
            anchorProduct: from * b,
            extraRows: a - from,
            extraProduct: (a - from) * b,
          };
        }
        break;
      }
      case "subtract-one-group": {
        const from = strat.from as number;
        if (isKnown(facts, from, b)) {
          return {
            type: "subtract-one-group",
            anchorA: from,
            anchorB: b,
            anchorProduct: from * b,
            extraRows: from - a,
            extraProduct: (from - a) * b,
          };
        }
        break;
      }
      case "halving": {
        const from = strat.from as number;
        if (isKnown(facts, from, b)) {
          return {
            type: "halving",
            anchorA: from,
            anchorB: b,
            anchorProduct: from * b,
            extraRows: from - a,
            extraProduct: (from - a) * b,
          };
        }
        break;
      }
      case "splitting": {
        const [p1, p2] = strat.from as [number, number];
        if (isKnown(facts, p1, b)) {
          return {
            type: "splitting",
            anchorA: p1,
            anchorB: b,
            anchorProduct: p1 * b,
            extraRows: p2,
            extraProduct: p2 * b,
          };
        }
        break;
      }
    }
  }

  // Fallback: closest known fact with same b
  for (const offset of [-1, 1, -2, 2, -3, 3]) {
    const tryA = a + offset;
    if (tryA < 1 || tryA > 12 || tryA === a) continue;
    if (isKnown(facts, tryA, b)) {
      const diff = a - tryA;
      if (diff > 0) {
        return {
          type: "add-one-group",
          anchorA: tryA,
          anchorB: b,
          anchorProduct: tryA * b,
          extraRows: diff,
          extraProduct: diff * b,
        };
      } else {
        return {
          type: "subtract-one-group",
          anchorA: tryA,
          anchorB: b,
          anchorProduct: tryA * b,
          extraRows: -diff,
          extraProduct: -diff * b,
        };
      }
    }
  }

  return null;
}

/** Discovery level to start at based on fact mastery */
export function getStartLevel(fact: FactRecord): number {
  if (fact.box <= 2) return 1; // Full pathway
  if (fact.box === 3) return 3; // Skip pause + prompt
  return 4; // Quick hint for strong facts
}
