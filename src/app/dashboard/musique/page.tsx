"use client";

import { motion } from "framer-motion";
import { Music, ExternalLink, Headphones } from "lucide-react";
import { HoverSpotlight } from "@/components/HoverSpotlight";

const easing = [0.22, 1, 0.36, 1] as const;

const PLAYLISTS = [
  {
    id: 1,
    name: "Pump & Lift",
    genre: "Hypertrophie",
    desc: "Des tracks lourds et intenses pour pousser tes meilleures séries.",
    color: "#38bdf8",
    href: "SPOTIFY_LINK_HERE",
  },
  {
    id: 2,
    name: "Cardio Rush",
    genre: "Cardio",
    desc: "BPM élevé pour maintenir le rythme sur tes sessions d'endurance.",
    color: "#4ade80",
    href: "SPOTIFY_LINK_HERE",
  },
  {
    id: 3,
    name: "Focus Mode",
    genre: "Concentration",
    desc: "Sons ambiants pour te mettre dans la zone avant de t'échauffer.",
    color: "#a78bfa",
    href: "SPOTIFY_LINK_HERE",
  },
  {
    id: 4,
    name: "Recovery Flow",
    genre: "Récupération",
    desc: "Musique douce pour récupérer et faire baisser ton cortisol après l'effort.",
    color: "#fb923c",
    href: "SPOTIFY_LINK_HERE",
  },
];

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
          <div style={{ width: 38, height: 38, borderRadius: "10px", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 14px rgba(56,189,248,0.15)" }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {PLAYLISTS.map((pl, i) => (
          <motion.div
            key={pl.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: easing, delay: i * 0.08 }}
          >
            <HoverSpotlight
              color={pl.color}
              style={{
                background: `linear-gradient(145deg, ${pl.color}0c 0%, rgba(255,255,255,0.03) 60%, ${pl.color}06 100%)`,
                backdropFilter: "blur(32px) saturate(180%)",
                WebkitBackdropFilter: "blur(32px) saturate(180%)",
                border: `1px solid ${pl.color}22`,
                borderRadius: "1.35rem",
                padding: "1.75rem",
                position: "relative",
                overflow: "hidden",
                boxShadow: [
                  `inset 0 1px 0 ${pl.color}18`,
                  `0 8px 32px ${pl.color}08`,
                  "0 2px 8px rgba(0,0,0,0.25)",
                ].join(", "),
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Specular */}
              <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${pl.color}55, transparent)`, pointerEvents: "none" }} />
              {/* Corner glow */}
              <div aria-hidden style={{ position: "absolute", bottom: "-20px", right: "-20px", width: 120, height: 100, background: `radial-gradient(ellipse, ${pl.color}16 0%, transparent 65%)`, filter: "blur(20px)", pointerEvents: "none" }} />
              {/* Watermark */}
              <div aria-hidden style={{ position: "absolute", bottom: "-0.5rem", right: "0.75rem", pointerEvents: "none" }}>
                <Music size={72} color={pl.color} style={{ opacity: 0.05 }} />
              </div>

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Genre tag */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: `${pl.color}14`, border: `1px solid ${pl.color}30`, borderRadius: "9999px", padding: "0.22rem 0.7rem", marginBottom: "1rem" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: pl.color, boxShadow: `0 0 6px ${pl.color}` }} />
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: pl.color }}>{pl.genre}</span>
                </div>

                <h3 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.3rem", textTransform: "uppercase", letterSpacing: "0.03em", color: "#ffffff", marginBottom: "0.5rem", lineHeight: 1.1 }}>
                  {pl.name}
                </h3>
                <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>
                  {pl.desc}
                </p>
              </div>

              {/* Spotify CTA */}
              <a
                href={pl.href === "SPOTIFY_LINK_HERE" ? "#" : pl.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: pl.href === "SPOTIFY_LINK_HERE" ? "rgba(255,255,255,0.05)" : "rgba(30,215,96,0.12)",
                  border: pl.href === "SPOTIFY_LINK_HERE" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(30,215,96,0.3)",
                  borderRadius: "0.75rem",
                  padding: "0.65rem 1rem",
                  textDecoration: "none",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: pl.href === "SPOTIFY_LINK_HERE" ? "rgba(255,255,255,0.25)" : "#1DB954",
                  transition: "all 0.18s ease",
                  cursor: pl.href === "SPOTIFY_LINK_HERE" ? "not-allowed" : "pointer",
                  position: "relative", zIndex: 1,
                  alignSelf: "flex-start",
                }}
                onMouseEnter={(e) => {
                  if (pl.href !== "SPOTIFY_LINK_HERE") {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(30,215,96,0.2)";
                    el.style.boxShadow = "0 4px 20px rgba(30,215,96,0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (pl.href !== "SPOTIFY_LINK_HERE") {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(30,215,96,0.12)";
                    el.style.boxShadow = "none";
                  }
                }}
              >
                {/* Spotify icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                {pl.href === "SPOTIFY_LINK_HERE" ? "Bientôt disponible" : "Écouter sur Spotify"}
                {pl.href !== "SPOTIFY_LINK_HERE" && <ExternalLink size={11} />}
              </a>
            </HoverSpotlight>
          </motion.div>
        ))}
      </div>

      {/* Coach note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: easing, delay: 0.4 }}
        style={{
          marginTop: "2rem",
          padding: "1.25rem 1.5rem",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "1rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
        }}
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
