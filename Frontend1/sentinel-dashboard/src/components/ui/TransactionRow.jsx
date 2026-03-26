import React, { useState, useEffect } from "react";

export default function TransactionRow({ tx, isNew, onClick }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Smooth entry animation
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const isThreat = tx.fraudFlag || tx.riskScore > 80;
  const statusColor = isThreat ? "#ff3b3b" : "#5a6478";
  const statusLabel = isThreat ? "THREAT" : "SAFE";

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick && onClick(tx)}
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1.5fr 150px 120px 120px 1fr",
        gap: 16, 
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.02)",
        background: hovered ? "rgba(255,255,255,0.03)" : "transparent",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-10px)",
        position: "relative",
      }}
    >
      {/* 1. ID */}
      <div style={{ color: "#00d4ff", fontSize: 11, fontFamily: "'Space Mono', monospace" }}>
        {tx.transactionId}
      </div>

      {/* 2. Sender / Account */}
      <div style={{ color: "#e8eaf0", fontSize: 11 }}>
        {tx.senderId}
      </div>

      {/* 3. Amount (₹) */}
      <div style={{ color: "#e8eaf0", fontWeight: 700, fontSize: 12 }}>
        ₹{parseFloat(tx.amount).toFixed(2)}
      </div>

      {/* 4. Risk */}
      <div style={{ color: "#8892a4", fontSize: 11 }}>
        {tx.riskScore}%
      </div>

      {/* 5. Status */}
      <div style={{ color: statusColor, fontSize: 11, fontWeight: 700 }}>
        {statusLabel}
      </div>

      {/* 6. Location */}
      <div style={{ color: "#8892a4", fontSize: 11 }}>
        {tx.location}
      </div>

      {/* New Entry Glow Effect */}
      {isNew && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 2,
          background: statusColor, boxShadow: `0 0 10px ${statusColor}`
        }} />
      )}
    </div>
  );
}