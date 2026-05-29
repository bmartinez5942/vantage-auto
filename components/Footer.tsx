import Link from 'next/link';
import { AUTO } from '@/lib/branding';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-wordmark">
              <span className="brand-mark">V</span>
              <span>VANTAGE</span>
              <span className="brand-suffix">Auto</span>
            </div>
            <p className="footer-blurb">
              Premium vehicle rentals, hosting, and sourcing — part of the Auren ecosystem alongside
              Vantage Stays.
            </p>
          </div>

          <div className="footer-col">
            <h6>Services</h6>
            <Link href="/rent">Rent a Vehicle</Link>
            <Link href="/host">Host Your Vehicle</Link>
            <Link href="/source">Source a Vehicle</Link>
          </div>

          <div className="footer-col">
            <h6>Company</h6>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <a href="https://vantagestays.miami" target="_blank" rel="noreferrer">Vantage Stays</a>
          </div>

          <div className="footer-col">
            <h6>Stay in the know</h6>
            <p className="footer-blurb" style={{ marginTop: 0 }}>
              Be the first to see new vehicles and seasonal offers.
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
