"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const MOTIQ_TOKENS = "@layer motiq{:root{--motiq-accent:#315fea;--motiq-accent-text:#244fd1;--motiq-bg:#f7f9fc;--motiq-border:#dce4ef;--motiq-border-strong:#c5d1e1;--motiq-fg:#101828;--motiq-fg-secondary:#344054;--motiq-muted:#667085;--motiq-secondary-accent:#009fb3;--motiq-surface:#ffffff;--motiq-surface-2:#f8fafd}}@layer motiq{.dark,[data-theme=\"dark\"]{--motiq-accent:#4f7cff;--motiq-accent-text:#7f9fff;--motiq-bg:#080c14;--motiq-border:#263449;--motiq-border-strong:#354863;--motiq-fg:#f8fafc;--motiq-fg-secondary:#cbd5e1;--motiq-muted:#9caabd;--motiq-secondary-accent:#22c7d9;--motiq-surface:#111827;--motiq-surface-2:#192337}}";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useVisibilityPause<T extends Element>(
  ref: React.RefObject<T | null>,
  { threshold = 0.1 }: { threshold?: number } = {},
): boolean {
  const [onScreen, setOnScreen] = React.useState(true);
  const [tabVisible, setTabVisible] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  React.useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return onScreen && tabVisible;
}

export interface LensLag {
  stiffness: number;
  damping: number;
}

export interface LensCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  radius?: number;
  magnification?: number;
  chromatic?: number;
  lag?: LensLag;
  gridBend?: boolean;
  idleDrift?: boolean;
  showRing?: boolean;
  seed?: number;
  pauseWhenHidden?: boolean;
  reducedMotion?: boolean;
}

interface Spring {
  x: number;
  v: number;
}

const mkSpring = (x = 0): Spring => ({ x, v: 0 });

function spring(s: Spring, target: number, k: number, c: number, dt: number): number {
  const n = dt > 0.012 ? Math.ceil(dt / 0.008) : 1;
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    s.v += (-k * (s.x - target) - c * s.v) * h;
    s.x += s.v * h;
  }
  return s.x;
}

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GRID_GAP = 36;
const GRID_SEG = 14;
const BEND_SIGMA = 60;
const BEND_AMP = 16;
const RING_BOX = 208;

interface PointerState {
  x: number;
  y: number;
  inside: boolean;
}

function LensCardBase({
  children,
  radius = 104,
  magnification = 1.35,
  chromatic = 2.2,
  lag = { stiffness: 300, damping: 27 },
  gridBend = true,
  idleDrift = true,
  showRing = true,
  seed = 1,
  pauseWhenHidden = true,
  reducedMotion,
  className,
  style,
  ...props
}: LensCardProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const magRef = React.useRef<HTMLDivElement | null>(null);
  const magInnerRef = React.useRef<HTMLDivElement | null>(null);
  const chromaRef = React.useRef<HTMLDivElement | null>(null);
  const chromaInnerRef = React.useRef<HTMLDivElement | null>(null);
  const ringRef = React.useRef<HTMLDivElement | null>(null);
  const probeRef = React.useRef<HTMLSpanElement | null>(null);
  const pointerRef = React.useRef<PointerState>({ x: -1e4, y: -1e4, inside: false });

  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `mk-lens-${uid}`;

  const systemReduced = useReducedMotion();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  const staticMode = reducedMotion === true || (hydrated && systemReduced);
  const onScreen = useVisibilityPause(rootRef, { threshold: 0.06 });
  const paused = pauseWhenHidden && !onScreen;
  const animate = !staticMode && !paused;

  const params = React.useRef({ radius, magnification, chromatic, lag, gridBend, idleDrift });
  params.current = { radius, magnification, chromatic, lag, gridBend, idleDrift };

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;

    let w = 1;
    let h = 1;
    const measure = () => {
      w = root.clientWidth || 1;
      h = root.clientHeight || 1;
      if (!canvas || !ctx) return;
      const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    measure();

    const probeColor = (i: number): string => {
      const probe = probeRef.current;
      if (!probe || typeof window === "undefined") return "#888";
      const kid = probe.children[i];
      return kid ? window.getComputedStyle(kid).color : "#888";
    };

    const place = (x: number, y: number, r: number) => {
      const { magnification: mag, chromatic: chroma } = params.current;
      const mag2 = mag + 0.03;
      if (magRef.current) magRef.current.style.clipPath = `circle(${r.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;
      if (magInnerRef.current) {
        magInnerRef.current.style.transform = `translate3d(${((1 - mag) * x).toFixed(2)}px,${((1 - mag) * y).toFixed(2)}px,0) scale(${mag})`;
      }
      if (chromaRef.current) {
        chromaRef.current.style.clipPath = `circle(${(r + 3).toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;
      }
      if (chromaInnerRef.current) {
        chromaInnerRef.current.style.transform = `translate3d(${((1 - mag2) * x + chroma).toFixed(2)}px,${(
          (1 - mag2) * y + chroma * 0.64
        ).toFixed(2)}px,0) scale(${mag2})`;
      }
      if (ringRef.current) {
        const rs = (r * 2) / RING_BOX;
        ringRef.current.style.transform = `translate3d(${(x - RING_BOX / 2).toFixed(1)}px,${(y - RING_BOX / 2).toFixed(1)}px,0) scale(${rs.toFixed(3)})`;
      }
    };

    const tmp: [number, number] = [0, 0];
    const drawGrid = (x: number, y: number, r: number) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (!params.current.gridBend) return;
      const reach = r * 1.9;

      const warp = (px: number, py: number) => {
        const dx = px - x;
        const dy = py - y;
        const d = Math.hypot(dx, dy);
        if (d > reach || d < 0.5) { tmp[0] = px; tmp[1] = py; return; }
        const e = d - r;
        let push = BEND_AMP * Math.exp(-(e * e) / (2 * BEND_SIGMA * BEND_SIGMA));
        if (d < r) push *= d / r;
        tmp[0] = px + (dx / d) * push;
        tmp[1] = py + (dy / d) * push;
      };

      const pass = (color: string, alpha: number, clipR: number) => {
        ctx.save();
        if (clipR) {
          ctx.beginPath();
          ctx.arc(x, y, clipR, 0, Math.PI * 2);
          ctx.clip();
        }
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let gx = GRID_GAP / 2; gx < w; gx += GRID_GAP) {
          for (let i = 0; i <= h; i += GRID_SEG) {
            warp(gx, i);
            if (i === 0) ctx.moveTo(tmp[0], tmp[1]);
            else ctx.lineTo(tmp[0], tmp[1]);
          }
        }
        for (let gy = GRID_GAP / 2; gy < h; gy += GRID_GAP) {
          for (let i = 0; i <= w; i += GRID_SEG) {
            warp(i, gy);
            if (i === 0) ctx.moveTo(tmp[0], tmp[1]);
            else ctx.lineTo(tmp[0], tmp[1]);
          }
        }
        ctx.stroke();
        ctx.restore();
        ctx.globalAlpha = 1;
      };

      pass(probeColor(0), 0.85, 0);
      pass(probeColor(1), 0.5, r * 1.7);
    };

    const lx = mkSpring(-200);
    const ly = mkSpring(-200);
    const pres = mkSpring(0);
    const rng = makeRng(seed);
    let idleT = rng() * 30;
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      let dt = (now - last) / 1000;
      last = now;
      if (!(dt > 0) || dt > 0.05) dt = 0.016;
      idleT += dt;

      const cfg = params.current;
      const p = pointerRef.current;
      let tx: number;
      let ty: number;
      if (p.inside) {
        tx = p.x; ty = p.y;
      } else if (cfg.idleDrift) {
        tx = w * (0.5 + 0.3 * Math.sin(idleT * 0.33));
        ty = h * (0.5 + 0.26 * Math.sin(idleT * 0.47 + 1.2));
      } else {
        tx = w / 2; ty = h / 2;
      }
      spring(lx, tx, cfg.lag.stiffness, cfg.lag.damping, dt);
      spring(ly, ty, cfg.lag.stiffness, cfg.lag.damping, dt);
      spring(pres, 1, 200, 18, dt);
      const r = Math.max(1, cfg.radius * clamp(pres.x, 0, 1.2));
      place(lx.x, ly.x, r);
      drawGrid(lx.x, ly.x, r);
    };

    const renderStatic = () => {
      const x = w / 2;
      const y = h / 2;
      place(x, y, params.current.radius);
      drawGrid(x, y, params.current.radius);
    };

    if (animate) {
      last = typeof performance !== "undefined" ? performance.now() : 0;
      raf = requestAnimationFrame(frame);
    } else {
      renderStatic();
    }

    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => { measure(); if (!animate) renderStatic(); })
      : null;
    ro?.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [animate, seed]);

  // Native document-level tracking — bypasses React event propagation issues with child components
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      pointerRef.current = { x, y, inside };
    };

    const onLeave = () => {
      pointerRef.current = { x: -1e4, y: -1e4, inside: false };
    };

    document.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const css = `
.${cls}-chroma { opacity: .18; mix-blend-mode: multiply; }
.dark .${cls}-chroma, [data-theme="dark"] .${cls}-chroma { opacity: .45; mix-blend-mode: screen; }`.trim();

  return (
    <div
      ref={rootRef}
      data-motion={staticMode ? "static" : "animated"}
      data-paused={paused ? "true" : "false"}
      className={cn("relative isolate w-full overflow-hidden", className)}
      style={{ touchAction: "pan-y", cursor: staticMode ? undefined : "crosshair", ...style }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} suppressHydrationWarning />

      {gridBend ? (
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] block h-full w-full" />
      ) : null}

      <div className="relative z-[2]">{children}</div>

      {chromatic > 0 ? (
        <div
          ref={chromaRef}
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 z-[3]", `${cls}-chroma`)}
          style={{ clipPath: "circle(0px at -200px -200px)", filter: "hue-rotate(150deg) saturate(1.6)" }}
        >
          <div ref={chromaInnerRef} className="absolute inset-0" style={{ transformOrigin: "0 0", willChange: "transform" }}>
            {children}
          </div>
        </div>
      ) : null}

      <div
        ref={magRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{ clipPath: "circle(0px at -200px -200px)", background: "var(--motiq-bg, #080c14)" }}
      >
        <div ref={magInnerRef} className="absolute inset-0" style={{ transformOrigin: "0 0", willChange: "transform" }}>
          {children}
        </div>
      </div>

      {showRing ? (
        <div
          ref={ringRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-[5] h-[208px] w-[208px] rounded-full"
          style={{
            transform: "translate3d(-999px,-999px,0)",
            willChange: "transform",
            border: "1px solid color-mix(in oklab, var(--motiq-accent, #4f7cff) 60%, transparent)",
            boxShadow: [
              "inset 0 0 0 1.5px color-mix(in oklab, var(--motiq-secondary-accent, #22c7d9) 35%, transparent)",
              "inset 0 0 26px color-mix(in oklab, var(--motiq-accent, #4f7cff) 22%, transparent)",
              "0 0 34px color-mix(in oklab, var(--motiq-accent, #4f7cff) 30%, transparent)",
            ].join(", "),
            backgroundImage: "radial-gradient(circle at 32% 28%, color-mix(in oklab, var(--motiq-fg, #f8fafc) 14%, transparent), transparent 42%)",
          }}
        />
      ) : null}

      <span ref={probeRef} aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden">
        <span style={{ color: "var(--motiq-border, #263449)" }} />
        <span style={{ color: "var(--motiq-accent, #4f7cff)" }} />
      </span>
    </div>
  );
}

LensCard.displayName = "LensCard";

export function LensCard(props: LensCardProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOTIQ_TOKENS }} suppressHydrationWarning />
      <LensCardBase {...props} />
    </>
  );
}

export default LensCard;
