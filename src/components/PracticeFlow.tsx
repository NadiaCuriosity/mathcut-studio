import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProgress } from "../store";
import { useSession } from "../session";
import { TableSelectScreen } from "./TableSelectScreen";
import { QuestionScreen } from "./QuestionScreen";
import { SessionSummary } from "./SessionSummary";
import { TableIntro } from "./TableIntro";
import type { SessionRecord } from "../types";

export function PracticeFlow() {
  const { state, dispatch } = useProgress();
  const { session, isComplete, startSession, resetSession } = useSession();
  const [introTable, setIntroTable] = useState<number | null>(null);
  const navigate = useNavigate();
  const savedRef = useRef(false);

  const handleStart = useCallback(
    (table: number) => {
      startSession(table, state.facts, state.settings.sessionLength);

      if (!(state.tablesIntroduced ?? []).includes(table)) {
        dispatch({ type: "INTRODUCE_TABLE", table });
        setIntroTable(table);
      }
    },
    [state, startSession, dispatch]
  );

  const handleIntroComplete = useCallback(() => {
    setIntroTable(null);
  }, []);

  // Save session to store when complete
  useEffect(() => {
    if (isComplete && session && !savedRef.current) {
      savedRef.current = true;
      const record: SessionRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        mode: "rehearsal",
        factsAttempted: session.results.length,
        factsCorrect: session.results.filter((r) => r.correct).length,
        duration: Date.now() - session.startTime,
        questions: session.results.map((r) => ({
          a: r.a,
          b: r.b,
          userAnswer: null,
          correct: r.correct,
          responseTime: r.responseTime,
          inputMethod: "keypad" as const,
          previousBox: 0,
          newBox: 0,
          discoveryAssisted: r.discoveryAssisted,
          discoveryLevel: r.discoveryLevel,
          anchorFactUsed: null,
          builtArray: false,
        })),
      };
      dispatch({ type: "COMPLETE_SESSION", session: record });
    }
  }, [isComplete, session, dispatch]);

  const handleBackToStudio = useCallback(() => {
    savedRef.current = false;
    resetSession();
    navigate("/");
  }, [resetSession, navigate]);

  const handleBackFromTableSelect = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // Table selection (no active session)
  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        <TableSelectScreen
          onStart={handleStart}
          onBack={handleBackFromTableSelect}
        />
      </motion.div>
    );
  }

  // Table intro (first encounter)
  if (introTable !== null) {
    return <TableIntro table={introTable} onComplete={handleIntroComplete} />;
  }

  // Session summary
  if (isComplete) {
    return (
      <SessionSummary
        results={session.results}
        table={session.table}
        onBackToStudio={handleBackToStudio}
      />
    );
  }

  // Active question
  return <QuestionScreen key={session.currentIndex} />;
}
