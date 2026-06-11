// Email notification for public form submissions. Fire-and-forget: an email
// failure must NEVER break the form submit, so everything is wrapped in
// try/catch and we no-op (with a log) when RESEND_API_KEY isn't configured.
//
// Setup (one-time): create a free key at resend.com, add RESEND_API_KEY to the
// Vercel project env. From `onboarding@resend.dev` you can email the address
// you signed up with immediately; verify the aurengroup.us domain later to send
// from a branded address and to other recipients. Override the recipient with
// NOTIFY_TO if needed.

const NOTIFY_TO = (process.env.NOTIFY_TO || 'bez.sellsmiami@gmail.com').trim();
const NOTIFY_FROM = (process.env.NOTIFY_FROM || 'Arrivo <onboarding@resend.dev>').trim();

type Fields = Record<string, string | number | null | undefined>;

const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function notifyInquiry(subject: string, fields: Fields, replyTo?: string): Promise<void> {
  // Trim — a stray space/newline pasted into the env var makes the
  // Authorization header invalid and fetch throws a TypeError.
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.warn('[notify] RESEND_API_KEY not set — skipping email for:', subject);
    return;
  }
  const rows = Object.entries(fields)
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#8a8a8a;font:13px/1.5 -apple-system,Segoe UI,sans-serif;vertical-align:top;white-space:nowrap">${esc(
          k,
        )}</td><td style="padding:6px 0;color:#1a1a1a;font:13px/1.5 -apple-system,Segoe UI,sans-serif;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join('');
  const html = `<div style="max-width:560px;margin:0 auto;font-family:-apple-system,Segoe UI,sans-serif">
    <h2 style="font:500 18px/1.3 -apple-system,Segoe UI,sans-serif;color:#111;margin:0 0 14px">${esc(subject)}</h2>
    <table style="border-collapse:collapse">${rows}</table>
    <p style="color:#aaa;font:12px sans-serif;margin:18px 0 0">Sent automatically from Arrivo · bearrivo.com</p>
  </div>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) console.error('[notify] resend error', res.status, await res.text().catch(() => ''));
  } catch (err) {
    console.error('[notify] send failed:', err instanceof Error ? `${err.name}: ${err.message}` : String(err));
  }
}
