import type { Metadata } from 'next';
import Link from 'next/link';
import { AUTO } from '@/lib/branding';

export const metadata: Metadata = {
  title: 'Rental Policies — Vantage Auto',
  description: 'General rental guidelines for Vantage Auto: booking, eligibility, deposit, mileage, delivery, fuel, condition, and changes.',
};

const SECTIONS = [
  { h: 'Booking & confirmation', b: 'All reservations are request-to-book. Submitting a request places no charge. Our team reviews availability and your details and confirms by email; bookings remain pending verification until then. There is no instant booking.' },
  { h: 'Eligibility & driver requirements', b: 'A valid driver’s license is required, and the primary driver must meet our age and eligibility requirements, verified before confirmation. The driver on the reservation should be present at pickup.' },
  { h: 'Security deposit', b: 'A refundable security deposit may apply and varies by vehicle. The exact amount is confirmed before pickup and released after return, subject to inspection.' },
  { h: 'Mileage', b: 'Each vehicle has its own mileage allowance, shown on its detail page. Additional miles are billed at the per-mile rate listed for that vehicle.' },
  { h: 'Delivery & pickup', b: 'Pickup is by appointment. Delivery is available on select vehicles by request; any delivery fee and location are confirmed during review.' },
  { h: 'Fuel & charge', b: 'Please return the vehicle with the same fuel — or, for electric vehicles, a similar charge level — as provided, or a refueling/recharge fee may apply.' },
  { h: 'Vehicle condition & care', b: 'Return the vehicle in the condition it was provided. Damage beyond normal wear, excessive cleaning, or violations (e.g., tickets, tolls) may incur charges.' },
  { h: 'Changes & cancellations', b: 'Because bookings are request-based, contact us to change or cancel and we’ll confirm available options for your reservation.' },
  { h: 'Coverage', b: 'Coverage requirements and options are reviewed during verification and confirmed in writing before your trip. Please don’t hesitate to ask what applies to your booking.' },
];

export default function PoliciesPage() {
  return (
    <>
      <div className="container page-head">
        <div className="eyebrow">Policies</div>
        <h1 className="page-title">
          Rental <em>Policies.</em>
        </h1>
        <p className="section-sub">
          General guidelines for renting with {AUTO.name}. Specific terms for each booking are confirmed in
          writing before pickup.
        </p>
      </div>

      <section className="section-tight">
        <div className="container" style={{ maxWidth: 780 }}>
          {SECTIONS.map((s) => (
            <div key={s.h} style={{ marginBottom: 26 }}>
              <h2 className="section-title" style={{ fontSize: 22, marginBottom: 8 }}>{s.h}</h2>
              <p className="muted" style={{ lineHeight: 1.7 }}>{s.b}</p>
            </div>
          ))}
          <p className="form-finep">
            Questions about any of the above? <Link href="/contact" style={{ color: 'var(--gold)' }}>Contact us</Link>{' '}
            or email <a href={`mailto:${AUTO.email}`} style={{ color: 'var(--gold)' }}>{AUTO.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
