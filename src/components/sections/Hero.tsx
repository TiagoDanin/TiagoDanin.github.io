import { Button } from "@/components/ui/button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:py-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl opacity-20 sm:opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl opacity-20 sm:opacity-30 translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto relative px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-muted-foreground">Hi I am</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Tiago Danin
                <span className="sr-only"> - Expert Mobile & Full Stack Developer, Bug Hunter</span>
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xl sm:text-2xl lg:text-3xl font-semibold" aria-hidden="true">
                <span>Mobile Developer</span>
                <div className="hidden sm:block h-2 w-2 rounded-full bg-primary" />
                <span>Bug Hunter</span>
              </div>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              I'm a Mobile Developer with expertise in Java, Kotlin, Obj-C, Swift, React Native, and Flutter, also experienced in front-end, back-end, and desktop development for macOS & Linux. Passionate about open source, automation, and solving real-world problems, always looking for new challenges. Currently diving into Digital Marketing to expand my knowledge beyond coding.
              <br />
              <br />
              Outside of work, I'm a runner, dancer, and music lover—always seeking new ways to grow, challenge myself, and enjoy life. Let's build something amazing together<span aria-hidden="true">! 🚀</span>
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
                src="https://avatars.githubusercontent.com/u/5731176?v=4"
                alt="Tiago Danin profile photo"
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