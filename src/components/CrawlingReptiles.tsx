import { motion } from "framer-motion";

function Gecko({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Body */}
      <ellipse cx="32" cy="30" rx="8" ry="14" fill={color} />
      {/* Head */}
      <ellipse cx="32" cy="13" rx="7" ry="6" fill={color} />
      {/* Eyes */}
      <circle cx="28" cy="11" r="2.5" fill="#111" />
      <circle cx="36" cy="11" r="2.5" fill="#111" />
      <circle cx="28.8" cy="10.4" r="1" fill="#fff" />
      <circle cx="36.8" cy="10.4" r="1" fill="#fff" />
      {/* Front legs */}
      <path d="M24 24 Q16 20 12 16" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M40 24 Q48 20 52 16" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Toes front */}
      <circle cx="11" cy="15" r="2" fill={color} />
      <circle cx="53" cy="15" r="2" fill={color} />
      {/* Back legs */}
      <path d="M24 36 Q16 40 12 46" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M40 36 Q48 40 52 46" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Toes back */}
      <circle cx="11" cy="47" r="2" fill={color} />
      <circle cx="53" cy="47" r="2" fill={color} />
      {/* Tail */}
      <path d="M32 44 Q34 52 30 58 Q28 62 32 64" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Belly stripe */}
      <ellipse cx="32" cy="30" rx="4" ry="10" fill={color} opacity="0.5" />
    </svg>
  );
}

function Snake({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Body - sinuous S-curve */}
      <path
        d="M32 6 Q44 14 28 22 Q12 30 36 38 Q52 44 32 54 Q24 58 28 62"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Head */}
      <ellipse cx="32" cy="6" rx="6" ry="4.5" fill={color} />
      {/* Eyes */}
      <circle cx="29" cy="5" r="1.8" fill="#111" />
      <circle cx="35" cy="5" r="1.8" fill="#111" />
      <circle cx="29.5" cy="4.5" r="0.7" fill="#fff" />
      <circle cx="35.5" cy="4.5" r="0.7" fill="#fff" />
      {/* Tongue */}
      <path d="M32 10 L32 14 M32 14 L30 16 M32 14 L34 16" stroke="#e44" strokeWidth="1.2" strokeLinecap="round" />
      {/* Belly pattern */}
      <path
        d="M32 6 Q44 14 28 22 Q12 30 36 38 Q52 44 32 54 Q24 58 28 62"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      {/* Tail tip */}
      <circle cx="28" cy="62" r="1.5" fill={color} />
    </svg>
  );
}

const REPTILES = [
  { type: "gecko" as const, delay: 0, top: "3%", rotate: 160, size: 48, color: "#4ade80" },
  { type: "snake" as const, delay: 2, top: "20%", rotate: 170, size: 44, color: "#a78bfa" },
  { type: "gecko" as const, delay: 4.5, top: "40%", rotate: 150, size: 42, color: "#34d399" },
  { type: "snake" as const, delay: 1.5, top: "58%", rotate: 175, size: 46, color: "#f97316" },
  { type: "gecko" as const, delay: 3, top: "74%", rotate: 155, size: 40, color: "#facc15" },
  { type: "snake" as const, delay: 5, top: "90%", rotate: 165, size: 44, color: "#f472b6" },
];

export function CrawlingReptiles() {
  return (
    <div
      className="fixed left-0 top-0 h-full pointer-events-none"
      style={{ width: "72px", zIndex: 50 }}
    >
      {REPTILES.map((r, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: r.top,
            left: "-8px",
            transform: `rotate(${r.rotate}deg)`,
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
          }}
          animate={{
            y: [0, 10, 0],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 5,
            delay: r.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {r.type === "gecko" ? (
            <Gecko size={r.size} color={r.color} />
          ) : (
            <Snake size={r.size} color={r.color} />
          )}
        </motion.div>
      ))}
    </div>
  );
}
