import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchLiveVehicleBySlug, fetchUnavailableRanges, vehicleName } from '@/lib/liveVehicles';
import { formatCurrency, formatDate } from '@/lib/format';
import { IconCheck } from '@/components/icons';
import { BookingRequestForm } from './BookingRequestForm';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const v = await fetchLiveVehicleBySlug(params.slug);
  if (!v) return { title: 'Vehicle — Vantage Auto' };
  const name = vehicleName(v);
  return { title: `${name} — Vantage Auto`, description: v.headline ?? `Request to book the ${name} from Vantage Auto.` };
}

export default async function VehicleDetailPage({ params }: { params: { slug: string } }) {
  const v = await fetchLiveVehicleBySlug(params.slug);
  if (!v) notFound();

  const name = vehicleName(v);
  const photos = (v.photos ?? []).filter(Boolean);
  const main = photos[0];
  const thumbs = photos.slice(1, 6);
  const unavailable = await fetchUnavailableRanges(v.id);

  const specs: { label: string; value: string }[] = [];
  if (v.category) specs.push({ label: 'Category', value: v.category });
  if (v.city) specs.push({ label: 'Location', value: v.city });
  if (v.seats != null) specs.push({ label: 'Seats', value: String(v.seats) });
  if (v.doors != null) specs.push({ label: 'Doors', value: String(v.doors) });
  if (v.transmission) specs.push({ label: 'Transmission', value: v.transmission });
  if (v.fuel_type) specs.push({ label: 'Fuel', value: v.fuel_type });
  if (v.unlimited_mileage) specs.push({ label: 'Mileage', value: 'Unlimited' });
  else if (v.included_miles_per_day != null) specs.push({ label: 'Miles / day', value: String(v.included_miles_per_day) });
  if (v.extra_mileage_fee != null) specs.push({ label: 'Extra mileage', value: `${formatCurrency(v.extra_mileage_fee)}/mi` });
  if (v.deposit_amount != null) specs.push({ label: 'Deposit', value: formatCurrency(v.deposit_amount) });

  return (
    <>
      <div className="container page-head">
        <Link href="/rent" className="service-card-link" style={{ display: 'inline-flex', marginBottom: 12 }}>← Back to the collection</Link>
        {v.category && <div className="eyebrow">{v.category}</div>}
        <h1 className="page-title">{name}</h1>
        {v.headline && <p className="section-sub">{v.headline}</p>}
      </div>

      <section className="section-tight">
        <div className="container">
          <div className="detail-layout">
            <div>
              <div className="gallery-main">
                {main ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={main} alt={name} />
                ) : (
                  <div className="vehicle-photo-fallback" aria-hidden="true"><span>{name}</span></div>
                )}
              </div>
              {thumbs.length > 0 && (
                <div className="gallery-thumbs">
                  {thumbs.map((p, i) => (
                    <div className="gallery-thumb" key={i}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p} alt="" loading="lazy" />
                    </div>
                  ))}
                </div>
              )}

              {specs.length > 0 && (
                <div className="spec-grid">
                  {specs.map((s) => (
                    <div className="spec-item" key={s.label}>
                      <div className="spec-label">{s.label}</div>
                      <div className="spec-value">{s.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {v.description && (
                <>
                  <h2 className="section-title" style={{ fontSize: 24, margin: '8px 0 10px' }}>Overview</h2>
                  <p className="muted" style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{v.description}</p>
                </>
              )}

              {v.features && v.features.length > 0 && (
                <>
                  <h2 className="section-title" style={{ fontSize: 24, margin: '24px 0 10px' }}>Features</h2>
                  <ul className="feature-list">
                    {v.features.map((f) => (
                      <li key={f}><IconCheck /> {f}</li>
                    ))}
                  </ul>
                </>
              )}

              <h2 className="section-title" style={{ fontSize: 24, margin: '24px 0 10px' }}>Availability</h2>
              {unavailable.length === 0 ? (
                <p className="muted">No blocked dates at the moment — request your dates and we&apos;ll confirm.</p>
              ) : (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {unavailable.map((r, i) => (
                    <li key={i} className="muted" style={{ fontSize: 14 }}>
                      Unavailable: {formatDate(r.start)} – {formatDate(r.end)}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <aside className="booking-box">
              {v.daily_rate != null && (
                <div className="booking-price-head">
                  <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>From</span>
                  <strong>{formatCurrency(v.daily_rate)}</strong>
                  <span className="per">/ day</span>
                </div>
              )}
              <div className="badge-pending">Request to Book · Pending Verification</div>
              <div style={{ marginTop: 16 }}>
                <BookingRequestForm vehicleId={v.id} />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
