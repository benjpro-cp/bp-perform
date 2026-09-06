"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, ArrowRight, Lock } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value.trim().toLowerCase();
    await new Promise((r) => setTimeout(r, 900));
    try {
      const prospects: { email: string; firstName: string; lastName: string; goal: string }[] =
        JSON.parse(localStorage.getItem("bp_prospects") || "[]");
      const user = prospects.find((p) => p.email === email);
      if (user) {
        localStorage.setItem("bp_current_user", JSON.stringify({ firstName: user.firstName, lastName: user.lastName, email: user.email, goal: user.goal }));
      }
    } catch { /* ignore */ }
    setLoading(false);
    window.location.href = "/dashboard";
  }

  function inputStyle(name: string): React.CSSProperties {
    return {
      width: "100%",
      background: "rgba(255,255,255,0.05)",
      border: `1px solid ${focused === name ? "rgba(56,189,248,0.5)" : "rgba(255,255,255,0.1)"}`,
      boxShadow: focused === name ? "0 0 0 3px rgba(56,189,248,0.08)" : "none",
      borderRadius: "0.7rem",
      padding: "0.85rem 1rem",
      color: "#ffffff",
      fontSize: "0.95rem",
      outline: "none",
      transition: "border-color 0.15s, box-shadow 0.15s",
    };
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #070c16 0%, #0a1424 50%, #070c16 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>

      {/* Back */}
      <Link href="/"
        style={{ position: "fixed", top: "1.5rem", left: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.28)", fontSize: "0.78rem", textDecoration: "none", transition: "color 0.15s", letterSpacing: "0.06em", textTransform: "uppercase" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#38bdf8")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
      >
        <ArrowLeft size={13} /> Retour
      </Link>

      {/* Ambient glows */}
      <div aria-hidden style={{ position: "fixed", top: "20%", left: "15%", width: 400, height: 300, background: "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "fixed", bottom: "20%", right: "10%", width: 350, height: 280, background: "radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easing }}
        style={{ width: "100%", maxWidth: "440px" }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffffff" }}>
            BP<span style={{ color: "#38bdf8", textShadow: "0 0 20px rgba(56,189,248,0.6)" }}>Perform</span>
          </span>
        </div>

        {/* Card */}
        <div style={{ background: "linear-gradient(145deg, rgba(56,189,248,0.08) 0%, rgba(10,18,32,0.98) 60%)", backdropFilter: "blur(40px)", border: "1px solid rgba(56,189,248,0.18)", borderRadius: "1.5rem", padding: "2.5rem", position: "relative", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
          <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.5), rgba(255,255,255,0.3), rgba(56,189,248,0.5), transparent)" }} />

          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "999px", padding: "0.25rem 0.75rem", marginBottom: "0.9rem" }}>
              <Lock size={10} color="#38bdf8" />
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#38bdf8" }}>Espace client</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.75rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1.1, marginBottom: "0.5rem" }}>
              Bienvenue<br />
              <span style={{ color: "#38bdf8", textShadow: "0 0 24px rgba(56,189,248,0.4)" }}>de retour</span>
            </h1>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>
              Connecte-toi pour accéder à ton suivi et tes programmes.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", display: "block", marginBottom: "0.4rem" }}>Email</label>
              <input
                required type="email" name="email" placeholder="ton@email.com"
                style={inputStyle("email")}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", display: "block", marginBottom: "0.4rem" }}>Mot de passe</label>
              <div style={{ position: "relative" }}>
                <input
                  required type={showPassword ? "text" : "password"} placeholder="••••••••"
                  style={{ ...inputStyle("password"), paddingRight: "3rem" }}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", transition: "color 0.15s", padding: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.9rem", background: loading ? "rgba(56,189,248,0.3)" : "linear-gradient(135deg, #38bdf8, #0ea5e9)", color: "#03090f", fontWeight: 800, fontSize: "0.88rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "none", borderRadius: "0.85rem", cursor: loading ? "not-allowed" : "pointer", marginTop: "0.25rem", boxShadow: loading ? "none" : "0 4px 24px rgba(56,189,248,0.35), inset 0 1px 0 rgba(255,255,255,0.3)", transition: "all 0.2s" }}
            >
              {loading ? "Connexion…" : <><span>Se connecter</span><ArrowRight size={15} /></>}
            </button>
          </form>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "1.75rem 0" }} />

          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
            Pas encore client ?{" "}
            <Link href="/signup"
              style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 600, transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Rejoindre BP Perform →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
