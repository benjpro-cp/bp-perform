"use client";

import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import {
  LayoutTemplate,
  TrendingUp,
  MessageCircle,
  CalendarDays,
  Gift,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: LayoutTemplate,
    title: "Programme 100% personnalisé",
    benefit: "Un plan qui colle exactement à ta morphologie, ton emploi du temps et tes objectifs. Jamais un template générique sorti d'une base de données.",
    hero: true,
  },
  {
    icon: TrendingUp,
    title: "Suivi de progression visible",
    benefit: "Toi et ton coach voyez exactement où tu progresses, semaine après semaine.",
  },
  {
    icon: MessageCircle,
    title: "Coach direct",
    benefit: "Tu n'es jamais seul face à un mur — accès direct, réponse rapide.",
  },
  {
    icon: CalendarDays,
    title: "Événements à venir",
    benefit: "Tu fais partie d'une vraie communauté, pas juste d'un abonnement.",
  },
  {
    icon: Gift,
    title: "Cadeaux à gagner",
    benefit: "Tes efforts et tes résultats sont récompensés concrètement.",
  },
  {
    icon: Shield,
    title: "Discipline exigeante",
    benefit: "Un cadre qui te pousse réellement à progresser, pas un suivi mou.",
  },
];

const easing = [0.22, 1, 0.36, 1] as const;

interface BentoItemProps {
  feature: (typeof features)[number];
  index: number;
  className?: string;
}

function BentoCard({ feature, index, className = "" }: BentoItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = feature.icon;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`bento-item ${className}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: easing, delay: index * 0.07 }}
    >
      <div style={{
        position: "relative", zIndex: 2,
        height: "100%", display: "flex", flexDirection: "column", gap: "1.5rem",
      }}>
        {/* Icon + number row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            width: feature.hero ? "3.75rem" : "3.25rem",
            height: feature.hero ? "3.75rem" : "3.25rem",
            borderRadius: "0.875rem",
            background: "rgba(56,189,248,0.07)",
            border: "1px solid rgba(56,189,248,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 28px rgba(56,189,248,0.12)",
            flexShrink: 0,
          }}>
            <Icon size={feature.hero ? 22 : 18} color="#38bdf8" strokeWidth={1.5} />
          </div>
          <span style={{
            fontFamily: "var(--font-oswald)", fontWeight: 700,
            fontSize: "0.72rem", letterSpacing: "0.12em",
            color: "rgba(56,189,248,0.4)",
            border: "1px solid rgba(56,189,248,0.15)",
            borderRadius: "999px",
            padding: "0.2rem 0.65rem",
          }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Text block */}
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "var(--font-oswald)", fontWeight: 700,
            fontSize: feature.hero ? "clamp(1.5rem, 3vw, 2rem)" : "1.1rem",
            textTransform: "uppercase",
            letterSpacing: "0.03em", color: "#ffffff",
            marginBottom: "0.85rem", lineHeight: 1.15,
          }}>
            {feature.title}
          </p>
          <p style={{
            fontSize: feature.hero ? "0.9rem" : "0.82rem",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.8,
            maxWidth: feature.hero ? "28rem" : undefined,
          }}>
            {feature.benefit}
          </p>
        </div>

        {/* Bottom accent */}
        <div style={{
          height: "1px",
          background: "linear-gradient(to right, rgba(56,189,248,0.25), transparent)",
          marginTop: "auto",
        }} />
      </div>

      {/* Hero decorative orb */}
      {feature.hero && (
        <div style={{
          position: "absolute", bottom: "-20%", right: "-10%",
          width: "60%", height: "70%",
          background: "radial-gradient(ellipse, rgba(56,189,248,0.09) 0%, transparent 65%)",
          filter: "blur(40px)",
          pointerEvents: "none", zIndex: 0,
        }} />
      )}
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section
      id="acces"
      style={{
        background: "#070c16",
        padding: "4rem 0 8rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "72px 72px",
        maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)",
      }} />

      {/* Glow orbs */}
      <div aria-hidden style={{
        position: "absolute", top: "10%", left: "-10%",
        width: "50%", height: "70%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 65%)",
        filter: "blur(70px)",
      }} />
      <div aria-hidden style={{
        position: "absolute", bottom: "5%", right: "-10%",
        width: "45%", height: "60%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse, rgba(56,189,248,0.06) 0%, transparent 65%)",
        filter: "blur(70px)",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>

        {/* Header — two column */}
        <div className="features-header-grid">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: easing }}
          >
            <p style={{
              fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 600,
              letterSpacing: "0.25em", textTransform: "uppercase", color: "#38bdf8",
              marginBottom: "1rem",
            }}>
              Ce que tu vas avoir accès
            </p>
            <h2 style={{
              fontFamily: "var(--font-oswald)", fontWeight: 700,
              fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", textTransform: "uppercase",
              letterSpacing: "-0.01em", lineHeight: 1.05, color: "#ffffff",
              marginBottom: "1.5rem",
            }}>
              UN ACCOMPAGNEMENT PENSÉ POUR TE FAIRE{" "}
              <span style={{ color: "#38bdf8" }}>CHANGER DE DIMENSION</span>
            </h2>
            <div style={{ width: "4rem", height: "2px", background: "#38bdf8" }} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: easing, delay: 0.15 }}
            className="features-desc"
            style={{
              fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.85,
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              paddingLeft: "2rem",
            }}
          >
            Chaque aspect de ton accompagnement est pensé pour éliminer les excuses, maximiser les résultats et te donner une longueur d'avance sur 99% des gens qui s'entraînent seuls.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="bento-grid">
          {/* Hero card — col-span 2, row-span 2 */}
          <BentoCard feature={features[0]} index={0} className="bento-item-hero" />

          {/* Column 3 row 1 */}
          <BentoCard feature={features[1]} index={1} />

          {/* Column 3 row 2 */}
          <BentoCard feature={features[2]} index={2} />

          {/* Row 3 — 3 equal cards */}
          <BentoCard feature={features[3]} index={3} />
          <BentoCard feature={features[4]} index={4} />
          <BentoCard feature={features[5]} index={5} />
        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: easing, delay: 0.2 }}
          style={{
            marginTop: "1rem",
            padding: "2.5rem 3rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: "3px",
            background: "linear-gradient(to bottom, transparent, #38bdf8 40%, #38bdf8 60%, transparent)",
            borderRadius: "999px",
          }} />

          <p style={{
            fontFamily: "var(--font-oswald)", fontWeight: 600,
            fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
            textTransform: "uppercase", letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.3,
          }}>
            On ne prend pas tout le monde.{" "}
            <span style={{ color: "#ffffff" }}>Il faut être prêt à s'engager.</span>
          </p>

          <a
            href="#contact"
            style={{
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
              color: "#070c16",
              fontWeight: 700,
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "0.9rem 1.75rem",
              borderRadius: "0.625rem",
              textDecoration: "none",
              boxShadow: "0 4px 24px rgba(56,189,248,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
              whiteSpace: "nowrap",
            }}
          >
            Je suis prêt
          </a>
        </motion.div>

      </div>
    </section>
  );
}
