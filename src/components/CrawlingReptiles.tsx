import { motion } from "framer-motion";

function Gecko({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 64 100" fill="none">
      {/* Head - wide flat gecko head */}
      <ellipse cx="32" cy="10" rx="9" ry="7" fill={color} />
      {/* Eyes - bulging gecko eyes on sides of head */}
      <circle cx="23" cy="7" r="4" fill={color} />
      <circle cx="41" cy="7" r="4" fill={color} />
      <circle cx="23" cy="7" r="2.5" fill="#111" />
      <circle cx="41" cy="7" r="2.5" fill="#111" />
      <circle cx="24" cy="6.2" r="1" fill="#fff" />
      <circle cx="42" cy="6.2" r="1" fill="#fff" />
      {/* Neck */}
      <ellipse cx="32" cy="18" rx="5" ry="4" fill={color} />
      {/* Body - long flat torso */}
      <ellipse cx="32" cy="38" rx="7" ry="18" fill={color} />
      {/* Belly spots */}
      <ellipse cx="32" cy="30" rx="3.5" ry="2" fill={color} opacity="0.5" />
      <ellipse cx="32" cy="38" rx="3" ry="2" fill={color} opacity="0.5" />
      <ellipse cx="32" cy="46" rx="3.5" ry="2" fill={color} opacity="0.5" />
      {/* Front left leg - angled forward with splayed toes */}
      <path d="M26 25 Q14 18 6 14" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M6 14 L2 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 14 L3 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 14 L4 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 14 L8 11" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Front right leg */}
      <path d="M38 25 Q50 18 58 14" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M58 14 L62 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M58 14 L61 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M58 14 L60 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M58 14 L56 11" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Back left leg - angled backward */}
      <path d="M26 48 Q14 56 6 62" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M6 62 L2 60" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 62 L3 65" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 62 L5 58" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 62 L9 64" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Back right leg */}
      <path d="M38 48 Q50 56 58 62" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M58 62 L62 60" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M58 62 L61 65" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M58 62 L59 58" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M58 62 L55 64" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Tail - long curving gecko tail */}
      <path d="M32 56 Q36 68 30 78 Q24 88 32 96" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M32 96 Q34 98 33 100" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
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
      {/* Tail tip */}
      <circle cx="28" cy="62" r="1.5" fill={color} />
    </svg>
  );
}

const REPTILES = [
  { type: "gecko" as const, delay: 0, top: "3%", rotate: 160, size: 48, color: "#4ade80" },
  { type: "snake" as const, delay: 2, top: "22%", rotate: 170, size: 44, color: "#22c55e" },
  { type: "gecko" as const, delay: 4.5, top: "40%", rotate: 150, size: 42, color: "#34d399" },
  { type: "snake" as const, delay: 1.5, top: "58%", rotate: 175, size: 46, color: "#16a34a" },
  { type: "gecko" as const, delay: 3, top: "74%", rotate: 155, size: 40, color: "#86efac" },
  { type: "snake" as const, delay: 5, top: "90%", rotate: 165, size: 44, color: "#4ade80" },
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
