import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { queryCollection } from 'nextjs-studio/server';
import { ArrowRight, Briefcase, BookOpen, Mic } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CallToAction } from '@/components/sections/CallToAction';
import { titleToSlug, formatDate } from '@/utils/parse';

interface SkillItem {
  name: string;
  icon: string;
  color: string;
}

interface SkillsEntry {
  category: string;
  items: SkillItem[];
}

function getAllSkills(): Array<{ skill: SkillItem; category: string; slug: string }> {
  const skills = [...queryCollection('skills')] as SkillsEntry[];
  const result: Array<{ skill: SkillItem; category: string; slug: string }> = [];

  for (const category of skills) {
    for (const item of category.items) {
      result.push({
        skill: item,
        category: category.category,
        slug: titleToSlug(item.name),
      });
    }
  }

  return result;
}

function getSkillBySlug(slug: string) {
  return getAllSkills().find((s) => s.slug === slug) ?? null;
}

function getDescription(skillName: string, category: string): string {
  const descriptions: Record<string, string> = {
    'Flutter': `Expert Flutter developer building high-performance cross-platform mobile apps for iOS and Android. Experienced with Dart, state management (BLoC, Riverpod, Provider), custom widgets, animations, and Firebase integration. Delivering production-ready apps with clean architecture and pixel-perfect UI.`,
    'React Native': `Skilled React Native developer creating native mobile experiences with JavaScript and TypeScript. Proficient in navigation, native modules, performance optimization, and bridging with native code for iOS and Android platforms.`,
    'Kotlin': `Experienced Kotlin developer for Android and backend applications. Proficient with Jetpack Compose, Coroutines, MVVM architecture, and modern Android development practices.`,
    'Swift': `Proficient Swift developer building native iOS and macOS applications. Experienced with UIKit, SwiftUI, Combine, and Apple's ecosystem including Core Data, CloudKit, and App Store deployment.`,
    'SwiftUI': `Building modern declarative iOS and macOS interfaces with SwiftUI. Experienced with animations, custom views, data flow patterns, and integration with UIKit for production apps.`,
    'Jetpack Compose': `Creating modern Android UIs with Jetpack Compose. Experienced with Material Design 3, navigation, state management, and building responsive layouts for phones, tablets, and Wear OS.`,
    'Java': `Seasoned Java developer with deep experience in Android development, backend services, and enterprise applications. Proficient with Android SDK, Spring Boot, and JVM ecosystem.`,
    'Node.js': `Building scalable backend services and APIs with Node.js. Experienced with Express, REST APIs, WebSockets, authentication systems, database integration, and cloud deployment.`,
    'TypeScript': `Writing type-safe, maintainable code with TypeScript across frontend and backend. Proficient with advanced types, generics, and building large-scale applications with strict type safety.`,
    'JavaScript': `Full-stack JavaScript developer with deep knowledge of ES6+, async patterns, DOM manipulation, and modern frameworks. Building web applications, CLI tools, and Node.js services.`,
    'React': `Building interactive web applications with React. Experienced with hooks, context, server components, Next.js, state management, and component-driven development.`,
    'Docker': `Containerizing applications with Docker for consistent development and deployment. Experienced with Docker Compose, multi-stage builds, and CI/CD integration.`,
    'Firebase': `Integrating Firebase services including Authentication, Firestore, Cloud Functions, Remote Config, Analytics, and Crashlytics into mobile and web applications.`,
    'Figma': `Designing mobile and web interfaces in Figma. Creating design systems, component libraries, and prototypes. Experienced with auto-layout, design tokens, and developer handoff.`,
    'PostgreSQL': `Designing and optimizing relational databases with PostgreSQL. Experienced with migrations, indexing, query optimization, and integration with Node.js and Elixir backends.`,
    'Unity': `Developing 2D and 3D games with Unity and C#. Experienced with physics, animations, UI systems, and publishing to mobile platforms.`,
    'Xamarin': `Cross-platform mobile development with Xamarin and C#. Building shared codebases for iOS and Android using Xamarin.Forms, native platform APIs, and MVVM architecture with .NET ecosystem integration.`,
    'Obj-C': `Objective-C developer with experience in legacy iOS and macOS codebases. Proficient in UIKit, Foundation, memory management, and bridging with Swift for modernization projects.`,
    'Ionic': `Building hybrid mobile apps with Ionic framework. Experienced with Angular/React integration, Capacitor plugins, native device APIs, and deploying to iOS and Android from a single codebase.`,
    'GitLab CI/CD': `Setting up continuous integration and delivery pipelines with GitLab CI. Experienced with .gitlab-ci.yml configuration, multi-stage pipelines, Docker runners, artifact management, and automated deployments.`,
    'GitHub CI/CD': `Automating workflows with GitHub Actions. Building CI/CD pipelines for testing, building, and deploying applications. Experienced with custom actions, matrix builds, and release automation.`,
    'Azure': `Deploying and managing applications on Microsoft Azure. Experienced with App Service, Azure Functions, Azure DevOps pipelines, and cloud infrastructure for scalable applications.`,
    'Google Cloud': `Building and deploying on Google Cloud Platform. Experienced with Cloud Run, Cloud Functions, Firestore, Cloud Storage, and integrating GCP services into mobile and web applications.`,
    'Leadership': `Leading development teams and driving technical decisions. Experienced in mentoring junior developers, conducting code reviews, setting engineering standards, and aligning technical strategy with business goals.`,
    'Team Management': `Managing cross-functional development teams. Experienced with agile methodologies, sprint planning, task delegation, conflict resolution, and fostering a collaborative engineering culture.`,
    'Problem Solving': `Systematic approach to debugging and solving complex technical challenges. Experienced in root cause analysis, performance profiling, architectural trade-off evaluation, and breaking down ambiguous problems into actionable solutions.`,
    'Communication': `Clear technical communication across teams and stakeholders. Experienced in writing documentation, presenting technical proposals, translating complex concepts for non-technical audiences, and facilitating productive discussions.`,
    'Organization': `Structured approach to project organization and workflow management. Experienced with task prioritization, documentation systems, knowledge bases, and maintaining clean codebases through consistent conventions.`,
    'HTML': `Semantic HTML5 development with focus on accessibility and SEO. Experienced with structured markup, ARIA attributes, microdata, forms, media elements, and building accessible web experiences.`,
    'CSS': `Advanced CSS styling with modern layout techniques. Proficient in Flexbox, Grid, CSS custom properties, animations, responsive design, and building design systems with scalable CSS architectures.`,
    'Vue.js': `Building reactive web applications with Vue.js. Experienced with Vue 3 Composition API, Vuex/Pinia state management, Vue Router, Nuxt.js for SSR, and component-driven development patterns.`,
    'Tailwind': `Rapid UI development with Tailwind CSS utility-first framework. Building responsive, consistent interfaces with custom design tokens, component patterns, and integrating with React and Vue projects.`,
    'Express': `Building RESTful APIs and web servers with Express.js. Experienced with middleware patterns, route handling, authentication, error handling, and integrating with databases and external services.`,
    'Elixir': `Functional programming with Elixir and the BEAM ecosystem. Experienced with Phoenix framework, LiveView, OTP patterns, GenServers, and building fault-tolerant, concurrent applications.`,
    'SQLite': `Lightweight database development with SQLite. Experienced with embedded databases for mobile apps, local-first architectures, migrations, query optimization, and integration with Android, iOS, and Electron apps.`,
    'Mobile UX': `Designing intuitive mobile user experiences. Experienced with platform-specific design guidelines (Material Design, Human Interface Guidelines), user research, prototyping, interaction patterns, and accessibility standards for mobile apps.`,
    'Flame': `2D game development with the Flame engine for Flutter. Building mobile games with sprite animations, collision detection, particle systems, and leveraging Flutter's rendering pipeline for smooth gameplay.`,
    'LÖVE': `2D game development with the LÖVE framework and Lua. Building pixel-art games with physics, tilemaps, audio systems, and rapid prototyping for game jams and indie projects.`,
    'Pixel Art': `Creating pixel art assets for games and digital media. Experienced with sprite design, animation frames, tileset creation, color palette management, and tools like Aseprite for production-quality game art.`,
    'Blender': `3D modeling and rendering with Blender. Creating game assets, character models, environments, and animations. Experienced with modeling workflows, UV mapping, texturing, and exporting for game engines.`,
  };

  return descriptions[skillName] ||
    `Professional ${category.toLowerCase()} specialist with hands-on experience in ${skillName}. Delivering quality solutions for web, mobile, and backend projects. Available for freelance work, consulting, and technical mentorship.`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getSkillBySlug(slug);

  if (!entry) {
    return { title: 'Skill not found', robots: { index: false, follow: true } };
  }

  const { skill, category } = entry;
  const description = `Tiago Danin — ${skill.name} developer with expertise in ${category}. Hire for freelance projects, consulting, and mentorship.`;

  return {
    title: `${skill.name} Developer | Tiago Danin`,
    description,
    keywords: [skill.name, category, 'developer', 'freelance', 'Tiago Danin', 'mobile developer', 'hire'],
    alternates: {
      canonical: `https://tiagodanin.com/skills/${slug}`,
    },
    openGraph: {
      title: `${skill.name} Developer — Tiago Danin`,
      description,
      url: `https://tiagodanin.com/skills/${slug}`,
      type: 'profile',
      siteName: 'Tiago Danin',
    },
    twitter: {
      card: 'summary',
      title: `${skill.name} Developer | Tiago Danin`,
      description,
      creator: '@tiagodanin',
    },
  };
}

export function generateStaticParams() {
  return getAllSkills().map((s) => ({ slug: s.slug }));
}

export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getSkillBySlug(slug);

  if (!entry) notFound();

  const { skill, category } = entry;
  const description = getDescription(skill.name, category);

  // Related posts
  const allPosts = [...queryCollection('posts').where({ lang: 'en' })].sort((a, b) => b.date.localeCompare(a.date));
  const allRelatedPosts = allPosts.filter((post) =>
    (post.tags as string[])?.some((tag: string) =>
      tag.toLowerCase() === skill.name.toLowerCase()
    )
  );
  const relatedPosts = allRelatedPosts.slice(0, 5);

  // Related talks
  const allTalks = [...queryCollection('talks').where({ lang: 'en' })].sort((a, b) => b.date.localeCompare(a.date));
  const allRelatedTalks = allTalks.filter((talk) =>
    (talk.tags as string[])?.some((tag: string) =>
      tag.toLowerCase() === skill.name.toLowerCase()
    )
  );
  const relatedTalks = allRelatedTalks.slice(0, 5);

  // Related GitHub projects
  const allProjects = [...queryCollection('github')];
  const skillSlug = titleToSlug(skill.name);
  const allRelatedProjects = allProjects
    .filter((p) => {
      const lang = titleToSlug(p.language as string || '');
      return lang === skillSlug || (p.topics as string[])?.some((t: string) => titleToSlug(t) === skillSlug);
    })
    .sort((a, b) => (b.stargazers_count as number) - (a.stargazers_count as number));
  const relatedProjects = allRelatedProjects.slice(0, 6);

  // Metrics
  const totalPosts = allRelatedPosts.length;
  const totalTalks = allRelatedTalks.length;
  const totalProjects = allRelatedProjects.length;
  const totalStars = allRelatedProjects.reduce((sum, p) => sum + ((p.stargazers_count as number) || 0), 0);

  // Other skills in same category
  const allSkills = getAllSkills();
  const sameCategory = allSkills.filter((s) => s.category === category && s.slug !== slug);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com" },
      { "@type": "ListItem", "position": 2, "name": "Skills", "item": "https://tiagodanin.com/skills" },
      { "@type": "ListItem", "position": 3, "name": skill.name, "item": `https://tiagodanin.com/skills/${slug}` },
    ],
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Tiago Danin",
    "url": "https://tiagodanin.com",
    "jobTitle": "Mobile Developer",
    "knowsAbout": [skill.name, category],
    "sameAs": [
      "https://github.com/TiagoDanin",
      "https://linkedin.com/in/tiagodanin",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${skill.name} Development`,
    "description": `Professional ${skill.name} development services by Tiago Danin`,
    "provider": {
      "@type": "Person",
      "name": "Tiago Danin",
      "url": "https://tiagodanin.com",
    },
    "serviceType": `${category} — ${skill.name}`,
    "areaServed": "Worldwide",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <div className="container mx-auto py-32 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <p className="text-sm text-muted-foreground mb-2">{category}</p>
            <h1 className="text-4xl font-bold tracking-tight">{skill.name}</h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>

            {/* Metrics */}
            {(totalProjects > 0 || totalPosts > 0 || totalTalks > 0) && (
              <div className="mt-6 flex flex-wrap gap-4">
                {totalProjects > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                    <Briefcase className="h-4 w-4" />
                    <span>{totalProjects} open source project{totalProjects !== 1 ? 's' : ''}</span>
                    {totalStars > 0 && <span className="text-yellow-600 dark:text-yellow-400">({totalStars} stars)</span>}
                  </div>
                )}
                {totalPosts > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                    <BookOpen className="h-4 w-4" />
                    <span>{totalPosts} article{totalPosts !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {totalTalks > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                    <Mic className="h-4 w-4" />
                    <span>{totalTalks} talk{totalTalks !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            )}
          </header>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold tracking-tight mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Articles about {skill.name}
              </h2>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/post/${post.slug}`}
                    className="block group p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <time className="text-xs text-muted-foreground">{formatDate(post.date)}</time>
                      <div className="flex gap-1">
                        {(post.tags as string[]).slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related Talks */}
          {relatedTalks.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold tracking-tight mb-6 flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Talks about {skill.name}
              </h2>
              <div className="space-y-4">
                {relatedTalks.map((talk) => (
                  <Link
                    key={talk.slug}
                    href={`/talk/${talk.slug}`}
                    className="block group p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <time className="text-xs text-muted-foreground">{formatDate(talk.date)}</time>
                      <Badge variant="secondary" className="text-[10px]">{talk.event}</Badge>
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">{talk.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{talk.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold tracking-tight mb-6 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Open Source Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedProjects.map((project) => (
                  <a
                    key={project.name as string}
                    href={project.html_url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-secondary/30 transition-colors"
                  >
                    <h3 className="font-medium text-sm">{project.name as string}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {project.description as string || 'No description'}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {project.language && <span>{project.language as string}</span>}
                      <span>★ {project.stargazers_count as number}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Same category skills */}
          {sameCategory.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold tracking-tight mb-4">
                Other {category} skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {sameCategory.map((s) => (
                  <Link key={s.slug} href={`/skills/${s.slug}`}>
                    <Badge variant="outline" className="hover:bg-secondary transition-colors">
                      {s.skill.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="rounded-2xl bg-secondary/50 border border-border p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Need a {skill.name} developer?</h2>
            <p className="text-muted-foreground mb-4">
              Available for freelance projects, consulting, and mentorship.
            </p>
            <Button asChild>
              <a href="mailto:TiagoDanin@outlook.com" className="inline-flex items-center gap-2">
                Get in touch
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}
