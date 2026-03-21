import { motion } from "framer-motion";

const ICONS = ["🍿", "🎥", "🎬", "⭐", "🎭"];

function getIcon(row: number, col: number): string {
  return ICONS[(row * 7 + col * 3 + row + col) % ICONS.length];
}

interface ArrayIconProps {
  row: number;
  col: number;
  delay?: number;
}

export function ArrayIcon({ row, col, delay = 0 }: ArrayIconProps) {
  const icon = getIcon(row, col);
  const wiggle = ((row * 3 + col * 7) % 7) - 3;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: -24, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: wiggle }}
      transition={{
        delay,
        duration: 0.45,
        type: "spring",
        stiffness: 260,
        damping: 14,
      }}
      whileHover={{
        scale: 1.25,
        rotate: [wiggle, -5, 5, 0],
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.85 }}
      className="w-14 h-14 sm:w-[72px] sm:h-[72px] md:w-22 md:h-22 rounded-xl flex items-center justify-center cursor-pointer select-none"
      style={{
        background: "var(--colour-bg-elevated)",
        border: "1.5px solid rgba(230, 180, 34, 0.15)",
        boxShadow:
          "0 3px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(245, 230, 163, 0.06)",
        fontSize: "clamp(28px, 6vw, 48px)",
        lineHeight: 1,
      }}
    >
      {icon}
    </motion.div>
  );
}
