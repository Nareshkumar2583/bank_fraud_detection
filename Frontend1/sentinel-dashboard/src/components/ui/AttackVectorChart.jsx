import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';

const mockData = [
  { subject: 'Velocity', A: 80, fullMark: 100 },
  { subject: 'Location', A: 45, fullMark: 100 },
  { subject: 'Proxy/VPN', A: 90, fullMark: 100 },
  { subject: 'Device ID', A: 65, fullMark: 100 },
  { subject: 'Behavior', A: 30, fullMark: 100 },
];

export default function AttackVectorChart() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Target size={14} color="#00d4ff" />
        <span style={styles.headerText}>ATTACK VECTOR COMPOSITION</span>
      </div>
      
      <div style={{ width: '100%', height: 220, marginTop: 10 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockData}>
            <PolarGrid stroke="rgba(255,255,255,0.05)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#5a6478', fontSize: 9, fontFamily: 'Space Mono' }} 
            />
            <Radar
              name="Threats"
              dataKey="A"
              stroke="#00d4ff"
              fill="#00d4ff"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.footer}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.dot, background: '#00d4ff' }} />
          <span>CURRENT THREAT PROFILE: HIGH PROXY SKEW</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "rgba(10, 12, 18, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backdropFilter: "blur(10px)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    paddingBottom: "12px",
  },
  headerText: {
    fontSize: "10px",
    color: "#8892a4",
    letterSpacing: "2px",
    fontWeight: "bold",
    fontFamily: "'Orbitron', sans-serif"
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 10,
    borderTop: "1px solid rgba(255,255,255,0.03)",
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '8px',
    color: '#3a4257',
    letterSpacing: '1px'
  },
  dot: { width: 6, height: 6, borderRadius: '50%' }
};