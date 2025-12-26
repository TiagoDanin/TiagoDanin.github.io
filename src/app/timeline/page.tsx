import Link from "next/link";
import timelineData from "@/data/timeline.json";
import { titleToSlug, getRandomColor, toISODate } from '@/utils/parse';

export const metadata = {
  title: "Timeline",
  description: "Professional journey and career milestones of Tiago Danin. From education to current work in mobile development and cybersecurity.",
  keywords: ["timeline", "career", "professional journey", "work history", "experience"],
  alternates: {
    canonical: 'https://tiagodanin.com/timeline',
    types: {
      'application/rss+xml': [
        { url: '/rss/timeline.xml', title: 'Timeline RSS Feed' }
      ],
    },
  },
  openGraph: {
    title: "Professional Timeline - Tiago Danin",
    description: "Career milestones and professional journey from education to current work in mobile development.",
    url: "https://tiagodanin.com/timeline",
    type: "profile",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Professional Timeline - Tiago Danin",
    description: "Career milestones and professional journey.",
  },
};

const Timeline = () => {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": timelineData.map((item) => ({
          "@type": "Event",
          "name": item.title,
          "description": item.description,
          "startDate": toISODate(item.date),
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "location": {
            "@type": "Place",
            "name": item.title
          },
          "organizer": {
            "@type": "Organization",
            "name": item.title
          },
          "performer": {
            "@type": "Person",
            "name": "Tiago Danin"
          },
          "url": `/timeline/${item.date.toString()}/${titleToSlug(item.title)}`,
          "inLanguage": "pt-BR"
        }))
      }) }} />
      <div className="container mx-auto py-20 px-4 sm:px-6 relative">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 hidden sm:block"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2 hidden sm:block"></div>

        <ol className="relative border-s border-gray-200 dark:border-gray-700 max-w-3xl w-full mx-auto">
          {timelineData.map((item, index) => {
            const year = item.date.toString();
            const slug = titleToSlug(item.title);
            
            return (
              <li key={index} className="mb-10 ms-4">
                {/* Timeline dot */}
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

                <div className="mb-2">
                  {/* Year tag */}
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300">
                    {item.date.toString().includes('-')
                      ? new Date(item.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })
                      : item.date}
                  </span>

                  {/* Tags */}
                  {item.tags && item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`text-sm font-medium px-3 ml-2 py-1 rounded-full ${getRandomColor()}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Content */}
                <Link href={`/timeline/${year}/${slug}`} className="block group">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
};

export default Timeline;