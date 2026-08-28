import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FaqStep } from '@/lib/faq';

interface FaqServiceProps {
  offering: FaqStep[];
}

export function FaqService({ offering }: FaqServiceProps) {
  if (offering.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {offering.map((item) => (
        <Card key={item.title} className="shadow-xs">
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
