"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { TrendingUp, TrendingDown, Trophy, Pencil, Check, Scale, Plus, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { HoverSpotlight } from "@/components/HoverSpotlight";
import { PaywallGate } from "@/components/PaywallGate";

const easing = [0.22, 1, 0.36, 1] as const;

// ── Types ─────────────────────────────────────────────────────────────────────
type WeightEntry     = { label: string; value: number; date: string; };
type MeasureData     = { before: number | null; current: number | null; };
type MeasuresState   = Record<string, MeasureData>;
type TrackedExercise = { id: string; name: string; cat: string; color: string; fromCoach: boolean; };

// ── Constants ─────────────────────────────────────────────────────────────────
const MEASURE_DEFS = [
  { id: "poids",    label: "Poids",               unit: "kg", positiveUp: null  as boolean | null },
  { id: "poitrine", label: "Tour de poitrine",     unit: "cm", positiveUp: true  },
  { id: "bras",     label: "Tour de bras",          unit: "cm", positiveUp: true  },
  { id: "cuisse",   label: "Tour de cuisse",        unit: "cm", positiveUp: true  },
  { id: "taille",   label: "Tour de taille",        unit: "cm", positiveUp: false },
  { id: "graisse",  label: "Masse grasse (estimé)", unit: "%",  positiveUp: false },
];

const CAT_COLORS: Record<string, string> = {
  Push: "#38bdf8", Pull: "#a78bfa", Legs: "#4ade80",
  "Full Body": "#fb923c", Cardio: "#facc15",
  "Haut du corps": "#f87171", "Bas du corps": "#34d399",
  Custom: "#e879f9",
};

const CAT_OPTIONS = ["Push", "Pull", "Legs", "Full Body", "Cardio", "Haut du corps", "Bas du corps", "Custom"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadJSON<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
}
function genId() { return Math.random().toString(36).slice(2, 9); }

function seedThomasIfNeeded() {
  const DEMO_ID = "demo_thomas";
  if (localStorage.getItem(`bp_coach_client_${DEMO_ID}`)) return;
  const hasRealClient = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))
    .some(k => k?.startsWith("bp_coach_client_") && k !== "bp_coach_clients" && !k.includes("demo"));
  if (hasRealClient) return;

  const mkEx = (name: string) => ({ id: genId(), name, sets: "4", reps: "10", rest: "90s", note: "" });
  const repos = { type: "Repos", duration: "", muscles: [], exercises: [] };
  const programme = {
    Lundi:    { type: "Push",  duration: "60", muscles: ["Pectoraux","Épaules","Triceps"], exercises: [mkEx("Développé couché"), mkEx("Développé incliné haltères"), mkEx("Dips triceps"), mkEx("Élévations latérales")] },
    Mardi:    repos,
    Mercredi: { type: "Pull",  duration: "60", muscles: ["Dos","Biceps"], exercises: [mkEx("Tractions"), mkEx("Rowing barre"), mkEx("Tirage poulie haute"), mkEx("Curl haltères")] },
    Jeudi:    repos,
    Vendredi: { type: "Legs",  duration: "70", muscles: ["Quadriceps","Ischio","Fessiers"], exercises: [mkEx("Squat barre"), mkEx("Presse à cuisses"), mkEx("Leg curl allongé"), mkEx("Soulevé de terre roumain")] },
    Samedi:   repos,
    Dimanche: repos,
  };
  const clientData = { id: DEMO_ID, firstName: "Thomas", lastName: "R.", goal: "Hypertrophie", programName: "Hypertrophie Intermédiaire", startDate: "2026-07-01", currentWeek: 1, totalWeeks: 12, program: programme, diet: { calories: 2800, protein: 200, carbs: 320, fat: 80, hydration: 3.5, coachNote: "" } };
  localStorage.setItem(`bp_coach_client_${DEMO_ID}`, JSON.stringify(clientData));
  const metas = loadJSON<unknown[]>("bp_coach_clients", []);
  localStorage.setItem("bp_coach_clients", JSON.stringify([...metas, { id: DEMO_ID, firstName: "Thomas", lastName: "R.", goal: "Hypertrophie", currentWeek: 1, totalWeeks: 12, programName: "Hypertrophie Intermédiaire" }]));
}
function fmt(v: number) { return v % 1 === 0 ? String(v) : v.toFixed(1); }
function fmtDelta(d: number, unit: string) { return `${d > 0 ? "+" : ""}${fmt(d)} ${unit}`; }

// ── Styles ────────────────────────────────────────────────────────────────────
const glassCard = (color = "#38bdf8"): React.CSSProperties => ({
  background: `linear-gradient(145deg, ${color}0e 0%, rgba(255,255,255,0.03) 55%, ${color}06 100%)`,
  backdropFilter: "blur(28px) saturate(180%)",
  WebkitBackdropFilter: "blur(28px) saturate(180%)",
  border: `1px solid ${color}28`,
  borderRadius: "1.1rem",
  overflow: "hidden",
  position: "relative" as const,
  boxShadow: [`inset 0 1px 0 ${color}22`, "inset 0 -1px 0 rgba(255,255,255,0.03)", `0 8px 32px ${color}10`, "0 2px 8px rgba(0,0,0,0.2)"].join(", "),
});

// ── Tooltip ───────────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(7,12,22,0.95)", backdropFilter: "blur(16px)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: "0.65rem", padding: "0.6rem 0.9rem" }}>
      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.2rem" }}>{label}</p>
      <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.1rem", color: "#38bdf8" }}>{payload[0].value} kg</p>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProgressionPage() {
  const { isMobile } = useBreakpoint();

  // Weight history
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [weightInput, setWeightInput]   = useState("");
  const weightInputRef = useRef<HTMLInputElement>(null);

  // Measurements
  const [measures, setMeasures]     = useState<MeasuresState>({});
  const [editingM, setEditingM]     = useState<{ id: string; field: "before" | "current" } | null>(null);
  const [mInput, setMInput]         = useState("");
  const mInputRef = useRef<HTMLInputElement>(null);

  // Exercises
  const [programExercises, setProgramExercises] = useState<TrackedExercise[]>([]);
  const [customExercises,  setCustomExercises]  = useState<TrackedExercise[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [prs,     setPrs]     = useState<Record<string, number>>({});
  const [editingEx, setEditingEx] = useState<string | null>(null);
  const [exInput,   setExInput]   = useState("");
  const exInputRef = useRef<HTMLInputElement>(null);

  // Add exercise form
  const [showAddEx, setShowAddEx] = useState(false);
  const [newExName, setNewExName] = useState("");
  const [newExCat,  setNewExCat]  = useState("Custom");
  const addExInputRef = useRef<HTMLInputElement>(null);

  // ── Load from localStorage ──────────────────────────────────────────────────
  useEffect(() => {
    seedThomasIfNeeded();

    // Weight history
    setWeightHistory(loadJSON<WeightEntry[]>("bp_weight_history", []));

    // Measurements
    const savedM = loadJSON<MeasuresState>("bp_measurements", {});
    const initM: MeasuresState = {};
    MEASURE_DEFS.forEach(m => { initM[m.id] = savedM[m.id] ?? { before: null, current: null }; });
    setMeasures(initM);

    // Weights & PRs
    setWeights(loadJSON("bp_exercise_weights", {}));
    setPrs(loadJSON("bp_exercise_prs", {}));

    // Custom exercises
    setCustomExercises(loadJSON<TrackedExercise[]>("bp_custom_exercises", []));

    // Programme exercises — scan all bp_coach_client_* keys directly
    try {
      type RawDay = { type: string; exercises?: Array<{ id: string; name: string }> };
      type RawClient = { program?: Record<string, RawDay> };
      const seen = new Set<string>();
      const exs: TrackedExercise[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith("bp_coach_client_") || key === "bp_coach_clients") continue;
        const clientData = loadJSON<RawClient | null>(key, null);
        if (!clientData?.program) continue;
        Object.values(clientData.program).forEach((day: RawDay) => {
          if (!day.exercises?.length || day.type === "Repos") return;
          day.exercises.forEach(ex => {
            const nameKey = ex.name.trim().toLowerCase();
            if (!nameKey || seen.has(nameKey)) return;
            seen.add(nameKey);
            exs.push({
              id: ex.id,
              name: ex.name.trim(),
              cat: day.type,
              color: CAT_COLORS[day.type] ?? "#38bdf8",
              fromCoach: true,
            });
          });
        });
        if (exs.length > 0) break; // use first client with exercises
      }
      if (exs.length > 0) setProgramExercises(exs);
    } catch { /* silently ignore */ }
  }, []);

  // Auto-focus
  useEffect(() => { if (showWeightInput) weightInputRef.current?.focus(); }, [showWeightInput]);
  useEffect(() => { if (editingM) mInputRef.current?.focus(); }, [editingM]);
  useEffect(() => { if (editingEx) exInputRef.current?.focus(); }, [editingEx]);
  useEffect(() => { if (showAddEx) addExInputRef.current?.focus(); }, [showAddEx]);

  // ── Weight handlers ────────────────────────────────────────────────────────
  function submitWeight() {
    const val = parseFloat(weightInput.replace(",", "."));
    if (isNaN(val) || val <= 0) return;
    const entry: WeightEntry = { label: `S${weightHistory.length + 1}`, value: val, date: new Date().toISOString().slice(0, 10) };
    const updated = [...weightHistory, entry];
    setWeightHistory(updated);
    localStorage.setItem("bp_weight_history", JSON.stringify(updated));
    setWeightInput(""); setShowWeightInput(false);
  }

  function deleteLastWeight() {
    if (!weightHistory.length) return;
    const updated = weightHistory.slice(0, -1);
    setWeightHistory(updated);
    localStorage.setItem("bp_weight_history", JSON.stringify(updated));
  }

  // ── Measurement handlers ───────────────────────────────────────────────────
  function startEditM(id: string, field: "before" | "current") {
    const val = measures[id]?.[field];
    setMInput(val !== null && val !== undefined ? String(val) : "");
    setEditingM({ id, field });
  }
  function saveM() {
    if (!editingM) return;
    const val = parseFloat(mInput.replace(",", "."));
    const updated = { ...measures, [editingM.id]: { ...measures[editingM.id], [editingM.field]: isNaN(val) || val < 0 ? null : val } };
    setMeasures(updated);
    localStorage.setItem("bp_measurements", JSON.stringify(updated));
    setEditingM(null);
  }

  // ── Exercise handlers ──────────────────────────────────────────────────────
  function startEditEx(id: string) { setEditingEx(id); setExInput(String(weights[id] ?? 0)); }
  function saveEx(id: string) {
    const val = parseFloat(exInput.replace(",", "."));
    if (!isNaN(val) && val >= 0) {
      const newW = { ...weights, [id]: val };
      setWeights(newW);
      localStorage.setItem("bp_exercise_weights", JSON.stringify(newW));
      if (val > (prs[id] ?? 0)) {
        const newPrs = { ...prs, [id]: val };
        setPrs(newPrs);
        localStorage.setItem("bp_exercise_prs", JSON.stringify(newPrs));
      }
    }
    setEditingEx(null);
  }

  function addCustomExercise() {
    if (!newExName.trim()) return;
    const ex: TrackedExercise = { id: genId(), name: newExName.trim(), cat: newExCat, color: CAT_COLORS[newExCat] ?? "#e879f9", fromCoach: false };
    const updated = [...customExercises, ex];
    setCustomExercises(updated);
    localStorage.setItem("bp_custom_exercises", JSON.stringify(updated));
    setNewExName(""); setShowAddEx(false);
  }

  function removeCustomExercise(id: string) {
    const updated = customExercises.filter(e => e.id !== id);
    setCustomExercises(updated);
    localStorage.setItem("bp_custom_exercises", JSON.stringify(updated));
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const lastWeight  = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].value : null;
  const firstWeight = weightHistory.length > 0 ? weightHistory[0].value : null;
  const bwDelta     = lastWeight !== null && firstWeight !== null ? lastWeight - firstWeight : null;

  const allExercises = [...programExercises, ...customExercises];
  const prCount      = allExercises.filter(e => (weights[e.id] ?? 0) > 0 && (weights[e.id] ?? 0) >= (prs[e.id] ?? 0) && (prs[e.id] ?? 0) > 0).length;
  const totalDelta   = allExercises.reduce((s, e) => s + Math.max(0, weights[e.id] ?? 0), 0);

  // Group exercises by category
  const categories = [...new Set(allExercises.map(e => e.cat))];

  const stats = [
    { label: "Poids actuel", value: lastWeight !== null ? fmt(lastWeight) : "—", unit: lastWeight !== null ? "kg" : "", delta: bwDelta !== null ? fmtDelta(bwDelta, "kg") : "Ajoutez votre poids", color: "#38bdf8", Icon: Scale },
    { label: "Records battus", value: String(prCount), unit: "PR", delta: prCount === 0 ? "Battez vos records !" : `${prCount} record${prCount > 1 ? "s" : ""} personnel${prCount > 1 ? "s" : ""}`, color: "#fb923c", Icon: Trophy },
    { label: "Total charges", value: totalDelta > 0 ? String(totalDelta) : "0", unit: "kg", delta: "cumul enregistré", color: "#4ade80", Icon: TrendingUp },
    { label: "Avancement", value: "1", unit: "/12", delta: "semaines programme", color: "#a78bfa", Icon: TrendingUp },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <PaywallGate
      page="progression"
      title="Suis ta progression"
      description="Courbe de poids, mesures corporelles, PRs sur tes exercices — tout est enregistré semaine après semaine. Débloque l'accès pour commencer ton suivi."
    >
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easing }}>
        <p style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.5rem" }}>Ma progression</p>
        <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", textTransform: "uppercase", letterSpacing: "-0.01em", color: "#ffffff", lineHeight: 1 }}>
          SEMAINE 1 <span style={{ color: "rgba(255,255,255,0.18)" }}>→</span>{" "}
          <span style={{ color: "#38bdf8", textShadow: "0 0 24px rgba(56,189,248,0.4)" }}>AUJOURD&apos;HUI</span>
        </h1>
      </motion.div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "0.75rem" }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: easing, delay: 0.05 + i * 0.06 }}>
            <HoverSpotlight color={s.color} style={{ ...glassCard(s.color), padding: "1.1rem 1.2rem", border: `1px solid ${s.color}35` }}>
              <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${s.color}70, rgba(255,255,255,0.5), ${s.color}70, transparent)`, pointerEvents: "none" }} />
              <div aria-hidden style={{ position: "absolute", bottom: "-0.5rem", right: "-0.5rem", opacity: 0.07 }}><s.Icon size={52} color={s.color} /></div>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem", position: "relative" }}>{s.label}</p>
              <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.9rem", color: s.color, lineHeight: 1, textShadow: `0 0 20px ${s.color}60`, position: "relative" }}>
                {s.value}<span style={{ fontSize: "0.95rem", color: `${s.color}70`, marginLeft: "2px", fontWeight: 400 }}>{s.unit}</span>
              </p>
              <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "0.3rem", position: "relative" }}>{s.delta}</p>
            </HoverSpotlight>
          </motion.div>
        ))}
      </div>

      {/* ── Weight chart ── */}
      <motion.div id="tour-prog-poids" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easing, delay: 0.15 }}>
        <HoverSpotlight color="#38bdf8" style={{ ...glassCard("#38bdf8"), padding: "1.5rem" }}>
          <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.55), rgba(255,255,255,0.4), rgba(56,189,248,0.55), transparent)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "160px", pointerEvents: "none", background: "radial-gradient(ellipse, rgba(56,189,248,0.15) 0%, transparent 65%)", filter: "blur(28px)" }} />

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", position: "relative", zIndex: 1, flexWrap: "wrap", gap: "0.75rem" }}>
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginBottom: "0.3rem" }}>Évolution du poids</p>
              <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "2rem", color: "#ffffff", lineHeight: 1 }}>
                {lastWeight !== null
                  ? <>{fmt(lastWeight)} <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>kg</span></>
                  : <span style={{ fontSize: "1.3rem", color: "rgba(255,255,255,0.25)" }}>Aucune donnée</span>
                }
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {bwDelta !== null && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: bwDelta >= 0 ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${bwDelta >= 0 ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`, borderRadius: "999px", padding: "0.3rem 0.75rem" }}>
                  {bwDelta >= 0 ? <TrendingUp size={11} color="#4ade80" /> : <TrendingDown size={11} color="#f87171" />}
                  <span style={{ fontSize: "0.76rem", fontWeight: 700, color: bwDelta >= 0 ? "#4ade80" : "#f87171" }}>{fmtDelta(bwDelta, "kg")}</span>
                </div>
              )}
              <button onClick={() => setShowWeightInput(v => !v)}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.42rem 0.85rem", background: showWeightInput ? "rgba(56,189,248,0.15)" : "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: "999px", cursor: "pointer", color: "#38bdf8", fontSize: "0.76rem", fontWeight: 700, transition: "all 0.15s" }}
              >
                <Plus size={12} /> Ajouter poids
              </button>
              {weightHistory.length > 0 && (
                <button onClick={deleteLastWeight} title="Supprimer la dernière entrée"
                  style={{ display: "flex", padding: "0.42rem 0.5rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "999px", cursor: "pointer", color: "rgba(255,255,255,0.3)", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showWeightInput && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
                style={{ overflow: "hidden", marginBottom: "1rem", position: "relative", zIndex: 1 }}
              >
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "0.75rem", padding: "0.75rem 1rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>Mon poids :</span>
                  <input ref={weightInputRef} type="number" step="0.1" placeholder="ex: 72.5" value={weightInput}
                    onChange={e => setWeightInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") submitWeight(); if (e.key === "Escape") setShowWeightInput(false); }}
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#38bdf8", fontSize: "1.2rem", fontFamily: "var(--font-oswald)", fontWeight: 700, minWidth: 0 }}
                  />
                  <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)" }}>kg</span>
                  <button onClick={submitWeight} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.4rem 0.85rem", background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.35)", borderRadius: "0.55rem", cursor: "pointer", color: "#38bdf8", fontSize: "0.78rem", fontWeight: 700 }}>
                    <Check size={12} /> Enregistrer
                  </button>
                  <button onClick={() => setShowWeightInput(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", display: "flex" }}><X size={14} /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {weightHistory.length === 0 ? (
            <div style={{ height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(56,189,248,0.12)", borderRadius: "0.75rem", gap: "0.5rem" }}>
              <Scale size={24} color="rgba(56,189,248,0.25)" />
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.22)" }}>Enregistrez votre premier poids pour voir l&apos;évolution</p>
              <button onClick={() => setShowWeightInput(true)} style={{ fontSize: "0.75rem", color: "#38bdf8", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "999px", padding: "0.3rem 0.75rem", cursor: "pointer", fontWeight: 700 }}>
                + Ajouter mon poids
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weightHistory} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.28)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.28)" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(56,189,248,0.2)", strokeWidth: 1 }} />
                {firstWeight !== null && <ReferenceLine y={firstWeight} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />}
                <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2.5} dot={{ fill: "#38bdf8", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#38bdf8", stroke: "rgba(56,189,248,0.4)", strokeWidth: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {weightHistory.length > 1 && (
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.75rem", position: "relative", zIndex: 1 }}>
              {weightHistory.map((e, i) => (
                <span key={i} style={{ fontSize: "0.68rem", color: i === weightHistory.length - 1 ? "#38bdf8" : "rgba(255,255,255,0.25)", background: i === weightHistory.length - 1 ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${i === weightHistory.length - 1 ? "rgba(56,189,248,0.25)" : "rgba(255,255,255,0.06)"}`, borderRadius: "999px", padding: "0.18rem 0.6rem" }}>
                  {e.label} · {e.value} kg
                </span>
              ))}
            </div>
          )}
        </HoverSpotlight>
      </motion.div>

      {/* ── Mes Charges ── */}
      <div id="tour-prog-charges">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easing, delay: 0.22 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}
        >
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.25rem" }}>Suivi en temps réel</p>
            <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: "0.03em", color: "#ffffff", lineHeight: 1 }}>Mes Charges</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.71rem", color: "rgba(255,255,255,0.22)", fontStyle: "italic" }}>Cliquez sur un poids pour le modifier</span>
            <button onClick={() => setShowAddEx(v => !v)}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.48rem 1rem", background: showAddEx ? "rgba(232,121,249,0.15)" : "rgba(232,121,249,0.08)", border: "1px solid rgba(232,121,249,0.25)", borderRadius: "999px", cursor: "pointer", color: "#e879f9", fontSize: "0.76rem", fontWeight: 700, transition: "all 0.15s" }}
            >
              <Plus size={12} /> Ajouter exercice
            </button>
          </div>
        </motion.div>

        {/* Add exercise form */}
        <AnimatePresence>
          {showAddEx && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
              style={{ overflow: "hidden", marginBottom: "1rem" }}
            >
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", background: "rgba(232,121,249,0.06)", border: "1px solid rgba(232,121,249,0.2)", borderRadius: "0.85rem", padding: "0.9rem 1.1rem" }}>
                <input ref={addExInputRef} placeholder="Nom de l'exercice (ex: Curl haltères)" value={newExName}
                  onChange={e => setNewExName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") addCustomExercise(); if (e.key === "Escape") setShowAddEx(false); }}
                  style={{ flex: 1, minWidth: "180px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.55rem", padding: "0.5rem 0.75rem", color: "#ffffff", fontSize: "0.88rem", outline: "none" }}
                />
                <select value={newExCat} onChange={e => setNewExCat(e.target.value)}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.55rem", padding: "0.5rem 0.75rem", color: "rgba(255,255,255,0.7)", fontSize: "0.84rem", outline: "none", cursor: "pointer" }}
                >
                  {CAT_OPTIONS.map(c => <option key={c} value={c} style={{ background: "#09142a" }}>{c}</option>)}
                </select>
                <button onClick={addCustomExercise}
                  style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem 1rem", background: "rgba(232,121,249,0.15)", border: "1px solid rgba(232,121,249,0.35)", borderRadius: "0.6rem", cursor: "pointer", color: "#e879f9", fontSize: "0.8rem", fontWeight: 700 }}
                >
                  <Check size={13} /> Ajouter
                </button>
                <button onClick={() => setShowAddEx(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", display: "flex" }}><X size={15} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {allExercises.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div style={{ textAlign: "center", padding: "3rem 2rem", border: "1px dashed rgba(255,255,255,0.07)", borderRadius: "1.1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
              <Trophy size={28} color="rgba(255,255,255,0.12)" />
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)" }}>Aucun exercice à suivre pour l&apos;instant</p>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.18)" }}>Votre coach n&apos;a pas encore configuré votre programme, ou ajoutez vos propres exercices.</p>
              <button onClick={() => setShowAddEx(true)} style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#e879f9", background: "rgba(232,121,249,0.08)", border: "1px solid rgba(232,121,249,0.2)", borderRadius: "999px", padding: "0.4rem 1rem", cursor: "pointer", fontWeight: 700 }}>
                + Ajouter mon premier exercice
              </button>
            </div>
          </motion.div>
        )}

        {/* Exercise cards by category */}
        {categories.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : `repeat(${Math.min(categories.length, 3)}, 1fr)`, gap: "0.85rem" }}>
            {categories.map((cat, ci) => {
              const catExs = allExercises.filter(e => e.cat === cat);
              const color  = CAT_COLORS[cat] ?? "#38bdf8";

              return (
                <motion.div key={cat} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: easing, delay: 0.26 + ci * 0.08 }}>
                  <HoverSpotlight color={color} style={{ ...glassCard(color), padding: 0 }}>
                    <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: `linear-gradient(to right, transparent, ${color}60, rgba(255,255,255,0.4), ${color}60, transparent)`, pointerEvents: "none" }} />
                    <div aria-hidden style={{ position: "absolute", top: "-30px", right: "-20px", width: "130px", height: "110px", pointerEvents: "none", background: `radial-gradient(ellipse, ${color}18 0%, transparent 65%)`, filter: "blur(22px)" }} />

                    {/* Category header */}
                    <div style={{ padding: "0.9rem 1.3rem", borderBottom: `1px solid ${color}14`, background: `${color}08`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
                        <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", color }}>{cat}</span>
                      </div>
                      <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)" }}>{catExs.length} exercice{catExs.length > 1 ? "s" : ""}</span>
                    </div>

                    {/* Exercise rows */}
                    {catExs.map((ex, ei) => {
                      const w         = weights[ex.id] ?? 0;
                      const pr        = prs[ex.id] ?? 0;
                      const isNewPr   = w > 0 && w >= pr && pr > 0;
                      const isEditing = editingEx === ex.id;
                      const isLast    = ei === catExs.length - 1;
                      const prPct     = pr > 0 ? Math.min((w / pr) * 100, 100) : 0;

                      return (
                        <div key={ex.id} style={{ padding: "1rem 1.3rem", borderBottom: isLast ? "none" : `1px solid ${color}0e`, position: "relative", zIndex: 1 }}>

                          {/* Name + badges */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.65rem", gap: "0.5rem" }}>
                            <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "rgba(255,255,255,0.75)", lineHeight: 1.2, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ex.name}</p>
                            <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", flexShrink: 0 }}>
                              {isNewPr && (
                                <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", color: "#fb923c", background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.28)", borderRadius: "999px", padding: "0.12rem 0.45rem" }}>
                                  <Trophy size={8} /> PR
                                </span>
                              )}
                              {!ex.fromCoach && (
                                <button onClick={() => removeCustomExercise(ex.id)} title="Supprimer"
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.18)", display: "flex", padding: "0.1rem", transition: "color 0.15s" }}
                                  onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.18)")}
                                >
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Weight + delta */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: pr > 0 ? "0.75rem" : 0 }}>
                            {isEditing ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <input ref={exInputRef} type="number" step="0.5" value={exInput}
                                  onChange={e => setExInput(e.target.value)}
                                  onKeyDown={e => { if (e.key === "Enter") saveEx(ex.id); if (e.key === "Escape") setEditingEx(null); }}
                                  onBlur={() => saveEx(ex.id)}
                                  style={{ width: "72px", background: `${color}15`, border: `1px solid ${color}55`, borderRadius: "0.55rem", padding: "0.3rem 0.5rem", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.5rem", color, outline: "none", textAlign: "center" }}
                                />
                                <span style={{ fontSize: "0.8rem", color: `${color}70` }}>kg</span>
                                <Check size={13} color="#4ade80" />
                              </div>
                            ) : (
                              <button onClick={() => startEditEx(ex.id)} style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.9rem", color: w > 0 ? color : "rgba(255,255,255,0.2)", lineHeight: 1, textShadow: w > 0 ? `0 0 18px ${color}55` : "none" }}>
                                  {w > 0 ? fmt(w) : "0"}
                                </span>
                                <span style={{ fontSize: "0.8rem", color: `${color}65`, fontWeight: 400 }}>kg</span>
                                <Pencil size={10} color="rgba(255,255,255,0.18)" style={{ marginLeft: "0.15rem", marginBottom: "0.15rem" }} />
                              </button>
                            )}
                            {pr > 0 && (
                              <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.18)", borderRadius: "999px", padding: "0.2rem 0.55rem" }}>
                                <Trophy size={9} color="#fb923c" />
                                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#fb923c" }}>PR {fmt(pr)} kg</span>
                              </div>
                            )}
                          </div>

                          {/* PR progress bar */}
                          {pr > 0 && (
                            <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "999px", overflow: "hidden" }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${prPct}%` }}
                                transition={{ duration: 0.9, ease: easing, delay: 0.35 + ci * 0.08 + ei * 0.05 }}
                                style={{ height: "100%", background: `linear-gradient(to right, ${color}55, ${color})`, borderRadius: "999px", boxShadow: `0 0 6px ${color}55` }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </HoverSpotlight>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Mensurations ── */}
      <motion.div id="tour-prog-mesures" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easing, delay: 0.35 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.65rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Mensurations</p>
          <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.18)", fontStyle: "italic" }}>Cliquez sur une valeur pour la modifier</span>
        </div>

        <HoverSpotlight color="#4ade80" style={{ ...glassCard("#4ade80"), padding: "0.5rem 1.5rem 1rem" }}>
          <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: "linear-gradient(to right, transparent, rgba(74,222,128,0.5), rgba(255,255,255,0.35), rgba(74,222,128,0.5), transparent)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", top: "-40px", right: "-30px", width: "160px", height: "130px", background: "radial-gradient(ellipse, rgba(74,222,128,0.15) 0%, transparent 65%)", filter: "blur(24px)", pointerEvents: "none" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 14px 90px 70px", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0 0.4rem", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "0.15rem", position: "relative", zIndex: 1 }}>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Mensuration</span>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>Départ</span>
            <span />
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>Actuel</span>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", textAlign: "right" }}>Évolution</span>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            {MEASURE_DEFS.map((m, i) => {
              const data  = measures[m.id] ?? { before: null, current: null };
              const delta = data.before !== null && data.current !== null ? data.current - data.before : null;
              const isPos = m.positiveUp === null ? true : (m.positiveUp ? (delta ?? 0) >= 0 : (delta ?? 0) <= 0);
              const isLast = i === MEASURE_DEFS.length - 1;

              const EditableVal = ({ field, value }: { field: "before" | "current"; value: number | null }) => {
                const isEditing = editingM?.id === m.id && editingM.field === field;
                if (isEditing) {
                  return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <input ref={mInputRef} type="number" step="0.1" value={mInput}
                        onChange={e => setMInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") saveM(); if (e.key === "Escape") setEditingM(null); }}
                        onBlur={saveM}
                        style={{ width: "60px", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.35)", borderRadius: "0.4rem", padding: "0.2rem 0.35rem", color: "#4ade80", fontSize: "0.88rem", fontWeight: 700, outline: "none", textAlign: "center" }}
                      />
                    </div>
                  );
                }
                return (
                  <button onClick={() => startEditM(m.id, field)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.2rem", background: "none", border: "none", cursor: "pointer", width: "100%", padding: "0.15rem 0" }}
                  >
                    {value !== null ? (
                      <>
                        <span style={{ fontSize: "0.88rem", fontWeight: field === "current" ? 700 : 400, color: field === "current" ? "#ffffff" : "rgba(255,255,255,0.25)", textDecoration: field === "before" ? "line-through" : "none", textDecorationColor: "rgba(255,255,255,0.12)" }}>
                          {fmt(value)} {m.unit}
                        </span>
                        <Pencil size={9} color="rgba(255,255,255,0.15)" />
                      </>
                    ) : (
                      <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", gap: "0.15rem" }}>
                        <Plus size={10} /> —
                      </span>
                    )}
                  </button>
                );
              };

              return (
                <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr 90px 14px 90px 70px", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0", borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.5)" }}>{m.label}</span>
                  <EditableVal field="before" value={data.before} />
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.15)", textAlign: "center" }}>→</span>
                  <EditableVal field="current" value={data.current} />
                  <div style={{ textAlign: "right" }}>
                    {delta !== null ? (
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isPos ? "#4ade80" : "#f87171", display: "inline-flex", alignItems: "center", gap: "0.1rem" }}>
                        {isPos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {fmtDelta(delta, m.unit)}
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.12)" }}>—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </HoverSpotlight>
      </motion.div>

    </div>
    </PaywallGate>
  );
}
