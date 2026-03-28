import { motion } from "framer-motion";

const REPTILES = [
  { emoji: "🦎", delay: 0, y: "5%", rotate: 75, size: 28 },
  { emoji: "🐍", delay: 2, y: "20%", rotate: 90, size: 24 },
  { emoji: "🦎", delay: 4.5, y: "38%", rotate: 60, size: 22 },
  { emoji: "🐍", delay: 1.5, y: "55%", rotate: 85, size: 26 },
  { emoji: "🦎", delay: 3, y: "72%", rotate: 70, size: 20 },
  { emoji: "🐍", delay: 5, y: "88%", rotate: 80, size: 24 },
];

export function CrawlingReptiles() {
  return (
    <div
      className="fixed left-0 top-0 h-full pointer-events-none"
      style={{ width: "40px", zIndex: 50 }}
    >
      {REPTILES.map((r, i) => (
        <motion.span
          key={i}
          className="absolute left-1"
          initial={{ y: r.y, opacity: 0 }}
          animate={{
            y: [r.y, `calc(${r.y} + 12px)`, r.y],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 4,
            delay: r.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            fontSize: `${r.size}px`,
            transform: `rotate(${r.rotate}deg)`,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
          }}
        >
          {r.emoji}
        </motion.span>
      ))}
    </div>
  );
}
