import { motion } from "framer-motion";

export function AwardsScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="h-full flex flex-col items-center justify-center px-5"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(230, 180, 34, 0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="text-6xl sm:text-7xl mb-4"
        >
          🏆
        </motion.div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 8vw, 42px)",
            color: "var(--colour-accent-gold)",
            letterSpacing: "0.05em",
            margin: 0,
          }}
        >
          AWARDS
        </h1>
        <p
          className="mt-3"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--colour-text-secondary)",
            fontSize: "15px",
          }}
        >
          Your trophy shelf is being built...
        </p>
        <p
          className="mt-1"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--colour-text-secondary)",
            fontSize: "13px",
            opacity: 0.6,
          }}
        >
          Keep practising to earn your first award!
        </p>
      </div>
    </motion.div>
  );
}
