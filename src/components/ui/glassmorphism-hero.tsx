"use client";

import React from "react";
import {
  ArrowRight,
  Play,
  Target,
  Crown,
  Star,
  Dumbbell,
  Flame,
  Zap,
  Apple,
  Heart,
  Timer,
  Activity,
  BarChart3,
} from "lucide-react";

const EXPERTISE = [
  { name: "Prise de Masse", icon: Dumbbell },
  { name: "Perte de Poids", icon: Flame },
  { name: "Force & Puissance", icon: Zap },
  { name: "Nutrition", icon: Apple },
  { name: "Cardio", icon: Heart },
  { name: "Récupération", icon: Timer },
  { name: "Performance", icon: Activity },
  { name: "Progression", icon: BarChart3 },
];

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
    <span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">
      {label}
    </span>
  </div>
);

export default function GlassmorphismHero() {
  return (
    <div className="relative w-full bg-zinc-950 text-white overflow-hidden font-sans">
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

      {/* Background: dark gym atmosphere — replace src with your own photo */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-35"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&fit=crop)",
          maskImage:
            "linear-gradient(180deg, transparent, black 10%, black 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent, black 10%, black 70%, transparent)",
        }}
      />

      {/* Subtle red glow bottom-left */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-red-600/8 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">

            {/* Badge */}
            <div className="animate-fade-in delay-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-white/10">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  Coaching Elite · BP Perform
                  <Star className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1
              className="animate-fade-in delay-200 font-heading font-bold uppercase tracking-tight leading-[0.9]"
              style={{
                fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
                textShadow: "0 2px 40px rgba(0,0,0,0.9)",
              }}
            >
              Les champions<br />
              ne naissent pas.<br />
              <span className="bg-gradient-to-br from-white via-white to-red-400 bg-clip-text text-transparent">
                Ils se forgent.
              </span>
            </h1>

            {/* Description */}
            <p className="animate-fade-in delay-300 max-w-xl text-lg text-zinc-300 leading-relaxed" style={{ textShadow: "0 1px 20px rgba(0,0,0,0.8)" }}>
              Musculation, perte de poids, transformation physique. Un coaching
              d&apos;élite pour ceux qui refusent{" "}
              <span className="text-white font-semibold">l&apos;ordinaire</span>{" "}
              et visent l&apos;exceptionnel.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-red-500 active:scale-[0.98]"
              >
                Démarrer maintenant
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#programmes"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20"
              >
                <Play className="w-4 h-4 fill-current" />
                Voir les programmes
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 space-y-6 lg:mt-12">

            {/* Stats Card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
              {/* Card glow */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
                    <Target className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight text-white">
                      100+
                    </div>
                    <div className="text-sm text-zinc-400">Clients accompagnés</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Objectifs atteints</span>
                    <span className="text-white font-medium">95%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                    <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-red-600 to-red-400" />
                  </div>
                </div>

                <div className="h-px w-full bg-white/10 mb-6" />

                {/* Mini stats grid */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <StatItem value="3+" label="Années" />
                  <div className="w-px h-full bg-white/10 mx-auto" />
                  <StatItem value="7j/7" label="Support" />
                  <div className="w-px h-full bg-white/10 mx-auto" />
                  <StatItem value="95%" label="Résultats" />
                </div>

                {/* Tags */}
                <div className="mt-8 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    DISPONIBLE
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    <Crown className="w-3 h-3 text-red-400" />
                    COACHING ELITE
                  </div>
                </div>
              </div>
            </div>

            {/* Marquee card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 backdrop-blur-xl">
              <h3 className="mb-6 px-8 text-sm font-medium text-zinc-400">
                Domaines d&apos;expertise
              </h3>

              <div
                className="relative flex overflow-hidden"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                }}
              >
                <div className="animate-marquee flex gap-10 whitespace-nowrap px-4">
                  {[...EXPERTISE, ...EXPERTISE, ...EXPERTISE].map(
                    (item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 opacity-50 transition-all hover:opacity-100 hover:scale-105 cursor-default"
                      >
                        <item.icon className="h-5 w-5 text-red-400" />
                        <span className="text-base font-bold text-white tracking-tight">
                          {item.name}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
