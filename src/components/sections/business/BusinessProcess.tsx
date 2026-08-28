import type { BusinessStep } from '@/lib/business';

export interface BusinessProcessProps {
  title: string;
  note: string;
  steps: BusinessStep[];
}

export function BusinessProcess({ title, note, steps }: BusinessProcessProps) {
  return (
    <section className="relative overflow-hidden px-4 py-16 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-purple-100 opacity-25 blur-3xl"
      />

      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">{note}</p>
        </div>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-foreground pt-5">
              <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
