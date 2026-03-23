import type { UserProgress } from "./types";
import { getTableProgress } from "./leitner";
import { PRACTICABLE_TABLES } from "./tables";

export interface AwardDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  check: (state: UserProgress) => boolean;
}

const EVEN_TABLES = [2, 4, 6, 8, 12];
const ODD_TABLES = [3, 5, 7, 9, 11];

function tableMastered(state: UserProgress, table: number): boolean {
  const p = getTableProgress(state.facts, table);
  return p.total > 0 && p.mastered === p.total;
}

function masteredTableCount(state: UserProgress): number {
  return PRACTICABLE_TABLES.filter((t) => tableMastered(state, t)).length;
}

export const AWARDS: AwardDef[] = [
  {
    id: "first-take",
    name: "Baby Gecko",
    emoji: "🦎",
    description: "Complete your first ever session",
    check: (s) => s.sessions.length >= 1,
  },
  {
    id: "opening-weekend",
    name: "Opening Weekend",
    emoji: "🌟",
    description: "Master your first table",
    check: (s) => masteredTableCount(s) >= 1,
  },
  {
    id: "box-office-hit",
    name: "Gecko Streak",
    emoji: "🔥",
    description: "Get 10 correct in a row in a session",
    check: (s) =>
      s.sessions.some((sess) => {
        let streak = 0;
        for (const q of sess.questions) {
          streak = q.correct ? streak + 1 : 0;
          if (streak >= 10) return true;
        }
        return false;
      }),
  },
  {
    id: "marathon-director",
    name: "Lizard Stamina",
    emoji: "🐊",
    description: "Practise 7 days in a row",
    check: (s) => s.streak.longestStreak >= 7,
  },
  {
    id: "blockbuster",
    name: "Komodo King",
    emoji: "👑",
    description: "Master 5 tables",
    check: (s) => masteredTableCount(s) >= 5,
  },
  {
    id: "franchise-even",
    name: "Even Scales",
    emoji: "⚖️",
    description: "Master all even tables (2, 4, 6, 8, 12)",
    check: (s) => EVEN_TABLES.every((t) => tableMastered(s, t)),
  },
  {
    id: "franchise-odd",
    name: "Odd Chameleon",
    emoji: "🦎",
    description: "Master all odd tables (3, 5, 7, 9, 11)",
    check: (s) => ODD_TABLES.every((t) => tableMastered(s, t)),
  },
  {
    id: "lifetime-achievement",
    name: "Lizard Legend",
    emoji: "🐉",
    description: "Master all 10 tables",
    check: (s) => masteredTableCount(s) >= 10,
  },
  {
    id: "speed-demon",
    name: "Lightning Lizard",
    emoji: "⚡",
    description: "Get 100% accuracy in an Action Scene",
    check: (s) =>
      s.sessions.some(
        (sess) =>
          sess.mode === "action" &&
          sess.factsAttempted >= 5 &&
          sess.factsCorrect === sess.factsAttempted
      ),
  },
  {
    id: "comeback-kid",
    name: "Tail Regrowth",
    emoji: "🔄",
    description: "Re-master a fact that was fading",
    check: (s) =>
      s.facts.some(
        (f) => f.box >= 4 && f.totalAttempts > f.totalCorrect && f.correctStreak >= 2
      ),
  },
  {
    id: "triple-feature",
    name: "Hat Trick Lizard",
    emoji: "🎩",
    description: "Complete 3 sessions in one day",
    check: (s) => {
      const today = new Date().toISOString().split("T")[0];
      const todayCount = s.sessions.filter((sess) =>
        sess.date.startsWith(today)
      ).length;
      return todayCount >= 3;
    },
  },
  {
    id: "rising-star",
    name: "Rising Reptile",
    emoji: "🦕",
    description: "Reach Studio Level 3",
    check: (s) => s.studioLevel >= 3,
  },
];

/** Return IDs of newly earned awards (not yet in unlockedAwards) */
export function checkNewAwards(state: UserProgress): string[] {
  return AWARDS.filter(
    (a) => !state.unlockedAwards.includes(a.id) && a.check(state)
  ).map((a) => a.id);
}

export function getAwardDef(id: string): AwardDef | undefined {
  return AWARDS.find((a) => a.id === id);
}
