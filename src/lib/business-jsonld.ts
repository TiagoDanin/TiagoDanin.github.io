import type { Business } from '@/lib/business';
import { pageUrl } from '@/lib/i18n/seo';
import type { Locale } from '@/lib/i18n/locales';

interface BusinessSchemaLabels {
  home: string;
  business: string;
  catalog: string;
}

function cnaeCodes(business: Business): string[] {
  const found = business.registry
    .flatMap((record) => record.value.match(/\d{4}-\d\/\d{2}/g) ?? []);
  return [...new Set(found)];
}

export function businessPageSchema(
  locale: Locale,
  business: Business,
  labels: BusinessSchemaLabels,
  contact: { email: string; sameAs: string[] }
) {
  const url = pageUrl(locale, '/business');

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${url}#organization`,
      name: business.tradeName,
      legalName: business.legalName,
      url,
      description: business.seoDescription,
      taxID: business.cnpj,
      vatID: business.cnpj,
      foundingDate: business.foundedAt,
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'CNAE',
          value: cnaeCodes(business).join(', '),
        },
      ],
      email: contact.email,
      sameAs: contact.sameAs,
      knowsLanguage: ['pt-BR', 'en'],
      founder: {
        '@type': 'Person',
        '@id': `${pageUrl(locale, '/')}#person`,
        name: 'Tiago Jatahy Danin',
        url: pageUrl(locale, '/'),
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: business.city,
        addressRegion: 'PA',
        addressCountry: 'BR',
      },
      areaServed: [
        { '@type': 'Country', name: 'Brasil' },
        { '@type': 'Place', name: 'Worldwide' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: labels.catalog,
        itemListElement: business.offerings.map((offering) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: offering.title,
            description: offering.description,
            serviceType: offering.title,
            areaServed: { '@type': 'Country', name: 'Brasil' },
            url: pageUrl(locale, offering.href),
          },
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: labels.home, item: pageUrl(locale, '/') },
        { '@type': 'ListItem', position: 2, name: labels.business, item: url },
      ],
    },
  ];
}
