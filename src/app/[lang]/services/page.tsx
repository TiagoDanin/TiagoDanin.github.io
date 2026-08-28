import type { Metadata } from "next";
import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import type { I18n } from "@lingui/core";
import { queryCollection } from 'nextjs-studio/server';
import {
  Smartphone, Code, Shield, GraduationCap, ArrowRight, CheckCircle,
  Briefcase, Gamepad2, Chrome, Brain, Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localePath } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, markdownAlternate, openGraphDefaults, ORIGIN, pageUrl, twitterDefaults } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/services'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`Services - Mobile, Cybersecurity & AI`,
    description: t(
      i18n
    )`Professional services by Tiago Danin: mobile app development with Flutter & React Native, cybersecurity consulting, and technical mentorship. 250+ projects delivered.`,
    alternates: {
      ...localeAlternates(locale, '/services'),
      types: markdownAlternate('/services'),
    },
    openGraph: {
      title: t(i18n)`Professional Services | Tiago Danin`,
      description: t(
        i18n
      )`Mobile development, cybersecurity, and mentorship services. 250+ projects delivered with Flutter, React Native, iOS & Android.`,
      url: pageUrl(locale, '/services'),
      type: "website",
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: t(i18n)`Professional Services | Tiago Danin`,
      description: t(
        i18n
      )`Mobile development, cybersecurity, and mentorship services. 250+ projects delivered.`,
    },
    other: {
      'application/ld+json': JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": t(i18n)`Professional Development Services`,
          "description": t(i18n)`Mobile app development, cybersecurity consulting, and technical mentorship`,
          "provider": { "@type": "Person", "name": "Tiago Danin", "url": pageUrl(locale, '/') },
          "areaServed": "Worldwide",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": t(i18n)`Development Services`,
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": t(i18n)`Mobile App Development`, "url": `${ORIGIN}/mobile/` } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": t(i18n)`Cybersecurity Consulting`, "url": `${ORIGIN}/cybersecurity/` } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": t(i18n)`Technical Mentorship`, "url": `${ORIGIN}/mentorship/` } }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
            { "@type": "ListItem", "position": 2, "name": t(i18n)`Services`, "item": pageUrl(locale, '/services') }
          ]
        }
      ])
    }
  };
}

/**
 * Built per render, not at module level.
 *
 * A locale-dependent string evaluated once when the module loads is frozen in
 * whichever language happened to be active, which is the failure Lingui warns
 * about for static rendering.
 */
function getServices(i18n: I18n) {
  return [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: t(i18n)`Mobile App Development`,
      description: t(i18n)`High-performance cross-platform and native apps for iOS and Android. From concept to App Store launch, including UI/UX, testing, and ASO.`,
      highlights: [
        t(i18n)`Flutter & React Native`,
        t(i18n)`Native iOS (Swift) & Android (Kotlin)`,
        t(i18n)`App Store & Google Play publishing`,
        t(i18n)`Firebase, CI/CD & automated testing`,
      ],
      href: "/mobile",
      badge: t(i18n)`Most Popular`,
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t(i18n)`Cybersecurity Consulting`,
      description: t(i18n)`Vulnerability assessments, penetration testing, and security audits. Protect your applications and data with security-first development.`,
      highlights: [
        t(i18n)`Vulnerability assessment & pen testing`,
        t(i18n)`Mobile & web application security`,
        t(i18n)`Security code review`,
        t(i18n)`Security best practices & compliance`,
      ],
      href: "/cybersecurity",
      badge: null,
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: t(i18n)`Technical Mentorship`,
      description: t(i18n)`Personalized 1:1 mentorship in game development, AI, and mobile development. Weekly video calls with hands-on project guidance.`,
      highlights: [
        t(i18n)`Game dev with Flutter & Unity`,
        t(i18n)`AI development & integration`,
        t(i18n)`Mobile dev with Flutter & React Native`,
        t(i18n)`Weekly 1:1 video sessions`,
      ],
      href: "/mentorship",
      badge: null,
    },
  ];
}

function getAdditionalServices(i18n: I18n) {
  return [
    {
      icon: <Gamepad2 className="h-4 w-4" />,
      title: t(i18n)`Game Development`,
      href: "/game-development",
    },
    {
      icon: <Chrome className="h-4 w-4" />,
      title: t(i18n)`Chrome Extensions`,
      href: "/chrome-extensions",
    },
    {
      icon: <Brain className="h-4 w-4" />,
      title: t(i18n)`AI Automation`,
      href: "/ai-automation",
    },
    {
      icon: <Globe className="h-4 w-4" />,
      title: t(i18n)`Web Development`,
      href: "/web-development",
    },
  ];
}

function getStats(i18n: I18n) {
  return [
    { value: "250+", label: t(i18n)`Projects Delivered` },
    { value: "8+", label: t(i18n)`Years of Experience` },
    { value: "70+", label: t(i18n)`Open Source Packages` },
    { value: "18+", label: t(i18n)`Conference Talks` },
  ];
}

export default async function ServicesPage({ params }: PageProps<'/[lang]/services'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const aboutData = queryCollection('about').locale(locale).one();
  const socialLinksData = queryCollection('sociallinks');
  const linkedIn = socialLinksData.find((l) => l.label === "LinkedIn");

  const services = getServices(i18n);
  const additionalServices = getAdditionalServices(i18n);
  const stats = getStats(i18n);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Briefcase className="h-4 w-4 mr-2" />
              <Trans>Professional Services</Trans>
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              <Trans>What I work on</Trans>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              <Trans>Mobile apps in Flutter and React Native, application security, and mentorship for engineering teams.</Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#contact"><Trans>Get in Touch</Trans></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#services"><Trans>View Services</Trans></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>How I Can Help</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Choose the service that fits your needs, or let&apos;s discuss a custom solution.</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="border-2 hover:border-primary/50 transition-colors relative flex flex-col">
                {service.badge && (
                  <Badge className="absolute -top-3 left-6">{service.badge}</Badge>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      {service.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-4">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <ul className="space-y-3 mb-6 flex-1">
                    {service.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <Link href={localePath(locale, service.href)}>
                      <Trans>Learn More</Trans> <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span><Trans>Also available:</Trans></span>
            {additionalServices.map((service, idx) => (
              <span key={service.title} className="inline-flex items-center gap-x-2">
                <Link href={localePath(locale, service.href)} className="text-foreground hover:text-primary underline-offset-4 hover:underline inline-flex items-center gap-1">
                  {service.icon}
                  {service.title}
                </Link>
                {idx < additionalServices.length - 1 && <span>·</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Why Work With Me</Trans></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <Code className="h-12 w-12 text-primary mx-auto" />
                <CardTitle><Trans>Proven Track Record</Trans></CardTitle>
                <CardDescription>
                  <Trans>250+ projects delivered, 70+ open source packages published, and winner of the TecBan Hackathon. Results you can verify.</Trans>
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <Shield className="h-12 w-12 text-primary mx-auto" />
                <CardTitle><Trans>Security-First Approach</Trans></CardTitle>
                <CardDescription>
                  <Trans>As a HackerOne security researcher since 2018, I build apps with security baked in from day one, not bolted on after.</Trans>
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <Briefcase className="h-12 w-12 text-primary mx-auto" />
                <CardTitle><Trans>Open Source Contributor</Trans></CardTitle>
                <CardDescription>
                  <Trans>Active contributor to Node.js, ElectronJS, and organizer of Devs Norte community. Deep roots in the developer ecosystem.</Trans>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Ready to Start Your Project?</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Let&apos;s discuss your idea and find the best approach. No commitment required.</Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {linkedIn && (
                <Button size="lg" asChild>
                  <a href={linkedIn.url} target="_blank" rel="noopener noreferrer">
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
