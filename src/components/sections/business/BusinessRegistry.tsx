import { ExternalLink } from 'lucide-react';

import type { BusinessRecord } from '@/lib/business';

export interface BusinessRegistryProps {
  title: string;
  note: string;
  records: BusinessRecord[];
  linkLabel: string;
  linkHref: string;
}

export function BusinessRegistry({
  title,
  note,
  records,
  linkLabel,
  linkHref,
}: BusinessRegistryProps) {
  return (
    <section id="record" className="scroll-mt-20 px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-[65ch] text-sm text-muted-foreground">{note}</p>

        <dl className="mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border">
          {records.map((record) => (
            <div
              key={record.label}
              className="grid gap-1 px-5 py-4 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-6"
            >
              <dt className="text-sm font-medium text-muted-foreground">{record.label}</dt>
              <dd className="min-w-0 space-y-1 wrap-break-word text-sm text-foreground">
                {record.value.split('\n').map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {linkLabel}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}
