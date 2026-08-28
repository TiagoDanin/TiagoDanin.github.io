import Link from 'next/link';
import type { FaqEvidence as FaqEvidenceItem } from '@/lib/faq';

interface FaqEvidenceProps {
  items: FaqEvidenceItem[];
}

export function FaqEvidence({ items }: FaqEvidenceProps) {
  if (items.length === 0) return null;

  return (
    <ol className="space-y-6">
      {items.map((item, index) => (
        <li key={`${item.date}-${index}`} className="relative pl-6 border-l border-border">
          <span className="absolute left-0 top-2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary" />
          <div className="space-y-1">
            <time className="text-sm text-muted-foreground">{item.date}</time>
            <h3 className="font-semibold text-foreground">
              {item.href ? (
                <Link href={item.href} className="hover:underline underline-offset-4">
                  {item.title}
                </Link>
              ) : (
                item.title
              )}
            </h3>
            <p className="text-muted-foreground">{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
