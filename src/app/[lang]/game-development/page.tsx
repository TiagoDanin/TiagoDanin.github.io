import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Rocket, Zap, TrendingUp, ArrowRight, CheckCircle, Code, Sparkles, Target, Users } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import type { I18n } from "@lingui/core";
import { queryCollection } from "nextjs-studio/server";

import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, openGraphDefaults, pageUrl, twitterDefaults } from "@/lib/i18n/seo";
import { localePath } from "@/lib/i18n/locales";

export async function generateMetadata({ params }: PageProps<'/[lang]/game-development'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`Game Development Services`,
    description: t(
      i18n
    )`Indie and casual game development for mobile and web. Flutter + Bonfire engine, idle and arcade mechanics, monetization, and Google Play publishing.`,
    keywords: [
      "game development", "indie game development", "mobile game developer",
      "Flutter game development", "Bonfire engine", "idle game development",
      "casual games", "Google Play game publishing", "game monetization",
      "desenvolvimento de jogos", "jogos indie", "jogos mobile",
    ],
    // No `text/markdown` alternate: `/game-development` is not in
    // `contents/llms`, so `generateLlms.ts` never writes the mirror. Announcing
    // one would link at a 404.
    alternates: localeAlternates(locale, '/game-development'),
    openGraph: {
      title: t(i18n)`Game Development Services | Tiago Danin`,
      description: t(
        i18n
      )`Indie and casual games for mobile and web. From prototype to Google Play, with idle, arcade, and survival mechanics.`,
      url: pageUrl(locale, '/game-development'),
      type: "website",
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: t(i18n)`Game Development Services | Tiago Danin`,
      description: t(i18n)`Indie and casual games for mobile and web. From prototype to Google Play.`,
    },
    other: {
      "application/ld+json": JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": t(i18n)`Game Development`,
          "description": t(
            i18n
          )`Indie and casual game development for mobile and web with Flutter, Bonfire engine, monetization and live ops.`,
          "provider": {
            "@type": "Person",
            "name": "Tiago Danin",
            "url": pageUrl(locale, '/'),
          },
          "areaServed": "Worldwide",
          "serviceType": "Game Development",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
            { "@type": "ListItem", "position": 2, "name": t(i18n)`Services`, "item": pageUrl(locale, '/services') },
            { "@type": "ListItem", "position": 3, "name": t(i18n)`Game Development`, "item": pageUrl(locale, '/game-development') },
          ],
        },
      ]),
    },
  };
}

function getExpertiseAreas(i18n: I18n) {
  return [
    {
      icon: <Zap className="h-6 w-6" />,
      title: t(i18n)`Idle & Clicker Games`,
      description: t(i18n)`Long-session games built around prestige loops, offline progression, and addictive upgrade trees.`,
      features: [
        t(i18n)`Prestige systems`,
        t(i18n)`Offline earnings`,
        t(i18n)`Upgrade economies`,
        t(i18n)`Combo & boost mechanics`,
      ],
    },
    {
      icon: <Gamepad2 className="h-6 w-6" />,
      title: t(i18n)`Arcade & Survival`,
      description: t(i18n)`Fast, replayable sessions with tight controls and progressive difficulty curves.`,
      features: [
        t(i18n)`Bonfire game engine`,
        t(i18n)`Hit detection & tuning`,
        t(i18n)`Procedural difficulty`,
        t(i18n)`Short-session loops`,
      ],
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: t(i18n)`Casual Mobile Games`,
      description: t(i18n)`Polished casual experiences designed for retention, with onboarding and accessibility built in.`,
      features: [
        t(i18n)`First-minute UX`,
        t(i18n)`Tutorial design`,
        t(i18n)`Vertical & landscape`,
        t(i18n)`Cross-device support`,
      ],
    },
  ];
}

function getStack(i18n: I18n) {
  return [
    { icon: <Code className="h-6 w-6" />, title: t(i18n)`Flutter`, description: t(i18n)`Single codebase shipping to Android, iOS, and web with native performance.` },
    { icon: <Gamepad2 className="h-6 w-6" />, title: t(i18n)`Bonfire Engine`, description: t(i18n)`RPG-style mechanics on top of Flutter, movement, collisions, AI without writing an engine from scratch.` },
    { icon: <TrendingUp className="h-6 w-6" />, title: t(i18n)`Monetization`, description: t(i18n)`Ads, in-app purchases, double-or-nothing rewards, and prestige economies tuned to the game.` },
    { icon: <Rocket className="h-6 w-6" />, title: t(i18n)`Publishing`, description: t(i18n)`Google Play submission, store listing optimization, and post-launch updates.` },
  ];
}

function getProcess(i18n: I18n) {
  return [
    { icon: <Target className="h-6 w-6" />, title: t(i18n)`Concept & Loop Design`, description: t(i18n)`Define the core gameplay loop, target session length, and what keeps players coming back.` },
    { icon: <Code className="h-6 w-6" />, title: t(i18n)`Prototype`, description: t(i18n)`A playable prototype within weeks, proves the loop works before investing in art and content.` },
    { icon: <Sparkles className="h-6 w-6" />, title: t(i18n)`Tuning & Polish`, description: t(i18n)`Number tuning, game feel, animations, and onboarding. The difference between shipped and abandoned.` },
    { icon: <Rocket className="h-6 w-6" />, title: t(i18n)`Launch & Live Ops`, description: t(i18n)`Google Play release, analytics setup, and iteration based on player behavior.` },
  ];
}

/** Game titles stay untranslated: they are the published store names. */
function getShippedGames(i18n: I18n) {
  return [
    { title: "Idle Elevator", tagline: t(i18n)`Idle clicker with prestige and offline earnings`, href: "/app/idle-elevator" },
    { title: "The Slime Dungeon", tagline: t(i18n)`Survival arcade built with Flutter + Bonfire`, href: "/app/the-slime-dungeon" },
    { title: "Emoji Memory Jetpack", tagline: t(i18n)`Memory game with Jetpack Compose, open source`, href: "/app/emoji-memory-jetpack" },
  ];
}

export default async function GameDevelopmentPage({ params }: PageProps<'/[lang]/game-development'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const aboutData = queryCollection("about").locale(locale).one();
  const socialLinksData = queryCollection("sociallinks");
  const linkedIn = socialLinksData.find((l) => l.label === "LinkedIn");

  const expertiseAreas = getExpertiseAreas(i18n);
  const stack = getStack(i18n);
  const process = getProcess(i18n);
  const shippedGames = getShippedGames(i18n);

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/20" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Gamepad2 className="h-4 w-4 mr-2" />
              <Trans>Game Development</Trans>
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              <Trans>Indie Games, Shipped.</Trans>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              <Trans>From idle clickers to arcade survival, I design and ship casual games for mobile and web,
              with the loops, monetization, and polish that make players stay.</Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#expertise">
                  <Sparkles className="h-5 w-5 mr-2" />
                  <Trans>Explore Expertise</Trans>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">
                  <Trans>Start a Project</Trans>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="expertise" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Where I Focus</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Genres where small teams can ship something polished, fast.</Trans>
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
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Stack & Tooling</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Pragmatic tools chosen to ship, not to impress on a CV.</Trans>
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
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>From Idea to Google Play</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>A short, opinionated process focused on validating the loop early.</Trans>
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
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Shipped Games</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Real games published on Google Play, not just demos.</Trans>
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
                    <Link href={localePath(locale, game.href)}>
                      <Trans>View Project</Trans> <ArrowRight className="h-4 w-4 ml-2" />
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
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Have a Game Idea?</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Whether you have a full concept or just a loop in your head, let&apos;s talk about how to ship it.</Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {linkedIn && (
                <Button size="lg" asChild>
                  <a href={linkedIn.url} target="_blank" rel="noopener noreferrer">
                    <Users className="h-5 w-5 mr-2" />
                    <Trans>Connect on LinkedIn</Trans>
                  </a>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <a href={`mailto:${aboutData.email}`}>
                  <Trans>Send an Email</Trans>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
