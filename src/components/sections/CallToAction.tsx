import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section id="contact" className="relative py-20 overflow-hidden bg-primary text-primary-foreground">
      {/* Blur effect circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold tracking-tight">Let's Connect</h2>
          <p className="text-xl text-primary-foreground/80 leading-relaxed">
            Whether you have a project in mind, want to discuss tech, or just want to say hello,
            I'm always open to new conversations and opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              <a href="mailto:TiagoDanin@outlook.com">Send me an email</a>
            </Button>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <a
                href="https://linkedin.com/in/tiagodanin"
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}