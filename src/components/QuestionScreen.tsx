import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisualArray } from "./VisualArray";
import { Keypad } from "./Keypad";
import { useProgress } from "../store";
import { speak, getCorrectLine, getIncorrectLine } from "../tts";

const FACT_A = 3;
const FACT_B = 4;
const CORRECT_ANSWER = FACT_A * FACT_B;

type Feedback = "correct" | "incorrect" | null;

export function QuestionScreen() {
  const { state, dispatch } = useProgress();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [arrayKey, setArrayKey] = useState(0);

  const fact = state.facts.find((f) => f.a === FACT_A && f.b === FACT_B);

  const handleSubmit = useCallback(async () => {
    if (isProcessing || answer.length === 0) return;
    setIsProcessing(true);

    const userAnswer = parseInt(answer, 10);
    const isCorrect = userAnswer === CORRECT_ANSWER;

    if (isCorrect) {
      dispatch({ type: "ANSWER_CORRECT", a: FACT_A, b: FACT_B });
      const line = getCorrectLine();
      setFeedbackText(line);
      setFeedback("correct");
      speak(line, state.settings.speechRate);
    } else {
      dispatch({ type: "ANSWER_INCORRECT", a: FACT_A, b: FACT_B });
      const line = getIncorrectLine();
      setFeedbackText(line);
      setFeedback("incorrect");
      speak(line, state.settings.speechRate);
    }

    setTimeout(() => {
      setFeedback(null);
      setFeedbackText("");
      setAnswer("");
      setIsProcessing(false);
      setArrayKey((k) => k + 1);
    }, 2500);
  }, [answer, isProcessing, dispatch, state.settings.speechRate]);

  const boxName = fact
    ? [
        "",
        "Script Reading",
        "Table Read",
        "Dress Rehearsal",
        "On Camera",
        "Award Winner",
      ][fact.box]
    : "Script Reading";

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Warm spotlight glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(230, 180, 34, 0.07) 0%, transparent 60%)",
        }}
      />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-5 sm:px-8 pt-4 pb-1">
        <div>
          <p
            className="text-xs sm:text-sm tracking-[0.08em] uppercase m-0 leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--colour-accent-gold)",
              opacity: 0.6,
            }}
          >
            Lincoln Cole Ellis
          </p>
          <h2
            className="text-lg sm:text-xl tracking-[0.05em] uppercase m-0 leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--colour-text-secondary)",
            }}
          >
            MathCut Studio
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs sm:text-sm uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--colour-accent-gold)",
              opacity: 0.7,
            }}
          >
            {boxName}
          </span>
          <div
            className="w-2.5 h-3.5 rounded-sm"
            style={{ background: "var(--colour-accent-gold)" }}
            aria-label="1 of 1 questions"
          />
        </div>
      </header>

      {/* ── Main content area — responsive layout ── */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        {/*
          On mobile: vertical stack (question → array → answer → keypad)
          On desktop (>=768px): two-column layout
            Left: question + array (centred)
            Right: answer + keypad
        */}
        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-center md:gap-16 lg:gap-24 min-h-0 px-5 sm:px-8">
          {/* Left column: Question + Array */}
          <div className="flex flex-col items-center md:flex-1 md:max-w-[520px]">
            {/* The Scene: Question */}
            <div className="text-center pt-4 sm:pt-6 pb-3 sm:pb-6">
              <motion.h1
                key="question"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="m-0 leading-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(60px, 14vw, 96px)",
                  color: "var(--colour-accent-gold)",
                  textShadow: "0 0 60px rgba(230, 180, 34, 0.25)",
                }}
              >
                {FACT_A} × {FACT_B}
              </motion.h1>
            </div>

            {/* The Stage: Array */}
            <div className="flex items-center justify-center py-2 sm:py-4">
              <VisualArray key={arrayKey} rows={FACT_A} cols={FACT_B} />
            </div>
          </div>

          {/* Right column: Answer + Keypad */}
          <div className="flex flex-col items-center md:flex-none md:w-[360px]">
            {/* Answer display */}
            <div className="text-center py-3 sm:py-5">
              <motion.div
                animate={
                  feedback === "incorrect"
                    ? { x: [0, -4, 4, -4, 4, 0] }
                    : { x: 0 }
                }
                transition={{ duration: 0.3 }}
                className="inline-block min-w-[160px] sm:min-w-[200px] px-8 py-3 sm:py-4 rounded-xl"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(44px, 8vw, 64px)",
                  fontWeight: 700,
                  color:
                    feedback === "correct"
                      ? "var(--colour-success)"
                      : feedback === "incorrect"
                        ? "var(--colour-cta)"
                        : "var(--colour-text-primary)",
                  background: "var(--colour-bg-primary)",
                  border: `2px solid ${
                    feedback === "correct"
                      ? "var(--colour-success)"
                      : feedback === "incorrect"
                        ? "rgba(255, 107, 107, 0.4)"
                        : "rgba(230, 180, 34, 0.15)"
                  }`,
                  boxShadow:
                    feedback === "correct"
                      ? "0 0 40px rgba(78, 205, 196, 0.2)"
                      : feedback === "incorrect"
                        ? "0 0 30px rgba(255, 107, 107, 0.15)"
                        : "0 4px 24px rgba(0, 0, 0, 0.4)",
                  transition: "border-color 0.3s, box-shadow 0.3s, color 0.3s",
                }}
              >
                {answer || (
                  <span
                    style={{
                      opacity: 0.15,
                      color: "var(--colour-text-secondary)",
                    }}
                  >
                    ?
                  </span>
                )}
              </motion.div>

              {/* Feedback text */}
              <div className="h-8 sm:h-10 mt-2">
                <AnimatePresence mode="wait">
                  {feedback && (
                    <motion.p
                      key={feedbackText}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="m-0"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(16px, 3.5vw, 22px)",
                        fontWeight: 700,
                        color:
                          feedback === "correct"
                            ? "var(--colour-success)"
                            : "var(--colour-accent-gold-light)",
                        letterSpacing: "0.01em",
                        lineHeight: 1.5,
                      }}
                    >
                      {feedbackText}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* The Console: Keypad */}
            <div className="w-full pb-6 sm:pb-4">
              <Keypad
                value={answer}
                onChange={setAnswer}
                onSubmit={handleSubmit}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spotlight sweep on correct */}
      <AnimatePresence>
        {feedback === "correct" && (
          <motion.div
            initial={{ x: "-100%", opacity: 0.7 }}
            animate={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none z-40"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(78, 205, 196, 0.2) 40%, rgba(78, 205, 196, 0.3) 50%, rgba(78, 205, 196, 0.2) 60%, transparent 100%)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
