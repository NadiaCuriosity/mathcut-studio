import { motion } from "framer-motion";
import { useProgress } from "../store";
import { AWARDS } from "../awards";
import { THEMES } from "../themes";
import { getTableProgress } from "../leitner";
import { PRACTICABLE_TABLES } from "../tables";

function isThemeUnlocked(
  themeId: string,
  unlockedThemes: string[],
  masteredCount: number
): boolean {
  if (unlockedThemes.includes(themeId)) return true;
  // Monster Movie needs all 10 tables
  if (themeId === "monster-movie") return masteredCount >= 10;
  return false;
}

export function AwardsScreen() {
  const { state, dispatch } = useProgress();
  const masteredCount = PRACTICABLE_TABLES.filter((t) => {
    const p = getTableProgress(state.facts, t);
    return p.total > 0 && p.mastered === p.total;
  }).length;

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
            "radial-gradient(ellipse at 50% 30%, rgba(230, 180, 34, 0.06) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 text-center pt-5 sm:pt-7 pb-2 px-5">
        <h1
          className="m-0"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 7vw, 36px)",
            color: "var(--colour-accent-gold)",
            letterSpacing: "0.06em",
          }}
        >
          AWARDS
        </h1>
        <p
          className="m-0 mt-1"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--colour-text-secondary)",
            fontSize: "13px",
          }}
        >
          {state.unlockedAwards.length} of {AWARDS.length} earned
        </p>
      </header>

      {/* Scrollable content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
        {/* ── Trophy Shelf ── */}
        <div className="max-w-[600px] mx-auto">
          {/* Shelf rows */}
          {[0, 1, 2].map((shelfRow) => {
            const start = shelfRow * 4;
            const shelfAwards = AWARDS.slice(start, start + 4);
            if (shelfAwards.length === 0) return null;

            return (
              <div key={shelfRow} className="mb-2">
                {/* Trophies */}
                <div className="flex justify-center gap-3 sm:gap-5 pb-2">
                  {shelfAwards.map((award, i) => {
                    const isUnlocked = state.unlockedAwards.includes(award.id);
                    return (
                      <motion.div
                        key={award.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.1 + (start + i) * 0.06,
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        className="flex flex-col items-center text-center"
                        style={{ width: "72px" }}
                      >
                        {/* Trophy icon */}
                        <div
                          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-1"
                          style={{
                            background: isUnlocked
                              ? "linear-gradient(135deg, rgba(230, 180, 34, 0.15), rgba(230, 180, 34, 0.05))"
                              : "var(--colour-bg-elevated)",
                            border: isUnlocked
                              ? "1.5px solid rgba(230, 180, 34, 0.35)"
                              : "1.5px solid rgba(230, 180, 34, 0.08)",
                            boxShadow: isUnlocked
                              ? "0 0 16px rgba(230, 180, 34, 0.15), 0 4px 12px rgba(0,0,0,0.3)"
                              : "0 4px 12px rgba(0,0,0,0.3)",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "28px",
                              filter: isUnlocked ? "none" : "grayscale(1)",
                              opacity: isUnlocked ? 1 : 0.25,
                            }}
                          >
                            {award.emoji}
                          </span>
                        </div>
                        {/* Name */}
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "10px",
                            letterSpacing: "0.04em",
                            color: isUnlocked
                              ? "var(--colour-accent-gold)"
                              : "var(--colour-text-secondary)",
                            opacity: isUnlocked ? 1 : 0.4,
                          }}
                        >
                          {isUnlocked ? award.name : "???"}
                        </div>
                        {/* Description */}
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "9px",
                            color: "var(--colour-text-secondary)",
                            opacity: isUnlocked ? 0.7 : 0.3,
                            lineHeight: 1.3,
                            marginTop: "2px",
                          }}
                        >
                          {award.description}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                {/* Shelf bar */}
                <div
                  className="h-1.5 rounded-full mx-2"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(139, 90, 43, 0.3), rgba(180, 120, 60, 0.5), rgba(139, 90, 43, 0.3))",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* ── Theme Selector ── */}
        <div className="max-w-[600px] mx-auto mt-6">
          <h2
            className="m-0 mb-3 text-center"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              letterSpacing: "0.06em",
              color: "var(--colour-accent-gold)",
            }}
          >
            ARRAY THEMES
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {THEMES.map((theme, i) => {
              const unlocked = isThemeUnlocked(
                theme.id,
                state.unlockedThemes,
                masteredCount
              );
              const isActive = state.settings.preferredTheme === theme.id;

              return (
                <motion.button
                  key={theme.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  whileTap={unlocked ? { scale: 0.96 } : undefined}
                  onClick={() =>
                    unlocked && dispatch({ type: "SET_THEME", id: theme.id })
                  }
                  disabled={!unlocked}
                  className="p-3 sm:p-4 rounded-xl text-center cursor-pointer disabled:cursor-default"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(230, 180, 34, 0.12), rgba(230, 180, 34, 0.04))"
                      : "var(--colour-bg-elevated)",
                    border: isActive
                      ? "2px solid rgba(230, 180, 34, 0.5)"
                      : "1.5px solid rgba(230, 180, 34, 0.1)",
                    opacity: unlocked ? 1 : 0.4,
                    boxShadow: isActive
                      ? "0 0 12px rgba(230, 180, 34, 0.15)"
                      : "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Icon preview */}
                  <div className="flex justify-center gap-1 mb-2">
                    {theme.icons.slice(0, 3).map((icon, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: "20px",
                          filter: unlocked ? "none" : "grayscale(1)",
                        }}
                      >
                        {icon}
                      </span>
                    ))}
                  </div>
                  {/* Name */}
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                      letterSpacing: "0.04em",
                      color: isActive
                        ? "var(--colour-accent-gold)"
                        : "var(--colour-text-primary)",
                    }}
                  >
                    {theme.name}
                  </div>
                  {/* Status */}
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      color: "var(--colour-text-secondary)",
                      marginTop: "2px",
                    }}
                  >
                    {isActive
                      ? "Active"
                      : unlocked
                        ? "Tap to select"
                        : theme.unlockHint}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
