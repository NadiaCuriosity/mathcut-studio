import type { FactRecord } from "./types";

const FADING_THRESHOLD_DAYS = 7;

function daysSinceLastCorrect(fact: FactRecord): number {
  if (!fact.lastCorrect) return Infinity;
  return (Date.now() - new Date(fact.lastCorrect).getTime()) / 86_400_000;
}

export function isFading(fact: FactRecord): boolean {
  return fact.box === 5 && daysSinceLastCorrect(fact) > FADING_THRESHOLD_DAYS;
}

function factPriority(fact: FactRecord): number {
  if (isFading(fact)) return 0;
  if (fact.recentMisses >= 2) return 1;
  if (fact.box === 1 && fact.totalAttempts === 0) return 2;
  if (fact.box === 1) return 2.5;
  if (fact.box === 2) return 3;
  if (fact.box === 3) return 4;
  return 5 + fact.box;
}

export function selectSessionFacts(
  allFacts: FactRecord[],
  table: number,
  sessionLength: number,
  maxNew = 3
): FactRecord[] {
  // Exclude ×1 and ×10 — Lincoln already knows these
  const tableFacts = allFacts.filter(
    (f) => f.a === table && f.b !== 1 && f.b !== 10
  );
  const sorted = [...tableFacts].sort(
    (a, b) => factPriority(a) - factPriority(b)
  );

  let newCount = 0;
  const selected: FactRecord[] = [];

  for (const fact of sorted) {
    if (selected.length >= sessionLength) break;
    if (fact.box === 1 && fact.totalAttempts === 0) {
      if (newCount >= maxNew) continue;
      newCount++;
    }
    selected.push(fact);
  }

  // Fisher-Yates shuffle
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected;
}

// Recommended table order from PRD (derived-fact progression)
// 1× and 10× are auto-mastered, so start from 5×
const TABLE_ORDER = [5, 2, 4, 8, 3, 6, 9, 7, 11, 12];

export function recommendTable(allFacts: FactRecord[]): number {
  for (const table of TABLE_ORDER) {
    const tableFacts = allFacts.filter((f) => f.a === table);
    const masteredCount = tableFacts.filter((f) => f.box >= 4).length;
    if (masteredCount < 12) return table;
  }
  return TABLE_ORDER[0];
}

export function getTableProgress(allFacts: FactRecord[], table: number) {
  // Only count real facts (exclude ×1 and ×10)
  const tableFacts = allFacts.filter(
    (f) => f.a === table && f.b !== 1 && f.b !== 10
  );
  const mastered = tableFacts.filter((f) => f.box >= 4).length;
  const practiced = tableFacts.filter((f) => f.totalAttempts > 0).length;
  return { total: tableFacts.length, mastered, practiced };
}
