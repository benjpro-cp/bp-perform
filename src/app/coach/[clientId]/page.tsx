"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Check, Plus, Trash2, Pencil, X, ChevronDown, Scale, Dumbbell, Ruler, User, Camera, Link } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;

const GOALS = ["Hypertrophie", "Prise de masse", "Sèche", "Remise en forme", "Force", "Endurance"];
const goalColors: Record<string, string> = {
  Hypertrophie: "#38bdf8",
  "Prise de masse": "#a78bfa",
  Sèche: "#fb923c",
  "Remise en forme": "#4ade80",
  Force: "#f87171",
  Endurance: "#facc15",
};

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const DAY_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const SESSION_TYPES = ["Repos", "Push", "Pull", "Legs", "Full Body", "Cardio", "Haut du corps", "Bas du corps"];
const typeColors: Record<string, string> = {
  Repos: "rgba(255,255,255,0.25)",
  Push: "#38bdf8",
  Pull: "#a78bfa",
  Legs: "#4ade80",
  "Full Body": "#fb923c",
  Cardio: "#facc15",
  "Haut du corps": "#f87171",
  "Bas du corps": "#34d399",
};

const MUSCLE_SUGGESTIONS = [
  "Pectoraux", "Épaules", "Triceps", "Biceps", "Dos",
  "Abdos", "Quadriceps", "Ischio", "Fessiers", "Mollets", "Avant-bras",
];

type Exercise = { id: string; name: string; sets: string; reps: string; rest: string; note: string; videoUrl?: string; };
type DayData = { type: string; duration: string; muscles: string[]; exercises: Exercise[]; };
type Diet = { calories: number; protein: number; carbs: number; fat: number; hydration: number; coachNote: string; };
type ClientData = {
  id: string; firstName: string; lastName: string;
  goal: string; programName: string; startDate: string;
  currentWeek: number; totalWeeks: number;
  program: Record<string, DayData>;
  diet: Diet;
  avatar?: string;
};

type WeightEntry = { label: string; value: number; date: string; };
type MeasureData  = { before: number | null; current: number | null; };

const MEASURE_DEFS = [
  { id: "poids",    label: "Poids",               unit: "kg" },
  { id: "poitrine", label: "Tour de poitrine",     unit: "cm" },
  { id: "bras",     label: "Tour de bras",          unit: "cm" },
  { id: "cuisse",   label: "Tour de cuisse",        unit: "cm" },
  { id: "taille",   label: "Tour de taille",        unit: "cm" },
  { id: "graisse",  label: "Masse grasse (estimé)", unit: "%"  },
];

type MacroField = { key: keyof Diet; label: string; unit: string; color: string; };
const MACRO_FIELDS: MacroField[] = [
  { key: "calories", label: "Calories", unit: "kcal", color: "#fb923c" },
  { key: "protein", label: "Protéines", unit: "g", color: "#38bdf8" },
  { key: "carbs", label: "Glucides", unit: "g", color: "#4ade80" },
  { key: "fat", label: "Lipides", unit: "g", color: "#a78bfa" },
  { key: "hydration", label: "Hydratation", unit: "L", color: "#22d3ee" },
];

function genId() { return Math.random().toString(36).slice(2, 9); }

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "0.6rem",
  padding: "0.65rem 0.9rem",
  color: "#ffffff",
  fontSize: "0.88rem",
  outline: "none",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "rgba(255,255,255,0.35)",
  display: "block",
  marginBottom: "0.4rem",
};

export default function ClientEditorPage() {
  const params = useParams();
  const clientId = params.clientId as string;

  const [data, setData] = useState<ClientData | null>(null);
  const [tab, setTab] = useState<"profil" | "programme" | "diete" | "performances">("profil");
  const [selectedDay, setSelectedDay] = useState("Lundi");
  const [saved, setSaved] = useState(false);
  const [editingEx, setEditingEx] = useState<string | null>(null);
  const [newMuscleDraft, setNewMuscleDraft] = useState("");

  // Performances state
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [newWeightVal, setNewWeightVal] = useState("");
  const [exWeights, setExWeights] = useState<Record<string, number>>({});
  const [exPrs, setExPrs] = useState<Record<string, number>>({});
  const [measures, setMeasures] = useState<Record<string, MeasureData>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`bp_coach_client_${clientId}`);
      if (raw) setData(JSON.parse(raw));
    } catch { /* */ }
  }, [clientId]);

  useEffect(() => {
    try {
      setWeightHistory(JSON.parse(localStorage.getItem("bp_weight_history") || "[]"));
      setExWeights(JSON.parse(localStorage.getItem("bp_exercise_weights") || "{}"));
      setExPrs(JSON.parse(localStorage.getItem("bp_exercise_prs") || "{}"));
      const savedM = JSON.parse(localStorage.getItem("bp_measurements") || "{}");
      const init: Record<string, MeasureData> = {};
      MEASURE_DEFS.forEach(m => { init[m.id] = savedM[m.id] ?? { before: null, current: null }; });
      setMeasures(init);
    } catch { /* */ }
  }, []);

  const save = useCallback(() => {
    if (!data) return;
    localStorage.setItem(`bp_coach_client_${data.id}`, JSON.stringify(data));
    try {
      const metas = JSON.parse(localStorage.getItem("bp_coach_clients") || "[]");
      const updated = metas.map((m: { id: string } & Record<string, unknown>) =>
        m.id === data.id
          ? { ...m, goal: data.goal, programName: data.programName, currentWeek: data.currentWeek, totalWeeks: data.totalWeeks, firstName: data.firstName, lastName: data.lastName, avatar: data.avatar }
          : m
      );
      localStorage.setItem("bp_coach_clients", JSON.stringify(updated));
    } catch { /* */ }
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }, [data]);

  if (!data) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 2rem", color: "rgba(255,255,255,0.3)" }}>
        Client introuvable
      </div>
    );
  }

  const goalColor = goalColors[data.goal] ?? "#38bdf8";
  const currentDay: DayData = data.program[selectedDay] ?? { type: "Repos", duration: "", muscles: [], exercises: [] };

  function updateField<K extends keyof ClientData>(key: K, value: ClientData[K]) {
    setData(d => d ? { ...d, [key]: value } : d);
  }

  function updateDiet(key: keyof Diet, value: number | string) {
    setData(d => d ? { ...d, diet: { ...d.diet, [key]: value } } : d);
  }

  function updateDay(patch: Partial<DayData>) {
    setData(d => {
      if (!d) return d;
      return { ...d, program: { ...d.program, [selectedDay]: { ...d.program[selectedDay], ...patch } } };
    });
  }

  function addExercise() {
    const ex: Exercise = { id: genId(), name: "", sets: "4", reps: "10", rest: "90s", note: "", videoUrl: "" };
    updateDay({ exercises: [...(currentDay.exercises || []), ex] });
    setEditingEx(ex.id);
  }

  function updateExercise(id: string, field: keyof Exercise, value: string) {
    updateDay({ exercises: currentDay.exercises.map(e => e.id === id ? { ...e, [field]: value } : e) });
  }

  function removeExercise(id: string) {
    updateDay({ exercises: currentDay.exercises.filter(e => e.id !== id) });
    if (editingEx === id) setEditingEx(null);
  }

  function addMuscle(m: string) {
    if (!m.trim()) return;
    const current = currentDay.muscles || [];
    if (!current.includes(m.trim())) updateDay({ muscles: [...current, m.trim()] });
    setNewMuscleDraft("");
  }

  function removeMuscle(m: string) {
    updateDay({ muscles: (currentDay.muscles || []).filter(x => x !== m) });
  }

  // ── Perf handlers ────────────────────────────────────────────────────────────
  function addWeight() {
    const val = parseFloat(newWeightVal.replace(",", "."));
    if (isNaN(val) || val <= 0) return;
    const entry: WeightEntry = { label: `S${weightHistory.length + 1}`, value: val, date: new Date().toISOString().slice(0, 10) };
    const updated = [...weightHistory, entry];
    setWeightHistory(updated);
    localStorage.setItem("bp_weight_history", JSON.stringify(updated));
    setNewWeightVal(""); setShowWeightInput(false);
  }

  function deleteLastWeight() {
    const updated = weightHistory.slice(0, -1);
    setWeightHistory(updated);
    localStorage.setItem("bp_weight_history", JSON.stringify(updated));
  }

  function saveExWeight(id: string, raw: string) {
    const val = parseFloat(raw.replace(",", "."));
    if (isNaN(val) || val < 0) return;
    const newW = { ...exWeights, [id]: val };
    setExWeights(newW);
    localStorage.setItem("bp_exercise_weights", JSON.stringify(newW));
    if (val > (exPrs[id] ?? 0)) {
      const newPrs = { ...exPrs, [id]: val };
      setExPrs(newPrs);
      localStorage.setItem("bp_exercise_prs", JSON.stringify(newPrs));
    }
  }

  function saveMeasure(id: string, field: "before" | "current", raw: string) {
    const val = parseFloat(raw.replace(",", "."));
    const updated = { ...measures, [id]: { ...measures[id], [field]: isNaN(val) || val < 0 ? null : val } };
    setMeasures(updated);
    localStorage.setItem("bp_measurements", JSON.stringify(updated));
  }

  const getTypeColor = (t: string) => typeColors[t] ?? "#38bdf8";
  const isRest = currentDay.type === "Repos";

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: easing }}
        style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Avatar preview in header */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {data.avatar ? (
              <img src={data.avatar} alt="avatar" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: `2px solid ${goalColor}60`, boxShadow: `0 0 16px ${goalColor}30` }} />
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${goalColor}18`, border: `2px solid ${goalColor}35`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.2rem", color: goalColor }}>
                {data.firstName?.[0]?.toUpperCase()}{data.lastName?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: goalColor, marginBottom: "0.35rem" }}>
              {data.goal}
            </p>
            <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.7rem, 3vw, 2.5rem)", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>
              {data.firstName} {data.lastName}
            </h1>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.3)", marginTop: "0.3rem" }}>
              {data.programName} · Semaine {data.currentWeek}/{data.totalWeeks}
            </p>
          </div>
        </div>

        <button
          onClick={save}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: saved ? "linear-gradient(135deg, #4ade80, #22c55e)" : "linear-gradient(135deg, #38bdf8, #0ea5e9)",
            color: "#03090f", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "0.7rem 1.5rem", borderRadius: "999px", border: "none", cursor: "pointer",
            boxShadow: saved ? "0 4px 20px rgba(74,222,128,0.4), inset 0 1px 0 rgba(255,255,255,0.3)" : "0 4px 20px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
            transition: "all 0.3s ease",
          }}
        >
          {saved ? <><Check size={14} /> Enregistré</> : <><Save size={14} /> Enregistrer</>}
        </button>
      </motion.div>

      {/* Tab bar */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: easing, delay: 0.06 }}
        style={{ display: "flex", gap: "0.2rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.85rem", padding: "0.3rem", marginBottom: "1.75rem", width: "fit-content" }}
      >
        {(["profil", "programme", "diete", "performances"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: "0.5rem 1.15rem", borderRadius: "0.6rem", border: "none", cursor: "pointer",
              fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              background: tab === t ? "rgba(255,255,255,0.09)" : "transparent",
              color: tab === t ? "#ffffff" : "rgba(255,255,255,0.35)",
              transition: "all 0.15s",
            }}
          >
            {t === "profil" ? "Profil" : t === "programme" ? "Programme" : t === "diete" ? "Diète" : "Performances"}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">

        {/* ── PROFIL ── */}
        {tab === "profil" && (
          <motion.div key="profil" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: easing }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.1rem", padding: "1.75rem" }}>

              {/* Avatar upload */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {data.avatar ? (
                    <img src={data.avatar} alt="avatar" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(56,189,248,0.4)", boxShadow: "0 0 20px rgba(56,189,248,0.2)" }} />
                  ) : (
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(56,189,248,0.08)", border: "2px dashed rgba(56,189,248,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User size={26} color="rgba(56,189,248,0.3)" />
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={labelStyle}>Photo de profil</label>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 1rem", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.22)", borderRadius: "999px", cursor: "pointer", color: "#38bdf8", fontSize: "0.78rem", fontWeight: 700, transition: "all 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(56,189,248,0.14)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(56,189,248,0.08)")}
                  >
                    <Camera size={12} /> {data.avatar ? "Changer la photo" : "Ajouter une photo"}
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = ev => { setData(d => d ? { ...d, avatar: ev.target?.result as string } : d); };
                      reader.readAsDataURL(file);
                    }} />
                  </label>
                  {data.avatar && (
                    <button onClick={() => setData(d => d ? { ...d, avatar: undefined } : d)}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.85rem", background: "none", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "999px", cursor: "pointer", color: "rgba(248,113,113,0.6)", fontSize: "0.74rem", width: "fit-content" }}
                    >
                      <X size={11} /> Supprimer
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>

                <div>
                  <label style={labelStyle}>Prénom</label>
                  <input style={inputStyle} value={data.firstName} onChange={e => updateField("firstName", e.target.value)}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Nom</label>
                  <input style={inputStyle} value={data.lastName} onChange={e => updateField("lastName", e.target.value)}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Objectif</label>
                  <div style={{ position: "relative" }}>
                    <select value={data.goal} onChange={e => updateField("goal", e.target.value)}
                      style={{ ...inputStyle, appearance: "none", paddingRight: "2.2rem", cursor: "pointer" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    >
                      {GOALS.map(g => <option key={g} value={g} style={{ background: "#09142a" }}>{g}</option>)}
                    </select>
                    <ChevronDown size={14} style={{ position: "absolute", right: "0.8rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", pointerEvents: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Nom du programme</label>
                  <input style={inputStyle} value={data.programName} onChange={e => updateField("programName", e.target.value)}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Date de début</label>
                  <input type="date" value={data.startDate} onChange={e => updateField("startDate", e.target.value)}
                    style={{ ...inputStyle, colorScheme: "dark" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Semaine actuelle / Total</label>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input type="number" min={1} max={data.totalWeeks} value={data.currentWeek}
                      onChange={e => updateField("currentWeek", Number(e.target.value))}
                      style={{ ...inputStyle, width: "76px", textAlign: "center" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.9rem" }}>/</span>
                    <input type="number" min={1} max={52} value={data.totalWeeks}
                      onChange={e => updateField("totalWeeks", Number(e.target.value))}
                      style={{ ...inputStyle, width: "76px", textAlign: "center" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>Avancement du programme</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: goalColor }}>
                    {Math.round(Math.min((data.currentWeek / Math.max(data.totalWeeks, 1)) * 100, 100))}%
                  </span>
                </div>
                <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min((data.currentWeek / Math.max(data.totalWeeks, 1)) * 100, 100)}%`, background: goalColor, borderRadius: "999px", boxShadow: `0 0 10px ${goalColor}60`, transition: "width 0.4s ease" }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── PROGRAMME ── */}
        {tab === "programme" && (
          <motion.div key="programme" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: easing }}>
            {/* Day selector */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
              {DAYS.map((d, i) => {
                const dtype = data.program[d]?.type ?? "Repos";
                const dcolor = getTypeColor(dtype);
                const isSelected = selectedDay === d;
                return (
                  <button key={d} onClick={() => { setSelectedDay(d); setEditingEx(null); }}
                    style={{
                      padding: "0.5rem 0.9rem", borderRadius: "0.65rem", cursor: "pointer",
                      border: isSelected ? `1px solid ${dcolor}55` : "1px solid rgba(255,255,255,0.08)",
                      background: isSelected ? `${dcolor}15` : "rgba(255,255,255,0.03)",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: isSelected ? dcolor : "rgba(255,255,255,0.45)" }}>
                      {DAY_SHORT[i]}
                    </span>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: dtype === "Repos" ? "rgba(255,255,255,0.15)" : dcolor, boxShadow: dtype !== "Repos" && isSelected ? `0 0 6px ${dcolor}` : "none" }} />
                  </button>
                );
              })}
            </div>

            {/* Day editor card */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.1rem", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.35rem" }}>
                <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.2rem", textTransform: "uppercase", color: "#ffffff" }}>
                  {selectedDay}
                </h2>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: getTypeColor(currentDay.type), background: `${getTypeColor(currentDay.type)}18`, border: `1px solid ${getTypeColor(currentDay.type)}35`, borderRadius: "999px", padding: "0.2rem 0.75rem" }}>
                  {currentDay.type}
                </span>
              </div>

              {/* Session type */}
              <div style={{ marginBottom: "1.35rem" }}>
                <p style={{ ...labelStyle, marginBottom: "0.6rem" }}>Type de séance</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {SESSION_TYPES.map(t => {
                    const tc = getTypeColor(t);
                    const isActive = currentDay.type === t;
                    return (
                      <button key={t} onClick={() => updateDay({ type: t })}
                        style={{
                          padding: "0.35rem 0.85rem", borderRadius: "999px", cursor: "pointer",
                          fontSize: "0.78rem", fontWeight: 700, transition: "all 0.15s",
                          border: isActive ? `1px solid ${tc}50` : "1px solid rgba(255,255,255,0.08)",
                          background: isActive ? `${tc}22` : "rgba(255,255,255,0.03)",
                          color: isActive ? tc : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content only shown when not a rest day */}
              {!isRest && (
                <>
                  {/* Duration */}
                  <div style={{ marginBottom: "1.35rem" }}>
                    <label style={labelStyle}>Durée estimée</label>
                    <input style={{ ...inputStyle, width: "190px" }} placeholder="ex: 60 min"
                      value={currentDay.duration}
                      onChange={e => updateDay({ duration: e.target.value })}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>

                  {/* Muscles */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <p style={{ ...labelStyle, marginBottom: "0.6rem" }}>Groupes musculaires</p>

                    {/* Active chips */}
                    {(currentDay.muscles || []).length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.65rem" }}>
                        {(currentDay.muscles || []).map(m => (
                          <span key={m} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#38bdf8", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: "999px", padding: "0.22rem 0.65rem" }}>
                            {m}
                            <button onClick={() => removeMuscle(m)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "rgba(56,189,248,0.55)", display: "flex", alignItems: "center" }}>
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick-add suggestions */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.55rem" }}>
                      {MUSCLE_SUGGESTIONS.filter(m => !(currentDay.muscles || []).includes(m)).map(m => (
                        <button key={m} onClick={() => addMuscle(m)}
                          style={{ fontSize: "0.71rem", color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "999px", padding: "0.18rem 0.55rem", cursor: "pointer", transition: "all 0.12s" }}
                          onMouseEnter={e => { e.currentTarget.style.color = "#38bdf8"; e.currentTarget.style.borderColor = "rgba(56,189,248,0.3)"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                        >
                          + {m}
                        </button>
                      ))}
                    </div>

                    {/* Custom input */}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input style={{ ...inputStyle, width: "180px", padding: "0.45rem 0.75rem" }} placeholder="Autre muscle…"
                        value={newMuscleDraft} onChange={e => setNewMuscleDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") addMuscle(newMuscleDraft); }}
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                      <button onClick={() => addMuscle(newMuscleDraft)}
                        style={{ padding: "0.45rem 0.8rem", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "0.6rem", color: "#38bdf8", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>

                  {/* Exercises */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                      <p style={labelStyle}>Exercices ({currentDay.exercises?.length ?? 0})</p>
                      <button onClick={addExercise}
                        style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.76rem", fontWeight: 700, color: "#38bdf8", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "0.6rem", padding: "0.38rem 0.85rem", cursor: "pointer" }}
                      >
                        <Plus size={12} /> Ajouter
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                      {(!currentDay.exercises || currentDay.exercises.length === 0) && (
                        <div style={{ textAlign: "center", padding: "2rem", border: "1px dashed rgba(255,255,255,0.07)", borderRadius: "0.85rem", color: "rgba(255,255,255,0.2)", fontSize: "0.85rem" }}>
                          Aucun exercice — cliquez sur &laquo;&nbsp;Ajouter&nbsp;&raquo;
                        </div>
                      )}

                      {(currentDay.exercises || []).map((ex, idx) => (
                        <div key={ex.id}>
                          {editingEx === ex.id ? (
                            /* Edit form */
                            <div style={{ background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "0.9rem", padding: "1rem 1.1rem" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "0.6rem", alignItems: "end", marginBottom: "0.65rem" }}>
                                <div>
                                  <p style={{ ...labelStyle, marginBottom: "0.3rem" }}>Nom de l&apos;exercice</p>
                                  <input autoFocus placeholder="ex: Développé couché" value={ex.name}
                                    onChange={e => updateExercise(ex.id, "name", e.target.value)}
                                    style={{ ...inputStyle, padding: "0.5rem 0.75rem" }}
                                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                                  />
                                </div>
                                <div>
                                  <p style={{ ...labelStyle, marginBottom: "0.3rem", textAlign: "center" }}>Séries</p>
                                  <input type="number" min={1} value={ex.sets} onChange={e => updateExercise(ex.id, "sets", e.target.value)}
                                    style={{ ...inputStyle, width: "64px", textAlign: "center", padding: "0.5rem 0.35rem" }}
                                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                                  />
                                </div>
                                <div>
                                  <p style={{ ...labelStyle, marginBottom: "0.3rem", textAlign: "center" }}>Reps</p>
                                  <input value={ex.reps} onChange={e => updateExercise(ex.id, "reps", e.target.value)}
                                    placeholder="8-12" style={{ ...inputStyle, width: "78px", textAlign: "center", padding: "0.5rem 0.35rem" }}
                                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                                  />
                                </div>
                                <div>
                                  <p style={{ ...labelStyle, marginBottom: "0.3rem", textAlign: "center" }}>Repos</p>
                                  <input value={ex.rest} onChange={e => updateExercise(ex.id, "rest", e.target.value)}
                                    placeholder="90s" style={{ ...inputStyle, width: "78px", textAlign: "center", padding: "0.5rem 0.35rem" }}
                                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                                  />
                                </div>
                              </div>
                              <div style={{ marginBottom: "0.5rem" }}>
                                <input value={ex.note} onChange={e => updateExercise(ex.id, "note", e.target.value)}
                                  placeholder="Note / consigne coach (optionnel)"
                                  style={{ ...inputStyle, padding: "0.5rem 0.75rem" }}
                                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                                />
                              </div>
                              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                <div style={{ flex: 1, position: "relative" }}>
                                  <Link size={13} color="rgba(255,255,255,0.22)" style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                                  <input value={ex.videoUrl ?? ""} onChange={e => updateExercise(ex.id, "videoUrl", e.target.value)}
                                    placeholder="Lien YouTube (optionnel)"
                                    style={{ ...inputStyle, padding: "0.5rem 0.75rem 0.5rem 2.2rem" }}
                                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                                  />
                                </div>
                                <button onClick={() => setEditingEx(null)}
                                  style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem 0.9rem", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.28)", borderRadius: "0.6rem", color: "#4ade80", cursor: "pointer" }}
                                >
                                  <Check size={15} />
                                </button>
                                <button onClick={() => removeExercise(ex.id)}
                                  style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem 0.75rem", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "0.6rem", color: "#f87171", cursor: "pointer" }}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Display row */
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.75rem", padding: "0.75rem 1rem" }}>
                              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.2)", minWidth: "1.2rem", textAlign: "right" }}>
                                {idx + 1}
                              </span>
                              <span style={{ flex: 1, fontSize: "0.88rem", color: ex.name ? "#ffffff" : "rgba(255,255,255,0.22)", fontStyle: ex.name ? "normal" : "italic" }}>
                                {ex.name || "Sans nom"}
                              </span>
                              <span style={{ fontSize: "0.78rem", color: "#38bdf8", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)", borderRadius: "0.4rem", padding: "0.15rem 0.55rem", whiteSpace: "nowrap" }}>
                                {ex.sets}×{ex.reps}
                              </span>
                              {ex.rest && (
                                <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.28)", whiteSpace: "nowrap" }}>{ex.rest}</span>
                              )}
                              {ex.note && (
                                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.22)", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ex.note}</span>
                              )}
                              {ex.videoUrl && (
                                <span title={ex.videoUrl} style={{ display: "flex", alignItems: "center", gap: "0.2rem", fontSize: "0.65rem", color: "#f87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.18)", borderRadius: "0.35rem", padding: "0.12rem 0.4rem", whiteSpace: "nowrap" }}>
                                  <Link size={9} /> Vidéo
                                </span>
                              )}
                              <button onClick={() => setEditingEx(ex.id)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.22)", padding: "0.2rem", transition: "color 0.15s", display: "flex" }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#38bdf8")}
                                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
                              >
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => removeExercise(ex.id)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.18)", padding: "0.2rem", transition: "color 0.15s", display: "flex" }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.18)")}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Rest day message */}
              {isRest && (
                <div style={{ textAlign: "center", padding: "2.5rem", color: "rgba(255,255,255,0.2)", fontSize: "0.88rem" }}>
                  Jour de repos — aucun exercice à configurer
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── DIÈTE ── */}
        {tab === "diete" && (
          <motion.div key="diete" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: easing }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Macros */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.1rem", padding: "1.75rem" }}>
                <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#ffffff", marginBottom: "1.25rem" }}>
                  Objectifs nutritionnels
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: "0.85rem", marginBottom: "1.5rem" }}>
                  {MACRO_FIELDS.map(({ key, label, unit, color }) => (
                    <div key={key} style={{ background: `${color}08`, border: `1px solid ${color}18`, borderRadius: "0.85rem", padding: "1rem 1.1rem" }}>
                      <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginBottom: "0.5rem" }}>{label}</p>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
                        <input
                          type="number" min={0}
                          value={data.diet[key] as number}
                          onChange={e => updateDiet(key, Number(e.target.value))}
                          style={{ background: "transparent", border: "none", borderBottom: `1px solid ${color}45`, outline: "none", color, fontSize: "1.45rem", fontWeight: 700, fontFamily: "var(--font-oswald)", width: "85px", padding: "0.1rem 0" }}
                        />
                        <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.32)" }}>{unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Macro ratio bar */}
                <div>
                  <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", marginBottom: "0.55rem" }}>Répartition calorique estimée</p>
                  {(() => {
                    const pCal = (data.diet.protein as number) * 4;
                    const cCal = (data.diet.carbs as number) * 4;
                    const fCal = (data.diet.fat as number) * 9;
                    const total = pCal + cCal + fCal || 1;
                    const pPct = Math.round((pCal / total) * 100);
                    const cPct = Math.round((cCal / total) * 100);
                    const fPct = Math.round((fCal / total) * 100);
                    return (
                      <>
                        <div style={{ display: "flex", height: "8px", borderRadius: "999px", overflow: "hidden", gap: "2px" }}>
                          <div style={{ flex: pCal, background: "#38bdf8" }} />
                          <div style={{ flex: cCal, background: "#4ade80" }} />
                          <div style={{ flex: fCal, background: "#a78bfa" }} />
                        </div>
                        <div style={{ display: "flex", gap: "1.2rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                          {[["Protéines", "#38bdf8", pPct], ["Glucides", "#4ade80", cPct], ["Lipides", "#a78bfa", fPct]].map(([name, color, pct]) => (
                            <div key={name as string} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: color as string }} />
                              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.32)" }}>{name as string} {pct as number}%</span>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Coach note */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.1rem", padding: "1.75rem" }}>
                <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#ffffff", marginBottom: "1rem" }}>
                  Note du coach
                </p>
                <textarea
                  value={data.diet.coachNote}
                  onChange={e => updateDiet("coachNote", e.target.value)}
                  placeholder="Instructions personnalisées, restrictions alimentaires, conseils spécifiques…"
                  rows={5}
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.65 }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            </div>
          </motion.div>
        )}
        {/* ── PERFORMANCES ── */}
        {tab === "performances" && (
          <motion.div key="performances" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: easing }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* ── Poids ── */}
              <div style={{ background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.12)", borderRadius: "1.1rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                    <Scale size={16} color="#38bdf8" />
                    <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#ffffff" }}>Poids</p>
                  </div>
                  <button onClick={() => setShowWeightInput(v => !v)}
                    style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.38rem 0.85rem", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: "999px", cursor: "pointer", color: "#38bdf8", fontSize: "0.76rem", fontWeight: 700 }}
                  >
                    <Plus size={11} /> Ajouter
                  </button>
                </div>

                {showWeightInput && (
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1rem", background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "0.7rem", padding: "0.65rem 0.9rem" }}>
                    <input autoFocus type="number" step="0.1" placeholder="ex: 72.5" value={newWeightVal}
                      onChange={e => setNewWeightVal(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") addWeight(); if (e.key === "Escape") setShowWeightInput(false); }}
                      style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#38bdf8", fontSize: "1.1rem", fontFamily: "var(--font-oswald)", fontWeight: 700, minWidth: 0 }}
                    />
                    <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>kg</span>
                    <button onClick={addWeight} style={{ padding: "0.35rem 0.85rem", background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.35)", borderRadius: "0.5rem", cursor: "pointer", color: "#38bdf8", fontSize: "0.78rem", fontWeight: 700 }}>
                      <Check size={12} />
                    </button>
                    <button onClick={() => setShowWeightInput(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)" }}><X size={13} /></button>
                  </div>
                )}

                {weightHistory.length === 0 ? (
                  <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "1rem 0" }}>Aucune entrée — cliquez Ajouter pour commencer</p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
                    {weightHistory.map((e, i) => (
                      <span key={i} style={{ fontSize: "0.75rem", color: i === weightHistory.length - 1 ? "#38bdf8" : "rgba(255,255,255,0.35)", background: i === weightHistory.length - 1 ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${i === weightHistory.length - 1 ? "rgba(56,189,248,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: "999px", padding: "0.22rem 0.7rem" }}>
                        {e.label} · {e.value} kg
                      </span>
                    ))}
                    <button onClick={deleteLastWeight} title="Supprimer la dernière entrée"
                      style={{ background: "none", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "999px", padding: "0.22rem 0.55rem", cursor: "pointer", color: "rgba(248,113,113,0.5)", fontSize: "0.7rem", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.5)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "rgba(248,113,113,0.5)"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.2)"; }}
                    >
                      <X size={11} />
                    </button>
                  </div>
                )}
              </div>

              {/* ── Charges ── */}
              <div style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.12)", borderRadius: "1.1rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "1.1rem" }}>
                  <Dumbbell size={16} color="#a78bfa" />
                  <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#ffffff" }}>Charges d&apos;entraînement</p>
                </div>
                {(() => {
                  const seen = new Set<string>();
                  const exs = Object.values(data.program)
                    .filter(d => d.type !== "Repos" && d.exercises?.length > 0)
                    .flatMap(d => d.exercises)
                    .filter(ex => {
                      const k = ex.name.trim().toLowerCase();
                      if (!k || seen.has(k)) return false;
                      seen.add(k); return true;
                    });
                  if (exs.length === 0) return <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "1rem 0" }}>Aucun exercice dans le programme — configurez d&apos;abord l&apos;onglet Programme</p>;
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {exs.map(ex => (
                        <div key={ex.id} style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ex.name}</span>
                          <div>
                            <label style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "0.2rem" }}>Charge (kg)</label>
                            <input type="number" step="0.5" min="0"
                              value={exWeights[ex.id] ?? ""}
                              placeholder="0"
                              onChange={e => saveExWeight(ex.id, e.target.value)}
                              style={{ width: "100%", background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "0.45rem", padding: "0.35rem 0.55rem", color: "#a78bfa", fontSize: "0.95rem", fontWeight: 700, fontFamily: "var(--font-oswald)", outline: "none", textAlign: "center" }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "0.2rem" }}>PR (kg)</label>
                            <input type="number" step="0.5" min="0"
                              value={exPrs[ex.id] ?? ""}
                              placeholder="—"
                              onChange={e => {
                                const val = parseFloat(e.target.value.replace(",", "."));
                                const newPrs = { ...exPrs, [ex.id]: isNaN(val) ? 0 : val };
                                setExPrs(newPrs);
                                localStorage.setItem("bp_exercise_prs", JSON.stringify(newPrs));
                              }}
                              style={{ width: "100%", background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: "0.45rem", padding: "0.35rem 0.55rem", color: "#fb923c", fontSize: "0.95rem", fontWeight: 700, fontFamily: "var(--font-oswald)", outline: "none", textAlign: "center" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* ── Mensurations ── */}
              <div style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)", borderRadius: "1.1rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "1.1rem" }}>
                  <Ruler size={16} color="#4ade80" />
                  <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#ffffff" }}>Mensurations</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", gap: "0.5rem 0.75rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Mensuration</span>
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>Départ</span>
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>Actuel</span>
                  {MEASURE_DEFS.map(m => {
                    const d = measures[m.id] ?? { before: null, current: null };
                    return (
                      <>
                        <span key={`lbl-${m.id}`} style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.5)", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>{m.label}</span>
                        {(["before", "current"] as const).map(field => (
                          <div key={`${m.id}-${field}`} style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "0.3rem 0" }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "0.2rem" }}>
                              <input type="number" step="0.1" min="0"
                                value={d[field] ?? ""}
                                placeholder="—"
                                onChange={e => saveMeasure(m.id, field, e.target.value)}
                                style={{ width: "60px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.18)", borderRadius: "0.4rem", padding: "0.3rem 0.4rem", color: "#4ade80", fontSize: "0.9rem", fontWeight: 700, fontFamily: "var(--font-oswald)", outline: "none", textAlign: "center" }}
                              />
                              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)" }}>{m.unit}</span>
                            </div>
                          </div>
                        ))}
                      </>
                    );
                  })}
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Save toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            style={{ position: "fixed", bottom: "2rem", right: "2rem", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.35)", borderRadius: "0.85rem", padding: "0.65rem 1.15rem", display: "flex", alignItems: "center", gap: "0.5rem", backdropFilter: "blur(16px)", zIndex: 200 }}
          >
            <Check size={14} color="#4ade80" />
            <span style={{ fontSize: "0.82rem", color: "#4ade80", fontWeight: 700 }}>Modifications enregistrées</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
