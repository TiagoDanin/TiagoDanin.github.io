import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Bot, Workflow, Zap, ArrowRight, CheckCircle, Code, Rocket, Target, Users, Sparkles, Database, Plug } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { queryCollection } from "nextjs-studio/server";

export const metadata: Metadata = {
  title: "AI Automation & Integration Services",
  description: "End-to-end AI services: agent workflows, LLM integration, RAG systems, MCP servers, prompt engineering, and AI-powered automation for products and internal tools.",
  keywords: [
    "ai automation", "ai integration", "llm developer", "claude api developer",
    "anthropic developer", "openai integration", "rag systems", "mcp server",
    "ai agents", "prompt engineering", "ai workflows", "ai consulting",
    "automacao com ia", "consultoria ia", "agentes ia",
  ],
  alternates: {
    canonical: "https://tiagodanin.com/ai-automation/",
  },
  openGraph: {
    title: "AI Automation & Integration | Tiago Danin",
    description: "Agent workflows, LLM integration, RAG, MCP servers, and AI-powered automation, built to ship.",
    url: "https://tiagodanin.com/ai-automation/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation & Integration | Tiago Danin",
    description: "Agent workflows, LLM integration, RAG, MCP servers, and AI-powered automation.",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "AI Automation & Integration",
        "description": "Custom AI solutions: agent workflows, LLM integration, RAG, MCP servers, and prompt engineering for products and internal automation.",
        "provider": {
          "@type": "Person",
          "name": "Tiago Danin",
          "url": "https://tiagodanin.com/",
        },
        "areaServed": "Worldwide",
        "serviceType": "AI Development & Consulting",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com/" },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://tiagodanin.com/services/" },
          { "@type": "ListItem", "position": 3, "name": "AI Automation", "item": "https://tiagodanin.com/ai-automation/" },
        ],
      },
    ]),
  },
};

export default function AIAutomationPage() {
  const aboutData = queryCollection("about").one();
  const socialLinksData = queryCollection("sociallinks");
  const linkedIn = socialLinksData.find((l) => l.label === "LinkedIn");

  const expertiseAreas = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI Agents & Workflows",
      description: "Multi-step agents that act on real systems, Claude Code, custom SDK agents, and autonomous workflows tuned for reliability.",
      features: ["Claude Agent SDK", "Tool use & function calling", "Multi-agent orchestration", "Long-running workflows"],
    },
    {
      icon: <Plug className="h-6 w-6" />,
      title: "LLM Integration",
      description: "Production-grade integration with Claude, GPT, and open-source models, including caching, streaming, and cost control.",
      features: ["Anthropic & OpenAI SDKs", "Prompt caching", "Streaming responses", "Token & cost optimization"],
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "RAG & Knowledge Systems",
      description: "Retrieval-augmented generation built on your data, embeddings, vector stores, and grounded answers with citations.",
      features: ["Vector databases", "Hybrid search", "Citation & grounding", "Document ingestion pipelines"],
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: "MCP Servers",
      description: "Custom Model Context Protocol servers that expose your tools and data to Claude and other MCP-compatible clients.",
      features: ["MCP server design", "Tool & resource APIs", "Auth & access control", "Local & remote deployment"],
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Prompt Engineering",
      description: "Systematic prompt design with evals, A/B testing, and version control, not vibes-based prompting.",
      features: ["Prompt evaluation suites", "Few-shot & CoT patterns", "Output schema enforcement", "Regression testing"],
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Automation",
      description: "Replace repetitive workflows with AI, document processing, classification, summarization, and human-in-the-loop pipelines.",
      features: ["Document & email processing", "Classification & extraction", "Approval workflows", "Slack/Notion integrations"],
    },
  ];

  const stack = [
    { icon: <Brain className="h-6 w-6" />, title: "Claude (Anthropic)", description: "Primary LLM for agents and reasoning, Opus, Sonnet, Haiku, with prompt caching and extended thinking." },
    { icon: <Code className="h-6 w-6" />, title: "MCP & Agent SDK", description: "Model Context Protocol servers and Claude Agent SDK for production-grade autonomous systems." },
    { icon: <Database className="h-6 w-6" />, title: "Vector Stores", description: "Pinecone, Qdrant, pgvector, chosen based on scale, latency, and ops requirements." },
    { icon: <Plug className="h-6 w-6" />, title: "TypeScript & Python", description: "TypeScript for product integration, Python for data pipelines and ML-adjacent work." },
  ];

  const process = [
    { icon: <Target className="h-6 w-6" />, title: "Discovery", description: "Map the actual problem. Most 'AI projects' are really data, workflow, or UX problems wearing an AI hat." },
    { icon: <Code className="h-6 w-6" />, title: "Prototype with Evals", description: "A working prototype plus a small eval set, measure quality from day one, not after launch." },
    { icon: <Sparkles className="h-6 w-6" />, title: "Harden", description: "Cost optimization, prompt caching, fallbacks, observability, and guardrails for the real world." },
    { icon: <Rocket className="h-6 w-6" />, title: "Ship & Iterate", description: "Deploy with monitoring, then iterate based on real usage, not synthetic test cases." },
  ];

  const useCases = [
    { title: "Product Features", description: "AI-powered features inside your existing product, chat, summarization, classification, generation." },
    { title: "Internal Automation", description: "Replace manual workflows: triage support tickets, process documents, draft responses, sync across tools." },
    { title: "Developer Tooling", description: "Custom Claude Code workflows, MCP servers, and agent setups that make your engineering team faster." },
    { title: "AI Strategy & Audit", description: "Already have AI in production? I review prompts, costs, evals, and architecture, and tell you what to fix." },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Brain className="h-4 w-4 mr-2" />
              AI Automation & Integration
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              AI That Actually Ships.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Agents, RAG, MCP servers, and AI-powered automation, built with evals, cost control,
              and production reliability from day one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="#expertise">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Explore Expertise
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">
                  Start a Project
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="expertise" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">What I Build</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The full stack of AI work, from a single LLM call to multi-agent systems.
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
            <h2 className="text-3xl md:text-4xl font-bold">Stack & Tooling</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern AI tooling, picked based on the problem, not the hype cycle.
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
            <h2 className="text-3xl md:text-4xl font-bold">From Prompt to Production</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              An opinionated process built around evals, because AI without measurement is theatre.
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
            <h2 className="text-3xl md:text-4xl font-bold">Common Use Cases</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Where AI actually pays off, and where I&apos;ve seen it work.
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
            <h2 className="text-3xl md:text-4xl font-bold">Have an AI Project?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From a one-off automation to a full agent system, let&apos;s talk about the right approach for your use case.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {linkedIn && (
                <Button size="lg" asChild>
                  <a href={linkedIn.url} target="_blank" rel="noopener noreferrer">
                    <Users className="h-5 w-5 mr-2" />
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
