import { Card, CardContent } from "@/components/ui/card";
import { Award, Quote } from "lucide-react";
import { queryCollection } from 'nextjs-studio/server';

export function Testimonials() {
  const testimonials = queryCollection('testimonials');

  return (
    <section id="testimonials" className="relative py-16 sm:py-20 bg-secondary/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-100 rounded-full blur-3xl opacity-20 sm:opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-100 rounded-full blur-3xl opacity-20 sm:opacity-30 translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Achievements & Recognition</h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Highlights from my journey building software and contributing to the community.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="bg-card">
              <CardContent className="p-6 space-y-4">
                <Quote className="h-8 w-8 text-primary/30" />
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role} &middot; {testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
