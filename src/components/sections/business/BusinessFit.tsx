import { Check, X } from 'lucide-react';

import type { BusinessStep } from '@/lib/business';

export interface BusinessFitProps {
  title: string;
  note: string;
  items: BusinessStep[];
}

function capitalize(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

function splitLabel(title: string): { lead: string; rest: string } {
  const at = title.indexOf(':');
  if (at === -1) return { lead: '', rest: title };
  return { lead: title.slice(0, at).trim(), rest: title.slice(at + 1).trim() };
}

export function BusinessFit({ title, note, items }: BusinessFitProps) {
  const negative = (item: BusinessStep) =>
    /^(n[aã]o|not)\b/i.test(splitLabel(item.title).lead || item.title);

  const works = items.filter((item) => !negative(item));
  const doesNot = items.filter(negative);

  const column = (entries: BusinessStep[], kind: 'works' | 'not') => (
    <ul className="space-y-6">
      {entries.map((entry) => {
        const { lead, rest } = splitLabel(entry.title);
        const Icon = kind === 'works' ? Check : X;

        return (
          <li key={entry.title} className="flex gap-3">
            <Icon
              aria-hidden="true"
              className={
                kind === 'works'
                  ? 'mt-1 h-4 w-4 shrink-0 text-foreground'
                  : 'mt-1 h-4 w-4 shrink-0 text-muted-foreground'
              }
            />
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground">
                {lead && <span className="sr-only">{lead}: </span>}
                {capitalize(rest)}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{entry.detail}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <section className="bg-secondary/30 px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{note}</p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          {column(works, 'works')}
          {column(doesNot, 'not')}
        </div>
      </div>
    </section>
  );
}
