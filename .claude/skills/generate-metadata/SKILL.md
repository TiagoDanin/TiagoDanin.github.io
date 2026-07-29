---
name: generate-metadata
description: Generate SEO metadata (OpenGraph, Twitter Card, JSON-LD schema) for pages. Use when creating new dynamic pages or updating metadata templates.
allowed-tools: Read, Write, Edit
user-invocable: false
---

# Generate SEO Metadata

Generate comprehensive SEO metadata for Next.js pages including OpenGraph, Twitter Card, and JSON-LD structured data.

## Metadata Components

### 1. Basic Metadata
```typescript
{
  title: string,
  description: string, // truncated to 160 chars
  keywords: string[],
  authors: [{ name: "Tiago Danin" }],
  creator: "Tiago Danin",
}
```

### 2. OpenGraph Metadata
```typescript
openGraph: {
  title: string,
  description: string,
  url: string, // canonical URL
  siteName: "Tiago Danin",
  locale: "pt_BR",
  type: "article" | "website",
  images: [{
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: string,
  }],
}
```

### 3. Twitter Card
```typescript
twitter: {
  card: "summary_large_image",
  title: string,
  description: string,
  creator: "@TiagoDanin",
  site: "@TiagoDanin",
  images: ["/og-image.png"],
}
```

### 4. JSON-LD Structured Data

**For Blog Posts:**
```typescript
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": string,
  "description": string,
  "author": {
    "@type": "Person",
    "name": "Tiago Danin",
    "url": "https://tiagodanin.com"
  },
  "datePublished": string, // ISO 8601
  "url": string,
  "publisher": {
    "@type": "Organization",
    "name": "Tiago Danin",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tiagodanin.com/logo.png"
    }
  }
}
```

**For Talks:**
```typescript
{
  "@context": "https://schema.org",
  "@type": "PresentationDigitalDocument",
  "name": string,
  "description": string,
  "author": {
    "@type": "Person",
    "name": "Tiago Danin"
  },
  "datePublished": string,
  "url": string,
  "event": {
    "@type": "Event",
    "name": string, // event name
    "startDate": string
  }
}
```

**For Timeline Events:**
```typescript
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": string,
  "description": string,
  "startDate": string,
  "url": string,
  "organizer": {
    "@type": "Person",
    "name": "Tiago Danin"
  }
}
```

## Template Pattern

Use this pattern in `generateMetadata()` functions:

```typescript
import { Metadata } from 'next';
import { toISODate } from '@/lib/utils';

interface Item {
  title: string;
  description: string;
  date: string;
  slug: string;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = dataArray.find(x => x.slug === params.slug);

  if (!item) {
    return {
      title: 'Not Found',
      description: 'The requested page could not be found.'
    };
  }

  const url = `https://tiagodanin.com/category/${item.slug}`;
  const description = item.description.length > 160
    ? item.description.substring(0, 157) + '...'
    : item.description;

  return {
    title: item.title,
    description,
    keywords: extractKeywords(item),
    authors: [{ name: 'Tiago Danin' }],
    creator: 'Tiago Danin',
    alternates: {
      canonical: url
    },
    openGraph: {
      title: item.title,
      description,
      url,
      siteName: 'Tiago Danin',
      locale: 'pt_BR',
      type: 'article',
      images: [{
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: item.title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description,
      creator: '@TiagoDanin',
      site: '@TiagoDanin',
      images: ['/og-image.png']
    }
  };
}
```

## Structured Data in Page Component

Add JSON-LD to the page component:

```typescript
export default function Page({ params }: { params: { slug: string } }) {
  const item = dataArray.find(x => x.slug === params.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: item.title,
    description: item.description,
    author: {
      '@type': 'Person',
      name: 'Tiago Danin',
      url: 'https://tiagodanin.com'
    },
    datePublished: toISODate(item.date),
    url: `https://tiagodanin.com/post/${item.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Tiago Danin',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tiagodanin.com/logo.png'
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page content */}
    </>
  );
}
```

## Best Practices

1. **Description Length**: Always truncate to 160 characters for SEO
2. **Canonical URLs**: Always include full absolute URLs
3. **Images**: Use 1200×630 for OpenGraph (Twitter's recommended size)
4. **Dates**: Convert to ISO 8601 format for structured data
5. **Type Selection**:
   - BlogPosting for posts
   - PresentationDigitalDocument for talks
   - Event for timeline entries
6. **Keywords**: Extract from title and description, include tech stack tags

## Automation

This skill is loaded automatically by Claude when working on:
- New page components in `src/app/`
- Updating metadata for existing pages
- Creating dynamic route pages with `generateMetadata()`

## Validation

After generating metadata, validate:
- ✓ All URLs are absolute (include https://tiagodanin.com)
- ✓ Description is ≤160 characters
- ✓ JSON-LD validates at https://validator.schema.org/
- ✓ OpenGraph validates at https://opengraph.dev/
- ✓ Twitter Card validates at https://cards-dev.twitter.com/validator

## Common Patterns in This Codebase

- Site name: "Tiago Danin"
- Locale: "pt_BR"
- Creator: "Tiago Danin" / "@TiagoDanin"
- Base URL: "https://tiagodanin.com"
- OG Image: "/og-image.png" (1200×630)
- Logo: "/logo.png"

## Integration

When creating new dynamic pages:
1. Import data source
2. Create `generateMetadata()` function
3. Generate structured data object
4. Add JSON-LD script to page component
5. Validate output
