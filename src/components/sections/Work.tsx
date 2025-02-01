'use client'

import { useState } from "react";
import { Briefcase, Code as CodeIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import workData from "@/data/work.json";
import volunteerData from "@/data/volunteer.json";
import { ExperienceItem } from "@/components/ui/experience-item";

export function Work() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="work" className="relative py-20 overflow-hidden">
      {/* Blur effect circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto relative px-4">
        {/* Title and description */}
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Experience & Skills</h2>
          <p className="mt-4 text-muted-foreground">
            My professional journey and the technical skills I've developed over the years.
          </p>
        </div>

        {/* Two cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Experience Card */}
          <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl relative">
            <div className={`${isExpanded ? '' : 'h-[600px] overflow-hidden'} relative`}>
              <h3 className="flex text-sm font-semibold items-center">
                <Briefcase className="h-5 w-5 flex-none" />
                <span className="ml-3">Professional Experience</span>
              </h3>

              {/* Experience */}
              <ol className="mt-6 space-y-6">
                <h3 className="flex text-sm font-semibold items-center">
                  <span>Experience</span>
                </h3>

                {workData.map((job, index) => (
                  <ExperienceItem
                    key={index}
                    company={job.company}
                    role={job.role}
                    startDate={job.startDate}
                    endDate={job.endDate}
                    logo={job.logo}
                    description={job.description}
                  />
                ))}
              </ol>

              {/* Volunteering */}
              <ol className="mt-8 space-y-6">
                <h3 className="flex text-sm font-semibold items-center">
                  <span>Volunteering</span>
                </h3>

                {volunteerData.map((job, index) => (
                  <ExperienceItem
                    key={index}
                    company={job.organization}
                    role={job.role}
                    startDate={job.startDate}
                    endDate={job.endDate}
                    logo={job.logo}
                    description={job.description}
                  />
                ))}
              </ol>

              <Button className="w-full group" variant="outline" asChild>
                <a href="https://linkedin.com/in/tiagodanin" className="inline-flex items-center gap-2">
                  Open CV
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4 stroke-muted-foreground transition group-hover:stroke-primary">
                    <path d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </Button>

              {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card/90 to-transparent pointer-events-none" />
              )}
            </div>

            {!isExpanded && (<div className="flex flex-col gap-3 mt-6">
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="outline"
                className="w-full"
              >

                <span className="flex items-center gap-2">
                  Show More <ChevronDown className="h-4 w-4" />
                </span>
              </Button>
            </div>)}

          </div>

          {/* Skills Card */}
          <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl">
            <h3 className="flex text-sm font-semibold items-center">
              <CodeIcon className="h-5 w-5 flex-none" />
              <span className="ml-3">Technical Skills</span>
            </h3>

            <div className="mt-6 space-y-6">
              {/* Mobile */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Mobile Development</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="skill-tag bg-[#02569B] text-white">Flutter</span>
                  <span className="skill-tag bg-[#61DAFB] text-black">React Native</span>
                  <span className="skill-tag bg-[#3498DB] text-white">Xamarin</span>
                  <span className="skill-tag bg-[#B07219] text-white">Java</span>
                  <span className="skill-tag bg-[#A97BFF] text-white">Kotlin</span>
                  <span className="skill-tag bg-[#438EFF] text-white">Obj-C</span>
                  <span className="skill-tag bg-[#F05138] text-white">Swift</span>
                  <span className="skill-tag bg-[#F05138] text-white">SwiftUI</span>
                  <span className="skill-tag bg-[#A97BFF] text-white">Jetpack Compose</span>
                  <span className="skill-tag bg-[#3880FF] text-white">Ionic</span>
                </div>
              </div>

              {/* DevOps */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">DevOps</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="skill-tag bg-[#FFCA28] text-black">Firebase</span>
                  <span className="skill-tag bg-[#FC6D26] text-white">GitLab CI/CD</span>
                  <span className="skill-tag bg-[#2088FF] text-white">GitHub CI/CD</span>
                  <span className="skill-tag bg-[#0078D4] text-white">Azure</span>
                  <span className="skill-tag bg-[#4285F4] text-white">Google Cloud</span>
                  <span className="skill-tag bg-[#2496ED] text-white">Docker</span>
                </div>
              </div>

              {/* Frontend */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="skill-tag bg-[#61DAFB] text-black">React</span>
                  <span className="skill-tag bg-[#4FC08D] text-white">Vue.js</span>
                  <span className="skill-tag bg-[#3178C6] text-white">TypeScript</span>
                  <span className="skill-tag bg-[#264DE4] text-white">CSS</span>
                  <span className="skill-tag bg-[#E34F26] text-white">HTML</span>
                </div>
              </div>

              {/* Backend */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="skill-tag bg-[#339933] text-white">Node.js</span>
                  <span className="skill-tag bg-[#000000] text-white">Express</span>
                  <span className="skill-tag bg-[#4B275F] text-white">Elixir</span>
                  <span className="skill-tag bg-[#336791] text-white">PostgreSQL</span>
                  <span className="skill-tag bg-[#003B57] text-white">SQLite</span>
                </div>
              </div>

              {/* Design */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Design</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="skill-tag bg-[#F24E1E] text-white">Figma</span>
                  <span className="skill-tag bg-[#0ACF83] text-white">Mobile UX</span>
                  <span className="skill-tag bg-[#FF61F6] text-white">Adobe XD</span>
                  <span className="skill-tag bg-[#20C4CB] text-white">Canva</span>
                </div>
              </div>

              {/* Soft Skills */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="skill-tag bg-purple-600 text-white">Leadership</span>
                  <span className="skill-tag bg-blue-600 text-white">Team Management</span>
                  <span className="skill-tag bg-green-600 text-white">Problem Solving</span>
                  <span className="skill-tag bg-indigo-600 text-white">Communication</span>
                  <span className="skill-tag bg-rose-600 text-white">Organization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}