"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Dumbbell, MessageCircle } from "lucide-react";

const NAV = [
  { href: "/coach",            label: "Clients",    icon: Users          },
  { href: "/coach/exercises",  label: "Exercices",  icon: Dumbbell       },
  { href: "/coach/messages",   label: "Messages",   icon: MessageCircle  },
];

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #060b15 0%, #09142a 50%, #060b15 100%)",
      color: "#ffffff",
      fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
    }}>
      {/* Top bar */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(6,11,21,0.85)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 2rem", height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#ffffff" }}>
              BP<span style={{ color: "#38bdf8" }}>Perform</span>
            </span>
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "999px", padding: "0.15rem 0.6rem" }}>
              Coach
            </span>
          </div>
          <nav style={{ display: "flex", gap: "0.25rem" }}>
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/coach" && pathname.startsWith(href));
              return (
                <Link key={href} href={href}
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.85rem", borderRadius: "0.55rem", textDecoration: "none", fontSize: "0.82rem", fontWeight: active ? 700 : 500, color: active ? "#38bdf8" : "rgba(255,255,255,0.4)", background: active ? "rgba(56,189,248,0.09)" : "transparent", border: active ? "1px solid rgba(56,189,248,0.2)" : "1px solid transparent", transition: "all 0.15s" }}
                >
                  <Icon size={13} /> {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#38bdf8")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
        >
          <LayoutDashboard size={13} /> Vue client
        </Link>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem 4rem" }}>
        {children}
      </main>
    </div>
  );
}
