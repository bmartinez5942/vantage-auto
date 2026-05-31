'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitVehicleBooking, type FormResult } from '@/app/actions';

const initial: FormResult = { ok: false };

function isoOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary btn-block" disabled={pending}>
      {pending ? 'Sending…' : 'Request to Book'}
    </button>
  );
}

export function BookingRequestForm({ vehicleId }: { vehicleId: string }) {
  const [state, formAction] = useFormState(submitVehicleBooking, initial);

  if (state.ok) {
    return (
      <div className="form-success">
        <strong style={{ display: 'block', marginBottom: 8 }}>Request received</strong>
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="vehicleId" value={vehicleId} />
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="bk-pickup">Pick-up</label>
          <input id="bk-pickup" name="pickup" type="date" defaultValue={isoOffset(1)} required />
        </div>
        <div className="form-field">
          <label htmlFor="bk-return">Return</label>
          <input id="bk-return" name="ret" type="date" defaultValue={isoOffset(2)} required />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="bk-name">Full name</label>
        <input id="bk-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="form-field">
        <label htmlFor="bk-email">Email</label>
        <input id="bk-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="form-field">
        <label htmlFor="bk-phone">Phone</label>
        <input id="bk-phone" name="phone" type="tel" autoComplete="tel" required />
      </div>
      <div className="form-field">
        <label htmlFor="bk-notes">Notes (optional)</label>
        <textarea id="bk-notes" name="notes" rows={3} />
      </div>
      {/* honeypot */}
      <input className="hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state.error && <div className="form-error">{state.error}</div>}
      <SubmitBtn />
      <p className="form-finep">
        No charge is collected now. Every booking is request-to-book — we verify availability, your license, and
        eligibility, then follow up by email to finalize.
      </p>
    </form>
  );
}
