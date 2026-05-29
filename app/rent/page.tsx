import type { Metadata } from 'next';
import { SearchBar } from '@/components/SearchBar';
import { VehicleCard } from '@/components/VehicleCard';
import { FilterRail } from './FilterRail';
import { fetchLiveVehicles, type VehicleFilters } from '@/lib/vehicles';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Rent a Vehicle — Vantage Auto',
  description: 'Browse the Vantage Auto collection and book the right vehicle for your stay, trip, or lifestyle.',
};

type SearchParams = {
  type?: string;
  transmission?: string;
  seats?: string;
  maxDaily?: string;
  delivery?: string;
  pickup?: string;
  return?: string;
  location?: string;
};

export default async function RentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters: VehicleFilters = {
    category: searchParams.type || undefined,
    transmission: searchParams.transmission || undefined,
    seats: searchParams.seats ? Number(searchParams.seats) : undefined,
    maxDaily: searchParams.maxDaily ? Number(searchParams.maxDaily) : undefined,
    delivery: searchParams.delivery === '1' || undefined,
  };
  const vehicles = await fetchLiveVehicles(filters);

  return (
    <>
      <div className="container page-head">
        <h1 className="page-title">
          The <em>Collection</em>
        </h1>
        <p className="section-sub">
          Practical daily drivers, SUVs, premium vehicles, and specialty options — vehicles for every type of
          trip, reviewed and managed to our platform standards.
        </p>
      </div>

      <div className="container" style={{ marginTop: 18 }}>
        <SearchBar
          defaults={{
            pickup: searchParams.pickup,
            ret: searchParams.return,
            location: searchParams.location,
            type: searchParams.type,
          }}
        />
      </div>

      <section className="section-tight">
        <div className="container">
          <div className="rent-layout">
            <FilterRail />
            <div>
              <p className="muted" style={{ marginBottom: 18, fontSize: 14 }}>
                {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} available
              </p>
              {vehicles.length === 0 ? (
                <div className="empty-state">
                  No vehicles match these filters yet. Try widening your search or clearing filters.
                </div>
              ) : (
                <ul className="vehicle-grid">
                  {vehicles.map((v) => (
                    <VehicleCard key={v.id} vehicle={v} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
