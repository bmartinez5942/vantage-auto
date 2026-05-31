import type { Metadata } from 'next';
import { CatalogVehicleCard } from '@/components/CatalogVehicleCard';
import { LiveVehicleCard } from '@/components/LiveVehicleCard';
import { FilterRail } from './FilterRail';
import { groupedCatalog, countCatalog } from '@/lib/autoCatalog';
import { fetchApprovedPricing } from '@/lib/pricing';
import { fetchLiveVehicles } from '@/lib/liveVehicles';

export const metadata: Metadata = {
  title: 'Rent a Vehicle — Vantage Auto',
  description: 'Browse the Vantage Auto collection and request the right vehicle for your stay, trip, or lifestyle.',
};

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
  const live = await fetchLiveVehicles();

  return (
    <>
      <div className="container page-head">
        <h1 className="page-title">
          The <em>Collection</em>
        </h1>
        <p className="section-sub">
          {live.length > 0
            ? 'Browse our available vehicles and request the right one for your stay, trip, or lifestyle. Every booking is request-to-book — our team confirms availability.'
            : 'A curated catalog — practical daily drivers, premium sedans, SUVs, and exotics. Every listing is a controlled, verified model; request to book and our team confirms availability.'}
        </p>
      </div>

      {live.length > 0 ? (
        <section className="section-tight">
          <div className="container">
            <p className="muted" style={{ marginBottom: 18, fontSize: 14 }}>
              {live.length} {live.length === 1 ? 'vehicle' : 'vehicles'} available
            </p>
            <div className="va-vehicle-grid">
              {live.map((v) => <LiveVehicleCard key={v.id} vehicle={v} />)}
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
