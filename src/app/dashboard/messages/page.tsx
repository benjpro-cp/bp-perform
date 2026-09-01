"use client";

import { useState, useRef, useEffect } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, ChevronRight, Clock, ArrowLeft } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;

type CoachId = "paul" | "benjamin";
type Message = { id: string; from: "coach" | "client"; text: string; createdAt: string };

const MSG_KEYS: Record<CoachId, string> = {
  paul: "bp_messages_paul",
  benjamin: "bp_messages_benjamin",
};
const READ_KEYS: Record<CoachId, string> = {
  paul: "bp_messages_client_read_paul",
  benjamin: "bp_messages_client_read_benjamin",
};

const COACH_CONFIG: Record<CoachId, { name: string; initials: string; color: string; shadow: string; badge: string; tagline: string; placeholder: string }> = {
  paul: {
    name: "Paul",
    initials: "P",
    color: "#38bdf8",
    shadow: "rgba(56,189,248,",
    badge: "Ton coach",
    tagline: "Répond généralement en moins d'une heure",
    placeholder: "Écrire à Paul…",
  },
  benjamin: {
    name: "Benjamin",
    initials: "B",
    color: "#34d399",
    shadow: "rgba(52,211,153,",
    badge: "Coach associé",
    tagline: "Disponible pour un deuxième avis",
    placeholder: "Écrire à Benjamin…",
  },
};

const SEED_PAUL: Message[] = [
  { id: "p1", from: "coach", text: "Salut ! Bienvenue dans ton espace client. Tu as bien reçu ton programme de la semaine ?", createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: "p2", from: "client", text: "Oui ! Ça a l'air intense mais je suis motivé. Une question sur le squat : je dois aller jusqu'à combien en charge cette semaine ?", createdAt: new Date(Date.now() - 7 * 86400000 + 2700000).toISOString() },
  { id: "p3", from: "coach", text: "Bonne question. Cette semaine on vise 90 kg. Si tu sens que c'est passable proprement, on monte à 95 vendredi. L'important c'est la technique avant tout.", createdAt: new Date(Date.now() - 7 * 86400000 + 3720000).toISOString() },
  { id: "p4", from: "client", text: "Parfait, noté. Je t'envoie une vidéo de ma technique si tu veux.", createdAt: new Date(Date.now() - 7 * 86400000 + 4500000).toISOString() },
  { id: "p5", from: "coach", text: "Oui carrément, envoie moi ça après la séance. Et pense bien à te peser demain matin à jeun, on note tout.", createdAt: new Date(Date.now() - 7 * 86400000 + 4680000).toISOString() },
  { id: "p6", from: "client", text: "Top, c'est noté !", createdAt: new Date(Date.now() - 7 * 86400000 + 5400000).toISOString() },
  { id: "p7", from: "coach", text: "Très bonne semaine ! Tu as progressé sur tous les exercices. On augmente le développé incliné de 2.5 kg — les 4×10 étaient vraiment propres.", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "p8", from: "coach", text: "N'oublie pas de te peser demain matin à jeun pour qu'on ait les données de la semaine.", createdAt: new Date(Date.now() - 86400000).toISOString() },
];

const SEED_BENJAMIN: Message[] = [
  { id: "b1", from: "coach", text: "Salut ! Je suis Benjamin, coach associé chez BP Perform. N'hésite pas si tu as des questions ou si tu veux un second avis sur ton programme.", createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
];

function loadMessages(coachId: CoachId): Message[] {
  try {
    const raw = localStorage.getItem(MSG_KEYS[coachId]);
    if (!raw) {
      const seed = coachId === "paul" ? SEED_PAUL : SEED_BENJAMIN;
      localStorage.setItem(MSG_KEYS[coachId], JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch { return coachId === "paul" ? SEED_PAUL : SEED_BENJAMIN; }
}

function fmtDayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const msgDay = new Date(d); msgDay.setHours(0, 0, 0, 0);
  if (msgDay.getTime() === today.getTime()) return "Aujourd'hui";
  if (msgDay.getTime() === yesterday.getTime()) return "Hier";
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}
function fmtTime(iso: string) {
  const d = new Date(iso);
  return `${d.getHours()}h${String(d.getMinutes()).padStart(2, "0")}`;
}
function fmtRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  return fmtDayLabel(iso);
}
function isSameDay(a: string, b: string) { return new Date(a).toDateString() === new Date(b).toDateString(); }
function isSameSender(a: Message, b: Message) { return a.from === b.from; }
function minutesBetween(a: string, b: string) { return Math.abs(new Date(b).getTime() - new Date(a).getTime()) / 60000; }

export default function MessagesPage() {
  const { isMobile } = useBreakpoint();
  const [open, setOpen] = useState<CoachId | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allMessages, setAllMessages] = useState<Record<CoachId, Message[]>>({ paul: [], benjamin: [] });
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAllMessages({ paul: loadMessages("paul"), benjamin: loadMessages("benjamin") });
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function openChat(coachId: CoachId) {
    const msgs = loadMessages(coachId);
    setMessages(msgs);
    setAllMessages(prev => ({ ...prev, [coachId]: msgs }));
    setOpen(coachId);
    localStorage.setItem(READ_KEYS[coachId], msgs[msgs.length - 1]?.id ?? "");
  }

  function closeChat() {
    setOpen(null);
    setAllMessages({ paul: loadMessages("paul"), benjamin: loadMessages("benjamin") });
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !open) return;
    const msg: Message = { id: Date.now().toString(), from: "client", text: input.trim(), createdAt: new Date().toISOString() };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(MSG_KEYS[open], JSON.stringify(updated));
    localStorage.setItem(READ_KEYS[open], msg.id);
    setInput("");
    inputRef.current?.focus();
  }

  function getUnreadCount(coachId: CoachId): number {
    if (typeof window === "undefined") return 0;
    const msgs = allMessages[coachId];
    const lastRead = localStorage.getItem(READ_KEYS[coachId]);
    const lastReadIdx = lastRead ? msgs.findLastIndex(m => m.id === lastRead) : -1;
    return msgs.slice(lastReadIdx + 1).filter(m => m.from === "coach").length;
  }

  const currentCoach = open ? COACH_CONFIG[open] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: isMobile ? "calc(100dvh - 56px - 2rem)" : "calc(100vh - 56px - 4.5rem)" }}>
      <AnimatePresence mode="wait">

        {!open ? (
          /* ── Entry: liste des coachs ── */
          <motion.div key="entry"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: easing }}
            style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.4rem" }}>Messagerie privée</p>
              <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>Ton équipe</h1>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", marginTop: "0.5rem" }}>Contacte ton coach ou demande un second avis</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {(["paul", "benjamin"] as CoachId[]).map(coachId => {
                const coach = COACH_CONFIG[coachId];
                const msgs = allMessages[coachId];
                const lastMsg = msgs[msgs.length - 1];
                const unread = getUnreadCount(coachId);
                const s = coach.shadow;

                return (
                  <motion.button key={coachId} onClick={() => openChat(coachId)}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    style={{
                      textAlign: "left", cursor: "pointer",
                      background: unread > 0 ? `linear-gradient(145deg, ${s}0.08) 0%, rgba(255,255,255,0.02) 70%)` : `linear-gradient(145deg, ${s}0.04) 0%, rgba(255,255,255,0.02) 70%)`,
                      border: `1px solid ${unread > 0 ? `${s}0.25)` : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "1.25rem", padding: "1.25rem 1.5rem", position: "relative", overflow: "hidden", transition: "all 0.2s",
                    }}
                  >
                    <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: `linear-gradient(to right, transparent, ${s}${unread > 0 ? "0.4" : "0.12"}), transparent)`, pointerEvents: "none" }} />

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      {/* Avatar */}
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${s}0.28) 0%, ${s}0.07) 100%)`, border: `2px solid ${s}0.38)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.2rem", color: coach.color, boxShadow: `0 0 20px ${s}0.15), inset 0 1px 0 rgba(255,255,255,0.15)` }}>
                          {coach.initials}
                        </div>
                        {unread > 0 && (
                          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                            style={{ position: "absolute", top: -3, right: -3, minWidth: 18, height: 18, borderRadius: "999px", background: coach.color, border: "2px solid #060b15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800, color: "#060b15", padding: "0 4px" }}
                          >
                            {unread}
                          </motion.div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                            <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.05rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>{coach.name}</p>
                            <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: coach.color, background: `${s}0.1)`, border: `1px solid ${s}0.22)`, borderRadius: "999px", padding: "0.1rem 0.5rem" }}>{coach.badge}</span>
                          </div>
                          {lastMsg && <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>{fmtRelative(lastMsg.createdAt)}</span>}
                        </div>
                        {lastMsg ? (
                          <p style={{ fontSize: "0.82rem", color: unread > 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: unread > 0 ? 500 : 400 }}>
                            {lastMsg.from === "client" ? "Toi : " : ""}{lastMsg.text}
                          </p>
                        ) : (
                          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>Aucun message</p>
                        )}
                      </div>

                      <ChevronRight size={16} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0 }} />
                    </div>

                    <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Clock size={10} color={`${s}0.4)`} />
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.22)" }}>{coach.tagline}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

        ) : (

          /* ── Chat ── */
          <motion.div key={`chat-${open}`}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easing }}
            style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0, overflow: "hidden" }}
          >
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: easing }}
              style={{ flexShrink: 0, marginBottom: "1rem" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", background: `linear-gradient(145deg, ${currentCoach!.shadow}0.07) 0%, rgba(255,255,255,0.02) 70%)`, backdropFilter: "blur(32px)", border: `1px solid ${currentCoach!.shadow}0.18)`, borderRadius: "1.1rem", padding: "0.85rem 1.1rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: `linear-gradient(to right, transparent, ${currentCoach!.shadow}0.45), rgba(255,255,255,0.25), ${currentCoach!.shadow}0.45), transparent)`, pointerEvents: "none" }} />

                <button onClick={closeChat}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)", flexShrink: 0, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  <ArrowLeft size={14} />
                </button>

                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${currentCoach!.shadow}0.28), ${currentCoach!.shadow}0.07))`, border: `1.5px solid ${currentCoach!.shadow}0.38)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1rem", color: currentCoach!.color, flexShrink: 0 }}>
                  {currentCoach!.initials}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.15rem" }}>
                    <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>{currentCoach!.name}</p>
                    <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: currentCoach!.color, background: `${currentCoach!.shadow}0.1)`, border: `1px solid ${currentCoach!.shadow}0.2)`, borderRadius: "999px", padding: "0.1rem 0.5rem" }}>{currentCoach!.badge}</span>
                  </div>
                  <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>{currentCoach!.tagline}</p>
                </div>

                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.8)", display: "block", flexShrink: 0 }}
                />
              </div>
            </motion.div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0.25rem 0.75rem", display: "flex", flexDirection: "column", gap: 0 }}>
              {messages.map((msg, i) => {
                const isClient = msg.from === "client";
                const prev = messages[i - 1];
                const next = messages[i + 1];
                const showDate = !prev || !isSameDay(prev.createdAt, msg.createdAt);
                const isFirstInGroup = !prev || !isSameSender(prev, msg) || !isSameDay(prev.createdAt, msg.createdAt) || minutesBetween(prev.createdAt, msg.createdAt) > 5;
                const isLastInGroup = !next || !isSameSender(next, msg) || !isSameDay(next.createdAt, msg.createdAt) || minutesBetween(msg.createdAt, next.createdAt) > 5;
                const topR = isFirstInGroup ? "18px" : (isClient ? "18px 4px" : "4px 18px");
                const botR = isLastInGroup ? "18px" : (isClient ? "4px 18px" : "18px 4px");
                const br = `${topR} ${botR}`;

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: `${i === 0 ? "0.5rem" : "1.5rem"} 0 1rem` }}>
                        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                        <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.22)", whiteSpace: "nowrap" }}>{fmtDayLabel(msg.createdAt)}</span>
                        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.22, ease: easing }}
                      style={{ display: "flex", flexDirection: isClient ? "row-reverse" : "row", alignItems: "flex-end", gap: "0.55rem", marginBottom: isLastInGroup ? "0.85rem" : "0.2rem", paddingLeft: isClient ? "3rem" : 0, paddingRight: isClient ? 0 : "3rem" }}
                    >
                      {!isClient && (
                        <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: isLastInGroup ? `linear-gradient(135deg, ${currentCoach!.shadow}0.28), ${currentCoach!.shadow}0.07))` : "transparent", border: isLastInGroup ? `1.5px solid ${currentCoach!.shadow}0.35)` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.72rem", color: currentCoach!.color, alignSelf: "flex-end" }}>
                          {isLastInGroup ? currentCoach!.initials : ""}
                        </div>
                      )}
                      <div style={{ maxWidth: "68%" }}>
                        <div style={{
                          padding: "0.72rem 1.05rem", borderRadius: br,
                          background: isClient ? "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)" : "rgba(255,255,255,0.065)",
                          backdropFilter: isClient ? "none" : "blur(12px)",
                          border: isClient ? "none" : "1px solid rgba(255,255,255,0.09)",
                          boxShadow: isClient ? "0 4px 24px rgba(56,189,248,0.32), inset 0 1px 0 rgba(255,255,255,0.28)" : "inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 8px rgba(0,0,0,0.15)",
                        }}>
                          <p style={{ fontSize: "0.9rem", color: isClient ? "#03090f" : "rgba(255,255,255,0.82)", lineHeight: 1.65, fontWeight: isClient ? 500 : 400, letterSpacing: "0.005em" }}>{msg.text}</p>
                        </div>
                        {isLastInGroup && (
                          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", marginTop: "0.28rem", textAlign: isClient ? "right" : "left" }}>{fmtTime(msg.createdAt)}</p>
                        )}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <motion.form onSubmit={handleSend}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: easing }}
              style={{ flexShrink: 0, display: "flex", gap: "0.65rem", alignItems: "center", padding: "0.85rem 1rem", background: "rgba(7,12,22,0.75)", backdropFilter: "blur(32px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.1rem", boxShadow: focused ? "0 0 0 1px rgba(56,189,248,0.25), 0 8px 32px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.25)", transition: "box-shadow 0.2s" }}
            >
              <input
                ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                placeholder={currentCoach!.placeholder}
                style={{ flex: 1, background: "transparent", border: "none", color: "#ffffff", fontSize: "0.92rem", outline: "none", letterSpacing: "0.01em" }}
              />
              <motion.button type="submit" disabled={!input.trim()} whileTap={input.trim() ? { scale: 0.9 } : {}}
                style={{ width: 38, height: 38, borderRadius: "50%", border: "none", cursor: input.trim() ? "pointer" : "default", background: input.trim() ? "linear-gradient(135deg, #38bdf8, #0ea5e9)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s, box-shadow 0.2s", boxShadow: input.trim() ? "0 0 0 1px rgba(56,189,248,0.4), 0 4px 20px rgba(56,189,248,0.45), inset 0 1px 0 rgba(255,255,255,0.3)" : "none" }}
              >
                <Send size={14} color={input.trim() ? "#03090f" : "rgba(255,255,255,0.2)"} style={{ transform: "translateX(1px)" }} />
              </motion.button>
            </motion.form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
