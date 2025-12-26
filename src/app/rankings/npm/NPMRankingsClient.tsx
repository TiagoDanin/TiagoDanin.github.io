'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Download, Trophy, TrendingUp, ExternalLink, Medal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import npmData from "@/data/npm.json";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  formatNumber?: boolean;
}

function AnimatedCounter({ target, duration = 2000, formatNumber = true }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * target);

      setCount(currentCount);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [target, duration]);

  return (
    <span>
      {formatNumber ? count.toLocaleString() : count}
    </span>
  );
}

export default function NPMRankingsPage() {
  // Sort packages by downloads in descending order and take top 10
  const sortedPackages = [...npmData]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 10);

  // Calculate total downloads
  const totalDownloads = npmData.reduce((sum, pkg) => sum + pkg.downloads, 0);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-500 text-yellow-50";
      case 1:
        return "bg-gray-400 text-gray-50";
      case 2:
        return "bg-amber-600 text-amber-50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Package className="h-4 w-4 mr-2" />
              NPM Package Rankings
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              NPM Download Rankings
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Top 10 most downloaded NPM packages by Tiago Danin.
              Real-time download statistics from the NPM registry.
            </p>

            {/* Total Downloads Counter */}
            <div className="bg-muted/50 rounded-2xl p-8 max-w-md mx-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Download className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold">Total Downloads</span>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary">
                  <AnimatedCounter target={totalDownloads} duration={3000} />
                </div>
                <p className="text-muted-foreground">Across all packages</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rankings Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Top 10 NPM Packages</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ranked by total download count from the NPM registry
            </p>
          </div>

          <div className="space-y-6">
            {sortedPackages.map((pkg, index) => (
              <Card key={pkg.name} className={`border-2 transition-all hover:shadow-lg ${
                index < 3 ? 'border-primary/30 bg-gradient-to-r from-primary/5 to-transparent' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                        {getRankIcon(index)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>
                          <Badge className={getRankBadgeColor(index)}>
                            #{index + 1}
                          </Badge>
                        </div>
                        <CardDescription className="text-base">
                          {pkg.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold text-primary">
                        <AnimatedCounter
                          target={pkg.downloads}
                          duration={2000 + (index * 100)}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">downloads</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-xs">
                        v{pkg.version}
                      </Badge>
                      <div className="flex gap-2">
                        {pkg.keywords.slice(0, 3).map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {pkg.keywords.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{pkg.keywords.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={pkg.links.npm} target="_blank" rel="noopener noreferrer">
                          <Package className="h-4 w-4 mr-1" />
                          NPM
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={pkg.links.repository} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          GitHub
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Package Statistics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="p-6">
              <CardContent className="space-y-4">
                <Package className="h-12 w-12 text-primary mx-auto" />
                <div className="text-3xl font-bold">
                  <AnimatedCounter target={npmData.length} duration={1500} formatNumber={false} />
                </div>
                <div className="text-muted-foreground">Total Packages</div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4">
                <Download className="h-12 w-12 text-primary mx-auto" />
                <div className="text-3xl font-bold">
                  <AnimatedCounter
                    target={Math.round(totalDownloads / npmData.length)}
                    duration={2000}
                  />
                </div>
                <div className="text-muted-foreground">Average Downloads</div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4">
                <TrendingUp className="h-12 w-12 text-primary mx-auto" />
                <div className="text-3xl font-bold">
                  <AnimatedCounter target={sortedPackages[0]?.downloads || 0} duration={2500} />
                </div>
                <div className="text-muted-foreground">Top Package Downloads</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Explore More Rankings</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Check out GitHub repository rankings and discover more open source projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/rankings/github">
                  <Trophy className="h-5 w-5 mr-2" />
                  GitHub Rankings
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">
                  View All Projects
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}