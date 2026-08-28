import type { FaqEntry } from '@/lib/faq';
import { pageUrl } from '@/lib/i18n/seo';
import type { Locale } from '@/lib/i18n/locales';

interface PersonInput {
  name: string;
  jobTitle: string;
  description: string;
  avatar: string;
  email: string;
  sameAs: string[];
  knowsAbout: string[];
}

export function personSchema(locale: Locale, person: PersonInput) {
  return {
    '@type': 'Person',
    '@id': `${pageUrl(locale, '/')}#person`,
    name: person.name,
    url: pageUrl(locale, '/'),
    image: person.avatar,
    email: person.email,
    jobTitle: person.jobTitle,
    description: person.description,
    homeLocation: {
      '@type': 'Place',
      name: 'Belém, Pará, Brazil',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Belém',
        addressRegion: 'PA',
        addressCountry: 'BR',
      },
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Instituto Federal do Pará (IFPA)',
    },
    worksFor: { '@type': 'Organization', name: 'Idopter Labs' },
    knowsLanguage: ['pt-BR', 'en'],
    knowsAbout: person.knowsAbout,
    sameAs: person.sameAs,
  };
}

function breadcrumb(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

export function faqPageSchema(
  locale: Locale,
  entries: readonly FaqEntry[],
  person: ReturnType<typeof personSchema>,
  labels: { home: string; faq: string }
) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      url: pageUrl(locale, '/faq'),
      inLanguage: locale === 'br' ? 'pt-BR' : 'en',
      about: { '@id': person['@id'] },
      mainEntity: entries.map((entry) => ({
        '@type': 'Question',
        name: entry.question,
        acceptedAnswer: { '@type': 'Answer', text: entry.answer },
      })),
    },
    { '@context': 'https://schema.org', ...person },
    breadcrumb([
      { name: labels.home, item: pageUrl(locale, '/') },
      { name: labels.faq, item: pageUrl(locale, '/faq') },
    ]),
  ];
}

export function qaPageSchema(
  locale: Locale,
  entry: FaqEntry,
  person: ReturnType<typeof personSchema>,
  labels: { home: string; faq: string }
) {
  const url = pageUrl(locale, `/faq/${entry.slug}`);

  const graph: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'QAPage',
      url,
      inLanguage: locale === 'br' ? 'pt-BR' : 'en',
      about: { '@id': person['@id'] },
      mainEntity: {
        '@type': 'Question',
        name: entry.question,
        text: entry.question,
        answerCount: 1,
        acceptedAnswer: {
          '@type': 'Answer',
          text: entry.answer,
          url,
          author: { '@id': person['@id'] },
        },
      },
    },
    { '@context': 'https://schema.org', ...person },
    breadcrumb([
      { name: labels.home, item: pageUrl(locale, '/') },
      { name: labels.faq, item: pageUrl(locale, '/faq') },
      { name: entry.question, item: url },
    ]),
  ];

  if (entry.layout === 'steps' && entry.steps?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: entry.question,
      description: entry.answer,
      step: entry.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.title,
        text: step.detail,
      })),
    });
  }

  if (entry.layout === 'service' && entry.offering?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: entry.question,
      description: entry.answer,
      provider: { '@id': person['@id'] },
      areaServed: 'BR',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: url,
        availableLanguage: ['pt-BR', 'en'],
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: entry.question,
        itemListElement: entry.offering.map((item) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: item.title, description: item.detail },
        })),
      },
    });
  }

  if ((entry.layout === 'evidence' && entry.evidence?.length) ||
      (entry.layout === 'matrix' && entry.matrix?.length)) {
    const items =
      entry.layout === 'evidence'
        ? entry.evidence!.map((item) => ({ name: item.title, description: item.detail, href: item.href }))
        : entry.matrix!.map((row) => ({ name: row.item, description: `${row.where}. ${row.proof}`, href: row.href }));

    graph.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: entry.question,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        description: item.description,
        ...(item.href?.startsWith('http') ? { url: item.href } : {}),
      })),
    });
  }

  return graph;
}
