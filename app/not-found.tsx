import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
      <div className="eyebrow">404</div>
      <h1 className="page-title" style={{ marginBottom: 14 }}>
        We couldn’t find <em>that.</em>
      </h1>
      <p className="section-sub" style={{ margin: '0 auto 28px' }}>
        The page or vehicle you’re looking for may have moved or is no longer available.
      </p>
      <Link href="/rent" className="btn-primary">Browse the Collection</Link>
    </div>
  );
}
