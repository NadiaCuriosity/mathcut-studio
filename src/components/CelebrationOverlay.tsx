import { motion, AnimatePresence } from "framer-motion";
import { speak } from "../tts";
import { useEffect } from "react";

interface AwardCelebrationProps {
  emoji: string;
  name: string;
  description: string;
  onDone: () => void;
}

export function AwardCelebration({
  emoji,
  name,
  description,
  onDone,
}: AwardCelebrationProps) {
  useEffect(() => {
    speak(`Award unlocked! ${name}!`);
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [name, onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.75)" }}
      onClick={onDone}
    >
      {/* Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(230, 180, 34, 0.2) 0%, transparent 50%)",
        }}
      />

      <div className="relative text-center">
        {/* Trophy rising */}
        <motion.div
          initial={{ y: 200, scale: 0.5, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 12,
            delay: 0.2,
          }}
          className="text-7xl sm:text-8xl mb-4"
        >
          {emoji}
        </motion.div>

        {/* Gold particle burst */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const dist = 80 + Math.random() * 40;
          return (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                opacity: 0,
                scale: 0.3,
              }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 -ml-1 -mt-1 w-2 h-2 rounded-full"
              style={{ background: "var(--colour-accent-gold)" }}
            />
          );
        })}

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div
            className="text-xs uppercase tracking-[0.15em] mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--colour-accent-gold-light)",
            }}
          >
            Award Unlocked!
          </div>
          <div
            className="text-2xl sm:text-3xl mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--colour-accent-gold)",
              textShadow: "0 0 30px rgba(230, 180, 34, 0.4)",
            }}
          >
            {name}
          </div>
          <div
            className="text-sm"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--colour-text-secondary)",
            }}
          >
            {description}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface PremiereCelebrationProps {
  table: number;
  tableName: string;
  tableEmoji: string;
  onDone: () => void;
}

export function PremiereCelebration({
  table,
  tableName,
  tableEmoji,
  onDone,
}: PremiereCelebrationProps) {
  useEffect(() => {
    speak(`That's a wrap on the ${table} times table! ${tableName} is complete!`);
    const timer = setTimeout(onDone, 3500);
    return () => clearTimeout(timer);
  }, [table, tableName, onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.8)" }}
      onClick={onDone}
    >
      {/* Spotlight beams */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 100%, transparent 0deg, rgba(230, 180, 34, 0.1) 15deg, transparent 30deg, transparent 60deg, rgba(230, 180, 34, 0.08) 75deg, transparent 90deg, transparent 120deg, rgba(230, 180, 34, 0.1) 135deg, transparent 150deg, transparent 180deg, rgba(230, 180, 34, 0.08) 195deg, transparent 210deg, transparent 330deg, rgba(230, 180, 34, 0.1) 345deg, transparent 360deg)",
        }}
      />

      <div className="relative text-center px-6">
        {/* Emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 10,
            delay: 0.2,
          }}
          className="text-7xl sm:text-8xl mb-4"
        >
          {tableEmoji}
        </motion.div>

        {/* Confetti particles */}
        {Array.from({ length: 20 }, (_, i) => {
          const x = (Math.random() - 0.5) * 300;
          const startY = -100 - Math.random() * 200;
          const colors = [
            "var(--colour-accent-gold)",
            "var(--colour-accent-gold-light)",
            "var(--colour-success)",
            "#ff6b6b",
          ];
          return (
            <motion.div
              key={i}
              initial={{ x, y: startY, opacity: 1, rotate: 0 }}
              animate={{
                y: 400,
                opacity: 0,
                rotate: Math.random() * 720 - 360,
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: 0.5 + Math.random() * 0.5,
                ease: "easeIn",
              }}
              className="absolute left-1/2 top-1/2 w-2 h-3 rounded-sm"
              style={{
                background: colors[i % colors.length],
              }}
            />
          );
        })}

        {/* Banner */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="text-xs uppercase tracking-[0.15em] mb-1"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--colour-success)",
            }}
          >
            Premiere Night!
          </div>
          <div
            className="text-3xl sm:text-4xl mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--colour-accent-gold)",
              textShadow: "0 0 40px rgba(230, 180, 34, 0.5)",
              letterSpacing: "0.05em",
            }}
          >
            ×{table} — {tableName}
          </div>
          <div
            className="text-base"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--colour-text-secondary)",
            }}
          >
            That's a wrap! Every scene mastered.
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export { AnimatePresence };
