import { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ArrowRight, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { queryCollection } from "nextjs-studio/server";

export const metadata: Metadata = {
  title: "Android Apps - Google Play",
  description: "Android apps built by Tiago Danin and published on Google Play — games, productivity tools, and relaxation apps.",
  keywords: ["android apps", "google play", "tiago danin apps", "mobile games", "jetpack compose"],
  alternates: {
    canonical: "https://tiagodanin.com/apps",
  },
  openGraph: {
    title: "Android Apps | Tiago Danin",
    description: "Android apps built and published on Google Play — games, productivity tools, and relaxation apps.",
    url: "https://tiagodanin.com/apps",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Android Apps | Tiago Danin",
    description: "Android apps built and published on Google Play.",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Android Apps by Tiago Danin",
        "description": "Android apps published on Google Play by Tiago Danin",
        "url": "https://tiagodanin.com/apps",
        "author": {
          "@type": "Person",
          "name": "Tiago Danin",
          "url": "https://tiagodanin.com",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com" },
          { "@type": "ListItem", "position": 2, "name": "Apps", "item": "https://tiagodanin.com/apps" },
        ],
      },
    ]),
  },
};

export default function AppsPage() {
  const apps = [...queryCollection("googleplay")];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Smartphone className="h-4 w-4 mr-2" />
              Google Play
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              My Android Apps
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Games, utilities, and tools I&apos;ve built and shipped to Google Play — each one solving a real problem or scratching a creative itch.
            </p>
          </div>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {apps.map((app) => (
              <Card
                key={app.slug}
                className="group border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div
                      className="text-4xl p-3 rounded-2xl shrink-0"
                      style={{ backgroundColor: `${app.accentColor}20` }}
                    >
                      {app.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {app.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{app.name}</CardTitle>
                      <CardDescription className="text-sm font-medium mt-1" style={{ color: app.accentColor }}>
                        {app.tagline}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col flex-1">
                  <p className="text-muted-foreground text-sm mb-4 flex-1">{app.description}</p>

                  <div className="flex flex-wrap gap-1 mb-5">
                    {app.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button asChild className="flex-1">
                      <Link href={`/app/${app.slug}`}>
                        Learn More <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    {app.url && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={app.url} target="_blank" rel="noopener noreferrer" aria-label="View on Google Play">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold">Want to build something together?</h2>
          <p className="text-xl text-muted-foreground">
            I take on mobile development projects — from idea to App Store launch.
          </p>
          <Button size="lg" asChild>
            <Link href="/mobile">
              <Smartphone className="h-5 w-5 mr-2" />
              View Mobile Services
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
