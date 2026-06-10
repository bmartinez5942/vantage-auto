import type { MetadataRoute } from 'next';
import { AUTO } from '@/lib/branding';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? `https://${AUTO.domain}`).replace(/\/$/, '');

// Allow crawling of all public content; point crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
