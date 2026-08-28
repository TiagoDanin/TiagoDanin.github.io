import type { ReactNode } from 'react';

export interface LegalDocumentProps {
  /** Anchor the hero's jump links point at. */
  id: string;
  title: string;
  /** Label in front of the date, translated by the page. */
  updatedLabel: string;
  /** The date as a reader sees it, already formatted for the locale. */
  updatedAt: string;
  /** The same date as `YYYY-MM-DD`, for the `time` element. */
  updatedIso: string;
  /** The document body, compiled from MDX by the page. */
  children: ReactNode;
}

/**
 * One of the two documents on /legal.
 *
 * The shell only: heading, the date the text last changed, and the prose. The
 * wording lives in `contents/legal/*.mdx`, so editing the policy never touches
 * this file.
 */
export function LegalDocument({
  id,
  title,
  updatedLabel,
  updatedAt,
  updatedIso,
  children,
}: LegalDocumentProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-border pt-14 first:border-t-0 first:pt-0"
    >
      <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        {updatedLabel} <time dateTime={updatedIso}>{updatedAt}</time>
      </p>

      <div className="prose prose-zinc mt-8 max-w-none">{children}</div>
    </section>
  );
}
