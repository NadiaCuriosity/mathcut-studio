import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrayIcon, getGapClass } from "./ArrayIcon";
import { speak } from "../tts";

const ROW_WORDS = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
];

interface InteractiveArrayProps {
  rows: number;
  cols: number;
  speechRate?: number;
}

export function InteractiveArray({
  rows,
  cols,
  speechRate = 1.0,
}: InteractiveArrayProps) {
  const [highlightedCount, setHighlightedCount] = useState(0);
  const gap = getGapClass(cols, rows);

  const handleTapRow = useCallback(() => {
    if (highlightedCount >= rows) return;

    const next = highlightedCount + 1;
    const total = next * cols;
    setHighlightedCount(next);

    if (next === rows) {
      speak(`That's all ${rows} rows — ${total} altogether!`, speechRate);
    } else {
      speak(
        `${ROW_WORDS[next]} row${next > 1 ? "s" : ""} of ${cols} — ${total} so far!`,
        speechRate
      );
    }
  }, [highlightedCount, rows, cols, speechRate]);

  const runningTotal = highlightedCount * cols;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex flex-col items-center ${gap}`}
        role="img"
        aria-label={`Array: ${rows} rows of ${cols}. Tap rows to skip-count.`}
      >
        {Array.from({ length: rows }, (_, r) => {
          const isHighlighted = r < highlightedCount;

          return (
            <motion.div
              key={r}
              className={`flex ${gap} cursor-pointer rounded-lg px-1 py-0.5`}
              onClick={handleTapRow}
              animate={{
                backgroundColor: isHighlighted
                  ? "rgba(230, 180, 34, 0.15)"
                  : "transparent",
                boxShadow: isHighlighted
                  ? "0 0 12px rgba(230, 180, 34, 0.2)"
                  : "0 0 0 transparent",
              }}
              whileTap={{ scale: 0.97 }}
            >
              {Array.from({ length: cols }, (_, c) => (
                <ArrayIcon
                  key={c}
                  row={r}
                  col={c}
                  cols={cols}
                  totalRows={rows}
                  delay={r * 0.08 + c * 0.04}
                />
              ))}
            </motion.div>
          );
        })}
      </div>

      {/* Running total */}
      {highlightedCount > 0 && (
        <motion.div
          key={runningTotal}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-2 text-center"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(24px, 5vw, 36px)",
            fontWeight: 700,
            color: "var(--colour-accent-gold)",
          }}
        >
          = {runningTotal}
        </motion.div>
      )}
    </div>
  );
}
