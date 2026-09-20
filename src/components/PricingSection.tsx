"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, ArrowRight, Users } from "lucide-react";
import Link from "next/link";

const SPOTS_TOTAL = 3;
const SPOTS_TAKEN = 0;
const SPOTS_LEFT = SPOTS_TOTAL - SPOTS_TAKEN;

const INCLUS = [
  "Programme nutrition sur mesure",
  "Plan entraînement personnalisé",
  "Suivi & ajustements sur 3 mois",
  "Messagerie directe 7j/7",
  "Espace client BP Perform",
];

export default function PricingSection() {
  const [ctaHovered, setCtaHovered] = useState(false);
  const pct = (SPOTS_TAKEN / SPOTS_TOTAL) * 100;

  return (
    <section id="tarifs" style={{ background: "#060b14", padding: "6rem 0 7rem", position: "relative", overflow: "hidden" }}>

      {/* Ambient glows */}
      <div aria-hidden style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: "80%", height: "70%", background: "radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 65%)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "1rem" }}>
            Tarif
          </p>
          <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(2.2rem, 6vw, 3.8rem)", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1.05, color: "#ffffff", marginBottom: "1rem" }}>
            UN PAIEMENT.<br />
            <span style={{ color: "#38bdf8", textShadow: "0 0 30px rgba(56,189,248,0.35)" }}>UN RÉSULTAT.</span>
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            Pas d&apos;abonnement, pas de surprise. Tu paies une fois, on s&apos;occupe de toi.
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "linear-gradient(145deg, rgba(56,189,248,0.1) 0%, rgba(6,11,20,0.99) 50%)",
            border: "1px solid rgba(56,189,248,0.25)",
            borderRadius: "2rem",
            padding: "3rem 2.5rem",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(56,189,248,0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Top glow line */}
          <div aria-hidden style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.65), rgba(255,255,255,0.3), rgba(56,189,248,0.65), transparent)" }} />

          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(56,189,248,0.08))", border: "1px solid rgba(56,189,248,0.4)", borderRadius: "9999px", padding: "0.35rem 1rem" }}>
              <Zap size={12} style={{ color: "#38bdf8" }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#38bdf8" }}>Offre de lancement</span>
            </div>
          </div>

          {/* Price */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "flex-start", lineHeight: 1, marginBottom: "0.5rem" }}>
              <span style={{ fontFamily: "var(--font-oswald)", fontSize: "2rem", fontWeight: 700, color: "#38bdf8", marginTop: "1rem" }}>€</span>
              <span style={{ fontFamily: "var(--font-oswald)", fontSize: "clamp(5rem, 18vw, 8rem)", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.04em", lineHeight: 1 }}>299</span>
            </div>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Paiement unique
            </p>
          </div>

          {/* Spots indicator */}
          <div style={{ marginBottom: "2.5rem", padding: "1.25rem 1.5rem", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Users size={15} style={{ color: "#f87171" }} />
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Places à ce tarif</span>
              </div>
              <span style={{ fontFamily: "var(--font-oswald)", fontSize: "1rem", fontWeight: 700, color: "#f87171" }}>
                {SPOTS_LEFT} / {SPOTS_TOTAL} restantes
              </span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.07)", borderRadius: "9999px", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: "100%", background: "linear-gradient(to right, #f87171, #ef4444)", borderRadius: "9999px" }}
              />
            </div>
          </div>

          {/* Inclus */}
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {INCLUS.map((item) => (
              <li key={item} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={13} style={{ color: "#38bdf8" }} />
                </div>
                <span style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{item}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <motion.div
            onHoverStart={() => setCtaHovered(true)}
            onHoverEnd={() => setCtaHovered(false)}
            animate={{ scale: ctaHovered ? 1.015 : 1 }}
            transition={{ duration: 0.15 }}
          >
            <Link
              href="/signup"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                padding: "1.25rem",
                background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
                color: "#03090f", fontWeight: 900, fontSize: "0.9rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                borderRadius: "1.25rem", textDecoration: "none",
                boxShadow: ctaHovered
                  ? "0 8px 40px rgba(56,189,248,0.65), inset 0 1px 0 rgba(255,255,255,0.35)"
                  : "0 4px 28px rgba(56,189,248,0.42), inset 0 1px 0 rgba(255,255,255,0.3)",
                transition: "box-shadow 0.2s",
              }}
            >
              Je réserve ma place — 299€ <ArrowRight size={16} />
            </Link>
          </motion.div>

          <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
            Prise en charge dans les 24h · Accès complet immédiat
          </p>

        </motion.div>
      </div>
    </section>
  );
}
