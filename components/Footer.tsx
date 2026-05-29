import Link from 'next/link';
import { IconInstagram, IconLinkedIn, IconMail } from '@/components/icons';
import { AUTO } from '@/lib/branding';

export function Footer() {
  return (
    <footer className="va-footer">
      <div>
        <Link href="/" className="va-brand va-footer-brand" aria-label={`${AUTO.name} — home`}>
          <span className="va-brand-mark">V</span>
          <span>{AUTO.name}</span>
        </Link>
        <p>Vehicle rentals, hosting, and sourcing — connected to the Auren ecosystem.</p>
        <div className="va-socials" aria-label={`Follow ${AUTO.name}`}>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><IconInstagram /></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><IconLinkedIn /></a>
          <a href={`mailto:${AUTO.email}`} aria-label="Email"><IconMail /></a>
        </div>
        <p style={{ marginTop: 18, fontSize: 12, opacity: 0.6 }}>
          © {new Date().getFullYear()} {AUTO.legalName}.{' '}
          <Link href="/attributions" style={{ textDecoration: 'underline' }}>Image credits</Link>
        </p>
      </div>

      <div>
        <h4>Company</h4>
        <Link href="/about">About Us</Link>
        <Link href="/rent">Our Fleet</Link>
        <Link href="/contact">Contact</Link>
      </div>

      <div>
        <h4>Services</h4>
        <Link href="/rent">Rent a Vehicle</Link>
        <Link href="/host">Host Your Vehicle</Link>
        <Link href="/source">Source a Vehicle</Link>
      </div>

      <div>
        <h4>Stay in the Know</h4>
        <p>Subscribe for updates and exclusive offers.</p>
        <form className="va-email-box" action={`mailto:${AUTO.email}`} method="get">
          <input placeholder="Enter your email" type="email" name="email" aria-label="Email" />
          <button type="submit" aria-label="Subscribe">→</button>
        </form>
      </div>
    </footer>
  );
}
