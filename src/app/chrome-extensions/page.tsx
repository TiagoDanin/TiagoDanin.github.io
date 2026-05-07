import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chrome, Puzzle, Shield, Zap, ArrowRight, CheckCircle, Code, Rocket, Target, Users, Globe } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { queryCollection } from "nextjs-studio/server";

export const metadata: Metadata = {
  title: "Chrome Extensions Developer",
  description: "Custom Chrome extensions built with Manifest V3, TypeScript, and modern web tech. From productivity tools to enterprise integrations, published on the Chrome Web Store.",
  keywords: [
    "chrome extension developer", "chrome extensions for hire", "manifest v3 developer",
    "browser extension development", "chrome web store publishing", "typescript extensions",
    "chrome extension consulting", "edge firefox extension", "browser extension freelance",
    "desenvolvedor chrome extension", "extensoes chrome",
  ],
  alternates: {
    canonical: "https://tiagodanin.com/chrome-extensions",
  },
  openGraph: {
    title: "Chrome Extensions Developer | Tiago Danin",
    description: "Custom Chrome extensions with Manifest V3, TypeScript, and Chrome Web Store publishing.",
    url: "https://tiagodanin.com/chrome-extensions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chrome Extensions Developer | Tiago Danin",
    description: "Custom Chrome extensions with Manifest V3, TypeScript, and Chrome Web Store publishing.",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Chrome Extensions Development",
        "description": "Custom browser extensions for Chrome, Edge and Firefox using Manifest V3, TypeScript, and modern web frameworks.",
        "provider": {
          "@type": "Person",
          "name": "Tiago Danin",
          "url": "https://tiagodanin.com",
        },
        "areaServed": "Worldwide",
        "serviceType": "Browser Extension Development",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com" },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://tiagodanin.com/services" },
          { "@type": "ListItem", "position": 3, "name": "Chrome Extensions", "item": "https://tiagodanin.com/chrome-extensions" },
        ],
      },
    ]),
  },
};

export default function ChromeExtensionsPage() {
  const aboutData = queryCollection("about").one();
  const socialLinksData = queryCollection("sociallinks");
  const linkedIn = socialLinksData.find((l) => l.label === "LinkedIn");

  const expertiseAreas = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Productivity Tools",
      description: "Extensions that automate repetitive workflows, augment existing web apps, and save hours per week.",
      features: ["Workflow automation", "Web app augmentation", "Keyboard shortcuts", "Custom UI overlays"],
    },
    {
      icon: <Puzzle className="h-6 w-6" />,
      title: "API & SaaS Integrations",
      description: "Bridge browser sessions with external APIs, dashboards, and internal tools, securely and at scale.",
      features: ["OAuth & API auth", "Background sync", "Cross-origin requests", "Real-time messaging"],
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy & Security",
      description: "Content blockers, header rewriting, and security-focused extensions built with least-privilege permissions.",
      features: ["Manifest V3 best practices", "DeclarativeNetRequest", "Content Security Policy", "Permission auditing"],
    },
  ];

  const stack = [
    { icon: <Code className="h-6 w-6" />, title: "Manifest V3", description: "Service workers, declarativeNetRequest, and modern background scripts, built the way Chrome wants." },
    { icon: <Code className="h-6 w-6" />, title: "TypeScript + React", description: "Type-safe extensions with React-based popups and options pages, bundled with Vite or Webpack." },
    { icon: <Globe className="h-6 w-6" />, title: "Cross-Browser", description: "Same codebase shipping to Chrome, Edge, Brave, and (with polyfills) Firefox." },
    { icon: <Rocket className="h-6 w-6" />, title: "Chrome Web Store", description: "Listing, screenshots, review prep, and post-launch updates, including handling Google review pushback." },
  ];

  const process = [
    { icon: <Target className="h-6 w-6" />, title: "Scope & Permissions", description: "Decide what the extension actually needs, minimal permissions reduce review friction and earn user trust." },
    { icon: <Code className="h-6 w-6" />, title: "Prototype", description: "A working extension loaded unpacked within days. Validate the UX before polishing." },
    { icon: <Shield className="h-6 w-6" />, title: "Hardening", description: "Manifest V3 compliance, CSP, sandboxed iframes, and a clean permission story for review." },
    { icon: <Rocket className="h-6 w-6" />, title: "Publish & Iterate", description: "Chrome Web Store submission, listing optimization, and updates based on real install feedback." },
  ];

  const useCases = [
    { title: "Internal Tools", description: "Extensions distributed via enterprise policy or private listing, no Web Store dance required." },
    { title: "Public Products", description: "Free or paid extensions published on the Chrome Web Store, with onboarding and analytics built in." },
    { title: "Migration to Manifest V3", description: "Bring legacy MV2 extensions into compliance before Chrome removes them entirely." },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Chrome className="h-4 w-4 mr-2" />
              Chrome Extensions
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Browser Extensions, Done Right.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Custom Chrome extensions built with Manifest V3, TypeScript, and a clean permission story,
              from productivity tools to enterprise integrations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#expertise">
                  <Puzzle className="h-5 w-5 mr-2" />
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
              Extensions that solve real workflow problems, not just toy demos.
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
              Modern, maintainable, and aligned with Google&apos;s direction.
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
            <h2 className="text-3xl md:text-4xl font-bold">From Idea to Web Store</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              An opinionated process focused on getting through review the first time.
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
            <h2 className="text-3xl md:text-4xl font-bold">Common Use Cases</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether internal or public, the engineering bar is the same.
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
            <h2 className="text-3xl md:text-4xl font-bold">Have an Extension Idea?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From a one-off internal tool to a public Chrome Web Store launch, let&apos;s talk about how to ship it.
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
