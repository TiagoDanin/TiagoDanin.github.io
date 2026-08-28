import type { Metadata } from "next";
import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import type { I18n } from "@lingui/core";
import { queryCollection } from "nextjs-studio/server";
import { Brain, Bot, Workflow, Zap, CheckCircle, Code, Rocket, Target, Users, Sparkles, Database, Plug } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, openGraphDefaults, pageUrl, twitterDefaults } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/ai-automation'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`AI Automation & Integration Services`,
    description: t(
      i18n
    )`End-to-end AI services: agent workflows, LLM integration, RAG systems, MCP servers, prompt engineering, and AI-powered automation for products and internal tools.`,
    keywords: [
      "ai automation", "ai integration", "llm developer", "claude api developer",
      "anthropic developer", "openai integration", "rag systems", "mcp server",
      "ai agents", "prompt engineering", "ai workflows", "ai consulting",
      "automacao com ia", "consultoria ia", "agentes ia",
    ],
    alternates: localeAlternates(locale, '/ai-automation'),
    openGraph: {
      title: t(i18n)`AI Automation & Integration | Tiago Danin`,
      description: t(i18n)`Agent workflows, LLM integration, RAG, MCP servers, and AI-powered automation, built to ship.`,
      url: pageUrl(locale, '/ai-automation'),
      type: "website",
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: t(i18n)`AI Automation & Integration | Tiago Danin`,
      description: t(i18n)`Agent workflows, LLM integration, RAG, MCP servers, and AI-powered automation.`,
    },
    other: {
      "application/ld+json": JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": t(i18n)`AI Automation & Integration`,
          "description": t(
            i18n
          )`Custom AI solutions: agent workflows, LLM integration, RAG, MCP servers, and prompt engineering for products and internal automation.`,
          "provider": {
            "@type": "Person",
            "name": "Tiago Danin",
            "url": pageUrl(locale, '/'),
          },
          "areaServed": "Worldwide",
          "serviceType": "AI Development & Consulting",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
            { "@type": "ListItem", "position": 2, "name": t(i18n)`Services`, "item": pageUrl(locale, '/services') },
            { "@type": "ListItem", "position": 3, "name": t(i18n)`AI Automation`, "item": pageUrl(locale, '/ai-automation') },
          ],
        },
      ]),
    },
  };
}

/**
 * Built per render, not at module level.
 *
 * A locale-dependent string evaluated once when the module loads is frozen in
 * whichever language happened to be active.
 */
function getExpertiseAreas(i18n: I18n) {
  return [
    {
      icon: <Bot className="h-6 w-6" />,
      title: t(i18n)`AI Agents & Workflows`,
      description: t(i18n)`Multi-step agents that act on real systems, Claude Code, custom SDK agents, and autonomous workflows tuned for reliability.`,
      features: [
        t(i18n)`Claude Agent SDK`,
        t(i18n)`Tool use & function calling`,
        t(i18n)`Multi-agent orchestration`,
        t(i18n)`Long-running workflows`,
      ],
    },
    {
      icon: <Plug className="h-6 w-6" />,
      title: t(i18n)`LLM Integration`,
      description: t(i18n)`Production-grade integration with Claude, GPT, and open-source models, including caching, streaming, and cost control.`,
      features: [
        t(i18n)`Anthropic & OpenAI SDKs`,
        t(i18n)`Prompt caching`,
        t(i18n)`Streaming responses`,
        t(i18n)`Token & cost optimization`,
      ],
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: t(i18n)`RAG & Knowledge Systems`,
      description: t(i18n)`Retrieval-augmented generation built on your data, embeddings, vector stores, and grounded answers with citations.`,
      features: [
        t(i18n)`Vector databases`,
        t(i18n)`Hybrid search`,
        t(i18n)`Citation & grounding`,
        t(i18n)`Document ingestion pipelines`,
      ],
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: t(i18n)`MCP Servers`,
      description: t(i18n)`Custom Model Context Protocol servers that expose your tools and data to Claude and other MCP-compatible clients.`,
      features: [
        t(i18n)`MCP server design`,
        t(i18n)`Tool & resource APIs`,
        t(i18n)`Auth & access control`,
        t(i18n)`Local & remote deployment`,
      ],
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: t(i18n)`Prompt Engineering`,
      description: t(i18n)`Systematic prompt design with evals, A/B testing, and version control, not vibes-based prompting.`,
      features: [
        t(i18n)`Prompt evaluation suites`,
        t(i18n)`Few-shot & CoT patterns`,
        t(i18n)`Output schema enforcement`,
        t(i18n)`Regression testing`,
      ],
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: t(i18n)`AI-Powered Automation`,
      description: t(i18n)`Replace repetitive workflows with AI, document processing, classification, summarization, and human-in-the-loop pipelines.`,
      features: [
        t(i18n)`Document & email processing`,
        t(i18n)`Classification & extraction`,
        t(i18n)`Approval workflows`,
        t(i18n)`Slack/Notion integrations`,
      ],
    },
  ];
}

function getStack(i18n: I18n) {
  return [
    {
      icon: <Brain className="h-6 w-6" />,
      title: t(i18n)`Claude (Anthropic)`,
      description: t(i18n)`Primary LLM for agents and reasoning, Opus, Sonnet, Haiku, with prompt caching and extended thinking.`,
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: t(i18n)`MCP & Agent SDK`,
      description: t(i18n)`Model Context Protocol servers and Claude Agent SDK for production-grade autonomous systems.`,
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: t(i18n)`Vector Stores`,
      description: t(i18n)`Pinecone, Qdrant, pgvector, chosen based on scale, latency, and ops requirements.`,
    },
    {
      icon: <Plug className="h-6 w-6" />,
      title: t(i18n)`TypeScript & Python`,
      description: t(i18n)`TypeScript for product integration, Python for data pipelines and ML-adjacent work.`,
    },
  ];
}

function getProcess(i18n: I18n) {
  return [
    {
      icon: <Target className="h-6 w-6" />,
      title: t(i18n)`Discovery`,
      description: t(i18n)`Map the actual problem. Most 'AI projects' are really data, workflow, or UX problems wearing an AI hat.`,
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: t(i18n)`Prototype with Evals`,
      description: t(i18n)`A working prototype plus a small eval set, measure quality from day one, not after launch.`,
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: t(i18n)`Harden`,
      description: t(i18n)`Cost optimization, prompt caching, fallbacks, observability, and guardrails for the real world.`,
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: t(i18n)`Ship & Iterate`,
      description: t(i18n)`Deploy with monitoring, then iterate based on real usage, not synthetic test cases.`,
    },
  ];
}

function getUseCases(i18n: I18n) {
  return [
    {
      title: t(i18n)`Product Features`,
      description: t(i18n)`AI-powered features inside your existing product, chat, summarization, classification, generation.`,
    },
    {
      title: t(i18n)`Internal Automation`,
      description: t(i18n)`Replace manual workflows: triage support tickets, process documents, draft responses, sync across tools.`,
    },
    {
      title: t(i18n)`Developer Tooling`,
      description: t(i18n)`Custom Claude Code workflows, MCP servers, and agent setups that make your engineering team faster.`,
    },
    {
      title: t(i18n)`AI Strategy & Audit`,
      description: t(i18n)`Already have AI in production? I review prompts, costs, evals, and architecture, and tell you what to fix.`,
    },
  ];
}

export default async function AIAutomationPage({ params }: PageProps<'/[lang]/ai-automation'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const aboutData = queryCollection("about").locale(locale).one();
  const socialLinksData = queryCollection("sociallinks");
  const linkedIn = socialLinksData.find((l) => l.label === "LinkedIn");

  const expertiseAreas = getExpertiseAreas(i18n);
  const stack = getStack(i18n);
  const process = getProcess(i18n);
  const useCases = getUseCases(i18n);

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Brain className="h-4 w-4 mr-2" />
              <Trans>AI Automation &amp; Integration</Trans>
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              <Trans>AI That Actually Ships.</Trans>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              <Trans>Agents, RAG, MCP servers, and AI-powered automation, built with evals, cost control, and production reliability from day one.</Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#expertise">
                  <Sparkles className="h-5 w-5 mr-2" />
                  <Trans>Explore Expertise</Trans>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">
                  <Trans>Start a Project</Trans>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="expertise" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>What I Build</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>The full stack of AI work, from a single LLM call to multi-agent systems.</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertiseAreas.map((area) => (
              <Card key={area.title} className="border-2 hover:border-primary/50 transition-colors">
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
                    {area.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
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

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Stack &amp; Tooling</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Modern AI tooling, picked based on the problem, not the hype cycle.</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stack.map((item) => (
              <Card key={item.title} className="text-center">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg text-primary w-fit mx-auto">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>From Prompt to Production</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>An opinionated process built around evals, because AI without measurement is theatre.</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step) => (
              <Card key={step.title} className="text-center">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg text-primary w-fit mx-auto">
                    {step.icon}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Common Use Cases</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>Where AI actually pays off, and where I&apos;ve seen it work.</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase) => (
              <Card key={useCase.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  <CardDescription className="text-base">{useCase.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold"><Trans>Have an AI Project?</Trans></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <Trans>From a one-off automation to a full agent system, let&apos;s talk about the right approach for your use case.</Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {linkedIn && (
                <Button size="lg" asChild>
                  <a href={linkedIn.url} target="_blank" rel="noopener noreferrer">
                    <Users className="h-5 w-5 mr-2" />
                    <Trans>Connect on LinkedIn</Trans>
                  </a>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <a href={`mailto:${aboutData.email}`}>
                  <Trans>Send an Email</Trans>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
