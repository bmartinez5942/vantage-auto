import type { Metadata } from 'next';
import { SearchBar } from '@/components/SearchBar';
import { CatalogVehicleCard } from '@/components/CatalogVehicleCard';
import { FilterRail } from './FilterRail';
import { groupedCatalog, countCatalog } from '@/lib/autoCatalog';

export const metadata: Metadata = {
  title: 'Rent a Vehicle — Vantage Auto',
  description: 'Browse the Vantage Auto collection and request the right vehicle for your stay, trip, or lifestyle.',
};

type SearchParams = {
  cat?: string;
  body?: string;
  pickup?: string;
  return?: string;
  location?: string;
};

export default function RentPage({ searchParams }: { searchParams: SearchParams }) {
  const filter = { cat: searchParams.cat || undefined, body: searchParams.body || undefined };
  const groups = groupedCatalog(filter);
  const total = countCatalog(filter);

  return (
    <>
      <div className="container page-head">
        <h1 className="page-title">
          The <em>Collection</em>
        </h1>
        <p className="section-sub">
          A curated catalog — practical daily drivers, premium sedans, SUVs, and exotics. Every listing is a
          controlled, verified model; request to book and our team confirms availability.
        </p>
      </div>

      <div className="container" style={{ marginTop: 18 }}>
        <SearchBar
          defaults={{
            pickup: searchParams.pickup,
            ret: searchParams.return,
            location: searchParams.location,
            cat: searchParams.cat,
          }}
        />
      </div>

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
                    <ul className="vehicle-grid">
                      {cards.map((c) => (
                        <CatalogVehicleCard key={c.id} vehicle={c} />
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
