import { useEffect } from "react";
import { motion } from "framer-motion";
import type { SessionResult } from "../session";
import { speak } from "../tts";

interface SessionSummaryProps {
  results: SessionResult[];
  table: number;
  onBackToStudio: () => void;
}

export function SessionSummary({
  results,
  onBackToStudio,
}: SessionSummaryProps) {
  const nailed = results.filter(
    (r) => r.correct && !r.discoveryAssisted
  ).length;
  const directed = results.filter(
    (r) => r.correct && r.discoveryAssisted
  ).length;
  const learned = results.filter((r) => !r.correct).length;

  useEffect(() => {
    speak("That's a wrap on today's shoot!");
  }, []);

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
        <div className="text-5xl sm:text-6xl mb-3">🎬</div>
        <h1
          className="m-0"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 10vw, 56px)",
            color: "var(--colour-accent-gold)",
            textShadow: "0 0 40px rgba(230, 180, 34, 0.25)",
          }}
        >
          THAT'S A WRAP!
        </h1>
      </motion.div>

      {/* Stats — three categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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
            Scenes Nailed
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
              Scenes Learned
            </div>
          </div>
        )}
      </motion.div>

      {/* Question recap cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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
          const glow = r.correct && !r.discoveryAssisted
            ? "0 0 12px rgba(78, 205, 196, 0.15)"
            : "0 2px 8px rgba(0,0,0,0.2)";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.6 + i * 0.08,
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
