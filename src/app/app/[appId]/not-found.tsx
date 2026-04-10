import Link from "next/link";

export default function AppNotFound() {
  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">App Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The app you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/apps"
        className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
      >
        Browse All Apps
      </Link>
    </div>
  );
}
