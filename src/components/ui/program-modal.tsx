"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

export interface ProgramData {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  points: string[];
}

interface ProgramModalProps {
  program: ProgramData | null;
  onClose: () => void;
}

export function ProgramModal({ program, onClose }: ProgramModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!program) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);

    // Freeze background: position fixed keeps scroll position intact
    const scrollY = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    // Stop wheel events from reaching Lenis so the panel can scroll natively
    const panel = panelRef.current;
    const stopProp = (e: WheelEvent) => e.stopPropagation();
    panel?.addEventListener("wheel", stopProp, { passive: true });

    return () => {
      document.removeEventListener("keydown", onKey);
      panel?.removeEventListener("wheel", stopProp);
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [program, onClose]);

  return (
    <AnimatePresence>
      {program && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(4,8,16,0.82)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          />

          {/* Perspective wrapper */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 101,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1.25rem",
            perspective: "1400px",
            pointerEvents: "none",
          }}>
            <motion.div
              key="panel"
              initial={{ opacity: 0, rotateX: 12, scale: 0.85, y: 60 }}
              animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
              exit={{ opacity: 0, rotateX: 8, scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              ref={panelRef}
              style={{
                transformStyle: "preserve-3d",
                pointerEvents: "auto",
                width: "100%",
                maxWidth: "680px",
                maxHeight: "90vh",
                overflowY: "auto",
                borderRadius: "1.5rem",
                background: "rgba(10,16,28,0.92)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: [
                  "inset 0 1px 0 rgba(255,255,255,0.14)",
                  "0 0 0 1px rgba(56,189,248,0.08)",
                  "0 40px 100px rgba(0,0,0,0.7)",
                  "0 0 80px rgba(56,189,248,0.06)",
                ].join(", "),
              }}
            >
              {/* Hero image zone */}
              <div style={{ position: "relative", height: "220px", borderRadius: "1.5rem 1.5rem 0 0", overflow: "hidden" }}>
                <img
                  src={program.imageUrl}
                  alt={program.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
                />
                {/* Gradient overlay on image */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to bottom, rgba(10,16,28,0.2) 0%, rgba(10,16,28,0.0) 40%, rgba(10,16,28,0.85) 100%)",
                }} />

                {/* Glow orb on image */}
                <div style={{
                  position: "absolute", bottom: "-30px", left: "50%", transform: "translateX(-50%)",
                  width: "60%", height: "80px", pointerEvents: "none",
                  background: "radial-gradient(ellipse, rgba(56,189,248,0.25) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }} />

                {/* Tag on image */}
                <div style={{
                  position: "absolute", top: "1.25rem", left: "1.5rem",
                  background: "rgba(56,189,248,0.15)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(56,189,248,0.3)",
                  borderRadius: "999px",
                  padding: "0.3rem 0.85rem",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#38bdf8",
                }}>
                  {program.subtitle}
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  style={{
                    position: "absolute", top: "1.25rem", right: "1.25rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "2.25rem", height: "2.25rem", borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(10,16,28,0.6)",
                    backdropFilter: "blur(8px)",
                    color: "rgba(255,255,255,0.7)",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(10,16,28,0.6)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: "2rem 2.25rem 2.5rem" }}>

                {/* Title */}
                <h2 style={{
                  fontFamily: "var(--font-oswald)",
                  fontWeight: 700,
                  fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                  color: "#ffffff",
                  lineHeight: 1,
                  marginBottom: "1.25rem",
                }}>
                  {program.title}
                </h2>

                {/* Divider */}
                <div style={{
                  height: "1px",
                  background: "linear-gradient(to right, rgba(56,189,248,0.4), rgba(255,255,255,0.06) 60%, transparent)",
                  marginBottom: "1.5rem",
                }} />

                {/* Description */}
                <p style={{
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.85,
                  marginBottom: "1.75rem",
                }}>
                  {program.description}
                </p>

                {/* Points */}
                <div style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "0.875rem",
                  padding: "1.25rem 1.5rem",
                  marginBottom: "2rem",
                }}>
                  <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.58)", marginBottom: "1rem" }}>
                    Les étapes de votre transformation
                  </p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                    {program.points.map((point) => (
                      <li key={point} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          width: "1.25rem", height: "1.25rem", borderRadius: "50%",
                          background: "rgba(56,189,248,0.1)",
                          border: "1px solid rgba(56,189,248,0.25)",
                          flexShrink: 0,
                        }}>
                          <Check size={9} color="#38bdf8" strokeWidth={3} />
                        </span>
                        <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.78)" }}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <a
                  href="#contact"
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    width: "100%",
                    textAlign: "center",
                    background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
                    color: "#070c16",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "1.1rem",
                    textDecoration: "none",
                    borderRadius: "0.75rem",
                    boxShadow: "0 4px 30px rgba(56,189,248,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 40px rgba(56,189,248,0.5), inset 0 1px 0 rgba(255,255,255,0.25)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 30px rgba(56,189,248,0.35), inset 0 1px 0 rgba(255,255,255,0.25)";
                    (e.currentTarget as HTMLElement).style.transform = "";
                  }}
                >
                  Démarrer ce programme
                  <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
