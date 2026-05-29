import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { VehicleCard } from '@/components/VehicleCard';
import { fetchFeaturedVehicles } from '@/lib/vehicles';
import {
  IconCar, IconKey, IconSearch, IconShield, IconCalendar, IconStar, IconArrow, IconPlus, IconHeart,
} from '@/components/icons';

export const revalidate = 300;

const HERO_IMG =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80';

const SERVICES = [
  {
    icon: <IconCar />,
    title: 'Rent a Vehicle',
    body: 'Browse available vehicles, select your dates, and request your booking directly.',
    href: '/rent',
    img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    icon: <IconKey />,
    title: 'Host Your Vehicle',
    body: 'Submit your vehicle for review and turn it into a managed income opportunity.',
    href: '/host',
    img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    icon: <IconSearch />,
    title: 'Source a Vehicle',
    body: 'Looking for a specific vehicle? Our team can help source, inspect, and negotiate.',
    href: '/source',
    img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
  },
];

const WHY = [
  { icon: <IconShield />, title: 'Professionally Managed', body: 'Every vehicle is reviewed, documented, and managed according to our platform standards.' },
  { icon: <IconCalendar />, title: 'Calendar-Based Booking', body: 'Real-time availability and seamless booking that fits your schedule.' },
  { icon: <IconStar />, title: 'Guest-Focused Experience', body: 'Designed to elevate every stay with comfort, convenience, and choice.' },
  { icon: <IconKey />, title: 'Integrated with Auren', body: 'Seamlessly connected to the Auren ecosystem for a unified, end-to-end experience.' },
];

export default async function HomePage() {
  const featured = await fetchFeaturedVehicles(4);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMG} alt="" />
        </div>
        {/* Gold badge anchoring Vantage Auto to the Auren family — top-right
            overlay, mirrors the concept render. */}
        <div className="hero-badge" aria-hidden="true">
          <span className="hero-badge-mark">A</span>
          <span className="hero-badge-text">
            <span className="hero-badge-kicker">From the family of</span>
            AUREN RESIDENCES
          </span>
        </div>
        <div className="container">
          <div className="hero-inner fade">
            <h1>
              Your Stay,<br />Now in <em>Motion.</em>
            </h1>
            <p className="hero-sub">
              From practical daily drivers to premium vehicles, Vantage Auto makes it simple to book the
              right car for your stay, trip, or lifestyle.
            </p>
            <div className="hero-actions">
              <Link href="/rent" className="btn-primary">Rent a Vehicle</Link>
              <Link href="/host" className="btn-ghost">List Your Vehicle</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <div className="container searchbar-wrap">
        <SearchBar />
      </div>

      {/* SERVICES */}
      <section className="section">
        <div className="container">
          <div className="service-grid">
            {SERVICES.map((s) => (
              <Link key={s.title} href={s.href} className="service-card">
                <div className="service-card-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt="" loading="lazy" />
                  <div className="service-card-icon">{s.icon}</div>
                </div>
                <div className="service-card-body">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <span className="service-card-link">Learn More <IconArrow /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section-tight">
        <div className="container">
          <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h2 className="section-title">Featured <em>Vehicles</em></h2>
            <Link href="/rent" className="service-card-link">View All Vehicles <IconArrow /></Link>
          </div>
          {featured.length === 0 ? (
            <div className="empty-state">New vehicles are being added to the collection — check back shortly.</div>
          ) : (
            <ul className="vehicle-grid">
              {featured.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ADD A VEHICLE TO YOUR STAY */}
      <section className="section-tight">
        <div className="container">
          <div className="bundle-band">
            <div className="bundle-grid">
              <div className="bundle-copy">
                <div className="eyebrow">The Perfect Pairing</div>
                <h3>Add a Vehicle<br />to Your <em>Stay.</em></h3>
                <p>Enhance your experience with the perfect vehicle — all in one seamless experience.</p>
                <Link href="/rent" className="btn-primary">Explore Stay + Drive</Link>
              </div>
              <div className="bundle-mini">
                <div className="bundle-mini-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80" alt="" loading="lazy" />
                </div>
                <div className="bundle-mini-body">
                  <div className="bundle-mini-label">Your Stay</div>
                  <div className="bundle-mini-title">Auren Residences Miami</div>
                  <div className="bundle-mini-meta">1 Night · Brickell</div>
                  <a href="https://vantagestays.miami" target="_blank" rel="noreferrer" className="bundle-mini-btn">View Reservation</a>
                </div>
              </div>
              <div className="bundle-plus" aria-hidden="true"><IconPlus /></div>
              <div className="bundle-mini">
                <div className="bundle-mini-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80" alt="" loading="lazy" />
                  <button type="button" className="bundle-mini-fav" aria-label="Save this vehicle"><IconHeart /></button>
                </div>
                <div className="bundle-mini-body">
                  <div className="bundle-mini-label">Recommended Vehicle</div>
                  <div className="bundle-mini-title">BMW X5 xDrive40i</div>
                  <div className="bundle-mini-meta">$165 / day</div>
                  <Link href="/rent" className="bundle-mini-btn bundle-mini-btn-gold">Add to Reservation</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <h2 className="section-title">Why <em>Vantage Auto</em></h2>
          </div>
          <div className="why-grid">
            {WHY.map((w) => (
              <div key={w.title} className="why-item">
                <div className="why-icon">{w.icon}</div>
                <h4>{w.title}</h4>
                <p>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
