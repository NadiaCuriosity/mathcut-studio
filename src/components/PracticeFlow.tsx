import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProgress } from "../store";
import { useSession, type PracticeMode } from "../session";
import { ModeSelectScreen } from "./ModeSelectScreen";
import { TableSelectScreen } from "./TableSelectScreen";
import { QuestionScreen } from "./QuestionScreen";
import { ActionSceneScreen, calcActionSceneTotal } from "./ActionSceneScreen";
import { SessionSummary } from "./SessionSummary";
import { TableIntro } from "./TableIntro";
import type { SessionRecord } from "../types";

export function PracticeFlow() {
  const { state, dispatch } = useProgress();
  const {
    session,
    isComplete,
    startSession,
    startActionScene,
    startDirectorsCut,
    resetSession,
  } = useSession();
  const [selectedMode, setSelectedMode] = useState<PracticeMode | null>(null);
  const [introTable, setIntroTable] = useState<number | null>(null);
  const navigate = useNavigate();
  const savedRef = useRef(false);

  // ── Mode selection ──
  const handleModeSelect = useCallback(
    (mode: PracticeMode) => {
      if (mode === "action") {
        // Action Scene: start immediately (all Box 4-5 facts)
        startActionScene(state.facts, 15);
        setSelectedMode(mode);
      } else if (mode === "directors-cut") {
        // Director's Cut: start immediately (mixed tables)
        startDirectorsCut(state.facts, 12);
        setSelectedMode(mode);
      } else {
        // Rehearsal / Take: need table selection next
        setSelectedMode(mode);
      }
    },
    [state.facts, startActionScene, startDirectorsCut]
  );

  // ── Table selection (for Rehearsal/Take) ──
  const handleTableStart = useCallback(
    (table: number) => {
      startSession(
        table,
        state.facts,
        state.settings.sessionLength,
        selectedMode ?? "rehearsal"
      );

      if (!(state.tablesIntroduced ?? []).includes(table)) {
        dispatch({ type: "INTRODUCE_TABLE", table });
        setIntroTable(table);
      }
    },
    [state, startSession, dispatch, selectedMode]
  );

  const handleIntroComplete = useCallback(() => {
    setIntroTable(null);
  }, []);

  // ── Save session when complete ──
  useEffect(() => {
    if (isComplete && session && !savedRef.current) {
      savedRef.current = true;
      const record: SessionRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        mode: session.practiceMode,
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

      // Action Scene: update personal best
      if (session.practiceMode === "action") {
        const score = calcActionSceneTotal(session.results);
        dispatch({ type: "SET_ACTION_SCENE_BEST", score });
      }
    }
  }, [isComplete, session, dispatch]);

  // ── Navigation ──
  const handleBackToStudio = useCallback(() => {
    savedRef.current = false;
    resetSession();
    setSelectedMode(null);
    navigate("/");
  }, [resetSession, navigate]);

  const handleBackFromModeSelect = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleBackFromTableSelect = useCallback(() => {
    setSelectedMode(null);
  }, []);

  // ── Render ──

  // 1. Mode selection (no mode chosen yet, no active session)
  if (!selectedMode && !session) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        <ModeSelectScreen
          onSelect={handleModeSelect}
          onBack={handleBackFromModeSelect}
        />
      </motion.div>
    );
  }

  // 2. Table selection (Rehearsal/Take selected, no session yet)
  if (
    selectedMode &&
    (selectedMode === "rehearsal" || selectedMode === "take") &&
    !session
  ) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        <TableSelectScreen
          onStart={handleTableStart}
          onBack={handleBackFromTableSelect}
          backLabel="Choose Mode"
        />
      </motion.div>
    );
  }

  // 3. Table intro (first encounter)
  if (introTable !== null) {
    return <TableIntro table={introTable} onComplete={handleIntroComplete} />;
  }

  // 4. Session summary
  if (isComplete && session) {
    return (
      <SessionSummary
        results={session.results}
        table={session.table}
        practiceMode={session.practiceMode}
        personalBest={state.actionSceneBest}
        onBackToStudio={handleBackToStudio}
      />
    );
  }

  // 5. Active question — different screen for Action Scene
  if (session?.practiceMode === "action") {
    return <ActionSceneScreen key={session.currentIndex} />;
  }

  // 6. Active question — Rehearsal / Take / Director's Cut
  return <QuestionScreen key={session?.currentIndex} />;
}
