import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Code, Shield, TestTube, Palette, TrendingUp, Users, ArrowRight, CheckCircle, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Development Services | Tiago Danin - Flutter & React Native Expert",
  description: "Professional mobile app development services with Flutter and React Native. Financial, government solutions, native integrations, testing, UI/UX, and ASO expertise.",
  keywords: ["mobile development", "Flutter", "React Native", "iOS", "Android", "native integration", "mobile security", "ASO", "app store optimization"],
};

export default function MobilePage() {
  const services = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Flutter & React Native Development",
      description: "Cross-platform mobile apps with native performance. Expertise in both Flutter and React Native for efficient development.",
      features: ["Cross-platform Development", "Native Performance", "Custom UI Components", "State Management"]
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Native Integrations",
      description: "Custom native modules and integrations for Android (Java/Kotlin) and iOS (Swift/Obj-C) to extend app capabilities.",
      features: ["Android Native Modules", "iOS Native Libraries", "Platform-specific Features", "Hardware Integration"]
    },
    {
      icon: <TestTube className="h-6 w-6" />,
      title: "Testing & Quality Assurance",
      description: "Comprehensive testing strategies including unit tests, integration tests, and automated testing pipelines.",
      features: ["Unit Testing", "Integration Testing", "UI Testing", "Automated CI/CD"]
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "UI/UX Design & Implementation",
      description: "Modern, intuitive mobile interfaces with focus on user experience and platform-specific design guidelines.",
      features: ["Material Design", "iOS Human Interface", "Custom Animations", "Responsive Design"]
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "ASO & App Marketing",
      description: "App Store Optimization strategies to improve visibility and downloads on Google Play and App Store.",
      features: ["Keyword Optimization", "Store Listing Optimization", "Performance Analytics", "Marketing Strategy"]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Mobile Security",
      description: "Security-first development approach with vulnerability assessment and security best practices implementation.",
      features: ["Security Audits", "Data Protection", "Authentication Systems", "Compliance Standards"]
    }
  ];

  const technologies = [
    "Flutter", "React Native", "Swift", "Kotlin", "Java", "Objective-C",
    "TypeScript", "Dart", "Firebase", "iOS Development", "Android Development",
    "Native Modules", "ASO", "Mobile Security", "UI/UX Design"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile Development Expert
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Mobile Development Services
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Professional mobile app development with Flutter and React Native.
              From concept to App Store success, including security, testing, and ASO.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#services">
                  <Smartphone className="h-5 w-5 mr-2" />
                  View Services
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">
                  Start Your Mobile Project
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
            <h2 className="text-3xl md:text-4xl font-bold">Mobile Development Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive mobile solutions from development to deployment and optimization
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
            <h2 className="text-3xl md:text-4xl font-bold">Technologies & Expertise</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern mobile development stack with focus on performance and user experience
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
            <h2 className="text-3xl md:text-4xl font-bold">Why Mobile Development?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Mobile apps are essential for modern businesses. I help you succeed in the mobile-first world with comprehensive solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <Smartphone className="h-12 w-12 text-primary mx-auto" />
                <CardTitle>Cross-Platform Efficiency</CardTitle>
                <CardDescription>
                  Develop once, deploy everywhere. Flutter and React Native allow cost-effective development for both iOS and Android.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <Shield className="h-12 w-12 text-primary mx-auto" />
                <CardTitle>Security First</CardTitle>
                <CardDescription>
                  With my cybersecurity background, your mobile apps are built with security best practices from day one.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <TrendingUp className="h-12 w-12 text-primary mx-auto" />
                <CardTitle>App Store Success</CardTitle>
                <CardDescription>
                  From development to ASO optimization, I help your app succeed in competitive app stores.
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
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Build Your Mobile App?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let's discuss your mobile app idea and how I can help bring it to life.
              From financial apps to government solutions, I have the expertise you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://linkedin.com/in/tiagodanin" target="_blank" rel="noopener noreferrer">
                  <Users className="h-5 w-5 mr-2" />
                  Contact on LinkedIn
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  View My Projects
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}