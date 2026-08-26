import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FaqStep } from '@/lib/faq';

interface FaqServiceProps {
  offering: FaqStep[];
}

/**
 * The `service` layout: what someone takes on, for "who do I call for" questions.
 *
 * Cards rather than a list because each item is a separate piece of scope that a
 * reader compares against their own need, and because the entries here are often
 * as much about limits as about capability.
 *
 * No hover transform on the card: DESIGN.md allows it on small badges and icons
 * only. These are not links, so they get no hover affordance at all.
 */
export function FaqService({ offering }: FaqServiceProps) {
  if (offering.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {offering.map((item) => (
        <Card key={item.title} className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{item.detail}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
