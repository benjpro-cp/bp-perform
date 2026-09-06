"use client";

import { useRef } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { motion } from "framer-motion";
import { Flame, Beef, Wheat, Droplets, Info, ExternalLink, Smartphone, ScanLine, BarChart3, ChefHat } from "lucide-react";
import { HoverSpotlight } from "@/components/HoverSpotlight";

const easing = [0.22, 1, 0.36, 1] as const;

const macros = [
  { label: "Calories", value: 2800, unit: "kcal", color: "#fb923c", icon: Flame, pct: 100 },
  { label: "Protéines", value: 180, unit: "g", color: "#38bdf8", icon: Beef, pct: 72 },
  { label: "Glucides", value: 320, unit: "g", color: "#a78bfa", icon: Wheat, pct: 85 },
  { label: "Lipides", value: 80, unit: "g", color: "#4ade80", icon: Droplets, pct: 60 },
];

const macroExplains = [
  {
    label: "Calories", color: "#fb923c", icon: Flame,
    role: "Base de tout résultat",
    kcalPer: null, totalKcal: 2800, pctOfTotal: 100,
    explain: "Les calories représentent votre budget énergétique journalier. Trop peu → fonte musculaire et fatigue. Trop → stockage graisseux. Votre objectif de 2 800 kcal est calibré pour soutenir vos séances tout en favorisant une prise de masse propre.",
    sources: ["Tous les aliments", "Proportions macros", "Densité alimentaire"],
    tip: "Pesez vos aliments les 2 premières semaines pour calibrer votre ressenti — après, votre intuition sera fiable.",
  },
  {
    label: "Protéines", color: "#38bdf8", icon: Beef,
    role: "Construction musculaire",
    kcalPer: 4, totalKcal: 720, pctOfTotal: 26,
    explain: "Les protéines sont les briques structurelles de vos muscles. Après chaque séance, elles réparent les fibres endommagées et déclenchent la synthèse musculaire. Sans apport suffisant, vos entraînements ne produisent aucun gain.",
    sources: ["Poulet · Thon", "Blanc d'œuf · Whey", "Fromage blanc 0%"],
    tip: "Répartis sur 4 à 5 repas (30-40 g par prise) pour maximiser la synthèse protéique tout au long de la journée.",
  },
  {
    label: "Glucides", color: "#a78bfa", icon: Wheat,
    role: "Carburant de l'effort",
    kcalPer: 4, totalKcal: 1280, pctOfTotal: 46,
    explain: "Les glucides remplissent vos réserves de glycogène musculaire — votre carburant principal lors des efforts intenses. Un apport insuffisant se traduit par une baisse de force, de concentration et une récupération plus lente.",
    sources: ["Riz · Avoine", "Patate douce · Fruits", "Pain complet"],
    tip: "Concentrez la majorité de vos glucides avant et après l'entraînement pour maximiser performance et récupération.",
  },
  {
    label: "Lipides", color: "#4ade80", icon: Droplets,
    role: "Hormones & absorption",
    kcalPer: 9, totalKcal: 720, pctOfTotal: 26,
    explain: "Les lipides sont essentiels à la production de testostérone et d'autres hormones anabolisantes. Ils permettent aussi d'absorber les vitamines A, D, E et K. Les réduire trop fortement sabote votre récupération et votre santé à long terme.",
    sources: ["Avocat · Amandes", "Huile d'olive · Saumon", "Œufs entiers"],
    tip: "Évitez les lipides dans les 1-2h avant et après l'entraînement — ils ralentissent la digestion et l'absorption des protéines.",
  },
];


const glassCard = (color = "#38bdf8"): React.CSSProperties => ({
  background: `linear-gradient(145deg, ${color}0e 0%, rgba(255,255,255,0.03) 55%, ${color}06 100%)`,
  backdropFilter: "blur(28px) saturate(180%)",
  WebkitBackdropFilter: "blur(28px) saturate(180%)",
  border: `1px solid ${color}28`,
  borderRadius: "1.1rem",
  overflow: "hidden",
  position: "relative" as const,
  boxShadow: [
    `inset 0 1px 0 ${color}22`,
    "inset 0 -1px 0 rgba(255,255,255,0.03)",
    `0 8px 32px ${color}10`,
    "0 2px 8px rgba(0,0,0,0.2)",
  ].join(", "),
});


function MacroExplainCard({ m, i }: { m: (typeof macroExplains)[number]; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const Icon = m.icon;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (glowRef.current) {
      glowRef.current.style.opacity = "1";
      glowRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, ${m.color}22, transparent 70%)`;
    }
  }

  function onLeave() {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easing, delay: 0.3 + i * 0.08 }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          ...glassCard(m.color),
          padding: 0,
        }}
      >
        {/* Mouse spotlight */}
        <div ref={glowRef} aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "inherit", opacity: 0, pointerEvents: "none", zIndex: 0, transition: "opacity 0.35s ease" }} />

        <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${m.color}55, rgba(255,255,255,0.35), ${m.color}55, transparent)`, pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", top: "-30px", right: "-20px", width: "140px", height: "120px", pointerEvents: "none", background: `radial-gradient(ellipse, ${m.color}18 0%, transparent 65%)`, filter: "blur(22px)" }} />

        {/* Header */}
        <div style={{ padding: "1.25rem 1.4rem 0.85rem", borderBottom: `1px solid ${m.color}18`, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${m.color}18`, border: `1px solid ${m.color}35`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 0 12px ${m.color}25`, transition: "transform 0.2s ease, box-shadow 0.2s ease" }}>
                <Icon size={16} color={m.color} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.15rem", textTransform: "uppercase", letterSpacing: "0.06em", color: m.color, lineHeight: 1, textShadow: `0 0 14px ${m.color}50` }}>{m.label}</p>
                <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)", marginTop: "0.15rem", fontWeight: 500 }}>{m.role}</p>
              </div>
            </div>
            {m.kcalPer && (
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.1rem", color: "#ffffff", lineHeight: 1 }}>{m.totalKcal} <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>kcal</span></p>
                <p style={{ fontSize: "0.7rem", color: m.color, marginTop: "0.1rem", textShadow: `0 0 8px ${m.color}50` }}>{m.pctOfTotal}% du total</p>
              </div>
            )}
          </div>
          {m.kcalPer && (
            <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "999px", overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${m.pctOfTotal}%` }} transition={{ duration: 0.9, ease: easing, delay: 0.4 + i * 0.08 }} style={{ height: "100%", background: `linear-gradient(to right, ${m.color}80, ${m.color})`, borderRadius: "999px", boxShadow: `0 0 6px ${m.color}70` }} />
            </div>
          )}
          {m.kcalPer && <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.22)", marginTop: "0.4rem" }}>1 g = {m.kcalPer} kcal</p>}
        </div>

        {/* Explanation */}
        <div style={{ padding: "0.9rem 1.4rem", borderBottom: `1px solid ${m.color}10`, position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>{m.explain}</p>
        </div>

        {/* Sources + Tip */}
        <div style={{ padding: "0.9rem 1.4rem", display: "flex", flexDirection: "column", gap: "0.75rem", position: "relative", zIndex: 1 }}>
          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: "0.45rem" }}>Meilleures sources</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {m.sources.map((s) => (
                <span key={s} style={{ fontSize: "0.76rem", color: m.color, background: `${m.color}10`, border: `1px solid ${m.color}22`, borderRadius: "999px", padding: "0.2rem 0.6rem" }}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{ background: `${m.color}0a`, border: `1px solid ${m.color}18`, borderRadius: "0.65rem", padding: "0.6rem 0.85rem", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: m.color, flexShrink: 0, textShadow: `0 0 8px ${m.color}50` }}>Timing</span>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>{m.tip}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DietePage() {
  const { isMobile } = useBreakpoint();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: easing }}>
        <p style={{ fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.4rem" }}>
          Plan alimentaire
        </p>
        <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 2.8rem)", textTransform: "uppercase", letterSpacing: "-0.01em", color: "#ffffff", lineHeight: 1 }}>
          DIÈTE
        </h1>
        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.38)", marginTop: "0.4rem" }}>Hypertrophie · Semaine 1</p>
      </motion.div>

      {/* ── Bloc affilié ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: easing, delay: 0.08 }}
      >
        <HoverSpotlight color="#fb923c" style={{
          position: "relative", overflow: "hidden", borderRadius: "1.35rem",
          background: "linear-gradient(145deg, rgba(251,146,60,0.12) 0%, rgba(255,255,255,0.03) 50%, rgba(251,146,60,0.06) 100%)",
          backdropFilter: "blur(28px) saturate(180%)", WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid rgba(251,146,60,0.28)",
          boxShadow: ["inset 0 1px 0 rgba(251,146,60,0.25)", "inset 0 -1px 0 rgba(255,255,255,0.03)", "0 8px 32px rgba(251,146,60,0.1)", "0 2px 8px rgba(0,0,0,0.2)"].join(", "),
          padding: "1.75rem 2rem",
        }}>
          <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: "linear-gradient(to right, transparent, rgba(251,146,60,0.6), rgba(255,255,255,0.4), rgba(251,146,60,0.6), transparent)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", top: "-40px", right: "-30px", width: "200px", height: "180px", pointerEvents: "none", background: "radial-gradient(ellipse, rgba(251,146,60,0.2) 0%, transparent 65%)", filter: "blur(30px)" }} />
          <div aria-hidden style={{ position: "absolute", bottom: "-1rem", right: "1rem", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "6rem", lineHeight: 1, color: "rgba(251,146,60,0.05)", userSelect: "none", pointerEvents: "none", letterSpacing: "-0.02em" }}>
            TRACK
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem", background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.28)", borderRadius: "999px", padding: "0.22rem 0.75rem" }}>
              <Smartphone size={11} color="#fb923c" />
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fb923c" }}>Appli partenaire</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.45rem", textTransform: "uppercase", letterSpacing: "0.03em", color: "#ffffff", lineHeight: 1.1, marginBottom: "0.5rem" }}>
              Gérez votre nutrition{" "}
              <span style={{ color: "#fb923c", textShadow: "0 0 20px rgba(251,146,60,0.45)" }}>en temps réel</span>
            </h2>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: "38rem", marginBottom: "1.1rem" }}>
              Paul a préparé vos objectifs ci-dessous — pour scanner vos aliments et suivre vos macros au quotidien, on vous recommande notre appli partenaire.{" "}
              <span style={{ color: "rgba(255,255,255,0.65)" }}>Tout est calé sur vos objectifs personnalisés.</span>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "1.25rem" }}>
              {[{ icon: ScanLine, label: "Scanner code-barres" }, { icon: BarChart3, label: "Suivi macros en direct" }, { icon: Flame, label: "Calories adaptées" }].map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "999px", padding: "0.3rem 0.75rem", backdropFilter: "blur(8px)" }}>
                  <Icon size={11} color="rgba(251,146,60,0.8)" />
                  <span style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.55)" }}>{label}</span>
                </div>
              ))}
            </div>
            <a
              href="AFFILIATE_LINK_HERE"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", background: "linear-gradient(135deg, #fb923c, #f97316)", color: "#1a0800", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase", padding: "0.7rem 1.5rem", borderRadius: "999px", textDecoration: "none", boxShadow: "0 0 0 1px rgba(251,146,60,0.4), 0 4px 20px rgba(251,146,60,0.4), inset 0 1px 0 rgba(255,255,255,0.3)", transition: "all 0.18s ease" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 0 0 1px rgba(251,146,60,0.6), 0 8px 28px rgba(251,146,60,0.5), inset 0 1px 0 rgba(255,255,255,0.3)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = "0 0 0 1px rgba(251,146,60,0.4), 0 4px 20px rgba(251,146,60,0.4), inset 0 1px 0 rgba(255,255,255,0.3)"; }}
            >
              Accéder à l&apos;appli <ExternalLink size={12} />
            </a>
            <p style={{ marginTop: "0.55rem", fontSize: "0.68rem", color: "rgba(255,255,255,0.2)" }}>Lien partenaire · peut contenir une commission</p>
          </div>
        </HoverSpotlight>
      </motion.div>

      {/* ── Macro cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "0.85rem" }}>
        {macros.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: easing, delay: 0.12 + i * 0.07 }}
            >
              <HoverSpotlight color={m.color} style={{
                borderRadius: "1.25rem", padding: "1.35rem 1.1rem",
                position: "relative", overflow: "hidden",
                background: `linear-gradient(145deg, ${m.color}14 0%, rgba(255,255,255,0.04) 55%, ${m.color}08 100%)`,
                backdropFilter: "blur(32px) saturate(200%)", WebkitBackdropFilter: "blur(32px) saturate(200%)",
                border: `1px solid ${m.color}38`,
                boxShadow: [`inset 0 1px 0 ${m.color}30`, "inset 0 -1px 0 rgba(255,255,255,0.04)", `inset 1px 0 0 ${m.color}14`, `inset -1px 0 0 ${m.color}08`, `0 8px 32px ${m.color}18`, "0 2px 8px rgba(0,0,0,0.25)"].join(", "),
              }}>
                <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${m.color}80, rgba(255,255,255,0.6), ${m.color}80, transparent)`, pointerEvents: "none" }} />
                <div aria-hidden style={{ position: "absolute", top: "-60%", left: "50%", transform: "translateX(-50%)", width: "120px", height: "100px", pointerEvents: "none", background: `radial-gradient(ellipse, ${m.color}28 0%, transparent 70%)`, filter: "blur(18px)" }} />
                <div aria-hidden style={{ position: "absolute", bottom: "-30px", right: "-30px", width: "100px", height: "100px", pointerEvents: "none", background: `radial-gradient(ellipse, ${m.color}30 0%, transparent 65%)`, filter: "blur(16px)" }} />
                <div aria-hidden style={{ position: "absolute", bottom: "-0.75rem", right: "-0.5rem", opacity: 0.1 }}><Icon size={68} color={m.color} /></div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.9rem", position: "relative" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: `${m.color}22`, border: `1px solid ${m.color}50`, backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 10px ${m.color}30, inset 0 1px 0 rgba(255,255,255,0.25)` }}>
                    <Icon size={12} color={m.color} />
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>{m.label}</span>
                </div>
                <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "2rem", color: m.color, lineHeight: 1, marginBottom: "0.7rem", textShadow: `0 0 20px ${m.color}70, 0 0 40px ${m.color}30`, position: "relative" }}>
                  {m.value}<span style={{ fontSize: "0.95rem", fontWeight: 400, color: `${m.color}80`, marginLeft: "3px" }}>{m.unit}</span>
                </p>
                <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden", position: "relative" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: 0.9, ease: easing, delay: 0.35 + i * 0.07 }} style={{ height: "100%", background: m.color, borderRadius: "999px", boxShadow: `0 0 8px ${m.color}80` }} />
                </div>
              </HoverSpotlight>
            </motion.div>
          );
        })}
      </div>

      {/* ── À quoi servent vos macros ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easing, delay: 0.22 }}>

        {/* Header + répartition calorique */}
        <div style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.3rem" }}>
            Comprendre vos macros
          </p>
          <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.4rem", textTransform: "uppercase", letterSpacing: "0.03em", color: "#ffffff", lineHeight: 1, marginBottom: "1rem" }}>
            À quoi sert chaque nutriment ?
          </h2>

          {/* Stacked bar — répartition calorique P/G/L */}
          <HoverSpotlight color="#ffffff" style={{
            ...glassCard("#ffffff"),
            padding: "1.1rem 1.4rem",
          }}>
            <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)", pointerEvents: "none" }} />
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "0.75rem", position: "relative" }}>
              Répartition calorique journalière — 2 800 kcal
            </p>
            <div style={{ display: "flex", height: "10px", borderRadius: "999px", overflow: "hidden", gap: "2px", marginBottom: "0.75rem", position: "relative" }}>
              {[
                { color: "#38bdf8", pct: 26, label: "Protéines" },
                { color: "#a78bfa", pct: 46, label: "Glucides" },
                { color: "#4ade80", pct: 26, label: "Lipides" },
              ].map((seg, si) => (
                <motion.div
                  key={seg.label}
                  initial={{ width: 0 }}
                  animate={{ width: `${seg.pct}%` }}
                  transition={{ duration: 0.9, ease: easing, delay: 0.3 + si * 0.12 }}
                  style={{ height: "100%", background: seg.color, boxShadow: `0 0 8px ${seg.color}70`, borderRadius: si === 0 ? "999px 0 0 999px" : si === 2 ? "0 999px 999px 0" : "0" }}
                />
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", position: "relative" }}>
              {[
                { color: "#38bdf8", label: "Protéines", g: "180g", kcal: "720 kcal", pct: "26%" },
                { color: "#a78bfa", label: "Glucides", g: "320g", kcal: "1 280 kcal", pct: "46%" },
                { color: "#4ade80", label: "Lipides", g: "80g", kcal: "720 kcal", pct: "26%" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: s.color, boxShadow: `0 0 6px ${s.color}80`, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>{s.label}</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: s.color, textShadow: `0 0 8px ${s.color}50` }}>{s.g}</span>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.22)" }}>·</span>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.28)" }}>{s.kcal} ({s.pct})</span>
                </div>
              ))}
            </div>
          </HoverSpotlight>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "0.85rem" }}>
          {macroExplains.map((m, i) => (
            <MacroExplainCard key={m.label} m={m} i={i} />
          ))}
        </div>
      </motion.div>

      {/* ── Hydration + Coach note ── */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.85rem" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: easing, delay: 0.38 }}>
          <HoverSpotlight color="#38bdf8" style={{ ...glassCard("#38bdf8"), padding: "1.1rem 1.4rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.5), rgba(255,255,255,0.35), rgba(56,189,248,0.5), transparent)", pointerEvents: "none" }} />
            <Info size={14} color="#38bdf8" style={{ flexShrink: 0, marginTop: "2px", filter: "drop-shadow(0 0 4px rgba(56,189,248,0.6))" }} />
            <div>
              <p style={{ fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.3rem", textShadow: "0 0 10px rgba(56,189,248,0.5)" }}>Hydratation</p>
              <p style={{ fontSize: "0.86rem", color: "rgba(255,255,255,0.48)", lineHeight: 1.65 }}>
                Objectif : <strong style={{ color: "#38bdf8", textShadow: "0 0 8px rgba(56,189,248,0.5)" }}>3 L</strong> d&apos;eau par jour. Bois 500 ml avant chaque séance.
              </p>
            </div>
          </HoverSpotlight>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: easing, delay: 0.44 }}>
          <HoverSpotlight color="#38bdf8" style={{ ...glassCard("#38bdf8"), padding: "1.1rem 1.4rem" }}>
            <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.5), rgba(255,255,255,0.35), rgba(56,189,248,0.5), transparent)", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem", position: "relative" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(56,189,248,0.25), rgba(56,189,248,0.06))", border: "1.5px solid rgba(56,189,248,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.68rem", color: "#38bdf8", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" }}>BP</div>
              <div>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ffffff", lineHeight: 1 }}>Paul</p>
                <p style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.25)", marginTop: "0.1rem" }}>Note nutrition</p>
              </div>
            </div>
            <p style={{ fontSize: "0.86rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65, position: "relative" }}>
              Priorité aux protéines à chaque repas (min. 30 g). Si tu t&apos;entraînes le matin, mange tes glucides avant la séance. Hydratation : 3 L/jour minimum.
            </p>
          </HoverSpotlight>
        </motion.div>
      </div>

      {/* ── Nos Recettes ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easing, delay: 0.5 }}>
      <HoverSpotlight color="#fb923c" style={{ position: "relative", overflow: "hidden", borderRadius: "1.35rem", background: "linear-gradient(145deg, rgba(251,146,60,0.13) 0%, rgba(255,255,255,0.03) 50%, rgba(251,146,60,0.06) 100%)", backdropFilter: "blur(28px) saturate(180%)", WebkitBackdropFilter: "blur(28px) saturate(180%)", border: "1px solid rgba(251,146,60,0.25)", boxShadow: ["inset 0 1px 0 rgba(251,146,60,0.22)", "0 8px 40px rgba(251,146,60,0.08)", "0 2px 8px rgba(0,0,0,0.2)"].join(", "), padding: "2rem 2.25rem" }}>
        {/* Specular */}
        <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: "linear-gradient(to right, transparent, rgba(251,146,60,0.6), rgba(255,255,255,0.4), rgba(251,146,60,0.6), transparent)", pointerEvents: "none" }} />
        {/* Corner glow */}
        <div aria-hidden style={{ position: "absolute", top: "-60px", right: "-40px", width: "280px", height: "220px", pointerEvents: "none", background: "radial-gradient(ellipse, rgba(251,146,60,0.18) 0%, transparent 65%)", filter: "blur(40px)" }} />
        {/* Watermark */}
        <div aria-hidden style={{ position: "absolute", bottom: "-1.5rem", right: "-0.5rem", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "7rem", lineHeight: 1, color: "rgba(251,146,60,0.06)", userSelect: "none", pointerEvents: "none", letterSpacing: "-0.02em" }}>
          RECIPES
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", marginBottom: "1rem", background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.28)", borderRadius: "999px", padding: "0.25rem 0.8rem" }}>
            <ChefHat size={11} color="#fb923c" />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fb923c" }}>En préparation</span>
          </div>

          <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", textTransform: "uppercase", letterSpacing: "0.02em", color: "#ffffff", lineHeight: 1, marginBottom: "0.6rem" }}>
            Des recettes qui vont vous{" "}
            <span style={{ color: "#fb923c", textShadow: "0 0 24px rgba(251,146,60,0.5)" }}>régaler</span>
          </h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.65, maxWidth: "36rem", marginBottom: "1.5rem" }}>
            Paul prépare pour vous des recettes protéinées, gourmandes et calibrées sur vos macros — disponibles très prochainement dans votre espace.
          </p>

          {/* Ghost category chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginBottom: "1.5rem" }}>
            {["🍗 Post-training", "🥣 Petit-déjeuner", "⚡ Snacks protéinés", "🐟 Dîner léger", "🥞 Brunch fit"].map((label) => (
              <span key={label} style={{ fontSize: "0.78rem", color: "rgba(251,146,60,0.45)", background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.14)", borderRadius: "999px", padding: "0.3rem 0.8rem", filter: "blur(0.4px)", opacity: 0.7 }}>
                {label}
              </span>
            ))}
          </div>

          {/* Coach signature */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(251,146,60,0.28), rgba(251,146,60,0.08))", border: "1.5px solid rgba(251,146,60,0.32)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.68rem", color: "#fb923c", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)" }}>BP</div>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.28)", fontStyle: "italic" }}>
              Recettes conçues par Paul · adaptées à vos objectifs
            </p>
          </div>
        </div>
      </HoverSpotlight>
      </motion.div>

    </div>
  );
}
