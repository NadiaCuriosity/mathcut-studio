import { motion } from "framer-motion";
import { useProgress } from "../store";
import { getTableProgress, recommendTable } from "../leitner";
import { TABLE_INFO } from "../tables";

interface TableSelectScreenProps {
  onStart: (table: number) => void;
  onBack?: () => void;
  backLabel?: string;
}

export function TableSelectScreen({ onStart, onBack, backLabel = "Studio Lot" }: TableSelectScreenProps) {
  const { state } = useProgress();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Warm spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(230, 180, 34, 0.06) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center pt-5 sm:pt-7 pb-1 px-5">
        {onBack && (
          <button
            onClick={onBack}
            className="self-start mb-2 cursor-pointer"
            style={{
              background: "none",
              border: "none",
              color: "var(--colour-accent-gold)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              padding: 0,
            }}
          >
            ← {backLabel}
          </button>
        )}
        <h1
          className="text-2xl sm:text-3xl tracking-[0.05em] uppercase m-0 leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--colour-accent-gold)",
          }}
        >
          START SHOOTING
        </h1>
        <p
          className="text-base sm:text-lg mt-2 mb-0"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--colour-text-secondary)",
          }}
        >
          Pick your movie!
        </p>
      </header>

      {/* Cards grid */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 pb-6 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-[720px] mx-auto">
          {/* Surprise Me */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.05,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            whileHover={{ scale: 1.04, rotate: 1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onStart(recommendTable(state.facts))}
            className="p-4 sm:p-5 rounded-xl cursor-pointer text-center col-span-2 sm:col-span-1"
            style={{
              background:
                "linear-gradient(135deg, var(--colour-bg-elevated), var(--colour-bg-raised))",
              border: "1.5px solid rgba(230, 180, 34, 0.3)",
              boxShadow:
                "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(245, 230, 163, 0.08)",
            }}
          >
            <div className="text-4xl sm:text-5xl mb-2">🎲</div>
            <div
              className="text-lg sm:text-xl"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--colour-accent-gold)",
              }}
            >
              Surprise Me!
            </div>
            <p
              className="text-xs mt-1 m-0"
              style={{
                color: "var(--colour-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Best pick for you
            </p>
          </motion.button>

          {/* Table cards */}
          {TABLE_INFO.map((info, i) => {
            const progress = getTableProgress(state.facts, info.table);
            const isArchived = info.table === 1 || info.table === 10;
            const pct = Math.round(
              (progress.mastered / Math.max(progress.total, 1)) * 100
            );

            return (
              <motion.button
                key={info.table}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.05 * (i + 2),
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                whileHover={
                  isArchived ? undefined : { scale: 1.04, rotateY: 0 }
                }
                whileTap={isArchived ? undefined : { scale: 0.96 }}
                onClick={() => !isArchived && onStart(info.table)}
                disabled={isArchived}
                className="p-4 sm:p-5 rounded-xl cursor-pointer text-center disabled:cursor-default"
                style={{
                  background: "var(--colour-bg-elevated)",
                  border: isArchived
                    ? "1.5px solid rgba(230, 180, 34, 0.06)"
                    : "1.5px solid rgba(230, 180, 34, 0.12)",
                  boxShadow:
                    "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(245, 230, 163, 0.05)",
                  opacity: isArchived ? 0.35 : 1,
                  transform: isArchived
                    ? "none"
                    : "perspective(800px) rotateY(-2deg)",
                }}
              >
                <div className="text-3xl sm:text-4xl mb-1">{info.emoji}</div>
                <div
                  className="text-2xl sm:text-3xl leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--colour-text-primary)",
                  }}
                >
                  ×{info.table}
                </div>
                <div
                  className="text-xs sm:text-sm mt-0.5"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--colour-accent-gold-light)",
                  }}
                >
                  {info.name}
                </div>

                {/* Progress bar */}
                <div
                  className="mt-2 h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--colour-bg-raised)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
                    style={{
                      background:
                        pct === 100
                          ? "var(--colour-success)"
                          : "var(--colour-accent-gold)",
                    }}
                  />
                </div>
                <div
                  className="text-[10px] mt-1"
                  style={{
                    color: "var(--colour-text-secondary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {isArchived
                    ? "Mastered"
                    : `${progress.mastered}/${progress.total}`}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
