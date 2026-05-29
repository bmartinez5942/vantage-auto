import type { Metadata } from 'next';
import Link from 'next/link';
import { IconShield, IconStar, IconKey, IconCalendar } from '@/components/icons';
import { AUTO } from '@/lib/branding';

export const metadata: Metadata = {
  title: 'About — Vantage Auto',
  description: 'Vantage Auto is the mobility division of the Auren ecosystem — premium vehicle rentals, hosting, and sourcing.',
};

const VALUES = [
  { icon: <IconShield />, title: 'Professionally Managed', body: 'Every vehicle is vetted, insured, and maintained to a consistent standard.' },
  { icon: <IconStar />, title: 'Guest-Focused', body: 'A booking experience built to feel effortless from search to return.' },
  { icon: <IconCalendar />, title: 'Transparent', body: 'Clear pricing, clear mileage, clear terms — no surprises at pickup.' },
  { icon: <IconKey />, title: 'Part of Auren', body: 'Connected to Vantage Stays and the wider Auren ecosystem for a unified experience.' },
];

export default function AboutPage() {
  return (
    <>
      <div className="container page-head">
        <div className="eyebrow">About</div>
        <h1 className="page-title">
          Your Stay,<br />Now in <em>Motion.</em>
        </h1>
        <p className="section-sub">
          {AUTO.name} is the mobility division of the Auren ecosystem. We make it simple to book the right vehicle
          for your stay, trip, or lifestyle — and we help owners turn their vehicles into income through a
          professionally managed platform.
        </p>
      </div>

      <section className="section-tight">
        <div className="container">
          <div className="why-grid">
            {VALUES.map((v) => (
              <div key={v.title} className="why-item">
                <div className="why-icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container" style={{ textAlign: 'center' }}>
          <Link href="/rent" className="btn-primary">Browse the Collection</Link>
        </div>
      </section>
    </>
  );
}
