import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { CatalogVehicleCard } from '@/components/CatalogVehicleCard';
import { LiveVehicleCard } from '@/components/LiveVehicleCard';
import { FilterRail } from './FilterRail';
import { LiveFilterRail } from './LiveFilterRail';
import { groupedCatalog, countCatalog } from '@/lib/autoCatalog';
import { fetchApprovedPricing } from '@/lib/pricing';
import { fetchLiveVehicles } from '@/lib/liveVehicles';

export const metadata: Metadata = pageMeta({
  title: 'Rent a Car in Miami — The Arrivo Collection',
  description: 'Browse Arrivo’s Miami rental collection — efficient daily drivers to premium vehicles. Transparent daily rates, request-to-book, delivery available.',
  path: '/rent',
});

// Same freshness window as /rent/[slug] — without this, the live-vehicle
// fetch is cached indefinitely and newly added vehicles never appear.
export const revalidate = 300;

type SearchParams = {
  cat?: string;
  body?: string;
};

export default async function RentPage({ searchParams }: { searchParams: SearchParams }) {
  const filter = { cat: searchParams.cat || undefined, body: searchParams.body || undefined };
  const groups = groupedCatalog(filter);
  const total = countCatalog(filter);
  const pricing = await fetchApprovedPricing();
  // Once real vehicles are imported + approved, the live collection takes over.
  const allLive = await fetchLiveVehicles();
  // Category chips derived from actual inventory; filter by ?cat= when set.
  const liveCategories = Array.from(new Set(allLive.map((v) => v.category).filter(Boolean) as string[])).sort();
  const live = filter.cat ? allLive.filter((v) => v.category === filter.cat) : allLive;

  return (
    <>
      <div className="container page-head">
        <h1 className="page-title">
          The <em>Collection</em>
        </h1>
        <p className="section-sub">
          {allLive.length > 0
            ? 'Browse our available vehicles and request the right one for your stay, trip, or lifestyle. Every booking is request-to-book — our team confirms availability.'
            : 'A curated catalog — practical daily drivers, premium sedans, SUVs, and exotics. Every listing is a controlled, verified model; request to book and our team confirms availability.'}
        </p>
      </div>

      {allLive.length > 0 ? (
        <section className="section-tight">
          <div className="container">
            <div className={liveCategories.length > 1 ? 'rent-layout' : ''}>
              <LiveFilterRail categories={liveCategories} />
              <div>
                <p className="muted" style={{ marginBottom: 18, fontSize: 14 }}>
                  {live.length} {live.length === 1 ? 'vehicle' : 'vehicles'} available
                  {filter.cat ? ` · ${filter.cat}` : ''}
                </p>
                {live.length === 0 ? (
                  <div className="empty-state">No vehicles in this category right now.</div>
                ) : (
                  <div className="va-vehicle-grid">
                    {live.map((v) => <LiveVehicleCard key={v.id} vehicle={v} />)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="section-tight">
          <div className="container">
            <div className="rent-layout">
              <FilterRail />
              <div>
                <p className="muted" style={{ marginBottom: 18, fontSize: 14 }}>
                  {total} {total === 1 ? 'vehicle' : 'vehicles'} in the collection
                </p>
                {groups.length === 0 ? (
                  <div className="empty-state">
                    No vehicles match these filters. Try clearing them to see the full collection.
                  </div>
                ) : (
                  groups.map(({ group, cards }) => (
                    <div key={group.key} className="catalog-group">
                      <h3 className="catalog-group-title">{group.title}</h3>
                      <div className="va-vehicle-grid">
                        {cards.map((c) => (
                          <CatalogVehicleCard key={c.id} vehicle={c} dailyRate={pricing[c.id]?.dailyRate ?? null} />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
