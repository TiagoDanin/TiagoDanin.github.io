import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import type { BusinessProof as BusinessProofItem } from '@/lib/business';

export interface BusinessProofProps {
  title: string;
  note: string;
  trackTitle: string;
  track: string;
  items: BusinessProofItem[];
  resolveHref: (href: string) => string;
}

export function BusinessProof({
  title,
  note,
  trackTitle,
  track,
  items,
  resolveHref,
}: BusinessProofProps) {
  return (
    <section className="bg-secondary/30 px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="lg:pt-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
              {trackTitle}
            </h2>
            <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-muted-foreground md:text-lg">
              {track}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">{note}</p>

            <ul className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={resolveHref(item.href)}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                  >
                    <span className="w-16 shrink-0 text-2xl font-bold tabular-nums text-foreground">
                      {item.value}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-foreground">{item.label}</span>
                      <span className="block text-sm text-muted-foreground">{item.detail}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
