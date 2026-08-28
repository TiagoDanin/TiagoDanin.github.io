'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Trans, useLingui } from '@lingui/react/macro';
import { Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Kept structural rather than imported from `@/lib/tags`: that module pulls in
 * `nextjs-studio/server`, which a client bundle cannot follow.
 */
export type TagCloudSource = 'post' | 'talk' | 'project' | 'timeline';

export interface TagCloudEntry {
  slug: string;
  name: string;
  total: number;
  counts: Record<TagCloudSource, number>;
}

export interface TagCloudProps {
  tags: TagCloudEntry[];
  /**
   * Locale-prefixed prefix every tag links under, `/br/tags` or `/blog/tags`.
   * A prop rather than a field per tag: the index runs to ~500 entries and each
   * one would ship a string the page can compute.
   */
  basePath: string;
  /**
   * Shows the source chips. Off for `/blog/tags`, where every tag is a post
   * tag and a row of filters that can only narrow to "posts" says nothing.
   */
  showSourceFilter?: boolean;
  className?: string;
}

const SOURCE_ORDER: TagCloudSource[] = ['post', 'talk', 'project', 'timeline'];

/**
 * The tag index, with a text filter and an optional source filter.
 *
 * The site carries several hundred tags once GitHub topics and npm keywords
 * count, which is well past the point where a plain wall of badges is
 * browsable. Filtering happens in the browser over a list the page already
 * rendered, so every tag is still in the HTML a crawler reads.
 */
export function TagCloud({ tags, basePath, showSourceFilter = false, className }: TagCloudProps) {
  const { t } = useLingui();
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<TagCloudSource | 'all'>('all');

  const sourceLabels: Record<TagCloudSource, string> = {
    post: t`Articles`,
    talk: t`Talks`,
    project: t`Projects`,
    timeline: t`Timeline`,
  };

  const availableSources = useMemo(
    () => SOURCE_ORDER.filter((s) => tags.some((tag) => tag.counts[s] > 0)),
    [tags]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return tags.filter((tag) => {
      if (source !== 'all' && tag.counts[source] === 0) return false;
      if (!needle) return true;
      return tag.name.toLowerCase().includes(needle) || tag.slug.includes(needle);
    });
  }, [tags, query, source]);

  const chip = 'rounded-full border px-3 py-1 text-sm transition-colors';

  return (
    <div className={cn('space-y-6', className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t`Filter tags`}
          aria-label={t`Filter tags`}
          className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-hidden transition-colors placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {showSourceFilter && availableSources.length > 1 && (
        <div role="group" aria-label={t`Filter by content type`} className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSource('all')}
            aria-pressed={source === 'all'}
            className={cn(
              chip,
              source === 'all'
                ? 'border-primary/30 bg-secondary text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground'
            )}
          >
            <Trans>All</Trans>
          </button>
          {availableSources.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSource(value)}
              aria-pressed={source === value}
              className={cn(
                chip,
                source === value
                  ? 'border-primary/30 bg-secondary text-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {sourceLabels[value]}
            </button>
          ))}
        </div>
      )}

      <p aria-live="polite" className="text-sm text-muted-foreground">
        {visible.length === 1 ? (
          <Trans>{visible.length} tag</Trans>
        ) : (
          <Trans>{visible.length} tags</Trans>
        )}
      </p>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          <Trans>No tag matches this filter.</Trans>
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((tag) => (
            <li key={tag.slug}>
              <Link
                href={`${basePath}/${tag.slug}`}
                className="block rounded-lg border border-border p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-secondary/30 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge variant="outline" className="max-w-full truncate text-sm">
                    {tag.name}
                  </Badge>
                  <span className="shrink-0 text-xs text-muted-foreground">{tag.total}</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {SOURCE_ORDER.filter((s) => tag.counts[s] > 0).map((s) => (
                    <span key={s}>
                      {tag.counts[s]} {sourceLabels[s].toLowerCase()}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
