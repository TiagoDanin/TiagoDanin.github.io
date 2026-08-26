import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Code, Layout, Search, CheckCircle, Rocket, Target, Users, Sparkles, Gauge, Server, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import type { I18n } from "@lingui/core";
import { queryCollection } from "nextjs-studio/server";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, openGraphLocale, pageUrl } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/web-development'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`Website Development Services`,
    description: t(
      i18n
    )`Modern websites built with Next.js, React, and TypeScript. Landing pages, marketing sites, e-commerce, and web apps with SEO, performance, and accessibility built in.`,
    keywords: [
      "website development", "next.js developer", "react developer for hire",
      "landing page development", "marketing website", "web app development",
      "typescript developer", "tailwind developer", "seo website",
      "desenvolvimento de site", "criar site", "site profissional",
    ],
    // No `types` here: scripts/generateLlms.ts writes no /web-development.md,
    // and a page must not announce a mirror that was never generated.
    alternates: localeAlternates(locale, '/web-development'),
    openGraph: {
      title: t(i18n)`Website Development | Tiago Danin`,
      description: t(i18n)`Modern websites with Next.js, React, and TypeScript, fast, accessible, and SEO-ready.`,
      url: pageUrl(locale, '/web-development'),
      type: "website",
      ...openGraphLocale(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: t(i18n)`Website Development | Tiago Danin`,
      description: t(i18n)`Modern websites with Next.js, React, and TypeScript, fast, accessible, and SEO-ready.`,
    },
    other: {
      "application/ld+json": JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": t(i18n)`Website Development`,
          "description": t(i18n)`Modern web development with Next.js, React, and TypeScript, landing pages, marketing sites, e-commerce, and web apps.`,
          "provider": {
            "@type": "Person",
            "name": "Tiago Danin",
            "url": pageUrl(locale, '/'),
          },
          "areaServed": "Worldwide",
          "serviceType": t(i18n)`Web Development`,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
            { "@type": "ListItem", "position": 2, "name": t(i18n)`Services`, "item": pageUrl(locale, '/services') },
            { "@type": "ListItem", "position": 3, "name": t(i18n)`Web Development`, "item": pageUrl(locale, '/web-development') },
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
 * whichever language happened to be active, which is the failure Lingui warns
 * about for static rendering.
 */
function getExpertiseAreas(i18n: I18n) {
  return [
    {
      icon: <Layout className="h-6 w-6" />,
      title: t(i18n)`Landing & Marketing Sites`,
      description: t(i18n)`Conversion-focused sites that load fast, rank well, and look great on every device, from solo founders to scale-ups.`,
      features: [
        t(i18n)`Static export & edge hosting`,
        t(i18n)`CMS-driven content`,
        t(i18n)`A/B test ready`,
        t(i18n)`Analytics & conversion tracking`,
      ],
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: t(i18n)`Web Apps & Dashboards`,
      description: t(i18n)`Full-stack web apps with auth, databases, and real-time features, built on the Next.js App Router.`,
      features: [
        t(i18n)`Server components & actions`,
        t(i18n)`Auth (NextAuth, Clerk, custom)`,
        t(i18n)`Postgres, SQLite, Cloudflare D1`,
        t(i18n)`Real-time with WebSockets`,
      ],
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: t(i18n)`E-commerce & SaaS`,
      description: t(i18n)`Storefronts and subscription products with Stripe, headless CMS, and the full checkout-to-fulfillment loop.`,
      features: [
        t(i18n)`Stripe & subscription billing`,
        t(i18n)`Headless CMS integration`,
        t(i18n)`Shopify, Medusa, custom backends`,
        t(i18n)`Webhooks & order management`,
      ],
    },
  ];
}

function getStack(i18n: I18n) {
  return [
    { icon: <Code className="h-6 w-6" />, title: t(i18n)`Next.js + React`, description: t(i18n)`App Router, server components, and static export, the framework I default to for almost every site.` },
    { icon: <Sparkles className="h-6 w-6" />, title: t(i18n)`TypeScript + Tailwind`, description: t(i18n)`Type-safe by default, styled with Tailwind and shadcn/ui for fast, consistent design systems.` },
    { icon: <Server className="h-6 w-6" />, title: t(i18n)`Edge Hosting`, description: t(i18n)`Cloudflare Pages, Vercel, and GitHub Pages, picked based on cost, dynamic needs, and traffic profile.` },
    { icon: <Search className="h-6 w-6" />, title: t(i18n)`SEO & Performance`, description: t(i18n)`Core Web Vitals, structured data, sitemaps, and OG tags, built in, not bolted on.` },
  ];
}

function getProcess(i18n: I18n) {
  return [
    { icon: <Target className="h-6 w-6" />, title: t(i18n)`Goals & Scope`, description: t(i18n)`Define what the site is for: leads, sales, content, app. Scope follows the goal, not the other way around.` },
    { icon: <Layout className="h-6 w-6" />, title: t(i18n)`Design & Prototype`, description: t(i18n)`Wireframes and a working prototype within a week. Validate the layout before investing in polish.` },
    { icon: <Code className="h-6 w-6" />, title: t(i18n)`Build`, description: t(i18n)`Component-driven development with TypeScript, Tailwind, and shadcn/ui. Clean code, easy to extend.` },
    { icon: <Rocket className="h-6 w-6" />, title: t(i18n)`Launch & Iterate`, description: t(i18n)`Deploy with monitoring, analytics, and SEO instrumentation. Iterate based on real traffic.` },
  ];
}

function getFeatureHighlights(i18n: I18n) {
  return [
    {
      icon: <Gauge className="h-12 w-12 text-primary mx-auto" />,
      title: t(i18n)`Built for Speed`,
      description: t(i18n)`Lighthouse 90+ targets, image optimization, edge caching, and lazy loading, fast on real devices, not just in the lab.`,
    },
    {
      icon: <Search className="h-12 w-12 text-primary mx-auto" />,
      title: t(i18n)`SEO from Day One`,
      description: t(i18n)`Structured data, sitemaps, canonical URLs, OG/Twitter cards, and semantic HTML baked into every page.`,
    },
    {
      icon: <Globe className="h-12 w-12 text-primary mx-auto" />,
      title: t(i18n)`Accessibility & i18n`,
      description: t(i18n)`WCAG-conscious markup, keyboard navigation, and multi-language support when you need to reach global users.`,
    },
  ];
}

export default async function WebDevelopmentPage({ params }: PageProps<'/[lang]/web-development'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const aboutData = queryCollection("about").locale(locale).one();
  const socialLinksData = queryCollection("sociallinks");
  const linkedIn = socialLinksData.find((l) => l.label === "LinkedIn");

  const expertiseAreas = getExpertiseAreas(i18n);
  const stack = getStack(i18n);
  const process = getProcess(i18n);
  const featureHighlights = getFeatureHighlights(i18n);

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Globe className="h-4 w-4 mr-2" />
              <Trans>Website Development</Trans>
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              <Trans>Websites That Perform.</Trans>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              <Trans>Modern websites and web apps built with Next.js, React, and TypeScript,
              fast, accessible, and ready to rank.</Trans>
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
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>What I Build</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>From a one-page launch site to a full SaaS, same engineering bar.</Trans>
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
              <Trans>The same tools I use to ship my own products, battle-tested, not trendy.</Trans>
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
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>From Brief to Launch</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Short, opinionated process focused on shipping something real, fast.</Trans>
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
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Performance, SEO & Accessibility</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              <Trans>Three things every website should get right, and most don&apos;t.</Trans>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {featureHighlights.map((feature) => (
                <Card key={feature.title} className="text-center p-6">
                  <CardContent className="space-y-4">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Have a Website Project?</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Whether it&apos;s a landing page, a marketing site, or a full web app, let&apos;s talk about how to ship it well.</Trans>
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
