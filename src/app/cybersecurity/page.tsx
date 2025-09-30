import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, Bug, Smartphone, Globe, Award, Users, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cybersecurity Services | Tiago Danin - Independent Security Researcher",
  description: "Professional cybersecurity services by Tiago Danin. Vulnerability assessments, penetration testing, mobile security, and security consulting since 2018.",
  keywords: ["cybersecurity", "security researcher", "vulnerability assessment", "penetration testing", "HackerOne", "mobile security", "web security"],
};

export default function CybersecurityPage() {
  const services = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Vulnerability Assessment",
      description: "Comprehensive security analysis to identify potential vulnerabilities in your web applications, APIs, and mobile apps.",
      features: ["Web Application Testing", "API Security Analysis", "Configuration Review", "Detailed Reporting"]
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Security Testing",
      description: "Specialized security testing for Android and iOS applications, including reverse engineering and static analysis.",
      features: ["Android App Analysis", "iOS Security Review", "Binary Analysis", "Runtime Testing"]
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Web Security Audit",
      description: "In-depth security evaluation of web applications focusing on OWASP Top 10 and beyond.",
      features: ["XSS Testing", "CSRF Analysis", "Authentication Testing", "Business Logic Review"]
    },
    {
      icon: <Bug className="h-6 w-6" />,
      title: "Bug Bounty Consultation",
      description: "Expert guidance for organizations looking to implement or improve their bug bounty programs.",
      features: ["Program Setup", "Scope Definition", "Triaging Support", "Researcher Coordination"]
    }
  ];

  const achievements = [
    {
      title: "HackerOne Security Researcher",
      period: "2018 - Present",
      description: "Independent security researcher with proven track record of finding and reporting vulnerabilities"
    },
    {
      title: "CTF Competition - 4th Place",
      period: "2025",
      description: "Achieved 4th place in Cybersecurity CTF at Hack In Cariri - XibéSec event"
    },
    {
      title: "Security Content Creator",
      period: "2024 - Present",
      description: "Published research on SaaS security vulnerabilities and database exposures"
    },
    {
      title: "Banking Security Product Development",
      period: "2019 - 2022, 2025 - Present",
      description: "Worked on security-focused products for banking systems, implementing security measures and protocols in Mobile Apps"
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Shield className="h-4 w-4 mr-2" />
              Independent Security Researcher
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Cybersecurity Services
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Professional vulnerability assessment and security testing services.
              Protecting your digital assets with extensive security research experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#services">
                  <Shield className="h-5 w-5 mr-2" />
                  View Services
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">
                  Get Security Assessment
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
            <h2 className="text-3xl md:text-4xl font-bold">Security Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive cybersecurity solutions tailored to protect your applications and data
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
            <h2 className="text-3xl md:text-4xl font-bold">Experience & Achievements</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track record of successful security research and community involvement
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
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Secure Your Applications?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let's discuss how I can help identify and fix security vulnerabilities in your applications.
              Professional, thorough, and actionable security assessments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://linkedin.com/in/tiagodanin" target="_blank" rel="noopener noreferrer">
                  <Users className="h-5 w-5 mr-2" />
                  Contact on LinkedIn
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://hackerone.com/tiago-danin" target="_blank" rel="noopener noreferrer">
                  <Shield className="h-5 w-5 mr-2" />
                  View HackerOne Profile
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}