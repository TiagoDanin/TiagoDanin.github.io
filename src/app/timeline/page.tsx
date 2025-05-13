import Link from "next/link";
import timelineData from "@/data/timeline.json";

export const metadata = {
  title: "Timeline",
  description: "My professional journey and career milestones",
};

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/🏆|🎓|🗣️|💻|📱|🎮|🖥|🔬|😍|📚|🏐/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

const Timeline = () => {
  const getRandomColor = () => {
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="container mx-auto py-20">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>

      <ol className="relative border-s border-gray-200 dark:border-gray-700 max-w-3xl">
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
  );
};

export default Timeline;