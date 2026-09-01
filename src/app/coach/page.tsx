"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, User, Calendar, Target, ArrowRight, Trash2, Mail, ClipboardList, CheckCircle, ChevronRight, Users, TrendingUp, X } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;

type ClientMeta = {
  id: string;
  firstName: string;
  lastName: string;
  goal: string;
  currentWeek: number;
  totalWeeks: number;
  programName: string;
  createdAt: string;
  avatar?: string;
};

type Prospect = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  goal?: string;
  status: "email" | "onboarding" | "accompagnement";
  createdAt: string;
  onboardingData?: {
    age?: string;
    weight?: string;
    height?: string;
    level?: string;
    availability?: string[];
    motivation?: string;
    injuries?: string;
    message?: string;
  };
};

const goalColors: Record<string, string> = {
  Hypertrophie: "#38bdf8",
  "Prise de masse": "#a78bfa",
  Sèche: "#fb923c",
  "Remise en forme": "#4ade80",
  Force: "#f87171",
  Endurance: "#facc15",
};

const PIPELINE_COLS = [
  { status: "email"          as Prospect["status"], label: "Inscrit par mail",   sublabel: "A laissé son email",        icon: Mail,          color: "#38bdf8" },
  { status: "onboarding"     as Prospect["status"], label: "Onboarding rempli",  sublabel: "A complété le formulaire",  icon: ClipboardList, color: "#a78bfa" },
  { status: "accompagnement" as Prospect["status"], label: "En accompagnement",  sublabel: "Client actif du programme", icon: CheckCircle,   color: "#4ade80" },
];

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }); } catch { return iso.slice(0, 10); }
}

export default function CoachPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"clients" | "pipeline">("clients");
  const [clients, setClients] = useState<ClientMeta[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDeleteProspect, setConfirmDeleteProspect] = useState<string | null>(null);
  const [expandedProspect, setExpandedProspect] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bp_coach_clients") || "[]");
      setClients(saved);
    } catch { setClients([]); }
    try {
      const saved = JSON.parse(localStorage.getItem("bp_prospects") || "[]");
      setProspects(saved);
    } catch { setProspects([]); }
  }, []);

  function saveProspects(updated: Prospect[]) {
    setProspects(updated);
    localStorage.setItem("bp_prospects", JSON.stringify(updated));
  }

  function promoteProspect(id: string) {
    const ORDER: Prospect["status"][] = ["email", "onboarding", "accompagnement"];
    const updated = prospects.map(p => {
      if (p.id !== id) return p;
      const idx = ORDER.indexOf(p.status);
      return idx < ORDER.length - 1 ? { ...p, status: ORDER[idx + 1] } : p;
    });
    saveProspects(updated);
  }

  function deleteProspect(id: string) {
    saveProspects(prospects.filter(p => p.id !== id));
    setConfirmDeleteProspect(null);
  }

  function convertToClient(prospect: Prospect) {
    const id = generateId();
    const goal = prospect.goal || "Remise en forme";
    const meta: ClientMeta = {
      id,
      firstName: prospect.firstName,
      lastName: prospect.lastName,
      goal,
      currentWeek: 1,
      totalWeeks: 12,
      programName: "Programme Personnalisé",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const defaultData = buildDefaultClient(id, prospect.firstName, prospect.lastName);
    const updatedClients = [...clients, meta];
    setClients(updatedClients);
    localStorage.setItem("bp_coach_clients", JSON.stringify(updatedClients));
    localStorage.setItem(`bp_coach_client_${id}`, JSON.stringify(defaultData));
    const updatedProspects = prospects.map(p => p.id === prospect.id ? { ...p, status: "accompagnement" as const } : p);
    saveProspects(updatedProspects);
    router.push(`/coach/${id}`);
  }

  function createClient() {
    if (!newFirst.trim()) return;
    const id = generateId();
    const meta: ClientMeta = {
      id,
      firstName: newFirst.trim(),
      lastName: newLast.trim(),
      goal: "Hypertrophie",
      currentWeek: 1,
      totalWeeks: 12,
      programName: "Programme Personnalisé",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const defaultData = buildDefaultClient(id, newFirst.trim(), newLast.trim());
    const updated = [...clients, meta];
    setClients(updated);
    localStorage.setItem("bp_coach_clients", JSON.stringify(updated));
    localStorage.setItem(`bp_coach_client_${id}`, JSON.stringify(defaultData));
    setShowNew(false);
    setNewFirst("");
    setNewLast("");
    router.push(`/coach/${id}`);
  }

  function deleteClient(id: string) {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    localStorage.setItem("bp_coach_clients", JSON.stringify(updated));
    localStorage.removeItem(`bp_coach_client_${id}`);
    setConfirmDelete(null);
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "0.6rem", padding: "0.65rem 0.9rem", color: "#ffffff",
    fontSize: "0.9rem", outline: "none", width: "100%",
  };

  const totalProspects = prospects.length;

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easing }}
        style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}
      >
        <div>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.4rem" }}>
            Tableau de bord
          </p>
          <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>
            Espace Coach
          </h1>
        </div>
        {tab === "clients" && (
          <button
            onClick={() => setShowNew(true)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(135deg, #38bdf8, #0ea5e9)", color: "#03090f", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.7rem 1.4rem", borderRadius: "999px", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.3)" }}
          >
            <Plus size={14} /> Nouveau client
          </button>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: easing, delay: 0.06 }}
        style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.85rem", padding: "0.3rem" }}
      >
        {[
          { key: "clients", label: "Mes Clients", icon: Users, count: clients.length, color: "#38bdf8" },
          { key: "pipeline", label: "Pipeline", icon: TrendingUp, count: totalProspects, color: "#a78bfa" },
        ].map(({ key, label, icon: Icon, count, color }) => (
          <button key={key} onClick={() => setTab(key as "clients" | "pipeline")}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.65rem 1rem", borderRadius: "0.6rem", border: "none", cursor: "pointer", transition: "all 0.2s", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.06em", background: tab === key ? `${color}14` : "transparent", color: tab === key ? color : "rgba(255,255,255,0.3)", boxShadow: tab === key ? `0 0 0 1px ${color}30` : "none" }}
          >
            <Icon size={14} />
            {label}
            <span style={{ fontSize: "0.7rem", fontWeight: 700, background: tab === key ? `${color}25` : "rgba(255,255,255,0.06)", color: tab === key ? color : "rgba(255,255,255,0.25)", borderRadius: "999px", padding: "0.08rem 0.45rem", minWidth: 20, textAlign: "center" }}>
              {count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* New client modal */}
      {showNew && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,8,18,0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          onClick={() => setShowNew(false)}
        >
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.28, ease: easing }}
            onClick={e => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "420px", background: "linear-gradient(145deg, rgba(56,189,248,0.08) 0%, rgba(7,12,22,0.98) 60%)", backdropFilter: "blur(40px)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "1.25rem", padding: "2rem", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", position: "relative" }}
          >
            <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(56,189,248,0.5), rgba(255,255,255,0.3), rgba(56,189,248,0.5), transparent)", pointerEvents: "none" }} />
            <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.4rem", textTransform: "uppercase", color: "#ffffff", marginBottom: "1.5rem" }}>
              Nouveau client
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", display: "block", marginBottom: "0.4rem" }}>Prénom</label>
                <input autoFocus value={newFirst} onChange={e => setNewFirst(e.target.value)} onKeyDown={e => e.key === "Enter" && createClient()} placeholder="Thomas" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", display: "block", marginBottom: "0.4rem" }}>Nom</label>
                <input value={newLast} onChange={e => setNewLast(e.target.value)} onKeyDown={e => e.key === "Enter" && createClient()} placeholder="Dupont" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setShowNew(false)} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.7rem", padding: "0.7rem", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", cursor: "pointer" }}>
                Annuler
              </button>
              <button onClick={createClient} disabled={!newFirst.trim()} style={{ flex: 1, background: newFirst.trim() ? "linear-gradient(135deg, #38bdf8, #0ea5e9)" : "rgba(255,255,255,0.05)", border: "none", borderRadius: "0.7rem", padding: "0.7rem", color: newFirst.trim() ? "#03090f" : "rgba(255,255,255,0.2)", fontWeight: 700, fontSize: "0.85rem", cursor: newFirst.trim() ? "pointer" : "not-allowed" }}>
                Créer et configurer →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {tab === "clients" ? (
          <motion.div key="clients" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: easing }}>
            {/* Client grid */}
            {clients.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 2rem", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "1.25rem" }}>
                <User size={36} color="rgba(255,255,255,0.12)" style={{ margin: "0 auto 1rem" }} />
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.4rem" }}>Aucun client pour l&apos;instant</p>
                <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.18)" }}>Cliquez sur &quot;Nouveau client&quot; pour commencer</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                {clients.map((c, i) => {
                  const color = goalColors[c.goal] ?? "#38bdf8";
                  return (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: easing, delay: i * 0.06 }}
                      style={{ position: "relative", background: `linear-gradient(145deg, ${color}0c 0%, rgba(255,255,255,0.03) 60%)`, backdropFilter: "blur(24px)", border: `1px solid ${color}22`, borderRadius: "1.1rem", overflow: "hidden" }}
                    >
                      <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: `linear-gradient(to right, transparent, ${color}55, rgba(255,255,255,0.3), ${color}55, transparent)`, pointerEvents: "none" }} />

                      <div style={{ padding: "1.4rem 1.4rem 1.1rem" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.9rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                            {c.avatar ? (
                              <img src={c.avatar} alt="avatar" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `2px solid ${color}50`, boxShadow: `0 0 12px ${color}25`, flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${color}18`, border: `2px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1rem", color, flexShrink: 0 }}>
                                {c.firstName?.[0]}{c.lastName?.[0]}
                              </div>
                            )}
                            <div>
                              <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.35rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>
                                {c.firstName} {c.lastName}
                              </p>
                              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.38)", marginTop: "0.2rem" }}>{c.programName}</p>
                            </div>
                          </div>
                          <button onClick={() => setConfirmDelete(c.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.2rem", color: "rgba(255,255,255,0.2)", transition: "color 0.15s" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color, background: `${color}12`, border: `1px solid ${color}28`, borderRadius: "999px", padding: "0.18rem 0.6rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Target size={9} /> {c.goal}
                          </span>
                          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "999px", padding: "0.18rem 0.6rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Calendar size={9} /> Depuis {c.createdAt}
                          </span>
                        </div>

                        <div style={{ marginBottom: "1.1rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>Semaine {c.currentWeek}/{c.totalWeeks}</span>
                            <span style={{ fontSize: "0.7rem", fontWeight: 700, color }}>{Math.round((c.currentWeek / c.totalWeeks) * 100)}%</span>
                          </div>
                          <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(c.currentWeek / c.totalWeeks) * 100}%`, background: color, borderRadius: "999px", boxShadow: `0 0 8px ${color}70` }} />
                          </div>
                        </div>

                        <button onClick={() => router.push(`/coach/${c.id}`)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", background: `${color}12`, border: `1px solid ${color}28`, borderRadius: "0.7rem", padding: "0.65rem", color, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s" }}
                          onMouseEnter={e => { const el = e.currentTarget; el.style.background = `${color}20`; el.style.boxShadow = `0 4px 16px ${color}20`; }}
                          onMouseLeave={e => { const el = e.currentTarget; el.style.background = `${color}12`; el.style.boxShadow = "none"; }}
                        >
                          Gérer le programme <ArrowRight size={12} />
                        </button>
                      </div>

                      {confirmDelete === c.id && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(6,11,21,0.95)", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.85rem", borderRadius: "1.1rem" }}>
                          <p style={{ fontSize: "0.9rem", color: "#ffffff", textAlign: "center" }}>Supprimer <strong>{c.firstName}</strong> ?</p>
                          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>Cette action est irréversible</p>
                          <div style={{ display: "flex", gap: "0.6rem" }}>
                            <button onClick={() => setConfirmDelete(null)} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.6rem", padding: "0.5rem 1rem", color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", cursor: "pointer" }}>Annuler</button>
                            <button onClick={() => deleteClient(c.id)} style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "0.6rem", padding: "0.5rem 1rem", color: "#f87171", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>Supprimer</button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="pipeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: easing }}>
            {/* Pipeline header info */}
            <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                Les prospects remplissent <strong style={{ color: "rgba(255,255,255,0.6)" }}>/signup</strong> pour s&apos;inscrire ou <strong style={{ color: "rgba(255,255,255,0.6)" }}>/onboarding</strong> pour le formulaire complet.
              </p>
            </div>

            {prospects.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 2rem", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "1.25rem" }}>
                <TrendingUp size={36} color="rgba(255,255,255,0.12)" style={{ margin: "0 auto 1rem" }} />
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.4rem" }}>Aucun prospect pour l&apos;instant</p>
                <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.18)" }}>Partagez le lien /signup pour commencer à recevoir des inscriptions</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", alignItems: "start" }}>
                {PIPELINE_COLS.map(col => {
                  const colProspects = prospects.filter(p => p.status === col.status);
                  const Icon = col.icon;
                  return (
                    <div key={col.status}>
                      {/* Column header */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.85rem", padding: "0 0.2rem" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "8px", background: `${col.color}14`, border: `1px solid ${col.color}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={13} color={col.color} />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#ffffff" }}>{col.label}</p>
                          <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>{col.sublabel}</p>
                        </div>
                        <span style={{ marginLeft: "auto", fontSize: "0.72rem", fontWeight: 700, background: `${col.color}18`, color: col.color, borderRadius: "999px", padding: "0.1rem 0.5rem" }}>
                          {colProspects.length}
                        </span>
                      </div>

                      {/* Cards */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {colProspects.length === 0 ? (
                          <div style={{ padding: "1.5rem 1rem", textAlign: "center", background: "rgba(255,255,255,0.015)", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: "0.85rem" }}>
                            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)" }}>Aucun prospect ici</p>
                          </div>
                        ) : (
                          colProspects.map((p, i) => {
                            const goalColor = goalColors[p.goal ?? ""] ?? "#38bdf8";
                            const isExpanded = expandedProspect === p.id;
                            const isLast = col.status === "accompagnement";
                            return (
                              <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: easing, delay: i * 0.05 }}
                                style={{ background: `linear-gradient(145deg, ${col.color}08 0%, rgba(255,255,255,0.02) 60%)`, border: `1px solid ${col.color}18`, borderRadius: "0.9rem", overflow: "hidden", position: "relative" }}
                              >
                                <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: `linear-gradient(to right, transparent, ${col.color}40, transparent)`, pointerEvents: "none" }} />

                                <div style={{ padding: "0.9rem 1rem" }}>
                                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#ffffff", marginBottom: "0.1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {p.firstName} {p.lastName}
                                      </p>
                                      <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.38)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.email}</p>
                                    </div>
                                    <button onClick={() => setConfirmDeleteProspect(p.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.15rem", color: "rgba(255,255,255,0.18)", flexShrink: 0 }}
                                      onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.18)")}
                                    >
                                      <X size={13} />
                                    </button>
                                  </div>

                                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.7rem" }}>
                                    {p.goal && (
                                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: goalColor, background: `${goalColor}12`, border: `1px solid ${goalColor}25`, borderRadius: "999px", padding: "0.12rem 0.5rem" }}>
                                        {p.goal}
                                      </span>
                                    )}
                                    {p.phone && (
                                      <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "999px", padding: "0.12rem 0.5rem" }}>
                                        {p.phone}
                                      </span>
                                    )}
                                    <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "999px", padding: "0.12rem 0.5rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                      <Calendar size={8} /> {fmtDate(p.createdAt)}
                                    </span>
                                  </div>

                                  {/* Onboarding details toggle */}
                                  {p.onboardingData && (
                                    <button onClick={() => setExpandedProspect(isExpanded ? null : p.id)}
                                      style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.5rem", padding: "0.38rem 0.6rem", color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", marginBottom: "0.6rem", transition: "all 0.15s" }}
                                    >
                                      <ClipboardList size={11} />
                                      Voir l&apos;onboarding
                                      <ChevronRight size={11} style={{ marginLeft: "auto", transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                                    </button>
                                  )}

                                  {isExpanded && p.onboardingData && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.6rem", padding: "0.75rem", marginBottom: "0.6rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}
                                    >
                                      {[
                                        { k: "Âge", v: p.onboardingData.age ? `${p.onboardingData.age} ans` : null },
                                        { k: "Poids", v: p.onboardingData.weight ? `${p.onboardingData.weight} kg` : null },
                                        { k: "Taille", v: p.onboardingData.height ? `${p.onboardingData.height} cm` : null },
                                        { k: "Niveau", v: p.onboardingData.level ?? null },
                                        { k: "Dispo", v: p.onboardingData.availability?.join(", ") ?? null },
                                        { k: "Motivation", v: p.onboardingData.motivation ?? null },
                                        { k: "Blessures", v: p.onboardingData.injuries ?? null },
                                        { k: "Message", v: p.onboardingData.message ?? null },
                                      ].filter(row => row.v).map(row => (
                                        <div key={row.k} style={{ display: "flex", gap: "0.5rem" }}>
                                          <span style={{ fontSize: "0.67rem", fontWeight: 700, color: col.color, opacity: 0.7, minWidth: 60 }}>{row.k}</span>
                                          <span style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.5)", flex: 1 }}>{row.v}</span>
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}

                                  {/* Actions */}
                                  <div style={{ display: "flex", gap: "0.5rem" }}>
                                    {!isLast && (
                                      <button onClick={() => promoteProspect(p.id)}
                                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", background: `${col.color}12`, border: `1px solid ${col.color}28`, borderRadius: "0.5rem", padding: "0.45rem 0.6rem", color: col.color, fontWeight: 700, fontSize: "0.72rem", cursor: "pointer", transition: "all 0.15s" }}
                                        onMouseEnter={e => { e.currentTarget.style.background = `${col.color}22`; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = `${col.color}12`; }}
                                      >
                                        Promouvoir <ChevronRight size={11} />
                                      </button>
                                    )}
                                    <button onClick={() => convertToClient(p)}
                                      style={{ flex: isLast ? 1 : undefined, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: "0.5rem", padding: "0.45rem 0.6rem", color: "#4ade80", fontWeight: 700, fontSize: "0.72rem", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}
                                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.18)"; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(74,222,128,0.1)"; }}
                                    >
                                      Convertir <ArrowRight size={11} />
                                    </button>
                                  </div>
                                </div>

                                {/* Delete confirm overlay */}
                                {confirmDeleteProspect === p.id && (
                                  <div style={{ position: "absolute", inset: 0, background: "rgba(6,11,21,0.95)", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", borderRadius: "0.9rem" }}>
                                    <p style={{ fontSize: "0.85rem", color: "#ffffff", textAlign: "center" }}>Supprimer <strong>{p.firstName}</strong> ?</p>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                      <button onClick={() => setConfirmDeleteProspect(null)} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.5rem", padding: "0.4rem 0.85rem", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", cursor: "pointer" }}>Annuler</button>
                                      <button onClick={() => deleteProspect(p.id)} style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "0.5rem", padding: "0.4rem 0.85rem", color: "#f87171", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>Supprimer</button>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function buildDefaultClient(id: string, firstName: string, lastName: string) {
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const program: Record<string, { type: string; duration: string; muscles: string[]; exercises: unknown[] }> = {};
  days.forEach(d => { program[d] = { type: "Repos", duration: "", muscles: [], exercises: [] }; });
  return {
    id, firstName, lastName,
    goal: "Hypertrophie",
    programName: "Programme Personnalisé",
    startDate: new Date().toISOString().slice(0, 10),
    currentWeek: 1, totalWeeks: 12,
    program,
    diet: { calories: 2500, protein: 150, carbs: 280, fat: 75, hydration: 3, coachNote: "" },
  };
}
