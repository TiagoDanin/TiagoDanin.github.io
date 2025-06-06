import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        The project you're looking for doesn't exist or may have been moved.
      </p>
      <Link 
        href="/projects" 
        className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
      >
        Browse All Projects
      </Link>
    </div>
  );
} 