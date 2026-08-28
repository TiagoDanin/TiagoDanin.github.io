'use client'

import { Code, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trans, useLingui } from "@lingui/react/macro";

import { SocialLinks, type SocialLink } from "@/components/ui/SocialLinks";
import { LanguageSelect } from "@/components/ui/LanguageSelect";
import type { MenuItem } from "@/components/layout/Navbar";
import { DEFAULT_LOCALE, localePath, splitLocale, type Locale } from "@/lib/i18n/locales";

interface FooterProps {
  socialLinks: SocialLink[];
  menu: MenuItem[];
  locale?: Locale;
}

export function Footer({ socialLinks, menu, locale = DEFAULT_LOCALE }: FooterProps) {
  const { t } = useLingui();
  const pathname = usePathname();
  // Not a bare comparison: the home is `/br` in Portuguese, and `/en` while
  // the English pages are still at their build-time path.
  const isHome = splitLocale(pathname ?? "/").base === "/";
  const year = new Date().getFullYear();
  const footerItems = menu.filter(
    (item) => item.footer && !(isHome && item.hideOnHome)
  );

  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 gap-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <nav aria-label={t`Footer`} className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {footerItems.map((item) => (
                <Link
                  key={item.href}
                  href={localePath(locale, item.href)}
                  className="hover:text-primary min-h-[44px] flex items-center"
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Divider only once the row is wide enough to keep both halves on
                one line; wrapped, it would dangle at the end of the links. */}
            <span aria-hidden="true" className="hidden sm:block h-4 w-px bg-border" />

            <LanguageSelect current={locale} />
          </div>

          {socialLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-4"><Trans>Find me on</Trans></h3>
              <div className="flex justify-center">
                <SocialLinks socialLinks={socialLinks} />
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground text-center space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <Code className="h-4 w-4 text-blue-500" aria-hidden="true" />
            <span><Trans>with</Trans></span>
            <Heart className="h-4 w-4 fill-rose-500 stroke-rose-500" aria-hidden="true" />
            <span><Trans>by</Trans></span>
            <span className="font-medium text-foreground">Tiago Danin</span>
          </p>
          <p>
            <Trans>Built with <span className="font-medium">Next.js</span> and <span className="font-medium">Tailwind</span>, hosted on <span className="font-medium">GitHub Pages</span>.</Trans>
          </p>
        </div>
      </div>
    </footer>
  );
}
