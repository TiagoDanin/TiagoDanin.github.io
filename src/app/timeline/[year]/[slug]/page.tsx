import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

import timelineData from "@/data/timeline.json";

type TimelineEvent = {
  date: string;
  title: string;
  description: string;
  tags: string[];
};

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/🏆|🎓|🗣️|💻|📱|🎮|🖥|🔬|😍|📚|🏐/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

export async function generateMetadata({ params }: { params: { year: string, slug: string } }): Promise<Metadata> {
  const { year, slug } = params;
  
  const event = timelineData.find((item) => {
    const itemYear = item.date.toString();
    const itemSlug = titleToSlug(item.title);
    return itemYear === year && itemSlug === slug;
  });

  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'The requested timeline event could not be found.',
    };
  }

  return {
    title: `${event.title} (${event.date})`,
    description: event.description,
    openGraph: {
      title: `${event.title} (${event.date})`,
      description: event.description,
      type: 'article',
      url: `https://tiagodanin.com/timeline/${year}/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.title} | ${event.date} | Tiago Danin`,
      description: event.description,
    },
  };
}

export async function generateStaticParams() {
  const params: { year: string, slug: string }[] = [];

  timelineData.forEach((event) => {
    const year = event.date.toString();
    const slug = titleToSlug(event.title);
    
    if (year && slug) {
      params.push({ year, slug });
    }
  });

  return params;
}

export default function TimelineEventPage({ params }: { params: { year: string, slug: string } }) {
  const { year, slug } = params;
  
  const event = timelineData.find((item) => {
    const itemYear = item.date.toString();
    const itemSlug = titleToSlug(item.title);
    return itemYear === year && itemSlug === slug;
  });

  if (!event) {
    notFound();
  }

  const getRandomColor = (tag: string) => {
    const colors = [
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
    ];

    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="container mx-auto py-32 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Event header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-6 w-6" />
            <h1 className="text-3xl font-bold">{event.title}</h1>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-3 py-1 rounded-full text-sm">
              {event.date}
            </span>
            {event.tags.map((tag, index) => (
              <span 
                key={index} 
                className={`px-3 py-1 rounded-full text-sm ${getRandomColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Back to timeline link */}
        <div className="mt-10">
          <Link 
            href="/timeline" 
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
} 