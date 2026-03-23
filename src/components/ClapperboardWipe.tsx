import { motion, AnimatePresence } from "framer-motion";

interface ClapperboardWipeProps {
  /** Changing this key triggers the wipe animation */
  triggerKey: string | number;
}

/**
 * Clapperboard wipe transition between questions.
 * A dark bar sweeps horizontally across, briefly holds, then exits.
 */
export function ClapperboardWipe({ triggerKey }: ClapperboardWipeProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={triggerKey}
        className="absolute inset-0 z-50 pointer-events-none"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{
          clipPath: [
            "inset(0 100% 0 0)",
            "inset(0 0% 0 0)",
            "inset(0 0% 0 0)",
            "inset(0 0% 0 100%)",
          ],
        }}
        transition={{
          duration: 0.5,
          times: [0, 0.4, 0.6, 1],
          ease: "easeInOut",
        }}
        style={{ background: "var(--colour-bg-deep)" }}
      >
        {/* Clapperboard stripes at top */}
        <div
          className="absolute top-0 left-0 right-0 h-12 flex"
          style={{ overflow: "hidden" }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="flex-1 h-full"
              style={{
                background:
                  i % 2 === 0
                    ? "var(--colour-bg-deep)"
                    : "var(--colour-accent-gold)",
                opacity: i % 2 === 0 ? 1 : 0.7,
                transform: "skewX(-15deg)",
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
