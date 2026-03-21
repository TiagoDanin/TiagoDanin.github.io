'use client'

import { useEffect, useRef } from 'react';

interface GiscusCommentsProps {
  term: string;
}

export function GiscusComments({ term }: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'TiagoDanin/TiagoDanin.github.io');
    script.setAttribute('data-repo-id', 'R_kgDONy7kwg');
    script.setAttribute('data-category', 'Blog Comments');
    script.setAttribute('data-category-id', 'DIC_kwDONy7kws4C41WI');
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', term);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    ref.current.appendChild(script);
  }, [term]);

  return <div ref={ref} className="giscus mt-12" />;
}
