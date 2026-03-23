import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProgress } from "../store";
import { getTableProgress } from "../leitner";
import { TABLE_INFO } from "../tables";

function getProductionStatus(
  mastered: number,
  total: number,
  practiced: number
): string {
  if (mastered === total) return "Released";
  if (mastered > total / 2) return "Post-Production";
  if (practiced > 0) return "In Production";
  return "Coming Soon";
}

function getStatusColor(status: string): string {
  switch (status) {
    case "Released":
      return "var(--colour-success)";
    case "Post-Production":
      return "var(--colour-accent-gold)";
    case "In Production":
      return "var(--colour-accent-gold-light)";
    default:
      return "var(--colour-text-secondary)";
  }
}

export function MyMovies() {
  const { state } = useProgress();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="h-full flex flex-col overflow-hidden"
    >
      {/* Warm spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(230, 180, 34, 0.06) 0%, transparent 60%)",
        }}
      />

      <header className="relative z-10 text-center pt-6 pb-2 px-5 shrink-0">
        <h1
          className="m-0"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 7vw, 36px)",
            color: "var(--colour-accent-gold)",
            letterSpacing: "0.06em",
          }}
        >
          MY MOVIES
        </h1>
        <p
          className="mt-1 m-0"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--colour-text-secondary)",
            fontSize: "13px",
          }}
        >
          Your multiplication filmography
        </p>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 pb-4 pt-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-[720px] mx-auto">
          {TABLE_INFO.map((info, i) => {
            const isArchived = info.table === 1 || info.table === 10;
            const progress = getTableProgress(state.facts, info.table);
            const pct = Math.round(
              (progress.mastered / Math.max(progress.total, 1)) * 100
            );
            const status = isArchived
              ? "Archived"
              : getProductionStatus(
                  progress.mastered,
                  progress.total,
                  progress.practiced
                );

            return (
              <motion.button
                key={info.table}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.03 * (i + 1),
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                whileHover={isArchived ? undefined : { scale: 1.03 }}
                whileTap={isArchived ? undefined : { scale: 0.97 }}
                onClick={() => !isArchived && navigate(`/movies/${info.table}`)}
                disabled={isArchived}
                className="p-4 rounded-xl cursor-pointer text-center disabled:cursor-default"
                style={{
                  background: "var(--colour-bg-elevated)",
                  border:
                    isArchived
                      ? "1.5px solid rgba(230, 180, 34, 0.06)"
                      : status === "Released"
                        ? "1.5px solid rgba(78, 205, 196, 0.25)"
                        : "1.5px solid rgba(230, 180, 34, 0.12)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                  opacity: isArchived ? 0.35 : 1,
                }}
              >
                <div className="text-3xl mb-1">{info.emoji}</div>
                <div
                  className="text-xl leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--colour-text-primary)",
                  }}
                >
                  ×{info.table}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--colour-accent-gold-light)",
                  }}
                >
                  {info.name}
                </div>

                {/* Status */}
                <div
                  className="text-[10px] mt-2"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: getStatusColor(status),
                    letterSpacing: "0.02em",
                  }}
                >
                  {isArchived ? "Mastered" : status}
                </div>

                {/* Progress bar */}
                {!isArchived && (
                  <div
                    className="mt-1.5 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--colour-bg-raised)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.3 + i * 0.04, duration: 0.5 }}
                      style={{
                        background:
                          pct === 100
                            ? "var(--colour-success)"
                            : "var(--colour-accent-gold)",
                      }}
                    />
                  </div>
                )}
                {!isArchived && (
                  <div
                    className="text-[10px] mt-0.5"
                    style={{
                      color: "var(--colour-text-secondary)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {progress.mastered}/{progress.total}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
