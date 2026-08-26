import { Card, CardContent } from '@/components/ui/card';
import type { FaqFact } from '@/lib/faq';

interface FaqProfileProps {
  facts: FaqFact[];
}

/**
 * The `profile` layout: an identity card for "who is" questions.
 *
 * A description list rather than a table, because these are attributes of one
 * subject and not a grid. `dt`/`dd` also survives being read out of order by a
 * screen reader, which a two column div does not.
 */
export function FaqProfile({ facts }: FaqProfileProps) {
  if (facts.length === 0) return null;

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {facts.map((fact) => (
            <div key={fact.label} className="space-y-1">
              <dt className="text-sm text-muted-foreground">{fact.label}</dt>
              <dd className="font-medium text-foreground">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
