import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HelpMePickerProps {
  onGo: (a: number, b: number) => void;
  onClose: () => void;
}

const NUMBERS = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12];

export function HelpMePicker({ onGo, onClose }: HelpMePickerProps) {
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);

  const picking = first === null ? "first" : second === null ? "second" : "ready";

  function handleNumberTap(n: number) {
    if (first === null) {
      setFirst(n);
    } else if (second === null) {
      setSecond(n);
    }
  }

  function handleReset() {
    setFirst(null);
    setSecond(null);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: "var(--colour-bg-deep)" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer"
          style={{
            background: "none",
            border: "none",
            color: "var(--colour-text-secondary)",
            fontSize: "24px",
            padding: "8px",
          }}
        >
          ✕
        </button>

        {/* Header */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="m-0 mb-2 text-center"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 8vw, 42px)",
            color: "var(--colour-cta)",
            letterSpacing: "0.06em",
          }}
        >
          HELP ME WITH...
        </motion.h1>

        {/* Question display */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 text-center"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(32px, 10vw, 52px)",
            fontWeight: 700,
            color: "var(--colour-text-primary)",
          }}
        >
          <span style={{ color: first ? "var(--colour-accent-gold)" : "var(--colour-text-secondary)" }}>
            {first ?? "?"}
          </span>
          {" × "}
          <span style={{ color: second ? "var(--colour-accent-gold)" : "var(--colour-text-secondary)" }}>
            {second ?? "?"}
          </span>
        </motion.div>

        {/* Instruction */}
        <p
          className="m-0 mb-4 text-center"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--colour-text-secondary)",
          }}
        >
          {picking === "first"
            ? "Pick the first number"
            : picking === "second"
              ? "Now pick the second number"
              : "Ready!"}
        </p>

        {/* Number grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-5 gap-2 sm:gap-3 px-4 mb-6"
          style={{ maxWidth: "360px" }}
        >
          {NUMBERS.map((n) => {
            const isSelected =
              (picking === "second" && n === first) ||
              (picking === "ready" && (n === first || n === second));
            return (
              <motion.button
                key={n}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleNumberTap(n)}
                disabled={picking === "ready"}
                className="cursor-pointer disabled:cursor-default rounded-xl"
                style={{
                  width: "56px",
                  height: "56px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: isSelected
                    ? "var(--colour-bg-deep)"
                    : "var(--colour-text-primary)",
                  background: isSelected
                    ? "var(--colour-accent-gold)"
                    : "var(--colour-bg-elevated)",
                  border: isSelected
                    ? "2px solid var(--colour-accent-gold)"
                    : "2px solid rgba(230, 180, 34, 0.15)",
                  boxShadow: isSelected
                    ? "0 0 12px rgba(230, 180, 34, 0.3)"
                    : "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                {n}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {(first !== null) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-5 py-3 rounded-xl cursor-pointer"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "18px",
                letterSpacing: "0.06em",
                color: "var(--colour-text-secondary)",
                background: "var(--colour-bg-elevated)",
                border: "1.5px solid rgba(230, 180, 34, 0.15)",
              }}
            >
              RESET
            </motion.button>
          )}
          {picking === "ready" && first !== null && second !== null && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onGo(first, second)}
              className="px-8 py-3 rounded-xl cursor-pointer"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                letterSpacing: "0.06em",
                color: "white",
                background: "var(--colour-cta)",
                border: "none",
                boxShadow: "0 4px 16px rgba(255, 107, 107, 0.4)",
              }}
            >
              GO!
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
