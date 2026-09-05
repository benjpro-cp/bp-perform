"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  "Programme nutrition 100% personnalisé",
  "Plan d'entraînement sur mesure",
  "Suivi hebdomadaire avec ton coach",
  "Accès à l'espace client BP Perform",
  "Ajustements illimités du programme",
  "Messagerie directe coach 7j/7",
];

export default function PricingSection() {
  const [hovered, setHovered] = useState(false);

  return (
    <section id="tarifs" style={{ background: "#060b14", padding: "5rem 0 6rem", position: "relative", overflow: "hidden" }}>

      {/* Background glows */}
      <div aria-hidden style={{ position: "absolute", top: "0%", left: "50%", transform: "translateX(-50%)", width: "70%", height: "60%", background: "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", bottom: "0", right: "-10%", width: "40%", height: "50%", background: "radial-gradient(ellipse, rgba(56,189,248,0.05) 0%, transparent 65%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "1rem" }}>
            Tarifs
          </p>
          <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1, color: "#ffffff", marginBottom: "1.25rem" }}>
            UN SEUL PLAN,<br /><span style={{ color: "#38bdf8" }}>TOUT INCLUS</span>
          </h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", maxWidth: "26rem", margin: "0 auto" }}>
            Coaching personnalisé complet. Pas d&apos;abonnement caché, pas de module à la carte.
          </p>
        </div>

        {/* Pricing card */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <motion.div
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            animate={{ boxShadow: hovered ? "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(56,189,248,0.15), inset 0 1px 0 rgba(255,255,255,0.12)" : "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(56,189,248,0.07), inset 0 1px 0 rgba(255,255,255,0.08)" }}
            transition={{ duration: 0.3 }}
            style={{ width: "100%", maxWidth: "520px", background: "linear-gradient(145deg, rgba(56,189,248,0.07) 0%, rgba(8,15,28,0.98) 55%)", backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "1.75rem", padding: "2.75rem 2.5rem", position: "relative", overflow: "hidden" }}
          >
            {/* Top highlight line */}
            <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.6), rgba(255,255,255,0.3), rgba(56,189,248,0.6), transparent)" }} />

            {/* Launch badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: "9999px", padding: "0.3rem 0.85rem", marginBottom: "1.75rem" }}>
              <Zap size={11} style={{ color: "#38bdf8" }} />
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#38bdf8" }}>Offre de lancement</span>
            </div>

            {/* Price block */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", lineHeight: 1 }}>
                  <span style={{ fontFamily: "var(--font-oswald)", fontSize: "1.1rem", fontWeight: 700, color: "#38bdf8", marginTop: "0.5rem" }}>€</span>
                  <span style={{ fontFamily: "var(--font-oswald)", fontSize: "4.5rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.03em" }}>59</span>
                </div>
                <div style={{ paddingBottom: "0.75rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", textDecoration: "line-through", marginBottom: "0.1rem" }}>97€ / mois</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>/ mois</div>
                </div>
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>
                Prix réservé aux premiers clients. Le tarif passera à <strong style={{ color: "rgba(255,255,255,0.6)" }}>97€/mois</strong> dès que les places seront complètes.
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "1.75rem" }} />

            {/* Features */}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {FEATURES.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={11} style={{ color: "#38bdf8" }} />
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/signup"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", padding: "1rem", background: "linear-gradient(135deg, #38bdf8, #0ea5e9)", color: "#03090f", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: "1rem", textDecoration: "none", boxShadow: "0 4px 24px rgba(56,189,248,0.38), inset 0 1px 0 rgba(255,255,255,0.3)", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 32px rgba(56,189,248,0.55), inset 0 1px 0 rgba(255,255,255,0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(56,189,248,0.38), inset 0 1px 0 rgba(255,255,255,0.3)"; (e.currentTarget as HTMLElement).style.transform = ""; }}
            >
              Commencer maintenant <ArrowRight size={15} />
            </Link>

            <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.22)" }}>
              Sans engagement · Résiliation à tout moment
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
