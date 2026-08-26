'use client'

import { Trans, useLingui } from "@lingui/react/macro";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  href?: string;
  archived?: boolean;
}

export function ProjectCard({ title, description, imageUrl, href, archived }: ProjectCardProps) {
  const { t } = useLingui();
  const interactive = Boolean(href);

  return (
    <Card
      className={`relative overflow-hidden ${interactive ? "transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2" : ""}`}
    >
      {/* Overlay anchor, same pattern as ArticleCard: keeps the whole card
          clickable without giving up a real focusable link. */}
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t`${title} (opens in a new tab)`}
          className="absolute inset-0 z-10 focus:outline-none"
        />
      )}
      {imageUrl && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <CardHeader className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          {href && <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
          {archived && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              <Trans>Archived</Trans>
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}