import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress, getEffectiveStreak } from "../store";
import { getTableProgress } from "../leitner";
import { getTableInfo } from "../tables";
import type { FactRecord } from "../types";

type BuildingStatus = "not-started" | "in-progress" | "mastered";

function getStatus(facts: FactRecord[], table: number): BuildingStatus {
  const p = getTableProgress(facts, table);
  if (p.practiced === 0) return "not-started";
  if (p.mastered === p.total) return "mastered";
  return "in-progress";
}

const BUILDINGS = [
  { table: 2, x: 26, y: 35 },
  { table: 3, x: 99, y: 35 },
  { table: 4, x: 172, y: 35 },
  { table: 5, x: 245, y: 35 },
  { table: 6, x: 318, y: 35 },
  { table: 7, x: 26, y: 148 },
  { table: 8, x: 99, y: 148 },
  { table: 9, x: 172, y: 148 },
  { table: 11, x: 245, y: 148 },
  { table: 12, x: 318, y: 148 },
];

const BW = 56;
const BH = 74;
const RH = 14;

const STARS = [
  { cx: 28, cy: 8 },
  { cx: 82, cy: 18 },
  { cx: 145, cy: 6 },
  { cx: 205, cy: 22 },
  { cx: 268, cy: 10 },
  { cx: 335, cy: 16 },
  { cx: 378, cy: 6 },
  { cx: 55, cy: 26 },
  { cx: 118, cy: 12 },
  { cx: 188, cy: 28 },
  { cx: 308, cy: 24 },
  { cx: 362, cy: 20 },
];

export function StudioLot() {
  const { state } = useProgress();
  const [selected, setSelected] = useState<number | null>(null);
  const effectiveStreak = getEffectiveStreak(state.streak);
  const wasStreakBroken =
    state.streak.currentStreak > 0 &&
    effectiveStreak === 0 &&
    state.streak.lastActiveDate !== "";

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
      <header className="relative z-10 text-center pt-5 pb-1 px-5 shrink-0">
        <h1
          className="m-0"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 7vw, 36px)",
            color: "var(--colour-accent-gold)",
            letterSpacing: "0.06em",
          }}
        >
          STUDIO LOT
        </h1>
        {wasStreakBroken ? (
          <p
            className="m-0 mt-1"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--colour-text-secondary)",
              fontSize: "13px",
            }}
          >
            Welcome back, Lincoln! Ready for another day on set?
          </p>
        ) : effectiveStreak > 0 ? (
          <div className="flex items-center justify-center gap-2 mt-1">
            <span style={{ fontSize: "14px" }}>🎬</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "15px",
                color: "var(--colour-accent-gold)",
                fontWeight: 700,
              }}
            >
              {effectiveStreak}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--colour-text-secondary)",
              }}
            >
              {effectiveStreak === 1 ? "day" : "days"} on set
            </span>
          </div>
        ) : state.sessions.length === 0 ? (
          <p
            className="m-0 mt-1"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--colour-text-secondary)",
              fontSize: "13px",
              opacity: 0.7,
            }}
          >
            Tap Start Shooting to begin!
          </p>
        ) : null}
      </header>

      {/* SVG Scene */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-3 min-h-0">
        <svg
          viewBox="0 0 400 280"
          className="w-full max-w-[500px]"
          style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))" }}
        >
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#08081a" />
              <stop offset="100%" stopColor="#12122e" />
            </linearGradient>
            <filter id="building-glow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sky */}
          <rect width="400" height="280" fill="url(#sky)" rx="8" />

          {/* Stars */}
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={0.8 + (i % 3) * 0.3}
              fill="white"
              opacity={0.15 + (i % 4) * 0.08}
            />
          ))}

          {/* Ground */}
          <rect x="0" y="245" width="400" height="35" fill="#0e0e20" />
          <line
            x1="0"
            y1="245"
            x2="400"
            y2="245"
            stroke="#1a1a36"
            strokeWidth="1"
          />

          {/* Gate */}
          <rect
            x="120"
            y="252"
            width="160"
            height="22"
            rx="3"
            fill="#1a1a36"
            stroke="#e6b422"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <text
            x="200"
            y="266"
            textAnchor="middle"
            style={{
              fontFamily: "Bebas Neue, Impact, sans-serif",
              fontSize: "7px",
              fill: "#e6b422",
              letterSpacing: "0.08em",
              opacity: 0.8,
            }}
          >
            TIMES TABLES THE MOVIE
          </text>

          {/* Lizard removed from SVG — now rendered as large element outside */}

          {/* Buildings */}
          {BUILDINGS.map((b) => {
            const status = getStatus(state.facts, b.table);
            const info = getTableInfo(b.table);
            const isMastered = status === "mastered";
            const isActive = status === "in-progress";
            const isDark = status === "not-started";

            const bodyFill = isDark
              ? "#161630"
              : isActive
                ? "#222248"
                : "#2a2a55";
            const roofFill = isDark
              ? "#1a1a38"
              : isActive
                ? "#282850"
                : "#333360";
            const winFill = "#e6b422";
            const winOp = isDark ? 0.06 : isActive ? 0.35 : 0.85;
            const winOp2 = isDark ? 0.04 : isActive ? 0.2 : 0.85;
            const doorOp = isDark ? 0.06 : isActive ? 0.2 : 0.5;
            const border = isMastered ? "#e6b42270" : "#2e2e5050";

            return (
              <g
                key={b.table}
                onClick={() =>
                  setSelected(selected === b.table ? null : b.table)
                }
                style={{ cursor: "pointer" }}
              >
                {/* Spotlight beam for mastered */}
                {isMastered && (
                  <polygon
                    points={`${b.x + BW / 2 - 4},${b.y - 2} ${b.x + BW / 2 + 4},${b.y - 2} ${b.x + BW / 2 + 20},0 ${b.x + BW / 2 - 20},0`}
                    fill="#e6b422"
                    opacity="0.05"
                  />
                )}
                {/* Roof */}
                <polygon
                  points={`${b.x + 2},${b.y + RH} ${b.x + BW / 2},${b.y} ${b.x + BW - 2},${b.y + RH}`}
                  fill={roofFill}
                  stroke={border}
                  strokeWidth="0.8"
                />
                {/* Body */}
                <rect
                  x={b.x}
                  y={b.y + RH}
                  width={BW}
                  height={BH}
                  rx="2"
                  fill={bodyFill}
                  stroke={border}
                  strokeWidth="0.8"
                />
                {/* Windows */}
                <rect
                  x={b.x + 8}
                  y={b.y + RH + 12}
                  width="11"
                  height="9"
                  rx="1"
                  fill={winFill}
                  opacity={winOp}
                />
                <rect
                  x={b.x + BW - 19}
                  y={b.y + RH + 12}
                  width="11"
                  height="9"
                  rx="1"
                  fill={winFill}
                  opacity={winOp}
                />
                <rect
                  x={b.x + 8}
                  y={b.y + RH + 28}
                  width="11"
                  height="9"
                  rx="1"
                  fill={winFill}
                  opacity={winOp2}
                />
                <rect
                  x={b.x + BW - 19}
                  y={b.y + RH + 28}
                  width="11"
                  height="9"
                  rx="1"
                  fill={winFill}
                  opacity={winOp2}
                />
                {/* Door */}
                <rect
                  x={b.x + (BW - 12) / 2}
                  y={b.y + RH + BH - 20}
                  width="12"
                  height="20"
                  rx="1.5"
                  fill="#e6b422"
                  opacity={doorOp}
                />
                {/* Emoji sign */}
                <text
                  x={b.x + BW / 2}
                  y={b.y + RH + 8}
                  textAnchor="middle"
                  style={{
                    fontSize: "9px",
                    opacity: isDark ? 0.25 : 0.8,
                  }}
                >
                  {info?.emoji}
                </text>
                {/* Table number label */}
                <text
                  x={b.x + BW / 2}
                  y={b.y + RH + BH + 12}
                  textAnchor="middle"
                  style={{
                    fontFamily: "Bebas Neue, Impact, sans-serif",
                    fontSize: "10px",
                    fill: isMastered
                      ? "#e6b422"
                      : isDark
                        ? "#3a3a5a"
                        : "#7a7a9a",
                    letterSpacing: "0.04em",
                  }}
                >
                  ×{b.table}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Lizard Linc mascot — large, outside SVG */}
        <div
          className="absolute"
          style={{
            bottom: "2%",
            right: "8%",
            zIndex: 15,
            pointerEvents: "none",
          }}
        >
          {state.studioLevel > 0 && (
            <div
              className="absolute -top-6 md:-top-7 left-1/2 -translate-x-1/2 px-2 md:px-3 py-0.5 md:py-1 rounded-lg"
              style={{
                background: "var(--colour-bg-elevated)",
                border: "1.5px solid rgba(230, 180, 34, 0.4)",
                whiteSpace: "nowrap",
              }}
            >
              <span
                className="text-[10px] md:text-[16px]"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--colour-accent-gold)",
                  letterSpacing: "0.06em",
                }}
              >
                {state.studioLevel >= 8
                  ? "LEGEND!"
                  : state.studioLevel >= 5
                    ? "AMAZING!"
                    : state.studioLevel >= 3
                      ? "NICE!"
                      : "HI!"}
              </span>
            </div>
          )}
          <span className="text-[40px] md:text-[120px]" style={{ lineHeight: 1 }}>
            {state.studioLevel >= 7 ? "🐉" : "🦎"}
          </span>
        </div>

        {/* Building info tooltip */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl z-20"
              style={{
                background: "var(--colour-bg-elevated)",
                border: "1.5px solid rgba(230, 180, 34, 0.2)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              {(() => {
                const info = getTableInfo(selected);
                const progress = getTableProgress(state.facts, selected);
                const pct = Math.round(
                  (progress.mastered / Math.max(progress.total, 1)) * 100
                );
                return (
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: "28px" }}>{info?.emoji}</span>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "18px",
                          color: "var(--colour-text-primary)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        ×{selected} — {info?.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            background: "var(--colour-bg-raised)",
                            width: "100px",
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
                              transition: "width 0.3s",
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
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Level indicator */}
      <div className="relative z-10 text-center pb-2 px-5 shrink-0">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{
            background: "var(--colour-bg-elevated)",
            border: "1px solid rgba(230, 180, 34, 0.15)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "var(--colour-text-secondary)",
            }}
          >
            Studio Level
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              color: "var(--colour-accent-gold)",
              fontWeight: 700,
            }}
          >
            {state.studioLevel}/10
          </span>
        </div>
      </div>
    </motion.div>
  );
}
