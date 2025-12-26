'use client'

import { ProjectCard } from "@/components/ui/ProjectCard";
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
import { useState } from "react";

const otherProjectsPrivateCount = 55;
const projectSections = [
  {
    title: "GitHub",
    projects: projectsGithub
  },
  {
    title: "Google Play",
    projects: projectsGooglePlay
  },
  {
    title: "NPM",
    projects: projectsNpm,
    urlPrefix: "https://www.npmjs.com/package/"
  },
  {
    title: "LuaRocks",
    projects: projectsLuarocks,
    urlPrefix: "https://luarocks.org/modules/tiagodanin/"
  },
  {
    title: "Pypi",
    projects: projectsPypi,
    urlPrefix: "https://pypi.python.org/pypi/"
  },
  {
    title: "Atom",
    projects: projectsAtom,
    urlPrefix: "https://atom.io/packages/"
  },
  {
    title: "Microsoft Store",
    projects: projectsMicrosoftStore
  },
  {
    title: "AUR Archlinux",
    projects: projectsAUR
  },
  {
    title: "Private",
    projects: projectsPrivate
  },
  {
    title: "Offline/Old Websites",
    projects: projectsOffline
  }
];

export function FullProjects() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const totalProjects = projectSections.reduce((sum, section) => sum + section.projects.length, otherProjectsPrivateCount);

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Blur effect circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-20 sm:opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-20 sm:opacity-30 translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto relative mb-2 pb-2 px-4">
        {/* Add title and counter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">All Projects</h1>
          <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full font-semibold text-sm sm:text-base">
            {totalProjects} Projects
          </span>
        </div>

        <div
          id="accordion-color"
          data-accordion="collapse"
          data-active-classes="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white"
          className="shadow-md rounded-b-xl"
        >
          {projectSections.map((section, index) => (
            <div key={index}>
              <h2 id={`accordion-color-heading-${index}`}>
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className={`flex items-center justify-between w-full p-4 sm:p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 dark:border-gray-700 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-800 gap-3 min-h-[44px] ${index === 0 ? 'rounded-t-xl' : ''
                    } ${index === projectSections.length - 1 && !expandedSections[section.title] ? 'rounded-b-xl border-b' : ''
                    }`}
                  aria-expanded={expandedSections[section.title]}
                  aria-controls={`accordion-color-body-${index}`}
                  aria-label={`Toggle ${section.title} projects section`}
                >
                  <span className="text-base sm:text-lg lg:text-xl">{section.title}</span>
                  <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs sm:text-sm">
                      {section.title === "Private" ?
                        projectsPrivate.length + otherProjectsPrivateCount :
                        section.projects.length
                      } projects
                    </span>
                    <svg
                      className={`w-3 h-3 shrink-0 transition-transform ${expandedSections[section.title] ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5 5 1 1 5"
                      />
                    </svg>
                  </div>
                </button>
              </h2>
              <div
                id={`accordion-color-body-${index}`}
                className={`${expandedSections[section.title] ? '' : 'hidden'}`}
                aria-labelledby={`accordion-color-heading-${index}`}
              >
                <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                  {section.title === "Private" ? (
                    <div className="space-y-8">
                      {/* Regular Private Projects */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                          Regular Projects ({projectsPrivate.length})
                        </h3>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {projectsPrivate.map((project: any, projectIndex) => (
                            <ProjectCard
                              key={projectIndex}
                              {...project}
                              title={project.title || project.name}
                              description={project.description || ''}
                              href={section.urlPrefix ? `${section.urlPrefix}${project.name}` : project.homepage || project.html_url || project.url || null}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Other Projects - Easter Egg */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Other 🥚
                          </h3>
                          <span className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded text-sm font-bold">
                            {otherProjectsPrivateCount} secret projects
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {section.projects.map((project: any, projectIndex) => (
                        <ProjectCard
                          key={projectIndex}
                          {...project}
                          title={project.title || project.name}
                          description={project.description || ''}
                          href={section.urlPrefix ? `${section.urlPrefix}${project.name}` : project.homepage || project.html_url || project.url || null}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}