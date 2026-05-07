import { Button } from "@/components/ui/button";
import { queryCollection } from 'nextjs-studio/server';

export function CallToAction() {
  const aboutData = queryCollection('about').one();
  const socialLinksData = queryCollection('sociallinks');
  const linkedIn = socialLinksData.find((l) => l.label === "LinkedIn");

  return (
    <section id="contact" className="relative py-20 overflow-x-clip bg-primary text-primary-foreground">
      {/* Blur effect circles */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-10 translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Hire me, or just say hi</h2>
          <p className="text-base sm:text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
            Whether you have a project in mind, want to talk tech, or just want to say hi, I read everything that lands in the inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            {linkedIn && (
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <a
                  href={linkedIn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Connect on LinkedIn
                </a>
              </Button>
            )}
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <a href={`mailto:${aboutData.email}`}>Send me an email</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
