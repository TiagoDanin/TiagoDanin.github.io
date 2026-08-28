import Link from 'next/link';

/** English only, like every not-found here: there is no locale to read. */
export default function ProjectNotFound() {
  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The project you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/projects"
        className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
      >
        Browse All Projects
      </Link>
    </div>
  );
}
