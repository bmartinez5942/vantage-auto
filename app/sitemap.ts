import type { MetadataRoute } from 'next';
import { AUTO } from '@/lib/branding';
import { fetchLiveVehicles } from '@/lib/liveVehicles';

// Dynamic sitemap: static marketing routes + one entry per live vehicle
// (/rent/[slug]) so search engines discover the full collection.
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? `https://${AUTO.domain}`).replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,             changeFrequency: 'weekly',  priority: 1.0, lastModified: now },
    { url: `${SITE}/rent`,         changeFrequency: 'daily',   priority: 0.9, lastModified: now },
    { url: `${SITE}/host`,         changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${SITE}/source`,       changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${SITE}/how-it-works`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${SITE}/about`,        changeFrequency: 'monthly', priority: 0.5, lastModified: now },
    { url: `${SITE}/faq`,          changeFrequency: 'monthly', priority: 0.5, lastModified: now },
    { url: `${SITE}/contact`,      changeFrequency: 'monthly', priority: 0.5, lastModified: now },
    { url: `${SITE}/policies`,     changeFrequency: 'yearly',  priority: 0.3, lastModified: now },
    { url: `${SITE}/attributions`, changeFrequency: 'yearly',  priority: 0.1, lastModified: now },
  ];

  // Vehicles — best-effort: a fetch failure (e.g. missing env at build time)
  // must not break sitemap generation; we just emit the static routes.
  let vehicles: MetadataRoute.Sitemap = [];
  try {
    const live = await fetchLiveVehicles();
    vehicles = live.map((v) => ({
      url: `${SITE}/rent/${v.slug ?? v.id}`,
      changeFrequency: 'daily' as const,
      priority: 0.8,
      lastModified: now,
    }));
  } catch (e) {
    console.error('sitemap: fetchLiveVehicles failed', e);
  }

  return [...staticRoutes, ...vehicles];
}
