import type { Metadata } from 'next';
import Link from 'next/link';
import { IconShield, IconStar, IconKey, IconCalendar } from '@/components/icons';
import { AUTO } from '@/lib/branding';

export const metadata: Metadata = {
  title: 'About — Arrivo',
  description: 'Arrivo is part of the Auren ecosystem — vehicle rentals, hosting, and sourcing for every type of trip.',
};

const VALUES = [
  { icon: <IconShield />, title: 'Professionally Managed', body: 'Every vehicle is reviewed, documented, and managed according to our platform standards.' },
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
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 className="section-title">Part of the <em>Auren ecosystem.</em></h2>
          <p className="section-sub" style={{ marginTop: 12 }}>
            Auren is the operating company behind a connected set of guest brands: <strong>Vantage Stays</strong> for
            places to stay, <strong>Clearpoint</strong> for turnover and cleaning, and {AUTO.name} for getting
            around. A vehicle can sit right alongside your Vantage Stays reservation — one platform, one standard
            of service.
          </p>
          <p className="section-sub" style={{ marginTop: 14 }}>
            Every vehicle is individually reviewed and managed, and every booking is{' '}
            <strong>request to book</strong> — confirmed by our team rather than auto-accepted — so what you
            reserve is real and verified.
          </p>
          <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/rent" className="btn-primary">Browse vehicles</Link>
            <Link href="/how-it-works" className="btn-ghost">How it works</Link>
          </div>
        </div>
      </section>
    </>
  );
}
