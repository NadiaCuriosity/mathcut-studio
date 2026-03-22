import { motion } from "framer-motion";
import { ArrayIcon, getGapClass } from "./ArrayIcon";

interface SplitArrayProps {
  cols: number;
  topRows: number;
  bottomRows: number;
  topLabel: string;
  bottomLabel: string;
  totalLabel: string;
  showBottom: boolean;
  showTotal: boolean;
  isSubtract?: boolean;
}

export function SplitArray({
  cols,
  topRows,
  bottomRows,
  topLabel,
  bottomLabel,
  totalLabel,
  showBottom,
  showTotal,
  isSubtract = false,
}: SplitArrayProps) {
  const displayRows = topRows + bottomRows;
  const gap = getGapClass(cols, displayRows);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Top section (anchor / kept rows) */}
      <div
        className="rounded-xl px-2 py-1.5"
        style={{ backgroundColor: "rgba(230, 180, 34, 0.06)" }}
      >
        <div className={`flex flex-col items-center ${gap}`}>
          {Array.from({ length: topRows }, (_, r) => (
            <div key={r} className={`flex ${gap}`}>
              {Array.from({ length: cols }, (_, c) => (
                <ArrayIcon
                  key={c}
                  row={r}
                  col={c}
                  cols={cols}
                  totalRows={displayRows}
                  delay={r * 0.04 + c * 0.02}
                />
              ))}
            </div>
          ))}
        </div>
        {topLabel && (
          <div
            className="text-center mt-1"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(11px, 2.5vw, 15px)",
              fontWeight: 700,
              color: "var(--colour-accent-gold)",
            }}
          >
            {topLabel}
          </div>
        )}
      </div>

      {/* Divider */}
      {showBottom && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="w-3/4 h-px"
          style={{
            background: isSubtract
              ? "rgba(230, 100, 100, 0.3)"
              : "rgba(78, 205, 196, 0.3)",
          }}
        />
      )}

      {/* Bottom section (extra / subtracted rows) */}
      {showBottom && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl px-2 py-1.5"
          style={{
            backgroundColor: isSubtract
              ? "rgba(230, 100, 100, 0.04)"
              : "rgba(78, 205, 196, 0.06)",
          }}
        >
          <div className={`flex flex-col items-center ${gap}`}>
            {Array.from({ length: bottomRows }, (_, r) => (
              <motion.div
                key={r}
                className={`flex ${gap}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isSubtract ? 0.3 : 1 }}
                transition={{ delay: 0.2 + r * 0.08 }}
              >
                {Array.from({ length: cols }, (_, c) => (
                  <ArrayIcon
                    key={c}
                    row={topRows + r}
                    col={c}
                    cols={cols}
                    totalRows={displayRows}
                    delay={0}
                  />
                ))}
              </motion.div>
            ))}
          </div>
          {bottomLabel && (
            <div
              className="text-center mt-1"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(11px, 2.5vw, 15px)",
                fontWeight: 700,
                color: isSubtract
                  ? "rgba(230, 100, 100, 0.7)"
                  : "var(--colour-success)",
              }}
            >
              {bottomLabel}
            </div>
          )}
        </motion.div>
      )}

      {/* Total */}
      {showTotal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-1"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(18px, 4vw, 26px)",
            fontWeight: 700,
            color: "var(--colour-accent-gold)",
          }}
        >
          {totalLabel}
        </motion.div>
      )}
    </div>
  );
}
