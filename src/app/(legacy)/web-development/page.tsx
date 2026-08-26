import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Code, Layout, Search, ArrowRight, CheckCircle, Rocket, Target, Users, Sparkles, Gauge, Server, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { queryCollection } from "nextjs-studio/server";

export const metadata: Metadata = {
  title: "Website Development Services",
  description: "Modern websites built with Next.js, React, and TypeScript. Landing pages, marketing sites, e-commerce, and web apps with SEO, performance, and accessibility built in.",
  keywords: [
    "website development", "next.js developer", "react developer for hire",
    "landing page development", "marketing website", "web app development",
    "typescript developer", "tailwind developer", "seo website",
    "desenvolvimento de site", "criar site", "site profissional",
  ],
  alternates: {
    canonical: "https://tiagodanin.com/web-development/",
  },
  openGraph: {
    title: "Website Development | Tiago Danin",
    description: "Modern websites with Next.js, React, and TypeScript, fast, accessible, and SEO-ready.",
    url: "https://tiagodanin.com/web-development/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Development | Tiago Danin",
    description: "Modern websites with Next.js, React, and TypeScript, fast, accessible, and SEO-ready.",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Website Development",
        "description": "Modern web development with Next.js, React, and TypeScript, landing pages, marketing sites, e-commerce, and web apps.",
        "provider": {
          "@type": "Person",
          "name": "Tiago Danin",
          "url": "https://tiagodanin.com/",
        },
        "areaServed": "Worldwide",
        "serviceType": "Web Development",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com/" },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://tiagodanin.com/services/" },
          { "@type": "ListItem", "position": 3, "name": "Web Development", "item": "https://tiagodanin.com/web-development/" },
        ],
      },
    ]),
  },
};

export default function WebDevelopmentPage() {
  const aboutData = queryCollection("about").one();
  const socialLinksData = queryCollection("sociallinks");
  const linkedIn = socialLinksData.find((l) => l.label === "LinkedIn");

  const expertiseAreas = [
    {
      icon: <Layout className="h-6 w-6" />,
      title: "Landing & Marketing Sites",
      description: "Conversion-focused sites that load fast, rank well, and look great on every device, from solo founders to scale-ups.",
      features: ["Static export & edge hosting", "CMS-driven content", "A/B test ready", "Analytics & conversion tracking"],
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Web Apps & Dashboards",
      description: "Full-stack web apps with auth, databases, and real-time features, built on the Next.js App Router.",
      features: ["Server components & actions", "Auth (NextAuth, Clerk, custom)", "Postgres, SQLite, Cloudflare D1", "Real-time with WebSockets"],
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "E-commerce & SaaS",
      description: "Storefronts and subscription products with Stripe, headless CMS, and the full checkout-to-fulfillment loop.",
      features: ["Stripe & subscription billing", "Headless CMS integration", "Shopify, Medusa, custom backends", "Webhooks & order management"],
    },
  ];

  const stack = [
    { icon: <Code className="h-6 w-6" />, title: "Next.js + React", description: "App Router, server components, and static export, the framework I default to for almost every site." },
    { icon: <Sparkles className="h-6 w-6" />, title: "TypeScript + Tailwind", description: "Type-safe by default, styled with Tailwind and shadcn/ui for fast, consistent design systems." },
    { icon: <Server className="h-6 w-6" />, title: "Edge Hosting", description: "Cloudflare Pages, Vercel, and GitHub Pages, picked based on cost, dynamic needs, and traffic profile." },
    { icon: <Search className="h-6 w-6" />, title: "SEO & Performance", description: "Core Web Vitals, structured data, sitemaps, and OG tags, built in, not bolted on." },
  ];

  const process = [
    { icon: <Target className="h-6 w-6" />, title: "Goals & Scope", description: "Define what the site is for: leads, sales, content, app. Scope follows the goal, not the other way around." },
    { icon: <Layout className="h-6 w-6" />, title: "Design & Prototype", description: "Wireframes and a working prototype within a week. Validate the layout before investing in polish." },
    { icon: <Code className="h-6 w-6" />, title: "Build", description: "Component-driven development with TypeScript, Tailwind, and shadcn/ui. Clean code, easy to extend." },
    { icon: <Rocket className="h-6 w-6" />, title: "Launch & Iterate", description: "Deploy with monitoring, analytics, and SEO instrumentation. Iterate based on real traffic." },
  ];

  const featureHighlights = [
    {
      icon: <Gauge className="h-12 w-12 text-primary mx-auto" />,
      title: "Built for Speed",
      description: "Lighthouse 90+ targets, image optimization, edge caching, and lazy loading, fast on real devices, not just in the lab.",
    },
    {
      icon: <Search className="h-12 w-12 text-primary mx-auto" />,
      title: "SEO from Day One",
      description: "Structured data, sitemaps, canonical URLs, OG/Twitter cards, and semantic HTML baked into every page.",
    },
    {
      icon: <Globe className="h-12 w-12 text-primary mx-auto" />,
      title: "Accessibility & i18n",
      description: "WCAG-conscious markup, keyboard navigation, and multi-language support when you need to reach global users.",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Globe className="h-4 w-4 mr-2" />
              Website Development
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Websites That Perform.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Modern websites and web apps built with Next.js, React, and TypeScript,
              fast, accessible, and ready to rank.
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
            <h2 className="text-3xl md:text-4xl font-bold">What I Build</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From a one-page launch site to a full SaaS, same engineering bar.
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
              The same tools I use to ship my own products, battle-tested, not trendy.
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
            <h2 className="text-3xl md:text-4xl font-bold">From Brief to Launch</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Short, opinionated process focused on shipping something real, fast.
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
            <h2 className="text-3xl md:text-4xl font-bold">Performance, SEO & Accessibility</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three things every website should get right, and most don&apos;t.
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
            <h2 className="text-3xl md:text-4xl font-bold">Have a Website Project?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether it&apos;s a landing page, a marketing site, or a full web app, let&apos;s talk about how to ship it well.
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
