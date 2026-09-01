"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, ClipboardList } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;
const GOALS = ["Perte de gras", "Prise de masse", "Hybride"];
const LEVELS = ["Débutant (< 1 an)", "Intermédiaire (1–3 ans)", "Avancé (3–5 ans)", "Expert (5+ ans)"];
const AVAILABILITIES = ["2 séances/semaine", "3 séances/semaine", "4 séances/semaine", "5+ séances/semaine"];
function genId() { return Math.random().toString(36).slice(2, 10); }

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", age: "", weight: "", height: "",
    goal: "", level: "", availability: "", motivation: "", injuries: "", message: "",
  });

  function set(k: keyof typeof form, v: string) { setForm(f => ({ ...f, [k]: v })); }

  function submitStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email.trim()) return;
    setStep(2);
  }

  function submitFinal(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      try {
        const prospects = JSON.parse(localStorage.getItem("bp_prospects") || "[]");
        const idx = prospects.findIndex((p: { email: string }) => p.email.toLowerCase() === form.email.toLowerCase());
        const onboardingData = { age: form.age, weight: form.weight, height: form.height, level: form.level, availability: form.availability, motivation: form.motivation, injuries: form.injuries, message: form.message };
        if (idx >= 0) {
          prospects[idx] = { ...prospects[idx], firstName: form.firstName || prospects[idx].firstName, lastName: form.lastName || prospects[idx].lastName, goal: form.goal || prospects[idx].goal, status: "onboarding", onboardingData, updatedAt: new Date().toISOString() };
        } else {
          prospects.push({ id: genId(), firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim().toLowerCase(), goal: form.goal, status: "onboarding", onboardingData, createdAt: new Date().toISOString() });
        }
        localStorage.setItem("bp_prospects", JSON.stringify(prospects));
        setDone(true);
      } catch { /* */ }
      setLoading(false);
    }, 700);
  }

  const inputStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.7rem", padding: "0.75rem 1rem", color: "#ffffff", fontSize: "0.92rem", outline: "none", transition: "border-color 0.15s" };
  const labelStyle: React.CSSProperties = { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: "0.4rem" };
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)"; };
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #070c16 0%, #0a1424 50%, #070c16 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <div aria-hidden style={{ position: "fixed", top: "20%", left: "15%", width: 400, height: 300, background: "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "fixed", bottom: "20%", right: "10%", width: 350, height: 280, background: "radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easing }} style={{ width: "100%", maxWidth: "520px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffffff" }}>
            BP<span style={{ color: "#38bdf8", textShadow: "0 0 20px rgba(56,189,248,0.6)" }}>Perform</span>
          </span>
        </div>

        <div style={{ background: "linear-gradient(145deg, rgba(56,189,248,0.08) 0%, rgba(10,18,32,0.98) 60%)", backdropFilter: "blur(40px)", border: "1px solid rgba(56,189,248,0.18)", borderRadius: "1.5rem", padding: "2.5rem", position: "relative", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
          <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.5), rgba(255,255,255,0.3), rgba(56,189,248,0.5), transparent)" }} />

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: easing }} style={{ textAlign: "center", padding: "1rem 0" }}>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
                  style={{ display: "inline-flex", width: 72, height: 72, borderRadius: "50%", background: "rgba(74,222,128,0.12)", border: "1.5px solid rgba(74,222,128,0.3)", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}
                >
                  <CheckCircle2 size={32} color="#4ade80" />
                </motion.div>
                <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.7rem", textTransform: "uppercase", color: "#ffffff", marginBottom: "0.75rem" }}>Onboarding complété !</h2>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>Baptiste a reçu toutes tes informations. Il va construire ton programme personnalisé et te revenir très prochainement.</p>
              </motion.div>

            ) : step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: easing }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "9px", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ClipboardList size={17} color="#38bdf8" />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Étape 1 / 2</p>
                    <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.2rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>Identification</h2>
                  </div>
                </div>
                <form onSubmit={submitStep1} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="ton@email.com" required style={inputStyle} onFocus={focus} onBlur={blur} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div><label style={labelStyle}>Prénom</label><input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Thomas" style={inputStyle} onFocus={focus} onBlur={blur} /></div>
                    <div><label style={labelStyle}>Nom</label><input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Dupont" style={inputStyle} onFocus={focus} onBlur={blur} /></div>
                  </div>
                  <button type="submit" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.85rem", background: "linear-gradient(135deg, #38bdf8, #0ea5e9)", color: "#03090f", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "none", borderRadius: "0.85rem", cursor: "pointer", marginTop: "0.25rem", boxShadow: "0 4px 20px rgba(56,189,248,0.35), inset 0 1px 0 rgba(255,255,255,0.3)" }}>
                    Continuer <ArrowRight size={14} />
                  </button>
                </form>
              </motion.div>

            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: easing }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "9px", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ClipboardList size={17} color="#38bdf8" />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Étape 2 / 2</p>
                    <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.2rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>Ton profil</h2>
                  </div>
                </div>
                <form onSubmit={submitFinal} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Body stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.65rem" }}>
                    <div><label style={labelStyle}>Âge</label><input type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder="25" style={inputStyle} onFocus={focus} onBlur={blur} /></div>
                    <div><label style={labelStyle}>Poids (kg)</label><input type="number" value={form.weight} onChange={e => set("weight", e.target.value)} placeholder="75" style={inputStyle} onFocus={focus} onBlur={blur} /></div>
                    <div><label style={labelStyle}>Taille (cm)</label><input type="number" value={form.height} onChange={e => set("height", e.target.value)} placeholder="178" style={inputStyle} onFocus={focus} onBlur={blur} /></div>
                  </div>

                  {/* Goal */}
                  <div>
                    <label style={labelStyle}>Objectif principal</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {GOALS.map(g => (
                        <button key={g} type="button" onClick={() => set("goal", g)} style={{ padding: "0.35rem 0.8rem", borderRadius: "999px", border: `1px solid ${form.goal === g ? "rgba(56,189,248,0.5)" : "rgba(255,255,255,0.1)"}`, background: form.goal === g ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.04)", color: form.goal === g ? "#38bdf8" : "rgba(255,255,255,0.45)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level */}
                  <div>
                    <label style={labelStyle}>Niveau / Expérience</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      {LEVELS.map(l => (
                        <button key={l} type="button" onClick={() => set("level", l)} style={{ textAlign: "left", padding: "0.55rem 0.9rem", borderRadius: "0.6rem", border: `1px solid ${form.level === l ? "rgba(56,189,248,0.4)" : "rgba(255,255,255,0.08)"}`, background: form.level === l ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.03)", color: form.level === l ? "#38bdf8" : "rgba(255,255,255,0.45)", fontSize: "0.83rem", cursor: "pointer", transition: "all 0.15s" }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <label style={labelStyle}>Disponibilités</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {AVAILABILITIES.map(a => (
                        <button key={a} type="button" onClick={() => set("availability", a)} style={{ padding: "0.35rem 0.8rem", borderRadius: "999px", border: `1px solid ${form.availability === a ? "rgba(74,222,128,0.45)" : "rgba(255,255,255,0.1)"}`, background: form.availability === a ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.04)", color: form.availability === a ? "#4ade80" : "rgba(255,255,255,0.45)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Injuries */}
                  <div>
                    <label style={labelStyle}>Blessures / Contre-indications</label>
                    <input value={form.injuries} onChange={e => set("injuries", e.target.value)} placeholder="Aucune / Genou, épaule droite…" style={inputStyle} onFocus={focus} onBlur={blur} />
                  </div>

                  {/* Message */}
                  <div>
                    <label style={labelStyle}>Message pour Baptiste</label>
                    <textarea value={form.message} onChange={e => set("message", e.target.value)} placeholder="Motivations, attentes, questions…" rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} onFocus={focus} onBlur={blur} />
                  </div>

                  <div style={{ display: "flex", gap: "0.65rem", marginTop: "0.25rem" }}>
                    <button type="button" onClick={() => setStep(1)} style={{ padding: "0.85rem 1.25rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.85rem", color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", cursor: "pointer" }}>
                      ← Retour
                    </button>
                    <button type="submit" disabled={loading} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.85rem", background: loading ? "rgba(56,189,248,0.3)" : "linear-gradient(135deg, #38bdf8, #0ea5e9)", color: "#03090f", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "none", borderRadius: "0.85rem", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 20px rgba(56,189,248,0.35), inset 0 1px 0 rgba(255,255,255,0.3)" }}>
                      {loading ? "Envoi…" : <>{`Envoyer mon profil`} <ArrowRight size={14} /></>}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
