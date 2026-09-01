"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, ChevronRight, ArrowLeft } from "lucide-react";

const easing = [0.22, 1, 0.36, 1] as const;
const STORAGE_KEY = "bp_messages";
const COACH_READ_KEY = "bp_messages_coach_read";

type Message = { id: string; from: "coach" | "client"; text: string; createdAt: string };

function loadMessages(): Message[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
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

export default function CoachMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMessages(loadMessages()); }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function openChat() {
    setOpen(true);
    const msgs = loadMessages();
    setMessages(msgs);
    localStorage.setItem(COACH_READ_KEY, msgs[msgs.length - 1]?.id ?? "");
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const msg: Message = { id: Date.now().toString(), from: "coach", text: input.trim(), createdAt: new Date().toISOString() };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(COACH_READ_KEY, msg.id);
    setInput("");
    inputRef.current?.focus();
  }

  const lastMsg = messages[messages.length - 1];
  const lastCoachRead = typeof window !== "undefined" ? localStorage.getItem(COACH_READ_KEY) : null;
  const lastReadIdx = lastCoachRead ? messages.findLastIndex(m => m.id === lastCoachRead) : -1;
  const unreadCount = messages.slice(lastReadIdx + 1).filter(m => m.from === "client").length;
  const clientMessages = messages.filter(m => m.from === "client");
  const lastClientMsg = clientMessages[clientMessages.length - 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px - 5rem)" }}>
      <AnimatePresence mode="wait">

        {/* ── Entry screen ── */}
        {!open ? (
          <motion.div key="entry"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: easing }}
            style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {/* Header */}
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.4rem" }}>Messagerie</p>
              <h1 style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>Messages clients</h1>
            </div>

            {/* Client card — clickable to open */}
            <motion.button
              onClick={openChat}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{ textAlign: "left", cursor: "pointer", background: unreadCount > 0 ? "linear-gradient(145deg, rgba(248,113,113,0.07) 0%, rgba(255,255,255,0.02) 70%)" : "linear-gradient(145deg, rgba(56,189,248,0.06) 0%, rgba(255,255,255,0.02) 70%)", border: `1px solid ${unreadCount > 0 ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.08)"}`, borderRadius: "1.25rem", padding: "1.25rem 1.5rem", position: "relative", overflow: "hidden", transition: "all 0.2s" }}
            >
              <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: `linear-gradient(to right, transparent, ${unreadCount > 0 ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)"}, transparent)`, pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {/* Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, rgba(167,139,250,0.28) 0%, rgba(167,139,250,0.07) 100%)", border: "2px solid rgba(167,139,250,0.38)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.1rem", color: "#a78bfa", boxShadow: "0 0 20px rgba(167,139,250,0.18), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                    TR
                  </div>
                  {unreadCount > 0 && (
                    <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                      style={{ position: "absolute", top: -3, right: -3, minWidth: 18, height: 18, borderRadius: "999px", background: "#f87171", border: "2px solid #060b15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800, color: "#ffffff", padding: "0 4px" }}
                    >
                      {unreadCount}
                    </motion.div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                    <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.05rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>Thomas R.</p>
                    {lastMsg && <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>{fmtRelative(lastMsg.createdAt)}</span>}
                  </div>
                  {lastMsg ? (
                    <p style={{ fontSize: "0.82rem", color: unreadCount > 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.38)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: unreadCount > 0 ? 500 : 400 }}>
                      {lastMsg.from === "coach" ? "Vous : " : ""}{lastMsg.text}
                    </p>
                  ) : (
                    <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>Aucun message</p>
                  )}
                </div>

                <ChevronRight size={16} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />
              </div>

              {/* Unread banner */}
              {unreadCount > 0 && lastClientMsg && (
                <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "0.75rem" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#f87171", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                    {unreadCount} nouveau{unreadCount > 1 ? "x" : ""} message{unreadCount > 1 ? "s" : ""}
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                    &ldquo;{lastClientMsg.text}&rdquo;
                  </p>
                </div>
              )}
            </motion.button>

            {/* Open chat CTA */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <motion.button
                onClick={openChat}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "linear-gradient(135deg, #38bdf8, #0ea5e9)", color: "#03090f", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.85rem 1.75rem", borderRadius: "999px", border: "none", cursor: "pointer", boxShadow: "0 6px 28px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.3)" }}
              >
                <MessageCircle size={15} />
                {unreadCount > 0 ? `Répondre (${unreadCount})` : "Ouvrir la conversation"}
                <ChevronRight size={14} />
              </motion.button>
            </div>
          </motion.div>

        ) : (

          /* ── Chat ── */
          <motion.div key="chat"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easing }}
            style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0, overflow: "hidden" }}
          >
            {/* Chat header */}
            <div style={{ flexShrink: 0, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.85rem", background: "linear-gradient(145deg, rgba(56,189,248,0.06) 0%, rgba(255,255,255,0.02) 70%)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.1rem", padding: "0.85rem 1.1rem" }}>
              <button onClick={() => setOpen(false)}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)", flexShrink: 0, transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                <ArrowLeft size={14} />
              </button>

              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, rgba(167,139,250,0.25), rgba(167,139,250,0.06))", border: "1.5px solid rgba(167,139,250,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.85rem", color: "#a78bfa", flexShrink: 0 }}>
                TR
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", color: "#ffffff", lineHeight: 1 }}>Thomas R.</p>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "0.15rem" }}>Client actif</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0.25rem 0.75rem", display: "flex", flexDirection: "column" }}>
              {messages.length === 0 && (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.88rem" }}>
                  Aucun message pour l&apos;instant
                </div>
              )}
              {messages.map((msg, i) => {
                const isCoach = msg.from === "coach";
                const prev = messages[i - 1];
                const next = messages[i + 1];
                const showDate = !prev || !isSameDay(prev.createdAt, msg.createdAt);
                const isFirstInGroup = !prev || !isSameSender(prev, msg) || !isSameDay(prev.createdAt, msg.createdAt) || minutesBetween(prev.createdAt, msg.createdAt) > 5;
                const isLastInGroup = !next || !isSameSender(next, msg) || !isSameDay(next.createdAt, msg.createdAt) || minutesBetween(msg.createdAt, next.createdAt) > 5;
                const topR = isFirstInGroup ? "18px" : (isCoach ? "18px 4px" : "4px 18px");
                const botR = isLastInGroup ? "18px" : (isCoach ? "4px 18px" : "18px 4px");
                const br = `${topR} ${botR}`;
                const alignRight = isCoach;

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: `${i === 0 ? "0.5rem" : "1.5rem"} 0 1rem` }}>
                        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
                        <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}>{fmtDayLabel(msg.createdAt)}</span>
                        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.22, ease: easing }}
                      style={{ display: "flex", flexDirection: alignRight ? "row-reverse" : "row", alignItems: "flex-end", gap: "0.5rem", marginBottom: isLastInGroup ? "0.85rem" : "0.2rem", paddingLeft: alignRight ? "3rem" : 0, paddingRight: alignRight ? 0 : "3rem" }}
                    >
                      {!isCoach && (
                        <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: isLastInGroup ? "linear-gradient(135deg, rgba(167,139,250,0.25), rgba(167,139,250,0.06))" : "transparent", border: isLastInGroup ? "1.5px solid rgba(167,139,250,0.35)" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.7rem", color: "#a78bfa", alignSelf: "flex-end" }}>
                          {isLastInGroup ? "TR" : ""}
                        </div>
                      )}
                      <div style={{ maxWidth: "70%" }}>
                        <div style={{ padding: "0.72rem 1.05rem", borderRadius: br, background: isCoach ? "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)" : "rgba(255,255,255,0.06)", border: isCoach ? "none" : "1px solid rgba(255,255,255,0.08)", boxShadow: isCoach ? "0 4px 24px rgba(56,189,248,0.3), inset 0 1px 0 rgba(255,255,255,0.28)" : "inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 8px rgba(0,0,0,0.15)" }}>
                          <p style={{ fontSize: "0.9rem", color: isCoach ? "#03090f" : "rgba(255,255,255,0.82)", lineHeight: 1.65, fontWeight: isCoach ? 500 : 400 }}>{msg.text}</p>
                        </div>
                        {isLastInGroup && (
                          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", marginTop: "0.28rem", textAlign: alignRight ? "right" : "left" }}>{fmtTime(msg.createdAt)}</p>
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
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                placeholder="Répondre à Thomas…"
                style={{ flex: 1, background: "transparent", border: "none", color: "#ffffff", fontSize: "0.92rem", outline: "none" }}
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
