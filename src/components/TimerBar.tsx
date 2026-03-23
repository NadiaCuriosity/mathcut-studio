import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TimerBarProps {
  durationSec: number;
}

export function TimerBar({ durationSec }: TimerBarProps) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const sec = (now - startRef.current) / 1000;
      setElapsed(Math.min(sec, durationSec));
      if (sec < durationSec) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [durationSec]);

  const pct = Math.min((elapsed / durationSec) * 100, 100);
  // Green (0%) -> Amber (100%), never red
  const color =
    pct < 60
      ? "var(--colour-success)"
      : `rgb(${Math.round(180 + (pct - 60) * 1.25)}, ${Math.round(205 - (pct - 60) * 2)}, ${Math.round(196 - (pct - 60) * 3)})`;

  return (
    <div
      className="relative z-10 mx-4 sm:mx-8 mt-1 h-1.5 rounded-full overflow-hidden"
      style={{ background: "var(--colour-bg-raised)" }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          width: `${100 - pct}%`,
          background: color,
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}
