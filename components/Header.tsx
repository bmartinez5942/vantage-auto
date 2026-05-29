'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { AUTO, NAV_LINKS } from '@/lib/branding';

function Wordmark() {
  return (
    <>
      <span className="brand-mark">V</span>
      <span>
        {AUTO.wordmark.map((ch, i) => (
          <span key={i}>
            {ch}
            {i < AUTO.wordmark.length - 1 && <span className="brand-ornament">·</span>}
          </span>
        ))}
      </span>
      <span className="brand-suffix">Auto</span>
    </>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = open ? 'hidden' : original;
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link href="/" className="brand-wordmark" aria-label="Vantage Auto — home">
            <Wordmark />
          </Link>

          <nav className="nav-desktop" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
            <ThemeToggle />
            <Link href="/rent" className="btn-primary btn-sm">
              Book Now
            </Link>
          </nav>

          <div className="nav-mobile-cluster">
            <ThemeToggle />
            <button
              type="button"
              className="nav-menu-btn"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className={`scrim${open ? ' open' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside className={`mobile-drawer${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="brand-wordmark">
          <Wordmark />
        </div>
        <nav className="mobile-drawer-nav" aria-label="Mobile">
          <Link href="/rent" className="mobile-drawer-cta">
            Book Now →
          </Link>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="mobile-drawer-foot">
          <a href={`mailto:${AUTO.email}`}>{AUTO.email}</a>
        </div>
      </aside>
    </>
  );
}
