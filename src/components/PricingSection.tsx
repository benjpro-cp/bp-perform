"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Zap, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { HoverSpotlight } from "@/components/HoverSpotlight";

const SPOTS_TOTAL = 3;
const SPOTS_TAKEN = 0;
const B = "#38bdf8";
const easing = [0.22, 1, 0.36, 1] as const;

const INCLUS = [
  "Programme nutrition sur mesure",
  "Plan entraînement personnalisé",
  "Suivi & ajustements sur 3 mois",
  "Messagerie directe 7j/7",
  "Espace client BP Perform",
];

export default function PricingSection() {
  const [ctaHovered, setCtaHovered] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);

  const tiltRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(priceRef, { once: true });

  // Count-up with delay for card entry animation
  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const duration = 1400;
      const start = Date.now();
      function tick() {
        const t = Math.min((Date.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplayCount(Math.round(eased * 299));
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, 800);
    return () => clearTimeout(timeout);
  }, [isInView]);

  function handleTilt(e: React.MouseEvent<HTMLDivElement>) {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "transform 0.08s linear";
    el.style.transform = `perspective(1100px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
  }

  function resetTilt() {
    const el = tiltRef.current;
    if (!el) return;
    el.style.transition = "transform 0.75s cubic-bezier(0.22,1,0.36,1)";
    el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)";
  }

  return (
    <section id="tarifs" style={{ background: "#060b14", padding: "6rem 0 8rem", position: "relative", overflow: "hidden" }}>

      <style>{`
        @keyframes spin-border { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orb-1 { 0%,100%{transform:translate(0,0)} 40%{transform:translate(40px,-35px)} 70%{transform:translate(-20px,-55px)} }
        @keyframes orb-2 { 0%,100%{transform:translate(0,0)} 35%{transform:translate(-35px,30px)} 65%{transform:translate(30px,-20px)} }
        @keyframes breathe { 0%,100%{opacity:.65} 50%{opacity:1} }
        @keyframes pulse-ring { 0%,100%{box-shadow:0 0 0 0 ${B}55,0 0 8px ${B}90} 60%{box-shadow:0 0 0 5px ${B}00,0 0 16px ${B}} }
      `}</style>

      {/* Floating orbs */}
      <div aria-hidden style={{ position:"absolute", top:"5%", left:"8%", width:520, height:420, background:`radial-gradient(ellipse,${B}0d 0%,transparent 65%)`, filter:"blur(90px)", pointerEvents:"none", animation:"orb-1 14s ease-in-out infinite" }} />
      <div aria-hidden style={{ position:"absolute", bottom:"5%", right:"5%", width:420, height:360, background:`radial-gradient(ellipse,${B}08 0%,transparent 65%)`, filter:"blur(75px)", pointerEvents:"none", animation:"orb-2 17s ease-in-out infinite" }} />

      {/* Dot grid */}
      <div aria-hidden style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`radial-gradient(${B}18 1px, transparent 1px)`,
        backgroundSize:"36px 36px",
        maskImage:"radial-gradient(ellipse 85% 75% at 50% 40%, black 10%, transparent 80%)",
        WebkitMaskImage:"radial-gradient(ellipse 85% 75% at 50% 40%, black 10%, transparent 80%)",
      }} />

      <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 1.5rem", position:"relative", zIndex:1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.6, ease:easing }}
          style={{ textAlign:"center", marginBottom:"3.5rem" }}
        >
          <p style={{ fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.25em", textTransform:"uppercase", color:B, marginBottom:"1rem" }}>Tarif</p>
          <h2 style={{ fontFamily:"var(--font-oswald)", fontWeight:700, fontSize:"clamp(2.4rem,7vw,4.2rem)", textTransform:"uppercase", letterSpacing:"-0.01em", lineHeight:1.05, color:"#ffffff", marginBottom:"1rem" }}>
            UN PAIEMENT.<br />
            <span style={{ color:B, textShadow:`0 0 40px ${B}45` }}>UN RÉSULTAT.</span>
          </h2>
          <p style={{ fontSize:"0.95rem", color:"rgba(255,255,255,0.4)", lineHeight:1.75 }}>
            Pas d&apos;abonnement, pas de surprise. Tu paies une fois, on s&apos;occupe de toi.
          </p>
        </motion.div>

        {/* Entry animation wrapper */}
        <motion.div
          initial={{ opacity:0, y:30 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.7, ease:easing, delay:0.1 }}
        >
          {/* 3D tilt wrapper */}
          <div
            ref={tiltRef}
            onMouseMove={handleTilt}
            onMouseLeave={resetTilt}
            style={{ position:"relative", willChange:"transform" }}
          >

            {/* Rotating conic border */}
            <div aria-hidden style={{ position:"absolute", inset:0, borderRadius:"2.1rem", overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
              <div style={{
                position:"absolute", width:"300%", height:"300%", top:"-100%", left:"-100%",
                background:`conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${B}00 50deg, ${B}99 90deg, rgba(255,255,255,0.5) 100deg, ${B}99 110deg, ${B}00 150deg, transparent 360deg)`,
                animation:"spin-border 5s linear infinite",
              }} />
            </div>

            {/* Glass card */}
            <HoverSpotlight
              color={B}
              style={{
                position:"relative",
                margin:"1px",
                borderRadius:"2rem",
                background:"rgba(8,13,24,0.82)",
                backdropFilter:"blur(60px) saturate(200%)",
                WebkitBackdropFilter:"blur(60px) saturate(200%)",
                overflow:"hidden",
                boxShadow:[
                  "0 50px 120px rgba(0,0,0,0.75)",
                  `0 0 100px ${B}0a`,
                  "inset 0 1px 0 rgba(255,255,255,0.09)",
                  "inset 0 -1px 0 rgba(0,0,0,0.3)",
                ].join(", "),
                padding:"2.75rem 2.5rem",
                zIndex:1,
              }}
            >
              {/* Inner glows */}
              <div aria-hidden style={{ position:"absolute", top:"-50px", left:"-30px", width:240, height:200, background:`radial-gradient(ellipse,${B}18 0%,transparent 65%)`, filter:"blur(40px)", pointerEvents:"none" }} />
              <div aria-hidden style={{ position:"absolute", bottom:"-30px", right:"-20px", width:200, height:170, background:`radial-gradient(ellipse,${B}0e 0%,transparent 65%)`, filter:"blur(35px)", pointerEvents:"none" }} />

              {/* Price watermark */}
              <div aria-hidden style={{ position:"absolute", bottom:"-1.5rem", right:"0.5rem", fontFamily:"var(--font-oswald)", fontWeight:700, fontSize:"12rem", lineHeight:1, color:`${B}04`, userSelect:"none", pointerEvents:"none", letterSpacing:"-0.04em" }}>299</div>

              <div style={{ position:"relative", zIndex:1 }}>

                {/* Badge */}
                <div style={{ display:"flex", justifyContent:"center", marginBottom:"2rem" }}>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:"0.45rem", background:`${B}12`, border:`1px solid ${B}40`, borderRadius:"9999px", padding:"0.35rem 1.1rem", boxShadow:`0 0 20px ${B}20` }}>
                    <Zap size={12} style={{ color:B }} />
                    <span style={{ fontSize:"0.63rem", fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:B }}>Offre de lancement</span>
                  </div>
                </div>

                {/* Price — count-up, centered */}
                <div ref={priceRef} style={{ textAlign:"center", marginBottom:"0.75rem" }}>
                  <div style={{ display:"inline-flex", alignItems:"flex-start", lineHeight:1, animation:"breathe 3s ease-in-out infinite" }}>
                    <span style={{ fontFamily:"var(--font-oswald)", fontSize:"clamp(1.6rem,4vw,2.2rem)", fontWeight:700, color:B, marginTop:"clamp(1.1rem,2.5vw,1.6rem)", textShadow:`0 0 20px ${B}70` }}>€</span>
                    <span style={{ fontFamily:"var(--font-oswald)", fontSize:"clamp(6.5rem,22vw,10.5rem)", fontWeight:700, color:"#ffffff", letterSpacing:"-0.04em", lineHeight:1, textShadow:`0 0 80px ${B}18` }}>
                      {displayCount}
                    </span>
                  </div>
                </div>

                {/* "Paiement unique" pill */}
                <div style={{ display:"flex", justifyContent:"center", marginBottom:"2.75rem" }}>
                  <span style={{ display:"inline-block", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"9999px", padding:"0.3rem 1rem", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)" }}>
                    Paiement unique
                  </span>
                </div>

                {/* 3 Spots */}
                <div style={{ marginBottom:"2.75rem" }}>
                  <p style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.22)", textAlign:"center", marginBottom:"1rem" }}>
                    Places au tarif de lancement
                  </p>
                  <div style={{ display:"flex", gap:"0.75rem" }}>
                    {Array.from({ length: SPOTS_TOTAL }).map((_, i) => {
                      const taken = i < SPOTS_TAKEN;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity:0, scale:0.75 }}
                          whileInView={{ opacity:1, scale:1 }}
                          viewport={{ once:true }}
                          transition={{ duration:0.45, ease:easing, delay:0.4 + i * 0.1 }}
                          style={{
                            flex:1, padding:"1.1rem 0.75rem",
                            background: taken ? "rgba(255,255,255,0.02)" : `${B}0d`,
                            border:`1px solid ${taken ? "rgba(255,255,255,0.07)" : `${B}30`}`,
                            borderRadius:"1.1rem",
                            display:"flex", flexDirection:"column", alignItems:"center", gap:"0.6rem",
                            position:"relative", overflow:"hidden",
                          }}
                        >
                          {!taken && (
                            <div aria-hidden style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px", background:`linear-gradient(to right, transparent, ${B}65, transparent)` }} />
                          )}
                          <div style={{
                            width:34, height:34, borderRadius:"50%",
                            background: taken ? "rgba(255,255,255,0.04)" : `${B}18`,
                            border:`2px solid ${taken ? "rgba(255,255,255,0.1)" : B}`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            animation: taken ? "none" : "pulse-ring 2.4s ease-in-out infinite",
                          }}>
                            {taken
                              ? <Lock size={13} style={{ color:"rgba(255,255,255,0.18)" }} />
                              : <div style={{ width:9, height:9, borderRadius:"50%", background:B, boxShadow:`0 0 6px ${B}` }} />
                            }
                          </div>
                          <span style={{ fontSize:"0.6rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color: taken ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.6)" }}>
                            {taken ? "Réservée" : "Libre"}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height:"1px", background:`linear-gradient(to right, transparent, ${B}18, rgba(255,255,255,0.07), ${B}18, transparent)`, marginBottom:"2rem" }} />

                {/* Inclus */}
                <ul style={{ listStyle:"none", padding:0, margin:"0 0 2.5rem", display:"flex", flexDirection:"column", gap:"0.9rem" }}>
                  {INCLUS.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity:0, x:-14 }}
                      whileInView={{ opacity:1, x:0 }}
                      viewport={{ once:true }}
                      transition={{ duration:0.4, ease:easing, delay:0.1 + i * 0.07 }}
                      style={{ display:"flex", alignItems:"center", gap:"0.9rem" }}
                    >
                      <div style={{ width:26, height:26, borderRadius:"50%", background:`${B}14`, border:`1px solid ${B}38`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 0 10px ${B}22` }}>
                        <Check size={13} style={{ color:B }} />
                      </div>
                      <span style={{ fontSize:"0.97rem", color:"rgba(255,255,255,0.85)", fontWeight:500 }}>{item}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.div
                  onHoverStart={() => setCtaHovered(true)}
                  onHoverEnd={() => setCtaHovered(false)}
                  animate={{ scale: ctaHovered ? 1.02 : 1 }}
                  transition={{ duration:0.15 }}
                >
                  <Link
                    href="/signup"
                    style={{
                      display:"flex", alignItems:"center", justifyContent:"center", gap:"0.6rem",
                      padding:"1.3rem",
                      background:`linear-gradient(135deg, ${B} 0%, #0ea5e9 100%)`,
                      color:"#03090f", fontWeight:900, fontSize:"0.9rem",
                      letterSpacing:"0.1em", textTransform:"uppercase",
                      borderRadius:"1.25rem", textDecoration:"none",
                      boxShadow: ctaHovered
                        ? `0 12px 55px ${B}75, inset 0 1px 0 rgba(255,255,255,0.45)`
                        : `0 5px 32px ${B}50, inset 0 1px 0 rgba(255,255,255,0.3)`,
                      transition:"box-shadow 0.2s",
                      position:"relative", overflow:"hidden",
                    }}
                  >
                    {ctaHovered && (
                      <motion.div
                        aria-hidden
                        initial={{ x:"-100%" }}
                        animate={{ x:"200%" }}
                        transition={{ duration:0.5, ease:"easeInOut" }}
                        style={{ position:"absolute", top:0, left:0, width:"55%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.32),transparent)", pointerEvents:"none" }}
                      />
                    )}
                    <span style={{ position:"relative" }}>Je réserve ma place — 299€</span>
                    <ArrowRight size={16} style={{ position:"relative", flexShrink:0 }} />
                  </Link>
                </motion.div>

                <p style={{ textAlign:"center", marginTop:"1.1rem", fontSize:"0.72rem", color:"rgba(255,255,255,0.2)", letterSpacing:"0.04em" }}>
                  Prise en charge sous 24h · Accès complet immédiat
                </p>

              </div>
            </HoverSpotlight>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
