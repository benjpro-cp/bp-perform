"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      background: '#070c16',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '3rem 0',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-oswald)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '0.35rem' }}>
            BP<span style={{ color: '#38bdf8' }}>Perform</span>
          </p>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>Coaching Elite · Forge ton excellence</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {[
            { href: '#programmes', label: 'Programmes' },
            { href: '#exercices', label: 'Exercices' },
            { href: '#contact', label: 'Contact' },
            { href: '/login', label: 'Espace client' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
          © {new Date().getFullYear()} BP Perform
        </p>
      </div>
    </footer>
  );
}
