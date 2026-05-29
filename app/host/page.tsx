import type { Metadata } from 'next';
import { HostForm } from './HostForm';
import { IconCheck, IconShield, IconCalendar, IconStar } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Host Your Vehicle — Vantage Auto',
  description: 'Turn your vehicle into income. Vantage Auto professionally manages, insures, and books your car.',
};

const STEPS = [
  { n: '1', icon: <IconStar />, title: 'Submit', body: 'Tell us about your vehicle and the terms you have in mind.' },
  { n: '2', icon: <IconShield />, title: 'Review', body: 'We personally vet condition, documents, and insurance.' },
  { n: '3', icon: <IconCalendar />, title: 'Onboard', body: 'We finalize pricing, photos, and your availability with you.' },
  { n: '4', icon: <IconCheck />, title: 'Earn', body: 'Your vehicle goes live and you earn on every confirmed booking.' },
];

export default function HostPage() {
  return (
    <>
      <div className="container page-head">
        <div className="eyebrow">Host With Vantage Auto</div>
        <h1 className="page-title">
          Turn Your Vehicle<br />Into <em>Income.</em>
        </h1>
        <p className="section-sub">
          We handle the listing, screening, insurance coordination, and bookings. You keep the majority of every
          rental. Default split is 80% to you, 20% to Vantage Auto — finalized together during onboarding.
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
