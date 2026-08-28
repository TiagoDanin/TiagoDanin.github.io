import type { FaqStep } from '@/lib/faq';

interface FaqStepsProps {
  steps: FaqStep[];
}

export function FaqSteps({ steps }: FaqStepsProps) {
  if (steps.length === 0) return null;

  return (
    <ol className="space-y-6">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
          >
            {index + 1}
          </span>
          <div className="space-y-1 pt-1">
            <h3 className="font-semibold text-foreground">{step.title}</h3>
            <p className="text-muted-foreground">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
