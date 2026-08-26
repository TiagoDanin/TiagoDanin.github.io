import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Rocket, Zap, TrendingUp, ArrowRight, CheckCircle, Code, Sparkles, Target, Users } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { queryCollection } from "nextjs-studio/server";

export const metadata: Metadata = {
  title: "Game Development Services",
  description: "Indie and casual game development for mobile and web. Flutter + Bonfire engine, idle and arcade mechanics, monetization, and Google Play publishing.",
  keywords: [
    "game development", "indie game development", "mobile game developer",
    "Flutter game development", "Bonfire engine", "idle game development",
    "casual games", "Google Play game publishing", "game monetization",
    "desenvolvimento de jogos", "jogos indie", "jogos mobile",
  ],
  alternates: {
    canonical: "https://tiagodanin.com/game-development/",
  },
  openGraph: {
    title: "Game Development Services | Tiago Danin",
    description: "Indie and casual games for mobile and web. From prototype to Google Play, with idle, arcade, and survival mechanics.",
    url: "https://tiagodanin.com/game-development/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Development Services | Tiago Danin",
    description: "Indie and casual games for mobile and web. From prototype to Google Play.",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Game Development",
        "description": "Indie and casual game development for mobile and web with Flutter, Bonfire engine, monetization and live ops.",
        "provider": {
          "@type": "Person",
          "name": "Tiago Danin",
          "url": "https://tiagodanin.com/",
        },
        "areaServed": "Worldwide",
        "serviceType": "Game Development",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com/" },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://tiagodanin.com/services/" },
          { "@type": "ListItem", "position": 3, "name": "Game Development", "item": "https://tiagodanin.com/game-development/" },
        ],
      },
    ]),
  },
};

export default function GameDevelopmentPage() {
  const aboutData = queryCollection("about").one();
  const socialLinksData = queryCollection("sociallinks");
  const linkedIn = socialLinksData.find((l) => l.label === "LinkedIn");

  const expertiseAreas = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Idle & Clicker Games",
      description: "Long-session games built around prestige loops, offline progression, and addictive upgrade trees.",
      features: ["Prestige systems", "Offline earnings", "Upgrade economies", "Combo & boost mechanics"],
    },
    {
      icon: <Gamepad2 className="h-6 w-6" />,
      title: "Arcade & Survival",
      description: "Fast, replayable sessions with tight controls and progressive difficulty curves.",
      features: ["Bonfire game engine", "Hit detection & tuning", "Procedural difficulty", "Short-session loops"],
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Casual Mobile Games",
      description: "Polished casual experiences designed for retention, with onboarding and accessibility built in.",
      features: ["First-minute UX", "Tutorial design", "Vertical & landscape", "Cross-device support"],
    },
  ];

  const stack = [
    { icon: <Code className="h-6 w-6" />, title: "Flutter", description: "Single codebase shipping to Android, iOS, and web with native performance." },
    { icon: <Gamepad2 className="h-6 w-6" />, title: "Bonfire Engine", description: "RPG-style mechanics on top of Flutter, movement, collisions, AI without writing an engine from scratch." },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Monetization", description: "Ads, in-app purchases, double-or-nothing rewards, and prestige economies tuned to the game." },
    { icon: <Rocket className="h-6 w-6" />, title: "Publishing", description: "Google Play submission, store listing optimization, and post-launch updates." },
  ];

  const process = [
    { icon: <Target className="h-6 w-6" />, title: "Concept & Loop Design", description: "Define the core gameplay loop, target session length, and what keeps players coming back." },
    { icon: <Code className="h-6 w-6" />, title: "Prototype", description: "A playable prototype within weeks, proves the loop works before investing in art and content." },
    { icon: <Sparkles className="h-6 w-6" />, title: "Tuning & Polish", description: "Number tuning, game feel, animations, and onboarding. The difference between shipped and abandoned." },
    { icon: <Rocket className="h-6 w-6" />, title: "Launch & Live Ops", description: "Google Play release, analytics setup, and iteration based on player behavior." },
  ];

  const shippedGames = [
    { title: "Idle Elevator", tagline: "Idle clicker with prestige and offline earnings", href: "/app/idle-elevator" },
    { title: "The Slime Dungeon", tagline: "Survival arcade built with Flutter + Bonfire", href: "/app/the-slime-dungeon" },
    { title: "Emoji Memory Jetpack", tagline: "Memory game with Jetpack Compose, open source", href: "/app/emoji-memory-jetpack" },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Gamepad2 className="h-4 w-4 mr-2" />
              Game Development
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Indie Games, Shipped.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              From idle clickers to arcade survival, I design and ship casual games for mobile and web,
              with the loops, monetization, and polish that make players stay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#expertise">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Explore Expertise
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">
                  Start a Project
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="expertise" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Where I Focus</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Genres where small teams can ship something polished, fast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {expertiseAreas.map((area) => (
              <Card key={area.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {area.icon}
                    </div>
                    <CardTitle className="text-xl">{area.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {area.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {area.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Stack & Tooling</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Pragmatic tools chosen to ship, not to impress on a CV.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stack.map((item) => (
              <Card key={item.title} className="text-center">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg text-primary w-fit mx-auto">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">From Idea to Google Play</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A short, opinionated process focused on validating the loop early.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step) => (
              <Card key={step.title} className="text-center">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg text-primary w-fit mx-auto">
                    {step.icon}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Shipped Games</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real games published on Google Play, not just demos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippedGames.map((game) => (
              <Card key={game.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">{game.title}</CardTitle>
                  <CardDescription className="text-base">{game.tagline}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={game.href}>
                      View Project <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Have a Game Idea?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you have a full concept or just a loop in your head, let&apos;s talk about how to ship it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {linkedIn && (
                <Button size="lg" asChild>
                  <a href={linkedIn.url} target="_blank" rel="noopener noreferrer">
                    <Users className="h-5 w-5 mr-2" />
                    Connect on LinkedIn
                  </a>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <a href={`mailto:${aboutData.email}`}>
                  Send an Email
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
