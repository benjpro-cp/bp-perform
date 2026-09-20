"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Headphones, ExternalLink } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;

const PLAYLISTS = [
  {
    id: 1,
    name: "Pump & Lift",
    genre: "Hypertrophie",
    desc: "Des tracks lourds et intenses pour pousser tes meilleures séries.",
    from: "#0c1a3a",
    to: "#1a4a8a",
    accent: "#38bdf8",
    href: "SPOTIFY_LINK_HERE",
  },
  {
    id: 2,
    name: "Cardio Rush",
    genre: "Cardio",
    desc: "BPM élevé pour maintenir le rythme sur tes sessions d'endurance.",
    from: "#0a2a14",
    to: "#0f5a28",
    accent: "#4ade80",
    href: "SPOTIFY_LINK_HERE",
  },
  {
    id: 3,
    name: "Focus Mode",
    genre: "Concentration",
    desc: "Sons ambiants pour te mettre dans la zone avant de t'échauffer.",
    from: "#1a0a32",
    to: "#3b1065",
    accent: "#a78bfa",
    href: "SPOTIFY_LINK_HERE",
  },
  {
    id: 4,
    name: "Recovery Flow",
    genre: "Récupération",
    desc: "Musique douce pour récupérer et faire baisser ton cortisol après l'effort.",
    from: "#2a1200",
    to: "#7c2d12",
    accent: "#fb923c",
    href: "SPOTIFY_LINK_HERE",
  },
];

const EQ_DELAYS = [0, 0.18, 0.06, 0.28, 0.12, 0.22];
const EQ_HEIGHTS = [55, 80, 35, 90, 60, 40];

function EqBars({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "40px" }}>
      {EQ_HEIGHTS.map((h, i) => (
        <motion.div
          key={i}
          animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.55}%`, `${h * 0.9}%`, `${h * 0.4}%`] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: EQ_DELAYS[i] }}
          style={{
            width: "5px",
            background: color,
            borderRadius: "3px",
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}

function PlaylistCard({ pl, index }: { pl: typeof PLAYLISTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const available = pl.href !== "SPOTIFY_LINK_HERE";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easing, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "1.5rem",
        overflow: "hidden",
        background: "#0b1120",
        border: `1px solid ${hovered ? pl.accent + "30" : "rgba(255,255,255,0.07)"}`,
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${pl.accent}18`
          : "0 4px 20px rgba(0,0,0,0.35)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, border-color 0.3s ease",
        cursor: "default",
      }}
    >
      {/* Cover area */}
      <div style={{
        height: "160px",
        background: `linear-gradient(145deg, ${pl.from} 0%, ${pl.to} 100%)`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Grain texture overlay */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
          opacity: 0.5,
          mixBlendMode: "overlay",
        }} />

        {/* Radial glow center */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 60%, ${pl.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", position: "relative", zIndex: 1 }}>
          {/* Big music icon */}
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: `rgba(0,0,0,0.35)`,
            border: `1.5px solid ${pl.accent}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
            boxShadow: `0 0 30px ${pl.accent}30`,
          }}>
            <Headphones size={24} color={pl.accent} />
          </div>
          {/* EQ bars */}
          <EqBars color={pl.accent} />
        </div>

        {/* Bottom gradient fade */}
        <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50px", background: "linear-gradient(to top, #0b1120, transparent)", pointerEvents: "none" }} />
      </div>

      {/* Info area */}
      <div style={{ padding: "1.25rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* Genre */}
        <span style={{
          display: "inline-block", alignSelf: "flex-start",
          fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
          color: pl.accent,
          background: `${pl.accent}12`,
          border: `1px solid ${pl.accent}28`,
          borderRadius: "9999px",
          padding: "0.2rem 0.65rem",
        }}>
          {pl.genre}
        </span>

        {/* Name */}
        <h3 style={{
          fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.35rem",
          textTransform: "uppercase", letterSpacing: "0.04em",
          color: "#ffffff", lineHeight: 1, margin: 0,
        }}>
          {pl.name}
        </h3>

        {/* Desc */}
        <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.65, margin: 0 }}>
          {pl.desc}
        </p>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

        {/* Spotify CTA */}
        <a
          href={available ? pl.href : "#"}
          target={available ? "_blank" : undefined}
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.65rem 1rem",
            background: available ? "rgba(29,185,84,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${available ? "rgba(29,185,84,0.3)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: "0.75rem",
            textDecoration: "none",
            fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.05em",
            color: available ? "#1DB954" : "rgba(255,255,255,0.22)",
            cursor: available ? "pointer" : "not-allowed",
            transition: "all 0.18s ease",
            alignSelf: "flex-start",
          }}
          onMouseEnter={(e) => {
            if (available) {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(29,185,84,0.22)";
              el.style.boxShadow = "0 4px 18px rgba(29,185,84,0.2)";
            }
          }}
          onMouseLeave={(e) => {
            if (available) {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(29,185,84,0.12)";
              el.style.boxShadow = "none";
            }
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          {available ? <><span>Écouter sur Spotify</span><ExternalLink size={11} /></> : "Bientôt disponible"}
        </a>
      </div>
    </motion.div>
  );
}

export default function MusiquePage() {
  return (
    <div style={{ maxWidth: "900px" }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easing }}
        style={{ marginBottom: "2.5rem" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: "10px", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Headphones size={18} color="#38bdf8" />
          </div>
          <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.65rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "#ffffff" }}>
            Recommandations musique
          </h1>
        </div>
        <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.38)", marginLeft: "3.25rem" }}>
          Sélectionnées par ton coach pour chaque type de séance.
        </p>
      </motion.div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
        {PLAYLISTS.map((pl, i) => (
          <PlaylistCard key={pl.id} pl={pl} index={i} />
        ))}
      </div>

      {/* Coach note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: easing, delay: 0.4 }}
        style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}
      >
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, rgba(56,189,248,0.3), rgba(56,189,248,0.08))", border: "1.5px solid rgba(56,189,248,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.88rem", color: "#38bdf8", flexShrink: 0 }}>
          P
        </div>
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ffffff", marginBottom: "0.25rem" }}>Paul — ton coach</p>
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>
            La musique est un vrai levier de performance. Ces playlists sont mises à jour régulièrement selon les phases d&apos;entraînement.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
