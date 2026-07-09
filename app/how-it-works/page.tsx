import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Link from 'next/link';
import { AUTO } from '@/lib/branding';

export const metadata: Metadata = pageMeta({
  title: 'How Request-to-Book Car Rental Works',
  description: 'Booking a rental car with Arrivo in Miami is request-to-book: browse, request your dates, get verified, and drive. No instant booking, no surprise charges.',
  path: '/how-it-works',
});

const STEPS = [
  { n: '1', title: 'Browse & Request', body: 'Find the right vehicle and submit a request to book your dates. No charge is made when you request.' },
  { n: '2', title: 'We Verify', body: 'Our team confirms availability, reviews your license and eligibility, and checks the calendar before anything is approved.' },
  { n: '3', title: 'Confirm', body: 'Once approved, we finalize the details and any deposit by email — clearly, with no surprise charges.' },
  { n: '4', title: 'Pick Up & Drive', body: 'Collect your vehicle, or request delivery where available, and enjoy your stay, trip, or everyday drive.' },
];

export default function HowItWorksPage() {
  return (
    <>
      <div className="container page-head">
        <div className="eyebrow">How it works</div>
        <h1 className="page-title">
          Book in a Few <em>Simple Steps.</em>
        </h1>
        <p className="section-sub">
          Every {AUTO.name} booking is <strong>request to book</strong> — reviewed by our team before it&rsquo;s
          confirmed. It keeps things accurate and protects your trip; nothing auto-charges.
        </p>
      </div>

      <section className="section-tight">
        <div className="container">
          <div className="steps-grid">
            {STEPS.map((s) => (
              <div key={s.n} className="step-card">
                <div className="step-num">{s.n}</div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container center">
          <h2 className="section-title">Why <em>request to book?</em></h2>
          <p className="section-sub" style={{ margin: '12px auto 0' }}>
            Our vehicles are individually managed and may also be listed on other platforms, so we confirm each
            request against the live calendar before approving. You get a real, verified booking — not an
            auto-accept that can fall through.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link href="/rent" className="btn-primary">Browse the collection</Link>
          </div>
        </div>
      </section>
    </>
  );
}
