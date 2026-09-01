"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, X, Link, Play, Pencil } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;

const SESSION_TYPES = ["Push", "Pull", "Legs", "Full Body", "Cardio", "Haut du corps", "Bas du corps", "Custom"];
const MUSCLE_SUGGESTIONS = ["Pectoraux", "Épaules", "Triceps", "Biceps", "Dos", "Abdos", "Quadriceps", "Ischio", "Fessiers", "Mollets", "Avant-bras"];

const TYPE_COLORS: Record<string, string> = {
  Push: "#38bdf8", Pull: "#a78bfa", Legs: "#4ade80",
  "Full Body": "#fb923c", Cardio: "#facc15",
  "Haut du corps": "#f87171", "Bas du corps": "#34d399", Custom: "#e879f9",
};

type LibExercise = {
  id: string;
  name: string;
  type: string;
  muscles: string[];
  description: string;
  videoUrl: string;
};

const DEFAULT_EXERCISES: Omit<LibExercise, "id">[] = [
  { name: "Développé couché incliné", type: "Push", muscles: ["Pectoraux", "Épaules", "Triceps"], description: "Allongé sur un banc incliné à 30–45°, descends la barre jusqu'à effleurer le haut de la poitrine. Pousse en contractant les pectoraux. Maintiens les coudes à ~75° du corps pour protéger les épaules.", videoUrl: "" },
  { name: "Chest Press",              type: "Push", muscles: ["Pectoraux", "Triceps"],              description: "Assis sur la machine, dos bien plaqué au dossier. Pousse les poignées en avant jusqu'à extension quasi-complète des bras, sans verrouiller les coudes. Reviens lentement en contrôlant l'excentrique.", videoUrl: "" },
  { name: "Développé militaire",      type: "Push", muscles: ["Épaules", "Triceps"],               description: "Debout ou assis, barre au niveau des épaules, prise légèrement plus large que les épaules. Pousse verticalement jusqu'à extension complète. Contracte les fessiers et les abdos tout au long du mouvement.", videoUrl: "" },
  { name: "Élévations latérales",     type: "Push", muscles: ["Épaules"],                          description: "Debout, haltères le long du corps. Monte les bras latéralement jusqu'à l'horizontale, légère rotation externe du poignet (petit doigt vers le haut). Descends en 3 secondes pour maximiser le temps sous tension.", videoUrl: "" },
  { name: "Dips",                     type: "Push", muscles: ["Pectoraux", "Triceps"],              description: "Aux barres parallèles, descends jusqu'à ce que les coudes soient à 90°. Corps légèrement penché en avant pour cibler les pectoraux. Pousse pour revenir. Ajoute du lest si les reps sont trop faciles.", videoUrl: "" },
  { name: "Tirage à la corde",        type: "Push", muscles: ["Triceps"],                          description: "Poulie haute avec corde. Coudes fléchis à 90°, mains devant le front. Tire vers le bas en écartant la corde de chaque côté du corps à hauteur des cuisses. Coudes collés au corps pendant le mouvement.", videoUrl: "" },
  { name: "Traction",                 type: "Pull", muscles: ["Dos", "Biceps"],                    description: "Barre fixe, prise pronation large. Depuis la position suspendue, tire le corps vers le haut en ramenant les coudes vers le bas et les hanches. La poitrine doit toucher ou frôler la barre. Descente contrôlée.", videoUrl: "" },
  { name: "Tirage vertical",          type: "Pull", muscles: ["Dos"],                              description: "Assis à la machine, prise large. Tire la barre vers le haut du buste en gardant le dos légèrement incliné en arrière. Coudes qui descendent vers les hanches. Contracte le grand dorsal en bas du mouvement.", videoUrl: "" },
  { name: "Curl marteau",             type: "Pull", muscles: ["Biceps"],                           description: "Debout, haltères en prise neutre (pouce vers le haut). Fléchis les avant-bras alternativement ou simultanément. Ce mouvement cible le brachial et le long supinateur en plus du biceps.", videoUrl: "" },
  { name: "Curl pupitre",             type: "Pull", muscles: ["Biceps"],                           description: "Assis au pupitre, avant-bras posés sur le coussin. Soulève la barre en contractant les biceps. L'isolation est totale — ne triche pas avec le corps. Descends lentement jusqu'à extension quasi-complète.", videoUrl: "" },
  { name: "Squat",                    type: "Legs", muscles: ["Quadriceps", "Fessiers"],           description: "Barre sur le dos (squat basse barre ou haute barre selon confort). Pieds à largeur des épaules, orteils légèrement écartés. Descends jusqu'à ce que les cuisses soient parallèles ou en dessous. Pousse à travers les talons.", videoUrl: "" },
  { name: "Leg Extension",            type: "Legs", muscles: ["Quadriceps"],                       description: "Machine leg extension. Assure-toi que l'axe de rotation est aligné avec le genou. Monte jusqu'à extension complète et tiens 1s en haut. Descends lentement en 2–3s pour isoler parfaitement les quadriceps.", videoUrl: "" },
  { name: "Planche",                  type: "Legs", muscles: ["Abdos"],                            description: "Appui sur les avant-bras et les orteils. Corps parfaitement aligné de la tête aux talons. Contracte les abdos, les fessiers et les quadriceps simultanément. Respire régulièrement. Ne laisse pas les hanches s'affaisser.", videoUrl: "" },
];

function genId() { return Math.random().toString(36).slice(2, 9); }

function getYoutubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m?.[1] ?? null;
}

function loadLib(): LibExercise[] {
  try { return JSON.parse(localStorage.getItem("bp_exercise_library") || "null") ?? []; }
  catch { return []; }
}

function saveLib(lib: LibExercise[]) {
  localStorage.setItem("bp_exercise_library", JSON.stringify(lib));
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "0.6rem", padding: "0.65rem 0.9rem", color: "#ffffff", fontSize: "0.88rem", outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em",
  textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: "0.4rem",
};

export default function CoachExercisesPage() {
  const [library, setLibrary] = useState<LibExercise[]>([]);
  const [editing, setEditing] = useState<LibExercise | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newDraft, setNewDraft] = useState({ name: "", type: "Push", muscles: [] as string[], description: "", videoUrl: "" });
  const [newMuscleDraft, setNewMuscleDraft] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadLib();
    if (saved.length === 0) {
      // Seed with default exercises
      const seeded = DEFAULT_EXERCISES.map(e => ({ id: genId(), ...e }));
      saveLib(seeded);
      setLibrary(seeded);
    } else {
      setLibrary(saved);
    }
  }, []);

  function updateVideoUrl(id: string, url: string) {
    const updated = library.map(ex => ex.id === id ? { ...ex, videoUrl: url } : ex);
    saveLib(updated);
    setLibrary(updated);
    if (editing?.id === id) setEditing(ex => ex ? { ...ex, videoUrl: url } : ex);
  }

  function saveEdit(ex: LibExercise) {
    const updated = library.map(e => e.id === ex.id ? ex : e);
    saveLib(updated);
    setLibrary(updated);
    setEditing(null);
  }

  function deleteExercise(id: string) {
    const updated = library.filter(ex => ex.id !== id);
    saveLib(updated);
    setLibrary(updated);
    setConfirmDelete(null);
    if (editing?.id === id) setEditing(null);
  }

  function addNew() {
    if (!newDraft.name.trim()) return;
    const ex: LibExercise = { id: genId(), ...newDraft, name: newDraft.name.trim() };
    const updated = [...library, ex];
    saveLib(updated);
    setLibrary(updated);
    setShowNew(false);
    setNewDraft({ name: "", type: "Push", muscles: [], description: "", videoUrl: "" });
    setNewMuscleDraft("");
  }

  const byType = SESSION_TYPES.map(t => ({ type: t, exercises: library.filter(e => e.type === t) })).filter(g => g.exercises.length > 0);
  const ytId = editing?.videoUrl ? getYoutubeId(editing.videoUrl) : null;
  const editColor = editing ? (TYPE_COLORS[editing.type] ?? "#38bdf8") : "#38bdf8";

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easing }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}
        >
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.4rem" }}>Bibliothèque</p>
            <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>Exercices</h1>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", marginTop: "0.4rem" }}>
              {library.filter(e => e.videoUrl).length}/{library.length} vidéos ajoutées
            </p>
          </div>
          <button onClick={() => setShowNew(true)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: "0.8rem", padding: "0.65rem 1.2rem", borderRadius: "999px", cursor: "pointer" }}
          >
            <Plus size={14} /> Nouvel exercice
          </button>
        </motion.div>

        {/* Grouped by type */}
        {byType.map(({ type, exercises }) => {
          const c = TYPE_COLORS[type] ?? "#38bdf8";
          return (
            <motion.div key={type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: easing }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.85rem" }}>
                <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em", color: c, textShadow: `0 0 16px ${c}50` }}>{type}</span>
                <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, ${c}30, transparent)` }} />
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)" }}>{exercises.filter(e => e.videoUrl).length}/{exercises.length} vidéos</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.7rem" }}>
                {exercises.map(ex => {
                  const ytThumb = ex.videoUrl ? getYoutubeId(ex.videoUrl) : null;
                  return (
                    <div key={ex.id}
                      style={{ background: `linear-gradient(145deg, ${c}08 0%, rgba(255,255,255,0.02) 60%)`, border: `1px solid ${ex.videoUrl ? `${c}30` : "rgba(255,255,255,0.08)"}`, borderRadius: "0.9rem", overflow: "hidden", position: "relative", transition: "border-color 0.2s" }}
                    >
                      {/* Thumbnail if video exists */}
                      {ytThumb && (
                        <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                          <img src={`https://img.youtube.com/vi/${ytThumb}/mqdefault.jpg`} alt={ex.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.3)" }}>
                              <Play size={15} color="#ffffff" style={{ transform: "translateX(1px)" }} />
                            </div>
                          </div>
                        </div>
                      )}

                      <div style={{ padding: "0.8rem 0.95rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.55rem" }}>
                          <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#ffffff", lineHeight: 1.2, flex: 1 }}>{ex.name}</p>
                          <div style={{ display: "flex", gap: "0.2rem" }}>
                            <button onClick={() => setEditing({ ...ex })}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: "0.2rem", color: "rgba(255,255,255,0.2)", display: "flex", transition: "color 0.15s" }}
                              onMouseEnter={e => (e.currentTarget.style.color = "#38bdf8")}
                              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
                            >
                              <Pencil size={12} />
                            </button>
                            <button onClick={() => setConfirmDelete(ex.id)}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: "0.2rem", color: "rgba(255,255,255,0.15)", display: "flex", transition: "color 0.15s" }}
                              onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.15)")}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Inline video URL input */}
                        <div style={{ position: "relative" }}>
                          <Link size={11} color={ex.videoUrl ? c : "rgba(255,255,255,0.2)"} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                          <input
                            value={ex.videoUrl}
                            onChange={e => updateVideoUrl(ex.id, e.target.value)}
                            placeholder="Coller un lien YouTube…"
                            style={{ width: "100%", background: ex.videoUrl ? `${c}0a` : "rgba(255,255,255,0.03)", border: `1px solid ${ex.videoUrl ? `${c}30` : "rgba(255,255,255,0.07)"}`, borderRadius: "0.5rem", padding: "0.45rem 0.65rem 0.45rem 2rem", color: ex.videoUrl ? "#ffffff" : "rgba(255,255,255,0.3)", fontSize: "0.76rem", outline: "none", boxSizing: "border-box", transition: "all 0.15s" }}
                            onFocus={e => { e.currentTarget.style.borderColor = `${c}50`; e.currentTarget.style.background = `${c}0e`; }}
                            onBlur={e => { e.currentTarget.style.borderColor = ex.videoUrl ? `${c}30` : "rgba(255,255,255,0.07)"; e.currentTarget.style.background = ex.videoUrl ? `${c}0a` : "rgba(255,255,255,0.03)"; }}
                          />
                        </div>

                        {/* Delete confirm */}
                        {confirmDelete === ex.id && (
                          <div style={{ marginTop: "0.6rem", padding: "0.6rem", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.18)", borderRadius: "0.5rem", display: "flex", gap: "0.4rem" }}>
                            <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.4rem", padding: "0.35rem", color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", cursor: "pointer" }}>Annuler</button>
                            <button onClick={() => deleteExercise(ex.id)} style={{ flex: 1, background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: "0.4rem", padding: "0.35rem", color: "#f87171", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer" }}>Supprimer</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(4,8,18,0.85)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
            onClick={() => setEditing(null)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: easing }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "580px", maxHeight: "90vh", overflowY: "auto", background: `linear-gradient(145deg, ${editColor}0e 0%, rgba(7,12,22,0.98) 55%)`, backdropFilter: "blur(40px)", border: `1px solid ${editColor}28`, borderRadius: "1.5rem", boxShadow: `0 40px 100px rgba(0,0,0,0.65), inset 0 1px 0 ${editColor}25`, position: "relative", overflow: "hidden" }}
            >
              <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${editColor}60, rgba(255,255,255,0.3), ${editColor}60, transparent)`, pointerEvents: "none" }} />

              <div style={{ padding: "1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.35rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>{editing.name}</h2>
                  <button onClick={() => setEditing(null)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
                    <X size={13} />
                  </button>
                </div>

                {/* Video URL */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>Lien YouTube</label>
                  <div style={{ position: "relative" }}>
                    <Link size={13} color="rgba(255,255,255,0.22)" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    <input value={editing.videoUrl} onChange={e => setEditing(ex => ex ? { ...ex, videoUrl: e.target.value } : ex)}
                      placeholder="https://youtube.com/watch?v=…"
                      style={{ ...inputStyle, paddingLeft: "2.4rem" }}
                      onFocus={e => (e.currentTarget.style.borderColor = `${editColor}60`)}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>
                  {ytId && (
                    <div style={{ marginTop: "0.75rem", borderRadius: "0.85rem", overflow: "hidden", border: `1px solid ${editColor}25` }}>
                      <iframe src={`https://www.youtube.com/embed/${ytId}`} title={editing.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen style={{ width: "100%", height: 230, border: "none", display: "block" }}
                      />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Nom</label>
                  <input value={editing.name} onChange={e => setEditing(ex => ex ? { ...ex, name: e.target.value } : ex)}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = `${editColor}60`)}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                {/* Description */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>Description technique</label>
                  <textarea value={editing.description} onChange={e => setEditing(ex => ex ? { ...ex, description: e.target.value } : ex)}
                    rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
                    onFocus={e => (e.currentTarget.style.borderColor = `${editColor}60`)}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                <button onClick={() => saveEdit(editing)} disabled={!editing.name.trim()}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", padding: "0.8rem", background: "linear-gradient(135deg, #38bdf8, #0ea5e9)", border: "none", borderRadius: "0.75rem", color: "#03090f", fontWeight: 800, fontSize: "0.88rem", cursor: "pointer", boxShadow: "0 4px 20px rgba(56,189,248,0.35)" }}
                >
                  <Check size={15} /> Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New exercise modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(4,8,18,0.85)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
            onClick={() => setShowNew(false)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: easing }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto", background: "linear-gradient(145deg, rgba(56,189,248,0.07) 0%, rgba(7,12,22,0.98) 55%)", backdropFilter: "blur(40px)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "1.5rem", boxShadow: "0 40px 100px rgba(0,0,0,0.65), inset 0 1px 0 rgba(56,189,248,0.2)", position: "relative", overflow: "hidden" }}
            >
              <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.5), rgba(255,255,255,0.3), rgba(56,189,248,0.5), transparent)", pointerEvents: "none" }} />
              <div style={{ padding: "1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.3rem", textTransform: "uppercase", color: "#ffffff" }}>Nouvel exercice</h2>
                  <button onClick={() => setShowNew(false)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
                    <X size={13} />
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Nom *</label>
                    <input autoFocus value={newDraft.name} onChange={e => setNewDraft(d => ({ ...d, name: e.target.value }))}
                      placeholder="ex: Développé couché" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Catégorie</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {SESSION_TYPES.map(t => {
                        const c = TYPE_COLORS[t] ?? "#38bdf8";
                        const active = newDraft.type === t;
                        return (
                          <button key={t} type="button" onClick={() => setNewDraft(d => ({ ...d, type: t }))}
                            style={{ padding: "0.28rem 0.7rem", borderRadius: "999px", border: `1px solid ${active ? `${c}55` : "rgba(255,255,255,0.08)"}`, background: active ? `${c}18` : "transparent", color: active ? c : "rgba(255,255,255,0.35)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Muscles</label>
                    {newDraft.muscles.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.4rem" }}>
                        {newDraft.muscles.map(m => (
                          <span key={m} style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: "#38bdf8", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.22)", borderRadius: "999px", padding: "0.15rem 0.55rem" }}>
                            {m} <button onClick={() => setNewDraft(d => ({ ...d, muscles: d.muscles.filter(x => x !== m) }))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "rgba(56,189,248,0.5)", display: "flex" }}><X size={9} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "0.4rem" }}>
                      {MUSCLE_SUGGESTIONS.filter(m => !newDraft.muscles.includes(m)).map(m => (
                        <button key={m} type="button" onClick={() => setNewDraft(d => d.muscles.includes(m) ? d : { ...d, muscles: [...d.muscles, m] })}
                          style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.32)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "999px", padding: "0.14rem 0.5rem", cursor: "pointer" }}
                        >
                          + {m}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <input value={newMuscleDraft} onChange={e => setNewMuscleDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (newMuscleDraft.trim()) { setNewDraft(d => ({ ...d, muscles: [...d.muscles, newMuscleDraft.trim()] })); setNewMuscleDraft(""); } } }}
                        placeholder="Autre muscle…" style={{ ...inputStyle, padding: "0.45rem 0.75rem", flex: 1 }}
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                      <button type="button" onClick={() => { if (newMuscleDraft.trim()) { setNewDraft(d => ({ ...d, muscles: [...d.muscles, newMuscleDraft.trim()] })); setNewMuscleDraft(""); } }}
                        style={{ padding: "0.45rem 0.8rem", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "0.55rem", color: "#38bdf8", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                      >+</button>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Lien YouTube</label>
                    <div style={{ position: "relative" }}>
                      <Link size={13} color="rgba(255,255,255,0.22)" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                      <input value={newDraft.videoUrl} onChange={e => setNewDraft(d => ({ ...d, videoUrl: e.target.value }))}
                        placeholder="https://youtube.com/watch?v=…" style={{ ...inputStyle, paddingLeft: "2.4rem" }}
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Description technique</label>
                    <textarea value={newDraft.description} onChange={e => setNewDraft(d => ({ ...d, description: e.target.value }))}
                      rows={3} placeholder="Décris la technique étape par étape…" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                  <button onClick={() => setShowNew(false)}
                    style={{ flex: 1, padding: "0.7rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.7rem", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", cursor: "pointer" }}
                  >
                    Annuler
                  </button>
                  <button onClick={addNew} disabled={!newDraft.name.trim()}
                    style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.7rem", background: newDraft.name.trim() ? "linear-gradient(135deg, #38bdf8, #0ea5e9)" : "rgba(255,255,255,0.05)", border: "none", borderRadius: "0.7rem", color: newDraft.name.trim() ? "#03090f" : "rgba(255,255,255,0.2)", fontWeight: 800, fontSize: "0.85rem", cursor: newDraft.name.trim() ? "pointer" : "not-allowed" }}
                  >
                    <Check size={14} /> Ajouter
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
