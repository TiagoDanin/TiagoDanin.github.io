import { Badge } from '@/components/ui/badge';

interface FaqAnswerProps {
  category: string;
  question: string;
  answer: string;
  as?: 'h1' | 'h2';
}

export function FaqAnswer({ category, question, answer, as = 'h1' }: FaqAnswerProps) {
  const Heading = as;

  return (
    <div className="space-y-4">
      <Badge variant="secondary">{category}</Badge>
      <Heading className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance wrap-break-word">
        {question}
      </Heading>
      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
        {answer}
      </p>
    </div>
  );
}
