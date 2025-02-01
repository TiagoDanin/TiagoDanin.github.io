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

const projectSections = [
  {
    title: "GitHub",
    projects: projectsGithub
  },
  {
    title: "Private",
    projects: projectsPrivate
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
    title: "Google Play",
    projects: projectsGooglePlay
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

  // Calculate total projects
  const totalProjects = projectSections.reduce((sum, section) => sum + section.projects.length, 0);

  return (
    <section className="relative py-20">
      {/* Blur effect circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto relative">
        {/* Add title and counter */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Projects</h1>
          <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full font-semibold">
            +{totalProjects} Projects
          </span>
        </div>

        <div id="accordion-color" data-accordion="collapse" data-active-classes="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white">
          {projectSections.map((section, index) => (
            <div key={index}>
              <h2 id={`accordion-color-heading-${index}`}>
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className={`flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 dark:border-gray-700 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-800 gap-3 ${index === 0 ? 'rounded-t-xl' : ''
                    } ${index === projectSections.length - 1 && !expandedSections[section.title] ? 'rounded-b-xl border-b' : ''
                    }`}
                  aria-expanded={expandedSections[section.title]}
                  aria-controls={`accordion-color-body-${index}`}
                >
                  <span className="text-xl">{section.title}</span>
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
                </button>
              </h2>
              <div
                id={`accordion-color-body-${index}`}
                className={`${expandedSections[section.title] ? '' : 'hidden'}`}
                aria-labelledby={`accordion-color-heading-${index}`}
              >
                <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {section.projects.map((project: any, projectIndex) => (
                      <ProjectCard
                        key={projectIndex}
                        {...project}
                        title={project.title || project.name}
                        description={project.description || ''}
                        href={section.urlPrefix ? `${section.urlPrefix}${project.name}` : project.url || project.html_url || null}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}