import { Button } from "@/components/ui/button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ArrowRight, Bug, Check, GitMerge, Newspaper, Rocket, ShieldCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { DEFAULT_LOCALE, localePath, type Locale } from '@/lib/i18n/locales';
import Image from "next/image";
import type { CSSProperties } from "react";

export interface HeroAbout {
  name: string;
  /** Rendered as a single "role · role" line above the heading. */
  roles: string[];
  /** Blank-line separated. The first paragraph becomes the lede. */
  bio: string;
  /** Screen-reader-only continuation of the h1, which shows only the name. */
  seoDescription: string;
  avatar: string;
}

export interface HeroStat {
  /** Pre-formatted for display, e.g. "2.4M+". */
  value: string;
  label: string;
}

export interface HeroSocialLink {
  label: string;
  url: string;
  icon: "Github" | "Linkedin" | "Youtube" | "Instagram";
}

export interface HeroProps {
  /**
   * Language the internal links are built for. Defaults to English.
   *
   * Without it the card links here pointed at the English pages from `/br/`:
   * a hardcoded `href` never passes through `localePath`, so a page-level check
   * misses it entirely.
   */
  locale?: Locale;

  about: HeroAbout;
  /** Counts derived from the collections at build time. Rendered as-is. */
  stats: HeroStat[];
  socialLinks: HeroSocialLink[];
  /** Only /about surfaces the press kit; the home page keeps the two primary CTAs. */
  showPressKit?: boolean;
}

// Work markers on the ring (r = 49 in the 100-unit square), in the order the
// scan reaches them: 0, 90, 180 and 270 degrees. The scan starts 45 degrees
// behind the first and takes 3s per quarter, so marker `i` is hit at
// 1.5s + 3s * i of each 12s lap. `.animate-orbit-marker-*` in globals.css runs
// on that clock, delayed by `i * 3s`.
const ORBIT_MARKERS: { Icon: LucideIcon; left: string; top: string }[] = [
  { Icon: Bug, left: "99%", top: "50%" },
  { Icon: Rocket, left: "50%", top: "99%" },
  { Icon: GitMerge, left: "1%", top: "50%" },
  { Icon: ShieldCheck, left: "50%", top: "1%" },
];

/**
 * Opening block of the home and about pages: name, bio, derived counts, and
 * the orbiting avatar.
 *
 * Data comes from the page via `getHeroData()` in `@/lib/sections`.
 */
export function Hero({ about, stats, socialLinks, showPressKit = false, locale = DEFAULT_LOCALE }: HeroProps) {
  const bioParagraphs = about.bio
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean);
  const [lede, ...rest] = bioParagraphs;

  return (
    <section id="hero" className="relative pt-28 pb-28 md:pt-32 md:pb-32 overflow-x-clip">
      {/* Strategic blur orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-32 right-0 w-[480px] h-[480px] bg-purple-100 rounded-full blur-3xl opacity-25 translate-x-1/3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-10 lg:right-24 w-[360px] h-[360px] bg-blue-100 rounded-full blur-3xl opacity-25"
      />

      <div className="container mx-auto relative z-10 px-4">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="space-y-10 max-w-xl">
            <div className="space-y-6">
              <div className="space-y-3">
                <p
                  aria-hidden="true"
                  className="text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
                >
                  {about.roles.join(" · ")}
                </p>

                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.02] text-foreground">
                  <span className="sr-only">
                    {about.name} - {about.seoDescription}
                  </span>
                  <span aria-hidden="true">{about.name}</span>
                </h1>
              </div>

              {lede && (
                <p className="text-lg sm:text-xl text-foreground/85 leading-relaxed max-w-prose">
                  {lede}
                </p>
              )}
            </div>

            {rest.length > 0 && (
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-prose">
                {rest.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            <dl className="grid grid-cols-3 sm:grid-cols-5 gap-x-6 gap-y-5 pt-7 border-t border-border/60">
              {stats.map(stat => (
                <div key={stat.label} className="space-y-1">
                  <dt className="text-xl sm:text-2xl font-bold text-foreground tabular-nums tracking-tight">
                    {stat.value}
                  </dt>
                  <dd className="text-xs text-muted-foreground leading-tight">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild className="min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="#contact">
                  <Trans>Get in touch</Trans> <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="min-h-[44px]">
                <Link href={localePath(locale, "/projects")}><Trans>View my projects</Trans></Link>
              </Button>
              {showPressKit && (
                <Button size="lg" variant="outline" asChild className="min-h-[44px]">
                  <Link href={localePath(locale, "/press-kit")}>
                    <Newspaper className="mr-2 h-4 w-4" aria-hidden="true" />
                    <Trans>Press kit</Trans>
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Right: avatar with orbital ring */}
          <div className="relative justify-self-center w-[280px] sm:w-[340px] lg:w-[400px] aspect-square">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-28 w-[440px] h-[440px] bg-green-100 rounded-full blur-3xl opacity-60"
            />
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full overflow-visible"
            >
              <circle
                cx="50"
                cy="50"
                r="49"
                fill="none"
                stroke="rgb(203 213 225)"
                strokeWidth="0.25"
                strokeDasharray="0.6 1.8"
              />
            </svg>

            <div className="absolute inset-[6%] rounded-full overflow-hidden bg-primary/10 ring-1 ring-slate-200/80 shadow-lg">
              <Image
                src={about.avatar}
                alt={`${about.name} profile photo`}
                width={400}
                height={400}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            {/* Bug, deploy, code review, security: a scan laps the ring and
                turns each into a check as it passes. The layer turns, each
                marker turns back, so the icons stay upright. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 animate-orbit-cw">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
                <defs>
                  {/* Fades the scan arc from nothing at its tail to the leading edge. */}
                  <linearGradient id="scanTrail" gradientUnits="userSpaceOnUse" x1="81.5" y1="12.47" x2="99" y2="50">
                    <stop offset="0%" stopColor="rgb(34 197 94)" stopOpacity="0" />
                    <stop offset="100%" stopColor="rgb(34 197 94)" stopOpacity="0.75" />
                  </linearGradient>
                </defs>
                <g className="animate-scan-sweep" style={{ transformOrigin: "50% 50%" }}>
                  <path
                    d="M 81.5 12.47 A 49 49 0 0 1 99 50"
                    fill="none"
                    stroke="url(#scanTrail)"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                  />
                  <circle cx="99" cy="50" r="0.9" fill="rgb(34 197 94)" />
                </g>
              </svg>

              {ORBIT_MARKERS.map(({ Icon, left, top }, i) => (
                <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left, top }}>
                  <div
                    className="animate-orbit-ccw relative grid h-7 w-7 place-items-center lg:h-8 lg:w-8"
                    style={{ "--marker-delay": `${i * 3}s` } as CSSProperties}
                  >
                    <span className="animate-orbit-marker-pulse absolute inset-0 rounded-full border border-green-500" />
                    <span className="animate-orbit-marker-idle absolute inset-0 grid place-items-center rounded-full bg-white ring-1 ring-slate-200 shadow-sm">
                      <Icon className="h-3.5 w-3.5 text-slate-500 lg:h-4 lg:w-4" strokeWidth={1.75} />
                    </span>
                    <span className="animate-orbit-marker-done absolute inset-0 grid place-items-center rounded-full bg-white ring-1 ring-green-500 shadow-sm">
                      <Check className="h-3.5 w-3.5 text-green-600 lg:h-4 lg:w-4" strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
              <SocialLinks socialLinks={socialLinks} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
