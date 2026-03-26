import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck, BarChart2, List, ScrollText, Cpu,
  LogOut, ChevronRight, Wifi, WifiOff, Send, MessageSquare, X
} from "lucide-react";

import { api } from "./api/sentinelApi";
import { useSentinelData } from "./hooks/useSentinelData";

import AnalyticsView from "./components/views/AnalyticsView";
import TransactionsView from "./components/views/TransactionsView";
import MLInsightsView from "./components/views/MLInsightsView";
import AuditLogsView from "./components/views/AuditLogsView";

const NAV = [
  { id: "analytics",    label: "Analytics",    icon: BarChart2    },
  { id: "transactions", label: "Transactions",  icon: List         },
  { id: "mlinsights",  label: "ML Insights",   icon: Cpu          },
  { id: "auditlogs",   label: "Audit Logs",    icon: ScrollText   },
];

// ─── Analyst Dashboard Shell ─────────────────────────────────────────────────
export default function AnalystDashboard({ auth, onLogout }) {
  const [activeNav, setActiveNav]         = useState("analytics");
  const [msgOpen,   setMsgOpen]           = useState(false);
  const [msgText,   setMsgText]           = useState("");
  const [sending,   setSending]           = useState(false);
  const [sent,      setSent]              = useState(false);
  const { transactions, stats, health, connected, latency } = useSentinelData(auth);

  const handleSend = async () => {
    if (!msgText.trim()) return;
    setSending(true);
    try {
      await api.sendMessage(auth.token, auth.username, msgText.trim());
      setSent(true);
      setMsgText("");
      setTimeout(() => setSent(false), 3000);
    } catch (e) {
      console.error("Message send failed:", e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={S.shell}>
      {/* ─── Sidebar ─── */}
      <aside style={S.sidebar}>
        {/* Brand */}
        <div style={S.brand}>
          <div style={S.brandIcon}><ShieldCheck size={18} color="#00d4ff" /></div>
          <div>
            <div style={S.brandTitle}>SENTINEL</div>
            <div style={S.brandRole}>ANALYST MODE</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={S.nav}>
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = activeNav === id;
            return (
              <button key={id} onClick={() => setActiveNav(id)} style={{
                ...S.navItem,
                background:  active ? "rgba(0,212,255,0.07)" : "transparent",
                borderLeft: `2px solid ${active ? "#00d4ff" : "transparent"}`,
                color:       active ? "#00d4ff" : "#5a6478",
              }}>
                <Icon size={15} />
                <span style={S.navLabel}>{label}</span>
                {active && <ChevronRight size={12} style={{ marginLeft: "auto", opacity: 0.5 }} />}
              </button>
            );
          })}
        </nav>

        {/* Footer — user info + message composer */}
        <div style={S.footer}>
          {/* Message Compose Portal */}
          <button onClick={() => setMsgOpen(true)} style={S.msgBtn}>
            <MessageSquare size={13} /> MESSAGE ADMIN
          </button>

          <div style={S.userBlock}>
            <div style={S.userAvatar}>{auth.username?.[0]?.toUpperCase()}</div>
            <div>
              <div style={S.userName}>{auth.username}</div>
              <div style={{ fontSize: 8, color: "#00d4ff", letterSpacing: 1 }}>ANALYST</div>
            </div>
          </div>
          <button onClick={onLogout} style={S.logoutBtn}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div style={S.main}>
        {/* TopBar */}
        <header style={S.topbar}>
          <div>
            <div style={S.topTitle}>{NAV.find(n => n.id === activeNav)?.label ?? "Analytics"}</div>
            <div style={S.topSub}>Read-only analytical overview · Sentinel AI</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: connected ? "#34c759" : "#ff3b3b" }}>
            {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span style={{ letterSpacing: 1 }}>{connected ? `SECURE · ${latency}ms` : "LINK SEVERED"}</span>
          </div>
        </header>

        {/* Views */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {activeNav === "analytics"    && <AnalyticsView    transactions={transactions} stats={stats} />}
          {activeNav === "transactions" && <TransactionsView  transactions={transactions} />}
          {activeNav === "mlinsights"   && <MLInsightsView    transactions={transactions} />}
          {activeNav === "auditlogs"    && <AuditLogsView     auth={auth} />}
        </div>
      </div>

      {/* ─── Message Compose Modal ─── */}
      {msgOpen && (
        <div style={S.overlay} onClick={() => setMsgOpen(false)}>
          <div style={S.composeBox} onClick={e => e.stopPropagation()}>
            <div style={S.composeHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MessageSquare size={15} color="#00d4ff" />
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, letterSpacing: 1 }}>
                  MESSAGE ADMIN
                </span>
              </div>
              <button onClick={() => setMsgOpen(false)} style={S.closeBtn}><X size={16} /></button>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 10, color: "#5a6478", marginBottom: 8 }}>
                FROM: <span style={{ color: "#00d4ff" }}>{auth.username.toUpperCase()}</span> → TO: ADMIN
              </div>
              <textarea
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                placeholder="Describe the issue, suspicious pattern, or request..."
                rows={5}
                style={S.textarea}
              />

              {sent && (
                <div style={{ fontSize: 10, color: "#34c759", marginTop: 8, letterSpacing: 1 }}>
                  ✓ MESSAGE DISPATCHED TO ADMIN INBOX
                </div>
              )}

              <button
                onClick={handleSend}
                disabled={sending || !msgText.trim()}
                style={{
                  ...S.sendBtn,
                  opacity: (!msgText.trim() || sending) ? 0.4 : 1,
                  cursor:  (!msgText.trim() || sending) ? "not-allowed" : "pointer",
                }}
              >
                <Send size={13} />
                {sending ? "DISPATCHING..." : "DISPATCH TO ADMIN"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  shell:   { display: "flex", minHeight: "100vh", background: "#050608", color: "#e8eaf0", fontFamily: "'Space Mono', monospace" },
  sidebar: { width: 220, minWidth: 220, background: "#060810", borderRight: "1px solid rgba(0,212,255,0.08)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" },
  brand:   { display: "flex", alignItems: "center", gap: 12, padding: "20px", borderBottom: "1px solid rgba(0,212,255,0.08)" },
  brandIcon: { width: 32, height: 32, background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" },
  brandTitle: { fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 900, letterSpacing: 3, color: "#e8eaf0" },
  brandRole:  { fontSize: 8, color: "#00d4ff", letterSpacing: 2, marginTop: 2 },
  nav:     { flex: 1, padding: "16px 0", display: "flex", flexDirection: "column", gap: 2 },
  navItem: { display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 11, letterSpacing: 1, transition: "all 0.2s", textAlign: "left", width: "100%", fontFamily: "'Space Mono', monospace" },
  navLabel: { fontSize: 11, letterSpacing: 1 },
  footer:  { padding: "16px 20px", borderTop: "1px solid rgba(0,212,255,0.08)", display: "flex", flexDirection: "column", gap: 12 },
  userBlock: { display: "flex", alignItems: "center", gap: 10 },
  userAvatar: { width: 30, height: 30, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", color: "#00d4ff", flexShrink: 0 },
  userName: { fontSize: 10, color: "#e8eaf0" },
  logoutBtn: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,59,59,0.05)", border: "1px solid rgba(255,59,59,0.2)", color: "#ff3b3b", fontSize: 10, padding: "8px 12px", cursor: "pointer", letterSpacing: 1, fontFamily: "'Space Mono', monospace", width: "100%", justifyContent: "center" },
  msgBtn:  { display: "flex", alignItems: "center", gap: 8, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff", fontSize: 10, padding: "10px 12px", cursor: "pointer", letterSpacing: 1, fontFamily: "'Space Mono', monospace", width: "100%", justifyContent: "center", transition: "all 0.2s" },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 64, background: "#060810", borderBottom: "1px solid rgba(0,212,255,0.08)", position: "sticky", top: 0, zIndex: 50 },
  topTitle: { fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 700, letterSpacing: 2, color: "#e8eaf0" },
  topSub:   { fontSize: 10, color: "#5a6478", marginTop: 3, letterSpacing: 1 },

  // Compose modal
  overlay:     { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, backdropFilter: "blur(4px)" },
  composeBox:  { width: 460, background: "#080a12", border: "1px solid rgba(0,212,255,0.2)", boxShadow: "0 20px 60px rgba(0,212,255,0.1)" },
  composeHeader: { padding: "16px 20px", borderBottom: "1px solid rgba(0,212,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,212,255,0.03)" },
  closeBtn:    { background: "none", border: "none", color: "#5a6478", cursor: "pointer" },
  textarea:    { width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#e8eaf0", padding: "12px", fontSize: 11, fontFamily: "'Space Mono', monospace", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6 },
  sendBtn:     { display: "flex", alignItems: "center", gap: 8, background: "rgba(0,212,255,0.1)", border: "1px solid #00d4ff", color: "#00d4ff", padding: "12px 20px", fontSize: 11, fontFamily: "'Orbitron', monospace", marginTop: 16, letterSpacing: 1, width: "100%", justifyContent: "center" },
};
