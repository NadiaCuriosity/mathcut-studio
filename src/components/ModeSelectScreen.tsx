import { motion } from "framer-motion";
import { useProgress } from "../store";
import { countActionSceneFacts } from "../leitner";
import type { PracticeMode } from "../session";

interface ModeSelectScreenProps {
  onSelect: (mode: PracticeMode) => void;
  onBack: () => void;
}

const MODES: {
  mode: PracticeMode;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
}[] = [
  {
    mode: "rehearsal",
    emoji: "🎬",
    title: "Rehearsal",
    subtitle: "Learn & Practice",
    description: "Full support with arrays and discovery pathway",
  },
  {
    mode: "take",
    emoji: "🎥",
    title: "Take",
    subtitle: "Adaptive Challenge",
    description: "Visuals scale with your mastery level",
  },
  {
    mode: "action",
    emoji: "💥",
    title: "Action Scene",
    subtitle: "Quick-Fire",
    description: "Speed round for mastered facts — beat your high score!",
  },
  {
    mode: "directors-cut",
    emoji: "🎞️",
    title: "Director's Cut",
    subtitle: "Mixed Review",
    description: "All your tables shuffled together",
  },
  {
    mode: "reshoots",
    emoji: "🔁",
    title: "Reshoots",
    subtitle: "Tricky Facts",
    description: "Practice the facts you've flagged",
  },
];

const ACTION_SCENE_MIN = 10;

export function ModeSelectScreen({ onSelect, onBack }: ModeSelectScreenProps) {
  const { state } = useProgress();
  const actionCount = countActionSceneFacts(state.facts);
  const actionLocked = actionCount < ACTION_SCENE_MIN;
  const reshootsLocked = (state.trickyFacts?.length ?? 0) === 0;

  // Director's Cut needs at least some practiced facts from 2+ tables
  const practicedTables = new Set(
    state.facts
      .filter(
        (f) =>
          f.totalAttempts > 0 &&
          f.b !== 1 &&
          f.b !== 10 &&
          f.a !== 1 &&
          f.a !== 10
      )
      .map((f) => f.a)
  );
  const directorsCutLocked = practicedTables.size < 2;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Warm spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(230, 180, 34, 0.06) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center pt-5 sm:pt-7 pb-1 px-5">
        <button
          onClick={onBack}
          className="self-start mb-2 cursor-pointer"
          style={{
            background: "none",
            border: "none",
            color: "var(--colour-accent-gold)",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            padding: 0,
          }}
        >
          ← Back
        </button>
        <h1
          className="text-2xl sm:text-3xl tracking-[0.05em] uppercase m-0 leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--colour-accent-gold)",
          }}
        >
          CHOOSE YOUR MODE
        </h1>
        <p
          className="text-base sm:text-lg mt-2 mb-0"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--colour-text-secondary)",
          }}
        >
          How do you want to practice?
        </p>
      </header>

      {/* Mode cards */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 pb-6 pt-4">
        <div className="flex flex-col gap-3 max-w-[480px] mx-auto">
          {MODES.map((m, i) => {
            const isLocked =
              (m.mode === "action" && actionLocked) ||
              (m.mode === "directors-cut" && directorsCutLocked) ||
              (m.mode === "reshoots" && reshootsLocked);

            return (
              <motion.button
                key={m.mode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.05 * (i + 1),
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                whileHover={isLocked ? undefined : { scale: 1.02, x: 4 }}
                whileTap={isLocked ? undefined : { scale: 0.98 }}
                onClick={() => !isLocked && onSelect(m.mode)}
                disabled={isLocked}
                className="flex items-center gap-4 p-4 sm:p-5 rounded-xl cursor-pointer text-left disabled:cursor-default"
                style={{
                  background: isLocked
                    ? "var(--colour-bg-elevated)"
                    : "linear-gradient(135deg, var(--colour-bg-elevated), var(--colour-bg-raised))",
                  border: isLocked
                    ? "1.5px solid rgba(230, 180, 34, 0.06)"
                    : "1.5px solid rgba(230, 180, 34, 0.15)",
                  boxShadow: isLocked
                    ? "none"
                    : "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(245, 230, 163, 0.05)",
                  opacity: isLocked ? 0.4 : 1,
                }}
              >
                <div className="text-3xl sm:text-4xl shrink-0">{m.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-lg sm:text-xl"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--colour-text-primary)",
                      }}
                    >
                      {m.title}
                    </span>
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--colour-accent-gold-light)",
                      }}
                    >
                      {m.subtitle}
                    </span>
                  </div>
                  <p
                    className="m-0 mt-0.5 text-xs sm:text-sm"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--colour-text-secondary)",
                    }}
                  >
                    {isLocked && m.mode === "action"
                      ? `Need ${ACTION_SCENE_MIN - actionCount} more mastered facts`
                      : isLocked && m.mode === "directors-cut"
                        ? "Practice at least 2 tables first"
                        : isLocked && m.mode === "reshoots"
                          ? "Flag tricky facts in Movies first"
                          : m.mode === "reshoots" && !isLocked
                            ? `${state.trickyFacts.length} fact${state.trickyFacts.length !== 1 ? "s" : ""} flagged`
                            : m.description}
                  </p>
                </div>
                {isLocked && (
                  <span className="text-xl shrink-0 opacity-50">🔒</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
