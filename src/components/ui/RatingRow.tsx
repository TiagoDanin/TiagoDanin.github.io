'use client'

import { Star } from "lucide-react";

export interface RatingRowProps {
  /** What is being rated. Also seeds each star's accessible name. */
  label: string;
  /** Current rating. Zero means nothing chosen yet. */
  value: number;
  onChange: (value: number) => void;
  /** Paints the row in the destructive tone, for an unanswered required rating. */
  isError?: boolean;
  /** How many stars to offer. */
  max?: number;
  /**
   * Builds each star's accessible name. Defaults to Portuguese, because the
   * only flow using it today is the talk feedback form.
   */
  formatStarLabel?: (label: string, n: number) => string;
}

/**
 * A labelled star rating, as one row of a form.
 *
 * Each star is its own button rather than a radio group, so a rating can be
 * changed in a single tap from any current value. The scale grows on hover,
 * which DESIGN.md allows on small controls though not on whole cards.
 */
export function RatingRow({
  label,
  value,
  onChange,
  isError,
  max = 5,
  formatStarLabel = (name, n) => `${name}: ${n} estrelas`,
}: RatingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={`text-sm font-medium ${isError ? "text-destructive" : ""}`}>
        {label}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="p-1 transition-transform hover:scale-110"
            aria-label={formatStarLabel(label, n)}
            aria-pressed={n <= value}
          >
            <Star
              className={`w-6 h-6 ${
                n <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : isError
                  ? "text-destructive/60"
                  : "text-muted-foreground/40"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
