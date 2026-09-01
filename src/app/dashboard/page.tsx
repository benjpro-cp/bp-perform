"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, TrendingUp, Calendar, ArrowRight, MessageCircle, CheckCircle2, Circle, Flame, Clock, Zap, CheckCheck } from "lucide-react";
import { HoverSpotlight } from "@/components/HoverSpotlight";

const easing = [0.22, 1, 0.36, 1] as const;

/* ── Shared liquid-glass style ── */
const glass = (accent?: string): React.CSSProperties => ({
  background: accent
    ? `linear-gradient(135deg, ${accent}0a 0%, rgba(255,255,255,0.04) 100%)`
    : "rgba(255,255,255,0.05)",
  backdropFilter: "blur(32px) saturate(180%)",
  WebkitBackdropFilter: "blur(32px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: [
    "inset 0 1px 0 rgba(255,255,255,0.18)",
    "inset 0 -1px 0 rgba(255,255,255,0.04)",
    "inset 1px 0 0 rgba(255,255,255,0.08)",
    "inset -1px 0 0 rgba(255,255,255,0.08)",
    "0 8px 40px rgba(0,0,0,0.28)",
    "0 2px 8px rgba(0,0,0,0.18)",
  ].join(", "),
});

const glassAccent = (color: string): React.CSSProperties => ({
  ...glass(),
  border: `1px solid ${color}28`,
  boxShadow: [
    "inset 0 1px 0 rgba(255,255,255,0.18)",
    "inset 0 -1px 0 rgba(255,255,255,0.04)",
    `inset 1px 0 0 ${color}12`,
    `inset -1px 0 0 ${color}08`,
    `0 8px 40px ${color}12`,
    "0 2px 8px rgba(0,0,0,0.22)",
  ].join(", "),
});

const mockClient = { name: "Thomas", program: "Hypertrophie Intermédiaire", coach: "Baptiste P.", startDate: "11 Août 2025" };

const todaySession = {
  type: "Push",
  label: "Pecs · Épaules · Triceps",
  day: "Lundi",
  duration: "~55 min",
  exercises: [
    { name: "Développé couché incliné", sets: "4", reps: "8-10", rest: "2 min" },
    { name: "Chest Press", sets: "3", reps: "10-12", rest: "90 s" },
    { name: "Développé militaire", sets: "4", reps: "8-10", rest: "2 min" },
    { name: "Élévations latérales", sets: "4", reps: "12-15", rest: "60 s" },
    { name: "Dips", sets: "3", reps: "10-12", rest: "90 s" },
    { name: "Tirage à la corde", sets: "3", reps: "12-15", rest: "60 s" },
  ],
};

const checklist = [
  { label: "Programme personnalisé créé", done: true },
  { label: "Première séance complétée", done: false },
  { label: "Premier pesage enregistré", done: false },
  { label: "Message de bienvenue lu", done: false },
];

type StatItem = { label: string; value: string; unit: string; sub: string; icon: React.ComponentType<{ size?: number; color?: string }>; color: string };

function StatCard({ s, i }: { s: StatItem; i: number }) {
  const Icon = s.icon;
  return (
    <motion.div
      key={s.label}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easing, delay: 0.1 + i * 0.07 }}
    >
      <HoverSpotlight
        color={s.color}
        style={{
          borderRadius: "1.25rem",
          padding: "1.35rem 1.25rem",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(145deg, ${s.color}14 0%, rgba(255,255,255,0.04) 55%, ${s.color}08 100%)`,
          backdropFilter: "blur(32px) saturate(200%)",
          WebkitBackdropFilter: "blur(32px) saturate(200%)",
          border: `1px solid ${s.color}38`,
          boxShadow: [
            `inset 0 1px 0 ${s.color}30`,
            "inset 0 -1px 0 rgba(255,255,255,0.04)",
            `inset 1px 0 0 ${s.color}14`,
            `inset -1px 0 0 ${s.color}08`,
            `0 8px 32px ${s.color}18`,
            "0 2px 8px rgba(0,0,0,0.25)",
          ].join(", "),
        }}
      >
        {/* Top specular — bright colored line */}
        <div aria-hidden style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
          background: `linear-gradient(to right, transparent, ${s.color}80, rgba(255,255,255,0.6), ${s.color}80, transparent)`,
          pointerEvents: "none",
        }} />
        {/* Top-center light pool */}
        <div aria-hidden style={{
          position: "absolute", top: "-60%", left: "50%", transform: "translateX(-50%)",
          width: "120px", height: "100px", pointerEvents: "none",
          background: `radial-gradient(ellipse, ${s.color}28 0%, transparent 70%)`,
          filter: "blur(18px)",
        }} />
        {/* Bottom-right corner glow */}
        <div aria-hidden style={{
          position: "absolute", bottom: "-30px", right: "-30px",
          width: "120px", height: "120px", pointerEvents: "none",
          background: `radial-gradient(ellipse, ${s.color}30 0%, transparent 65%)`,
          filter: "blur(20px)",
        }} />
        {/* Large watermark icon */}
        <div aria-hidden style={{ position: "absolute", bottom: "-0.75rem", right: "-0.5rem", opacity: 0.1 }}>
          <Icon size={72} color={s.color} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.9rem" }}>
          <div style={{
            width: "26px", height: "26px", borderRadius: "7px",
            background: `${s.color}22`,
            border: `1px solid ${s.color}50`,
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 10px ${s.color}30, inset 0 1px 0 rgba(255,255,255,0.25)`,
          }}>
            <Icon size={12} color={s.color} />
          </div>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
            {s.label}
          </span>
        </div>
        <p style={{
          fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "2.2rem",
          color: s.color,
          lineHeight: 1, marginBottom: "0.25rem",
          textShadow: `0 0 20px ${s.color}70, 0 0 40px ${s.color}30`,
        }}>
          {s.value}<span style={{ fontSize: "1.05rem", color: `${s.color}70`, marginLeft: "2px", fontWeight: 400 }}>{s.unit}</span>
        </p>
        <p style={{ fontSize: "0.72rem", color: s.color, opacity: 0.75, letterSpacing: "0.04em" }}>{s.sub}</p>
      </HoverSpotlight>
    </motion.div>
  );
}

// Returns the Monday of the week containing the given ISO date string
function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function loadDates(): string[] {
  try { return JSON.parse(localStorage.getItem("bp_sessions_dates") || "[]"); }
  catch { return []; }
}

export default function DashboardPage() {
  const { isMobile } = useBreakpoint();
  const [totalSeances, setTotalSeances] = useState(0);
  const [seancesWeek, setSeancesWeek] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const doneCount = checklist.filter(c => c.done).length;

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const lastSession = localStorage.getItem("bp_lastSession");
    const savedStreak = parseInt(localStorage.getItem("bp_streak") || "0", 10);
    let savedTotal = parseInt(localStorage.getItem("bp_total_seances") || "0", 10);
    let dates = loadDates();

    // Migration: ancienne version ne sauvegardait pas bp_total_seances ni bp_sessions_dates
    if (savedTotal === 0 && lastSession) {
      savedTotal = Math.max(savedStreak, 1);
      if (!dates.includes(lastSession)) dates.push(lastSession);
      localStorage.setItem("bp_total_seances", String(savedTotal));
      localStorage.setItem("bp_sessions_dates", JSON.stringify(dates));
    }

    const weekStart = getWeekStart(today);
    const weekCount = dates.filter(d => d >= weekStart && d <= today).length;

    setTotalSeances(savedTotal);
    setSeancesWeek(weekCount);

    if (lastSession === today) {
      setSessionDone(true);
      setStreak(savedStreak);
    } else if (lastSession) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
      if (lastSession === yesterdayStr) {
        setStreak(savedStreak);
      } else {
        setStreak(0);
        localStorage.setItem("bp_streak", "0");
      }
    }
  }, []);

  function handleSessionDone() {
    if (sessionDone) return;
    const today = new Date().toISOString().slice(0, 10);
    const lastSession = localStorage.getItem("bp_lastSession");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const newStreak = lastSession === yesterdayStr ? streak + 1 : 1;
    const newTotal = totalSeances + 1;

    // Persist the date
    const dates = loadDates();
    if (!dates.includes(today)) dates.push(today);
    const weekStart = getWeekStart(today);
    const newWeekCount = dates.filter(d => d >= weekStart && d <= today).length;

    setTotalSeances(newTotal);
    setSeancesWeek(newWeekCount);
    setStreak(newStreak);
    setSessionDone(true);

    localStorage.setItem("bp_total_seances", String(newTotal));
    localStorage.setItem("bp_streak", String(newStreak));
    localStorage.setItem("bp_lastSession", today);
    localStorage.setItem("bp_sessions_dates", JSON.stringify(dates));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* ── Hero greeting ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easing }}
      >
        <HoverSpotlight
          color="#38bdf8"
          style={{
            ...glassAccent("#38bdf8"),
            borderRadius: "1.5rem",
            padding: "2.25rem 2.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Specular sweep */}
          <div aria-hidden style={{
            position: "absolute", top: 0, left: "-20%", right: "-20%", height: "1px",
            background: "linear-gradient(to right, transparent 10%, rgba(255,255,255,0.22) 50%, transparent 90%)",
            pointerEvents: "none",
          }} />
          {/* Inner glow */}
          <div aria-hidden style={{
            position: "absolute", top: "-60%", right: "10%",
            width: "420px", height: "320px", pointerEvents: "none",
            background: "radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 65%)",
            filter: "blur(50px)",
          }} />
          {/* Watermark */}
          <div aria-hidden style={{
            position: "absolute", right: "-0.5rem", top: "50%", transform: "translateY(-50%)",
            fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "8rem", lineHeight: 1,
            color: "rgba(56,189,248,0.05)", userSelect: "none", pointerEvents: "none",
            letterSpacing: "-0.02em",
          }}>
            DAY 01
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.9rem" }}>
              <span style={{
                fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                color: "#38bdf8",
                background: "rgba(56,189,248,0.1)",
                border: "1px solid rgba(56,189,248,0.22)",
                borderRadius: "999px", padding: "0.22rem 0.75rem",
                backdropFilter: "blur(8px)",
              }}>
                Semaine 1 · Jour 1
              </span>
              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.22)", letterSpacing: "0.06em" }}>
                Démarré le {mockClient.startDate}
              </span>
            </div>

            <h1 style={{
              fontFamily: "var(--font-oswald)", fontWeight: 700,
              fontSize: "clamp(2.2rem, 4vw, 3.2rem)", textTransform: "uppercase",
              letterSpacing: "-0.01em", lineHeight: 1, color: "#ffffff", marginBottom: "0.65rem",
            }}>
              BIENVENUE,{" "}
              <span style={{ color: "#38bdf8", textShadow: "0 0 50px rgba(56,189,248,0.5)" }}>
                {mockClient.name.toUpperCase()}
              </span>
            </h1>

            <p style={{ fontSize: "0.93rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.6, maxWidth: "34rem" }}>
              Ton programme <span style={{ color: "rgba(255,255,255,0.7)" }}>{mockClient.program}</span> est prêt.
              Suivi par <span style={{ color: "rgba(255,255,255,0.7)" }}>{mockClient.coach}</span>. Ta première séance t'attend.
            </p>
          </div>
        </HoverSpotlight>
      </motion.div>

      {/* ── Stats ── */}
      <div id="tour-dash-stats" style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "0.85rem" }}>
        {[
          { label: "Séances", value: String(totalSeances), unit: "", sub: seancesWeek === 0 ? "Lance-toi !" : seancesWeek === 1 ? "1 cette semaine" : `${seancesWeek} cette semaine`, icon: Dumbbell, color: "#38bdf8" },
          { label: "Poids", value: "—", unit: "kg", sub: "À enregistrer", icon: TrendingUp, color: "#a78bfa" },
          { label: "Programme", value: "S1", unit: "/12", sub: "En cours", icon: Calendar, color: "#4ade80" },
          { label: "Streak", value: String(streak), unit: "j", sub: streak === 0 ? "Lance-toi !" : streak === 1 ? "1 jour d'affilée" : `${streak} jours d'affilée`, icon: Flame, color: "#fb923c" },
        ].map((s, i) => (
          <StatCard key={s.label} s={s} i={i} />
        ))}
      </div>

      {/* ── Main grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: "1.25rem", alignItems: "flex-start" }}>

        {/* Today's session */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easing, delay: 0.25 }}
        >
        <HoverSpotlight
          color="#38bdf8"
          style={{
            ...glassAccent("#38bdf8"),
            borderRadius: "1.5rem",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Top accent line */}
          <div style={{ height: "2px", background: "linear-gradient(to right, transparent 5%, #38bdf8 35%, #38bdf8 65%, transparent 95%)", opacity: 0.7 }} />
          {/* Specular */}
          <div aria-hidden style={{
            position: "absolute", top: "2px", left: 0, right: 0, height: "1px",
            background: "linear-gradient(to right, transparent 5%, rgba(255,255,255,0.14) 35%, rgba(255,255,255,0.14) 65%, transparent 95%)",
            pointerEvents: "none",
          }} />

          {/* Session header */}
          <div style={{ padding: "1.6rem 1.75rem 1.25rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.75rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#38bdf8", display: "block", boxShadow: "0 0 10px #38bdf8, 0 0 20px rgba(56,189,248,0.5)" }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#38bdf8" }}>
                  Séance du jour
                </span>
              </div>
              <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "2rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "#ffffff", lineHeight: 1, marginBottom: "0.3rem" }}>
                {todaySession.type}
              </h2>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.32)" }}>{todaySession.label}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.65rem" }}>
              <div style={{ display: "flex", gap: "0.65rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Clock size={11} color="rgba(255,255,255,0.28)" />
                  <span style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.3)" }}>{todaySession.duration}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Zap size={11} color="rgba(255,255,255,0.28)" />
                  <span style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.3)" }}>{todaySession.exercises.length} exercices</span>
                </div>
              </div>
              <Link
                href="/dashboard/programme"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
                  color: "#03090f", fontWeight: 800, fontSize: "0.74rem",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  padding: "0.6rem 1.25rem", borderRadius: "999px", textDecoration: "none",
                  boxShadow: "0 0 0 1px rgba(56,189,248,0.4), 0 4px 20px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
                  transition: "all 0.18s ease",
                }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 0 0 1px rgba(56,189,248,0.6), 0 8px 28px rgba(56,189,248,0.55), inset 0 1px 0 rgba(255,255,255,0.3)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = "0 0 0 1px rgba(56,189,248,0.4), 0 4px 20px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.3)"; }}
              >
                Voir le programme <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 1.75rem" }} />

          {/* Exercises */}
          <div style={{ padding: "0.5rem 1.75rem 0" }}>
            {todaySession.exercises.map((ex, i) => (
              <div key={ex.name} style={{
                display: "grid", gridTemplateColumns: "1.5rem 1fr 60px 70px 55px",
                alignItems: "center", gap: "1rem",
                padding: "0.8rem 0",
                borderBottom: i < todaySession.exercises.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.8rem", color: "rgba(56,189,248,0.4)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p style={{ fontSize: "0.93rem", color: "rgba(255,255,255,0.72)", fontWeight: 500 }}>{ex.name}</p>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1rem", color: "#ffffff" }}>{ex.sets}</span>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.28)", marginLeft: "2px" }}>séries</span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.4)" }}>{ex.reps} reps</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.2)" }}>{ex.rest}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Session done button */}
          <div id="tour-dash-seance" style={{ padding: "1.25rem 1.75rem 1.6rem" }}>
            <AnimatePresence mode="wait">
              {sessionDone ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    ...glass("#4ade80"),
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                    padding: "0.9rem", borderRadius: "0.9rem",
                    border: "1px solid rgba(74,222,128,0.25)",
                    fontSize: "0.83rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "#4ade80",
                  }}
                >
                  <CheckCheck size={14} /> Séance validée · {totalSeances} au total · Streak {streak} j
                </motion.div>
              ) : (
                <motion.button
                  key="btn"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleSessionDone}
                  style={{
                    width: "100%", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                    background: "rgba(74,222,128,0.08)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(74,222,128,0.25)",
                    borderRadius: "0.9rem", padding: "0.9rem",
                    fontSize: "0.83rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#4ade80",
                    transition: "all 0.18s ease",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 16px rgba(74,222,128,0.1)",
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(74,222,128,0.14)";
                    el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.14), 0 6px 24px rgba(74,222,128,0.2)";
                    el.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(74,222,128,0.08)";
                    el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 16px rgba(74,222,128,0.1)";
                    el.style.transform = "";
                  }}
                >
                  <CheckCheck size={14} /> J'ai fait ma séance
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </HoverSpotlight>
        </motion.div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Checklist */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: easing, delay: 0.28 }}
          >
          <HoverSpotlight
            color="rgba(255,255,255,0.4)"
            style={{
              ...glass(),
              borderRadius: "1.25rem",
              padding: "1.35rem 1.4rem",
              position: "relative", overflow: "hidden",
            }}
          >
            <div aria-hidden style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "1px",
              background: "linear-gradient(to right, transparent, rgba(255,255,255,0.16), transparent)",
              pointerEvents: "none",
            }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                Pour démarrer
              </p>
              <span style={{
                fontSize: "0.72rem", fontWeight: 700, color: "#4ade80",
                background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
                borderRadius: "999px", padding: "0.15rem 0.5rem",
                backdropFilter: "blur(8px)",
              }}>
                {doneCount}/{checklist.length}
              </span>
            </div>

            <div style={{ height: "2px", background: "rgba(255,255,255,0.04)", borderRadius: "999px", overflow: "hidden", marginBottom: "1rem" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(doneCount / checklist.length) * 100}%` }}
                transition={{ duration: 0.9, ease: easing, delay: 0.4 }}
                style={{ height: "100%", background: "linear-gradient(to right, rgba(74,222,128,0.5), #4ade80)", borderRadius: "999px", boxShadow: "0 0 8px rgba(74,222,128,0.5)" }}
              />
            </div>

            {checklist.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "0.65rem",
                padding: "0.6rem 0",
                borderBottom: i < checklist.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                {item.done
                  ? <CheckCircle2 size={13} color="#4ade80" />
                  : <Circle size={13} color="rgba(255,255,255,0.14)" />
                }
                <p style={{
                  fontSize: "0.83rem", lineHeight: 1.4,
                  color: item.done ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.65)",
                  textDecoration: item.done ? "line-through" : "none",
                  textDecorationColor: "rgba(255,255,255,0.18)",
                }}>
                  {item.label}
                </p>
              </div>
            ))}
          </HoverSpotlight>
          </motion.div>

          {/* Message coach */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: easing, delay: 0.35 }}
          >
          <HoverSpotlight
            color="#38bdf8"
            style={{
              ...glassAccent("#38bdf8"),
              borderRadius: "1.25rem",
              padding: "1.35rem 1.4rem",
              position: "relative", overflow: "hidden",
            }}
          >
            <div aria-hidden style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "1px",
              background: "linear-gradient(to right, transparent, rgba(255,255,255,0.14), transparent)",
              pointerEvents: "none",
            }} />
            <div aria-hidden style={{
              position: "absolute", top: "-30%", right: "-10%",
              width: "140px", height: "120px", pointerEvents: "none",
              background: "radial-gradient(ellipse, rgba(56,189,248,0.1) 0%, transparent 70%)",
              filter: "blur(30px)",
            }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <p style={{ fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Coach</p>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#38bdf8", display: "block", boxShadow: "0 0 8px #38bdf8" }} />
              </div>
              <Link href="/dashboard/messages" style={{ fontSize: "0.7rem", color: "#38bdf8", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem", opacity: 0.8 }}>
                Voir <ArrowRight size={9} />
              </Link>
            </div>

            <div style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, rgba(56,189,248,0.25), rgba(56,189,248,0.06))",
                border: "1px solid rgba(56,189,248,0.3)",
                backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.76rem", color: "#38bdf8",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
              }}>
                BP
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.3rem" }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ffffff" }}>Baptiste P.</p>
                  <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.18)" }}>Aujourd'hui</span>
                </div>
                <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
                  Bienvenue Thomas ! Ton programme est prêt. Commence par la séance Push aujourd'hui…
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/messages"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem",
                padding: "0.6rem",
                background: "rgba(56,189,248,0.07)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(56,189,248,0.16)",
                borderRadius: "0.65rem", textDecoration: "none",
                fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#38bdf8",
                transition: "all 0.18s ease",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(56,189,248,0.13)"; el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 16px rgba(56,189,248,0.15)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(56,189,248,0.07)"; el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08)"; }}
            >
              <MessageCircle size={11} /> Répondre
            </Link>
          </HoverSpotlight>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
