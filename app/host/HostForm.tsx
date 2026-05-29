'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitHostListing, type FormResult } from '@/app/actions';

const initial: FormResult = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary btn-block" disabled={pending}>
      {pending ? 'Submitting…' : 'Submit Vehicle for Review'}
    </button>
  );
}

export function HostForm() {
  const [state, formAction] = useFormState(submitHostListing, initial);

  if (state.ok) {
    return (
      <div className="form-card">
        <div className="form-success">
          <strong style={{ display: 'block', marginBottom: 8 }}>Submitted for review</strong>
          {state.message}
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="form-card">
      <div className="form-section-label">About you</div>
      <div className="form-field">
        <label htmlFor="hf-name">Full name</label>
        <input id="hf-name" name="ownerName" type="text" autoComplete="name" required />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="hf-email">Email</label>
          <input id="hf-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="form-field">
          <label htmlFor="hf-phone">Phone</label>
          <input id="hf-phone" name="phone" type="tel" autoComplete="tel" required />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="hf-city">City</label>
        <input id="hf-city" name="city" type="text" placeholder="Miami, FL" />
      </div>

      <div className="form-section-label">Your vehicle</div>
      <div className="form-row-3">
        <div className="form-field">
          <label htmlFor="hf-year">Year</label>
          <input id="hf-year" name="year" type="text" inputMode="numeric" placeholder="2022" />
        </div>
        <div className="form-field">
          <label htmlFor="hf-make">Make</label>
          <input id="hf-make" name="make" type="text" placeholder="BMW" required />
        </div>
        <div className="form-field">
          <label htmlFor="hf-model">Model</label>
          <input id="hf-model" name="model" type="text" placeholder="X5" required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="hf-trim">Trim (optional)</label>
          <input id="hf-trim" name="trim" type="text" placeholder="xDrive40i" />
        </div>
        <div className="form-field">
          <label htmlFor="hf-mileage">Current mileage</label>
          <input id="hf-mileage" name="mileage" type="text" inputMode="numeric" placeholder="32,000" />
        </div>
      </div>

      <div className="form-section-label">Documentation & condition</div>
      <p className="form-finep" style={{ marginTop: 0, marginBottom: 14 }}>
        This helps us confirm eligibility. Our team verifies all documents during onboarding — you can
        share copies and full photo sets then.
      </p>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="hf-vin">VIN</label>
          <input id="hf-vin" name="vin" type="text" placeholder="17-character VIN" maxLength={17} />
        </div>
        <div className="form-field">
          <label htmlFor="hf-title">Title status</label>
          <select id="hf-title" name="titleStatus" defaultValue="">
            <option value="" disabled>Select…</option>
            <option value="clean">Clean</option>
            <option value="rebuilt">Rebuilt / reconstructed</option>
            <option value="salvage">Salvage</option>
            <option value="lien">Lien / financed</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="hf-insurance">Insurance status</label>
          <select id="hf-insurance" name="insuranceStatus" defaultValue="">
            <option value="" disabled>Select…</option>
            <option value="active-personal">Active — personal policy</option>
            <option value="active-commercial">Active — commercial / rental policy</option>
            <option value="none">Not currently insured</option>
            <option value="unsure">Not sure</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="hf-registration">Registration status</label>
          <select id="hf-registration" name="registrationStatus" defaultValue="">
            <option value="" disabled>Select…</option>
            <option value="current">Current</option>
            <option value="expiring-soon">Expiring soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="hf-accident">Accident / damage history</label>
        <textarea id="hf-accident" name="accidentHistory" rows={3} placeholder="Any accidents, prior damage, or open mechanical issues? Enter 'None' if clean." />
      </div>
      <div className="form-field">
        <label htmlFor="hf-photos">Photo links (optional)</label>
        <input id="hf-photos" name="photoLinks" type="text" placeholder="Paste a link to a photo album, or leave blank — we'll request photos during onboarding." />
      </div>

      <div className="form-section-label">Requested settings</div>
      <p className="form-finep" style={{ marginTop: 0, marginBottom: 14 }}>
        These are requests only. Our team reviews every vehicle and confirms final pricing with you —
        nothing is listed automatically.
      </p>
      <div className="form-row-3">
        <div className="form-field">
          <label htmlFor="hf-daily">Daily rate</label>
          <input id="hf-daily" name="reqDaily" type="text" inputMode="decimal" placeholder="$150" />
        </div>
        <div className="form-field">
          <label htmlFor="hf-weekly">Weekly rate</label>
          <input id="hf-weekly" name="reqWeekly" type="text" inputMode="decimal" placeholder="$900" />
        </div>
        <div className="form-field">
          <label htmlFor="hf-monthly">Monthly rate</label>
          <input id="hf-monthly" name="reqMonthly" type="text" inputMode="decimal" placeholder="$3,200" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="hf-milelimit">Daily mileage limit</label>
          <input id="hf-milelimit" name="reqMileage" type="text" inputMode="numeric" placeholder="200" />
        </div>
        <div className="form-field">
          <label htmlFor="hf-deposit">Requested deposit</label>
          <input id="hf-deposit" name="reqDeposit" type="text" inputMode="decimal" placeholder="$500" />
        </div>
      </div>

      <div className="form-section-label">Availability & delivery</div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="hf-avail">Availability preference</label>
          <input id="hf-avail" name="availability" type="text" placeholder="Weekends, long-term, etc." />
        </div>
        <div className="form-field">
          <label htmlFor="hf-delivery">Delivery preference</label>
          <input id="hf-delivery" name="deliveryPref" type="text" placeholder="Pickup only, will deliver, etc." />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="hf-notes">Anything else we should know?</label>
        <textarea id="hf-notes" name="notes" rows={4} />
      </div>

      {/* honeypot */}
      <input className="hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {state.error && <div className="form-error">{state.error}</div>}

      <SubmitButton />
    </form>
  );
}
