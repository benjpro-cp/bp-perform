"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, BarChart3, Users, ArrowRight, Check, Send, CheckCircle2, Layers, MessageCircle } from "lucide-react";
import { HoverSpotlight } from "@/components/HoverSpotlight";

const easing = [0.22, 1, 0.36, 1] as const;
const G = "#fbbf24";

const PERKS = [
  {
    icon: Layers,
    title: "Infrastructure complète",
    desc: "Espace client, programmes, nutrition, suivi, messagerie — tout est développé. Vous arrivez et vous coachez, sans vous soucier de la tech.",
    stat: "100%",
    statLabel: "clé en main",
  },
  {
    icon: BarChart3,
    title: "Zéro frais fixe",
    desc: "Aucun abonnement, aucun coût d'entrée. Commission uniquement sur les abonnements de vos clients. Votre risque financier est nul.",
    stat: "0€",
    statLabel: "d'engagement",
  },
  {
    icon: Users,
    title: "Croissance partagée",
    desc: "Notre modèle est 100% aligné sur votre succès. Plus vous avez de clients actifs et satisfaits, plus tout le monde gagne.",
    stat: "×",
    statLabel: "votre revenu",
  },
];

const INCLUS = [
  { label: "Dashboard coach dédié", sub: "Gérez tous vos clients depuis un seul endroit" },
  { label: "Création de programmes sur mesure", sub: "Push / Pull / Legs, personnalisé par client" },
  { label: "Plans nutritionnels & macros", sub: "Adapté aux objectifs et contraintes de chacun" },
  { label: "Messagerie coach ↔ client", sub: "Échanges directs intégrés à la plateforme" },
  { label: "Suivi progression en temps réel", sub: "Poids, mensurations, records — tout centralisé" },
  { label: "Support technique inclus", sub: "On gère la plateforme, vous gérez vos clients" },
];

export default function CoachSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [ctaHovered, setCtaHovered] = useState(false);

  function inputStyle(name: string): React.CSSProperties {
    return {
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${focused === name ? `${G}55` : "rgba(255,255,255,0.1)"}`,
      boxShadow: focused === name ? `0 0 0 3px ${G}12` : "none",
      borderRadius: "0.65rem",
      padding: "0.8rem 1rem",
      color: "#ffffff",
      fontSize: "0.88rem",
      outline: "none",
      transition: "border-color 0.15s, box-shadow 0.15s",
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    try {
      const coaches = JSON.parse(localStorage.getItem("bp_coach_requests") || "[]");
      coaches.push({ ...form, createdAt: new Date().toISOString() });
      localStorage.setItem("bp_coach_requests", JSON.stringify(coaches));
    } catch { /* ignore */ }
    setLoading(false);
    window.location.href = "/rendez-vous";
  }

  return (
    <section
      id="coaches"
      style={{
        background: "linear-gradient(180deg, #060b14 0%, #07091a 50%, #060b14 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "8rem 0 9rem",
      }}
    >
      {/* Ambient glows */}
      <div aria-hidden style={{ position: "absolute", top: "-5%", right: "-5%", width: "55%", height: "65%", background: `radial-gradient(ellipse, ${G}09 0%, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "0%", left: "-8%", width: "50%", height: "55%", background: `radial-gradient(ellipse, ${G}07 0%, transparent 65%)`, filter: "blur(70px)", pointerEvents: "none" }} />

      {/* Dot grid background */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(${G}18 1px, transparent 1px)`,
        backgroundSize: "36px 36px",
        maskImage: `radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 80%)`,
        WebkitMaskImage: `radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 80%)`,
      }} />

      {/* Top separator */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, transparent 5%, ${G}20 30%, ${G}45 50%, ${G}20 70%, transparent 95%)` }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easing }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `${G}10`, border: `1px solid ${G}30`, borderRadius: "999px", padding: "0.28rem 1rem", marginBottom: "1.5rem" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: G, display: "block", boxShadow: `0 0 8px ${G}` }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: G }}>
                Vous êtes coach ?
              </span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-oswald)",
              fontWeight: 700,
              fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              lineHeight: 1.05,
              color: "#ffffff",
              marginBottom: "1.25rem",
            }}>
              Rejoignez la plateforme,{" "}
              <span style={{ color: G, textShadow: `0 0 40px ${G}50` }}>développez votre activité</span>
            </h2>

            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: "34rem", margin: "0 auto" }}>
              Concentrez-vous sur ce que vous faites le mieux — coacher. On s'occupe de la technologie, vous gardez la relation avec vos clients.
            </p>
          </motion.div>
        </div>

        {/* ── 3 Perks ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "5rem" }}>
          {PERKS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: easing, delay: i * 0.1 }}
              >
              <HoverSpotlight
                color={G}
                style={{
                  background: `linear-gradient(145deg, ${G}0c 0%, rgba(255,255,255,0.03) 55%, ${G}06 100%)`,
                  backdropFilter: "blur(28px) saturate(180%)",
                  WebkitBackdropFilter: "blur(28px) saturate(180%)",
                  border: `1px solid ${G}22`,
                  borderRadius: "1.35rem",
                  padding: "2rem",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: [`inset 0 1px 0 ${G}18`, `0 8px 32px ${G}08`, "0 2px 8px rgba(0,0,0,0.25)"].join(", "),
                }}
              >
                {/* Specular */}
                <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${G}55, rgba(255,255,255,0.3), ${G}55, transparent)`, pointerEvents: "none" }} />
                {/* Corner glow */}
                <div aria-hidden style={{ position: "absolute", bottom: "-30px", right: "-30px", width: "140px", height: "140px", background: `radial-gradient(ellipse, ${G}14 0%, transparent 65%)`, filter: "blur(20px)", pointerEvents: "none" }} />
                {/* Watermark stat */}
                <div aria-hidden style={{ position: "absolute", bottom: "-0.5rem", right: "1rem", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "5.5rem", lineHeight: 1, color: `${G}07`, userSelect: "none", pointerEvents: "none", letterSpacing: "-0.03em" }}>
                  {p.stat}
                </div>

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", gap: "0.75rem" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "12px", background: `${G}14`, border: `1px solid ${G}32`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 0 16px ${G}18` }}>
                      <Icon size={19} color={G} />
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.6rem", color: G, lineHeight: 1, textShadow: `0 0 16px ${G}60` }}>{p.stat}</p>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: `${G}80`, marginTop: "0.1rem" }}>{p.statLabel}</p>
                    </div>
                  </div>

                  <h3 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "#ffffff", marginBottom: "0.55rem" }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "0.855rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>
                    {p.desc}
                  </p>
                </div>
              </HoverSpotlight>
              </motion.div>
            );
          })}
        </div>

        {/* ── Split: included + form ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "start" }}>

          {/* Left: included list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easing }}
          >
            <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: G, marginBottom: "1rem" }}>
              Ce qui est inclus
            </p>
            <h3 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)", textTransform: "uppercase", letterSpacing: "-0.01em", color: "#ffffff", lineHeight: 1.1, marginBottom: "2rem" }}>
              Tout ce dont vous avez besoin,{" "}
              <span style={{ color: G, textShadow: `0 0 20px ${G}40` }}>dès le premier client</span>
            </h3>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {INCLUS.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: easing, delay: 0.1 + i * 0.07 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}
                >
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${G}14`, border: `1px solid ${G}35`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px", boxShadow: `0 0 8px ${G}20` }}>
                    <Check size={11} color={G} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.85rem", color: "#ffffff", fontWeight: 600, marginBottom: "0.1rem" }}>{item.label}</p>
                    <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.32)" }}>{item.sub}</p>
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Commission block */}
            <div style={{
              padding: "1.4rem 1.5rem",
              background: `linear-gradient(135deg, ${G}0e 0%, rgba(255,255,255,0.02) 100%)`,
              border: `1px solid ${G}25`,
              borderRadius: "1.1rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: `inset 0 1px 0 ${G}18`,
            }}>
              <div aria-hidden style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: "1px", background: `linear-gradient(to right, transparent, ${G}45, transparent)`, pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                <Zap size={14} color={G} />
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: G }}>Modèle économique</p>
              </div>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.52)", lineHeight: 1.7 }}>
                Commission uniquement sur les abonnements de vos clients. <strong style={{ color: "rgba(255,255,255,0.75)" }}>Aucun frais fixe, aucun risque.</strong>
              </p>
            </div>
          </motion.div>

          {/* Right: form card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easing, delay: 0.1 }}
          >
            <HoverSpotlight
              color={G}
              style={{
                background: `linear-gradient(145deg, ${G}0e 0%, rgba(6,11,20,0.99) 45%)`,
                backdropFilter: "blur(40px) saturate(180%)",
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
                border: `1px solid ${G}28`,
                borderRadius: "1.75rem",
                padding: "2.5rem 2.25rem",
                position: "relative",
                overflow: "hidden",
                boxShadow: [`0 32px 80px rgba(0,0,0,0.6)`, `0 0 60px ${G}0c`, `inset 0 1px 0 ${G}25`].join(", "),
              }}
            >
              {/* Top accent line */}
              <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: "1px", background: `linear-gradient(to right, transparent, ${G}70, rgba(255,255,255,0.35), ${G}70, transparent)` }} />
              {/* Ambient */}
              <div aria-hidden style={{ position: "absolute", top: "-60px", right: "-40px", width: "260px", height: "200px", background: `radial-gradient(ellipse, ${G}14 0%, transparent 65%)`, filter: "blur(40px)", pointerEvents: "none" }} />

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ textAlign: "center", padding: "2.5rem 0" }}
                >
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: `${G}14`, border: `1.5px solid ${G}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.35rem", boxShadow: `0 0 30px ${G}25` }}>
                    <CheckCircle2 size={26} color={G} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.5rem", textTransform: "uppercase", color: "#ffffff", marginBottom: "0.65rem" }}>
                    Candidature reçue !
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                    On revient vers vous très rapidement pour vous présenter les conditions et répondre à toutes vos questions.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div style={{ marginBottom: "1.75rem", position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: `${G}12`, border: `1px solid ${G}35`, borderRadius: "9999px", padding: "0.28rem 0.9rem", marginBottom: "1rem" }}>
                      <MessageCircle size={10} color={G} />
                      <span style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: G }}>Rejoindre en tant que coach</span>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.55rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1.1 }}>
                      Exprimez votre intérêt
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", marginTop: "0.4rem", lineHeight: 1.6 }}>
                      On prend le temps de vous appeler et de tout vous expliquer.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem", position: "relative" }}>
                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "0.38rem" }}>Nom complet</label>
                      <input
                        required type="text" placeholder="Prénom Nom"
                        value={form.name}
                        onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                        style={inputStyle("name")}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "0.38rem" }}>Email professionnel</label>
                      <input
                        required type="email" placeholder="coach@exemple.com"
                        value={form.email}
                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                        style={inputStyle("email")}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "0.38rem" }}>Votre activité</label>
                      <textarea
                        rows={3}
                        placeholder="Votre spécialité, nombre de clients, ce qui vous intéresse dans la plateforme…"
                        value={form.message}
                        onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                        style={{ ...inputStyle("message"), resize: "none" }}
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      onHoverStart={() => setCtaHovered(true)}
                      onHoverEnd={() => setCtaHovered(false)}
                      animate={{ scale: ctaHovered && !loading ? 1.015 : 1 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        width: "100%",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                        padding: "1.05rem",
                        background: loading ? `${G}35` : `linear-gradient(135deg, ${G} 0%, #f59e0b 100%)`,
                        color: "#1a0800",
                        fontWeight: 900, fontSize: "0.82rem",
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        border: "none", borderRadius: "1rem",
                        cursor: loading ? "not-allowed" : "pointer",
                        marginTop: "0.25rem",
                        boxShadow: loading ? "none" : ctaHovered
                          ? `0 8px 40px ${G}60, inset 0 1px 0 rgba(255,255,255,0.35)`
                          : `0 4px 28px ${G}45, inset 0 1px 0 rgba(255,255,255,0.3)`,
                        transition: "box-shadow 0.2s, background 0.2s",
                      } as React.CSSProperties}
                    >
                      {loading ? "Chargement…" : <><Send size={14} /> Réserver un appel</>}
                    </motion.button>
                  </form>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.25rem", marginTop: "1rem", flexWrap: "wrap" }}>
                    {["100% confidentiel", "Réponse sous 48h", "Sans engagement"].map((t) => (
                      <span key={t} style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", gap: "0.3rem", whiteSpace: "nowrap" }}>
                        <ArrowRight size={8} style={{ color: `${G}50`, flexShrink: 0 }} />
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </HoverSpotlight>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
