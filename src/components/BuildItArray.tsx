import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrayIcon, getSizeClass, getGapClass } from "./ArrayIcon";
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

interface BuildItArrayProps {
  rows: number;
  cols: number;
  speechRate?: number;
  onComplete: () => void;
}

export function BuildItArray({
  rows,
  cols,
  speechRate = 1.0,
  onComplete,
}: BuildItArrayProps) {
  const [builtRows, setBuiltRows] = useState(0);
  const complete = builtRows >= rows;
  const gap = getGapClass(cols, rows);
  const placeholderSize = getSizeClass(cols, rows);

  const addRow = useCallback(() => {
    if (builtRows >= rows) return;

    const next = builtRows + 1;
    const total = next * cols;
    setBuiltRows(next);

    if (next === rows) {
      speak(
        `You built it! ${rows} times ${cols} is ${total}!`,
        speechRate
      );
      setTimeout(onComplete, 1000);
    } else {
      speak(
        `${ROW_WORDS[next]} row${next > 1 ? "s" : ""} of ${cols} — that's ${total}!`,
        speechRate
      );
    }
  }, [builtRows, rows, cols, speechRate, onComplete]);

  const fillAll = useCallback(() => {
    const total = rows * cols;
    setBuiltRows(rows);
    speak(`${rows} times ${cols} is ${total}!`, speechRate);
    setTimeout(onComplete, 1000);
  }, [rows, cols, speechRate, onComplete]);

  const runningTotal = builtRows * cols;

  return (
    <div className="flex flex-col items-center">
      {/* Grid area */}
      <div className={`flex flex-col items-center ${gap}`}>
        {Array.from({ length: rows }, (_, r) =>
          r < builtRows ? (
            /* Built row — icons animate in */
            <motion.div
              key={r}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${gap}`}
            >
              {Array.from({ length: cols }, (_, c) => (
                <ArrayIcon key={c} row={r} col={c} cols={cols} totalRows={rows} delay={c * 0.06} />
              ))}
            </motion.div>
          ) : (
            /* Empty row — dashed placeholders */
            <div key={r} className={`flex ${gap}`}>
              {Array.from({ length: cols }, (_, c) => (
                <motion.div
                  key={c}
                  className={`${placeholderSize} rounded-xl`}
                  style={{
                    border: "1.5px dashed rgba(230, 180, 34, 0.12)",
                    background: "rgba(35, 35, 66, 0.3)",
                  }}
                  animate={
                    r === builtRows
                      ? {
                          borderColor: [
                            "rgba(230, 180, 34, 0.12)",
                            "rgba(230, 180, 34, 0.35)",
                            "rgba(230, 180, 34, 0.12)",
                          ],
                        }
                      : undefined
                  }
                  transition={
                    r === builtRows
                      ? { duration: 1.5, repeat: Infinity }
                      : undefined
                  }
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Running total */}
      {builtRows > 0 && (
        <motion.div
          key={runningTotal}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-2 text-center"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(24px, 5vw, 36px)",
            fontWeight: 700,
            color: complete
              ? "var(--colour-success)"
              : "var(--colour-accent-gold)",
          }}
        >
          = {runningTotal}
        </motion.div>
      )}

      {/* Build controls */}
      {!complete && (
        <div className="flex gap-3 mt-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={addRow}
            className="px-5 py-2.5 rounded-xl cursor-pointer"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              fontWeight: 700,
              background: "var(--colour-accent-gold)",
              color: "var(--colour-bg-deep)",
              border: "none",
              boxShadow:
                "0 3px 0 rgba(0,0,0,0.3), 0 0 12px rgba(230, 180, 34, 0.2)",
            }}
          >
            + Add Row
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={fillAll}
            className="px-4 py-2.5 rounded-xl cursor-pointer"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 500,
              background: "transparent",
              color: "var(--colour-text-secondary)",
              border: "1.5px solid rgba(230, 180, 34, 0.15)",
            }}
          >
            Fill All
          </motion.button>
        </div>
      )}
    </div>
  );
}
