import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Plural, Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import type { I18n } from '@lingui/core';
import { queryCollection } from 'nextjs-studio/server';
import { ArrowRight, Briefcase, BookOpen, Mic } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { titleToSlug, formatDate } from '@/utils/parse';
import { eventLabel } from '@/lib/talks';
import { contentLang, entryPath, intlLocale, localePath } from '@/lib/i18n/locales';
import { getAllSkills, getSkillBySlug } from '@/lib/skills';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, openGraphDefaults, pageUrl, twitterDefaults } from '@/lib/i18n/seo';

/**
 * Built per render, not at module level. A locale-dependent string evaluated
 * once when the module loads is frozen in whichever language happened to be
 * active, which is the failure Lingui warns about for static rendering.
 */
function getDescription(i18n: I18n, displayName: string, englishName: string, category: string): string {
  const descriptions: Record<string, string> = {
    'Flutter': t(i18n)`Expert Flutter developer building high-performance cross-platform mobile apps for iOS and Android. Experienced with Dart, state management (BLoC, Riverpod, Provider), custom widgets, animations, and Firebase integration. Delivering production-ready apps with clean architecture and pixel-perfect UI.`,
    'React Native': t(i18n)`Skilled React Native developer creating native mobile experiences with JavaScript and TypeScript. Proficient in navigation, native modules, performance optimization, and bridging with native code for iOS and Android platforms.`,
    'Kotlin': t(i18n)`Experienced Kotlin developer for Android and backend applications. Proficient with Jetpack Compose, Coroutines, MVVM architecture, and modern Android development practices.`,
    'Swift': t(i18n)`Proficient Swift developer building native iOS and macOS applications. Experienced with UIKit, SwiftUI, Combine, and Apple's ecosystem including Core Data, CloudKit, and App Store deployment.`,
    'SwiftUI': t(i18n)`Building modern declarative iOS and macOS interfaces with SwiftUI. Experienced with animations, custom views, data flow patterns, and integration with UIKit for production apps.`,
    'Jetpack Compose': t(i18n)`Creating modern Android UIs with Jetpack Compose. Experienced with Material Design 3, navigation, state management, and building responsive layouts for phones, tablets, and Wear OS.`,
    'Java': t(i18n)`Seasoned Java developer with deep experience in Android development, backend services, and enterprise applications. Proficient with Android SDK, Spring Boot, and JVM ecosystem.`,
    'Node.js': t(i18n)`Building scalable backend services and APIs with Node.js. Experienced with Express, REST APIs, WebSockets, authentication systems, database integration, and cloud deployment.`,
    'TypeScript': t(i18n)`Writing type-safe, maintainable code with TypeScript across frontend and backend. Proficient with advanced types, generics, and building large-scale applications with strict type safety.`,
    'JavaScript': t(i18n)`Full-stack JavaScript developer with deep knowledge of ES6+, async patterns, DOM manipulation, and modern frameworks. Building web applications, CLI tools, and Node.js services.`,
    'React': t(i18n)`Building interactive web applications with React. Experienced with hooks, context, server components, Next.js, state management, and component-driven development.`,
    'Docker': t(i18n)`Containerizing applications with Docker for consistent development and deployment. Experienced with Docker Compose, multi-stage builds, and CI/CD integration.`,
    'Firebase': t(i18n)`Integrating Firebase services including Authentication, Firestore, Cloud Functions, Remote Config, Analytics, and Crashlytics into mobile and web applications.`,
    'Figma': t(i18n)`Designing mobile and web interfaces in Figma. Creating design systems, component libraries, and prototypes. Experienced with auto-layout, design tokens, and developer handoff.`,
    'PostgreSQL': t(i18n)`Designing and optimizing relational databases with PostgreSQL. Experienced with migrations, indexing, query optimization, and integration with Node.js and Elixir backends.`,
    'Unity': t(i18n)`Developing 2D and 3D games with Unity and C#. Experienced with physics, animations, UI systems, and publishing to mobile platforms.`,
    'Xamarin': t(i18n)`Cross-platform mobile development with Xamarin and C#. Building shared codebases for iOS and Android using Xamarin.Forms, native platform APIs, and MVVM architecture with .NET ecosystem integration.`,
    'Obj-C': t(i18n)`Objective-C developer with experience in legacy iOS and macOS codebases. Proficient in UIKit, Foundation, memory management, and bridging with Swift for modernization projects.`,
    'Ionic': t(i18n)`Building hybrid mobile apps with Ionic framework. Experienced with Angular/React integration, Capacitor plugins, native device APIs, and deploying to iOS and Android from a single codebase.`,
    'GitLab CI/CD': t(i18n)`Setting up continuous integration and delivery pipelines with GitLab CI. Experienced with .gitlab-ci.yml configuration, multi-stage pipelines, Docker runners, artifact management, and automated deployments.`,
    'GitHub CI/CD': t(i18n)`Automating workflows with GitHub Actions. Building CI/CD pipelines for testing, building, and deploying applications. Experienced with custom actions, matrix builds, and release automation.`,
    'Azure': t(i18n)`Deploying and managing applications on Microsoft Azure. Experienced with App Service, Azure Functions, Azure DevOps pipelines, and cloud infrastructure for scalable applications.`,
    'Google Cloud': t(i18n)`Building and deploying on Google Cloud Platform. Experienced with Cloud Run, Cloud Functions, Firestore, Cloud Storage, and integrating GCP services into mobile and web applications.`,
    'Leadership': t(i18n)`Leading development teams and driving technical decisions. Experienced in mentoring junior developers, conducting code reviews, setting engineering standards, and aligning technical strategy with business goals.`,
    'Team Management': t(i18n)`Managing cross-functional development teams. Experienced with agile methodologies, sprint planning, task delegation, conflict resolution, and fostering a collaborative engineering culture.`,
    'Problem Solving': t(i18n)`Systematic approach to debugging and solving complex technical challenges. Experienced in root cause analysis, performance profiling, architectural trade-off evaluation, and breaking down ambiguous problems into actionable solutions.`,
    'Communication': t(i18n)`Clear technical communication across teams and stakeholders. Experienced in writing documentation, presenting technical proposals, translating complex concepts for non-technical audiences, and facilitating productive discussions.`,
    'Organization': t(i18n)`Structured approach to project organization and workflow management. Experienced with task prioritization, documentation systems, knowledge bases, and maintaining clean codebases through consistent conventions.`,
    'HTML': t(i18n)`Semantic HTML5 development with focus on accessibility and SEO. Experienced with structured markup, ARIA attributes, microdata, forms, media elements, and building accessible web experiences.`,
    'CSS': t(i18n)`Advanced CSS styling with modern layout techniques. Proficient in Flexbox, Grid, CSS custom properties, animations, responsive design, and building design systems with scalable CSS architectures.`,
    'Vue.js': t(i18n)`Building reactive web applications with Vue.js. Experienced with Vue 3 Composition API, Vuex/Pinia state management, Vue Router, Nuxt.js for SSR, and component-driven development patterns.`,
    'Tailwind': t(i18n)`Rapid UI development with Tailwind CSS utility-first framework. Building responsive, consistent interfaces with custom design tokens, component patterns, and integrating with React and Vue projects.`,
    'Express': t(i18n)`Building RESTful APIs and web servers with Express.js. Experienced with middleware patterns, route handling, authentication, error handling, and integrating with databases and external services.`,
    'Elixir': t(i18n)`Functional programming with Elixir and the BEAM ecosystem. Experienced with Phoenix framework, LiveView, OTP patterns, GenServers, and building fault-tolerant, concurrent applications.`,
    'SQLite': t(i18n)`Lightweight database development with SQLite. Experienced with embedded databases for mobile apps, local-first architectures, migrations, query optimization, and integration with Android, iOS, and Electron apps.`,
    'Mobile UX': t(i18n)`Designing intuitive mobile user experiences. Experienced with platform-specific design guidelines (Material Design, Human Interface Guidelines), user research, prototyping, interaction patterns, and accessibility standards for mobile apps.`,
    'Flame': t(i18n)`2D game development with the Flame engine for Flutter. Building mobile games with sprite animations, collision detection, particle systems, and leveraging Flutter's rendering pipeline for smooth gameplay.`,
    'LÖVE': t(i18n)`2D game development with the LÖVE framework and Lua. Building pixel-art games with physics, tilemaps, audio systems, and rapid prototyping for game jams and indie projects.`,
    'Pixel Art': t(i18n)`Creating pixel art assets for games and digital media. Experienced with sprite design, animation frames, tileset creation, color palette management, and tools like Aseprite for production-quality game art.`,
    'Blender': t(i18n)`3D modeling and rendering with Blender. Creating game assets, character models, environments, and animations. Experienced with modeling workflows, UV mapping, texturing, and exporting for game engines.`,
  };

  return descriptions[englishName] ??
    t(i18n)`Professional ${category.toLowerCase()} specialist with hands-on experience in ${displayName}. Delivering quality solutions for web, mobile, and backend projects. Available for freelance work, consulting, and technical mentorship.`;
}

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale = resolveLocale(params.lang);
  return getAllSkills(locale).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/skills/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = resolveLocale(lang);
  const i18n = getI18nInstance(locale);
  const entry = getSkillBySlug(locale, slug);

  if (!entry) {
    return { title: t(i18n)`Skill not found`, robots: { index: false, follow: true } };
  }

  const { skill, category } = entry;
  const description = t(i18n)`Tiago Danin, ${skill.name} developer with expertise in ${category}. Hire for freelance projects, consulting, and mentorship.`;

  return {
    title: t(i18n)`${skill.name} Developer | Tiago Danin`,
    description,
    keywords: [skill.name, category, 'developer', 'freelance', 'Tiago Danin', 'mobile developer', 'hire'],
    alternates: localeAlternates(locale, `/skills/${slug}`),
    openGraph: {
      title: t(i18n)`${skill.name} Developer, Tiago Danin`,
      description,
      url: pageUrl(locale, `/skills/${slug}`),
      type: 'profile',
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      card: 'summary',
      title: t(i18n)`${skill.name} Developer | Tiago Danin`,
      description,
      creator: '@tiagodanin',
    },
  };
}

export default async function SkillPage({ params }: PageProps<'/[lang]/skills/[slug]'>) {
  const { lang, slug } = await params;
  const locale = resolveLocale(lang);
  const i18n = initI18n(locale);

  const entry = getSkillBySlug(locale, slug);

  if (!entry) notFound();

  const { skill, category, englishName } = entry;
  const description = getDescription(i18n, skill.name, englishName, category);

  // Related posts
  const allPosts = [...queryCollection('posts').where({ lang: contentLang(locale) })].sort((a, b) => b.date.localeCompare(a.date));
  const allRelatedPosts = allPosts.filter((post) =>
    (post.tags as string[])?.some((tag: string) =>
      tag.toLowerCase() === englishName.toLowerCase()
    )
  );
  const relatedPosts = allRelatedPosts.slice(0, 5);

  // Related talks
  const allTalks = [...queryCollection('talks').where({ lang: contentLang(locale) })].sort((a, b) => b.date.localeCompare(a.date));
  const allRelatedTalks = allTalks.filter((talk) =>
    (talk.tags as string[])?.some((tag: string) =>
      tag.toLowerCase() === englishName.toLowerCase()
    )
  );
  const relatedTalks = allRelatedTalks.slice(0, 5);

  // Related GitHub projects
  const allProjects = [...queryCollection('github')];
  const skillSlug = titleToSlug(englishName);
  const allRelatedProjects = allProjects
    .filter((p) => {
      const projectLang = titleToSlug(p.language as string || '');
      return projectLang === skillSlug || (p.topics as string[])?.some((topic: string) => titleToSlug(topic) === skillSlug);
    })
    .sort((a, b) => (b.stargazers_count as number) - (a.stargazers_count as number));
  const relatedProjects = allRelatedProjects.slice(0, 6);

  // Metrics
  const totalPosts = allRelatedPosts.length;
  const totalTalks = allRelatedTalks.length;
  const totalProjects = allRelatedProjects.length;
  const totalStars = allRelatedProjects.reduce((sum, p) => sum + ((p.stargazers_count as number) || 0), 0);

  // Other skills in same category
  const allSkills = getAllSkills(locale);
  const sameCategory = allSkills.filter((s) => s.category === category && s.slug !== slug);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
      { "@type": "ListItem", "position": 2, "name": t(i18n)`Skills`, "item": pageUrl(locale, '/skills') },
      { "@type": "ListItem", "position": 3, "name": skill.name, "item": pageUrl(locale, `/skills/${slug}`) },
    ],
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Tiago Danin",
    "url": pageUrl(locale, '/'),
    "jobTitle": t(i18n)`Mobile Developer`,
    "knowsAbout": [skill.name, category],
    "sameAs": [
      "https://github.com/TiagoDanin",
      "https://linkedin.com/in/tiagodanin",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t(i18n)`${skill.name} Development`,
    "description": t(i18n)`Professional ${skill.name} development services by Tiago Danin`,
    "provider": {
      "@type": "Person",
      "name": "Tiago Danin",
      "url": pageUrl(locale, '/'),
    },
    "serviceType": `${category}, ${skill.name}`,
    "areaServed": t(i18n)`Worldwide`,
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
                    {/* Plural, not a ternary on an English "s": the suffix is a
                        placeholder Lingui cannot pluralize, and Portuguese needs
                        the whole noun to change. */}
                    <span><Plural value={totalProjects} one="# open source project" other="# open source projects" /></span>
                    {totalStars > 0 && <span className="text-yellow-600 dark:text-yellow-400">(<Plural value={totalStars} one="# star" other="# stars" />)</span>}
                  </div>
                )}
                {totalPosts > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                    <BookOpen className="h-4 w-4" />
                    <span><Plural value={totalPosts} one="# article" other="# articles" /></span>
                  </div>
                )}
                {totalTalks > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                    <Mic className="h-4 w-4" />
                    <span><Plural value={totalTalks} one="# talk" other="# talks" /></span>
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
                <Trans>Articles about {skill.name}</Trans>
              </h2>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={entryPath(locale, 'post', post.slug)}
                    className="block group p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <time className="text-xs text-muted-foreground">{formatDate(post.date, intlLocale(locale))}</time>
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
                <Trans>Talks about {skill.name}</Trans>
              </h2>
              <div className="space-y-4">
                {relatedTalks.map((talk) => (
                  <Link
                    key={talk.slug}
                    href={entryPath(locale, 'talk', talk.slug)}
                    className="block group p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <time className="text-xs text-muted-foreground">{formatDate(talk.date, intlLocale(locale))}</time>
                      <Badge variant="secondary" className="text-[10px]">{eventLabel(talk)}</Badge>
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
                <Trans>Open Source Projects</Trans>
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
                      {(project.description as string) || <Trans>No description</Trans>}
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
                <Trans>Other {category} skills</Trans>
              </h2>
              <div className="flex flex-wrap gap-2">
                {sameCategory.map((s) => (
                  <Link key={s.slug} href={localePath(locale, `/skills/${s.slug}`)}>
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
            <h2 className="text-xl font-semibold mb-2"><Trans>Need a {skill.name} developer?</Trans></h2>
            <p className="text-muted-foreground mb-4">
              <Trans>Available for freelance projects, consulting, and mentorship.</Trans>
            </p>
            <Button asChild>
              <a href="mailto:TiagoDanin@outlook.com" className="inline-flex items-center gap-2">
                <Trans>Get in touch</Trans>
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}
