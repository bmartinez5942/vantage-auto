// Shared per-page SEO metadata builder.
//
// Why this exists: Next.js does NOT deep-merge `openGraph`/`twitter` from the
// root layout — a page that sets any openGraph field replaces the whole
// object (losing the default og:image / siteName). And a canonical set in the
// root layout applies the SAME url to every page (the bug that canonicalized
// all 16 pages to the homepage). So: the layout carries only the title
// template + defaults for pages that set nothing, and every public page calls
// pageMeta() to get a complete, self-referencing metadata object.

import type { Metadata } from 'next';
import { AUTO } from './branding';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? `https://${AUTO.domain}`).replace(/\/$/, '');
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og/arrivo-og.jpg`,
  width: 1200,
  height: 630,
  alt: 'Arrivo — premium vehicle rental in Miami',
};

export function pageMeta(opts: {
  /** Page title WITHOUT the brand — the layout template appends " | Arrivo". */
  title: string;
  description: string;
  /** Route path starting with '/', e.g. '/rent' or '/rent/2021-porsche-cayenne-s'. */
  path: string;
  /** Override og:image (e.g. the vehicle's first photo). Defaults to the brand card. */
  ogImage?: { url: string; alt: string; width?: number; height?: number };
}): Metadata {
  const url = opts.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${opts.path}`;
  const fullTitle = `${opts.title} | ${AUTO.name}`;
  const image = opts.ogImage
    ? { width: 1200, height: 630, ...opts.ogImage }
    : DEFAULT_OG_IMAGE;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: opts.description,
      url,
      type: 'website',
      siteName: AUTO.name,
      locale: 'en_US',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: opts.description,
      images: [image.url],
    },
  };
}
