import Link from 'next/link';
import { ArrowDown, Mail } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface BusinessHeroProps {
  eyebrow: string;
  headline: string;
  lede: string;
  chips: string[];
  email: string;
  emailLabel: string;
  recordLabel: string;
}

export function BusinessHero({
  eyebrow,
  headline,
  lede,
  chips,
  email,
  emailLabel,
  recordLabel,
}: BusinessHeroProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-16 md:pb-24 md:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-136 w-136 rounded-full bg-green-100 opacity-60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-24 h-152 w-152 rounded-full bg-purple-100 opacity-50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/3 h-104 w-104 rounded-full bg-yellow-100 opacity-40 blur-3xl"
      />

      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="font-normal">
              {eyebrow}
            </Badge>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
              {headline}
            </h1>

          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
              {lede}
            </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href={`mailto:${email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  {emailLabel}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#record">
                  {recordLabel}
                  <ArrowDown className="ml-2 h-4 w-4" />
                </Link>
              </Button>
          </div>
        </div>

        {chips.length > 0 && (
          <ul className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
            {chips.map((chip) => (
              <li key={chip} className="font-medium">
                {chip}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
