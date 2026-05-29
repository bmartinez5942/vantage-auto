'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitSourceRequest, type FormResult } from '@/app/actions';

const initial: FormResult = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary btn-block" disabled={pending}>
      {pending ? 'Submitting…' : 'Submit Sourcing Request'}
    </button>
  );
}

export function SourceForm() {
  const [state, formAction] = useFormState(submitSourceRequest, initial);

  if (state.ok) {
    return (
      <div className="form-card">
        <div className="form-success">
          <strong style={{ display: 'block', marginBottom: 8 }}>Request received</strong>
          {state.message}
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="form-card">
      <div className="form-section-label">About you</div>
      <div className="form-field">
        <label htmlFor="sf-name">Full name</label>
        <input id="sf-name" name="fullName" type="text" autoComplete="name" required />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="sf-email">Email</label>
          <input id="sf-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="form-field">
          <label htmlFor="sf-phone">Phone</label>
          <input id="sf-phone" name="phone" type="tel" autoComplete="tel" required />
        </div>
      </div>

      <div className="form-section-label">What you’re looking for</div>
      <div className="form-field">
        <label htmlFor="sf-desired">Make & model (or describe it)</label>
        <input id="sf-desired" name="desired" type="text" placeholder="e.g. Porsche Macan, or 'a reliable 3-row SUV'" required />
      </div>
      <div className="form-row-3">
        <div className="form-field">
          <label htmlFor="sf-ymin">Year from</label>
          <input id="sf-ymin" name="yearMin" type="text" inputMode="numeric" placeholder="2021" />
        </div>
        <div className="form-field">
          <label htmlFor="sf-ymax">Year to</label>
          <input id="sf-ymax" name="yearMax" type="text" inputMode="numeric" placeholder="2024" />
        </div>
        <div className="form-field">
          <label htmlFor="sf-budget">Budget</label>
          <input id="sf-budget" name="budget" type="text" inputMode="decimal" placeholder="$60,000" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="sf-color">Color preference</label>
          <input id="sf-color" name="color" type="text" placeholder="No preference" />
        </div>
        <div className="form-field">
          <label htmlFor="sf-timeline">Timeline</label>
          <input id="sf-timeline" name="timeline" type="text" placeholder="Within 30 days" />
        </div>
      </div>

      <label className="form-check" style={{ marginBottom: 12 }}>
        <input type="checkbox" name="financing" /> I’d like financing options
      </label>
      <label className="form-check" style={{ marginBottom: 16 }}>
        <input type="checkbox" name="tradeIn" /> I have a trade-in
      </label>

      <div className="form-field">
        <label htmlFor="sf-notes">Additional details</label>
        <textarea id="sf-notes" name="notes" rows={4} />
      </div>

      {/* honeypot */}
      <input className="hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {state.error && <div className="form-error">{state.error}</div>}

      <SubmitButton />
    </form>
  );
}
