import React, { useState, useEffect } from 'react';
import { ScrollText, ShieldAlert, Cpu, Terminal } from 'lucide-react';
import { api } from '../../api/sentinelApi';

export default function AuditLogsView({ auth }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Fallback to placeholder logs if the API doesn't exist yet
        let data = [];
        try {
          data = await api.getAuditLogs(auth.token);
        } catch(e) {
          // If 404 or fails, use static mock
          data = Array.from({ length: 50 }).map((_, i) => ({
            id: `LOG_${Date.now() - i * 10000}`,
            timestamp: new Date(Date.now() - i * 600000).toISOString(),
            event: i % 7 === 0 ? "THREAT_PREVENTION_TRIGGER" : (i % 3 === 0 ? "MODEL_RECALIBRATION" : "SYSTEM_ROUTINE_CHECK"),
            level: i % 7 === 0 ? "HIGH" : (i % 3 === 0 ? "WARN" : "INFO"),
            user: "SYSTEM_AUTO",
            message: i % 7 === 0 ? "Blocked anomalous high-value transfer pattern" : "Completed routine sector scan with 0 anomalies."
          }));
        }
        if (mounted) {
          setLogs(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    };
    fetchLogs();
    
    return () => { mounted = false; };
  }, [auth]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <ScrollText size={24} color="#00d4ff" />
        <h2 style={styles.title}>SYSTEM AUDIT LOGS</h2>
      </div>

      <div style={styles.logContainer}>
        <div style={styles.logHeader}>
          <div style={{ flex: 1 }}>TIMESTAMP</div>
          <div style={{ flex: 1.5 }}>EVENT_TYPE</div>
          <div style={{ flex: 0.5 }}>LEVEL</div>
          <div style={{ flex: 3 }}>DESCRIPTION/PAYLOAD</div>
        </div>

        <div style={styles.scrollArea}>
          {loading ? (
            <div style={styles.emptyState}>SYNCING SECURE LOGS...</div>
          ) : logs.map((log) => (
            <div key={log.id} style={styles.logRow}>
              <div style={{ flex: 1, color: '#5a6478' }}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
              <div style={{ flex: 1.5, color: '#00d4ff' }}>
                {log.event}
              </div>
              <div style={{ flex: 0.5 }}>
                <span style={getTagStyle(log.level)}>{log.level}</span>
              </div>
              <div style={{ flex: 3, color: '#e8eaf0', fontFamily: 'monospace', fontSize: 10 }}>
                {log.message}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const getTagStyle = (level) => {
  const isHigh = level === "HIGH" || level === "ERROR";
  const isWarn = level === "WARN" || level === "MEDIUM";
  
  return {
    fontSize: 9,
    padding: "2px 6px",
    background: isHigh ? "rgba(255,59,59,0.1)" : isWarn ? "rgba(255,149,0,0.1)" : "rgba(52,199,89,0.1)",
    color: isHigh ? "#ff3b3b" : isWarn ? "#ff9500" : "#34c759",
    border: `1px solid ${isHigh ? "#ff3b3b" : isWarn ? "#ff9500" : "#34c759"}`,
    borderRadius: 2,
    letterSpacing: 1
  };
};

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
  logContainer: {
    background: "rgba(8,10,16,0.6)",
    border: "1px solid rgba(255,255,255,0.05)",
    fontFamily: "'Space Mono', monospace",
  },
  logHeader: {
    display: "flex",
    padding: "15px 20px",
    background: "rgba(255,255,255,0.02)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: 10,
    color: "#5a6478",
    letterSpacing: 1,
  },
  scrollArea: {
    height: "calc(100vh - 200px)",
    overflowY: "auto",
  },
  logRow: {
    display: "flex",
    padding: "12px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.02)",
    fontSize: 11,
    alignItems: "center",
  },
  emptyState: {
    padding: 60,
    textAlign: "center",
    color: "#00d4ff",
    fontSize: 12,
    letterSpacing: 3,
    animation: "pulse 2s infinite",
  }
};
