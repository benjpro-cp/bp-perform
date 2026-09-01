"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface StatProps {
  value: number;
  suffix: string;
  label: string;
  description: string;
  index: number;
}

function AnimatedStat({ value, suffix, label, description, index }: StatProps) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.8, ease: "easeOut", delay: index * 0.1 });
    return controls.stop;
  }, [inView, count, value, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.12 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "2.5rem 1.5rem",
        position: "relative",
      }}
    >
      {/* Top accent */}
      <div style={{
        width: "2rem",
        height: "2px",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)",
        marginBottom: "1.75rem",
      }} />

      {/* Number */}
      <div style={{
        fontFamily: "var(--font-oswald)",
        fontWeight: 700,
        lineHeight: 1,
        marginBottom: "0.75rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.1em",
      }}>
        <span style={{
          fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
          color: "#ffffff",
          letterSpacing: "-0.02em",
        }}>
          <motion.span>{rounded}</motion.span>
        </span>
        <span style={{
          fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
          color: "#38bdf8",
          marginTop: "0.3em",
          fontWeight: 700,
        }}>
          {suffix}
        </span>
      </div>

      {/* Label */}
      <p style={{
        fontFamily: "var(--font-oswald)",
        fontWeight: 600,
        fontSize: "0.95rem",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "#ffffff",
        marginBottom: "0.6rem",
      }}>
        {label}
      </p>

      {/* Description */}
      <p style={{
        fontSize: "0.78rem",
        color: "rgba(255,255,255,0.62)",
        lineHeight: 1.6,
        maxWidth: "10rem",
      }}>
        {description}
      </p>
    </motion.div>
  );
}

const stats: Omit<StatProps, "index">[] = [
  { value: 100, suffix: "+", label: "Clients", description: "Accompagnés depuis le lancement" },
  { value: 95, suffix: "%", label: "Résultats", description: "De clients ayant atteint leur objectif" },
  { value: 3, suffix: "+", label: "Années", description: "D'expérience en coaching sportif" },
  { value: 12, suffix: "", label: "Semaines", description: "Pour une transformation visible garantie" },
];

export default function StatsSection() {
  return (
    <section id="resultats" style={{
      background: "#070c16",
      padding: "4rem 0 7rem",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Horizontal scan lines */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "100% 48px",
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }} />

      {/* Central glow */}
      <div aria-hidden style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "70%", height: "200%",
        background: "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 60%)",
        filter: "blur(60px)", zIndex: 0, pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <p style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#38bdf8",
            marginBottom: "1rem",
          }}>
            Les chiffres parlent
          </p>
          <h2 style={{
            fontFamily: "var(--font-oswald)",
            fontWeight: 700,
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            color: "#ffffff",
          }}>
            DES <span style={{ color: "#38bdf8" }}>RÉSULTATS</span> CONCRETS
          </h2>
        </motion.div>

        {/* Stats container */}
        <div style={{
          position: "relative",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "1.5rem",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.08)",
            "0 0 0 1px rgba(255,255,255,0.03)",
            "0 40px 80px rgba(0,0,0,0.3)",
          ].join(", "),
          overflow: "hidden",
        }}>

          {/* Top highlight line */}
          <div style={{
            position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent)",
          }} />

          <div style={{
            display: "flex",
            flexWrap: "wrap",
          }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ display: "flex", flex: "1 1 200px" }}>
                <AnimatedStat {...s} index={i} />
                {/* Vertical divider — hidden after last item */}
                {i < stats.length - 1 && (
                  <div style={{
                    width: "1px",
                    alignSelf: "stretch",
                    margin: "2rem 0",
                    background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent)",
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Bottom highlight line */}
          <div style={{
            position: "absolute", bottom: 0, left: "10%", right: "10%", height: "1px",
            background: "linear-gradient(to right, transparent, rgba(56,189,248,0.2), transparent)",
          }} />
        </div>

      </div>
    </section>
  );
}
