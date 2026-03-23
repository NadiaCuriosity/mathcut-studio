import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { UserProgress, FactRecord, SessionRecord, StreakData } from "./types";

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
    unlockedThemes: ["lizard-lounge", "directors-set"],
    unlockedAwards: [],
    settings: {
      speechRate: 1.0,
      useDyslexicFont: false,
      highContrastMode: false,
      timerEnabled: false,
      sessionLength: 10,
      preferredTheme: "lizard-lounge",
      voiceInputEnabled: true,
    },
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: "",
    },
    tablesIntroduced: [1, 10],
    actionSceneBest: 0,
  };
}

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as UserProgress;
      // Migrations for older data
      if (!data.tablesIntroduced) {
        data.tablesIntroduced = [1];
      }
      if (!data.sessions) {
        data.sessions = [];
      }
      if (!data.streak) {
        data.streak = { currentStreak: 0, longestStreak: 0, lastActiveDate: "" };
      }
      if (data.studioLevel === undefined) {
        data.studioLevel = 0;
      }
      if (data.actionSceneBest === undefined) {
        data.actionSceneBest = 0;
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

// ── Utilities ──

export function calculateStudioLevel(facts: FactRecord[]): number {
  const tables = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  let level = 0;
  for (const table of tables) {
    const tableFacts = facts.filter(
      (f) => f.a === table && f.b !== 1 && f.b !== 10
    );
    if (tableFacts.length > 0 && tableFacts.every((f) => f.box >= 4)) {
      level++;
    }
  }
  return level;
}

export function getEffectiveStreak(streak: StreakData): number {
  if (!streak.lastActiveDate) return 0;
  const today = new Date().toISOString().split("T")[0];
  if (streak.lastActiveDate === today) return streak.currentStreak;
  const yesterday = new Date(Date.now() - 86_400_000)
    .toISOString()
    .split("T")[0];
  if (streak.lastActiveDate === yesterday) return streak.currentStreak;
  return 0; // streak broken
}

// ── Actions ──

type Action =
  | { type: "ANSWER_CORRECT"; a: number; b: number }
  | { type: "ANSWER_INCORRECT"; a: number; b: number }
  | { type: "INTRODUCE_TABLE"; table: number }
  | { type: "COMPLETE_SESSION"; session: SessionRecord }
  | { type: "SET_ACTION_SCENE_BEST"; score: number }
  | { type: "UNLOCK_AWARD"; id: string }
  | { type: "UNLOCK_THEME"; id: string }
  | { type: "SET_THEME"; id: string };

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
    case "COMPLETE_SESSION": {
      const today = now.split("T")[0];
      const lastActive = state.streak.lastActiveDate;
      let currentStreak = state.streak.currentStreak;
      let { longestStreak } = state.streak;

      if (lastActive !== today) {
        const yesterday = new Date(Date.now() - 86_400_000)
          .toISOString()
          .split("T")[0];
        currentStreak = lastActive === yesterday ? currentStreak + 1 : 1;
        longestStreak = Math.max(longestStreak, currentStreak);
      }

      const newLevel = calculateStudioLevel(state.facts);

      return {
        ...state,
        sessions: [...state.sessions, action.session],
        streak: { currentStreak, longestStreak, lastActiveDate: today },
        studioLevel: Math.max(state.studioLevel, newLevel),
      };
    }
    case "SET_ACTION_SCENE_BEST": {
      if (action.score <= state.actionSceneBest) return state;
      return { ...state, actionSceneBest: action.score };
    }
    case "UNLOCK_AWARD": {
      if (state.unlockedAwards.includes(action.id)) return state;
      return {
        ...state,
        unlockedAwards: [...state.unlockedAwards, action.id],
      };
    }
    case "UNLOCK_THEME": {
      if (state.unlockedThemes.includes(action.id)) return state;
      return {
        ...state,
        unlockedThemes: [...state.unlockedThemes, action.id],
      };
    }
    case "SET_THEME": {
      if (state.settings.preferredTheme === action.id) return state;
      return {
        ...state,
        settings: { ...state.settings, preferredTheme: action.id },
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
