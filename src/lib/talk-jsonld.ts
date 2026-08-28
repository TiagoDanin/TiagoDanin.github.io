import { eventLabel } from '@/lib/talks';
import { HTML_LANG, type Locale } from '@/lib/i18n/locales';
import { pageUrl } from '@/lib/i18n/seo';
import { toISODate } from '@/utils/parse';

export interface TalkSchemaInput {
  title: string;
  description: string;
  date: string;
  event: string;
  edition?: string;
  youtubeUrl?: string;
}

/**
 * The eleven-character id inside any YouTube URL shape, or `null` when the
 * string is not one.
 *
 * `youtubeUrl` is `""` on most talks and a `watch?v=` link on three, but the
 * collection has no schema forcing that shape, so the id is parsed rather than
 * sliced off the end.
 */
export function youtubeId(url: string | undefined): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

/**
 * The recording as a `VideoObject`.
 *
 * `thumbnailUrl` is required, not decorative: Google rejects a VideoObject
 * without one, and that single missing field is what put every talk carrying a
 * video on Ahrefs' "rich results validation error" list. YouTube serves
 * `hqdefault.jpg` for every id (unlike `maxresdefault`, which only exists when
 * the upload was HD), so it is derived instead of stored.
 */
export function talkVideoSchema(talk: TalkSchemaInput) {
  const id = youtubeId(talk.youtubeUrl);
  if (!id) return undefined;

  return {
    '@type': 'VideoObject',
    name: talk.title,
    description: talk.description,
    thumbnailUrl: [`https://i.ytimg.com/vi/${id}/hqdefault.jpg`],
    uploadDate: toISODate(talk.date),
    contentUrl: talk.youtubeUrl,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    author: { '@type': 'Person', name: 'Tiago Danin' },
  };
}

/**
 * A talk as an `Event`, in the one shape both `/talks` and `/talk/[slug]` emit.
 *
 * The two used to build it separately and disagree: the list page gave every
 * talk a `Place` with a name and no `address`, which Google reads as an
 * incomplete Event. An offline `Place` needs a `PostalAddress`; an online one
 * is a `VirtualLocation`, and then the address does not apply at all.
 */
export function talkEventSchema(talk: TalkSchemaInput, locale: Locale, url: string) {
  const online = Boolean(youtubeId(talk.youtubeUrl));

  return {
    '@type': 'Event',
    name: talk.title,
    description: talk.description,
    startDate: toISODate(talk.date),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: online
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: online
      ? { '@type': 'VirtualLocation', url: talk.youtubeUrl }
      : {
          '@type': 'Place',
          name: eventLabel(talk),
          address: { '@type': 'PostalAddress', addressCountry: 'BR' },
        },
    organizer: { '@type': 'Organization', name: talk.event },
    performer: { '@type': 'Person', name: 'Tiago Danin', url: pageUrl(locale, '/') },
    url,
    inLanguage: HTML_LANG[locale],
  };
}
