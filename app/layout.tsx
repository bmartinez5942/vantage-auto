import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AUTO } from '@/lib/branding';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const SITE_TITLE = 'Arrivo — The right vehicle, ready when you arrive.';
const SITE_DESC =
  'From practical daily drivers to premium vehicles, Arrivo makes it simple to book the right car for your stay, trip, or lifestyle. Rent, host, or source a vehicle in Miami.';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESC,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? `https://${AUTO.domain}`),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    type: 'website',
    siteName: 'Arrivo',
    url: '/',
  },
  twitter: { card: 'summary_large_image', title: SITE_TITLE, description: SITE_DESC },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// No-flash theme bootstrap: set data-theme (token palette) AND the .va-dark/
// .va-light class (the approved .va- layout system) from localStorage/cookie
// before paint. Defaults to dark.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('va-theme');if(!t){var m=document.cookie.match(/(?:^|; )va-theme=([^;]+)/);t=m?m[1]:null;}if(t!=='light'&&t!=='dark')t='dark';var d=document.documentElement;d.dataset.theme=t;d.classList.remove('va-dark','va-light');d.classList.add('va-'+t);}catch(e){var d=document.documentElement;d.dataset.theme='dark';d.classList.add('va-dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} va-dark`} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <div className="shell">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
