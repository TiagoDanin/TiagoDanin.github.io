import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, Brain, Gamepad2, Smartphone, Users, ArrowRight, CheckCircle, Target, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";

import { localePath } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, markdownAlternate, openGraphDefaults, pageUrl, twitterDefaults } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/mentorship'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`Mentorship Services`,
    description: t(
      i18n
    )`Professional mentorship in game development, AI, and mobile development with weekly 1:1 calls. Personalized guidance from concept to deployment.`,
    keywords: [
      t(i18n)`mentorship`,
      t(i18n)`game development mentorship`,
      t(i18n)`AI development mentorship`,
      t(i18n)`mobile development mentorship`,
      t(i18n)`Flutter mentor`,
      t(i18n)`React Native mentor`,
      t(i18n)`weekly calls`,
      t(i18n)`programming mentor`,
      t(i18n)`1:1 mentorship`,
      t(i18n)`tech mentor`,
    ],
    alternates: {
      ...localeAlternates(locale, '/mentorship'),
      types: markdownAlternate('/mentorship'),
    },
    openGraph: {
      title: t(i18n)`Mentorship Services | Tiago Danin - Game Dev, AI & Mobile`,
      description: t(
        i18n
      )`1:1 mentorship in game development, AI, and mobile development. Weekly video calls with personalized guidance.`,
      url: pageUrl(locale, '/mentorship'),
      type: "website",
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: t(i18n)`Mentorship Services | Tiago Danin`,
      description: t(i18n)`1:1 mentorship in game development, AI, and mobile development.`,
    },
    other: {
      'application/ld+json': JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": t(i18n)`Development Mentorship`,
          "description": t(i18n)`Professional 1:1 mentorship in game development, AI, and mobile development`,
          "provider": {
            "@type": "Person",
            "name": "Tiago Danin",
            "url": pageUrl(locale, '/')
          },
          "areaServed": "Worldwide",
          "serviceType": t(i18n)`Technical Mentorship`,
          "availableChannel": {
            "@type": "ServiceChannel",
            "serviceUrl": pageUrl(locale, '/mentorship'),
            "availableLanguage": ["en", "pt-BR"]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": t(i18n)`How Mentorship Works`,
          "description": t(i18n)`Structured learning approach with personalized guidance`,
          "step": [
            {
              "@type": "HowToStep",
              "position": 1,
              "name": t(i18n)`Initial Assessment`,
              "text": t(i18n)`We start with a comprehensive assessment of your current skills and define clear learning objectives`
            },
            {
              "@type": "HowToStep",
              "position": 2,
              "name": t(i18n)`Personalized Learning Path`,
              "text": t(i18n)`Custom curriculum designed specifically for your goals, whether it's game dev, AI, or mobile development`
            },
            {
              "@type": "HowToStep",
              "position": 3,
              "name": t(i18n)`Weekly 1:1 Calls`,
              "text": t(i18n)`Regular video calls to review progress, solve challenges, and plan next steps in your learning journey`
            },
            {
              "@type": "HowToStep",
              "position": 4,
              "name": t(i18n)`Project-Based Learning`,
              "text": t(i18n)`Build real projects that you can showcase in your portfolio, from games to mobile apps`
            }
          ]
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
              "name": t(i18n)`Mentorship Services`,
              "item": pageUrl(locale, '/mentorship')
            }
          ]
        }
      ])
    }
  };
}

export default async function MentorshipPage({ params }: PageProps<'/[lang]/mentorship'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const mentorshipAreas = [
    {
      icon: <Gamepad2 className="h-6 w-6" />,
      title: t(i18n)`Game Development`,
      description: t(i18n)`Learn game development with Flutter and Bonfire engine, from concept to publishing your first game.`,
      features: [
        t(i18n)`Flutter Game Development`,
        t(i18n)`Bonfire Engine Mastery`,
        t(i18n)`Game Design Principles`,
        t(i18n)`Publishing Strategy`,
      ]
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: t(i18n)`AI Development`,
      description: t(i18n)`Explore AI integration in applications, automation tools, and intelligent systems development.`,
      features: [
        t(i18n)`AI Integration`,
        t(i18n)`Automation Tools`,
        t(i18n)`Claude Code & MCP`,
        t(i18n)`AI-Powered Apps`,
      ]
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: t(i18n)`Mobile Development`,
      description: t(i18n)`Master Flutter and React Native development, from basics to advanced native integrations.`,
      features: [
        t(i18n)`Flutter & React Native`,
        t(i18n)`Native Integrations`,
        t(i18n)`App Store Success`,
        t(i18n)`Mobile Security`,
      ]
    }
  ];

  const mentorshipProcess = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: t(i18n)`Initial Assessment`,
      description: t(i18n)`We start with a comprehensive assessment of your current skills and define clear learning objectives.`
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: t(i18n)`Personalized Learning Path`,
      description: t(i18n)`Custom curriculum designed specifically for your goals, whether it's game dev, AI, or mobile development.`
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: t(i18n)`Weekly 1:1 Calls`,
      description: t(i18n)`Regular video calls to review progress, solve challenges, and plan next steps in your learning journey.`
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: t(i18n)`Project-Based Learning`,
      description: t(i18n)`Build real projects that you can showcase in your portfolio, from games to mobile apps.`
    }
  ];

  const mentorshipPlans = [
    {
      title: t(i18n)`Starter Mentorship`,
      price: t(i18n)`Contact for Pricing`,
      duration: t(i18n)`4 weeks`,
      features: [
        t(i18n)`4 weekly 1-hour video calls`,
        t(i18n)`Choose 1 focus area (Game Dev, AI, or Mobile)`,
        t(i18n)`Project guidance and code reviews`,
        t(i18n)`Learning resources and roadmap`,
        t(i18n)`Direct messaging support`,
      ]
    },
    {
      title: t(i18n)`Intensive Mentorship`,
      price: t(i18n)`Contact for Pricing`,
      duration: t(i18n)`8 weeks`,
      features: [
        t(i18n)`8 weekly 1-hour video calls`,
        t(i18n)`Up to 2 focus areas`,
        t(i18n)`Multiple project development`,
        t(i18n)`Portfolio building guidance`,
        t(i18n)`Career advice and industry insights`,
        t(i18n)`Direct messaging support`,
      ],
      popular: true
    },
    {
      title: t(i18n)`Extended Mentorship`,
      price: t(i18n)`Contact for Pricing`,
      duration: t(i18n)`12 weeks`,
      features: [
        t(i18n)`12 weekly 1-hour video calls`,
        t(i18n)`All 3 focus areas available`,
        t(i18n)`Complete project portfolio`,
        t(i18n)`Job preparation and interview guidance`,
        t(i18n)`Network introduction opportunities`,
        t(i18n)`Ongoing support and mentorship`,
      ]
    }
  ];

  const testimonialHighlights = [
    {
      area: t(i18n)`Game Development`,
      achievement: t(i18n)`Students have successfully published games using Flutter and Bonfire engine`
    },
    {
      area: t(i18n)`AI Integration`,
      achievement: t(i18n)`Mentees have built AI-powered automation tools and intelligent applications`
    },
    {
      area: t(i18n)`Mobile Development`,
      achievement: t(i18n)`Multiple students landed mobile developer positions after completing mentorship`
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Users className="h-4 w-4 mr-2" />
              <Trans>Professional Mentorship</Trans>
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              <Trans>Development Mentorship</Trans>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              <Trans>Accelerate your development journey with personalized 1:1 mentorship.
              Game development, AI integration, and mobile development with weekly calls.</Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#areas">
                  <Brain className="h-5 w-5 mr-2" />
                  <Trans>Explore Areas</Trans>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">
                  <Trans>Start Your Journey</Trans>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mentorship Areas Section */}
      <section id="areas" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Mentorship Areas</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Choose your focus area or combine multiple disciplines for comprehensive learning</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mentorshipAreas.map((area, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
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
                    {area.features.map((feature, idx) => (
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

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>How Mentorship Works</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Structured learning approach with personalized guidance and regular check-ins</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mentorshipProcess.map((step, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg text-primary w-fit mx-auto">
                    {step.icon}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Calls Feature */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Weekly 1:1 Video Calls</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              <Trans>Regular, scheduled video calls are the cornerstone of effective mentorship.
              Get personalized guidance, code reviews, and career advice tailored to your goals.</Trans>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <Video className="h-12 w-12 text-primary mx-auto" />
                  <CardTitle><Trans>Face-to-Face Learning</Trans></CardTitle>
                  <CardDescription>
                    <Trans>Direct interaction for better understanding and immediate feedback on your progress.</Trans>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <Calendar className="h-12 w-12 text-primary mx-auto" />
                  <CardTitle><Trans>Flexible Scheduling</Trans></CardTitle>
                  <CardDescription>
                    <Trans>Schedule calls at times that work best for your timezone and availability.</Trans>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <Target className="h-12 w-12 text-primary mx-auto" />
                  <CardTitle><Trans>Goal-Oriented Sessions</Trans></CardTitle>
                  <CardDescription>
                    <Trans>Each session focuses on specific objectives to maximize your learning progress.</Trans>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Ready to Start Your Learning Journey?</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Join personalized mentorship program and accelerate your development skills.
              Let&apos;s discuss your goals and create a custom learning path together.</Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://linkedin.com/in/tiagodanin" target="_blank" rel="noopener noreferrer">
                  <Users className="h-5 w-5 mr-2" />
                  <Trans>Contact for Mentorship</Trans>
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={localePath(locale, '/projects')}>
                  <ArrowRight className="h-5 w-5 mr-2" />
                  <Trans>View My Work</Trans>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
