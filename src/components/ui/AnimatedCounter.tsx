'use client'

import { useEffect, useState } from "react";

export interface AnimatedCounterProps {
  /** Final value. The count animates from zero to this number. */
  target: number;
  /** Duration of the count-up in milliseconds. */
  duration?: number;
  /**
   * Group thousands with `toLocaleString`. Turn off for values that are not
   * quantities, such as a year.
   */
  formatNumber?: boolean;
}

/**
 * Counts up from zero to `target` on mount, easing out so the number settles
 * rather than stopping dead.
 *
 * Drives the totals on both ranking pages. It renders a bare `<span>`, so the
 * caller owns the typography.
 */
export function AnimatedCounter({
  target,
  duration = 2000,
  formatNumber = true,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * target);

      setCount(currentCount);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [target, duration]);

  return (
    <span>
      {formatNumber ? count.toLocaleString() : count}
    </span>
  );
}

export default AnimatedCounter;
