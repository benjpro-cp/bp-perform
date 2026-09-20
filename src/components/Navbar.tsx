"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#programmes", label: "Programmes" },
  { href: "/exercises", label: "Exercices" },
  { href: "/#resultats", label: "Résultats" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userFirstName, setUserFirstName] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("bp_current_user") || "{}");
      if (user.firstName) {
        setLoggedIn(true);
        setUserFirstName(user.firstName.trim());
      }
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <header
        style={{
          background: scrolled
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: "9999px",
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.25)",
            "inset 0 -1px 0 rgba(255,255,255,0.06)",
            "inset 1px 0 0 rgba(255,255,255,0.1)",
            "inset -1px 0 0 rgba(255,255,255,0.1)",
            "0 8px 32px rgba(0,0,0,0.35)",
            "0 2px 8px rgba(0,0,0,0.2)",
          ].join(", "),
          transition: "background 0.35s ease, box-shadow 0.35s ease",
          width: "fit-content",
          maxWidth: "95vw",
        }}
      >
        <nav style={{ padding: "0 1.5rem", display: "flex", alignItems: "center", height: "56px", gap: "1.25rem" }}>

          {/* Left: logo + nav links + separator */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <Link href="/" style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", color: "#ffffff", flexShrink: 0 }}>
              BP<span style={{ color: "#38bdf8" }}>Perform</span>
            </Link>
            <div className="hidden md:flex" style={{ alignItems: "center", gap: "1.25rem" }}>
              {links.map((l) => (
                <Link key={l.href} href={l.href} style={{ fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", textDecoration: "none", transition: "color 0.15s", whiteSpace: "nowrap" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.72)")}
                >
                  {l.label}
                </Link>
              ))}
              <div style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.18)", flexShrink: 0 }} />
            </div>
          </div>

          {/* Right: CTAs */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "1.25rem" }}>
            {loggedIn ? (
              <Link href="/dashboard" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem", flexShrink: 0,
                background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
                color: "#03090f", fontSize: "0.62rem", fontWeight: 800,
                letterSpacing: "0.13em", textTransform: "uppercase",
                padding: "0.48rem 1.1rem", borderRadius: "9999px", textDecoration: "none",
                boxShadow: "0 0 0 1px rgba(56,189,248,0.35), 0 4px 18px rgba(56,189,248,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
                transition: "all 0.18s ease", whiteSpace: "nowrap",
              }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 0 0 1px rgba(56,189,248,0.55), 0 6px 26px rgba(56,189,248,0.5), inset 0 1px 0 rgba(255,255,255,0.3)"; el.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 0 0 1px rgba(56,189,248,0.35), 0 4px 18px rgba(56,189,248,0.35), inset 0 1px 0 rgba(255,255,255,0.3)"; el.style.transform = ""; }}
              >
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(3,9,15,0.25)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.55rem", fontWeight: 900, letterSpacing: 0 }}>
                  {userFirstName.charAt(0).toUpperCase()}
                </span>
                Mon espace
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2 5.5H9M9 5.5L6 2.5M9 5.5L6 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ) : (
              <>
                <Link href="/login" style={{ fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", textDecoration: "none", transition: "color 0.15s", whiteSpace: "nowrap" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.72)")}
                >
                  Connexion
                </Link>
                <a href="/#contact" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem", flexShrink: 0,
                  background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
                  color: "#03090f", fontSize: "0.62rem", fontWeight: 800,
                  letterSpacing: "0.13em", textTransform: "uppercase",
                  padding: "0.48rem 1.1rem", borderRadius: "9999px", textDecoration: "none",
                  boxShadow: "0 0 0 1px rgba(56,189,248,0.35), 0 4px 18px rgba(56,189,248,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
                  transition: "all 0.18s ease", whiteSpace: "nowrap",
                }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 0 0 1px rgba(56,189,248,0.55), 0 6px 26px rgba(56,189,248,0.5), inset 0 1px 0 rgba(255,255,255,0.3)"; el.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 0 0 1px rgba(56,189,248,0.35), 0 4px 18px rgba(56,189,248,0.35), inset 0 1px 0 rgba(255,255,255,0.3)"; el.style.transform = ""; }}
                >
                  Rejoindre
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M2 5.5H9M9 5.5L6 2.5M9 5.5L6 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white p-1" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              borderRadius: "0 0 1.5rem 1.5rem",
            }}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted hover:text-white uppercase tracking-wider transition-colors"
              >
                {l.label}
              </Link>
            ))}
            {loggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                style={{
                  background: "#38bdf8",
                  color: "#070c16",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.75rem 1.25rem",
                  textAlign: "center",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                Mon espace →
              </Link>
            ) : (
              <a
                href="/#contact"
                onClick={() => setOpen(false)}
                style={{
                  background: "#38bdf8",
                  color: "#070c16",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.75rem 1.25rem",
                  textAlign: "center",
                  borderRadius: "9999px",
                  textDecoration: "none",
                }}
              >
                Rejoindre
              </a>
            )}
          </div>
        )}
      </header>
    </div>
  );
}
