import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keypad } from "./Keypad";
import { useProgress } from "../store";
import { useSession } from "../session";

type Feedback = "correct" | "incorrect" | null;

/** Calculate score for a single correct answer */
function calcQuestionScore(responseTime: number, streak: number): number {
  let base = 100;
  // Speed bonus
  if (responseTime < 2000) base += 100;
  else if (responseTime < 3000) base += 50;
  else if (responseTime < 5000) base += 25;
  // Streak multiplier
  if (streak >= 5) return Math.round(base * 3);
  if (streak >= 3) return Math.round(base * 2);
  if (streak >= 2) return Math.round(base * 1.5);
  return base;
}

export function ActionSceneScreen() {
  const { dispatch } = useProgress();
  const { session, currentQuestion, nextQuestion, wrapSession, recordAnswer } =
    useSession();

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [answerStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const [showCorrection, setShowCorrection] = useState<string | null>(null);
  const [showSwitchPrompt, setShowSwitchPrompt] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);

  if (!session || !currentQuestion) return null;

  const { a, b } = currentQuestion;
  const correctAnswer = a * b;
  const questionNum = session.currentIndex + 1;
  const totalQuestions = session.questions.length;

  const handleSubmit = useCallback(() => {
    if (isProcessing || answer.length === 0) return;
    setIsProcessing(true);

    const userAnswer = parseInt(answer, 10);
    const isCorrect = userAnswer === correctAnswer;
    const responseTime = Date.now() - answerStartTime;

    if (isCorrect) {
      dispatch({ type: "ANSWER_CORRECT", a, b });
      const points = calcQuestionScore(responseTime, streak);
      setLastPoints(points);
      setScore((s) => s + points);
      setStreak((s) => s + 1);
      setFeedback("correct");
      setFlashEffect(true);
      recordAnswer(true, responseTime, false, null);

      setTimeout(() => {
        setFlashEffect(false);
        nextQuestion();
      }, 1200);
    } else {
      dispatch({ type: "ANSWER_INCORRECT", a, b });
      setFeedback("incorrect");
      setStreak(0);
      setShowCorrection(`${a} × ${b} = ${correctAnswer}`);
      recordAnswer(false, responseTime, false, null);

      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);

      setTimeout(() => {
        if (newWrong >= 3) {
          setShowSwitchPrompt(true);
        } else {
          setShowCorrection(null);
          nextQuestion();
        }
      }, 2000);
    }
  }, [
    answer,
    isProcessing,
    correctAnswer,
    answerStartTime,
    dispatch,
    a,
    b,
    streak,
    wrongCount,
    recordAnswer,
    nextQuestion,
  ]);

  const handleDismissSwitchPrompt = useCallback(() => {
    setShowSwitchPrompt(false);
    setShowCorrection(null);
    nextQuestion();
  }, [nextQuestion]);

  const answerColor =
    feedback === "correct"
      ? "var(--colour-success)"
      : feedback === "incorrect"
        ? "var(--colour-cta)"
        : "var(--colour-text-primary)";

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Dark spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(230, 180, 34, 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Camera flash effect */}
      <AnimatePresence>
        {flashEffect && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 pointer-events-none"
            style={{ background: "rgba(255, 255, 255, 0.3)" }}
          />
        )}
      </AnimatePresence>

      {/* ── Header with score ── */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 pt-3 sm:pt-4 pb-1">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={wrapSession}
          className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg cursor-pointer"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "13px",
            letterSpacing: "0.08em",
            color: "var(--colour-accent-gold)",
            background: "transparent",
            border: "1px solid rgba(230, 180, 34, 0.2)",
          }}
        >
          CUT!
        </motion.button>

        {/* Score display */}
        <div className="text-center">
          <div
            className="text-xs uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--colour-accent-gold-light)",
              opacity: 0.7,
            }}
          >
            Box Office
          </div>
          <motion.div
            key={score}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="text-xl sm:text-2xl"
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              color: "var(--colour-accent-gold)",
            }}
          >
            {score.toLocaleString()}
          </motion.div>
        </div>

        {/* Question counter */}
        <span
          className="text-xs"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--colour-text-secondary)",
          }}
        >
          {questionNum}/{totalQuestions}
        </span>
      </header>

      {/* Streak indicator */}
      {streak >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center"
        >
          <span
            className="text-xs px-3 py-0.5 rounded-full"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--colour-accent-gold)",
              background: "rgba(230, 180, 34, 0.12)",
              border: "1px solid rgba(230, 180, 34, 0.2)",
            }}
          >
            {streak >= 5 ? "×3" : streak >= 3 ? "×2" : "×1.5"} STREAK
          </span>
        </motion.div>
      )}

      {/* ── Question ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        <motion.h1
          key={`${a}x${b}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="m-0 mb-6 leading-none"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(52px, 14vw, 96px)",
            color: "var(--colour-accent-gold)",
            textShadow: "0 0 60px rgba(230, 180, 34, 0.3)",
          }}
        >
          {a} × {b}
          <span style={{ opacity: 0.3 }}> = </span>
          <motion.span
            animate={
              feedback === "incorrect"
                ? { x: [0, -4, 4, -4, 4, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.3 }}
            style={{ fontFamily: "var(--font-mono)", color: answerColor }}
          >
            {answer || <span style={{ opacity: 0.2 }}>?</span>}
          </motion.span>
        </motion.h1>

        {/* Points popup */}
        <AnimatePresence>
          {feedback === "correct" && lastPoints > 0 && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -40, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute z-30"
              style={{
                top: "35%",
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                color: "var(--colour-success)",
                textShadow: "0 0 20px rgba(78, 205, 196, 0.5)",
              }}
            >
              +{lastPoints}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Correction overlay */}
        <AnimatePresence>
          {showCorrection && !showSwitchPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute z-30 px-6 py-3 rounded-xl"
              style={{
                top: "40%",
                background: "var(--colour-bg-elevated)",
                border: "2px solid rgba(230, 180, 34, 0.3)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--colour-accent-gold)",
                }}
              >
                {showCorrection}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Switch mode prompt */}
        <AnimatePresence>
          {showSwitchPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute z-30 px-6 py-5 rounded-xl text-center"
              style={{
                top: "30%",
                background: "var(--colour-bg-elevated)",
                border: "2px solid rgba(230, 180, 34, 0.3)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                maxWidth: "320px",
              }}
            >
              <p
                className="m-0 mb-3"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  color: "var(--colour-text-primary)",
                }}
              >
                Tough scene! Want to switch to Rehearsal for some extra
                practice?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={wrapSession}
                  className="px-4 py-2 rounded-lg cursor-pointer"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "14px",
                    background: "var(--colour-accent-gold)",
                    color: "var(--colour-bg-deep)",
                    border: "none",
                  }}
                >
                  SWITCH
                </button>
                <button
                  onClick={handleDismissSwitchPrompt}
                  className="px-4 py-2 rounded-lg cursor-pointer"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "14px",
                    background: "transparent",
                    color: "var(--colour-accent-gold)",
                    border: "1px solid rgba(230, 180, 34, 0.3)",
                  }}
                >
                  KEEP GOING
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Keypad ── */}
      <div className="relative z-10 px-4 sm:px-8 pt-2 pb-4 sm:pb-6">
        <div className="max-w-[340px] mx-auto">
          <Keypad
            value={answer}
            onChange={setAnswer}
            onSubmit={handleSubmit}
            disabled={isProcessing || showSwitchPrompt}
          />
        </div>
      </div>

      {/* Spotlight sweep on correct */}
      <AnimatePresence>
        {feedback === "correct" && (
          <motion.div
            initial={{ x: "-100%", opacity: 0.7 }}
            animate={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none z-40"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(78, 205, 196, 0.25) 40%, rgba(78, 205, 196, 0.4) 50%, rgba(78, 205, 196, 0.25) 60%, transparent 100%)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** Calculate total Action Scene score from session results */
export function calcActionSceneTotal(
  results: { correct: boolean; responseTime: number }[]
): number {
  let total = 0;
  let streak = 0;
  for (const r of results) {
    if (r.correct) {
      streak++;
      total += calcQuestionScore(r.responseTime, streak);
    } else {
      streak = 0;
    }
  }
  return total;
}
