import Link from 'next/link';
import { ArrowRight, Check, Package, Shield, Smartphone } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BusinessIcon, BusinessOffering } from '@/lib/business';

const ICONS: Record<BusinessIcon, typeof Smartphone> = {
  Smartphone,
  Package,
  Shield,
};

export interface BusinessOfferingsProps {
  title: string;
  note: string;
  offerings: BusinessOffering[];
  resolveHref: (href: string) => string;
}

export function BusinessOfferings({ title, note, offerings, resolveHref }: BusinessOfferingsProps) {
  return (
    <section id="offerings" className="px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{note}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {offerings.map((offering) => {
            const Icon = ICONS[offering.icon];

            return (
              <Card key={offering.title} className="flex flex-col shadow-sm">
                <CardHeader>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="mt-4 text-xl">{offering.title}</CardTitle>
                  <CardDescription className="text-base">{offering.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <ul className="mb-6 flex-1 space-y-3">
                    {offering.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={resolveHref(offering.href)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {offering.linkLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
