"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Camera } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Transformation {
  id: number;
  name: string;
  age: number;
  goal: string;
  duration: string;
  result: string;
  resultLabel: string;
  program: string;
  initials: string;
  quote: string;
  photoBefore: string | null;
  photoAfter: string | null;
  photoProfile: string | null;
  mainMetric: { label: string; before: string; after: string };
  stats: { label: string; before: string; after: string }[];
}

const transformations: Transformation[] = [
  {
    id: 1,
    name: "Thomas R.",
    age: 24,
    goal: "Prise de masse",
    duration: "12 semaines",
    result: "+8 kg",
    resultLabel: "de muscle",
    program: "Hypertrophie Intermédiaire",
    initials: "TR",
    photoBefore: null,
    photoAfter: null,
    photoProfile: null,
    quote: "Avant BP Perform, je tournais en rond depuis 2 ans. En 3 mois j'ai progressé plus que durant toute ma période solo. Le suivi hebdomadaire change vraiment tout — on ne triche plus sur les séances.",
    mainMetric: { label: "Poids corporel", before: "68 kg", after: "76 kg" },
    stats: [
      { label: "Développé couché", before: "60 kg", after: "90 kg" },
      { label: "Squat", before: "80 kg", after: "120 kg" },
      { label: "Masse musculaire", before: "Faible", after: "+8 kg" },
    ],
  },
  {
    id: 2,
    name: "Karim B.",
    age: 31,
    goal: "Perte de poids",
    duration: "16 semaines",
    result: "−14 kg",
    resultLabel: "de graisse",
    program: "Rééquilibrage & Cardio",
    initials: "KB",
    photoBefore: null,
    photoAfter: null,
    photoProfile: null,
    quote: "J'avais essayé des dizaines de régimes. Avec BP Perform c'est différent — c'est basé sur mes habitudes réelles, pas sur un plan générique. Je n'ai jamais eu faim. Je me suis transformé sans souffrir.",
    mainMetric: { label: "Poids corporel", before: "94 kg", after: "80 kg" },
    stats: [
      { label: "Tour de taille", before: "102 cm", after: "88 cm" },
      { label: "VO2 max", before: "Faible", after: "Moyen+" },
      { label: "Énergie quotidienne", before: "3/10", after: "8/10" },
    ],
  },
  {
    id: 3,
    name: "Lucas M.",
    age: 19,
    goal: "Performance",
    duration: "8 semaines",
    result: "+12%",
    resultLabel: "de force",
    program: "Force & Puissance",
    initials: "LM",
    photoBefore: null,
    photoAfter: null,
    photoProfile: null,
    quote: "Je suis footballeur et je voulais améliorer ma puissance musculaire. Le programme était parfaitement adapté à mon calendrier. Résultat : plus rapide, plus explosif, moins de blessures.",
    mainMetric: { label: "Saut vertical", before: "52 cm", after: "61 cm" },
    stats: [
      { label: "Sprint 30m", before: "4.4s", after: "4.1s" },
      { label: "Force maximale", before: "100%", after: "112%" },
      { label: "Blessures", before: "Fréquentes", after: "Aucune" },
    ],
  },
  {
    id: 4,
    name: "Sarah L.",
    age: 28,
    goal: "Remise en forme",
    duration: "10 semaines",
    result: "−6 kg",
    resultLabel: "retrouvée",
    program: "Remise en forme globale",
    initials: "SL",
    photoBefore: null,
    photoAfter: null,
    photoProfile: null,
    quote: "Après ma grossesse, je voulais retrouver mon énergie et ma silhouette. Le coach a tout adapté à ma situation. Aujourd'hui je me sens mieux qu'avant, avec des séances courtes mais vraiment efficaces.",
    mainMetric: { label: "Poids corporel", before: "68 kg", after: "62 kg" },
    stats: [
      { label: "Endurance", before: "Faible", after: "Bonne" },
      { label: "Énergie quotidienne", before: "3/10", after: "8/10" },
      { label: "Forme générale", before: "Mauvaise", after: "Excellente" },
    ],
  },
];

const easing = [0.22, 1, 0.36, 1] as const;

function PhotoPlaceholder({ label, initials }: { label: string; initials: string }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "rgba(255,255,255,0.02)",
      border: "1.5px dashed rgba(56,189,248,0.15)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: "0.6rem",
    }}>
      <Camera size={22} color="rgba(56,189,248,0.3)" strokeWidth={1.5} />
      <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
        {label}
      </span>
      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(56,189,248,0.25)", fontFamily: "var(--font-oswald)" }}>
        {initials}
      </span>
    </div>
  );
}

function TransformationModal({ t, onClose }: { t: Transformation; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(4,8,16,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.35, ease: easing }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "900px", maxHeight: "92vh",
          overflowY: "auto",
          background: "rgba(8,14,26,0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "1.5rem",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          position: "relative",
        }}
      >
        {/* Top line */}
        <div style={{ height: "2px", background: "linear-gradient(to right, transparent 5%, rgba(56,189,248,0.6) 30%, rgba(56,189,248,0.6) 70%, transparent 95%)", borderRadius: "2px 2px 0 0" }} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1.25rem", right: "1.25rem", zIndex: 10,
            width: "2rem", height: "2rem", borderRadius: "50%",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
        >
          <X size={14} color="rgba(255,255,255,0.7)" />
        </button>

        <div style={{ padding: "2rem 2.5rem 2.5rem" }}>

          {/* Identity header */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            {/* Profile photo */}
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", flexShrink: 0,
              border: "2px solid rgba(56,189,248,0.3)",
              boxShadow: "0 0 0 4px rgba(56,189,248,0.07)",
            }}>
              {t.photoProfile ? (
                <img src={t.photoProfile} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  background: "linear-gradient(135deg, rgba(56,189,248,0.22), rgba(56,189,248,0.06))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1rem", color: "#38bdf8",
                }}>
                  {t.initials}
                </div>
              )}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "#ffffff", lineHeight: 1 }}>
                  {t.name}
                </p>
                <span style={{
                  fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "rgba(56,189,248,0.85)", background: "rgba(56,189,248,0.1)",
                  border: "1px solid rgba(56,189,248,0.25)", borderRadius: "999px", padding: "0.2rem 0.65rem",
                }}>{t.goal}</span>
              </div>
              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", marginTop: "0.25rem" }}>
                {t.age} ans · {t.program} · {t.duration}
              </p>
            </div>
            {/* Result */}
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "2.4rem", color: "#38bdf8", lineHeight: 1, letterSpacing: "-0.02em", textShadow: "0 0 28px rgba(56,189,248,0.45)" }}>
                {t.result}
              </p>
              <p style={{ fontSize: "0.6rem", color: "rgba(56,189,248,0.6)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.1rem" }}>
                {t.resultLabel}
              </p>
            </div>
          </div>

          {/* Before / After photos */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
            {(["Avant", "Après"] as const).map((label, idx) => {
              const photoUrl = idx === 0 ? t.photoBefore : t.photoAfter;
              return (
                <div key={label} style={{ position: "relative", borderRadius: "0.75rem", overflow: "hidden", aspectRatio: "3/4", background: "rgba(0,0,0,0.3)" }}>
                  {photoUrl ? (
                    <img src={photoUrl} alt={`${label} — ${t.name}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <PhotoPlaceholder label={label} initials={t.initials} />
                  )}
                  {/* Label overlay */}
                  <div style={{
                    position: "absolute", bottom: "0.75rem", left: "0.75rem",
                    background: idx === 0 ? "rgba(0,0,0,0.6)" : "rgba(56,189,248,0.9)",
                    backdropFilter: "blur(6px)",
                    padding: "0.25rem 0.65rem", borderRadius: "999px",
                  }}>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: idx === 0 ? "rgba(255,255,255,0.7)" : "#03090f" }}>
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main metric */}
          <div style={{
            borderRadius: "0.75rem", background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            padding: "1rem 1.5rem", marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: "1.25rem",
          }}>
            <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", flexShrink: 0, minWidth: "5.5rem" }}>
              {t.mainMetric.label}
            </p>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.4rem", color: "rgba(255,255,255,0.35)", lineHeight: 1, flexShrink: 0 }}>
                {t.mainMetric.before}
              </span>
              <div style={{ flex: 1, height: "3px", borderRadius: "999px", background: "rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(56,189,248,0.3), #38bdf8)", boxShadow: "0 0 10px rgba(56,189,248,0.5)" }} />
              </div>
              <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.4rem", color: "#ffffff", lineHeight: 1, flexShrink: 0, textShadow: "0 0 16px rgba(56,189,248,0.3)" }}>
                {t.mainMetric.after}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
              <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.28)" }}>Avant</span>
              <span style={{ fontSize: "0.55rem", color: "rgba(56,189,248,0.4)" }}>→</span>
              <span style={{ fontSize: "0.55rem", color: "rgba(56,189,248,0.7)" }}>Après</span>
            </div>
          </div>

          {/* Stats + Quote */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {/* Stats */}
            <div>
              <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem" }}>
                Progression détaillée
              </p>
              {t.stats.map((s, si) => (
                <div key={s.label} style={{
                  display: "grid", gridTemplateColumns: "1fr auto auto auto",
                  alignItems: "center", gap: "0.6rem",
                  padding: "0.65rem 0",
                  borderBottom: si < t.stats.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>{s.label}</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.15)" }}>{s.before}</span>
                  <span style={{ fontSize: "0.6rem", color: "rgba(56,189,248,0.4)" }}>→</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#38bdf8" }}>{s.after}</span>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div style={{
              background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.1)",
              borderRadius: "0.75rem", padding: "1.25rem", position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "-0.8rem", left: "0.6rem",
                fontFamily: "Georgia, serif", fontSize: "4rem", lineHeight: 1,
                color: "rgba(56,189,248,0.18)", userSelect: "none", pointerEvents: "none",
              }}>"</div>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.68)", lineHeight: 1.8, fontStyle: "italic", position: "relative", zIndex: 1 }}>
                {t.quote}
              </p>
              <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "1.25rem", height: "1px", background: "rgba(56,189,248,0.4)" }} />
                <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#38bdf8" }}>
                  {t.name}
                </p>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

function TransformationCard({ t, index, onClick }: { t: Transformation; index: number; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: easing, delay: index * 0.08 }}
      onClick={onClick}
      style={{
        all: "unset",
        cursor: "pointer",
        display: "block",
        borderRadius: "1.25rem",
        overflow: "hidden",
        background: "rgba(10,16,28,0.7)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        textAlign: "left",
        width: "100%",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(56,189,248,0.2), inset 0 1px 0 rgba(255,255,255,0.1)";
        el.style.borderColor = "rgba(56,189,248,0.22)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "";
        el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)";
        el.style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      {/* Photo area */}
      <div style={{ position: "relative", aspectRatio: "4/3", background: "rgba(0,0,0,0.4)" }}>
        {t.photoAfter ? (
          <img src={t.photoAfter} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "rgba(255,255,255,0.01)" }}>
            <Camera size={28} color="rgba(56,189,248,0.25)" strokeWidth={1.5} />
            <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>
              Photo à venir
            </span>
          </div>
        )}
        {/* Result pill overlay */}
        <div style={{
          position: "absolute", top: "0.75rem", right: "0.75rem",
          background: "rgba(56,189,248,0.92)",
          borderRadius: "999px", padding: "0.3rem 0.75rem",
          boxShadow: "0 4px 16px rgba(56,189,248,0.4)",
        }}>
          <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.85rem", color: "#03090f", letterSpacing: "0.04em" }}>
            {t.result}
          </span>
        </div>
        {/* Click hint */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(8,14,26,0.7) 0%, transparent 50%)",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          paddingBottom: "0.75rem",
          opacity: 0, transition: "opacity 0.2s",
        }} className="card-hover-hint">
          <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
            Voir la transformation
          </span>
        </div>
      </div>

      {/* Info row */}
      <div style={{ padding: "1.1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.85rem" }}>
        {/* Avatar */}
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0, overflow: "hidden",
          border: "1.5px solid rgba(56,189,248,0.3)",
          boxShadow: "0 0 0 3px rgba(56,189,248,0.07)",
        }}>
          {t.photoProfile ? (
            <img src={t.photoProfile} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(135deg, rgba(56,189,248,0.25), rgba(56,189,248,0.07))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.8rem", color: "#38bdf8",
            }}>
              {t.initials}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "#ffffff", lineHeight: 1, marginBottom: "0.2rem" }}>
            {t.name}
          </p>
          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {t.resultLabel} · {t.duration}
          </p>
        </div>

        <span style={{
          fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
          color: "rgba(56,189,248,0.8)", background: "rgba(56,189,248,0.08)",
          border: "1px solid rgba(56,189,248,0.2)", borderRadius: "999px",
          padding: "0.2rem 0.55rem", flexShrink: 0,
        }}>
          {t.goal}
        </span>
      </div>
    </motion.button>
  );
}

export default function TransformationsPage() {
  const [selected, setSelected] = useState<Transformation | null>(null);

  return (
    <>
      <Navbar />
      <main style={{ background: "#070c16", minHeight: "100vh", paddingTop: "6rem" }}>

        {/* BG grid */}
        <div aria-hidden style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 100% 60% at 50% 0%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 100% 60% at 50% 0%, black 30%, transparent 100%)",
        }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 8rem", position: "relative", zIndex: 1 }}>

          {/* Back */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: easing }} style={{ marginBottom: "2.5rem" }}>
            <Link href="/#resultats" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.45)",
              textDecoration: "none", transition: "color 0.15s",
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
            >
              <ArrowLeft size={13} /> Retour
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: easing }} style={{ marginBottom: "4rem" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "1rem" }}>
              BP Perform · Résultats
            </p>
            <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(3rem, 7vw, 5.5rem)", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 0.95, color: "#ffffff", marginBottom: "1.5rem" }}>
              LEURS<br /><span style={{ color: "#38bdf8" }}>TRANSFORMATIONS</span>
            </h1>
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.8, maxWidth: "38rem" }}>
              Des personnes réelles, des résultats réels. Clique sur une carte pour voir le avant/après complet et l&apos;histoire derrière.
            </p>
          </motion.div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "4rem" }}>
            {transformations.map((t, i) => (
              <TransformationCard key={t.id} t={t} index={i} onClick={() => setSelected(t)} />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easing }}
            style={{
              padding: "3.5rem",
              borderRadius: "1.5rem",
              background: "rgba(56,189,248,0.04)",
              border: "1px solid rgba(56,189,248,0.12)",
              textAlign: "center",
              position: "relative", overflow: "hidden",
            }}
          >
            <div aria-hidden style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "70%", height: "300%",
              background: "radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 65%)",
              filter: "blur(60px)", pointerEvents: "none",
            }} />
            <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", textTransform: "uppercase", letterSpacing: "-0.01em", color: "#ffffff", marginBottom: "0.75rem", position: "relative" }}>
              Prêt à écrire ta propre histoire ?
            </p>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", marginBottom: "2.5rem", position: "relative" }}>
              Commence par une séance bilan gratuite de 30 minutes.
            </p>
            <Link
              href="/#contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.65rem",
                background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
                color: "#03090f", fontWeight: 800, fontSize: "0.72rem",
                letterSpacing: "0.16em", textTransform: "uppercase",
                padding: "1rem 2.5rem", borderRadius: "9999px", textDecoration: "none",
                boxShadow: "0 0 0 1px rgba(56,189,248,0.4), 0 8px 32px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
                position: "relative", transition: "all 0.2s ease",
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
              Démarrer maintenant
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2.5 6.5H10.5M10.5 6.5L7 3M10.5 6.5L7 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>

        </div>
      </main>
      <Footer />

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <TransformationModal t={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
