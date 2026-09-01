"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { InteractiveTravelCard } from "@/components/ui/3d-card";
import { ProgramModal, type ProgramData } from "@/components/ui/program-modal";

const programs: (ProgramData & { imageUrl: string })[] = [
  {
    title: "Perte de Gras",
    subtitle: "Sèche & Définition",
    imageUrl: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&q=80&fit=crop",
    description:
      "L'objectif ici est de vous aider à construire un physique plus sec, plus dessiné et plus défini. La priorité sera la perte de gras, tout en conservant un maximum de masse musculaire.",
    points: [
      "Adapter votre hygiène de vie pour créer des habitudes durables.",
      "Adapter votre alimentation afin de favoriser la perte de gras.",
      "Planifier vos entraînements sur mesure, avec des exercices adaptés à votre objectif.",
      "Suivre vos résultats et ajuster le programme au fil de votre progression.",
    ],
  },
  {
    title: "Hybride",
    subtitle: "Force & Endurance",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&fit=crop",
    description:
      "L'objectif ici est de construire un physique complet, fort, explosif et endurant. On recherche la polyvalence : être capable de développer sa force, son explosivité et son endurance, sans se spécialiser dans un seul domaine.",
    points: [
      "Adapter votre alimentation pour soutenir vos performances et votre récupération.",
      "Planifier des entraînements spécifiques pour développer force, explosivité et endurance.",
      "Suivre vos performances et vos résultats dans ces trois domaines afin de mesurer votre progression.",
    ],
  },
  {
    title: "Prise de Masse",
    subtitle: "Musculation",
    imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80&fit=crop",
    description:
      "L'objectif ici est de vous aider à construire un physique plus musclé et plus athlétique, notamment si vous partez d'une base skinny ou skinny fat. L'objectif sera de développer votre masse musculaire progressivement, tout en construisant des bases solides.",
    points: [
      "Adapter votre alimentation afin de favoriser une prise de masse maîtrisée.",
      "Construire des séances de musculation sur mesure, adaptées à votre niveau et à votre morphologie.",
      "Suivre votre évolution et ajuster le programme pour continuer à progresser.",
    ],
  },
];

const easing = [0.22, 1, 0.36, 1] as const;
const container = { hidden: {}, show: { transition: { staggerChildren: 0.14 } } };
const item = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easing } } };

export default function ProgramsSection() {
  const [selected, setSelected] = useState<ProgramData | null>(null);

  return (
    <>
      <ProgramModal program={selected} onClose={() => setSelected(null)} />

      <section id="programmes" style={{
        padding: "4rem 0 7rem",
        position: "relative",
        overflow: "hidden",
        background: "#070c16",
      }}>
        {/* Grid lines */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(56,189,248,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.045) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, black 40%, transparent 100%)",
          zIndex: 0, pointerEvents: "none",
        }} />

        {/* Glow orb — left */}
        <div aria-hidden style={{
          position: "absolute", top: "10%", left: "-5%",
          width: "45%", height: "70%",
          background: "radial-gradient(ellipse, rgba(56,189,248,0.1) 0%, transparent 65%)",
          filter: "blur(50px)", zIndex: 0, pointerEvents: "none",
        }} />

        {/* Glow orb — right */}
        <div aria-hidden style={{
          position: "absolute", bottom: "5%", right: "-5%",
          width: "40%", height: "60%",
          background: "radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 65%)",
          filter: "blur(50px)", zIndex: 0, pointerEvents: "none",
        }} />

        {/* Center vertical accent */}
        <div aria-hidden style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "1px", height: "100%",
          background: "linear-gradient(to bottom, transparent, rgba(56,189,248,0.12) 30%, rgba(56,189,248,0.12) 70%, transparent)",
          zIndex: 0, pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "4rem" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "1rem" }}>
              Ce qu&apos;on fait
            </p>
            <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(2.5rem, 6vw, 4rem)", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1, color: "#ffffff" }}>
              NOS<br /><span style={{ color: "#38bdf8" }}>PROGRAMMES</span>
            </h2>
            <div style={{ marginTop: "1.5rem", width: "4rem", height: "2px", background: "#38bdf8" }} />
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid md:grid-cols-3 gap-6"
            style={{ perspective: "1000px" }}
          >
            {programs.map((p, i) => (
              <motion.div key={p.title} variants={item} style={{ perspective: "1000px", position: "relative" }}>
                <div aria-hidden style={{
                  position: "absolute", inset: "-30%", zIndex: 0, pointerEvents: "none",
                  background: `radial-gradient(ellipse 70% 60% at 50% 60%, rgba(56,189,248,${i === 0 ? 0.22 : i === 1 ? 0.18 : 0.20}) 0%, transparent 70%)`,
                  filter: "blur(18px)",
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <InteractiveTravelCard
                    title={p.title}
                    subtitle={p.subtitle}
                    imageUrl={p.imageUrl}
                    actionText="En savoir plus"
                    href="#programmes"
                    onActionClick={() => setSelected(p)}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
