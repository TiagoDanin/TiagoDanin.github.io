import Image from 'next/image';

export interface AppScreenshot {
  src: string;
  width: number;
  height: number;
  /** Describes the image, translated by the page. */
  alt: string;
}

export interface AppScreenshotsProps {
  /** Section heading, translated by the page. */
  title: string;
  /** Accessible name of the scrolling strip, translated by the page. */
  label: string;
  screenshots: AppScreenshot[];
}

/**
 * The store screenshots of an app, in a strip that scrolls sideways.
 *
 * Every image keeps the same height and its own width, so a landscape game
 * capture and a portrait phone screen sit side by side without cropping. The
 * strip is focusable so a keyboard can scroll it with the arrow keys.
 */
export function AppScreenshots({ title, label, screenshots }: AppScreenshotsProps) {
  if (screenshots.length === 0) return null;

  return (
    <section className="px-4 py-16">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-8 text-3xl font-bold md:text-4xl">{title}</h2>
        <div
          role="region"
          aria-label={label}
          tabIndex={0}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {screenshots.map((shot) => (
            <Image
              key={shot.src}
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              loading="lazy"
              className="h-96 w-auto shrink-0 snap-start rounded-2xl border border-border shadow-sm md:h-[28rem]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
