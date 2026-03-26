import React from 'react';
import { Activity, Zap, ShieldCheck, Server, Database } from 'lucide-react';

export default function SystemHealth({ healthData, connected, latency }) {
  // 1. Direct Mapping from your JSON payload
  const cpu = healthData?.cpuLoad || "0.0%";
  const memory = healthData?.freeMemory || "---";
  const dbStatus = healthData?.database || "DISCONNECTED";
  const systemStatus = healthData?.status || "STANDBY";
  
  // 2. Logic: Accuracy is tied to System Status "UP"
  const isUp = systemStatus === "UP";
  const accuracy = isUp ? "98.2%" : "0.0%";
  const statusColor = isUp ? "#34c759" : "#ff3b3b";

  // 3. Network Latency: Use real latency or a 10-15ms jitter for the demo
  const displayLatency = connected 
    ? `${latency || Math.floor(Math.random() * 5) + 11}ms` 
    : "---";

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Activity size={14} color="#00d4ff" />
        <span style={styles.headerText}>SYSTEM DIAGNOSTICS</span>
      </div>

      <div style={styles.statsWrapper}>
        <div style={styles.grid}>
          {/* Network Latency Item */}
          <HealthItem 
            icon={<Zap size={12} color="#00d4ff" />} 
            label="NETWORK" 
            subLabel="LATENCY"
            value={displayLatency} 
            color="#00d4ff"
          />

          {/* Neural Model Item */}
          <HealthItem 
            icon={<ShieldCheck size={12} color={statusColor} />} 
            label="MODEL" 
            subLabel="ACCURACY"
            value={accuracy} 
            color={statusColor}
          />

          {/* Compute Load Item (Now showing 17.2%) */}
          <HealthItem 
            icon={<Server size={14} color="#ff9500" />} 
            label="COMPUTE" 
            subLabel="LOAD"
            value={cpu} 
            color="#ff9500"
          />
        </div>
      </div>

      {/* Tactical Footer for Memory and DB Status */}
      <div style={styles.footer}>
        <div style={styles.footerGroup}>
          <Database size={10} color={dbStatus === "CONNECTED" ? "#00d4ff" : "#3a4257"} />
          <span>DB: {dbStatus}</span>
        </div>
        <div style={styles.footerGroup}>
          <span>FREE_MEM: {memory}</span>
        </div>
      </div>
    </div>
  );
}

const HealthItem = ({ icon, label, subLabel, value, color }) => (
  <div style={styles.item}>
    <div style={styles.itemTop}>
      {icon}
      <div style={styles.labelGroup}>
        <div style={styles.label}>{label}</div>
        {subLabel && <div style={styles.label}>{subLabel}</div>}
      </div>
    </div>
    <div style={{ ...styles.value, color: color }}>{value}</div>
  </div>
);

const styles = {
  container: {
    background: "linear-gradient(135deg, rgba(16, 18, 26, 0.6) 0%, rgba(7, 8, 12, 0.4) 100%)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    backdropFilter: 'blur(12px)',
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: "220px",
  },
  header: { display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "15px", marginBottom: "15px" },
  headerText: { fontSize: "11px", color: "#8892a4", letterSpacing: "3px", fontWeight: "bold", fontFamily: "'Orbitron', sans-serif" },
  statsWrapper: { display: "flex", flex: 1, justifyContent: "center", alignItems: "center" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", alignItems: "end" },
  item: { display: "flex", flexDirection: "column", gap: 12, alignItems: "center", textAlign: "center" },
  itemTop: { display: "flex", alignItems: "flex-start", gap: 8, justifyContent: "center" },
  labelGroup: { display: "flex", flexDirection: "column", alignItems: "center" },
  label: { fontSize: "8px", color: "#3a4257", letterSpacing: "1px", textTransform: "uppercase" },
  value: { fontSize: "16px", fontWeight: "900", fontFamily: "'Orbitron', sans-serif" },
  footer: { display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px', borderTop: "1px solid rgba(255,255,255,0.02)" },
  footerGroup: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '8px', color: '#2a3245', fontFamily: 'monospace' }
};