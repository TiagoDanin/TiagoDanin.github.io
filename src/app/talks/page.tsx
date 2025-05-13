import Link from "next/link";
import talks from "@/data/talks.json";
import { Badge } from "@/components/ui/badge";
import { Flag, Mic, Video } from "lucide-react";
import { titleToSlug, getRandomColor } from '@/utils/parse';

export const metadata = {
  title: "Talks",
  description: "Talks and presentations about development, technology and more",
};

const TalksPage = () => {
  const sortedTalks = [...talks].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="container mx-auto py-32">
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Talks</h1>
          <Badge variant="outline" className="flex items-center gap-1">
            <Flag className="h-3 w-3" />
            Only PT-BR
          </Badge>
        </div>
        <p className="mt-4 text-muted-foreground">
          Talks, presentations and workshops about technology and development
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Total talks: {talks.length}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-16">
        {sortedTalks.map((talk) => {
          const slug = titleToSlug(talk.title);
          
          return (
            <article key={talk.id} className="group relative flex flex-col items-start hover:shadow-lg">
              <Link href={`/talk/${slug}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {talk.title}</span>
              </Link>
              <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:bg-zinc-800" />

              <div className="relative z-10 order-first mb-3 flex items-center gap-2">
                <time className="flex items-center text-sm text-zinc-400 pl-3.5">
                  <span className="absolute inset-y-0 left-0 flex items-center">
                    <span className="h-4 w-0.5 rounded-full bg-zinc-200" />
                  </span>
                  {talk.date}
                </time>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Mic className="h-3 w-3" />
                  {talk.event}
                </Badge>
              </div>

              <h2 className="relative z-10 text-base font-semibold tracking-tight">
                <Link href={`/talk/${slug}`} className="relative z-10">
                  <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                  {talk.title}
                </Link>
              </h2>

              <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Link href={`/talk/${slug}`} className="relative z-10">
                  {talk.description}
                </Link>
              </p>

              <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                {talk.tags && talk.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full ${getRandomColor()}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="relative z-10 mt-4 flex items-center text-sm font-medium text-primary">
                {talk.youtubeUrl ? (
                  <div className="flex gap-4">
                    <Link 
                      href={`/talk/${slug}`} 
                      className="flex items-center hover:underline"
                    >
                      View details
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
                        <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                    <Link 
                      href={talk.youtubeUrl} 
                      className="flex items-center text-red-600 dark:text-red-400 hover:underline z-20"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Watch on YouTube
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center">
                    View details
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
                      <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default TalksPage; 