import { ArrayIcon } from "./ArrayIcon";

interface VisualArrayProps {
  rows: number;
  cols: number;
}

export function VisualArray({ rows, cols }: VisualArrayProps) {
  return (
    <div
      className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4"
      role="img"
      aria-label={`Array showing ${rows} rows of ${cols} objects`}
    >
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-2 sm:gap-3 md:gap-4">
          {Array.from({ length: cols }, (_, c) => (
            <ArrayIcon
              key={c}
              row={r}
              col={c}
              delay={r * 0.1 + c * 0.05}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
