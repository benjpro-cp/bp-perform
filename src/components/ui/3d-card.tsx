"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveTravelCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  actionText: string;
  href: string;
  onActionClick: () => void;
  className?: string;
}

export const InteractiveTravelCard = React.forwardRef<
  HTMLDivElement,
  InteractiveTravelCardProps
>(({ title, subtitle, imageUrl, actionText, onActionClick, className }, ref) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["10.5deg", "-10.5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-10.5deg", "10.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onActionClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.55)",
        boxShadow: [
          "0 0 0 1px rgba(255,255,255,0.08)",
          "0 0 24px rgba(255,255,255,0.12)",
          "0 24px 60px rgba(0,0,0,0.55)",
          "inset 0 1px 0 rgba(255,255,255,0.55)",
        ].join(", "),
        background: "rgba(255,255,255,0.04)",
        borderRadius: "1.25rem",
      }}
      className={cn("relative h-[32rem] w-full", className)}
    >
      {/* Inner wrapper — pushed forward in Z for depth */}
      <div
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
        className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)]"
      >
        {/* Image zone — top 60% */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "62%",
          borderRadius: "0.875rem",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.12)",
        }}>
          <img
            src={imageUrl}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(7,12,22,0.1) 0%, rgba(7,12,22,0.55) 100%)",
          }} />

          {/* Subtitle badge — floats on image */}
          <motion.div
            style={{ transform: "translateZ(30px)", position: "absolute", top: "0.875rem", left: "0.875rem" }}
          >
            <div style={{
              background: "rgba(56,189,248,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(56,189,248,0.35)",
              borderRadius: "999px",
              padding: "0.25rem 0.75rem",
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#38bdf8",
            }}>
              {subtitle}
            </div>
          </motion.div>
        </div>

        {/* Bottom content zone */}
        <div style={{
          position: "absolute",
          top: "calc(62% + 0.75rem)",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          {/* Title */}
          <motion.div style={{ transform: "translateZ(40px)" }}>
            <h3 style={{
              fontFamily: "var(--font-oswald)",
              fontWeight: 700,
              fontSize: "1.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "0.35rem",
            }}>
              {title}
            </h3>
            <div style={{ width: "2.5rem", height: "2px", background: "rgba(255,255,255,0.35)", borderRadius: "999px" }} />
          </motion.div>

          {/* Button */}
          <motion.div
            style={{ transform: "translateZ(50px)" }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.22)",
              backdropFilter: "blur(12px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
              borderRadius: "0.75rem",
              padding: "0.8rem 1rem",
            }}>
              <span style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#ffffff",
              }}>
                {actionText}
              </span>
              <span style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1.75rem",
                height: "1.75rem",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}>
                <ArrowRight size={12} color="#ffffff" />
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});
InteractiveTravelCard.displayName = "InteractiveTravelCard";
