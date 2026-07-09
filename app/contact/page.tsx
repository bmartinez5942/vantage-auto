import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Link from 'next/link';
import { AUTO } from '@/lib/branding';
import { IconPin, IconKey, IconCar } from '@/components/icons';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = pageMeta({
  title: 'Contact — Miami Vehicle Rentals',
  description: 'Get in touch with the Arrivo team in Miami about renting a car, hosting your vehicle, or sourcing your next one.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <div className="container page-head">
        <div className="eyebrow">Contact</div>
        <h1 className="page-title">
          Let’s <em>Talk.</em>
        </h1>
        <p className="section-sub">
          Questions about a rental, hosting your vehicle, or a sourcing request? Reach out and our team will get
          back to you promptly.
        </p>
      </div>

      <section className="section-tight">
        <div className="container">
          <div className="why-grid">
            <div className="why-item">
              <div className="why-icon"><IconKey /></div>
              <h4>Email</h4>
              <p><a href={`mailto:${AUTO.email}`} style={{ color: 'var(--gold)' }}>{AUTO.email}</a></p>
            </div>
            <div className="why-item">
              <div className="why-icon"><IconPin /></div>
              <h4>Service Area</h4>
              <p>{AUTO.cities.join(' · ')}</p>
            </div>
            <div className="why-item">
              <div className="why-icon"><IconCar /></div>
              <h4>Book Online</h4>
              <p><Link href="/rent" style={{ color: 'var(--gold)' }}>Browse the collection →</Link></p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 className="section-title" style={{ marginBottom: 18 }}>
            Send Us a <em>Message</em>
          </h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
