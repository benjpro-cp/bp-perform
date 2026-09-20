"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { HoverSpotlight } from "@/components/HoverSpotlight";

const SPOTS_TOTAL = 3;
const SPOTS_TAKEN = 0;
const B = "#38bdf8";
const easing = [0.22, 1, 0.36, 1] as const;

const INCLUS = [
  { label: "Programme nutrition sur mesure", sub: "Adapté à ton métabolisme et tes goûts" },
  { label: "Plan entraînement personnalisé", sub: "Progressif, réaliste, conçu pour durer" },
  { label: "Suivi & ajustements sur 3 mois", sub: "On adapte si le corps change ou la vie bouge" },
  { label: "Messagerie directe 7j/7", sub: "Paul ou Benjamin répondent dans la journée" },
  { label: "Espace client BP Perform", sub: "Stats, programmes et messages centralisés" },
];

export default function PricingSection() {
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <section id="tarifs" style={{ background: "#060b14", padding: "6rem 0 8rem", position: "relative", overflow: "hidden" }}>

      {/* Ambient glows */}
      <div aria-hidden style={{ position: "absolute", top: "-15%", left: "50%", transform: "translateX(-50%)", width: "90%", height: "70%", background: `radial-gradient(ellipse, ${B}0b 0%, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "45%", height: "55%", background: `radial-gradient(ellipse, ${B}06 0%, transparent 65%)`, filter: "blur(70px)", pointerEvents: "none" }} />

      {/* Dot grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(${B}14 1px, transparent 1px)`,
        backgroundSize: "36px 36px",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 10%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 10%, transparent 80%)",
      }} />

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easing }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: B, marginBottom: "1rem" }}>
            Tarif
          </p>
          <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(2.4rem, 7vw, 4.2rem)", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1.05, color: "#ffffff", marginBottom: "1rem" }}>
            UN PAIEMENT.<br />
            <span style={{ color: B, textShadow: `0 0 40px ${B}45` }}>UN RÉSULTAT.</span>
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: "26rem", margin: "0 auto" }}>
            Pas d&apos;abonnement, pas de surprise. Tu paies une fois, on s&apos;occupe de toi de A à Z.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easing, delay: 0.1 }}
        >
          <HoverSpotlight
            color={B}
            style={{
              background: `linear-gradient(145deg, ${B}0f 0%, rgba(6,11,20,0.99) 50%, ${B}07 100%)`,
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              border: `1px solid ${B}28`,
              borderRadius: "2rem",
              padding: "2.75rem 2.5rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: [
                `0 40px 100px rgba(0,0,0,0.65)`,
                `0 0 80px ${B}0e`,
                `inset 0 1px 0 rgba(255,255,255,0.1)`,
              ].join(", "),
            }}
          >
            {/* Specular top line */}
            <div aria-hidden style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: "1px", background: `linear-gradient(to right, transparent, ${B}70, rgba(255,255,255,0.35), ${B}70, transparent)`, pointerEvents: "none" }} />
            {/* Corner glow */}
            <div aria-hidden style={{ position: "absolute", top: "-40px", right: "-40px", width: "280px", height: "220px", background: `radial-gradient(ellipse, ${B}14 0%, transparent 65%)`, filter: "blur(40px)", pointerEvents: "none" }} />
            {/* Bottom left glow */}
            <div aria-hidden style={{ position: "absolute", bottom: "-30px", left: "-20px", width: "200px", height: "160px", background: `radial-gradient(ellipse, ${B}09 0%, transparent 65%)`, filter: "blur(35px)", pointerEvents: "none" }} />

            {/* Watermark */}
            <div aria-hidden style={{ position: "absolute", bottom: "1rem", right: "1.5rem", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "9rem", lineHeight: 1, color: `${B}05`, userSelect: "none", pointerEvents: "none", letterSpacing: "-0.04em" }}>
              299
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>

              {/* Badge */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", background: `${B}12`, border: `1px solid ${B}40`, borderRadius: "9999px", padding: "0.35rem 1.1rem", boxShadow: `0 0 16px ${B}18` }}>
                  <Zap size={12} style={{ color: B }} />
                  <span style={{ fontSize: "0.63rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: B }}>Offre de lancement</span>
                </div>
              </div>

              {/* Price */}
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <div style={{ display: "inline-flex", alignItems: "flex-start", lineHeight: 1, marginBottom: "0.6rem" }}>
                  <span style={{ fontFamily: "var(--font-oswald)", fontSize: "2rem", fontWeight: 700, color: B, marginTop: "1.1rem", textShadow: `0 0 20px ${B}60` }}>€</span>
                  <span style={{ fontFamily: "var(--font-oswald)", fontSize: "clamp(5.5rem, 20vw, 9rem)", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.04em", lineHeight: 1, textShadow: `0 0 60px ${B}20` }}>299</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "9999px", padding: "0.3rem 0.9rem" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>Paiement unique</span>
                </div>
              </div>

              {/* Spots */}
              <div style={{ marginBottom: "2.5rem" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", textAlign: "center", marginBottom: "1rem" }}>
                  Places au tarif de lancement
                </p>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {Array.from({ length: SPOTS_TOTAL }).map((_, i) => {
                    const taken = i < SPOTS_TAKEN;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, ease: easing, delay: 0.3 + i * 0.1 }}
                        style={{
                          flex: 1,
                          padding: "1rem 0.75rem",
                          background: taken ? "rgba(255,255,255,0.02)" : `${B}0c`,
                          border: `1px solid ${taken ? "rgba(255,255,255,0.07)" : `${B}30`}`,
                          borderRadius: "1rem",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.5rem",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {!taken && (
                          <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${B}60, transparent)` }} />
                        )}
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: taken ? "rgba(255,255,255,0.04)" : `${B}18`,
                          border: `2px solid ${taken ? "rgba(255,255,255,0.1)" : B}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: taken ? "none" : `0 0 12px ${B}40`,
                        }}>
                          {taken
                            ? <Lock size={12} style={{ color: "rgba(255,255,255,0.2)" }} />
                            : <div style={{ width: 8, height: 8, borderRadius: "50%", background: B, boxShadow: `0 0 8px ${B}` }} />
                          }
                        </div>
                        <span style={{
                          fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: taken ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.65)",
                        }}>
                          {taken ? "Réservée" : "Disponible"}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)", marginBottom: "2rem" }} />

              {/* Inclus */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                {INCLUS.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: easing, delay: 0.15 + i * 0.07 }}
                    style={{ display: "flex", alignItems: "flex-start", gap: "0.9rem" }}
                  >
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: `${B}14`,
                      border: `1px solid ${B}35`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: "1px",
                      boxShadow: `0 0 10px ${B}20`,
                    }}>
                      <Check size={13} style={{ color: B }} />
                    </div>
                    <div>
                      <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.9)", fontWeight: 600, marginBottom: "0.15rem" }}>{item.label}</p>
                      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.32)", lineHeight: 1.5 }}>{item.sub}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <motion.div
                onHoverStart={() => setCtaHovered(true)}
                onHoverEnd={() => setCtaHovered(false)}
                animate={{ scale: ctaHovered ? 1.02 : 1 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href="/signup"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                    padding: "1.3rem",
                    background: `linear-gradient(135deg, ${B} 0%, #0ea5e9 100%)`,
                    color: "#03090f", fontWeight: 900, fontSize: "0.9rem",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    borderRadius: "1.25rem", textDecoration: "none",
                    boxShadow: ctaHovered
                      ? `0 10px 50px ${B}70, inset 0 1px 0 rgba(255,255,255,0.4)`
                      : `0 5px 32px ${B}4a, inset 0 1px 0 rgba(255,255,255,0.3)`,
                    transition: "box-shadow 0.2s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Shimmer */}
                  {ctaHovered && (
                    <motion.div
                      aria-hidden
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 0.55, ease: "easeInOut" }}
                      style={{
                        position: "absolute", top: 0, left: 0, width: "50%", height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  <span style={{ position: "relative" }}>Je réserve ma place — 299€</span>
                  <ArrowRight size={16} style={{ position: "relative", flexShrink: 0 }} />
                </Link>
              </motion.div>

              <p style={{ textAlign: "center", marginTop: "1.1rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.22)", letterSpacing: "0.04em" }}>
                Prise en charge sous 24h · Accès complet immédiat
              </p>

            </div>
          </HoverSpotlight>
        </motion.div>
      </div>
    </section>
  );
}
