import Link from 'next/link';
import { Trans } from '@lingui/react/macro';

export default function TimelineEventNotFound() {
  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4"><Trans>Timeline Event Not Found</Trans></h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        <Trans>The event you&apos;re looking for doesn&apos;t exist or may have been moved.</Trans>
      </p>
      <Link
        href="/timeline"
        className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
      >
        <Trans>View Full Timeline</Trans>
      </Link>
    </div>
  );
}
