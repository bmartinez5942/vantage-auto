import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { HostForm } from './HostForm';
import { IconCheck, IconShield, IconCalendar, IconStar } from '@/components/icons';

export const metadata: Metadata = pageMeta({
  title: 'Earn Income Hosting Your Car in Miami',
  description: 'Turn your vehicle into income in Miami. Arrivo handles listing, guest screening, and bookings — submit your car for review and start earning.',
  path: '/host',
});

const STEPS = [
  { n: '1', icon: <IconStar />, title: 'Submit', body: 'Tell us about your vehicle and the terms you have in mind.' },
  { n: '2', icon: <IconShield />, title: 'Review', body: 'We review condition, documents, and eligibility together.' },
  { n: '3', icon: <IconCalendar />, title: 'Onboard', body: 'We finalize pricing, photos, and your availability with you.' },
  { n: '4', icon: <IconCheck />, title: 'Earn', body: 'Your vehicle goes live and you earn on every confirmed booking.' },
];

export default function HostPage() {
  return (
    <>
      <div className="container page-head">
        <div className="eyebrow">Host With Arrivo</div>
        <h1 className="page-title">
          Turn Your Vehicle<br />Into <em>Income.</em>
        </h1>
        <p className="section-sub">
          Submit your vehicle for review and our team will walk you through eligibility, management terms, and
          expected earnings during onboarding.
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
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 className="section-title" style={{ marginBottom: 18 }}>
            Submit Your <em>Vehicle</em>
          </h2>
          <HostForm />
        </div>
      </section>
    </>
  );
}
