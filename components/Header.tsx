'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { AUTO, NAV_LINKS } from '@/lib/branding';

// Desktop nav stays to the three primary actions (matches the approved render);
// About/Contact live in the footer and the mobile menu.
const DESKTOP_NAV = NAV_LINKS.slice(0, 3);

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="va-header">
      <Link href="/" className="va-brand" aria-label={`${AUTO.name} — home`}>
        <span className="va-brand-mark">V</span>
        <span>{AUTO.name}</span>
      </Link>

      <nav className="va-desktop-nav" aria-label="Primary">
        {DESKTOP_NAV.map((l) => (
          <Link key={l.href} href={l.href}>{l.label}</Link>
        ))}
      </nav>

      <div className="va-header-actions">
        <ThemeToggle />
        <Link href="/rent" className="va-book-button">Book Now</Link>
        <button
          type="button"
          className="va-mobile-menu-button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="va-mobile-menu">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/rent" onClick={() => setOpen(false)}>Book Now</Link>
        </div>
      )}
    </header>
  );
}
