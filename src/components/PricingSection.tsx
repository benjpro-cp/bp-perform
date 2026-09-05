"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Shield, ArrowRight, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

const SPOTS_TOTAL = 10;
const SPOTS_TAKEN = 7;
const SPOTS_LEFT = SPOTS_TOTAL - SPOTS_TAKEN;

const INCLUS = [
  { label: "Bilan complet offert", sub: "30min pour définir ton point de départ" },
  { label: "Programme nutrition sur mesure", sub: "Adapté à ta vie, tes goûts, ton métabolisme" },
  { label: "Plan entraînement personnalisé", sub: "Progressif, réaliste, conçu pour durer" },
  { label: "Suivi & ajustements chaque semaine", sub: "On adapte si le corps change ou la vie bouge" },
  { label: "Messagerie directe 7j/7", sub: "Paul ou Benjamin répondent dans la journée" },
  { label: "Espace client BP Perform", sub: "Tes stats, programmes et messages centralisés" },
];

const COMPARAISON = [
  { label: "Coach perso en salle", price: "60€ / séance", sub: "1–2x/sem = 240€+/mois" },
  { label: "Diététicien", price: "80€ / consult.", sub: "Sans suivi entre les séances" },
  { label: "Coaching en ligne classique", price: "150€+/mois", sub: "Programme générique, peu de suivi" },
];

export default function PricingSection() {
  const [ctaHovered, setCtaHovered] = useState(false);

  const pct = (SPOTS_TAKEN / SPOTS_TOTAL) * 100;

  return (
    <section id="tarifs" style={{ background: "#060b14", padding: "6rem 0 7rem", position: "relative", overflow: "hidden" }}>

      {/* Ambient glows */}
      <div aria-hidden style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: "80%", height: "70%", background: "radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 65%)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "45%", height: "60%", background: "radial-gradient(ellipse, rgba(56,189,248,0.05) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "1rem" }}>
            Tarif
          </p>
          <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(2.4rem, 5.5vw, 4rem)", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1.05, color: "#ffffff", marginBottom: "1.25rem" }}>
            CE QUE LES AUTRES FACTURENT<br />
            <span style={{ color: "#38bdf8", textShadow: "0 0 30px rgba(56,189,248,0.35)" }}>300€/MOIS,</span>{" "}
            <span style={{ color: "rgba(255,255,255,0.4)" }}>TOI</span>{" "}
            <span style={{ color: "#ffffff" }}>59€</span>
          </h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", maxWidth: "30rem", margin: "0 auto", lineHeight: 1.75 }}>
            Un coach perso en salle coûte 60€ <em>la séance</em>. Ici, tu as un coaching complet, personnalisé et suivi chaque semaine — pour moins cher qu&apos;un abonnement Netflix Premium.
          </p>
        </div>

        {/* Two columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "start" }}>

          {/* Left: context + trust */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* Comparaison */}
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
                Les alternatives
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {COMPARAISON.map((c) => (
                  <div key={c.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem 1.1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.85rem" }}>
                    <div>
                      <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", fontWeight: 500, marginBottom: "0.15rem" }}>{c.label}</p>
                      <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)" }}>{c.sub}</p>
                    </div>
                    <span style={{ fontFamily: "var(--font-oswald)", fontSize: "0.9rem", fontWeight: 700, color: "rgba(255,100,100,0.7)", whiteSpace: "nowrap", marginLeft: "1rem" }}>{c.price}</span>
                  </div>
                ))}

                {/* BP Perform row — highlighted */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem 1.1rem", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: "0.85rem", position: "relative", overflow: "hidden" }}>
                  <div aria-hidden style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.5), transparent)" }} />
                  <div>
                    <p style={{ fontSize: "0.82rem", color: "#ffffff", fontWeight: 700, marginBottom: "0.15rem" }}>BP Perform</p>
                    <p style={{ fontSize: "0.7rem", color: "rgba(56,189,248,0.7)" }}>Tout inclus · Suivi perso complet</p>
                  </div>
                  <div style={{ textAlign: "right", marginLeft: "1rem" }}>
                    <span style={{ fontFamily: "var(--font-oswald)", fontSize: "1rem", fontWeight: 700, color: "#38bdf8" }}>59€/mois</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Témoignage */}
            <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", position: "relative" }}>
              <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", opacity: 0.12 }}>
                <svg width="28" height="22" viewBox="0 0 28 22" fill="currentColor" style={{ color: "#38bdf8" }}><path d="M0 22V13.3C0 9.93 .833 7.08 2.5 4.75 4.167 2.42 6.583.917 9.75.25L11 3C9.167 3.583 7.75 4.583 6.75 6S5.333 9 5.333 11H11V22H0zm16 0V13.3c0-3.367.833-6.217 2.5-8.55C20.167 2.42 22.583.917 25.75.25L27 3c-1.833.583-3.25 1.583-4.25 3S21.333 9 21.333 11H27V22H16z" /></svg>
              </div>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, marginBottom: "1rem", fontStyle: "italic" }}>
                &ldquo;En 3 mois j&apos;ai perdu 9kg sans jamais me sentir en manque. Paul m&apos;ajustait le programme chaque semaine selon mes contraintes. C&apos;est ça qui fait la différence.&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, rgba(56,189,248,0.3), rgba(56,189,248,0.1))", border: "1px solid rgba(56,189,248,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#38bdf8" }}>T</div>
                <div>
                  <p style={{ fontSize: "0.78rem", color: "#ffffff", fontWeight: 600 }}>Thomas, 28 ans</p>
                  <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>−9 kg en 12 semaines</p>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: "2px" }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#f59e0b"><path d="M6 1l1.4 2.8 3.1.45-2.25 2.2.53 3.1L6 8.1 3.22 9.55l.53-3.1L1.5 4.25l3.1-.45z" /></svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1.25rem 1.1rem", background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.12)", borderRadius: "1rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Shield size={16} style={{ color: "#38bdf8" }} />
              </div>
              <div>
                <p style={{ fontSize: "0.82rem", color: "#ffffff", fontWeight: 700, marginBottom: "0.25rem" }}>Satisfait ou remboursé — 7 jours</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>Tu démarres, tu vois la valeur. Si dans la première semaine tu n&apos;es pas convaincu, on rembourse sans question.</p>
              </div>
            </div>

          </div>

          {/* Right: pricing card */}
          <div>
            <div style={{ background: "linear-gradient(145deg, rgba(56,189,248,0.1) 0%, rgba(6,11,20,0.99) 50%)", backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: "1.75rem", padding: "2.5rem 2.25rem", position: "relative", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(56,189,248,0.1), inset 0 1px 0 rgba(255,255,255,0.1)" }}>

              {/* Top glow line */}
              <div aria-hidden style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.65), rgba(255,255,255,0.3), rgba(56,189,248,0.65), transparent)" }} />

              {/* Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(56,189,248,0.08))", border: "1px solid rgba(56,189,248,0.4)", borderRadius: "9999px", padding: "0.3rem 0.9rem", marginBottom: "1.75rem" }}>
                <Zap size={11} style={{ color: "#38bdf8" }} />
                <span style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#38bdf8" }}>Offre de lancement</span>
              </div>

              {/* Price */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", lineHeight: 1 }}>
                    <span style={{ fontFamily: "var(--font-oswald)", fontSize: "1.2rem", fontWeight: 700, color: "#38bdf8", marginTop: "0.65rem" }}>€</span>
                    <span style={{ fontFamily: "var(--font-oswald)", fontSize: "5rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.04em", lineHeight: 1 }}>59</span>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.38)", textDecoration: "line-through" }}>97€</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>/ mois</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                  Ce tarif est réservé aux premiers clients. Le prix monte à <strong style={{ color: "rgba(255,255,255,0.55)" }}>97€/mois</strong> une fois les places complètes.
                </p>
              </div>

              {/* Spots indicator */}
              <div style={{ marginBottom: "1.75rem", padding: "1rem 1.1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <Users size={13} style={{ color: "#38bdf8" }} />
                    <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{SPOTS_TAKEN} clients actifs</span>
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: SPOTS_LEFT <= 3 ? "#f87171" : "#38bdf8" }}>
                    {SPOTS_LEFT} place{SPOTS_LEFT > 1 ? "s" : ""} restante{SPOTS_LEFT > 1 ? "s" : ""}
                  </span>
                </div>
                <div style={{ height: "5px", background: "rgba(255,255,255,0.07)", borderRadius: "9999px", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: "100%", background: "linear-gradient(to right, #38bdf8, #0ea5e9)", borderRadius: "9999px" }}
                  />
                </div>
              </div>

              {/* What's included */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {INCLUS.map((item) => (
                  <li key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                      <Check size={11} style={{ color: "#38bdf8" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: "0.83rem", color: "#ffffff", fontWeight: 600, marginBottom: "0.1rem" }}>{item.label}</p>
                      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{item.sub}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <motion.div
                onHoverStart={() => setCtaHovered(true)}
                onHoverEnd={() => setCtaHovered(false)}
                animate={{ scale: ctaHovered ? 1.015 : 1 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href="/signup"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", padding: "1.1rem", background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)", color: "#03090f", fontWeight: 900, fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "1rem", textDecoration: "none", boxShadow: ctaHovered ? "0 8px 40px rgba(56,189,248,0.65), inset 0 1px 0 rgba(255,255,255,0.35)" : "0 4px 28px rgba(56,189,248,0.42), inset 0 1px 0 rgba(255,255,255,0.3)", transition: "box-shadow 0.2s" }}
                >
                  Je commence à 59€/mois <ArrowRight size={15} />
                </Link>
              </motion.div>

              {/* Sub-cta line */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.25rem", marginTop: "1rem" }}>
                {["Sans engagement", "7j satisfait ou remboursé", "Résiliation libre"].map((t) => (
                  <span key={t} style={{ fontSize: "0.63rem", color: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", gap: "0.3rem", whiteSpace: "nowrap" }}>
                    <TrendingUp size={9} style={{ color: "rgba(56,189,248,0.4)", flexShrink: 0 }} />
                    {t}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
