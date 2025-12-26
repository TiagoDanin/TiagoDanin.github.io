import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, Brain, Gamepad2, Smartphone, Users, ArrowRight, CheckCircle, Clock, Target, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentorship Services",
  description: "Professional mentorship in game development, AI, and mobile development with weekly 1:1 calls. Personalized guidance from concept to deployment.",
  keywords: [
    "mentorship", "game development mentorship", "AI development mentorship",
    "mobile development mentorship", "Flutter mentor", "React Native mentor",
    "weekly calls", "programming mentor", "1:1 mentorship", "tech mentor"
  ],
  alternates: {
    canonical: 'https://tiagodanin.com/mentorship',
  },
  openGraph: {
    title: "Mentorship Services | Tiago Danin - Game Dev, AI & Mobile",
    description: "1:1 mentorship in game development, AI, and mobile development. Weekly video calls with personalized guidance.",
    url: "https://tiagodanin.com/mentorship",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mentorship Services | Tiago Danin",
    description: "1:1 mentorship in game development, AI, and mobile development.",
  },
  other: {
    'application/ld+json': JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Development Mentorship",
        "description": "Professional 1:1 mentorship in game development, AI, and mobile development",
        "provider": {
          "@type": "Person",
          "name": "Tiago Danin",
          "url": "https://tiagodanin.com"
        },
        "areaServed": "Worldwide",
        "serviceType": "Technical Mentorship",
        "availableChannel": {
          "@type": "ServiceChannel",
          "serviceUrl": "https://tiagodanin.com/mentorship",
          "availableLanguage": ["en", "pt-BR"]
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How Mentorship Works",
        "description": "Structured learning approach with personalized guidance",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Initial Assessment",
            "text": "We start with a comprehensive assessment of your current skills and define clear learning objectives"
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Personalized Learning Path",
            "text": "Custom curriculum designed specifically for your goals, whether it's game dev, AI, or mobile development"
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Weekly 1:1 Calls",
            "text": "Regular video calls to review progress, solve challenges, and plan next steps in your learning journey"
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Project-Based Learning",
            "text": "Build real projects that you can showcase in your portfolio, from games to mobile apps"
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
            "name": "Home",
            "item": "https://tiagodanin.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Mentorship Services",
            "item": "https://tiagodanin.com/mentorship"
          }
        ]
      }
    ])
  }
};

export default function MentorshipPage() {
  const mentorshipAreas = [
    {
      icon: <Gamepad2 className="h-6 w-6" />,
      title: "Game Development",
      description: "Learn game development with Flutter and Bonfire engine, from concept to publishing your first game.",
      features: ["Flutter Game Development", "Bonfire Engine Mastery", "Game Design Principles", "Publishing Strategy"]
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Development",
      description: "Explore AI integration in applications, automation tools, and intelligent systems development.",
      features: ["AI Integration", "Automation Tools", "Claude Code & MCP", "AI-Powered Apps"]
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Development",
      description: "Master Flutter and React Native development, from basics to advanced native integrations.",
      features: ["Flutter & React Native", "Native Integrations", "App Store Success", "Mobile Security"]
    }
  ];

  const mentorshipProcess = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Initial Assessment",
      description: "We start with a comprehensive assessment of your current skills and define clear learning objectives."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Personalized Learning Path",
      description: "Custom curriculum designed specifically for your goals, whether it's game dev, AI, or mobile development."
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Weekly 1:1 Calls",
      description: "Regular video calls to review progress, solve challenges, and plan next steps in your learning journey."
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Project-Based Learning",
      description: "Build real projects that you can showcase in your portfolio, from games to mobile apps."
    }
  ];

  const mentorshipPlans = [
    {
      title: "Starter Mentorship",
      price: "Contact for Pricing",
      duration: "4 weeks",
      features: [
        "4 weekly 1-hour video calls",
        "Choose 1 focus area (Game Dev, AI, or Mobile)",
        "Project guidance and code reviews",
        "Learning resources and roadmap",
        "Direct messaging support"
      ]
    },
    {
      title: "Intensive Mentorship",
      price: "Contact for Pricing",
      duration: "8 weeks",
      features: [
        "8 weekly 1-hour video calls",
        "Up to 2 focus areas",
        "Multiple project development",
        "Portfolio building guidance",
        "Career advice and industry insights",
        "Direct messaging support"
      ],
      popular: true
    },
    {
      title: "Extended Mentorship",
      price: "Contact for Pricing",
      duration: "12 weeks",
      features: [
        "12 weekly 1-hour video calls",
        "All 3 focus areas available",
        "Complete project portfolio",
        "Job preparation and interview guidance",
        "Network introduction opportunities",
        "Ongoing support and mentorship"
      ]
    }
  ];

  const testimonialHighlights = [
    {
      area: "Game Development",
      achievement: "Students have successfully published games using Flutter and Bonfire engine"
    },
    {
      area: "AI Integration",
      achievement: "Mentees have built AI-powered automation tools and intelligent applications"
    },
    {
      area: "Mobile Development",
      achievement: "Multiple students landed mobile developer positions after completing mentorship"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Users className="h-4 w-4 mr-2" />
              Professional Mentorship
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Development Mentorship
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Accelerate your development journey with personalized 1:1 mentorship.
              Game development, AI integration, and mobile development with weekly calls.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#areas">
                  <Brain className="h-5 w-5 mr-2" />
                  Explore Areas
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">
                  Start Your Journey
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
            <h2 className="text-3xl md:text-4xl font-bold">Mentorship Areas</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your focus area or combine multiple disciplines for comprehensive learning
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
            <h2 className="text-3xl md:text-4xl font-bold">How Mentorship Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Structured learning approach with personalized guidance and regular check-ins
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
            <h2 className="text-3xl md:text-4xl font-bold">Weekly 1:1 Video Calls</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Regular, scheduled video calls are the cornerstone of effective mentorship.
              Get personalized guidance, code reviews, and career advice tailored to your goals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <Video className="h-12 w-12 text-primary mx-auto" />
                  <CardTitle>Face-to-Face Learning</CardTitle>
                  <CardDescription>
                    Direct interaction for better understanding and immediate feedback on your progress.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <Calendar className="h-12 w-12 text-primary mx-auto" />
                  <CardTitle>Flexible Scheduling</CardTitle>
                  <CardDescription>
                    Schedule calls at times that work best for your timezone and availability.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <Target className="h-12 w-12 text-primary mx-auto" />
                  <CardTitle>Goal-Oriented Sessions</CardTitle>
                  <CardDescription>
                    Each session focuses on specific objectives to maximize your learning progress.
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
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Learning Journey?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join personalized mentorship program and accelerate your development skills.
              Let's discuss your goals and create a custom learning path together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://linkedin.com/in/tiagodanin" target="_blank" rel="noopener noreferrer">
                  <Users className="h-5 w-5 mr-2" />
                  Contact for Mentorship
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  View My Work
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}