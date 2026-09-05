"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Thomas R.",
    subtitle: "A pris 8 kg de muscle",
    duration: "12 semaines",
    result: "+8 kg",
    initials: "TR",
    photo: null as string | null,
    quote: "En 3 mois j'ai progressé plus que durant toute ma période solo. Le suivi hebdomadaire change vraiment tout — on ne triche plus sur les séances.",
  },
  {
    name: "Karim B.",
    subtitle: "A perdu 14 kg de graisse",
    duration: "16 semaines",
    result: "−14 kg",
    initials: "KB",
    photo: null as string | null,
    quote: "C'est basé sur mes habitudes réelles, pas sur un plan générique. Je n'ai jamais eu faim. Je me suis transformé sans souffrir.",
  },
  {
    name: "Lucas M.",
    subtitle: "A gagné 12% de force",
    duration: "8 semaines",
    result: "+12%",
    initials: "LM",
    photo: null as string | null,
    quote: "Plus rapide, plus explosif, moins de blessures. Le programme était parfaitement adapté à mon calendrier — je n'ai manqué aucun match.",
  },
  {
    name: "Sarah L.",
    subtitle: "A perdu 6 kg et retrouvé son énergie",
    duration: "10 semaines",
    result: "−6 kg",
    initials: "SL",
    photo: null as string | null,
    quote: "Après ma grossesse, le coach a tout adapté à ma situation. Aujourd'hui je me sens mieux qu'avant, avec des séances courtes mais vraiment efficaces.",
  },
];

const easing = [0.22, 1, 0.36, 1] as const;

export default function TransformationsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (dir: 1 | -1) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + testimonials.length) % testimonials.length);
  };

  const t = testimonials[current];

  return (
    <section
      id="resultats"
      style={{ background: "#070c16", padding: "4rem 0 7rem", position: "relative", overflow: "hidden" }}
    >
      {/* Scan lines */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "100% 48px",
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }} />
      <div aria-hidden style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "60%", height: "140%",
        background: "radial-gradient(ellipse, rgba(56,189,248,0.05) 0%, transparent 65%)",
        filter: "blur(70px)", zIndex: 0, pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: easing }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem", flexWrap: "wrap", gap: "1.5rem" }}
        >
          <div>
            <p style={{
              fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 600,
              letterSpacing: "0.25em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "1rem",
            }}>Ils témoignent</p>
            <h2 style={{
              fontFamily: "var(--font-oswald)", fontWeight: 700,
              fontSize: "clamp(2.5rem, 6vw, 4rem)", textTransform: "uppercase",
              letterSpacing: "-0.01em", lineHeight: 1, color: "#ffffff",
            }}>
              DES <span style={{ color: "#38bdf8" }}>RÉSULTATS</span> CONCRETS
            </h2>
            <div style={{ marginTop: "1.25rem", width: "4rem", height: "2px", background: "#38bdf8" }} />
          </div>

          {/* Counter + arrows */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{
              fontFamily: "var(--font-oswald)", fontWeight: 700,
              fontSize: "0.9rem", letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.3)",
            }}>
              <span style={{ color: "#ffffff" }}>{String(current + 1).padStart(2, "0")}</span>
              {" / "}
              {String(testimonials.length).padStart(2, "0")}
            </span>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[{ dir: -1 as const, Icon: ChevronLeft }, { dir: 1 as const, Icon: ChevronRight }].map(({ dir, Icon }) => (
                <button
                  key={dir}
                  onClick={() => go(dir)}
                  style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(8px)",
                    color: "rgba(255,255,255,0.65)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = "rgba(56,189,248,0.5)";
                    el.style.color = "#38bdf8";
                    el.style.background = "rgba(56,189,248,0.08)";
                    el.style.boxShadow = "0 0 16px rgba(56,189,248,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = "rgba(255,255,255,0.12)";
                    el.style.color = "rgba(255,255,255,0.65)";
                    el.style.background = "rgba(255,255,255,0.04)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <Icon size={17} />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Card */}
        <div style={{ overflow: "hidden" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -80 }}
              transition={{ duration: 0.42, ease: easing }}
              className="testimonial-card-grid"
              style={{ }}
            >
              {/* Left panel — identity */}
              <div style={{
                background: "linear-gradient(160deg, #0a1628 0%, #071220 100%)",
                borderRight: "1px solid rgba(56,189,248,0.1)",
                padding: "3rem 2.5rem",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: "1.5rem",
                position: "relative", overflow: "hidden",
              }}>
                {/* Glow orb behind photo */}
                <div style={{
                  position: "absolute", top: "30%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "180px", height: "180px",
                  background: "radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 70%)",
                  filter: "blur(24px)", pointerEvents: "none",
                }} />

                {/* Profile photo */}
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", inset: "-6px", borderRadius: "50%",
                    background: "conic-gradient(from 180deg, rgba(56,189,248,0.5), rgba(56,189,248,0.05) 40%, rgba(56,189,248,0.5))",
                    filter: "blur(2px)",
                  }} />
                  <div style={{
                    width: "96px", height: "96px", borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(56,189,248,0.05))",
                    border: "2px solid rgba(56,189,248,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", position: "relative", zIndex: 1,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}>
                    {t.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.photo} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{
                        fontFamily: "var(--font-oswald)", fontWeight: 700,
                        fontSize: "1.6rem", color: "#38bdf8", letterSpacing: "0.05em",
                      }}>
                        {t.initials}
                      </span>
                    )}
                  </div>
                </div>

                {/* Name + subtitle */}
                <div style={{ textAlign: "center" }}>
                  <p style={{
                    fontFamily: "var(--font-oswald)", fontWeight: 700,
                    fontSize: "1.15rem", textTransform: "uppercase",
                    letterSpacing: "0.06em", color: "#ffffff", marginBottom: "0.4rem",
                  }}>
                    {t.name}
                  </p>
                  <p style={{
                    fontSize: "0.72rem", color: "#38bdf8",
                    fontWeight: 600, letterSpacing: "0.05em", marginBottom: "0.2rem",
                  }}>
                    {t.subtitle}
                  </p>
                  <p style={{
                    fontSize: "0.62rem", color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                  }}>
                    {t.duration}
                  </p>
                </div>

                {/* Result metric */}
                <div style={{
                  padding: "0.6rem 1.25rem", borderRadius: "999px",
                  background: "rgba(56,189,248,0.08)",
                  border: "1px solid rgba(56,189,248,0.25)",
                  boxShadow: "0 0 20px rgba(56,189,248,0.1)",
                }}>
                  <span style={{
                    fontFamily: "var(--font-oswald)", fontWeight: 700,
                    fontSize: "1.6rem", color: "#38bdf8",
                    textShadow: "0 0 24px rgba(56,189,248,0.5)",
                    letterSpacing: "-0.01em",
                  }}>
                    {t.result}
                  </span>
                </div>

                {/* Bottom accent line */}
                <div style={{
                  position: "absolute", bottom: 0, left: "20%", right: "20%", height: "1px",
                  background: "linear-gradient(to right, transparent, rgba(56,189,248,0.3), transparent)",
                }} />
              </div>

              {/* Right panel — quote */}
              <div style={{
                background: "linear-gradient(160deg, #080e1c 0%, #060b18 100%)",
                padding: "3.5rem 3.5rem 3rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Watermark number */}
                <span style={{
                  position: "absolute", top: "1rem", right: "2rem",
                  fontFamily: "var(--font-oswald)", fontWeight: 700,
                  fontSize: "7rem", lineHeight: 1,
                  color: "rgba(56,189,248,0.18)",
                  userSelect: "none", pointerEvents: "none",
                  letterSpacing: "-0.02em",
                }}>
                  {String(current + 1).padStart(2, "0")}
                </span>

                {/* Opening quote mark */}
                <div style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "6rem", lineHeight: 0.8,
                  color: "rgba(56,189,248,0.55)",
                  marginBottom: "1.25rem",
                  userSelect: "none",
                }}>
                  "
                </div>

                <p style={{
                  fontSize: "1.05rem",
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.85,
                  fontStyle: "italic",
                  letterSpacing: "0.01em",
                  flex: 1,
                  position: "relative", zIndex: 1,
                }}>
                  {t.quote}
                </p>

                {/* Divider */}
                <div style={{
                  marginTop: "2rem",
                  height: "1px",
                  background: "linear-gradient(to right, rgba(56,189,248,0.2), rgba(255,255,255,0.04) 60%, transparent)",
                }} />

                {/* Dots progress */}
                <div style={{
                  display: "flex", gap: "0.4rem", marginTop: "1.25rem",
                  alignItems: "center",
                }}>
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                      style={{
                        width: i === current ? "1.75rem" : "0.35rem",
                        height: "0.35rem", borderRadius: "999px",
                        background: i === current ? "#38bdf8" : "rgba(255,255,255,0.18)",
                        border: "none", cursor: "pointer", padding: 0,
                        transition: "all 0.35s ease",
                        boxShadow: i === current ? "0 0 10px rgba(56,189,248,0.55)" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: easing, delay: 0.2 }}
          style={{ display: "flex", justifyContent: "flex-start", marginTop: "2.5rem" }}
        >
          <Link
            href="/transformations"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.65rem",
              background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
              color: "#03090f", fontWeight: 800, fontSize: "0.72rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              padding: "1rem 2.25rem", borderRadius: "9999px", textDecoration: "none",
              boxShadow: "0 0 0 1px rgba(56,189,248,0.4), 0 8px 32px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = "0 0 0 1px rgba(56,189,248,0.6), 0 12px 48px rgba(56,189,248,0.55), inset 0 1px 0 rgba(255,255,255,0.3)";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = "0 0 0 1px rgba(56,189,248,0.4), 0 8px 32px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.3)";
              el.style.transform = "";
            }}
          >
            Voir toutes les transformations
            <ArrowRight size={14} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
