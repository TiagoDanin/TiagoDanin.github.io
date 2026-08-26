import { ORIGIN } from '@/lib/i18n/seo';

export interface LegacyRedirectProps {
  /** Absolute path this URL moved to, with its trailing slash. */
  to: string;
}

/**
 * Stands in for a 301 on a URL that moved.
 *
 * A static export has no server, so there is nothing to answer with a status
 * code. Three mechanisms cover the cases a redirect would:
 *
 * - `location.replace` moves a reader with JavaScript without leaving an entry
 *   in history, so Back does not bounce them straight here again.
 * - A zero-delay meta refresh covers readers without JavaScript. Search engines
 *   read it as a redirect.
 * - A visible link covers whatever the other two miss, and explains itself.
 *
 * The canonical tag is what actually consolidates the old address into the new
 * one. `noindex` is deliberately absent: paired with a canonical the two
 * contradict, and the page gets dropped rather than consolidated.
 *
 * Every page under `(legacy)` that only exists to preserve an old URL renders
 * this, so deleting that folder is the only step needed to retire them all.
 */
export function LegacyRedirect({ to }: LegacyRedirectProps) {
  const target = `${ORIGIN}${to}`;

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <link rel="canonical" href={target} />
      <script
        dangerouslySetInnerHTML={{
          __html: `location.replace(${JSON.stringify(to)})`,
        }}
      />

      <div className="container mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-32 text-center">
        <p className="text-muted-foreground">
          This page moved.{' '}
          <a href={to} className="font-medium text-foreground underline underline-offset-4">
            Continue to its new address
          </a>
          .
        </p>
        <p className="text-sm text-muted-foreground" lang="pt-BR">
          Esta página mudou de endereço.{' '}
          <a href={to} className="font-medium text-foreground underline underline-offset-4">
            Ir para o novo endereço
          </a>
          .
        </p>
      </div>
    </>
  );
}
