import { motion } from "framer-motion";
import { useProgress } from "../store";
import { getThemeIcons } from "../themes";

function getIcon(row: number, col: number, icons: string[]): string {
  return icons[(row * 7 + col * 3 + row + col) % icons.length];
}

/** Scale icons so the grid fits both horizontally and vertically */
export function getSizeClass(cols: number, rows: number = cols): string {
  const maxDim = Math.max(cols, rows);
  if (maxDim <= 4) return "w-14 h-14 sm:w-[72px] sm:h-[72px]";
  if (maxDim <= 6) return "w-11 h-11 sm:w-14 sm:h-14";
  if (maxDim <= 8) return "w-9 h-9 sm:w-11 sm:h-11";
  if (maxDim <= 10) return "w-7 h-7 sm:w-9 sm:h-9";
  return "w-6 h-6 sm:w-7 sm:h-7";
}

function getFontSize(cols: number, rows: number = cols): string {
  const maxDim = Math.max(cols, rows);
  if (maxDim <= 4) return "clamp(28px, 6vw, 48px)";
  if (maxDim <= 6) return "clamp(22px, 5vw, 36px)";
  if (maxDim <= 8) return "clamp(18px, 4vw, 28px)";
  if (maxDim <= 10) return "clamp(14px, 3vw, 22px)";
  return "clamp(12px, 2.5vw, 18px)";
}

export function getGapClass(cols: number, rows: number = cols): string {
  const maxDim = Math.max(cols, rows);
  if (maxDim <= 4) return "gap-2 sm:gap-3";
  if (maxDim <= 6) return "gap-1.5 sm:gap-2";
  if (maxDim <= 8) return "gap-1 sm:gap-1.5";
  return "gap-0.5 sm:gap-1";
}

interface ArrayIconProps {
  row: number;
  col: number;
  delay?: number;
  cols?: number;
  totalRows?: number;
}

export function ArrayIcon({ row, col, delay = 0, cols = 4, totalRows }: ArrayIconProps) {
  const { state } = useProgress();
  const icons = getThemeIcons(state.settings.preferredTheme);
  const icon = getIcon(row, col, icons);
  const wiggle = ((row * 3 + col * 7) % 7) - 3;
  const rows = totalRows ?? cols;

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
      className={`${getSizeClass(cols, rows)} rounded-xl flex items-center justify-center cursor-pointer select-none`}
      style={{
        background: "var(--colour-bg-elevated)",
        border: "1.5px solid rgba(230, 180, 34, 0.15)",
        boxShadow:
          "0 3px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(245, 230, 163, 0.06)",
        fontSize: getFontSize(cols, rows),
        lineHeight: 1,
      }}
    >
      {icon}
    </motion.div>
  );
}
