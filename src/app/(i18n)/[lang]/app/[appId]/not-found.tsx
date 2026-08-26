import Link from "next/link";
import { ensureI18n } from '@/lib/i18n/server';
import { Trans } from "@lingui/react/macro";

export default function AppNotFound() {
  // not-found receives no params, so it cannot resolve a locale itself.
  ensureI18n();

  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">
        <Trans>App Not Found</Trans>
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        <Trans>The app you&apos;re looking for doesn&apos;t exist or may have been moved.</Trans>
      </p>
      <Link
        href="/apps"
        className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
      >
        <Trans>Browse All Apps</Trans>
      </Link>
    </div>
  );
}
