"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Phone, CheckCircle2, Calendar } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;
const G = "#fbbf24";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven"];
const SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

// Pseudo-random availability — some slots are taken
function isAvailable(weekOffset: number, dayIdx: number, slot: string) {
  const seed = weekOffset * 35 + dayIdx * 7 + SLOTS.indexOf(slot);
  return (seed * 2654435761) % 4 !== 0; // ~75% available
}

function getWeekDates(weekOffset: number) {
  const today = new Date();
  const monday = new Date(today);
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(today.getDate() + diff + weekOffset * 7);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function RendezVousPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState<{ date: Date; slot: string } | null>(null);
  const [step, setStep] = useState<"pick" | "confirm" | "done">("pick");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthLabel = useMemo(() => {
    const months = [...new Set(weekDates.map(d => MONTHS[d.getMonth()]))];
    return months.join(" / ") + " " + weekDates[0].getFullYear();
  }, [weekDates]);

  function inputStyle(name: string): React.CSSProperties {
    return {
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${focused === name ? `${G}55` : "rgba(255,255,255,0.1)"}`,
      boxShadow: focused === name ? `0 0 0 3px ${G}10` : "none",
      borderRadius: "0.65rem",
      padding: "0.8rem 1rem",
      color: "#ffffff",
      fontSize: "0.9rem",
      outline: "none",
      transition: "border-color 0.15s, box-shadow 0.15s",
    };
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    try {
      const rdvs = JSON.parse(localStorage.getItem("bp_rendez_vous") || "[]");
      rdvs.push({ name, phone, date: selected?.date.toISOString(), slot: selected?.slot, createdAt: new Date().toISOString() });
      localStorage.setItem("bp_rendez_vous", JSON.stringify(rdvs));
    } catch { /* ignore */ }
    setLoading(false);
    setStep("done");
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #060b14 0%, #08091c 50%, #060b14 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", position: "relative", overflow: "hidden" }}>

      {/* Glows */}
      <div aria-hidden style={{ position: "fixed", top: "10%", left: "5%", width: "45vw", height: "50vh", background: `radial-gradient(ellipse, ${G}09 0%, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "fixed", bottom: "10%", right: "5%", width: "40vw", height: "45vh", background: `radial-gradient(ellipse, ${G}06 0%, transparent 65%)`, filter: "blur(70px)", pointerEvents: "none" }} />

      {/* Back */}
      <Link href="/#coaches" style={{ position: "fixed", top: "1.5rem", left: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.28)", fontSize: "0.75rem", textDecoration: "none", transition: "color 0.15s", letterSpacing: "0.06em", textTransform: "uppercase" }}
        onMouseEnter={e => (e.currentTarget.style.color = G)}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
      >
        <ArrowLeft size={13} /> Retour
      </Link>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.4rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffffff" }}>
          BP<span style={{ color: "#38bdf8", textShadow: "0 0 20px rgba(56,189,248,0.6)" }}>Perform</span>
        </span>
      </div>

      <AnimatePresence mode="wait">

        {/* ── STEP: PICK ── */}
        {step === "pick" && (
          <motion.div
            key="pick"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: easing }}
            style={{ width: "100%", maxWidth: "780px" }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", background: `${G}10`, border: `1px solid ${G}30`, borderRadius: "999px", padding: "0.28rem 0.9rem", marginBottom: "1rem" }}>
                <Phone size={11} color={G} />
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: G }}>Appel découverte — 20 min</span>
              </div>
              <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", textTransform: "uppercase", color: "#ffffff", lineHeight: 1.05, marginBottom: "0.6rem" }}>
                Choisissez votre{" "}
                <span style={{ color: G, textShadow: `0 0 30px ${G}50` }}>créneau</span>
              </h1>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>
                On fait le point sur votre activité et on vous explique comment fonctionne la plateforme.
              </p>
            </div>

            {/* Calendar card */}
            <div style={{
              background: `linear-gradient(145deg, ${G}0a 0%, rgba(6,11,20,0.98) 50%)`,
              backdropFilter: "blur(40px) saturate(160%)",
              WebkitBackdropFilter: "blur(40px) saturate(160%)",
              border: `1px solid ${G}20`,
              borderRadius: "1.75rem",
              overflow: "hidden",
              boxShadow: `0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 ${G}18`,
              position: "relative",
            }}>
              <div aria-hidden style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: "1px", background: `linear-gradient(to right, transparent, ${G}55, rgba(255,255,255,0.25), ${G}55, transparent)`, pointerEvents: "none" }} />

              {/* Week nav */}
              <div style={{ padding: "1.5rem 1.75rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <button
                  onClick={() => weekOffset > 0 && setWeekOffset(w => w - 1)}
                  disabled={weekOffset === 0}
                  style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: weekOffset === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)", cursor: weekOffset === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                >
                  <ChevronLeft size={16} />
                </button>

                <div style={{ textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                    <Calendar size={13} color={G} />
                    <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#ffffff" }}>
                      {monthLabel}
                    </span>
                  </div>
                  {weekOffset === 0 && (
                    <span style={{ fontSize: "0.68rem", color: `${G}90`, fontWeight: 600, letterSpacing: "0.08em" }}>Semaine actuelle</span>
                  )}
                </div>

                <button
                  onClick={() => weekOffset < 4 && setWeekOffset(w => w + 1)}
                  disabled={weekOffset >= 4}
                  style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: weekOffset >= 4 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)", cursor: weekOffset >= 4 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Grid */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 64, padding: "1rem 0.75rem", textAlign: "left" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <Clock size={12} color="rgba(255,255,255,0.25)" />
                          <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Heure</span>
                        </div>
                      </th>
                      {weekDates.map((date, i) => {
                        const isPast = date < today;
                        const isToday = date.toDateString() === new Date().toDateString();
                        return (
                          <th key={i} style={{ padding: "1rem 0.5rem", textAlign: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }}>
                              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: isPast ? "rgba(255,255,255,0.2)" : isToday ? G : "rgba(255,255,255,0.45)" }}>{DAYS[i]}</span>
                              <div style={{
                                width: 32, height: 32, borderRadius: "50%",
                                background: isToday ? `${G}20` : "transparent",
                                border: isToday ? `1px solid ${G}50` : "1px solid transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <span style={{ fontSize: "0.85rem", fontWeight: isToday ? 700 : 500, color: isPast ? "rgba(255,255,255,0.2)" : isToday ? G : "rgba(255,255,255,0.75)" }}>
                                  {date.getDate()}
                                </span>
                              </div>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {SLOTS.map((slot) => (
                      <tr key={slot} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "0.6rem 0.75rem" }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{slot}</span>
                        </td>
                        {weekDates.map((date, di) => {
                          const isPast = date < today || (date.toDateString() === new Date().toDateString() && parseInt(slot) <= new Date().getHours());
                          const avail = !isPast && isAvailable(weekOffset, di, slot);
                          const isSel = selected?.date.toDateString() === date.toDateString() && selected?.slot === slot;
                          return (
                            <td key={di} style={{ padding: "0.4rem 0.5rem", textAlign: "center" }}>
                              {avail ? (
                                <button
                                  onClick={() => setSelected({ date, slot })}
                                  style={{
                                    width: "100%", minWidth: 52, padding: "0.42rem 0.3rem",
                                    borderRadius: "0.55rem",
                                    background: isSel ? `linear-gradient(135deg, ${G}, #f59e0b)` : `${G}12`,
                                    border: `1px solid ${isSel ? "transparent" : `${G}28`}`,
                                    color: isSel ? "#1a0800" : G,
                                    fontSize: "0.74rem", fontWeight: 700,
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                    boxShadow: isSel ? `0 2px 12px ${G}45` : "none",
                                  }}
                                  onMouseEnter={(e) => { if (!isSel) { const el = e.currentTarget as HTMLElement; el.style.background = `${G}22`; el.style.borderColor = `${G}45`; } }}
                                  onMouseLeave={(e) => { if (!isSel) { const el = e.currentTarget as HTMLElement; el.style.background = `${G}12`; el.style.borderColor = `${G}28`; } }}
                                >
                                  {slot}
                                </button>
                              ) : (
                                <div style={{ width: "100%", minWidth: 52, padding: "0.42rem 0", textAlign: "center" }}>
                                  <span style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.1)" }}>—</span>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend + CTA */}
              <div style={{ padding: "1.25rem 1.75rem 1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "3px", background: `${G}30`, border: `1px solid ${G}40` }} />
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>Disponible</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "3px", background: `linear-gradient(135deg, ${G}, #f59e0b)` }} />
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>Sélectionné</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.15)" }}>—</span>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>Indisponible</span>
                  </div>
                </div>

                <button
                  onClick={() => selected && setStep("confirm")}
                  disabled={!selected}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.75rem 1.75rem",
                    background: selected ? `linear-gradient(135deg, ${G}, #f59e0b)` : "rgba(255,255,255,0.06)",
                    color: selected ? "#1a0800" : "rgba(255,255,255,0.2)",
                    fontWeight: 800, fontSize: "0.8rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    border: "none", borderRadius: "999px",
                    cursor: selected ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    boxShadow: selected ? `0 4px 24px ${G}45, inset 0 1px 0 rgba(255,255,255,0.3)` : "none",
                  }}
                >
                  Confirmer ce créneau <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP: CONFIRM ── */}
        {step === "confirm" && selected && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: easing }}
            style={{ width: "100%", maxWidth: "480px" }}
          >
            <div style={{
              background: `linear-gradient(145deg, ${G}0e 0%, rgba(6,11,20,0.98) 50%)`,
              backdropFilter: "blur(40px) saturate(160%)",
              WebkitBackdropFilter: "blur(40px) saturate(160%)",
              border: `1px solid ${G}25`,
              borderRadius: "1.75rem",
              padding: "2.5rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: `0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 ${G}22`,
            }}>
              <div aria-hidden style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: "1px", background: `linear-gradient(to right, transparent, ${G}60, rgba(255,255,255,0.3), ${G}60, transparent)`, pointerEvents: "none" }} />

              {/* Selected slot recap */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: `${G}0d`, border: `1px solid ${G}28`, borderRadius: "1rem", padding: "1rem 1.25rem", marginBottom: "1.75rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${G}18`, border: `1px solid ${G}35`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Calendar size={18} color={G} />
                </div>
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>
                    {selected.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: G, marginTop: "0.2rem", fontWeight: 600 }}>
                    {selected.slot} · Appel découverte 20 min
                  </p>
                </div>
                <button
                  onClick={() => setStep("pick")}
                  style={{ marginLeft: "auto", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}
                >
                  Modifier
                </button>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.5rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1.1, marginBottom: "0.4rem" }}>
                  Vos coordonnées
                </h2>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
                  Pour confirmer et vous envoyer le lien d'appel.
                </p>
              </div>

              <form onSubmit={handleConfirm} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                <div>
                  <label style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "0.38rem" }}>Nom complet</label>
                  <input
                    required type="text" placeholder="Prénom Nom"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={inputStyle("name")}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "0.38rem" }}>Numéro de téléphone</label>
                  <input
                    required type="tel" placeholder="+33 6 00 00 00 00"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={inputStyle("phone")}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    padding: "1rem",
                    background: loading ? `${G}35` : `linear-gradient(135deg, ${G}, #f59e0b)`,
                    color: "#1a0800", fontWeight: 900, fontSize: "0.84rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    border: "none", borderRadius: "1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    marginTop: "0.35rem",
                    boxShadow: loading ? "none" : `0 4px 28px ${G}50, inset 0 1px 0 rgba(255,255,255,0.3)`,
                    transition: "all 0.2s",
                  }}
                >
                  {loading ? "Confirmation…" : "Valider ma réservation"}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* ── STEP: DONE ── */}
        {step === "done" && selected && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easing }}
            style={{ width: "100%", maxWidth: "440px", textAlign: "center" }}
          >
            <div style={{
              background: `linear-gradient(145deg, ${G}0e 0%, rgba(6,11,20,0.98) 50%)`,
              backdropFilter: "blur(40px) saturate(160%)",
              WebkitBackdropFilter: "blur(40px) saturate(160%)",
              border: `1px solid ${G}25`,
              borderRadius: "1.75rem",
              padding: "3rem 2.5rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: `0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 ${G}22`,
            }}>
              <div aria-hidden style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: "1px", background: `linear-gradient(to right, transparent, ${G}60, rgba(255,255,255,0.3), ${G}60, transparent)`, pointerEvents: "none" }} />
              <div aria-hidden style={{ position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)", width: "240px", height: "180px", background: `radial-gradient(ellipse, ${G}18 0%, transparent 65%)`, filter: "blur(35px)", pointerEvents: "none" }} />

              <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${G}18`, border: `1.5px solid ${G}45`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", boxShadow: `0 0 32px ${G}30` }}>
                <CheckCircle2 size={28} color={G} />
              </div>

              <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.75rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1.1, marginBottom: "0.65rem" }}>
                Appel confirmé !
              </h2>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                Votre rendez-vous du{" "}
                <strong style={{ color: G }}>
                  {selected.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {selected.slot}
                </strong>{" "}
                est enregistré. Vous recevrez une confirmation par SMS.
              </p>

              <Link
                href="/"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 2rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "999px", color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.18s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.1)"; el.style.color = "#ffffff"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.06)"; el.style.color = "rgba(255,255,255,0.6)"; }}
              >
                <ArrowLeft size={13} /> Retour à l&apos;accueil
              </Link>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
