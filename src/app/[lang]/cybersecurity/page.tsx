import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, Bug, Smartphone, Globe, Award, Users, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import type { I18n } from "@lingui/core";

import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, openGraphDefaults, pageUrl, twitterDefaults } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/cybersecurity'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`Cybersecurity Services`,
    description: t(
      i18n
    )`Professional cybersecurity services by Tiago Danin. Vulnerability assessments, penetration testing, mobile security, and security consulting since 2018.`,
    keywords: [
      "cybersecurity services", "security researcher", "vulnerability assessment",
      "penetration testing", "HackerOne", "mobile security", "web security",
      "bug bounty", "security audit", "security consulting"
    ],
    // No `types` here: generateLlms.ts writes no /cybersecurity.md, and a route
    // without a mirror must not announce one.
    alternates: localeAlternates(locale, '/cybersecurity'),
    openGraph: {
      title: t(i18n)`Cybersecurity Services | Tiago Danin - Security Researcher`,
      description: t(
        i18n
      )`Professional vulnerability assessment and security testing. HackerOne researcher with expertise in mobile and web security.`,
      url: pageUrl(locale, '/cybersecurity'),
      type: "website",
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: t(i18n)`Cybersecurity Services | Tiago Danin`,
      description: t(i18n)`Professional vulnerability assessment and security testing.`,
    },
    other: {
      'application/ld+json': JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": t(i18n)`Cybersecurity Services`,
          "description": t(
            i18n
          )`Professional vulnerability assessment, penetration testing, and security consulting services`,
          "provider": {
            "@type": "Person",
            "name": "Tiago Danin",
            "url": pageUrl(locale, '/'),
            "sameAs": "https://hackerone.com/tiago-danin"
          },
          "areaServed": "Worldwide",
          "serviceType": t(i18n)`Cybersecurity & Penetration Testing`,
          "hasOfferingDetails": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": t(i18n)`Vulnerability Assessment`
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": t(i18n)`Mobile Security Testing`
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": t(i18n)`Web Security Audit`
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": t(i18n)`Bug Bounty Consultation`
              }
            }
          ],
          "availableChannel": {
            "@type": "ServiceChannel",
            "serviceUrl": pageUrl(locale, '/cybersecurity'),
            "availableLanguage": ["en", "pt-BR"]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": t(i18n)`Home`,
              "item": pageUrl(locale, '/')
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": t(i18n)`Cybersecurity Services`,
              "item": pageUrl(locale, '/cybersecurity')
            }
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
 * whichever language happened to be active.
 */
function getServices(i18n: I18n) {
  return [
    {
      icon: <Search className="h-6 w-6" />,
      title: t(i18n)`Vulnerability Assessment`,
      description: t(i18n)`Comprehensive security analysis to identify potential vulnerabilities in your web applications, APIs, and mobile apps.`,
      features: [
        t(i18n)`Web Application Testing`,
        t(i18n)`API Security Analysis`,
        t(i18n)`Configuration Review`,
        t(i18n)`Detailed Reporting`,
      ]
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: t(i18n)`Mobile Security Testing`,
      description: t(i18n)`Specialized security testing for Android and iOS applications, including reverse engineering and static analysis.`,
      features: [
        t(i18n)`Android App Analysis`,
        t(i18n)`iOS Security Review`,
        t(i18n)`Binary Analysis`,
        t(i18n)`Runtime Testing`,
      ]
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t(i18n)`Web Security Audit`,
      description: t(i18n)`In-depth security evaluation of web applications focusing on OWASP Top 10 and beyond.`,
      features: [
        t(i18n)`XSS Testing`,
        t(i18n)`CSRF Analysis`,
        t(i18n)`Authentication Testing`,
        t(i18n)`Business Logic Review`,
      ]
    },
    {
      icon: <Bug className="h-6 w-6" />,
      title: t(i18n)`Bug Bounty Consultation`,
      description: t(i18n)`Expert guidance for organizations looking to implement or improve their bug bounty programs.`,
      features: [
        t(i18n)`Program Setup`,
        t(i18n)`Scope Definition`,
        t(i18n)`Triaging Support`,
        t(i18n)`Researcher Coordination`,
      ]
    }
  ];
}

function getAchievements(i18n: I18n) {
  return [
    {
      title: t(i18n)`HackerOne Security Researcher`,
      period: t(i18n)`2018 - Present`,
      description: t(i18n)`Independent security researcher with proven track record of finding and reporting vulnerabilities`
    },
    {
      title: t(i18n)`CTF Competition - 4th Place`,
      period: "2025",
      description: t(i18n)`Achieved 4th place in Cybersecurity CTF at Hack In Cariri - XibéSec event`
    },
    {
      title: t(i18n)`Security Content Creator`,
      period: t(i18n)`2024 - Present`,
      description: t(i18n)`Published research on SaaS security vulnerabilities and database exposures`
    },
    {
      title: t(i18n)`Banking Security Product Development`,
      period: t(i18n)`2019 - 2022, 2025 - Present`,
      description: t(i18n)`Worked on security-focused products for banking systems, implementing security measures and protocols in Mobile Apps`
    },
  ];
}

export default async function CybersecurityPage({ params }: PageProps<'/[lang]/cybersecurity'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const services = getServices(i18n);
  const achievements = getAchievements(i18n);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Shield className="h-4 w-4 mr-2" />
              <Trans>Independent Security Researcher</Trans>
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              <Trans>Cybersecurity Services</Trans>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              <Trans>Professional vulnerability assessment and security testing services. Protecting your digital assets with extensive security research experience.</Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#services">
                  <Shield className="h-5 w-5 mr-2" />
                  <Trans>View Services</Trans>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">
                  <Trans>Get Security Assessment</Trans>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Security Services</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Comprehensive cybersecurity solutions tailored to protect your applications and data</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
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


      {/* Experience Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Experience &amp; Achievements</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Track record of successful security research and community involvement</Trans>
            </p>
          </div>

          <div className="space-y-8">
            {achievements.map((achievement, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        {achievement.title}
                      </CardTitle>
                      <Badge variant="outline" className="mt-2">
                        {achievement.period}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {achievement.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Ready to Secure Your Applications?</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Let&apos;s discuss how I can help identify and fix security vulnerabilities in your applications. Professional, thorough, and actionable security assessments.</Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://linkedin.com/in/tiagodanin" target="_blank" rel="noopener noreferrer">
                  <Users className="h-5 w-5 mr-2" />
                  <Trans>Contact on LinkedIn</Trans>
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://hackerone.com/tiago-danin" target="_blank" rel="noopener noreferrer">
                  <Shield className="h-5 w-5 mr-2" />
                  <Trans>View HackerOne Profile</Trans>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
