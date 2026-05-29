import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Image Credits — Vantage Auto',
  description: 'Attribution for vehicle photography used on Vantage Auto.',
};

type Credit = {
  vehicle: string;
  source: string;
  href: string;
  license: string;
  author: string;
};

// Mirrors public/images/auto/CREDITS.md. Every image was verified to match its
// label before use. CC BY-SA 4.0 requires attribution — surfaced here publicly.
const CREDITS: Credit[] = [
  { vehicle: 'Mercedes-Benz G63', source: 'Mercedes-AMG G 63 (Geneva 2018)', href: 'https://commons.wikimedia.org/wiki/File:Mercedes-AMG_G_63_Genf_2018.jpg', license: 'CC BY-SA 4.0', author: 'Alexander Migl' },
  { vehicle: 'Mercedes-Benz S-Class', source: 'Mercedes-Benz W223 (IAA 2021)', href: 'https://commons.wikimedia.org/wiki/File:Mercedes-Benz_W223_IAA_2021_1X7A0206.jpg', license: 'CC BY-SA 4.0', author: 'Alexander Migl' },
  { vehicle: 'Porsche 911', source: 'Porsche 992 Carrera S coupe', href: 'https://commons.wikimedia.org/wiki/File:Porsche_992_Carrera_S_coupe_IMG_5832.jpg', license: 'CC BY-SA 4.0', author: 'Alexander Migl' },
  { vehicle: 'BMW 3 Series', source: 'BMW 3 Series Sedan (G20)', href: 'https://commons.wikimedia.org/wiki/File:BMW_3_SERIES_SEDAN_(G20)_China.jpg', license: 'CC BY-SA 4.0', author: 'Dinkun Chen' },
  { vehicle: 'Mercedes-Benz C300', source: '2023 Mercedes-Benz C-Class (W206)', href: 'https://commons.wikimedia.org/wiki/File:2023_Mercedes-Benz_C-Class_C220d_AMG_Line.jpg', license: 'CC BY-SA 4.0', author: 'Chanokchon' },
  { vehicle: 'BMW 5 Series', source: 'BMW G60 520i', href: 'https://commons.wikimedia.org/wiki/File:BMW_G60_520i_1X7A2443.jpg', license: 'CC BY-SA 4.0', author: 'Alexander-93' },
  { vehicle: 'BMW X5', source: 'BMW X5 G05 xDrive30d', href: 'https://commons.wikimedia.org/wiki/File:BMW_X5_G05_xDrive30d_Mineral_White_Metallic.jpg', license: 'CC BY-SA 4.0', author: 'Ethan Llamas' },
  { vehicle: 'Toyota Corolla', source: 'Toyota Corolla Sedan (E210)', href: 'https://commons.wikimedia.org/wiki/File:TOYOTA_COROLLA_SEDAN_(E210)_China.jpg', license: 'CC BY-SA 4.0', author: 'Dinkun Chen' },
  { vehicle: 'Chrysler Pacifica', source: 'Chrysler Pacifica (RU)', href: 'https://commons.wikimedia.org/wiki/File:Chrysler_Pacifica_(RU)_IMG_8281.jpg', license: 'CC BY-SA 4.0', author: 'Alexander-93' },
];

export default function AttributionsPage() {
  return (
    <>
      <div className="container page-head">
        <div className="eyebrow">Credits</div>
        <h1 className="page-title">
          Image <em>Attributions.</em>
        </h1>
        <p className="section-sub">
          Vehicle photography is sourced from Wikimedia Commons and verified to match the labeled model
          before use. Each image is used under its Creative Commons license, with attribution below.
        </p>
      </div>

      <section className="section-tight">
        <div className="container" style={{ maxWidth: 820 }}>
          <ul className="attrib-list">
            {CREDITS.map((c) => (
              <li key={c.vehicle} className="attrib-row">
                <div className="attrib-vehicle">{c.vehicle}</div>
                <div className="attrib-meta">
                  <a href={c.href} target="_blank" rel="noreferrer noopener">{c.source}</a>
                  <span className="attrib-dot">·</span>
                  {c.author}
                  <span className="attrib-dot">·</span>
                  <span className="attrib-license">{c.license}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="form-finep" style={{ marginTop: 22 }}>
            Licensed under{' '}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer noopener" style={{ color: 'var(--gold)' }}>
              CC BY-SA 4.0
            </a>
            . Images were resized and recompressed for the web. Photography will be replaced with Vantage Auto&apos;s
            own as it becomes available. Questions? <Link href="/contact" style={{ color: 'var(--gold)' }}>Contact us</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
