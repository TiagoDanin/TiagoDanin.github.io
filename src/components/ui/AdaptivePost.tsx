import Link from 'next/link';
import { Trans } from '@lingui/react/macro';

import { Button } from '@/components/ui/button';
import { localePath, type Locale } from '@/lib/i18n/locales';

export interface PostVariant {
  id: string;
  label: string;
  /** The version's own `<h1>` and og:title. */
  title: string;
  seoTitle?: string;
  description: string;
}

/** The version served at the post's own URL, before the reader picks a stack. */
export const DEFAULT_VARIANT = 'all';

const ID_PATTERN = /^[a-z0-9-]+$/;

interface AdaptivePostProps {
  locale: Locale;
  slug: string;
  variants: PostVariant[];
  /** The version this page renders: a variant id, or `all` at the post's own URL. */
  active: string;
  children: React.ReactNode;
}

/**
 * One article written for several readers. Each version is its own static page,
 * `/post/<slug>/<id>/`, and the picker is plain links between them.
 */
export function AdaptivePost({ locale, slug, variants, active, children }: AdaptivePostProps) {
  const invalid = variants.find((variant) => !ID_PATTERN.test(variant.id) || variant.id === DEFAULT_VARIANT);
  if (invalid) {
    throw new Error(`Invalid adaptive post variant id "${invalid.id}": use lowercase letters, digits and dashes, and not "${DEFAULT_VARIANT}".`);
  }

  const versions = [
    ...variants.map((variant) => ({ id: variant.id, label: <>{variant.label}</>, path: `/post/${slug}/${variant.id}` })),
    { id: DEFAULT_VARIANT, label: <Trans>All</Trans>, path: `/post/${slug}` },
  ];

  return (
    <>
      <nav aria-labelledby="adaptive-post-heading" className="mb-10 rounded-lg border border-border bg-secondary/50 p-4">
        <p id="adaptive-post-heading" className="text-sm font-semibold"><Trans>Adaptive post</Trans></p>
        <p className="mt-1 text-sm text-muted-foreground">
          <Trans>Pick one and the text keeps only what applies to it.</Trans>
        </p>
        <ul className="mt-3 flex flex-wrap gap-1">
          {versions.map((version) => (
            <li key={version.id}>
              <Button asChild size="sm" variant={version.id === active ? 'default' : 'outline'}>
                <Link
                  href={localePath(locale, version.path)}
                  aria-current={version.id === active ? 'page' : undefined}
                  scroll={false}
                >
                  {version.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      {children}
    </>
  );
}

interface VariantProps {
  /** Space-separated variant ids, plus `all` for the version at the post's own URL. */
  for: string;
  /** Injected by `renderMdx`, never written in the MDX. */
  active?: string;
  children: React.ReactNode;
}

/** A block of an adaptive post, rendered only on the pages of the versions it lists. */
export function Variant({ for: ids, active = DEFAULT_VARIANT, children }: VariantProps) {
  return ids.split(/\s+/).includes(active) ? <>{children}</> : null;
}
