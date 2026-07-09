import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Link from 'next/link';
import { AUTO } from '@/lib/branding';

export const metadata: Metadata = pageMeta({
  title: 'Miami Car Rental FAQ',
  description: 'Answers about booking, deposits, mileage, delivery, eligibility, and how request-to-book works when renting a car with Arrivo in Miami.',
  path: '/faq',
});

const FAQS = [
  {
    q: 'How does booking work?',
    a: 'Every booking is request-to-book. You submit a request with your dates, our team verifies availability and your details, and we confirm by email. There is no instant booking and nothing is charged when you request.',
  },
  {
    q: 'Is my card charged when I request a vehicle?',
    a: 'No. Submitting a request places no charge. Any deposit or payment is arranged with you directly after your booking is reviewed and approved.',
  },
  {
    q: 'What do I need to book?',
    a: 'A valid driver’s license and to meet basic eligibility and age requirements. We verify these as part of the review before confirming.',
  },
  {
    q: 'Is there a security deposit?',
    a: 'A refundable deposit may apply and varies by vehicle. The exact amount is confirmed with you before pickup — never a surprise at the counter.',
  },
  {
    q: 'How does mileage work?',
    a: 'Each vehicle has its own mileage allowance, shown on its detail page once published. Any additional miles are billed at the per-mile rate listed for that vehicle.',
  },
  {
    q: 'Do you offer delivery?',
    a: 'Delivery is available on select vehicles and by request. Tell us where you’d like the vehicle and we’ll confirm options and any delivery fee during review.',
  },
  {
    q: 'Why is it “request to book” and not instant?',
    a: 'Our vehicles are individually managed and some may also be listed on other platforms, so we confirm each request against the live calendar before approving. It means your booking is real and verified rather than an auto-accept that can fall through.',
  },
  {
    q: 'Who is Arrivo?',
    a: `${AUTO.name} is the mobility brand connected to the Auren ecosystem, alongside Vantage Stays. We make it simple to book the right vehicle for your stay, trip, or lifestyle.`,
  },
  {
    q: 'How do I get help?',
    a: `Reach us any time at ${AUTO.email} or through our contact form and we’ll get back to you promptly.`,
  },
];

// FAQPage JSON-LD built from the same FAQS array the page renders — keeps
// the schema and the visible content in lockstep (a Google requirement).
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <div className="container page-head">
        <div className="eyebrow">FAQ</div>
        <h1 className="page-title">
          Questions, <em>Answered.</em>
        </h1>
        <p className="section-sub">
          The essentials on booking, deposits, mileage, delivery, and how request-to-book works.
        </p>
      </div>

      <section className="section-tight">
        <div className="container">
          <div className="faq-list">
            {FAQS.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p className="muted" style={{ textAlign: 'center', marginTop: 28 }}>
            Still have a question? <Link href="/contact" style={{ color: 'var(--gold)' }}>Contact us →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
