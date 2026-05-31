// Homepage — built on the approved .va- layout foundation, wired to the
// controlled catalog. No phone, no shown pricing (admin-approved only),
// request-to-book only (no instant booking). Header/Footer come from layout.
import Link from 'next/link';
import { Car, UserRound, Search, Calendar, Star, Plus } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { CatalogVehicleCard } from '@/components/CatalogVehicleCard';
import { featuredAutoCards } from '@/lib/autoCatalog';
import { fetchApprovedPricing } from '@/lib/pricing';
import { AUTO } from '@/lib/branding';

export const revalidate = 600;

const BRAND = AUTO.name;

const SERVICES = [
  {
    // SUV moving through a city — premium, not a race/desert scene
    title: 'Rent a Vehicle',
    description: 'Browse available vehicles, select your dates, and request your booking directly.',
    href: '/rent',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1600&auto=format&fit=crop',
    Icon: Car,
  },
  {
    // Vehicle key handoff / owner interaction (not a street scene)
    title: 'Host Your Vehicle',
    description: 'Submit your vehicle for review and turn it into a managed income opportunity.',
    href: '/host',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1600&auto=format&fit=crop',
    Icon: UserRound,
  },
  {
    // Luxury auto showroom / vehicle lineup
    title: 'Source a Vehicle',
    description: 'Looking for a specific vehicle? Our team can help source, inspect, and negotiate.',
    href: '/source',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop',
    Icon: Search,
  },
];

const WHY = [
  { Icon: UserRound, title: 'Professionally Managed', text: 'Every vehicle is reviewed, documented, and managed according to our platform standards.' },
  { Icon: Calendar, title: 'Calendar-Based Booking', text: 'Real-time availability and a request-to-book flow designed around your schedule.' },
  { Icon: Star, title: 'Guest-Focused Experience', text: 'Designed to support every stay with comfort, convenience, and choice.' },
  { Icon: Car, title: 'Integrated with Auren', text: 'Connected to the Auren ecosystem for a seamless, unified experience.' },
];

const featured = [...featuredAutoCards].sort((a, b) => a.priorityOrder - b.priorityOrder).slice(0, 4);

const pairingCta: React.CSSProperties = {
  display: 'block', width: '100%', marginTop: 16, padding: 12, borderRadius: 8,
  border: '1px solid rgba(212,170,112,.5)', textAlign: 'center', fontWeight: 750,
};

export default async function HomePage() {
  const pricing = await fetchApprovedPricing();
  return (
    <div className="va-page">
      {/* HERO */}
      <section className="va-hero">
        <div className="va-hero-content">
          <h1>Your Stay,<br />Now in Motion.</h1>
          <p>
            From practical daily drivers to premium vehicles, {BRAND} makes it simple to book the right car
            for your stay, trip, or lifestyle.
          </p>
          <div className="va-hero-actions">
            <Link href="/rent" className="va-primary-button">Rent a Vehicle</Link>
            <Link href="/host" className="va-secondary-button">List Your Vehicle</Link>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <SearchBar />

      {/* SERVICES */}
      <section className="va-section va-service-grid">
        {SERVICES.map(({ title, description, href, image, Icon }) => (
          <Link href={href} className="va-service-card" key={title}>
            <div className="va-service-image" style={{ backgroundImage: `url(${image})` }} />
            <div className="va-service-body">
              <div className="va-icon-badge"><Icon size={22} /></div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span>Learn More →</span>
            </div>
          </Link>
        ))}
      </section>

      {/* FEATURED */}
      <section className="va-section">
        <div className="va-section-header">
          <h2>Featured Vehicles</h2>
          <Link href="/rent">View All Vehicles →</Link>
        </div>
        <div className="va-vehicle-grid">
          {featured.map((v) => (
            <CatalogVehicleCard key={v.id} vehicle={v} dailyRate={pricing[v.id]?.dailyRate ?? null} />
          ))}
        </div>
      </section>

      {/* ADD A VEHICLE TO YOUR STAY */}
      <section className="va-section va-pairing-section">
        <div className="va-pairing-copy">
          <span>The Perfect Pairing</span>
          <h2>Add a Vehicle to Your Stay</h2>
          <p>
            Enhance your Vantage Stays reservation with the right vehicle — from practical daily drivers to
            premium options, all connected through our platform.
          </p>
          <Link href="/rent">Explore Stay + Drive</Link>
        </div>

        <div className="va-pairing-card">
          <p className="va-card-label">Your Stay</p>
          <div className="va-stay-image" />
          <h4>Vantage Stays Miami</h4>
          <small>May 26 – May 27, 2026</small>
          <a href="https://vantagestays.miami" target="_blank" rel="noreferrer" style={pairingCta}>View Stay</a>
        </div>

        <div className="va-plus-circle"><Plus size={22} /></div>

        <div className="va-pairing-card va-mini-vehicle">
          <div className="va-mini-header">
            <p className="va-card-label">Recommended Vehicle</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/recommended-bmw.jpg" alt="Recommended vehicle" />
          <h4>2023+ BMW X5</h4>
          <small>Premium SUV · available on request</small>
          <Link href="/contact" style={pairingCta}>Request to Book</Link>
        </div>
      </section>

      {/* WHY */}
      <section className="va-section va-why-section">
        <h2>Why {BRAND}</h2>
        <div className="va-why-grid">
          {WHY.map(({ Icon, title, text }) => (
            <article className="va-why-item" key={title}>
              <div className="va-icon-badge"><Icon size={24} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
