"use client";

import { useState, useEffect } from "react";
import { Lock, ArrowRight, Dumbbell, Utensils, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const easing = [0.22, 1, 0.36, 1] as const;

const ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
  programme: Dumbbell,
  diete: Utensils,
  progression: TrendingUp,
};

type Props = {
  children: React.ReactNode;
  page: "programme" | "diete" | "progression";
  title: string;
  description: string;
};

export function PaywallGate({ children, page, title, description }: Props) {
  const [isPaid, setIsPaid] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("bp_current_user") || "{}");
      setIsPaid(user.isPaid === true);
    } catch {
      setIsPaid(false);
    }
  }, []);

  if (isPaid === null) return null;
  if (isPaid) return <>{children}</>;

  const PageIcon = ICONS[page];

  return (
    <div style={{ position: "relative", minHeight: "70vh" }}>
      {/* Blurred content behind */}
      <div
        aria-hidden
        style={{
          filter: "blur(6px)",
          opacity: 0.25,
          pointerEvents: "none",
          userSelect: "none",
          overflow: "hidden",
          maxHeight: "60vh",
        }}
      >
        {children}
      </div>

      {/* Dark gradient fade at the bottom of blurred content */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "linear-gradient(to bottom, transparent 0%, #070c16 80%)",
          pointerEvents: "none",
        }}
      />

      {/* Paywall card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "4rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: easing }}
          style={{
            background:
              "linear-gradient(145deg, rgba(56,189,248,0.1) 0%, rgba(10,18,32,0.98) 55%)",
            backdropFilter: "blur(40px) saturate(160%)",
            WebkitBackdropFilter: "blur(40px) saturate(160%)",
            border: "1px solid rgba(56,189,248,0.2)",
            borderRadius: "1.5rem",
            padding: "2.5rem 2.75rem",
            maxWidth: "480px",
            width: "90%",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Top shine */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: "1px",
              background:
                "linear-gradient(to right, transparent, rgba(56,189,248,0.5), rgba(255,255,255,0.3), rgba(56,189,248,0.5), transparent)",
              pointerEvents: "none",
            }}
          />
          {/* Ambient top glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "-60px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "280px",
              height: "180px",
              background:
                "radial-gradient(ellipse, rgba(56,189,248,0.15) 0%, transparent 70%)",
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          />

          {/* Icon circle */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(56,189,248,0.06))",
              border: "1.5px solid rgba(56,189,248,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.35rem",
              position: "relative",
              boxShadow:
                "0 0 30px rgba(56,189,248,0.18), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <Lock
              size={22}
              color="#38bdf8"
              style={{ position: "absolute", right: -6, top: -6, background: "#070c16", borderRadius: "50%", padding: 2, border: "1px solid rgba(56,189,248,0.3)" }}
            />
            <PageIcon size={24} color="#38bdf8" />
          </div>

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(56,189,248,0.08)",
              border: "1px solid rgba(56,189,248,0.2)",
              borderRadius: "999px",
              padding: "0.25rem 0.85rem",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#38bdf8",
              }}
            >
              Réservé aux membres
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-oswald)",
              fontWeight: 700,
              fontSize: "1.75rem",
              textTransform: "uppercase",
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "0.7rem",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "rgba(255,255,255,0.38)",
              lineHeight: 1.7,
              marginBottom: "1.85rem",
              maxWidth: "32rem",
              margin: "0 auto 1.85rem",
            }}
          >
            {description}
          </p>

          <Link
            href="/#pricing"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
              color: "#03090f",
              fontWeight: 800,
              fontSize: "0.84rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.9rem 2.25rem",
              borderRadius: "999px",
              textDecoration: "none",
              boxShadow:
                "0 4px 24px rgba(56,189,248,0.45), inset 0 1px 0 rgba(255,255,255,0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow =
                "0 8px 32px rgba(56,189,248,0.6), inset 0 1px 0 rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "";
              el.style.boxShadow =
                "0 4px 24px rgba(56,189,248,0.45), inset 0 1px 0 rgba(255,255,255,0.3)";
            }}
          >
            Démarrer à 69€/mois <ArrowRight size={14} />
          </Link>

          <p
            style={{
              marginTop: "0.85rem",
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Sans engagement · Résiliation à tout moment
          </p>
        </motion.div>
      </div>
    </div>
  );
}
