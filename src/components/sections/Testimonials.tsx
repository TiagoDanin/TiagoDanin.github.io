import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Github, Mic } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Trophy,
  Github,
  Mic,
};

export interface TestimonialItem {
  /** Also the React key, so it must be unique in the list. */
  name: string;
  role: string;
  company: string;
  /**
   * Body copy. May contain `{token}` placeholders replaced from `tokens` at
   * render time, which is how counts stay accurate without being written into
   * the CMS by hand.
   */
  quote: string;
  /** Icon name resolved against the bundled set: Trophy, Github, Mic. */
  icon?: string;
}

export interface TestimonialsProps {
  testimonials: TestimonialItem[];
  /**
   * Values substituted into `{token}` placeholders. An unknown token stays
   * visible as `{name}` rather than being blanked, so a typo in the CMS shows
   * on the page instead of producing a broken sentence.
   */
  tokens?: Record<string, string>;
}

/**
 * The three-up recognition grid on the home page.
 *
 * Data comes from the page via `getTestimonialsData()` in `@/lib/sections`,
 * which computes the counts behind the `{token}` placeholders.
 */
export function Testimonials({ testimonials, tokens = {} }: TestimonialsProps) {
  const fillTokens = (text: string) =>
    text.replace(/\{(\w+)\}/g, (_, key) => tokens[key] ?? `{${key}}`);

  return (
    <section id="testimonials" className="relative py-16 sm:py-20 bg-secondary/30 overflow-x-clip">
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-100 rounded-full blur-3xl opacity-20 sm:opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-100 rounded-full blur-3xl opacity-20 sm:opacity-30 translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Recognition</h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Wins, open source, and stages.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => {
            const Icon = testimonial.icon ? iconMap[testimonial.icon] : null;
            return (
              <Card key={testimonial.name} className="bg-card">
                <CardContent className="p-6 space-y-4">
                  {Icon && (
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                  )}
                  <p className="text-sm sm:text-base text-foreground leading-relaxed">
                    {fillTokens(testimonial.quote)}
                  </p>
                  <p className="text-xs text-muted-foreground pt-2">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
