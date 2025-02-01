import { Button } from "@/components/ui/button";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Hero() {
  return (
    <section className="container mx-auto py-20">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">Hi I am</p>
            <h1 className="text-5xl font-bold">Tiago Danin</h1>
            <div className="flex items-center gap-4 text-3xl font-semibold">
              <span>Mobile Developer</span>
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Bug Hunter</span>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground">
            I'm a Mobile Developer with expertise in Java, Kotlin, Obj-C, Swift, React Native, and Flutter, also experienced in front-end, back-end, and desktop development for macOS & Linux. Passionate about open source, automation, and solving real-world problems, always looking for new challenges. Currently diving into Digital Marketing to expand my knowledge beyond coding.
            <br />
            Outside of work, I'm a runner, dancer, and music lover—always seeking new ways to grow, challenge myself, and enjoy life. Let's build something amazing together! 🚀
          </p>
          
          <Button size="lg" asChild>
            <a
              href="https://linkedin.com/in/tiagodanin"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact me
            </a>
          </Button>
        </div>
        
        <div className="relative max-w-[400px] mx-auto">
          <div className="aspect-square overflow-hidden rounded-full bg-primary/10">
            <img
              src="https://avatars.githubusercontent.com/u/5731176?v=4"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
}