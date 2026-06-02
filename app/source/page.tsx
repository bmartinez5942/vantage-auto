import type { Metadata } from 'next';
import { SourceForm } from './SourceForm';
import { IconSearch, IconKey, IconCheck, IconShield } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Source a Vehicle — Arrivo',
  description: 'Tell us what you want and we’ll find, vet, and acquire the right vehicle for you.',
};

const STEPS = [
  { n: '1', icon: <IconSearch />, title: 'Brief us', body: 'Share the vehicle, budget, and timeline you have in mind.' },
  { n: '2', icon: <IconShield />, title: 'We search', body: 'We tap our network and the market to find the right match.' },
  { n: '3', icon: <IconCheck />, title: 'We vet', body: 'Each candidate is inspected, history-checked, and verified.' },
  { n: '4', icon: <IconKey />, title: 'You decide', body: 'We present options and handle acquisition end to end.' },
];

export default function SourcePage() {
  return (
    <>
      <div className="container page-head">
        <div className="eyebrow">Vehicle Sourcing</div>
        <h1 className="page-title">
          We’ll Find the<br />Right <em>Vehicle.</em>
        </h1>
        <p className="section-sub">
          Looking for something specific — to buy or to add to the Arrivo fleet? Tell us what you need and our
          team will source, vet, and acquire it on your behalf.
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
            Start Your <em>Search</em>
          </h2>
          <SourceForm />
        </div>
      </section>
    </>
  );
}
