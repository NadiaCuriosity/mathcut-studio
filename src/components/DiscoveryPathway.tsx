import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keypad } from "./Keypad";
import { InteractiveArray } from "./InteractiveArray";
import { SplitArray } from "./SplitArray";
import { ArrayIcon, getGapClass } from "./ArrayIcon";
import { speak } from "../tts";
import {
  findStrategy,
  getStartLevel,
  type DerivedStrategy,
} from "../discovery";
import type { FactRecord } from "../types";

export interface DiscoveryResult {
  correct: boolean;
  discoveryLevel: number;
  anchorFactUsed: string | null;
}

interface Props {
  a: number;
  b: number;
  fact: FactRecord;
  allFacts: FactRecord[];
  speechRate: number;
  initialLevel?: number;
  onComplete: (result: DiscoveryResult) => void;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildSplitProps(
  s: DerivedStrategy,
  b: number,
  a: number,
  product: number
) {
  const isSubtract =
    s.type === "subtract-one-group" || s.type === "halving";

  if (isSubtract) {
    return {
      cols: b,
      topRows: a,
      bottomRows: s.extraRows,
      topLabel: `${a} rows kept`,
      bottomLabel: `− ${s.extraProduct}`,
      totalLabel: `${s.anchorProduct} − ${s.extraProduct} = ${product}`,
      isSubtract: true,
    };
  }

  return {
    cols: b,
    topRows: s.anchorA,
    bottomRows: s.extraRows,
    topLabel: `${s.anchorA} × ${b} = ${s.anchorProduct}`,
    bottomLabel:
      s.type === "doubling"
        ? `× 2`
        : s.type === "splitting"
          ? `${s.extraRows} × ${b} = ${s.extraProduct}`
          : `+ ${s.extraProduct}`,
    totalLabel: `= ${product}`,
    isSubtract: false,
  };
}

export function DiscoveryPathway({
  a,
  b,
  fact,
  allFacts,
  speechRate,
  initialLevel,
  onComplete,
}: Props) {
  const startLevel = initialLevel ?? getStartLevel(fact);
  const [level, setLevel] = useState(startLevel);
  const [answer, setAnswer] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [done, setDone] = useState(false);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const product = a * b;
  const strategy = findStrategy(a, b, allFacts);
  const anchorStr = strategy
    ? `${strategy.anchorA}×${strategy.anchorB}=${strategy.anchorProduct}`
    : null;

  // Advance to next level, skipping 3-4 if no strategy
  const advance = useCallback(
    (from: number) => {
      let next = from + 1;
      if (!strategy && (next === 3 || next === 4)) next = 5;
      setLevel(Math.min(next, 6));
      setAnswer("");
      setProcessing(false);
      setShowExtra(false);
    },
    [strategy]
  );

  // ── Level 1: Strategic Pause ──
  useEffect(() => {
    if (level !== 1 || done) return;
    speak(
      pick([
        "Take your time, Director.",
        "No rush. Have a look at the array.",
        "The camera's still rolling. Take a moment.",
        "Have a think. There's no rush on this set.",
        "The crew's ready when you are.",
      ]),
      speechRate
    );
    const t = setTimeout(() => setLevel(2), 5000);
    return () => clearTimeout(t);
  }, [level, done, speechRate]);

  // ── Level 2: Strategy Prompt ──
  useEffect(() => {
    if (level !== 2 || done) return;
    speak(
      pick([
        "Do you know a fact that's close to this one?",
        "Think about a fact you're sure of. Can it help here?",
        "What's a table you already know that might help?",
        "Is there a nearby fact you could build from?",
        "Think of something close you already know.",
      ]),
      speechRate
    );
  }, [level, done, speechRate]);

  // ── Level 3: Anchor Fact ──
  useEffect(() => {
    if (level !== 3 || !strategy || done) return;
    const verb =
      strategy.type === "subtract-one-group"
        ? `Take away ${strategy.extraRows} row${strategy.extraRows > 1 ? "s" : ""} of ${b}.`
        : strategy.type === "doubling"
          ? `Double it!`
          : strategy.type === "halving"
            ? `Half of that!`
            : `Add ${strategy.extraRows} more row${strategy.extraRows > 1 ? "s" : ""} of ${b}.`;
    speak(
      `You know ${strategy.anchorA} times ${b} is ${strategy.anchorProduct}. ${verb} Can you work it out?`,
      speechRate
    );
    const t = setTimeout(() => setShowExtra(true), 1200);
    return () => clearTimeout(t);
  }, [level, strategy, a, b, done, speechRate]);

  // ── Level 4: Guided Derivation ──
  useEffect(() => {
    if (level !== 4 || !strategy || done) return;
    const op =
      strategy.type === "subtract-one-group" || strategy.type === "halving"
        ? "minus"
        : "plus";
    speak(
      `Let's build this together. ${strategy.anchorA} rows of ${b} is ${strategy.anchorProduct}. ${strategy.anchorProduct} ${op} ${strategy.extraProduct}... what does that make?`,
      speechRate
    );
    setShowExtra(true);
  }, [level, strategy, b, done, speechRate]);

  // ── Level 5: Guided Counting ──
  useEffect(() => {
    if (level !== 5 || done) return;
    speak("Let's count it out together. Tap each row!", speechRate);
  }, [level, done, speechRate]);

  // ── Level 6: Full Reveal ──
  // No cleanup — setDone(true) causes a re-render which would cancel the
  // timeout via cleanup. The mountedRef guard prevents stale calls instead.
  useEffect(() => {
    if (level !== 6 || done) return;
    setDone(true);
    const stratMsg = strategy
      ? `That's ${strategy.anchorA} times ${b} — ${strategy.anchorProduct} — ${strategy.type === "subtract-one-group" || strategy.type === "halving" ? "minus" : "plus"} ${strategy.extraProduct}.`
      : "";
    speak(
      `${a} times ${b} is ${product}. ${stratMsg} ${pick([
        "We'll come back to this one. Every great film needs a few takes.",
        "Now you've seen how it works. Next time you'll nail it!",
        "That's the strategy. We'll practice this one again soon.",
        "You've seen the trick now. Let's try it again later, Director.",
        "Remember this strategy next time. You'll get it!",
      ])}`,
      speechRate
    );
    setTimeout(() => {
      if (mountedRef.current) {
        onComplete({
          correct: false,
          discoveryLevel: 6,
          anchorFactUsed: anchorStr,
        });
      }
    }, 4000);
  }, [level, done, a, b, product, strategy, anchorStr, speechRate, onComplete]);

  // Celebrate correct answer during discovery
  const celebrate = useCallback(
    (atLevel: number) => {
      setDone(true);
      setProcessing(true);
      const lines =
        atLevel <= 2
          ? [
              "That's the one! Sometimes you just need a moment.",
              "You figured it out! Great thinking, Director!",
              "See? You knew it all along!",
              "Patience pays off! Brilliant work.",
              "That's the director's instinct!",
            ]
          : [
              "Brilliant! You used what you already knew!",
              "You connected the dots yourself. Impressive!",
              "You've got it! You built it yourself!",
              "That's it! Great maths work, Director!",
              "Look at you, solving it with strategy!",
            ];
      speak(pick(lines), speechRate);
      setTimeout(() => {
        if (mountedRef.current) {
          onComplete({
            correct: true,
            discoveryLevel: atLevel,
            anchorFactUsed: anchorStr,
          });
        }
      }, 2500);
    },
    [anchorStr, speechRate, onComplete]
  );

  // Handle keypad submission
  const handleSubmit = useCallback(() => {
    if (processing || answer.length === 0 || done) return;
    const val = parseInt(answer, 10);
    if (val === product) {
      celebrate(level);
    } else {
      setAnswer("");
      advance(level);
    }
  }, [processing, answer, done, product, level, celebrate, advance]);

  // Handle counting complete (level 5)
  const handleCountDone = useCallback(() => {
    if (done) return;
    setDone(true);
    speak(
      `${a} times ${b} is ${product}! ${pick([
        "You counted every single one!",
        "You discovered it yourself. Well done, Director!",
        "That's how it's done! You found the answer!",
        "Counted all the way. Brilliant!",
        "You built it from scratch. Amazing work!",
      ])}`,
      speechRate
    );
    setTimeout(() => {
      if (mountedRef.current) {
        onComplete({
          correct: true,
          discoveryLevel: 5,
          anchorFactUsed: anchorStr,
        });
      }
    }, 2500);
  }, [done, a, b, product, anchorStr, speechRate, onComplete]);

  const splitProps = strategy
    ? buildSplitProps(strategy, b, a, product)
    : null;

  const showKeypad = level <= 4 && !done;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Discovery level prompt */}
      <div className="text-center px-4 mb-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={level}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="m-0"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 3vw, 17px)",
              fontWeight: 600,
              color: "var(--colour-text-secondary)",
            }}
          >
            {level === 1 && "Take your time..."}
            {level === 2 && "Think of a fact you know..."}
            {level === 3 &&
              strategy &&
              `You know: ${strategy.anchorA} × ${b} = ${strategy.anchorProduct}`}
            {level === 4 &&
              strategy &&
              (() => {
                const op =
                  strategy.type === "subtract-one-group" ||
                  strategy.type === "halving"
                    ? "−"
                    : "+";
                return `${strategy.anchorProduct} ${op} ${strategy.extraProduct} = ?`;
              })()}
            {level === 5 && "Tap each row to count!"}
            {level === 6 && (
              <span style={{ color: "var(--colour-accent-gold)" }}>
                {a} × {b} = {product}
              </span>
            )}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Content: array + keypad */}
      <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-center md:gap-12 min-h-0 px-4">
        <div className="flex-1 flex items-center justify-center min-h-0 overflow-y-auto md:max-w-[520px]">
          <AnimatePresence mode="wait">
            {/* Levels 1-2: Glowing interactive array */}
            {level <= 2 && (
              <motion.div
                key="glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(230, 180, 34, 0.04)",
                      "0 0 40px rgba(230, 180, 34, 0.12)",
                      "0 0 20px rgba(230, 180, 34, 0.04)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="rounded-2xl p-2"
                >
                  <InteractiveArray
                    rows={a}
                    cols={b}
                    speechRate={speechRate}
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Levels 3-4: Split array */}
            {(level === 3 || level === 4) && splitProps && (
              <motion.div
                key="split"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SplitArray
                  {...splitProps}
                  showBottom={showExtra || level === 4}
                  showTotal={level === 4}
                />
              </motion.div>
            )}

            {/* No strategy fallback for 3-4 → show regular array */}
            {(level === 3 || level === 4) && !splitProps && (
              <motion.div
                key="fallback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <InteractiveArray
                  rows={a}
                  cols={b}
                  speechRate={speechRate}
                />
              </motion.div>
            )}

            {/* Level 5: Guided counting */}
            {level === 5 && (
              <motion.div
                key="count"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <GuidedCounting
                  rows={a}
                  cols={b}
                  speechRate={speechRate}
                  onComplete={handleCountDone}
                />
              </motion.div>
            )}

            {/* Level 6: Full reveal */}
            {level === 6 && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {splitProps ? (
                  <SplitArray
                    {...splitProps}
                    showBottom={true}
                    showTotal={true}
                  />
                ) : (
                  <div className="text-center">
                    <InteractiveArray
                      rows={a}
                      cols={b}
                      speechRate={speechRate}
                    />
                    <div
                      className="mt-2"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(24px, 5vw, 36px)",
                        fontWeight: 700,
                        color: "var(--colour-accent-gold)",
                      }}
                    >
                      = {product}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Keypad (levels 1-4 only) */}
        {showKeypad && (
          <div className="pt-2 pb-4 md:pt-8 md:pb-0 md:flex-none md:w-[340px]">
            {/* Answer display */}
            <div
              className="text-center mb-3 h-10 flex items-center justify-center"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(28px, 6vw, 36px)",
                fontWeight: 700,
                color: answer
                  ? "var(--colour-text-primary)"
                  : "var(--colour-text-secondary)",
              }}
            >
              {answer || (
                <span style={{ opacity: 0.25 }}>?</span>
              )}
            </div>
            <Keypad
              value={answer}
              onChange={setAnswer}
              onSubmit={handleSubmit}
              disabled={processing}
            />
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!done && (
        <div className="flex justify-center gap-3 pb-3 px-4">
          {level === 2 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => advance(2)}
              className="px-4 py-2 rounded-xl cursor-pointer"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 600,
                background: "transparent",
                color: "var(--colour-accent-gold-light)",
                border: "1.5px solid rgba(230, 180, 34, 0.2)",
              }}
            >
              Show me
            </motion.button>
          )}
          {level >= 3 && level <= 5 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLevel(6)}
              className="px-4 py-2 rounded-xl cursor-pointer"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 500,
                background: "transparent",
                color: "var(--colour-text-secondary)",
                border: "1.5px solid rgba(230, 180, 34, 0.1)",
              }}
            >
              Just tell me
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Guided Counting (Level 5) ──

function GuidedCounting({
  rows,
  cols,
  speechRate,
  onComplete,
}: {
  rows: number;
  cols: number;
  speechRate: number;
  onComplete: () => void;
}) {
  const [tapped, setTapped] = useState(0);
  const gap = getGapClass(cols, rows);

  const handleTap = useCallback(() => {
    if (tapped >= rows) return;
    const next = tapped + 1;
    const total = next * cols;
    setTapped(next);
    if (next === rows) {
      setTimeout(onComplete, 800);
    }
    speak(`${total}`, speechRate);
  }, [tapped, rows, cols, speechRate, onComplete]);

  return (
    <div className="flex flex-col items-center">
      <div className={`flex flex-col items-center ${gap}`}>
        {Array.from({ length: rows }, (_, r) => (
          <motion.div
            key={r}
            className={`flex ${gap} cursor-pointer rounded-lg px-1 py-0.5`}
            onClick={handleTap}
            animate={{
              backgroundColor:
                r < tapped
                  ? "rgba(78, 205, 196, 0.15)"
                  : r === tapped
                    ? "rgba(230, 180, 34, 0.08)"
                    : "transparent",
              opacity: r < tapped ? 1 : r === tapped ? 0.7 : 0.3,
            }}
            whileTap={{ scale: 0.97 }}
          >
            {Array.from({ length: cols }, (_, c) => (
              <ArrayIcon
                key={c}
                row={r}
                col={c}
                cols={cols}
                totalRows={rows}
                delay={0}
              />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Running total */}
      {tapped > 0 && (
        <motion.div
          key={tapped * cols}
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-2"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(24px, 5vw, 36px)",
            fontWeight: 700,
            color:
              tapped === rows
                ? "var(--colour-success)"
                : "var(--colour-accent-gold)",
          }}
        >
          = {tapped * cols}
        </motion.div>
      )}

      {/* Nudge */}
      {tapped < rows && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 4 }}
          className="mt-2 m-0"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--colour-text-secondary)",
          }}
        >
          Tap the next row!
        </motion.p>
      )}
    </div>
  );
}
