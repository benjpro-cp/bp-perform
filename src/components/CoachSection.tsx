"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, BarChart3, Users, ArrowRight, CheckCircle2, Send } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;
const GOLD = "#fbbf24";

const PERKS = [
  {
    icon: Zap,
    title: "Infrastructure prête",
    desc: "Espace client, programmes, suivi de progression, messagerie — tout est développé et opérationnel. Vous arrivez, vous coachez.",
  },
  {
    icon: BarChart3,
    title: "Zéro frais fixe",
    desc: "Aucun abonnement, aucun coût d'entrée. On prend uniquement une commission sur ce que vous encaissez. Votre risque est nul.",
  },
  {
    icon: Users,
    title: "Croissance partagée",
    desc: "Plus vous avez de clients, plus on grandit ensemble. Notre modèle est aligné sur votre succès, pas sur le vôtre à vide.",
  },
];

const INCLUDED = [
  "Dashboard coach dédié",
  "Création de programmes personnalisés",
  "Suivi nutrition & macros clients",
  "Messagerie coach ↔ client",
  "Statistiques et progression en temps réel",
  "Support technique inclus",
];

export default function CoachSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  function inputStyle(name: string): React.CSSProperties {
    return {
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${focused === name ? `${GOLD}55` : "rgba(255,255,255,0.1)"}`,
      boxShadow: focused === name ? `0 0 0 3px ${GOLD}12` : "none",
      borderRadius: "0.65rem",
      padding: "0.78rem 1rem",
      color: "#ffffff",
      fontSize: "0.88rem",
      outline: "none",
      transition: "border-color 0.15s, box-shadow 0.15s",
      backdropFilter: "blur(8px)",
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    try {
      const coaches = JSON.parse(localStorage.getItem("bp_coach_requests") || "[]");
      coaches.push({ ...form, createdAt: new Date().toISOString() });
      localStorage.setItem("bp_coach_requests", JSON.stringify(coaches));
    } catch { /* ignore */ }
    setLoading(false);
    setSent(true);
  }

  return (
    <section
      id="coaches"
      style={{
        background: "linear-gradient(180deg, #070c16 0%, #0a0e1a 50%, #070c16 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "7rem 0",
      }}
    >
      {/* Ambient glows */}
      <div aria-hidden style={{ position: "absolute", top: "10%", left: "-5%", width: "50vw", height: "60vh", background: `radial-gradient(ellipse, ${GOLD}0a 0%, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "0%", right: "-5%", width: "40vw", height: "50vh", background: `radial-gradient(ellipse, ${GOLD}07 0%, transparent 65%)`, filter: "blur(70px)", pointerEvents: "none" }} />

      {/* Top separator */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, transparent 5%, ${GOLD}25 35%, ${GOLD}40 50%, ${GOLD}25 65%, transparent 95%)` }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easing }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `${GOLD}12`, border: `1px solid ${GOLD}30`, borderRadius: "999px", padding: "0.3rem 1rem", marginBottom: "1.25rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD, display: "block", boxShadow: `0 0 8px ${GOLD}` }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>
              Vous êtes coach ?
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-oswald)",
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            color: "#ffffff",
            marginBottom: "1rem",
          }}>
            Rejoignez la plateforme,{" "}
            <span style={{ color: GOLD, textShadow: `0 0 40px ${GOLD}50` }}>développez votre activité</span>
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.7, maxWidth: "36rem", margin: "0 auto" }}>
            Concentrez-vous sur ce que vous faites le mieux — coacher. On s'occupe de la technologie, vous gardez la relation avec vos clients.
          </p>
        </motion.div>

        {/* 3 perks */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "4rem" }}>
          {PERKS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: easing, delay: i * 0.1 }}
                style={{
                  background: `linear-gradient(145deg, ${GOLD}0a 0%, rgba(255,255,255,0.03) 60%)`,
                  backdropFilter: "blur(24px)",
                  border: `1px solid ${GOLD}1e`,
                  borderRadius: "1.25rem",
                  padding: "1.75rem",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: `inset 0 1px 0 ${GOLD}18`,
                }}
              >
                <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${GOLD}40, transparent)`, pointerEvents: "none" }} />
                <div aria-hidden style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "120px", height: "120px", background: `radial-gradient(ellipse, ${GOLD}10 0%, transparent 65%)`, filter: "blur(16px)", pointerEvents: "none" }} />

                <div style={{ width: 42, height: 42, borderRadius: "11px", background: `${GOLD}15`, border: `1px solid ${GOLD}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.1rem", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 0 14px ${GOLD}18` }}>
                  <Icon size={18} color={GOLD} />
                </div>
                <h3 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "#ffffff", marginBottom: "0.5rem" }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                  {p.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Split: included + form */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "flex-start" }}>

          {/* Left: what's included */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easing }}
          >
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: "1rem" }}>
              Ce qui est inclus
            </p>
            <h3 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.6rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1.1, marginBottom: "1.75rem" }}>
              Tout ce dont vous avez besoin,{" "}
              <span style={{ color: GOLD }}>dès le premier jour</span>
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {INCLUDED.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <CheckCircle2 size={15} color={GOLD} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)" }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: `${GOLD}0d`, border: `1px solid ${GOLD}28`, borderRadius: "1rem", boxShadow: `inset 0 1px 0 ${GOLD}18` }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, marginBottom: "0.4rem" }}>Modèle économique</p>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
                Commission sur les abonnements de vos clients. Aucun frais fixe, aucun engagement de votre côté.
              </p>
            </div>
          </motion.div>

          {/* Right: interest form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easing, delay: 0.1 }}
            style={{
              background: `linear-gradient(145deg, ${GOLD}0a 0%, rgba(10,18,32,0.98) 55%)`,
              backdropFilter: "blur(40px)",
              border: `1px solid ${GOLD}22`,
              borderRadius: "1.5rem",
              padding: "2rem 2.25rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: `0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 ${GOLD}20`,
            }}
          >
            <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${GOLD}50, rgba(255,255,255,0.3), ${GOLD}50, transparent)`, pointerEvents: "none" }} />
            <div aria-hidden style={{ position: "absolute", top: "-60px", right: "-40px", width: "220px", height: "180px", background: `radial-gradient(ellipse, ${GOLD}12 0%, transparent 65%)`, filter: "blur(35px)", pointerEvents: "none" }} />

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: "center", padding: "2rem 0" }}
              >
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${GOLD}15`, border: `1px solid ${GOLD}35`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", boxShadow: `0 0 24px ${GOLD}20` }}>
                  <CheckCircle2 size={24} color={GOLD} />
                </div>
                <h3 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.4rem", textTransform: "uppercase", color: "#ffffff", marginBottom: "0.6rem" }}>
                  Demande envoyée !
                </h3>
                <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>
                  On revient vers vous rapidement pour vous présenter les conditions et répondre à vos questions.
                </p>
              </motion.div>
            ) : (
              <>
                <div style={{ marginBottom: "1.5rem" }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD, marginBottom: "0.4rem" }}>
                    Rejoindre en tant que coach
                  </p>
                  <h3 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.35rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1.1 }}>
                    Exprimez votre intérêt
                  </h3>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <div>
                    <label style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "0.35rem" }}>Nom complet</label>
                    <input
                      required
                      type="text"
                      placeholder="Prénom Nom"
                      value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      style={inputStyle("name")}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "0.35rem" }}>Email professionnel</label>
                    <input
                      required
                      type="email"
                      placeholder="coach@exemple.com"
                      value={form.email}
                      onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                      style={inputStyle("email")}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "0.35rem" }}>Votre activité (optionnel)</label>
                    <textarea
                      rows={3}
                      placeholder="Votre spécialité, nombre de clients actuels, ce qui vous intéresse dans la plateforme..."
                      value={form.message}
                      onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                      style={{ ...inputStyle("message"), resize: "none" }}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                      padding: "0.88rem",
                      background: loading ? `${GOLD}40` : `linear-gradient(135deg, ${GOLD}, #f59e0b)`,
                      color: "#1a0800",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      border: "none",
                      borderRadius: "0.85rem",
                      cursor: loading ? "not-allowed" : "pointer",
                      marginTop: "0.25rem",
                      boxShadow: loading ? "none" : `0 4px 24px ${GOLD}40, inset 0 1px 0 rgba(255,255,255,0.3)`,
                      transition: "all 0.2s",
                    }}
                  >
                    {loading ? "Envoi…" : <><Send size={14} /> Envoyer ma candidature</>}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
