"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Search, Clock, RotateCcw, X, Play, ChevronRight } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;

const TYPE_COLORS: Record<string, string> = {
  Push:            "#38bdf8",
  Pull:            "#a78bfa",
  Legs:            "#4ade80",
  "Full Body":     "#fb923c",
  Cardio:          "#facc15",
  "Haut du corps": "#f87171",
  "Bas du corps":  "#34d399",
  Custom:          "#e879f9",
};

type Exercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  note: string;
  description: string;
  videoUrl: string | null;
  type: string;
  muscles: string[];
};

type RawClient = {
  program?: Record<string, {
    type?: string;
    muscles?: string[];
    exercises?: { name: string; sets: string | number; reps: string; rest?: string; note?: string; description?: string; videoUrl?: string | null }[];
  }>;
};

// Static exercise library (Thomas's programme)
const STATIC_EXERCISES: Exercise[] = [
  {
    name: "Développé couché incliné", type: "Push", muscles: ["Pecs", "Épaules", "Triceps"],
    sets: "4", reps: "8-10", rest: "2 min",
    note: "Augmenter de 2.5 kg si les 4×10 sont faits proprement.",
    description: "Allongé sur un banc incliné à 30–45°, descends la barre jusqu'à effleurer le haut de la poitrine. Pousse en contractant les pectoraux. Maintiens les coudes à ~75° du corps pour protéger les épaules.",
    videoUrl: null,
  },
  {
    name: "Chest Press", type: "Push", muscles: ["Pecs", "Triceps"],
    sets: "3", reps: "10-12", rest: "90 s",
    note: "",
    description: "Assis sur la machine, dos bien plaqué au dossier. Pousse les poignées en avant jusqu'à extension quasi-complète des bras, sans verrouiller les coudes. Reviens lentement en contrôlant l'excentrique.",
    videoUrl: null,
  },
  {
    name: "Développé militaire", type: "Push", muscles: ["Épaules", "Triceps"],
    sets: "4", reps: "8-10", rest: "2 min",
    note: "Focus sur le gainage — ne cambre pas le bas du dos.",
    description: "Debout ou assis, barre au niveau des épaules, prise légèrement plus large que les épaules. Pousse verticalement jusqu'à extension complète. Contracte les fessiers et les abdos tout au long du mouvement.",
    videoUrl: null,
  },
  {
    name: "Élévations latérales", type: "Push", muscles: ["Épaules"],
    sets: "4", reps: "12-15", rest: "60 s",
    note: "Poids léger, tempo lent. La qualité prime.",
    description: "Debout, haltères le long du corps. Monte les bras latéralement jusqu'à l'horizontale, légère rotation externe du poignet (petit doigt vers le haut). Descends en 3 secondes pour maximiser le temps sous tension.",
    videoUrl: null,
  },
  {
    name: "Dips", type: "Push", muscles: ["Pecs", "Triceps"],
    sets: "3", reps: "10-12", rest: "90 s",
    note: "",
    description: "Aux barres parallèles, descends jusqu'à ce que les coudes soient à 90°. Corps légèrement penché en avant pour cibler les pectoraux. Pousse pour revenir. Ajoute du lest si les reps sont trop faciles.",
    videoUrl: null,
  },
  {
    name: "Tirage à la corde", type: "Push", muscles: ["Triceps"],
    sets: "3", reps: "12-15", rest: "60 s",
    note: "Écarte bien la corde en bas pour maximiser la contraction.",
    description: "Poulie haute avec corde. Coudes fléchis à 90°, mains devant le front. Tire vers le bas en écartant la corde de chaque côté du corps à hauteur des cuisses. Coudes collés au corps pendant le mouvement.",
    videoUrl: null,
  },
  {
    name: "Traction", type: "Pull", muscles: ["Dos", "Biceps"],
    sets: "4", reps: "6-8", rest: "2 min",
    note: "Prise large, ramène la poitrine vers la barre.",
    description: "Barre fixe, prise pronation large. Depuis la position suspendue, tire le corps vers le haut en ramenant les coudes vers le bas et les hanches. La poitrine doit toucher ou frôler la barre. Descente contrôlée.",
    videoUrl: null,
  },
  {
    name: "Tirage vertical", type: "Pull", muscles: ["Dos"],
    sets: "3", reps: "10-12", rest: "90 s",
    note: "",
    description: "Assis à la machine, prise large. Tire la barre vers le haut du buste en gardant le dos légèrement incliné en arrière. Coudes qui descendent vers les hanches. Contracte le grand dorsal en bas du mouvement.",
    videoUrl: null,
  },
  {
    name: "Curl marteau", type: "Pull", muscles: ["Biceps"],
    sets: "4", reps: "10-12", rest: "75 s",
    note: "",
    description: "Debout, haltères en prise neutre (pouce vers le haut). Fléchis les avant-bras alternativement ou simultanément. Ce mouvement cible le brachial et le long supinateur en plus du biceps.",
    videoUrl: null,
  },
  {
    name: "Curl pupitre", type: "Pull", muscles: ["Biceps"],
    sets: "3", reps: "10-12", rest: "75 s",
    note: "Extension complète en bas du mouvement.",
    description: "Assis au pupitre, avant-bras posés sur le coussin. Soulève la barre en contractant les biceps. L'isolation est totale — ne triche pas avec le corps. Descends lentement jusqu'à extension quasi-complète.",
    videoUrl: null,
  },
  {
    name: "Squat", type: "Legs", muscles: ["Quadriceps", "Fessiers"],
    sets: "4", reps: "6-8", rest: "3 min",
    note: "Charger lourd cette semaine.",
    description: "Barre sur le dos (squat basse barre ou haute barre selon confort). Pieds à largeur des épaules, orteils légèrement écartés. Descends jusqu'à ce que les cuisses soient parallèles ou en dessous. Pousse à travers les talons.",
    videoUrl: null,
  },
  {
    name: "Leg Extension", type: "Legs", muscles: ["Quadriceps"],
    sets: "4", reps: "12-15", rest: "90 s",
    note: "Contraction longue tenue en haut.",
    description: "Machine leg extension. Assure-toi que l'axe de rotation est aligné avec le genou. Monte jusqu'à extension complète et tiens 1s en haut. Descends lentement en 2–3s pour isoler parfaitement les quadriceps.",
    videoUrl: null,
  },
  {
    name: "Planche", type: "Legs", muscles: ["Abdos"],
    sets: "3", reps: "45-60 s", rest: "60 s",
    note: "",
    description: "Appui sur les avant-bras et les orteils. Corps parfaitement aligné de la tête aux talons. Contracte les abdos, les fessiers et les quadriceps simultanément. Respire régulièrement. Ne laisse pas les hanches s'affaisser.",
    videoUrl: null,
  },
];

function loadJSON<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
}

function loadExercisesFromStorage(): Exercise[] | null {
  const exs: Exercise[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith("bp_coach_client_") || key === "bp_coach_clients") continue;
    const client = loadJSON<RawClient | null>(key, null);
    if (!client?.program) continue;
    for (const [, day] of Object.entries(client.program)) {
      if (!day.exercises?.length || !day.type || day.type === "Repos") continue;
      for (const ex of day.exercises) {
        if (!ex.name) continue;
        exs.push({
          name: ex.name,
          sets: String(ex.sets ?? ""),
          reps: ex.reps ?? "",
          rest: ex.rest ?? "",
          note: ex.note ?? "",
          description: ex.description ?? "",
          videoUrl: ex.videoUrl ?? null,
          type: day.type,
          muscles: day.muscles ?? [],
        });
      }
    }
    if (exs.length > 0) break;
  }
  return exs.length > 0 ? exs : null;
}

function getYoutubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m?.[1] ?? null;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string | null>(null);
  const [selected, setSelected] = useState<Exercise | null>(null);

  useEffect(() => {
    // 1. Coach library takes priority
    try {
      const lib = JSON.parse(localStorage.getItem("bp_exercise_library") || "[]") as Array<{
        id: string; name: string; type: string; muscles: string[];
        description: string; videoUrl: string;
      }>;
      if (lib.length > 0) {
        setExercises(lib.map(e => ({
          name: e.name, type: e.type, muscles: e.muscles,
          sets: "", reps: "", rest: "", note: "",
          description: e.description, videoUrl: e.videoUrl || null,
        })));
        return;
      }
    } catch { /* */ }
    // 2. Exercises embedded in client programme
    const fromStorage = loadExercisesFromStorage();
    setExercises(fromStorage ?? STATIC_EXERCISES);
  }, []);

  const types = Array.from(new Set(exercises.map(e => e.type)));

  const filtered = exercises
    .filter(ex => {
      const matchType = !activeType || ex.type === activeType;
      const q = search.toLowerCase();
      const matchSearch = !q || ex.name.toLowerCase().includes(q) || ex.muscles.some(m => m.toLowerCase().includes(q));
      return matchType && matchSearch;
    })
    .filter((ex, idx, arr) => arr.findIndex(e => e.name === ex.name) === idx);

  const color = selected ? (TYPE_COLORS[selected.type] ?? "#38bdf8") : "#38bdf8";
  const ytId = selected?.videoUrl ? getYoutubeId(selected.videoUrl) : null;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easing }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a78bfa", marginBottom: "0.4rem" }}>Mon programme</p>
          <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", textTransform: "uppercase", color: "#ffffff", lineHeight: 1, marginBottom: "0.5rem" }}>
            Exercices
          </h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)" }}>{exercises.filter((e, i, a) => a.findIndex(x => x.name === e.name) === i).length} exercices — clique pour voir la technique</p>
        </motion.div>

        {/* Search + filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: easing, delay: 0.06 }}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <div style={{ position: "relative" }}>
            <Search size={14} color="rgba(255,255,255,0.25)" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un exercice ou un muscle…"
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "0.75rem", padding: "0.7rem 0.9rem 0.7rem 2.5rem", color: "#ffffff", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: "0.8rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center" }}>
                <RotateCcw size={13} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            <button onClick={() => setActiveType(null)}
              style={{ padding: "0.3rem 0.8rem", borderRadius: "999px", border: `1px solid ${!activeType ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}`, background: !activeType ? "rgba(255,255,255,0.08)" : "transparent", color: !activeType ? "#ffffff" : "rgba(255,255,255,0.35)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
            >
              Tous
            </button>
            {types.map(t => {
              const c = TYPE_COLORS[t] ?? "#38bdf8";
              const active = activeType === t;
              return (
                <button key={t} onClick={() => setActiveType(active ? null : t)}
                  style={{ padding: "0.3rem 0.8rem", borderRadius: "999px", border: `1px solid ${active ? `${c}50` : "rgba(255,255,255,0.08)"}`, background: active ? `${c}14` : "transparent", color: active ? c : "rgba(255,255,255,0.35)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(255,255,255,0.25)" }}>
            <Dumbbell size={32} style={{ margin: "0 auto 0.75rem", display: "block" }} />
            <p>Aucun exercice trouvé</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.8rem" }}>
            {filtered.map((ex, i) => {
              const c = TYPE_COLORS[ex.type] ?? "#38bdf8";
              return (
                <motion.button key={`${ex.name}-${i}`}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: easing, delay: i * 0.04 }}
                  onClick={() => setSelected(ex)}
                  style={{ textAlign: "left", cursor: "pointer", background: `linear-gradient(145deg, ${c}0a 0%, rgba(255,255,255,0.02) 60%)`, border: `1px solid ${c}1e`, borderRadius: "1rem", padding: "1.1rem 1.15rem", position: "relative", overflow: "hidden", transition: "all 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${c}40`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${c}14`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${c}1e`; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >
                  <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: `linear-gradient(to right, transparent, ${c}45, rgba(255,255,255,0.2), ${c}45, transparent)`, pointerEvents: "none" }} />

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: c, background: `${c}14`, border: `1px solid ${c}28`, borderRadius: "999px", padding: "0.12rem 0.55rem" }}>
                      {ex.type}
                    </span>
                    {ex.rest && (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>
                        <Clock size={9} /> {ex.rest}
                      </span>
                    )}
                  </div>

                  <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#ffffff", marginBottom: "0.45rem", lineHeight: 1.25 }}>{ex.name}</p>

                  {ex.muscles.length > 0 && (
                    <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
                      {ex.muscles.map(m => (
                        <span key={m} style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.32)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "999px", padding: "0.1rem 0.45rem" }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Dumbbell size={11} color={c} />
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: c }}>
                        {ex.sets && ex.reps ? `${ex.sets} × ${ex.reps}` : ex.sets || ex.reps}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>
                      Voir <ChevronRight size={11} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(4,8,18,0.82)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.28, ease: easing }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", background: `linear-gradient(145deg, ${color}0e 0%, rgba(7,12,22,0.98) 55%)`, backdropFilter: "blur(40px)", border: `1px solid ${color}28`, borderRadius: "1.5rem", boxShadow: `0 40px 100px rgba(0,0,0,0.65), 0 0 60px ${color}12, inset 0 1px 0 ${color}25`, position: "relative", overflow: "hidden" }}
            >
              <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${color}60, rgba(255,255,255,0.35), ${color}60, transparent)`, pointerEvents: "none" }} />

              <div style={{ padding: "1.75rem 1.75rem 2rem" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.55rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color, background: `${color}14`, border: `1px solid ${color}28`, borderRadius: "999px", padding: "0.12rem 0.6rem" }}>
                        {selected.type}
                      </span>
                      {selected.muscles.map(m => (
                        <span key={m} style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "999px", padding: "0.1rem 0.45rem" }}>{m}</span>
                      ))}
                    </div>
                    <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.65rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>
                      {selected.name}
                    </h2>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, color: "rgba(255,255,255,0.5)" }}>
                    <X size={14} />
                  </button>
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                  {selected.sets && selected.reps && (
                    <div style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: "0.65rem", padding: "0.55rem 0.9rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <Dumbbell size={13} color={color} />
                      <span style={{ fontSize: "0.88rem", fontWeight: 700, color }}>{selected.sets} séries × {selected.reps} reps</span>
                    </div>
                  )}
                  {selected.rest && (
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.65rem", padding: "0.55rem 0.9rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <Clock size={13} color="rgba(255,255,255,0.35)" />
                      <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>Récup {selected.rest}</span>
                    </div>
                  )}
                </div>

                {/* Video */}
                <div style={{ marginBottom: "1.5rem" }}>
                  {ytId ? (
                    <div style={{ borderRadius: "1rem", overflow: "hidden", border: `1px solid ${color}25`, boxShadow: `0 8px 32px ${color}14` }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}`}
                        title={selected.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ width: "100%", height: 280, border: "none", display: "block" }}
                      />
                    </div>
                  ) : (
                    <div style={{ background: `${color}08`, border: `1px dashed ${color}28`, borderRadius: "1rem", height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
                      <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${color}12`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Play size={22} color={color} style={{ transform: "translateX(1px)" }} />
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", textAlign: "center" }}>Vidéo à venir<br /><span style={{ fontSize: "0.7rem", opacity: 0.6 }}>Ton coach ajoutera le lien prochainement</span></p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {selected.description && (
                  <div style={{ marginBottom: selected.note ? "1.25rem" : 0 }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.6rem" }}>Technique</p>
                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75 }}>{selected.description}</p>
                  </div>
                )}

                {/* Coach note */}
                {selected.note && (
                  <div style={{ marginTop: selected.description ? "1.25rem" : 0, background: `${color}0a`, border: `1px solid ${color}20`, borderRadius: "0.75rem", padding: "0.85rem 1rem" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color, marginBottom: "0.35rem" }}>Note du coach</p>
                    <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{selected.note}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
