'use client'
import { Trans } from "@lingui/react/macro";

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

  const toggle = () => setIsExpanded(prev => !prev);
  const isDateLike = (value: string) => /^\d{4}(-\d{2}(-\d{2})?)?$/.test(value);

  return (
    <li
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      className="flex flex-col gap-4 group cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <div className="flex gap-4">
        <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-background/50 shadow-xs ring-1 ring-slate-900/5 transition group-hover:bg-background">
          <Image
            src={logo}
            alt={company}
            className="h-7 w-7"
            width={28}
            height={28}
          />
        </div>
        <dl className="flex flex-auto flex-wrap gap-x-2">

          <dt className="sr-only"><Trans>Company</Trans></dt>
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
          <dt className="sr-only"><Trans>Role</Trans></dt>
          <dd className="text-xs text-muted-foreground">
            {role}
          </dd>
          <dt className="sr-only"><Trans>Date</Trans></dt>
          <dd className="ml-auto text-xs text-muted-foreground">
            {isDateLike(startDate) ? <time dateTime={startDate}>{startDate}</time> : <span>{startDate}</span>}
            <span aria-hidden="true"> – </span>
            {isDateLike(endDate) ? <time dateTime={endDate}>{endDate}</time> : <span>{endDate}</span>}
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