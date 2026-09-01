"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Trophy, Dumbbell, Utensils, TrendingUp, LayoutDashboard, Scale, Ruler } from "lucide-react";

// ── Tour steps ──────────────────────────────────────────────────────────────
type Step = {
  id: string;
  target: string | null;
  icon: React.ReactNode;
  title: string;
  description: string;
  page?: string; // pathname required to show this step
};

const STEPS: Step[] = [
  {
    id: "welcome",
    target: null,
    icon: <Trophy size={28} color="#facc15" />,
    title: "Bienvenue dans votre espace",
    description: "",
  },
  {
    id: "dash-nav",
    target: "#tour-nav-dashboard",
    page: "/dashboard",
    icon: <LayoutDashboard size={16} color="#38bdf8" />,
    title: "Tableau de bord",
    description: "Votre point de départ chaque jour. Tout ce dont vous avez besoin au quotidien est regroupé ici.",
  },
  {
    id: "dash-stats",
    target: "#tour-dash-stats",
    page: "/dashboard",
    icon: <TrendingUp size={16} color="#38bdf8" />,
    title: "Vos statistiques",
    description: "Streak, séances validées, avancement du programme et poids actuel — tout évolue en temps réel à chaque validation.",
  },
  {
    id: "dash-seance",
    target: "#tour-dash-seance",
    page: "/dashboard",
    icon: <Dumbbell size={16} color="#4ade80" />,
    title: "Valider une séance",
    description: "Après chaque entraînement, cliquez ce bouton. BP Perform enregistre la date, met à jour votre streak et comptabilise vos séances sur la durée.",
  },
  {
    id: "programme",
    target: "#tour-nav-programme",
    page: "/dashboard",
    icon: <Dumbbell size={16} color="#38bdf8" />,
    title: "Mon Programme",
    description: "Le détail complet de chaque séance — exercices, séries, répétitions, temps de repos. Baptiste met à jour votre programme en direct.",
  },
  {
    id: "diete",
    target: "#tour-nav-diete",
    page: "/dashboard",
    icon: <Utensils size={16} color="#fb923c" />,
    title: "Diète & Nutrition",
    description: "Vos objectifs caloriques et macros sur mesure. Les conseils et ajustements de Baptiste apparaissent directement ici.",
  },
  {
    id: "prog-nav",
    target: "#tour-nav-progression",
    page: "/dashboard/progression",
    icon: <TrendingUp size={16} color="#4ade80" />,
    title: "Ma Progression",
    description: "La section la plus importante pour mesurer vos résultats. Venez ici régulièrement pour alimenter vos données.",
  },
  {
    id: "prog-poids",
    target: "#tour-prog-poids",
    page: "/dashboard/progression",
    icon: <Scale size={16} color="#38bdf8" />,
    title: "Suivi du poids",
    description: "Enregistrez votre poids après chaque séance. BP Perform trace la courbe d'évolution et vous montre la tendance sur le long terme.",
  },
  {
    id: "prog-charges",
    target: "#tour-prog-charges",
    page: "/dashboard/progression",
    icon: <Dumbbell size={16} color="#a78bfa" />,
    title: "Mes Charges",
    description: "Entrez le poids soulevé pour chaque exercice. BP Perform détecte automatiquement chaque nouveau record personnel (PR) et suit votre progression.",
  },
  {
    id: "prog-mesures",
    target: "#tour-prog-mesures",
    page: "/dashboard/progression",
    icon: <Ruler size={16} color="#4ade80" />,
    title: "Mensurations",
    description: "Notez vos mesures de départ puis vos valeurs actuelles. L'évolution se calcule automatiquement — tour de bras, taille, cuisse et plus.",
  },
];

// ── Confetti ─────────────────────────────────────────────────────────────────
function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLORS = ["#38bdf8", "#a78bfa", "#4ade80", "#fb923c", "#ffffff", "#facc15", "#f87171", "#34d399"];

    type P = { x: number; y: number; vx: number; vy: number; w: number; h: number; color: string; rot: number; rotV: number; };
    const particles: P[] = [];

    const origins = [
      { x: canvas.width * 0.3, vy0: -20 },
      { x: canvas.width * 0.5, vy0: -24 },
      { x: canvas.width * 0.7, vy0: -20 },
    ];

    origins.forEach(({ x, vy0 }) => {
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 80,
          y: canvas.height * 0.6,
          vx: (Math.random() - 0.5) * 14,
          vy: vy0 + Math.random() * 10,
          w: 5 + Math.random() * 9,
          h: 3 + Math.random() * 5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.22,
        });
      }
    });

    const ctxRef = ctx;
    const canvasEl = canvas;
    const t0 = Date.now();
    let raf: number;

    function draw() {
      ctxRef.clearRect(0, 0, canvasEl.width, canvasEl.height);
      const elapsed = Date.now() - t0;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4;
        p.vx *= 0.99;
        p.rot += p.rotV;
        const alpha = elapsed > 1800 ? Math.max(0, 1 - (elapsed - 1800) / 1800) : 1;
        if (alpha <= 0) return;
        ctxRef.save();
        ctxRef.globalAlpha = alpha;
        ctxRef.translate(p.x, p.y);
        ctxRef.rotate(p.rot);
        ctxRef.fillStyle = p.color;
        ctxRef.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctxRef.restore();
      });
      if (elapsed < 4000) raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10001 }} />;
}

// ── Overlay with spotlight cutout ────────────────────────────────────────────
function OverlayCutout({ rect }: { rect: DOMRect | null }) {
  const PAD = 10;
  const BG = "rgba(3,8,18,0.88)";
  const TR = "all 0.45s cubic-bezier(0.22,1,0.36,1)";

  if (!rect) {
    return <div style={{ position: "fixed", inset: 0, background: BG, zIndex: 9800 }} />;
  }

  const { top, left, right, bottom, width, height } = rect;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: Math.max(0, top - PAD), background: BG, zIndex: 9800, transition: TR }} />
      <div style={{ position: "fixed", top: Math.min(vh, bottom + PAD), left: 0, right: 0, bottom: 0, background: BG, zIndex: 9800, transition: TR }} />
      <div style={{ position: "fixed", top: Math.max(0, top - PAD), left: 0, width: Math.max(0, left - PAD), height: height + PAD * 2, background: BG, zIndex: 9800, transition: TR }} />
      <div style={{ position: "fixed", top: Math.max(0, top - PAD), left: Math.min(vw, right + PAD), right: 0, height: height + PAD * 2, background: BG, zIndex: 9800, transition: TR }} />
      <div style={{ position: "fixed", top: top - PAD, left: left - PAD, width: width + PAD * 2, height: height + PAD * 2, zIndex: 9801, cursor: "default" }} />
      <motion.div
        animate={{ boxShadow: ["0 0 0 2px rgba(56,189,248,0.6), 0 0 28px rgba(56,189,248,0.25)", "0 0 0 4px rgba(56,189,248,0.25), 0 0 50px rgba(56,189,248,0.12)", "0 0 0 2px rgba(56,189,248,0.6), 0 0 28px rgba(56,189,248,0.25)"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "fixed",
          top: top - PAD, left: left - PAD,
          width: width + PAD * 2, height: height + PAD * 2,
          border: "2px solid rgba(56,189,248,0.5)",
          borderRadius: "12px",
          zIndex: 9802, pointerEvents: "none",
          transition: TR,
        }}
      />
    </>
  );
}

// ── Welcome modal ─────────────────────────────────────────────────────────────
function WelcomeModal({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9900, padding: "1rem" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -12 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(145deg, rgba(10,18,32,0.99) 0%, rgba(6,11,21,0.99) 100%)",
          border: "1px solid rgba(56,189,248,0.2)",
          borderRadius: "1.5rem",
          padding: "2.5rem 2.5rem 2rem",
          maxWidth: "460px", width: "100%",
          position: "relative", overflow: "hidden",
          boxShadow: "0 0 80px rgba(56,189,248,0.1), 0 40px 120px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.5), rgba(255,255,255,0.3), rgba(56,189,248,0.5), transparent)" }} />
        <div aria-hidden style={{ position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)", width: "220px", height: "150px", background: "radial-gradient(ellipse, rgba(56,189,248,0.14) 0%, transparent 70%)", filter: "blur(20px)", pointerEvents: "none" }} />

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "76px", height: "76px", borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(250,204,21,0.05))",
              border: "1.5px solid rgba(250,204,21,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 40px rgba(250,204,21,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <Trophy size={34} color="#facc15" />
          </motion.div>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.5rem" }}>
          Félicitations
        </p>
        <h1 style={{ textAlign: "center", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.7rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1.12, marginBottom: "1rem" }}>
          Votre espace<br />BP Perform est prêt
        </h1>
        <p style={{ textAlign: "center", fontSize: "0.88rem", color: "rgba(255,255,255,0.48)", lineHeight: 1.7, marginBottom: "2rem" }}>
          Baptiste a tout configuré pour vous. Faisons un rapide tour de votre espace client pour que vous sachiez où tout se trouve.
        </p>

        <button onClick={onStart}
          style={{
            width: "100%", padding: "0.9rem 1.5rem", marginBottom: "0.7rem",
            background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
            color: "#03090f", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase",
            border: "none", borderRadius: "0.85rem", cursor: "pointer",
            boxShadow: "0 4px 24px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            transition: "box-shadow 0.2s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 32px rgba(56,189,248,0.6), inset 0 1px 0 rgba(255,255,255,0.3)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 24px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.3)")}
        >
          Commencer la visite <ArrowRight size={16} />
        </button>

        <button onClick={onSkip}
          style={{ width: "100%", padding: "0.5rem", background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
        >
          Passer le tutoriel
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Tour tooltip ──────────────────────────────────────────────────────────────
function TourTooltip({
  step, stepIndex, totalSteps, targetRect, onNext, onSkip, isLast,
}: {
  step: Step; stepIndex: number; totalSteps: number;
  targetRect: DOMRect | null; onNext: () => void; onSkip: () => void; isLast: boolean;
}) {
  const W = 320;
  const H = 240;
  const GAP = 22;
  const PAD = 12;

  let pos: React.CSSProperties;
  let arrowSide: "left" | "right" | "top" | "bottom" | null = null;

  if (!targetRect) {
    pos = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  } else {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const midY = targetRect.top + targetRect.height / 2;
    const midX = targetRect.left + targetRect.width / 2;

    if (targetRect.right + GAP + W < vw) {
      arrowSide = "left";
      pos = { position: "fixed", left: targetRect.right + GAP, top: Math.max(PAD, Math.min(vh - H - PAD, midY - H / 2)) };
    } else if (targetRect.left - GAP - W > 0) {
      arrowSide = "right";
      pos = { position: "fixed", left: targetRect.left - GAP - W, top: Math.max(PAD, Math.min(vh - H - PAD, midY - H / 2)) };
    } else if (targetRect.bottom + GAP + H < vh) {
      arrowSide = "top";
      pos = { position: "fixed", top: targetRect.bottom + GAP, left: Math.max(PAD, Math.min(vw - W - PAD, midX - W / 2)) };
    } else {
      arrowSide = "bottom";
      pos = { position: "fixed", top: targetRect.top - GAP - H, left: Math.max(PAD, Math.min(vw - W - PAD, midX - W / 2)) };
    }
  }

  const tourStep = stepIndex - 1;
  const tourTotal = totalSteps - 1;

  const ArrowDiamond = ({ side }: { side: "left" | "right" | "top" | "bottom" }) => {
    const base: React.CSSProperties = {
      position: "absolute", width: "12px", height: "12px",
      background: "rgba(10,18,32,0.99)",
      border: "1px solid rgba(56,189,248,0.2)",
    };
    if (side === "left")   return <div style={{ ...base, left: "-6px",   top: "50%",  transform: "translateY(-50%) rotate(45deg)", borderRight: "none", borderTop: "none" }} />;
    if (side === "right")  return <div style={{ ...base, right: "-6px",  top: "50%",  transform: "translateY(-50%) rotate(45deg)", borderLeft: "none", borderBottom: "none" }} />;
    if (side === "top")    return <div style={{ ...base, top: "-6px",    left: "50%", transform: "translateX(-50%) rotate(45deg)", borderBottom: "none", borderRight: "none" }} />;
    return                        <div style={{ ...base, bottom: "-6px", left: "50%", transform: "translateX(-50%) rotate(45deg)", borderTop: "none", borderLeft: "none" }} />;
  };

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        ...pos,
        width: `${W}px`,
        background: "linear-gradient(145deg, rgba(10,18,32,0.99) 0%, rgba(6,11,21,0.99) 100%)",
        border: "1px solid rgba(56,189,248,0.22)",
        borderRadius: "1.05rem",
        padding: "1.3rem 1.4rem 1.15rem",
        zIndex: 9900,
        boxShadow: "0 20px 60px rgba(0,0,0,0.65), 0 0 40px rgba(56,189,248,0.08), inset 0 1px 0 rgba(255,255,255,0.08)",
        overflow: "visible",
      }}
    >
      <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.4), rgba(255,255,255,0.18), rgba(56,189,248,0.4), transparent)", borderRadius: "999px" }} />

      {arrowSide && <ArrowDiamond side={arrowSide} />}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.9rem" }}>
        <span style={{ fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#38bdf8" }}>
          Étape {tourStep + 1}&nbsp;/&nbsp;{tourTotal}
        </span>
        <button onClick={onSkip} title="Fermer le tutoriel"
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", display: "flex", transition: "color 0.15s", padding: "0.15rem" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
        >
          <X size={13} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.65rem" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {step.icon}
        </div>
        <h3 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#ffffff", margin: 0 }}>
          {step.title}
        </h3>
      </div>

      <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.52)", lineHeight: 1.65, marginBottom: "1.1rem" }}>
        {step.description}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "0.3rem" }}>
          {Array.from({ length: tourTotal }).map((_, i) => (
            <div key={i} style={{
              width: i === tourStep ? "18px" : "6px", height: "6px",
              borderRadius: "999px",
              background: i === tourStep ? "#38bdf8" : "rgba(255,255,255,0.1)",
              transition: "all 0.3s ease",
              boxShadow: i === tourStep ? "0 0 8px rgba(56,189,248,0.7)" : "none",
            }} />
          ))}
        </div>

        <button onClick={onNext}
          style={{
            display: "flex", alignItems: "center", gap: "0.38rem",
            padding: "0.48rem 1rem",
            background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
            color: "#03090f", fontWeight: 800, fontSize: "0.76rem", letterSpacing: "0.1em", textTransform: "uppercase",
            border: "none", borderRadius: "999px", cursor: "pointer",
            boxShadow: "0 3px 14px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
            transition: "box-shadow 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(56,189,248,0.6), inset 0 1px 0 rgba(255,255,255,0.3)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 3px 14px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.3)")}
        >
          {isLast ? "Terminer" : "Suivant"} <ArrowRight size={12} />
        </button>
      </div>
    </motion.div>
  );
}

// ── Main exported component ───────────────────────────────────────────────────
export function OnboardingTour() {
  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem("bp_tour_complete");
    if (!done) {
      const t = setTimeout(() => {
        setShow(true);
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 4500);
      }, 350);
      return () => clearTimeout(t);
    }
  }, []);

  const measureEl = useCallback((target: string) => {
    const el = document.querySelector(target);
    if (!el) { setTargetRect(null); return; }
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.right < 0 || r.left > window.innerWidth) { setTargetRect(null); return; }
    setTargetRect(r);
  }, []);

  useEffect(() => {
    if (!show || step === 0) { setTargetRect(null); return; }

    const s = STEPS[step];

    // Navigate if the step requires a different page
    if (s.page && pathname !== s.page) {
      setTargetRect(null);
      router.push(s.page);
      return;
    }

    if (!s.target) { setTargetRect(null); return; }

    // Scroll the element into view (centered) so it's always visible
    const el = document.querySelector(s.target);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    // Measure after scroll animation settles
    const t = setTimeout(() => measureEl(s.target!), 520);

    // Re-measure on scroll so spotlight tracks the element
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => measureEl(s.target!));
    }
    function onResize() { measureEl(s.target!); }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [show, step, pathname, measureEl, router]);

  function complete() {
    localStorage.setItem("bp_tour_complete", "true");
    setShow(false);
    // Return to dashboard after tour ends on progression
    if (pathname !== "/dashboard") router.push("/dashboard");
  }

  function next() {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else complete();
  }

  if (!show) return null;

  const currentStep = STEPS[step];
  const isWelcome = step === 0;
  const isLast = step === STEPS.length - 1;

  return (
    <>
      <ConfettiCanvas active={confettiActive} />
      <OverlayCutout rect={isWelcome ? null : targetRect} />

      <AnimatePresence mode="wait">
        {isWelcome ? (
          <WelcomeModal key="welcome" onStart={next} onSkip={complete} />
        ) : (
          <TourTooltip
            key={currentStep.id}
            step={currentStep}
            stepIndex={step}
            totalSteps={STEPS.length}
            targetRect={targetRect}
            onNext={next}
            onSkip={complete}
            isLast={isLast}
          />
        )}
      </AnimatePresence>
    </>
  );
}
