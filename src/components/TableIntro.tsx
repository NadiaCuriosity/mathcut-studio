import { useEffect } from "react";
import { motion } from "framer-motion";
import { speak } from "../tts";

const INTROS: Record<number, { emoji: string; name: string; strategy: string }> = {
  2: { emoji: "✌️", name: "Double Feature", strategy: "Doubles! You probably know these already." },
  3: { emoji: "🎭", name: "Triple Threat", strategy: "Two groups plus one more!" },
  4: { emoji: "🍀", name: "Fantastic Four", strategy: "Double your twos!" },
  5: { emoji: "⭐", name: "High Five", strategy: "Half of your tens!" },
  6: { emoji: "🎲", name: "Six Shooter", strategy: "Double your threes!" },
  7: { emoji: "🌈", name: "Lucky Seven", strategy: "Five groups plus two more!" },
  8: { emoji: "🐙", name: "Octo-plex", strategy: "Double your fours!" },
  9: { emoji: "✨", name: "Cloud Nine", strategy: "Your tens minus one group!" },
  10: { emoji: "💯", name: "Perfect Ten", strategy: "Just add a zero!" },
  11: { emoji: "🎸", name: "Up to Eleven", strategy: "Your tens plus one more group!" },
  12: { emoji: "🕛", name: "Dirty Dozen", strategy: "Your tens plus your twos!" },
};

interface TableIntroProps {
  table: number;
  onComplete: () => void;
}

export function TableIntro({ table, onComplete }: TableIntroProps) {
  const info = INTROS[table] ?? {
    emoji: "🎬",
    name: `Table ${table}`,
    strategy: "",
  };

  useEffect(() => {
    speak(`Welcome to ${info.name}! ${info.strategy}`);
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [info.name, info.strategy, onComplete]);

  return (
    <div className="h-full flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(230, 180, 34, 0.1) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="text-center relative z-10"
      >
        <motion.div
          className="text-7xl sm:text-8xl mb-4"
          animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {info.emoji}
        </motion.div>

        <h1
          className="m-0 mb-3"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 10vw, 64px)",
            color: "var(--colour-accent-gold)",
            textShadow: "0 0 40px rgba(230, 180, 34, 0.3)",
          }}
        >
          ×{table}: {info.name}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="m-0"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(18px, 4vw, 24px)",
            color: "var(--colour-text-secondary)",
          }}
        >
          {info.strategy}
        </motion.p>
      </motion.div>
    </div>
  );
}
