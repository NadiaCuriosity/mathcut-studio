import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProgress } from "../store";
import { getTableInfo } from "../tables";
import { getTableProgress } from "../leitner";

const BOX_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "New", color: "#6b7280" },
  2: { label: "Learning", color: "#60a5fa" },
  3: { label: "Familiar", color: "#4ecdc4" },
  4: { label: "Proficient", color: "#e6b422" },
  5: { label: "Mastered", color: "#34d399" },
};

function isTricky(trickyFacts: { a: number; b: number }[], a: number, b: number) {
  const na = Math.min(a, b);
  const nb = Math.max(a, b);
  return trickyFacts.some((t) => t.a === na && t.b === nb);
}

export function MovieDetail() {
  const { table } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useProgress();
  const tableNum = parseInt(table!, 10);
  const info = getTableInfo(tableNum);
  const progress = getTableProgress(state.facts, tableNum);

  const tableFacts = state.facts
    .filter((f) => f.a === tableNum && f.b !== 1 && f.b !== 10)
    .sort((a, b) => a.b - b.b);

  if (!info) {
    return (
      <div className="h-full flex items-center justify-center">
        <p style={{ color: "var(--colour-text-secondary)" }}>
          Table not found
        </p>
      </div>
    );
  }

  const pct = Math.round(
    (progress.mastered / Math.max(progress.total, 1)) * 100
  );

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

      {/* Header */}
      <header className="relative z-10 pt-5 pb-3 px-5 shrink-0">
        <button
          onClick={() => navigate("/movies")}
          className="mb-3 cursor-pointer"
          style={{
            background: "none",
            border: "none",
            color: "var(--colour-accent-gold)",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            padding: 0,
          }}
        >
          ← Back to Movies
        </button>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: "36px" }}>{info.emoji}</span>
          <div>
            <h1
              className="m-0"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 6vw, 32px)",
                color: "var(--colour-text-primary)",
                letterSpacing: "0.04em",
              }}
            >
              ×{tableNum} — {info.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{
                  background: "var(--colour-bg-raised)",
                  width: "120px",
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background:
                      pct === 100
                        ? "var(--colour-success)"
                        : "var(--colour-accent-gold)",
                    transition: "width 0.5s",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  color: "var(--colour-text-secondary)",
                }}
              >
                {progress.mastered}/{progress.total}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Facts grid */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-[500px] mx-auto">
          {tableFacts.map((fact, i) => {
            const box = BOX_LABELS[fact.box] || BOX_LABELS[1];
            return (
              <motion.div
                key={fact.b}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.03 * i,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="p-3 rounded-lg"
                style={{
                  background: "var(--colour-bg-elevated)",
                  border: isTricky(state.trickyFacts, fact.a, fact.b)
                    ? "1.5px solid var(--colour-cta)"
                    : `1.5px solid ${box.color}30`,
                  boxShadow: isTricky(state.trickyFacts, fact.a, fact.b)
                    ? "0 2px 12px rgba(255, 107, 107, 0.2)"
                    : "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--colour-text-primary)",
                  }}
                >
                  {fact.a} × {fact.b} = {fact.a * fact.b}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: box.color,
                      background: `${box.color}15`,
                      border: `1px solid ${box.color}25`,
                    }}
                  >
                    {box.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[10px]"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--colour-text-secondary)",
                      }}
                    >
                      {fact.totalCorrect}/{fact.totalAttempts}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: "TOGGLE_TRICKY_FACT", a: fact.a, b: fact.b });
                      }}
                      className="cursor-pointer"
                      title={isTricky(state.trickyFacts, fact.a, fact.b) ? "Remove from Reshoots" : "Flag for Reshoots"}
                      style={{
                        background: "none",
                        border: "none",
                        padding: "2px",
                        fontSize: "14px",
                        opacity: isTricky(state.trickyFacts, fact.a, fact.b) ? 1 : 0.3,
                        filter: isTricky(state.trickyFacts, fact.a, fact.b) ? "none" : "grayscale(1)",
                      }}
                    >
                      🔁
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
