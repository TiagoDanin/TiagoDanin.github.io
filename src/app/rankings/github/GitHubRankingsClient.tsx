'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Star, GitFork, Trophy, TrendingUp, ExternalLink, Medal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import githubData from "@/data/github.json";

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

export default function GitHubRankingsPage() {
  // Sort repositories by stars in descending order and take top 10
  const sortedRepos = [...githubData]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10);

  // Calculate totals
  const totalStars = githubData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = githubData.reduce((sum, repo) => sum + repo.forks_count, 0);

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

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: "bg-yellow-400 text-yellow-900",
      TypeScript: "bg-blue-600 text-blue-50",
      Python: "bg-green-600 text-green-50",
      Java: "bg-orange-600 text-orange-50",
      "C++": "bg-pink-600 text-pink-50",
      C: "bg-gray-600 text-gray-50",
      Go: "bg-cyan-600 text-cyan-50",
      Rust: "bg-orange-800 text-orange-50",
      PHP: "bg-purple-600 text-purple-50",
      Ruby: "bg-red-600 text-red-50",
      Swift: "bg-orange-500 text-orange-50",
      Kotlin: "bg-purple-500 text-purple-50",
      Dart: "bg-blue-500 text-blue-50",
      Shell: "bg-gray-500 text-gray-50",
    };
    return colors[language] || "bg-gray-400 text-gray-50";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Github className="h-4 w-4 mr-2" />
              GitHub Repository Rankings
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              GitHub Star Rankings
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Top 10 most starred GitHub repositories by Tiago Danin.
              Real-time statistics from the GitHub API.
            </p>

            {/* Total Stats Counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-muted/50 rounded-2xl p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">Total Stars</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    <AnimatedCounter target={totalStars} duration={2500} />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <GitFork className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">Total Forks</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    <AnimatedCounter target={totalForks} duration={3000} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rankings Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Top 10 GitHub Repositories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ranked by star count from the GitHub API
            </p>
          </div>

          <div className="space-y-6">
            {sortedRepos.map((repo, index) => (
              <Card key={repo.id} className={`border-2 transition-all hover:shadow-lg ${
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
                          <CardTitle className="text-xl">{repo.name}</CardTitle>
                          <Badge className={getRankBadgeColor(index)}>
                            #{index + 1}
                          </Badge>
                          {repo.private && (
                            <Badge variant="outline" className="text-xs">
                              Private
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">
                          {repo.description || "No description available"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold text-primary">
                        <AnimatedCounter
                          target={repo.stargazers_count}
                          duration={2000 + (index * 100)}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">stars</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {repo.language && (
                        <Badge className={getLanguageColor(repo.language)}>
                          {repo.language}
                        </Badge>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <GitFork className="h-4 w-4" />
                          <AnimatedCounter
                            target={repo.forks_count}
                            duration={1500 + (index * 50)}
                            formatNumber={false}
                          />
                        </div>
                        {repo.size > 0 && (
                          <div className="text-xs">
                            {(repo.size / 1024).toFixed(1)} MB
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-1" />
                          GitHub
                        </a>
                      </Button>
                      {repo.homepage && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Demo
                          </a>
                        </Button>
                      )}
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
            <h2 className="text-3xl md:text-4xl font-bold">Repository Statistics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <Card className="p-6">
              <CardContent className="space-y-4">
                <Github className="h-12 w-12 text-primary mx-auto" />
                <div className="text-3xl font-bold">
                  <AnimatedCounter target={githubData.length} duration={1500} formatNumber={false} />
                </div>
                <div className="text-muted-foreground">Total Repositories</div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4">
                <Star className="h-12 w-12 text-primary mx-auto" />
                <div className="text-3xl font-bold">
                  <AnimatedCounter
                    target={Math.round(totalStars / githubData.length)}
                    duration={2000}
                    formatNumber={false}
                  />
                </div>
                <div className="text-muted-foreground">Average Stars</div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4">
                <GitFork className="h-12 w-12 text-primary mx-auto" />
                <div className="text-3xl font-bold">
                  <AnimatedCounter
                    target={Math.round(totalForks / githubData.length)}
                    duration={2200}
                    formatNumber={false}
                  />
                </div>
                <div className="text-muted-foreground">Average Forks</div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4">
                <TrendingUp className="h-12 w-12 text-primary mx-auto" />
                <div className="text-3xl font-bold">
                  <AnimatedCounter target={sortedRepos[0]?.stargazers_count || 0} duration={2500} formatNumber={false} />
                </div>
                <div className="text-muted-foreground">Top Repo Stars</div>
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
              Check out NPM package rankings and discover more open source projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/rankings/npm">
                  <Trophy className="h-5 w-5 mr-2" />
                  NPM Rankings
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