"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: easing },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-bg">
      {/* Geometric red accent */}
      <div className="absolute right-0 top-0 w-[45%] h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-bl from-accent/8 to-transparent" />
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
      </div>

      {/* Top-right corner mark */}
      <div className="absolute top-24 right-10 hidden lg:block pointer-events-none">
        <div className="w-12 h-12 border-t-2 border-r-2 border-accent opacity-60" />
      </div>

      {/* Bottom-left corner mark */}
      <div className="absolute bottom-20 left-10 hidden lg:block pointer-events-none">
        <div className="w-8 h-8 border-b-2 border-l-2 border-accent/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Label */}
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="section-label mb-6"
        >
          Coaching Elite · BP Perform
        </motion.p>

        {/* Main headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-heading font-bold uppercase leading-none tracking-tight"
          style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
        >
          FORGE<br />
          <span className="text-accent">TON</span><br />
          EXCELLENCE
        </motion.h1>

        {/* Subtext */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-8 text-muted text-lg max-w-xl leading-relaxed"
        >
          Musculation. Perte de poids. Suivi personnalisé.
          <br />
          Un coaching pensé pour te rendre <span className="text-white font-semibold">exceptionnel</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 bg-accent text-white font-bold uppercase tracking-widest text-sm px-8 py-4 shadow-red hover:bg-accent-hover hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Démarrer maintenant
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#programmes"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted border border-border px-8 py-4 hover:border-white hover:text-white transition-colors"
          >
            Voir les programmes
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-16 flex flex-wrap gap-10"
        >
          {[
            { value: "100+", label: "Clients accompagnés" },
            { value: "95%", label: "Objectifs atteints" },
            { value: "3+", label: "Ans d'expérience" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="font-heading font-bold text-4xl text-accent leading-none">
                {s.value}
              </span>
              <span className="text-muted text-xs uppercase tracking-widest mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs uppercase tracking-widest text-muted">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-muted to-transparent" />
      </div>
    </section>
  );
}
