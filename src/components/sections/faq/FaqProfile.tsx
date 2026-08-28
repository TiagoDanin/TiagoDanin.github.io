import { Card, CardContent } from '@/components/ui/card';
import type { FaqFact } from '@/lib/faq';

interface FaqProfileProps {
  facts: FaqFact[];
}

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
