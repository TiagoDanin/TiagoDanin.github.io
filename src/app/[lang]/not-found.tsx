import { NotFoundPage } from "@/components/sections/NotFoundPage";

export const metadata = {
  robots: { index: false, follow: true },
};

/**
 * The 404 for an explicit `notFound()` inside a `[lang]` route. The site-wide
 * one, for a URL that matches nothing, is `(root)/not-found.tsx`.
 */
export default function NotFound() {
  return <NotFoundPage />;
}
