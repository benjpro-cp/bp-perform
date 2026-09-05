"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, LogIn, UserPlus } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("bp_welcome_seen")) {
      const t = setTimeout(() => setOpen(true), 1400);
      return () => clearTimeout(t);
    }
  }, []);

  function close() {
    sessionStorage.setItem("bp_welcome_seen", "1");
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(4,8,16,0.78)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
          />

          <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", pointerEvents: "none" }}>
            <motion.div key="modal"
              initial={{ opacity: 0, scale: 0.88, y: 36 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
              style={{ pointerEvents: "auto", width: "100%", maxWidth: "400px", background: "linear-gradient(145deg, rgba(56,189,248,0.09) 0%, rgba(10,18,32,0.97) 60%)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", border: "1px solid rgba(56,189,248,0.22)", borderRadius: "1.5rem", padding: "2.5rem", position: "relative", boxShadow: "0 40px 100px rgba(0,0,0,0.65), 0 0 80px rgba(56,189,248,0.06), inset 0 1px 0 rgba(255,255,255,0.08)" }}
            >
              {/* Ligne lumineuse */}
              <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.55), rgba(255,255,255,0.3), rgba(56,189,248,0.55), transparent)", pointerEvents: "none" }} />

              {/* Croix */}
              <button onClick={close}
                style={{ position: "absolute", top: "1rem", right: "1rem", width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.35)", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
              >
                <X size={14} />
              </button>

              {/* Logo */}
              <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                <motion.div
                  animate={{ boxShadow: ["0 0 0 0 rgba(56,189,248,0)", "0 0 0 14px rgba(56,189,248,0.07)", "0 0 0 0 rgba(56,189,248,0)"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ display: "inline-flex", width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, rgba(56,189,248,0.22) 0%, rgba(56,189,248,0.06) 100%)", border: "2px solid rgba(56,189,248,0.35)", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}
                >
                  <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.1rem", color: "#38bdf8" }}>BP</span>
                </motion.div>
                <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.55rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1.15, marginBottom: "0.6rem" }}>
                  Bienvenue sur<br /><span style={{ color: "#38bdf8", textShadow: "0 0 22px rgba(56,189,248,0.4)" }}>BP Perform</span>
                </h2>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>
                  Rejoins le coaching ou accède à ton espace client.
                </p>
              </div>

              {/* Boutons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                <Link href="/signup" onClick={close}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", padding: "0.9rem", background: "linear-gradient(135deg, #38bdf8, #0ea5e9)", color: "#03090f", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "0.85rem", textDecoration: "none", boxShadow: "0 4px 24px rgba(56,189,248,0.42), inset 0 1px 0 rgba(255,255,255,0.3)", transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 32px rgba(56,189,248,0.6), inset 0 1px 0 rgba(255,255,255,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 24px rgba(56,189,248,0.42), inset 0 1px 0 rgba(255,255,255,0.3)"}
                >
                  <UserPlus size={15} /> S&apos;inscrire
                </Link>

                <Link href="/login" onClick={close}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", padding: "0.9rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#ffffff", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "0.85rem", textDecoration: "none", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                >
                  <LogIn size={15} /> Se connecter
                </Link>
              </div>

              {/* Fermer */}
              <button onClick={close}
                style={{ display: "block", width: "100%", textAlign: "center", marginTop: "1.25rem", background: "none", border: "none", cursor: "pointer", fontSize: "0.73rem", color: "rgba(255,255,255,0.2)", transition: "color 0.15s", letterSpacing: "0.04em", padding: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.2)"}
              >
                Continuer sans compte →
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
