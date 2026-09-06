"use client";

import { useState, useRef } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Clock, Zap, X, Target, ChevronRight, Play } from "lucide-react";
import { HoverSpotlight } from "@/components/HoverSpotlight";

const easing = [0.22, 1, 0.36, 1] as const;

const typeConfig: Record<string, { color: string; bg: string; border: string }> = {
  Push:  { color: "#38bdf8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.28)" },
  Pull:  { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.28)" },
  Legs:  { color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.28)" },
  Repos: { color: "rgba(255,255,255,0.2)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)" },
};

type Exercise = {
  name: string; sets: number; reps: string; rest: string; note: string;
  description: string; videoUrl: string | null;
};
type Day = {
  id: string; day: string; fullDay: string; type: string; duration: string;
  muscles: string[]; exercises: Exercise[];
};

const program = {
  name: "Hypertrophie Intermédiaire",
  week: 8, totalWeeks: 12, coach: "Paul",
  days: [
    {
      id: "lundi", day: "Lun", fullDay: "Lundi", type: "Push", duration: "~55 min",
      muscles: ["Pecs", "Épaules", "Triceps"],
      exercises: [
        { name: "Développé couché incliné", sets: 4, reps: "8-10", rest: "2 min",
          note: "Augmenter de 2.5 kg si les 4×10 sont faits proprement.",
          description: "Allongé sur un banc incliné à 30-45°, descends la barre jusqu'à effleurer le haut de la poitrine. Pousse en contractant les pectoraux. Maintiens les coudes à ~75° du corps pour protéger les épaules.",
          videoUrl: null },
        { name: "Chest Press", sets: 3, reps: "10-12", rest: "90 s",
          note: "",
          description: "Assis sur la machine, dos bien plaqué au dossier. Pousse les poignées en avant jusqu'à extension quasi-complète des bras, sans verrouiller les coudes. Reviens lentement en contrôlant l'excentrique.",
          videoUrl: null },
        { name: "Développé militaire", sets: 4, reps: "8-10", rest: "2 min",
          note: "Focus sur le gainage — ne cambre pas le bas du dos.",
          description: "Debout ou assis, barre au niveau des épaules, prise légèrement plus large que les épaules. Pousse verticalement jusqu'à extension complète. Contracte les fessiers et les abdos tout au long du mouvement.",
          videoUrl: null },
        { name: "Élévations latérales", sets: 4, reps: "12-15", rest: "60 s",
          note: "Poids léger, tempo lent. La qualité prime.",
          description: "Debout, haltères le long du corps. Monte les bras latéralement jusqu'à l'horizontale, légère rotation externe du poignet (petit doigt vers le haut). Descends en 3 secondes pour maximiser le temps sous tension.",
          videoUrl: null },
        { name: "Dips", sets: 3, reps: "10-12", rest: "90 s",
          note: "",
          description: "Aux barres parallèles, descends jusqu'à ce que les coudes soient à 90°. Corps légèrement penché en avant pour cibler les pectoraux. Pousse pour revenir. Ajoute du lest si les reps sont trop faciles.",
          videoUrl: null },
        { name: "Tirage à la corde", sets: 3, reps: "12-15", rest: "60 s",
          note: "Écarte bien la corde en bas pour maximiser la contraction.",
          description: "Poulie haute avec corde. Coudes fléchis à 90°, mains devant le front. Tire vers le bas en écartant la corde de chaque côté du corps à hauteur des cuisses. Coudes collés au corps pendant le mouvement.",
          videoUrl: null },
      ],
    },
    { id: "mardi", day: "Mar", fullDay: "Mardi", type: "Repos", duration: "", muscles: [], exercises: [] },
    {
      id: "mercredi", day: "Mer", fullDay: "Mercredi", type: "Pull", duration: "~50 min",
      muscles: ["Dos", "Biceps"],
      exercises: [
        { name: "Traction", sets: 4, reps: "6-8", rest: "2 min",
          note: "Prise large, ramène la poitrine vers la barre.",
          description: "Barre fixe, prise pronation large. Depuis la position suspendue, tire le corps vers le haut en ramenant les coudes vers le bas et les hanches. La poitrine doit toucher ou frôler la barre. Descente contrôlée.",
          videoUrl: null },
        { name: "Tirage vertical", sets: 3, reps: "10-12", rest: "90 s",
          note: "",
          description: "Assis à la machine, prise large. Tire la barre vers le haut du buste en gardant le dos légèrement incliné en arrière. Coudes qui descendent vers les hanches. Contracte le grand dorsal en bas du mouvement.",
          videoUrl: null },
        { name: "Curl marteau", sets: 4, reps: "10-12", rest: "75 s",
          note: "",
          description: "Debout, haltères en prise neutre (pouce vers le haut). Fléchis les avant-bras alternativement ou simultanément. Ce mouvement cible le brachial et le long supinateur en plus du biceps.",
          videoUrl: null },
        { name: "Curl pupitre", sets: 3, reps: "10-12", rest: "75 s",
          note: "Extension complète en bas du mouvement.",
          description: "Assis au pupitre, avant-bras posés sur le coussin. Soulève la barre en contractant les biceps. L'isolation est totale — ne triche pas avec le corps. Descends lentement jusqu'à extension quasi-complète.",
          videoUrl: null },
      ],
    },
    { id: "jeudi", day: "Jeu", fullDay: "Jeudi", type: "Repos", duration: "", muscles: [], exercises: [] },
    {
      id: "vendredi", day: "Ven", fullDay: "Vendredi", type: "Push", duration: "~50 min",
      muscles: ["Pecs", "Épaules", "Triceps"],
      exercises: [
        { name: "Chest Press", sets: 4, reps: "8-10", rest: "2 min",
          note: "",
          description: "Séance volume — même mouvement que lundi mais intensité légèrement réduite. Focus sur la connexion musculaire et la contraction complète à chaque répétition.",
          videoUrl: null },
        { name: "Développé couché incliné", sets: 3, reps: "10-12", rest: "90 s",
          note: "Volume : moins lourd que lundi, plus de reps.",
          description: "Même technique que lundi. Ici on cherche le volume : charge réduite, reps plus hautes, tempo contrôlé. Descente en 2s, poussée explosive.",
          videoUrl: null },
        { name: "Élévations latérales", sets: 5, reps: "15-20", rest: "45 s",
          note: "Drop set sur la dernière série.",
          description: "5 séries de volume pour les deltoïdes latéraux. Sur la dernière série, drop set : baisse le poids de 30% dès l'échec et continue jusqu'au nouvel échec.",
          videoUrl: null },
        { name: "Tirage à la corde", sets: 4, reps: "15-20", rest: "60 s",
          note: "",
          description: "Finisher triceps. Séries longues pour maximiser le pump. Contrôle parfait, pas de triche avec le buste.",
          videoUrl: null },
      ],
    },
    {
      id: "samedi", day: "Sam", fullDay: "Samedi", type: "Legs", duration: "~45 min",
      muscles: ["Quadriceps", "Abdos"],
      exercises: [
        { name: "Squat", sets: 4, reps: "6-8", rest: "3 min",
          note: "Charger lourd cette semaine.",
          description: "Barre sur le dos (squat basse barre ou haute barre selon confort). Pieds à largeur des épaules, orteils légèrement écartés. Descends jusqu'à ce que les cuisses soient parallèles ou sous le parallèle. Pousse à travers les talons.",
          videoUrl: null },
        { name: "Leg Extension", sets: 4, reps: "12-15", rest: "90 s",
          note: "Contraction longue tenue en haut.",
          description: "Machine leg extension. Assure-toi que l'axe de rotation est aligné avec le genou. Monte jusqu'à extension complète et tiens 1s en haut. Descends lentement en 2-3s. Isole parfaitement les quadriceps.",
          videoUrl: null },
        { name: "Planche", sets: 3, reps: "45-60 s", rest: "60 s",
          note: "",
          description: "Appui sur les avant-bras et les orteils. Corps parfaitement aligné de la tête aux talons. Contracte les abdos, les fessiers et les quadriceps simultanément. Respire régulièrement. Ne laisse pas les hanches s'affaisser.",
          videoUrl: null },
      ],
    },
    { id: "dimanche", day: "Dim", fullDay: "Dimanche", type: "Repos", duration: "", muscles: [], exercises: [] },
  ] as Day[],
};

const sessions = program.days.filter(d => d.type !== "Repos");

function SessionCard({ session, i, onClick }: { session: Day; i: number; onClick: () => void }) {
  const c = typeConfig[session.type];
  const cardRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLButtonElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (glowRef.current) {
      glowRef.current.style.opacity = "1";
      glowRef.current.style.background = `radial-gradient(260px circle at ${x}px ${y}px, ${c.color}1e, transparent 70%)`;
    }
  }
  function onGlowLeave(e: React.MouseEvent<HTMLButtonElement>) {
    if (glowRef.current) glowRef.current.style.opacity = "0";
    const el = e.currentTarget as HTMLElement;
    el.style.transform = "";
    el.style.boxShadow = [`inset 0 1px 0 ${c.color}28`, `0 8px 32px ${c.color}10`, "0 2px 8px rgba(0,0,0,0.2)"].join(", ");
  }

  return (
    <motion.button
      ref={cardRef}
      key={session.id}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easing, delay: 0.15 + i * 0.07 }}
      onClick={onClick}
      style={{
        textAlign: "left", cursor: "pointer",
        background: `linear-gradient(145deg, ${c.color}12 0%, rgba(255,255,255,0.04) 60%, ${c.color}08 100%)`,
        backdropFilter: "blur(28px) saturate(180%)", WebkitBackdropFilter: "blur(28px) saturate(180%)",
        border: `1px solid ${c.border}`,
        borderRadius: "1.25rem", padding: "1.5rem 1.5rem 1.35rem",
        position: "relative", overflow: "hidden",
        transition: "all 0.22s ease",
        boxShadow: [`inset 0 1px 0 ${c.color}28`, `0 8px 32px ${c.color}10`, "0 2px 8px rgba(0,0,0,0.2)"].join(", "),
      } as React.CSSProperties}
      onMouseMove={onMove}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = [`inset 0 1px 0 ${c.color}38`, `0 12px 40px ${c.color}18`, "0 4px 12px rgba(0,0,0,0.25)"].join(", "); }}
      onMouseLeave={onGlowLeave}
    >
      {/* Spotlight glow */}
      <div ref={glowRef} aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "inherit", opacity: 0, pointerEvents: "none", transition: "opacity 0.35s ease" }} />
      {/* Specular */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: `linear-gradient(to right, transparent, ${c.color}55, rgba(255,255,255,0.35), ${c.color}55, transparent)`, pointerEvents: "none" }} />
      {/* Corner glow */}
      <div aria-hidden style={{ position: "absolute", bottom: "-30px", right: "-30px", width: "120px", height: "120px", pointerEvents: "none", background: `radial-gradient(ellipse, ${c.color}22 0%, transparent 65%)`, filter: "blur(18px)" }} />
      {/* Large watermark */}
      <div aria-hidden style={{ position: "absolute", bottom: "-0.5rem", right: "0.5rem", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "5rem", lineHeight: 1, color: `${c.color}08`, userSelect: "none", pointerEvents: "none", letterSpacing: "-0.02em" }}>
        {session.type.toUpperCase()}
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: "0.74rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.35rem" }}>
          {session.fullDay}
        </p>
        <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "2rem", textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1, marginBottom: "0.7rem", color: c.color, textShadow: `0 0 24px ${c.color}60` }}>
          {session.type}
        </p>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Dumbbell size={12} color="rgba(255,255,255,0.3)" />
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.42)" }}>{session.exercises.length} exercices</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Clock size={12} color="rgba(255,255,255,0.3)" />
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.42)" }}>{session.duration}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.1rem" }}>
          {session.muscles.map((m) => (
            <span key={m} style={{ fontSize: "0.74rem", color: c.color, background: `${c.color}12`, border: `1px solid ${c.color}25`, borderRadius: "999px", padding: "0.15rem 0.6rem" }}>{m}</span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: c.color }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textShadow: `0 0 10px ${c.color}50` }}>Voir la séance</span>
          <ChevronRight size={13} />
        </div>
      </div>
    </motion.button>
  );
}

function StatMiniCard({ stat }: { stat: { label: string; value: string; icon: React.ComponentType<{ size?: number; color?: string }>; color: string } }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (glowRef.current) {
      glowRef.current.style.opacity = "1";
      glowRef.current.style.background = `radial-gradient(260px circle at ${x}px ${y}px, ${stat.color}1e, transparent 70%)`;
    }
  }
  function onLeave() {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        background: `${stat.color}0e`, border: `1px solid ${stat.color}25`,
        borderRadius: "0.85rem", padding: "0.9rem 1rem",
        boxShadow: `inset 0 1px 0 ${stat.color}20`,
        position: "relative", overflow: "hidden",
      }}
    >
      <div ref={glowRef} aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "inherit", opacity: 0, pointerEvents: "none", transition: "opacity 0.35s ease" }} />
      <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${stat.color}50, transparent)`, pointerEvents: "none" }} />
      <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.4rem" }}>{stat.label}</p>
      <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.4rem", color: stat.color, textShadow: `0 0 16px ${stat.color}60`, lineHeight: 1 }}>{stat.value}</p>
    </div>
  );
}

export default function ProgrammePage() {
  const { isMobile } = useBreakpoint();
  const [modal, setModal] = useState<Day | null>(null);
  const [activeEx, setActiveEx] = useState<Exercise | null>(null);
  const progress = (program.week / program.totalWeeks) * 100;

  function openSession(session: Day) {
    setModal(session);
    setActiveEx(session.exercises[0] ?? null);
  }
  function closeModal() { setModal(null); setActiveEx(null); }

  const cfg = modal ? typeConfig[modal.type] : null;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easing }}>
          <p style={{ fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.4rem" }}>
            Mon programme
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", textTransform: "uppercase", letterSpacing: "-0.01em", color: "#ffffff", lineHeight: 1 }}>
                {program.name}
              </h1>
              <p style={{ marginTop: "0.4rem", fontSize: "0.83rem", color: "rgba(255,255,255,0.38)" }}>
                Par <span style={{ color: "rgba(255,255,255,0.65)" }}>{program.coach}</span>
              </p>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: "1rem",
              background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: "999px",
              padding: "0.6rem 1.25rem",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
              <span style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.4)" }}>Progression</span>
              <div style={{ width: "80px", height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: easing, delay: 0.3 }}
                  style={{ height: "100%", background: "#38bdf8", borderRadius: "999px", boxShadow: "0 0 8px rgba(56,189,248,0.6)" }}
                />
              </div>
              <span style={{ fontSize: "0.83rem", fontWeight: 700, color: "#38bdf8", textShadow: "0 0 10px rgba(56,189,248,0.5)" }}>
                S{program.week}/{program.totalWeeks}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Weekly Agenda */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easing, delay: 0.08 }}
        >
          <HoverSpotlight
            color="#38bdf8"
            style={{
              background: "linear-gradient(145deg, rgba(56,189,248,0.06) 0%, rgba(255,255,255,0.03) 60%)",
              backdropFilter: "blur(28px) saturate(180%)", WebkitBackdropFilter: "blur(28px) saturate(180%)",
              border: "1px solid rgba(56,189,248,0.14)", borderRadius: "1.25rem", padding: "1.5rem",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.2)",
              position: "relative", overflow: "hidden",
            } as React.CSSProperties}
          >
            <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.4), rgba(255,255,255,0.25), rgba(56,189,248,0.4), transparent)", pointerEvents: "none" }} />
            <p style={{ fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "1.25rem" }}>
              Agenda — Semaine {program.week}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.6rem" }}>
              {program.days.map((day) => {
                const c = typeConfig[day.type];
                const isRest = day.type === "Repos";
                return (
                  <button
                    key={day.id}
                    onClick={() => !isRest && openSession(day)}
                    style={{
                      background: isRest ? "rgba(255,255,255,0.02)" : c.bg,
                      border: `1px solid ${c.border}`,
                      borderRadius: "0.85rem", padding: "0.85rem 0.5rem",
                      cursor: isRest ? "default" : "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
                      transition: "all 0.18s ease",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    } as React.CSSProperties}
                  >
                    <span style={{ fontSize: "0.74rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: isRest ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.55)" }}>{day.day}</span>
                    <div style={{ width: isRest ? "24px" : "100%", height: "4px", borderRadius: "999px", background: isRest ? "rgba(255,255,255,0.08)" : c.color, boxShadow: isRest ? "none" : `0 0 8px ${c.color}80` }} />
                    <span style={{ fontSize: "0.7rem", fontWeight: isRest ? 400 : 700, color: isRest ? "rgba(255,255,255,0.18)" : c.color, textShadow: isRest ? "none" : `0 0 8px ${c.color}60` }}>
                      {isRest ? "—" : day.type}
                    </span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "1.25rem", marginTop: "1.1rem", flexWrap: "wrap" }}>
              {(["Push","Pull","Legs"] as const).map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: typeConfig[t].color, boxShadow: `0 0 6px ${typeConfig[t].color}70` }} />
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)" }}>{t}</span>
                </div>
              ))}
            </div>
          </HoverSpotlight>
        </motion.div>

        {/* Session cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "1rem" }}>
          {sessions.map((session, i) => (
            <SessionCard key={session.id} session={session} i={i} onClick={() => openSession(session)} />
          ))}
        </div>
      </div>

      {/* ── Session Modal ── */}
      <AnimatePresence>
        {modal && cfg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(4,8,18,0.85)",
              backdropFilter: "blur(12px)",
              display: "flex", alignItems: "stretch",
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ duration: 0.3, ease: easing }}
              onClick={(e) => e.stopPropagation()}
              style={{
                margin: isMobile ? "0" : "auto",
                width: isMobile ? "100vw" : "min(95vw, 1100px)",
                height: isMobile ? "100dvh" : undefined,
                maxHeight: isMobile ? "none" : "90vh",
                display: "flex", flexDirection: "column",
                background: `linear-gradient(160deg, ${cfg.color}10 0%, rgba(7,12,22,0.98) 40%)`,
                backdropFilter: "blur(40px) saturate(180%)",
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
                border: `1px solid ${cfg.color}30`,
                borderRadius: isMobile ? "0" : "1.5rem",
                overflow: "hidden",
                boxShadow: [`inset 0 1px 0 ${cfg.color}25`, `0 32px 80px rgba(0,0,0,0.7)`, `0 0 0 1px ${cfg.color}10`].join(", "),
              }}
            >
              {/* Specular */}
              <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${cfg.color}55, rgba(255,255,255,0.4), ${cfg.color}55, transparent)`, pointerEvents: "none" }} />
              {/* Top accent line */}
              <div style={{ height: "2px", background: `linear-gradient(to right, transparent 5%, ${cfg.color} 30%, ${cfg.color} 70%, transparent 95%)`, opacity: 0.75, flexShrink: 0 }} />
              {/* Ambient glow */}
              <div aria-hidden style={{ position: "absolute", top: "-60px", right: "-40px", width: "300px", height: "250px", pointerEvents: "none", background: `radial-gradient(ellipse, ${cfg.color}18 0%, transparent 65%)`, filter: "blur(40px)" }} />

              {/* Modal header */}
              <div style={{ padding: "1.75rem 2rem 1.25rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0, position: "relative", zIndex: 1 }}>
                <div>
                  <p style={{ fontSize: "0.74rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.3rem" }}>
                    {modal.fullDay} · {modal.duration}
                  </p>
                  <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "2.4rem", textTransform: "uppercase", letterSpacing: "0.04em", color: cfg.color, lineHeight: 1, textShadow: `0 0 30px ${cfg.color}50` }}>
                    {modal.type}
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.65rem" }}>
                    {modal.muscles.map((m) => (
                      <span key={m} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: cfg.color, background: `${cfg.color}12`, border: `1px solid ${cfg.color}28`, borderRadius: "999px", padding: "0.2rem 0.65rem" }}>
                        <Target size={10} color={cfg.color} /> {m}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)", transition: "all 0.15s", flexShrink: 0, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "rgba(255,255,255,0.12)"; el.style.color = "#ffffff"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "rgba(255,255,255,0.06)"; el.style.color = "rgba(255,255,255,0.5)"; }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 2rem", flexShrink: 0 }} />

              {/* Body: exercise list + detail */}
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "280px 1fr", gridTemplateRows: isMobile ? "auto 1fr" : "1fr", overflow: "hidden" }}>

                {/* Left: exercise list */}
                <div style={{ borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)", borderBottom: isMobile ? "1px solid rgba(255,255,255,0.06)" : "none", overflowY: "auto", padding: "1rem 0", maxHeight: isMobile ? "200px" : "none" }}>
                  {modal.exercises.map((ex, ei) => {
                    const isActive = activeEx?.name === ex.name;
                    return (
                      <button
                        key={ex.name}
                        onClick={() => setActiveEx(ex)}
                        style={{
                          width: "100%", textAlign: "left", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: "0.85rem",
                          padding: "0.9rem 1.5rem",
                          background: isActive ? `${cfg.color}12` : "transparent",
                          transition: "all 0.15s",
                          borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 0,
                          borderLeftWidth: "3px",
                          borderTopStyle: "none", borderRightStyle: "none", borderBottomStyle: "none",
                          borderLeftStyle: "solid",
                          borderLeftColor: isActive ? cfg.color : "transparent",
                        } as React.CSSProperties}
                        onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                        onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.8rem", color: isActive ? cfg.color : "rgba(255,255,255,0.25)", minWidth: "1.5rem", textShadow: isActive ? `0 0 10px ${cfg.color}60` : "none" }}>
                          {String(ei + 1).padStart(2, "0")}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "0.88rem", fontWeight: isActive ? 600 : 400, color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {ex.name}
                          </p>
                          <p style={{ fontSize: "0.74rem", color: isActive ? cfg.color : "rgba(255,255,255,0.28)", marginTop: "0.15rem" }}>
                            {ex.sets}×{ex.reps}
                          </p>
                        </div>
                        {isActive && <ChevronRight size={12} color={cfg.color} />}
                      </button>
                    );
                  })}
                </div>

                {/* Right: exercise detail */}
                <div style={{ overflowY: "auto", padding: "1.75rem 2rem" }}>
                  <AnimatePresence mode="wait">
                    {activeEx && (
                      <motion.div
                        key={activeEx.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22, ease: easing }}
                      >
                        {/* Exercise name */}
                        <h3 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.7rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "#ffffff", lineHeight: 1, marginBottom: "1.25rem" }}>
                          {activeEx.name}
                        </h3>

                        {/* Stats row */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
                          {[
                            { label: "Séries", value: String(activeEx.sets), icon: Zap, color: cfg.color },
                            { label: "Répétitions", value: activeEx.reps, icon: Target, color: "#a78bfa" },
                            { label: "Repos", value: activeEx.rest, icon: Clock, color: "#4ade80" },
                          ].map((stat) => (
                            <StatMiniCard key={stat.label} stat={stat} />
                          ))}
                        </div>

                        {/* Video */}
                        <div style={{
                          width: "100%", aspectRatio: "16/9", borderRadius: "1rem", overflow: "hidden",
                          background: `linear-gradient(145deg, ${cfg.color}08 0%, rgba(255,255,255,0.03) 100%)`,
                          border: `1px solid ${cfg.color}18`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          marginBottom: "1.5rem",
                          boxShadow: `inset 0 1px 0 ${cfg.color}18`,
                          position: "relative",
                        }}>
                          {activeEx.videoUrl ? (
                            <iframe
                              src={activeEx.videoUrl}
                              style={{ width: "100%", height: "100%", border: "none" }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.85rem" }}>
                              <div style={{
                                width: "52px", height: "52px", borderRadius: "50%",
                                background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: `0 0 20px ${cfg.color}25`,
                              }}>
                                <Play size={20} color={cfg.color} />
                              </div>
                              <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>Vidéo bientôt disponible</p>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <div style={{
                          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "0.9rem", padding: "1.25rem 1.35rem",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                          marginBottom: activeEx.note ? "1rem" : 0,
                        }}>
                          <p style={{ fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "0.65rem" }}>
                            Technique
                          </p>
                          <p style={{ fontSize: "0.93rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.75 }}>
                            {activeEx.description}
                          </p>
                        </div>

                        {/* Coach note */}
                        {activeEx.note && (
                          <div style={{
                            display: "flex", gap: "0.75rem", alignItems: "flex-start",
                            background: `${cfg.color}08`, border: `1px solid ${cfg.color}20`,
                            borderRadius: "0.9rem", padding: "1rem 1.25rem",
                            boxShadow: `inset 0 1px 0 ${cfg.color}15`,
                          }}>
                            <div style={{
                              width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                              background: `linear-gradient(135deg, ${cfg.color}28, ${cfg.color}08)`,
                              border: `1px solid ${cfg.color}35`, backdropFilter: "blur(8px)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.65rem", color: cfg.color,
                              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18)`,
                            }}>
                              BP
                            </div>
                            <div>
                              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Note du coach</p>
                              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, fontStyle: "italic" }}>{activeEx.note}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
