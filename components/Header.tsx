'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { AUTO } from '@/lib/branding';

const DESKTOP_NAV = [
  { href: '/rent', label: 'Rent' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/host', label: 'Host Your Vehicle' },
  { href: '/source', label: 'Source a Vehicle' },
  { href: '/about', label: 'About' },
];
// Mobile gets the full set plus FAQ/Contact.
const MOBILE_NAV = [...DESKTOP_NAV, { href: '/faq', label: 'FAQ' }, { href: '/contact', label: 'Contact' }];

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
          {MOBILE_NAV.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/rent" onClick={() => setOpen(false)}>Book Now</Link>
        </div>
      )}
    </header>
  );
}
