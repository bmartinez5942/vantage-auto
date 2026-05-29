import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gallery } from './Gallery';
import { BookingForm } from './BookingForm';
import { fetchVehicleBySlug, vehicleName } from '@/lib/vehicles';
import { formatCurrency, formatNumber } from '@/lib/format';
import { IconCheck, IconSeats, IconGear, IconFuel, IconArrow } from '@/components/icons';

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const v = await fetchVehicleBySlug(params.slug);
  if (!v) return { title: 'Vehicle — Vantage Auto' };
  const name = vehicleName(v);
  return {
    title: `${name} — Vantage Auto`,
    description: v.headline ?? `Rent the ${name} from Vantage Auto.`,
  };
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="spec-item">
      <div className="spec-label">{label}</div>
      <div className="spec-value">{value}</div>
    </div>
  );
}

export default async function VehicleDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { pickup?: string; return?: string };
}) {
  const vehicle = await fetchVehicleBySlug(params.slug);
  if (!vehicle) notFound();

  const name = vehicleName(vehicle);
  const photos = (vehicle.photos ?? []).filter(Boolean);
  const features = (vehicle.features ?? []).filter(Boolean);

  const specs: { label: string; value: string }[] = [];
  if (vehicle.category) specs.push({ label: 'Type', value: vehicle.category });
  if (vehicle.seats != null) specs.push({ label: 'Seats', value: `${vehicle.seats}` });
  if (vehicle.doors != null) specs.push({ label: 'Doors', value: `${vehicle.doors}` });
  if (vehicle.transmission) specs.push({ label: 'Transmission', value: vehicle.transmission });
  if (vehicle.fuel_type) specs.push({ label: 'Fuel', value: vehicle.fuel_type });
  if (vehicle.color) specs.push({ label: 'Color', value: vehicle.color });
  if (vehicle.unlimited_mileage) {
    specs.push({ label: 'Mileage', value: 'Unlimited' });
  } else if (vehicle.included_miles_per_day != null) {
    specs.push({ label: 'Miles / day', value: formatNumber(vehicle.included_miles_per_day) });
  }
  if (vehicle.deposit_amount != null) {
    specs.push({ label: 'Deposit', value: formatCurrency(vehicle.deposit_amount) });
  }

  return (
    <>
      <div className="container" style={{ paddingTop: 28 }}>
        <Link href="/rent" className="service-card-link" style={{ transform: 'scaleX(-1)', display: 'inline-flex' }} aria-label="Back to collection">
          <IconArrow />
        </Link>
        <Link href="/rent" className="muted" style={{ fontSize: 13, marginLeft: 8 }}>
          Back to the collection
        </Link>
      </div>

      <div className="container page-head" style={{ paddingTop: 14 }}>
        {vehicle.category && <div className="eyebrow">{vehicle.category}</div>}
        <h1 className="page-title">{name}</h1>
        {(vehicle.city || vehicle.pickup_location) && (
          <p className="section-sub">{vehicle.pickup_location ?? vehicle.city}</p>
        )}
      </div>

      <section className="section-tight">
        <div className="container">
          <div className="detail-layout">
            <div>
              <Gallery photos={photos} label={`${vehicle.make ?? 'Vantage'} ${vehicle.model ?? ''}`} />

              {vehicle.headline && (
                <h2 className="serif" style={{ fontSize: 26, fontWeight: 500, marginTop: 28 }}>
                  {vehicle.headline}
                </h2>
              )}
              {vehicle.description && (
                <p className="muted" style={{ marginTop: 10, fontSize: 15.5, lineHeight: 1.7 }}>
                  {vehicle.description}
                </p>
              )}

              {specs.length > 0 && (
                <div className="spec-grid">
                  {specs.map((s) => (
                    <Spec key={s.label} label={s.label} value={s.value} />
                  ))}
                </div>
              )}

              {features.length > 0 && (
                <>
                  <div className="form-section-label">Features</div>
                  <ul className="feature-list">
                    {features.map((f) => (
                      <li key={f}>
                        <IconCheck /> {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="form-section-label">Good to know</div>
              <ul className="feature-list">
                <li>
                  <IconSeats /> Professionally managed & insured
                </li>
                <li>
                  <IconGear /> Flexible pick-up and return
                </li>
                <li>
                  <IconFuel /> Return with the same fuel level
                </li>
                <li>
                  <IconCheck /> 24/7 support during your rental
                </li>
              </ul>
            </div>

            <BookingForm
              vehicle={vehicle}
              defaults={{ pickup: searchParams.pickup, ret: searchParams.return }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
