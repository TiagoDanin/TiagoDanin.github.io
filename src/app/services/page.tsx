import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Code, Shield, GraduationCap, ArrowRight, CheckCircle, Briefcase } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { queryCollection } from 'nextjs-studio/server';

export const metadata: Metadata = {
  title: "Services",
  description: "Professional services by Tiago Danin: mobile app development with Flutter & React Native, cybersecurity consulting, and technical mentorship. 250+ projects delivered.",
  keywords: [
    "mobile development services", "Flutter developer for hire", "React Native developer",
    "cybersecurity consulting", "technical mentorship", "freelance mobile developer",
    "hire Flutter developer", "app development services", "penetration testing",
    "desenvolvedor mobile freelancer", "contratar desenvolvedor mobile"
  ],
  alternates: {
    canonical: 'https://tiagodanin.com/services',
  },
  openGraph: {
    title: "Professional Services | Tiago Danin",
    description: "Mobile development, cybersecurity, and mentorship services. 250+ projects delivered with Flutter, React Native, iOS & Android.",
    url: "https://tiagodanin.com/services",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Professional Services | Tiago Danin",
    description: "Mobile development, cybersecurity, and mentorship services. 250+ projects delivered.",
  },
  other: {
    'application/ld+json': JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Professional Development Services",
        "description": "Mobile app development, cybersecurity consulting, and technical mentorship",
        "provider": {
          "@type": "Person",
          "name": "Tiago Danin",
          "url": "https://tiagodanin.com"
        },
        "areaServed": "Worldwide",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Development Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Mobile App Development",
                "url": "https://tiagodanin.com/mobile"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Cybersecurity Consulting",
                "url": "https://tiagodanin.com/cybersecurity"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Technical Mentorship",
                "url": "https://tiagodanin.com/mentorship"
              }
            }
          ]
        }
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
            "name": "Services",
            "item": "https://tiagodanin.com/services"
          }
        ]
      }
    ])
  }
};

const services = [
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: "Mobile App Development",
    description: "High-performance cross-platform and native apps for iOS and Android. From concept to App Store launch, including UI/UX, testing, and ASO.",
    highlights: [
      "Flutter & React Native",
      "Native iOS (Swift) & Android (Kotlin)",
      "App Store & Google Play publishing",
      "Firebase, CI/CD & automated testing",
    ],
    href: "/mobile",
    badge: "Most Popular",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Cybersecurity Consulting",
    description: "Vulnerability assessments, penetration testing, and security audits. Protect your applications and data with security-first development.",
    highlights: [
      "Vulnerability assessment & pen testing",
      "Mobile & web application security",
      "Security code review",
      "Security best practices & compliance",
    ],
    href: "/cybersecurity",
    badge: null,
  },
  {
    icon: <GraduationCap className="h-8 w-8" />,
    title: "Technical Mentorship",
    description: "Personalized 1:1 mentorship in game development, AI, and mobile development. Weekly video calls with hands-on project guidance.",
    highlights: [
      "Game dev with Flutter & Unity",
      "AI development & integration",
      "Mobile dev with Flutter & React Native",
      "Weekly 1:1 video sessions",
    ],
    href: "/mentorship",
    badge: null,
  },
];

const stats = [
  { value: "250+", label: "Projects Delivered" },
  { value: "8+", label: "Years of Experience" },
  { value: "70+", label: "Open Source Packages" },
  { value: "18+", label: "Conference Talks" },
];

export default function ServicesPage() {
  const aboutData = queryCollection('about').one();
  const socialLinksData = queryCollection('sociallinks');
  const linkedIn = socialLinksData.find((l) => l.label === "LinkedIn");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Briefcase className="h-4 w-4 mr-2" />
              Professional Services
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Let&apos;s Build Something Amazing
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              I help startups and companies launch high-performance mobile apps,
              secure their applications, and grow their teams through mentorship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#contact">
                  Get in Touch
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#services">
                  View Services
                </Link>
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
            <h2 className="text-3xl md:text-4xl font-bold">How I Can Help</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the service that fits your needs, or let&apos;s discuss a custom solution.
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
                    <Link href={service.href}>
                      Learn More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Work With Me</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <Code className="h-12 w-12 text-primary mx-auto" />
                <CardTitle>Proven Track Record</CardTitle>
                <CardDescription>
                  250+ projects delivered, 70+ open source packages published, and winner of the TecBan Hackathon. Results you can verify.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <Shield className="h-12 w-12 text-primary mx-auto" />
                <CardTitle>Security-First Approach</CardTitle>
                <CardDescription>
                  As a HackerOne security researcher since 2018, I build apps with security baked in from day one — not bolted on after.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <Briefcase className="h-12 w-12 text-primary mx-auto" />
                <CardTitle>Open Source Contributor</CardTitle>
                <CardDescription>
                  Active contributor to Node.js, ElectronJS, and organizer of Devs Norte community. Deep roots in the developer ecosystem.
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
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Project?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let&apos;s discuss your idea and find the best approach. No commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {linkedIn && (
                <Button size="lg" asChild>
                  <a href={linkedIn.url} target="_blank" rel="noopener noreferrer">
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
