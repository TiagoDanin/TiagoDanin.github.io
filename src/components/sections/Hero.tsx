import { Button } from "@/components/ui/button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { queryCollection } from 'nextjs-studio';

export function Hero() {
  const aboutData = queryCollection('about').first()!;
  return (
    <section id="hero" className="relative pt-32 pb-20 md:py-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl opacity-20 sm:opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl opacity-20 sm:opacity-30 translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto relative px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-muted-foreground">{aboutData.greeting}</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                {aboutData.name}
                <span className="sr-only"> - {aboutData.seoDescription}</span>
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xl sm:text-2xl lg:text-3xl font-semibold" aria-hidden="true">
                {aboutData.roles.map((role, index) => (
                  <span key={role}>
                    {index > 0 && <div className="hidden sm:inline-block h-2 w-2 rounded-full bg-primary mr-4" />}
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              {aboutData.bio}
              <br />
              <br />
              {aboutData.bioExtra}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="min-h-[44px]">
                <Link href="#contact">
                  Get in touch <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="min-h-[44px]">
                <Link href="/projects">View my projects</Link>
              </Button>
            </div>
          </div>

          <div className="relative max-w-[300px] sm:max-w-[400px] mx-auto">
            <div className="aspect-square overflow-hidden rounded-full bg-primary/10">
              <Image
                src={aboutData.avatar}
                alt={`${aboutData.name} profile photo`}
                width={400}
                height={400}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="mt-8 sm:absolute sm:-bottom-16 sm:left-1/2 sm:-translate-x-1/2">
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
