import React from 'react';
import { Globe, MapPin, ShieldAlert } from 'lucide-react';

export default function RiskMap({ transactions = [] }) {
  // Aggregate data
  const locationStats = transactions.reduce((acc, tx) => {
    const loc = tx.location || "Unknown";
    if (!acc[loc]) acc[loc] = { count: 0, latestProb: 0, isThreat: false };
    if (tx.fraudFlag) {
      acc[loc].count += 1;
      acc[loc].latestProb = tx.mlProbability || 0.5;
      acc[loc].isThreat = true;
    }
    return acc;
  }, {});

  const activeThreats = Object.entries(locationStats)
    .filter(([_, data]) => data.isThreat)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4);

  // Hardcoded styles to fix the "Centering" issue
  const styles = {
    container: {
      background: "#020617",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px",
      padding: "20px",
      height: "100%",
      color: "white",
      fontFamily: "monospace",
      display: "flex",
      flexDirection: "column"
    },
    mapBox: {
      position: "relative",
      height: "250px",
      width: "100%",
      background: "#0f172a",
      borderRadius: "12px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "20px"
    },
    mapImage: {
      position: "absolute",
      inset: 0,
      opacity: 0.15,
      backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')",
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      filter: "invert(1) brightness(2) sepia(1) hue-rotate(180deg)"
    },
    card: {
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.05)",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <div>
          <div style={{ fontSize: "10px", color: "#3b82f6", letterSpacing: "3px" }}>GEOSPATIAL INTELLIGENCE</div>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>Node: GLOBAL_RELAY_01</div>
        </div>
        <Globe size={20} color="#3b82f6" />
      </div>

      <div style={styles.mapBox}>
        <div style={styles.mapImage} />
        <div style={{ zIndex: 2, textAlign: "center" }}>
          <div style={{ fontSize: "10px", color: "#64748b" }}>SCANNING NETWORK...</div>
          <div style={{ fontSize: "12px", color: "#3b82f6" }}>LATENCY: 14ms</div>
        </div>
        {/* Radar Ping Animation */}
        <div className="absolute w-32 h-32 border border-blue-500/20 rounded-full animate-ping" />
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeThreats.map(([city, data]) => (
          <div key={city} style={styles.card}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <MapPin size={16} color="#ef4444" />
              <div>
                <div style={{ fontSize: "12px", fontWeight: "bold" }}>{city.toUpperCase()}</div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>{data.count} Hits detected</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", color: "#f59e0b", fontWeight: "bold" }}>
                {(data.latestProb * 100).toFixed(0)}%
              </div>
              <div style={{ width: "50px", height: "3px", background: "#1e293b", borderRadius: "2px" }}>
                <div style={{ width: `${data.latestProb * 100}%`, height: "100%", background: "#ef4444" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}