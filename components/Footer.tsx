import Link from 'next/link';
import { AUTO } from '@/lib/branding';
import { IconInstagram, IconLinkedIn, IconMail } from '@/components/icons';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-wordmark">
              <span className="brand-mark">V</span>
              <span className="brand-name">Vantage</span>
              <span className="brand-suffix">Auto</span>
            </div>
            <p className="footer-blurb">
              Vehicle rentals, hosting, and sourcing — connected to the Auren ecosystem.
            </p>
            <div className="footer-social" aria-label="Follow Vantage Auto">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><IconInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><IconLinkedIn /></a>
              <a href={`mailto:${AUTO.email}`} aria-label="Email"><IconMail /></a>
            </div>
          </div>

          <div className="footer-col">
            <h6>Company</h6>
            <Link href="/about">About Us</Link>
            <Link href="/rent">Our Fleet</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="footer-col">
            <h6>Services</h6>
            <Link href="/rent">Rent a Vehicle</Link>
            <Link href="/host">Host Your Vehicle</Link>
            <Link href="/source">Source a Vehicle</Link>
          </div>

          <div className="footer-col">
            <h6>Stay in the know</h6>
            <p className="footer-blurb" style={{ marginTop: 0, marginBottom: 12 }}>
              Subscribe for updates and exclusive offers.
            </p>
            <form className="footer-sub-input" action={`mailto:${AUTO.email}`} method="get">
              <input type="email" name="email" placeholder="Enter your email" aria-label="Email" />
              <button type="submit" className="btn-primary btn-sm" aria-label="Subscribe">
                →
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {AUTO.legalName}. All rights reserved.</span>
          <span className="gold">Designed for the journey ahead.</span>
        </div>
      </div>
    </footer>
  );
}
