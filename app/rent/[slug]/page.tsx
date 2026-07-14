import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchLiveVehicleBySlug, fetchUnavailableRanges, vehicleName } from '@/lib/liveVehicles';
import { formatCurrency, formatDate } from '@/lib/format';
import { IconCheck } from '@/components/icons';
import { pageMeta, SITE_URL } from '@/lib/seo';
import { BookingRequestForm } from './BookingRequestForm';
import { Gallery } from './Gallery';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const v = await fetchLiveVehicleBySlug(params.slug);
  if (!v) return { title: 'Vehicle' };
  const name = vehicleName(v);
  const rate = v.daily_rate != null ? ` From ${formatCurrency(v.daily_rate)}/day` : '';
  const firstPhoto = (v.photos ?? []).filter(Boolean)[0];
  return pageMeta({
    title: `Rent a ${name} in Miami`,
    description:
      `${v.headline ? v.headline + ' ' : ''}Request to book the ${name} with Arrivo in Miami.${rate} — flexible delivery, no charge until confirmed.`.slice(0, 158),
    path: `/rent/${v.slug ?? v.id}`,
    ogImage: firstPhoto ? { url: firstPhoto, alt: `${name} for rent in Miami through Arrivo` } : undefined,
  });
}

export default async function VehicleDetailPage({ params }: { params: { slug: string } }) {
  const v = await fetchLiveVehicleBySlug(params.slug);
  if (!v) notFound();

  const name = vehicleName(v);
  const photos = (v.photos ?? []).filter(Boolean);
  const unavailable = await fetchUnavailableRanges(v.id);

  const specs: { label: string; value: string }[] = [];
  if (v.category) specs.push({ label: 'Category', value: v.category });
  if (v.city) specs.push({ label: 'Location', value: v.city });
  if (v.seats != null) specs.push({ label: 'Seats', value: String(v.seats) });
  if (v.doors != null) specs.push({ label: 'Doors', value: String(v.doors) });
  if (v.transmission) specs.push({ label: 'Transmission', value: v.transmission });
  if (v.fuel_type) specs.push({ label: 'Fuel', value: v.fuel_type });
  if (v.mpg != null) specs.push({ label: 'MPG', value: `${v.mpg} mpg` });
  if (v.unlimited_mileage) specs.push({ label: 'Mileage', value: 'Unlimited' });
  else if (v.included_miles_per_day != null) specs.push({ label: 'Miles / day', value: String(v.included_miles_per_day) });
  if (v.extra_mileage_fee != null) specs.push({ label: 'Extra mileage', value: `${formatCurrency(v.extra_mileage_fee, { cents: true })}/mi` });
  if (v.deposit_amount != null) specs.push({ label: 'Deposit', value: formatCurrency(v.deposit_amount) });

  // Product + Offer JSON-LD — makes the vehicle eligible for rich results
  // (price, availability) and gives AI search a structured record.
  const vehicleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/rent/${v.slug ?? v.id}#vehicle`,
    name: `${name} — rental in Miami`,
    description: v.headline ?? v.description ?? `Rent the ${name} in Miami through Arrivo.`,
    image: photos.length > 0 ? photos : undefined,
    brand: v.make ? { '@type': 'Brand', name: v.make } : undefined,
    category: v.category ?? 'Vehicle rental',
    ...(v.daily_rate != null
      ? {
          offers: {
            '@type': 'Offer',
            url: `${SITE_URL}/rent/${v.slug ?? v.id}`,
            price: v.daily_rate,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            areaServed: { '@type': 'City', name: 'Miami' },
            seller: { '@id': `${SITE_URL}/#organization` },
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleSchema) }}
      />
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
              <Gallery photos={photos} name={name} />

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
