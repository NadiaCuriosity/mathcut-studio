import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { UserProgress, FactRecord } from "./types";

const STORAGE_KEY = "mathcut-studio-data";

function createInitialFact(a: number, b: number): FactRecord {
  // Auto-complete any fact involving ×1 or ×10 (Lincoln already knows these)
  const isAutoMastered = a === 1 || a === 10 || b === 1 || b === 10;
  return {
    a,
    b,
    box: isAutoMastered ? 5 : 1,
    correctStreak: isAutoMastered ? 5 : 0,
    recentMisses: 0,
    totalAttempts: isAutoMastered ? 5 : 0,
    totalCorrect: isAutoMastered ? 5 : 0,
    lastAttempted: isAutoMastered ? new Date().toISOString() : "",
    lastCorrect: isAutoMastered ? new Date().toISOString() : "",
    isFading: false,
  };
}

function createInitialProgress(): UserProgress {
  const facts: FactRecord[] = [];
  for (let a = 1; a <= 12; a++) {
    for (let b = 1; b <= 12; b++) {
      facts.push(createInitialFact(a, b));
    }
  }
  return {
    facts,
    sessions: [],
    studioLevel: 0,
    unlockedThemes: ["directors-set"],
    unlockedAwards: [],
    settings: {
      speechRate: 1.0,
      useDyslexicFont: false,
      highContrastMode: false,
      timerEnabled: false,
      sessionLength: 10,
      preferredTheme: "directors-set",
      voiceInputEnabled: true,
    },
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: "",
    },
    tablesIntroduced: [1, 10],
  };
}

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as UserProgress;
      // Migration: add tablesIntroduced if missing
      if (!data.tablesIntroduced) {
        data.tablesIntroduced = [1];
      }
      return data;
    }
  } catch {
    // corrupt data — start fresh
  }
  return createInitialProgress();
}

function saveProgress(state: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Actions ──

type Action =
  | { type: "ANSWER_CORRECT"; a: number; b: number }
  | { type: "ANSWER_INCORRECT"; a: number; b: number }
  | { type: "INTRODUCE_TABLE"; table: number };

function findFact(facts: FactRecord[], a: number, b: number) {
  return facts.findIndex((f) => f.a === a && f.b === b);
}

function reducer(state: UserProgress, action: Action): UserProgress {
  const now = new Date().toISOString();
  const facts = [...state.facts];

  switch (action.type) {
    case "ANSWER_CORRECT": {
      const idx = findFact(facts, action.a, action.b);
      if (idx === -1) return state;
      const fact = { ...facts[idx] };
      fact.totalAttempts++;
      fact.totalCorrect++;
      fact.correctStreak++;
      fact.lastAttempted = now;
      fact.lastCorrect = now;
      fact.recentMisses = 0;
      // Leitner promotion: advance to next box (max 5)
      if (fact.box < 5) {
        fact.box = (fact.box + 1) as FactRecord["box"];
      }
      facts[idx] = fact;
      return { ...state, facts };
    }
    case "ANSWER_INCORRECT": {
      const idx = findFact(facts, action.a, action.b);
      if (idx === -1) return state;
      const fact = { ...facts[idx] };
      fact.totalAttempts++;
      fact.correctStreak = 0;
      fact.recentMisses++;
      fact.lastAttempted = now;
      // NO demotion — fact stays in its current box
      facts[idx] = fact;
      return { ...state, facts };
    }
    case "INTRODUCE_TABLE": {
      if (state.tablesIntroduced.includes(action.table)) return state;
      return {
        ...state,
        tablesIntroduced: [...state.tablesIntroduced, action.table],
      };
    }
    default:
      return state;
  }
}

// ── Context ──

interface ProgressContextValue {
  state: UserProgress;
  dispatch: React.Dispatch<Action>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadProgress);

  // Persist after every state change
  useEffect(() => {
    saveProgress(state);
  }, [state]);

  return (
    <ProgressContext.Provider value={{ state, dispatch }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
