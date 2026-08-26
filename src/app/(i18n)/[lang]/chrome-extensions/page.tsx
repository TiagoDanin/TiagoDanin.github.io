import type { Metadata } from "next";
import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import type { I18n } from "@lingui/core";
import { queryCollection } from "nextjs-studio/server";
import { Chrome, Puzzle, Shield, Zap, CheckCircle, Code, Rocket, Target, Users, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, markdownAlternate, openGraphLocale, pageUrl } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/chrome-extensions'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`Chrome Extensions Developer`,
    description: t(
      i18n
    )`Custom Chrome extensions built with Manifest V3, TypeScript, and modern web tech. From productivity tools to enterprise integrations, published on the Chrome Web Store.`,
    keywords: [
      "chrome extension developer", "chrome extensions for hire", "manifest v3 developer",
      "browser extension development", "chrome web store publishing", "typescript extensions",
      "chrome extension consulting", "edge firefox extension", "browser extension freelance",
      "desenvolvedor chrome extension", "extensoes chrome",
    ],
    alternates: {
      ...localeAlternates(locale, '/chrome-extensions'),
      types: markdownAlternate('/chrome-extensions'),
    },
    openGraph: {
      title: t(i18n)`Chrome Extensions Developer | Tiago Danin`,
      description: t(i18n)`Custom Chrome extensions with Manifest V3, TypeScript, and Chrome Web Store publishing.`,
      url: pageUrl(locale, '/chrome-extensions'),
      type: "website",
      ...openGraphLocale(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: t(i18n)`Chrome Extensions Developer | Tiago Danin`,
      description: t(i18n)`Custom Chrome extensions with Manifest V3, TypeScript, and Chrome Web Store publishing.`,
    },
    other: {
      "application/ld+json": JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": t(i18n)`Chrome Extensions Development`,
          "description": t(
            i18n
          )`Custom browser extensions for Chrome, Edge and Firefox using Manifest V3, TypeScript, and modern web frameworks.`,
          "provider": {
            "@type": "Person",
            "name": "Tiago Danin",
            "url": pageUrl(locale, '/'),
          },
          "areaServed": "Worldwide",
          "serviceType": t(i18n)`Browser Extension Development`,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
            { "@type": "ListItem", "position": 2, "name": t(i18n)`Services`, "item": pageUrl(locale, '/services') },
            { "@type": "ListItem", "position": 3, "name": t(i18n)`Chrome Extensions`, "item": pageUrl(locale, '/chrome-extensions') },
          ],
        },
      ]),
    },
  };
}

/**
 * Built per render, not at module level.
 *
 * A locale-dependent string evaluated once when the module loads is frozen in
 * whichever language happened to be active.
 */
function getExpertiseAreas(i18n: I18n) {
  return [
    {
      icon: <Zap className="h-6 w-6" />,
      title: t(i18n)`Productivity Tools`,
      description: t(i18n)`Extensions that automate repetitive workflows, augment existing web apps, and save hours per week.`,
      features: [
        t(i18n)`Workflow automation`,
        t(i18n)`Web app augmentation`,
        t(i18n)`Keyboard shortcuts`,
        t(i18n)`Custom UI overlays`,
      ],
    },
    {
      icon: <Puzzle className="h-6 w-6" />,
      title: t(i18n)`API & SaaS Integrations`,
      description: t(i18n)`Bridge browser sessions with external APIs, dashboards, and internal tools, securely and at scale.`,
      features: [
        t(i18n)`OAuth & API auth`,
        t(i18n)`Background sync`,
        t(i18n)`Cross-origin requests`,
        t(i18n)`Real-time messaging`,
      ],
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t(i18n)`Privacy & Security`,
      description: t(i18n)`Content blockers, header rewriting, and security-focused extensions built with least-privilege permissions.`,
      features: [
        t(i18n)`Manifest V3 best practices`,
        t(i18n)`DeclarativeNetRequest`,
        t(i18n)`Content Security Policy`,
        t(i18n)`Permission auditing`,
      ],
    },
  ];
}

function getStack(i18n: I18n) {
  return [
    { icon: <Code className="h-6 w-6" />, title: t(i18n)`Manifest V3`, description: t(i18n)`Service workers, declarativeNetRequest, and modern background scripts, built the way Chrome wants.` },
    { icon: <Code className="h-6 w-6" />, title: t(i18n)`TypeScript + React`, description: t(i18n)`Type-safe extensions with React-based popups and options pages, bundled with Vite or Webpack.` },
    { icon: <Globe className="h-6 w-6" />, title: t(i18n)`Cross-Browser`, description: t(i18n)`Same codebase shipping to Chrome, Edge, Brave, and (with polyfills) Firefox.` },
    { icon: <Rocket className="h-6 w-6" />, title: t(i18n)`Chrome Web Store`, description: t(i18n)`Listing, screenshots, review prep, and post-launch updates, including handling Google review pushback.` },
  ];
}

function getProcess(i18n: I18n) {
  return [
    { icon: <Target className="h-6 w-6" />, title: t(i18n)`Scope & Permissions`, description: t(i18n)`Decide what the extension actually needs, minimal permissions reduce review friction and earn user trust.` },
    { icon: <Code className="h-6 w-6" />, title: t(i18n)`Prototype`, description: t(i18n)`A working extension loaded unpacked within days. Validate the UX before polishing.` },
    { icon: <Shield className="h-6 w-6" />, title: t(i18n)`Hardening`, description: t(i18n)`Manifest V3 compliance, CSP, sandboxed iframes, and a clean permission story for review.` },
    { icon: <Rocket className="h-6 w-6" />, title: t(i18n)`Publish & Iterate`, description: t(i18n)`Chrome Web Store submission, listing optimization, and updates based on real install feedback.` },
  ];
}

function getUseCases(i18n: I18n) {
  return [
    { title: t(i18n)`Internal Tools`, description: t(i18n)`Extensions distributed via enterprise policy or private listing, no Web Store dance required.` },
    { title: t(i18n)`Public Products`, description: t(i18n)`Free or paid extensions published on the Chrome Web Store, with onboarding and analytics built in.` },
    { title: t(i18n)`Migration to Manifest V3`, description: t(i18n)`Bring legacy MV2 extensions into compliance before Chrome removes them entirely.` },
  ];
}

export default async function ChromeExtensionsPage({ params }: PageProps<'/[lang]/chrome-extensions'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const aboutData = queryCollection("about").locale(locale).one();
  const socialLinksData = queryCollection("sociallinks");
  const linkedIn = socialLinksData.find((l) => l.label === "LinkedIn");

  const expertiseAreas = getExpertiseAreas(i18n);
  const stack = getStack(i18n);
  const process = getProcess(i18n);
  const useCases = getUseCases(i18n);

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Chrome className="h-4 w-4 mr-2" />
              <Trans>Chrome Extensions</Trans>
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              <Trans>Browser Extensions, Done Right.</Trans>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              <Trans>Custom Chrome extensions built with Manifest V3, TypeScript, and a clean permission story,
              from productivity tools to enterprise integrations.</Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#expertise">
                  <Puzzle className="h-5 w-5 mr-2" />
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
              <Trans>Extensions that solve real workflow problems, not just toy demos.</Trans>
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
              <Trans>Modern, maintainable, and aligned with Google&apos;s direction.</Trans>
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
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>From Idea to Web Store</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>An opinionated process focused on getting through review the first time.</Trans>
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
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Common Use Cases</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Whether internal or public, the engineering bar is the same.</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase) => (
              <Card key={useCase.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  <CardDescription className="text-base">{useCase.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Have an Extension Idea?</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>From a one-off internal tool to a public Chrome Web Store launch, let&apos;s talk about how to ship it.</Trans>
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
