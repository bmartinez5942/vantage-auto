'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitContactMessage, type FormResult } from '@/app/actions';

const initial: FormResult = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary btn-block" disabled={pending}>
      {pending ? 'Sending…' : 'Send Message'}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactMessage, initial);

  if (state.ok) {
    return (
      <div className="form-card">
        <div className="form-success">
          <strong style={{ display: 'block', marginBottom: 8 }}>Message sent</strong>
          {state.message}
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="form-card">
      <div className="form-field">
        <label htmlFor="cf-name">Full name</label>
        <input id="cf-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="form-field">
          <label htmlFor="cf-phone">Phone (optional)</label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="cf-subject">Subject (optional)</label>
        <input id="cf-subject" name="subject" type="text" placeholder="Renting, hosting, sourcing…" />
      </div>
      <div className="form-field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" rows={5} required />
      </div>

      {/* honeypot */}
      <input className="hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {state.error && <div className="form-error">{state.error}</div>}

      <SubmitButton />
    </form>
  );
}
