"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, ArrowLeft, Zap, UserCheck, TrendingUp, ShieldCheck } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;
const GOALS = ["Perte de gras", "Prise de masse", "Hybride"];

const BENEFITS = [
  { Icon: UserCheck,   label: "Programme sur mesure",      desc: "Adapté à ton profil, ton niveau et tes objectifs précis." },
  { Icon: TrendingUp,  label: "Suivi & ajustements",       desc: "Paul suit ta progression et adapte le programme chaque semaine." },
  { Icon: ShieldCheck, label: "Espace client dédié",       desc: "Programme, diète et stats — tout centralisé dans un seul endroit." },
];

function genId() { return Math.random().toString(36).slice(2, 10); }

export default function SignupPage() {
  const [form, setForm]     = useState({ firstName: "", lastName: "", email: "", phone: "", goal: "" });
  const [done, setDone]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  function set(k: keyof typeof form, v: string) { setForm(f => ({ ...f, [k]: v })); setError(""); }

  function inputStyle(name: string): React.CSSProperties {
    return {
      width: "100%",
      background: "rgba(255,255,255,0.05)",
      border: `1px solid ${focused === name ? "rgba(56,189,248,0.5)" : "rgba(255,255,255,0.1)"}`,
      boxShadow: focused === name ? "0 0 0 3px rgba(56,189,248,0.08)" : "none",
      borderRadius: "0.7rem",
      padding: "0.82rem 1rem",
      color: "#ffffff",
      fontSize: "0.95rem",
      outline: "none",
      transition: "border-color 0.15s, box-shadow 0.15s",
    };
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim()) { setError("Prénom et email obligatoires."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Adresse email invalide."); return; }
    setLoading(true);
    setTimeout(() => {
      try {
        const prospects = JSON.parse(localStorage.getItem("bp_prospects") || "[]");
        const already = prospects.find((p: { email: string }) => p.email.toLowerCase() === form.email.toLowerCase());
        const userData = { firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim().toLowerCase(), goal: form.goal };
        if (!already) {
          prospects.push({ id: genId(), ...userData, phone: form.phone.trim(), status: "email", createdAt: new Date().toISOString() });
          localStorage.setItem("bp_prospects", JSON.stringify(prospects));
        }
        localStorage.setItem("bp_current_user", JSON.stringify(userData));
        setDone(true);
      } catch { setError("Une erreur est survenue."); }
      setLoading(false);
    }, 700);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #070c16 0%, #0a1424 60%, #070c16 100%)" }}>

      {/* Ambient glows */}
      <div aria-hidden style={{ position: "fixed", top: "10%", left: "5%", width: 520, height: 420, background: "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 65%)", filter: "blur(55px)", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden style={{ position: "fixed", bottom: "10%", right: "5%", width: 460, height: 360, background: "radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 65%)", filter: "blur(55px)", pointerEvents: "none", zIndex: 0 }} />

      <div className="lg:flex" style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>

        {/* ── Left panel (desktop only) ── */}
        <div className="hidden lg:flex" style={{ width: "44%", flexShrink: 0, flexDirection: "column", justifyContent: "space-between", padding: "3rem 4rem", borderRight: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>

          {/* Grid lines */}
          <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(ellipse 90% 80% at 25% 50%, black 20%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 25% 50%, black 20%, transparent 100%)", pointerEvents: "none" }} />

          {/* Logo */}
          <Link href="/" style={{ display: "inline-flex", textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.3rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffffff" }}>
              BP<span style={{ color: "#38bdf8", textShadow: "0 0 18px rgba(56,189,248,0.6)" }}>Perform</span>
            </span>
          </Link>

          {/* Pitch */}
          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "1.25rem" }}>Coaching sur mesure</p>
            <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(2.2rem, 3vw, 3rem)", textTransform: "uppercase", color: "#ffffff", lineHeight: 1, marginBottom: "1.5rem" }}>
              COMMENCE<br />TA<br /><span style={{ color: "#38bdf8", textShadow: "0 0 28px rgba(56,189,248,0.35)" }}>TRANSFORMATION</span>
            </h2>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.85, marginBottom: "2.75rem", maxWidth: "340px" }}>
              Un programme taillé sur mesure, un suivi hebdomadaire et des résultats visibles — avec Paul à tes côtés à chaque étape.
            </p>

            {/* Benefits */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
              {BENEFITS.map(({ Icon, label, desc }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "0.65rem", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={17} color="#38bdf8" />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.2rem" }}>{label}</p>
                    <p style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.33)", lineHeight: 1.65 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem" }}>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.18)" }}>© 2025 BP Perform — Tous droits réservés</p>
          </div>
        </div>

        {/* ── Right panel: form ── */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 1.5rem", minHeight: "100vh", position: "relative" }}>

          {/* Back link */}
          <Link href="/"
            style={{ position: "absolute", top: "1.5rem", left: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.28)", fontSize: "0.75rem", textDecoration: "none", transition: "color 0.15s", letterSpacing: "0.06em", textTransform: "uppercase" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#38bdf8")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
          >
            <ArrowLeft size={12} /> Retour
          </Link>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easing }}
            style={{ width: "100%", maxWidth: "490px" }}
          >
            {/* Logo — mobile only */}
            <div className="lg:hidden" style={{ textAlign: "center", marginBottom: "2rem" }}>
              <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffffff" }}>
                BP<span style={{ color: "#38bdf8", textShadow: "0 0 20px rgba(56,189,248,0.6)" }}>Perform</span>
              </span>
            </div>

            <div style={{ background: "linear-gradient(145deg, rgba(56,189,248,0.08) 0%, rgba(10,18,32,0.98) 60%)", backdropFilter: "blur(40px)", border: "1px solid rgba(56,189,248,0.18)", borderRadius: "1.5rem", padding: "2.5rem", position: "relative", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
              <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.5), rgba(255,255,255,0.3), rgba(56,189,248,0.5), transparent)" }} />

              <AnimatePresence mode="wait">

                {/* ── Success ── */}
                {done ? (
                  <motion.div key="done"
                    initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: easing }}
                    style={{ textAlign: "center", padding: "2rem 0" }}
                  >
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
                      style={{ display: "inline-flex", width: 76, height: 76, borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "1.5px solid rgba(74,222,128,0.3)", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", boxShadow: "0 0 40px rgba(74,222,128,0.12)" }}
                    >
                      <CheckCircle2 size={34} color="#4ade80" />
                    </motion.div>
                    <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.85rem", textTransform: "uppercase", color: "#ffffff", marginBottom: "0.85rem" }}>C&apos;est parti !</h2>
                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.8, marginBottom: "2rem" }}>
                      Paul a bien reçu ta demande et te contactera très prochainement pour démarrer ton programme sur mesure.
                    </p>
                    <Link href="/"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.75rem", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.22)", borderRadius: "999px", color: "#38bdf8", textDecoration: "none", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.06em", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(56,189,248,0.15)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(56,189,248,0.08)"; }}
                    >
                      <ArrowLeft size={13} /> Retour à l&apos;accueil
                    </Link>
                  </motion.div>

                ) : (

                  /* ── Form ── */
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}>
                    <div style={{ marginBottom: "1.75rem" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "999px", padding: "0.25rem 0.75rem", marginBottom: "0.9rem" }}>
                        <Zap size={11} color="#38bdf8" />
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#38bdf8" }}>Coaching personnalisé</span>
                      </div>
                      <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.75rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1.1, marginBottom: "0.5rem" }}>
                        Commence ton<br />
                        <span style={{ color: "#38bdf8", textShadow: "0 0 24px rgba(56,189,248,0.4)" }}>programme</span>
                      </h1>
                      <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>
                        Remplis ce formulaire et Paul te contactera pour démarrer ton programme sur mesure.
                      </p>
                    </div>

                    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                          <label style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", display: "block", marginBottom: "0.4rem" }}>Prénom *</label>
                          <input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Thomas"
                            style={inputStyle("firstName")} onFocus={() => setFocused("firstName")} onBlur={() => setFocused(null)}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", display: "block", marginBottom: "0.4rem" }}>Nom</label>
                          <input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Dupont"
                            style={inputStyle("lastName")} onFocus={() => setFocused("lastName")} onBlur={() => setFocused(null)}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", display: "block", marginBottom: "0.4rem" }}>Email *</label>
                        <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="thomas@email.com"
                          style={inputStyle("email")} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", display: "block", marginBottom: "0.4rem" }}>Téléphone</label>
                        <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+33 6 00 00 00 00"
                          style={inputStyle("phone")} onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", display: "block", marginBottom: "0.5rem" }}>Objectif principal</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                          {GOALS.map(g => (
                            <motion.button key={g} type="button" onClick={() => set("goal", g)} whileTap={{ scale: 0.95 }}
                              style={{ padding: "0.42rem 0.9rem", borderRadius: "999px", border: `1px solid ${form.goal === g ? "rgba(56,189,248,0.5)" : "rgba(255,255,255,0.1)"}`, background: form.goal === g ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.04)", color: form.goal === g ? "#38bdf8" : "rgba(255,255,255,0.45)", fontSize: "0.8rem", fontWeight: form.goal === g ? 700 : 500, cursor: "pointer", transition: "all 0.15s", boxShadow: form.goal === g ? "0 0 14px rgba(56,189,248,0.15)" : "none" }}
                            >
                              {g}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {error && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          style={{ fontSize: "0.8rem", color: "#f87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "0.55rem", padding: "0.6rem 0.85rem" }}
                        >
                          {error}
                        </motion.p>
                      )}

                      <motion.button type="submit" disabled={loading} whileTap={!loading ? { scale: 0.98 } : {}}
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.95rem", background: loading ? "rgba(56,189,248,0.3)" : "linear-gradient(135deg, #38bdf8, #0ea5e9)", color: "#03090f", fontWeight: 800, fontSize: "0.88rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "none", borderRadius: "0.85rem", cursor: loading ? "not-allowed" : "pointer", marginTop: "0.25rem", boxShadow: loading ? "none" : "0 4px 24px rgba(56,189,248,0.35), inset 0 1px 0 rgba(255,255,255,0.3)", transition: "all 0.2s" }}
                      >
                        {loading ? "Envoi…" : <><span>Envoyer ma demande</span><ArrowRight size={15} /></>}
                      </motion.button>
                    </form>

                    <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "1.75rem 0" }} />
                    <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
                      Déjà client ?{" "}
                      <Link href="/login"
                        style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 600, transition: "opacity 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                      >
                        Se connecter →
                      </Link>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
