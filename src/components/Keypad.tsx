import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";

interface KeypadProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const keys = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["⌫", "0", "✓"],
];

export function Keypad({ value, onChange, onSubmit, disabled }: KeypadProps) {
  const handleKey = useCallback(
    (key: string) => {
      if (disabled) return;
      if (key === "⌫") {
        onChange(value.slice(0, -1));
      } else if (key === "✓") {
        if (value.length > 0) onSubmit();
      } else {
        if (value.length < 3) {
          onChange(value + key);
        }
      }
    },
    [value, onChange, onSubmit, disabled]
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (disabled) return;
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleKey(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleKey("⌫");
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleKey("✓");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKey, disabled]);

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-[320px] sm:max-w-[360px] md:max-w-[340px] mx-auto">
      {keys.flat().map((key) => {
        const isSubmit = key === "✓";
        const isBackspace = key === "⌫";
        const isDisabledSubmit = isSubmit && value.length === 0;

        return (
          <motion.button
            key={key}
            whileTap={disabled ? undefined : { scale: 0.95, y: 2 }}
            whileHover={
              disabled ? undefined : { borderColor: "rgba(230, 180, 34, 0.5)" }
            }
            onClick={() => handleKey(key)}
            disabled={disabled || isDisabledSubmit}
            className="h-16 sm:h-[72px] md:h-[76px] rounded-xl select-none cursor-pointer disabled:opacity-30 disabled:cursor-default"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: isBackspace ? "24px" : "32px",
              fontWeight: isSubmit ? 700 : 500,
              background: isSubmit
                ? "var(--colour-success)"
                : "var(--colour-bg-elevated)",
              color: isSubmit
                ? "var(--colour-bg-deep)"
                : isBackspace
                  ? "var(--colour-text-secondary)"
                  : "var(--colour-text-primary)",
              border: `1.5px solid ${
                isSubmit
                  ? "rgba(78, 205, 196, 0.4)"
                  : "rgba(230, 180, 34, 0.15)"
              }`,
              boxShadow: isSubmit
                ? "0 3px 0 rgba(0,0,0,0.3), 0 0 12px rgba(78, 205, 196, 0.1)"
                : "0 3px 0 rgba(0,0,0,0.3)",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
            aria-label={
              isSubmit ? "Submit answer" : isBackspace ? "Backspace" : key
            }
          >
            {key}
          </motion.button>
        );
      })}
    </div>
  );
}
