"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const previews = [
  { name: "Squat", muscle: "Quadriceps · Fessiers", level: "Fondamental" },
  { name: "Deadlift", muscle: "Ischio · Lombaires", level: "Avancé" },
  { name: "Bench Press", muscle: "Pectoraux · Triceps", level: "Fondamental" },
  { name: "Pull-up", muscle: "Dorsaux · Biceps", level: "Intermédiaire" },
  { name: "OHP", muscle: "Épaules · Triceps", level: "Intermédiaire" },
  { name: "Hip Thrust", muscle: "Fessiers · Ischios", level: "Fondamental" },
];

const easing = [0.22, 1, 0.36, 1] as const;
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easing } } };

export default function ExercisesSection() {
  return (
    <section id="exercices" style={{ background: '#070c16', padding: '4rem 0 7rem', position: 'relative', overflow: 'hidden' }}>

      {/* Grid diagonale via rotation */}
      <div aria-hidden style={{
        position: 'absolute', inset: '-50%', pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
        transform: 'rotate(12deg)',
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 75%)',
      }} />

      {/* Orbe bas gauche */}
      <div aria-hidden style={{
        position: 'absolute', bottom: '-10%', left: '-10%',
        width: '50%', height: '70%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(56,189,248,0.1) 0%, transparent 65%)',
        filter: 'blur(55px)',
      }} />

      {/* Orbe haut droit */}
      <div aria-hidden style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: '35%', height: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 65%)',
        filter: 'blur(45px)',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '4rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#38bdf8', marginBottom: '1rem' }}>
              Bibliothèque
            </p>
            <h2 style={{ fontFamily: 'var(--font-oswald)', fontWeight: 700, fontSize: 'clamp(2.5rem, 6vw, 4rem)', textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1, color: '#ffffff' }}>
              LES<br /><span style={{ color: '#38bdf8' }}>EXERCICES</span>
            </h2>
            <div style={{ marginTop: '1.5rem', width: '4rem', height: '2px', background: '#38bdf8' }} />
          </div>
          <Link
            href="/exercises"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#38bdf8', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#38bdf8')}
          >
            Voir tous les exercices <ArrowRight size={13} />
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.06)' }}
        >
          {previews.map((ex) => (
            <motion.div
              key={ex.name}
              variants={item}
              style={{
                background: '#070c16',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(56,189,248,0.04)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#070c16')}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-oswald)', fontWeight: 700, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#ffffff', marginBottom: '0.25rem' }}>
                  {ex.name}
                </p>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.05em' }}>{ex.muscle}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(56,189,248,0.7)', fontWeight: 600 }}>
                  {ex.level}
                </span>
                <div style={{ width: '1.5rem', height: '1px', background: 'rgba(255,255,255,0.15)', transition: 'background 0.15s' }} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
