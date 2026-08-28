import Link from "next/link";

/**
 * The 404 body: a ghost numeral behind the message, and two ways out.
 *
 * English, like every not-found on the site. The site ships one `404.html` and
 * GitHub Pages serves it for every miss, Portuguese paths included, so there is
 * no locale to read and nothing worth translating.
 *
 * Rendered by two route files, which is why it lives here rather than in either
 * of them. It was pasted into both once, and deleting one route group deleted
 * the site's visible 404 with it.
 */
export function NotFoundPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-[20rem] font-bold text-gray-100/50 select-none">
          404
        </h1>
      </div>

      <div className="relative z-10 text-center space-y-6 p-8">
        <h2 className="text-4xl font-bold text-gray-900">Page Not Found</h2>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. Please check the URL or return to the homepage.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Return Home
          </Link>
          <a
            href="https://github.com/TiagoDanin/TiagoDanin.github.io/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Report Issue
          </a>
        </div>
      </div>
    </div>
  );
}
