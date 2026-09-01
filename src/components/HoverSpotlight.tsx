"use client";

import { useRef } from "react";

export function HoverSpotlight({
  color,
  style,
  children,
}: {
  color: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
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
      glowRef.current.style.background = `radial-gradient(260px circle at ${x}px ${y}px, ${color}1e, transparent 70%)`;
    }
  }

  function onLeave() {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }

  return (
    <div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave} style={style}>
      <div
        ref={glowRef}
        aria-hidden
        style={{
          position: "absolute", inset: 0, borderRadius: "inherit",
          opacity: 0, pointerEvents: "none", transition: "opacity 0.35s ease",
        }}
      />
      {children}
    </div>
  );
}
