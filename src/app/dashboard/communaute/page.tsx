"use client";

import { motion } from "framer-motion";
import { Users, Trophy, MessageCircle, Zap } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;

const features = [
  { icon: Trophy,        color: "#facc15", label: "Classements",     desc: "Comparez vos progrès avec d'autres membres du programme" },
  { icon: MessageCircle, color: "#38bdf8", label: "Forum & échanges", desc: "Posez vos questions, partagez vos expériences" },
  { icon: Zap,           color: "#4ade80", label: "Défis collectifs",  desc: "Des challenges hebdomadaires pour se surpasser ensemble" },
];

export default function CommunautePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easing }}>
        <p style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a78bfa", marginBottom: "0.5rem" }}>Espace membres</p>
        <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", textTransform: "uppercase", letterSpacing: "-0.01em", color: "#ffffff", lineHeight: 1 }}>
          COMMUNAUTÉ <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span>{" "}
          <span style={{ color: "#a78bfa", textShadow: "0 0 24px rgba(167,139,250,0.4)" }}>BIENTÔT</span>
        </h1>
      </motion.div>

      {/* Hero card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: easing, delay: 0.08 }}>
        <div style={{
          background: "linear-gradient(145deg, rgba(167,139,250,0.1) 0%, rgba(255,255,255,0.03) 60%, rgba(167,139,250,0.05) 100%)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid rgba(167,139,250,0.2)",
          borderRadius: "1.5rem",
          padding: "3rem 2.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(167,139,250,0.55), rgba(255,255,255,0.3), rgba(167,139,250,0.55), transparent)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", width: "300px", height: "200px", background: "radial-gradient(ellipse, rgba(167,139,250,0.18) 0%, transparent 65%)", filter: "blur(30px)", pointerEvents: "none" }} />

          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "inline-flex", width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(167,139,250,0.05))", border: "1.5px solid rgba(167,139,250,0.3)", alignItems: "center", justifyContent: "center", marginBottom: "1.75rem", boxShadow: "0 0 50px rgba(167,139,250,0.2), inset 0 1px 0 rgba(255,255,255,0.15)" }}
          >
            <Users size={40} color="#a78bfa" />
          </motion.div>

          <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", textTransform: "uppercase", color: "#ffffff", lineHeight: 1.1, marginBottom: "1rem" }}>
            Rejoins la communauté<br />
            <span style={{ color: "#a78bfa", textShadow: "0 0 30px rgba(167,139,250,0.4)" }}>BP Perform</span>
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: "520px", margin: "0 auto 2rem" }}>
            Un espace dédié pour se motiver, partager ses progrès et s&apos;entraîner en groupe. La communauté arrive très prochainement.
          </p>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: "999px", padding: "0.5rem 1.25rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", display: "block", boxShadow: "0 0 10px rgba(167,139,250,0.8), 0 0 20px rgba(167,139,250,0.4)" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.08em" }}>En développement</span>
          </div>
        </div>
      </motion.div>

      {/* Features grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
        {features.map(({ icon: Icon, color, label, desc }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: easing, delay: 0.18 + i * 0.08 }}>
            <div style={{ background: `linear-gradient(145deg, ${color}0c 0%, rgba(255,255,255,0.02) 60%)`, border: `1px solid ${color}1e`, borderRadius: "1.1rem", padding: "1.4rem 1.4rem 1.25rem", position: "relative", overflow: "hidden", height: "100%" }}>
              <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: `linear-gradient(to right, transparent, ${color}50, rgba(255,255,255,0.2), ${color}50, transparent)`, pointerEvents: "none" }} />
              <div style={{ width: 38, height: 38, borderRadius: "10px", background: `${color}14`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.9rem", boxShadow: `0 0 12px ${color}20` }}>
                <Icon size={18} color={color} />
              </div>
              <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.35rem" }}>{label}</p>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
