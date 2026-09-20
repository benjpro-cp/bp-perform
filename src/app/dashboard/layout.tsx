"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Dumbbell, TrendingUp, MessageCircle, BookOpen, Utensils, LogOut, ChevronRight, Zap, Menu, X, Users, Headphones } from "lucide-react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { OnboardingTour } from "@/components/OnboardingTour";

type NavLink = { href: string; label: string; icon: React.FC<{ size?: number; color?: string }>; exact?: boolean; badge?: number; soon?: boolean; };

const navGroups: { label: string; links: NavLink[] }[] = [
  {
    label: "Principal",
    links: [
      { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/programme", label: "Mon programme", icon: Dumbbell },
      { href: "/dashboard/diete", label: "Diète", icon: Utensils },
      { href: "/dashboard/progression", label: "Progression", icon: TrendingUp },
    ],
  },
  {
    label: "Communauté",
    links: [
      { href: "/dashboard/messages", label: "Messages", icon: MessageCircle },
      { href: "/dashboard/exercises", label: "Exercices", icon: BookOpen },
      { href: "/dashboard/musique", label: "Musique", icon: Headphones },
      { href: "/dashboard/communaute", label: "Communauté", icon: Users, soon: true },
    ],
  },
];

const mockClient = { program: "Hypertrophie Intermédiaire", week: 1 };

const tourIds: Record<string, string> = {
  "/dashboard": "tour-nav-dashboard",
  "/dashboard/programme": "tour-nav-programme",
  "/dashboard/diete": "tour-nav-diete",
  "/dashboard/progression": "tour-nav-progression",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientAvatar, setClientAvatar] = useState<string | null>(null);
  const [tourKey, setTourKey] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientInitials, setClientInitials] = useState("?");

  function handleReplayTour() {
    localStorage.removeItem("bp_tour_complete");
    if (pathname !== "/dashboard") router.push("/dashboard");
    setTourKey((k) => k + 1);
  }

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("bp_current_user") || "{}");
      if (user.firstName) {
        const fn = user.firstName.trim();
        const ln = (user.lastName || "").trim();
        setClientName(ln ? `${fn} ${ln.charAt(0)}.` : fn);
        setClientInitials(`${fn.charAt(0)}${ln ? ln.charAt(0) : ""}`.toUpperCase());
      }
    } catch { /* */ }
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("bp_coach_client_") && key !== "bp_coach_clients") {
          const d = JSON.parse(localStorage.getItem(key) || "null");
          if (d?.avatar) { setClientAvatar(d.avatar); break; }
        }
      }
    } catch { /* */ }
  }, []);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobile && sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, sidebarOpen]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070c16" }}>

      {/* ── Mobile top bar ── */}
      {isMobile && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, height: "56px", zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1.25rem",
          background: "rgba(7,12,22,0.96)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderBottom: "1px solid rgba(56,189,248,0.1)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.15rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffffff" }}>
              BP<span style={{ color: "#38bdf8", textShadow: "0 0 20px rgba(56,189,248,0.6)" }}>Perform</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", width: "38px", height: "38px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(255,255,255,0.75)", flexShrink: 0,
            }}
          >
            <Menu size={18} />
          </button>
        </div>
      )}

      {/* ── Mobile overlay ── */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 45,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside style={{
        width: "256px", flexShrink: 0,
        background: "linear-gradient(180deg, rgba(10,18,32,0.98) 0%, rgba(7,12,22,0.99) 100%)",
        backdropFilter: "blur(40px) saturate(160%)",
        WebkitBackdropFilter: "blur(40px) saturate(160%)",
        borderRight: "1px solid rgba(56,189,248,0.1)",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, bottom: 0,
        zIndex: isMobile ? 46 : 40,
        boxShadow: "4px 0 40px rgba(0,0,0,0.4), inset -1px 0 0 rgba(255,255,255,0.04)",
        transform: isMobile ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)") : "none",
        transition: "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
      }}>

        {/* Ambient top glow */}
        <div aria-hidden style={{
          position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)",
          width: "280px", height: "200px", pointerEvents: "none",
          background: "radial-gradient(ellipse, rgba(56,189,248,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div aria-hidden style={{
          position: "absolute", bottom: "-40px", left: "50%", transform: "translateX(-50%)",
          width: "220px", height: "160px", pointerEvents: "none",
          background: "radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 70%)",
          filter: "blur(30px)",
        }} />

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "absolute", top: "1rem", right: "1rem", zIndex: 2,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%", width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(255,255,255,0.5)",
            }}
          >
            <X size={14} />
          </button>
        )}

        {/* ── Logo ── */}
        <div style={{ padding: "1.75rem 1.5rem 1.5rem", position: "relative" }}>
          <Link href="/" style={{ textDecoration: "none", display: "block" }}>
            <span style={{
              fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.2rem",
              letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffffff",
            }}>
              BP<span style={{ color: "#38bdf8", textShadow: "0 0 20px rgba(56,189,248,0.6)" }}>Perform</span>
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.35rem" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.7)" }} />
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Espace client
            </p>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: "1.5rem", right: "1.5rem", height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }} />
        </div>

        {/* ── Week badge ── */}
        <div style={{ padding: "1rem 1.25rem 0.5rem" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            background: "linear-gradient(135deg, rgba(56,189,248,0.1) 0%, rgba(56,189,248,0.04) 100%)",
            border: "1px solid rgba(56,189,248,0.2)",
            borderRadius: "0.85rem", padding: "0.75rem 1rem",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 16px rgba(56,189,248,0.08)",
            position: "relative", overflow: "hidden",
          }}>
            <div aria-hidden style={{
              position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
              background: "linear-gradient(to right, transparent, rgba(56,189,248,0.5), rgba(255,255,255,0.3), rgba(56,189,248,0.5), transparent)",
              pointerEvents: "none",
            }} />
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
              background: "linear-gradient(135deg, rgba(56,189,248,0.25), rgba(56,189,248,0.08))",
              border: "1px solid rgba(56,189,248,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 0 12px rgba(56,189,248,0.2)",
            }}>
              <Zap size={15} color="#38bdf8" />
            </div>
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>Semaine {mockClient.week}</p>
              <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: "0.18rem" }}>Programme actif</p>
            </div>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav style={{ padding: "0.75rem 1rem", flex: 1, overflowY: "auto" }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: "1.5rem" }}>
              <p style={{
                fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
                padding: "0 0.5rem", marginBottom: "0.4rem",
              }}>
                {group.label}
              </p>

              {group.links.map((link) => {
                const Icon = link.icon;
                const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    id={tourIds[link.href]}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.72rem 0.9rem", borderRadius: "0.75rem",
                      marginBottom: "0.2rem", textDecoration: "none",
                      position: "relative", overflow: "hidden",
                      background: active
                        ? "linear-gradient(135deg, rgba(56,189,248,0.14) 0%, rgba(56,189,248,0.06) 100%)"
                        : "transparent",
                      border: `1px solid ${active ? "rgba(56,189,248,0.25)" : "transparent"}`,
                      transition: "all 0.18s ease",
                      boxShadow: active
                        ? "inset 0 1px 0 rgba(56,189,248,0.2), 0 4px 16px rgba(56,189,248,0.08)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "rgba(255,255,255,0.05)";
                        el.style.border = "1px solid rgba(255,255,255,0.08)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "transparent";
                        el.style.border = "1px solid transparent";
                      }
                    }}
                  >
                    {active && (
                      <div aria-hidden style={{
                        position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
                        background: "linear-gradient(to right, transparent, rgba(56,189,248,0.45), rgba(255,255,255,0.25), rgba(56,189,248,0.45), transparent)",
                        pointerEvents: "none",
                      }} />
                    )}
                    {active && (
                      <div aria-hidden style={{
                        position: "absolute", left: 0, top: "20%", bottom: "20%",
                        width: "3px", borderRadius: "0 3px 3px 0",
                        background: "#38bdf8",
                        boxShadow: "0 0 10px rgba(56,189,248,0.8), 0 0 20px rgba(56,189,248,0.4)",
                        pointerEvents: "none",
                      }} />
                    )}

                    <div style={{
                      width: "30px", height: "30px", borderRadius: "8px", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: active ? "rgba(56,189,248,0.18)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? "rgba(56,189,248,0.3)" : "rgba(255,255,255,0.06)"}`,
                      transition: "all 0.18s ease",
                      boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.2), 0 0 10px rgba(56,189,248,0.2)" : "none",
                    }}>
                      <Icon size={14} color={active ? "#38bdf8" : "rgba(255,255,255,0.38)"} />
                    </div>

                    <span style={{
                      fontSize: "0.88rem", fontWeight: active ? 600 : 400,
                      color: active ? "#ffffff" : "rgba(255,255,255,0.48)",
                      letterSpacing: "0.01em", flex: 1,
                      textShadow: active ? "0 0 20px rgba(56,189,248,0.3)" : "none",
                      transition: "all 0.18s ease",
                    }}>
                      {link.label}
                    </span>

                    {link.badge && (
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, background: "linear-gradient(135deg, #38bdf8, #0ea5e9)", color: "#03090f", borderRadius: "999px", padding: "0.1rem 0.5rem", minWidth: "1.4rem", textAlign: "center", boxShadow: "0 0 10px rgba(56,189,248,0.4)" }}>
                        {link.badge}
                      </span>
                    )}
                    {link.soon && (
                      <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "999px", padding: "0.1rem 0.48rem" }}>
                        Bientôt
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Client card ── */}
        <div style={{ padding: "0 1rem 1.5rem", position: "relative" }}>
          <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)", marginBottom: "1rem" }} />

          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.85rem 0.9rem", borderRadius: "0.9rem",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
            position: "relative", overflow: "hidden",
          }}>
            <div aria-hidden style={{
              position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
              background: "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)",
              pointerEvents: "none",
            }} />

            {clientAvatar ? (
              <img src={clientAvatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1.5px solid rgba(56,189,248,0.35)", boxShadow: "0 0 14px rgba(56,189,248,0.2)" }} />
            ) : (
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, rgba(56,189,248,0.3), rgba(56,189,248,0.08))",
                border: "1.5px solid rgba(56,189,248,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.88rem", color: "#38bdf8",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 0 14px rgba(56,189,248,0.2)",
              }}>
                {clientInitials}
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#ffffff", lineHeight: 1 }}>{clientName || "Mon espace"}</p>
              <p style={{
                fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: "0.22rem",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {mockClient.program}
              </p>
            </div>

            <button
              style={{
                color: "rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "6px", cursor: "pointer",
                transition: "all 0.15s", padding: "0.35rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={(e) => { const el = e.currentTarget; el.style.color = "rgba(255,255,255,0.7)"; el.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget; el.style.color = "rgba(255,255,255,0.22)"; el.style.background = "rgba(255,255,255,0.04)"; }}
            >
              <LogOut size={13} />
            </button>
          </div>

          <Link href="/" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem",
            marginTop: "0.65rem", padding: "0.5rem",
            fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.22)", textDecoration: "none",
            transition: "color 0.15s", borderRadius: "0.5rem",
          }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)")}
          >
            Retour au site <ChevronRight size={11} />
          </Link>

          <button
            onClick={handleReplayTour}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem",
              marginTop: "0.25rem", padding: "0.5rem", width: "100%",
              fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.06em",
              color: "rgba(56,189,248,0.4)", background: "none", border: "none",
              cursor: "pointer", transition: "color 0.15s", borderRadius: "0.5rem",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(56,189,248,0.8)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(56,189,248,0.4)")}
          >
            <Zap size={11} /> Rejouer le tutoriel
          </button>
        </div>
      </aside>

      {/* ── Onboarding tour (first visit only) ── */}
      <OnboardingTour key={tourKey} />

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : "256px",
        minHeight: "100vh",
        position: "relative",
      }}>

        {/* Ambient background */}
        <div aria-hidden style={{
          position: "fixed", inset: 0,
          marginLeft: isMobile ? 0 : "256px",
          pointerEvents: "none", zIndex: 0, overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-10%", right: "-5%",
            width: "55vw", height: "60vh",
            background: "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 65%)",
            filter: "blur(80px)",
          }} />
          <div style={{
            position: "absolute", bottom: "-5%", left: "-5%",
            width: "40vw", height: "50vh",
            background: "radial-gradient(ellipse, rgba(56,189,248,0.05) 0%, transparent 65%)",
            filter: "blur(70px)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(rgba(56,189,248,0.1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 30%, black 10%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 30%, black 10%, transparent 75%)",
          }} />
        </div>

        {/* Page content */}
        <div style={{
          padding: isMobile ? "1.25rem 1rem 4rem" : "2.5rem 2.5rem 4rem",
          paddingTop: isMobile ? "calc(56px + 1.25rem)" : "2.5rem",
          position: "relative", zIndex: 1,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
