import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExternalLink, Github, Package, Archive, Globe, Scale, Download, Tag, Hash } from 'lucide-react';
import Link from 'next/link';
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';

import { queryCollection } from 'nextjs-studio/server';
import { titleToSlug } from "@/utils/parse";
import { localePath } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, markdownAlternate, openGraphLocale, pageUrl } from '@/lib/i18n/seo';

type LicenseInfo = {
  key?: string;
  name?: string;
  spdx_id?: string;
  url?: string;
};

type GenericProject = {
  name?: string;
  title?: string;
  description?: string;
  url?: string;
  html_url?: string;
  language?: string;
  archived?: boolean;
  stargazers_count?: number;
  forks_count?: number;
  watchers_count?: number;
  open_issues_count?: number;
  created_at?: string;
  updated_at?: string;
  pushed_at?: string;
  homepage?: string;
  topics?: string[];
  license?: LicenseInfo;
  keywords?: string[];
  downloads?: number;
  version?: string;
  scope?: string;
  [key: string]: unknown;
};

// This map has no locale variant: the ten project collections carry no
// index.br.json, so the catalogue is the same list for every language.
function getProjectsMap(): Record<string, GenericProject[]> {
  return {
    github: queryCollection('github') as unknown as GenericProject[],
    private: queryCollection('private') as unknown as GenericProject[],
    npm: queryCollection('npm') as unknown as GenericProject[],
    luarocks: queryCollection('luarocks') as unknown as GenericProject[],
    pypi: queryCollection('pypi') as unknown as GenericProject[],
    atom: queryCollection('atom') as unknown as GenericProject[],
    googleplay: queryCollection('googleplay') as unknown as GenericProject[],
    windows: queryCollection('windows') as unknown as GenericProject[],
    aur: queryCollection('aur') as unknown as GenericProject[],
    offline: queryCollection('offline') as unknown as GenericProject[],
  };
}

const urlPrefixMap: Record<string, string> = {
  npm: "https://www.npmjs.com/package/",
  luarocks: "https://luarocks.org/modules/tiagodanin/",
  pypi: "https://pypi.python.org/pypi/",
  atom: "https://atom.io/packages/",
  github: "",
  private: "",
  googleplay: "",
  windows: "",
  aur: "",
  offline: "",
};

type ProjectType = string;

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  // Project data carries no locale variant, so every language gets the same
  // full set of type/slug pairs.
  resolveLocale(params.lang);
  const projectsMap = getProjectsMap();
  const result: { type: string, slug: string }[] = [];

  Object.entries(projectsMap).forEach(([type, projects]) => {
    projects.forEach((project) => {
      const slug = titleToSlug(project.name || project.title || '');
      if (slug) {
        result.push({ type, slug });
      }
    });
  });

  return result;
}

export async function generateMetadata({ params }: PageProps<'/[lang]/project/[type]/[slug]'>): Promise<Metadata> {
  const { lang, type, slug } = await params;
  const locale = resolveLocale(lang);
  const i18n = getI18nInstance(locale);

  const projectsMap = getProjectsMap();
  const projects = projectsMap[type] || [];
  const project = projects.find((p) =>
    (p.name && titleToSlug(p.name) === slug) ||
    (p.title && titleToSlug(p.title) === slug)
  );

  if (!project) {
    return {
      title: t(i18n)`Project Not Found`,
      description: t(i18n)`The requested project could not be found.`,
    };
  }

  const title = project.title || project.name || '';
  const baseDescription = (project.description || '').trim();

  const url = urlPrefixMap[type]
    ? `${urlPrefixMap[type]}${project.name}`
    : project.html_url || project.url || '';

  const isSoftware = ["npm", "pypi", "luarocks", "atom", "github", "aur"].includes(type);

  const platformLabel: Record<string, string> = {
    npm: t(i18n)`NPM Package`,
    pypi: t(i18n)`PyPI Package`,
    luarocks: t(i18n)`LuaRocks Module`,
    atom: t(i18n)`Atom Package`,
    github: t(i18n)`Open Source Project`,
    aur: t(i18n)`AUR Package`,
    googleplay: t(i18n)`Android App`,
    windows: t(i18n)`Windows App`,
    private: t(i18n)`Project`,
    offline: t(i18n)`Project`,
  };
  const platformContext = platformLabel[type] ?? type;
  const seoTitle = t(i18n)`${title} | ${platformContext}`;

  const tags = Array.from(new Set([
    ...(Array.isArray(project.topics) ? project.topics : []),
    ...(Array.isArray(project.keywords) ? project.keywords : []),
  ].map((tg) => String(tg).toLowerCase()).filter(Boolean))).slice(0, 5);

  const languageLabel = project.language ? t(i18n)` Built with ${project.language}.` : '';
  const tagsLabel = tags.length ? t(i18n)` Topics: ${tags.join(', ')}.` : '';
  const starsLabel = project.stargazers_count ? t(i18n)` ${project.stargazers_count} stars on GitHub.` : '';
  const downloadsLabel = project.downloads ? t(i18n)` ${Number(project.downloads).toLocaleString('en-US')} downloads.` : '';
  const licenseName = (project.license as LicenseInfo | undefined)?.name;
  const licenseLabel = licenseName ? t(i18n)` Licensed under ${licenseName}.` : '';

  const MIN_DESCRIPTION_LEN = 50;
  const isThin = baseDescription.length < MIN_DESCRIPTION_LEN;

  let enrichedDescription: string;
  if (isThin) {
    const lead = baseDescription
      ? `${baseDescription}.`
      : t(i18n)`${title}: ${platformContext} by Tiago Danin.`;
    enrichedDescription = `${lead}${languageLabel}${tagsLabel}${starsLabel}${downloadsLabel}${licenseLabel}`.trim();
  } else {
    enrichedDescription = `${baseDescription}${languageLabel}${starsLabel}${downloadsLabel}`.trim();
  }

  const truncatedDescription = enrichedDescription.length > 160
    ? enrichedDescription.substring(0, 157) + '...'
    : enrichedDescription;

  const path = `/project/${type}/${slug}`;

  return {
    title: seoTitle,
    description: truncatedDescription,
    keywords: [
      title, type, project.language, 'open source', 'Tiago Danin',
      ...(isSoftware ? ['developer tools', 'package'] : ['portfolio']),
      ...((project.topics as string[]) || []),
      ...((project.keywords as string[]) || []),
    ].filter(Boolean) as string[],
    alternates: {
      ...localeAlternates(locale, path),
      types: markdownAlternate(path),
    },
    openGraph: {
      title: t(i18n)`${title} - ${(baseDescription || enrichedDescription).substring(0, 60)}`,
      description: truncatedDescription,
      type: 'article',
      url: pageUrl(locale, path),
      ...openGraphLocale(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: truncatedDescription,
    },
    other: {
      'application/ld+json': JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": isSoftware ? "SoftwareApplication" : "CreativeWork",
          "name": title,
          "description": project.description || truncatedDescription,
          "applicationCategory": isSoftware ? type : undefined,
          "url": url,
          "inLanguage": "en-US",
          "isAccessibleForFree": true,
          ...(project.language && { "programmingLanguage": project.language }),
          ...(project.created_at && { "dateCreated": project.created_at }),
          ...(project.updated_at && { "dateModified": project.updated_at }),
          ...((project.license as LicenseInfo)?.spdx_id && { "license": `https://spdx.org/licenses/${(project.license as LicenseInfo).spdx_id}` }),
          ...((project.topics as string[])?.length && { "keywords": (project.topics as string[]).join(', ') }),
          ...((project.keywords as string[])?.length && { "keywords": (project.keywords as string[]).join(', ') }),
          ...(project.stargazers_count && {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": Math.min(5, Math.max(1, Math.round(project.stargazers_count / 10))),
              "ratingCount": project.stargazers_count,
              "bestRating": 5
            }
          }),
          "author": {
            "@type": "Person",
            "name": "Tiago Danin",
            "url": pageUrl(locale, '/')
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": t(i18n)`Home`,
              "item": pageUrl(locale, '/')
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": t(i18n)`Projects`,
              "item": pageUrl(locale, '/projects')
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": type.charAt(0).toUpperCase() + type.slice(1),
              "item": `${pageUrl(locale, '/projects')}#${type}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": title,
              "item": pageUrl(locale, path)
            }
          ]
        }
      ])
    }
  };
}

export default async function ProjectPage({ params }: PageProps<'/[lang]/project/[type]/[slug]'>) {
  const { lang, type, slug } = await params;
  const locale = resolveLocale(lang);
  const i18n = initI18n(locale);

  const projectsMap = getProjectsMap();
  const projects = projectsMap[type] || [];
  const project = projects.find((p) =>
    (p.name && titleToSlug(p.name) === slug) ||
    (p.title && titleToSlug(p.title) === slug)
  );

  if (!project) {
    notFound();
  }

  const title = project.title || project.name || '';
  const baseDescription = (project.description || '').trim();
  const url = urlPrefixMap[type]
    ? `${urlPrefixMap[type]}${project.name}`
    : project.html_url || project.url || '';

  const isSoftware = ["npm", "pypi", "luarocks", "atom", "github", "aur"].includes(type);

  const platformDisplayLabels: Record<string, string> = {
    npm: t(i18n)`NPM Package`,
    pypi: t(i18n)`PyPI Package`,
    luarocks: t(i18n)`LuaRocks Module`,
    atom: t(i18n)`Atom Package`,
    github: t(i18n)`Open Source Project`,
    aur: t(i18n)`AUR Package`,
    googleplay: t(i18n)`Android App`,
    windows: t(i18n)`Windows App`,
    private: t(i18n)`Project`,
    offline: t(i18n)`Project`,
  };
  const platformLabel = platformDisplayLabels[type] ?? type;

  const allTags = Array.from(new Set([
    ...(Array.isArray(project.topics) ? project.topics : []),
    ...(Array.isArray(project.keywords) ? project.keywords : []),
  ].filter(Boolean) as string[]));

  const licenseInfo = project.license as LicenseInfo | undefined;
  const licenseDisplay = licenseInfo?.spdx_id || licenseInfo?.name;

  const sentences: string[] = [];
  if (baseDescription) {
    sentences.push(baseDescription.endsWith('.') ? baseDescription : `${baseDescription}.`);
  } else {
    sentences.push(t(i18n)`${title} is a ${platformLabel.toLowerCase()} by Tiago Danin.`);
  }
  if (project.language) {
    sentences.push(t(i18n)`Built with ${project.language}.`);
  }
  if (allTags.length) {
    sentences.push(t(i18n)`Topics: ${allTags.slice(0, 6).join(', ')}.`);
  }
  if (project.stargazers_count) {
    sentences.push(t(i18n)`${project.stargazers_count} stars on GitHub.`);
  }
  if (project.downloads) {
    sentences.push(t(i18n)`${Number(project.downloads).toLocaleString('en-US')} downloads.`);
  }
  if (licenseDisplay) {
    sentences.push(t(i18n)`Licensed under ${licenseDisplay}.`);
  }
  const enrichedDisplayDescription = sentences.join(' ');
  const isThin = baseDescription.length < 50;

  const crossPlatformSiblings = isSoftware
    ? Object.entries(projectsMap)
        .flatMap(([siblingType, siblingProjects]) =>
          siblingType !== type
            ? siblingProjects
                .filter((p) => (p.name || p.title) && titleToSlug(p.name || p.title || '') === slug)
                .map((p) => ({
                  type: siblingType,
                  slug: titleToSlug(p.name || p.title || ''),
                  label: platformDisplayLabels[siblingType] ?? siblingType,
                }))
            : []
        )
    : [];

  const getInstallCommand = () => {
    switch (type) {
      case 'npm':
        return `npm install ${project.name}`;
      case 'github':
        return `git clone ${project.html_url || project.url}`;
      case 'pypi':
        return `pip install ${project.name}`;
      case 'luarocks':
        return `luarocks install ${project.name}`;
      case 'aur':
        return `yay -S ${project.name}`;
      case 'atom':
        return `apm install ${project.name}`;
      default:
        return null;
    }
  };

  const installCommand = getInstallCommand();

  // Google Play apps have a richer dedicated page at /app/[slug]
  const googlePlaySlug = type === 'googleplay' ? (project as GenericProject & { slug?: string }).slug : null;

  return (
    <>
      <div className="container mx-auto py-32 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Google Play banner */}
          {googlePlaySlug && (
            <Link
              href={localePath(locale, `/app/${googlePlaySlug}`)}
              className="flex items-center gap-2 mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <span className="text-2xl">📱</span>
              <span className="text-green-800 dark:text-green-200 font-medium">
                <Trans>View the full app page with features, screenshots and build story</Trans>
              </span>
              <ExternalLink className="h-4 w-4 text-green-600 dark:text-green-400 ml-auto" />
            </Link>
          )}

          {/* Project header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {type === 'github' && <Github className="h-6 w-6" />}
              {type === 'npm' && <Package className="h-6 w-6" />}
              {project.archived && <Archive className="h-6 w-6 text-red-500" />}
              <h1 className="text-3xl font-bold">{title}</h1>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-3 py-1 rounded-full text-sm">
                {type}
              </span>
              {project.language && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm">
                  {project.language}
                </span>
              )}
              {project.archived && (
                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 px-3 py-1 rounded-full text-sm">
                  <Trans>Archived</Trans>
                </span>
              )}
            </div>

            {baseDescription && (
              <p className="text-lg text-gray-700 dark:text-gray-300">{baseDescription}</p>
            )}

            {isThin && (
              <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                {enrichedDisplayDescription}
              </p>
            )}

            {crossPlatformSiblings.length > 0 && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                <Trans>Also available as:</Trans>{' '}
                {crossPlatformSiblings.map((s, i) => (
                  <span key={`${s.type}-${s.slug}`}>
                    <Link
                      href={localePath(locale, `/project/${s.type}/${s.slug}`)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    >
                      {s.label}
                    </Link>
                    {i < crossPlatformSiblings.length - 1 ? ', ' : ''}
                  </span>
                ))}
                .
              </p>
            )}

            {/* Topics / Keywords */}
            {(() => {
              const tags = (project.topics as string[]) || (project.keywords as string[]) || [];
              if (tags.length === 0) return null;
              return (
                <div className="flex flex-wrap gap-2 mt-4">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      href={localePath(locale, `/tags/${titleToSlug(tag)}`)}
                      className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Hash className="h-3 w-3" />
                      {tag}
                    </Link>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Project details - single column layout */}
          <div className="space-y-6 mb-10">
            {/* Project links */}
            {(url || project.homepage) && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3"><Trans>Links</Trans></h2>
                <div className="space-y-2">
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {type === 'github' ? t(i18n)`Repository` : type === 'npm' ? t(i18n)`npm Package` : t(i18n)`Project Page`}
                    </a>
                  )}
                  {project.homepage && project.homepage !== url && (
                    <a
                      href={project.homepage as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Globe className="h-4 w-4" />
                      <Trans>Homepage</Trans>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Installation command */}
            {installCommand && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3"><Trans>Installation</Trans></h2>
                <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
                  <code className="text-sm font-mono">{installCommand}</code>
                </div>
              </div>
            )}

            {/* License */}
            {project.license && (project.license as LicenseInfo).name && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3"><Trans>License</Trans></h2>
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-gray-500" />
                  <span>{(project.license as LicenseInfo).spdx_id || (project.license as LicenseInfo).name}</span>
                </div>
              </div>
            )}

            {/* Project stats */}
            {(project.stargazers_count !== undefined || project.downloads !== undefined) && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3"><Trans>Statistics</Trans></h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {project.stargazers_count !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400"><Trans>Stars</Trans></p>
                      <p className="text-lg font-medium">{project.stargazers_count}</p>
                    </div>
                  )}
                  {project.forks_count !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400"><Trans>Forks</Trans></p>
                      <p className="text-lg font-medium">{project.forks_count}</p>
                    </div>
                  )}
                  {project.watchers_count !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400"><Trans>Watchers</Trans></p>
                      <p className="text-lg font-medium">{project.watchers_count}</p>
                    </div>
                  )}
                  {project.open_issues_count !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400"><Trans>Open Issues</Trans></p>
                      <p className="text-lg font-medium">{project.open_issues_count}</p>
                    </div>
                  )}
                  {project.downloads !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400"><Trans>Downloads</Trans></p>
                      <p className="text-lg font-medium flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {(project.downloads as number).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {project.version && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400"><Trans>Version</Trans></p>
                      <p className="text-lg font-medium flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        {project.version as string}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Created/Updated dates */}
            {(project.created_at || project.updated_at || project.pushed_at) && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3"><Trans>Timeline</Trans></h2>
                {project.created_at && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400"><Trans>Created</Trans></p>
                    <p>{new Date(project.created_at).toLocaleDateString()}</p>
                  </div>
                )}
                {project.updated_at && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400"><Trans>Updated</Trans></p>
                    <p>{new Date(project.updated_at).toLocaleDateString()}</p>
                  </div>
                )}
                {project.pushed_at && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400"><Trans>Last Push</Trans></p>
                    <p>{new Date(project.pushed_at).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Related Projects Section */}
          {(() => {
            // Get related projects from the same type or with the same language
            const relatedProjects = projects
              .filter((p) => {
                const pTitle = p.title || p.name || '';
                return (
                  (p.language === project.language || type === type) &&
                  titleToSlug(pTitle) !== slug
                );
              })
              .slice(0, 3);

            if (relatedProjects.length === 0) return null;

            return (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6"><Trans>Related Projects</Trans></h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {relatedProjects.map((relatedProject, idx) => {
                    const relatedTitle = relatedProject.title || relatedProject.name || '';
                    const relatedSlug = titleToSlug(relatedTitle);

                    return (
                      <Link
                        key={idx}
                        href={localePath(locale, `/project/${type}/${relatedSlug}`)}
                        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      >
                        <h3 className="font-semibold mb-2 text-lg">{relatedTitle}</h3>
                        {relatedProject.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {relatedProject.description}
                          </p>
                        )}
                        {relatedProject.language && (
                          <span className="inline-block mt-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded text-xs">
                            {relatedProject.language}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}
