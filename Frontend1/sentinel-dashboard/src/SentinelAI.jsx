import React, { useState, useMemo, useEffect } from "react";
import {
  ShieldAlert, Activity, AlertTriangle, Database,
  TrendingUp, Wifi, WifiOff, LogOut, RefreshCw, Play, Square,
  Search, Cpu, Ghost, LayoutDashboard, Zap, ScanLine,
  BarChart2, List, ScrollText, Settings, ChevronRight, Bell, MessageSquare
} from "lucide-react";

import { useSentinelData } from "./hooks/useSentinelData";
import { api } from "./api/sentinelApi";

import StatCard from "./components/ui/StatCard";
import GlitchText from "./components/ui/GlitchText";
import TransactionRow from "./components/ui/TransactionRow";
import AttackVectorChart from "./components/ui/AttackVectorChart";
import RiskMap from "./components/ui/RiskMap";
import TransactionDetailModal from "./components/ui/TransactionDetailModal";
import SystemHealth from "./components/ui/SystemHealth";

import AnalyticsView from "./components/views/AnalyticsView";
import TransactionsView from "./components/views/TransactionsView";
import AuditLogsView from "./components/views/AuditLogsView";
import SimulationView from "./components/views/SimulationView";
import SettingsView from "./components/views/SettingsView";
import MLInsightsView from "./components/views/MLInsightsView";

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "simulation", label: "Simulation", icon: Zap },
  { id: "mlinsights", label: "ML Insights", icon: Cpu },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "transactions", label: "Transactions", icon: List },
  { id: "auditlogs", label: "Audit Logs", icon: ScrollText },
  { id: "settings", label: "Settings", icon: Settings },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ activeNav, setActiveNav, auth, onLogout }) {
  return (
    <aside style={sidebarStyles.root}>
      {/* Brand */}
      <div style={sidebarStyles.brand}>
        <div style={sidebarStyles.brandIcon}>
          <ShieldAlert size={18} color="#ff3b3b" />
        </div>
        <span style={sidebarStyles.brandText}>
          <GlitchText text="SENTINEL" />
        </span>
      </div>

      {/* Nav */}
      <nav style={sidebarStyles.nav}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeNav === id;
          return (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              style={{
                ...sidebarStyles.navItem,
                background: active ? "rgba(0,212,255,0.07)" : "transparent",
                borderLeft: `2px solid ${active ? "#00d4ff" : "transparent"}`,
                color: active ? "#00d4ff" : "#5a6478",
              }}
            >
              <Icon size={15} />
              <span style={sidebarStyles.navLabel}>{label}</span>
              {active && <ChevronRight size={12} style={{ marginLeft: "auto", opacity: 0.5 }} />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={sidebarStyles.footer}>
        <div style={sidebarStyles.userBlock}>
          <div style={sidebarStyles.userAvatar}>
            {auth.username?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={sidebarStyles.userName}>{auth.username}</div>
            <div style={sidebarStyles.userRole}>
              <span style={sidebarStyles.roleBadge}>{auth.role}</span>
            </div>
          </div>
        </div>
        <button onClick={onLogout} style={sidebarStyles.logoutBtn}>
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </aside>
  );
}

// ─── Top Header Bar ───────────────────────────────────────────────────────────
function TopBar({ activeNav, connected, latency, alerts, clearAlerts }) {
  const [isOpen, setIsOpen] = useState(false);
  const label = NAV_ITEMS.find(n => n.id === activeNav)?.label ?? "Dashboard";
  
  return (
    <header style={topBarStyles.root}>
      <div>
        <div style={topBarStyles.title}>
          {label === "Dashboard" ? "Fraud Monitoring Dashboard" : label}
        </div>
        <div style={topBarStyles.subtitle}>
          Real-time overview of transaction activity and threat detection
        </div>
      </div>
      <div style={topBarStyles.right}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: connected ? "#34c759" : "#ff3b3b" }}>
          {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span style={{ letterSpacing: 1 }}>{connected ? `SECURE · ${latency}ms` : "LINK SEVERED"}</span>
        </div>
        
        <div style={{ position: "relative" }}>
          <button style={topBarStyles.iconBtn} onClick={() => setIsOpen(!isOpen)} title="Messages">
            <Bell size={15} />
            {alerts && alerts.length > 0 && <span style={topBarStyles.notifDot} />}
          </button>

          {/* NOTIFICATION INBOX PANEL */}
          {isOpen && (
            <div style={{
              position: "absolute", top: 32, right: 0, width: 340,
              background: "#080a10", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4, boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
              zIndex: 9999, display: "flex", flexDirection: "column"
            }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontFamily: "'Orbitron', monospace", letterSpacing: 1, color: "#fff" }}>
                  MESSAGE CENTER
                </span>
                <button 
                  onClick={() => { clearAlerts(); setIsOpen(false); }}
                  style={{ background: "transparent", border: "1px solid rgba(255,59,59,0.3)", color: "#ff3b3b", fontSize: 9, padding: "4px 8px", cursor: "pointer", borderRadius: 2 }}
                >
                  CLEAR
                </button>
              </div>
              <div style={{ maxHeight: 350, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {alerts && alerts.length > 0 ? alerts.map((a, i) => {
                  const isAnalyst = a.type === "analyst";
                  return (
                    <div key={i} style={{ background: isAnalyst ? "rgba(0,212,255,0.05)" : "rgba(255,59,59,0.05)", borderLeft: `2px solid ${isAnalyst ? "#00d4ff" : "#ff3b3b"}`, padding: 12, fontSize: 10, color: "#e8eaf0", lineHeight: 1.5 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: isAnalyst ? "#00d4ff" : "#ff3b3b", fontWeight: "bold", fontSize: 9 }}>
                          {isAnalyst ? <MessageSquare size={11} /> : <ShieldAlert size={11} />}
                          {isAnalyst ? "ANALYST MESSAGE" : "ESCALATION THREAT LOG"}
                        </div>
                        {a.timestamp && <span style={{ fontSize: 8, color: "#3a4257" }}>{a.timestamp}</span>}
                      </div>
                      {a.msg}
                    </div>
                  );
                }) : (
                  <div style={{ padding: 30, textAlign: "center", color: "#5a6478", fontSize: 10 }}>NO ACTIVE MESSAGES</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Main Dashboard Content ───────────────────────────────────────────────────
function DashboardContent({ auth, stats, transactions, health, connected, latency, newIds, refresh }) {
  const [tab, setTab] = useState("live");
  const [simLoading, setSimLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);

  const handleSimToggle = async () => {
    if (!auth || auth.role !== "ADMIN" || !stats) return;
    setSimLoading(true);
    try {
      const wantActive = !stats.isSimulating;
      await api.toggleSimulation(auth.token, wantActive);
      await refresh();
    } catch (e) {
      console.error("Simulation Toggle Error:", e);
    } finally {
      setSimLoading(false);
    }
  };

  const handleScenarioOverride = async (type) => {
    if (!auth || auth.role !== "ADMIN") return;
    try {
      await api.setScenario(auth.token, type);
    } catch (e) {
      console.error("Scenario Override Error:", e);
    }
  };

  const filteredData = useMemo(() => {
    const base = tab === "fraud"
      ? transactions.filter(t => t.fraudFlag)
      : transactions.map((t) => {
          const rawRisk = Number(t?.riskScore);
          const safeRisk = Number.isFinite(rawRisk)
            ? Math.min(100, Math.max(0, rawRisk))
            : 0;
          return { ...t, riskScore: safeRisk };
        });
    return base.filter(t =>
      t.transactionId.toString().includes(searchQuery) ||
      t.senderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, tab, searchQuery]);

  const fraudCount = transactions.filter(t => t.fraudFlag).length;
  const fraudRate = stats ? parseFloat(stats.fraudRate).toFixed(1) : "0.0";

  return (
    <div style={contentStyles.root}>
      {/* KPI Row */}
      <div style={contentStyles.kpiGrid}>
        <StatCard icon={Database} label="TOTAL VOLUME" value={stats?.totalTransactions} accent="#00d4ff" />
        <StatCard icon={AlertTriangle} label="DETECTED FRAUD" value={stats?.fraudCount} accent="#ff3b3b" pulse={fraudCount > 0} />
        <StatCard icon={TrendingUp} label="RISK RATE" value={`${fraudRate}%`} accent="#ff9500" />
        <StatCard icon={Activity} label="SYSTEM STATUS" value={stats?.isSimulating ? "RUNNING" : "STANDBY"} accent={stats?.isSimulating ? "#34c759" : "#5a6478"} />
      </div>

      {/* Main Grid */}
      <div style={contentStyles.mainGrid}>
        {/* Left: Command Panel */}
        <div style={contentStyles.tacticalPanel}>
          <div>
            <div style={contentStyles.panelLabel}>COMMAND & CONTROL</div>
            <p style={contentStyles.panelDesc}>
              Interface for manual simulation overrides and neural network recalibration parameters.
            </p>
            <button
              onClick={handleSimToggle}
              disabled={simLoading || auth.role !== "ADMIN"}
              style={{
                ...contentStyles.simBtn,
                background: stats?.isSimulating ? "rgba(255,59,59,0.05)" : "rgba(52,199,89,0.05)",
                border: `1px solid ${stats?.isSimulating ? "#ff3b3b" : "#34c759"}`,
                color: stats?.isSimulating ? "#ff3b3b" : "#34c759",
              }}
            >
              {simLoading
                ? <RefreshCw size={14} className="animate-spin" />
                : stats?.isSimulating
                  ? <Square size={14} fill="currentColor" />
                  : <Play size={14} fill="currentColor" />}
              {stats?.isSimulating ? "TERMINATE SIM" : "INITIATE SIM"}
            </button>

            {/* Targeted Attack Overrides */}
            {stats?.isSimulating && (
              <div style={{ marginTop: 15, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button 
                  onClick={() => handleScenarioOverride("FRAUD")} 
                  style={{...contentStyles.overrideBtn, color: "#ff3b3b", border: "1px solid rgba(255,59,59,0.3)"}}>
                  WHALE THREAT
                </button>
                <button 
                  onClick={() => handleScenarioOverride("ATTACK")} 
                  style={{...contentStyles.overrideBtn, color: "#ff9500", border: "1px solid rgba(255,149,0,0.3)"}}>
                  VELOCITY
                </button>
                <button 
                  onClick={() => handleScenarioOverride("NORMAL")} 
                  style={{...contentStyles.overrideBtn, color: "#34c759", border: "1px solid rgba(52,199,89,0.3)"}}>
                  FORCE SAFE
                </button>
                <button 
                  onClick={() => handleScenarioOverride("RANDOM")} 
                  style={{...contentStyles.overrideBtn, color: "#00d4ff", border: "1px solid rgba(0,212,255,0.3)"}}>
                  RANDOMIZE
                </button>
              </div>
            )}
          </div>

          <div style={contentStyles.mlBox}>
            <div style={{ color: "#00d4ff", fontSize: 10, marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}>
              <Cpu size={12} /> NEURAL ENGINE
            </div>
            <div style={{ fontSize: 11, fontWeight: "bold" }}>XGB_CORE_V4.2.0</div>
            <div style={{ fontSize: 9, color: "#5a6478", marginTop: 4 }}>PRECISION: 98.4% | LATENCY: {latency}ms</div>
          </div>

          <div style={contentStyles.sessionFooter}>
            OPERATOR: {auth.username.toUpperCase()} // LVL_{auth.role}
          </div>
        </div>

        {/* Center: Geo Risk Map */}
        <RiskMap transactions={transactions} />

        {/* Right: Intelligence Stack */}
        <div style={{ display: "grid", gridTemplateRows: "1.2fr 1fr", gap: 16, minHeight: 0 }}>
          <div style={{ minHeight: 0, minWidth: 0 }}>
            <AttackVectorChart />
          </div>
          <div style={{ minHeight: 0, minWidth: 0 }}>
            <SystemHealth healthData={health} connected={connected} latency={latency} />
          </div>
        </div>
      </div>

      {/* Transaction Registry */}
      <div style={contentStyles.tableContainer}>
        <div style={contentStyles.tableHeader}>
          <div style={{ display: "flex" }}>
            <button onClick={() => setTab("live")} style={tabStyle(tab === "live", "#00d4ff")}>
              LIVE FEED <span style={contentStyles.badge}>{transactions.length}</span>
            </button>
            <button onClick={() => setTab("fraud")} style={tabStyle(tab === "fraud", "#ff3b3b")}>
              THREAT LOGS <span style={{ ...contentStyles.badge, background: "rgba(255,59,59,0.2)", color: "#ff3b3b" }}>{fraudCount}</span>
            </button>
          </div>
          <div style={contentStyles.searchBox}>
            <Search size={14} color="#3a4257" />
            <input
              type="text"
              placeholder="SEARCH TRANSACTIONS..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={contentStyles.searchInput}
            />
          </div>
        </div>

        <div style={contentStyles.gridHeader}>
          <div>ID</div>
          <div>Sender / Account</div>
          <div>Amount (₹)</div>
          <div>Risk</div>
          <div>Status</div>
          <div>Location</div>
        </div>

        <div style={contentStyles.scrollArea}>
          {filteredData.length > 0 ? (
            filteredData.map(tx => (
              <TransactionRow key={tx.transactionId} tx={tx} isNew={newIds.has(tx.transactionId)} onClick={setSelectedTx} />
            ))
          ) : (
            <div style={contentStyles.emptyState}>
              <Ghost size={32} color="#1a1e28" />
              <div style={{ marginTop: 10 }}>NO MATCHING RECORDS FOUND</div>
            </div>
          )}
        </div>
      </div>

      {selectedTx && <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}
    </div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────
export default function SentinelAI({ auth, onLogout }) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const { transactions, stats, health, connected, latency, newIds, refresh } = useSentinelData(auth);
  const [alerts, setAlerts] = useState([]);

  // Poll analyst messages every 10 seconds
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const msgs = await api.getMessages(auth.token);
        if (!msgs || msgs.length === 0) return;
        setAlerts(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const newMsgs = msgs
            .filter(m => !existingIds.has(`msg_${m.id}`))
            .map(m => ({
              id: `msg_${m.id}`,
              type: "analyst",
              msg: `[${m.from?.toUpperCase()}] ${m.content}`,
              timestamp: m.timestamp
            }));
          if (newMsgs.length === 0) return prev;
          return [...newMsgs, ...prev].slice(0, 50);
        });
      } catch (e) { /* Server may not have messages yet */ }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [auth.token]);

  useEffect(() => {
    if (newIds.size > 0 && transactions.length > 0) {
      const criticalTxs = transactions.filter(t => 
        newIds.has(t.transactionId) && t.fraudFlag && t.amount >= 10000 && Number(t.riskScore) >= 85
      );
      if (criticalTxs.length > 0) {
        const newAlerts = criticalTxs.map(t => ({
          id: t.transactionId,
          msg: `[CRITICAL ALERT] ₹${parseFloat(t.amount).toFixed(2)} Velocity Transfer on Account USR-${t.senderId}. Automated Incident Report dispatched via SMTP internal alert system.`
        }));
        
        // Push uniquely to persistent alert inbox (No auto clear!)
        setAlerts(prev => {
          const combined = [...newAlerts, ...prev];
          const unique = Array.from(new Map(combined.map(a => [a.id, a])).values());
          return unique.slice(0, 50); // Keep max 50 recent messages
        });
      }
    }
  }, [newIds, transactions]);

  return (
    <div style={rootStyles.shell}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} auth={auth} onLogout={onLogout} />

      <div style={rootStyles.main}>
        <TopBar activeNav={activeNav} connected={connected} latency={latency} alerts={alerts} clearAlerts={() => setAlerts([])}/>

        <div style={rootStyles.body}>
          {activeNav === "dashboard" ? (
            <DashboardContent
              auth={auth}
              stats={stats}
              transactions={transactions}
              health={health}
              connected={connected}
              latency={latency}
              newIds={newIds}
              refresh={refresh}
            />
          ) : activeNav === "analytics" ? (
            <AnalyticsView 
              transactions={transactions}
              stats={stats}
            />
          ) : activeNav === "transactions" ? (
            <TransactionsView 
              transactions={transactions}
            />
          ) : activeNav === "auditlogs" ? (
            <AuditLogsView 
              auth={auth}
            />
          ) : activeNav === "simulation" ? (
            <SimulationView 
              auth={auth}
              stats={stats}
              refresh={refresh}
            />
          ) : activeNav === "settings" ? (
            <SettingsView 
              auth={auth}
            />
          ) : activeNav === "mlinsights" ? (
            <MLInsightsView 
              transactions={transactions}
            />
          ) : (
            <div style={rootStyles.placeholder}>
              <ShieldAlert size={40} color="#1a1e28" />
              <div style={{ marginTop: 16, fontSize: 11, letterSpacing: 3, color: "#3a4257" }}>
                {NAV_ITEMS.find(n => n.id === activeNav)?.label?.toUpperCase()} MODULE — COMING ONLINE
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const rootStyles = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    background: "#050608",
    color: "#e8eaf0",
    fontFamily: "'Space Mono', monospace",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    overflow: "hidden",
  },
  body: {
    flex: 1,
    overflowY: "auto",
  },
  placeholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
  },
};

const sidebarStyles = {
  root: {
    width: 220,
    minWidth: 220,
    background: "#080a10",
    borderRight: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflow: "hidden",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "20px 20px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  brandIcon: {
    width: 32,
    height: 32,
    background: "rgba(255,59,59,0.08)",
    border: "1px solid rgba(255,59,59,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 3,
    color: "#e8eaf0",
  },
  nav: {
    flex: 1,
    padding: "16px 0",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    overflowY: "auto",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 20px",
    border: "none",
    borderLeft: "2px solid transparent",
    cursor: "pointer",
    fontSize: 11,
    letterSpacing: 1,
    transition: "all 0.2s",
    textAlign: "left",
    width: "100%",
    fontFamily: "'Space Mono', monospace",
  },
  navLabel: {
    fontSize: 11,
    letterSpacing: 1,
  },
  footer: {
    padding: "16px 20px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  userBlock: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  userAvatar: {
    width: 30,
    height: 30,
    background: "rgba(0,212,255,0.08)",
    border: "1px solid rgba(0,212,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#00d4ff",
    flexShrink: 0,
  },
  userName: {
    fontSize: 10,
    color: "#e8eaf0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userRole: { marginTop: 3 },
  roleBadge: {
    fontSize: 8,
    padding: "2px 6px",
    background: "rgba(0,212,255,0.1)",
    color: "#00d4ff",
    letterSpacing: 1,
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,59,59,0.05)",
    border: "1px solid rgba(255,59,59,0.2)",
    color: "#ff3b3b",
    fontSize: 10,
    padding: "8px 12px",
    cursor: "pointer",
    letterSpacing: 1,
    fontFamily: "'Space Mono', monospace",
    width: "100%",
    justifyContent: "center",
    transition: "all 0.2s",
  },
};

const topBarStyles = {
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    height: 64,
    background: "#080a10",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 2,
    color: "#e8eaf0",
  },
  subtitle: {
    fontSize: 10,
    color: "#5a6478",
    marginTop: 3,
    letterSpacing: 1,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  iconBtn: {
    position: "relative",
    background: "none",
    border: "none",
    color: "#5a6478",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  notifDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#ff3b3b",
  },
};

const contentStyles = {
  root: {
    padding: 24,
    maxWidth: 1600,
    margin: "0 auto",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 24,
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "300px 1fr 320px",
    gap: 16,
    marginBottom: 24,
    minHeight: 400,
  },
  tacticalPanel: {
    background: "linear-gradient(135deg, rgba(16,18,26,0.6) 0%, rgba(7,8,12,0.4) 100%)",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backdropFilter: "blur(12px)",
    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
  },
  panelLabel: {
    fontSize: 10,
    color: "#ff3b3b",
    letterSpacing: 2,
    marginBottom: 20,
    fontWeight: "bold",
    fontFamily: "'Orbitron', sans-serif",
  },
  panelDesc: {
    fontSize: 11,
    color: "#5a6478",
    lineHeight: 1.6,
    marginBottom: 24,
  },
  simBtn: {
    width: "100%",
    padding: 16,
    cursor: "pointer",
    fontFamily: "'Orbitron', monospace",
    fontSize: 11,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.2s",
  },
  overrideBtn: {
    background: "rgba(0,0,0,0.4)",
    padding: "8px 0",
    fontSize: 9,
    fontFamily: "'Space Mono', monospace",
    cursor: "pointer",
    borderRadius: 2,
    transition: "all 0.2s",
  },
  mlBox: {
    padding: 15,
    background: "rgba(0,212,255,0.02)",
    borderLeft: "2px solid #00d4ff",
    marginBottom: 20,
  },
  sessionFooter: {
    fontSize: 9,
    color: "#3a4257",
    textAlign: "center",
    borderTop: "1px solid rgba(255,255,255,0.03)",
    paddingTop: 15,
  },
  tableContainer: {
    background: "rgba(8,10,16,0.6)",
    border: "1px solid rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    paddingRight: 20,
  },
  gridHeader: {
    display: "grid",
    gridTemplateColumns: "80px 1.5fr 150px 120px 120px 1fr",
    gap: 16,
    padding: "16px 20px",
    background: "rgba(0,0,0,0.5)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    color: "#00d4ff",
    fontSize: 9,
    letterSpacing: 1,
    fontFamily: "'Orbitron', monospace",
  },
  badge: {
    fontSize: 8,
    padding: "2px 6px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    marginLeft: 8,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(0,0,0,0.3)",
    padding: "6px 15px",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.05)",
  },
  searchInput: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 10,
    outline: "none",
    width: 220,
    letterSpacing: 1,
    fontFamily: "'Space Mono', monospace",
  },
  scrollArea: {
    maxHeight: 400,
    overflowY: "auto",
    position: "relative",
  },
  emptyState: {
    padding: 60,
    textAlign: "center",
    color: "#1a1e28",
    fontSize: 10,
    letterSpacing: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

const tabStyle = (active, color) => ({
  padding: "16px 24px",
  background: "none",
  border: "none",
  borderBottom: `2px solid ${active ? color : "transparent"}`,
  color: active ? "#fff" : "#3a4257",
  fontSize: 10,
  cursor: "pointer",
  transition: "all 0.3s",
  letterSpacing: 1,
  fontWeight: active ? "bold" : "normal",
  fontFamily: "'Space Mono', monospace",
});
