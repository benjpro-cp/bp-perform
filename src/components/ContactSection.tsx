"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const glassInput: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(8px)',
  color: '#ffffff',
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
};

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.push("/dashboard");
  }

  return (
    <section id="contact" style={{ background: '#070c16', padding: '4rem 0 7rem', position: 'relative', overflow: 'hidden' }}>

      {/* Grid dots pattern */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'radial-gradient(rgba(56,189,248,0.18) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)',
      }} />

      {/* Grand orbe derrière le formulaire */}
      <div aria-hidden style={{
        position: 'absolute', top: '10%', right: '-10%',
        width: '55%', height: '80%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(56,189,248,0.1) 0%, transparent 65%)',
        filter: 'blur(70px)',
      }} />

      {/* Orbe gauche derrière le texte */}
      <div aria-hidden style={{
        position: 'absolute', bottom: '0%', left: '-5%',
        width: '40%', height: '60%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 65%)',
        filter: 'blur(50px)',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>

          {/* Left */}
          <div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#38bdf8', marginBottom: '1rem' }}>
              Prêt à démarrer ?
            </p>
            <h2 style={{ fontFamily: 'var(--font-oswald)', fontWeight: 700, fontSize: 'clamp(2.5rem, 6vw, 4rem)', textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1, color: '#ffffff', marginBottom: '1.5rem' }}>
              REJOINS<br /><span style={{ color: '#38bdf8' }}>BP PERFORM</span>
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '26rem' }}>
              Envoie-nous un message. On revient vers toi dans les 24h pour organiser ta séance de bilan gratuite et définir ton programme.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { num: "01", text: "Séance bilan gratuite de 30min" },
                { num: "02", text: "Programme personnalisé en 48h" },
                { num: "03", text: "Suivi continu via l'espace client" },
              ].map((step) => (
                <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>{step.num}</span>
                  <div style={{ width: '1.5rem', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)' }}>{step.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: glass form */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 40px rgba(0,0,0,0.3)',
            padding: '2.5rem',
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="name-fields-grid">
                  {[{ label: 'Prénom *', placeholder: 'Alex', type: 'text' }, { label: 'Nom *', placeholder: 'Martin', type: 'text' }].map((f) => (
                    <div key={f.label}>
                      <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.65)', marginBottom: '0.5rem' }}>
                        {f.label}
                      </label>
                      <input
                        required
                        type={f.type}
                        placeholder={f.placeholder}
                        style={glassInput}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.5)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.65)', marginBottom: '0.5rem' }}>
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="alex@email.com"
                    style={glassInput}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.5)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.65)', marginBottom: '0.5rem' }}>
                    Objectif *
                  </label>
                  <select
                    required
                    defaultValue=""
                    style={{ ...glassInput, appearance: 'none' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.5)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  >
                    <option value="" disabled style={{ background: '#0d1628' }}>Choisir un objectif</option>
                    <option style={{ background: '#0d1628' }}>Perte de gras</option>
                    <option style={{ background: '#0d1628' }}>Prise de masse</option>
                    <option style={{ background: '#0d1628' }}>Hybride</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.65)', marginBottom: '0.5rem' }}>
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Dis-nous où tu en es et ce que tu veux accomplir..."
                    style={{ ...glassInput, resize: 'none' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.5)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: '#38bdf8',
                    color: '#070c16',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '1rem',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    transition: 'background 0.15s',
                    boxShadow: '0 4px 20px rgba(56,189,248,0.25)',
                  }}
                  onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#0ea5e9'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#38bdf8'; }}
                >
                  {loading ? (
                    <div style={{ width: '1rem', height: '1rem', border: '2px solid rgba(7,12,22,0.3)', borderTopColor: '#070c16', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  ) : (
                    <>Envoyer ma demande <Send size={14} /></>
                  )}
                </button>
              </form>
          </div>
        </div>
      </div>
    </section>
  );
}
