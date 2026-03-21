import { motion } from "framer-motion";

interface FilmStripProps {
  total: number;
  current: number;
  completed: number;
}

export function FilmStrip({ total, current, completed }: FilmStripProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => {
        const isDone = i < completed;
        const isCurrent = i === current;

        return (
          <div key={i} className="flex flex-col items-center gap-0.5">
            {/* Top perforation */}
            <div
              className="w-1 h-1 rounded-full"
              style={{ background: "rgba(230, 180, 34, 0.2)" }}
            />

            {/* Film frame */}
            <motion.div
              className="w-2.5 h-3.5 sm:w-3 sm:h-4 rounded-[2px]"
              animate={
                isCurrent
                  ? {
                      boxShadow: [
                        "0 0 4px rgba(230, 180, 34, 0.3)",
                        "0 0 8px rgba(230, 180, 34, 0.6)",
                        "0 0 4px rgba(230, 180, 34, 0.3)",
                      ],
                    }
                  : {}
              }
              transition={
                isCurrent ? { duration: 1.5, repeat: Infinity } : undefined
              }
              style={{
                background: isDone
                  ? "var(--colour-accent-gold)"
                  : "var(--colour-bg-raised)",
                border: isDone
                  ? "1px solid var(--colour-accent-gold)"
                  : "1px solid rgba(230, 180, 34, 0.15)",
              }}
            />

            {/* Bottom perforation */}
            <div
              className="w-1 h-1 rounded-full"
              style={{ background: "rgba(230, 180, 34, 0.2)" }}
            />
          </div>
        );
      })}
    </div>
  );
}
