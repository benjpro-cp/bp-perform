'use client';

import React, { useEffect, useRef, ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
}

const glowColorMap = {
  blue:   { base: 199, spread: 20 },
  purple: { base: 280, spread: 300 },
  green:  { base: 120, spread: 200 },
  red:    { base: 0,   spread: 200 },
  orange: { base: 30,  spread: 200 },
};

export function GlowCard({ children, className = '', glowColor = 'blue' }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { base, spread } = glowColorMap[glowColor];

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const el = cardRef.current;
      if (!el) return;
      el.style.setProperty('--x', e.clientX.toFixed(2));
      el.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
      el.style.setProperty('--y', e.clientY.toFixed(2));
      el.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
    };
    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  return (
    <div
      ref={cardRef}
      data-glow
      className={`rounded-2xl relative shadow-[0_1rem_2rem_-1rem_black] p-6 backdrop-blur-[5px] ${className}`}
      style={{
        '--base': base,
        '--spread': spread,
        '--radius': '16',
        '--border': '2',
        '--backdrop': 'hsl(0 0% 60% / 0.06)',
        '--backup-border': 'rgba(255,255,255,0.08)',
        '--size': '200',
        '--outer': '1',
        '--border-size': 'calc(var(--border, 2) * 1px)',
        '--spotlight-size': 'calc(var(--size, 150) * 1px)',
        '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
        backgroundImage: `radial-gradient(
          var(--spotlight-size) var(--spotlight-size) at
          calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
          hsl(var(--hue, 199) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 65) * 1%) / var(--bg-spot-opacity, 0.32)), transparent
        )`,
        backgroundColor: 'var(--backdrop, transparent)',
        backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
        backgroundPosition: '50% 50%',
        backgroundAttachment: 'fixed',
        border: 'var(--border-size) solid var(--backup-border)',
        position: 'relative',
        touchAction: 'none',
      } as React.CSSProperties}
    >
      <div data-glow />
      {children}
    </div>
  );
}
