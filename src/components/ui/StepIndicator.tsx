export interface StepIndicatorProps {
  /** Current step, 1-based. Steps up to and including this one read as done. */
  step: number;
  /** How many steps the flow has. */
  total?: number;
  /**
   * Builds the caption and the accessible label. Defaults to Portuguese,
   * because the only flow using it today is the talk feedback form.
   */
  formatLabel?: (step: number, total: number) => string;
}

/**
 * Progress through a multi-step flow, as a row of bars plus a caption.
 *
 * The bars are decorative; the caption carries the same information as text, so
 * progress is not communicated by color alone.
 */
export function StepIndicator({
  step,
  total = 3,
  formatLabel = (current, count) => `Passo ${current} de ${count}`,
}: StepIndicatorProps) {
  const label = formatLabel(step, total);

  return (
    <div aria-label={label}>
      <div className="flex items-center gap-2">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            aria-hidden="true"
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              n <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">{label}</p>
    </div>
  );
}
