import { Badge } from '@/components/ui/badge';

interface FaqAnswerProps {
  category: string;
  question: string;
  answer: string;
  /** `h1` on a detail page, `h2` when the block sits inside a longer page. */
  as?: 'h1' | 'h2';
}

/**
 * The top of every FAQ answer, identical across all five layouts.
 *
 * The question is the heading and the answer is the first paragraph, in that
 * order and with nothing between them. Answer engines lift the first passage
 * under a matching heading, so anything placed here (a breadcrumb, an intro, a
 * "let's look at" sentence) is what gets quoted instead of the answer.
 *
 * The answer is set larger than the body text on purpose: it is the page's
 * conclusion, not its introduction.
 */
export function FaqAnswer({ category, question, answer, as = 'h1' }: FaqAnswerProps) {
  const Heading = as;

  return (
    <div className="space-y-4">
      <Badge variant="secondary">{category}</Badge>
      <Heading className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
        {question}
      </Heading>
      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">{answer}</p>
    </div>
  );
}
