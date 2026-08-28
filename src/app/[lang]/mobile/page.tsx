import type { Metadata } from "next";
import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import type { I18n } from "@lingui/core";
import { Smartphone, Code, Shield, TestTube, Palette, TrendingUp, Users, ArrowRight, CheckCircle, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, openGraphDefaults, pageUrl, twitterDefaults } from "@/lib/i18n/seo";
import { localePath } from "@/lib/i18n/locales";

export async function generateMetadata({ params }: PageProps<'/[lang]/mobile'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`Mobile Development Services`,
    description: t(
      i18n
    )`Professional mobile app development services with Flutter and React Native. Financial, government solutions, native integrations, testing, UI/UX, and ASO expertise.`,
    keywords: [
      "mobile development services", "Flutter development", "React Native development",
      "iOS development", "Android development", "native integration", "mobile security",
      "ASO", "app store optimization", "mobile app consulting", "cross-platform development"
    ],
    // No `types` here: scripts/generateLlms.ts writes no /mobile.md, and a page
    // must not announce a mirror that was never generated.
    alternates: localeAlternates(locale, '/mobile'),
    openGraph: {
      title: t(i18n)`Mobile Development Services | Tiago Danin`,
      description: t(
        i18n
      )`Professional mobile app development with Flutter and React Native. Native integrations, testing, UI/UX, and ASO expertise.`,
      url: pageUrl(locale, '/mobile'),
      type: "website",
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: t(i18n)`Mobile Development Services | Tiago Danin`,
      description: t(i18n)`Professional mobile app development with Flutter and React Native.`,
    },
    other: {
      'application/ld+json': JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": t(i18n)`Mobile App Development`,
          "description": t(i18n)`Professional mobile development with Flutter, React Native, and native platforms for iOS and Android`,
          "provider": {
            "@type": "Person",
            "name": "Tiago Danin",
            "url": pageUrl(locale, '/')
          },
          "areaServed": "Worldwide",
          "serviceType": t(i18n)`Mobile Application Development`,
          "hasOfferingDetails": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": t(i18n)`Flutter Development`
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": t(i18n)`React Native Development`
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": t(i18n)`Native iOS Development`
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": t(i18n)`Native Android Development`
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": t(i18n)`Mobile Security Consulting`
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": t(i18n)`App Store Optimization`
              }
            }
          ],
          "availableChannel": {
            "@type": "ServiceChannel",
            "serviceUrl": pageUrl(locale, '/mobile'),
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
              "name": t(i18n)`Mobile Development Services`,
              "item": pageUrl(locale, '/mobile')
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
 * whichever language happened to be active at import time.
 */
function getServices(i18n: I18n) {
  return [
    {
      icon: <Code className="h-6 w-6" />,
      title: t(i18n)`Flutter & React Native Development`,
      description: t(i18n)`Cross-platform mobile apps with native performance. Expertise in both Flutter and React Native for efficient development.`,
      features: [
        t(i18n)`Cross-platform Development`,
        t(i18n)`Native Performance`,
        t(i18n)`Custom UI Components`,
        t(i18n)`State Management`,
      ]
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: t(i18n)`Native Integrations`,
      description: t(i18n)`Custom native modules and integrations for Android (Java/Kotlin) and iOS (Swift/Obj-C) to extend app capabilities.`,
      features: [
        t(i18n)`Android Native Modules`,
        t(i18n)`iOS Native Libraries`,
        t(i18n)`Platform-specific Features`,
        t(i18n)`Hardware Integration`,
      ]
    },
    {
      icon: <TestTube className="h-6 w-6" />,
      title: t(i18n)`Testing & Quality Assurance`,
      description: t(i18n)`Comprehensive testing strategies including unit tests, integration tests, and automated testing pipelines.`,
      features: [
        t(i18n)`Unit Testing`,
        t(i18n)`Integration Testing`,
        t(i18n)`UI Testing`,
        t(i18n)`Automated CI/CD`,
      ]
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: t(i18n)`UI/UX Design & Implementation`,
      description: t(i18n)`Modern, intuitive mobile interfaces with focus on user experience and platform-specific design guidelines.`,
      features: [
        t(i18n)`Material Design`,
        t(i18n)`iOS Human Interface`,
        t(i18n)`Custom Animations`,
        t(i18n)`Responsive Design`,
      ]
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: t(i18n)`ASO & App Marketing`,
      description: t(i18n)`App Store Optimization strategies to improve visibility and downloads on Google Play and App Store.`,
      features: [
        t(i18n)`Keyword Optimization`,
        t(i18n)`Store Listing Optimization`,
        t(i18n)`Performance Analytics`,
        t(i18n)`Marketing Strategy`,
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t(i18n)`Mobile Security`,
      description: t(i18n)`Security-first development approach with vulnerability assessment and security best practices implementation.`,
      features: [
        t(i18n)`Security Audits`,
        t(i18n)`Data Protection`,
        t(i18n)`Authentication Systems`,
        t(i18n)`Compliance Standards`,
      ]
    }
  ];
}

/**
 * Product and language names stay untranslated; the two descriptive entries do
 * not, which is why the list is built per render like the rest of the copy.
 */
function getTechnologies(i18n: I18n) {
  return [
    "Flutter", "React Native", "Swift", "Kotlin", "Java", "Objective-C",
    "TypeScript", "Dart", "Firebase",
    t(i18n)`iOS Development`,
    t(i18n)`Android Development`,
    t(i18n)`Native Modules`,
    "ASO",
    t(i18n)`Mobile Security`,
    t(i18n)`UI/UX Design`,
  ];
}

export default async function MobilePage({ params }: PageProps<'/[lang]/mobile'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const services = getServices(i18n);
  const technologies = getTechnologies(i18n);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Smartphone className="h-4 w-4 mr-2" />
              <Trans>Mobile Development Expert</Trans>
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              <Trans>Mobile Development Services</Trans>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              <Trans>Professional mobile app development with Flutter and React Native. From concept to App Store success, including security, testing, and ASO.</Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#services">
                  <Smartphone className="h-5 w-5 mr-2" />
                  <Trans>View Services</Trans>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">
                  <Trans>Start Your Mobile Project</Trans>
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
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Mobile Development Services</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Comprehensive mobile solutions from development to deployment and optimization</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {service.icon}
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
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

      {/* Technologies Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Technologies & Expertise</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Modern mobile development stack with focus on performance and user experience</Trans>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {technologies.map((tech, index) => (
              <Card key={index} className="text-center p-4">
                <CardContent className="p-0">
                  <Badge variant="secondary" className="text-sm">
                    {tech}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Mobile Development Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Why Mobile Development?</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              <Trans>Mobile apps are essential for modern businesses. I help you succeed in the mobile-first world with comprehensive solutions.</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <Smartphone className="h-12 w-12 text-primary mx-auto" />
                <CardTitle><Trans>Cross-Platform Efficiency</Trans></CardTitle>
                <CardDescription>
                  <Trans>Develop once, deploy everywhere. Flutter and React Native allow cost-effective development for both iOS and Android.</Trans>
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <Shield className="h-12 w-12 text-primary mx-auto" />
                <CardTitle><Trans>Security First</Trans></CardTitle>
                <CardDescription>
                  <Trans>With my cybersecurity background, your mobile apps are built with security best practices from day one.</Trans>
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <TrendingUp className="h-12 w-12 text-primary mx-auto" />
                <CardTitle><Trans>App Store Success</Trans></CardTitle>
                <CardDescription>
                  <Trans>From development to ASO optimization, I help your app succeed in competitive app stores.</Trans>
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
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Ready to Build Your Mobile App?</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Let&apos;s discuss your mobile app idea and how I can help bring it to life. From financial apps to government solutions, I have the expertise you need.</Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://linkedin.com/in/tiagodanin" target="_blank" rel="noopener noreferrer">
                  <Users className="h-5 w-5 mr-2" />
                  <Trans>Contact on LinkedIn</Trans>
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={localePath(locale, '/projects')}>
                  <ArrowRight className="h-5 w-5 mr-2" />
                  <Trans>View My Projects</Trans>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
