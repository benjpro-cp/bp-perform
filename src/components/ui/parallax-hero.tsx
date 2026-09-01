'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export function ParallaxHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    const hero = heroRef.current;
    if (!hero) return;

    gsap.to(hero.querySelector('.ph-layer-bg'), {
      yPercent: 22,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.to(hero.querySelector('.ph-content'), {
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: '20% top', end: '55% top', scrub: true },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div ref={heroRef} className="relative overflow-hidden bg-[#070c16]" style={{ height: '100svh' }}>

        {/* Z1 — Photo de fond avec parallax */}
        <div
          className="ph-layer-bg absolute will-change-transform"
          style={{ inset: '-15% 0', height: '130%', zIndex: 1 }}
        >
          <img
            src="/hero.png"
            alt=""
            loading="eager"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
          />
        </div>

        {/* Z2 — Vignette sombre centrée sur la zone du texte */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background: 'radial-gradient(ellipse 75% 55% at 50% 36%, rgba(7,12,22,0.65) 0%, rgba(7,12,22,0.25) 55%, transparent 100%)',
          }}
        />

        {/* Z3 — Texte, au-dessus de la vignette et de la photo */}
        <div
          className="absolute inset-0 flex flex-col items-center"
          style={{ zIndex: 3, paddingTop: '9vh' }}
        >
          <p className="ph-anim ph-d1" style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#7dd3fc',
            marginBottom: '1.25rem',
            textShadow: '0 1px 16px rgba(0,0,0,0.9), 0 0 8px rgba(7,12,22,0.8)',
          }}>
            Coaching Elite · BP Perform
          </p>

          <h1 style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(4.5rem, 16vw, 15rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            lineHeight: 0.87,
            textAlign: 'center',
          }}>
            <span
              className="ph-anim ph-d2"
              style={{
                display: 'block',
                background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 65%, #7dd3fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 12px rgba(7,12,22,0.8))',
              }}
            >
              BP
            </span>
            <span
              className="ph-anim ph-d3"
              style={{
                display: 'block',
                background: 'linear-gradient(to bottom, #ffffff 0%, #ffffff 45%, rgba(255,255,255,0) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Perform
            </span>
          </h1>
        </div>

        {/* Top gradient: navbar */}
        <div
          className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
          style={{ zIndex: 10, background: 'linear-gradient(to bottom, rgba(7,12,22,0.65), transparent)' }}
        />

        {/* Bottom gradient: transition page */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ zIndex: 10, height: '30%', background: 'linear-gradient(to bottom, transparent, #070c16)' }}
        />

        {/* Z20 — CTAs + scroll */}
        <div
          className="ph-content absolute inset-0 flex flex-col items-center justify-end pb-12 pointer-events-none"
          style={{ zIndex: 20 }}
        >
          <div className="flex flex-col items-center gap-6 pointer-events-auto">
            <div className="flex gap-4 flex-wrap justify-center">

              {/* Primary CTA */}
              <a
                href="#contact"
                className="ph-anim ph-d4"
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
                  color: '#03090f',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  padding: '0.95rem 2rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  boxShadow: '0 0 0 1px rgba(56,189,248,0.4), 0 8px 32px rgba(56,189,248,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.35)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = '0 0 0 1px rgba(56,189,248,0.6), 0 12px 48px rgba(56,189,248,0.55), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.35)';
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = '0 0 0 1px rgba(56,189,248,0.4), 0 8px 32px rgba(56,189,248,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.35)';
                  el.style.transform = '';
                }}
              >
                Démarrer maintenant
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2.5 6.5H10.5M10.5 6.5L7 3M10.5 6.5L7 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              {/* Secondary CTA */}
              <a
                href="#programmes"
                className="ph-anim ph-d4"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  border: '1px solid rgba(255,255,255,0.22)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  padding: '0.95rem 2rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  backdropFilter: 'blur(12px)',
                  background: 'rgba(255,255,255,0.07)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 16px rgba(0,0,0,0.25)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.45)';
                  el.style.background = 'rgba(255,255,255,0.13)';
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.22)';
                  el.style.background = 'rgba(255,255,255,0.07)';
                  el.style.transform = '';
                }}
              >
                Voir les programmes
              </a>

            </div>

            <a
              href="#programmes"
              className="ph-anim ph-d5"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.6rem',
                textDecoration: 'none',
                opacity: 0.9,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.9')}
            >
              {/* Mouse icon */}
              <div style={{
                width: '22px',
                height: '36px',
                borderRadius: '11px',
                border: '1.5px solid rgba(255,255,255,0.6)',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 0 14px rgba(56,189,248,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '6px',
              }}>
                <div style={{
                  width: '3px',
                  height: '7px',
                  borderRadius: '999px',
                  background: '#38bdf8',
                  boxShadow: '0 0 6px rgba(56,189,248,0.8)',
                  animation: 'scrollDot 1.8s ease-in-out infinite',
                }} />
              </div>
              {/* Label */}
              <span style={{
                fontSize: '0.55rem',
                fontWeight: 600,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                textShadow: '0 1px 8px rgba(0,0,0,0.8)',
              }}>
                Scroll
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Bridge */}
      <div style={{
        background: '#070c16',
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '5rem 1.5rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
      }}>
        <div style={{ width: '3rem', height: '2px', background: '#38bdf8' }} />
        <p style={{ maxWidth: '44rem', fontSize: '1.1rem', color: '#64748b', lineHeight: 1.75 }}>
          Un coaching d&apos;élite pour ceux qui refusent l&apos;ordinaire.
        </p>
      </div>
    </>
  );
}
