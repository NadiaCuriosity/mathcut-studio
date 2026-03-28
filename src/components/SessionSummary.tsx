import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { SessionResult } from "../session";
import type { PracticeMode } from "../session";
import { useProgress } from "../store";
import { calcActionSceneTotal } from "./ActionSceneScreen";
import { speak } from "../tts";

interface SessionSummaryProps {
  results: SessionResult[];
  table: number;
  practiceMode: PracticeMode;
  personalBest: number;
  onBackToStudio: () => void;
}

const MODE_TITLES: Record<PracticeMode, string> = {
  rehearsal: "THAT'S A WRAP!",
  take: "THAT'S A WRAP!",
  action: "BOX OFFICE REPORT",
  "directors-cut": "DIRECTOR'S CUT WRAP!",
  reshoots: "RESHOOTS WRAP!",
};

const MODE_EMOJIS: Record<PracticeMode, string> = {
  rehearsal: "🎬",
  take: "🎥",
  action: "💥",
  "directors-cut": "🎞️",
  reshoots: "🔁",
};

export function SessionSummary({
  results,
  practiceMode,
  personalBest,
  onBackToStudio,
}: SessionSummaryProps) {
  const { state, dispatch } = useProgress();
  const [reshootsAdded, setReshootsAdded] = useState(false);
  const nailed = results.filter(
    (r) => r.correct && !r.discoveryAssisted
  ).length;
  const directed = results.filter(
    (r) => r.correct && r.discoveryAssisted
  ).length;
  const learned = results.filter((r) => !r.correct).length;

  const actionScore = useMemo(
    () =>
      practiceMode === "action" ? calcActionSceneTotal(results) : 0,
    [practiceMode, results]
  );
  const isNewBest =
    practiceMode === "action" && actionScore > personalBest;

  // Director's Cut table breakdown
  const tableBreakdown = useMemo(() => {
    if (practiceMode !== "directors-cut") return [];
    const map = new Map<number, { correct: number; total: number }>();
    for (const r of results) {
      const t = r.a;
      if (!map.has(t)) map.set(t, { correct: 0, total: 0 });
      const entry = map.get(t)!;
      entry.total++;
      if (r.correct) entry.correct++;
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [practiceMode, results]);

  useEffect(() => {
    if (practiceMode === "action") {
      speak(
        isNewBest
          ? "New personal best! Incredible box office numbers!"
          : "That's a wrap on the action scene!"
      );
    } else {
      speak("That's a wrap on today's shoot!");
    }
  }, [practiceMode, isNewBest]);

  return (
    <div className="h-full flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Warm spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(230, 180, 34, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="text-center mb-6 relative z-10"
      >
        <div className="text-5xl sm:text-6xl mb-3">
          {MODE_EMOJIS[practiceMode]}
        </div>
        <h1
          className="m-0"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 8vw, 48px)",
            color: "var(--colour-accent-gold)",
            textShadow: "0 0 40px rgba(230, 180, 34, 0.25)",
          }}
        >
          {MODE_TITLES[practiceMode]}
        </h1>
      </motion.div>

      {/* Action Scene: Score display */}
      {practiceMode === "action" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-4 relative z-10"
        >
          <div
            className="text-xs uppercase tracking-widest mb-1"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--colour-accent-gold-light)",
            }}
          >
            Box Office Takings
          </div>
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.4 }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(36px, 10vw, 56px)",
              fontWeight: 700,
              color: isNewBest
                ? "var(--colour-success)"
                : "var(--colour-accent-gold)",
            }}
          >
            {actionScore.toLocaleString()}
          </motion.div>
          {isNewBest && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-sm mt-1"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--colour-success)",
                letterSpacing: "0.08em",
              }}
            >
              NEW PERSONAL BEST!
            </motion.div>
          )}
          {!isNewBest && personalBest > 0 && (
            <div
              className="text-xs mt-1"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--colour-text-secondary)",
              }}
            >
              Best: {personalBest.toLocaleString()}
            </div>
          )}
        </motion.div>
      )}

      {/* Stats — three categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: practiceMode === "action" ? 0.5 : 0.3 }}
        className="flex gap-6 sm:gap-10 mb-6 relative z-10 flex-wrap justify-center"
      >
        {/* Scenes Nailed */}
        <div className="text-center">
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(28px, 7vw, 44px)",
              fontWeight: 700,
              color: "var(--colour-success)",
            }}
          >
            {nailed}
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--colour-text-secondary)",
            }}
          >
            {practiceMode === "action" ? "Nailed" : "Scenes Nailed"}
          </div>
        </div>

        {/* Scenes Directed — only show if any */}
        {directed > 0 && (
          <div className="text-center">
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(28px, 7vw, 44px)",
                fontWeight: 700,
                color: "var(--colour-accent-gold)",
              }}
            >
              {directed}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--colour-text-secondary)",
              }}
            >
              Scenes Directed
            </div>
          </div>
        )}

        {/* New Scenes Learned — only show if any */}
        {learned > 0 && (
          <div className="text-center">
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(28px, 7vw, 44px)",
                fontWeight: 700,
                color: "var(--colour-accent-gold-light)",
              }}
            >
              {learned}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--colour-text-secondary)",
              }}
            >
              {practiceMode === "action" ? "Missed" : "Scenes Learned"}
            </div>
          </div>
        )}
      </motion.div>

      {/* Director's Cut: table breakdown */}
      {tableBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-2 justify-center mb-4 relative z-10"
        >
          {tableBreakdown.map(([table, stats]) => (
            <div
              key={table}
              className="px-3 py-1.5 rounded-lg text-center"
              style={{
                background: "var(--colour-bg-elevated)",
                border: "1px solid rgba(230, 180, 34, 0.15)",
              }}
            >
              <div
                className="text-xs"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--colour-accent-gold)",
                }}
              >
                ×{table}
              </div>
              <div
                className="text-xs"
                style={{
                  fontFamily: "var(--font-mono)",
                  color:
                    stats.correct === stats.total
                      ? "var(--colour-success)"
                      : "var(--colour-text-secondary)",
                }}
              >
                {stats.correct}/{stats.total}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Question recap cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: practiceMode === "action" ? 0.7 : 0.5 }}
        className="flex flex-wrap gap-2 justify-center mb-8 max-w-[400px] relative z-10"
      >
        {results.map((r, i) => {
          const cardColor = !r.correct
            ? "var(--colour-accent-gold-light)"
            : r.discoveryAssisted
              ? "var(--colour-accent-gold)"
              : "var(--colour-success)";
          const borderColor = !r.correct
            ? "rgba(230, 180, 34, 0.15)"
            : r.discoveryAssisted
              ? "rgba(230, 180, 34, 0.3)"
              : "rgba(78, 205, 196, 0.3)";
          const glow =
            r.correct && !r.discoveryAssisted
              ? "0 0 12px rgba(78, 205, 196, 0.15)"
              : "0 2px 8px rgba(0,0,0,0.2)";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: (practiceMode === "action" ? 0.8 : 0.6) + i * 0.08,
                type: "spring",
                stiffness: 260,
                damping: 15,
              }}
              className="px-3 py-2 rounded-lg text-center"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "14px",
                fontWeight: 600,
                background: "var(--colour-bg-elevated)",
                color: cardColor,
                border: `1.5px solid ${borderColor}`,
                boxShadow: glow,
              }}
            >
              {r.a}×{r.b}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add to Reshoots — offer after single-fact help */}
      {practiceMode === "reshoots" && results.length > 0 && !reshootsAdded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-4 relative z-10"
        >
          <button
            onClick={() => {
              for (const r of results) {
                const na = Math.min(r.a, r.b);
                const nb = Math.max(r.a, r.b);
                const already = state.trickyFacts.some(
                  (t) => t.a === na && t.b === nb
                );
                if (!already) {
                  dispatch({ type: "TOGGLE_TRICKY_FACT", a: r.a, b: r.b });
                }
              }
              setReshootsAdded(true);
            }}
            className="px-5 py-2.5 rounded-xl cursor-pointer"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              letterSpacing: "0.05em",
              background: "var(--colour-bg-elevated)",
              color: "var(--colour-cta)",
              border: "1.5px solid var(--colour-cta)",
            }}
          >
            ADD TO RESHOOTS 🔁
          </button>
        </motion.div>
      )}
      {reshootsAdded && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 relative z-10 m-0"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--colour-success)",
          }}
        >
          Added to Reshoots for extra practice!
        </motion.p>
      )}

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBackToStudio}
        className="px-8 py-4 rounded-xl cursor-pointer relative z-10"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(20px, 5vw, 28px)",
          letterSpacing: "0.05em",
          background: "var(--colour-accent-gold)",
          color: "var(--colour-bg-deep)",
          border: "none",
          boxShadow:
            "0 4px 0 rgba(0,0,0,0.3), 0 0 20px rgba(230, 180, 34, 0.2)",
        }}
      >
        BACK TO STUDIO
      </motion.button>
    </div>
  );
}
