import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveArray } from "./InteractiveArray";
import { BuildItArray } from "./BuildItArray";
import { Keypad } from "./Keypad";
import { FilmStrip } from "./FilmStrip";
import { useProgress } from "../store";
import { useSession } from "../session";
import { speak, getCorrectLine, getIncorrectLine } from "../tts";

type Feedback = "correct" | "incorrect" | null;

export function QuestionScreen() {
  const { state, dispatch } = useProgress();
  const { session, currentQuestion, nextQuestion, wrapSession, recordAnswer } =
    useSession();

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [buildComplete, setBuildComplete] = useState(false);
  const [answerStartTime] = useState(Date.now());

  if (!session || !currentQuestion) return null;

  const { a, b, mode } = currentQuestion;
  const correctAnswer = a * b;
  const isBuildMode = mode === "build-it";

  const fact = state.facts.find((f) => f.a === a && f.b === b);
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

  const handleBuildComplete = useCallback(() => {
    setBuildComplete(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isProcessing || answer.length === 0) return;
    setIsProcessing(true);

    const userAnswer = parseInt(answer, 10);
    const isCorrect = userAnswer === correctAnswer;
    const responseTime = Date.now() - answerStartTime;

    if (isCorrect) {
      dispatch({ type: "ANSWER_CORRECT", a, b });
      const line = getCorrectLine();
      setFeedbackText(line);
      setFeedback("correct");
      speak(line, state.settings.speechRate);
    } else {
      dispatch({ type: "ANSWER_INCORRECT", a, b });
      const line = getIncorrectLine();
      setFeedbackText(line);
      setFeedback("incorrect");
      speak(line, state.settings.speechRate);
    }

    recordAnswer(isCorrect, responseTime);
    setTimeout(() => nextQuestion(), 2500);
  }, [
    answer,
    isProcessing,
    correctAnswer,
    answerStartTime,
    dispatch,
    state.settings.speechRate,
    a,
    b,
    recordAnswer,
    nextQuestion,
  ]);

  const answerColor =
    feedback === "correct"
      ? "var(--colour-success)"
      : feedback === "incorrect"
        ? "var(--colour-cta)"
        : "var(--colour-text-primary)";

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
          WRAP
        </motion.button>

        <FilmStrip
          total={session.questions.length}
          current={session.currentIndex}
          completed={session.results.length}
        />

        <span
          className="text-[10px] sm:text-xs uppercase tracking-widest"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--colour-accent-gold)",
            opacity: 0.7,
          }}
        >
          {boxName}
        </span>
      </header>

      {/* ── Question + inline answer (always top, both layouts) ── */}
      <div className="relative z-10 text-center px-4 pt-2 sm:pt-4 pb-1 sm:pb-2">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="m-0 leading-none"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(44px, 11vw, 80px)",
            color: "var(--colour-accent-gold)",
            textShadow: "0 0 60px rgba(230, 180, 34, 0.25)",
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

        <div className="h-5 sm:h-7 mt-1">
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.p
                key={feedbackText}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="m-0"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(13px, 3vw, 18px)",
                  fontWeight: 700,
                  color:
                    feedback === "correct"
                      ? "var(--colour-success)"
                      : "var(--colour-accent-gold-light)",
                  letterSpacing: "0.01em",
                  lineHeight: 1.4,
                }}
              >
                {feedbackText}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Content: stacked on mobile, side-by-side on desktop ── */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row md:items-start md:justify-center md:gap-12 lg:gap-20 min-h-0 px-4 sm:px-8">
        {/* Array area */}
        <div className="flex-1 flex items-center justify-center min-h-0 overflow-y-auto md:flex-1 md:max-w-[520px]">
          {isBuildMode && !buildComplete ? (
            <BuildItArray
              rows={a}
              cols={b}
              speechRate={state.settings.speechRate}
              onComplete={handleBuildComplete}
            />
          ) : (
            <InteractiveArray
              rows={a}
              cols={b}
              speechRate={state.settings.speechRate}
            />
          )}
        </div>

        {/* Keypad — bottom on mobile, right column on desktop */}
        <div className="pt-2 pb-4 sm:pb-6 md:pt-8 md:pb-0 md:flex-none md:w-[340px]">
          <Keypad
            value={answer}
            onChange={setAnswer}
            onSubmit={handleSubmit}
            disabled={isProcessing}
          />
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
