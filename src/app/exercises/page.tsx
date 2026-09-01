"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = ["Tous", "Pecs", "Dos", "Épaules", "Biceps", "Triceps", "Jambes", "Abdos"];

const levelConfig: Record<string, { color: string; bg: string; border: string }> = {
  Fondamental:   { color: "#4ade80", bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.22)"  },
  Intermédiaire: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.22)"  },
  Avancé:        { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.22)" },
};

const exercises = [
  // Pecs
  {
    id: 1, name: "Développé couché incliné", muscle: "Pectoraux sup. · Épaules ant. · Triceps", category: "Pecs", level: "Fondamental",
    videoUrl: null as string | null,
    description: "Le développé incliné cible la partie supérieure des pectoraux, souvent sous-développée. C'est un fondamental pour donner du volume et de la rondeur au haut de la poitrine.",
    tips: ["Angle du banc entre 30° et 45°", "Omoplates serrées et enfoncées dans le banc", "Barre vers le haut de la poitrine", "Coudes à environ 60° du corps"],
  },
  {
    id: 2, name: "Chest Press", muscle: "Pectoraux · Triceps · Épaules ant.", category: "Pecs", level: "Fondamental",
    videoUrl: null as string | null,
    description: "Le chest press machine permet de travailler les pectoraux avec une trajectoire guidée, idéale pour isoler le muscle et apprendre à le contracter sans se soucier de l'équilibre de la charge.",
    tips: ["Régler le siège pour que les poignées soient à hauteur de poitrine", "Pousser en expirant, contrôler le retour", "Ne pas verrouiller les coudes en extension", "Garder le dos bien plaqué contre le dossier"],
  },
  // Dos
  {
    id: 3, name: "Traction", muscle: "Dorsaux · Biceps · Rhomboïdes", category: "Dos", level: "Intermédiaire",
    videoUrl: null as string | null,
    description: "La traction est l'exercice roi pour développer les dorsaux en largeur et la force de traction. Elle engage également les biceps et les rhomboïdes pour un développement complet du dos.",
    tips: ["Prise légèrement plus large que les épaules", "Monter la poitrine vers la barre, pas le menton", "Contrôler lentement la descente", "Éviter le balancement du corps"],
  },
  {
    id: 4, name: "Tirage vertical", muscle: "Dorsaux · Biceps · Trapèzes inf.", category: "Dos", level: "Fondamental",
    videoUrl: null as string | null,
    description: "Le tirage vertical à la poulie haute est l'alternative à la traction pour les débutants ou pour augmenter le volume. Il cible les mêmes muscles avec une charge ajustable.",
    tips: ["Tirer la barre vers le haut de la poitrine, pas derrière la nuque", "Coudes vers le bas et l'arrière", "Légèrement penché vers l'arrière (10-15°)", "Contraction maximale des dorsaux en bas du mouvement"],
  },
  // Épaules
  {
    id: 5, name: "Développé militaire", muscle: "Épaules · Triceps · Trapèzes", category: "Épaules", level: "Fondamental",
    videoUrl: null as string | null,
    description: "Le développé militaire est le meilleur mouvement pour développer les épaules en globalité. Il développe la force de poussée verticale avec un transfert puissant sur d'autres exercices.",
    tips: ["Barre dans les clavicules au départ", "Gainage abdominal fort tout au long", "Pousser la barre verticalement", "Sortir la tête vers l'avant en haut du mouvement"],
  },
  {
    id: 6, name: "Élévations latérales", muscle: "Deltoïde médial · Épaules", category: "Épaules", level: "Fondamental",
    videoUrl: null as string | null,
    description: "Les élévations latérales isolent la tête médiale du deltoïde — la partie qui donne la largeur et le volume visuel aux épaules. Un incontournable pour des épaules équilibrées.",
    tips: ["Légère flexion du coude tout au long", "Monter jusqu'à l'horizontal, pas plus haut", "Contrôler lentement la descente (3 secondes)", "Légèrement penché vers l'avant pour mieux cibler le médial"],
  },
  // Biceps
  {
    id: 7, name: "Curl marteau", muscle: "Biceps · Brachial · Avant-bras", category: "Biceps", level: "Fondamental",
    videoUrl: null as string | null,
    description: "Le curl marteau sollicite fortement le muscle brachial et les avant-bras en plus des biceps. Il développe l'épaisseur du bras et améliore la prise en main pour tous les mouvements de tirage.",
    tips: ["Poignée neutre (pouces vers le haut)", "Coudes fixes contre le corps", "Monter jusqu'à la contraction maximale", "Contrôler sur la descente sans lâcher"],
  },
  {
    id: 8, name: "Curl pupitre", muscle: "Biceps · Brachialis", category: "Biceps", level: "Intermédiaire",
    videoUrl: null as string | null,
    description: "Le curl pupitre isole parfaitement les biceps en empêchant tout balancement du corps. Il est particulièrement efficace pour développer le pic du biceps et travailler en amplitude complète.",
    tips: ["Bras bien appuyés sur le pupitre, pas les aisselles", "Descendre jusqu'à l'extension complète", "Supination maximale en haut du mouvement", "Mouvement lent et contrôlé"],
  },
  // Triceps
  {
    id: 9, name: "Dips", muscle: "Triceps · Pectoraux inf. · Épaules", category: "Triceps", level: "Intermédiaire",
    videoUrl: null as string | null,
    description: "Les dips sont l'exercice polyarticulaire le plus complet pour les triceps. Au poids du corps d'abord, puis lestés pour continuer à progresser — c'est l'exercice qui construit des triceps massifs.",
    tips: ["Corps droit pour cibler les triceps", "Légèrement penché avant pour les pectoraux", "Descendre jusqu'à 90° minimum", "Coudes vers l'arrière, pas évasés"],
  },
  {
    id: 10, name: "Tirage à la corde", muscle: "Triceps · Anconé", category: "Triceps", level: "Fondamental",
    videoUrl: null as string | null,
    description: "Le tirage triceps à la corde à la poulie haute est l'exercice d'isolation par excellence pour les triceps. La corde permet une rotation externe en fin de mouvement pour une contraction maximale.",
    tips: ["Coudes fixes contre les flancs", "Écarter la corde en bas du mouvement (rotation externe)", "Extension complète sans verrouiller les coudes", "Contrôler le retour lentement"],
  },
  // Jambes
  {
    id: 11, name: "Squat", muscle: "Quadriceps · Fessiers · Lombaires", category: "Jambes", level: "Fondamental",
    videoUrl: null as string | null,
    description: "Le roi des exercices. Le squat sollicite l'ensemble du bas du corps et stimule la production hormonale. Technique indispensable à maîtriser pour tout programme sérieux.",
    tips: ["Pieds à largeur d'épaules, légèrement en canard", "Genoux dans l'axe des pieds tout au long", "Descendre jusqu'aux cuisses parallèles au sol minimum", "Regard droit devant, poitrine haute"],
  },
  {
    id: 12, name: "Leg Extension", muscle: "Quadriceps", category: "Jambes", level: "Fondamental",
    videoUrl: null as string | null,
    description: "La leg extension est le meilleur exercice d'isolation pour les quadriceps. Elle permet de les travailler en contraction concentrique et excentrique complète sans solliciter d'autres groupes musculaires.",
    tips: ["Régler le rouleau au niveau des chevilles", "Extension complète sans claquer en haut", "Contrôler la descente lentement (3-4 secondes)", "Ne pas soulever les fessiers du siège"],
  },
  // Abdos
  {
    id: 13, name: "Planche", muscle: "Abdominaux · Transverse · Stabilisateurs", category: "Abdos", level: "Fondamental",
    videoUrl: null as string | null,
    description: "La planche est l'exercice de gainage par excellence. Elle développe la stabilité du tronc et protège le bas du dos dans tous les autres mouvements — une base incontournable.",
    tips: ["Corps en ligne droite, sans creux ni dos rond", "Nombril vers la colonne vertébrale", "Fessiers contractés", "Respiration continue, ne pas bloquer"],
  },
];

type Exercise = typeof exercises[0];
const easing = [0.22, 1, 0.36, 1] as const;

function DetailPanel({ ex }: { ex: Exercise }) {
  const lvl = levelConfig[ex.level];
  return (
    <motion.div
      key={ex.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: easing }}
      style={{
        height: "calc(100vh - 7.5rem)",
        overflowY: "auto",
        background: "rgba(8,14,26,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1.25rem",
        boxShadow: "0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
      <div style={{ height: "2px", background: `linear-gradient(to right, transparent 5%, ${lvl.color}99 35%, ${lvl.color}99 65%, transparent 95%)`, flexShrink: 0 }} />

      {/* Video area */}
      <div style={{ position: "relative", aspectRatio: "16/9", background: "#04080f", flexShrink: 0 }}>
        {ex.videoUrl ? (
          <iframe
            src={ex.videoUrl}
            title={`Tutoriel ${ex.name}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          /* Placeholder vidéo */
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(160deg, rgba(14,20,34,1) 0%, rgba(4,8,16,1) 100%)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "1.25rem",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Grid bg */}
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              backgroundImage: `linear-gradient(${lvl.color}08 1px, transparent 1px), linear-gradient(90deg, ${lvl.color}08 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            {/* Orb */}
            <div aria-hidden style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "50%", height: "180%",
              background: `radial-gradient(ellipse, ${lvl.color}12 0%, transparent 65%)`,
              filter: "blur(40px)", pointerEvents: "none",
            }} />
            {/* Play button */}
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: `${lvl.color}15`,
              border: `1.5px solid ${lvl.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
              boxShadow: `0 0 40px ${lvl.color}20`,
            }}>
              <Play size={26} color={lvl.color} fill={lvl.color} style={{ marginLeft: "3px" }} />
            </div>
            <div style={{ textAlign: "center", position: "relative" }}>
              <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)", marginBottom: "0.3rem" }}>
                Vidéo explicative
              </p>
              <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.22)", letterSpacing: "0.06em" }}>
                Disponible prochainement
              </p>
            </div>
            {/* Exercise name watermark */}
            <div aria-hidden style={{
              position: "absolute", bottom: "0.75rem", right: "1rem",
              fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.5rem",
              textTransform: "uppercase", letterSpacing: "0.06em",
              color: `${lvl.color}18`, userSelect: "none",
            }}>
              {ex.name}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "1.75rem 2rem 2.5rem", overflowY: "auto" }}>

        {/* Identity */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "2rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "#ffffff", lineHeight: 1 }}>
              {ex.name}
            </h2>
            <span style={{
              fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
              color: lvl.color, background: lvl.bg, border: `1px solid ${lvl.border}`,
              borderRadius: "999px", padding: "0.22rem 0.65rem",
            }}>
              {ex.level}
            </span>
          </div>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>{ex.muscle}</p>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "1.5rem" }} />

        {/* Description */}
        <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: "1.75rem" }}>
          {ex.description}
        </p>

        {/* Tips */}
        <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "1rem" }}>
          Points clés
        </p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {ex.tips.map((tip, i) => (
            <div key={tip} style={{
              display: "flex", alignItems: "baseline", gap: "1rem",
              padding: "0.8rem 0",
              borderBottom: i < ex.tips.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>
              <span style={{
                fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.72rem",
                color: lvl.color, opacity: 0.65, flexShrink: 0, minWidth: "1.5rem",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
                {tip}
              </span>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div style={{
      height: "calc(100vh - 7.5rem)",
      background: "rgba(255,255,255,0.02)",
      border: "1.5px dashed rgba(255,255,255,0.07)",
      borderRadius: "1.25rem",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: "0.75rem",
    }}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "50%",
        background: "rgba(56,189,248,0.07)",
        border: "1px solid rgba(56,189,248,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Play size={18} color="rgba(56,189,248,0.4)" style={{ marginLeft: "2px" }} />
      </div>
      <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>
        Sélectionne un exercice
      </p>
    </div>
  );
}

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [selected, setSelected] = useState<Exercise | null>(null);

  const filtered = exercises.filter((ex) => {
    const matchCat = category === "Tous" || ex.category === category;
    const matchSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.muscle.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar />
      <main style={{ background: "#070c16", minHeight: "100vh", paddingTop: "6rem" }}>

        {/* BG grid */}
        <div aria-hidden style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 100% 60% at 50% 0%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 100% 60% at 50% 0%, black 30%, transparent 100%)",
        }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem 4rem", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easing }} style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.75rem" }}>
              BP Perform · Bibliothèque
            </p>
            <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(2.5rem, 5vw, 4rem)", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 0.95, color: "#ffffff" }}>
              LES <span style={{ color: "#38bdf8" }}>EXERCICES</span>
            </h1>
          </motion.div>

          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easing, delay: 0.1 }} style={{ marginBottom: "1.75rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher…"
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                  color: "#ffffff", paddingLeft: "2.4rem", paddingRight: "1rem",
                  paddingTop: "0.55rem", paddingBottom: "0.55rem",
                  fontSize: "0.78rem", borderRadius: "999px", outline: "none",
                  transition: "border-color 0.15s", width: "180px",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.4)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
              />
            </div>

            {/* Separator */}
            <div style={{ width: "1px", height: "1.5rem", background: "rgba(255,255,255,0.08)" }} />

            {/* Category pills */}
            {categories.map((cat) => {
              const active = category === cat;
              return (
                <button key={cat} onClick={() => setCategory(cat)} style={{
                  fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                  padding: "0.35rem 0.85rem", borderRadius: "999px", border: "none", cursor: "pointer",
                  transition: "all 0.15s ease",
                  background: active ? "linear-gradient(135deg, #38bdf8, #0ea5e9)" : "rgba(255,255,255,0.05)",
                  color: active ? "#03090f" : "rgba(255,255,255,0.5)",
                  boxShadow: active ? "0 4px 14px rgba(56,189,248,0.3)" : "none",
                }}>
                  {cat}
                </button>
              );
            })}
          </motion.div>

          {/* Main layout */}
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1.25rem", alignItems: "flex-start" }}>

            {/* Left: List */}
            <div style={{ position: "sticky", top: "6.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(255,255,255,0.05)", borderRadius: "0.75rem", overflow: "hidden" }}>
                {filtered.map((ex, i) => {
                  const lvl = levelConfig[ex.level];
                  const isSelected = selected?.id === ex.id;
                  return (
                    <motion.button
                      key={ex.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, ease: easing, delay: i * 0.04 }}
                      onClick={() => setSelected(isSelected ? null : ex)}
                      style={{
                        all: "unset", cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "space-between",
                        padding: "0.9rem 1.1rem",
                        background: isSelected ? "rgba(56,189,248,0.07)" : "#070c16",
                        borderLeft: `2px solid ${isSelected ? "#38bdf8" : "transparent"}`,
                        transition: "background 0.15s, border-color 0.15s",
                        gap: "0.75rem",
                      }}
                      onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                      onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#070c16"; }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.04em", color: isSelected ? "#ffffff" : "rgba(255,255,255,0.85)", lineHeight: 1, marginBottom: "0.2rem" }}>
                          {ex.name}
                        </p>
                        <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {ex.category}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                        <span style={{
                          width: "6px", height: "6px", borderRadius: "50%",
                          background: lvl.color, flexShrink: 0,
                          boxShadow: `0 0 6px ${lvl.color}80`,
                        }} />
                        <ChevronRight
                          size={12}
                          color={isSelected ? "#38bdf8" : "rgba(255,255,255,0.2)"}
                          style={{ transition: "color 0.15s" }}
                        />
                      </div>
                    </motion.button>
                  );
                })}

                {filtered.length === 0 && (
                  <div style={{ padding: "2.5rem 1rem", textAlign: "center", background: "#070c16" }}>
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>Aucun exercice trouvé.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Detail panel */}
            <div style={{ position: "sticky", top: "6.5rem" }}>
              <AnimatePresence mode="wait">
                {selected ? (
                  <DetailPanel key={selected.id} ex={selected} />
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <EmptyState />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
