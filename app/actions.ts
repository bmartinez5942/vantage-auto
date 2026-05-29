'use server';

// Public form writes. All inserts go through the service-role serverClient
// (RLS grants anon SELECT only, never INSERT). Nothing auto-confirms — every
// submission is an intake the team reviews in the admin.
import { z } from 'zod';
import { serverClient } from '@/lib/supabase';

export type FormResult = {
  ok: boolean;
  error?: string;
  message?: string;
};

const emailRule = z.string().trim().email('Enter a valid email.');
const nameRule = z.string().trim().min(2, 'Name is required.').max(120);
const phoneRule = z.string().trim().min(7, 'Enter a valid phone number.').max(40);

function trapped(formData: FormData): boolean {
  // Honeypot — real users never fill the hidden "company" field.
  return Boolean((formData.get('company') as string)?.trim());
}

// ============================ HOST SUBMISSION ============================
const num = (v: FormDataEntryValue | null) => {
  const n = parseFloat(String(v ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : null;
};
const int = (v: FormDataEntryValue | null) => {
  const n = parseInt(String(v ?? '').replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) ? n : null;
};

const hostSchema = z.object({
  ownerName: nameRule,
  email: emailRule,
  phone: phoneRule,
  city: z.string().trim().max(120).optional(),
  year: z.string().trim().optional(),
  make: z.string().trim().min(1, 'Make is required.').max(60),
  model: z.string().trim().min(1, 'Model is required.').max(60),
});

export async function submitHostListing(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  if (trapped(formData)) return { ok: true, message: 'Submission received.' };

  const parsed = hostSchema.safeParse({
    ownerName: formData.get('ownerName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    city: formData.get('city') ?? undefined,
    year: formData.get('year') ?? undefined,
    make: formData.get('make'),
    model: formData.get('model'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }
  const d = parsed.data;

  // Documentation/condition fields don't have dedicated columns yet, so we
  // capture them into a structured block prepended to the notes field. This
  // keeps the data visible to admins without requiring a schema migration.
  const str = (k: string) => (formData.get(k) as string)?.trim() || '';
  const docLines: string[] = [];
  const vin = str('vin');
  const titleStatus = str('titleStatus');
  const insuranceStatus = str('insuranceStatus');
  const registrationStatus = str('registrationStatus');
  const accidentHistory = str('accidentHistory');
  const photoLinks = str('photoLinks');
  if (vin) docLines.push(`VIN: ${vin}`);
  if (titleStatus) docLines.push(`Title status: ${titleStatus}`);
  if (insuranceStatus) docLines.push(`Insurance status: ${insuranceStatus}`);
  if (registrationStatus) docLines.push(`Registration status: ${registrationStatus}`);
  if (accidentHistory) docLines.push(`Accident/damage history: ${accidentHistory}`);
  if (photoLinks) docLines.push(`Photo links: ${photoLinks}`);
  const ownerNotes = str('notes');
  const combinedNotes =
    [
      docLines.length ? `--- Documentation & condition ---\n${docLines.join('\n')}` : '',
      ownerNotes ? `--- Owner notes ---\n${ownerNotes}` : '',
    ]
      .filter(Boolean)
      .join('\n\n') || null;

  const sb = serverClient();
  const { error } = await sb.from('vehicle_host_submissions').insert({
    owner_name: d.ownerName,
    email: d.email,
    phone: d.phone,
    city: d.city || null,
    vehicle_year: int(formData.get('year')),
    make: d.make,
    model: d.model,
    trim: (formData.get('trim') as string)?.trim() || null,
    mileage: int(formData.get('mileage')),
    availability_pref: (formData.get('availability') as string)?.trim() || null,
    delivery_pref: (formData.get('deliveryPref') as string)?.trim() || null,
    notes: combinedNotes,
    requested_daily_rate: num(formData.get('reqDaily')),
    requested_weekly_rate: num(formData.get('reqWeekly')),
    requested_monthly_rate: num(formData.get('reqMonthly')),
    requested_mileage_limit: int(formData.get('reqMileage')),
    requested_security_deposit: num(formData.get('reqDeposit')),
    status: 'new',
  });
  if (error) {
    console.error('submitHostListing insert:', error.message);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
  return {
    ok: true,
    message:
      'Thank you — your vehicle has been submitted for review. Our team personally vets every vehicle ' +
      'and will reach out to discuss next steps, pricing, and onboarding. Nothing is listed automatically.',
  };
}

// ============================ CONTACT MESSAGE ============================
const contactSchema = z.object({
  name: nameRule,
  email: emailRule,
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().max(160).optional(),
  message: z.string().trim().min(5, 'Please enter a short message.').max(4000),
});

export async function submitContactMessage(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  if (trapped(formData)) return { ok: true, message: 'Message received.' };

  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') ?? undefined,
    subject: formData.get('subject') ?? undefined,
    message: formData.get('message'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }
  const d = parsed.data;

  const sb = serverClient();
  const { error } = await sb.from('contact_messages').insert({
    name: d.name,
    email: d.email,
    phone: d.phone || null,
    subject: d.subject || null,
    message: d.message,
    source: 'vantage-auto',
    status: 'new',
  });
  if (error) {
    console.error('submitContactMessage insert:', error.message);
    return { ok: false, error: 'Something went wrong sending your message. Please try again.' };
  }
  return {
    ok: true,
    message: 'Thanks for reaching out — your message has been received and our team will reply by email shortly.',
  };
}

// ============================ SOURCE REQUEST ============================
const sourceSchema = z.object({
  fullName: nameRule,
  email: emailRule,
  phone: phoneRule,
  desired: z.string().trim().min(2, 'Tell us what you are looking for.').max(200),
});

export async function submitSourceRequest(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  if (trapped(formData)) return { ok: true, message: 'Request received.' };

  const parsed = sourceSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    desired: formData.get('desired'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }
  const d = parsed.data;

  const sb = serverClient();
  const { error } = await sb.from('vehicle_source_requests').insert({
    full_name: d.fullName,
    email: d.email,
    phone: d.phone,
    desired_make_model: d.desired,
    year_min: int(formData.get('yearMin')),
    year_max: int(formData.get('yearMax')),
    budget: num(formData.get('budget')),
    color_pref: (formData.get('color') as string)?.trim() || null,
    financing_needed: formData.get('financing') === 'on',
    trade_in: formData.get('tradeIn') === 'on',
    timeline: (formData.get('timeline') as string)?.trim() || null,
    notes: (formData.get('notes') as string)?.trim() || null,
    status: 'new',
  });
  if (error) {
    console.error('submitSourceRequest insert:', error.message);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
  return {
    ok: true,
    message:
      'Request received. Our sourcing team will begin the search and reach out with options that match ' +
      'your criteria, timeline, and budget.',
  };
}
