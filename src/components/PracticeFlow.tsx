import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "../store";
import { useSession, type PracticeMode } from "../session";
import { ModeSelectScreen } from "./ModeSelectScreen";
import { TableSelectScreen } from "./TableSelectScreen";
import { QuestionScreen } from "./QuestionScreen";
import { ActionSceneScreen, calcActionSceneTotal } from "./ActionSceneScreen";
import { SessionSummary } from "./SessionSummary";
import { TableIntro } from "./TableIntro";
import { AwardCelebration, PremiereCelebration } from "./CelebrationOverlay";
import { checkNewAwards, getAwardDef } from "../awards";
import { THEMES } from "../themes";
import { getTableProgress } from "../leitner";
import { getTableInfo } from "../tables";
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
  const [pendingAwards, setPendingAwards] = useState<string[]>([]);
  const [premiereTable, setPremiereTable] = useState<number | null>(null);
  const navigate = useNavigate();
  const savedRef = useRef(false);
  const celebrationCheckedRef = useRef(false);

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

  // ── Check awards, themes, and premiere after state updates ──
  useEffect(() => {
    if (!isComplete || !session || !savedRef.current || celebrationCheckedRef.current) return;
    // Wait for state to reflect the new session
    if (!state.sessions.some((s) => s.date === state.sessions[state.sessions.length - 1]?.date)) return;
    celebrationCheckedRef.current = true;

    // Check for new awards
    const newAwards = checkNewAwards(state);
    if (newAwards.length > 0) {
      for (const id of newAwards) dispatch({ type: "UNLOCK_AWARD", id });
      setPendingAwards(newAwards);
    }

    // Check for theme unlocks
    for (const theme of THEMES) {
      if (state.unlockedThemes.includes(theme.id)) continue;
      if (theme.unlockTable === 0) {
        // Monster Movie: all tables
        if (theme.id === "monster-movie" && state.studioLevel >= 10) {
          dispatch({ type: "UNLOCK_THEME", id: theme.id });
        }
        continue;
      }
      const p = getTableProgress(state.facts, theme.unlockTable);
      if (p.total > 0 && p.mastered === p.total) {
        dispatch({ type: "UNLOCK_THEME", id: theme.id });
      }
    }

    // Check for premiere (table just mastered this session)
    if (session.table > 0) {
      const p = getTableProgress(state.facts, session.table);
      if (p.total > 0 && p.mastered === p.total) {
        setPremiereTable(session.table);
      }
    }
  }, [isComplete, session, state, dispatch]);

  // ── Celebration dismiss handlers ──
  const dismissAward = useCallback(() => {
    setPendingAwards((prev) => prev.slice(1));
  }, []);

  const dismissPremiere = useCallback(() => {
    setPremiereTable(null);
  }, []);

  // ── Navigation ──
  const handleBackToStudio = useCallback(() => {
    savedRef.current = false;
    celebrationCheckedRef.current = false;
    resetSession();
    setSelectedMode(null);
    setPendingAwards([]);
    setPremiereTable(null);
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

  // 4. Celebrations (awards + premiere) — shown before summary
  if (isComplete && session && premiereTable !== null) {
    const info = getTableInfo(premiereTable);
    return (
      <AnimatePresence>
        <PremiereCelebration
          table={premiereTable}
          tableName={info?.name ?? `Table ${premiereTable}`}
          tableEmoji={info?.emoji ?? "🎬"}
          onDone={dismissPremiere}
        />
      </AnimatePresence>
    );
  }

  if (isComplete && session && pendingAwards.length > 0) {
    const award = getAwardDef(pendingAwards[0]);
    if (award) {
      return (
        <AnimatePresence>
          <AwardCelebration
            emoji={award.emoji}
            name={award.name}
            description={award.description}
            onDone={dismissAward}
          />
        </AnimatePresence>
      );
    }
  }

  // 5. Session summary
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
