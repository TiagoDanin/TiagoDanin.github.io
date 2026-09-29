import Image from 'next/image';

import { cn } from '@/lib/utils';

export interface AppIconProps {
  /** App name, used as the image's alt text. */
  name: string;
  /** The store icon, a square WebP under `/images/apps/<slug>/`. */
  image?: string;
  /** Shown when the app has no icon file yet (an unreleased app). */
  emoji: string;
  /** The app's accent, tinting the tile behind the emoji fallback. */
  accentColor: string;
  /** Rendered edge in CSS pixels. */
  size?: number;
  className?: string;
}

/**
 * An app's launcher icon, or its emoji on a tinted tile when there is no icon.
 *
 * The store icon already carries its own background and shape, so it is drawn
 * as it is, only rounded like a launcher would. The emoji stands in for apps
 * that never reached the store and have no artwork to show.
 */
export function AppIcon({ name, image, emoji, accentColor, size = 64, className }: AppIconProps) {
  const radius = Math.round(size * 0.22);

  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={size}
        height={size}
        className={cn('shrink-0 shadow-sm', className)}
        style={{ borderRadius: radius }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={name}
      className={cn('flex shrink-0 items-center justify-center', className)}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        fontSize: Math.round(size * 0.55),
        backgroundColor: `${accentColor}20`,
      }}
    >
      {emoji}
    </div>
  );
}
