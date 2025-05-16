import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExternalLink, Github, Package, Archive } from 'lucide-react';

import projectsGithub from "@/data/github.json";
import projectsPrivate from "@/data/private.json";
import projectsNpm from "@/data/npm.json";
import projectsLuarocks from "@/data/luarocks.json";
import projectsPypi from "@/data/pypi.json";
import projectsAtom from "@/data/atom.json";
import projectsGooglePlay from "@/data/googleplay.json";
import projectsMicrosoftStore from "@/data/windows.json";
import projectsAUR from "@/data/aur.json";
import projectsOffline from "@/data/offline.json";

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
  readme_html?: string;
  [key: string]: any;
};

const projectsMap: Record<string, GenericProject[]> = {
  github: projectsGithub as GenericProject[],
  private: projectsPrivate as GenericProject[],
  npm: projectsNpm as GenericProject[],
  luarocks: projectsLuarocks as GenericProject[],
  pypi: projectsPypi as GenericProject[],
  atom: projectsAtom as GenericProject[],
  googleplay: projectsGooglePlay as GenericProject[],
  windows: projectsMicrosoftStore as GenericProject[],
  aur: projectsAUR as GenericProject[],
  offline: projectsOffline as GenericProject[],
};

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

type ProjectType = keyof typeof projectsMap;

export async function generateMetadata({ params }: { params: { type: ProjectType, slug: string } }): Promise<Metadata> {
  const { type, slug } = params;
  
  const projects = projectsMap[type] || [];
  const project = projects.find((p) => 
    (p.name && p.name.toLowerCase() === slug.toLowerCase()) || 
    (p.title && p.title.toLowerCase() === slug.toLowerCase())
  );

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  const title = project.title || project.name || '';
  const description = project.description || `${title} - A ${type} project by Tiago Danin`;

  return {
    title: `${title} on ${type}`,
    description: description,
    openGraph: {
      title: `${title} on ${type}`,
      description: description,
      type: 'article',
      url: `https://tiagodanin.dev/project/${type}/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${type} | Tiago Danin`,
      description: description,
    },
  };
}

export async function generateStaticParams() {
  const params: { type: string, slug: string }[] = [];

  Object.entries(projectsMap).forEach(([type, projects]) => {
    projects.forEach((project) => {
      const slug = (project.name || project.title || '').toLowerCase();
      if (slug) {
        params.push({ type, slug });
      }
    });
  });

  return params;
}

export default function ProjectPage({ params }: { params: { type: ProjectType, slug: string } }) {
  const { type, slug } = params;
  
  const projects = projectsMap[type] || [];
  const project = projects.find((p) => 
    (p.name && p.name.toLowerCase() === slug.toLowerCase()) || 
    (p.title && p.title.toLowerCase() === slug.toLowerCase())
  );

  if (!project) {
    notFound();
  }

  const title = project.title || project.name || '';
  const description = project.description || '';
  const url = urlPrefixMap[type] 
    ? `${urlPrefixMap[type]}${project.name}` 
    : project.url || project.html_url || '';

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

  const isSoftware = ["npm", "pypi", "luarocks", "atom", "github", "aur"].includes(type);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isSoftware ? "SoftwareApplication" : "CreativeWork",
    "name": title,
    "description": description,
    "applicationCategory": isSoftware ? type : undefined,
    "url": url,
    "inLanguage": "en-US",
    "isAccessibleForFree": true
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-32 px-4">
        <div className="max-w-3xl mx-auto">
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
                  Archived
                </span>
              )}
            </div>
            
            {description && (
              <p className="text-lg text-gray-700 dark:text-gray-300">{description}</p>
            )}
          </div>

          {/* Project details - single column layout */}
          <div className="space-y-6 mb-10">
            {/* Project links */}
            {url && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3">Project Link</h2>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  {url}
                </a>
              </div>
            )}

            {/* Installation command */}
            {installCommand && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3">Installation</h2>
                <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
                  <code className="text-sm font-mono">{installCommand}</code>
                </div>
              </div>
            )}

            {/* Project stats */}
            {project.stargazers_count !== undefined && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3">Statistics</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Stars</p>
                    <p className="text-lg font-medium">{project.stargazers_count}</p>
                  </div>
                  {project.forks_count !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Forks</p>
                      <p className="text-lg font-medium">{project.forks_count}</p>
                    </div>
                  )}
                  {project.watchers_count !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Watchers</p>
                      <p className="text-lg font-medium">{project.watchers_count}</p>
                    </div>
                  )}
                  {project.open_issues_count !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Open Issues</p>
                      <p className="text-lg font-medium">{project.open_issues_count}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Created/Updated dates */}
            {(project.created_at || project.updated_at || project.pushed_at) && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3">Timeline</h2>
                {project.created_at && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                    <p>{new Date(project.created_at).toLocaleDateString()}</p>
                  </div>
                )}
                {project.updated_at && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Updated</p>
                    <p>{new Date(project.updated_at).toLocaleDateString()}</p>
                  </div>
                )}
                {project.pushed_at && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Push</p>
                    <p>{new Date(project.pushed_at).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 