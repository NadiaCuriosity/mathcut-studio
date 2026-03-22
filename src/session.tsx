import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { FactRecord } from "./types";
import { selectSessionFacts } from "./leitner";

export type PresentationMode = "build-it" | "interactive";

export interface SessionQuestion {
  a: number;
  b: number;
  mode: PresentationMode;
}

export interface SessionResult {
  a: number;
  b: number;
  correct: boolean;
  responseTime: number;
  discoveryAssisted: boolean;
  discoveryLevel: number | null;
}

export interface SessionData {
  table: number;
  questions: SessionQuestion[];
  currentIndex: number;
  results: SessionResult[];
  startTime: number;
  missCount: Record<string, number>;
}

function getMode(fact: FactRecord): PresentationMode {
  if (fact.box === 1 || fact.recentMisses >= 2) return "build-it";
  return "interactive";
}

interface SessionContextValue {
  session: SessionData | null;
  currentQuestion: SessionQuestion | null;
  isComplete: boolean;
  startSession: (
    table: number,
    facts: FactRecord[],
    sessionLength: number
  ) => void;
  recordAnswer: (
    correct: boolean,
    responseTime: number,
    discoveryAssisted?: boolean,
    discoveryLevel?: number | null
  ) => void;
  nextQuestion: () => void;
  wrapSession: () => void;
  resetSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null);

  const startSession = useCallback(
    (table: number, facts: FactRecord[], sessionLength: number) => {
      const selected = selectSessionFacts(facts, table, sessionLength);
      const questions: SessionQuestion[] = selected.map((f) => ({
        a: f.a,
        b: f.b,
        mode: getMode(f),
      }));
      setSession({
        table,
        questions,
        currentIndex: 0,
        results: [],
        startTime: Date.now(),
        missCount: {},
      });
    },
    []
  );

  const recordAnswer = useCallback(
    (
      correct: boolean,
      responseTime: number,
      discoveryAssisted = false,
      discoveryLevel: number | null = null
    ) => {
      setSession((prev) => {
        if (!prev) return prev;
        const q = prev.questions[prev.currentIndex];
        const key = `${q.a}x${q.b}`;
        const newMissCount = { ...prev.missCount };
        let newQuestions = prev.questions;

        if (!correct) {
          newMissCount[key] = (newMissCount[key] || 0) + 1;
          // Queue retry 3-4 questions later if not already missed twice (frustration guard)
          if (newMissCount[key] < 2) {
            const insertIdx = Math.min(
              prev.currentIndex + 3 + Math.floor(Math.random() * 2),
              prev.questions.length
            );
            newQuestions = [...prev.questions];
            newQuestions.splice(insertIdx, 0, {
              a: q.a,
              b: q.b,
              mode: "build-it" as PresentationMode,
            });
          }
        }

        return {
          ...prev,
          questions: newQuestions,
          results: [
            ...prev.results,
            {
              a: q.a,
              b: q.b,
              correct,
              responseTime,
              discoveryAssisted,
              discoveryLevel,
            },
          ],
          missCount: newMissCount,
        };
      });
    },
    []
  );

  const nextQuestion = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, []);

  const wrapSession = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, currentIndex: prev.questions.length };
    });
  }, []);

  const resetSession = useCallback(() => {
    setSession(null);
  }, []);

  const currentQuestion =
    session && session.currentIndex < session.questions.length
      ? session.questions[session.currentIndex]
      : null;

  const isComplete =
    session !== null && session.currentIndex >= session.questions.length;

  return (
    <SessionContext.Provider
      value={{
        session,
        currentQuestion,
        isComplete,
        startSession,
        recordAnswer,
        nextQuestion,
        wrapSession,
        resetSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx)
    throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
