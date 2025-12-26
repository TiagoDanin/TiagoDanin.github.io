'use client'

import { ProjectCard } from "@/components/ui/ProjectCard";
import projectsGithub from "@/data/github.json";
import { useState, useMemo } from "react";

export default function GitHubPagesSection() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter projects that have homepage field and match search
  const githubPages = useMemo(() => {
    const pages = projectsGithub.filter((project: any) =>
      project.homepage && project.homepage.trim() !== ""
    );

    if (!searchQuery) return pages;

    return pages.filter((project: any) =>
      project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Blur effect circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-20 sm:opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-20 sm:opacity-30 translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto relative px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              GitHub Pages
            </h1>
            <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full font-semibold text-sm sm:text-base">
              {githubPages.length} Pages
            </span>
          </div>

          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-6">
            Browse all my GitHub Pages projects with live demos and documentation
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 min-h-[44px]"
              aria-label="Search GitHub Pages projects"
            />
          </div>
        </div>

        {/* Projects grid */}
        {githubPages.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {githubPages.map((project: any, index) => (
              <ProjectCard
                key={index}
                {...project}
                title={project.name}
                description={project.description || ''}
                href={project.homepage}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No projects found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
