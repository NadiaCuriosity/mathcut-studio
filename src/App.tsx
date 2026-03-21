import { useState, useCallback } from "react";
import { ProgressProvider, useProgress } from "./store";
import { SessionProvider, useSession } from "./session";
import { TableSelectScreen } from "./components/TableSelectScreen";
import { QuestionScreen } from "./components/QuestionScreen";
import { SessionSummary } from "./components/SessionSummary";
import { TableIntro } from "./components/TableIntro";

function AppContent() {
  const { state, dispatch } = useProgress();
  const { session, isComplete, startSession, resetSession } = useSession();
  const [introTable, setIntroTable] = useState<number | null>(null);

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

  // Table selection
  if (!session) {
    return <TableSelectScreen onStart={handleStart} />;
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
        onBackToStudio={resetSession}
      />
    );
  }

  // Active question
  return <QuestionScreen key={session.currentIndex} />;
}

function App() {
  return (
    <ProgressProvider>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </ProgressProvider>
  );
}

export default App;
