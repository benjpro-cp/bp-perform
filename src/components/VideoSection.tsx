"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <section
      style={{
        background: "#070c16",
        padding: "3rem 0 7rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Diagonal grid */}
      <div aria-hidden style={{
        position: "absolute", inset: "-40%", pointerEvents: "none", zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
        transform: "rotate(-6deg)",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 75%)",
      }} />

      {/* Center glow behind video */}
      <div aria-hidden style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "60%", height: "100%",
        background: "radial-gradient(ellipse, rgba(56,189,248,0.09) 0%, transparent 65%)",
        filter: "blur(70px)", zIndex: 0, pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: easing }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <p style={{
            fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 600,
            letterSpacing: "0.25em", textTransform: "uppercase", color: "#38bdf8",
            marginBottom: "1rem",
          }}>
            Bienvenue
          </p>
          <h2 style={{
            fontFamily: "var(--font-oswald)", fontWeight: 700,
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)", textTransform: "uppercase",
            letterSpacing: "-0.01em", lineHeight: 1.05, color: "#ffffff",
          }}>
            BP PERFORM, <span style={{ color: "#38bdf8" }}>C'EST QUOI ?</span>
          </h2>
        </motion.div>

        {/* Video player */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: easing }}
          onClick={togglePlay}
          style={{
            position: "relative",
            maxWidth: "860px",
            margin: "0 auto",
            borderRadius: "1.5rem",
            overflow: "hidden",
            cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: [
              "0 0 0 1px rgba(255,255,255,0.05)",
              "0 0 60px rgba(56,189,248,0.1)",
              "0 40px 100px rgba(0,0,0,0.6)",
              "inset 0 1px 0 rgba(255,255,255,0.12)",
            ].join(", "),
            aspectRatio: "16/9",
          }}
        >
          {/* Poster / placeholder when no video src */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(7,12,22,0.95) 0%, rgba(10,20,40,0.98) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Decorative rings */}
            {[120, 200, 280].map((size) => (
              <div key={size} style={{
                position: "absolute",
                width: size, height: size,
                borderRadius: "50%",
                border: "1px solid rgba(56,189,248,0.1)",
              }} />
            ))}

            {/* BP text watermark */}
            <span style={{
              fontFamily: "var(--font-oswald)", fontWeight: 700,
              fontSize: "clamp(4rem, 10vw, 8rem)",
              color: "rgba(255,255,255,0.04)",
              position: "absolute",
              letterSpacing: "-0.02em",
              userSelect: "none",
            }}>
              BP
            </span>
          </div>

          {/* Actual video (hidden until you provide a src) */}
          <video
            ref={videoRef}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: playing ? 1 : 0, transition: "opacity 0.3s" }}
            onEnded={() => setPlaying(false)}
            playsInline
          />

          {/* Play / pause overlay */}
          {!playing && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "1.25rem",
            }}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: "5rem", height: "5rem", borderRadius: "50%",
                  background: "rgba(56,189,248,0.15)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(56,189,248,0.45)",
                  boxShadow: "0 0 40px rgba(56,189,248,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Play size={22} color="#38bdf8" fill="#38bdf8" style={{ marginLeft: "3px" }} />
              </motion.div>
              <p style={{
                fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 600,
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.65)",
              }}>
                Regarder la vidéo
              </p>
            </div>
          )}

          {/* Mute button (visible while playing) */}
          {playing && (
            <button
              onClick={toggleMute}
              style={{
                position: "absolute", bottom: "1.25rem", right: "1.25rem",
                width: "2.25rem", height: "2.25rem", borderRadius: "50%",
                background: "rgba(10,16,28,0.7)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "rgba(255,255,255,0.7)",
              }}
            >
              {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
          )}

          {/* Corner accent lines */}
          {[
            { top: 0, left: 0, borderTop: "2px solid rgba(56,189,248,0.5)", borderLeft: "2px solid rgba(56,189,248,0.5)", borderRadius: "1.5rem 0 0 0" },
            { top: 0, right: 0, borderTop: "2px solid rgba(56,189,248,0.5)", borderRight: "2px solid rgba(56,189,248,0.5)", borderRadius: "0 1.5rem 0 0" },
            { bottom: 0, left: 0, borderBottom: "2px solid rgba(56,189,248,0.5)", borderLeft: "2px solid rgba(56,189,248,0.5)", borderRadius: "0 0 0 1.5rem" },
            { bottom: 0, right: 0, borderBottom: "2px solid rgba(56,189,248,0.5)", borderRight: "2px solid rgba(56,189,248,0.5)", borderRadius: "0 0 1.5rem 0" },
          ].map((style, i) => (
            <div key={i} style={{ position: "absolute", width: "2rem", height: "2rem", ...style }} />
          ))}
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            textAlign: "center", marginTop: "2rem",
            fontSize: "0.8rem", color: "rgba(255,255,255,0.58)",
            letterSpacing: "0.05em",
          }}
        >
          Présentation de BP Perform — approche, méthode, résultats
        </motion.p>

      </div>
    </section>
  );
}
