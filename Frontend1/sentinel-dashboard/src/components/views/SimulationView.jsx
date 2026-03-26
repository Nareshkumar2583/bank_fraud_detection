import React, { useState } from 'react';
import { Zap, Play, Square, RefreshCw, Cpu, Database, Activity } from 'lucide-react';
import { api } from '../../api/sentinelApi';

export default function SimulationView({ auth, stats, refresh }) {
  const [simLoading, setSimLoading] = useState(false);

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

  const isSimulating = stats?.isSimulating;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Zap size={24} color="#e0b122" />
        <h2 style={styles.title}>SIMULATION ENVIRONMENT</h2>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Cpu size={16} /> DATA GENERATOR ENGINE
          </div>
          <p style={{ fontSize: 12, color: '#5a6478', lineHeight: 1.6, marginBottom: 24 }}>
            The simulation engine generates synthetic transactional data at a high frequency to stress-test the ML detection algorithms. 
            When active, it injects random anomalies simulating varying threat landscapes.
          </p>

          <button
            onClick={handleSimToggle}
            disabled={simLoading || auth.role !== "ADMIN"}
            style={{
              ...styles.simBtn,
              background: isSimulating ? "rgba(255,59,59,0.05)" : "rgba(52,199,89,0.05)",
              border: `1px solid ${isSimulating ? "#ff3b3b" : "#34c759"}`,
              color: isSimulating ? "#ff3b3b" : "#34c759",
              opacity: auth.role === "ADMIN" ? 1 : 0.5,
              cursor: auth.role === "ADMIN" ? "pointer" : "not-allowed"
            }}
          >
            {simLoading
              ? <RefreshCw size={14} className="animate-spin" />
              : isSimulating
                ? <Square size={14} fill="currentColor" />
                : <Play size={14} fill="currentColor" />}
            {isSimulating ? "TERMINATE SIMULATION SEQUENCE" : "INITIATE SIMULATION SEQUENCE"}
          </button>

          {auth.role !== "ADMIN" && (
            <div style={{ color: '#ff3b3b', fontSize: 10, marginTop: 10, textAlign: 'center' }}>
              ACCESS DENIED: ADMIN PRIVILEGES REQUIRED
            </div>
          )}
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Activity size={16} /> SIMULATION METRICS
          </div>
          
          <div style={styles.metricsGrid}>
            <div style={styles.metricBox}>
              <div style={styles.metricLabel}>STATUS</div>
              <div style={{...styles.metricValue, color: isSimulating ? '#34c759' : '#5a6478'}}>
                {isSimulating ? "GENERATING" : "IDLE"}
              </div>
            </div>
            <div style={styles.metricBox}>
              <div style={styles.metricLabel}>THROUGHPUT</div>
              <div style={{...styles.metricValue, color: '#00d4ff'}}>
                {isSimulating ? "~25 TX/s" : "0 TX/s"}
              </div>
            </div>
            <div style={styles.metricBox}>
              <div style={styles.metricLabel}>ANOMALY INJECTION RATE</div>
              <div style={{...styles.metricValue, color: '#ff9500'}}>
                {isSimulating ? "5.0%" : "0.0%"}
              </div>
            </div>
            <div style={styles.metricBox}>
              <div style={styles.metricLabel}>SYNTHETIC PROFILES</div>
              <div style={{...styles.metricValue, color: '#e8eaf0'}}>
                1,500
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 24, maxWidth: 1600, margin: "0 auto" },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginBottom: 24,
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    paddingBottom: 15,
  },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 18,
    color: "#e8eaf0",
    letterSpacing: 2,
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
  },
  card: {
    background: "rgba(8,10,16,0.6)",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: 30,
    borderRadius: 4,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "'Orbitron', monospace",
    color: "#00d4ff",
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1px solid rgba(255,255,255,0.05)"
  },
  simBtn: {
    width: "100%",
    padding: 16,
    fontFamily: "'Orbitron', monospace",
    fontSize: 12,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.2s",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  metricBox: {
    padding: 16,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  metricLabel: {
    fontSize: 10,
    color: "#5a6478",
    marginBottom: 8,
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 18,
    fontFamily: "'Orbitron', monospace",
    fontWeight: "bold",
  }
};
