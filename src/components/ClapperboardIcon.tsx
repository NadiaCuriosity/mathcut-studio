import { motion } from "framer-motion";

interface ClapperboardIconProps {
  delay?: number;
}

export function ClapperboardIcon({ delay = 0 }: ClapperboardIconProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Board body */}
        <rect
          x="4"
          y="16"
          width="40"
          height="28"
          rx="3"
          fill="var(--colour-bg-elevated)"
          stroke="var(--colour-accent-gold)"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
        {/* Inner screen area */}
        <rect
          x="8"
          y="20"
          width="32"
          height="20"
          rx="1.5"
          fill="var(--colour-bg-primary)"
          opacity="0.7"
        />
        {/* Top clapper - bottom piece */}
        <rect
          x="4"
          y="12"
          width="40"
          height="6"
          rx="1"
          fill="var(--colour-bg-raised)"
          stroke="var(--colour-accent-gold)"
          strokeWidth="1"
          strokeOpacity="0.25"
        />
        {/* Top clapper - top piece */}
        <rect
          x="4"
          y="6"
          width="40"
          height="6"
          rx="1"
          fill="var(--colour-accent-gold)"
          fillOpacity="0.8"
        />
        {/* Diagonal stripes on clapper top */}
        <line x1="12" y1="6" x2="16" y2="12" stroke="var(--colour-bg-deep)" strokeWidth="2.5" strokeOpacity="0.6" />
        <line x1="22" y1="6" x2="26" y2="12" stroke="var(--colour-bg-deep)" strokeWidth="2.5" strokeOpacity="0.6" />
        <line x1="32" y1="6" x2="36" y2="12" stroke="var(--colour-bg-deep)" strokeWidth="2.5" strokeOpacity="0.6" />
        {/* Warm glow dot */}
        <circle cx="24" cy="30" r="4" fill="var(--colour-accent-gold)" fillOpacity="0.15" />
        <circle cx="24" cy="30" r="1.5" fill="var(--colour-accent-gold)" fillOpacity="0.5" />
      </svg>
    </motion.div>
  );
}
