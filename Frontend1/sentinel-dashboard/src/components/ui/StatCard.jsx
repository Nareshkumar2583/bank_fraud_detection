import React from "react";
import { riskColor } from "../../utils/formatters";

export default function StatCard({ icon: Icon, label, value, sub, accent, pulse }) {
  return (
    <div style={{
      background: "rgba(10,12,18,0.9)",
      border: `1px solid ${accent}33`,
      borderRadius: 2,
      padding: "20px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
      }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#5a6478", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
            {label}
          </div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 32, fontWeight: 700, color: accent, lineHeight: 1 }}>
            {value ?? "—"}
          </div>
          {sub && (
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#5a6478", marginTop: 6 }}>
              {sub}
            </div>
          )}
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          {pulse && (
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: `1px solid ${accent}`,
              animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
            }} />
          )}
          <Icon size={18} color={accent} />
        </div>
      </div>
    </div>
  );
}