'use client'

import { useState } from "react";
import Image from 'next/image'

interface ExperienceItemProps {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  logo: string;
  description: string;
}

export function ExperienceItem({ company, role, startDate, endDate, logo, description }: ExperienceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li 
      className="flex flex-col gap-4 group cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-all"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex gap-4">
        <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-background/50 shadow-sm ring-1 ring-zinc-900/5 transition group-hover:bg-background">
          <Image
            src={logo}
            alt={company}
            className="h-7 w-7"
            width={28}
            height={28}
          />
        </div>
        <dl className="flex flex-auto flex-wrap gap-x-2">

          <dt className="sr-only">Company</dt>
          <dd className="w-full flex-none text-sm font-medium flex items-center justify-between">
            {company}
            <svg
              className={`w-5 h-5 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </dd>
          <dt className="sr-only">Role</dt>
          <dd className="text-xs text-muted-foreground">
            {role}
          </dd>
          <dt className="sr-only">Date</dt>
          <dd className="ml-auto text-xs text-muted-foreground">
            <time dateTime={startDate}>{startDate}</time>
            <span aria-hidden="true"> — </span>
            <time dateTime={endDate}>{endDate}</time>
          </dd>
        </dl>
      </div>
      
      {/* Description expanded */}
      {isExpanded && (
        <div className="ml-14 text-sm text-muted-foreground animate-fadeIn">
          {description}
        </div>
      )}
    </li>
  );
} 